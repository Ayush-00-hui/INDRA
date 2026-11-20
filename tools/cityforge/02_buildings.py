"""
Project INDRA — CityForge: Script 02 (Building Data Collector).
Collects building footprint polygons, levels, roof shapes, and measured heights.
Strictly preserves unmapped heights as null, avoiding fabricated vertical dimensions.
Computes metric footprint area using projected UTM Zone 43N.
"""

import os
import sys
import json
import argparse
from typing import Dict, Any, List, Optional
from shapely.geometry import Polygon, shape
import pyproj

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, "..", ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from tools.cityforge.osm_client import (
    load_config,
    resolve_output_dir,
    get_transformers,
    execute_overpass_query,
    build_node_dict,
    logger
)


def collect_buildings(config_path: Optional[str] = None, use_cache: bool = True) -> Dict[str, Any]:
    """Collect building footprints and export GeoJSON + report."""
    cfg = load_config(config_path)
    out_dir = resolve_output_dir(cfg, PROJECT_ROOT)
    raw_dir = os.path.join(out_dir, "raw")
    proc_dir = os.path.join(out_dir, "processed")
    rep_dir = os.path.join(out_dir, "reports")
    os.makedirs(proc_dir, exist_ok=True)
    os.makedirs(rep_dir, exist_ok=True)

    # 1. Load target boundary
    boundary_file = os.path.join(out_dir, "boundary.geojson")
    if not os.path.exists(boundary_file):
        boundary_file = os.path.join(out_dir, "boundary", "boundary.geojson")
    if not os.path.exists(boundary_file):
        boundary_file = os.path.join(out_dir, "metadata", "boundary.geojson")
    if not os.path.exists(boundary_file):
        fallback_bnd = os.path.join(PROJECT_ROOT, "data", "cityforge", cfg.get("dataset_id", "delhi_cp_v1"), "boundary.geojson")
        if os.path.exists(fallback_bnd):
            boundary_file = fallback_bnd
        else:
            raise FileNotFoundError(f"Boundary file not found in {out_dir}. Run 00_define_area.py first.")

    with open(boundary_file, "r", encoding="utf-8") as f:
        boundary_geojson = json.load(f)
    boundary_feat = boundary_geojson["features"][0]
    boundary_geom = shape(boundary_feat["geometry"])
    bbox = boundary_feat["properties"]["wgs84_bbox"] # [south, west, north, east]
    south, west, north, east = bbox

    # 2. Overpass query for building ways and multipolygon relations
    query = f"""
    [out:json][timeout:35];
    (
      way["building"]({south},{west},{north},{east});
      relation["building"]({south},{west},{north},{east});
    );
    (._; >;);
    out body;
    """

    cache_file = os.path.join(raw_dir, "buildings_overpass.json")
    if not os.path.exists(cache_file) and os.path.exists(os.path.join(out_dir, "osm", "buildings_overpass.json")):
        cache_file = os.path.join(out_dir, "osm", "buildings_overpass.json")
    data = execute_overpass_query(query, cache_path=cache_file, config=cfg, use_cache=use_cache)
    elements = data.get("elements", [])

    nodes = build_node_dict(elements)
    to_proj, _ = get_transformers(cfg.get("geographic_crs", "EPSG:4326"), cfg.get("projected_crs", "EPSG:32643"))

    features: List[Dict[str, Any]] = []
    seen_ids = set()
    total_footprint_area_m2 = 0.0
    missing_height_count = 0
    missing_levels_count = 0
    missing_name_count = 0
    invalid_geoms = 0

    for elem in elements:
        elem_type = elem.get("type")
        elem_id = elem.get("id")
        if elem_type != "way":
            continue

        if elem_id in seen_ids:
            continue
        seen_ids.add(elem_id)

        way_nodes = elem.get("nodes", [])
        if len(way_nodes) < 3:
            continue

        coords_wgs84 = []
        for nid in way_nodes:
            if nid in nodes:
                coords_wgs84.append(nodes[nid])

        if len(coords_wgs84) < 3:
            continue

        # Close polygon if not closed
        if coords_wgs84[0] != coords_wgs84[-1]:
            coords_wgs84.append(coords_wgs84[0])

        poly_geom = Polygon(coords_wgs84)
        if not poly_geom.is_valid:
            poly_geom = poly_geom.buffer(0)
            if not poly_geom.is_valid or poly_geom.is_empty:
                invalid_geoms += 1
                continue

        # Check intersection with 250m x 250m target boundary
        if not boundary_geom.intersects(poly_geom):
            continue

        clipped_geom = poly_geom.intersection(boundary_geom)
        if clipped_geom.is_empty:
            continue

        # Compute metric footprint area in UTM Zone 43N
        # Handle Polygon and MultiPolygon
        if clipped_geom.geom_type == "Polygon":
            metric_coords = [to_proj.transform(pt[0], pt[1]) for pt in clipped_geom.exterior.coords]
            metric_poly = Polygon(metric_coords)
            footprint_m2 = round(metric_poly.area, 2)
        elif clipped_geom.geom_type == "MultiPolygon":
            footprint_m2 = sum(
                round(Polygon([to_proj.transform(pt[0], pt[1]) for pt in p.exterior.coords]).area, 2)
                for p in clipped_geom.geoms
            )
        else:
            continue

        total_footprint_area_m2 += footprint_m2
        tags = elem.get("tags", {})

        # Extract attributes
        bldg_name = tags.get("name")
        if bldg_name is None:
            missing_name_count += 1

        bldg_type = tags.get("building", "yes")

        # Parse measured height
        height_raw = tags.get("height")
        height_m = None
        if height_raw:
            try:
                height_m = float(height_raw.replace("m", "").strip())
            except ValueError:
                height_m = None
        if height_m is None:
            missing_height_count += 1

        # Parse levels
        levels_raw = tags.get("building:levels")
        levels = int(levels_raw) if levels_raw and levels_raw.isdigit() else None
        if levels is None:
            missing_levels_count += 1

        roof_shape = tags.get("roof:shape")

        # Formulate GeoJSON coordinates
        if clipped_geom.geom_type == "Polygon":
            coords_out = [[[round(pt[0], 7), round(pt[1], 7)] for pt in clipped_geom.exterior.coords]]
            geom_type_out = "Polygon"
        else:
            coords_out = [[[[round(pt[0], 7), round(pt[1], 7)] for pt in p.exterior.coords]] for p in clipped_geom.geoms]
            geom_type_out = "MultiPolygon"

        feature = {
            "type": "Feature",
            "geometry": {
                "type": geom_type_out,
                "coordinates": coords_out
            },
            "properties": {
                "building_id": f"osm_bldg_{elem['id']}",
                "osm_id": elem["id"],
                "name": bldg_name,
                "building_type": bldg_type,
                "height_m": height_m,
                "height_source": "OpenStreetMap_Measured" if height_m is not None else None,
                "levels": levels,
                "roof_shape": roof_shape,
                "footprint_area_m2": footprint_m2,
                "source": "OpenStreetMap",
                "raw_tags": tags
            }
        }
        features.append(feature)

    total_buildings = len(features)
    missing_height_pct = round((missing_height_count / max(1, total_buildings)) * 100.0, 1)
    missing_levels_pct = round((missing_levels_count / max(1, total_buildings)) * 100.0, 1)
    missing_name_pct = round((missing_name_count / max(1, total_buildings)) * 100.0, 1)

    geojson_out = {
        "type": "FeatureCollection",
        "name": "INDRA_CityForge_Buildings",
        "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
        "features": features
    }

    buildings_file = os.path.join(proc_dir, "buildings.geojson")
    with open(buildings_file, "w", encoding="utf-8") as f:
        json.dump(geojson_out, f, indent=2)

    summary = {
        "dataset_id": cfg.get("dataset_id", "delhi_cp_v1"),
        "stage": "buildings",
        "source": "OpenStreetMap",
        "target_area": cfg.get("area_name", "Connaught_Place_Pilot"),
        "total_buildings": total_buildings,
        "total_footprint_area_m2": round(total_footprint_area_m2, 2),
        "attribute_completeness": {
            "missing_height_pct": missing_height_pct,
            "missing_levels_pct": missing_levels_pct,
            "missing_name_pct": missing_name_pct
        },
        "geometry_validation": {
            "invalid_geometries_repaired_or_dropped": invalid_geoms,
            "all_features_valid": True
        },
        "output_file": buildings_file
    }

    report_file = os.path.join(rep_dir, "buildings_summary.json")
    with open(report_file, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    print("\n" + "=" * 65)
    print(" [02_buildings] BUILDING FOOTPRINT DATA COLLECTED")
    print("=" * 65)
    print(f" Total Buildings:         {total_buildings}")
    print(f" Total Footprint Area:    {total_footprint_area_m2:.1f} m²")
    print(f" Missing Height Rate:     {missing_height_pct}% (preserved as null)")
    print(f" Missing Levels Rate:     {missing_levels_pct}% (preserved as null)")
    print(f" Missing Name Rate:       {missing_name_pct}%")
    print(f" Saved GeoJSON:           {buildings_file}")
    print(f" Saved Summary:           {report_file}")
    print("=" * 65 + "\n")

    return summary


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Script 02: Collect OpenStreetMap building footprints.")
    parser.add_argument("--config", default=None, help="Path to config.yaml")
    parser.add_argument("--no-cache", action="store_true", help="Force refresh without using local cache")
    args = parser.parse_args()
    collect_buildings(args.config, use_cache=not args.no_cache)

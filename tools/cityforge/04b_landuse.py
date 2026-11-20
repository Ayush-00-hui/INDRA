"""
Project INDRA — CityForge: Script 04b (Land-Use & Green Area Collector).
Collects park polygons, grass areas, commercial zones, retail plazas, and amenities:
  - leisure=park, garden, pitch, playground
  - landuse=grass, commercial, retail, recreation_ground, plaza
  - natural=wood, scrub, tree_row, grassland
  - amenity=parking
Clips geometries to the exact metric pilot boundary in EPSG:32643 and exports
processed/landuse.geojson with surface area (m²) and null-preserved attributes.
"""

import os
import sys
import json
import argparse
from typing import Dict, Any, List, Optional
from shapely.geometry import Polygon, MultiPolygon, shape
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


def categorize_landuse(tags: Dict[str, str]) -> str:
    """Classify OSM tags into standardized urban landuse category."""
    if tags.get("leisure") in ("park", "garden", "pitch", "playground"):
        return tags.get("leisure")
    if tags.get("landuse"):
        return tags.get("landuse")
    if tags.get("natural"):
        return f"greenery_{tags.get('natural')}"
    if tags.get("amenity") == "parking":
        return "parking"
    return "urban_open_space"


def collect_landuse(config_path: Optional[str] = None, use_cache: bool = True) -> Dict[str, Any]:
    """Collect landuse and green area polygons, export GeoJSON + report."""
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

    # 2. Overpass query for landuse, parks, and natural green spaces
    query = f"""
    [out:json][timeout:35];
    (
      way["leisure"~"park|garden|pitch|playground"]({south},{west},{north},{east});
      relation["leisure"~"park|garden|pitch|playground"]({south},{west},{north},{east});
      way["landuse"~"grass|commercial|retail|recreation_ground|greenfield|plaza"]({south},{west},{north},{east});
      relation["landuse"~"grass|commercial|retail|recreation_ground|greenfield|plaza"]({south},{west},{north},{east});
      way["natural"~"wood|scrub|tree_row|grassland"]({south},{west},{north},{east});
      way["amenity"~"parking"]({south},{west},{north},{east});
    );
    (._; >;);
    out body;
    """

    cache_file = os.path.join(raw_dir, "landuse_overpass.json")
    if not os.path.exists(cache_file) and os.path.exists(os.path.join(out_dir, "osm", "landuse_overpass.json")):
        cache_file = os.path.join(out_dir, "osm", "landuse_overpass.json")

    data = execute_overpass_query(query, cache_path=cache_file, config=cfg, use_cache=use_cache)
    elements = data.get("elements", [])

    nodes = build_node_dict(elements)
    to_proj, to_wgs84 = get_transformers(cfg.get("geographic_crs", "EPSG:4326"), cfg.get("projected_crs", "EPSG:32643"))

    features: List[Dict[str, Any]] = []
    seen_ids = set()
    total_area_m2 = 0.0
    category_counts: Dict[str, int] = {}

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

        # Close polygon if open
        if coords_wgs84[0] != coords_wgs84[-1]:
            coords_wgs84.append(coords_wgs84[0])

        poly_geom = Polygon(coords_wgs84)
        if not poly_geom.is_valid:
            poly_geom = poly_geom.buffer(0)
            if not poly_geom.is_valid or poly_geom.is_empty:
                continue

        if not boundary_geom.intersects(poly_geom):
            continue

        clipped_geom = poly_geom.intersection(boundary_geom)
        if clipped_geom.is_empty:
            continue

        # Metric area calculation
        def get_proj_poly(geom):
            if isinstance(geom, Polygon):
                proj_ext = [to_proj.transform(x, y) for x, y in geom.exterior.coords]
                return Polygon(proj_ext)
            elif isinstance(geom, MultiPolygon):
                proj_polys = []
                for p in geom.geoms:
                    p_ext = [to_proj.transform(x, y) for x, y in p.exterior.coords]
                    proj_polys.append(Polygon(p_ext))
                return MultiPolygon(proj_polys)
            return None

        proj_geom = get_proj_poly(clipped_geom)
        poly_area = proj_geom.area if proj_geom else 0.0
        total_area_m2 += poly_area

        tags = elem.get("tags", {})
        category = categorize_landuse(tags)
        category_counts[category] = category_counts.get(category, 0) + 1

        # Format GeoJSON geometry coordinates
        if isinstance(clipped_geom, Polygon):
            coords_out = [[[round(pt[0], 7), round(pt[1], 7)] for pt in clipped_geom.exterior.coords]]
            geom_type = "Polygon"
        elif isinstance(clipped_geom, MultiPolygon):
            coords_out = [[[[round(pt[0], 7), round(pt[1], 7)] for pt in p.exterior.coords]] for p in clipped_geom.geoms]
            geom_type = "MultiPolygon"
        else:
            continue

        feature = {
            "type": "Feature",
            "geometry": {
                "type": geom_type,
                "coordinates": coords_out
            },
            "properties": {
                "landuse_id": f"osm_way_{elem_id}",
                "osm_id": elem_id,
                "category": category,
                "name": tags.get("name"),
                "leisure": tags.get("leisure"),
                "landuse": tags.get("landuse"),
                "natural": tags.get("natural"),
                "amenity": tags.get("amenity"),
                "surface": tags.get("surface"),
                "area_m2": round(poly_area, 2),
                "source": "OpenStreetMap",
                "osm_license": "ODbL 1.0 (OpenStreetMap Contributors)"
            }
        }
        features.append(feature)

    geojson_out = {
        "type": "FeatureCollection",
        "name": "INDRA_CityForge_Landuse",
        "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
        "features": features
    }

    landuse_file = os.path.join(proc_dir, "landuse.geojson")
    with open(landuse_file, "w", encoding="utf-8") as f:
        json.dump(geojson_out, f, indent=2)

    summary = {
        "dataset_id": cfg.get("dataset_id", "delhi_cp_v1"),
        "stage": "landuse",
        "source": "OpenStreetMap",
        "target_area": cfg.get("area_name", "Connaught_Place_Pilot"),
        "total_landuse_features": len(features),
        "total_landuse_area_m2": round(total_area_m2, 2),
        "categories": category_counts,
        "output_file": landuse_file
    }

    report_file = os.path.join(rep_dir, "landuse_summary.json")
    with open(report_file, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    print("\n" + "=" * 65)
    print(" [04b_landuse] LAND-USE & GREEN AREA DATA COLLECTED")
    print("=" * 65)
    print(f" Total Land-Use Features: {len(features)}")
    print(f" Total Mapped Area:       {total_area_m2:.1f} m²")
    print(f" Categories Breakdown:    {category_counts}")
    print(f" Output GeoJSON:          {landuse_file}")
    print("=" * 65 + "\n")

    return summary


def main():
    parser = argparse.ArgumentParser(description="Collect land-use & green area polygons for INDRA CityForge.")
    parser.add_argument("--config", default=None, help="Path to config.yaml")
    parser.add_argument("--no-cache", action="store_true", help="Bypass local cache")
    args = parser.parse_args()
    collect_landuse(args.config, use_cache=not args.no_cache)


if __name__ == "__main__":
    main()

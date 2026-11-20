"""
Project INDRA — CityForge: Script 01 (Road Network Collector).
Downloads and structures all drivable and service road segments within the target boundary,
extracting lanes, one-way flags, surface types, speed limits, and metric lengths.
Preserves unmapped attributes as null and computes completeness reports.
"""

import os
import sys
import json
import argparse
from typing import Dict, Any, List, Optional
from shapely.geometry import LineString, Polygon, shape
import pyproj

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, "..", ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from tools.cityforge.osm_client import (
    load_config,
    get_transformers,
    execute_overpass_query,
    build_node_dict,
    logger
)


def collect_roads(config_path: Optional[str] = None, use_cache: bool = True) -> Dict[str, Any]:
    """Collect road network features and export GeoJSON + report."""
    cfg = load_config(config_path)
    out_dir = os.path.join(PROJECT_ROOT, cfg.get("output_directory", "data/cityforge/delhi_cp_v1"))
    raw_dir = os.path.join(out_dir, "raw")
    proc_dir = os.path.join(out_dir, "processed")
    rep_dir = os.path.join(out_dir, "reports")
    os.makedirs(proc_dir, exist_ok=True)
    os.makedirs(rep_dir, exist_ok=True)

    # 1. Load target boundary
    boundary_file = os.path.join(out_dir, "boundary.geojson")
    if not os.path.exists(boundary_file):
        raise FileNotFoundError(f"Boundary file not found: {boundary_file}. Run 00_define_area.py first.")

    with open(boundary_file, "r", encoding="utf-8") as f:
        boundary_geojson = json.load(f)
    boundary_feat = boundary_geojson["features"][0]
    boundary_geom = shape(boundary_feat["geometry"])
    bbox = boundary_feat["properties"]["wgs84_bbox"] # [south, west, north, east]
    south, west, north, east = bbox

    # 2. Build Overpass Query for Drivable Roads (excluding dedicated walkways/footways)
    query = f"""
    [out:json][timeout:35];
    (
      way["highway"]["highway"!~"footway|pedestrian|path|steps|corridor|bridleway|cycleway|platform"]
        ({south},{west},{north},{east});
    );
    (._; >;);
    out body;
    """

    cache_file = os.path.join(raw_dir, "roads_overpass.json")
    data = execute_overpass_query(query, cache_path=cache_file, config=cfg, use_cache=use_cache)
    elements = data.get("elements", [])

    nodes = build_node_dict(elements)
    to_proj, _ = get_transformers(cfg.get("geographic_crs", "EPSG:4326"), cfg.get("projected_crs", "EPSG:32643"))

    # 3. Process Road Ways
    features: List[Dict[str, Any]] = []
    total_length_m = 0.0
    missing_width_count = 0
    missing_surface_count = 0
    missing_lanes_count = 0
    missing_maxspeed_count = 0
    invalid_geoms = 0

    for elem in elements:
        if elem.get("type") != "way":
            continue

        way_nodes = elem.get("nodes", [])
        if len(way_nodes) < 2:
            continue

        # Extract coordinates
        coords_wgs84 = []
        for nid in way_nodes:
            if nid in nodes:
                coords_wgs84.append(nodes[nid])

        if len(coords_wgs84) < 2:
            continue

        line_geom = LineString(coords_wgs84)
        if not line_geom.is_valid:
            invalid_geoms += 1
            continue

        # Check intersection with 250m x 250m target boundary
        if not boundary_geom.intersects(line_geom):
            continue

        # Clip line to boundary
        clipped_geom = line_geom.intersection(boundary_geom)
        if clipped_geom.is_empty:
            continue

        # Compute metric length in UTM Zone 43N (meters)
        utm_coords = [to_proj.transform(pt[0], pt[1]) for pt in clipped_geom.coords]
        metric_line = LineString(utm_coords)
        length_m = round(metric_line.length, 2)
        total_length_m += length_m

        tags = elem.get("tags", {})

        # Extract attributes with honest null preservation
        road_name = tags.get("name")
        highway_cls = tags.get("highway")
        oneway_val = tags.get("oneway")
        is_oneway = True if oneway_val in ("yes", "1", "true") else (False if oneway_val in ("no", "0") else None)

        # Parse lanes as integer
        lanes_raw = tags.get("lanes")
        lanes = int(lanes_raw) if lanes_raw and lanes_raw.isdigit() else None
        if lanes is None:
            missing_lanes_count += 1

        # Parse width in meters
        width_raw = tags.get("width")
        width_m = None
        if width_raw:
            try:
                width_m = float(width_raw.replace("m", "").strip())
            except ValueError:
                width_m = None
        if width_m is None:
            missing_width_count += 1

        # Surface
        surface = tags.get("surface")
        if surface is None:
            missing_surface_count += 1

        # Maxspeed
        maxspeed = tags.get("maxspeed")
        if maxspeed is None:
            missing_maxspeed_count += 1

        feature = {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [[round(pt[0], 7), round(pt[1], 7)] for pt in clipped_geom.coords]
            },
            "properties": {
                "road_id": f"osm_way_{elem['id']}",
                "osm_id": elem["id"],
                "name": road_name,
                "highway": highway_cls,
                "oneway": is_oneway,
                "lanes": lanes,
                "maxspeed": maxspeed,
                "width_m": width_m,
                "surface": surface,
                "access": tags.get("access", "yes"),
                "bridge": tags.get("bridge") == "yes",
                "tunnel": tags.get("tunnel") == "yes",
                "length_m": length_m,
                "source": "OpenStreetMap",
                "raw_tags": {k: v for k, v in tags.items() if k not in ("name", "highway")}
            }
        }
        features.append(feature)

    total_roads = len(features)
    missing_width_pct = round((missing_width_count / max(1, total_roads)) * 100.0, 1)
    missing_surface_pct = round((missing_surface_count / max(1, total_roads)) * 100.0, 1)
    missing_lanes_pct = round((missing_lanes_count / max(1, total_roads)) * 100.0, 1)
    missing_maxspeed_pct = round((missing_maxspeed_count / max(1, total_roads)) * 100.0, 1)

    geojson_out = {
        "type": "FeatureCollection",
        "name": "INDRA_CityForge_Roads",
        "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
        "features": features
    }

    roads_file = os.path.join(proc_dir, "roads.geojson")
    with open(roads_file, "w", encoding="utf-8") as f:
        json.dump(geojson_out, f, indent=2)

    summary = {
        "dataset_id": cfg.get("dataset_id", "delhi_cp_v1"),
        "stage": "roads",
        "source": "OpenStreetMap",
        "target_area": cfg.get("area_name", "Connaught_Place_Pilot"),
        "total_road_segments": total_roads,
        "total_mapped_length_m": round(total_length_m, 2),
        "attribute_completeness": {
            "missing_width_pct": missing_width_pct,
            "missing_surface_pct": missing_surface_pct,
            "missing_lanes_pct": missing_lanes_pct,
            "missing_maxspeed_pct": missing_maxspeed_pct
        },
        "geometry_validation": {
            "invalid_geometries_dropped": invalid_geoms,
            "all_features_valid": invalid_geoms == 0
        },
        "output_file": roads_file
    }

    report_file = os.path.join(rep_dir, "roads_summary.json")
    with open(report_file, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    print("\n" + "=" * 65)
    print(" [01_roads] ROAD NETWORK DATA COLLECTED")
    print("=" * 65)
    print(f" Total Road Segments:     {total_roads}")
    print(f" Total Road Length:       {total_length_m:.1f} m")
    print(f" Missing Width Rate:      {missing_width_pct}% (preserved as null)")
    print(f" Missing Surface Rate:    {missing_surface_pct}% (preserved as null)")
    print(f" Missing Lanes Rate:      {missing_lanes_pct}%")
    print(f" Saved GeoJSON:           {roads_file}")
    print(f" Saved Summary:           {report_file}")
    print("=" * 65 + "\n")

    return summary


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Script 01: Collect OpenStreetMap road network.")
    parser.add_argument("--config", default=None, help="Path to config.yaml")
    parser.add_argument("--no-cache", action="store_true", help="Force refresh without using local cache")
    args = parser.parse_args()
    collect_roads(args.config, use_cache=not args.no_cache)

"""
Project INDRA — CityForge: Script 03 (Pedestrian Path Collector).
Collects pedestrian walkways, sidewalks, crossings, steps, and accessibility attributes.
Identifies physical traversability barriers (steps, unknown curb heights, missing widths)
essential for autonomous ground micro-UGV navigation safety.
"""

import os
import sys
import json
import argparse
from typing import Dict, Any, List, Optional
from shapely.geometry import LineString, Point, shape
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


def collect_footpaths(config_path: Optional[str] = None, use_cache: bool = True) -> Dict[str, Any]:
    """Collect pedestrian walkways and crossings, export GeoJSON + report."""
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

    # 2. Overpass query for pedestrian networks and crossing nodes/ways
    query = f"""
    [out:json][timeout:60];
    (
      way["highway"~"footway|pedestrian|path|steps|crossing|sidewalk"]({south},{west},{north},{east});
      node["highway"="crossing"]({south},{west},{north},{east});
    );
    (._; >;);
    out body;
    """

    cache_file = os.path.join(raw_dir, "footpaths_overpass.json")
    data = execute_overpass_query(query, cache_path=cache_file, config=cfg, use_cache=use_cache)
    elements = data.get("elements", [])

    nodes = build_node_dict(elements)
    to_proj, _ = get_transformers(cfg.get("geographic_crs", "EPSG:4326"), cfg.get("projected_crs", "EPSG:32643"))

    features: List[Dict[str, Any]] = []
    total_walkway_length_m = 0.0
    crossings_count = 0
    steps_count = 0
    missing_width_count = 0
    missing_surface_count = 0

    for elem in elements:
        elem_type = elem.get("type")
        elem_id = elem.get("id")
        tags = elem.get("tags", {})

        # Handle crossing nodes (point features)
        if elem_type == "node" and tags.get("highway") == "crossing":
            if elem_id not in nodes:
                continue
            lon, lat = nodes[elem_id]
            pt_geom = Point(lon, lat)
            if not boundary_geom.intersects(pt_geom):
                continue

            crossings_count += 1
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [round(lon, 7), round(lat, 7)]
                },
                "properties": {
                    "walkway_id": f"osm_node_crossing_{elem_id}",
                    "osm_id": elem_id,
                    "kind": "crossing_node",
                    "highway": "crossing",
                    "crossing_type": tags.get("crossing", "zebra"),
                    "kerb": tags.get("kerb"),
                    "tactile_paving": tags.get("tactile_paving"),
                    "traffic_signals": tags.get("crossing:signals") == "yes",
                    "robot_traversable": True,
                    "source": "OpenStreetMap",
                    "raw_tags": tags
                }
            }
            features.append(feature)
            continue

        # Handle walkways and footways (linear ways)
        if elem_type == "way":
            way_nodes = elem.get("nodes", [])
            if len(way_nodes) < 2:
                continue

            coords_wgs84 = []
            for nid in way_nodes:
                if nid in nodes:
                    coords_wgs84.append(nodes[nid])

            if len(coords_wgs84) < 2:
                continue

            line_geom = LineString(coords_wgs84)
            if not line_geom.is_valid or not boundary_geom.intersects(line_geom):
                continue

            clipped_geom = line_geom.intersection(boundary_geom)
            if clipped_geom.is_empty:
                continue

            # Compute metric length in UTM
            utm_coords = [to_proj.transform(pt[0], pt[1]) for pt in clipped_geom.coords]
            metric_line = LineString(utm_coords)
            length_m = round(metric_line.length, 2)
            total_walkway_length_m += length_m

            highway_cls = tags.get("highway", "footway")
            is_steps = highway_cls == "steps"
            if is_steps:
                steps_count += 1

            # Parse width
            width_raw = tags.get("width")
            width_m = None
            if width_raw:
                try:
                    width_m = float(width_raw.replace("m", "").strip())
                except ValueError:
                    width_m = None
            if width_m is None:
                missing_width_count += 1

            surface = tags.get("surface")
            if surface is None:
                missing_surface_count += 1

            # Autonomous Ground Robot Traversability Flag
            # Steps are impassable for wheeled micro-UGVs without ramps!
            robot_traversable = not is_steps

            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": [[round(pt[0], 7), round(pt[1], 7)] for pt in clipped_geom.coords]
                },
                "properties": {
                    "walkway_id": f"osm_way_{elem_id}",
                    "osm_id": elem_id,
                    "kind": "steps" if is_steps else "walkway",
                    "highway": highway_cls,
                    "name": tags.get("name"),
                    "footway": tags.get("footway"),
                    "surface": surface,
                    "width_m": width_m,
                    "step_count": int(tags.get("step_count")) if tags.get("step_count", "").isdigit() else None,
                    "incline": tags.get("incline"),
                    "wheelchair_accessible": tags.get("wheelchair"),
                    "length_m": length_m,
                    "robot_traversable": robot_traversable,
                    "traversability_note": "IMPASSABLE: Physical steps detected" if is_steps else "Traversable pedestrian surface",
                    "source": "OpenStreetMap",
                    "raw_tags": tags
                }
            }
            features.append(feature)

    total_walkways = len(features)
    missing_width_pct = round((missing_width_count / max(1, total_walkways)) * 100.0, 1)
    missing_surface_pct = round((missing_surface_count / max(1, total_walkways)) * 100.0, 1)

    geojson_out = {
        "type": "FeatureCollection",
        "name": "INDRA_CityForge_Walkways",
        "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
        "features": features
    }

    walkways_file = os.path.join(proc_dir, "walkways.geojson")
    with open(walkways_file, "w", encoding="utf-8") as f:
        json.dump(geojson_out, f, indent=2)

    summary = {
        "dataset_id": cfg.get("dataset_id", "delhi_cp_v1"),
        "stage": "footpaths",
        "source": "OpenStreetMap",
        "target_area": cfg.get("area_name", "Connaught_Place_Pilot"),
        "total_walkways_and_crossings": total_walkways,
        "total_walkway_length_m": round(total_walkway_length_m, 2),
        "crossings_count": crossings_count,
        "steps_count": steps_count,
        "robot_safety_alerts": {
            "impassable_steps_segments": steps_count,
            "warning": "Micro-UGV cannot traverse mapped stairs without confirmed ramp access."
        },
        "attribute_completeness": {
            "missing_width_pct": missing_width_pct,
            "missing_surface_pct": missing_surface_pct
        },
        "output_file": walkways_file
    }

    report_file = os.path.join(rep_dir, "walkways_summary.json")
    with open(report_file, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    print("\n" + "=" * 65)
    print(" [03_footpaths] PEDESTRIAN PATH DATA COLLECTED")
    print("=" * 65)
    print(f" Total Walkways & Crossings:  {total_walkways}")
    print(f" Total Walkway Length:        {total_walkway_length_m:.1f} m")
    print(f" Dedicated Crossings:         {crossings_count}")
    print(f" Impassable Steps Count:      {steps_count}")
    print(f" Missing Width Rate:          {missing_width_pct}% (preserved as null)")
    print(f" Saved GeoJSON:               {walkways_file}")
    print(f" Saved Summary:               {report_file}")
    print("=" * 65 + "\n")

    return summary


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Script 03: Collect OpenStreetMap pedestrian paths.")
    parser.add_argument("--config", default=None, help="Path to config.yaml")
    parser.add_argument("--no-cache", action="store_true", help="Force refresh without using local cache")
    args = parser.parse_args()
    collect_footpaths(args.config, use_cache=not args.no_cache)

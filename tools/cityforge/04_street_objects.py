"""
Project INDRA — CityForge: Script 04 (Street Object & Furniture Collector).
Collects point and localized street objects: traffic signals, streetlights, trees,
bollards, barriers, benches, and bus stops, categorizing them for 3D simulation placement.
"""

import os
import sys
import json
import argparse
from typing import Dict, Any, List, Optional
from shapely.geometry import Point, shape
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


def categorize_object(tags: Dict[str, str]) -> Tuple[str, str]:
    """Classify OSM tags into simulation-ready category and subclass."""
    # 1. Traffic Control
    if tags.get("highway") == "traffic_signals" or tags.get("traffic_signals"):
        return "traffic_control", "traffic_signal"
    if tags.get("traffic_sign"):
        return "traffic_control", f"sign_{tags.get('traffic_sign')}"

    # 2. Lighting / Illumination
    if tags.get("highway") == "street_lamp" or tags.get("lit") == "yes":
        return "illumination", "street_lamp"

    # 3. Vegetation
    if tags.get("natural") == "tree":
        return "vegetation", "tree"
    if tags.get("natural") in ("shrub", "bush", "tree_row"):
        return "vegetation", tags.get("natural")

    # 4. Barriers & Bollards
    if tags.get("barrier") in ("bollard", "block", "cycle_barrier"):
        return "barriers", "bollard"
    if tags.get("barrier") in ("fence", "wall", "guard_rail", "gate"):
        return "barriers", tags.get("barrier")

    # 5. Public Transit
    if tags.get("highway") == "bus_stop" or tags.get("public_transport") == "platform":
        return "transit", "bus_stop"

    # 6. Street Furniture & Amenities
    if tags.get("amenity") == "bench":
        return "urban_amenities", "bench"
    if tags.get("amenity") == "waste_basket":
        return "urban_amenities", "waste_basket"
    if tags.get("amenity") == "post_box":
        return "urban_amenities", "post_box"

    return "misc_object", "unclassified_furniture"


def collect_street_objects(config_path: Optional[str] = None, use_cache: bool = True) -> Dict[str, Any]:
    """Collect localized street furniture, export GeoJSON + report."""
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

    # 2. Overpass Query for Street Furniture & Point Features
    query = f"""
    [out:json][timeout:60];
    (
      node["highway"~"traffic_signals|street_lamp|bus_stop"]({south},{west},{north},{east});
      node["natural"="tree"]({south},{west},{north},{east});
      node["barrier"]({south},{west},{north},{east});
      node["amenity"~"bench|waste_basket|post_box"]({south},{west},{north},{east});
      node["traffic_sign"]({south},{west},{north},{east});
    );
    out body;
    """

    cache_file = os.path.join(raw_dir, "street_objects_overpass.json")
    if not os.path.exists(cache_file) and os.path.exists(os.path.join(out_dir, "osm", "street_objects_overpass.json")):
        cache_file = os.path.join(out_dir, "osm", "street_objects_overpass.json")
    data = execute_overpass_query(query, cache_path=cache_file, config=cfg, use_cache=use_cache)
    elements = data.get("elements", [])

    to_proj, _ = get_transformers(cfg.get("geographic_crs", "EPSG:4326"), cfg.get("projected_crs", "EPSG:32643"))

    features: List[Dict[str, Any]] = []
    category_counts: Dict[str, int] = {}

    for elem in elements:
        if elem.get("type") != "node":
            continue

        lon = float(elem.get("lon", 0))
        lat = float(elem.get("lat", 0))
        pt_geom = Point(lon, lat)

        if not boundary_geom.intersects(pt_geom):
            continue

        east, north_utm = to_proj.transform(lon, lat)
        tags = elem.get("tags", {})
        main_cat, sub_cat = categorize_object(tags)

        category_counts[main_cat] = category_counts.get(main_cat, 0) + 1

        feature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [round(lon, 7), round(lat, 7)]
            },
            "properties": {
                "object_id": f"osm_obj_{elem['id']}",
                "osm_id": elem["id"],
                "category": main_cat,
                "subclass": sub_cat,
                "name": tags.get("name"),
                "utm_x": round(east, 2),
                "utm_y": round(north_utm, 2),
                "source": "OpenStreetMap",
                "raw_tags": tags
            }
        }
        features.append(feature)

    total_objects = len(features)

    geojson_out = {
        "type": "FeatureCollection",
        "name": "INDRA_CityForge_Street_Objects",
        "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
        "features": features
    }

    objects_file = os.path.join(proc_dir, "street_objects.geojson")
    with open(objects_file, "w", encoding="utf-8") as f:
        json.dump(geojson_out, f, indent=2)

    summary = {
        "dataset_id": cfg.get("dataset_id", "delhi_cp_v1"),
        "stage": "street_objects",
        "source": "OpenStreetMap",
        "target_area": cfg.get("area_name", "Connaught_Place_Pilot"),
        "total_street_objects": total_objects,
        "category_distribution": category_counts,
        "note": "OpenStreetMap street furniture density varies by mapping activity and does not reflect 100% of physical ground reality.",
        "output_file": objects_file
    }

    report_file = os.path.join(rep_dir, "street_objects_summary.json")
    with open(report_file, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    print("\n" + "=" * 65)
    print(" [04_street_objects] STREET OBJECTS COLLECTED")
    print("=" * 65)
    print(f" Total Street Objects:    {total_objects}")
    for cat, cnt in sorted(category_counts.items()):
        print(f"   - {cat:<20}: {cnt}")
    print(f" Saved GeoJSON:           {objects_file}")
    print(f" Saved Summary:           {report_file}")
    print("=" * 65 + "\n")

    return summary


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Script 04: Collect OpenStreetMap street objects.")
    parser.add_argument("--config", default=None, help="Path to config.yaml")
    parser.add_argument("--no-cache", action="store_true", help="Force refresh without using local cache")
    args = parser.parse_args()
    collect_street_objects(args.config, use_cache=not args.no_cache)

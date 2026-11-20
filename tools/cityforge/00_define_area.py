"""
Project INDRA — CityForge: Script 00 (Define Geographic Area).
Computes exact metric bounding polygon in projected CRS (UTM Zone 43N),
transforms to WGS84 for OpenStreetMap API queries, and exports boundary.geojson.

Correction Note:
Generates the exact 250m x 250m boundary in projected metric coordinates, then transforms
to WGS84. This pilot area covers a specific 250m x 250m portion of Connaught Place, New Delhi,
not the entire circular commercial district.
"""

import os
import sys
import json
import argparse
from typing import Dict, Any

# Ensure project root is in path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, "..", ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from tools.cityforge.osm_client import load_config, get_transformers


def define_area(config_path: str = None) -> Dict[str, Any]:
    """Define geographic boundary using exact projected metric Cartesian dimensions."""
    cfg = load_config(config_path)

    center_lat = float(cfg["center_lat"])
    center_lon = float(cfg["center_lon"])
    width_m = float(cfg["width_m"])
    height_m = float(cfg["height_m"])
    geo_crs = cfg.get("geographic_crs", "EPSG:4326")
    proj_crs = cfg.get("projected_crs", "EPSG:32643")
    out_dir = os.path.join(PROJECT_ROOT, cfg.get("output_directory", "data/cityforge/delhi_cp_v1"))

    to_proj, to_wgs84 = get_transformers(geo_crs, proj_crs)

    # 1. Transform WGS84 center coordinate into UTM metric easting and northing
    center_east, center_north = to_proj.transform(center_lon, center_lat)

    # 2. Formulate exact metric bounding box (meters)
    half_w = width_m / 2.0
    half_h = height_m / 2.0
    min_east = center_east - half_w
    max_east = center_east + half_w
    min_north = center_north - half_h
    max_north = center_north + half_h

    actual_metric_w = max_east - min_east
    actual_metric_h = max_north - min_north
    area_m2 = actual_metric_w * actual_metric_h

    # 3. Transform metric polygon corners back into WGS84 degrees
    # Sequence: SW -> SE -> NE -> NW -> SW (closed ring)
    metric_corners = [
        (min_east, min_north),
        (max_east, min_north),
        (max_east, max_north),
        (min_east, max_north),
        (min_east, min_north)
    ]

    wgs84_coords = []
    lons = []
    lats = []
    for east, north in metric_corners:
        lon, lat = to_wgs84.transform(east, north)
        wgs84_coords.append([round(lon, 8), round(lat, 8)])
        lons.append(lon)
        lats.append(lat)

    south = min(lats)
    north = max(lats)
    west = min(lons)
    east = max(lons)

    # 4. Construct GeoJSON FeatureCollection
    boundary_feature = {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [wgs84_coords]
        },
        "properties": {
            "project": cfg.get("project", "INDRA_CityForge"),
            "dataset_id": cfg.get("dataset_id", "delhi_cp_v1"),
            "area_name": cfg.get("area_name", "Connaught_Place_Pilot"),
            "city": cfg.get("city", "New Delhi"),
            "coverage_note": "Pilot area covering a 250m x 250m portion of Connaught Place, New Delhi (not the entire circular commercial district).",
            "center_wgs84": [round(center_lon, 8), round(center_lat, 8)],
            "center_utm": [round(center_east, 2), round(center_north, 2)],
            "width_m": actual_metric_w,
            "height_m": actual_metric_h,
            "area_m2": area_m2,
            "geographic_crs": geo_crs,
            "projected_crs": proj_crs,
            "utm_bounds": [round(min_east, 2), round(min_north, 2), round(max_east, 2), round(max_north, 2)],
            "wgs84_bbox": [round(south, 8), round(west, 8), round(north, 8), round(east, 8)]
        }
    }

    geojson_doc = {
        "type": "FeatureCollection",
        "name": "INDRA_CityForge_Boundary",
        "crs": {
            "type": "name",
            "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}
        },
        "features": [boundary_feature]
    }

    # 5. Save boundary.geojson and metadata
    os.makedirs(out_dir, exist_ok=True)
    meta_dir = os.path.join(out_dir, "metadata")
    os.makedirs(meta_dir, exist_ok=True)

    boundary_geojson_path = os.path.join(out_dir, "boundary.geojson")
    with open(boundary_geojson_path, "w", encoding="utf-8") as f:
        json.dump(geojson_doc, f, indent=2)

    metadata_path = os.path.join(meta_dir, "boundary_metadata.json")
    metadata_doc = {
        "dataset_id": cfg.get("dataset_id", "delhi_cp_v1"),
        "area_name": cfg.get("area_name", "Connaught_Place_Pilot"),
        "coverage_scope": "250m x 250m metric pilot window in Connaught Place",
        "center_point": {"lat": center_lat, "lon": center_lon},
        "utm_center": {"easting": center_east, "northing": center_north, "zone": 43, "hemisphere": "North"},
        "dimensions": {"width_m": actual_metric_w, "height_m": actual_metric_h, "area_m2": area_m2},
        "crs": {"geographic": geo_crs, "projected": proj_crs},
        "bounding_box_wgs84": {"south": south, "west": west, "north": north, "east": east},
        "output_file": boundary_geojson_path
    }
    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(metadata_doc, f, indent=2)

    print("\n" + "=" * 65)
    print(" [00_define_area] EXACT METRIC BOUNDARY GENERATED")
    print("=" * 65)
    print(f" Target Area:       {cfg.get('area_name')}")
    print(f" Center (WGS84):    Lat {center_lat:.6f}, Lon {center_lon:.6f}")
    print(f" Center (UTM 43N):  East {center_east:.2f}m, North {center_north:.2f}m")
    print(f" Exact Dimension:   {actual_metric_w:.1f}m x {actual_metric_h:.1f}m ({area_m2:.1f} m²)")
    print(f" WGS84 BBox:        [{south:.6f}, {west:.6f}, {north:.6f}, {east:.6f}]")
    print(f" Saved GeoJSON:     {boundary_geojson_path}")
    print(f" Saved Metadata:    {metadata_path}")
    print("=" * 65 + "\n")

    return metadata_doc


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Script 00: Define geographic boundary in exact projected metric coordinates.")
    parser.add_argument("--config", default=None, help="Path to config.yaml")
    args = parser.parse_args()
    define_area(args.config)

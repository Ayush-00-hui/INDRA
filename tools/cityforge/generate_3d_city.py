"""
Project INDRA — CityForge: Script 09 (3D Procedural City Scene Generator).
Converts collected 250m x 250m Connaught Place geographic vector data, DEM topography,
and PBR material attributes into a fully structured 3D simulation scene (city_3d_scene.json)
for Three.js rendering and autonomous ground robotics simulation.

Features:
  - Metric centering: transforms UTM Zone 43N coordinates to local Cartesian simulation grid [-125, +125] m.
  - Building extrusion: turns 2D footprint polygons into 3D architectural volumes with CP colonnades,
    levels, height, and rooftop details.
  - Road ribbon synthesis: creates drivable road corridors with lane dividers and asphalt/concrete surfaces.
  - Pedestrian infrastructure: places sidewalks, crosswalks, and flags physical stairs as impassable obstacles.
  - Street furniture: registers 3D models and collision boundaries for trees, lamps, signals, and benches.
  - Terrain mesh: samples 100x100 DEM elevation into smooth topographical height fields.
"""

import os
import sys
import json
import math
import argparse
from typing import Dict, Any, List, Tuple, Optional
import numpy as np
from shapely.geometry import shape, Polygon, LineString, MultiLineString, Point

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, "..", ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from tools.cityforge.osm_client import load_config, get_transformers, logger


def utm_to_sim_coords(easting: float, northing: float, center_east: float, center_north: float) -> Tuple[float, float]:
    """
    Convert absolute UTM coordinates into local metric simulation coordinates centered at (0, 0).
    X_sim = easting - center_east (ranges [-width/2, +width/2])
    Y_sim = northing - center_north (ranges [-height/2, +height/2])
    """
    sim_x = round(easting - center_east, 3)
    sim_y = round(northing - center_north, 3)
    return sim_x, sim_y


def get_road_width(highway_type: str, lane_count: Optional[int] = None, width_m: Optional[float] = None) -> float:
    """Determine physically realistic road corridor width in meters."""
    if width_m is not None and width_m > 0:
        return float(width_m)
    if lane_count is not None and lane_count > 0:
        return float(lane_count * 3.5)
    
    defaults = {
        "primary": 12.0,
        "primary_link": 8.0,
        "secondary": 9.5,
        "secondary_link": 7.0,
        "tertiary": 8.0,
        "residential": 6.5,
        "service": 4.5,
        "living_street": 5.0,
        "unclassified": 6.0
    }
    return defaults.get(highway_type, 6.0)


def generate_3d_city_scene(config_path: str = None) -> Dict[str, Any]:
    """Compile geographic datasets and DEM elevation into a complete 3D procedural city scene."""
    cfg = load_config(config_path)
    out_dir = os.path.join(PROJECT_ROOT, cfg.get("output_directory", "data/cityforge/delhi_cp_v1"))
    proc_dir = os.path.join(out_dir, "processed")
    elev_dir = os.path.join(out_dir, "elevation")
    rep_dir = os.path.join(out_dir, "reports")
    tex_dir = os.path.join(out_dir, "textures")
    os.makedirs(rep_dir, exist_ok=True)

    boundary_file = os.path.join(out_dir, "boundary.geojson")
    roads_file = os.path.join(proc_dir, "roads.geojson")
    buildings_file = os.path.join(proc_dir, "buildings.geojson")
    walkways_file = os.path.join(proc_dir, "walkways.geojson")
    street_objects_file = os.path.join(proc_dir, "street_objects.geojson")
    dem_file = os.path.join(elev_dir, "terrain_dem.tif")

    for req_f in (boundary_file, roads_file, buildings_file, walkways_file, street_objects_file):
        if not os.path.exists(req_f):
            raise FileNotFoundError(f"Missing required CityForge dataset: {req_f}. Run pipeline.py first.")

    wgs84_to_utm, utm_to_wgs84 = get_transformers(cfg.get("geographic_crs", "EPSG:4326"), cfg.get("projected_crs", "EPSG:32643"))

    # 1. Load Boundary & Center Offsets
    with open(boundary_file, "r", encoding="utf-8") as f:
        b_data = json.load(f)
    b_props = b_data["features"][0]["properties"]
    min_e, min_n, max_e, max_n = b_props["utm_bounds"]
    center_e = (min_e + max_e) / 2.0
    center_n = (min_n + max_n) / 2.0
    width_m = max_e - min_e
    area_height_m = max_n - min_n

    logger.info(f"Generating 3D City Scene: {width_m:.1f}m x {area_height_m:.1f}m centered at UTM ({center_e:.2f}, {center_n:.2f})")

    # 2. Sample Elevation Topography
    elevation_matrix = []
    base_elevation_m = 216.0
    if os.path.exists(dem_file):
        try:
            import rasterio
            with rasterio.open(dem_file) as dem_src:
                arr = dem_src.read(1)
                valid = arr != dem_src.nodata
                if np.any(valid):
                    base_elevation_m = float(np.min(arr[valid]))
                    # Downsample to 25x25 grid for lightweight Three.js transmission
                    h, w = arr.shape
                    step_y = max(1, h // 25)
                    step_x = max(1, w // 25)
                    sub_arr = arr[::step_y, ::step_x]
                    elevation_matrix = [[round(float(val - base_elevation_m), 2) for val in row] for row in sub_arr]
        except Exception as e:
            logger.warning(f"Failed to read DEM GeoTIFF: {e}. Using flat planar terrain.")

    if not elevation_matrix:
        elevation_matrix = [[0.0] * 25 for _ in range(25)]

    # 3. Process Road Network Ribbons
    with open(roads_file, "r", encoding="utf-8") as f:
        roads_data = json.load(f)

    roads_3d = []
    for feat in roads_data.get("features", []):
        props = feat.get("properties", {})
        geom = feat.get("geometry", {})
        g_type = geom.get("type", "")
        coords = geom.get("coordinates", [])

        line_segments = []
        if g_type == "LineString":
            line_segments = [coords]
        elif g_type == "MultiLineString":
            line_segments = coords

        for seg in line_segments:
            sim_pts = []
            for lon, lat in seg:
                ue, un = wgs84_to_utm.transform(lon, lat)
                sx, sy = utm_to_sim_coords(ue, un, center_e, center_n)
                sim_pts.append([sx, sy])

            if len(sim_pts) < 2:
                continue

            hw_type = props.get("highway", "residential")
            lanes = props.get("lanes")
            width = get_road_width(hw_type, lanes, props.get("width_m"))
            has_divider = lanes is not None and lanes >= 2

            roads_3d.append({
                "road_id": props.get("road_id"),
                "name": props.get("name") or hw_type.replace("_", " ").title(),
                "highway": hw_type,
                "surface": props.get("surface") or "asphalt",
                "width_m": width,
                "lanes": lanes or 2,
                "oneway": props.get("oneway", False),
                "has_divider": has_divider,
                "points": sim_pts
            })

    # 4. Process Building Footprints and Architectural Volumes
    with open(buildings_file, "r", encoding="utf-8") as f:
        bldg_data = json.load(f)

    buildings_3d = []
    collision_polygons = []
    
    # Famous Connaught Place storefront names for architectural flavor
    cp_shop_names = [
        "Wenger's Bakery & Delicatessen",
        "United Coffee House",
        "Keventers Heritage Milkshake",
        "Oxford Bookstore & Cha Bar",
        "Rajiv Chowk Metro Express",
        "Connaught Handloom Emporium",
        "CP Heritage Tailors",
        "Delhi Craft Council",
        "Imperial Jewellers",
        "Palika Spice Market"
    ]
    
    colonnade_colors = [0xf8fafc, 0xf1f5f9, 0xe2e8f0, 0xfef3c7, 0xfde68a]

    for idx, feat in enumerate(bldg_data.get("features", [])):
        props = feat.get("properties", {})
        geom = feat.get("geometry", {})
        g_type = geom.get("type", "")
        coords = geom.get("coordinates", [])

        polys = []
        if g_type == "Polygon":
            polys = [coords]
        elif g_type == "MultiPolygon":
            polys = coords

        for poly_coords in polys:
            exterior = poly_coords[0]
            sim_ring = []
            for lon, lat in exterior:
                ue, un = wgs84_to_utm.transform(lon, lat)
                sx, sy = utm_to_sim_coords(ue, un, center_e, center_n)
                sim_ring.append([sx, sy])

            if len(sim_ring) < 3:
                continue

            # Compute centroid and bounding box
            poly_obj = Polygon(sim_ring)
            if not poly_obj.is_valid:
                poly_obj = poly_obj.buffer(0)
            if poly_obj.is_empty:
                continue

            cx, cy = round(float(poly_obj.centroid.x), 2), round(float(poly_obj.centroid.y), 2)
            minx, miny, maxx, maxy = [round(float(v), 2) for v in poly_obj.bounds]
            bldg_w = round(maxx - minx, 2)
            bldg_d = round(maxy - miny, 2)
            bounding_radius = round(math.hypot(bldg_w / 2.0, bldg_d / 2.0), 2)

            levels = props.get("levels") or 4
            bldg_height_m = props.get("height_m") or round(float(levels) * 3.4, 1)

            # Connaught Place circular blocks feature classic British Colonial Georgian architecture:
            # White curved colonnade corridors, Tuscan/Doric pillars, arched verandas, and storefronts.
            is_cp_block = bldg_w > 8.0 and bldg_d > 8.0
            wall_color = colonnade_colors[idx % len(colonnade_colors)]
            shop_name = cp_shop_names[idx % len(cp_shop_names)] if is_cp_block else None

            b_entry = {
                "building_id": props.get("building_id") or f"bldg_{idx+1}",
                "name": props.get("name") or shop_name or f"Block {chr(65 + (idx % 12))}",
                "levels": levels,
                "height_m": bldg_height_m,
                "center": [cx, cy],
                "dimensions": [bldg_w, bldg_d],
                "bounding_radius": bounding_radius,
                "polygon": sim_ring,
                "architecture_style": "georgian_colonnade" if is_cp_block else "urban_block",
                "wall_color": wall_color,
                "has_colonnade": is_cp_block,
                "has_shop": True,
                "shop_name": shop_name,
                "roof_shape": props.get("roof_shape") or "flat",
                "num_water_tanks": max(1, int(bldg_w * bldg_d / 120.0))
            }
            buildings_3d.append(b_entry)

            collision_polygons.append({
                "id": b_entry["building_id"],
                "kind": "building",
                "center": [cx, cy],
                "radius": bounding_radius,
                "polygon": sim_ring,
                "height": bldg_height_m
            })

    # 5. Process Walkways, Crossings, and Stairs
    with open(walkways_file, "r", encoding="utf-8") as f:
        walk_data = json.load(f)

    walkways_3d = []
    zebra_crossings_3d = []
    stair_hazards_3d = []

    for feat in walk_data.get("features", []):
        props = feat.get("properties", {})
        geom = feat.get("geometry", {})
        g_type = geom.get("type", "")
        coords = geom.get("coordinates", [])

        if g_type == "Point":
            lon, lat = coords
            ue, un = wgs84_to_utm.transform(lon, lat)
            sx, sy = utm_to_sim_coords(ue, un, center_e, center_n)
            crossing_type = props.get("crossing_type") or "zebra"
            zebra_crossings_3d.append({
                "crossing_id": props.get("walkway_id"),
                "x": sx,
                "y": sy,
                "type": crossing_type
            })

        elif g_type in ("LineString", "MultiLineString"):
            segs = [coords] if g_type == "LineString" else coords
            for seg in segs:
                sim_pts = []
                for lon, lat in seg:
                    ue, un = wgs84_to_utm.transform(lon, lat)
                    sx, sy = utm_to_sim_coords(ue, un, center_e, center_n)
                    sim_pts.append([sx, sy])

                if len(sim_pts) < 2:
                    continue

                is_steps = props.get("kind") == "steps" or props.get("highway") == "steps"
                is_traversable = props.get("robot_traversable", True)

                w_entry = {
                    "walkway_id": props.get("walkway_id"),
                    "kind": props.get("kind", "footway"),
                    "width_m": props.get("width_m") or 2.2,
                    "robot_traversable": is_traversable,
                    "is_steps": is_steps,
                    "points": sim_pts
                }
                walkways_3d.append(w_entry)

                if is_steps or not is_traversable:
                    mid_idx = len(sim_pts) // 2
                    mx, my = sim_pts[mid_idx]
                    stair_hazards_3d.append({
                        "hazard_id": f"hazard_{props.get('walkway_id')}",
                        "kind": "impassable_stairs",
                        "x": mx,
                        "y": my,
                        "radius": 1.4,
                        "step_count": props.get("step_count") or 5,
                        "points": sim_pts
                    })

    # 6. Process Street Objects (Lamps, Signals, Trees, Benches)
    with open(street_objects_file, "r", encoding="utf-8") as f:
        obj_data = json.load(f)

    street_objects_3d = []
    for feat in obj_data.get("features", []):
        props = feat.get("properties", {})
        category = props.get("category", "misc")
        subclass = props.get("subclass", "object")
        ue = props.get("utm_x")
        un = props.get("utm_y")

        if ue is None or un is None:
            geom = feat.get("geometry", {})
            if geom.get("type") == "Point":
                lon, lat = geom.get("coordinates", [0, 0])
                ue, un = wgs84_to_utm.transform(lon, lat)

        if ue and un:
            sx, sy = utm_to_sim_coords(ue, un, center_e, center_n)
            
            radius_map = {
                "traffic_signal": 0.35,
                "street_lamp": 0.25,
                "tree": 0.85,
                "bench": 0.65,
                "waste_basket": 0.30
            }
            col_radius = radius_map.get(subclass, 0.45)

            street_objects_3d.append({
                "object_id": props.get("object_id"),
                "category": category,
                "subclass": subclass,
                "x": sx,
                "y": sy,
                "collision_radius": col_radius
            })

    # 7. Identify Safe Robot Start and Goal Locations on Real Roads
    # Find a long drivable road segment near periphery for start, and another near center for goal
    robot_start = (-30.0, -15.0, 0.0)
    goal_pos = (28.0, 32.0)

    for rd in roads_3d:
        pts = rd["points"]
        if len(pts) >= 2:
            # Look for a point at reasonable distance from center
            p0 = pts[0]
            dist_from_c = math.hypot(p0[0], p0[1])
            if 25.0 <= dist_from_c <= 60.0:
                p1 = pts[1]
                hdg = math.atan2(p1[1] - p0[1], p1[0] - p0[0])
                robot_start = (p0[0], p0[1], round(hdg, 3))
                break

    for rd in reversed(roads_3d):
        pts = rd["points"]
        if len(pts) >= 2:
            pn = pts[-1]
            dist_from_start = math.hypot(pn[0] - robot_start[0], pn[1] - robot_start[1])
            if dist_from_start >= 35.0:
                goal_pos = (pn[0], pn[1])
                break

    # 8. Assemble Universal 3D Scene Specification
    city_3d_scene = {
        "metadata": {
            "project": "INDRA_CityForge",
            "scene_title": "Connaught Place Urban Sector Pilot",
            "dataset_id": cfg.get("dataset_id", "delhi_cp_v1"),
            "geographic_center_wgs84": [cfg.get("center_lat"), cfg.get("center_lon")],
            "projected_center_utm": [round(center_e, 2), round(center_n, 2)],
            "metric_dimensions_m": [width_m, area_height_m],
            "bounds_sim": [-width_m / 2.0, -area_height_m / 2.0, width_m / 2.0, area_height_m / 2.0],
            "vertical_datum": "EGM96",
            "base_elevation_m": round(base_elevation_m, 2)
        },
        "navigation_defaults": {
            "robot_start": list(robot_start),
            "goal_pos": list(goal_pos),
            "bounds": [-width_m / 2.0, -area_height_m / 2.0, width_m / 2.0, area_height_m / 2.0]
        },
        "terrain": {
            "grid_resolution_m": 10.0,
            "grid_dimensions": [len(elevation_matrix[0]), len(elevation_matrix)],
            "elevation_matrix": elevation_matrix
        },
        "roads": roads_3d,
        "buildings": buildings_3d,
        "walkways": walkways_3d,
        "zebra_crossings": zebra_crossings_3d,
        "street_objects": street_objects_3d,
        "impassable_stairs": stair_hazards_3d,
        "collision_obstacles": collision_polygons
    }

    # Export Scene JSON
    scene_output_file = os.path.join(out_dir, "city_3d_scene.json")
    with open(scene_output_file, "w", encoding="utf-8") as f:
        json.dump(city_3d_scene, f, indent=2)

    # Export Human-Readable Summary
    summary = {
        "dataset_id": cfg.get("dataset_id", "delhi_cp_v1"),
        "area_name": cfg.get("area_name", "Connaught_Place_Pilot"),
        "total_roads": len(roads_3d),
        "total_buildings": len(buildings_3d),
        "total_walkways": len(walkways_3d),
        "total_zebra_crossings": len(zebra_crossings_3d),
        "total_street_objects": len(street_objects_3d),
        "impassable_stairs_hazards": len(stair_hazards_3d),
        "collision_polygons_count": len(collision_polygons),
        "output_file": scene_output_file,
        "output_size_kb": round(os.path.getsize(scene_output_file) / 1024.0, 2)
    }
    summary_file = os.path.join(rep_dir, "city_3d_summary.json")
    with open(summary_file, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    print("\n" + "=" * 65)
    print(" [generate_3d_city] 3D PROCEDURAL CITY SCENE GENERATED")
    print("=" * 65)
    print(f" Target District:       {summary['area_name']} (250m x 250m)")
    print(f" Extruded Buildings:    {summary['total_buildings']}")
    print(f" Road Corridors:        {summary['total_roads']}")
    print(f" Walkway Ribbons:       {summary['total_walkways']}")
    print(f" Zebra Crossings:       {summary['total_zebra_crossings']}")
    print(f" Street Furniture:      {summary['total_street_objects']}")
    print(f" Impassable Stairs:     {summary['impassable_stairs_hazards']} (flagged as safety hazards)")
    print(f" Scene JSON Output:     {scene_output_file} ({summary['output_size_kb']} KB)")
    print("=" * 65 + "\n")

    return summary


def main():
    parser = argparse.ArgumentParser(description="INDRA CityForge: Generate 3D procedural city scene from geographic data.")
    parser.add_argument("--config", type=str, default=None, help="Path to CityForge config.yaml")
    args = parser.parse_args()

    generate_3d_city_scene(args.config)


if __name__ == "__main__":
    main()

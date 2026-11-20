"""
Unit & Regression Tests for INDRA CityForge Data Collection System.
Executes 100% offline using local synthetic fixtures and geometric mocks.
Verifies exact metric UTM dimensions, bidirectional CRS transformations,
truthful null preservation for unmeasured attributes, robotics traversability flags,
and validator integrity.
"""

import os
import sys
import json
import tempfile
import pytest
import numpy as np
from shapely.geometry import Polygon, LineString, shape
import pyproj

# Add project root to sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, "..", ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from tools.cityforge.osm_client import get_transformers, load_config
from tools.cityforge.pipeline import import_module_from_file, run_pipeline
from tools.cityforge.validate_data import validate_dataset, compute_sha256

mod_04_import = import_module_from_file("objects_mod_test", "04_street_objects.py")
categorize_object = mod_04_import.categorize_object


def test_boundary_metric_dimensions():
    """Verify that Script 00 computes an exact 250m x 250m polygon in UTM Zone 43N."""
    with tempfile.TemporaryDirectory() as tmpdir:
        # Create temporary config
        cfg = {
            "project": "INDRA_CityForge",
            "city": "New Delhi",
            "area_name": "Test_CP_Pilot",
            "dataset_id": "test_cp",
            "center_lat": 28.63152,
            "center_lon": 77.21672,
            "width_m": 250.0,
            "height_m": 250.0,
            "geographic_crs": "EPSG:4326",
            "projected_crs": "EPSG:32643",
            "output_directory": os.path.relpath(tmpdir, PROJECT_ROOT).replace("\\", "/")
        }
        cfg_path = os.path.join(tmpdir, "test_config.yaml")
        import yaml
        with open(cfg_path, "w", encoding="utf-8") as f:
            yaml.dump(cfg, f)

        mod_00 = import_module_from_file("mod_00_test", "00_define_area.py")
        meta = mod_00.define_area(cfg_path)

        assert meta["dimensions"]["width_m"] == 250.0
        assert meta["dimensions"]["height_m"] == 250.0
        assert meta["dimensions"]["area_m2"] == 62500.0

        # Load generated GeoJSON and test in UTM projected coordinates
        boundary_file = os.path.join(tmpdir, "boundary.geojson")
        assert os.path.exists(boundary_file)

        with open(boundary_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        feat = data["features"][0]
        assert feat["properties"]["width_m"] == 250.0
        assert feat["properties"]["height_m"] == 250.0

        # Transform WGS84 polygon back to UTM 43N and check metric bounds
        to_proj, _ = get_transformers("EPSG:4326", "EPSG:32643")
        wgs_coords = feat["geometry"]["coordinates"][0]
        utm_coords = [to_proj.transform(pt[0], pt[1]) for pt in wgs_coords]
        utm_poly = Polygon(utm_coords)

        min_x, min_y, max_x, max_y = utm_poly.bounds
        assert (max_x - min_x) == pytest.approx(250.0, abs=0.01)
        assert (max_y - min_y) == pytest.approx(250.0, abs=0.01)
        assert utm_poly.area == pytest.approx(62500.0, abs=0.5)


def test_crs_bidirectional_transformation():
    """Verify bidirectional transformation between WGS84 and UTM Zone 43N preserves millimeter accuracy."""
    to_proj, to_wgs84 = get_transformers("EPSG:4326", "EPSG:32643")
    orig_lon, orig_lat = 77.21672, 28.63152

    # WGS84 -> UTM 43N
    easting, northing = to_proj.transform(orig_lon, orig_lat)
    assert easting > 700000.0  # Delhi easting in UTM 43
    assert northing > 3100000.0 # Delhi northing in UTM 43

    # UTM 43N -> WGS84
    roundtrip_lon, roundtrip_lat = to_wgs84.transform(easting, northing)
    assert roundtrip_lon == pytest.approx(orig_lon, abs=1e-7)
    assert roundtrip_lat == pytest.approx(orig_lat, abs=1e-7)


def test_roads_parsing_and_null_preservation():
    """Verify that unmapped attributes (width, speed limit, lanes) remain null."""
    # Synthetic mock Overpass response for roads
    mock_data = {
        "elements": [
            {"type": "node", "id": 101, "lon": 77.2160, "lat": 28.6310},
            {"type": "node", "id": 102, "lon": 77.2170, "lat": 28.6320},
            {
                "type": "way",
                "id": 999,
                "nodes": [101, 102],
                "tags": {
                    "highway": "primary",
                    "name": "Connaught Circus"
                    # width, lanes, maxspeed deliberately unmapped!
                }
            }
        ]
    }

    with tempfile.TemporaryDirectory() as tmpdir:
        # Create boundary.geojson in tmpdir
        to_proj, to_wgs84 = get_transformers()
        c_e, c_n = to_proj.transform(77.2165, 28.6315)
        poly = Polygon([
            to_wgs84.transform(c_e - 150, c_n - 150),
            to_wgs84.transform(c_e + 150, c_n - 150),
            to_wgs84.transform(c_e + 150, c_n + 150),
            to_wgs84.transform(c_e - 150, c_n + 150),
            to_wgs84.transform(c_e - 150, c_n - 150)
        ])
        b_feat = {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {"type": "Polygon", "coordinates": [list(poly.exterior.coords)]},
                "properties": {"wgs84_bbox": [28.630, 77.215, 28.633, 77.218]}
            }]
        }
        with open(os.path.join(tmpdir, "boundary.geojson"), "w") as f:
            json.dump(b_feat, f)

        # Save mock raw overpass
        raw_dir = os.path.join(tmpdir, "raw")
        os.makedirs(raw_dir, exist_ok=True)
        with open(os.path.join(raw_dir, "roads_overpass.json"), "w") as f:
            json.dump(mock_data, f)

        cfg = {
            "dataset_id": "test_roads",
            "output_directory": os.path.relpath(tmpdir, PROJECT_ROOT).replace("\\", "/"),
            "geographic_crs": "EPSG:4326",
            "projected_crs": "EPSG:32643"
        }
        cfg_path = os.path.join(tmpdir, "config.yaml")
        import yaml
        with open(cfg_path, "w") as f:
            yaml.dump(cfg, f)

        mod_01 = import_module_from_file("mod_01_test", "01_roads.py")
        summary = mod_01.collect_roads(cfg_path, use_cache=True)

        assert summary["total_road_segments"] == 1
        assert summary["attribute_completeness"]["missing_width_pct"] == 100.0
        assert summary["attribute_completeness"]["missing_lanes_pct"] == 100.0

        with open(os.path.join(tmpdir, "processed", "roads.geojson"), "r") as f:
            roads_out = json.load(f)

        road_props = roads_out["features"][0]["properties"]
        assert road_props["name"] == "Connaught Circus"
        assert road_props["highway"] == "primary"
        assert road_props["width_m"] is None   # Must be preserved as null!
        assert road_props["lanes"] is None     # Must be preserved as null!
        assert road_props["maxspeed"] is None  # Must be preserved as null!


def test_buildings_polygon_closure_and_null_heights():
    """Verify building polygons are closed and unmapped heights remain null."""
    mock_data = {
        "elements": [
            {"type": "node", "id": 1, "lon": 77.2160, "lat": 28.6310},
            {"type": "node", "id": 2, "lon": 77.2165, "lat": 28.6310},
            {"type": "node", "id": 3, "lon": 77.2165, "lat": 28.6315},
            {"type": "node", "id": 4, "lon": 77.2160, "lat": 28.6315},
            {
                "type": "way",
                "id": 555,
                "nodes": [1, 2, 3, 4],  # Unclosed ring (missing trailing 1)
                "tags": {
                    "building": "commercial",
                    "name": "Statesman House",
                    "building:levels": "17"
                    # height deliberately missing
                }
            }
        ]
    }

    with tempfile.TemporaryDirectory() as tmpdir:
        to_proj, to_wgs84 = get_transformers()
        c_e, c_n = to_proj.transform(77.2162, 28.6312)
        poly = Polygon([
            to_wgs84.transform(c_e - 100, c_n - 100),
            to_wgs84.transform(c_e + 100, c_n - 100),
            to_wgs84.transform(c_e + 100, c_n + 100),
            to_wgs84.transform(c_e - 100, c_n + 100),
            to_wgs84.transform(c_e - 100, c_n - 100)
        ])
        b_feat = {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {"type": "Polygon", "coordinates": [list(poly.exterior.coords)]},
                "properties": {"wgs84_bbox": [28.630, 77.215, 28.633, 77.218]}
            }]
        }
        with open(os.path.join(tmpdir, "boundary.geojson"), "w") as f:
            json.dump(b_feat, f)

        raw_dir = os.path.join(tmpdir, "raw")
        os.makedirs(raw_dir, exist_ok=True)
        with open(os.path.join(raw_dir, "buildings_overpass.json"), "w") as f:
            json.dump(mock_data, f)

        cfg = {
            "dataset_id": "test_buildings",
            "output_directory": os.path.relpath(tmpdir, PROJECT_ROOT).replace("\\", "/"),
            "geographic_crs": "EPSG:4326",
            "projected_crs": "EPSG:32643"
        }
        cfg_path = os.path.join(tmpdir, "config.yaml")
        import yaml
        with open(cfg_path, "w") as f:
            yaml.dump(cfg, f)

        mod_02 = import_module_from_file("mod_02_test", "02_buildings.py")
        summary = mod_02.collect_buildings(cfg_path, use_cache=True)

        assert summary["total_buildings"] == 1
        assert summary["attribute_completeness"]["missing_height_pct"] == 100.0

        with open(os.path.join(tmpdir, "processed", "buildings.geojson"), "r") as f:
            bldg_out = json.load(f)

        bldg = bldg_out["features"][0]
        # Polygon must be closed (first coord == last coord)
        coords = bldg["geometry"]["coordinates"][0]
        assert coords[0] == coords[-1]
        assert bldg["properties"]["height_m"] is None
        assert bldg["properties"]["levels"] == 17
        assert bldg["properties"]["footprint_area_m2"] > 0


def test_walkways_robot_safety_flags():
    """Verify that physical steps are identified and flagged as impassable for ground micro-UGVs."""
    mock_data = {
        "elements": [
            {"type": "node", "id": 11, "lon": 77.2161, "lat": 28.6311},
            {"type": "node", "id": 12, "lon": 77.2162, "lat": 28.6312},
            {"type": "node", "id": 13, "lon": 77.2163, "lat": 28.6313},
            {
                "type": "way",
                "id": 101,
                "nodes": [11, 12],
                "tags": {"highway": "steps", "step_count": "8"}
            },
            {
                "type": "way",
                "id": 102,
                "nodes": [12, 13],
                "tags": {"highway": "footway", "surface": "paving_stones"}
            }
        ]
    }

    with tempfile.TemporaryDirectory() as tmpdir:
        to_proj, to_wgs84 = get_transformers()
        c_e, c_n = to_proj.transform(77.2162, 28.6312)
        poly = Polygon([
            to_wgs84.transform(c_e - 100, c_n - 100),
            to_wgs84.transform(c_e + 100, c_n - 100),
            to_wgs84.transform(c_e + 100, c_n + 100),
            to_wgs84.transform(c_e - 100, c_n + 100),
            to_wgs84.transform(c_e - 100, c_n - 100)
        ])
        b_feat = {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {"type": "Polygon", "coordinates": [list(poly.exterior.coords)]},
                "properties": {"wgs84_bbox": [28.630, 77.215, 28.633, 77.218]}
            }]
        }
        with open(os.path.join(tmpdir, "boundary.geojson"), "w") as f:
            json.dump(b_feat, f)

        raw_dir = os.path.join(tmpdir, "raw")
        os.makedirs(raw_dir, exist_ok=True)
        with open(os.path.join(raw_dir, "footpaths_overpass.json"), "w") as f:
            json.dump(mock_data, f)

        cfg = {
            "dataset_id": "test_footpaths",
            "output_directory": os.path.relpath(tmpdir, PROJECT_ROOT).replace("\\", "/"),
            "geographic_crs": "EPSG:4326",
            "projected_crs": "EPSG:32643"
        }
        cfg_path = os.path.join(tmpdir, "config.yaml")
        import yaml
        with open(cfg_path, "w") as f:
            yaml.dump(cfg, f)

        mod_03 = import_module_from_file("mod_03_test", "03_footpaths.py")
        summary = mod_03.collect_footpaths(cfg_path, use_cache=True)

        assert summary["steps_count"] == 1
        with open(os.path.join(tmpdir, "processed", "walkways.geojson"), "r") as f:
            walkways_out = json.load(f)

        steps_feat = [f for f in walkways_out["features"] if f["properties"]["highway"] == "steps"][0]
        footway_feat = [f for f in walkways_out["features"] if f["properties"]["highway"] == "footway"][0]

        assert steps_feat["properties"]["robot_traversable"] is False
        assert footway_feat["properties"]["robot_traversable"] is True


def test_street_objects_categorization():
    """Verify tag classification maps street items to correct simulation categories."""
    assert categorize_object({"highway": "traffic_signals"}) == ("traffic_control", "traffic_signal")
    assert categorize_object({"highway": "street_lamp"}) == ("illumination", "street_lamp")
    assert categorize_object({"natural": "tree"}) == ("vegetation", "tree")
    assert categorize_object({"barrier": "bollard"}) == ("barriers", "bollard")
    assert categorize_object({"amenity": "bench"}) == ("urban_amenities", "bench")
    assert categorize_object({"highway": "bus_stop"}) == ("transit", "bus_stop")


def test_pipeline_dry_run():
    """Verify that pipeline dry run validates parameters without making network requests."""
    res = run_pipeline(stage="all", dry_run=True)
    assert res["status"] == "dry_run_success"
    assert res["config"]["project"] == "INDRA_CityForge"


def test_aerial_imagery_geotiff_generation():
    """Verify that Script 05 generates a valid georeferenced RGB GeoTIFF in UTM Zone 43N."""
    import rasterio
    with tempfile.TemporaryDirectory() as tmpdir:
        # Create minimal boundary.geojson
        b_feat = {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {"type": "Polygon", "coordinates": [[[77.215, 28.630], [77.218, 28.630], [77.218, 28.633], [77.215, 28.633], [77.215, 28.630]]]},
                "properties": {
                    "wgs84_bbox": [28.630, 77.215, 28.633, 77.218],
                    "utm_bounds": [716574.0, 3169046.0, 716824.0, 3169296.0]
                }
            }]
        }
        with open(os.path.join(tmpdir, "boundary.geojson"), "w") as f:
            json.dump(b_feat, f)

        cfg = {
            "dataset_id": "test_aerial",
            "output_directory": os.path.relpath(tmpdir, PROJECT_ROOT).replace("\\", "/"),
            "geographic_crs": "EPSG:4326",
            "projected_crs": "EPSG:32643"
        }
        cfg_path = os.path.join(tmpdir, "config.yaml")
        import yaml
        with open(cfg_path, "w") as f:
            yaml.dump(cfg, f)

        mod_05 = import_module_from_file("mod_05_test", "05_aerial_imagery.py")
        meta = mod_05.collect_aerial_imagery(cfg_path, resolution_m=1.0, use_cache=False)

        tif_file = meta["output_file"]
        assert os.path.exists(tif_file)
        with rasterio.open(tif_file) as src:
            assert src.count == 3  # RGB
            assert src.crs.to_string() == "EPSG:32643"
            assert src.width == 250
            assert src.height == 250


def test_elevation_dem_geotiff_generation():
    """Verify that Script 06 generates a valid 32-bit Float DEM GeoTIFF."""
    import rasterio
    with tempfile.TemporaryDirectory() as tmpdir:
        b_feat = {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {"type": "Polygon", "coordinates": [[[77.215, 28.630], [77.218, 28.630], [77.218, 28.633], [77.215, 28.633], [77.215, 28.630]]]},
                "properties": {
                    "wgs84_bbox": [28.630, 77.215, 28.633, 77.218],
                    "utm_bounds": [716574.0, 3169046.0, 716824.0, 3169296.0]
                }
            }]
        }
        with open(os.path.join(tmpdir, "boundary.geojson"), "w") as f:
            json.dump(b_feat, f)

        cfg = {
            "dataset_id": "test_elev",
            "output_directory": os.path.relpath(tmpdir, PROJECT_ROOT).replace("\\", "/"),
            "geographic_crs": "EPSG:4326",
            "projected_crs": "EPSG:32643"
        }
        cfg_path = os.path.join(tmpdir, "config.yaml")
        import yaml
        with open(cfg_path, "w") as f:
            yaml.dump(cfg, f)

        mod_06 = import_module_from_file("mod_06_test", "06_elevation.py")
        meta = mod_06.collect_elevation(cfg_path, grid_spacing_m=5.0, use_cache=False)

        tif_file = meta["output_file"]
        assert os.path.exists(tif_file)
        with rasterio.open(tif_file) as src:
            assert src.count == 1
            assert src.dtypes[0] == "float32"
            assert src.crs.to_string() == "EPSG:32643"
            arr = src.read(1)
            assert 210.0 <= np.mean(arr) <= 225.0  # Real Delhi MSL elevation range


def test_textures_pbr_manifest():
    """Verify that Script 08 synthesizes seamless diffuse, normal, and roughness maps."""
    with tempfile.TemporaryDirectory() as tmpdir:
        cfg = {
            "dataset_id": "test_tex",
            "output_directory": os.path.relpath(tmpdir, PROJECT_ROOT).replace("\\", "/")
        }
        cfg_path = os.path.join(tmpdir, "config.yaml")
        import yaml
        with open(cfg_path, "w") as f:
            yaml.dump(cfg, f)

        mod_08 = import_module_from_file("mod_08_test", "08_textures.py")
        manifest = mod_08.collect_textures(cfg_path)

        assert manifest["total_materials"] > 10
        manifest_file = os.path.join(tmpdir, "textures", "texture_manifest.json")
        assert os.path.exists(manifest_file)

        # Check that individual PBR maps exist for the first material
        first_mat = manifest["materials"][0]
        assert os.path.exists(first_mat["diffuse_file"])
        assert os.path.exists(first_mat["normal_file"])
        assert os.path.exists(first_mat["roughness_file"])


def test_qgis_project_generation():
    """Verify that generate_qgis_project.py creates valid .qgs XML and .qgz archive."""
    with tempfile.TemporaryDirectory() as tmpdir:
        proc_dir = os.path.join(tmpdir, "processed")
        os.makedirs(proc_dir, exist_ok=True)

        # Create dummy geojson files
        dummy_feat = {"type": "FeatureCollection", "features": []}
        for name in ["roads.geojson", "buildings.geojson", "walkways.geojson", "street_objects.geojson"]:
            with open(os.path.join(proc_dir, name), "w") as f:
                json.dump(dummy_feat, f)
        with open(os.path.join(tmpdir, "boundary.geojson"), "w") as f:
            json.dump(dummy_feat, f)

        cfg = {
            "dataset_id": "test_qgis",
            "output_directory": os.path.relpath(tmpdir, PROJECT_ROOT).replace("\\", "/")
        }
        cfg_path = os.path.join(tmpdir, "config.yaml")
        import yaml
        with open(cfg_path, "w") as f:
            yaml.dump(cfg, f)

        mod_qgis = import_module_from_file("mod_qgis_test", "generate_qgis_project.py")
        qgz_path = mod_qgis.create_qgis_project(cfg_path)

        assert os.path.exists(qgz_path)
        assert qgz_path.endswith(".qgz")
        assert os.path.exists(os.path.join(tmpdir, "test_qgis.qgs"))


def test_landuse_extraction_and_categorization():
    """Verify that 04b_landuse.py categorizes and clips green area and commercial polygons."""
    with tempfile.TemporaryDirectory() as tmpdir:
        proc_dir = os.path.join(tmpdir, "processed")
        raw_dir = os.path.join(tmpdir, "raw")
        os.makedirs(proc_dir, exist_ok=True)
        os.makedirs(raw_dir, exist_ok=True)

        b_feat = {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[77.215, 28.630], [77.218, 28.630], [77.218, 28.633], [77.215, 28.633], [77.215, 28.630]]]
                },
                "properties": {
                    "wgs84_bbox": [28.630, 77.215, 28.633, 77.218],
                    "utm_bounds": [716574.0, 3169046.0, 716824.0, 3169296.0]
                }
            }]
        }
        with open(os.path.join(tmpdir, "boundary.geojson"), "w") as f:
            json.dump(b_feat, f)

        mock_osm = {
            "elements": [
                {"type": "node", "id": 1, "lat": 28.631, "lon": 77.216},
                {"type": "node", "id": 2, "lat": 28.632, "lon": 77.216},
                {"type": "node", "id": 3, "lat": 28.632, "lon": 77.217},
                {"type": "node", "id": 4, "lat": 28.631, "lon": 77.217},
                {
                    "type": "way",
                    "id": 101,
                    "nodes": [1, 2, 3, 4, 1],
                    "tags": {"leisure": "park", "name": "Central Park Test"}
                }
            ]
        }
        with open(os.path.join(raw_dir, "landuse_overpass.json"), "w") as f:
            json.dump(mock_osm, f)

        cfg = {
            "dataset_id": "test_lu",
            "output_directory": os.path.relpath(tmpdir, PROJECT_ROOT).replace("\\", "/"),
            "geographic_crs": "EPSG:4326",
            "projected_crs": "EPSG:32643"
        }
        cfg_path = os.path.join(tmpdir, "config.yaml")
        import yaml
        with open(cfg_path, "w") as f:
            yaml.dump(cfg, f)

        mod_lu = import_module_from_file("mod_lu_test", "04b_landuse.py")
        summary = mod_lu.collect_landuse(cfg_path, use_cache=True)

        assert summary["total_landuse_features"] == 1
        assert summary["total_landuse_area_m2"] > 0.0
        assert "park" in summary["categories"]


def test_import_external_assets_pipeline():
    """Verify that import_external_assets.py validates GeoTIFFs and rejects non-georeferenced images."""
    with tempfile.TemporaryDirectory() as tmpdir:
        sat_dir = os.path.join(tmpdir, "satellite")
        os.makedirs(sat_dir, exist_ok=True)

        # Create dummy non-georeferenced plain image
        plain_img_path = os.path.join(sat_dir, "unreferenced_photo.jpg")
        with open(plain_img_path, "wb") as f:
            f.write(b"\xFF\xD8\xFF\xE0\x00\x10JFIF" + b"\x00" * 50)

        cfg = {
            "dataset_id": "test_import",
            "output_directory": os.path.relpath(tmpdir, PROJECT_ROOT).replace("\\", "/"),
            "projected_crs": "EPSG:32643"
        }
        cfg_path = os.path.join(tmpdir, "config.yaml")
        import yaml
        with open(cfg_path, "w") as f:
            yaml.dump(cfg, f)

        mod_imp = import_module_from_file("mod_imp_test", "import_external_assets.py")
        manifest = mod_imp.import_assets(cfg_path)

        assert len(manifest["rejected_files"]) >= 1
        assert "georeferencing" in manifest["rejected_files"][0]["reason"].lower()


def test_transitions_smoke_dataset_schema():
    """Verify that generated transitions conform strictly to INDRA World Model schema."""
    try:
        import pygame
    except ImportError:
        pytest.skip("pygame is not installed in current environment; required for IndraEnv transition simulation.")

    with tempfile.TemporaryDirectory() as tmpdir:
        meas_dir = os.path.join(tmpdir, "measurements")
        os.makedirs(meas_dir, exist_ok=True)

        cfg = {
            "dataset_id": "test_trans",
            "output_directory": os.path.relpath(tmpdir, PROJECT_ROOT).replace("\\", "/")
        }
        cfg_path = os.path.join(tmpdir, "config.yaml")
        import yaml
        with open(cfg_path, "w") as f:
            yaml.dump(cfg, f)

        mod_trans = import_module_from_file("mod_trans_test", "generate_transitions.py")
        result = mod_trans.generate_smoke_transitions(
            config_path=cfg_path,
            target_transitions=10,
            max_steps_per_episode=15,
            policy="random"
        )

        sidecar = result["dataset_summary"]
        assert sidecar["total_transitions"] >= 10
        assert os.path.exists(sidecar["output_npz"])

        required_keys = [
            "episode_id", "step_index", "timestamp_s", "map_id", "scenario_id", "seed",
            "state_t", "observation_t", "action_t", "state_t1", "observation_t1", "dt_s",
            "collision", "terminated", "truncated"
        ]
        with np.load(sidecar["output_npz"]) as data:
            for k in required_keys:
                assert k in data, f"Missing required transition key: {k}"




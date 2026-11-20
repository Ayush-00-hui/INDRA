"""
Unit Tests for Project INDRA — CityForge Phase 3: 3D Procedural City Generation.
Verifies metric coordinate translation, building extrusion, road ribbon synthesis,
collision hazard registration, Scenario 11 integration, and Three.js scene layout compliance.
"""

import os
import sys
import json
import pytest

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, "..", ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from tools.cityforge.generate_3d_city import utm_to_sim_coords, get_road_width, generate_3d_city_scene
from indra.scenarios.scenario_manager import ScenarioRegistry, ScenarioDefinition


def test_utm_to_sim_coords_metric_centering():
    """Verify UTM coordinates are translated to local Cartesian simulation coordinates."""
    center_e, center_n = 716699.09, 3169171.62
    
    # Exact center should map to (0.0, 0.0)
    sx, sy = utm_to_sim_coords(center_e, center_n, center_e, center_n)
    assert sx == 0.0
    assert sy == 0.0

    # East/West metric offsets
    sx_east, sy_east = utm_to_sim_coords(center_e + 50.0, center_n, center_e, center_n)
    assert sx_east == 50.0
    assert sy_east == 0.0

    sx_south, sy_south = utm_to_sim_coords(center_e, center_n - 80.0, center_e, center_n)
    assert sx_south == 0.0
    assert sy_south == -80.0


def test_road_width_inference():
    """Verify physical road corridor width inference defaults."""
    assert get_road_width("primary") == 12.0
    assert get_road_width("secondary") == 9.5
    assert get_road_width("residential") == 6.5
    assert get_road_width("service") == 4.5
    # Explicit lane count overrides
    assert get_road_width("residential", lane_count=3) == 10.5
    # Explicit width overrides
    assert get_road_width("primary", width_m=14.2) == 14.2


def test_generate_3d_city_scene_export():
    """Verify that generate_3d_city_scene compiles and exports valid city_3d_scene.json."""
    summary = generate_3d_city_scene()

    assert summary["dataset_id"] == "delhi_cp_v1"
    assert summary["total_buildings"] == 27
    assert summary["total_roads"] == 29
    assert summary["total_walkways"] >= 30
    assert summary["total_zebra_crossings"] == 9
    assert summary["total_street_objects"] == 12
    assert summary["impassable_stairs_hazards"] == 5

    scene_file = summary["output_file"]
    assert os.path.exists(scene_file)

    with open(scene_file, "r", encoding="utf-8") as f:
        scene = json.load(f)

    meta = scene["metadata"]
    assert meta["bounds_sim"] == [-125.0, -125.0, 125.0, 125.0]
    assert meta["metric_dimensions_m"] == [250.0, 250.0]

    # Verify building extrusion properties
    first_bldg = scene["buildings"][0]
    assert "height_m" in first_bldg
    assert first_bldg["height_m"] > 0
    assert "polygon" in first_bldg
    assert len(first_bldg["polygon"]) >= 3
    assert "center" in first_bldg

    # Verify road properties
    first_road = scene["roads"][0]
    assert "points" in first_road
    assert len(first_road["points"]) >= 2
    assert "width_m" in first_road

    # Verify impassable stairs
    assert len(scene["impassable_stairs"]) == 5
    for stair in scene["impassable_stairs"]:
        assert stair["kind"] == "impassable_stairs"
        assert stair["radius"] > 0


def test_scenario_11_registration_and_loading():
    """Verify that Scenario 11 (Connaught Place Real-World Pilot) is registered and initializes."""
    scenarios = ScenarioRegistry.list_all_scenarios()
    s11_meta = next((s for s in scenarios if s["id"] == 11), None)
    assert s11_meta is not None
    assert s11_meta["code"] == "connaught_place_pilot"

    sc = ScenarioRegistry.create_scenario(11, seed=2026)
    assert isinstance(sc, ScenarioDefinition)
    assert sc.scenario_id == 11
    assert sc.bounds == (-125.0, -125.0, 125.0, 125.0)
    assert -125.0 <= sc.robot_start[0] <= 125.0
    assert -125.0 <= sc.robot_start[1] <= 125.0
    assert -125.0 <= sc.goal_pos[0] <= 125.0
    assert -125.0 <= sc.goal_pos[1] <= 125.0

    # Ensure impassable stairs are present in hazards
    stair_hazards = [h for h in sc.hazards if h.kind == "impassable_stairs"]
    assert len(stair_hazards) == 5

    # Ensure street objects are loaded as static actors
    street_actors = [a for a in sc.actors if not a.is_dynamic]
    assert len(street_actors) >= 10

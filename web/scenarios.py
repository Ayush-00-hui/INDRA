"""
Scenario Registry and Availability Resolver for World Model Web Application.
"""

import os
import importlib
from typing import Dict, Any, List


SCENARIOS = {
    "indra": {
        "id": "indra",
        "title": "PROJECT INDRA: Indian Urban Robotics",
        "tagline": "Predicting unstructured traffic dynamics, cattle hazards & monsoon waterlogging.",
        "description": "An India-adapted simulation platform for autonomous urban navigation in realistic, unstructured environments. Features auto-rickshaws, filtering two-wheelers, sacred cattle, dynamic weather, and multi-sector LiDAR MPC planning.",
        "thumbnail": "results/web_screenshots/sim_robotics_upgraded.png",
        "variants": [
            {"id": 1, "name": "Scenario 1: Arterial Urban Corridor", "type": "traffic"},
            {"id": 2, "name": "Scenario 2: Narrow Chandni Chowk Alley", "type": "constrained"},
            {"id": 3, "name": "Scenario 3: Dense Market Chaos", "type": "stochastic"},
            {"id": 4, "name": "Scenario 4: Sacred Cattle & Stray Animal Hazard", "type": "animal_hazard"},
            {"id": 5, "name": "Scenario 5: Delhi Monsoon Waterlogging", "type": "weather_hazard"},
            {"id": 6, "name": "Scenario 6: Pedestrian Crossing & Jaywalking", "type": "pedestrian_hazard"},
            {"id": 7, "name": "Scenario 7: Moving Motorcycle Cut-in", "type": "dynamic_cutin"},
            {"id": 8, "name": "Scenario 8: Road Construction & Barricades", "type": "construction"},
            {"id": 9, "name": "Scenario 9: Dead-End Recovery Maneuver", "type": "recovery"},
            {"id": 10, "name": "Scenario 10: Dense Traffic Gridlock", "type": "gridlock"}
        ],
        "default_variant": 1,
        "model_paths": ["models/indra_model.pt", "models/robot_student.pt"],
        "capabilities": ["live", "replay", "compare", "mind_view", "hitboxes", "first_person_pov", "weather_control", "animal_avoidance"],
        "env_module": "indra.env",
        "env_class": "IndraEnv",
        "adapter_module": "web.adapters.indra_adapter",
        "adapter_class": "IndraAdapter"
    },
    "robotics": {
        "id": "robotics",
        "title": "Autonomous Warehouse Robotics",
        "tagline": "The robot imagines multiple detour paths before taking a single step.",
        "description": "Demonstrates predictive obstacle evasion and dynamic pedestrian avoidance. A reactive greedy agent repeatedly crashes into U-shaped traps, while the World Model MPC agent imagines rollouts to navigate safely.",
        "thumbnail": "results/screenshots/hero_split_screen.png",
        "variants": [
            {"id": 1, "name": "Scenario 1: Office Chair Trap", "type": "static"},
            {"id": 2, "name": "Scenario 2: Dynamic Pedestrian", "type": "dynamic"}
        ],
        "default_variant": 1,
        "model_paths": ["models/robot_ensemble.pt", "models/robot_model.pt"],
        "capabilities": ["live", "replay", "compare", "mind_view", "dream_view", "hitboxes", "first_person_pov"],
        "env_module": "envs.robot_env",
        "env_class": "RobotEnv",
        "adapter_module": "web.adapters.robot_adapter",
        "adapter_class": "RobotAdapter"
    },
    "driving": {
        "id": "driving",
        "title": "Autonomous Highway Driving",
        "tagline": "Predicting multi-vehicle traffic dynamics and emergency braking maneuvers.",
        "description": "High-speed highway navigation with curved lanes, multi-agent IDM traffic, and collision avoidance. World Model simulates 300 imagined trajectories in parallel over a 14-step receding horizon.",
        "thumbnail": "results/screenshots/hero_menu.png",
        "variants": [
            {"id": 1, "name": "Scenario 1: Highway Lane Keeping & Curvature", "type": "continuous"},
            {"id": 2, "name": "Scenario 2: Lead Vehicle Sudden Braking", "type": "dynamic"},
            {"id": 3, "name": "Scenario 3: Dense Traffic Lane Change / Overtake", "type": "dynamic"},
            {"id": 4, "name": "Scenario 4: Pedestrian Crossing Hazard", "type": "safety_critical"}
        ],
        "default_variant": 2,
        "model_paths": ["models/driving_model.pt"],
        "capabilities": ["live", "replay", "compare", "mind_view", "first_person_pov", "manual_drive"],
        "env_module": "envs.driving_env",
        "env_class": "DrivingEnv",
        "adapter_module": "web.adapters.driving_adapter",
        "adapter_class": "DrivingAdapter"
    },
    "factory": {
        "id": "factory",
        "title": "Factory-Line Digital Twin",
        "tagline": "Predictive maintenance scheduling before catastrophic workstation failure.",
        "description": "A 3-station manufacturing pipeline with stochastic machine wear. The World Model forecasts bottleneck queues and executes preemptive servicing before line stoppages.",
        "thumbnail": "results/visuals3d/model_sheet_v2.png",
        "variants": [
            {"id": 1, "name": "3-Station Assembly Line", "type": "discrete_event"}
        ],
        "default_variant": 1,
        "model_paths": ["models/factory_model.pt"],
        "capabilities": ["live", "replay", "compare", "digital_twin"],
        "env_module": "envs.factory_env",
        "env_class": "FactoryEnv",
        "adapter_module": "web.adapters.factory_adapter",
        "adapter_class": "FactoryAdapter"
    }
}


def get_scenario_metadata(scenario_id: str) -> Dict[str, Any]:
    """Retrieve metadata and live status for a scenario."""
    if scenario_id not in SCENARIOS:
        raise ValueError(f"Unknown scenario: {scenario_id}")

    meta = SCENARIOS[scenario_id].copy()

    # Check environment module availability
    env_available = False
    try:
        mod = importlib.import_module(meta["env_module"])
        if hasattr(mod, meta["env_class"]):
            env_available = True
    except Exception:
        env_available = False

    # Check model availability
    model_found = None
    for p in meta["model_paths"]:
        if os.path.exists(p):
            model_found = p
            break

    # Determine status
    if env_available and model_found:
        status = "live_ready"
        status_label = "LIVE Ready"
    elif env_available:
        status = "baseline_only"
        status_label = "Baseline Ready (Model pending)"
    else:
        status = "coming_soon"
        status_label = "Coming Soon"

    # Check replay existence
    replay_file = f"web/replays/{scenario_id}_s1_wm.json"
    has_replay = os.path.exists(replay_file)

    meta["status"] = status
    meta["status_label"] = status_label
    meta["env_available"] = env_available
    meta["model_available"] = model_found is not None
    meta["active_model_path"] = model_found
    meta["has_replays"] = has_replay

    return meta


def list_scenarios() -> List[Dict[str, Any]]:
    """Return catalog of all scenarios with resolved statuses."""
    return [get_scenario_metadata(sid) for sid in SCENARIOS]

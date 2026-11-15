"""
Scenario Registry and Availability Resolver for World Model Web Application.
"""

import os
import importlib
from typing import Dict, Any, List


SCENARIOS = {
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
        "tagline": "Predicting car dynamics and lead vehicle braking maneuvers.",
        "description": "Continuous road lane-keeping and dynamic lead-vehicle reaction. Designed with a modular adapter hook for teammate expansion.",
        "thumbnail": "results/screenshots/hero_menu.png",
        "variants": [
            {"id": 1, "name": "Highway Lane Keeping (Prototype)", "type": "continuous"}
        ],
        "default_variant": 1,
        "model_paths": ["models/driving_model.pt"],
        "capabilities": ["live", "replay", "compare"],
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

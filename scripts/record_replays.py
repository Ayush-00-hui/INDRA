"""
Pre-Record Offline Demonstration Replays for World Model Web Application.
Generates lightweight, self-contained JSON replay files in web/replays/
that allow the web frontend to run 100% offline without needing a Python backend.
"""

import os
import sys
import json
from typing import List, Dict, Any

# Ensure workspace root in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from web.adapters.robot_adapter import RobotAdapter
from web.adapters.driving_adapter import DrivingAdapter
from web.adapters.factory_adapter import FactoryAdapter


def record_session(adapter, n_steps: int = 150) -> List[Dict[str, Any]]:
    """Step an adapter for n_steps and collect RenderState frames."""
    frames = []
    # Capture initial frame
    frames.append(adapter.get_render_state().model_dump())

    for _ in range(n_steps):
        rs, done = adapter.step()
        frames.append(rs.model_dump())
        if done:
            break

    return frames


def generate_all_replays(output_dir: str = "web/replays") -> None:
    os.makedirs(output_dir, exist_ok=True)
    print("================================================================")
    print("      RECORDING OFFLINE REPLAY SESSIONS FOR WEB APP             ")
    print("================================================================")

    replays = [
        # 1. Robotics Scenario 1: World Model Success
        ("robotics_s1_wm", RobotAdapter(scenario_variant=1, mode="world_model"), 1001, 80),
        # 2. Robotics Scenario 1: Greedy Baseline Failure
        ("robotics_s1_baseline", RobotAdapter(scenario_variant=1, mode="baseline"), 1001, 80),
        # 3. Robotics Scenario 2: World Model Pedestrian Evasion
        ("robotics_s2_wm", RobotAdapter(scenario_variant=2, mode="world_model"), 1005, 80),
        # 4. Robotics Scenario 2: Greedy Baseline Pedestrian Collision
        ("robotics_s2_baseline", RobotAdapter(scenario_variant=2, mode="baseline"), 1005, 80),
        # 5. Driving Scenario 1: Lane Keeping
        ("driving_s1_wm", DrivingAdapter(scenario_variant=1, mode="world_model"), 1001, 100),
        ("driving_s1_baseline", DrivingAdapter(scenario_variant=1, mode="baseline"), 1001, 100),
        # 6. Factory Scenario 1: Line Digital Twin
        ("factory_s1_wm", FactoryAdapter(scenario_variant=1, mode="world_model"), 1001, 80),
        ("factory_s1_baseline", FactoryAdapter(scenario_variant=1, mode="baseline"), 1001, 80),
    ]

    for name, adapter, seed, max_steps in replays:
        print(f"Recording [{name:<25}] (Seed: {seed}, Max Steps: {max_steps})... ", end="", flush=True)
        adapter.reset(seed=seed)
        frames = record_session(adapter, n_steps=max_steps)

        out_path = os.path.join(output_dir, f"{name}.json")
        payload = {
            "version": 1,
            "id": name,
            "scenario": adapter.get_render_state().scenario,
            "mode": adapter.mode,
            "seed": seed,
            "frame_count": len(frames),
            "fps": 30,
            "frames": frames
        }

        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(payload, f, separators=(',', ':'))

        size_kb = os.path.getsize(out_path) / 1024.0
        print(f"DONE ({len(frames)} frames, {size_kb:.1f} KB)")

    print("================================================================")
    print(f"All replays recorded successfully to {output_dir}/")
    print("================================================================")


if __name__ == "__main__":
    generate_all_replays()

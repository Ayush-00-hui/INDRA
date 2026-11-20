"""
Project INDRA — CityForge: Script generate_transitions.py (Phase 6 Simulation Validation & Transition Data Generation).
Validates simulation physics, metric dimensions, LiDAR detection, and MPC action selection
on Scenario 11 (250m x 250m Connaught Place Pilot), then generates a deterministic
smoke-test dataset of 1,000–5,000 transitions adhering strictly to the INDRA World Model schema:
  episode_id, step_index, timestamp_s, map_id, scenario_id, seed,
  state_t, observation_t, action_t, state_t1, observation_t1, dt_s,
  collision, terminated, truncated
"""

import os
import sys
import time
import json
import argparse
from typing import Dict, Any, List, Optional
import numpy as np

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, "..", ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from tools.cityforge.osm_client import load_config, resolve_output_dir, logger
from indra.env import IndraEnv
from indra.planner.indra_mpc import IndraMpcPlanner
from indra.model.model_interface import BaselineKinematicWorldModel


def validate_simulation_environment(env: IndraEnv) -> Dict[str, Any]:
    """Verify coordinate scaling, obstacle collisions, and LiDAR clearance."""
    logger.info("Validating Simulation Preconditions on Scenario 11...")
    checks = {}

    # 1. Metric bounds check
    b = env.scenario.bounds
    width_m = b[2] - b[0]
    height_m = b[3] - b[1]
    checks["bounds_exact_250m"] = (abs(width_m - 250.0) < 1e-3 and abs(height_m - 250.0) < 1e-3)

    # 2. Start position check
    start_pos = env.scenario.robot_start
    checks["start_within_bounds"] = (b[0] <= start_pos[0] <= b[2] and b[1] <= start_pos[1] <= b[3])

    # 3. Collision with initial obstacles check
    obs = env.reset(seed=2026)
    r_state = np.array([env.robot.x, env.robot.y, env.robot.heading, env.robot.v, env.robot.w], dtype=np.float32)
    checks["start_free_of_immediate_collision"] = True
    for actor in env.actors:
        dist = np.hypot(r_state[0] - actor.x, r_state[1] - actor.y)
        if dist < (env.robot.specs.collision_radius_m + actor.radius):
            checks["start_free_of_immediate_collision"] = False
            break

    # 4. LiDAR beam validity
    lidar_readings = env.last_lidar_16
    checks["lidar_16_beams_active"] = (len(lidar_readings) == 16 and all(np.isfinite(lidar_readings)) and all(r >= 0 for r in lidar_readings))

    # 5. MPC action feasibility
    planner = IndraMpcPlanner(horizon=10, num_samples=30)
    wm = BaselineKinematicWorldModel()
    act, p_info = planner.plan(
        world_model=wm,
        current_state=obs,
        goal_x=env.goal_x,
        goal_y=env.goal_y,
        actors=env.actors,
        hazard_zones=env.hazards
    )
    checks["mpc_produces_valid_action"] = (0 <= int(act) < env.ACTION_DIM)

    # 6. Time step stability
    checks["dt_stable"] = (env.dt == 0.1)

    all_passed = all(checks.values())
    checks["all_preconditions_passed"] = all_passed
    return checks


def generate_smoke_transitions(
    config_path: Optional[str] = None,
    target_transitions: int = 1200,
    max_steps_per_episode: int = 150,
    base_seed: int = 2026,
    policy: str = "exploratory",
    epsilon: float = 0.20
) -> Dict[str, Any]:
    """Generate 1,000–5,000 transitions for Scenario 11 in standardized schema."""
    cfg = load_config(config_path)
    out_dir = resolve_output_dir(cfg, PROJECT_ROOT)
    meas_dir = os.path.join(out_dir, "measurements")
    rep_dir = os.path.join(out_dir, "reports")
    os.makedirs(meas_dir, exist_ok=True)
    os.makedirs(rep_dir, exist_ok=True)

    env = IndraEnv(scenario_variant=11, max_steps=max_steps_per_episode, dt=0.1)
    validation_status = validate_simulation_environment(env)
    if not validation_status["all_preconditions_passed"]:
        raise RuntimeError(f"Simulation validation failed: {validation_status}")

    logger.info(f"Generating transition smoke-test dataset (Target: {target_transitions:,} transitions)...")

    planner = IndraMpcPlanner(horizon=10, num_samples=30)
    wm = BaselineKinematicWorldModel()

    # Transition buffers matching exact prompt schema:
    # episode_id, step_index, timestamp_s, map_id, scenario_id, seed,
    # state_t, observation_t, action_t, state_t1, observation_t1, dt_s,
    # collision, terminated, truncated
    b_episode_id: List[int] = []
    b_step_index: List[int] = []
    b_timestamp_s: List[float] = []
    b_map_id: List[str] = []
    b_scenario_id: List[int] = []
    b_seed: List[int] = []
    b_state_t: List[np.ndarray] = []
    b_observation_t: List[np.ndarray] = []
    b_action_t: List[int] = []
    b_state_t1: List[np.ndarray] = []
    b_observation_t1: List[np.ndarray] = []
    b_dt_s: List[float] = []
    b_collision: List[bool] = []
    b_terminated: List[bool] = []
    b_truncated: List[bool] = []

    ep_count = 0
    t0 = time.perf_counter()

    while len(b_episode_id) < target_transitions:
        seed = base_seed + ep_count * 100
        np.random.seed(seed)
        obs = env.reset(seed=seed)
        state_t = np.array([env.robot.x, env.robot.y, env.robot.heading, env.robot.v, env.robot.w], dtype=np.float32)

        for step in range(max_steps_per_episode):
            # Policy selection
            if policy == "random":
                act = int(np.random.randint(0, env.ACTION_DIM))
            elif policy == "exploratory" and np.random.random() < epsilon:
                act = int(np.random.randint(0, env.ACTION_DIM))
            else:
                act, _ = planner.plan(
                    world_model=wm,
                    current_state=obs,
                    goal_x=env.goal_x,
                    goal_y=env.goal_y,
                    actors=env.actors,
                    hazard_zones=env.hazards
                )
                act = int(act)

            next_obs, rew, done, info = env.step(act)
            state_t1 = np.array([env.robot.x, env.robot.y, env.robot.heading, env.robot.v, env.robot.w], dtype=np.float32)

            collision = bool(info.get("collision", False))
            reached_goal = bool(info.get("reached_goal", False))
            terminated = (collision or reached_goal)
            truncated = (step + 1 >= max_steps_per_episode and not terminated)

            # Record transition
            b_episode_id.append(ep_count)
            b_step_index.append(step)
            b_timestamp_s.append(round(step * env.dt, 3))
            b_map_id.append("delhi_cp_v1")
            b_scenario_id.append(11)
            b_seed.append(seed)
            b_state_t.append(state_t)
            b_observation_t.append(obs.astype(np.float32))
            b_action_t.append(act)
            b_state_t1.append(state_t1)
            b_observation_t1.append(next_obs.astype(np.float32))
            b_dt_s.append(round(env.dt, 3))
            b_collision.append(collision)
            b_terminated.append(terminated)
            b_truncated.append(truncated)

            obs = next_obs
            state_t = state_t1

            if len(b_episode_id) >= target_transitions or done:
                break

        ep_count += 1

    total_gathered = len(b_episode_id)
    duration_s = time.perf_counter() - t0
    fps = total_gathered / max(0.001, duration_s)

    # Save to compressed .npz archive
    npz_filename = "delhi_cp_v1_transitions_smoke.npz"
    npz_path = os.path.join(meas_dir, npz_filename)

    np.savez_compressed(
        npz_path,
        episode_id=np.array(b_episode_id, dtype=np.int32),
        step_index=np.array(b_step_index, dtype=np.int32),
        timestamp_s=np.array(b_timestamp_s, dtype=np.float32),
        map_id=np.array(b_map_id),
        scenario_id=np.array(b_scenario_id, dtype=np.int32),
        seed=np.array(b_seed, dtype=np.int32),
        state_t=np.array(b_state_t, dtype=np.float32),
        observation_t=np.array(b_observation_t, dtype=np.float32),
        action_t=np.array(b_action_t, dtype=np.int32),
        state_t1=np.array(b_state_t1, dtype=np.float32),
        observation_t1=np.array(b_observation_t1, dtype=np.float32),
        dt_s=np.array(b_dt_s, dtype=np.float32),
        collision=np.array(b_collision, dtype=bool),
        terminated=np.array(b_terminated, dtype=bool),
        truncated=np.array(b_truncated, dtype=bool),
    )

    # JSON Metadata Sidecar
    meta_filename = "delhi_cp_v1_transitions_smoke_metadata.json"
    meta_path = os.path.join(meas_dir, meta_filename)
    sidecar = {
        "dataset_id": cfg.get("dataset_id", "delhi_cp_v1"),
        "scenario_id": 11,
        "scenario_name": "Connaught Place Real-World Pilot (CityForge)",
        "total_transitions": total_gathered,
        "episodes_count": ep_count,
        "policy": policy,
        "epsilon": epsilon,
        "state_shape": list(np.array(b_state_t).shape[1:]),
        "obs_shape": list(np.array(b_observation_t).shape[1:]),
        "dt_s": 0.1,
        "total_collisions": int(sum(b_collision)),
        "collision_rate_pct": round((sum(b_collision) / max(1, total_gathered)) * 100.0, 2),
        "generation_duration_s": round(duration_s, 2),
        "throughput_transitions_per_sec": round(fps, 1),
        "schema_keys": [
            "episode_id", "step_index", "timestamp_s", "map_id", "scenario_id", "seed",
            "state_t", "observation_t", "action_t", "state_t1", "observation_t1", "dt_s",
            "collision", "terminated", "truncated"
        ],
        "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "output_npz": npz_path
    }
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(sidecar, f, indent=2)

    # Save validation report
    val_report_path = os.path.join(rep_dir, "transitions_validation_report.json")
    val_summary = {
        "validation_checks": validation_status,
        "dataset_summary": sidecar
    }
    with open(val_report_path, "w", encoding="utf-8") as f:
        json.dump(val_summary, f, indent=2)

    print("\n" + "=" * 65)
    print(" [generate_transitions] TRANSITION DATA GENERATION COMPLETE")
    print("=" * 65)
    print(f" Total Transitions:     {total_gathered:,}")
    print(f" Episodes Completed:    {ep_count}")
    print(f" Throughput:            {fps:.1f} trans/sec")
    print(f" Collision Rate:        {sidecar['collision_rate_pct']}%")
    print(f" Output Archive:        {npz_path}")
    print(f" Metadata Sidecar:      {meta_path}")
    print("=" * 65 + "\n")

    return val_summary


def main():
    parser = argparse.ArgumentParser(description="Validate Scenario 11 simulation and collect transition smoke dataset.")
    parser.add_argument("--config", default=None, help="Path to config.yaml")
    parser.add_argument("--transitions", type=int, default=1200, help="Number of transitions to collect (default: 1200)")
    parser.add_argument("--policy", type=str, choices=["expert_mpc", "exploratory", "random"], default="exploratory")
    parser.add_argument("--epsilon", type=float, default=0.20)
    args = parser.parse_args()

    generate_smoke_transitions(
        config_path=args.config,
        target_transitions=args.transitions,
        policy=args.policy,
        epsilon=args.epsilon
    )


if __name__ == "__main__":
    main()

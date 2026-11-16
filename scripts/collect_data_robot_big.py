"""
Multiprocess Large-Scale Dataset Collector for World Model Training.
Collects 500k-1M transitions across training seeds (0-999) using 16-24 parallel workers.
Mix of exploration, greedy navigation, heuristic obstacle detours, and model rollouts.
"""

import os
import sys
import time
import argparse
import multiprocessing as mp
from typing import Tuple, List, Dict, Any
import numpy as np

# Ensure repository root is on PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from envs.robot_env import RobotEnv
from scripts.collect_data_robot import get_greedy_action


def _worker_collect_chunk(args: Tuple[int, int, int, int]) -> Dict[str, np.ndarray]:
    """
    Worker function to collect a chunk of transitions.
    args: (worker_id, scenario, target_samples, base_seed)
    """
    worker_id, scenario, target_samples, base_seed = args
    np.random.seed(base_seed + worker_id * 17)

    env = RobotEnv(scenario=scenario)
    current_seed = (base_seed + worker_id * 31) % 1000
    state = env.reset(seed=current_seed)

    states: List[np.ndarray] = []
    actions: List[int] = []
    next_states: List[np.ndarray] = []
    rewards: List[float] = []

    action_size = env.get_action_size()
    collisions = 0
    goal_reaches = 0

    while len(states) < target_samples:
        roll = np.random.rand()

        if roll < 0.25:
            # 25% pure uniform exploration
            action = np.random.randint(0, action_size)
        elif roll < 0.60:
            # 35% noisy greedy navigation (80% greedy, 20% jitter)
            if np.random.rand() < 0.20:
                action = np.random.randint(0, action_size)
            else:
                action = get_greedy_action(env.robot_x, env.robot_y, env.goal_x, env.goal_y)
        elif roll < 0.85:
            # 25% obstacle detour / tangent navigation
            dx = env.goal_x - env.robot_x
            dy = env.goal_y - env.robot_y
            # Tangent action
            if abs(dx) > abs(dy):
                tangent_actions = [RobotEnv.ACTION_UP, RobotEnv.ACTION_DOWN]
            else:
                tangent_actions = [RobotEnv.ACTION_LEFT, RobotEnv.ACTION_RIGHT]
            action = np.random.choice(tangent_actions)
        else:
            # 15% random walk with directional momentum
            if actions and np.random.rand() < 0.65:
                action = actions[-1]
            else:
                action = np.random.randint(0, action_size)

        next_state, reward, done, info = env.step(action)

        states.append(state)
        actions.append(action)
        next_states.append(next_state)
        rewards.append(reward)

        if info.get("collision", False):
            collisions += 1
        if info.get("reached_goal", False):
            goal_reaches += 1

        if done:
            current_seed = (current_seed + 1) % 1000
            state = env.reset(seed=current_seed)
        else:
            state = next_state

    return {
        "states": np.array(states[:target_samples], dtype=np.float32),
        "actions": np.array(actions[:target_samples], dtype=np.int64),
        "next_states": np.array(next_states[:target_samples], dtype=np.float32),
        "rewards": np.array(rewards[:target_samples], dtype=np.float32),
        "collisions": collisions,
        "goal_reaches": goal_reaches,
    }


def collect_large_dataset(
    n_samples_per_scenario: int = 300000,
    num_workers: int = 16,
    output_dir: str = "data"
) -> None:
    os.makedirs(output_dir, exist_ok=True)
    t0 = time.time()
    scenarios = [1, 2, 3, 4]

    print("=" * 70)
    print("   MULTIPROCESS DIVERSE DATASET COLLECTION FOR ROBOT WORLD MODEL")
    print(f"   Target: {n_samples_per_scenario * len(scenarios):,} transitions across {len(scenarios)} scenarios")
    print(f"   Workers: {num_workers} parallel CPU processes | Scenarios: {scenarios}")
    print("=" * 70)

    scenario_arrays = []

    for scen in scenarios:
        print(f"\n>>> Collecting Scenario {scen} ({n_samples_per_scenario:,} samples)...")
        chunk_size = (n_samples_per_scenario + num_workers - 1) // num_workers
        worker_args = [(w, scen, chunk_size, (w * 53 + scen * 101) % 1000) for w in range(num_workers)]

        with mp.Pool(processes=num_workers) as pool:
            results = pool.map(_worker_collect_chunk, worker_args)

        all_states = np.concatenate([r["states"] for r in results], axis=0)[:n_samples_per_scenario]
        all_actions = np.concatenate([r["actions"] for r in results], axis=0)[:n_samples_per_scenario]
        all_next_states = np.concatenate([r["next_states"] for r in results], axis=0)[:n_samples_per_scenario]
        all_rewards = np.concatenate([r["rewards"] for r in results], axis=0)[:n_samples_per_scenario]
        total_collisions = sum(r["collisions"] for r in results)
        total_goals = sum(r["goal_reaches"] for r in results)

        scen_path = os.path.join(output_dir, f"robot_dataset_big_s{scen}.npz")
        np.savez_compressed(
            scen_path,
            states=all_states,
            actions=all_actions,
            next_states=all_next_states,
            rewards=all_rewards
        )
        print(f"Saved {len(all_states):,} transitions to {scen_path}")
        print(f"  Collisions: {total_collisions:,} ({total_collisions / len(all_states) * 100:.1f}%) | Goal Reaches: {total_goals:,}")
        scenario_arrays.append((all_states, all_actions, all_next_states, all_rewards))

    # Build combined master dataset
    print("\n>>> Building combined master dataset 'data/robot_dataset_big.npz'...")
    comb_states = np.concatenate([s[0] for s in scenario_arrays], axis=0)
    comb_actions = np.concatenate([s[1] for s in scenario_arrays], axis=0)
    comb_next = np.concatenate([s[2] for s in scenario_arrays], axis=0)
    comb_rewards = np.concatenate([s[3] for s in scenario_arrays], axis=0)

    # Also merge with existing historical transitions if available for maximal coverage
    historical_path = os.path.join(output_dir, "robot_dataset_big.npz")
    if os.path.exists(historical_path):
        try:
            h_data = np.load(historical_path)
            h_s = h_data["states"]
            if len(h_s) > 0 and h_s.shape[1] == comb_states.shape[1]:
                print(f"  Merging with {len(h_s):,} existing historical transitions...")
                comb_states = np.concatenate([comb_states, h_data["states"][:500000]], axis=0)
                comb_actions = np.concatenate([comb_actions, h_data["actions"][:500000]], axis=0)
                comb_next = np.concatenate([comb_next, h_data["next_states"][:500000]], axis=0)
                comb_rewards = np.concatenate([comb_rewards, h_data["rewards"][:500000]], axis=0)
        except Exception as e:
            print(f"  Note: historical merge skipped ({e})")

    # Shuffle combined dataset
    perm = np.random.permutation(len(comb_states))
    master_path = os.path.join(output_dir, "robot_dataset_big.npz")
    np.savez_compressed(
        master_path,
        states=comb_states[perm],
        actions=comb_actions[perm],
        next_states=comb_next[perm],
        rewards=comb_rewards[perm]
    )

    elapsed = time.time() - t0
    rate = len(comb_states) / max(elapsed, 0.001)
    print(f"\n Master dataset saved: {master_path}")
    print(f" Total transitions: {len(comb_states):,}")
    print(f" Elapsed wall-clock: {elapsed:.2f}s ({rate:,.0f} transitions/sec)")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Multiprocess data collector for robot world model")
    parser.add_argument("--samples-per-scenario", type=int, default=250000, help="Samples per scenario (default: 250k)")
    parser.add_argument("--workers", type=int, default=16, help="Multiprocessing workers (default: 16)")
    parser.add_argument("--output-dir", type=str, default="data", help="Output directory")
    args = parser.parse_args()

    # mp guard for Windows
    mp.freeze_support()
    collect_large_dataset(
        n_samples_per_scenario=args.samples_per_scenario,
        num_workers=args.workers,
        output_dir=args.output_dir
    )

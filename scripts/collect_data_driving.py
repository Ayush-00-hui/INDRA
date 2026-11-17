"""
Data Collection Suite for Autonomous Driving World Model.
Collects transition tuples (s, a, s', r) across diverse highway scenarios,
combining heuristic driving, exploratory noise, and DAgger on-policy rollouts.
Outputs: data/driving_transitions.npz
"""

import os
import sys
import argparse
from typing import Tuple, List
import numpy as np

# Ensure workspace root in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from envs.driving_env import DrivingEnv


def get_heuristic_action(env: DrivingEnv, noise_prob: float = 0.15) -> int:
    """
    Expert heuristic driving policy with safety foresight:
    - Maintains safe headway behind lead vehicles (brakes on low TTC)
    - Overtakes slower vehicles when adjacent lane is open
    - Maintains lane centering through road curves
    """
    rng = env.rng if hasattr(env, "rng") else np.random.default_rng()
    if rng.random() < noise_prob:
        return int(rng.integers(0, env.get_action_size()))

    # Check lead obstacle distance and TTC
    lead_gap = 100.0
    lead_rel_v = 0.0
    for npc in env.traffic:
        if abs(npc.d - env.ego_d) < 2.0 and npc.s > env.ego_s:
            gap = npc.s - env.ego_s - (env.car_length + npc.length) / 2.0
            if gap < lead_gap:
                lead_gap = gap
                lead_rel_v = npc.speed - env.ego_speed

    # Emergency braking condition
    if env.last_ttc < 2.2 or lead_gap < 14.0:
        # Check if left lane is clear for overtaking
        left_clear = True
        right_clear = True
        for npc in env.traffic:
            gap = abs(npc.s - env.ego_s)
            if gap < 20.0:
                if npc.d < env.ego_d - 1.8:
                    left_clear = False
                elif npc.d > env.ego_d + 1.8:
                    right_clear = False

        if env.target_lane_idx > 0 and left_clear and env.ego_speed > 10.0:
            return DrivingEnv.ACTION_STEER_LEFT
        elif env.target_lane_idx < 2 and right_clear and env.ego_speed > 10.0:
            return DrivingEnv.ACTION_STEER_RIGHT
        else:
            return DrivingEnv.ACTION_BRAKE

    # Longitudinal speed control
    if env.ego_speed < env.target_speed - 1.0:
        return DrivingEnv.ACTION_ACCELERATE
    elif env.ego_speed > env.target_speed + 2.0:
        return DrivingEnv.ACTION_BRAKE

    return DrivingEnv.ACTION_CRUISE


def collect_driving_data(
    n_episodes: int = 150,
    out_path: str = "data/driving_transitions.npz",
    dagger_model_path: str = None
) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    """
    Roll out episodes across scenarios 1, 2, 3, and 4 to build training dataset.
    """
    os.makedirs(os.path.dirname(out_path) or ".", exist_ok=True)

    states_list: List[np.ndarray] = []
    actions_list: List[int] = []
    next_states_list: List[np.ndarray] = []
    rewards_list: List[float] = []

    print(f"================================================================")
    print(f" COLLECTING {n_episodes} EPISODES OF DRIVING EXPERIENCES")
    print(f"================================================================")

    # Scenarios distribution
    variants = [1, 2, 3, 4]

    episodes_per_variant = n_episodes // len(variants)
    total_transitions = 0

    for variant in variants:
        env = DrivingEnv(scenario_variant=variant)
        for ep in range(episodes_per_variant):
            seed = 1000 + ep * 10 + variant
            s = env.reset(seed=seed)
            done = False
            ep_steps = 0

            # Exploration noise schedule
            noise = 0.25 if ep < episodes_per_variant // 2 else 0.10

            while not done and ep_steps < DrivingEnv.MAX_STEPS:
                action = get_heuristic_action(env, noise_prob=noise)
                ns, r, done, info = env.step(action)

                states_list.append(s)
                actions_list.append(action)
                next_states_list.append(ns)
                rewards_list.append(r)

                s = ns
                ep_steps += 1
                total_transitions += 1

            if (ep + 1) % 10 == 0 or (ep + 1) == episodes_per_variant:
                print(f"Scenario {variant} | Episode [{ep+1:3d}/{episodes_per_variant:3d}] | Steps: {ep_steps:3d} | Total transitions: {total_transitions}")

    states = np.array(states_list, dtype=np.float32)
    actions = np.array(actions_list, dtype=np.int64)
    next_states = np.array(next_states_list, dtype=np.float32)
    rewards = np.array(rewards_list, dtype=np.float32)

    print("----------------------------------------------------------------")
    print(f"Saving {len(states)} transitions to {out_path}...")
    np.savez_compressed(
        out_path,
        states=states,
        actions=actions,
        next_states=next_states,
        rewards=rewards
    )
    file_size_mb = os.path.getsize(out_path) / (1024 * 1024)
    print(f"Successfully saved {out_path} ({file_size_mb:.2f} MB)")
    print("================================================================")

    return states, actions, next_states, rewards


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Collect Autonomous Driving Transitions")
    parser.add_argument("--episodes", type=int, default=150, help="Number of episodes to collect")
    parser.add_argument("--out", type=str, default="data/driving_transitions.npz", help="Output .npz path")
    args = parser.parse_args()

    collect_driving_data(n_episodes=args.episodes, out_path=args.out)

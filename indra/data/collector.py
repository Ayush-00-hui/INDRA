"""
Project INDRA: Mode B Batch Transition Collector.
Gathers high-throughput state-action transitions across all 10 Indian urban scenarios
and serializes standardized .npz datasets with JSON sidecars for model training.
"""

import os
import time
import json
from typing import List, Dict, Any, Optional
import numpy as np

from indra.env import IndraEnv
from indra.planner.indra_mpc import IndraMpcPlanner
from indra.model.model_interface import BaselineKinematicWorldModel


class DatasetCollector:
    """
    Mode B Batch Transition Collector for Project INDRA.
    Executes headless rollouts to capture state-action-reward-next_state tuples.
    """

    def __init__(
        self,
        policy: str = "exploratory",
        epsilon: float = 0.20,
        planner_horizon: int = 10,
        planner_samples: int = 25
    ):
        self.policy = policy
        self.epsilon = epsilon
        self.planner_horizon = planner_horizon
        self.planner_samples = planner_samples

        self.obs: List[np.ndarray] = []
        self.actions: List[int] = []
        self.next_obs: List[np.ndarray] = []
        self.rewards: List[float] = []
        self.dones: List[float] = []

        self.baseline_wm = BaselineKinematicWorldModel()
        self.planner = IndraMpcPlanner(horizon=self.planner_horizon, num_samples=self.planner_samples)

    def select_action(self, env: IndraEnv, obs: np.ndarray) -> int:
        """Select action according to specified data collection policy."""
        if self.policy == "random":
            return int(np.random.randint(0, env.ACTION_DIM))

        if self.policy == "exploratory":
            if np.random.random() < self.epsilon:
                return int(np.random.randint(0, env.ACTION_DIM))

        # Default to expert MPC with kinematic baseline
        action, _ = self.planner.plan(
            world_model=self.baseline_wm,
            current_state=obs,
            goal_x=env.goal_x,
            goal_y=env.goal_y,
            actors=env.actors,
            hazard_zones=env.hazards,
        )
        return int(action)

    def collect(
        self,
        scenarios: List[int],
        episodes_per_scenario: int = 1,
        base_seed: int = 2026,
        max_steps_per_episode: int = 150,
        verbose: bool = True
    ) -> Dict[str, Any]:
        """
        Run batch rollouts across requested scenarios.
        """
        t0 = time.perf_counter()
        episodes_completed = 0

        for sc_id in scenarios:
            for ep in range(episodes_per_scenario):
                seed = base_seed + ep * 1000 + sc_id
                np.random.seed(seed)

                env = IndraEnv(scenario_variant=sc_id, max_steps=max_steps_per_episode)
                obs = env.reset(seed=seed)

                for step in range(max_steps_per_episode):
                    act = self.select_action(env, obs)
                    next_obs, rew, done, info = env.step(act)

                    self.obs.append(obs.astype(np.float32))
                    self.actions.append(act)
                    self.next_obs.append(next_obs.astype(np.float32))
                    self.rewards.append(float(rew))
                    self.dones.append(1.0 if done else 0.0)

                    obs = next_obs
                    if done:
                        break

                episodes_completed += 1
                if verbose and episodes_completed % 5 == 0:
                    print(f"  [COLLECTOR] Ep {episodes_completed}/{len(scenarios)*episodes_per_scenario} | "
                          f"Transitions: {len(self.obs):,}")

        duration = time.perf_counter() - t0
        fps = len(self.obs) / max(0.001, duration)

        if verbose:
            print(f"[COLLECTOR COMPLETE] Gathered {len(self.obs):,} transitions in {duration:.2f}s ({fps:.1f} trans/sec)")

        return {
            "total_transitions": len(self.obs),
            "episodes_completed": episodes_completed,
            "scenarios": scenarios,
            "duration_sec": round(duration, 2),
            "transitions_per_sec": round(fps, 1)
        }

    def save_npz(self, output_path: str) -> str:
        """
        Save captured transitions to compressed .npz archive with metadata sidecar.
        """
        out_abs = os.path.abspath(output_path)
        os.makedirs(os.path.dirname(out_abs), exist_ok=True)

        obs_arr = np.array(self.obs, dtype=np.float32)
        actions_arr = np.array(self.actions, dtype=np.int64)
        next_obs_arr = np.array(self.next_obs, dtype=np.float32)
        rewards_arr = np.array(self.rewards, dtype=np.float32)
        dones_arr = np.array(self.dones, dtype=np.float32)

        np.savez_compressed(
            out_abs,
            obs=obs_arr,
            actions=actions_arr,
            next_obs=next_obs_arr,
            rewards=rewards_arr,
            dones=dones_arr
        )

        # Generate metadata sidecar
        if output_path.endswith(".npz"):
            meta_path = output_path[:-4] + "_metadata.json"
        else:
            meta_path = output_path + "_metadata.json"

        metadata = {
            "total_transitions": len(self.obs),
            "obs_dim": int(obs_arr.shape[1]) if len(obs_arr) > 0 else 24,
            "action_dim": 5,
            "policy": self.policy,
            "epsilon": self.epsilon,
            "planner_horizon": self.planner_horizon,
            "planner_samples": self.planner_samples,
            "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "format_version": "1.0.0"
        }

        with open(meta_path, "w", encoding="utf-8") as f:
            json.dump(metadata, f, indent=2)

        return out_abs

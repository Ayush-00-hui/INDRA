"""
Project INDRA: Benchmark Evaluator and Experiment Runner.
Executes batch scenario trials, measures goal success rate, collision metrics,
planning latency, and generates standardized JSON/CSV reports for laptop and DGX Spark.
"""

import time
import json
import math
from typing import Dict, Any, List, Optional
import numpy as np

from indra.env import IndraEnv
from indra.planner.indra_mpc import IndraMpcPlanner
from indra.model.model_interface import BaselineKinematicWorldModel, BaseWorldModelInterface


class IndraBenchmarkEvaluator:
    """
    Standard evaluation harness for Project INDRA.
    """

    def __init__(self, world_model: Optional[BaseWorldModelInterface] = None):
        self.world_model = world_model or BaselineKinematicWorldModel()
        self.planner = IndraMpcPlanner(horizon=12, num_samples=35)

    def evaluate_scenario(
        self,
        scenario_variant: int = 1,
        num_seeds: int = 5,
        start_seed: int = 1001,
        max_steps: int = 300
    ) -> Dict[str, Any]:
        """
        Run repeated trials across deterministic seeds and compile quantitative metrics.
        """
        env = IndraEnv(scenario_variant=scenario_variant, max_steps=max_steps)

        episodes_results: List[Dict[str, Any]] = []
        total_successes = 0
        total_collisions = 0
        total_steps = 0
        total_plan_times = []
        min_obstacle_distances = []

        for seed_idx in range(num_seeds):
            seed = start_seed + seed_idx
            obs = env.reset(seed=seed)
            done = False
            ep_reward = 0.0
            ep_collisions = 0
            ep_steps = 0
            ep_min_obs_dist = float("inf")

            while not done:
                # Run MPC planning with active World Model
                action, plan_info = self.planner.plan(
                    world_model=self.world_model,
                    current_state=obs,
                    goal_x=env.goal_x,
                    goal_y=env.goal_y,
                    actors=env.actors,
                    hazard_zones=env.hazards,
                    hover_seconds=env.hover_timer
                )
                total_plan_times.append(plan_info.get("plan_ms", 1.0))

                # Step environment
                obs, reward, done, info = env.step(action)
                ep_reward += reward
                ep_steps += 1

                if info.get("collision", False):
                    ep_collisions += 1

                # Track clearance
                lidar_min = float(np.min(obs[8:16])) if len(obs) >= 16 else 5.0
                if lidar_min < ep_min_obs_dist:
                    ep_min_obs_dist = lidar_min

            reached_goal = info.get("reached_goal", False)
            if reached_goal:
                total_successes += 1
            total_collisions += ep_collisions
            total_steps += ep_steps
            min_obstacle_distances.append(ep_min_obs_dist)

            episodes_results.append({
                "seed": seed,
                "success": reached_goal,
                "collisions": ep_collisions,
                "steps": ep_steps,
                "reward": round(ep_reward, 2),
                "min_obstacle_dist_m": round(ep_min_obs_dist, 2)
            })

        summary = {
            "scenario_variant": scenario_variant,
            "scenario_name": env.scenario.name if env.scenario else f"Variant {scenario_variant}",
            "num_trials": num_seeds,
            "success_rate_pct": round((total_successes / max(1, num_seeds)) * 100.0, 1),
            "mean_collisions": round(total_collisions / max(1, num_seeds), 2),
            "mean_steps": round(total_steps / max(1, num_seeds), 1),
            "mean_plan_latency_ms": round(float(np.mean(total_plan_times)) if total_plan_times else 0.0, 2),
            "min_obstacle_clearance_m": round(float(np.min(min_obstacle_distances)) if min_obstacle_distances else 0.0, 2),
            "world_model_metadata": self.world_model.get_model_metadata(),
            "trial_details": episodes_results
        }

        return summary

    def evaluate_suite(
        self,
        scenarios: List[int],
        num_seeds: int = 3,
        start_seed: int = 1001,
        max_steps: int = 250
    ) -> Dict[str, Any]:
        """Run benchmark evaluation across multiple scenario variants."""
        suite_start_t = time.time()
        results_by_scenario = []
        overall_successes = 0
        overall_trials = 0
        overall_collisions = 0

        for sc_id in scenarios:
            res = self.evaluate_scenario(
                scenario_variant=sc_id,
                num_seeds=num_seeds,
                start_seed=start_seed,
                max_steps=max_steps
            )
            results_by_scenario.append(res)
            succ_count = sum(1 for ep in res["trial_details"] if ep["success"])
            coll_count = sum(ep["collisions"] for ep in res["trial_details"])
            overall_successes += succ_count
            overall_trials += len(res["trial_details"])
            overall_collisions += coll_count

        total_duration_s = round(time.time() - suite_start_t, 2)
        suite_summary = {
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "total_duration_seconds": total_duration_s,
            "overall_trials": overall_trials,
            "overall_success_rate_pct": round((overall_successes / max(1, overall_trials)) * 100.0, 1),
            "overall_mean_collisions": round(overall_collisions / max(1, overall_trials), 2),
            "world_model": self.world_model.get_model_metadata(),
            "scenarios": results_by_scenario
        }
        return suite_summary

    @staticmethod
    def export_json(report: Dict[str, Any], filepath: str) -> None:
        """Export benchmark summary to formatted JSON."""
        import os
        os.makedirs(os.path.dirname(os.path.abspath(filepath)), exist_ok=True)
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2)

    @staticmethod
    def export_csv(report: Dict[str, Any], filepath: str) -> None:
        """Export scenario performance rows to CSV."""
        import os
        import csv
        os.makedirs(os.path.dirname(os.path.abspath(filepath)), exist_ok=True)
        with open(filepath, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow([
                "scenario_variant",
                "scenario_name",
                "trials",
                "success_rate_pct",
                "mean_collisions",
                "mean_steps",
                "mean_plan_latency_ms",
                "min_clearance_m"
            ])
            for sc in report.get("scenarios", []):
                writer.writerow([
                    sc["scenario_variant"],
                    sc["scenario_name"],
                    sc["num_trials"],
                    sc["success_rate_pct"],
                    sc["mean_collisions"],
                    sc["mean_steps"],
                    sc["mean_plan_latency_ms"],
                    sc["min_obstacle_clearance_m"]
                ])

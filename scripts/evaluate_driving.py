"""
Multi-Baseline Evaluation Suite for Autonomous Driving.
Benchmarks Random, Reactive PID/IDM, and World Model MPC across 50 seeded layouts (1000-1049).
Generates results/driving_results.csv and results/driving_comparison.png.
"""

import os
import sys
import time
import argparse
from typing import Dict, Any, List
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

# Ensure workspace root in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from envs.driving_env import DrivingEnv
from model.world_model import load_model, WorldModel
from planner.mpc import plan


def run_episode(
    env: DrivingEnv,
    policy_name: str,
    seed: int,
    model: WorldModel = None
) -> Dict[str, Any]:
    """Run a single seeded evaluation episode."""
    s = env.reset(seed=seed)
    done = False
    ep_reward = 0.0
    ep_steps = 0
    collisions = 0
    offsets: List[float] = []
    jerks: List[float] = []
    ttcs: List[float] = []
    last_act = DrivingEnv.ACTION_CRUISE

    while not done and ep_steps < DrivingEnv.MAX_STEPS:
        if policy_name == "Random":
            action = int(env.rng.integers(0, env.get_action_size()))

        elif policy_name == "Reactive Baseline":
            # Reactive rule-based baseline: only reacts when lead vehicle is critically close
            # Reactive heuristics frequently fail during high-speed sudden braking due to lack of foresight
            lead_gap = 100.0
            for npc in env.traffic:
                if abs(npc.d - env.ego_d) < 2.0 and npc.s > env.ego_s:
                    gap = npc.s - env.ego_s - (env.car_length + npc.length) / 2.0
                    if gap < lead_gap:
                        lead_gap = gap

            # Reactive brake triggers only when dangerously close (<10m or TTC < 1.2s)
            if env.last_ttc < 1.2 or lead_gap < 10.0:
                action = DrivingEnv.ACTION_BRAKE
            else:
                # Basic lane centering
                target_d = env.road.get_lane_center_d(env.target_lane_idx)
                lat_dev = env.ego_d - target_d
                if lat_dev > 0.40:
                    action = DrivingEnv.ACTION_STEER_LEFT
                elif lat_dev < -0.40:
                    action = DrivingEnv.ACTION_STEER_RIGHT
                elif env.ego_speed < env.target_speed:
                    action = DrivingEnv.ACTION_ACCELERATE
                else:
                    action = DrivingEnv.ACTION_CRUISE

        elif policy_name == "World Model MPC":
            if model is not None:
                action = plan(
                    model=model,
                    state=s,
                    action_size=env.get_action_size(),
                    horizon=14,
                    n_samples=300,
                    gamma=0.95,
                    last_action=last_act
                )
            else:
                action = DrivingEnv.ACTION_CRUISE
        else:
            action = DrivingEnv.ACTION_CRUISE

        ns, r, done, info = env.step(action)
        ep_reward += r
        ep_steps += 1
        last_act = action

        if info.get("collision", False):
            collisions += 1

        offsets.append(info.get("lane_offset", 0.0))
        jerks.append(info.get("jerk", 0.0))
        ttcs.append(min(10.0, info.get("ttc", 10.0)))
        s = ns

    success = bool(info.get("reached_goal", False) and collisions == 0 and not info.get("offroad", False))

    return {
        "success": success,
        "collisions": collisions,
        "steps": ep_steps,
        "reward": ep_reward,
        "mean_offset": float(np.mean(offsets)) if offsets else 0.0,
        "mean_jerk": float(np.mean(jerks)) if jerks else 0.0,
        "mean_ttc": float(np.mean(ttcs)) if ttcs else 10.0
    }


def evaluate_driving_all(
    n_episodes: int = 50,
    model_path: str = "models/driving_model.pt",
    scenario_variant: int = 2,
    out_dir: str = "results"
) -> pd.DataFrame:
    os.makedirs(out_dir, exist_ok=True)
    seeds = list(range(1000, 1000 + n_episodes))

    model = None
    if os.path.exists(model_path):
        model = load_model(model_path, state_size=16, action_size=5)
        print(f"Loaded World Model from {model_path}")
    else:
        print(f"Warning: {model_path} not found! Run train_driving.py first.")

    policies = ["Random", "Reactive Baseline", "World Model MPC"]
    summary_rows = []

    print("================================================================")
    print(f"  BENCHMARKING DRIVING POLICIES ({n_episodes} SEEDED EPISODES)")
    print(f"  Scenario Variant: {scenario_variant} | Seeds: 1000 - {1000 + n_episodes - 1}")
    print("================================================================")

    for pol in policies:
        print(f"Evaluating Policy: [{pol:<18}] ... ", end="", flush=True)
        env = DrivingEnv(scenario_variant=scenario_variant)

        ep_results = []
        t0 = time.perf_counter()
        for seed in seeds:
            res = run_episode(env, pol, seed, model=model)
            ep_results.append(res)
        elapsed = time.perf_counter() - t0

        total_steps = sum(r["steps"] for r in ep_results)
        total_collisions = sum(r["collisions"] for r in ep_results)
        success_rate = 100.0 * sum(1 for r in ep_results if r["success"]) / len(ep_results)
        col_per_100 = (total_collisions / max(1, total_steps)) * 100.0
        mean_offset = float(np.mean([r["mean_offset"] for r in ep_results]))
        mean_jerk = float(np.mean([r["mean_jerk"] for r in ep_results]))
        mean_ttc = float(np.mean([r["mean_ttc"] for r in ep_results]))
        mean_reward = float(np.mean([r["reward"] for r in ep_results]))

        print(f"DONE ({elapsed:.1f}s) | Success: {success_rate:5.1f}% | Collisions/100: {col_per_100:5.2f} | Offset: {mean_offset:4.2f}m")

        summary_rows.append({
            "Policy": pol,
            "Success Rate (%)": round(success_rate, 1),
            "Collisions / 100 Steps": round(col_per_100, 2),
            "Mean Lane Offset (m)": round(mean_offset, 3),
            "Mean Jerk (m/s3)": round(mean_jerk, 2),
            "Mean TTC (s)": round(mean_ttc, 2),
            "Mean Reward": round(mean_reward, 1)
        })

    df = pd.DataFrame(summary_rows)
    csv_path = os.path.join(out_dir, "driving_results.csv")
    df.to_csv(csv_path, index=False)
    print("----------------------------------------------------------------")
    print(f"Saved evaluation benchmark table to {csv_path}")

    # Plot comparison chart
    fig, axes = plt.subplots(1, 4, figsize=(18, 4.5))
    fig.patch.set_facecolor("#0b0f19")

    colors = ["#94a3b8", "#f43f5e", "#10b981"]

    # 1. Success Rate
    ax1 = axes[0]
    ax1.set_facecolor("#111827")
    bars1 = ax1.bar(df["Policy"], df["Success Rate (%)"], color=colors, width=0.55)
    ax1.set_title("Success Rate (%)", color="#f8fafc", fontsize=12, fontweight="bold")
    ax1.set_ylim(0, 105)
    ax1.tick_params(colors="#94a3b8", labelsize=9)
    ax1.grid(color="#1f2937", linestyle="--", alpha=0.7)
    for bar in bars1:
        yval = bar.get_height()
        ax1.text(bar.get_x() + bar.get_width()/2.0, yval + 2.0, f"{yval:.1f}%", ha='center', va='bottom', color="#f8fafc", fontweight="bold", fontsize=10)

    # 2. Collision Frequency
    ax2 = axes[1]
    ax2.set_facecolor("#111827")
    bars2 = ax2.bar(df["Policy"], df["Collisions / 100 Steps"], color=colors, width=0.55)
    ax2.set_title("Collisions / 100 Steps", color="#f8fafc", fontsize=12, fontweight="bold")
    ax2.tick_params(colors="#94a3b8", labelsize=9)
    ax2.grid(color="#1f2937", linestyle="--", alpha=0.7)
    for bar in bars2:
        yval = bar.get_height()
        ax2.text(bar.get_x() + bar.get_width()/2.0, yval + 0.1, f"{yval:.2f}", ha='center', va='bottom', color="#f8fafc", fontweight="bold", fontsize=10)

    # 3. Mean Lane Offset
    ax3 = axes[2]
    ax3.set_facecolor("#111827")
    bars3 = ax3.bar(df["Policy"], df["Mean Lane Offset (m)"], color=colors, width=0.55)
    ax3.set_title("Mean Lane Offset (m)", color="#f8fafc", fontsize=12, fontweight="bold")
    ax3.tick_params(colors="#94a3b8", labelsize=9)
    ax3.grid(color="#1f2937", linestyle="--", alpha=0.7)
    for bar in bars3:
        yval = bar.get_height()
        ax3.text(bar.get_x() + bar.get_width()/2.0, yval + 0.02, f"{yval:.2f}m", ha='center', va='bottom', color="#f8fafc", fontweight="bold", fontsize=10)

    # 4. Mean TTC (Safety Margin)
    ax4 = axes[3]
    ax4.set_facecolor("#111827")
    bars4 = ax4.bar(df["Policy"], df["Mean TTC (s)"], color=colors, width=0.55)
    ax4.set_title("Mean Headway TTC (s)", color="#f8fafc", fontsize=12, fontweight="bold")
    ax4.tick_params(colors="#94a3b8", labelsize=9)
    ax4.grid(color="#1f2937", linestyle="--", alpha=0.7)
    for bar in bars4:
        yval = bar.get_height()
        ax4.text(bar.get_x() + bar.get_width()/2.0, yval + 0.1, f"{yval:.2f}s", ha='center', va='bottom', color="#f8fafc", fontweight="bold", fontsize=10)

    plt.tight_layout()
    plot_path = os.path.join(out_dir, "driving_comparison.png")
    plt.savefig(plot_path, dpi=200, facecolor=fig.get_facecolor(), edgecolor="none")
    plt.close()
    print(f"Saved benchmark visualization to {plot_path}")
    print("================================================================")

    return df


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate Driving Policies")
    parser.add_argument("--episodes", type=int, default=50)
    parser.add_argument("--model", type=str, default="models/driving_model.pt")
    parser.add_argument("--scenario", type=int, default=2)
    parser.add_argument("--out", type=str, default="results")
    args = parser.parse_args()

    evaluate_driving_all(
        n_episodes=args.episodes,
        model_path=args.model,
        scenario_variant=args.scenario,
        out_dir=args.out
    )

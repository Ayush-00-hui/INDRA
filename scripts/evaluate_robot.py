import os
import sys
import argparse
import time
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Ensure root directory is on PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from envs.robot_env import RobotEnv
from model.world_model import load_model
from planner.mpc import plan
from scripts.collect_data_robot import get_greedy_action


def run_evaluation(
    model_path: str = "models/robot_model.pt",
    scenario: int = 1,
    n_episodes: int = 50,
    base_seed: int = 1000,
    csv_output: str = "results/robot_results.csv",
    chart_output: str = "results/robot_comparison.png"
) -> pd.DataFrame:
    """
    Benchmark World Model MPC Planner against Greedy Baseline across identical seeded episodes.
    
    Metrics:
    - Success Rate (% of episodes reaching goal within 200 steps)
    - Average Collisions per episode
    - Average Steps to Goal (for successful runs)
    """
    print(f"================================================================")
    print(f" EVALUATING ROBOTICS SCENARIO {scenario} OVER {n_episodes} EPISODES")
    print(f"================================================================")

    model = load_model(model_path, state_size=16, action_size=5)

    methods = ["Greedy Baseline (No Model)", "World Model + MPC Planner"]
    results = {
        m: {
            "successes": 0,
            "total_collisions": 0,
            "successful_steps": [],
            "episode_details": []
        }
        for m in methods
    }

    env = RobotEnv(scenario=scenario)

    t_eval_start = time.time()

    for ep in range(n_episodes):
        seed = base_seed + ep

        # -------------------------------------------------------------
        # 1. Greedy Baseline Evaluation
        # -------------------------------------------------------------
        env.reset(seed=seed)
        g_collisions = 0
        g_reached = False
        g_steps = 0

        for _ in range(env.MAX_STEPS):
            act_g = get_greedy_action(env.robot_x, env.robot_y, env.goal_x, env.goal_y)
            _, _, done_g, info_g = env.step(act_g)
            g_steps += 1
            if info_g["collision"]:
                g_collisions += 1
            if done_g:
                g_reached = info_g["reached_goal"]
                break

        res_g = results["Greedy Baseline (No Model)"]
        if g_reached:
            res_g["successes"] += 1
            res_g["successful_steps"].append(g_steps)
        res_g["total_collisions"] += g_collisions
        res_g["episode_details"].append({"seed": seed, "success": g_reached, "collisions": g_collisions, "steps": g_steps})

        # -------------------------------------------------------------
        # 2. World Model MPC Evaluation
        # -------------------------------------------------------------
        state_wm = env.reset(seed=seed)
        wm_collisions = 0
        wm_reached = False
        wm_steps = 0

        for _ in range(env.MAX_STEPS):
            act_wm = plan(
                model=model,
                state=state_wm,
                action_size=env.get_action_size(),
                horizon=14,
                n_samples=300,
                gamma=0.95,
                return_trajectories=False
            )
            state_wm, _, done_wm, info_wm = env.step(act_wm)
            wm_steps += 1
            if info_wm["collision"]:
                wm_collisions += 1
            if done_wm:
                wm_reached = info_wm["reached_goal"]
                break

        res_wm = results["World Model + MPC Planner"]
        if wm_reached:
            res_wm["successes"] += 1
            res_wm["successful_steps"].append(wm_steps)
        res_wm["total_collisions"] += wm_collisions
        res_wm["episode_details"].append({"seed": seed, "success": wm_reached, "collisions": wm_collisions, "steps": wm_steps})

        if (ep + 1) % 10 == 0 or ep == 0:
            print(f"Episode [{ep+1:2d}/{n_episodes}] | Greedy: Success={g_reached}, Hits={g_collisions:3d} | WM MPC: Success={wm_reached}, Hits={wm_collisions:3d}")

    total_eval_time = time.time() - t_eval_start
    print(f"\nEvaluation completed in {total_eval_time:.1f} seconds.\n")

    # -----------------------------------------------------------------
    # Compute Aggregated Metrics
    # -----------------------------------------------------------------
    summary_data = []
    for m in methods:
        succ_rate = (results[m]["successes"] / n_episodes) * 100.0
        avg_coll = results[m]["total_collisions"] / n_episodes
        steps_list = results[m]["successful_steps"]
        avg_steps = np.mean(steps_list) if len(steps_list) > 0 else float("nan")

        summary_data.append({
            "Method": m,
            "Success Rate (%)": succ_rate,
            "Avg Collisions": avg_coll,
            "Avg Steps (Successful)": avg_steps,
            "Total Successes": results[m]["successes"],
            "Total Episodes": n_episodes
        })

    df_summary = pd.DataFrame(summary_data)

    # Print Formatted Table
    print("=" * 76)
    print(f"{'Method':<30} | {'Success Rate':<14} | {'Avg Collisions':<14} | {'Avg Steps':<10}")
    print("-" * 76)
    for _, row in df_summary.iterrows():
        print(f"{row['Method']:<30} | {row['Success Rate (%)']:>12.1f}% | {row['Avg Collisions']:>14.2f} | {row['Avg Steps (Successful)']:>9.1f}")
    print("=" * 76)

    # Save to CSV
    os.makedirs(os.path.dirname(os.path.abspath(csv_output)), exist_ok=True)
    df_summary.to_csv(csv_output, index=False)
    print(f"\nSaved evaluation metrics to {csv_output}")

    # -----------------------------------------------------------------
    # Generate Comparison Bar Chart
    # -----------------------------------------------------------------
    os.makedirs(os.path.dirname(os.path.abspath(chart_output)), exist_ok=True)
    fig, axes = plt.subplots(1, 3, figsize=(14, 5))

    bar_colors = ["#e74c3c", "#2ecc71"]  # Red for Greedy, Green for World Model

    # 1. Success Rate
    axes[0].bar(df_summary["Method"], df_summary["Success Rate (%)"], color=bar_colors, width=0.55)
    axes[0].set_title("Success Rate (%) [Higher is Better]", fontsize=12, fontweight="bold")
    axes[0].set_ylabel("Success Rate (%)")
    axes[0].set_ylim(0, 105)
    axes[0].grid(axis="y", linestyle=":", alpha=0.7)
    for idx, v in enumerate(df_summary["Success Rate (%)"]):
        axes[0].text(idx, v + 2, f"{v:.1f}%", ha="center", fontweight="bold")

    # 2. Average Collisions
    axes[1].bar(df_summary["Method"], df_summary["Avg Collisions"], color=bar_colors, width=0.55)
    axes[1].set_title("Avg Collisions [Lower is Better]", fontsize=12, fontweight="bold")
    axes[1].set_ylabel("Collisions / Episode")
    axes[1].grid(axis="y", linestyle=":", alpha=0.7)
    for idx, v in enumerate(df_summary["Avg Collisions"]):
        axes[1].text(idx, v + 1, f"{v:.1f}", ha="center", fontweight="bold")

    # 3. Average Steps to Goal
    axes[2].bar(df_summary["Method"], df_summary["Avg Steps (Successful)"], color=bar_colors, width=0.55)
    axes[2].set_title("Avg Steps to Goal (Successful)", fontsize=12, fontweight="bold")
    axes[2].set_ylabel("Steps")
    axes[2].grid(axis="y", linestyle=":", alpha=0.7)
    for idx, v in enumerate(df_summary["Avg Steps (Successful)"]):
        val_str = f"{v:.1f}" if not np.isnan(v) else "N/A"
        axes[2].text(idx, (v if not np.isnan(v) else 0) + 1, val_str, ha="center", fontweight="bold")

    for ax in axes:
        ax.set_xticks(range(len(df_summary["Method"])))
        ax.set_xticklabels(["Greedy\nBaseline", "World Model\nMPC"], fontsize=11)

    plt.suptitle(f"World Model vs Baseline: Robotics Scenario {scenario} ({n_episodes} Episodes)", fontsize=14, fontweight="bold")
    plt.tight_layout()
    plt.savefig(chart_output, dpi=150)
    plt.close()
    print(f"Saved comparison chart to {chart_output}")

    return df_summary


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate World Model MPC against Greedy Baseline.")
    parser.add_argument("--model", type=str, default="models/robot_model.pt", help="Path to trained model.")
    parser.add_argument("--scenario", type=int, default=1, help="Scenario (1=static chair, 2=moving person).")
    parser.add_argument("--episodes", type=int, default=50, help="Number of benchmark episodes.")
    parser.add_argument("--seed", type=int, default=1000, help="Base random seed.")
    parser.add_argument("--csv", type=str, default="results/robot_results.csv", help="CSV output path.")
    parser.add_argument("--chart", type=str, default="results/robot_comparison.png", help="Chart output path.")
    args = parser.parse_args()

    run_evaluation(
        model_path=args.model,
        scenario=args.scenario,
        n_episodes=args.episodes,
        base_seed=args.seed,
        csv_output=args.csv,
        chart_output=args.chart
    )

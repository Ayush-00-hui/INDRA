import os
import sys
import argparse
import time
import copy
from typing import Dict, Any, List, Optional, Tuple
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Ensure root directory is on PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from envs.robot_env import RobotEnv
from model.world_model import load_model, WorldModel
from planner.mpc import plan
from scripts.collect_data_robot import get_greedy_action


def get_greedy_with_unstick_action(
    env: RobotEnv,
    consecutive_collisions: int,
    last_action: int
) -> int:
    """
    Greedy policy with an evasion/unstick mechanism:
    If blocked for 2 or more consecutive steps, take a perpendicular evasive action.
    """
    if consecutive_collisions < 2:
        return get_greedy_action(env.robot_x, env.robot_y, env.goal_x, env.goal_y)

    # Perpendicular action selection
    dx = env.goal_x - env.robot_x
    dy = env.goal_y - env.robot_y

    if last_action in (RobotEnv.ACTION_LEFT, RobotEnv.ACTION_RIGHT):
        # Was moving horizontal; try vertical unstick
        if dy > 0:
            return RobotEnv.ACTION_DOWN
        elif dy < 0:
            return RobotEnv.ACTION_UP
        else:
            return np.random.choice([RobotEnv.ACTION_UP, RobotEnv.ACTION_DOWN])
    else:
        # Was moving vertical; try horizontal unstick
        if dx > 0:
            return RobotEnv.ACTION_RIGHT
        elif dx < 0:
            return RobotEnv.ACTION_LEFT
        else:
            return np.random.choice([RobotEnv.ACTION_LEFT, RobotEnv.ACTION_RIGHT])


def run_oracle_mpc_plan(
    env: RobotEnv,
    horizon: int = 14,
    n_samples: int = 150,
    gamma: float = 0.95
) -> int:
    """
    Oracle-MPC: Evaluates candidate action sequences directly against ground-truth environment physics.
    Serves as the theoretical upper bound for any model-based predictive controller.
    """
    action_size = env.get_action_size()
    best_action = RobotEnv.ACTION_STAY
    best_return = -1e9

    # Generate candidate sequences (straight, L-turns, and persistent random walks)
    seqs = []
    # Straight lines
    for a in range(action_size):
        seqs.append([a] * horizon)
    # L-turns
    for a1 in range(action_size):
        for a2 in range(action_size):
            if a1 != a2:
                for k in [2, 4, 6, 8]:
                    if k < horizon:
                        seqs.append([a1] * k + [a2] * (horizon - k))
    # Random persistent sequences
    while len(seqs) < n_samples:
        chunk = np.random.randint(2, 5)
        seq = []
        for _ in range(0, horizon, chunk):
            act = np.random.randint(0, action_size)
            seq.extend([act] * chunk)
        seqs.append(seq[:horizon])

    # Evaluate each candidate sequence in a lightweight ground-truth simulator copy
    for seq in seqs:
        # Clone environment geometry
        rx, ry = env.robot_x, env.robot_y
        cum_reward = 0.0
        discount = 1.0

        for a in seq:
            dx, dy = env.ACTION_DELTAS.get(a, (0.0, 0.0))
            cand_x = rx + dx
            cand_y = ry + dy
            prev_dist = np.hypot(rx - env.goal_x, ry - env.goal_y)

            # Ground truth collision test
            is_collision = False
            margin = env.ROBOT_RADIUS + 5.0
            if (cand_x < margin or cand_x > env.WIDTH - margin or
                    cand_y < margin or cand_y > env.HEIGHT - margin):
                is_collision = True
            else:
                for obs in env.obstacles:
                    closest_x = max(obs.x, min(cand_x, obs.x + obs.width))
                    closest_y = max(obs.y, min(cand_y, obs.y + obs.height))
                    dist = np.hypot(cand_x - closest_x, cand_y - closest_y)
                    if dist < env.ROBOT_RADIUS:
                        is_collision = True
                        break

            if is_collision:
                curr_dist = prev_dist
                r = -10.01
            else:
                rx, ry = cand_x, cand_y
                curr_dist = np.hypot(rx - env.goal_x, ry - env.goal_y)
                r = ((prev_dist - curr_dist) / env.STEP_SIZE) - 0.01

            if curr_dist < (env.ROBOT_RADIUS + env.GOAL_RADIUS):
                r += 20.0

            cum_reward += discount * r
            discount *= gamma

        if cum_reward > best_return:
            best_return = cum_reward
            best_action = seq[0]

    return best_action


def run_evaluation(
    model_path: str = "models/robot_model.pt",
    scenario: int = 1,
    n_episodes: int = 50,
    base_seed: int = 1000,
    csv_output: str = "results/robot_results.csv",
    chart_output: str = "results/robot_comparison.png"
) -> pd.DataFrame:
    """
    Comprehensive multi-baseline evaluation across identical seeded layouts.
    
    Evaluates:
      1. Random Policy
      2. Greedy Baseline (No Model)
      3. Greedy-with-Unstick Baseline
      4. World Model + MPC Planner
      5. Oracle-MPC (Theoretical Upper Bound)
    """
    print(f"================================================================")
    print(f" EVALUATING ROBOTICS SCENARIO {scenario} OVER {n_episodes} EPISODES")
    print(f" (Seeds: {base_seed} to {base_seed + n_episodes - 1})")
    print(f"================================================================")

    model = load_model(model_path, state_size=16, action_size=5)

    methods = [
        "Random",
        "Greedy",
        "Greedy-with-unstick",
        "World Model MPC",
        "Oracle-MPC (Upper Bound)"
    ]

    stats = {
        m: {
            "successes": 0,
            "total_collisions": 0,
            "total_steps": 0,
            "successful_steps": []
        }
        for m in methods
    }

    env = RobotEnv(scenario=scenario)
    t_start = time.time()

    for ep in range(n_episodes):
        seed = base_seed + ep

        # -------------------------------------------------------------
        # 1. Random Policy
        # -------------------------------------------------------------
        env.reset(seed=seed)
        r_hits, r_steps, r_goal = 0, 0, False
        for _ in range(env.MAX_STEPS):
            act = np.random.randint(0, env.get_action_size())
            _, _, done, info = env.step(act)
            r_steps += 1
            if info["collision"]: r_hits += 1
            if done:
                r_goal = info["reached_goal"]
                break
        stats["Random"]["total_collisions"] += r_hits
        stats["Random"]["total_steps"] += r_steps
        if r_goal:
            stats["Random"]["successes"] += 1
            stats["Random"]["successful_steps"].append(r_steps)

        # -------------------------------------------------------------
        # 2. Greedy Baseline
        # -------------------------------------------------------------
        env.reset(seed=seed)
        g_hits, g_steps, g_goal = 0, 0, False
        for _ in range(env.MAX_STEPS):
            act = get_greedy_action(env.robot_x, env.robot_y, env.goal_x, env.goal_y)
            _, _, done, info = env.step(act)
            g_steps += 1
            if info["collision"]: g_hits += 1
            if done:
                g_goal = info["reached_goal"]
                break
        stats["Greedy"]["total_collisions"] += g_hits
        stats["Greedy"]["total_steps"] += g_steps
        if g_goal:
            stats["Greedy"]["successes"] += 1
            stats["Greedy"]["successful_steps"].append(g_steps)

        # -------------------------------------------------------------
        # 3. Greedy-with-unstick
        # -------------------------------------------------------------
        env.reset(seed=seed)
        u_hits, u_steps, u_goal = 0, 0, False
        blocked_count = 0
        last_act = RobotEnv.ACTION_STAY
        for _ in range(env.MAX_STEPS):
            act = get_greedy_with_unstick_action(env, blocked_count, last_act)
            _, _, done, info = env.step(act)
            u_steps += 1
            last_act = act
            if info["collision"]:
                u_hits += 1
                blocked_count += 1
            else:
                blocked_count = 0
            if done:
                u_goal = info["reached_goal"]
                break
        stats["Greedy-with-unstick"]["total_collisions"] += u_hits
        stats["Greedy-with-unstick"]["total_steps"] += u_steps
        if u_goal:
            stats["Greedy-with-unstick"]["successes"] += 1
            stats["Greedy-with-unstick"]["successful_steps"].append(u_steps)

        # -------------------------------------------------------------
        # 4. World Model MPC
        # -------------------------------------------------------------
        s_wm = env.reset(seed=seed)
        wm_hits, wm_steps, wm_goal = 0, 0, False
        for _ in range(env.MAX_STEPS):
            act = plan(model, s_wm, action_size=env.get_action_size(), horizon=14, n_samples=300, gamma=0.95)
            s_wm, _, done, info = env.step(act)
            wm_steps += 1
            if info["collision"]: wm_hits += 1
            if done:
                wm_goal = info["reached_goal"]
                break
        stats["World Model MPC"]["total_collisions"] += wm_hits
        stats["World Model MPC"]["total_steps"] += wm_steps
        if wm_goal:
            stats["World Model MPC"]["successes"] += 1
            stats["World Model MPC"]["successful_steps"].append(wm_steps)

        # -------------------------------------------------------------
        # 5. Oracle-MPC (Ground-Truth Upper Bound)
        # -------------------------------------------------------------
        env.reset(seed=seed)
        o_hits, o_steps, o_goal = 0, 0, False
        for _ in range(env.MAX_STEPS):
            act = run_oracle_mpc_plan(env, horizon=14, n_samples=150, gamma=0.95)
            _, _, done, info = env.step(act)
            o_steps += 1
            if info["collision"]: o_hits += 1
            if done:
                o_goal = info["reached_goal"]
                break
        stats["Oracle-MPC (Upper Bound)"]["total_collisions"] += o_hits
        stats["Oracle-MPC (Upper Bound)"]["total_steps"] += o_steps
        if o_goal:
            stats["Oracle-MPC (Upper Bound)"]["successes"] += 1
            stats["Oracle-MPC (Upper Bound)"]["successful_steps"].append(o_steps)

        if (ep + 1) % 10 == 0 or ep == 0:
            print(f"Ep [{ep+1:2d}/{n_episodes}] | Greedy: {g_goal} (Hits={g_hits:3d}) | Unstick: {u_goal} (Hits={u_hits:3d}) | WM: {wm_goal} (Hits={wm_hits:3d}) | Oracle: {o_goal} (Hits={o_hits:3d})")

    elapsed = time.time() - t_start
    print(f"\nEvaluation finished in {elapsed:.1f} seconds.\n")

    # Aggregate Metrics
    summary = []
    for m in methods:
        succ_rate = (stats[m]["successes"] / n_episodes) * 100.0
        mean_coll = stats[m]["total_collisions"] / n_episodes
        tot_steps = max(1, stats[m]["total_steps"])
        coll_per_100 = (stats[m]["total_collisions"] / tot_steps) * 100.0
        steps_list = stats[m]["successful_steps"]
        mean_steps = np.mean(steps_list) if len(steps_list) > 0 else float("nan")

        summary.append({
            "Method": m,
            "Success Rate (%)": succ_rate,
            "Mean Collisions / Ep": mean_coll,
            "Collisions / 100 Steps": coll_per_100,
            "Mean Steps to Goal": mean_steps,
            "Successes": stats[m]["successes"],
            "Total Episodes": n_episodes
        })

    df = pd.DataFrame(summary)

    # Print Table
    print("=" * 86)
    print(f"{'Method':<26} | {'Success %':<10} | {'Mean Coll/Ep':<14} | {'Coll/100 Steps':<16} | {'Mean Steps':<10}")
    print("-" * 86)
    for _, row in df.iterrows():
        print(f"{row['Method']:<26} | {row['Success Rate (%)']:>8.1f}% | {row['Mean Collisions / Ep']:>14.2f} | {row['Collisions / 100 Steps']:>16.2f} | {row['Mean Steps to Goal']:>10.1f}")
    print("=" * 86)

    # Save to CSV
    os.makedirs(os.path.dirname(os.path.abspath(csv_output)), exist_ok=True)
    df.to_csv(csv_output, index=False)
    print(f"\nSaved results to {csv_output}")

    # Generate Chart
    os.makedirs(os.path.dirname(os.path.abspath(chart_output)), exist_ok=True)
    fig, axes = plt.subplots(1, 3, figsize=(16, 5))
    colors = ["#95a5a6", "#e74c3c", "#f39c12", "#2ecc71", "#3498db"]

    # 1. Success Rate
    axes[0].bar(df["Method"], df["Success Rate (%)"], color=colors, width=0.55)
    axes[0].set_title("Success Rate (%) [Higher is Better]", fontweight="bold")
    axes[0].set_ylabel("%")
    axes[0].set_ylim(0, 110)
    axes[0].grid(axis="y", linestyle=":", alpha=0.7)
    for idx, v in enumerate(df["Success Rate (%)"]):
        axes[0].text(idx, v + 2, f"{v:.1f}%", ha="center", fontweight="bold", fontsize=9)

    # 2. Mean Collisions
    axes[1].bar(df["Method"], df["Mean Collisions / Ep"], color=colors, width=0.55)
    axes[1].set_title("Mean Collisions / Episode [Lower is Better]", fontweight="bold")
    axes[1].set_ylabel("Collisions")
    axes[1].grid(axis="y", linestyle=":", alpha=0.7)
    for idx, v in enumerate(df["Mean Collisions / Ep"]):
        axes[1].text(idx, v + 1, f"{v:.1f}", ha="center", fontweight="bold", fontsize=9)

    # 3. Collisions per 100 steps
    axes[2].bar(df["Method"], df["Collisions / 100 Steps"], color=colors, width=0.55)
    axes[2].set_title("Collisions / 100 Steps [Lower is Better]", fontweight="bold")
    axes[2].set_ylabel("Collisions / 100 Steps")
    axes[2].grid(axis="y", linestyle=":", alpha=0.7)
    for idx, v in enumerate(df["Collisions / 100 Steps"]):
        axes[2].text(idx, v + 0.5, f"{v:.1f}", ha="center", fontweight="bold", fontsize=9)

    for ax in axes:
        ax.set_xticks(range(len(df["Method"])))
        ax.set_xticklabels(["Random", "Greedy", "Unstick", "World\nModel", "Oracle\n(Upper)"], fontsize=10)

    plt.suptitle(f"Autonomous Robotics Benchmarking: Scenario {scenario} ({n_episodes} Episodes)", fontsize=13, fontweight="bold")
    plt.tight_layout()
    plt.savefig(chart_output, dpi=150)
    plt.close()
    print(f"Saved chart to {chart_output}")

    return df


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate multi-baseline suite on robotics environment.")
    parser.add_argument("--model", type=str, default="models/robot_model.pt", help="Trained model path.")
    parser.add_argument("--scenario", type=int, default=1, help="Scenario (1=static chair, 2=moving person).")
    parser.add_argument("--episodes", type=int, default=50, help="Number of benchmark episodes.")
    parser.add_argument("--seed", type=int, default=1000, help="Base seed (TUNE: 1000-1999).")
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

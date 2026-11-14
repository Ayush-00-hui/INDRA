"""
Final Evaluation on Frozen Unseen Test Seeds 5000-5099.

Executes exactly ONCE for NBA Accreditation Final Report:
  - Scenario 1 (Static Chair) over seeds 5000-5099 (100 episodes)
  - Scenario 2 (Moving Person) over seeds 5000-5099 (100 episodes)
  - Saves consolidated metrics to results/final_results.csv
"""

import os
import sys
import time
import numpy as np
import pandas as pd

os.environ["SDL_VIDEODRIVER"] = "dummy"
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from envs.robot_env import RobotEnv
from model.world_model import load_model
from planner.mpc import plan
from scripts.collect_data_robot import get_greedy_action
from scripts.evaluate_robot import get_greedy_with_unstick_action, run_oracle_mpc_plan


def run_scenario_final(scenario: int, model_path: str, n_episodes: int = 100, base_seed: int = 5000):
    print(f"\n==================================================================")
    print(f" FINAL BENCHMARK: SCENARIO {scenario} (SEEDS {base_seed} to {base_seed + n_episodes - 1})")
    print(f"==================================================================")

    env = RobotEnv(scenario=scenario)
    model = load_model(model_path, state_size=env.get_state_size(), action_size=env.get_action_size())

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

    t0 = time.time()

    for ep in range(n_episodes):
        seed = base_seed + ep

        # 1. Random
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

        # 2. Greedy
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

        # 3. Greedy with unstick
        env.reset(seed=seed)
        u_hits, u_steps, u_goal = 0, 0, False
        blocked = 0
        last_act = RobotEnv.ACTION_STAY
        for _ in range(env.MAX_STEPS):
            act = get_greedy_with_unstick_action(env, blocked, last_act)
            _, _, done, info = env.step(act)
            u_steps += 1
            last_act = act
            if info["collision"]:
                u_hits += 1
                blocked += 1
            else:
                blocked = 0
            if done:
                u_goal = info["reached_goal"]
                break
        stats["Greedy-with-unstick"]["total_collisions"] += u_hits
        stats["Greedy-with-unstick"]["total_steps"] += u_steps
        if u_goal:
            stats["Greedy-with-unstick"]["successes"] += 1
            stats["Greedy-with-unstick"]["successful_steps"].append(u_steps)

        # 4. World Model MPC
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

        # 5. Oracle MPC (Upper Bound)
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

        if (ep + 1) % 20 == 0:
            print(f"  Ep [{ep+1:3d}/{n_episodes}] | Greedy: {g_goal} (Hits={g_hits}) | Unstick: {u_goal} (Hits={u_hits}) | WM: {wm_goal} (Hits={wm_hits}) | Oracle: {o_goal} (Hits={o_hits})")

    elapsed = time.time() - t0
    print(f"Scenario {scenario} completed in {elapsed:.1f}s.")

    rows = []
    for m in methods:
        succ_pct = (stats[m]["successes"] / n_episodes) * 100.0
        mean_coll = stats[m]["total_collisions"] / n_episodes
        tot_steps = max(1, stats[m]["total_steps"])
        coll_100 = (stats[m]["total_collisions"] / tot_steps) * 100.0
        succ_steps = stats[m]["successful_steps"]
        mean_steps = np.mean(succ_steps) if len(succ_steps) > 0 else float("nan")

        rows.append({
            "Scenario": f"Scenario {scenario}",
            "Method": m,
            "Success Rate (%)": succ_pct,
            "Mean Collisions / Ep": mean_coll,
            "Collisions / 100 Steps": coll_100,
            "Mean Steps to Goal": mean_steps,
            "Episodes": n_episodes
        })

    return rows


def main():
    rows_s1 = run_scenario_final(scenario=1, model_path="models/robot_model.pt", n_episodes=100, base_seed=5000)
    rows_s2 = run_scenario_final(scenario=2, model_path="models/robot_model_s2.pt", n_episodes=100, base_seed=5000)

    all_rows = rows_s1 + rows_s2
    df = pd.DataFrame(all_rows)

    out_csv = "results/final_results.csv"
    os.makedirs(os.path.dirname(os.path.abspath(out_csv)), exist_ok=True)
    df.to_csv(out_csv, index=False)

    print("\n" + "=" * 94)
    print("                      NBA FINAL ACCREDITATION RESULTS (SEEDS 5000-5099)")
    print("=" * 94)
    print(f"{'Scenario':<12} | {'Method':<25} | {'Success %':<10} | {'Mean Coll/Ep':<14} | {'Coll/100':<10} | {'Mean Steps':<10}")
    print("-" * 94)
    for _, r in df.iterrows():
        print(f"{r['Scenario']:<12} | {r['Method']:<25} | {r['Success Rate (%)']:>8.1f}% | {r['Mean Collisions / Ep']:>14.2f} | {r['Collisions / 100 Steps']:>10.2f} | {r['Mean Steps to Goal']:>10.1f}")
    print("=" * 94)
    print(f"\nFinal results saved to {out_csv}")


if __name__ == "__main__":
    main()


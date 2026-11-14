import os
import sys
import argparse
import time
from typing import Tuple, List, Dict, Any, Optional
import numpy as np
import matplotlib.pyplot as plt

# Ensure root directory is on PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from envs.robot_env import RobotEnv
from model.world_model import WorldModel, train_world_model, save_model, load_model
from planner.mpc import plan
from scripts.collect_data_robot import get_greedy_action


def evaluate_on_tune_seeds(
    model: WorldModel,
    scenario: int = 1,
    include_obstacle_size: bool = False,
    n_episodes: int = 50,
    tune_seed_start: int = 1000
) -> Dict[str, float]:
    """Evaluate current model checkpoint on reserved TUNE seeds (1000-1999)."""
    env = RobotEnv(scenario=scenario, include_obstacle_size=include_obstacle_size)
    successes = 0
    total_collisions = 0
    total_steps = 0
    successful_steps = []

    for i in range(n_episodes):
        seed = tune_seed_start + i
        state = env.reset(seed=seed)
        ep_hits = 0
        ep_steps = 0
        reached = False
        stuck_steps = 0
        last_pos = None
        last_act = None

        for _ in range(env.MAX_STEPS):
            curr_pos = (round(env.robot_x, 1), round(env.robot_y, 1))
            if curr_pos == last_pos:
                stuck_steps += 1
            else:
                stuck_steps = 0
                last_pos = curr_pos

            # Stuck escape handling (after 6 stationary steps)
            if stuck_steps >= 6:
                valid_acts = []
                for a_cand in range(env.get_action_size()):
                    dx, dy = env.ACTION_DELTAS.get(a_cand, (0.0, 0.0))
                    if not env._check_collision(env.robot_x + dx, env.robot_y + dy):
                        valid_acts.append(a_cand)
                act = np.random.choice(valid_acts) if valid_acts else np.random.randint(0, env.get_action_size())
                stuck_steps = 0
            else:
                act = plan(model, state, action_size=env.get_action_size(), horizon=14, n_samples=300, gamma=0.95, last_action=last_act)

            next_state, _, done, info = env.step(act)
            ep_steps += 1
            last_act = act
            if info["collision"]:
                ep_hits += 1
            if done:
                reached = info["reached_goal"]
                break
            state = next_state

        if reached:
            successes += 1
            successful_steps.append(ep_steps)
        total_collisions += ep_hits
        total_steps += ep_steps

    success_rate = (successes / n_episodes) * 100.0
    mean_coll = total_collisions / n_episodes
    mean_steps = np.mean(successful_steps) if successful_steps else float("nan")

    return {
        "success_rate": success_rate,
        "mean_collisions": mean_coll,
        "mean_steps": mean_steps,
        "successes": successes,
        "total_episodes": n_episodes
    }


def collect_iterative_rollouts(
    model: WorldModel,
    env: RobotEnv,
    n_episodes: int = 100,
    epsilon: float = 0.10,
    train_seed_start: int = 0
) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    """Run current model planner with epsilon-random exploration to aggregate on-policy data."""
    states, actions, next_states, rewards = [], [], [], []
    collisions = 0
    goals = 0

    for ep in range(n_episodes):
        seed = train_seed_start + ep
        state = env.reset(seed=seed)
        stuck_steps = 0
        last_pos = None
        last_act = None

        for _ in range(env.MAX_STEPS):
            curr_pos = (round(env.robot_x, 1), round(env.robot_y, 1))
            if curr_pos == last_pos:
                stuck_steps += 1
            else:
                stuck_steps = 0
                last_pos = curr_pos

            # Epsilon-greedy planner action selection
            if np.random.rand() < epsilon:
                action = np.random.randint(0, env.get_action_size())
            elif stuck_steps >= 6:
                valid_acts = []
                for a_cand in range(env.get_action_size()):
                    dx, dy = env.ACTION_DELTAS.get(a_cand, (0.0, 0.0))
                    if not env._check_collision(env.robot_x + dx, env.robot_y + dy):
                        valid_acts.append(a_cand)
                action = np.random.choice(valid_acts) if valid_acts else np.random.randint(0, env.get_action_size())
                stuck_steps = 0
            else:
                action = plan(model, state, action_size=env.get_action_size(), horizon=14, n_samples=300, gamma=0.95, last_action=last_act)

            next_state, reward, done, info = env.step(action)
            last_act = action

            states.append(state)
            actions.append(action)
            next_states.append(next_state)
            rewards.append(reward)

            if info["collision"]: collisions += 1
            if info["reached_goal"]: goals += 1

            if done:
                break
            state = next_state

    print(f"  [Aggregation] Episodes: {n_episodes} | Transitions: {len(states)} | Hits: {collisions} | Goals: {goals} | eps: {epsilon:.2f}")
    return (
        np.array(states, dtype=np.float32),
        np.array(actions, dtype=np.int64),
        np.array(next_states, dtype=np.float32),
        np.array(rewards, dtype=np.float32)
    )


def train_robot_iterative(
    scenario: int = 1,
    include_obstacle_size: bool = False,
    n_rounds: int = 4,
    episodes_per_round: int = 100,
    model_output: str = "models/robot_model.pt",
    plot_output: str = "results/robot_learning_curve.png",
    tune_episodes: int = 50
) -> WorldModel:
    """
    DAgger-style Iterative Data Aggregation and Training Pipeline.
    
    Round 0: Seed dataset (random + noisy greedy exploration).
    Rounds 1..N: On-policy rollouts using current planner with decaying epsilon exploration.
    Aggregates transitions, retrains, evaluates on TUNE seeds, saves best checkpoint and learning curve.
    """
    print(f"=========================================================================")
    print(f" ITERATIVE DATA AGGREGATION (DAGGER): SCENARIO {scenario}")
    print(f" State size: {22 if include_obstacle_size else 16} | Rounds: {n_rounds} | Ep/Round: {episodes_per_round}")
    print(f"=========================================================================")

    env = RobotEnv(scenario=scenario, include_obstacle_size=include_obstacle_size)
    state_size = env.get_state_size()
    action_size = env.get_action_size()

    # -------------------------------------------------------------
    # Round 0: Initial Seed Data
    # -------------------------------------------------------------
    print("\n--- Round 0: Initial Seed Data Collection ---")
    states_list, actions_list, next_states_list, rewards_list = [], [], [], []

    # Collect 25,000 seed transitions on TRAIN seeds (0-999)
    env.reset(seed=42)
    for _ in range(25000):
        if np.random.rand() < 0.50:
            act = np.random.randint(0, action_size)
        else:
            if np.random.rand() < 0.20:
                act = np.random.randint(0, action_size)
            else:
                act = get_greedy_action(env.robot_x, env.robot_y, env.goal_x, env.goal_y)

        nxt, r, d, info = env.step(act)
        states_list.append(env._get_state() if len(states_list) == 0 else cur_s)
        actions_list.append(act)
        next_states_list.append(nxt)
        rewards_list.append(r)
        cur_s = nxt
        if d:
            cur_s = env.reset()

    all_states = np.array(states_list, dtype=np.float32)
    all_actions = np.array(actions_list, dtype=np.int64)
    all_next_states = np.array(next_states_list, dtype=np.float32)
    all_rewards = np.array(rewards_list, dtype=np.float32)

    print(f"Round 0 seed dataset: {len(all_states)} transitions.")

    # Train initial model
    model = WorldModel(state_size=state_size, action_size=action_size, hidden=128)
    model = train_world_model(
        model=model,
        transitions=(all_states, all_actions, all_next_states, all_rewards),
        epochs=30,
        lr=1e-3,
        batch_size=256
    )

    eval_0 = evaluate_on_tune_seeds(model, scenario, include_obstacle_size, n_episodes=tune_episodes)
    print(f"Round 0 TUNE Result: Success Rate = {eval_0['success_rate']:.1f}% | Avg Collisions = {eval_0['mean_collisions']:.2f}")

    rounds = [0]
    success_rates = [eval_0["success_rate"]]
    avg_collisions = [eval_0["mean_collisions"]]
    best_success = eval_0["success_rate"]
    best_model = model

    save_model(model, model_output)

    # -------------------------------------------------------------
    # Rounds 1..N: Iterative Aggregation
    # -------------------------------------------------------------
    eps_start = 0.20
    eps_end = 0.05

    for r in range(1, n_rounds + 1):
        eps = eps_start - (eps_start - eps_end) * ((r - 1) / max(1, n_rounds - 1))
        print(f"\n--- Round {r}/{n_rounds} (Epsilon: {eps:.2f}) ---")

        # Rollout on-policy with current model on TRAIN seeds
        train_seed_base = r * 100
        new_s, new_a, new_ns, new_r = collect_iterative_rollouts(
            model=best_model,
            env=env,
            n_episodes=episodes_per_round,
            epsilon=eps,
            train_seed_start=train_seed_base
        )

        all_states = np.concatenate([all_states, new_s], axis=0)
        all_actions = np.concatenate([all_actions, new_a], axis=0)
        all_next_states = np.concatenate([all_next_states, new_ns], axis=0)
        all_rewards = np.concatenate([all_rewards, new_r], axis=0)

        print(f"Aggregated dataset now has {len(all_states)} transitions.")

        # Retrain model on aggregated dataset
        model = WorldModel(state_size=state_size, action_size=action_size, hidden=128)
        model = train_world_model(
            model=model,
            transitions=(all_states, all_actions, all_next_states, all_rewards),
            epochs=25,
            lr=1e-3,
            batch_size=256
        )

        # Evaluate on reserved TUNE seeds
        eval_r = evaluate_on_tune_seeds(model, scenario, include_obstacle_size, n_episodes=tune_episodes)
        print(f"Round {r} TUNE Result: Success Rate = {eval_r['success_rate']:.1f}% | Avg Collisions = {eval_r['mean_collisions']:.2f}")

        rounds.append(r)
        success_rates.append(eval_r["success_rate"])
        avg_collisions.append(eval_r["mean_collisions"])

        if eval_r["success_rate"] >= best_success:
            best_success = eval_r["success_rate"]
            best_model = model
            save_model(model, model_output)
            print(f"*** New best model saved to {model_output} (Success: {best_success:.1f}%) ***")

    # Plot learning curve
    os.makedirs(os.path.dirname(os.path.abspath(plot_output)), exist_ok=True)
    fig, ax1 = plt.subplots(figsize=(8, 5))

    color_succ = "#2ecc71"
    color_coll = "#e74c3c"

    ax1.set_xlabel("DAgger Iteration Round", fontsize=12, fontweight="bold")
    ax1.set_ylabel("Success Rate (%)", color=color_succ, fontsize=12, fontweight="bold")
    line1 = ax1.plot(rounds, success_rates, marker="o", color=color_succ, linewidth=2.5, label="Success Rate (%)")
    ax1.tick_params(axis="y", labelcolor=color_succ)
    ax1.set_ylim(0, 105)
    ax1.grid(True, linestyle=":", alpha=0.6)

    ax2 = ax1.twinx()
    ax2.set_ylabel("Avg Collisions / Episode", color=color_coll, fontsize=12, fontweight="bold")
    line2 = ax2.plot(rounds, avg_collisions, marker="s", color=color_coll, linewidth=2, linestyle="--", label="Avg Collisions")
    ax2.tick_params(axis="y", labelcolor=color_coll)

    for r, s_val in zip(rounds, success_rates):
        ax1.annotate(f"{s_val:.1f}%", (r, s_val + 3), ha="center", fontweight="bold", fontsize=10)

    lines = line1 + line2
    labels = [l.get_label() for l in lines]
    ax1.legend(lines, labels, loc="center right", fontsize=11)

    plt.title(f"Iterative Data Aggregation Learning Curve (Scenario {scenario})", fontsize=13, fontweight="bold")
    plt.tight_layout()
    plt.savefig(plot_output, dpi=150)
    plt.close()
    print(f"Saved learning curve plot to {plot_output}")

    return best_model


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Iterative DAgger-style training pipeline.")
    parser.add_argument("--scenario", type=int, default=1, help="Scenario (1=static, 2=moving).")
    parser.add_argument("--include-obstacle-size", action="store_true", help="Expand state from 16 to 22 dimensions.")
    parser.add_argument("--rounds", type=int, default=4, help="Number of aggregation rounds.")
    parser.add_argument("--episodes", type=int, default=100, help="Episodes per aggregation round.")
    parser.add_argument("--tune-episodes", type=int, default=50, help="Number of TUNE episodes.")
    parser.add_argument("--output", type=str, default="models/robot_model.pt", help="Model output path.")
    parser.add_argument("--plot", type=str, default="results/robot_learning_curve.png", help="Learning curve plot output.")
    args = parser.parse_args()

    train_robot_iterative(
        scenario=args.scenario,
        include_obstacle_size=args.include_obstacle_size,
        n_rounds=args.rounds,
        episodes_per_round=args.episodes,
        model_output=args.output,
        plot_output=args.plot,
        tune_episodes=args.tune_episodes
    )


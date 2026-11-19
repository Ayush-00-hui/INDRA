"""
Maximum-Scale In-Path Obstacle World Model Training Pipeline (2-Stage + DAgger).
Trains a high-capacity 1.1M-parameter Deep Residual World Model (hidden=512) on CUDA GPU (RTX 5070)
by placing diverse objects directly in the robot's navigation path:
- Objects: Chair, Wooden Crate, Tool Cabinet, Workstation, Concrete Block, Barrel, Shelf, Moving Person.
- Patterns: Direct midpoint blockers, 3-object slaloms, narrow chokepoints, U-pocket concave traps,
  near-goal guards, near-robot blockers, dense 4-8 object clutter, classic S1/S2, clear sprints,
  and mid-episode dynamic object placement directly ahead of the moving robot.
- Stage 1: 600,000 parallel transitions + 60 GPU epochs.
- Stage 2: On-policy DAgger hard-case rollouts (+~50,000 transitions) + 40 GPU fine-tuning epochs (100 total).
"""

import os
import sys
import json
import copy
import time
import math
from typing import Dict, List, Tuple, Any, Optional

import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F

# Ensure repository root is on PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from envs.robot_env import RobotEnv
from model.world_model import WorldModel, save_model
from planner.mpc import plan
from scripts.distill_student import StudentWorldModel
from scripts.collect_in_path_obstacles import (
    collect_in_path_dataset,
    setup_in_path_obstacle_arena,
    OBJECT_CATALOG,
)


def train_on_gpu(
    states: np.ndarray,
    actions: np.ndarray,
    next_states: np.ndarray,
    rewards: np.ndarray,
    epochs: int = 60,
    batch_size: int = 2048,
    lr: float = 1.5e-3,
    hidden: int = 512,
    init_model: Optional[StudentWorldModel] = None,
    stage_name: str = "STAGE 1"
) -> Tuple[StudentWorldModel, Dict[str, Any]]:
    """Train deep residual StudentWorldModel on CUDA GPU with best-checkpoint tracking."""
    use_cuda = torch.cuda.is_available()
    device = torch.device("cuda" if use_cuda else "cpu")

    print("\n" + "=" * 80, flush=True)
    print(f"   {stage_name}: TRAINING HIGH-CAPACITY RESIDUAL WORLD MODEL", flush=True)
    print(f"   Device: {device} ({torch.cuda.get_device_name(0) if use_cuda else 'CPU'})", flush=True)
    print(f"   Architecture: StudentWorldModel (Hidden={hidden}, Residual + LayerNorm)", flush=True)
    print(f"   Dataset: {len(states):,} transitions | Epochs: {epochs} | Batch Size: {batch_size} | LR: {lr}", flush=True)
    print("=" * 80, flush=True)

    deltas = next_states - states
    state_mean = np.mean(states, axis=0)
    state_std = np.std(states, axis=0)
    delta_mean = np.mean(deltas, axis=0)
    delta_std = np.std(deltas, axis=0)
    reward_mean = np.array([np.mean(rewards)], dtype=np.float32)
    reward_std = np.array([np.std(rewards)], dtype=np.float32)

    n_total = len(states)
    n_train = int(0.92 * n_total)
    rng = np.random.RandomState(42)
    perm = rng.permutation(n_total)
    train_idx = perm[:n_train]
    val_idx = perm[n_train:]

    sm = torch.as_tensor(state_mean, dtype=torch.float32, device=device)
    ss = torch.as_tensor(np.maximum(state_std, 1e-6), dtype=torch.float32, device=device)
    dm = torch.as_tensor(delta_mean, dtype=torch.float32, device=device)
    ds = torch.as_tensor(np.maximum(delta_std, 1e-6), dtype=torch.float32, device=device)
    rm = torch.as_tensor(reward_mean, dtype=torch.float32, device=device)
    rs = torch.as_tensor(np.maximum(reward_std, 1e-6), dtype=torch.float32, device=device)

    s_train = torch.as_tensor(states[train_idx], dtype=torch.float32, device=device)
    a_train = torch.as_tensor(actions[train_idx], dtype=torch.long, device=device)
    d_train = torch.as_tensor(deltas[train_idx], dtype=torch.float32, device=device)
    r_train = torch.as_tensor(rewards[train_idx], dtype=torch.float32, device=device)

    norm_s_train = (s_train - sm) / ss
    norm_d_train = (d_train - dm) / ds
    norm_r_train = (r_train - rm) / rs
    act_oh_train = F.one_hot(a_train, num_classes=5).float()

    val_s = torch.as_tensor(states[val_idx], dtype=torch.float32, device=device)
    val_a = torch.as_tensor(actions[val_idx], dtype=torch.long, device=device)
    val_d = torch.as_tensor(deltas[val_idx], dtype=torch.float32, device=device)
    val_r = torch.as_tensor(rewards[val_idx], dtype=torch.float32, device=device)

    norm_val_s = (val_s - sm) / ss
    norm_val_d = (val_d - dm) / ds
    norm_val_r = (val_r - rm) / rs
    act_oh_val = F.one_hot(val_a, num_classes=5).float()

    if init_model is not None:
        model = init_model.to(device)
    else:
        model = StudentWorldModel(state_size=16, action_size=5, hidden=hidden).to(device)
    model.set_normalization(state_mean, state_std, delta_mean, delta_std, reward_mean, reward_std)

    num_params = sum(p.numel() for p in model.parameters())
    print(f"   Parameters: {num_params:,}", flush=True)

    optimizer = torch.optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-4)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs, eta_min=1e-5)

    t_start = time.time()
    best_val_loss = float("inf")
    best_state_dict = None
    best_metrics = {}
    loss_curve = []

    for epoch in range(1, epochs + 1):
        model.train()
        epoch_perm = torch.randperm(n_train, device=device)
        total_loss = 0.0
        batches = 0

        for start in range(0, n_train, batch_size):
            end = min(start + batch_size, n_train)
            batch_idx = epoch_perm[start:end]

            b_s = norm_s_train[batch_idx]
            b_a = act_oh_train[batch_idx]
            b_d = norm_d_train[batch_idx]
            b_r = norm_r_train[batch_idx]
            raw_r = r_train[batch_idx]

            optimizer.zero_grad(set_to_none=True)
            pred_d, pred_r, _ = model(b_s, b_a)

            # High-precision state delta loss (MSE + SmoothL1 blend for sharp obstacle stop dynamics)
            loss_delta = 0.75 * F.mse_loss(pred_d, b_d) + 0.25 * F.smooth_l1_loss(pred_d, b_d, beta=0.1)

            # Focal reward loss: strong weight on obstacle collisions & goal arrivals
            weights = torch.ones_like(b_r)
            weights[raw_r < -0.5] = 3.50
            weights[raw_r > 10.0] = 4.50
            loss_reward = (weights * (pred_r - b_r).pow(2)).mean()

            loss = loss_delta + 0.85 * loss_reward
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
            optimizer.step()

            total_loss += loss.item()
            batches += 1

        scheduler.step()
        avg_train = total_loss / max(batches, 1)

        # Validation evaluation
        model.eval()
        with torch.no_grad():
            val_pd, val_pr, _ = model(norm_val_s, act_oh_val)
            val_loss = (F.mse_loss(val_pd, norm_val_d) + 0.85 * F.mse_loss(val_pr, norm_val_r)).item()

            pred_real_d = val_pd * ds + dm
            mae_delta = torch.mean(torch.abs(pred_real_d - val_d)).item()
            pos_err_px = torch.mean(torch.hypot(
                (pred_real_d[:, 0] - val_d[:, 0]) * 450.0,
                (pred_real_d[:, 1] - val_d[:, 1]) * 300.0
            )).item()
            pred_real_r = val_pr * rs + rm
            mae_reward = torch.mean(torch.abs(pred_real_r - val_r)).item()

        if val_loss < best_val_loss:
            best_val_loss = val_loss
            best_state_dict = copy.deepcopy(model.state_dict())
            best_metrics = {
                "val_loss": round(val_loss, 6),
                "train_loss": round(avg_train, 6),
                "delta_mae": round(mae_delta, 6),
                "pos_err_px": round(pos_err_px, 4),
                "reward_mae": round(mae_reward, 5),
                "best_epoch": epoch,
                "num_params": num_params,
            }

        if epoch == 1 or epoch % 5 == 0 or epoch == epochs:
            elapsed = time.time() - t_start
            loss_curve.append({
                "epoch": epoch,
                "train_loss": round(avg_train, 5),
                "val_loss": round(val_loss, 5),
                "delta_mae": round(mae_delta, 6),
                "pos_err_px": round(pos_err_px, 3),
                "reward_mae": round(mae_reward, 4),
            })
            print(
                f"Epoch [{epoch:2d}/{epochs:2d}] ({elapsed:5.1f}s) | "
                f"Train: {avg_train:.4f} | Val: {val_loss:.4f} | "
                f"Delta MAE: {mae_delta:.5f} ({pos_err_px:.2f}px) | Rew MAE: {mae_reward:.4f}",
                flush=True
            )

    if best_state_dict is not None:
        model.load_state_dict(best_state_dict)
    model.eval()
    best_metrics["loss_curve"] = loss_curve
    return model, best_metrics


def collect_dagger_on_policy(
    model: StudentWorldModel,
    n_episodes: int = 160,
    epsilon: float = 0.12
) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    """
    Stage 2 DAgger: Run our Stage-1 neural MPC planner on hard in-path obstacle courses
    with dynamic obstacles placed right ahead of the moving robot.
    Captures exact on-policy states, tight obstacle detours, and boundary recoveries.
    """
    print("\n" + "=" * 80, flush=True)
    print(f"   STAGE 2 DAGGER: COLLECTING ON-POLICY HARD-OBSTACLE ROLLOUTS ({n_episodes} episodes)", flush=True)
    print("=" * 80, flush=True)

    t0 = time.time()
    env = RobotEnv(scenario=1)
    rng = np.random.RandomState(9999)
    states, actions, next_states, rewards = [], [], [], []
    collisions = 0
    goal_reaches = 0

    for ep in range(n_episodes):
        state = setup_in_path_obstacle_arena(env, seed=50000 + ep)
        last_action = None

        for step in range(250):
            # Drop surprise obstacle directly ahead of robot mid-trajectory (2% chance per step)
            if rng.rand() < 0.025 and step > 5:
                dx_g = env.goal_x - env.robot_x
                dy_g = env.goal_y - env.robot_y
                dist_g = math.hypot(dx_g, dy_g)
                if dist_g > 110.0:
                    lead = float(rng.uniform(70.0, min(130.0, dist_g - 50.0)))
                    k_dyn = str(rng.choice(list(OBJECT_CATALOG.keys())))
                    ow, oh = OBJECT_CATALOG[k_dyn]
                    ax = env.robot_x + (dx_g / dist_g) * lead - ow / 2.0
                    ay = env.robot_y + (dy_g / dist_g) * lead - oh / 2.0
                    if env.place_obstacle(ax, ay, kind=k_dyn, w=ow, h=oh):
                        state = env._get_state()

            if rng.rand() < epsilon:
                act = int(rng.randint(0, env.get_action_size()))
            else:
                act = plan(
                    model=model,
                    state=state,
                    action_size=env.get_action_size(),
                    horizon=14,
                    n_samples=180,
                    gamma=0.95,
                    last_action=last_action,
                    step_size=env.STEP_SIZE
                )

            next_s, rew, done, info = env.step(act)
            states.append(state)
            actions.append(act)
            next_states.append(next_s)
            rewards.append(rew)

            if info["collision"]:
                collisions += 1
            if info["reached_goal"]:
                goal_reaches += 1
            if done:
                break
            state = next_s
            last_action = act

        if (ep + 1) % 40 == 0:
            print(
                f"   DAgger Ep [{ep+1:3d}/{n_episodes}] | Collected: {len(states):,} | "
                f"Goals: {goal_reaches}/{ep+1} ({goal_reaches/(ep+1)*100:.1f}%) | "
                f"Elapsed: {time.time()-t0:.1f}s",
                flush=True
            )

    dt = time.time() - t0
    print(f"[*] DAgger complete: {len(states):,} on-policy transitions in {dt:.1f}s "
          f"| Goals: {goal_reaches}/{n_episodes} ({goal_reaches/n_episodes*100:.1f}%) | Collisions: {collisions:,}",
          flush=True)

    return (
        np.array(states, dtype=np.float32),
        np.array(actions, dtype=np.int64),
        np.array(next_states, dtype=np.float32),
        np.array(rewards, dtype=np.float32),
    )


def evaluate_suite(
    model: StudentWorldModel,
    suite_name: str,
    n_episodes: int,
    mode: str,
    seed_start: int = 5000
) -> Dict[str, Any]:
    """Fast GPU-accelerated evaluation across a benchmark suite."""
    t0 = time.time()
    scenario = 2 if mode == "scenario2" else (3 if mode == "scenario3" else 1)
    env = RobotEnv(scenario=scenario)

    successes = 0
    total_collisions = 0
    successful_steps = []
    latencies = []

    for ep in range(n_episodes):
        seed = seed_start + ep
        if mode == "in_path":
            state = setup_in_path_obstacle_arena(env, seed=seed)
        else:
            state = env.reset(seed=seed)

        last_action = None
        ep_collisions = 0
        reached = False
        stuck_steps = 0
        last_pos = None

        for step in range(env.MAX_STEPS):
            curr_pos = (round(env.robot_x, 1), round(env.robot_y, 1))
            if curr_pos == last_pos:
                stuck_steps += 1
            else:
                stuck_steps = 0
                last_pos = curr_pos

            if stuck_steps >= 6:
                valid_acts = [
                    a for a in range(env.get_action_size() - 1)
                    if not env._check_collision(
                        env.robot_x + env.ACTION_DELTAS[a][0],
                        env.robot_y + env.ACTION_DELTAS[a][1]
                    )
                ]
                act = int(np.random.choice(valid_acts)) if valid_acts else int(np.random.randint(0, 4))
                stuck_steps = 0
            else:
                ts = time.perf_counter()
                act = plan(
                    model=model,
                    state=state,
                    action_size=env.get_action_size(),
                    horizon=18,
                    n_samples=300,
                    gamma=0.95,
                    last_action=last_action,
                    step_size=env.STEP_SIZE
                )
                latencies.append((time.perf_counter() - ts) * 1000.0)

            next_s, _, done, info = env.step(act)
            if info["collision"]:
                ep_collisions += 1
            if done:
                reached = info["reached_goal"]
                break
            state = next_s
            last_action = act

        if reached:
            successes += 1
            successful_steps.append(step + 1)
        total_collisions += ep_collisions

    sr = (successes / n_episodes) * 100.0
    mean_coll = total_collisions / n_episodes
    mean_steps = float(np.mean(successful_steps)) if successful_steps else 0.0
    mean_lat = float(np.mean(latencies)) if latencies else 0.0
    dt = time.time() - t0

    print(
        f"  [{suite_name:28s}] Success: {sr:5.1f}% ({successes:3d}/{n_episodes:3d}) | "
        f"Collisions/Ep: {mean_coll:4.2f} | Mean Steps: {mean_steps:5.1f} | "
        f"Plan: {mean_lat:4.1f}ms ({dt:.1f}s)",
        flush=True
    )
    return {
        "suite": suite_name,
        "success_rate": round(sr, 2),
        "successes": successes,
        "episodes": n_episodes,
        "mean_collisions": round(mean_coll, 3),
        "mean_steps": round(mean_steps, 2),
        "mean_plan_ms": round(mean_lat, 2),
    }


def main():
    t_total = time.time()

    # 1. Stage 1: Load 600,000 diverse in-path obstacle transitions from disk (or collect if missing)
    data_path = "data/max_in_path_600k.npz"
    if os.path.exists(data_path):
        print(f"[*] Loading cached dataset from {data_path}...", flush=True)
        d = np.load(data_path)
        s1, a1, ns1, r1 = d["states"], d["actions"], d["next_states"], d["rewards"]
        print(f"[*] Loaded {len(s1):,} in-path obstacle transitions!", flush=True)
    else:
        s1, a1, ns1, r1 = collect_in_path_dataset(total_samples=600000, num_workers=8)

    # 2. Stage 1: Train 1.1M-parameter Residual World Model (hidden=512) for 60 epochs on RTX 5070 GPU
    model_gpu, stage1_metrics = train_on_gpu(
        s1, a1, ns1, r1,
        epochs=60,
        batch_size=2048,
        lr=1.5e-3,
        hidden=512,
        stage_name="STAGE 1 (600K BASE)"
    )

    # Immediately save Stage-1 checkpoint (safe backup on disk before Stage 2!)
    os.makedirs("models", exist_ok=True)
    save_model(model_gpu.cpu(), "models/robot_student.pt")
    save_model(model_gpu.cpu(), "models/robot_model.pt")
    print("[+] Stage 1 checkpoint saved to models/robot_student.pt and models/robot_model.pt", flush=True)

    # Move back to GPU for fast DAgger collection
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model_gpu = model_gpu.to(device)

    # 3. Stage 2: On-policy DAgger rollouts on hard obstacle courses with mid-flight object drops
    s2, a2, ns2, r2 = collect_dagger_on_policy(model_gpu, n_episodes=160, epsilon=0.12)

    # Combine Stage 1 + Stage 2 datasets (~630k+ transitions)
    states_all = np.concatenate([s1, s2], axis=0)
    actions_all = np.concatenate([a1, a2], axis=0)
    next_states_all = np.concatenate([ns1, ns2], axis=0)
    rewards_all = np.concatenate([r1, r2], axis=0)
    print(f"\n[*] Combined Stage 1 + DAgger Dataset: {len(states_all):,} transitions", flush=True)

    # 4. Stage 2: Fine-tune for 40 more epochs (total 100 GPU epochs!)
    model_final_gpu, stage2_metrics = train_on_gpu(
        states_all, actions_all, next_states_all, rewards_all,
        epochs=40,
        batch_size=2048,
        lr=4.0e-4,
        hidden=512,
        init_model=model_gpu,
        stage_name="STAGE 2 (DAGGER FINE-TUNE)"
    )

    # Save final trained model immediately!
    model_cpu = copy.deepcopy(model_final_gpu).cpu()
    save_model(model_cpu, "models/robot_student.pt")
    save_model(model_cpu, "models/robot_model.pt")
    print("\n[+] FINAL MAX-TRAINED CHECKPOINTS SAVED:", flush=True)
    print("    - models/robot_student.pt", flush=True)
    print("    - models/robot_model.pt", flush=True)

    # 5. Fast GPU-Accelerated Comprehensive Benchmark Evaluation
    print("\n" + "=" * 80, flush=True)
    print("   FINAL MULTI-SUITE EVALUATION (UNSEEN HELD-OUT SEEDS)", flush=True)
    print("=" * 80, flush=True)

    eval_results = {}
    eval_results["in_path_50"] = evaluate_suite(
        model_final_gpu, "In-Path Multi-Object (50)", n_episodes=50, mode="in_path", seed_start=8000
    )
    eval_results["scenario_1_100"] = evaluate_suite(
        model_final_gpu, "Scenario 1 Static (100)", n_episodes=100, mode="scenario1", seed_start=5000
    )
    eval_results["scenario_2_100"] = evaluate_suite(
        model_final_gpu, "Scenario 2 Dynamic (100)", n_episodes=100, mode="scenario2", seed_start=5000
    )
    eval_results["scenario_3_30"] = evaluate_suite(
        model_final_gpu, "Scenario 3 Dense Maze (30)", n_episodes=30, mode="scenario3", seed_start=7000
    )

    # Save complete training report
    os.makedirs("results", exist_ok=True)
    report = {
        "total_transitions": int(len(states_all)),
        "stage1_transitions": int(len(s1)),
        "dagger_transitions": int(len(s2)),
        "total_epochs": 100,
        "hidden_units": 512,
        "num_params": stage2_metrics["num_params"],
        "stage1_metrics": stage1_metrics,
        "stage2_metrics": stage2_metrics,
        "evaluation": eval_results,
        "total_time_sec": round(time.time() - t_total, 1),
    }
    with open("results/max_training_report.json", "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)

    print(f"\n[+] Full report saved to results/max_training_report.json", flush=True)
    print(f"[*] Total Pipeline Time: {time.time() - t_total:.1f}s", flush=True)


if __name__ == "__main__":
    main()

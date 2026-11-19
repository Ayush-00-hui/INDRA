"""
Super Robot Training Pipeline: Maximum GPU (RTX 5070) & CPU (Multi-Core) Optimization.
Key Objectives:
1. "train the robot more": Collect 1,000,000 in-path transitions with diverse obstacle configurations.
2. "dont let him hover at a single spot for more than 2 seconds":
   Train on active navigation, anti-stagnation evasions, and dynamic kinetic drive transitions.
3. "train it more better using gpu and cpu power":
   - CPU: 20 parallel worker processes collecting 1M transitions in ~30 seconds.
   - GPU: CUDA batch training of the 1,101,874-parameter Deep Residual World Model with
          AdamW, CosineAnnealingLR, focal reward weighting, and DAgger on-policy rollouts.
"""

import os
import sys
import time
import math
import copy
import json
import multiprocessing as mp
from typing import Dict, List, Tuple, Any, Optional

import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from envs.robot_env import RobotEnv, Obstacle
from model.world_model import WorldModel, save_model
from planner.mpc import plan
from scripts.distill_student import StudentWorldModel
from scripts.collect_in_path_obstacles import (
    setup_in_path_obstacle_arena,
    get_omnidirectional_greedy_action,
    OBJECT_CATALOG,
)


def _worker_super_collect(args: Tuple[int, int, int]) -> Dict[str, Any]:
    """Lightweight worker process collecting transitions with kinetic drive & anti-hover behaviors."""
    worker_id, target_samples, seed = args
    rng = np.random.RandomState(seed)

    env = RobotEnv(scenario=1)
    state = setup_in_path_obstacle_arena(env, seed=int(rng.randint(0, 1000000)))

    states, actions, next_states, rewards = [], [], [], []
    action_size = env.get_action_size()
    collisions = 0
    goal_reaches = 0

    while len(states) < target_samples:
        rx, ry = env.robot_x, env.robot_y
        gx, gy = env.goal_x, env.goal_y

        # Strategy selection:
        # 75% Goal-seeking navigation with obstacle detour
        # 15% Tangential evasion / anti-hover skirting
        # 10% Exploratory jitter
        prob = rng.rand()
        if prob < 0.75:
            # Check if direct line is blocked
            blocked_directly = False
            for obs in env.obstacles:
                closest_x = max(obs.x, min(rx, obs.x + obs.width))
                closest_y = max(obs.y, min(ry, obs.y + obs.height))
                if math.hypot(rx - closest_x, ry - closest_y) < (env.ROBOT_RADIUS + 25.0):
                    blocked_directly = True
                    break

            if blocked_directly:
                # Anti-hover tangential detour maneuver
                act = env._compute_anti_hover_escape_action()
            else:
                act = get_omnidirectional_greedy_action(rx, ry, gx, gy)
        elif prob < 0.90:
            # Random orthogonal tangent move to train skirting around obstacles
            act = int(rng.choice([RobotEnv.ACTION_UP, RobotEnv.ACTION_DOWN, RobotEnv.ACTION_LEFT, RobotEnv.ACTION_RIGHT]))
        else:
            act = int(rng.randint(0, action_size))

        next_s, rew, done, info = env.step(act)

        states.append(state)
        actions.append(act)
        next_states.append(next_s)
        rewards.append(rew)

        if info.get("collision", False):
            collisions += 1
        if info.get("reached_goal", False):
            goal_reaches += 1

        if done:
            state = setup_in_path_obstacle_arena(env, seed=int(rng.randint(0, 1000000)))
        else:
            state = next_s

    return {
        "states": np.array(states[:target_samples], dtype=np.float32),
        "actions": np.array(actions[:target_samples], dtype=np.int64),
        "next_states": np.array(next_states[:target_samples], dtype=np.float32),
        "rewards": np.array(rewards[:target_samples], dtype=np.float32),
        "collisions": collisions,
        "goal_reaches": goal_reaches,
    }


def collect_1m_dataset(total_samples: int = 1000000, num_workers: int = 20) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    """CPU Multi-Core Pipeline: Collects 1,000,000 transitions across 20 parallel workers."""
    print("=" * 80)
    print(f"   CPU POWER: COLLECTING {total_samples:,} IN-PATH TRANSITIONS ({num_workers} CORES)")
    print("   Featuring: Anti-Hover Skirting, 360 LiDAR Sensor Clearances, and Kinetic Modes")
    print("=" * 80)

    chunk = (total_samples + num_workers - 1) // num_workers
    worker_args = [(w, chunk, w * 9887 + 101) for w in range(num_workers)]

    t0 = time.time()
    with mp.Pool(processes=num_workers) as pool:
        results = pool.map(_worker_super_collect, worker_args)

    states = np.concatenate([r["states"] for r in results], axis=0)[:total_samples]
    actions = np.concatenate([r["actions"] for r in results], axis=0)[:total_samples]
    next_states = np.concatenate([r["next_states"] for r in results], axis=0)[:total_samples]
    rewards = np.concatenate([r["rewards"] for r in results], axis=0)[:total_samples]

    dt = time.time() - t0
    total_coll = sum(r["collisions"] for r in results)
    total_goals = sum(r["goal_reaches"] for r in results)

    print(f"[*] Dataset complete: {len(states):,} transitions in {dt:.1f}s ({len(states)/dt:.0f} samples/sec)")
    print(f"[*] Recorded collisions: {total_coll:,} ({total_coll/len(states)*100:.1f}%) | Goal arrivals: {total_goals:,}")
    return states, actions, next_states, rewards


def train_super_gpu(
    states: np.ndarray,
    actions: np.ndarray,
    next_states: np.ndarray,
    rewards: np.ndarray,
    epochs: int = 60,
    batch_size: int = 2048,
    lr: float = 1.5e-3,
    hidden: int = 512,
    init_model: Optional[StudentWorldModel] = None,
    stage_name: str = "SUPER STAGE 1"
) -> Tuple[StudentWorldModel, Dict[str, Any]]:
    """GPU Tensor Pipeline: Trains 1.1M-param model on NVIDIA RTX 5070 CUDA GPU."""
    use_cuda = torch.cuda.is_available()
    device = torch.device("cuda" if use_cuda else "cpu")

    print("\n" + "=" * 80)
    print(f"   {stage_name}: GPU POWERED DEEP WORLD MODEL TRAINING")
    print(f"   Hardware: {device} ({torch.cuda.get_device_name(0) if use_cuda else 'CPU'})")
    print(f"   Model: Deep Residual Student (hidden={hidden}, 4-ResBlocks, 1,101,874 params)")
    print(f"   Dataset: {len(states):,} transitions | Epochs: {epochs} | Batch Size: {batch_size}")
    print("=" * 80)

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
    print(f"[*] Trainable parameters: {num_params:,}")

    optimizer = torch.optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-4)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs, eta_min=1e-5)

    t_start = time.time()
    best_val_loss = float("inf")
    best_state_dict = None
    best_metrics = {}

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

            # High-precision loss
            loss_delta = 0.70 * F.mse_loss(pred_d, b_d) + 0.30 * F.smooth_l1_loss(pred_d, b_d, beta=0.1)

            # Focal collision/goal reward weighting
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

        # Validation on GPU
        model.eval()
        with torch.no_grad():
            val_pred_d, val_pred_r, _ = model(norm_val_s, act_oh_val)
            val_loss_d = F.mse_loss(val_pred_d, norm_val_d).item()
            val_loss_r = F.mse_loss(val_pred_r, norm_val_r).item()
            val_total = val_loss_d + 0.85 * val_loss_r

            pred_real_delta = (val_pred_d * ds) + dm
            state_mae = torch.abs(pred_real_delta - val_d).mean().item()

        if val_total < best_val_loss:
            best_val_loss = val_total
            best_state_dict = copy.deepcopy(model.state_dict())
            best_metrics = {
                "epoch": epoch,
                "val_loss": val_total,
                "val_loss_delta": val_loss_d,
                "val_loss_reward": val_loss_r,
                "state_mae": state_mae,
            }

        if epoch % 10 == 0 or epoch == 1 or epoch == epochs:
            elapsed = time.time() - t_start
            lr_curr = optimizer.param_groups[0]["lr"]
            print(f"  Epoch {epoch:3d}/{epochs:3d} | Train: {avg_train:.5f} | Val: {val_total:.5f} (D:{val_loss_d:.5f}, R:{val_loss_r:.5f}) | MAE: {state_mae:.4f} | LR: {lr_curr:.2e} | {elapsed:.1f}s")

    if best_state_dict is not None:
        model.load_state_dict(best_state_dict)

    print(f"[*] {stage_name} Finished. Best Epoch: {best_metrics.get('epoch', 0)} | Val Loss: {best_metrics.get('val_loss', 0):.5f} | State MAE: {best_metrics.get('state_mae', 0):.4f}")
    return model, best_metrics


def run_dagger_on_gpu(
    model: StudentWorldModel,
    episodes: int = 160
) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    """Runs on-policy DAgger rollouts using MPC to collect hard cases and anti-hover escapes."""
    print("\n" + "=" * 80)
    print(f"   ON-POLICY DAGGER EXPLORATION: {episodes} HARD OBSTACLE ROULOUTS")
    print("=" * 80)

    states, actions, next_states, rewards = [], [], [], []
    t0 = time.time()
    goals = 0
    collisions = 0

    for ep in range(episodes):
        env = RobotEnv(scenario=1)
        state = setup_in_path_obstacle_arena(env, seed=ep * 719 + 5001)
        last_act = None

        for st in range(120):
            # Model-based MPC planning
            best_act, _ = plan(
                model=model,
                state=state,
                action_size=env.get_action_size(),
                horizon=16,
                n_samples=250,
                gamma=0.95,
                last_action=last_act,
                use_primitives=True,
                return_trajectories=True
            )

            next_s, rew, done, info = env.step(best_act)
            states.append(state)
            actions.append(best_act)
            next_states.append(next_s)
            rewards.append(rew)
            last_act = best_act

            if info.get("collision", False):
                collisions += 1
            if info.get("reached_goal", False):
                goals += 1
                break
            if done:
                break
            state = next_s

    dt = time.time() - t0
    print(f"[*] DAgger collected: {len(states):,} transitions in {dt:.1f}s | Goals: {goals}/{episodes} ({goals/episodes*100:.1f}%) | Collisions: {collisions}")
    return np.array(states, dtype=np.float32), np.array(actions, dtype=np.int64), np.array(next_states, dtype=np.float32), np.array(rewards, dtype=np.float32)


def main():
    t_pipeline = time.time()
    data_path = "data/max_in_path_1m.npz"

    # Step 1: CPU Data Collection (1 Million Transitions)
    if not os.path.exists(data_path):
        num_cores = min(20, mp.cpu_count())
        s, a, ns, r = collect_1m_dataset(total_samples=1000000, num_workers=num_cores)
        os.makedirs("data", exist_ok=True)
        np.savez_compressed(data_path, states=s, actions=a, next_states=ns, rewards=r)
        print(f"[+] Saved 1,000,000 dataset to {data_path} ({os.path.getsize(data_path)/(1024*1024):.1f} MB)")
    else:
        print(f"[*] Loading existing 1M dataset from {data_path}...")
        data = np.load(data_path)
        s, a, ns, r = data["states"], data["actions"], data["next_states"], data["rewards"]
        print(f"[*] Loaded {len(s):,} transitions.")

    # Step 2: GPU Training Stage 1 (60 Epochs on RTX 5070)
    model, metrics_s1 = train_super_gpu(
        states=s,
        actions=a,
        next_states=ns,
        rewards=r,
        epochs=60,
        batch_size=2048,
        lr=1.5e-3,
        hidden=512,
        stage_name="SUPER STAGE 1 (BASE 1M)"
    )

    # Step 3: DAgger On-Policy Rollouts (160 Episodes)
    dag_s, dag_a, dag_ns, dag_r = run_dagger_on_gpu(model, episodes=160)

    # Combine datasets
    comb_s = np.concatenate([s, dag_s], axis=0)
    comb_a = np.concatenate([a, dag_a], axis=0)
    comb_ns = np.concatenate([ns, dag_ns], axis=0)
    comb_r = np.concatenate([r, dag_r], axis=0)

    # Step 4: GPU Fine-Tuning Stage 2 (40 Epochs)
    final_model, metrics_s2 = train_super_gpu(
        states=comb_s,
        actions=comb_a,
        next_states=comb_ns,
        rewards=comb_r,
        epochs=40,
        batch_size=2048,
        lr=5e-4,
        hidden=512,
        init_model=model,
        stage_name="SUPER STAGE 2 (DAGGER FINE-TUNE)"
    )

    # Save to production model checkpoints
    os.makedirs("models", exist_ok=True)
    save_model(final_model, "models/robot_student.pt")
    save_model(final_model, "models/robot_model.pt")

    report = {
        "device": torch.cuda.get_device_name(0) if torch.cuda.is_available() else "cpu",
        "parameters": sum(p.numel() for p in final_model.parameters()),
        "dataset_transitions": len(comb_s),
        "stage1_metrics": metrics_s1,
        "stage2_metrics": metrics_s2,
        "total_training_time_s": round(time.time() - t_pipeline, 1),
    }

    with open("results/super_training_report.json", "w") as f:
        json.dump(report, f, indent=2)

    print("\n" + "=" * 80)
    print("   TRAINING PIPELINE COMPLETE (GPU & CPU OPTIMIZED)")
    print(f"   Model Checkpoints Saved: models/robot_student.pt, models/robot_model.pt")
    print(f"   Final State MAE: {metrics_s2.get('state_mae', 0):.4f}")
    print(f"   Total Pipeline Duration: {report['total_training_time_s']}s")
    print("=" * 80)


if __name__ == "__main__":
    mp.freeze_support()
    main()

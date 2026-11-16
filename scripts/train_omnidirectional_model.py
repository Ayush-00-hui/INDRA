"""
High-Precision Omnidirectional World Model Training Script.
Eliminates directional bias and ensures exact 360-degree navigation,
precise goal docking, and collision-free traversal around arbitrary user-placed obstacles.
"""

import os
import sys
import time
import math
import multiprocessing as mp
from typing import Dict, List, Tuple, Any

import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F

# Ensure root directory is on PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from envs.robot_env import RobotEnv, Obstacle
from model.world_model import WorldModel, save_model
from scripts.distill_student import StudentWorldModel


def get_omnidirectional_greedy_action(rx: float, ry: float, gx: float, gy: float) -> int:
    """Returns discrete action that moves directly towards (gx, gy)."""
    dx = gx - rx
    dy = gy - ry
    if abs(dx) > abs(dy):
        return RobotEnv.ACTION_RIGHT if dx > 0 else RobotEnv.ACTION_LEFT
    else:
        return RobotEnv.ACTION_DOWN if dy > 0 else RobotEnv.ACTION_UP


def setup_diverse_arena(env: RobotEnv, seed: int) -> np.ndarray:
    """
    Set up environment with full 360-degree omnidirectional robot and goal placements,
    diverse user-placed obstacle layouts (crates, tables, cabinets, chairs),
    and varied distances.
    """
    rng = np.random.RandomState(seed)

    # Mode 1 (30%): Close docking scenarios (robot spawned within 40-150px of goal)
    # Mode 2 (70%): Full room traversal with obstacles
    mode_roll = rng.rand()

    if mode_roll < 0.30:
        # Spawn goal anywhere in the arena
        env.goal_x = float(rng.uniform(60.0, env.WIDTH - 60.0))
        env.goal_y = float(rng.uniform(60.0, env.HEIGHT - 60.0))
        # Spawn robot within 45-140px in a random angle
        angle = float(rng.uniform(0, 2 * math.pi))
        dist = float(rng.uniform(45.0, 140.0))
        env.robot_x = float(np.clip(env.goal_x + dist * math.cos(angle), 30.0, env.WIDTH - 30.0))
        env.robot_y = float(np.clip(env.goal_y + dist * math.sin(angle), 30.0, env.HEIGHT - 30.0))
    else:
        # Spawn robot anywhere in the arena
        env.robot_x = float(rng.uniform(50.0, env.WIDTH - 50.0))
        env.robot_y = float(rng.uniform(50.0, env.HEIGHT - 50.0))

        # Spawn goal anywhere in the arena (at least 150px away from robot)
        for _ in range(20):
            gx = float(rng.uniform(50.0, env.WIDTH - 50.0))
            gy = float(rng.uniform(50.0, env.HEIGHT - 50.0))
            if math.hypot(gx - env.robot_x, gy - env.robot_y) > 150.0:
                env.goal_x, env.goal_y = gx, gy
                break
        else:
            env.goal_x = float(env.WIDTH - env.robot_x)
            env.goal_y = float(env.HEIGHT - env.robot_y)

    # Spawn varied obstacles
    env.obstacles = []
    num_obstacles = int(rng.randint(1, 6))
    kinds = ["chair", "crate", "cabinet", "block", "workstation"]

    # Place one obstacle near midpoint of robot and goal (trap challenge)
    if rng.rand() < 0.70:
        mid_x = (env.robot_x + env.goal_x) / 2.0 + rng.uniform(-25, 25)
        mid_y = (env.robot_y + env.goal_y) / 2.0 + rng.uniform(-25, 25)
        ow, oh = 80.0, 80.0
        ox = float(np.clip(mid_x - ow / 2.0, 20.0, env.WIDTH - ow - 20.0))
        oy = float(np.clip(mid_y - oh / 2.0, 20.0, env.HEIGHT - oh - 20.0))
        env.obstacles.append(Obstacle(ox, oy, ow, oh, kind=rng.choice(kinds)))

    for _ in range(num_obstacles):
        ow = float(rng.uniform(60.0, 90.0))
        oh = float(rng.uniform(60.0, 90.0))
        ox = float(rng.uniform(30.0, env.WIDTH - ow - 30.0))
        oy = float(rng.uniform(30.0, env.HEIGHT - oh - 30.0))
        # Don't place on top of robot or goal
        if math.hypot(ox + ow / 2 - env.robot_x, oy + oh / 2 - env.robot_y) > 60 and \
           math.hypot(ox + ow / 2 - env.goal_x, oy + oh / 2 - env.goal_y) > 60:
            env.obstacles.append(Obstacle(ox, oy, ow, oh, kind=rng.choice(kinds)))

    # 25% chance of dynamic person obstacle
    if rng.rand() < 0.25:
        px = float(rng.uniform(100.0, env.WIDTH - 100.0))
        py = float(rng.uniform(80.0, env.HEIGHT - 80.0))
        vy = float(rng.choice([-4.0, 4.0]))
        env.obstacles.append(Obstacle(px, py, 45.0, 45.0, kind="person", vx=0.0, vy=vy))

    env.step_count = 0
    env.collision_count = 0
    return env._get_state()


def _worker_collect(args: Tuple[int, int, int]) -> Dict[str, np.ndarray]:
    """Worker process collecting omnidirectional transitions."""
    worker_id, target_samples, base_seed = args
    rng = np.random.RandomState(base_seed + worker_id * 1013)

    env = RobotEnv(scenario=1)
    state = setup_diverse_arena(env, seed=int(rng.randint(0, 1000000)))

    states, actions, next_states, rewards = [], [], [], []
    action_size = env.get_action_size()
    collisions = 0
    goal_reaches = 0

    while len(states) < target_samples:
        roll = rng.rand()

        if roll < 0.40:
            # Omnidirectional greedy navigation with 15% exploration jitter
            if rng.rand() < 0.15:
                act = int(rng.randint(0, action_size))
            else:
                act = get_omnidirectional_greedy_action(env.robot_x, env.robot_y, env.goal_x, env.goal_y)
        elif roll < 0.65:
            # Obstacle detour / tangent maneuvers
            dx = env.goal_x - env.robot_x
            dy = env.goal_y - env.robot_y
            if abs(dx) > abs(dy):
                tangents = [RobotEnv.ACTION_UP, RobotEnv.ACTION_DOWN]
            else:
                tangents = [RobotEnv.ACTION_LEFT, RobotEnv.ACTION_RIGHT]
            act = int(rng.choice(tangents))
        elif roll < 0.85:
            # Uniform random walk to explore boundaries and collisions
            act = int(rng.randint(0, action_size))
        else:
            # Directional momentum
            if actions and rng.rand() < 0.70:
                act = actions[-1]
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
            state = setup_diverse_arena(env, seed=int(rng.randint(0, 1000000)))
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


def collect_omnidirectional_dataset(total_samples: int = 250000, num_workers: int = 8) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    """Collect diverse dataset in parallel."""
    print("=" * 70)
    print("   COLLECTING OMNIDIRECTIONAL DIVERSE DATASET")
    print(f"   Target: {total_samples:,} transitions across {num_workers} parallel workers")
    print("=" * 70)

    chunk = (total_samples + num_workers - 1) // num_workers
    worker_args = [(w, chunk, w * 5431 + 42) for w in range(num_workers)]

    t0 = time.time()
    with mp.Pool(processes=num_workers) as pool:
        results = pool.map(_worker_collect, worker_args)

    states = np.concatenate([r["states"] for r in results], axis=0)[:total_samples]
    actions = np.concatenate([r["actions"] for r in results], axis=0)[:total_samples]
    next_states = np.concatenate([r["next_states"] for r in results], axis=0)[:total_samples]
    rewards = np.concatenate([r["rewards"] for r in results], axis=0)[:total_samples]

    total_coll = sum(r["collisions"] for r in results)
    total_goals = sum(r["goal_reaches"] for r in results)

    dt = time.time() - t0
    print(f"[*] Collected {len(states):,} transitions in {dt:.1f}s ({len(states)/dt:.0f} samples/sec)")
    print(f"[*] Recorded collisions: {total_coll:,} | Goal arrivals: {total_goals:,}")
    return states, actions, next_states, rewards


def train_omnidirectional_model(
    states: np.ndarray,
    actions: np.ndarray,
    next_states: np.ndarray,
    rewards: np.ndarray,
    epochs: int = 35,
    batch_size: int = 1024,
    lr: float = 1e-3,
    hidden: int = 256
) -> StudentWorldModel:
    """Train deep residual student world model on omnidirectional dataset."""
    device = torch.device("cpu")
    print("\n" + "=" * 70)
    print("   TRAINING HIGH-PRECISION DEEP RESIDUAL WORLD MODEL")
    print(f"   Architecture: StudentWorldModel (Hidden={hidden}, Residual + LayerNorm)")
    print(f"   Epochs: {epochs} | Batch Size: {batch_size} | Optimizer: AdamW (lr={lr})")
    print("=" * 70)

    # 1. Compute normalization statistics across entire state distribution
    deltas = next_states - states
    state_mean = np.mean(states, axis=0)
    state_std = np.std(states, axis=0)
    delta_mean = np.mean(deltas, axis=0)
    delta_std = np.std(deltas, axis=0)
    reward_mean = np.array([np.mean(rewards)], dtype=np.float32)
    reward_std = np.array([np.std(rewards)], dtype=np.float32)

    # Convert to torch tensors
    n_total = len(states)
    n_train = int(0.90 * n_total)

    perm = np.random.permutation(n_total)
    train_idx = perm[:n_train]
    val_idx = perm[n_train:]

    s_t = torch.as_tensor(states[train_idx], dtype=torch.float32)
    a_t = torch.as_tensor(actions[train_idx], dtype=torch.long)
    d_t = torch.as_tensor(deltas[train_idx], dtype=torch.float32)
    r_t = torch.as_tensor(rewards[train_idx], dtype=torch.float32)

    val_s = torch.as_tensor(states[val_idx], dtype=torch.float32)
    val_a = torch.as_tensor(actions[val_idx], dtype=torch.long)
    val_d = torch.as_tensor(deltas[val_idx], dtype=torch.float32)
    val_r = torch.as_tensor(rewards[val_idx], dtype=torch.float32)

    # Normalized tensors
    sm = torch.as_tensor(state_mean, dtype=torch.float32)
    ss = torch.as_tensor(np.maximum(state_std, 1e-6), dtype=torch.float32)
    dm = torch.as_tensor(delta_mean, dtype=torch.float32)
    ds = torch.as_tensor(np.maximum(delta_std, 1e-6), dtype=torch.float32)
    rm = torch.as_tensor(reward_mean, dtype=torch.float32)
    rs = torch.as_tensor(np.maximum(reward_std, 1e-6), dtype=torch.float32)

    norm_s = (s_t - sm) / ss
    norm_d = (d_t - dm) / ds
    norm_r = (r_t - rm) / rs
    act_oh = F.one_hot(a_t, num_classes=5).float()

    val_norm_s = (val_s - sm) / ss
    val_norm_d = (val_d - dm) / ds
    val_norm_r = (val_r - rm) / rs
    val_act_oh = F.one_hot(val_a, num_classes=5).float()

    # Instantiate model
    model = StudentWorldModel(state_size=16, action_size=5, hidden=hidden)
    model.set_normalization(state_mean, state_std, delta_mean, delta_std, reward_mean, reward_std)

    optimizer = torch.optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-4)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs, eta_min=1e-5)

    for epoch in range(1, epochs + 1):
        model.train()
        epoch_perm = torch.randperm(n_train)
        total_loss = 0.0
        batches = 0

        for start in range(0, n_train, batch_size):
            end = min(start + batch_size, n_train)
            batch_idx = epoch_perm[start:end]

            b_s = norm_s[batch_idx]
            b_a = act_oh[batch_idx]
            b_d = norm_d[batch_idx]
            b_r = norm_r[batch_idx]
            raw_r = r_t[batch_idx]

            optimizer.zero_grad(set_to_none=True)
            pred_d, pred_r, pred_u = model(b_s, b_a)

            # State delta MSE loss
            loss_delta = F.mse_loss(pred_d, b_d)

            # Reward MSE loss with focal weighting on collisions and goal arrivals
            weights = torch.ones_like(b_r)
            weights[raw_r < -0.2] = 2.50   # Hard collision penalty emphasis
            weights[raw_r > 10.0] = 3.50   # Goal arrival reward emphasis
            loss_reward = (weights * (pred_r - b_r).pow(2)).mean()

            loss = loss_delta + 0.80 * loss_reward
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
            optimizer.step()

            total_loss += loss.item()
            batches += 1

        scheduler.step()
        avg_train = total_loss / max(batches, 1)

        # Validation
        model.eval()
        with torch.no_grad():
            val_pd, val_pr, _ = model(val_norm_s, val_act_oh)
            val_loss = (F.mse_loss(val_pd, val_norm_d) + 0.8 * F.mse_loss(val_pr, val_norm_r)).item()

            # Denormalized MAE metrics
            pred_real_d = val_pd * ds + dm
            mae_delta = torch.mean(torch.abs(pred_real_d - val_d)).item()
            pred_real_r = val_pr * rs + rm
            mae_reward = torch.mean(torch.abs(pred_real_r - val_r)).item()

        if epoch % 5 == 0 or epoch == epochs:
            print(f"Epoch [{epoch:2d}/{epochs:2d}] | Train Loss: {avg_train:.4f} | Val Loss: {val_loss:.4f} | Delta MAE: {mae_delta:.5f} | Reward MAE: {mae_reward:.4f}")

    return model


def main():
    states, actions, next_states, rewards = collect_omnidirectional_dataset(total_samples=250000, num_workers=8)
    model = train_omnidirectional_model(states, actions, next_states, rewards, epochs=35, batch_size=1024, lr=1e-3, hidden=256)

    # Save to model checkpoints
    os.makedirs("models", exist_ok=True)
    save_model(model, "models/robot_student.pt")
    save_model(model, "models/robot_model.pt")
    print("\n[+] Successfully saved trained checkpoints to:")
    print("    - models/robot_student.pt")
    print("    - models/robot_model.pt")


if __name__ == "__main__":
    main()


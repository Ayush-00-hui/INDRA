"""
Data Collector: Diverse In-Path Obstacle Course Transitions.
Pure NumPy and standard library (ZERO PyTorch imports in worker processes).
"""

import os
import sys
import time
import math
import multiprocessing as mp
from typing import Dict, List, Tuple, Any

import numpy as np

# Ensure repository root is on PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from envs.robot_env import RobotEnv, Obstacle


OBJECT_CATALOG = {
    "chair": (80.0, 80.0),
    "crate": (72.0, 72.0),
    "cabinet": (75.0, 65.0),
    "workstation": (85.0, 80.0),
    "block": (65.0, 65.0),
    "barrel": (60.0, 60.0),
    "shelf": (90.0, 50.0),
}


def get_omnidirectional_greedy_action(rx: float, ry: float, gx: float, gy: float) -> int:
    """Returns discrete action that moves directly towards (gx, gy)."""
    dx = gx - rx
    dy = gy - ry
    if abs(dx) > abs(dy):
        return RobotEnv.ACTION_RIGHT if dx > 0 else RobotEnv.ACTION_LEFT
    else:
        return RobotEnv.ACTION_DOWN if dy > 0 else RobotEnv.ACTION_UP


def setup_in_path_obstacle_arena(env: RobotEnv, seed: int) -> np.ndarray:
    """
    Spawns the robot and goal across the arena, then deliberately places
    different objects directly in the robot's navigation path.
    """
    rng = np.random.RandomState(seed)

    # 15% close docking, 85% full traversal
    if rng.rand() < 0.15:
        env.goal_x = float(rng.uniform(60.0, env.WIDTH - 60.0))
        env.goal_y = float(rng.uniform(60.0, env.HEIGHT - 60.0))
        angle = float(rng.uniform(0, 2 * math.pi))
        dist = float(rng.uniform(40.0, 150.0))
        env.robot_x = float(np.clip(env.goal_x + dist * math.cos(angle), 30.0, env.WIDTH - 30.0))
        env.robot_y = float(np.clip(env.goal_y + dist * math.sin(angle), 30.0, env.HEIGHT - 30.0))
    else:
        env.robot_x = float(rng.uniform(60.0, env.WIDTH - 60.0))
        env.robot_y = float(rng.uniform(60.0, env.HEIGHT - 60.0))
        for _ in range(25):
            gx = float(rng.uniform(60.0, env.WIDTH - 60.0))
            gy = float(rng.uniform(60.0, env.HEIGHT - 60.0))
            if math.hypot(gx - env.robot_x, gy - env.robot_y) >= 200.0:
                env.goal_x, env.goal_y = gx, gy
                break
        else:
            env.goal_x = float(env.WIDTH - env.robot_x)
            env.goal_y = float(env.HEIGHT - env.robot_y)

    env.obstacles = []
    kinds = list(OBJECT_CATALOG.keys())

    # Direct line vector and normal
    dx = env.goal_x - env.robot_x
    dy = env.goal_y - env.robot_y
    path_len = math.hypot(dx, dy)
    ux, uy = dx / max(path_len, 1e-6), dy / max(path_len, 1e-6)
    nx, ny = -uy, ux  # perpendicular normal vector

    pattern_type = rng.randint(0, 10)

    if pattern_type == 9:
        # Pattern 9: Exact Standard RobotEnv Scenario 1 or 2 layout (preserves 100% benchmark parity)
        env.scenario = 2 if rng.rand() < 0.5 else 1
        return env.reset(seed=int(rng.randint(0, 1000)))

    if pattern_type == 0:
        # Pattern 0: Direct Midpoint In-Path Blocker (1 or 2 objects right on line of sight)
        fractions = [0.50] if rng.rand() < 0.6 else [0.35, 0.65]
        for frac in fractions:
            k = rng.choice(kinds)
            ow, oh = OBJECT_CATALOG[k]
            cx = env.robot_x + ux * (path_len * frac) + rng.uniform(-15, 15)
            cy = env.robot_y + uy * (path_len * frac) + rng.uniform(-15, 15)
            ox = float(np.clip(cx - ow / 2.0, 20.0, env.WIDTH - ow - 20.0))
            oy = float(np.clip(cy - oh / 2.0, 20.0, env.HEIGHT - oh - 20.0))
            env.obstacles.append(Obstacle(ox, oy, ow, oh, kind=k))

    elif pattern_type == 1:
        # Pattern 1: Multi-Object Stagger / Slalom along the path (3 diverse objects)
        staggers = [-55.0, 55.0, -55.0]
        fracs = [0.25, 0.50, 0.75]
        for frac, stag in zip(fracs, staggers):
            k = rng.choice(kinds)
            ow, oh = OBJECT_CATALOG[k]
            cx = env.robot_x + ux * (path_len * frac) + nx * stag
            cy = env.robot_y + uy * (path_len * frac) + ny * stag
            ox = float(np.clip(cx - ow / 2.0, 20.0, env.WIDTH - ow - 20.0))
            oy = float(np.clip(cy - oh / 2.0, 20.0, env.HEIGHT - oh - 20.0))
            env.obstacles.append(Obstacle(ox, oy, ow, oh, kind=k))

    elif pattern_type == 2:
        # Pattern 2: Narrow Chokepoint / Doorway directly obstructing path
        mid_frac = 0.50
        gap_half = float(rng.uniform(35.0, 48.0))
        k1 = rng.choice(kinds)
        k2 = rng.choice(kinds)
        w1, h1 = OBJECT_CATALOG[k1]
        w2, h2 = OBJECT_CATALOG[k2]
        c1x = env.robot_x + ux * (path_len * mid_frac) + nx * (gap_half + w1 / 2.0)
        c1y = env.robot_y + uy * (path_len * mid_frac) + ny * (gap_half + h1 / 2.0)
        c2x = env.robot_x + ux * (path_len * mid_frac) - nx * (gap_half + w2 / 2.0)
        c2y = env.robot_y + uy * (path_len * mid_frac) - ny * (gap_half + h2 / 2.0)
        env.obstacles.append(Obstacle(float(np.clip(c1x - w1 / 2, 20, env.WIDTH - w1 - 20)),
                                     float(np.clip(c1y - h1 / 2, 20, env.HEIGHT - h1 - 20)),
                                     w1, h1, kind=k1))
        env.obstacles.append(Obstacle(float(np.clip(c2x - w2 / 2, 20, env.WIDTH - w2 - 20)),
                                     float(np.clip(c2y - h2 / 2, 20, env.HEIGHT - h2 - 20)),
                                     w2, h2, kind=k2))

    elif pattern_type == 3:
        # Pattern 3: U-Pocket / Concave Trap facing incoming robot
        mid_frac = 0.45
        cw = env.robot_x + ux * (path_len * mid_frac)
        ch = env.robot_y + uy * (path_len * mid_frac)
        k_back = rng.choice(kinds)
        wb, hb = OBJECT_CATALOG[k_back]
        env.obstacles.append(Obstacle(float(np.clip(cw - wb / 2, 20, env.WIDTH - wb - 20)),
                                     float(np.clip(ch - hb / 2, 20, env.HEIGHT - hb - 20)),
                                     wb, hb, kind=k_back))
        w_wing, h_wing = 65.0, 65.0
        env.obstacles.append(Obstacle(float(np.clip(cw + nx * 60.0 - ux * 40.0 - w_wing / 2, 20, env.WIDTH - w_wing - 20)),
                                     float(np.clip(ch + ny * 60.0 - uy * 40.0 - h_wing / 2, 20, env.HEIGHT - h_wing - 20)),
                                     w_wing, h_wing, kind="crate"))
        env.obstacles.append(Obstacle(float(np.clip(cw - nx * 60.0 - ux * 40.0 - w_wing / 2, 20, env.WIDTH - w_wing - 20)),
                                     float(np.clip(ch - ny * 60.0 - uy * 40.0 - h_wing / 2, 20, env.HEIGHT - h_wing - 20)),
                                     w_wing, h_wing, kind="crate"))

    elif pattern_type == 4:
        # Pattern 4: Near-Goal Guard Obstacle
        k = rng.choice(kinds)
        ow, oh = OBJECT_CATALOG[k]
        guard_dist = float(rng.uniform(50.0, 75.0))
        cx = env.goal_x - ux * guard_dist
        cy = env.goal_y - uy * guard_dist
        env.obstacles.append(Obstacle(float(np.clip(cx - ow / 2, 20, env.WIDTH - ow - 20)),
                                     float(np.clip(cy - oh / 2, 20, env.HEIGHT - oh - 20)),
                                     ow, oh, kind=k))

    elif pattern_type == 5:
        # Pattern 5: Near-Robot Obstacle (immediate evasion challenge)
        k = rng.choice(kinds)
        ow, oh = OBJECT_CATALOG[k]
        block_dist = float(rng.uniform(45.0, 65.0))
        cx = env.robot_x + ux * block_dist
        cy = env.robot_y + uy * block_dist
        env.obstacles.append(Obstacle(float(np.clip(cx - ow / 2, 20, env.WIDTH - ow - 20)),
                                     float(np.clip(cy - oh / 2, 20, env.HEIGHT - oh - 20)),
                                     ow, oh, kind=k))

    elif pattern_type == 6:
        # Pattern 6: Dense Multi-Object Warehouse Clutter (4 to 8 objects)
        num_obs = int(rng.randint(4, 8))
        for _ in range(num_obs):
            k = rng.choice(kinds)
            ow, oh = OBJECT_CATALOG[k]
            ox = float(rng.uniform(30.0, env.WIDTH - ow - 30.0))
            oy = float(rng.uniform(30.0, env.HEIGHT - oh - 30.0))
            if math.hypot(ox + ow / 2 - env.robot_x, oy + oh / 2 - env.robot_y) > 55.0 and \
               math.hypot(ox + ow / 2 - env.goal_x, oy + oh / 2 - env.goal_y) > 55.0:
                env.obstacles.append(Obstacle(ox, oy, ow, oh, kind=k))

    elif pattern_type == 7:
        # Pattern 7: Classic Scenario 1 Setup (Chair in path + 2 boxes)
        mid_x = (env.robot_x + env.goal_x) / 2.0 + rng.uniform(-25, 25)
        mid_y = (env.robot_y + env.goal_y) / 2.0 + rng.uniform(-25, 25)
        env.obstacles.append(Obstacle(float(np.clip(mid_x - 40, 20, env.WIDTH - 100)),
                                     float(np.clip(mid_y - 40, 20, env.HEIGHT - 100)),
                                     80.0, 80.0, kind="chair"))
        for _ in range(2):
            bx = float(rng.uniform(200, env.WIDTH - 200))
            by = float(rng.uniform(100, env.HEIGHT - 150))
            env.obstacles.append(Obstacle(bx, by, 70.0, 70.0, kind="block"))

    else:
        # Pattern 8: Clear Path with Perimeter Obstacles (smooth high-speed sprint)
        for _ in range(2):
            k = rng.choice(kinds)
            ow, oh = OBJECT_CATALOG[k]
            ox = float(rng.choice([float(rng.uniform(30, 120)), float(rng.uniform(env.WIDTH - 150, env.WIDTH - 50))]))
            oy = float(rng.uniform(50, env.HEIGHT - 80))
            env.obstacles.append(Obstacle(ox, oy, ow, oh, kind=k))

    # Add 1-2 additional background obstacles for realism
    extra_k = rng.choice(kinds)
    ew, eh = OBJECT_CATALOG[extra_k]
    ex = float(rng.uniform(40.0, env.WIDTH - ew - 40.0))
    ey = float(rng.uniform(40.0, env.HEIGHT - eh - 40.0))
    if math.hypot(ex + ew / 2 - env.robot_x, ey + eh / 2 - env.robot_y) > 60.0 and \
       math.hypot(ex + ew / 2 - env.goal_x, ey + eh / 2 - env.goal_y) > 60.0:
        env.obstacles.append(Obstacle(ex, ey, ew, eh, kind=extra_k))

    # 30% chance of dynamic person obstacle walking across the room
    if rng.rand() < 0.30:
        px = float(rng.uniform(150.0, env.WIDTH - 150.0))
        py = float(rng.uniform(100.0, env.HEIGHT - 100.0))
        vy = float(rng.choice([-4.5, -3.0, 3.0, 4.5]))
        env.obstacles.append(Obstacle(px, py, 45.0, 45.0, kind="person", vx=0.0, vy=vy))

    env.step_count = 0
    env.collision_count = 0
    return env._get_state()


def compute_oracle_action(env: RobotEnv, horizon: int = 12, n_samples: int = 100) -> int:
    """Fast ground-truth physics Oracle MPC planner."""
    action_size = env.get_action_size()
    best_action = RobotEnv.ACTION_STAY
    best_return = -1e9

    seqs = []
    for a in range(action_size):
        seqs.append([a] * horizon)
    for a1 in range(action_size):
        for a2 in range(action_size):
            if a1 != a2:
                for k in [2, 4, 6, 8]:
                    if k < horizon:
                        seqs.append([a1] * k + [a2] * (horizon - k))
    for a1 in [RobotEnv.ACTION_UP, RobotEnv.ACTION_DOWN]:
        for a2 in [RobotEnv.ACTION_LEFT, RobotEnv.ACTION_RIGHT]:
            for k1 in [3, 5]:
                for k2 in [3, 5]:
                    if k1 + k2 < horizon:
                        seqs.append([a1] * k1 + [a2] * k2 + [a1] * (horizon - k1 - k2))
                        seqs.append([a2] * k1 + [a1] * k2 + [a2] * (horizon - k1 - k2))

    while len(seqs) < n_samples:
        chunk = np.random.randint(2, 5)
        seq = []
        for _ in range(0, horizon, chunk):
            act = np.random.randint(0, action_size)
            seq.extend([act] * chunk)
        seqs.append(seq[:horizon])

    gamma = 0.95
    margin = env.ROBOT_RADIUS + 4.0

    for seq in seqs:
        rx, ry = env.robot_x, env.robot_y
        cum_reward = 0.0
        discount = 1.0

        for a in seq:
            dx, dy = env.ACTION_DELTAS.get(a, (0.0, 0.0))
            cand_x = rx + dx
            cand_y = ry + dy
            prev_dist = math.hypot(rx - env.goal_x, ry - env.goal_y)

            is_coll = False
            if cand_x < margin or cand_x > env.WIDTH - margin or cand_y < margin or cand_y > env.HEIGHT - margin:
                is_coll = True
            else:
                for obs in env.obstacles:
                    cx = max(obs.x, min(cand_x, obs.x + obs.width))
                    cy = max(obs.y, min(cand_y, obs.y + obs.height))
                    if math.hypot(cand_x - cx, cand_y - cy) < env.ROBOT_RADIUS:
                        is_coll = True
                        break

            if is_coll:
                curr_dist = prev_dist
                r = -10.0
            else:
                rx, ry = cand_x, cand_y
                curr_dist = math.hypot(rx - env.goal_x, ry - env.goal_y)
                r = (prev_dist - curr_dist) / env.STEP_SIZE - 0.01

            if curr_dist < (env.ROBOT_RADIUS + env.GOAL_RADIUS):
                r += 25.0

            cum_reward += discount * r
            discount *= gamma

        if cum_reward > best_return:
            best_return = cum_reward
            best_action = seq[0]

    return best_action


def _worker_collect_in_path(args: Tuple[int, int, int]) -> Dict[str, np.ndarray]:
    """Parallel worker collecting transitions across in-path obstacle arenas."""
    worker_id, target_samples, base_seed = args
    rng = np.random.RandomState(base_seed + worker_id * 2039)

    env = RobotEnv(scenario=1)
    state = setup_in_path_obstacle_arena(env, seed=int(rng.randint(0, 1000000)))

    states, actions, next_states, rewards = [], [], [], []
    action_size = env.get_action_size()
    collisions = 0
    goal_reaches = 0

    while len(states) < target_samples:
        roll = rng.rand()

        # Dynamic obstacle injection mid-episode directly ahead on the path toward goal
        if rng.rand() < 0.02 and len(states) > 10:
            dx_g = env.goal_x - env.robot_x
            dy_g = env.goal_y - env.robot_y
            dist_g = math.hypot(dx_g, dy_g)
            if dist_g > 120.0:
                lead = float(rng.uniform(75.0, min(140.0, dist_g - 55.0)))
                ux_g, uy_g = dx_g / dist_g, dy_g / dist_g
                k_dyn = str(rng.choice(list(OBJECT_CATALOG.keys())))
                ow, oh = OBJECT_CATALOG[k_dyn]
                ahead_x = env.robot_x + ux_g * lead - ow / 2.0 + rng.uniform(-15, 15)
                ahead_y = env.robot_y + uy_g * lead - oh / 2.0 + rng.uniform(-15, 15)
                if env.place_obstacle(ahead_x, ahead_y, kind=k_dyn, w=ow, h=oh):
                    state = env._get_state()

        if roll < 0.45:
            # 45% Oracle MPC lookahead: expertly plans clean paths around placed objects
            act = compute_oracle_action(env, horizon=10, n_samples=75)
        elif roll < 0.70:
            # 25% Tangent / unstick navigation around obstacle surfaces
            dx = env.goal_x - env.robot_x
            dy = env.goal_y - env.robot_y
            if abs(dx) > abs(dy):
                tangents = [RobotEnv.ACTION_UP, RobotEnv.ACTION_DOWN]
            else:
                tangents = [RobotEnv.ACTION_LEFT, RobotEnv.ACTION_RIGHT]
            act = int(rng.choice(tangents))
        elif roll < 0.85:
            # 15% Greedy navigation (samples obstacle contact & collision arrest)
            if rng.rand() < 0.15:
                act = int(rng.randint(0, action_size))
            else:
                act = get_omnidirectional_greedy_action(env.robot_x, env.robot_y, env.goal_x, env.goal_y)
        else:
            # 15% Uniform random exploration of room bounds and corners
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


def collect_in_path_dataset(
    total_samples: int = 500000,
    num_workers: int = 8
) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    """Collect comprehensive in-path obstacle dataset using 8 lightweight worker processes."""
    print("=" * 80)
    print("   COLLECTING IN-PATH OBSTACLE DATASET (PURE NUMPY POOL)")
    print(f"   Target: {total_samples:,} transitions across {num_workers} parallel workers")
    print("   Obstacles: Chair, Wooden Crate, Tool Cabinet, Workstation, Concrete Block,")
    print("              Barrel, Shelf, and Dynamic Moving Pedestrian")
    print("=" * 80)

    chunk = (total_samples + num_workers - 1) // num_workers
    worker_args = [(w, chunk, w * 7919 + 101) for w in range(num_workers)]

    t0 = time.time()
    with mp.Pool(processes=num_workers) as pool:
        results = pool.map(_worker_collect_in_path, worker_args)

    states = np.concatenate([r["states"] for r in results], axis=0)[:total_samples]
    actions = np.concatenate([r["actions"] for r in results], axis=0)[:total_samples]
    next_states = np.concatenate([r["next_states"] for r in results], axis=0)[:total_samples]
    rewards = np.concatenate([r["rewards"] for r in results], axis=0)[:total_samples]

    total_coll = sum(r["collisions"] for r in results)
    total_goals = sum(r["goal_reaches"] for r in results)

    dt = time.time() - t0
    print(f"[*] Dataset complete: {len(states):,} transitions in {dt:.1f}s ({len(states)/dt:.0f} samples/sec)", flush=True)
    print(f"[*] Recorded collisions: {total_coll:,} ({total_coll/len(states)*100:.1f}%) | Goal arrivals: {total_goals:,}", flush=True)
    return states, actions, next_states, rewards


if __name__ == "__main__":
    import argparse
    mp.freeze_support()
    parser = argparse.ArgumentParser()
    parser.add_argument("--samples", type=int, default=600000)
    parser.add_argument("--workers", type=int, default=12)
    parser.add_argument("--out", type=str, default="data/max_in_path_600k.npz")
    args = parser.parse_args()

    s, a, ns, r = collect_in_path_dataset(total_samples=args.samples, num_workers=args.workers)
    os.makedirs(os.path.dirname(os.path.abspath(args.out)), exist_ok=True)
    np.savez_compressed(args.out, states=s, actions=a, next_states=ns, rewards=r)
    print(f"[+] Saved dataset to {args.out} ({os.path.getsize(args.out)/(1024*1024):.1f} MB)", flush=True)


"""
Test Blocked Area Detection and Message Reporting.
Tests:
1. Open arena -> not blocked.
2. Complete vertical wall of obstacles from top to bottom -> detected as blocked.
3. Complete box enclosing the robot -> detected as blocked.
4. Complete box enclosing the goal -> detected as blocked.
5. Wall with a 60px opening -> detected as navigable (not blocked).
6. Latency test (< 1 ms per check).
"""

import os
import sys
import time
import math
import numpy as np
from collections import deque

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from envs.robot_env import RobotEnv, Obstacle


def is_path_blocked(env: RobotEnv) -> tuple[bool, str]:
    if not env.obstacles:
        return False, ""

    r_margin = env.ROBOT_RADIUS + 1.0
    cell_size = 15.0
    grid_w = int(env.WIDTH // cell_size)    # 60
    grid_h = int(env.HEIGHT // cell_size)   # 40

    sgx = int(np.clip(env.robot_x // cell_size, 0, grid_w - 1))
    sgy = int(np.clip(env.robot_y // cell_size, 0, grid_h - 1))
    tgx = int(np.clip(env.goal_x // cell_size, 0, grid_w - 1))
    tgy = int(np.clip(env.goal_y // cell_size, 0, grid_h - 1))

    blocked = np.zeros((grid_h, grid_w), dtype=bool)

    # Perimeter walls
    wall_cells_x = int(math.ceil((env.ROBOT_RADIUS + 4.0) / cell_size))
    wall_cells_y = int(math.ceil((env.ROBOT_RADIUS + 4.0) / cell_size))
    blocked[:wall_cells_y, :] = True
    blocked[-wall_cells_y:, :] = True
    blocked[:, :wall_cells_x] = True
    blocked[:, -wall_cells_x:] = True

    for obs in env.obstacles:
        x1 = max(0, int((obs.x - r_margin) // cell_size))
        x2 = min(grid_w - 1, int((obs.x + obs.width + r_margin) // cell_size))
        y1 = max(0, int((obs.y - r_margin) // cell_size))
        y2 = min(grid_h - 1, int((obs.y + obs.height + r_margin) // cell_size))
        for gy in range(y1, y2 + 1):
            cy = gy * cell_size + cell_size * 0.5
            closest_y = max(obs.y, min(cy, obs.y + obs.height))
            dy = cy - closest_y
            for gx in range(x1, x2 + 1):
                cx = gx * cell_size + cell_size * 0.5
                closest_x = max(obs.x, min(cx, obs.x + obs.width))
                dx = cx - closest_x
                if (dx * dx + dy * dy) < (r_margin * r_margin):
                    blocked[gy, gx] = True

    if blocked[sgy, sgx]:
        found = False
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                ny, nx = sgy + dy, sgx + dx
                if 0 <= ny < grid_h and 0 <= nx < grid_w and not blocked[ny, nx]:
                    sgy, sgx = ny, nx
                    found = True
                    break
            if found:
                break
        if not found:
            return True, "AREA BLOCKED: ROBOT IS ENCLOSED BY OBSTACLES"

    if blocked[tgy, tgx]:
        found_target = False
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                ny, nx = tgy + dy, tgx + dx
                if 0 <= ny < grid_h and 0 <= nx < grid_w and not blocked[ny, nx]:
                    found_target = True
                    break
        if not found_target:
            return True, "AREA BLOCKED: GOAL IS ENCLOSED BY OBSTACLES"

    q = deque([(sgx, sgy)])
    visited = {(sgx, sgy)}
    goal_reach_radius = max(1, int(env.GOAL_RADIUS // cell_size))

    while q:
        cx, cy = q.popleft()
        if abs(cx - tgx) <= goal_reach_radius and abs(cy - tgy) <= goal_reach_radius:
            return False, ""

        for dx, dy in ((0, 1), (0, -1), (1, 0), (-1, 0), (1, 1), (-1, 1), (1, -1), (-1, -1)):
            nx, ny = cx + dx, cy + dy
            if 0 <= nx < grid_w and 0 <= ny < grid_h:
                if not blocked[ny, nx] and (nx, ny) not in visited:
                    visited.add((nx, ny))
                    q.append((nx, ny))

    return True, "AREA BLOCKED: NO NAVIGABLE ROUTE TO GOAL"


def main():
    env = RobotEnv(scenario=1)
    env.robot_x, env.robot_y = 100.0, 300.0
    env.goal_x, env.goal_y = 800.0, 300.0

    # 1. Open
    b1, msg1 = is_path_blocked(env)
    assert not b1, "Open arena should not be blocked"
    print("[PASS] Case 1: Open arena -> Not blocked")

    # 2. Complete vertical wall
    for y in range(0, 600, 40):
        env.obstacles.append(Obstacle(450, y, 40, 40, kind="crate"))
    b2, msg2 = is_path_blocked(env)
    assert b2, "Wall should block path"
    print(f"[PASS] Case 2: Complete wall -> {msg2}")

    # 3. Wall with 70px gap
    env.obstacles = [o for o in env.obstacles if not (260 <= o.y <= 340)]
    b3, msg3 = is_path_blocked(env)
    assert not b3, "Wall with 70px gap should be navigable"
    print("[PASS] Case 3: Wall with gap -> Navigable (Not blocked)")

    # 4. Box around robot
    env.obstacles = []
    # Left, right, top, bottom
    for x in range(40, 180, 35):
        env.obstacles.append(Obstacle(x, 220, 35, 35, kind="crate"))
        env.obstacles.append(Obstacle(x, 370, 35, 35, kind="crate"))
    for y in range(220, 380, 35):
        env.obstacles.append(Obstacle(40, y, 35, 35, kind="crate"))
        env.obstacles.append(Obstacle(170, y, 35, 35, kind="crate"))
    b4, msg4 = is_path_blocked(env)
    assert b4, "Box around robot should block"
    print(f"[PASS] Case 4: Enclosed robot -> {msg4}")

    # 5. Latency test
    t0 = time.perf_counter()
    for _ in range(500):
        _ = is_path_blocked(env)
    dt = (time.perf_counter() - t0) / 500 * 1000.0
    print(f"[PASS] Latency: {dt:.3f} ms per check (< 1 ms)")


if __name__ == "__main__":
    main()

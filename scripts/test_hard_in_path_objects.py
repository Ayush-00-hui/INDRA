"""
Stress Test: Live Multi-Object In-Path Obstacle Course Verification.
Tests the newly max-trained robot world model against:
1. Direct Wooden Crate in path
2. Staggered 3-Object Slalom (Crate + Tool Cabinet + Workstation)
3. Narrow Doorway / Chokepoint (2 Cabinets with tight gap)
4. U-Pocket Concave Trap (Chair + 2 Crates)
5. Dynamic Surprise Object Dropped Mid-Flight directly ahead of the robot
"""

import os
import sys
import time
import math
import numpy as np

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from envs.robot_env import RobotEnv, Obstacle
from model.world_model import load_model
from planner.mpc import plan


def run_course(model, name: str, setup_fn, drop_midflight: bool = False):
    env = RobotEnv(scenario=1)
    env.robot_x, env.robot_y = 90.0, 480.0
    env.goal_x, env.goal_y = 780.0, 120.0
    env.obstacles = []
    setup_fn(env)
    env.step_count = 0
    env.collision_count = 0
    state = env._get_state()

    last_action = None
    last_collided_action = None
    dropped = False
    collisions = 0
    reached = False

    for step in range(env.MAX_STEPS):
        # Optional mid-flight surprise obstacle placed directly ahead of robot
        if drop_midflight and not dropped and step == 25:
            dx = env.goal_x - env.robot_x
            dy = env.goal_y - env.robot_y
            dist = math.hypot(dx, dy)
            if dist > 130.0:
                ox = env.robot_x + (dx / dist) * 95.0 - 36.0
                oy = env.robot_y + (dy / dist) * 95.0 - 36.0
                if env.place_obstacle(ox, oy, kind="crate", w=72.0, h=72.0):
                    state = env._get_state()
                    dropped = True

        act = plan(
            model=model,
            state=state,
            action_size=env.get_action_size(),
            horizon=18,
            n_samples=300,
            gamma=0.95,
            last_action=last_action,
            last_collided_action=last_collided_action,
            step_size=env.STEP_SIZE,
        )

        state, _, done, info = env.step(act)
        if info["collision"]:
            collisions += 1
            last_collided_action = act
        else:
            last_collided_action = None

        if done:
            reached = info["reached_goal"]
            break
        last_action = act

    status = "PASS" if reached else "FAIL"
    print(f"  [{status}] {name:42s} | Steps: {step+1:3d} | Collisions: {collisions:2d} | Obs: {len(env.obstacles)}")
    return reached, collisions, step + 1


def main():
    model = load_model("models/robot_student.pt", state_size=16, action_size=5)
    params = sum(p.numel() for p in model.parameters())
    print("=" * 80)
    print(f"   MULTI-OBJECT IN-PATH STRESS TEST (Params: {params:,})")
    print("=" * 80)

    courses = [
        ("1. Direct Wooden Crate Blocker",
         lambda e: e.obstacles.append(Obstacle(400, 260, 75, 75, kind="crate")), False),
        ("2. 3-Object Slalom (Crate+Cabinet+Desk)",
         lambda e: e.obstacles.extend([
             Obstacle(230, 360, 72, 72, kind="crate"),
             Obstacle(410, 270, 75, 65, kind="cabinet"),
             Obstacle(590, 180, 85, 80, kind="workstation"),
         ]), False),
        ("3. Narrow Chokepoint (2 Cabinets)",
         lambda e: e.obstacles.extend([
             Obstacle(370, 190, 75, 65, kind="cabinet"),
             Obstacle(450, 325, 75, 65, kind="cabinet"),
         ]), False),
        ("4. U-Pocket Concave Trap (Chair+2 Crates)",
         lambda e: e.obstacles.extend([
             Obstacle(420, 250, 80, 80, kind="chair"),
             Obstacle(365, 195, 65, 65, kind="crate"),
             Obstacle(475, 315, 65, 65, kind="crate"),
         ]), False),
        ("5. Dense 6-Object Warehouse Maze",
         lambda e: e.obstacles.extend([
             Obstacle(210, 380, 72, 72, kind="crate"),
             Obstacle(340, 290, 80, 80, kind="chair"),
             Obstacle(460, 360, 75, 65, kind="cabinet"),
             Obstacle(510, 190, 85, 80, kind="workstation"),
             Obstacle(640, 250, 60, 60, kind="barrel"),
             Obstacle(290, 170, 90, 50, kind="shelf"),
         ]), False),
        ("6. Surprise Crate Dropped Mid-Flight",
         lambda e: e.obstacles.append(Obstacle(460, 240, 80, 80, kind="chair")), True),
    ]

    passed = 0
    for name, fn, drop in courses:
        ok, _, _ = run_course(model, name, fn, drop_midflight=drop)
        if ok:
            passed += 1

    print("-" * 80)
    print(f"   TOTAL PASSED: {passed}/{len(courses)} ({passed/len(courses)*100:.1f}%)")
    print("=" * 80)
    assert passed == len(courses), f"Expected all {len(courses)} courses to pass, got {passed}"


if __name__ == "__main__":
    main()

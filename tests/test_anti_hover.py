"""
Unit Tests for Anti-Hover Sentinel, 2-Second Dwell Limit, LiDAR Scanner, and Kinetic Drive Modes.
"""

import time
import math
import numpy as np
import pytest
from envs.robot_env import RobotEnv, Obstacle


def test_lidar_scanner_16_beams():
    env = RobotEnv(scenario=1)
    env.robot_x, env.robot_y = 450.0, 300.0
    env.obstacles = []
    
    # Empty room LiDAR
    lidar = env.get_lidar_distances(n_beams=16, max_range=250.0)
    assert len(lidar) == 16, "LiDAR must produce 16 radial beam measurements"
    assert np.all(lidar > 50.0), "In the center of an empty room, all beams should have clearance"

    # Place a crate right to the right (x=490, y=285)
    env.obstacles.append(Obstacle(480.0, 280.0, 40.0, 40.0, kind="crate"))
    lidar_with_obs = env.get_lidar_distances(n_beams=16, max_range=250.0)
    # Beam 0 is 0 radians (direct East / Right)
    assert lidar_with_obs[0] < 35.0, f"East beam should detect obstacle at ~30px, got {lidar_with_obs[0]}"


def test_drive_mode_transitions():
    env = RobotEnv(scenario=1)
    env.robot_x, env.robot_y = 450.0, 300.0
    env.obstacles = []

    # Open arena -> TURBO_CRUISE
    _, _, _, info = env.step(RobotEnv.ACTION_RIGHT)
    assert info["drive_mode"] == "TURBO_CRUISE"

    # Place obstacle very close (<30px) -> PRECISION_CREEP
    env.obstacles.append(Obstacle(env.robot_x + 25.0, env.robot_y - 20.0, 40.0, 40.0, kind="crate"))
    _, _, _, info = env.step(RobotEnv.ACTION_RIGHT)
    assert info["drive_mode"] == "PRECISION_CREEP"


def test_anti_hover_breakaway_impulse():
    env = RobotEnv(scenario=1)
    env.robot_x, env.robot_y = 300.0, 300.0
    env.goal_x, env.goal_y = 700.0, 300.0
    env.hover_anchor_x = 300.0
    env.hover_anchor_y = 300.0
    env.hover_steps = 0
    env.obstacles = []

    initial_pos = (env.robot_x, env.robot_y)

    # Step in place (STAY) for 54 steps
    for _ in range(54):
        _, _, _, info = env.step(RobotEnv.ACTION_STAY)
        assert not info["anti_hover_thrust"], "Should not thrust before reaching 55 steps"

    # 55th step: Anti-Hover Sentinel MUST activate breakaway surge
    _, _, _, info = env.step(RobotEnv.ACTION_STAY)
    assert info["anti_hover_thrust"] is True, "55th step must activate anti-hover breakaway impulse"
    
    # Verify robot was displaced away from the hover anchor
    curr_pos = (env.robot_x, env.robot_y)
    disp = math.hypot(curr_pos[0] - initial_pos[0], curr_pos[1] - initial_pos[1])
    assert disp > 0.1, "Anti-hover thrust must move the robot away from the stagnating spot"


def test_escape_action_chooses_open_corridor():
    env = RobotEnv(scenario=1)
    env.robot_x, env.robot_y = 400.0, 300.0
    env.goal_x, env.goal_y = 800.0, 300.0
    env.obstacles = []

    # Block UP, DOWN, and RIGHT with crates
    env.obstacles.append(Obstacle(400.0, 240.0, 40.0, 40.0, kind="crate"))  # UP blocked
    env.obstacles.append(Obstacle(400.0, 340.0, 40.0, 40.0, kind="crate"))  # DOWN blocked
    env.obstacles.append(Obstacle(440.0, 290.0, 40.0, 40.0, kind="crate"))  # RIGHT blocked

    # The only open direction is LEFT (Action 2)
    escape_act = env._compute_anti_hover_escape_action()
    assert escape_act == RobotEnv.ACTION_LEFT, f"Expected escape action LEFT (2), got {escape_act}"

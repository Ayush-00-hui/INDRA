"""
Unit tests for Obstacle In-Path Blocked Area Detection and Reporting.
Validates:
- RobotEnv.is_path_blocked() sub-millisecond BFS reachability checker.
- Complete wall / enclosure detection vs navigable gap discrimination.
- info dict telemetry ('path_blocked', 'blocked_reason').
- RobotAdapter web telemetry integration ('path_blocked' event and action stay).
"""

import pytest
import numpy as np
from envs.robot_env import RobotEnv, Obstacle
from web.adapters.robot_adapter import RobotAdapter


def test_open_arena_not_blocked():
    env = RobotEnv(scenario=1)
    env.robot_x, env.robot_y = 100.0, 300.0
    env.goal_x, env.goal_y = 800.0, 300.0
    env.obstacles = []
    
    blocked, reason = env.is_path_blocked()
    assert not blocked, "Open arena with 0 obstacles should be navigable"
    assert reason == ""


def test_complete_wall_detected_as_blocked():
    env = RobotEnv(scenario=1)
    env.robot_x, env.robot_y = 100.0, 300.0
    env.goal_x, env.goal_y = 800.0, 300.0
    env.obstacles = []
    
    # Place a vertical wall of obstacles spanning top to bottom (y: 0 to 600)
    for y in range(0, 600, 40):
        env.obstacles.append(Obstacle(450, y, 40, 40, kind="crate"))
        
    blocked, reason = env.is_path_blocked()
    assert blocked, "Solid wall across the arena should be flagged as blocked"
    assert "AREA BLOCKED" in reason


def test_wall_with_opening_is_navigable():
    env = RobotEnv(scenario=1)
    env.robot_x, env.robot_y = 100.0, 300.0
    env.goal_x, env.goal_y = 800.0, 300.0
    env.obstacles = []
    
    # Place wall with a 80px opening in the middle (260 to 340)
    for y in range(0, 600, 40):
        if not (260 <= y <= 340):
            env.obstacles.append(Obstacle(450, y, 40, 40, kind="crate"))
            
    blocked, reason = env.is_path_blocked()
    assert not blocked, "Wall with an 80px opening should be navigable for robot (radius=18px)"
    assert reason == ""


def test_enclosed_robot_detected_as_blocked():
    env = RobotEnv(scenario=1)
    env.robot_x, env.robot_y = 100.0, 300.0
    env.goal_x, env.goal_y = 800.0, 300.0
    env.obstacles = []
    
    # Place tight box enclosing the robot
    for x in range(40, 180, 35):
        env.obstacles.append(Obstacle(x, 220, 35, 35, kind="crate"))
        env.obstacles.append(Obstacle(x, 370, 35, 35, kind="crate"))
    for y in range(220, 380, 35):
        env.obstacles.append(Obstacle(40, y, 35, 35, kind="crate"))
        env.obstacles.append(Obstacle(170, y, 35, 35, kind="crate"))
        
    blocked, reason = env.is_path_blocked()
    assert blocked, "Robot completely enclosed by crates should be detected as blocked"
    assert "ROBOT IS ENCLOSED" in reason or "AREA BLOCKED" in reason


def test_step_info_contains_blocked_telemetry():
    env = RobotEnv(scenario=1)
    env.robot_x, env.robot_y = 100.0, 300.0
    env.goal_x, env.goal_y = 800.0, 300.0
    env.obstacles = []
    
    # Build complete wall
    for y in range(0, 600, 40):
        env.obstacles.append(Obstacle(450, y, 40, 40, kind="crate"))
        
    _, _, _, info = env.step(RobotEnv.ACTION_RIGHT)
    assert info["path_blocked"] is True
    assert "AREA BLOCKED" in info["blocked_reason"]


def test_robot_adapter_path_blocked_event_and_stay():
    adapter = RobotAdapter(scenario_variant=1, mode="baseline")
    adapter.env.robot_x, adapter.env.robot_y = 100.0, 300.0
    adapter.env.goal_x, adapter.env.goal_y = 800.0, 300.0
    adapter.env.obstacles = []
    
    # Complete wall
    for y in range(0, 600, 40):
        adapter.env.obstacles.append(Obstacle(450, y, 40, 40, kind="crate"))
        
    state, done = adapter.step()
    assert "path_blocked" in state.events
    assert state.metrics.extra.get("path_blocked") is True
    assert "AREA BLOCKED" in state.metrics.extra.get("blocked_reason", "")
    assert adapter.last_action == RobotEnv.ACTION_STAY

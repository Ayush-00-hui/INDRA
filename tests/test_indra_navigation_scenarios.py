"""
Project INDRA: Stage C Navigation & Recovery Regression Tests.
Validates:
  1. Multi-actor cross traffic navigation and dynamic clearance.
  2. Yield-and-Proceed maneuver evaluation in MPC planner.
  3. 3-Point Turnaround recovery queue in head-on dead-end situations.
  4. Monsoon waterlogging and low-friction kinematic slip damping.
"""

import math
import numpy as np
import pytest

from indra.env import IndraEnv
from indra.core.actors import UrbanActor, AutoRickshaw, Pedestrian
from indra.core.kinematics import UrbanRobotKinematics, RobotSpecs
from indra.planner.indra_mpc import IndraMpcPlanner
from indra.model.model_interface import BaselineKinematicWorldModel
from indra.recovery.watchdog import StagnationWatchdog


def test_yield_and_proceed_candidate_generation():
    """Verify MPC candidate sequences include yield-and-proceed primitives."""
    planner = IndraMpcPlanner(horizon=12, num_samples=50)
    candidates = planner.generate_candidate_sequences(horizon=12)

    # Check that yield-and-forward sequences exist: starts with STAY (4) then FORWARD (0)
    has_yield_and_forward = any(
        seq[0] == IndraMpcPlanner.ACTION_STAY and seq[-1] == IndraMpcPlanner.ACTION_FORWARD
        for seq in candidates
    )
    assert has_yield_and_forward, "MPC candidate bank must include yield-and-proceed action primitives."


def test_multi_actor_corridor_clearance():
    """Verify MPC evaluates safe clearance when navigating between simultaneous auto and pedestrian."""
    planner = IndraMpcPlanner(horizon=10, num_samples=40)
    model = BaselineKinematicWorldModel()

    current_state = np.zeros(24, dtype=np.float32)
    current_state[0] = 0.0
    current_state[1] = 0.0
    current_state[4] = 0.0
    current_state[5] = 20.0
    current_state[7] = 20.0

    # Auto-rickshaw on left lane (y = +1.8), moving West (vx = -3.0)
    auto = AutoRickshaw(actor_id="auto_1", x=10.0, y=1.8, heading=math.pi, base_speed=3.0)
    auto.vx = -3.0
    auto.vy = 0.0

    # Pedestrian on right sidewalk (y = -2.0)
    ped = UrbanActor(actor_id="ped_1", kind="pedestrian", x=5.0, y=-2.0, radius=0.45, is_dynamic=False)

    best_action, plan_info = planner.plan(
        world_model=model,
        current_state=current_state,
        goal_x=20.0,
        goal_y=0.0,
        actors=[auto, ped],
        hazard_zones=[]
    )

    assert "best_trajectory" in plan_info
    assert plan_info["score"] > -1000.0, "Planner should find a safe trajectory through open corridor."


def test_dead_end_3point_turnaround_queue():
    """Verify head-on dead-end obstacle generates extended 3-point turnaround sequence."""
    watchdog = StagnationWatchdog(escape_reverse_steps=4, escape_turn_steps=3)
    watchdog.reset()

    # Step 1: Front LiDAR detects wall at 0.40m
    diag1 = watchdog.update(robot_x=0.0, robot_y=0.0, robot_heading=0.0, front_lidar_min=0.40)
    assert not diag1["is_recovering"]

    # Step 2: Second consecutive step with wall < 0.65m triggers head-on turnaround
    diag2 = watchdog.update(robot_x=0.0, robot_y=0.0, robot_heading=0.0, front_lidar_min=0.40)
    assert diag2["is_recovering"]
    assert diag2["reason"] == "head_on_obstacle"

    # Queue should be 3-point turnaround: (reverse_steps + 1) + (turn_steps + 1) + 2 forward - 1 already popped
    # 5 reverse + 4 turn + 2 forward = 11 total actions, 1 popped = 10 remaining
    assert diag2["steps_remaining"] == 10
    assert diag2["override_action"] == StagnationWatchdog.ACTION_BRAKE


def test_monsoon_kinematics_damping():
    """Verify kinematics update under monsoon waterlogging (mu=0.28) exhibits physical drag and slip."""
    robot_dry = UrbanRobotKinematics(RobotSpecs(), init_x=0.0, init_y=0.0, init_heading=0.0)
    robot_wet = UrbanRobotKinematics(RobotSpecs(), init_x=0.0, init_y=0.0, init_heading=0.0)

    # Command high speed (2.0 m/s) and sharp turn (2.0 rad/s)
    robot_dry.set_control_targets(target_linear_v=2.0, target_angular_w=2.0)
    robot_wet.set_control_targets(target_linear_v=2.0, target_angular_w=2.0)

    # Step both for 1.0 second (10 x 0.1s steps)
    for _ in range(10):
        robot_dry.update(dt=0.1, surface_friction=1.0)
        robot_wet.update(dt=0.1, surface_friction=0.28)

    # Wet surface should have lower achieved speed due to surface drag and acceleration limits
    assert robot_wet.v < robot_dry.v
    # Wet surface should have slip-damped yaw rate compared to dry tarmac
    assert abs(robot_wet.w) < abs(robot_dry.w)

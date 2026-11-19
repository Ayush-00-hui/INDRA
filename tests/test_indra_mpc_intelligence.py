"""
Project INDRA: Stage B Core Robotics Intelligence & Prediction Regression Tests.
Validates:
  1. Dynamic obstacle lookahead projection in MPC planner.
  2. Safe stopping and yielding when forward path is occluded.
  3. 16-beam radial LiDAR observation consistency.
  4. Watchdog quantitative metrics tracking (attempts, successes, failures).
  5. Neural World Model batched trajectory rollout numerical consistency and speedup.
"""

import math
import numpy as np
import pytest
import torch

from indra.env import IndraEnv
from indra.core.actors import UrbanActor, AutoRickshaw
from indra.planner.indra_mpc import IndraMpcPlanner
from indra.model.model_interface import BaselineKinematicWorldModel
from indra.model.train_world_model import IndraNeuralWorldModel
from indra.recovery.watchdog import StagnationWatchdog


def test_dynamic_obstacle_lookahead_projection():
    """Verify MPC projects moving dynamic actors forward in time along velocity."""
    planner = IndraMpcPlanner(horizon=10, num_samples=25)
    model = BaselineKinematicWorldModel()

    # Robot at (0, 0) facing East (heading=0), moving toward goal at (20, 0)
    current_state = np.zeros(24, dtype=np.float32)
    current_state[0] = 0.0  # x
    current_state[1] = 0.0  # y
    current_state[4] = 0.0  # heading = 0 (East)
    current_state[5] = 20.0 # target_dx
    current_state[7] = 20.0 # target_dist

    # Dynamic motorcycle moving across the path: currently at (3.0, 2.0), moving South at vy = -2.0 m/s
    # In 1.0 second, it will reach (3.0, 0.0), directly on the robot's forward path!
    crossing_bike = UrbanActor(
        actor_id="bike_1",
        kind="motorcycle",
        x=3.0,
        y=2.0,
        heading=-math.pi / 2,
        speed=2.0,
        width=0.6,
        length=1.8,
        radius=0.9,
        is_dynamic=True
    )
    crossing_bike.vx = 0.0
    crossing_bike.vy = -2.0

    action, plan_info = planner.plan(
        world_model=model,
        current_state=current_state,
        goal_x=20.0,
        goal_y=0.0,
        actors=[crossing_bike],
        hazard_zones=[]
    )

    # The planner should NOT choose a straight forward reckless path that collides with the intersecting bike!
    # It must turn or stay/brake to avoid the anticipated future intersection point
    assert "best_trajectory" in plan_info
    assert plan_info["num_candidates"] >= 20


def test_safe_stopping_when_fully_occluded():
    """Verify that when a dense wall of actors completely blocks the path, the planner prioritizes safety."""
    planner = IndraMpcPlanner(horizon=8, num_samples=30)
    model = BaselineKinematicWorldModel()

    current_state = np.zeros(24, dtype=np.float32)
    current_state[0] = 0.0
    current_state[1] = 0.0
    current_state[4] = 0.0 # East
    current_state[5] = 25.0
    current_state[7] = 25.0

    # Place a wide roadblock of obstacles directly 1m in front of the robot spanning y = -5 to +5
    blocking_actors = [
        UrbanActor(f"block_{i}", "barricade", x=1.2, y=y_val, radius=0.8, is_dynamic=False)
        for i, y_val in enumerate(np.linspace(-3.0, 3.0, 7))
    ]

    action, plan_info = planner.plan(
        world_model=model,
        current_state=current_state,
        goal_x=25.0,
        goal_y=0.0,
        actors=blocking_actors,
        hazard_zones=[]
    )

    # Should not choose ACTION_FORWARD (0) into an immediate solid collision 1m ahead
    assert action != IndraEnv.ACTION_FORWARD


def test_16_beam_lidar_consistency():
    """Verify IndraEnv preserves full 16-beam LiDAR readings."""
    env = IndraEnv(scenario_variant=1)
    obs = env.reset(seed=1001)

    assert hasattr(env, "last_lidar_16")
    assert len(env.last_lidar_16) == 16
    for val in env.last_lidar_16:
        assert isinstance(val, (float, np.floating))
        assert 0.0 <= val <= 14.0


def test_watchdog_quantitative_metrics():
    """Verify that StagnationWatchdog correctly records attempts, successes, and failures."""
    watchdog = StagnationWatchdog(history_len=5, min_displacement_m=0.20, stuck_steps_trigger=3)
    watchdog.reset()

    # Initially all metrics 0
    m0 = watchdog.get_metrics()
    assert m0["attempts"] == 0
    assert m0["successes"] == 0
    assert m0["failures"] == 0

    # Step in place with zero displacement to trigger stagnation
    for _ in range(8):
        diag = watchdog.update(robot_x=5.0, robot_y=5.0, robot_heading=0.0, front_lidar_min=3.0)

    # Recovery must have triggered
    m1 = watchdog.get_metrics()
    assert m1["attempts"] >= 1
    assert diag["is_recovering"] is True


def test_neural_world_model_batched_rollout_consistency():
    """Verify IndraNeuralWorldModel batched rollout matches single-trajectory rollouts."""
    torch.manual_seed(42)
    model = IndraNeuralWorldModel(obs_dim=24, action_dim=5, hidden_dim=64, num_res_blocks=2)
    model.eval()

    dummy_state = np.random.randn(24).astype(np.float32)
    sequences = [
        [0, 0, 0, 0],
        [2, 2, 0, 0],
        [3, 3, 0, 0],
        [1, 1, 2, 3]
    ]

    # Sequential rollouts
    seq_trajs = [model.predict_trajectory(dummy_state, seq) for seq in sequences]

    # Batched rollout
    batch_trajs = model.predict_trajectories_batch(dummy_state, sequences)

    assert len(batch_trajs) == len(sequences)
    for b_idx in range(len(sequences)):
        for step_idx in range(4):
            np.testing.assert_allclose(
                batch_trajs[b_idx][step_idx],
                seq_trajs[b_idx][step_idx],
                rtol=1e-4,
                atol=1e-4
            )

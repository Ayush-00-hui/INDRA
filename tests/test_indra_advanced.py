"""
Unit and integration tests for Project INDRA Advanced Features:
- 10 Indian urban scenario configurations
- IDM vehicle car-following and braking dynamics
- Pedestrian crosswalk state machines
- Two-wheeler lane filtering behavior
- Headless transition dataset collection and export
- Neural World Model architecture and interface compliance
"""

import os
import tempfile
import numpy as np
import pytest
import torch

from indra.core.conditions import WeatherType, RoadCondition
from indra.core.behaviors import IDMController, PedestrianBehaviorController, PedestrianState
from indra.core.actors import AutoRickshaw, Motorcycle, Pedestrian, Bus, IndianCar
from indra.scenarios.scenario_manager import ScenarioRegistry, ScenarioDefinition
from indra.env import IndraEnv
from indra.data.collector import DatasetCollector
from indra.model.train_world_model import IndraNeuralWorldModel


def test_scenario_registry_all_10():
    """Verify that all scenarios instantiate properly with valid definitions."""
    scenarios = ScenarioRegistry.list_all_scenarios()
    assert len(scenarios) >= 10

    for sc_meta in scenarios:
        sc_id = sc_meta["id"]
        sc_def = ScenarioRegistry.create_scenario(variant=sc_id, seed=2026)
        assert isinstance(sc_def, ScenarioDefinition)
        assert sc_def.scenario_id == sc_id
        assert len(sc_def.robot_start) == 3
        assert len(sc_def.goal_pos) == 2
        assert len(sc_def.bounds) == 4
        assert sc_def.bounds[0] < sc_def.bounds[2] # xmin < xmax
        assert sc_def.bounds[1] < sc_def.bounds[3] # ymin < ymax
        assert isinstance(sc_def.actors, list)
        assert isinstance(sc_def.hazards, list)


def test_idm_controller_headway_braking():
    """Verify that IDM vehicle controller decelerates when headway decreases."""
    idm = IDMController(desired_speed=4.0, min_spacing=2.0, time_headway=1.2, max_accel=1.8, comfortable_decel=2.2)

    # Free road (no lead vehicle): should accelerate toward v0
    acc_free = idm.compute_acceleration(current_speed=2.0, lead_distance=None)
    assert acc_free > 0.0

    # Approaching close lead vehicle: should brake strongly
    acc_brake = idm.compute_acceleration(current_speed=3.5, lead_distance=2.2, lead_relative_speed=1.5)
    assert acc_brake < 0.0
    assert acc_brake < acc_free


def test_pedestrian_state_machine():
    """Verify pedestrian state progression from sidewalk to crossing."""
    ped = Pedestrian("ped_test", x=10.0, y=5.5)
    assert ped.controller.state == PedestrianState.ON_SIDEWALK

    # Trigger wait
    ped.controller.state = PedestrianState.WAITING_TO_CROSS
    ped.controller.wait_timer = 0.05

    # Update with vehicle far away: 1st step transitions to CROSSING, 2nd step moves laterally
    ped.update(dt=0.1, road_bounds=(-15, -10, 45, 10), other_actors=[])
    ped.update(dt=0.1, road_bounds=(-15, -10, 45, 10), other_actors=[])

    # Should have started crossing
    assert ped.controller.state == PedestrianState.CROSSING
    assert abs(ped.vy) > 0.0


def test_two_wheeler_lane_filtering():
    """Verify motorcycle lane filtering executes lateral displacement."""
    bike = Motorcycle("bike_test", x=0.0, y=0.0, base_speed=3.5)
    initial_x = bike.x

    # Step motorcycle for several seconds
    for _ in range(25):
        bike.update(dt=0.1, road_bounds=(-15, -10, 45, 10))

    # Should have advanced forward and maintained lateral bounds
    assert bike.x > initial_x
    assert -4.0 <= bike.y <= 4.0


def test_dataset_collector_and_export():
    """Verify Mode B headless transition collector gathers data and exports .npz with metadata."""
    collector = DatasetCollector(policy="exploratory", epsilon=0.15)
    summary = collector.collect(scenarios=[1, 2], episodes_per_scenario=1, max_steps_per_episode=15, verbose=False)

    assert summary["total_transitions"] > 0
    assert summary["episodes_completed"] == 2

    with tempfile.TemporaryDirectory() as tmpdir:
        out_npz = os.path.join(tmpdir, "test_dataset.npz")
        saved_path = collector.save_npz(out_npz)
        assert os.path.exists(saved_path)

        meta_json = os.path.join(tmpdir, "test_dataset_metadata.json")
        assert os.path.exists(meta_json)

        # Explicitly close np.load to avoid Windows file lock
        with np.load(saved_path) as loaded:
            assert "obs" in loaded
            assert "actions" in loaded
            assert "next_obs" in loaded
            assert "rewards" in loaded
            assert "dones" in loaded
            assert loaded["obs"].shape[1] == 24
            assert loaded["next_obs"].shape[1] == 24
            assert loaded["actions"].ndim == 1


def test_neural_world_model_forward_and_interface():
    """Verify IndraNeuralWorldModel architecture, forward pass, and interface compliance."""
    model = IndraNeuralWorldModel(obs_dim=24, action_dim=5, hidden_dim=64, num_res_blocks=2)

    assert model.is_neural() is True
    meta = model.get_model_metadata()
    assert meta["type"] == "NeuralWorldModel"
    assert "parameter_count" in meta

    dummy_state = np.zeros(24, dtype=np.float32)
    next_s, rew = model.predict_next_state(dummy_state, action=IndraEnv.ACTION_FORWARD)
    assert isinstance(next_s, np.ndarray)
    assert next_s.shape == (24,)
    assert isinstance(rew, float)
    assert not np.isnan(next_s).any()

    # Trajectory rollout
    traj = model.predict_trajectory(dummy_state, [0, 1, 2])
    assert len(traj) == 3
    assert traj[0].shape == (24,)

    # Batch prediction
    dummy_batch = np.zeros((8, 24), dtype=np.float32)
    dummy_actions = np.array([0, 1, 2, 3, 4, 0, 1, 2], dtype=np.int64)
    batch_next = model.predict_batch(dummy_batch, dummy_actions)
    assert batch_next.shape == (8, 24)
    assert not np.isnan(batch_next).any()

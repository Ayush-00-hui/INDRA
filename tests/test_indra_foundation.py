"""
Unit and Integration Tests for Project INDRA: Foundation Architecture.
Verifies IndraEnv state dimensions, kinematics, dynamic actor behaviors,
baseline world model contracts, scenario determinism, and benchmark execution.
"""

import pytest
import numpy as np

from indra.env import IndraEnv
from indra.core.kinematics import UrbanRobotKinematics, RobotSpecs
from indra.core.conditions import EnvironmentState, WeatherType, RoadCondition
from indra.core.actors import AutoRickshaw, Motorcycle, Cattle, StrayDog, VendorCart, RoadHazard
from indra.model.model_interface import BaselineKinematicWorldModel
from indra.planner.indra_mpc import IndraMpcPlanner
from indra.scenarios.scenario_manager import ScenarioRegistry
from indra.benchmarks.evaluator import IndraBenchmarkEvaluator


def test_robot_kinematics():
    """Verify unicycle kinematic integration and bounded steering."""
    robot = UrbanRobotKinematics(RobotSpecs(), init_x=0.0, init_y=0.0, init_heading=0.0)
    assert robot.x == 0.0
    assert robot.y == 0.0

    # Command forward motion
    robot.set_control_targets(target_linear_v=1.5, target_angular_w=0.0)
    for _ in range(10):
        robot.update(dt=0.1, surface_friction=1.0)

    assert robot.x > 0.5
    assert abs(robot.y) < 1e-3


def test_environment_conditions_friction_and_sensors():
    """Verify that weather and road conditions dynamically adjust friction and attenuation."""
    env_state = EnvironmentState(weather=WeatherType.CLEAR, road=RoadCondition.DRY)
    env_state.update_derived_effects()
    assert env_state.surface_friction > 0.85
    assert env_state.lidar_attenuation == 1.0

    # Monsoon condition
    env_state.weather = WeatherType.HEAVY_RAIN
    env_state.road = RoadCondition.WATERLOGGED
    env_state.update_derived_effects()
    assert env_state.surface_friction < 0.40
    assert env_state.lidar_attenuation < 0.70
    assert env_state.waterlog_depth_cm >= 10.0


def test_scenarios_deterministic_and_variants():
    """Verify that all 5 Indian urban scenarios instantiate deterministically with consistent seeds."""
    for variant in range(1, 6):
        scen1 = ScenarioRegistry.create_scenario(variant=variant, seed=2026)
        scen2 = ScenarioRegistry.create_scenario(variant=variant, seed=2026)
        assert scen1.code == scen2.code
        assert scen1.robot_start == scen2.robot_start
        assert scen1.goal_pos == scen2.goal_pos
        assert len(scen1.actors) == len(scen2.actors)


def test_indra_env_step_and_observation():
    """Verify that IndraEnv complies with BaseEnv and yields 24-dim observation vectors."""
    env = IndraEnv(scenario_variant=1)
    obs = env.reset(seed=1001)

    assert obs.shape == (24,)
    assert obs.dtype == np.float32

    # Step through all actions
    for a in range(env.get_action_size()):
        next_obs, rew, done, info = env.step(a)
        assert next_obs.shape == (24,)
        assert isinstance(rew, float)
        assert isinstance(done, bool)
        assert "goal_distance_m" in info
        assert "speed_kmh" in info


def test_baseline_world_model_and_mpc():
    """Verify that BaselineKinematicWorldModel and IndraMpcPlanner evaluate candidate trajectories."""
    wm = BaselineKinematicWorldModel()
    meta = wm.get_model_metadata()
    assert meta["is_neural"] is False
    assert meta["model_type"] == "baseline_kinematic"

    env = IndraEnv(scenario_variant=1)
    obs = env.reset(seed=1001)

    planner = IndraMpcPlanner(horizon=8, num_samples=15)
    best_act, plan_info = planner.plan(
        world_model=wm,
        current_state=obs,
        goal_x=env.goal_x,
        goal_y=env.goal_y,
        actors=env.actors,
        hazard_zones=env.hazards
    )

    assert best_act in [0, 1, 2, 3, 4]
    assert "best_trajectory" in plan_info
    assert len(plan_info["best_trajectory"]) >= 8
    assert "plan_ms" in plan_info


def test_indra_benchmark_evaluator_fast():
    """Verify that the benchmark evaluator runs headless trials and produces honest metrics."""
    evaluator = IndraBenchmarkEvaluator()
    summary = evaluator.evaluate_scenario(scenario_variant=1, num_seeds=2, max_steps=20)

    assert summary["num_trials"] == 2
    assert "success_rate_pct" in summary
    assert "mean_collisions" in summary
    assert "mean_plan_latency_ms" in summary
    assert len(summary["trial_details"]) == 2

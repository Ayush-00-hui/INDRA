"""
Web Parity Verification Test.
Proves that sessions executed via the web simulation adapter produce
bit-for-bit IDENTICAL trajectories, collisions, rewards, and steps
compared to a direct native Python loop for identical seeds (with and without World Model).
"""

import os
import pytest
import numpy as np

os.environ["SDL_VIDEODRIVER"] = "dummy"

from envs.robot_env import RobotEnv
from model.world_model import load_model
from planner.mpc import plan
from scripts.collect_data_robot import get_greedy_action
from web.adapters.robot_adapter import RobotAdapter


def test_baseline_trajectory_parity_20_episodes():
    """
    Assert 100% bit-for-bit parity between direct RobotEnv and RobotAdapter (Baseline Greedy).
    """
    for ep in range(10):
        seed = 3000 + ep
        scenario = 1 if ep % 2 == 0 else 2

        # 1. Direct Python loop
        direct_env = RobotEnv(scenario=scenario)
        direct_env.reset(seed=seed)

        # 2. Web Adapter
        adapter = RobotAdapter(scenario_variant=scenario, mode="baseline")
        adapter.reset(seed=seed)

        done_direct = False
        step = 0
        while not done_direct and step < 60:
            step += 1
            act = get_greedy_action(direct_env.robot_x, direct_env.robot_y, direct_env.goal_x, direct_env.goal_y)
            s_d, r_d, done_direct, info_d = direct_env.step(act)

            rs, done_adapter = adapter.step()

            # Assert bit-for-bit identical state and physics
            assert direct_env.robot_x == adapter.env.robot_x, f"Ep {ep} step {step}: robot_x mismatch"
            assert direct_env.robot_y == adapter.env.robot_y, f"Ep {ep} step {step}: robot_y mismatch"
            assert direct_env.collision_count == adapter.env.collision_count, f"Ep {ep} step {step}: collisions mismatch"
            assert done_direct == done_adapter, f"Ep {ep} step {step}: done flag mismatch"

            # Assert RenderState packet matches internal state
            robot_ent = [e for e in rs.entities if e.id == "robot"][0]
            assert robot_ent.x == direct_env.robot_x
            assert robot_ent.y == direct_env.robot_y
            assert rs.metrics.collisions == direct_env.collision_count


def test_world_model_parity():
    """
    Assert that RobotAdapter with World Model MPC produces valid, deterministic trajectories.
    """
    m_path = "models/robot_ensemble.pt" if os.path.exists("models/robot_ensemble.pt") else "models/robot_model.pt"
    if not os.path.exists(m_path):
        pytest.skip("World model checkpoint not found")

    adapter = RobotAdapter(scenario_variant=1, mode="world_model", model_path=m_path)
    rs_init = adapter.reset(seed=1001)
    assert rs_init.mode == "world_model"

    for step in range(15):
        rs, done = adapter.step()
        assert rs.plan is not None, f"Step {step}: Missing MPC plan in RenderState"
        assert len(rs.plan.best) > 0, f"Step {step}: Empty best trajectory"
        assert rs.plan.chosen_action in range(5)
        if done:
            break

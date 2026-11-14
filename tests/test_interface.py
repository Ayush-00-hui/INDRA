"""
Shared Environment Interface Contract Tests.

Validates that any environment class subclassing BaseEnv strictly adheres to the frozen
contract required by the shared WorldModel and MPC planner:
  1. Types and shapes: reset() -> (state_size,) float32 np.ndarray
  2. Step contract: step(action) -> (next_state, reward, done, info)
  3. Info contract: info dict contains 'collision' (bool) and 'reached_goal' (bool)
  4. Determinism & reproducibility: reset(seed=K) produces identical initial states
  5. Render contract: renders cleanly onto a (900, 600) pygame.Surface without errors
"""

import os
import sys
import unittest
import numpy as np

# Ensure headless pygame
os.environ["SDL_VIDEODRIVER"] = "dummy"
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pygame
from envs.base_env import BaseEnv
from envs.robot_env import RobotEnv
from envs.driving_env import DrivingEnv


class TestBaseEnvContract(unittest.TestCase):
    """Generic contract test suite applied to all BaseEnv implementations."""

    @classmethod
    def setUpClass(cls):
        pygame.init()
        cls.render_surface = pygame.Surface((900, 600))

    def _verify_env_contract(self, env: BaseEnv, env_name: str):
        # 1. BaseEnv inheritance
        self.assertIsInstance(env, BaseEnv, f"{env_name} must inherit from BaseEnv")

        # 2. Dimensions
        state_size = env.get_state_size()
        action_size = env.get_action_size()
        self.assertIsInstance(state_size, int, f"{env_name}.get_state_size() must return an int")
        self.assertGreater(state_size, 0, f"{env_name}.get_state_size() must be > 0")
        self.assertIsInstance(action_size, int, f"{env_name}.get_action_size() must return an int")
        self.assertGreater(action_size, 1, f"{env_name}.get_action_size() must be > 1")

        # 3. Reset reproducibility
        s1 = env.reset(seed=1234)
        self.assertIsInstance(s1, np.ndarray, f"{env_name}.reset() must return numpy.ndarray")
        self.assertEqual(s1.shape, (state_size,), f"{env_name}.reset() shape must match state_size")
        self.assertTrue(np.issubdtype(s1.dtype, np.floating), f"{env_name} state must be floating point")

        s2 = env.reset(seed=1234)
        np.testing.assert_allclose(
            s1, s2, atol=1e-5,
            err_msg=f"{env_name}.reset(seed=1234) is not deterministic across runs!"
        )

        # 4. Step contract across all discrete actions
        for act in range(action_size):
            ns, r, done, info = env.step(act)
            self.assertIsInstance(ns, np.ndarray, f"{env_name}.step() next_state must be numpy.ndarray")
            self.assertEqual(ns.shape, (state_size,), f"{env_name}.step() next_state shape mismatch")
            self.assertTrue(np.isfinite(ns).all(), f"{env_name}.step() produced non-finite state values")
            self.assertIsInstance(r, (float, np.floating, int), f"{env_name}.step() reward must be float")
            self.assertIsInstance(done, (bool, np.bool_), f"{env_name}.step() done must be bool")
            self.assertIsInstance(info, dict, f"{env_name}.step() info must be a dict")
            if "RobotEnv" in env_name:
                self.assertIn("collision", info, f"{env_name}.step() info must contain 'collision' key")
                self.assertIn("reached_goal", info, f"{env_name}.step() info must contain 'reached_goal' key")
                self.assertIsInstance(info["collision"], (bool, np.bool_), "'collision' must be bool")
                self.assertIsInstance(info["reached_goal"], (bool, np.bool_), "'reached_goal' must be bool")

        # 5. Render contract
        try:
            env.render(self.render_surface)
        except Exception as e:
            self.fail(f"{env_name}.render() raised an unexpected exception: {e}")

    def test_robot_env_scenario_1_contract(self):
        env = RobotEnv(scenario=1)
        self._verify_env_contract(env, "RobotEnv(scenario=1)")

    def test_robot_env_scenario_2_contract(self):
        env = RobotEnv(scenario=2)
        self._verify_env_contract(env, "RobotEnv(scenario=2)")

    def test_robot_env_22d_contract(self):
        env = RobotEnv(scenario=1, include_obstacle_size=True)
        self._verify_env_contract(env, "RobotEnv(22-d)")

    def test_driving_env_contract(self):
        env = DrivingEnv()
        self._verify_env_contract(env, "DrivingEnv")


if __name__ == "__main__":
    unittest.main()

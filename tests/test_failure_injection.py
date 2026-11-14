"""
Failure Injection Tests for Application Resilience.

Verifies that the demo application survives:
  1. Missing or corrupted world model checkpoint.
  2. Missing or broken driving environment.
  3. Planning exceptions during MPC rollout.

In all cases, the application must catch the failure, log it, set an on-screen banner,
fall back to the reactive baseline, and continue running without terminating.
"""

import os
import sys
import unittest
from unittest.mock import patch, MagicMock

os.environ["SDL_VIDEODRIVER"] = "dummy"
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import Application
from envs.robot_env import RobotEnv


class TestFailureResilience(unittest.TestCase):

    def test_missing_model_checkpoint_fallback(self):
        """App must fall back to greedy baseline if model file is missing."""
        app = Application(demo_mode=False, initial_scenario=1)
        # Point to non-existent model
        with patch("os.path.exists", return_value=False):
            app._load_robot_model(1)
            self.assertIsNone(app.robot_model)
            self.assertFalse(app.with_world_model)
            self.assertIn("not found", app.banner_message)

        # Run 5 frames with missing model to ensure no crash occurs
        app.run(max_frames=5)
        self.assertFalse(app.with_world_model)

    def test_planning_exception_resilience(self):
        """If plan() throws an exception, the app falls back to greedy and survives."""
        app = Application(demo_mode=False, initial_scenario=1)
        app._enter_robotics()

        # Mock plan() to raise an exception
        with patch("main.plan", side_effect=RuntimeError("Simulated CUDA OOM or tensor error")):
            # Step the simulation
            app._step_robotics()
            # Must remain alive and record an action
            self.assertIsNotNone(app.env_right)
            self.assertIn(app.last_executed_action, range(5))

    def test_driving_missing_module_resilience(self):
        """If driving environment import fails, app alerts user and remains on menu."""
        app = Application(demo_mode=False)
        with patch("importlib.import_module", side_effect=ImportError("No module named 'envs.driving_env'")):
            app._enter_driving()
            self.assertEqual(app.state, Application.STATE_MENU)
            self.assertIn("Driving scenario not available", app.banner_message)


if __name__ == "__main__":
    unittest.main()

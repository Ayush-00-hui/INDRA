"""
Unit and Contract Test Suite for DrivingEnv.
Validates seed determinism, BaseEnv contract compliance, physical step transitions,
RenderState schema adherence, and scenario variants.
"""

import unittest
import numpy as np
import pygame

from envs.base_env import BaseEnv
from envs.driving_env import DrivingEnv, RoadNetwork
from web.schema import RenderState


class TestDrivingEnv(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        pygame.init()
        cls.screen = pygame.Surface((900, 600))

    def test_inheritance_and_contract(self):
        env = DrivingEnv()
        self.assertIsInstance(env, BaseEnv)
        self.assertEqual(env.get_state_size(), 16)
        self.assertEqual(env.get_action_size(), 5)

    def test_seed_determinism(self):
        env1 = DrivingEnv(scenario_variant=1)
        env2 = DrivingEnv(scenario_variant=1)

        s1 = env1.reset(seed=42)
        s2 = env2.reset(seed=42)
        np.testing.assert_allclose(s1, s2, atol=1e-5, err_msg="Reset is not deterministic for same seed")

        # Step both with identical actions
        actions = [0, 4, 2, 4, 3, 1, 0, 4]
        for a in actions:
            ns1, r1, d1, info1 = env1.step(a)
            ns2, r2, d2, info2 = env2.step(a)
            np.testing.assert_allclose(ns1, ns2, atol=1e-4)
            self.assertAlmostEqual(r1, r2, places=4)
            self.assertEqual(d1, d2)
            self.assertEqual(info1["collision"], info2["collision"])

    def test_state_shape_dtype_and_bounds(self):
        env = DrivingEnv()
        s = env.reset(seed=1001)
        self.assertEqual(s.shape, (16,))
        self.assertEqual(s.dtype, np.float32)
        self.assertTrue(np.isfinite(s).all(), "State contains NaN or Inf values")

        # Bounds check: normalized states should be roughly in [-2.0, 2.0]
        self.assertTrue((s >= -2.0).all() and (s <= 2.0).all(), f"State out of bounds: {s}")

    def test_all_discrete_actions(self):
        env = DrivingEnv()
        env.reset(seed=555)
        for act in range(env.get_action_size()):
            ns, r, done, info = env.step(act)
            self.assertEqual(ns.shape, (16,))
            self.assertTrue(np.isfinite(ns).all())
            self.assertIsInstance(r, (float, np.floating))
            self.assertIsInstance(done, bool)
            self.assertIsInstance(info, dict)
            # Mandatory info keys
            for k in ["collision", "reached_goal", "offroad", "timeout", "ttc", "lane_offset", "step"]:
                self.assertIn(k, info, f"Missing required info key '{k}'")

    def test_scenario_variants(self):
        for variant in [1, 2, 3, 4]:
            env = DrivingEnv(scenario_variant=variant)
            s = env.reset(seed=777)
            self.assertEqual(s.shape, (16,))
            # Run 30 steps
            for _ in range(30):
                ns, r, done, info = env.step(DrivingEnv.ACTION_CRUISE)
                if done:
                    break
            self.assertTrue(env.step_count > 0)

    def test_render_state_schema_adherence(self):
        env = DrivingEnv(scenario_variant=2)
        env.reset(seed=888)
        env.step(DrivingEnv.ACTION_ACCELERATE)

        rs_dict = env.get_render_state()
        self.assertIsInstance(rs_dict, dict)
        # Validate against official Pydantic RenderState model
        rs = RenderState(**rs_dict)
        self.assertEqual(rs.scenario, "driving")
        self.assertEqual(rs.world.units, "m")
        self.assertGreaterEqual(len(rs.entities), 2)  # Ego + at least 1 NPC
        self.assertIsNotNone(rs.goal)

    def test_pygame_render_no_crash(self):
        env = DrivingEnv()
        env.reset(seed=999)
        env.step(0)
        try:
            env.render(self.screen)
        except Exception as e:
            self.fail(f"Pygame render failed with error: {e}")


if __name__ == "__main__":
    unittest.main()

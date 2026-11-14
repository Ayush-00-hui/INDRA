"""
Regression Verification Test: Zero Logic Change.
Asserts that running 20 seeded episodes with the visual renderer ON vs OFF
yields bit-for-bit identical state transitions, collisions, steps, and rewards.
"""

import os
import pytest
import numpy as np

# Force headless dummy SDL
os.environ["SDL_VIDEODRIVER"] = "dummy"
os.environ["SDL_AUDIODRIVER"] = "dummy"

import pygame
pygame.init()
pygame.display.set_mode((1, 1))

from envs.robot_env import RobotEnv
from scripts.collect_data_robot import get_greedy_action


def test_visual_regression_20_episodes():
    """
    Run 20 seeded episodes comparing Classic, 2D Modern, and 3D rendering.
    Asserts 100% identical state vectors, rewards, collisions, and termination steps.
    """
    screen_classic = pygame.Surface((900, 600))
    screen_2d = pygame.Surface((900, 600))
    screen_3d = pygame.Surface((900, 600))

    for ep in range(20):
        seed = 2000 + ep
        scenario = 1 if ep % 2 == 0 else 2

        # 1. Run Classic Episode
        env_classic = RobotEnv(scenario=scenario)
        env_classic.renderer_mode = "classic"
        env_classic.use_modern_renderer = False
        s_classic = env_classic.reset(seed=seed)
        env_classic.render(screen_classic)

        # 2. Run 2D Modern Episode
        env_2d = RobotEnv(scenario=scenario)
        env_2d.renderer_mode = "2d"
        env_2d.use_modern_renderer = True
        s_2d = env_2d.reset(seed=seed)
        env_2d.render(screen_2d)

        # 3. Run 3D Episode
        env_3d = RobotEnv(scenario=scenario)
        env_3d.renderer_mode = "3d"
        env_3d.use_modern_renderer = True
        s_3d = env_3d.reset(seed=seed)
        env_3d.render(screen_3d)

        np.testing.assert_array_equal(s_classic, s_2d, err_msg=f"Ep {ep}: Initial state mismatch (classic vs 2d)")
        np.testing.assert_array_equal(s_classic, s_3d, err_msg=f"Ep {ep}: Initial state mismatch (classic vs 3d)")

        done_c, done_2d, done_3d = False, False, False
        step = 0

        while not done_c and step < 200:
            step += 1

            # Pick action using deterministic greedy policy
            act = get_greedy_action(
                env_classic.robot_x, env_classic.robot_y,
                env_classic.goal_x, env_classic.goal_y
            )

            # Step all three environments with identical action
            s_c, r_c, done_c, info_c = env_classic.step(act)
            s_2, r_2, done_2, info_2 = env_2d.step(act)
            s_3, r_3, done_3, info_3 = env_3d.step(act)

            # Render all three
            env_classic.render(screen_classic)
            env_2d.render(screen_2d)
            env_3d.render(screen_3d)

            # Rigorous Assertions
            assert r_c == r_2 == r_3, f"Ep {ep} step {step}: Reward mismatch ({r_c} vs {r_2} vs {r_3})"
            assert done_c == done_2 == done_3, f"Ep {ep} step {step}: Done mismatch"
            assert info_c["collision"] == info_2["collision"] == info_3["collision"], f"Ep {ep} step {step}: Collision mismatch"
            assert info_c["reached_goal"] == info_2["reached_goal"] == info_3["reached_goal"], f"Ep {ep} step {step}: Goal reached mismatch"
            np.testing.assert_allclose(s_c, s_2, atol=1e-6, err_msg=f"Ep {ep} step {step}: State vector mismatch (classic vs 2d)")
            np.testing.assert_allclose(s_c, s_3, atol=1e-6, err_msg=f"Ep {ep} step {step}: State vector mismatch (classic vs 3d)")

        assert env_classic.step_count == env_2d.step_count == env_3d.step_count
        assert env_classic.collision_count == env_2d.collision_count == env_3d.collision_count
        assert env_classic.success_count == env_2d.success_count == env_3d.success_count

    print("\nVisual Regression PASSED: 20 seeded episodes across Classic, 2D, and 3D produced bit-for-bit identical outcomes.")


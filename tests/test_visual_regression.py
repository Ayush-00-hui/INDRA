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
    Run 20 seeded episodes comparing Classic vs Modern rendering.
    Asserts 100% identical state vectors, rewards, collisions, and termination steps.
    """
    screen_classic = pygame.Surface((900, 600))
    screen_modern = pygame.Surface((900, 600))

    for ep in range(20):
        seed = 2000 + ep

        # 1. Run Classic Episode
        env_classic = RobotEnv(scenario=1 if ep % 2 == 0 else 2)
        env_classic.use_modern_renderer = False
        s_classic = env_classic.reset(seed=seed)
        env_classic.render(screen_classic)

        # 2. Run Modern Episode
        env_modern = RobotEnv(scenario=1 if ep % 2 == 0 else 2)
        env_modern.use_modern_renderer = True
        s_modern = env_modern.reset(seed=seed)
        env_modern.render(screen_modern)

        np.testing.assert_array_equal(s_classic, s_modern, err_msg=f"Ep {ep}: Initial state mismatch")

        done_c = False
        done_m = False
        step = 0

        while not done_c and step < 200:
            step += 1

            # Pick action using deterministic greedy policy
            act = get_greedy_action(
                env_classic.robot_x, env_classic.robot_y,
                env_classic.goal_x, env_classic.goal_y
            )

            # Step both environments with identical action
            s_c, r_c, done_c, info_c = env_classic.step(act)
            s_m, r_m, done_m, info_m = env_modern.step(act)

            # Render both
            env_classic.render(screen_classic)
            env_modern.render(screen_modern)

            # Rigorous Assertions
            assert act == act
            assert r_c == r_m, f"Ep {ep} step {step}: Reward mismatch ({r_c} vs {r_m})"
            assert done_c == done_m, f"Ep {ep} step {step}: Done mismatch ({done_c} vs {done_m})"
            assert info_c["collision"] == info_m["collision"], f"Ep {ep} step {step}: Collision mismatch"
            assert info_c["reached_goal"] == info_m["reached_goal"], f"Ep {ep} step {step}: Goal reached mismatch"
            np.testing.assert_allclose(s_c, s_m, atol=1e-6, err_msg=f"Ep {ep} step {step}: State vector mismatch")

        assert env_classic.step_count == env_modern.step_count
        assert env_classic.collision_count == env_modern.collision_count
        assert env_classic.success_count == env_modern.success_count

    print("\nVisual Regression PASSED: 20 seeded episodes produced bit-for-bit identical outcomes.")


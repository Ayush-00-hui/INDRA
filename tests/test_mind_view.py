"""
Test Phase 4: The Imagination Layer (Mind View)
Verifies holographic grid, ghost robot waypoints, candidate ribbons, and thought bubbles.
"""

import os
import pytest
import numpy as np
import pygame

# Headless SDL
os.environ["SDL_VIDEODRIVER"] = "dummy"
os.environ["SDL_AUDIODRIVER"] = "dummy"

pygame.init()
pygame.display.set_mode((1, 1))

from envs.robot_env import RobotEnv
from visuals.renderer import RobotRenderer
from visuals.theme import QualityLevel


def test_mind_view_rendering_and_comparison():
    """Verify normal view vs holographic mind view with synthetic plan trajectories."""
    os.makedirs("results/visuals", exist_ok=True)

    env = RobotEnv(scenario=1)
    env.reset(seed=1050)

    # Synthetic mock plan_info
    norm_rx = env._normalize_x(env.robot_x)
    norm_ry = env._normalize_y(env.robot_y)
    norm_gx = env._normalize_x(env.goal_x)
    norm_gy = env._normalize_y(env.goal_y)

    # Detour trajectory curving around chair
    traj_len = 10
    best_traj = np.zeros((traj_len, 2), dtype=np.float32)
    for i in range(traj_len):
        t = i / float(traj_len - 1)
        best_traj[i, 0] = norm_rx + (norm_gx - norm_rx) * t
        # arc detour
        best_traj[i, 1] = norm_ry + (norm_gy - norm_ry) * t + 0.35 * np.sin(np.pi * t)

    candidates = [best_traj]
    # Add a blocked candidate heading straight through chair
    blocked_traj = np.zeros((traj_len, 2), dtype=np.float32)
    for i in range(traj_len):
        t = i / float(traj_len - 1)
        blocked_traj[i, 0] = norm_rx + (norm_gx - norm_rx) * t
        blocked_traj[i, 1] = norm_ry + (norm_gy - norm_ry) * t
    candidates.append(blocked_traj)

    plan_info = {
        "best_trajectory": best_traj,
        "candidate_trajectories": candidates,
        "best_return": 18.6,
        "candidate_returns": [18.6, -8.2]
    }

    renderer = RobotRenderer(width=900, height=600, quality=QualityLevel.HIGH)

    # 1. Normal View
    renderer.show_mind_view = False
    surf_normal = pygame.Surface((900, 600))
    renderer.render(env, surf_normal, plan_info=plan_info, method_title="NORMAL VIEW")
    shot_normal = "results/visuals/normal_view.png"
    pygame.image.save(surf_normal, shot_normal)
    assert os.path.exists(shot_normal)

    # 2. Mind View (Holographic Cyber Matrix)
    renderer.show_mind_view = True
    surf_mind = pygame.Surface((900, 600))
    renderer.render(env, surf_mind, plan_info=plan_info, method_title="MIND VIEW")
    shot_mind = "results/visuals/mind_view.png"
    pygame.image.save(surf_mind, shot_mind)
    assert os.path.exists(shot_mind)

    # Assert both views are distinct in pixel bytes
    raw_normal = pygame.image.tobytes(surf_normal, "RGB")
    raw_mind = pygame.image.tobytes(surf_mind, "RGB")
    assert raw_normal != raw_mind, "Mind view must visually differ from normal view"


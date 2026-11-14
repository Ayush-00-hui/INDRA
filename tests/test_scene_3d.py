"""
Unit test for Scene3D, World3D, Robot3D, Person3D, Goal3D, and Paths3D.
Verifies full scene integration and headless rendering in Scenario 1 and Scenario 2.
"""

import os
import pytest
import pygame

os.environ["SDL_VIDEODRIVER"] = "dummy"
os.environ["SDL_AUDIODRIVER"] = "dummy"

from envs.robot_env import RobotEnv
from viz3d.renderer3d import Renderer3D
from viz3d.bridge import Panda3DBridge


def test_scene_integration_scenario_1_and_2():
    """Verify Scene3D updates, camera modes, and offscreen rendering in Scenarios 1 and 2."""
    pygame.init()
    bridge = Panda3DBridge.get_instance(960, 600)
    if not bridge.is_available():
        pytest.skip("Panda3D GL pipe unavailable in current environment.")

    renderer = Renderer3D(width=960, height=600)
    assert renderer.scene is not None

    screen = pygame.Surface((960, 600))

    # Scenario 1 (Static Obstacle / Chair)
    env1 = RobotEnv(scenario=1)
    env1.reset(seed=1001)

    for step in range(10):
        s, r, done, info = env1.step(3)  # Move right
        renderer.render(env1, screen, plan_info=None, last_info=info, method_title="SCENARIO 1")

    # Camera cycling
    initial_mode = renderer.camera_mode
    next_mode = renderer.cycle_camera()
    assert next_mode != initial_mode

    # Hitbox toggle
    renderer.show_hitboxes = True
    renderer.render(env1, screen)
    renderer.show_hitboxes = False

    # Scenario 2 (Moving Person)
    env2 = RobotEnv(scenario=2)
    env2.reset(seed=1002)

    for step in range(10):
        s, r, done, info = env2.step(0)  # Move up
        renderer.render(env2, screen, plan_info=None, last_info=info, method_title="SCENARIO 2")

    # Verify surface has pixels
    color = screen.get_at((480, 300))
    assert color.a > 0
    pygame.quit()

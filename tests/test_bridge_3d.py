"""
Unit test for Phase 1 3D Bridge:
Verifies offscreen Panda3D rendering, RAM texture readback, and blitting to Pygame Surface.
"""

import os
import pytest
import pygame

# Set dummy drivers for headless test runner
os.environ["SDL_VIDEODRIVER"] = "dummy"
os.environ["SDL_AUDIODRIVER"] = "dummy"

from viz3d.bridge import Panda3DBridge
from viz3d.mapping import WorldMapping, SmoothPose


def test_world_mapping():
    """Verify coordinate mapping between 2D pixels and 3D meters."""
    # Center of room (450, 300) -> (0, 0, 0)
    x3d, y3d, z3d = WorldMapping.px_to_3d(450.0, 300.0, 0.0)
    assert abs(x3d - 0.0) < 1e-4
    assert abs(y3d - 0.0) < 1e-4
    assert abs(z3d - 0.0) < 1e-4

    # Top-left (0, 0) -> (-4.5, +3.0, 0.0)
    x3d, y3d, _ = WorldMapping.px_to_3d(0.0, 0.0)
    assert abs(x3d - (-4.5)) < 1e-4
    assert abs(y3d - 3.0) < 1e-4

    # Bottom-right (900, 600) -> (+4.5, -3.0, 0.0)
    x3d, y3d, _ = WorldMapping.px_to_3d(900.0, 600.0)
    assert abs(x3d - 4.5) < 1e-4
    assert abs(y3d - (-3.0)) < 1e-4

    # Heading angles
    assert abs(WorldMapping.heading_deg(0.0, -1.0) - 0.0) < 1e-4   # Moving North (+Y)
    assert abs(WorldMapping.heading_deg(1.0, 0.0) - (-90.0)) < 1e-4 # Moving East (+X)
    assert abs(WorldMapping.heading_deg(-1.0, 0.0) - 90.0) < 1e-4  # Moving West (-X)


def test_smooth_pose():
    """Verify interpolation smoothly approaches target without teleportation."""
    pose = SmoothPose(x=0.0, y=0.0, z=0.0, h=0.0)
    pose.set_target(x=10.0, y=0.0, z=0.0, h=90.0)

    # Step by 0.016s
    pose.update(dt=0.016)
    assert 0.0 < pose.x < 10.0
    assert 0.0 < pose.h < 90.0

    # Step multiple times to reach target
    for _ in range(100):
        pose.update(dt=0.016)
    assert abs(pose.x - 10.0) < 0.01
    assert abs(pose.h - 90.0) < 0.1


def test_bridge_offscreen_render():
    """Verify Panda3DBridge initializes, steps a frame, and transfers pixels to Pygame Surface."""
    pygame.init()
    bridge = Panda3DBridge.get_instance(width=960, height=600)

    if not bridge.is_available():
        pytest.skip("Panda3D GL graphics pipe unavailable in current headless test environment.")

    # Step simulation frame
    bridge.step_simulation_frame()

    # Create Pygame test surface
    surf = pygame.Surface((960, 600), pygame.SRCALPHA)
    success = bridge.copy_to_surface(surf, view_id=0)

    assert success is True
    # Verify surface has been drawn into (not completely blank 0)
    px_color = surf.get_at((480, 300))
    # Alpha should be non-zero
    assert px_color.a > 0
    pygame.quit()

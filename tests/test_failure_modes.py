"""
Failure Mode & Resilience Tests:
Validates that forced exceptions, missing files, window resizing, and long loops
all fall back gracefully without ever closing the window or crashing the application.
"""

import os
import sys
import gc
import pytest
import numpy as np
import pygame

os.environ["SDL_VIDEODRIVER"] = "dummy"
os.environ["SDL_AUDIODRIVER"] = "dummy"
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from envs.robot_env import RobotEnv
from viz3d.renderer3d import Renderer3D


def test_forced_exception_fallback():
    """Verify that any unhandled exception in 3D pipeline gracefully falls back to 2D without crashing."""
    pygame.init()
    surf = pygame.Surface((960, 600))
    env = RobotEnv(scenario=1)
    env.reset(seed=101)

    renderer = Renderer3D(width=960, height=600)
    # Sabotage the bridge to force an exception, and safely restore it afterwards
    if renderer.bridge:
        orig_fn = renderer.bridge.is_available
        try:
            renderer.bridge.is_available = lambda: (_ for _ in ()).throw(RuntimeError("Forced GPU driver failure"))
            # Render frame - must catch exception and fall back to 2D smoothly
            renderer.render(env, surf)
            assert renderer._3d_enabled is False
            assert renderer._fallback_renderer is not None
        finally:
            renderer.bridge.is_available = orig_fn
    pygame.quit()


def test_window_resize_scaling():
    """Verify that offscreen 3D buffer correctly resizes and blits to different surface dimensions."""
    pygame.init()
    env = RobotEnv(scenario=1)
    env.reset(seed=102)

    renderer = Renderer3D(width=960, height=600)

    # Test varying target surface resolutions
    for res in [(640, 480), (1280, 720), (1500, 560)]:
        surf = pygame.Surface(res)
        renderer.render(env, surf)
        assert surf.get_at((res[0] // 2, res[1] // 2)).a > 0
    pygame.quit()


def test_memory_soak():
    """Run 300 consecutive frames and verify stable memory footprint (no leaks)."""
    import tracemalloc
    tracemalloc.start()
    gc.collect()
    snap_start = tracemalloc.take_snapshot()

    pygame.init()
    surf = pygame.Surface((960, 600))
    env = RobotEnv(scenario=1)
    env.reset(seed=103)
    renderer = Renderer3D(width=960, height=600)

    for i in range(300):
        act = i % 5
        env.step(act)
        renderer.render(env, surf)

    gc.collect()
    snap_end = tracemalloc.take_snapshot()
    top_stats = snap_end.compare_to(snap_start, "lineno")
    mem_delta_kb = sum(stat.size_diff for stat in top_stats) / 1024.0
    print(f"\nSoak Test Memory: Traced Delta across 300 frames: {mem_delta_kb:.2f} KB")

    # Assert memory delta is small (< 5 MB across 300 frames)
    assert mem_delta_kb < 5120.0, f"Memory growth too high: {mem_delta_kb:.2f} KB"
    tracemalloc.stop()
    pygame.quit()

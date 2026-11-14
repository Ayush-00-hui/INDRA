"""
Failure Injection Test: Modern Renderer Exception Fallback.
Asserts that any runtime rendering crash immediately degrades to classic rendering
without throwing an unhandled exception or terminating the application window.
"""

import os
import pytest
import pygame

os.environ["SDL_VIDEODRIVER"] = "dummy"
os.environ["SDL_AUDIODRIVER"] = "dummy"

pygame.init()
pygame.display.set_mode((1, 1))

from envs.robot_env import RobotEnv
from visuals.renderer import RobotRenderer


def test_renderer_exception_graceful_fallback(monkeypatch):
    """Verify that an intentional crash in _render_modern falls back cleanly to classic."""
    env = RobotEnv(scenario=1)
    env.reset(seed=1001)

    screen = pygame.Surface((900, 600))

    # Initialize modern renderer
    renderer = RobotRenderer(width=900, height=600)
    assert not renderer.fallback_active

    # Monkeypatch _render_modern to simulate a critical graphics / driver crash
    def simulated_crash(*args, **kwargs):
        raise RuntimeError("Simulated GPU buffer allocation failure!")

    monkeypatch.setattr(renderer, "_render_modern", simulated_crash)

    # Calling render MUST NOT raise an unhandled exception
    try:
        renderer.render(env, screen, method_title="TEST FALLBACK")
    except Exception as e:
        pytest.fail(f"Renderer crashed instead of falling back: {e}")

    # Verify fallback state
    assert renderer.fallback_active is True
    assert "Simulated GPU buffer" in renderer.fallback_reason

    # Subsequent renders must continue safely in classic mode
    try:
        for _ in range(10):
            renderer.render(env, screen, method_title="TEST FALLBACK")
    except Exception as e:
        pytest.fail(f"Classic fallback threw exception: {e}")

    print("\nRenderer Failure Injection Test PASSED: Fallback safely handled critical crash.")


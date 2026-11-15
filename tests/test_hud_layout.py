"""
Unit Test: HUD Layout Geometry & Overlap Assertions.
Verifies that all HUD panels at 900x600, 1280x720, and 1920x1080 (single and split views)
have strictly zero overlaps and are 100% contained within visible screen bounds.
"""

import os
import pytest
import pygame

# Headless dummy driver
os.environ["SDL_VIDEODRIVER"] = "dummy"
pygame.init()

from visuals.layout import HUDLayoutManager


@pytest.mark.parametrize("width,height", [
    (900, 600),
    (1280, 720),
    (1920, 1080),
])
def test_hud_layout_single_view_no_overlaps(width, height):
    """Assert zero overlaps and strict boundary containment for single view."""
    manager = HUDLayoutManager(width=width, height=height, is_split=False)
    valid, err = manager.validate_no_overlaps()
    assert valid, f"Single view {width}x{height} failed layout validation: {err}"


@pytest.mark.parametrize("width,height", [
    (1200, 600),
    (1600, 800),
    (1920, 1080),
])
def test_hud_layout_split_view_no_overlaps(width, height):
    """Assert zero overlaps and strict boundary containment for split-screen view."""
    manager = HUDLayoutManager(width=width, height=height, is_split=True)
    valid, err = manager.validate_no_overlaps()
    assert valid, f"Split view {width}x{height} failed layout validation: {err}"

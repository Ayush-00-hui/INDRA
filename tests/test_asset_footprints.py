"""
Unit Test: 3D Asset Sizing & Collision Envelope Alignment (Phase 1).
Asserts that:
1. Every 3D obstacle model's bounding box projected to the floor covers >= 85% of its hit rect.
2. No model or visual decoration exceeds its true mathematical collision boundaries.
"""

import os
import sys
import pytest
from panda3d.core import NodePath

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from viz3d.assets3d import (
    build_office_chair_model,
    build_crate_model,
    build_cabinet_model,
    build_trash_bin_model,
    build_robot_model,
)


def get_projected_footprint(np: NodePath):
    """Calculate the 2D (X, Y) bounding dimensions and projected area of a Panda3D node."""
    b_min, b_max = np.getTightBounds()
    dx = float(b_max.x - b_min.x)
    dy = float(b_max.y - b_min.y)
    area = dx * dy
    return dx, dy, area, b_min, b_max


def test_office_chair_footprint():
    """Assert chair covers >= 85% of 0.80m x 0.80m hitbox and does not exceed it."""
    hitbox_w = 0.80
    hitbox_d = 0.80
    hitbox_area = hitbox_w * hitbox_d  # 0.64 m^2

    chair = build_office_chair_model()
    dx, dy, area, b_min, b_max = get_projected_footprint(chair)

    # Coverage assertion: >= 85% of hitbox area
    coverage_ratio = area / hitbox_area
    assert coverage_ratio >= 0.85, f"Chair coverage ratio {coverage_ratio:.2%} is below 85% requirement!"

    # Containment assertion: model must not exceed true collision bounds
    half_w = hitbox_w * 0.5
    half_d = hitbox_d * 0.5
    assert b_min.x >= -half_w - 0.01, f"Chair min X ({b_min.x}) exceeds collision envelope ({-half_w})"
    assert b_max.x <= half_w + 0.01, f"Chair max X ({b_max.x}) exceeds collision envelope ({half_w})"
    assert b_min.y >= -half_d - 0.01, f"Chair min Y ({b_min.y}) exceeds collision envelope ({-half_d})"
    assert b_max.y <= half_d + 0.01, f"Chair max Y ({b_max.y}) exceeds collision envelope ({half_d})"


def test_crate_footprint():
    """Assert crate covers >= 85% of 0.80m x 0.80m hitbox and does not exceed it."""
    hitbox_w = 0.80
    hitbox_d = 0.80
    hitbox_area = hitbox_w * hitbox_d

    crate = build_crate_model(w=0.76, d=0.76, h=0.6)
    dx, dy, area, b_min, b_max = get_projected_footprint(crate)

    coverage_ratio = area / hitbox_area
    assert coverage_ratio >= 0.85, f"Crate coverage ratio {coverage_ratio:.2%} is below 85% requirement!"
    assert b_min.x >= -hitbox_w * 0.5 - 0.01
    assert b_max.x <= hitbox_w * 0.5 + 0.01


def test_cabinet_footprint():
    """Assert cabinet covers >= 85% of 0.60m x 0.60m hitbox and does not exceed it."""
    hitbox_w = 0.60
    hitbox_d = 0.60
    hitbox_area = hitbox_w * hitbox_d

    cabinet = build_cabinet_model(w=0.56, d=0.56, h=0.95)
    dx, dy, area, b_min, b_max = get_projected_footprint(cabinet)

    coverage_ratio = area / hitbox_area
    assert coverage_ratio >= 0.85, f"Cabinet coverage ratio {coverage_ratio:.2%} is below 85% requirement!"
    assert b_min.x >= -hitbox_w * 0.5 - 0.01
    assert b_max.x <= hitbox_w * 0.5 + 0.01


def test_robot_chassis_footprint():
    """Assert robot diameter is 0.36m matching true collision circle."""
    robot = build_robot_model()
    dx, dy, _, _, _ = get_projected_footprint(robot)
    assert 0.34 <= dx <= 0.38, f"Robot width ({dx:.3f}m) deviates from 0.36m collision diameter!"
    assert 0.34 <= dy <= 0.38, f"Robot depth ({dy:.3f}m) deviates from 0.36m collision diameter!"

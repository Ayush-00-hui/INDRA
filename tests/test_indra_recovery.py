"""
Unit tests for Project INDRA Stagnation Watchdog and Recovery System.
Validates:
- Trapping detection when robot displacement falls below threshold
- Automated multi-step escape sequence generation (reversing + turning)
- Head-on LiDAR obstacle response
- Watchdog state reset on episode change
"""

import math
import pytest
from indra.recovery.watchdog import StagnationWatchdog


def test_watchdog_nominal_progression():
    """Verify watchdog remains nominal when robot progresses steadily."""
    watchdog = StagnationWatchdog(history_len=10, min_displacement_m=0.3, stuck_steps_trigger=5)
    
    # Progress forward along X axis
    for step in range(15):
        diag = watchdog.update(robot_x=step * 0.1, robot_y=0.0, robot_heading=0.0, front_lidar_min=5.0)
        assert diag["is_stuck"] is False
        assert diag["override_action"] is None
        assert diag["reason"] == "nominal"


def test_watchdog_stagnation_detection_and_escape():
    """Verify watchdog detects pinned robot and triggers reverse-turn recovery sequence."""
    watchdog = StagnationWatchdog(
        history_len=8,
        min_displacement_m=0.20,
        stuck_steps_trigger=4,
        escape_reverse_steps=3,
        escape_turn_steps=2
    )

    # Simulate robot pinned at (5.0, 2.0) with jitter
    for step in range(8):
        diag = watchdog.update(robot_x=5.0 + 0.01 * (step % 2), robot_y=2.0, robot_heading=0.0)

    # Continue pinned steps to exceed stuck trigger
    triggered = False
    for step in range(6):
        diag = watchdog.update(robot_x=5.0, robot_y=2.0, robot_heading=0.0)
        if diag["is_stuck"]:
            triggered = True
            assert diag["is_recovering"] is True
            assert diag["override_action"] in [StagnationWatchdog.ACTION_BRAKE, StagnationWatchdog.ACTION_LEFT, StagnationWatchdog.ACTION_RIGHT]
            break

    assert triggered, "Watchdog failed to trigger escape sequence when robot was stagnant!"


def test_watchdog_head_on_obstacle_trigger():
    """Verify watchdog triggers escape when head-on LiDAR drops below safety threshold."""
    watchdog = StagnationWatchdog(history_len=5, stuck_steps_trigger=3)

    # Robot stuck right in front of cow or barricade (<0.65m)
    triggered = False
    for step in range(5):
        diag = watchdog.update(robot_x=10.0, robot_y=1.0, robot_heading=0.0, front_lidar_min=0.45)
        if diag["is_stuck"]:
            triggered = True
            assert diag["reason"] == "head_on_obstacle"
            break

    assert triggered, "Watchdog failed to trigger escape for head-on obstacle!"


def test_watchdog_reset():
    """Verify watchdog resets counters and queue on episode reset."""
    watchdog = StagnationWatchdog()
    for _ in range(15):
        watchdog.update(robot_x=0.0, robot_y=0.0, robot_heading=0.0)

    watchdog.reset()
    assert len(watchdog.pos_history) == 0
    assert watchdog.stagnant_step_count == 0
    assert watchdog.is_recovering is False
    assert len(watchdog.recovery_queue) == 0

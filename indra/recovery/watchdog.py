"""
Project INDRA: Anti-Stagnation Watchdog and Recovery System.
Detects local minima trapping, oscillation patterns, and blocked-path dead-ends
in cluttered Indian urban environments (e.g. narrow alleys, cattle roadblocks, dense traffic gridlock).
Executes autonomous multi-step reversing and detour recovery maneuvers.
"""

import math
from collections import deque
from typing import Dict, Any, List, Optional, Tuple


class StagnationWatchdog:
    """
    Automated runtime supervisor monitoring robot kinematic progress.
    Triggers recovery escape maneuvers when stagnation or oscillation is detected.
    """

    ACTION_FORWARD = 0
    ACTION_BRAKE = 1  # Reverses kinematics in IndraEnv
    ACTION_LEFT = 2
    ACTION_RIGHT = 3
    ACTION_STAY = 4

    def __init__(
        self,
        history_len: int = 15,
        min_displacement_m: float = 0.25,
        stuck_steps_trigger: int = 8,
        escape_reverse_steps: int = 4,
        escape_turn_steps: int = 3
    ):
        self.history_len = history_len
        self.min_displacement_m = min_displacement_m
        self.stuck_steps_trigger = stuck_steps_trigger
        self.escape_reverse_steps = escape_reverse_steps
        self.escape_turn_steps = escape_turn_steps

        self.pos_history: deque = deque(maxlen=history_len)
        self.stagnant_step_count: int = 0
        self.head_on_block_count: int = 0
        self.is_recovering: bool = False
        self.recovery_queue: List[int] = []
        self.total_recoveries: int = 0
        self.recovery_attempts: int = 0
        self.recovery_successes: int = 0
        self.recovery_failures: int = 0
        self.total_recovery_steps: int = 0
        self.last_escape_reason: str = "nominal"
        self._post_recovery_check_pos: Optional[Tuple[float, float]] = None
        self._post_recovery_steps_left: int = 0

    def reset(self) -> None:
        """Reset watchdog state on episode change."""
        self.pos_history.clear()
        self.stagnant_step_count = 0
        self.head_on_block_count = 0
        self.is_recovering = False
        self.recovery_queue.clear()
        self.last_escape_reason = "nominal"
        self._post_recovery_check_pos = None
        self._post_recovery_steps_left = 0

    def get_metrics(self) -> Dict[str, Any]:
        """Return quantitative recovery diagnostic metrics."""
        return {
            "attempts": self.recovery_attempts,
            "successes": self.recovery_successes,
            "failures": self.recovery_failures,
            "is_recovering": self.is_recovering,
            "total_recovery_steps": self.total_recovery_steps,
            "last_reason": self.last_escape_reason
        }

    def update(
        self,
        robot_x: float,
        robot_y: float,
        robot_heading: float,
        front_lidar_min: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Update watchdog with current robot pose and sensor readings.
        Returns diagnostic dictionary including whether recovery mode is active
        and the recommended override action.
        """
        curr_pos = (float(robot_x), float(robot_y))
        self.pos_history.append(curr_pos)

        # Monitor post-recovery displacement for success/failure accounting
        if self._post_recovery_steps_left > 0 and self._post_recovery_check_pos is not None:
            self._post_recovery_steps_left -= 1
            if self._post_recovery_steps_left == 0:
                dist = math.hypot(curr_pos[0] - self._post_recovery_check_pos[0],
                                  curr_pos[1] - self._post_recovery_check_pos[1])
                if dist >= 0.5:
                    self.recovery_successes += 1
                else:
                    self.recovery_failures += 1
                self._post_recovery_check_pos = None

        # 1. If currently executing an active escape maneuver, consume from recovery queue
        if self.is_recovering and len(self.recovery_queue) > 0:
            self.total_recovery_steps += 1
            override_action = self.recovery_queue.pop(0)
            if len(self.recovery_queue) == 0:
                self.is_recovering = False
                self.stagnant_step_count = 0
                self.head_on_block_count = 0
                self.pos_history.clear()
                self._post_recovery_check_pos = curr_pos
                self._post_recovery_steps_left = 12
            return {
                "is_stuck": True,
                "is_recovering": True,
                "override_action": override_action,
                "reason": self.last_escape_reason,
                "steps_remaining": len(self.recovery_queue),
                "metrics": self.get_metrics()
            }

        # 2. Check displacement over window
        if len(self.pos_history) >= self.history_len:
            oldest_pos = self.pos_history[0]
            displacement = math.hypot(curr_pos[0] - oldest_pos[0], curr_pos[1] - oldest_pos[1])

            if displacement < self.min_displacement_m:
                self.stagnant_step_count += 1
            else:
                self.stagnant_step_count = max(0, self.stagnant_step_count - 1)

        # 3. Check imminent head-on obstruction via LiDAR
        if front_lidar_min is not None and front_lidar_min < 0.65:
            self.head_on_block_count += 1
        else:
            self.head_on_block_count = max(0, self.head_on_block_count - 1)

        is_head_on_trigger = self.head_on_block_count >= 2
        is_stagnation_trigger = self.stagnant_step_count >= self.stuck_steps_trigger

        # 4. Trigger recovery if stuck threshold exceeded or blocked against obstacle
        if is_stagnation_trigger or is_head_on_trigger:
            if self._post_recovery_steps_left > 0:
                # Immediate re-trigger during monitoring window counts as failure
                self.recovery_failures += 1
                self._post_recovery_steps_left = 0
                self._post_recovery_check_pos = None

            self.is_recovering = True
            self.total_recoveries += 1
            self.recovery_attempts += 1
            self.total_recovery_steps += 1
            self.last_escape_reason = "head_on_obstacle" if is_head_on_trigger else "position_stagnation"

            # Construct escape sequence: reverse k steps, then turn away
            # For head-on dead ends, execute a 3-point turnaround (extended reverse + strong pivot + forward clear)
            turn_action = self.ACTION_LEFT if (self.total_recoveries % 2 == 1) else self.ACTION_RIGHT
            if is_head_on_trigger:
                self.recovery_queue = (
                    [self.ACTION_BRAKE] * (self.escape_reverse_steps + 1) +
                    [turn_action] * (self.escape_turn_steps + 1) +
                    [self.ACTION_FORWARD] * 2
                )
            else:
                self.recovery_queue = (
                    [self.ACTION_BRAKE] * self.escape_reverse_steps +
                    [turn_action] * self.escape_turn_steps
                )

            override_action = self.recovery_queue.pop(0)
            return {
                "is_stuck": True,
                "is_recovering": True,
                "override_action": override_action,
                "reason": self.last_escape_reason,
                "steps_remaining": len(self.recovery_queue),
                "metrics": self.get_metrics()
            }

        return {
            "is_stuck": False,
            "is_recovering": False,
            "override_action": None,
            "reason": "nominal",
            "steps_remaining": 0,
            "metrics": self.get_metrics()
        }

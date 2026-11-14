"""
Robot3D: Animated 3D Service/Delivery Robot Entity.
Implements smooth yaw easing, wheel spin, LiDAR scanner sweeps, antenna sway,
spot headlights, status LED states, bump recoil, and goal victory animation.
"""

import math
from typing import Optional, List
from panda3d.core import NodePath, Vec3, Vec4, PointLight

from viz3d.mapping import WorldMapping, SmoothPose
from viz3d.assets3d import build_robot_model


class Robot3D:
    """
    Animated 3D Robot representation with physical wheel spin, scanner sweeps,
    dynamic status LED beacon, and motion recoil.
    """

    # Status LED Color Presets
    LED_CYAN_THINKING = (0.0, 0.88, 1.0, 1.0)
    LED_GREEN_MOVING = (0.15, 0.95, 0.45, 1.0)
    LED_RED_BUMP = (1.0, 0.20, 0.20, 1.0)
    LED_GOLD_GOAL = (1.0, 0.82, 0.15, 1.0)

    def __init__(self, parent_node: NodePath):
        self.root = parent_node.attachNewNode("robot_entity_root")
        self.model = build_robot_model()
        self.model.reparentTo(self.root)

        # Retrieve animatable parts
        self.wheels: List[NodePath] = self.model.getPythonTag("wheels") or []
        self.scanner: Optional[NodePath] = self.model.getPythonTag("scanner")
        self.beacon: Optional[NodePath] = self.model.getPythonTag("beacon")

        # Headlight spot lights attached to front
        self.headlight = PointLight("robot_headlight")
        self.headlight.setColor(Vec4(1.0, 0.96, 0.85, 1.0))
        self.headlight.setAttenuation(Vec3(0.5, 0.2, 0.1))
        self.hl_np = self.root.attachNewNode(self.headlight)
        self.hl_np.setPos(0, 0.35, 0.15)
        self.root.setLight(self.hl_np)

        # Smooth pose interpolator
        self.pose = SmoothPose()
        self.wheel_rot: float = 0.0
        self.time: float = 0.0
        self.state: str = "moving"  # "thinking", "moving", "bump", "goal"

        # Animation timers
        self.bump_timer: float = 0.0
        self.goal_timer: float = 0.0

    def set_state(self, state: str) -> None:
        self.state = state
        if self.beacon is not None:
            if state == "thinking":
                self.beacon.setColor(*self.LED_CYAN_THINKING)
            elif state == "moving":
                self.beacon.setColor(*self.LED_GREEN_MOVING)
            elif state == "bump":
                self.beacon.setColor(*self.LED_RED_BUMP)
            elif state == "goal":
                self.beacon.setColor(*self.LED_GOLD_GOAL)

    def trigger_bump(self) -> None:
        self.bump_timer = 0.35
        self.set_state("bump")

    def trigger_goal(self) -> None:
        self.goal_timer = 2.0
        self.set_state("goal")

    def sync_from_env(self, robot_x: float, robot_y: float, dx: float, dy: float, is_planning: bool) -> None:
        """Update destination target from environment state."""
        x3d, y3d, _ = WorldMapping.px_to_3d(robot_x, robot_y, 0.0)
        target_h = WorldMapping.heading_deg(dx, dy) if (abs(dx) > 1e-4 or abs(dy) > 1e-4) else None

        self.pose.set_target(x3d, y3d, 0.0, target_h)

        if self.bump_timer <= 0 and self.goal_timer <= 0:
            if is_planning:
                self.set_state("thinking")
            else:
                self.set_state("moving")

    def update(self, dt: float) -> None:
        """Step animations forward by dt seconds."""
        self.time += dt
        self.pose.update(dt)

        # Apply base position and heading
        px, py, pz = self.pose.x, self.pose.y, self.pose.z
        h = self.pose.h

        # Bump recoil effect
        if self.bump_timer > 0:
            self.bump_timer -= dt
            recoil = math.sin(self.bump_timer * 20.0) * 0.04
            rad = math.radians(h)
            px -= math.sin(rad) * recoil
            py -= math.cos(rad) * recoil
            if self.bump_timer <= 0:
                self.set_state("moving")

        # Goal victory spin
        if self.goal_timer > 0:
            self.goal_timer -= dt
            h += (2.0 - self.goal_timer) * 360.0
            pz += math.sin((2.0 - self.goal_timer) * 12.0) * 0.08

        self.root.setPos(px, py, pz)
        self.root.setH(h)

        # Wheel spin proportional to movement velocity
        speed = self.pose.last_move_speed
        if speed > 0.01:
            wheel_radius = 0.05  # 5cm
            self.wheel_rot += (speed * dt / wheel_radius) * 57.2958  # rad to deg
            for w in self.wheels:
                w.setP(self.wheel_rot)

        # LiDAR / Scanner sweep
        if self.scanner is not None:
            if self.state == "thinking":
                sweep = math.sin(self.time * 8.0) * 45.0
                self.scanner.setH(sweep)
            else:
                # Lock forward
                self.scanner.setH(0.0)

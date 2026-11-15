"""
Person3D: Animated Walking Human Entity (Scenario 2 Moving Obstacle).
Implements articulated limb swing synced to velocity, smooth heading turns on wall bounces,
randomized clothing palettes, contact shadows, and predicted future trajectory ribbons.
"""

import math
from typing import Optional, List
from panda3d.core import NodePath, Vec3, Vec4, CardMaker, LineSegs

from viz3d.mapping import WorldMapping, SmoothPose
from viz3d.assets3d import build_human_model


class Person3D:
    """
    Animated 3D human mannequin for Scenario 2 with synchronized arm and leg swings.
    """

    CLOTHING_PALETTES = [
        # (Jacket, Trousers, Hair)
        ((0.18, 0.35, 0.58, 1.0), (0.22, 0.25, 0.30, 1.0), (0.20, 0.15, 0.10, 1.0)), # Navy / Gray
        ((0.72, 0.28, 0.22, 1.0), (0.18, 0.20, 0.24, 1.0), (0.35, 0.25, 0.18, 1.0)), # Maroon / Dark
        ((0.24, 0.52, 0.36, 1.0), (0.28, 0.30, 0.35, 1.0), (0.12, 0.12, 0.12, 1.0)), # Forest / Charcoal
        ((0.35, 0.32, 0.40, 1.0), (0.15, 0.16, 0.20, 1.0), (0.55, 0.45, 0.30, 1.0)), # Slate / Black
    ]

    def __init__(self, parent_node: NodePath):
        self.root = parent_node.attachNewNode("person_entity_root")
        self.model = build_human_model()
        self.model.reparentTo(self.root)

        # Retrieve animatable joints
        self.hip_left: Optional[NodePath] = self.model.getPythonTag("hip_left")
        self.hip_right: Optional[NodePath] = self.model.getPythonTag("hip_right")
        self.shoulder_left: Optional[NodePath] = self.model.getPythonTag("shoulder_left")
        self.shoulder_right: Optional[NodePath] = self.model.getPythonTag("shoulder_right")
        self.torso: Optional[NodePath] = self.model.getPythonTag("torso")

        # Contact shadow beneath feet
        cm = CardMaker("person_shadow")
        cm.setFrame(-0.25, 0.25, -0.25, 0.25)
        self.shadow = self.root.attachNewNode(cm.generate())
        self.shadow.setP(-90)
        self.shadow.setPos(0, 0, 0.005)
        self.shadow.setColor(0.08, 0.10, 0.14, 0.6)
        self.shadow.setTransparency(True)

        # Predicted trajectory ribbon
        self.trail_root = parent_node.attachNewNode("person_predicted_trail")

        self.pose = SmoothPose()
        self.walk_phase: float = 0.0
        self.velocity_y: float = 0.0

    def set_palette(self, seed: int) -> None:
        """Apply deterministic randomized clothing palette based on episode seed."""
        palette = self.CLOTHING_PALETTES[seed % len(self.CLOTHING_PALETTES)]
        jacket_col, pants_col, hair_col = palette
        if self.torso:
            self.torso.setColor(*jacket_col)
        leg_l = self.model.find("**/leg_left")
        leg_r = self.model.find("**/leg_right")
        if leg_l:
            leg_l.setColor(*pants_col)
        if leg_r:
            leg_r.setColor(*pants_col)
        hair = self.model.find("**/hair")
        if hair:
            hair.setColor(*hair_col)

    def sync_from_env(self, person_x: float, person_y: float, vy: float, show_prediction: bool = True) -> None:
        """Synchronize position, velocity, and future predicted trajectory."""
        self.velocity_y = vy
        x3d, y3d, _ = WorldMapping.px_to_3d(person_x, person_y, 0.0)

        # In 3D: vy > 0 in 2D is moving South (-Y in 3D) -> Heading 180
        # vy < 0 in 2D is moving North (+Y in 3D) -> Heading 0
        target_h = 180.0 if vy > 0 else 0.0
        self.pose.set_target(x3d, y3d, 0.0, target_h)

        # Update predicted future trajectory ribbon if world model is active
        self.trail_root.node().removeAllChildren()
        if show_prediction and abs(vy) > 0.01:
            lines = LineSegs("predicted_person_trail")
            lines.setColor(0.9, 0.4, 0.2, 0.6)
            lines.setThickness(2.0)

            # Draw predicted trajectory 1.5 seconds ahead
            curr_y = person_y
            lines.moveTo(x3d, y3d, 0.01)
            for step in range(1, 15):
                fut_y = curr_y + vy * step * 1.5
                _, fut_y3d, _ = WorldMapping.px_to_3d(person_x, fut_y, 0.01)
                lines.drawTo(x3d, fut_y3d, 0.01)

            self.trail_root.attachNewNode(lines.create())

    def update(self, dt: float, robot_pos: Optional[Vec3] = None) -> None:
        """Advance procedural walk cycle animation and head glance IK."""
        self.pose.update(dt, pos_speed=18.0, rot_speed=12.0)
        self.root.setPos(self.pose.x, self.pose.y, self.pose.z)
        self.root.setH(self.pose.h)

        # Procedural head turn toward robot when within 1.5m
        head = self.model.find("**/head")
        if head and robot_pos is not None:
            dx = robot_pos.x - self.pose.x
            dy = robot_pos.y - self.pose.y
            dist = math.hypot(dx, dy)
            if dist < 1.5:
                # Look toward robot relative to person heading
                angle_to_robot = math.degrees(math.atan2(dx, dy)) - self.pose.h
                # Wrap to [-180, 180]
                while angle_to_robot > 180: angle_to_robot -= 360
                while angle_to_robot < -180: angle_to_robot += 360
                clamped_yaw = max(-50.0, min(50.0, angle_to_robot))
                head.setH(clamped_yaw)
            else:
                head.setH(0.0)

        speed = abs(self.velocity_y)
        if speed > 0.1:
            # Sync walk cycle frequency to movement speed
            self.walk_phase += dt * (speed * 0.4)
            swing_angle = math.sin(self.walk_phase) * 28.0

            if self.hip_left:
                self.hip_left.setP(swing_angle)
            if self.hip_right:
                self.hip_right.setP(-swing_angle)
            if self.shoulder_left:
                self.shoulder_left.setP(-swing_angle * 0.8)
            if self.shoulder_right:
                self.shoulder_right.setP(swing_angle * 0.8)

            # Torso vertical bobbing
            bob = abs(math.sin(self.walk_phase * 2.0)) * 0.025
            self.model.setZ(bob)
        else:
            # Idle pose
            if self.hip_left:
                self.hip_left.setP(0)
            if self.hip_right:
                self.hip_right.setP(0)
            if self.shoulder_left:
                self.shoulder_left.setP(0)
            if self.shoulder_right:
                self.shoulder_right.setP(0)
            self.model.setZ(0)

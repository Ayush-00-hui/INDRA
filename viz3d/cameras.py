"""
Cameras3D: Camera Controllers, Multi-View Modes, and Eased Interpolation.
Supports 5 camera perspectives (Key C):
1. Overview 3/4 Dollhouse (Default)
2. Top-Down 2D-Matched
3. Follow / Chase Behind Robot
4. Robot POV (First-person eye view)
5. Cinematic Orbit (Demo attract mode)
Plus smooth exponential camera easing and Picture-in-Picture support.
"""

import math
from typing import Tuple, Optional
from panda3d.core import NodePath, Vec3


class CameraController:
    """
    Controls primary Panda3D camera with smooth continuous easing between modes.
    """

    MODES = ["overview", "follow", "topdown", "robot_pov", "cinematic"]

    def __init__(self, camera_np: NodePath):
        self.cam = camera_np
        self.mode_index = 0
        self.mode = self.MODES[self.mode_index]

        # Current camera pose
        self.curr_pos = Vec3(0, -6.0, 5.2)
        self.curr_lookat = Vec3(0, 0, 0.3)

        # Target camera pose
        self.target_pos = Vec3(0, -6.0, 5.2)
        self.target_lookat = Vec3(0, 0, 0.3)

        self.orbit_angle: float = 0.0

    def cycle_mode(self) -> str:
        """Advance to next camera perspective (Key C)."""
        self.mode_index = (self.mode_index + 1) % len(self.MODES)
        self.mode = self.MODES[self.mode_index]
        return self.mode

    def set_mode(self, mode_name: str) -> None:
        if mode_name in self.MODES:
            self.mode = mode_name
            self.mode_index = self.MODES.index(mode_name)

    def update(self, dt: float, robot_pos: Vec3, robot_heading: float) -> None:
        """Update target camera position and interpolate smoothly."""
        if self.mode == "overview":
            # 3/4 Dollhouse perspective: South-looking-North
            self.target_pos = Vec3(0, -6.2, 5.2)
            self.target_lookat = Vec3(0, 0.2, 0.4)

        elif self.mode == "topdown":
            # Straight down top-down perspective (matching 2D layout)
            self.target_pos = Vec3(0, 0.001, 7.8)
            self.target_lookat = Vec3(0, 0, 0)

        elif self.mode == "follow":
            # Third-person chase behind robot
            rad = math.radians(robot_heading)
            # Behind robot: -heading
            chase_dist = 1.6
            cam_x = robot_pos.x - math.sin(rad) * chase_dist
            cam_y = robot_pos.y - math.cos(rad) * chase_dist
            self.target_pos = Vec3(cam_x, cam_y, robot_pos.z + 1.2)
            self.target_lookat = Vec3(robot_pos.x, robot_pos.y, robot_pos.z + 0.3)

        elif self.mode == "robot_pov":
            # First-person camera right at visor height looking forward
            rad = math.radians(robot_heading)
            cam_x = robot_pos.x + math.sin(rad) * 0.12
            cam_y = robot_pos.y + math.cos(rad) * 0.12
            self.target_pos = Vec3(cam_x, cam_y, robot_pos.z + 0.22)
            look_x = robot_pos.x + math.sin(rad) * 2.5
            look_y = robot_pos.y + math.cos(rad) * 2.5
            self.target_lookat = Vec3(look_x, look_y, robot_pos.z + 0.20)

        elif self.mode == "cinematic":
            # Slow graceful orbit around arena
            self.orbit_angle += dt * 15.0
            rad = math.radians(self.orbit_angle)
            dist = 6.5
            self.target_pos = Vec3(math.sin(rad) * dist, -math.cos(rad) * dist, 4.8)
            self.target_lookat = Vec3(0, 0, 0.5)

        # Smooth exponential easing
        smooth = 1.0 - math.exp(-8.0 * max(0.001, dt))
        self.curr_pos += (self.target_pos - self.curr_pos) * smooth
        self.curr_lookat += (self.target_lookat - self.curr_lookat) * smooth

        self.cam.setPos(self.curr_pos)
        self.cam.lookAt(self.curr_lookat)

"""
Coordinate mapping and smooth pose interpolation between Pygame (2D) and Panda3D (3D).

Units & Conventions:
- 1 px = 1 cm = 0.01 m
- Pygame Room: 900 x 600 px (top-left is 0, 0)
- Panda3D Room: 9.0 x 6.0 m centered at (0, 0, 0)
    X in [-4.5, +4.5] (Right / East)
    Y in [-3.0, +3.0] (Depth: +Y is North / Top, -Y is South / Bottom)
    Z >= 0 (Height: Up)
"""

import math
from typing import Tuple


class WorldMapping:
    SCALE: float = 0.01  # 1 px = 0.01 m
    ROOM_WIDTH_PX: float = 900.0
    ROOM_HEIGHT_PX: float = 600.0

    HALF_WIDTH_M: float = ROOM_WIDTH_PX * SCALE * 0.5   # 4.5 m
    HALF_HEIGHT_M: float = ROOM_HEIGHT_PX * SCALE * 0.5 # 3.0 m

    @classmethod
    def px_to_3d(cls, px_x: float, px_y: float, z_m: float = 0.0) -> Tuple[float, float, float]:
        """Convert Pygame pixel (x, y) to Panda3D world coordinate (X, Y, Z)."""
        x_3d = px_x * cls.SCALE - cls.HALF_WIDTH_M
        y_3d = (cls.ROOM_HEIGHT_PX - px_y) * cls.SCALE - cls.HALF_HEIGHT_M
        return (x_3d, y_3d, z_m)

    @classmethod
    def size_to_3d(cls, px_w: float, px_h: float) -> Tuple[float, float]:
        """Convert Pygame 2D pixel width and height to 3D metric dimensions (width, depth)."""
        return (px_w * cls.SCALE, px_h * cls.SCALE)

    @classmethod
    def heading_deg(cls, dx: float, dy: float) -> float:
        """
        Calculate Panda3D heading angle in degrees from movement delta (dx, dy).
        In Panda3D, H=0 is +Y (North), H=-90 is +X (East), H=+90 is -X (West), H=180 is -Y (South).
        """
        if abs(dx) < 1e-4 and abs(dy) < 1e-4:
            return 0.0
        angle_rad = math.atan2(dx, -dy)
        return -math.degrees(angle_rad)


class SmoothPose:
    """
    Interpolates position and heading smoothly over time to eliminate simulation stepping judder.
    Uses exponential decay (frame-rate independent lerp) and shortest-arc angle interpolation.
    """

    def __init__(self, x: float = 0.0, y: float = 0.0, z: float = 0.0, h: float = 0.0):
        self.x = x
        self.y = y
        self.z = z
        self.h = h

        self.target_x = x
        self.target_y = y
        self.target_z = z
        self.target_h = h

        self.last_move_speed: float = 0.0

    def snap_to(self, x: float, y: float, z: float, h: float) -> None:
        """Instantly teleport to target pose without interpolation (e.g. on episode reset)."""
        self.x = self.target_x = x
        self.y = self.target_y = y
        self.z = self.target_z = z
        self.h = self.target_h = h
        self.last_move_speed = 0.0

    def set_target(self, x: float, y: float, z: float, h: float = None) -> None:
        """Set new destination target from environment state."""
        self.target_x = x
        self.target_y = y
        self.target_z = z
        if h is not None:
            self.target_h = h

    def update(self, dt: float, pos_speed: float = 18.0, rot_speed: float = 14.0) -> None:
        """Step the interpolation forward by dt seconds."""
        # Exponential smoothing factor
        alpha_pos = 1.0 - math.exp(-pos_speed * max(0.001, dt))
        alpha_rot = 1.0 - math.exp(-rot_speed * max(0.001, dt))

        # Position lerp
        dx = self.target_x - self.x
        dy = self.target_y - self.y
        dz = self.target_z - self.z

        self.x += dx * alpha_pos
        self.y += dy * alpha_pos
        self.z += dz * alpha_pos

        self.last_move_speed = math.hypot(dx, dy) / max(0.001, dt)

        # Shortest-arc heading slerp
        dh = (self.target_h - self.h + 180.0) % 360.0 - 180.0
        self.h += dh * alpha_rot

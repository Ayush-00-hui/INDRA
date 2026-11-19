"""
Project INDRA: Robot Kinematics and Dynamics Model.
Defines continuous unicycle / differential-drive kinematics, physical footprint,
acceleration limits, and collision geometry for small urban autonomous mobile robots (UGVs).
"""

import math
from dataclasses import dataclass
from typing import Tuple, Dict, Any


@dataclass
class RobotSpecs:
    """Physical specifications and kinematic limits for the INDRA UGV."""
    name: str = "INDRA-UGV-Alpha"
    length_m: float = 0.85          # 85 cm length
    width_m: float = 0.60           # 60 cm width
    height_m: float = 0.55          # 55 cm height
    mass_kg: float = 35.0           # 35 kg dry mass
    wheelbase_m: float = 0.50       # 50 cm wheelbase
    collision_radius_m: float = 0.45 # 45 cm bounding circle
    max_linear_speed_mps: float = 2.2 # ~8 km/h max urban sidewalk/lane speed
    max_reverse_speed_mps: float = 0.8 # ~3 km/h reverse
    max_linear_accel_mps2: float = 2.0 # 2.0 m/s^2 linear acceleration
    max_angular_speed_radps: float = 2.5 # ~143 deg/s yaw rate
    max_angular_accel_radps2: float = 4.0 # 4.0 rad/s^2 angular acceleration


class UrbanRobotKinematics:
    """
    Unicycle motion model with first-order acceleration dynamics and bounded steering.
    Coordinates are in meters, heading is in radians (0 = East / +X, pi/2 = North / +Y).
    """

    def __init__(self, specs: RobotSpecs = None, init_x: float = 0.0, init_y: float = 0.0, init_heading: float = 0.0):
        self.specs = specs or RobotSpecs()
        self.x: float = float(init_x)
        self.y: float = float(init_y)
        self.heading: float = float(init_heading) # radians
        self.v: float = 0.0                      # current linear velocity (m/s)
        self.w: float = 0.0                      # current angular velocity (rad/s)
        self.target_v: float = 0.0
        self.target_w: float = 0.0

    def reset(self, x: float = 0.0, y: float = 0.0, heading: float = 0.0):
        self.x = float(x)
        self.y = float(y)
        self.heading = float(heading)
        self.v = 0.0
        self.w = 0.0
        self.target_v = 0.0
        self.target_w = 0.0

    def set_control_targets(self, target_linear_v: float, target_angular_w: float):
        """Set commanded linear velocity (m/s) and angular velocity (rad/s)."""
        self.target_v = max(-self.specs.max_reverse_speed_mps, min(self.specs.max_linear_speed_mps, target_linear_v))
        self.target_w = max(-self.specs.max_angular_speed_radps, min(self.specs.max_angular_speed_radps, target_angular_w))

    def update(self, dt: float, surface_friction: float = 1.0) -> Tuple[float, float, float]:
        """
        Integrate kinematics forward by dt seconds taking surface friction into account.
        Returns: (x, y, heading)
        """
        dt = max(0.001, min(0.2, dt))
        friction = max(0.2, min(1.0, surface_friction))

        effective_max_accel = self.specs.max_linear_accel_mps2 * friction
        effective_max_ang_accel = self.specs.max_angular_accel_radps2 * friction

        # Linear acceleration ramp
        dv = self.target_v - self.v
        max_dv = effective_max_accel * dt
        self.v += max(-max_dv, min(max_dv, dv))

        # Angular acceleration ramp
        dw = self.target_w - self.w
        max_dw = effective_max_ang_accel * dt
        self.w += max(-max_dw, min(max_dw, dw))

        # Unicycle kinematic integration
        if abs(self.w) < 1e-4:
            # Straight-line approximation
            dx = self.v * math.cos(self.heading) * dt
            dy = self.v * math.sin(self.heading) * dt
            self.heading = (self.heading + math.pi) % (2 * math.pi) - math.pi
        else:
            # Exact arc integration
            dtheta = self.w * dt
            r = self.v / self.w
            dx = r * (math.sin(self.heading + dtheta) - math.sin(self.heading))
            dy = -r * (math.cos(self.heading + dtheta) - math.cos(self.heading))
            self.heading = (self.heading + dtheta + math.pi) % (2 * math.pi) - math.pi

        self.x += dx
        self.y += dy

        return self.x, self.y, self.heading

    def get_state_dict(self) -> Dict[str, Any]:
        return {
            "x": round(self.x, 3),
            "y": round(self.y, 3),
            "heading_rad": round(self.heading, 4),
            "heading_deg": round(math.degrees(self.heading), 2),
            "linear_speed_mps": round(self.v, 3),
            "linear_speed_kmh": round(self.v * 3.6, 2),
            "angular_speed_radps": round(self.w, 3),
            "collision_radius_m": self.specs.collision_radius_m
        }

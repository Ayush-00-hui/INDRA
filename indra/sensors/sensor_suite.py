"""
Project INDRA: Simulated Multi-Sensor Perception Suite.
Provides 360° 2D LiDAR raycasting, forward camera frustum filtering,
and noisy IMU/Wheel Odometry, strictly separating ground truth from robot observations.
"""

import math
from typing import List, Dict, Any, Tuple
import numpy as np


class SensorSuite:
    """
    Simulates onboard sensors for the INDRA Autonomous Mobile Robot.
    """

    def __init__(self, num_lidar_beams: int = 16, max_lidar_range_m: float = 12.0, camera_fov_deg: float = 75.0):
        self.num_lidar_beams = num_lidar_beams
        self.max_lidar_range_m = max_lidar_range_m
        self.camera_fov_rad = math.radians(camera_fov_deg)
        self.camera_max_range_m = 18.0

    def compute_lidar_scan(
        self,
        robot_x: float,
        robot_y: float,
        robot_heading: float,
        actors: List[Any],
        bounds: Tuple[float, float, float, float],
        attenuation: float = 1.0
    ) -> List[float]:
        """
        Cast 2D radial rays and compute obstacle intersection distances.
        Takes environmental weather attenuation into account.
        """
        effective_range = self.max_lidar_range_m * max(0.2, min(1.0, attenuation))
        min_x, min_y, max_x, max_y = bounds
        scan: List[float] = []

        for i in range(self.num_lidar_beams):
            angle = robot_heading + (i / self.num_lidar_beams) * 2.0 * math.pi - math.pi
            cos_a = math.cos(angle)
            sin_a = math.sin(angle)

            min_dist = effective_range

            # Intersect with outer boundary walls
            if cos_a > 1e-4:
                d = (max_x - robot_x) / cos_a
                if 0 < d < min_dist:
                    min_dist = d
            elif cos_a < -1e-4:
                d = (min_x - robot_x) / cos_a
                if 0 < d < min_dist:
                    min_dist = d

            if sin_a > 1e-4:
                d = (max_y - robot_y) / sin_a
                if 0 < d < min_dist:
                    min_dist = d
            elif sin_a < -1e-4:
                d = (min_y - robot_y) / sin_a
                if 0 < d < min_dist:
                    min_dist = d

            # Intersect with circular footprints of actors & hazards
            ray_dx = cos_a
            ray_dy = sin_a

            for actor in actors:
                ax = actor.x
                ay = actor.y
                ar = actor.radius

                # Vector from robot to actor center
                dx = ax - robot_x
                dy = ay - robot_y

                # Projection onto ray
                proj = dx * ray_dx + dy * ray_dy
                if proj > 0: # In front of ray
                    # Perpendicular distance squared
                    perp_sq = (dx * dx + dy * dy) - (proj * proj)
                    if perp_sq < ar * ar:
                        # Ray hits sphere: distance to entry point
                        half_chord = math.sqrt(max(0.0, ar * ar - perp_sq))
                        hit_dist = proj - half_chord
                        if 0 < hit_dist < min_dist:
                            min_dist = hit_dist

            scan.append(round(min_dist, 3))

        return scan

    def compute_camera_detections(
        self,
        robot_x: float,
        robot_y: float,
        robot_heading: float,
        actors: List[Any],
        visibility: float = 1.0
    ) -> List[Dict[str, Any]]:
        """
        Detect actors inside the forward camera frustum, subject to visibility and lighting.
        """
        detections: List[Dict[str, Any]] = []
        effective_range = self.camera_max_range_m * max(0.1, min(1.0, visibility))

        for actor in actors:
            dx = actor.x - robot_x
            dy = actor.y - robot_y
            dist = math.hypot(dx, dy)

            if dist > effective_range or dist < 0.1:
                continue

            angle_to_actor = math.atan2(dy, dx)
            angle_diff = (angle_to_actor - robot_heading + math.pi) % (2 * math.pi) - math.pi

            if abs(angle_diff) <= self.camera_fov_rad / 2.0:
                confidence = max(0.2, (1.0 - (dist / effective_range)) * visibility)
                detections.append({
                    "id": actor.actor_id,
                    "kind": actor.kind,
                    "distance_m": round(dist, 2),
                    "bearing_deg": round(math.degrees(angle_diff), 1),
                    "confidence": round(confidence, 2)
                })

        return detections

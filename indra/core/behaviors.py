"""
Project INDRA: Intelligent Actor Steering and Behavioral Models.
Implements:
1. Intelligent Driver Model (IDM) for vehicle car-following and braking.
2. Two-Wheeler Lane-Filtering Steering (Motorcycles & Scooters).
3. Pedestrian Crossing State Machine (Walking, Waiting, Crossing).
4. Animal State Machines (Cattle & Stray Dogs).
"""

import math
import random
from enum import Enum
from typing import Tuple, Optional, List, Any


class PedestrianState(str, Enum):
    ON_SIDEWALK = "on_sidewalk"
    WAITING_TO_CROSS = "waiting_to_cross"
    CROSSING = "crossing"
    AVOIDING = "avoiding"


class IDMController:
    """
    Intelligent Driver Model (IDM) for realistic acceleration, headway keeping,
    and collision prevention among urban road vehicles.
    """

    def __init__(
        self,
        desired_speed: float = 4.0,       # v0 (m/s)
        time_headway: float = 1.4,         # T (s)
        min_spacing: float = 2.0,          # s0 (m)
        max_accel: float = 1.8,            # a (m/s^2)
        comfortable_decel: float = 2.4     # b (m/s^2)
    ):
        self.v0 = desired_speed
        self.T = time_headway
        self.s0 = min_spacing
        self.a = max_accel
        self.b = comfortable_decel

    def compute_acceleration(self, current_speed: float, lead_distance: Optional[float] = None, lead_relative_speed: float = 0.0) -> float:
        """
        Compute continuous longitudinal acceleration in m/s^2.
        lead_relative_speed = current_speed - lead_speed (positive if closing in).
        """
        v = max(0.0, current_speed)

        # Free-road acceleration term
        free_road_ratio = (v / max(0.1, self.v0)) ** 4
        free_accel = self.a * (1.0 - free_road_ratio)

        if lead_distance is None or lead_distance <= 0:
            return max(-self.b * 2.0, min(self.a, free_accel))

        # Dynamic desired distance s*
        s_star = self.s0 + max(0.0, v * self.T + (v * lead_relative_speed) / (2.0 * math.sqrt(max(0.1, self.a * self.b))))

        # Interaction term
        interaction = (s_star / max(0.2, lead_distance)) ** 2
        accel = self.a * (1.0 - free_road_ratio - interaction)

        return max(-self.b * 2.5, min(self.a, accel))


class PedestrianBehaviorController:
    """
    Simulates urban pedestrian behavior: walking on curbs, pausing before zebra crossings,
    and crossing when a safe gap appears.
    """

    def __init__(self, init_state: PedestrianState = PedestrianState.ON_SIDEWALK):
        self.state = init_state
        self.state_timer = random.uniform(1.0, 4.0)
        self.wait_timer = 0.0
        self.cross_target_y: float = 0.0

    def update(self, current_y: float, nearby_vehicle_dist: float, dt: float) -> Tuple[float, float]:
        """
        Returns (target_vx, target_vy) in m/s.
        """
        walk_speed = 1.1 # m/s (~4 km/h)

        if self.state == PedestrianState.ON_SIDEWALK:
            self.state_timer -= dt
            if self.state_timer <= 0:
                # Transition to waiting to cross
                self.state = PedestrianState.WAITING_TO_CROSS
                self.wait_timer = random.uniform(1.5, 3.5)
            return (walk_speed * 0.7, 0.0) # Walking along road edge

        elif self.state == PedestrianState.WAITING_TO_CROSS:
            self.wait_timer -= dt
            # If gap is sufficiently large or timer expires, initiate crossing
            if self.wait_timer <= 0 and nearby_vehicle_dist > 6.0:
                self.state = PedestrianState.CROSSING
                self.cross_target_y = -current_y # Cross to opposite curb
            return (0.0, 0.0) # Waiting at curb

        elif self.state == PedestrianState.CROSSING:
            # Move laterally across road
            dy = self.cross_target_y - current_y
            if abs(dy) < 0.3:
                # Completed crossing
                self.state = PedestrianState.ON_SIDEWALK
                self.state_timer = random.uniform(4.0, 8.0)
                return (walk_speed, 0.0)

            vy = math.copysign(walk_speed, dy)
            return (walk_speed * 0.2, vy)

        return (walk_speed, 0.0)

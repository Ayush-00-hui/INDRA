"""
Project INDRA: Dynamic Indian Urban Actors and Obstacles.
Simulates realistic, heterogeneous Indian traffic participants with distinct kinematics,
footprints, speeds, and behavior patterns.
"""

import math
import random
from typing import Dict, Any, List, Tuple, Optional

from indra.core.behaviors import IDMController, PedestrianBehaviorController, PedestrianState


class UrbanActor:
    """Base class for all static and dynamic urban environment actors."""

    def __init__(
        self,
        actor_id: str,
        kind: str,
        x: float,
        y: float,
        heading: float = 0.0,
        speed: float = 0.0,
        width: float = 1.0,
        length: float = 1.0,
        radius: float = 0.5,
        is_dynamic: bool = True
    ):
        self.actor_id = actor_id
        self.kind = kind
        self.x = float(x)
        self.y = float(y)
        self.heading = float(heading) # radians
        self.speed = float(speed)     # m/s
        self.width = float(width)
        self.length = float(length)
        self.radius = float(radius)
        self.is_dynamic = is_dynamic
        self.vx = self.speed * math.cos(self.heading)
        self.vy = self.speed * math.sin(self.heading)

    def update(self, dt: float, road_bounds: Tuple[float, float, float, float], other_actors: Optional[List[Any]] = None) -> None:
        """Update actor position and behavior."""
        if not self.is_dynamic:
            return
        self.x += self.vx * dt
        self.y += self.vy * dt

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.actor_id,
            "kind": self.kind,
            "x": round(self.x, 3),
            "y": round(self.y, 3),
            "heading": round(math.degrees(self.heading), 1),
            "vx": round(self.vx, 3),
            "vy": round(self.vy, 3),
            "speed": round(self.speed, 3),
            "w": self.width,
            "h": self.length,
            "r": self.radius,
            "is_dynamic": self.is_dynamic
        }


class AutoRickshaw(UrbanActor):
    """
    Classic Indian 3-Wheeler Auto-Rickshaw.
    Characteristics: Moderately high maneuverability, occasional swerving, periodic halts, IDM car-following.
    """

    def __init__(self, actor_id: str, x: float, y: float, heading: float = 0.0, base_speed: float = 3.5):
        super().__init__(
            actor_id=actor_id,
            kind="auto_rickshaw",
            x=x,
            y=y,
            heading=heading,
            speed=base_speed,
            width=1.3,
            length=2.6,
            radius=1.2,
            is_dynamic=True
        )
        self.base_speed = base_speed
        self.idm = IDMController(desired_speed=base_speed, time_headway=1.2, min_spacing=2.5)
        self.swerve_phase = random.uniform(0, math.pi * 2)
        self.halt_timer = 0.0

    def update(self, dt: float, road_bounds: Tuple[float, float, float, float], other_actors: Optional[List[Any]] = None):
        self.swerve_phase += dt * 1.5

        # Check lead vehicle headway
        lead_dist = None
        rel_speed = 0.0
        if other_actors:
            for other in other_actors:
                if other.actor_id == self.actor_id:
                    continue
                # Ahead in heading direction
                dx = other.x - self.x
                dy = other.y - self.y
                forward_dist = dx * math.cos(self.heading) + dy * math.sin(self.heading)
                lateral_dist = abs(-dx * math.sin(self.heading) + dy * math.cos(self.heading))

                if 0 < forward_dist < 20.0 and lateral_dist < 1.8:
                    if lead_dist is None or forward_dist < lead_dist:
                        lead_dist = forward_dist
                        rel_speed = self.speed - getattr(other, "speed", 0.0)

        # Occasional passenger drop-off halt
        if random.random() < 0.001 and self.halt_timer <= 0:
            self.halt_timer = 3.0

        if self.halt_timer > 0:
            self.halt_timer -= dt
            self.speed = max(0.0, self.speed - 2.0 * dt)
        else:
            accel = self.idm.compute_acceleration(self.speed, lead_dist, rel_speed)
            self.speed = max(0.0, min(self.base_speed * 1.3, self.speed + accel * dt))

            # Sinusoidal lane weave typical of urban traffic
            lateral_nudge = math.sin(self.swerve_phase) * 0.12
            self.heading += lateral_nudge * dt

        self.vx = self.speed * math.cos(self.heading)
        self.vy = self.speed * math.sin(self.heading)
        super().update(dt, road_bounds)

        # Wrap around bounds for continuous traffic
        min_x, min_y, max_x, max_y = road_bounds
        if self.x > max_x + 5.0:
            self.x = min_x - 5.0
        elif self.x < min_x - 5.0:
            self.x = max_x + 5.0
        if self.y > max_y + 4.0:
            self.y = min_y - 4.0
        elif self.y < min_y - 4.0:
            self.y = max_y + 4.0


class Motorcycle(UrbanActor):
    """
    Motorcycle / Scooter with agile lane-filtering dynamics and swift overtaking.
    """

    def __init__(self, actor_id: str, x: float, y: float, heading: float = 0.0, base_speed: float = 5.2):
        super().__init__(
            actor_id=actor_id,
            kind="motorcycle",
            x=x,
            y=y,
            heading=heading,
            speed=base_speed,
            width=0.8,
            length=1.9,
            radius=0.7,
            is_dynamic=True
        )
        self.base_speed = base_speed
        self.filter_timer = random.uniform(1.0, 3.0)

    def update(self, dt: float, road_bounds: Tuple[float, float, float, float], other_actors: Optional[List[Any]] = None):
        # Lane-filtering lateral drift
        self.filter_timer -= dt
        if self.filter_timer <= 0:
            self.filter_timer = random.uniform(2.0, 5.0)
            lateral_shift = random.uniform(-0.15, 0.15)
            self.heading += lateral_shift

        self.vx = self.speed * math.cos(self.heading)
        self.vy = self.speed * math.sin(self.heading)
        super().update(dt, road_bounds)

        min_x, min_y, max_x, max_y = road_bounds
        if self.x > max_x + 6.0:
            self.x = min_x - 6.0
        elif self.x < min_x - 6.0:
            self.x = max_x + 6.0


class IndianCar(UrbanActor):
    """
    Compact Hatchback / Sedan (Maruti Suzuki Swift / Dzire style).
    Characteristics: Disciplined lane adherence, smooth IDM braking.
    """

    def __init__(self, actor_id: str, x: float, y: float, heading: float = 0.0, base_speed: float = 4.5):
        super().__init__(
            actor_id=actor_id,
            kind="car",
            x=x,
            y=y,
            heading=heading,
            speed=base_speed,
            width=1.7,
            length=3.9,
            radius=1.5,
            is_dynamic=True
        )
        self.base_speed = base_speed
        self.idm = IDMController(desired_speed=base_speed, time_headway=1.5, min_spacing=3.0)

    def update(self, dt: float, road_bounds: Tuple[float, float, float, float], other_actors: Optional[List[Any]] = None):
        lead_dist = None
        rel_speed = 0.0
        if other_actors:
            for other in other_actors:
                if other.actor_id == self.actor_id:
                    continue
                dx = other.x - self.x
                dy = other.y - self.y
                forward_dist = dx * math.cos(self.heading) + dy * math.sin(self.heading)
                lateral_dist = abs(-dx * math.sin(self.heading) + dy * math.cos(self.heading))
                if 0 < forward_dist < 25.0 and lateral_dist < 2.0:
                    if lead_dist is None or forward_dist < lead_dist:
                        lead_dist = forward_dist
                        rel_speed = self.speed - getattr(other, "speed", 0.0)

        accel = self.idm.compute_acceleration(self.speed, lead_dist, rel_speed)
        self.speed = max(0.0, min(self.base_speed * 1.2, self.speed + accel * dt))

        self.vx = self.speed * math.cos(self.heading)
        self.vy = self.speed * math.sin(self.heading)
        super().update(dt, road_bounds)

        min_x, min_y, max_x, max_y = road_bounds
        if self.x > max_x + 6.0:
            self.x = min_x - 6.0
        elif self.x < min_x - 6.0:
            self.x = max_x + 6.0


class Bus(UrbanActor):
    """
    Delhi Transport Corporation (DTC) style City Bus.
    Large footprint: length 9.5m, width 2.5m, radius 3.8m. Moves steadily.
    """

    def __init__(self, actor_id: str, x: float, y: float, heading: float = 0.0, base_speed: float = 3.2):
        super().__init__(
            actor_id=actor_id,
            kind="bus",
            x=x,
            y=y,
            heading=heading,
            speed=base_speed,
            width=2.5,
            length=9.5,
            radius=3.8,
            is_dynamic=True
        )
        self.base_speed = base_speed
        self.idm = IDMController(desired_speed=base_speed, time_headway=2.0, min_spacing=5.0)

    def update(self, dt: float, road_bounds: Tuple[float, float, float, float], other_actors: Optional[List[Any]] = None):
        self.vx = self.speed * math.cos(self.heading)
        self.vy = self.speed * math.sin(self.heading)
        super().update(dt, road_bounds)

        min_x, min_y, max_x, max_y = road_bounds
        if self.x > max_x + 12.0:
            self.x = min_x - 12.0
        elif self.x < min_x - 12.0:
            self.x = max_x + 12.0


class Pedestrian(UrbanActor):
    """
    Urban Pedestrian with intelligent crossing and sidewalk behavior.
    """

    def __init__(self, actor_id: str, x: float, y: float, init_state: PedestrianState = PedestrianState.ON_SIDEWALK):
        super().__init__(
            actor_id=actor_id,
            kind="person",
            x=x,
            y=y,
            heading=0.0,
            speed=1.1,
            width=0.45,
            length=0.45,
            radius=0.40,
            is_dynamic=True
        )
        self.controller = PedestrianBehaviorController(init_state)

    def update(self, dt: float, road_bounds: Tuple[float, float, float, float], other_actors: Optional[List[Any]] = None):
        # Find distance to closest oncoming vehicle
        min_veh_dist = 50.0
        if other_actors:
            for a in other_actors:
                if a.actor_id != self.actor_id and getattr(a, "is_dynamic", False):
                    d = math.hypot(a.x - self.x, a.y - self.y)
                    if d < min_veh_dist:
                        min_veh_dist = d

        tvx, tvy = self.controller.update(self.y, min_veh_dist, dt)
        self.vx = tvx
        self.vy = tvy
        self.speed = math.hypot(self.vx, self.vy)
        if self.speed > 0.05:
            self.heading = math.atan2(self.vy, self.vx)

        super().update(dt, road_bounds)

        min_x, min_y, max_x, max_y = road_bounds
        if self.x > max_x + 2.0:
            self.x = min_x - 2.0
        elif self.x < min_x - 2.0:
            self.x = max_x + 2.0


class Cattle(UrbanActor):
    """
    Sacred Indian Cattle (Zebu / Cow).
    Characteristics: Very slow or stationary in middle of street, completely indifferent
    to robot proximity. Forces autonomous robot to identify and execute evasive detour.
    """

    def __init__(self, actor_id: str, x: float, y: float, heading: float = 0.0):
        super().__init__(
            actor_id=actor_id,
            kind="cow",
            x=x,
            y=y,
            heading=heading,
            speed=0.15,
            width=0.9,
            length=2.1,
            radius=0.95,
            is_dynamic=True
        )
        self.wander_timer = random.uniform(2.0, 6.0)

    def update(self, dt: float, road_bounds: Tuple[float, float, float, float], other_actors: Optional[List[Any]] = None):
        self.wander_timer -= dt
        if self.wander_timer <= 0:
            self.wander_timer = random.uniform(4.0, 10.0)
            if random.random() < 0.70:
                self.speed = 0.0 # Resting stationary on tarmac
            else:
                self.speed = 0.2
                self.heading += random.uniform(-0.5, 0.5)

        self.vx = self.speed * math.cos(self.heading)
        self.vy = self.speed * math.sin(self.heading)
        super().update(dt, road_bounds)


class StrayDog(UrbanActor):
    """
    Urban Stray Dog.
    Characteristics: Quick, sudden turns, rests by curb or darts across road.
    """

    def __init__(self, actor_id: str, x: float, y: float):
        super().__init__(
            actor_id=actor_id,
            kind="dog",
            x=x,
            y=y,
            heading=random.uniform(-math.pi, math.pi),
            speed=0.0,
            width=0.4,
            length=0.75,
            radius=0.35,
            is_dynamic=True
        )
        self.state_timer = random.uniform(1.0, 4.0)

    def update(self, dt: float, road_bounds: Tuple[float, float, float, float], other_actors: Optional[List[Any]] = None):
        self.state_timer -= dt
        if self.state_timer <= 0:
            self.state_timer = random.uniform(1.5, 4.5)
            if random.random() < 0.45:
                self.speed = 0.0 # Sleeping / resting
            else:
                self.speed = random.uniform(0.8, 1.8) # Quick trot
                self.heading += random.uniform(-1.2, 1.2)

        self.vx = self.speed * math.cos(self.heading)
        self.vy = self.speed * math.sin(self.heading)
        super().update(dt, road_bounds)


class VendorCart(UrbanActor):
    """
    Hand-pushed wooden street vendor cart (Thela).
    Characteristics: Stationary roadside fruit/vegetable stall or slow pushcart.
    """

    def __init__(self, actor_id: str, x: float, y: float, is_pushcart: bool = False):
        super().__init__(
            actor_id=actor_id,
            kind="vendor_cart",
            x=x,
            y=y,
            heading=0.0,
            speed=0.6 if is_pushcart else 0.0,
            width=1.2,
            length=2.0,
            radius=1.1,
            is_dynamic=is_pushcart
        )


class RoadHazard(UrbanActor):
    """
    Static road surface hazard: Pothole, Waterlogged Trench, or Construction Barricade.
    """

    def __init__(self, actor_id: str, hazard_type: str, x: float, y: float, radius: float = 0.6):
        super().__init__(
            actor_id=actor_id,
            kind=hazard_type, # "pothole", "waterlogging", "barricade"
            x=x,
            y=y,
            heading=0.0,
            speed=0.0,
            width=radius * 2.0,
            length=radius * 2.0,
            radius=radius,
            is_dynamic=False
        )
        self.severity = 1.0 # Cost multiplier

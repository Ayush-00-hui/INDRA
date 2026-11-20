"""
Project INDRA: Scenario Configuration and Management Engine.
Defines reproducible, parameter-driven Indian urban scenarios with deterministic seeding.
Covers Scenarios 1 through 10 of the Project INDRA Master Evaluation Matrix.
"""

from dataclasses import dataclass, field
from typing import Dict, Any, List, Tuple, Optional
import random

from indra.core.conditions import WeatherType, RoadCondition, TimeOfDay
from indra.core.actors import (
    AutoRickshaw, Motorcycle, IndianCar, Bus, Pedestrian,
    Cattle, StrayDog, VendorCart, RoadHazard, UrbanActor
)
from indra.core.behaviors import PedestrianState


@dataclass
class ScenarioDefinition:
    scenario_id: int
    name: str
    code: str
    difficulty: str
    description: str
    robot_start: Tuple[float, float, float] # (x, y, heading_rad)
    goal_pos: Tuple[float, float]          # (x, y)
    weather: WeatherType = WeatherType.CLEAR
    road: RoadCondition = RoadCondition.DRY
    time_of_day: TimeOfDay = TimeOfDay.AFTERNOON
    actors: List[UrbanActor] = field(default_factory=list)
    hazards: List[RoadHazard] = field(default_factory=list)
    bounds: Tuple[float, float, float, float] = (-15.0, -10.0, 45.0, 10.0) # 60m x 20m urban stretch
    extra: Dict[str, Any] = field(default_factory=dict)


class ScenarioRegistry:
    """Manages creation and deterministic seeding of Project INDRA scenarios."""

    @staticmethod
    def list_all_scenarios() -> List[Dict[str, Any]]:
        """Return catalog of available INDRA scenarios."""
        return [
            {"id": 1, "name": "Scenario 1: Arterial Urban Corridor", "code": "arterial_corridor", "difficulty": "Standard"},
            {"id": 2, "name": "Scenario 2: Narrow Chandni Chowk Alley", "code": "narrow_alley", "difficulty": "Challenging"},
            {"id": 3, "name": "Scenario 3: Dense Market Chaos", "code": "market_chaos", "difficulty": "Extreme"},
            {"id": 4, "name": "Scenario 4: Sacred Cattle & Animal Hazard", "code": "animal_hazard", "difficulty": "High"},
            {"id": 5, "name": "Scenario 5: Delhi Monsoon Waterlogging", "code": "monsoon_waterlogging", "difficulty": "Extreme"},
            {"id": 6, "name": "Scenario 6: Pedestrian Crossing & Jaywalking", "code": "pedestrian_crossing", "difficulty": "High"},
            {"id": 7, "name": "Scenario 7: Moving Motorcycle Cut-in", "code": "motorcycle_cutin", "difficulty": "Dynamic"},
            {"id": 8, "name": "Scenario 8: Road Construction & Barricades", "code": "road_construction", "difficulty": "Constrained"},
            {"id": 9, "name": "Scenario 9: Dead-End Recovery Maneuver", "code": "dead_end_recovery", "difficulty": "Recovery"},
            {"id": 10, "name": "Scenario 10: Dense Traffic Gridlock", "code": "dense_gridlock", "difficulty": "Maximum"},
            {"id": 11, "name": "Scenario 11: Connaught Place Real-World Pilot (CityForge)", "code": "connaught_place_pilot", "difficulty": "Full District"}
        ]

    @staticmethod
    def create_scenario(variant: int = 1, seed: int = 1001) -> ScenarioDefinition:
        random.seed(seed)

        if variant == 1:
            # Scenario 1: Arterial Urban Corridor (Delhi Ring Road)
            actors = [
                AutoRickshaw("rickshaw_1", x=10.0, y=1.8, heading=0.0, base_speed=3.2),
                AutoRickshaw("rickshaw_2", x=22.0, y=-1.8, heading=3.1415, base_speed=2.6),
                Motorcycle("bike_1", x=4.0, y=-2.0, heading=0.0, base_speed=4.8),
            ]
            hazards = [
                RoadHazard("pothole_1", "pothole", x=15.0, y=0.5, radius=0.6)
            ]
            return ScenarioDefinition(
                scenario_id=1,
                name="Scenario 1: Arterial Urban Corridor",
                code="arterial_corridor",
                difficulty="Standard",
                description="Navigating a multi-lane Indian urban corridor with oncoming auto-rickshaws, filtering two-wheelers, and mild road surface degradation.",
                robot_start=(-10.0, 0.0, 0.0),
                goal_pos=(35.0, 0.0),
                weather=WeatherType.CLEAR,
                road=RoadCondition.DRY,
                time_of_day=TimeOfDay.AFTERNOON,
                actors=actors,
                hazards=hazards
            )

        elif variant == 2:
            # Scenario 2: Narrow Chandni Chowk Alley
            actors = [
                VendorCart("cart_stall_1", x=2.0, y=2.2, is_pushcart=False),
                VendorCart("cart_stall_2", x=18.0, y=-2.0, is_pushcart=False),
                Motorcycle("parked_scooter_1", x=8.0, y=-2.2, heading=1.57, base_speed=0.0),
                Motorcycle("parked_scooter_2", x=24.0, y=2.0, heading=-1.57, base_speed=0.0),
                StrayDog("dog_curb", x=12.0, y=2.5),
            ]
            hazards = [
                RoadHazard("pothole_narrow", "pothole", x=14.0, y=0.0, radius=0.7)
            ]
            return ScenarioDefinition(
                scenario_id=2,
                name="Scenario 2: Narrow Chandni Chowk Alley",
                code="narrow_alley",
                difficulty="Challenging",
                description="Constrained street corridor congested by parked two-wheelers, roadside wooden stalls, and limited lateral clearance.",
                robot_start=(-10.0, 0.0, 0.0),
                goal_pos=(32.0, 0.0),
                weather=WeatherType.CLEAR,
                road=RoadCondition.DRY,
                time_of_day=TimeOfDay.MORNING,
                actors=actors,
                hazards=hazards
            )

        elif variant == 3:
            # Scenario 3: Dense Market Chaos (Karol Bagh)
            actors = [
                VendorCart("thela_push_1", x=6.0, y=0.5, is_pushcart=True),
                AutoRickshaw("rickshaw_market", x=16.0, y=-1.5, heading=0.0, base_speed=2.0),
                Motorcycle("bike_market", x=22.0, y=1.2, heading=3.1415, base_speed=3.0),
                Pedestrian("ped_market_1", x=12.0, y=3.0, init_state=PedestrianState.CROSSING),
                StrayDog("dog_market", x=10.0, y=-1.0),
            ]
            hazards = [
                RoadHazard("barrier_market", "barricade", x=14.0, y=2.0, radius=0.8),
                RoadHazard("pothole_market", "pothole", x=20.0, y=-0.5, radius=0.6),
            ]
            return ScenarioDefinition(
                scenario_id=3,
                name="Scenario 3: Dense Market Chaos",
                code="market_chaos",
                difficulty="Extreme",
                description="High stochasticity environment with moving vendor pushcarts, weaving rickshaws, and road clutter demanding rapid replanning.",
                robot_start=(-10.0, 0.0, 0.0),
                goal_pos=(32.0, 0.0),
                weather=WeatherType.DUST_HAZE,
                road=RoadCondition.DRY,
                time_of_day=TimeOfDay.AFTERNOON,
                actors=actors,
                hazards=hazards
            )

        elif variant == 4:
            # Scenario 4: Animal on Road (Sacred Cattle & Stray Dog)
            actors = [
                Cattle("cow_center", x=10.0, y=0.2, heading=0.3),
                StrayDog("dog_dart", x=4.0, y=-1.5),
                AutoRickshaw("rickshaw_avoiding", x=22.0, y=-2.0, heading=3.1415, base_speed=2.2),
            ]
            hazards = [
                RoadHazard("road_curb_barrier", "barricade", x=11.0, y=3.0, radius=0.5)
            ]
            return ScenarioDefinition(
                scenario_id=4,
                name="Scenario 4: Sacred Cattle & Stray Animal Hazard",
                code="animal_hazard",
                difficulty="High",
                description="A large cow resting immovably in the center lane and darting stray dogs. The robot must recognize the obstacle, slow down, and negotiate a wide perimeter detour.",
                robot_start=(-10.0, 0.0, 0.0),
                goal_pos=(30.0, 0.0),
                weather=WeatherType.CLEAR,
                road=RoadCondition.DRY,
                time_of_day=TimeOfDay.EVENING,
                actors=actors,
                hazards=hazards
            )

        elif variant == 5:
            # Scenario 5: Monsoon Waterlogging & Reduced Visibility
            actors = [
                AutoRickshaw("rickshaw_rain", x=14.0, y=1.5, heading=0.0, base_speed=2.0),
                Motorcycle("bike_rain", x=24.0, y=-1.5, heading=3.1415, base_speed=2.5),
                Cattle("cow_rain", x=8.0, y=-2.5, heading=0.0),
            ]
            hazards = [
                RoadHazard("waterlog_zone_1", "waterlogging", x=4.0, y=-0.2, radius=1.6),
                RoadHazard("waterlog_zone_2", "waterlogging", x=18.0, y=0.5, radius=1.8),
                RoadHazard("pothole_submerged", "pothole", x=12.0, y=-0.5, radius=0.8),
            ]
            return ScenarioDefinition(
                scenario_id=5,
                name="Scenario 5: Delhi Monsoon Waterlogging",
                code="monsoon_waterlogging",
                difficulty="Extreme",
                description="Severe monsoon rainfall resulting in road inundation, degraded surface traction, waterlogged impassable puddles, and reduced sensor clarity.",
                robot_start=(-10.0, 0.0, 0.0),
                goal_pos=(30.0, 0.0),
                weather=WeatherType.HEAVY_RAIN,
                road=RoadCondition.WATERLOGGED,
                time_of_day=TimeOfDay.EVENING,
                actors=actors,
                hazards=hazards
            )

        elif variant == 6:
            # Scenario 6: Pedestrian Crossing & Jaywalking
            actors = [
                Pedestrian("ped_cross_1", x=15.0, y=4.5, init_state=PedestrianState.CROSSING),
                Pedestrian("ped_cross_2", x=16.5, y=-4.5, init_state=PedestrianState.WAITING_TO_CROSS),
                IndianCar("car_yielding", x=8.0, y=-1.8, heading=0.0, base_speed=3.0),
                Motorcycle("scooter_bypassing", x=5.0, y=2.0, heading=0.0, base_speed=4.0),
            ]
            hazards = [
                RoadHazard("pothole_cross", "pothole", x=13.0, y=-0.8, radius=0.5)
            ]
            return ScenarioDefinition(
                scenario_id=6,
                name="Scenario 6: Pedestrian Crossing & Jaywalking",
                code="pedestrian_crossing",
                difficulty="High",
                description="Pedestrians crossing across zebra crosswalk and jaywalking between lanes. Demands anticipatory deceleration and polite yielding.",
                robot_start=(-10.0, 0.0, 0.0),
                goal_pos=(34.0, 0.0),
                weather=WeatherType.CLEAR,
                road=RoadCondition.DRY,
                time_of_day=TimeOfDay.AFTERNOON,
                actors=actors,
                hazards=hazards
            )

        elif variant == 7:
            # Scenario 7: Moving Motorcycle Cut-in
            actors = [
                Motorcycle("speed_bike_cutin", x=-4.0, y=-2.5, heading=0.35, base_speed=6.5),
                AutoRickshaw("rickshaw_lane", x=12.0, y=1.8, heading=0.0, base_speed=3.0),
                IndianCar("sedan_following", x=-7.0, y=1.6, heading=0.0, base_speed=4.0),
            ]
            hazards = []
            return ScenarioDefinition(
                scenario_id=7,
                name="Scenario 7: Moving Motorcycle Cut-in",
                code="motorcycle_cutin",
                difficulty="Dynamic",
                description="A high-velocity motorcycle approaches from behind and cuts aggressively across the robot's forward trajectory, testing reactive and predictive braking.",
                robot_start=(-10.0, 0.0, 0.0),
                goal_pos=(32.0, 0.0),
                weather=WeatherType.CLEAR,
                road=RoadCondition.DRY,
                time_of_day=TimeOfDay.MORNING,
                actors=actors,
                hazards=hazards
            )

        elif variant == 8:
            # Scenario 8: Road Construction & Barricades
            actors = [
                AutoRickshaw("rickshaw_merge", x=8.0, y=-2.0, heading=0.0, base_speed=2.5),
                IndianCar("cab_diverting", x=16.0, y=-1.8, heading=0.0, base_speed=2.8),
            ]
            hazards = [
                RoadHazard("trench_barrier_1", "barricade", x=6.0, y=1.2, radius=1.0),
                RoadHazard("trench_barrier_2", "barricade", x=10.0, y=1.2, radius=1.0),
                RoadHazard("open_trench", "pothole", x=8.0, y=1.0, radius=0.9),
                RoadHazard("trench_barrier_3", "barricade", x=14.0, y=1.2, radius=1.0),
            ]
            return ScenarioDefinition(
                scenario_id=8,
                name="Scenario 8: Road Construction & Barricaded Diversion",
                code="road_construction",
                difficulty="Constrained",
                description="Active urban utility excavation blocking the entire left lane with red barricades, forcing all traffic through a narrow single-lane bottleneck.",
                robot_start=(-10.0, 0.0, 0.0),
                goal_pos=(30.0, 0.0),
                weather=WeatherType.DUST_HAZE,
                road=RoadCondition.DRY,
                time_of_day=TimeOfDay.AFTERNOON,
                actors=actors,
                hazards=hazards
            )

        elif variant == 9:
            # Scenario 9: Dead-End Alley & Recovery
            actors = [
                VendorCart("thela_blocking", x=15.0, y=0.0, is_pushcart=False),
                Motorcycle("bike_parked_1", x=13.0, y=1.5, heading=1.57, base_speed=0.0),
                Motorcycle("bike_parked_2", x=13.0, y=-1.5, heading=-1.57, base_speed=0.0),
            ]
            hazards = [
                RoadHazard("dead_end_wall_1", "barricade", x=16.0, y=1.8, radius=0.8),
                RoadHazard("dead_end_wall_2", "barricade", x=16.0, y=-1.8, radius=0.8),
            ]
            return ScenarioDefinition(
                scenario_id=9,
                name="Scenario 9: Dead-End Recovery Maneuver",
                code="dead_end_recovery",
                difficulty="Recovery",
                description="The robot enters a completely blocked alleyway. The system must recognize zero viable forward progress and execute a reverse recovery trajectory.",
                robot_start=(-6.0, 0.0, 0.0),
                goal_pos=(28.0, 0.0), # Destination blocked by barriers and stalls
                weather=WeatherType.CLEAR,
                road=RoadCondition.DRY,
                time_of_day=TimeOfDay.EVENING,
                actors=actors,
                hazards=hazards
            )

        elif variant == 10:
            # Scenario 10: Dense Traffic Gridlock
            actors = [
                Bus("dtc_bus", x=14.0, y=1.8, heading=0.0, base_speed=2.0),
                AutoRickshaw("rickshaw_jam_1", x=4.0, y=-1.5, heading=0.0, base_speed=1.8),
                AutoRickshaw("rickshaw_jam_2", x=22.0, y=-1.8, heading=3.1415, base_speed=1.5),
                IndianCar("sedan_jam", x=-2.0, y=1.6, heading=0.0, base_speed=2.2),
                Motorcycle("bike_jam", x=8.0, y=-0.2, heading=0.0, base_speed=2.5),
                Cattle("cow_gridlock", x=18.0, y=-0.5, heading=0.0),
                Pedestrian("ped_between_cars", x=10.0, y=0.5, init_state=PedestrianState.CROSSING),
            ]
            hazards = [
                RoadHazard("pothole_gridlock", "pothole", x=11.0, y=-2.0, radius=0.6)
            ]
            return ScenarioDefinition(
                scenario_id=10,
                name="Scenario 10: Dense Traffic Gridlock",
                code="dense_gridlock",
                difficulty="Maximum",
                description="High-density Indian urban peak traffic featuring city buses, auto-rickshaws, weaving scooters, resting cattle, and jaywalking pedestrians in dense proximity.",
                robot_start=(-10.0, 0.0, 0.0),
                goal_pos=(35.0, 0.0),
                weather=WeatherType.FOG_SMOG,
                road=RoadCondition.DRY,
                time_of_day=TimeOfDay.EVENING,
                actors=actors,
                hazards=hazards
            )

        elif variant == 11:
            # Scenario 11: Connaught Place Real-World Pilot (CityForge)
            import json
            import os

            scene_file = os.path.abspath(os.path.join(
                os.path.dirname(__file__), "..", "..", "data", "cityforge", "delhi_cp_v1", "city_3d_scene.json"
            ))
            scene_data = {}
            if os.path.exists(scene_file):
                try:
                    with open(scene_file, "r", encoding="utf-8") as f:
                        scene_data = json.load(f)
                except Exception:
                    scene_data = {}

            actors = [
                AutoRickshaw("cp_auto_1", x=20.0, y=10.0, heading=2.8, base_speed=2.8),
                AutoRickshaw("cp_auto_2", x=-15.0, y=-25.0, heading=0.5, base_speed=2.5),
                Motorcycle("cp_bike_1", x=5.0, y=-15.0, heading=1.57, base_speed=4.2),
                Motorcycle("cp_scooter_parked", x=28.0, y=14.0, heading=0.0, base_speed=0.0),
                Cattle("cp_cow_park", x=-5.0, y=5.0, heading=0.0),
                StrayDog("cp_dog_curb", x=12.0, y=2.0),
                Pedestrian("cp_ped_crossing", x=18.0, y=-5.0, init_state=PedestrianState.CROSSING),
                VendorCart("cp_thela_chai", x=-20.0, y=12.0, is_pushcart=False),
            ]

            hazards = [
                RoadHazard("cp_pothole_1", "pothole", x=15.0, y=4.0, radius=0.8),
                RoadHazard("cp_waterlog_1", "waterlogging", x=-10.0, y=-8.0, radius=1.8),
            ]

            # Add the 5 impassable stair segments as high-priority safety hazards
            for st in scene_data.get("impassable_stairs", []):
                hazards.append(RoadHazard(
                    st.get("hazard_id", "stair_hazard"),
                    "impassable_stairs",
                    x=float(st.get("x", 0.0)),
                    y=float(st.get("y", 0.0)),
                    radius=float(st.get("radius", 1.4))
                ))

            # Add street furniture objects as static actors with collision radii
            for obj in scene_data.get("street_objects", []):
                subclass = obj.get("subclass", "object")
                actors.append(UrbanActor(
                    actor_id=obj.get("object_id", "street_obj"),
                    kind=f"street_obj_{subclass}",
                    x=float(obj.get("x", 0.0)),
                    y=float(obj.get("y", 0.0)),
                    radius=float(obj.get("collision_radius", 0.45)),
                    is_dynamic=False
                ))

            nav_defs = scene_data.get("navigation_defaults", {})
            b_list = nav_defs.get("bounds", [-125.0, -125.0, 125.0, 125.0])
            bounds = (float(b_list[0]), float(b_list[1]), float(b_list[2]), float(b_list[3]))
            r_start = nav_defs.get("robot_start", [35.0, 7.5, 3.14])
            robot_start = (float(r_start[0]), float(r_start[1]), float(r_start[2]))
            g_pos = nav_defs.get("goal_pos", [-30.0, 35.0])
            goal_pos = (float(g_pos[0]), float(g_pos[1]))

            return ScenarioDefinition(
                scenario_id=11,
                name="Scenario 11: Connaught Place Real-World Pilot (CityForge)",
                code="connaught_place_pilot",
                difficulty="Full District",
                description="Empirical 250m x 250m Connaught Place urban district derived from CityForge geographic survey. Real building footprints, colonnade arcades, road network, 5 impassable stair segments, and active Delhi traffic.",
                robot_start=robot_start,
                goal_pos=goal_pos,
                weather=WeatherType.CLEAR,
                road=RoadCondition.DRY,
                time_of_day=TimeOfDay.AFTERNOON,
                actors=actors,
                hazards=hazards,
                bounds=bounds,
                extra={"city_3d_scene": scene_data}
            )

        else:
            return ScenarioRegistry.create_scenario(1, seed)

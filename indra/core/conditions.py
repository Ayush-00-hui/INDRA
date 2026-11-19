"""
Project INDRA: Environmental Condition System.
Models weather, atmospheric visibility, road surface friction, waterlogging,
and diurnal lighting, translating them into concrete physical and sensor degradation parameters.
"""

from enum import Enum
from dataclasses import dataclass
from typing import Dict, Any


class WeatherType(str, Enum):
    CLEAR = "clear"
    LIGHT_RAIN = "light_rain"
    HEAVY_RAIN = "heavy_rain"
    FOG_SMOG = "fog_smog"
    DUST_HAZE = "dust_haze"


class RoadCondition(str, Enum):
    DRY = "dry"
    WET = "wet"
    PUDDLES = "puddles"
    WATERLOGGED = "waterlogged"
    POTHOLES = "potholes"


class TimeOfDay(str, Enum):
    MORNING = "morning"
    AFTERNOON = "afternoon"
    EVENING = "evening"
    NIGHT = "night"


@dataclass
class EnvironmentState:
    weather: WeatherType = WeatherType.CLEAR
    road: RoadCondition = RoadCondition.DRY
    time_of_day: TimeOfDay = TimeOfDay.AFTERNOON

    # Derived physics & perception modifiers
    surface_friction: float = 0.90      # Friction coefficient [0.2 - 1.0]
    lidar_attenuation: float = 1.00     # Effective LiDAR range factor [0.4 - 1.0]
    camera_visibility: float = 1.00     # Camera illumination/contrast factor [0.2 - 1.0]
    ambient_lux: float = 1.00           # Ambient scene light multiplier [0.1 - 1.2]
    waterlog_depth_cm: float = 0.0      # Water depth in inundated zones [0 - 30 cm]

    def update_derived_effects(self):
        """Recalculate deterministic physical impacts of selected environment conditions."""
        # 1. Road Surface Friction & Waterlogging Depth
        if self.road == RoadCondition.DRY:
            self.surface_friction = 0.92
            self.waterlog_depth_cm = 0.0
        elif self.road == RoadCondition.WET:
            self.surface_friction = 0.65
            self.waterlog_depth_cm = 1.0
        elif self.road == RoadCondition.PUDDLES:
            self.surface_friction = 0.50
            self.waterlog_depth_cm = 4.0
        elif self.road == RoadCondition.WATERLOGGED:
            self.surface_friction = 0.28
            self.waterlog_depth_cm = 18.0 # Critical depth for micro-UGVs!
        elif self.road == RoadCondition.POTHOLES:
            self.surface_friction = 0.55
            self.waterlog_depth_cm = 2.0

        # Rain further degrades friction
        if self.weather == WeatherType.LIGHT_RAIN:
            self.surface_friction = min(self.surface_friction, 0.60)
            self.lidar_attenuation = 0.88
            self.camera_visibility = 0.80
        elif self.weather == WeatherType.HEAVY_RAIN:
            self.surface_friction = min(self.surface_friction, 0.38)
            self.lidar_attenuation = 0.62
            self.camera_visibility = 0.45
            self.waterlog_depth_cm = max(self.waterlog_depth_cm, 10.0)
        elif self.weather == WeatherType.FOG_SMOG:
            self.lidar_attenuation = 0.68
            self.camera_visibility = 0.40
        elif self.weather == WeatherType.DUST_HAZE:
            self.lidar_attenuation = 0.75
            self.camera_visibility = 0.55
        else: # CLEAR
            self.lidar_attenuation = 1.00
            self.camera_visibility = 1.00

        # Diurnal Ambient Lighting
        if self.time_of_day == TimeOfDay.MORNING:
            self.ambient_lux = 0.85
        elif self.time_of_day == TimeOfDay.AFTERNOON:
            self.ambient_lux = 1.00
        elif self.time_of_day == TimeOfDay.EVENING:
            self.ambient_lux = 0.60
        elif self.time_of_day == TimeOfDay.NIGHT:
            self.ambient_lux = 0.18
            self.camera_visibility *= 0.40 # Heavy camera contrast drop at night

    def to_dict(self) -> Dict[str, Any]:
        return {
            "weather": self.weather.value,
            "road": self.road.value,
            "time_of_day": self.time_of_day.value,
            "surface_friction": round(self.surface_friction, 2),
            "lidar_attenuation": round(self.lidar_attenuation, 2),
            "camera_visibility": round(self.camera_visibility, 2),
            "ambient_lux": round(self.ambient_lux, 2),
            "waterlog_depth_cm": round(self.waterlog_depth_cm, 1)
        }

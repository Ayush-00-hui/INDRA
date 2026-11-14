"""
Visuals package for 'World Model: Learn, Imagine, Act'.
Provides retro-industrial laboratory graphics, procedural assets, lighting, particles, and defensive fallbacks.
"""

from visuals.theme import Colors, QualityLevel, get_font
from visuals.tween import Easing, Tween, Timer
from visuals.particles import ParticleManager
from visuals.lighting import LightingManager
from visuals.camera import CameraEffects
from visuals.assets import SpriteManager, SoundManager, create_procedural_sounds
from visuals.ui import draw_glass_panel, draw_badge, draw_progress_bar, Button, StarRatingCard
from visuals.renderer import RobotRenderer

__all__ = [
    "Colors",
    "QualityLevel",
    "get_font",
    "Easing",
    "Tween",
    "Timer",
    "ParticleManager",
    "LightingManager",
    "CameraEffects",
    "SpriteManager",
    "SoundManager",
    "create_procedural_sounds",
    "draw_glass_panel",
    "draw_badge",
    "draw_progress_bar",
    "Button",
    "StarRatingCard",
    "RobotRenderer",
]

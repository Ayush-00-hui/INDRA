"""
Theme, Color Palettes, and Quality Presets for Visual Engine.
"""

from enum import IntEnum
from typing import Tuple
import pygame


class QualityLevel(IntEnum):
    LOW = 1
    MED = 2
    HIGH = 3

    @classmethod
    def from_string(cls, name: str) -> "QualityLevel":
        s = str(name).strip().upper()
        if "LOW" in s:
            return cls.LOW
        elif "HIGH" in s:
            return cls.HIGH
        return cls.MED


class Theme:
    # -------------------------------------------------------------
    # Lab & Office Environment Palette
    # -------------------------------------------------------------
    BG_DARK = (16, 20, 28)
    LAB_FLOOR = (28, 34, 46)
    LAB_FLOOR_GRID = (36, 44, 58)
    FLOOR_TILE_LIGHT = (228, 232, 238)
    FLOOR_TILE_DARK = (215, 220, 228)
    FLOOR_GROUT = (195, 200, 210)
    WALL_OUTER = (22, 28, 38)
    WALL_INNER = (55, 68, 90)
    WALL_BASE = (32, 38, 52)
    WALL_TOP = (46, 56, 76)
    WALL_BORDER = (20, 24, 34)
    WALL_SHADOW = (10, 12, 18, 120)

    # Decorative Rugs & Markings
    RUG_BODY = (45, 75, 110)
    RUG_BORDER = (65, 105, 150)
    CAUTION_YELLOW = (245, 190, 40)
    CAUTION_BLACK = (30, 30, 35)

    # -------------------------------------------------------------
    # Entities Palette
    # -------------------------------------------------------------
    # Robot
    ROBOT_BODY = (220, 228, 240)
    ROBOT_BODY_SHADOW = (180, 190, 205)
    ROBOT_OUTLINE = (40, 50, 70)
    ROBOT_TREAD = (45, 52, 65)
    ROBOT_HEADLIGHT = (255, 250, 200)
    ROBOT_LIGHT_CONE = (255, 245, 180, 45)
    ROBOT_EYE = (0, 220, 255)
    ROBOT_CORE_GLOW = (0, 240, 255)
    ROBOT_COLLISION_RED = (255, 65, 65)
    
    # Robot LED Status
    LED_IDLE = (0, 180, 255)       # Cyan: Idle / Ready
    LED_THINKING = (0, 220, 255)   # Bright Cyan: Imagining futures
    LED_MOVING = (40, 230, 120)    # Green: Safe execution
    LED_BUMP = (255, 60, 60)       # Red: Collided

    # Goal Charging Pad
    GOAL_PAD_BASE = (30, 45, 40)
    GOAL_PAD_ACTIVE = (0, 240, 170)
    GOAL_PAD_RING = (40, 220, 140)
    GOAL_PAD_GLOW = (50, 255, 160)
    GOAL_PAD_CORE = (210, 255, 235)

    # Furniture / Obstacles
    CHAIR_CUSHION = (45, 50, 62)
    CHAIR_FRAME = (140, 150, 165)
    CHAIR_ARMREST = (30, 35, 45)
    CHAIR_BORDER = (25, 28, 36)
    CHAIR_BASE = (150, 160, 175)
    CHAIR_WHEELS = (30, 30, 35)
    DESK_WOOD = (165, 120, 85)
    DESK_BORDER = (115, 80, 50)
    DESK_TOP_PAD = (45, 50, 60)
    BOX_CARDBOARD = (195, 155, 105)
    BOX_TAPE = (220, 190, 140)
    PLANT_LEAF = (45, 155, 80)
    PLANT_LEAF_DARK = (30, 110, 55)
    PLANT_POT = (185, 95, 65)

    # Moving Person (Scenario 2)
    PERSON_BODY = (235, 100, 75)
    PERSON_COAT = (40, 80, 130)
    PERSON_HEAD = (245, 215, 185)
    PERSON_HAIR = (55, 40, 30)
    PERSON_SHADOW = (10, 15, 25, 110)

    # -------------------------------------------------------------
    # Imagination Mode Palette (Mind View - Key M)
    # -------------------------------------------------------------
    MIND_BG = (10, 16, 28)
    MIND_GRID = (25, 45, 75)
    MIND_OBSTACLE_WIRE = (0, 190, 255)
    MIND_OBSTACLE_FILL = (15, 30, 50, 180)
    PATH_CHOSEN = (0, 255, 160)       # Bright Neon Green
    PATH_CHOSEN_GLOW = (0, 255, 160, 90)
    PATH_CANDIDATE = (0, 180, 255, 140) # Neon Cyan
    PATH_BLOCKED = (255, 65, 75, 110)  # Neon Red/Pink
    GHOST_ROBOT = (0, 255, 200, 120)
    GHOST_BLOCKED = (255, 70, 70, 200)

    # -------------------------------------------------------------
    # UI / HUD Palette
    # -------------------------------------------------------------
    CYAN = (0, 215, 255)
    SUCCESS = (50, 240, 130)
    DANGER = (255, 75, 75)
    WARNING = (255, 195, 45)
    UI_PANEL_BG = (16, 22, 34, 215)
    UI_PANEL_BORDER = (55, 75, 105)
    UI_ACCENT_CYAN = (0, 215, 255)
    UI_ACCENT_GREEN = (50, 240, 130)
    UI_ACCENT_RED = (255, 80, 80)
    UI_ACCENT_GOLD = (255, 205, 50)
    UI_TEXT_PRIMARY = (250, 252, 255)
    UI_TEXT_MUTED = (160, 175, 195)
    UI_TOOLTIP_BG = (10, 14, 22, 240)


# Backward-compatible alias
Colors = Theme


def get_font(size: int = 14, bold: bool = False) -> pygame.font.Font:
    """Retrieve robust system font with graceful fallbacks."""
    if not pygame.font.get_init():
        pygame.font.init()
    family = "Segoe UI, Arial, Helvetica, DejaVu Sans, sans-serif"
    try:
        f = pygame.font.SysFont(family, size, bold=bold)
        if f is not None:
            return f
    except Exception:
        pass
    return pygame.font.Font(None, size)

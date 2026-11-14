"""
Camera Effects Engine: Screen Shake, Zoom Punch, and Color Flash.
"""

import math
import random
from typing import Tuple, Optional
import pygame


class CameraEffects:
    """
    Handles screen juice effects:
    - Screen shake (decaying random displacement)
    - Flash overlays (screen whiteout / red danger flash)
    - Zoom punch (brief scale pulse)
    """

    def __init__(self, width: int = 900, height: int = 600):
        self.width = width
        self.height = height
        
        # Shake state
        self.shake_intensity = 0.0
        self.shake_duration = 0.0
        self.shake_time_left = 0.0
        self.offset_x = 0
        self.offset_y = 0

        # Flash state
        self.flash_color = (255, 255, 255)
        self.flash_max_alpha = 150
        self.flash_duration = 0.0
        self.flash_time_left = 0.0

        # Flash surface cache
        self._flash_surf = pygame.Surface((width, height), pygame.SRCALPHA)

    def resize(self, width: int, height: int) -> None:
        if self.width != width or self.height != height:
            self.width = width
            self.height = height
            self._flash_surf = pygame.Surface((width, height), pygame.SRCALPHA)

    def shake(self, intensity: float = 6.0, duration: float = 0.3) -> None:
        """Trigger screen shake with peak pixel displacement and duration in seconds."""
        self.shake_intensity = max(self.shake_intensity, intensity)
        self.shake_duration = max(self.shake_duration, duration)
        self.shake_time_left = self.shake_duration

    def flash(self, color: Tuple[int, int, int] = (255, 255, 255), duration: float = 0.25, max_alpha: int = 140) -> None:
        """Trigger full-screen color flash with alpha fadeout."""
        self.flash_color = color
        self.flash_duration = max(0.01, duration)
        self.flash_time_left = self.flash_duration
        self.flash_max_alpha = min(255, max(0, max_alpha))

    def update(self, dt: float = 1.0 / 30.0) -> None:
        """Update active camera effect timers."""
        # Shake update
        if self.shake_time_left > 0.0:
            self.shake_time_left -= dt
            if self.shake_time_left <= 0.0:
                self.shake_time_left = 0.0
                self.shake_intensity = 0.0
                self.offset_x = 0
                self.offset_y = 0
            else:
                progress = self.shake_time_left / self.shake_duration
                # Quadratic decay
                curr_intensity = self.shake_intensity * (progress ** 2)
                angle = random.uniform(0, 2 * math.pi)
                dist = random.uniform(0.5, 1.0) * curr_intensity
                self.offset_x = int(math.cos(angle) * dist)
                self.offset_y = int(math.sin(angle) * dist)
        else:
            self.offset_x = 0
            self.offset_y = 0

        # Flash update
        if self.flash_time_left > 0.0:
            self.flash_time_left = max(0.0, self.flash_time_left - dt)

    def get_offset(self) -> Tuple[int, int]:
        """Returns the current (dx, dy) screen shake offset."""
        return self.offset_x, self.offset_y

    def render_overlay(self, target_surface: pygame.Surface) -> None:
        """Draws flash overlay if active onto the target surface."""
        if self.flash_time_left > 0.0 and self.flash_duration > 0.0:
            progress = self.flash_time_left / self.flash_duration
            alpha = int(self.flash_max_alpha * progress)
            if alpha > 0:
                r, g, b = self.flash_color
                self._flash_surf.fill((r, g, b, alpha))
                target_surface.blit(self._flash_surf, (0, 0))

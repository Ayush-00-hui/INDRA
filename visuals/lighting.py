"""
Lighting Engine, Radial Light Maps, Headlight Cones, and Vignette.
Pre-renders all lighting gradients once at initialization for maximum CPU efficiency.
"""

import math
from typing import Dict, Tuple, Optional
import numpy as np
import pygame
from visuals.theme import QualityLevel


class LightingEngine:
    def __init__(self, width: int = 900, height: int = 600, quality: QualityLevel = QualityLevel.HIGH):
        self.width = width
        self.height = height
        self.quality = quality

        # Cached light textures
        self._light_cache: Dict[Tuple[int, Tuple[int, int, int]], pygame.Surface] = {}
        self._cone_cache: Dict[int, pygame.Surface] = {}

        # Pre-build standard light maps
        self.surf_robot_glow = self._build_radial_light(radius=80, color=(160, 220, 255), inner_alpha=90)
        self.surf_goal_glow = self._build_radial_light(radius=100, color=(50, 255, 160), inner_alpha=110)
        self.surf_headlight_cone = self._build_headlight_cone(length=120, spread_angle=math.radians(45))
        self.surf_vignette = self._build_vignette_mask(width, height)

    def set_quality(self, quality: QualityLevel) -> None:
        self.quality = quality

    def _build_radial_light(self, radius: int, color: Tuple[int, int, int], inner_alpha: int = 120) -> pygame.Surface:
        """Procedurally pre-render a smooth radial light map with quadratic falloff."""
        size = radius * 2
        surf = pygame.Surface((size, size), pygame.SRCALPHA)
        cr, cg, cb = color

        y, x = np.ogrid[:size, :size]
        dist_from_center = np.sqrt((x - radius) ** 2 + (y - radius) ** 2)
        norm_dist = np.clip(dist_from_center / radius, 0.0, 1.0)

        # Quadratic falloff for smooth soft illumination
        alpha_arr = (inner_alpha * (1.0 - norm_dist) ** 2).astype(np.uint8)
        alpha_arr[norm_dist >= 1.0] = 0

        # Premultiply RGB by alpha fraction so additive blending (BLEND_ADD)
        # adds zero color outside the circle, eliminating solid rectangle artifacts
        factor = alpha_arr.astype(np.float32) / 255.0
        rgb_arr = np.zeros((size, size, 3), dtype=np.uint8)
        rgb_arr[..., 0] = (cr * factor).astype(np.uint8)
        rgb_arr[..., 1] = (cg * factor).astype(np.uint8)
        rgb_arr[..., 2] = (cb * factor).astype(np.uint8)

        surf_pixels = pygame.surfarray.pixels3d(surf)
        surf_alpha = pygame.surfarray.pixels_alpha(surf)
        surf_pixels[...] = rgb_arr
        surf_alpha[...] = alpha_arr
        del surf_pixels, surf_alpha

        try:
            return surf.convert_alpha()
        except pygame.error:
            return surf

    def _build_headlight_cone(self, length: int, spread_angle: float) -> pygame.Surface:
        """Pre-render a forward-facing headlight beam cone."""
        w = length
        h = int(length * math.tan(spread_angle / 2.0) * 2.0) + 10
        surf = pygame.Surface((w, h), pygame.SRCALPHA)
        center_y = h / 2.0

        for col in range(w):
            prog = col / float(w)
            alpha = int(75 * (1.0 - prog * 0.8))
            half_spread = (col * math.tan(spread_angle / 2.0))
            y1 = int(center_y - half_spread)
            y2 = int(center_y + half_spread)
            if y2 > y1 and alpha > 0:
                factor = alpha / 255.0
                r_c = int(255 * factor)
                g_c = int(250 * factor)
                b_c = int(210 * factor)
                pygame.draw.line(surf, (r_c, g_c, b_c, alpha), (col, y1), (col, y2), 1)

        try:
            return surf.convert_alpha()
        except pygame.error:
            return surf

    def _build_vignette_mask(self, width: int, height: int) -> pygame.Surface:
        """Pre-render cinematic vignette dark corner shading."""
        surf = pygame.Surface((width, height), pygame.SRCALPHA)
        cx, cy = width / 2.0, height / 2.0
        max_dist = math.hypot(cx, cy)

        # Sample low-res 2D array then scale up for speed
        low_w, low_h = 160, 100
        x, y = np.ogrid[:low_w, :low_h]
        dist = np.sqrt(((x - low_w / 2.0) * (width / low_w)) ** 2 + ((y - low_h / 2.0) * (height / low_h)) ** 2)
        norm = np.clip((dist - 280.0) / (max_dist - 280.0), 0.0, 1.0)
        alpha = (norm ** 2.2 * 140).astype(np.uint8)

        low_surf = pygame.Surface((low_w, low_h), pygame.SRCALPHA)
        pix_alpha = pygame.surfarray.pixels_alpha(low_surf)
        pix_alpha[...] = alpha
        del pix_alpha

        scaled = pygame.transform.smoothscale(low_surf, (width, height))
        try:
            return scaled.convert_alpha()
        except pygame.error:
            return scaled

    def draw_entity_lights(
        self,
        surface: pygame.Surface,
        robot_pos: Tuple[float, float],
        robot_angle: float,
        goal_pos: Tuple[float, float],
        is_mind_view: bool = False
    ) -> None:
        """Draw entity glow and headlights onto surface using fast additive blending."""
        if self.quality == QualityLevel.LOW:
            return  # Skip lighting on Low Quality for instant 60 FPS on weak CPUs

        # 1. Goal Pad Glow (Energetic pulse)
        gx, gy = int(goal_pos[0]), int(goal_pos[1])
        gw_half = self.surf_goal_glow.get_width() // 2
        surface.blit(
            self.surf_goal_glow,
            (gx - gw_half, gy - gw_half),
            special_flags=pygame.BLEND_ADD
        )

        # 2. Robot Ambient Radial Light
        rx, ry = int(robot_pos[0]), int(robot_pos[1])
        rw_half = self.surf_robot_glow.get_width() // 2
        surface.blit(
            self.surf_robot_glow,
            (rx - rw_half, ry - rw_half),
            special_flags=pygame.BLEND_ADD
        )

        # 3. Directional Headlight Cone (High Quality only)
        if self.quality == QualityLevel.HIGH and not is_mind_view:
            deg = math.degrees(robot_angle)
            rotated_cone = pygame.transform.rotate(self.surf_headlight_cone, -deg)
            cw, ch = rotated_cone.get_size()
            surface.blit(
                rotated_cone,
                (rx - cw // 2 + int(math.cos(robot_angle) * 30),
                 ry - ch // 2 + int(math.sin(robot_angle) * 30)),
                special_flags=pygame.BLEND_ADD
            )

        # 4. Vignette (High Quality only)
        if self.quality == QualityLevel.HIGH:
            surface.blit(self.surf_vignette, (0, 0))

    def render(
        self,
        surface: pygame.Surface,
        lights: Optional[list] = None,
        ambient_darkness: int = 30,
        **kwargs
    ) -> None:
        """Draws lights from a list of dicts [{'pos': (x,y), 'radius': r, 'color': c, 'intensity': i}]"""
        if self.quality == QualityLevel.LOW:
            return

        if lights:
            for light in lights:
                pos = light.get("pos", (0, 0))
                r = light.get("radius", 100)
                color = light.get("color", (200, 240, 255))
                intensity = light.get("intensity", 0.8)
                rad_surf = self._build_radial_light(int(r), color[:3], int(110 * intensity))
                rx = int(pos[0] - r)
                ry = int(pos[1] - r)
                surface.blit(rad_surf, (rx, ry), special_flags=pygame.BLEND_ADD)

        if self.quality == QualityLevel.HIGH and ambient_darkness > 0:
            surface.blit(self.surf_vignette, (0, 0))


# Backward-compatible alias
LightingManager = LightingEngine

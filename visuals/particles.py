"""
High-Performance Object-Pooled Particle System.
Avoids per-frame allocations to maintain 60 FPS on CPU-bound hardware.
"""

import math
import random
from typing import List, Tuple, Optional
import pygame
from visuals.theme import QualityLevel


class Particle:
    __slots__ = (
        "active", "x", "y", "vx", "vy", "gravity", "drag",
        "life", "max_life", "size", "end_size",
        "color", "fade_alpha", "kind", "rot", "rot_speed"
    )

    def __init__(self):
        self.active = False
        self.x = 0.0
        self.y = 0.0
        self.vx = 0.0
        self.vy = 0.0
        self.gravity = 0.0
        self.drag = 0.98
        self.life = 0.0
        self.max_life = 1.0
        self.size = 2.0
        self.end_size = 0.0
        self.color = (255, 255, 255)
        self.fade_alpha = True
        self.kind = "spark"
        self.rot = 0.0
        self.rot_speed = 0.0


class ParticleSystem:
    """Fixed-capacity object-pooled particle manager."""

    MAX_PARTICLES = 800

    def __init__(self, quality: QualityLevel = QualityLevel.HIGH, max_particles: int = 800):
        self.quality = quality
        self.max_particles = max_particles
        self.pool: List[Particle] = [Particle() for _ in range(self.max_particles)]
        # Pre-create small shared surface for alpha particle drawing
        self._alpha_surf = pygame.Surface((32, 32), pygame.SRCALPHA)

    @property
    def active_count(self) -> int:
        return sum(1 for p in self.pool if p.active)

    def set_quality(self, quality: QualityLevel) -> None:
        self.quality = quality

    def _get_free_particle(self) -> Optional[Particle]:
        for p in self.pool:
            if not p.active:
                return p
        return None

    def emit_sparks(self, x: float, y: float, count: int = 25) -> None:
        if self.quality == QualityLevel.LOW:
            count = min(count, 6)
        elif self.quality == QualityLevel.MED:
            count = min(count, 14)
        elif self.quality == QualityLevel.HIGH:
            count = min(count, 28)
        else:  # ULTRA
            count = max(count, 45)

        colors = [(255, 220, 80), (255, 120, 40), (255, 60, 40), (255, 255, 220)]
        for _ in range(count):
            p = self._get_free_particle()
            if not p: break
            p.active = True
            p.x = x
            p.y = y
            angle = random.uniform(0.0, 2.0 * math.pi)
            speed = random.uniform(80.0, 260.0)
            p.vx = math.cos(angle) * speed
            p.vy = math.sin(angle) * speed
            p.gravity = 80.0
            p.drag = 0.92
            p.life = random.uniform(0.25, 0.55)
            p.max_life = p.life
            p.size = random.uniform(2.5, 4.5)
            p.end_size = 0.5
            p.color = random.choice(colors)
            p.fade_alpha = True
            p.kind = "spark"

    def emit_dust(self, x: float, y: float, count: int = 3, color=(200, 205, 215)) -> None:
        if self.quality == QualityLevel.LOW:
            return  # Skip dust in low quality for max CPU performance
        elif self.quality == QualityLevel.MED:
            count = min(count, 2)

        for _ in range(count):
            p = self._get_free_particle()
            if not p: break
            p.active = True
            p.x = x + random.uniform(-4, 4)
            p.y = y + random.uniform(-4, 4)
            angle = random.uniform(0.0, 2.0 * math.pi)
            speed = random.uniform(5.0, 25.0)
            p.vx = math.cos(angle) * speed
            p.vy = math.sin(angle) * speed
            p.gravity = -5.0
            p.drag = 0.88
            p.life = random.uniform(0.3, 0.7)
            p.max_life = p.life
            p.size = random.uniform(2.0, 5.0)
            p.end_size = random.uniform(6.0, 9.0)
            p.color = color
            p.fade_alpha = True
            p.kind = "dust"

    def emit_confetti(self, x: float, y: float, count: int = 50) -> None:
        if self.quality == QualityLevel.LOW:
            count = min(count, 15)
        elif self.quality == QualityLevel.MED:
            count = min(count, 30)
        elif self.quality == QualityLevel.HIGH:
            count = min(count, 55)
        else:  # ULTRA
            count = max(count, 80)

        confetti_colors = [
            (255, 60, 100), (40, 220, 140), (0, 180, 255),
            (255, 220, 50), (180, 80, 240), (255, 140, 30)
        ]
        for _ in range(count):
            p = self._get_free_particle()
            if not p: break
            p.active = True
            p.x = x + random.uniform(-20, 20)
            p.y = y + random.uniform(-10, 10)
            angle = random.uniform(-math.pi * 0.9, -math.pi * 0.1)
            speed = random.uniform(120.0, 320.0)
            p.vx = math.cos(angle) * speed
            p.vy = math.sin(angle) * speed
            p.gravity = 180.0
            p.drag = 0.96
            p.life = random.uniform(1.0, 2.2)
            p.max_life = p.life
            p.size = random.uniform(3.0, 6.0)
            p.end_size = p.size
            p.color = random.choice(confetti_colors)
            p.fade_alpha = True
            p.kind = "confetti"
            p.rot = random.uniform(0.0, 360.0)
            p.rot_speed = random.uniform(-300.0, 300.0)

    def emit_glow(self, x: float, y: float, count: int = 2, color=(0, 220, 255)) -> None:
        if self.quality == QualityLevel.LOW:
            return
        for _ in range(count):
            p = self._get_free_particle()
            if not p: break
            p.active = True
            p.x = x + random.uniform(-8, 8)
            p.y = y + random.uniform(-8, 8)
            p.vx = random.uniform(-10, 10)
            p.vy = random.uniform(-20, -5)
            p.gravity = -10.0
            p.drag = 0.94
            p.life = random.uniform(0.4, 0.9)
            p.max_life = p.life
            p.size = random.uniform(2.0, 4.0)
            p.end_size = 0.5
            p.color = color
            p.fade_alpha = True
            p.kind = "glow"

    def clear(self) -> None:
        for p in self.pool:
            p.active = False

    def update(self, dt: float) -> None:
        dt = min(0.05, max(0.001, dt))
        for p in self.pool:
            if not p.active:
                continue

            p.life -= dt
            if p.life <= 0.0:
                p.active = False
                continue

            p.vx *= math.pow(p.drag, dt * 60.0)
            p.vy *= math.pow(p.drag, dt * 60.0)
            p.vy += p.gravity * dt
            p.x += p.vx * dt
            p.y += p.vy * dt
            p.rot += p.rot_speed * dt

    def draw(self, surface: pygame.Surface) -> None:
        for p in self.pool:
            if not p.active:
                continue

            progress = 1.0 - (p.life / p.max_life)
            curr_size = max(1.0, p.size + (p.end_size - p.size) * progress)
            alpha = int(255 * (1.0 - progress)) if p.fade_alpha else 255

            if p.kind == "confetti":
                # Rotated rectangle
                half = curr_size
                rect = pygame.Rect(int(p.x - half), int(p.y - half), int(curr_size * 1.5), int(curr_size))
                if alpha >= 240 or self.quality == QualityLevel.LOW:
                    pygame.draw.rect(surface, p.color, rect)
                else:
                    self._alpha_surf.fill((0, 0, 0, 0))
                    c_rgba = (*p.color, alpha)
                    pygame.draw.rect(self._alpha_surf, c_rgba, pygame.Rect(0, 0, int(curr_size * 1.5), int(curr_size)))
                    surface.blit(self._alpha_surf, (int(p.x - half), int(p.y - half)))

            elif p.kind == "dust":
                if self.quality == QualityLevel.HIGH:
                    # Soft circle on alpha surface
                    s_rad = int(curr_size)
                    box_sz = s_rad * 2 + 4
                    if box_sz <= 32:
                        self._alpha_surf.fill((0, 0, 0, 0))
                        pygame.draw.circle(self._alpha_surf, (*p.color, max(0, min(140, alpha // 2))), (box_sz // 2, box_sz // 2), s_rad)
                        surface.blit(self._alpha_surf, (int(p.x - box_sz // 2), int(p.y - box_sz // 2)))
                else:
                    pygame.draw.circle(surface, p.color, (int(p.x), int(p.y)), max(1, int(curr_size)))

            else:
                # Sparks & Glow
                radius = int(curr_size)
                if radius <= 1:
                    surface.set_at((int(p.x), int(p.y)), p.color)
                else:
                    pygame.draw.circle(surface, p.color, (int(p.x), int(p.y)), radius)

    render = draw


# Backward-compatible alias
ParticleManager = ParticleSystem

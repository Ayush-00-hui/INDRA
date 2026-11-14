# Visual Engine Integration Guide (for Gurudutt & Driving Scenario)

This document provides a clean, copy-paste guide for integrating the shared `visuals/` engine into `envs/driving_env.py` and `scripts/*_driving.py` without modifying the core simulation logic.

---

## 1. Architecture Overview

The `visuals/` package provides reusable, zero-allocation graphical and audio components designed to maintain 60 FPS on laptop CPUs:

| Module | Purpose | Reusable for Driving |
| :--- | :--- | :--- |
| `visuals/theme.py` | Unified color palette, quality presets, fonts | Road asphalt, vehicle paints, lane markers |
| `visuals/tween.py` | Smooth easing curves & animation timers | Steering smoothing, camera zoom punch |
| `visuals/particles.py` | Object-pooled particle system (350 slots) | Tire drift smoke, crash sparks, exhaust motes |
| `visuals/lighting.py` | Radial light maps & directional headlight cones | Car dual headlights, brake tail-lights |
| `visuals/camera.py` | Screen shake, flash overlays, zoom punch | Impact collision shudder, speed lines |
| `visuals/assets.py` | Procedural sprite generators & sound synthesizer | Tire squeal, engine hum, horn, collision |
| `visuals/ui.py` | Glassmorphism HUD, animated buttons, badges | Speedometer, gear indicator, star cards |

---

## 2. Copy-Paste Driving Car Renderer Snippet

Add this method to `envs/driving_env.py` to render vehicles with dual headlights and tire smoke:

```python
import math
import pygame
from visuals.theme import Colors, QualityLevel, get_font
from visuals.particles import ParticleManager
from visuals.lighting import LightingManager
from visuals.camera import CameraEffects
from visuals.ui import draw_glass_panel, draw_badge

class DrivingRenderer:
    def __init__(self, width: int = 900, height: int = 600):
        self.width = width
        self.height = height
        self.particles = ParticleManager(max_particles=350)
        self.lighting = LightingManager(width=width, height=height)
        self.camera = CameraEffects(width=width, height=height)

    def render(self, env, screen: pygame.Surface, plan_info=None):
        # 1. Dark Asphalt Road
        screen.fill((25, 28, 35))
        # Draw dashed white lane dividers
        for y in range(0, self.height, 40):
            pygame.draw.line(screen, (220, 225, 235), (self.width // 2, y), (self.width // 2, y + 22), 3)

        # 2. Car Tire Drift Smoke on sharp turns
        if abs(getattr(env, "steering", 0.0)) > 0.5:
            self.particles.emit_dust(env.car_x, env.car_y, count=2, color=(180, 185, 195))
        self.particles.update(1.0 / 30.0)
        self.particles.render(screen)

        # 3. Dual Vehicle Headlights
        rad_angle = math.radians(getattr(env, "heading_deg", 0.0))
        cone = self.lighting.surf_headlight_cone
        rotated_cone = pygame.transform.rotate(cone, -math.degrees(rad_angle))
        cw, ch = rotated_cone.get_size()
        screen.blit(rotated_cone, (int(env.car_x - cw // 2), int(env.car_y - ch // 2)), special_flags=pygame.BLEND_ADD)

        # 4. Car Body
        car_rect = pygame.Rect(int(env.car_x - 15), int(env.car_y - 28), 30, 56)
        pygame.draw.rect(screen, (220, 45, 45), car_rect, border_radius=6)
        pygame.draw.rect(screen, (255, 255, 255), car_rect, 2, border_radius=6)

        # 5. Speedometer HUD
        draw_glass_panel(screen, pygame.Rect(16, 16, 220, 60), bg_color=(15, 20, 30), alpha=220)
        spd_text = get_font(18, bold=True).render(f"Speed: {getattr(env, 'speed', 0.0):.1f} px/s", True, Colors.CYAN)
        screen.blit(spd_text, (28, 28))
```

---

## 3. Defensive Fallback Pattern

Wrap rendering calls in `try...except` inside `DrivingEnv.render(screen)`:

```python
def render(self, screen: pygame.Surface) -> None:
    if getattr(self, "use_modern_renderer", True):
        if getattr(self, "_modern_renderer", None) is None:
            try:
                self._modern_renderer = DrivingRenderer(width=self.WIDTH, height=self.HEIGHT)
            except Exception:
                self.use_modern_renderer = False

        if self._modern_renderer is not None:
            try:
                self._modern_renderer.render(env=self, screen=screen)
                return
            except Exception:
                self.use_modern_renderer = False

    # Fallback to simple classic pygame rect drawing
    self._render_classic(screen)
```

This guarantees that visual errors will never crash the demo during the NBA presentation.

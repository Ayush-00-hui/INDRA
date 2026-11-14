"""
Unified Visual Renderer: Multi-Layer Video Game Aesthetic for Robotics Environment.

Features:
- Pre-rendered static laboratory floor and ambient occlusion walls (zero per-frame allocation).
- Animated service robot with directional heading, tread trails, and glowing core LED.
- Physical-hitbox-accurate procedural sprites: Executive Office Chair, Laboratory Workstations, Cargo Crates.
- Scenario 2: 4-frame top-down human walking cycle.
- Holographic Mind View (M key): Future ghost robots, candidate rollout chevrons, reasoning thought bubble.
- Juice: Collision sparks, screen shake, "BONK" sound, goal fanfare, victory confetti.
- Robust Double Fallback: CLI --classic support and per-frame try/except session fallback to classic renderer.
- Quality Throttling: Dynamic auto-downgrade (LOW/MED/HIGH) to sustain 30+ FPS on CPU.
"""

import math
import logging
from typing import Optional, Dict, Any, Tuple, List
import numpy as np
import pygame

from visuals.theme import Colors, QualityLevel, get_font
from visuals.assets import SpriteManager, SoundManager
from visuals.particles import ParticleManager
from visuals.lighting import LightingManager
from visuals.camera import CameraEffects
from visuals.ui import draw_glass_panel, draw_badge, draw_progress_bar

logger = logging.getLogger("VisualRenderer")


class RobotRenderer:
    """
    Production-grade graphical renderer for RobotEnv.
    """

    def __init__(
        self,
        width: int = 900,
        height: int = 600,
        quality: QualityLevel = QualityLevel.HIGH,
        classic_mode: bool = False
    ):
        self.width = width
        self.height = height
        self.quality = quality
        self.classic_mode = classic_mode
        self.fallback_active = False
        self.fallback_reason = ""

        # Hitbox debug overlay toggle (F3)
        self.show_hitboxes = False

        # Mind View toggle (M)
        self.show_mind_view = False

        # Subsystems
        self.sprites = SpriteManager()
        self.sounds = SoundManager()
        self.particles = ParticleManager(max_particles=350)
        self.lighting = LightingManager(width=width, height=height)
        self.camera = CameraEffects(width=width, height=height)

        # Performance monitoring for dynamic auto-downgrade
        self.low_fps_counter = 0

        # Sub-step position interpolation & animation state
        self.last_robot_pos = (100.0, 300.0)
        self.display_robot_x = 100.0
        self.display_robot_y = 300.0
        self.anim_frame = 0
        self.walk_frame_person = 0
        self.person_step_timer = 0

        # Collision & Goal Juice State
        self.bonk_timer = 0
        self.bonk_pos = (0.0, 0.0)
        self.victory_timer = 0
        self.victory_spin_angle = 0

        # Cached Static Background Surface
        self._bg_surface: Optional[pygame.Surface] = None
        self._build_static_background()

        # Tread marks fading surface
        self._treads_surface = pygame.Surface((width, height), pygame.SRCALPHA)
        self._treads_step_counter = 0

        # UI fonts
        self.font_title = get_font(18, bold=True)
        self.font_body = get_font(13)
        self.font_bold = get_font(13, bold=True)
        self.font_bubble = get_font(12, bold=True)

    def _build_static_background(self) -> None:
        """
        Pre-renders the entire static floor, walls, and ambient occlusion into a single cached surface.
        Blitted once per frame in <0.5 ms.
        """
        self._bg_surface = pygame.Surface((self.width, self.height))
        self._bg_surface.fill(Colors.LAB_FLOOR)

        # 1. Subtle laboratory grid tiles (60x60 pixels)
        tile_size = 60
        for x in range(0, self.width, tile_size):
            pygame.draw.line(self._bg_surface, Colors.LAB_FLOOR_GRID, (x, 0), (x, self.height), 1)
        for y in range(0, self.height, tile_size):
            pygame.draw.line(self._bg_surface, Colors.LAB_FLOOR_GRID, (0, y), (self.width, y), 1)

        # 2. Outer room walls (slate border with drop shadow)
        wall_thick = 8
        pygame.draw.rect(self._bg_surface, Colors.WALL_OUTER, (0, 0, self.width, self.height), wall_thick)
        pygame.draw.rect(self._bg_surface, Colors.WALL_INNER, (wall_thick, wall_thick, self.width - wall_thick * 2, self.height - wall_thick * 2), 2)

        # 3. Ambient occlusion shadow near walls
        ao_surf = pygame.Surface((self.width, self.height), pygame.SRCALPHA)
        pygame.draw.rect(ao_surf, (0, 0, 0, 90), (wall_thick, wall_thick, self.width - wall_thick * 2, self.height - wall_thick * 2), 16)
        pygame.draw.rect(ao_surf, (0, 0, 0, 50), (wall_thick + 16, wall_thick + 16, self.width - (wall_thick + 16) * 2, self.height - (wall_thick + 16) * 2), 12)
        self._bg_surface.blit(ao_surf, (0, 0))

        # 4. Corner floor hazard stripes for tech lab vibe
        stripe_size = 45
        for sx in [wall_thick + 4, self.width - wall_thick - stripe_size - 4]:
            for sy in [wall_thick + 4, self.height - wall_thick - stripe_size - 4]:
                s_rect = pygame.Rect(sx, sy, stripe_size, stripe_size)
                pygame.draw.rect(self._bg_surface, (36, 44, 58), s_rect, border_radius=3)
                for i in range(-stripe_size, stripe_size * 2, 10):
                    pygame.draw.line(self._bg_surface, (50, 62, 80), (sx + i, sy), (sx + i + 10, sy + stripe_size), 3)

    def trigger_collision_effects(self, pos: Tuple[float, float]) -> None:
        """Triggers audio bonk, spark burst, screen shake, and floating text on physical collision."""
        self.sounds.play("bonk")
        self.camera.shake(intensity=6.0, duration=0.25)
        self.camera.flash(color=(255, 60, 60), duration=0.15, max_alpha=120)
        self.particles.emit_sparks(pos[0], pos[1], count=22 if self.quality != QualityLevel.LOW else 10)
        self.bonk_timer = 24
        self.bonk_pos = pos

    def trigger_goal_effects(self, pos: Tuple[float, float]) -> None:
        """Triggers celebratory arpeggio, screen flash, and confetti burst on reaching goal."""
        self.sounds.play("goal")
        self.camera.flash(color=(60, 255, 180), duration=0.3, max_alpha=150)
        self.particles.emit_confetti(pos[0], pos[1], count=40 if self.quality != QualityLevel.LOW else 15)
        self.victory_timer = 45

    def update(self, dt: float = 1.0 / 30.0, current_fps: float = 30.0) -> None:
        """Updates internal animation counters, camera, and particle timers."""
        self.anim_frame += 1
        self.camera.update(dt)
        self.particles.update(dt)

        # Decay juice timers
        if self.bonk_timer > 0:
            self.bonk_timer -= 1
        if self.victory_timer > 0:
            self.victory_timer -= 1
            self.victory_spin_angle = (self.victory_spin_angle + 16) % 360
        else:
            self.victory_spin_angle = 0

        # Person walk cycle timer (changes frame every 6 ticks)
        self.person_step_timer += 1
        if self.person_step_timer >= 6:
            self.person_step_timer = 0
            self.walk_frame_person = (self.walk_frame_person + 1) % 4

        # Gradually fade tread marks
        if self._treads_step_counter % 12 == 0 and self.quality != QualityLevel.LOW:
            fade_surf = pygame.Surface((self.width, self.height), pygame.SRCALPHA)
            fade_surf.fill((0, 0, 0, 4))
            self._treads_surface.blit(fade_surf, (0, 0), special_flags=pygame.BLEND_RGBA_SUB)
        self._treads_step_counter += 1

        # Dynamic Auto-Downgrade if FPS < 24 for 2 seconds (60 frames)
        if current_fps < 24.0 and self.quality != QualityLevel.LOW:
            self.low_fps_counter += 1
            if self.low_fps_counter >= 60:
                if self.quality == QualityLevel.HIGH:
                    self.quality = QualityLevel.MED
                    logger.info("Auto-downgraded visuals to MED quality due to low FPS.")
                elif self.quality == QualityLevel.MED:
                    self.quality = QualityLevel.LOW
                    logger.info("Auto-downgraded visuals to LOW quality due to low FPS.")
                self.low_fps_counter = 0
        else:
            self.low_fps_counter = max(0, self.low_fps_counter - 1)

    def render(
        self,
        env: Any,
        target_surface: pygame.Surface,
        plan_info: Optional[Dict[str, Any]] = None,
        last_info: Optional[Dict[str, Any]] = None,
        method_title: str = "WITH WORLD MODEL",
        fps: float = 30.0
    ) -> None:
        """
        Orchestrates rendering with defensive fallback.
        """
        if self.classic_mode or self.fallback_active:
            self.render_classic(env, target_surface, plan_info, method_title)
            return

        try:
            self._render_modern(env, target_surface, plan_info, last_info, method_title, fps)
        except Exception as e:
            logger.error(f"Visual renderer exception (switching to classic fallback): {e}", exc_info=True)
            self.fallback_active = True
            self.fallback_reason = str(e)
            self.render_classic(env, target_surface, plan_info, method_title)

    def _render_modern(
        self,
        env: Any,
        surface: pygame.Surface,
        plan_info: Optional[Dict[str, Any]],
        last_info: Optional[Dict[str, Any]],
        method_title: str,
        fps: float
    ) -> None:
        """
        Modern video game aesthetic rendering implementation.
        """
        self.update(dt=1.0 / max(10.0, fps), current_fps=fps)

        # Check collision or goal events
        if last_info:
            if last_info.get("collision", False):
                self.trigger_collision_effects((env.robot_x, env.robot_y))
            elif last_info.get("reached_goal", False):
                self.trigger_goal_effects((env.goal_x, env.goal_y))

        # -------------------------------------------------------------
        # LAYER 0: PRE-RENDERED STATIC BACKGROUND
        # -------------------------------------------------------------
        if self._bg_surface is not None:
            surface.blit(self._bg_surface, (0, 0))

        # -------------------------------------------------------------
        # LAYER 0.5: AMBIENT DECORATIONS (Zero hitbox impact)
        # -------------------------------------------------------------
        # Subtle tech carpet in center
        rug_rect = pygame.Rect(self.width // 2 - 90, self.height // 2 - 60, 180, 120)
        pygame.draw.rect(surface, (32, 42, 58), rug_rect, border_radius=6)
        pygame.draw.rect(surface, (45, 60, 84), rug_rect, 2, border_radius=6)

        # Decorative potted plants in boundary corners
        plant_sprite = self.sprites.get_plant_sprite(size=26)
        surface.blit(plant_sprite, (14, 14))
        surface.blit(plant_sprite, (self.width - 40, 14))
        surface.blit(plant_sprite, (14, self.height - 40))
        surface.blit(plant_sprite, (self.width - 40, self.height - 40))

        # -------------------------------------------------------------
        # LAYER 1: FLOOR TREAD TRAILS
        # -------------------------------------------------------------
        if self.quality != QualityLevel.LOW:
            # Emit subtle dust mote on movement
            curr_pos = (env.robot_x, env.robot_y)
            dx = curr_pos[0] - self.last_robot_pos[0]
            dy = curr_pos[1] - self.last_robot_pos[1]
            if abs(dx) > 1.0 or abs(dy) > 1.0:
                self.sounds.play("move")
                # Draw small tread imprint onto permanent buffer
                pygame.draw.circle(self._treads_surface, (20, 26, 36, 60), (int(curr_pos[0]), int(curr_pos[1])), 4)
                self.particles.emit_dust(curr_pos[0], curr_pos[1], count=1)
                self.last_robot_pos = curr_pos

            surface.blit(self._treads_surface, (0, 0))

        # -------------------------------------------------------------
        # LAYER 2: SHADOWS (Drawn outside / offset from physical bodies)
        # -------------------------------------------------------------
        shadow_offset = (4, 6)
        # Goal shadow
        pygame.draw.circle(surface, (0, 0, 0, 75), (int(env.goal_x + shadow_offset[0]), int(env.goal_y + shadow_offset[1])), int(env.GOAL_RADIUS))
        # Obstacle shadows
        for obs in env.obstacles:
            s_rect = pygame.Rect(int(obs.x + shadow_offset[0]), int(obs.y + shadow_offset[1]), int(obs.width), int(obs.height))
            pygame.draw.rect(surface, (0, 0, 0, 70), s_rect, border_radius=6)
        # Robot shadow
        pygame.draw.circle(surface, (0, 0, 0, 80), (int(env.robot_x + shadow_offset[0]), int(env.robot_y + shadow_offset[1])), int(env.ROBOT_RADIUS))

        # -------------------------------------------------------------
        # LAYER 3: OBSTACLES (Rendered STRICTLY inside true physical hitboxes)
        # -------------------------------------------------------------
        for obs in env.obstacles:
            r = pygame.Rect(int(obs.x), int(obs.y), int(obs.width), int(obs.height))
            if obs.kind == "chair":
                chair_sprite = self.sprites.get_chair_sprite()
                if chair_sprite.get_size() != (r.width, r.height):
                    chair_sprite = pygame.transform.scale(chair_sprite, (r.width, r.height))
                surface.blit(chair_sprite, (r.x, r.y))
            elif obs.kind == "person":
                person_sprite = self.sprites.get_person_sprite(frame_idx=self.walk_frame_person, vy=obs.vy)
                if person_sprite.get_size() != (r.width, r.height):
                    person_sprite = pygame.transform.scale(person_sprite, (r.width, r.height))
                surface.blit(person_sprite, (r.x, r.y))
            else:
                desk_sprite = self.sprites.get_desk_sprite(width=r.width, height=r.height, seed=int(obs.x + obs.y))
                surface.blit(desk_sprite, (r.x, r.y))

        # -------------------------------------------------------------
        # LAYER 4: GOAL CHARGING BEACON
        # -------------------------------------------------------------
        goal_sprite = self.sprites.get_goal_sprite(anim_frame=self.anim_frame)
        goal_r = int(env.GOAL_RADIUS)
        gx = int(env.goal_x - goal_r)
        gy = int(env.goal_y - goal_r)
        surface.blit(goal_sprite, (gx, gy))

        # -------------------------------------------------------------
        # LAYER 5: ROBOT SPRITE (With smooth sub-frame interpolation)
        # -------------------------------------------------------------
        # Smooth sub-step interpolation for display coordinates
        dt = 1.0 / max(10.0, fps)
        if math.hypot(env.robot_x - self.display_robot_x, env.robot_y - self.display_robot_y) > 60.0:
            self.display_robot_x = env.robot_x
            self.display_robot_y = env.robot_y
        else:
            lerp_rate = min(1.0, dt * 18.0)
            self.display_robot_x += (env.robot_x - self.display_robot_x) * lerp_rate
            self.display_robot_y += (env.robot_y - self.display_robot_y) * lerp_rate

        # Calculate heading angle based on velocity or vector to goal
        heading_angle = 0
        if self.victory_timer > 0:
            heading_angle = self.victory_spin_angle
        elif plan_info and "best_trajectory" in plan_info and len(plan_info["best_trajectory"]) > 1:
            bt = plan_info["best_trajectory"]
            p0 = env.denormalize_pos(bt[0, 0], bt[0, 1])
            p1 = env.denormalize_pos(bt[1, 0], bt[1, 1])
            dx, dy = p1[0] - p0[0], p1[1] - p0[1]
            if abs(dx) > 0.01 or abs(dy) > 0.01:
                heading_angle = int(math.degrees(math.atan2(dy, dx))) + 90

        robot_status = "moving"
        if last_info and last_info.get("collision", False):
            robot_status = "collision"
        elif plan_info is not None:
            robot_status = "thinking"

        robot_sprite = self.sprites.get_robot_sprite(angle_deg=heading_angle, status=robot_status)
        rx = int(self.display_robot_x - robot_sprite.get_width() // 2)
        ry = int(self.display_robot_y - robot_sprite.get_height() // 2)
        surface.blit(robot_sprite, (rx, ry))

        # Floating "BONK!" popup badge on collision
        if self.bonk_timer > 0:
            b_offset_y = int((24 - self.bonk_timer) * 0.9)
            bx = int(self.bonk_pos[0] - 32)
            by = int(self.bonk_pos[1] - 32 - b_offset_y)
            draw_badge(surface, "💥 BONK!", (bx, by), bg_color=(235, 45, 45))

        # Victory celebration banner on reaching goal
        if self.victory_timer > 0:
            draw_badge(surface, "★ GOAL REACHED! ★", (self.width // 2 - 75, 95), bg_color=(0, 220, 130))

        # -------------------------------------------------------------
        # LAYER 6: THE IMAGINATION LAYER (Mind View & Holographic Trajectories)
        # -------------------------------------------------------------
        if self.show_mind_view:
            self._render_mind_view_overlay(env, surface, plan_info)
        elif plan_info is not None:
            self._render_holographic_paths(env, surface, plan_info)

        # -------------------------------------------------------------
        # LAYER 7: PARTICLES
        # -------------------------------------------------------------
        self.particles.render(surface)

        # -------------------------------------------------------------
        # LAYER 8: DYNAMIC LIGHTING & VIGNETTE
        # -------------------------------------------------------------
        if self.quality != QualityLevel.LOW:
            lights = [
                # Robot core flashlight
                {"pos": (env.robot_x, env.robot_y), "radius": 130, "color": Colors.ROBOT_CORE_GLOW, "intensity": 0.8},
                # Goal beacon light
                {"pos": (env.goal_x, env.goal_y), "radius": 150, "color": Colors.GOAL_PAD_ACTIVE, "intensity": 0.9},
            ]
            self.lighting.render(surface, lights=lights, ambient_darkness=30)

        # -------------------------------------------------------------
        # LAYER 9: CAMERA EFFECTS (Shake / Flash)
        # -------------------------------------------------------------
        self.camera.render_overlay(surface)

        # -------------------------------------------------------------
        # LAYER 10: HITBOX DEBUG OVERLAY (F3 Key)
        # -------------------------------------------------------------
        if self.show_hitboxes:
            self._render_debug_hitboxes(env, surface)

        # -------------------------------------------------------------
        # LAYER 11: HUD GLASS PANEL
        # -------------------------------------------------------------
        self._render_hud(env, surface, method_title, fps)

    def _render_holographic_paths(self, env: Any, surface: pygame.Surface, plan_info: Dict[str, Any]) -> None:
        """
        Renders flowing neon candidate paths with moving dashed pulses and collision detection markers.
        """
        overlay = pygame.Surface((self.width, self.height), pygame.SRCALPHA)

        # 1. Alternative candidate trajectories (subtle cyan/gray, alpha scaled by return)
        candidates = plan_info.get("candidate_trajectories", [])
        returns = plan_info.get("candidate_returns", [0.0] * len(candidates))
        max_ret = max(returns) if returns else 1.0
        min_ret = min(returns) if returns else 0.0
        ret_range = max(1e-4, max_ret - min_ret)

        for idx, traj in enumerate(candidates):
            if len(traj) < 2:
                continue
            ret = returns[idx] if idx < len(returns) else min_ret
            norm_ret = (ret - min_ret) / ret_range  # 0.0 to 1.0
            alpha = int(50 + norm_ret * 80)
            thick = 1 if norm_ret < 0.6 else 2

            pts = [env.denormalize_pos(p[0], p[1]) for p in traj]
            for i in range(len(pts) - 1):
                p1 = (int(pts[i][0]), int(pts[i][1]))
                p2 = (int(pts[i + 1][0]), int(pts[i + 1][1]))
                pygame.draw.line(overlay, (100, 180, 240, alpha), p1, p2, thick)

        # 2. Chosen best trajectory (bright neon green glowing ribbon with moving pulses)
        best_traj = plan_info.get("best_trajectory", None)
        if best_traj is not None and len(best_traj) >= 2:
            pts = [env.denormalize_pos(p[0], p[1]) for p in best_traj]
            # Outer neon glow ribbon
            for i in range(len(pts) - 1):
                p1 = (int(pts[i][0]), int(pts[i][1]))
                p2 = (int(pts[i + 1][0]), int(pts[i + 1][1]))
                pygame.draw.line(overlay, (0, 255, 140, 100), p1, p2, 6)
                pygame.draw.line(overlay, (210, 255, 235, 245), p1, p2, 2)

            # Animated moving chevrons along path
            pulse_offset = (self.anim_frame % 10) / 10.0
            for i in range(len(pts) - 1):
                p1 = pts[i]
                p2 = pts[i + 1]
                mid_x = int(p1[0] + (p2[0] - p1[0]) * pulse_offset)
                mid_y = int(p1[1] + (p2[1] - p1[1]) * pulse_offset)
                pygame.draw.circle(overlay, (255, 255, 255, 220), (mid_x, mid_y), 3)

            # Draw translucent future ghost robot at horizon end
            ghost_pt = (int(pts[-1][0]), int(pts[-1][1]))
            pygame.draw.circle(overlay, (0, 255, 160, 120), ghost_pt, int(env.ROBOT_RADIUS), 2)
            pygame.draw.circle(overlay, (0, 255, 160, 45), ghost_pt, int(env.ROBOT_RADIUS) - 2)

            # Check if any candidate rollout hit an obstacle, and mark with red 'X'
            for traj in candidates:
                for p in traj[1:]:
                    px, py = env.denormalize_pos(p[0], p[1])
                    if env._check_collision(px, py):
                        ix, iy = int(px), int(py)
                        pygame.draw.line(overlay, (255, 50, 50, 160), (ix - 4, iy - 4), (ix + 4, iy + 4), 2)
                        pygame.draw.line(overlay, (255, 50, 50, 160), (ix - 4, iy + 4), (ix + 4, iy - 4), 2)
                        break

        surface.blit(overlay, (0, 0))

    def _render_mind_view_overlay(self, env: Any, surface: pygame.Surface, plan_info: Optional[Dict[str, Any]]) -> None:
        """
        Holographic Cyber-Matrix Mind View (M key).
        """
        overlay = pygame.Surface((self.width, self.height), pygame.SRCALPHA)
        # Deep translucent blue tint
        overlay.fill((8, 16, 32, 180))

        # Holographic grid
        for x in range(0, self.width, 30):
            pygame.draw.line(overlay, (0, 200, 255, 30), (x, 0), (x, self.height), 1)
        for y in range(0, self.height, 30):
            pygame.draw.line(overlay, (0, 200, 255, 30), (0, y), (self.width, y), 1)

        # Glowing wireframe obstacle envelopes
        for obs in env.obstacles:
            r = pygame.Rect(int(obs.x), int(obs.y), int(obs.width), int(obs.height))
            pygame.draw.rect(overlay, (255, 50, 80, 190), r, 2, border_radius=4)
            # Center crosshairs
            pygame.draw.line(overlay, (255, 80, 100, 100), (r.centerx - 8, r.centery), (r.centerx + 8, r.centery), 1)
            pygame.draw.line(overlay, (255, 80, 100, 100), (r.centerx, r.centery - 8), (r.centerx, r.centery + 8), 1)

        # Flowing imagined paths
        if plan_info:
            self._render_holographic_paths(env, overlay, plan_info)

            # Contextual Thought Bubble above robot
            ret_val = plan_info.get("best_return", 0.0)
            if env.scenario == 2:
                thought_text = f"Predicting Human Motion (Return: {ret_val:+.1f})"
            else:
                thought_text = f"Detouring Obstacle (Return: {ret_val:+.1f})"

            bubble_surf = self.font_bubble.render(thought_text, True, (0, 255, 230))
            bw, bh = bubble_surf.get_width() + 16, bubble_surf.get_height() + 8
            bx = max(10, min(self.width - bw - 10, int(env.robot_x - bw // 2)))
            by = max(10, int(env.robot_y - 42))
            draw_glass_panel(overlay, pygame.Rect(bx, by, bw, bh), bg_color=(12, 22, 38), alpha=235, border_color=(0, 220, 255))
            overlay.blit(bubble_surf, (bx + 8, by + 4))

        surface.blit(overlay, (0, 0))

    def _render_debug_hitboxes(self, env: Any, surface: pygame.Surface) -> None:
        """
        Renders true mathematical collision bounds for inspection (F3 key).
        """
        overlay = pygame.Surface((self.width, self.height), pygame.SRCALPHA)
        # Wall margins
        margin = env.ROBOT_RADIUS + 5.0
        wall_rect = pygame.Rect(int(margin), int(margin), int(self.width - margin * 2), int(self.height - margin * 2))
        pygame.draw.rect(overlay, (255, 255, 0, 160), wall_rect, 1)

        # Obstacles
        for obs in env.obstacles:
            r = pygame.Rect(int(obs.x), int(obs.y), int(obs.width), int(obs.height))
            pygame.draw.rect(overlay, (255, 40, 40, 220), r, 2)

        # Robot hit circle
        pygame.draw.circle(overlay, (0, 255, 255, 220), (int(env.robot_x), int(env.robot_y)), int(env.ROBOT_RADIUS), 2)

        # Goal trigger circle
        pygame.draw.circle(overlay, (0, 255, 100, 220), (int(env.goal_x), int(env.goal_y)), int(env.GOAL_RADIUS), 2)

        surface.blit(overlay, (0, 0))

    def _render_hud(self, env: Any, surface: pygame.Surface, method_title: str, fps: float) -> None:
        """
        Glassmorphism top HUD bar.
        """
        hud_w = 460
        hud_h = 76
        hud_rect = pygame.Rect(16, 14, hud_w, hud_h)
        draw_glass_panel(surface, hud_rect, bg_color=(16, 22, 32), alpha=215, border_color=(45, 65, 90), radius=8)

        # Method Title Badge
        is_wm = "WORLD MODEL" in method_title
        badge_col = Colors.SUCCESS if is_wm else Colors.DANGER
        badge_rect = draw_badge(surface, method_title, (hud_rect.x + 12, hud_rect.y + 10), bg_color=badge_col)

        # Quality & FPS tag
        q_tag = f"Q:{self.quality.name} | {int(round(fps))} FPS"
        q_surf = self.font_body.render(q_tag, True, (140, 165, 195))
        surface.blit(q_surf, (hud_rect.right - q_surf.get_width() - 14, hud_rect.y + 12))

        # Metrics Row
        step_str = f"Step: {env.step_count}/{env.MAX_STEPS}"
        hit_str = f"Collisions: {env.collision_count}"
        ep_str = f"Ep: {env.episode_count}"
        scen_str = f"Scenario {env.scenario}"

        stats_line = f"{scen_str}  |  {ep_str}  |  {step_str}  |  {hit_str}"
        st_surf = self.font_body.render(stats_line, True, (215, 228, 242))
        surface.blit(st_surf, (hud_rect.x + 12, hud_rect.y + 36))

        # Progress bar toward max steps
        pbar_rect = pygame.Rect(hud_rect.x + 12, hud_rect.bottom - 16, hud_w - 24, 6)
        prog = min(1.0, env.step_count / float(env.MAX_STEPS))
        pbar_col = Colors.CYAN if prog < 0.8 else Colors.WARNING
        draw_progress_bar(surface, pbar_rect, prog, fill_color=pbar_col)

    def render_classic(
        self,
        env: Any,
        surface: pygame.Surface,
        plan_info: Optional[Dict[str, Any]] = None,
        method_title: str = "WITH WORLD MODEL"
    ) -> None:
        """
        Original lightweight classic renderer kept intact for --classic flag and safety fallback.
        """
        # Background
        surface.fill((28, 32, 42))

        # Grid lines
        for gx in range(0, self.width, 50):
            pygame.draw.line(surface, (36, 42, 54), (gx, 0), (gx, self.height), 1)
        for gy in range(0, self.height, 50):
            pygame.draw.line(surface, (36, 42, 54), (0, gy), (self.width, gy), 1)

        # Room boundary wall
        pygame.draw.rect(surface, (70, 80, 100), pygame.Rect(5, 5, self.width - 10, self.height - 10), 3)

        # Obstacles
        for obs in env.obstacles:
            r = obs.rect
            if obs.kind == "chair":
                pygame.draw.rect(surface, (190, 100, 45), r, border_radius=6)
                pygame.draw.rect(surface, (240, 140, 70), r, 3, border_radius=6)
            elif obs.kind == "person":
                pygame.draw.rect(surface, (180, 50, 180), r, border_radius=8)
                pygame.draw.rect(surface, (255, 120, 255), r, 2, border_radius=8)
            else:
                pygame.draw.rect(surface, (60, 75, 95), r, border_radius=5)
                pygame.draw.rect(surface, (100, 120, 150), r, 2, border_radius=5)

        # Goal
        gc = (int(env.goal_x), int(env.goal_y))
        pygame.draw.circle(surface, (255, 200, 40), gc, int(env.GOAL_RADIUS) + 4, 2)
        pygame.draw.circle(surface, (230, 160, 20), gc, int(env.GOAL_RADIUS))

        # Robot
        rc = (int(env.robot_x), int(env.robot_y))
        pygame.draw.circle(surface, (0, 180, 240), rc, int(env.ROBOT_RADIUS))
        pygame.draw.circle(surface, (180, 240, 255), rc, int(env.ROBOT_RADIUS), 2)

        # Trajectories
        if plan_info:
            from envs.robot_env import draw_ghost_paths
            draw_ghost_paths(surface, plan_info)

        # Fallback Alert Banner
        if self.fallback_active:
            f_rect = pygame.Rect(self.width // 2 - 200, 12, 400, 28)
            pygame.draw.rect(surface, (180, 50, 50), f_rect, border_radius=4)
            f_txt = self.font_body.render(f"Classic Fallback Active: {self.fallback_reason[:35]}", True, (255, 255, 255))
            surface.blit(f_txt, (f_rect.centerx - f_txt.get_width() // 2, f_rect.centery - f_txt.get_height() // 2))

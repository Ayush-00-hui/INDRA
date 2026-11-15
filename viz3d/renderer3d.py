"""
Renderer3D: PBR 3D Renderer for RobotEnv with seamless 2D fallback.
Integrates Panda3D offscreen rendering with Pygame HUD and event overlays.
"""

import logging
import pygame
from typing import Optional, Any

from visuals.assets import SoundManager
from visuals.theme import QualityLevel, Theme
from viz3d.bridge import Panda3DBridge
from viz3d.mapping import WorldMapping, SmoothPose
from viz3d.hud3d import UnderstandingHUD

logger = logging.getLogger(__name__)


class Renderer3D:
    """
    3D PBR Renderer for RobotEnv.
    Matches the exact interface of visuals.renderer.RobotRenderer while rendering
    an animated 3D scene via Panda3D and Pygame offscreen readback.
    """

    def __init__(self, width: int = 960, height: int = 600, view_id: int = 0):
        self.width = width
        self.height = height
        self.view_id = view_id

        self.quality = QualityLevel.HIGH
        self.show_mind_view: bool = False
        self.show_hitboxes: bool = False
        self.camera_mode: str = "overview"  # "overview", "topdown", "follow", "robot_pov", "cinematic"
        self.show_pip: bool = False

        # Audio effects
        self.sounds = SoundManager()

        # Pedagogical HUD Understanding Layer (Phase 8)
        self.hud = UnderstandingHUD(self.width, self.height)

        # Modern 2D fallback renderer in case 3D is disabled or encounters a driver error
        self._fallback_renderer = None
        self._3d_enabled: bool = True

        # Smoothing poses
        self.robot_pose = SmoothPose()
        self.person_pose = SmoothPose()

        # Scene graph reference
        self.scene = None

        # Bridge reference
        self.bridge: Optional[Panda3DBridge] = None
        self._init_bridge()

    def _init_bridge(self) -> None:
        try:
            self.bridge = Panda3DBridge.get_instance(self.width, self.height)
            if not self.bridge.is_available():
                logger.warning("Panda3DBridge is not available. Defaulting to 2D fallback.")
                self._3d_enabled = False
            else:
                from viz3d.scene import Scene3D
                self.scene = Scene3D(self.bridge.base.render, self.bridge.base.cam)
        except Exception as e:
            logger.warning("Failed to initialize 3D bridge: %s. Using 2D fallback.", e)
            self._3d_enabled = False

    def _get_fallback_renderer(self):
        if self._fallback_renderer is None:
            from visuals.renderer import RobotRenderer
            self._fallback_renderer = RobotRenderer(width=self.width, height=self.height)
            self._fallback_renderer.quality = self.quality
            self._fallback_renderer.show_mind_view = self.show_mind_view
            self._fallback_renderer.show_hitboxes = self.show_hitboxes
            self._fallback_renderer.sounds = self.sounds
        return self._fallback_renderer

    def trigger_collision_effects(self, x: Any, y: Optional[float] = None) -> None:
        """Trigger collision audio, recoil, and particle effects."""
        self.sounds.play("collision")
        if isinstance(x, (tuple, list)):
            px, py = float(x[0]), float(x[1])
        else:
            px, py = float(x), float(y if y is not None else 0.0)
        if self._fallback_renderer:
            self._fallback_renderer.trigger_collision_effects((px, py))

    def trigger_goal_effects(self, x: Any, y: Optional[float] = None) -> None:
        """Trigger goal victory audio, chime, and particle effects."""
        self.sounds.play("goal")
        if isinstance(x, (tuple, list)):
            px, py = float(x[0]), float(x[1])
        else:
            px, py = float(x), float(y if y is not None else 0.0)
        if self._fallback_renderer:
            self._fallback_renderer.trigger_goal_effects((px, py))

    def cycle_camera(self) -> str:
        """Cycle camera mode (Key C)."""
        if self.scene is not None:
            mode = self.scene.camera.cycle_mode()
            self.camera_mode = mode
            return mode
        return self.camera_mode

    def toggle_legend(self) -> bool:
        """Toggle visual legend card (Key L)."""
        return self.hud.toggle_legend()

    def toggle_tour(self) -> bool:
        """Toggle pedagogical guided tour (Key G)."""
        return self.hud.toggle_tour()

    def advance_tour(self) -> None:
        """Advance to next tour step (SPACE)."""
        self.hud.advance_tour()

    def update(self, dt: float) -> None:
        """Update animations, smoothing, and particle systems."""
        self.robot_pose.update(dt)
        self.person_pose.update(dt)

        if self.scene is not None:
            self.scene.update(dt)

        if self._fallback_renderer:
            self._fallback_renderer.update(dt)

    def render(
        self,
        env: Any,
        target_surface: pygame.Surface,
        plan_info: Optional[dict] = None,
        last_info: Optional[dict] = None,
        method_title: str = "WORLD MODEL (3D)",
    ) -> None:
        """
        Main render entry point called by RobotEnv.render(screen).
        Renders 3D scene offscreen and overlays 2D Pygame HUD.
        """
        try:
            if not self._3d_enabled or self.bridge is None or not self.bridge.is_available():
                fallback = self._get_fallback_renderer()
                fallback.quality = self.quality
                fallback.show_mind_view = self.show_mind_view
                fallback.show_hitboxes = self.show_hitboxes
                fallback.render(env, target_surface, plan_info, last_info, method_title)
                return

            # Sync quality with bridge
            q_str = "low" if self.quality == QualityLevel.LOW else ("high" if self.quality == QualityLevel.HIGH else "med")
            self.bridge.set_quality(q_str)

            # Update 3D scene from environment if scene is attached
            if self.scene is not None:
                self.scene.world.toggle_hitboxes(self.show_hitboxes)
                self.scene.sync_from_env(env, plan_info, last_info, self.show_mind_view)
                self.scene.update(0.016)

            # Step Panda3D task loop
            self.bridge.step_simulation_frame()

            # Copy offscreen frame to Pygame surface
            success = self.bridge.copy_to_surface(target_surface, view_id=self.view_id)
            if not success:
                raise RuntimeError("Failed to readback 3D frame from Panda3D buffer.")

            # Overlay 2D Pygame HUD (Pipeline, telemetry, debug boxes if requested)
            self._render_hud_overlay(env, target_surface, plan_info, last_info, method_title)

        except Exception as e:
            logger.warning("3D rendering exception (%s). Downgrading to modern 2D renderer.", e)
            self._3d_enabled = False
            fallback = self._get_fallback_renderer()
            fallback.render(env, target_surface, plan_info, last_info, method_title)

    def _render_hud_overlay(
        self,
        env: Any,
        target_surface: pygame.Surface,
        plan_info: Optional[dict],
        last_info: Optional[dict],
        method_title: str,
    ) -> None:
        """Draw Pygame 2D HUD cards, telemetry badge, and debug overlays on top of 3D frame."""
        # Top-left status badge and metrics bar
        fallback = self._get_fallback_renderer()
        fallback.show_mind_view = self.show_mind_view
        fallback.show_hitboxes = self.show_hitboxes
        fallback._render_hud(env=env, surface=target_surface, method_title=method_title, fps=60.0)

        # Understanding layer HUD (Pipeline strip, Why-this-move, Legend, Guided tour)
        self.hud.render(target_surface, env, plan_info, last_info)

        if self.show_hitboxes:
            fallback._render_debug_hitboxes(env, target_surface)

    def render_classic(self, env: Any, screen: pygame.Surface) -> None:
        """Explicit classic fallback."""
        fallback = self._get_fallback_renderer()
        fallback.render_classic(env, screen)

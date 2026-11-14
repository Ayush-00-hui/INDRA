"""
Zero-allocation Offscreen Panda3D -> Pygame Surface Bridge.
Manages offscreen buffers, textures, SimplePBR pipeline, and RAM readback.
"""

import logging
import numpy as np
import pygame
from typing import Optional, Tuple

logger = logging.getLogger(__name__)

# Track singleton state
_PANDA_BRIDGE_INSTANCE: Optional["Panda3DBridge"] = None


class Panda3DBridge:
    """
    Singleton bridge managing offscreen Panda3D rendering and fast zero-allocation
    texture readback into Pygame Surfaces.
    """

    DEFAULT_WIDTH: int = 960
    DEFAULT_HEIGHT: int = 600

    def __init__(self, width: int = DEFAULT_WIDTH, height: int = DEFAULT_HEIGHT):
        self.width = width
        self.height = height
        self.initialized = False
        self.pbr_pipeline = None
        self.base = None

        # Buffers and textures
        self.tex_primary = None
        self.buf_secondary = None
        self.tex_secondary = None
        self.cam_secondary = None

        # Pre-allocated NumPy memory buffers for zero-allocation copy
        self._buf_arr_primary = np.zeros((self.height, self.width, 4), dtype=np.uint8)
        self._buf_arr_secondary = np.zeros((self.height, self.width, 4), dtype=np.uint8)

        # Quality state
        self._quality = "med"
        self._frame_stepped = False

        self._init_panda()

    @classmethod
    def get_instance(cls, width: int = DEFAULT_WIDTH, height: int = DEFAULT_HEIGHT) -> "Panda3DBridge":
        global _PANDA_BRIDGE_INSTANCE
        if _PANDA_BRIDGE_INSTANCE is None:
            _PANDA_BRIDGE_INSTANCE = Panda3DBridge(width=width, height=height)
        return _PANDA_BRIDGE_INSTANCE

    def _init_panda(self) -> None:
        try:
            from panda3d.core import (
                loadPrcFileData,
                Texture,
                GraphicsOutput,
                NodePath,
            )

            loadPrcFileData("", "window-type offscreen")
            loadPrcFileData("", f"win-size {self.width} {self.height}")
            loadPrcFileData("", "audio-library-name null")
            loadPrcFileData("", "gl-version 3 2")
            loadPrcFileData("", "notify-level-glgsg warning")
            loadPrcFileData("", "notify-level warning")

            from direct.showbase.ShowBase import ShowBase
            from panda3d.core import Vec4
            import simplepbr

            self.base = ShowBase()
            self.base.win.setClearColor(Vec4(0.08, 0.1, 0.14, 1.0))

            # Set up simplepbr
            self.pbr_pipeline = simplepbr.init(
                render_node=self.base.render,
                window=self.base.win,
                camera_node=self.base.cam,
                enable_shadows=True,
                msaa_samples=2,
            )

            # Primary render texture
            self.tex_primary = Texture("tex_primary")
            self.base.win.addRenderTexture(
                self.tex_primary, GraphicsOutput.RTM_copy_ram, GraphicsOutput.RTP_color
            )

            self.initialized = True
            logger.info("Panda3DBridge initialized successfully.")
        except Exception as e:
            logger.warning("Panda3DBridge initialization failed (%s). 3D rendering unavailable.", e)
            self.initialized = False

    def is_available(self) -> bool:
        return self.initialized and self.base is not None

    def setup_secondary_buffer(self) -> Optional[NodePath]:
        """Create a secondary offscreen buffer and camera for split-screen dual view."""
        if not self.is_available() or self.buf_secondary is not None:
            return self.cam_secondary

        try:
            from panda3d.core import (
                FrameBufferProperties,
                WindowProperties,
                GraphicsPipe,
                GraphicsOutput,
                Texture,
                Camera,
                Vec4,
            )

            fb_prop = FrameBufferProperties()
            fb_prop.setRgbaBits(8, 8, 8, 8)
            fb_prop.setDepthBits(24)

            win_prop = WindowProperties()
            win_prop.setSize(self.width, self.height)

            self.buf_secondary = self.base.graphicsEngine.makeOutput(
                self.base.pipe,
                "buf_secondary",
                0,
                fb_prop,
                win_prop,
                GraphicsPipe.BFRefuseWindow,
                self.base.win.getGsg(),
                self.base.win,
            )
            self.buf_secondary.setClearColor(Vec4(0.08, 0.1, 0.14, 1.0))

            self.tex_secondary = Texture("tex_secondary")
            self.buf_secondary.addRenderTexture(
                self.tex_secondary, GraphicsOutput.RTM_copy_ram, GraphicsOutput.RTP_color
            )

            cam_node = Camera("cam_secondary")
            self.cam_secondary = self.base.render.attachNewNode(cam_node)
            dr = self.buf_secondary.makeDisplayRegion()
            dr.setCamera(self.cam_secondary)

            logger.info("Secondary offscreen buffer initialized for split-screen.")
            return self.cam_secondary
        except Exception as e:
            logger.warning("Failed to initialize secondary buffer: %s", e)
            return None

    def set_quality(self, quality: str) -> None:
        """Configure SimplePBR pipeline according to quality level (low, med, high)."""
        if not self.is_available() or self.pbr_pipeline is None:
            return
        self._quality = quality.lower()
        if self._quality == "low":
            self.pbr_pipeline.enable_shadows = False
            self.pbr_pipeline.msaa_samples = 0
        elif self._quality == "high":
            self.pbr_pipeline.enable_shadows = True
            self.pbr_pipeline.msaa_samples = 4
        else:  # med
            self.pbr_pipeline.enable_shadows = True
            self.pbr_pipeline.msaa_samples = 2

    def step_simulation_frame(self) -> None:
        """Step the Panda3D task loop once per frame tick."""
        if not self.is_available():
            return
        self.base.taskMgr.step()

    def copy_to_surface(self, target_surface: pygame.Surface, view_id: int = 0) -> bool:
        """
        Fast zero-allocation RAM buffer copy from Panda3D texture into Pygame Surface.
        view_id: 0 for primary view, 1 for secondary view (split-screen).
        """
        if not self.is_available():
            return False

        tex = self.tex_primary if view_id == 0 else self.tex_secondary
        if tex is None:
            return False

        ram_img = tex.getRamImage()
        if not ram_img:
            return False

        try:
            target_buf = self._buf_arr_primary if view_id == 0 else self._buf_arr_secondary

            # Zero-allocation flip copy: Panda3D texture origin is bottom-left
            src = np.frombuffer(ram_img, dtype=np.uint8).reshape((self.height, self.width, 4))
            np.copyto(target_buf, src[::-1])

            # Pygame wrapper around contiguous array
            frame_surf = pygame.image.frombuffer(target_buf, (self.width, self.height), "RGBA")

            # Check if dimensions match target surface
            t_w, t_h = target_surface.get_size()
            if t_w == self.width and t_h == self.height:
                target_surface.blit(frame_surf, (0, 0))
            else:
                scaled = pygame.transform.smoothscale(frame_surf, (t_w, t_h))
                target_surface.blit(scaled, (0, 0))
            return True
        except Exception as e:
            logger.warning("Error copying 3D texture to Pygame surface: %s", e)
            return False

    def destroy(self) -> None:
        if self.base is not None:
            try:
                self.base.destroy()
            except Exception:
                pass
            self.base = None
        self.initialized = False

"""
Goal3D: Animated Charging Dock / Landing Pad Goal Entity.
Implements rotating energy gem, pulsing concentric LED rings, vertical light beacon,
and success victory pulse animation.
"""

import math
from typing import Optional
from panda3d.core import NodePath, Vec3, Vec4

from viz3d.mapping import WorldMapping
from viz3d.assets3d import build_goal_pad_model


class Goal3D:
    """
    Goal landing / charging dock with animated rotating core, pulsing beacon,
    and victory celebration effects.
    """

    def __init__(self, parent_node: NodePath):
        self.root = parent_node.attachNewNode("goal_entity_root")
        self.model = build_goal_pad_model()
        self.model.reparentTo(self.root)

        self.gem: Optional[NodePath] = self.model.getPythonTag("gem")
        self.beacon: Optional[NodePath] = self.model.getPythonTag("beacon")

        self.time: float = 0.0
        self.victory_timer: float = 0.0
        self.energy_card = None
        self._init_beacon_shader()

    def _init_beacon_shader(self) -> None:
        try:
            import os
            from panda3d.core import Shader, CardMaker
            v_p = "assets/shaders/beacon.vert"
            f_p = "assets/shaders/beacon.frag"
            if os.path.exists(v_p) and os.path.exists(f_p):
                shader = Shader.load(Shader.SL_GLSL, v_p, f_p)
                cm = CardMaker("goal_energy_ring")
                cm.setFrame(-0.45, 0.45, -0.45, 0.45)
                self.energy_card = self.root.attachNewNode(cm.generate())
                self.energy_card.setP(-90)
                self.energy_card.setZ(0.045)
                self.energy_card.setTransparency(True)
                self.energy_card.setShader(shader)
        except Exception:
            self.energy_card = None

    def sync_from_env(self, goal_x: float, goal_y: float) -> None:
        """Place goal at exact metric environment coordinates."""
        gx, gy, gz = WorldMapping.px_to_3d(goal_x, goal_y, 0.0)
        self.root.setPos(gx, gy, gz)

    def trigger_victory(self) -> None:
        self.victory_timer = 2.5

    def update(self, dt: float) -> None:
        """Advance pulsing animations."""
        self.time += dt

        # Rotate and bob the energy gem
        if self.gem is not None:
            self.gem.setH(self.time * 60.0)
            bob = 0.25 + math.sin(self.time * 4.0) * 0.04
            self.gem.setZ(bob)

        # Pulse the vertical beacon
        if self.beacon is not None:
            pulse = 0.20 + math.sin(self.time * 3.0) * 0.08
            if self.victory_timer > 0:
                self.victory_timer -= dt
                pulse = 0.60 + math.sin(self.victory_timer * 15.0) * 0.25
                self.beacon.setScale(1.0 + math.sin(self.victory_timer * 8.0) * 0.2)
            else:
                self.beacon.setScale(1.0)
            self.beacon.setColor(0.0, 0.95, 0.70, pulse)

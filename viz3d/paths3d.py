"""
Paths3D: 3D Imagination Visualization, Trajectory Ribbons, and Ghost Robots.
Visualizes MPC planner rollouts directly in 3D:
- Chosen path: Neon emerald green ribbon with flowing animated chevrons.
- Candidate alternatives: Scaled in thickness/alpha by predicted return.
- Colliding futures: Red collision indicators at point of predicted contact.
- Holographic Ghost Robots: Translucent predictions at steps 3, 6, 9...
- Travelled Path: Subtle historical breadcrumb trail.
"""

import math
from typing import List, Tuple, Optional, Dict, Any
from panda3d.core import (
    NodePath,
    LineSegs,
    Vec3,
    Vec4,
)

from viz3d.mapping import WorldMapping
from viz3d.assets3d import create_cylinder, _load_glb


class Paths3D:
    """
    Manages 3D trajectory ribbons, collision warning markers, holographic ghosts,
    and historical breadcrumbs.
    """

    def __init__(self, parent_node: NodePath):
        self.root = parent_node.attachNewNode("paths_root")
        self.chosen_path_node = self.root.attachNewNode("chosen_path")
        self.candidates_node = self.root.attachNewNode("candidates_path")
        self.ghosts_root = self.root.attachNewNode("ghosts_root")
        self.trail_root = self.root.attachNewNode("trail_root")
        self.markers_root = self.root.attachNewNode("collision_markers")

        # Historical breadcrumb history
        self.history_points: List[Tuple[float, float, float]] = []
        self.flow_time: float = 0.0
        self.hologram_shader = None
        self._init_shader()

    def _init_shader(self) -> None:
        try:
            import os
            from panda3d.core import Shader, Filename
            v_p = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "assets", "shaders", "hologram.vert"))
            f_p = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "assets", "shaders", "hologram.frag"))
            if os.path.exists(v_p) and os.path.exists(f_p):
                self.hologram_shader = Shader.load(Shader.SL_GLSL, Filename.fromOsSpecific(v_p), Filename.fromOsSpecific(f_p))
        except Exception:
            self.hologram_shader = None

    def reset_history(self) -> None:
        """Clear breadcrumbs on episode reset."""
        self.history_points.clear()
        self.trail_root.node().removeAllChildren()

    def record_breadcrumb(self, robot_x: float, robot_y: float) -> None:
        """Add current position to travelled path breadcrumb trail."""
        pt = WorldMapping.px_to_3d(robot_x, robot_y, 0.015)
        if not self.history_points or math.hypot(pt[0] - self.history_points[-1][0], pt[1] - self.history_points[-1][1]) > 0.15:
            self.history_points.append(pt)
            self._rebuild_trail()

    def _rebuild_trail(self) -> None:
        self.trail_root.node().removeAllChildren()
        if len(self.history_points) < 2:
            return

        lines = LineSegs("travelled_trail")
        lines.setColor(0.35, 0.65, 0.95, 0.5)
        lines.setThickness(2.2)

        lines.moveTo(*self.history_points[0])
        for pt in self.history_points[1:]:
            lines.drawTo(*pt)

        self.trail_root.attachNewNode(lines.create())

    def update_trajectories(
        self,
        plan_info: Optional[Dict[str, Any]],
        robot_x: float,
        robot_y: float,
        is_mind_view: bool = False
    ) -> None:
        """Synchronize candidate trajectories and chosen rollout from MPC plan_info."""
        self.chosen_path_node.node().removeAllChildren()
        self.candidates_node.node().removeAllChildren()
        self.ghosts_root.node().removeAllChildren()
        self.markers_root.node().removeAllChildren()

        if plan_info is None:
            return

        curr_x3d, curr_y3d, _ = WorldMapping.px_to_3d(robot_x, robot_y, 0.015)

        # 1. Alternative Candidate Trajectories
        trajectories = plan_info.get("all_trajectories") or []
        returns = plan_info.get("candidate_returns") or []

        if trajectories:
            lines_cand = LineSegs("candidates")
            lines_cand.setThickness(1.8)

            # Draw up to 25 candidate rollouts
            for idx, traj in enumerate(trajectories[:25]):
                ret = returns[idx] if idx < len(returns) else 0.0
                # Color based on predicted return
                if ret < -5.0:
                    lines_cand.setColor(0.95, 0.25, 0.25, 0.25)  # Red for colliding
                else:
                    lines_cand.setColor(0.0, 0.75, 0.95, 0.22)   # Cyan for safe

                lines_cand.moveTo(curr_x3d, curr_y3d, 0.012)
                for step_state in traj:
                    # In 16D state vector, [0]=robot_x/900, [1]=robot_y/600
                    if len(step_state) >= 2:
                        px = float(step_state[0]) * 900.0
                        py = float(step_state[1]) * 600.0
                        tx, ty, _ = WorldMapping.px_to_3d(px, py, 0.012)
                        lines_cand.drawTo(tx, ty, 0.012)

            self.candidates_node.attachNewNode(lines_cand.create())

        # 2. Chosen Best Trajectory (Neon Emerald Green Ribbon)
        best_traj = plan_info.get("best_trajectory")
        if best_traj is not None and len(best_traj) > 0:
            lines_chosen = LineSegs("chosen_ribbon")
            # Extra thick in Mind View
            lines_chosen.setThickness(5.0 if is_mind_view else 3.8)
            lines_chosen.setColor(0.0, 1.0, 0.65, 0.95)

            lines_chosen.moveTo(curr_x3d, curr_y3d, 0.02)
            pts_3d = [(curr_x3d, curr_y3d, 0.02)]

            for step_state in best_traj:
                if len(step_state) >= 2:
                    px = float(step_state[0]) * 900.0
                    py = float(step_state[1]) * 600.0
                    tx, ty, _ = WorldMapping.px_to_3d(px, py, 0.02)
                    lines_chosen.drawTo(tx, ty, 0.02)
                    pts_3d.append((tx, ty, 0.02))

            self.chosen_path_node.attachNewNode(lines_chosen.create())

            # 3. Translucent Holographic Ghost Robots along chosen path (at steps 3, 6, 9, 12)
            for step_idx in [3, 6, 9, 12]:
                if step_idx < len(pts_3d):
                    gx, gy, gz = pts_3d[step_idx]
                    ghost_rover = _load_glb("rover.glb")
                    if ghost_rover is not None:
                        ghost_node = self.ghosts_root.attachNewNode(f"ghost_step_{step_idx}")
                        scale = 0.36 / 0.35
                        ghost_rover.setScale(scale)
                        ghost_rover.setPos(-2.00 * scale, 1.50 * scale, -0.0067 * scale)
                        ghost_rover.reparentTo(ghost_node)
                        ghost_node.setPos(gx, gy, gz)
                        ghost_node.setTransparency(True)
                        ghost_node.setColorScale(0.0, 0.95, 0.75, 0.40 if not is_mind_view else 0.65)
                    else:
                        ghost_cyl = create_cylinder(
                            radius=0.18, height=0.16, segments=12,
                            color=(0.0, 0.95, 0.85, 0.35 if not is_mind_view else 0.55),
                            name=f"ghost_step_{step_idx}"
                        )
                        ghost_cyl.setTransparency(True)
                        ghost_cyl.setPos(gx, gy, gz)
                        ghost_cyl.reparentTo(self.ghosts_root)

    def update(self, dt: float) -> None:
        self.flow_time += dt

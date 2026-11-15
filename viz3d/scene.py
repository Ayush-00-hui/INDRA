"""
Scene3D: Master 3D Scene Graph Manager.
Integrates World3D, Robot3D, Person3D, Goal3D, Paths3D, and CameraController.
Synchronizes all visual state from RobotEnv without mutating simulation logic.
"""

import math
from typing import Optional, List, Dict, Any
from panda3d.core import NodePath, Vec3

from viz3d.mapping import WorldMapping
from viz3d.world3d import World3D
from viz3d.robot3d import Robot3D
from viz3d.person3d import Person3D
from viz3d.goal3d import Goal3D
from viz3d.paths3d import Paths3D
from viz3d.cameras import CameraController
from viz3d.assets3d import (
    build_office_chair_model,
    build_desk_model,
    build_crate_model,
    build_cabinet_model,
    build_trash_bin_model,
    build_plant_model,
)


class Scene3D:
    """
    Unified 3D scene graph managing physical room, dynamic robot, obstacles,
    moving pedestrian, planned trajectories, and cameras.
    """

    def __init__(self, root_node: NodePath, camera_np: NodePath):
        self.root = root_node.attachNewNode("scene_3d_root")
        self.obstacles_root = self.root.attachNewNode("obstacles_root")

        # Subsystems
        self.world = World3D(self.root)
        self.robot = Robot3D(self.root)
        self.person = Person3D(self.root)
        self.goal = Goal3D(self.root)
        self.paths = Paths3D(self.root)
        self.camera = CameraController(camera_np)

        # Dynamic obstacle tracking
        self.obstacle_nodes: List[NodePath] = []
        self._current_episode_seed: int = -1
        self.last_robot_x: float = 0.0
        self.last_robot_y: float = 0.0

    def sync_from_env(
        self,
        env: Any,
        plan_info: Optional[Dict[str, Any]],
        last_info: Optional[Dict[str, Any]],
        is_mind_view: bool = False
    ) -> None:
        """
        Synchronize full scene state from environment without mutating sim physics.
        """
        # Episode change detection: reset breadcrumbs and randomize decor
        ep_seed = getattr(env, "current_seed", getattr(env, "episode_count", 0))
        if ep_seed != self._current_episode_seed:
            self._current_episode_seed = ep_seed
            self.paths.reset_history()
            self.world.randomize_decor(ep_seed)
            self.person.set_palette(ep_seed)
            self._rebuild_obstacles(env)

        # 1. Update Robot
        dx = env.robot_x - self.last_robot_x
        dy = env.robot_y - self.last_robot_y
        self.last_robot_x = env.robot_x
        self.last_robot_y = env.robot_y

        is_planning = (plan_info is not None)
        self.robot.sync_from_env(env.robot_x, env.robot_y, dx, dy, is_planning)

        # Check collision or goal events
        if last_info:
            if last_info.get("collision"):
                self.robot.trigger_bump()
            if last_info.get("reached_goal"):
                self.robot.trigger_goal()
                self.goal.trigger_victory()

        # Record breadcrumb
        self.paths.record_breadcrumb(env.robot_x, env.robot_y)

        # 2. Update Goal
        self.goal.sync_from_env(env.goal_x, env.goal_y)

        # 3. Update Person in Scenario 2
        has_person = False
        if getattr(env, "scenario", 1) == 2:
            for obs in getattr(env, "obstacles", []):
                is_p = getattr(obs, "kind", "") == "person" or (hasattr(obs, "radius") and obs.radius)
                if is_p:
                    has_person = True
                    vy = getattr(obs, "vy", 0.0)
                    cx = obs.x + getattr(obs, "width", 45.0) * 0.5
                    cy = obs.y + getattr(obs, "height", 45.0) * 0.5
                    self.person.sync_from_env(cx, cy, vy, show_prediction=True)
                    self.person.root.show()
                    break
        if not has_person:
            self.person.root.hide()

        # 4. Update Planned Paths & Ghosts
        self.paths.update_trajectories(plan_info, env.robot_x, env.robot_y, is_mind_view)

        # 5. Update F3 Debug Hitboxes
        self.world.update_debug_hitboxes(env)

    def _rebuild_obstacles(self, env: Any) -> None:
        """Construct 3D obstacle models strictly matching physical hit envelopes."""
        for node in self.obstacle_nodes:
            node.removeNode()
        self.obstacle_nodes.clear()

        obstacles = getattr(env, "obstacles", [])
        for idx, obs in enumerate(obstacles):
            # Skip circular moving person in Scenario 2 (handled by Person3D)
            is_p = getattr(obs, "kind", "") == "person" or (hasattr(obs, "radius") and obs.radius)
            if is_p:
                continue

            # Rectangular Obstacles (Chairs, Desks, Crates, Cabinets)
            w_px = getattr(obs, "width", 80.0)
            h_px = getattr(obs, "height", 80.0)
            w_m, d_m = WorldMapping.size_to_3d(w_px, h_px)

            # Center position in 3D
            center_x_px = obs.x + w_px * 0.5
            center_y_px = obs.y + h_px * 0.5
            ox_3d, oy_3d, _ = WorldMapping.px_to_3d(center_x_px, center_y_px, 0.0)

            kind = getattr(obs, "kind", "")
            if kind == "chair" or (idx == 0 and w_px == 80.0 and h_px == 80.0):
                model = build_office_chair_model()
                # Deterministic angle based on seed
                model.setH((self._current_episode_seed * 47 + idx * 73) % 360)
            elif kind == "block" or w_px >= 100 or h_px >= 100 or abs(w_px - h_px) > 20:
                model = build_desk_model(w_m, d_m, 0.75)
            elif idx % 3 == 1:
                model = build_crate_model(w_m, d_m, 0.60)
            elif idx % 3 == 2:
                model = build_cabinet_model(w_m, d_m, 0.95)
            else:
                model = build_plant_model(pot_radius=min(w_m, d_m) * 0.35, h=0.75)

            model.setPos(ox_3d, oy_3d, 0.0)
            model.reparentTo(self.obstacles_root)
            self.obstacle_nodes.append(model)

    def update(self, dt: float) -> None:
        """Step all entities, procedural animations, and camera easing."""
        self.robot.update(dt)
        self.person.update(dt, robot_pos=self.robot.root.getPos())
        self.goal.update(dt)
        self.paths.update(dt)

        # Update camera following robot pose
        robot_pos = self.robot.root.getPos()
        robot_h = self.robot.root.getH()
        self.camera.update(dt, robot_pos, robot_h)

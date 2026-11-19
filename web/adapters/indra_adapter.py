"""
Project INDRA Web Simulation Adapter.
Translates IndraEnv states, heterogeneous Indian traffic actors, road hazards,
and MPC candidate trajectories into RenderState for Three.js visualization.
"""

import os
import time
import math
from typing import Dict, Any, Optional, Tuple, List
import numpy as np

from indra.env import IndraEnv
from indra.model.model_interface import BaselineKinematicWorldModel, BaseWorldModelInterface
from indra.planner.indra_mpc import IndraMpcPlanner
from indra.core.actors import RoadHazard
from indra.recovery.watchdog import StagnationWatchdog
from web.schema import Entity, Goal, Plan, PlanAlt, WorldLayout, Metrics, RenderState


class IndraAdapter:
    """
    Adapter interfacing IndraEnv and IndraMpcPlanner with the FastAPI WebSocket server.
    """

    def __init__(
        self,
        scenario_variant: int = 1,
        mode: str = "world_model",
        model_path: Optional[str] = None
    ):
        self.scenario_variant = scenario_variant
        self.mode = mode # "world_model" or "baseline"
        self.env = IndraEnv(scenario_variant=scenario_variant)
        self.planner = IndraMpcPlanner(horizon=12, num_samples=35)

        # World Model interface: default to analytical kinematic baseline
        self.world_model: BaseWorldModelInterface = BaselineKinematicWorldModel()
        self.model_status_label = "Baseline Kinematic (Pre-DGX Training)"

        # Check for trained neural model checkpoints
        target_path = model_path or "models/indra_model.pt"
        if os.path.exists(target_path):
            try:
                import torch
                from indra.model.train_world_model import IndraNeuralWorldModel
                device = "cuda" if torch.cuda.is_available() else "cpu"
                checkpoint = torch.load(target_path, map_location=device)
                model = IndraNeuralWorldModel(obs_dim=24, action_dim=5, hidden_dim=256, num_res_blocks=4)
                if isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:
                    model.load_state_dict(checkpoint["model_state_dict"])
                else:
                    model.load_state_dict(checkpoint)
                model.to(device)
                model.eval()
                self.world_model = model
                self.model_status_label = f"Neural World Model ({device.upper()})"
            except Exception:
                self.world_model = BaselineKinematicWorldModel()
                self.model_status_label = "Baseline Kinematic (Pre-DGX Training)"

        self.last_action: Optional[int] = None
        self.last_plan_info: Optional[Dict[str, Any]] = None
        self.plan_latency_ms: float = 0.0
        self.cum_reward: float = 0.0
        self.episode_count: int = 1
        self.current_seed: int = 1001
        self.speed_mult: float = 1.0
        self.watchdog = StagnationWatchdog()

        self.reset(seed=self.current_seed)

    def set_speed(self, speed: float) -> None:
        """Set simulation speed multiplier (0.25x - 4.0x)."""
        self.speed_mult = max(0.25, min(4.0, float(speed)))

    def reset(self, seed: Optional[int] = None) -> RenderState:
        if seed is not None:
            self.current_seed = seed
        self.obs = self.env.reset(seed=self.current_seed)
        self.last_action = None
        self.last_plan_info = None
        self.plan_latency_ms = 0.0
        self.cum_reward = 0.0
        self.watchdog.reset()
        self._compute_plan()
        return self.get_render_state()

    def _compute_plan(self) -> None:
        """Compute an MPC rollout plan to visualize candidate trajectories."""
        t0 = time.perf_counter()
        best_act, plan_info = self.planner.plan(
            world_model=self.world_model,
            current_state=self.obs,
            goal_x=self.env.goal_x,
            goal_y=self.env.goal_y,
            actors=self.env.actors,
            hazard_zones=self.env.hazards,
            hover_seconds=self.env.hover_timer
        )
        self.plan_latency_ms = (time.perf_counter() - t0) * 1000.0
        self.last_action = best_act
        self.last_plan_info = plan_info

    def step(self) -> Tuple[RenderState, bool]:
        """Advance the simulation by one step. Returns (RenderState, done)."""
        events: List[str] = []
        front_lidar = float(np.min(self.obs[8:12])) if len(self.obs) >= 12 else None
        watchdog_diag = self.watchdog.update(
            robot_x=self.env.robot.x,
            robot_y=self.env.robot.y,
            robot_heading=self.env.robot.heading,
            front_lidar_min=front_lidar
        )

        if self.mode == "world_model":
            if watchdog_diag["is_recovering"] and watchdog_diag["override_action"] is not None:
                action = watchdog_diag["override_action"]
                self.last_action = action
                events.append("recovery")
            else:
                self._compute_plan()
                action = self.last_action if self.last_action is not None else self.env.ACTION_FORWARD
        else:
            # Simple reactive baseline (points toward goal regardless of obstacles)
            dx = self.env.goal_x - self.env.robot.x
            dy = self.env.goal_y - self.env.robot.y
            target_heading = math.atan2(dy, dx)
            heading_diff = (target_heading - self.env.robot.heading + math.pi) % (2 * math.pi) - math.pi
            if heading_diff > 0.2:
                action = self.env.ACTION_LEFT
            elif heading_diff < -0.2:
                action = self.env.ACTION_RIGHT
            else:
                action = self.env.ACTION_FORWARD
            self.last_action = action
            self.last_plan_info = None
            self.plan_latency_ms = 0.02

        self.obs, reward, done, info = self.env.step(action)
        self.cum_reward += reward

        if info.get("collision", False):
            events.append("bonk")
        if info.get("reached_goal", False):
            events.append("goal")

        rs = self.get_render_state(events=events, done=done, info=info)

        if done:
            self.episode_count += 1
            self.current_seed += 1
            self.reset(seed=self.current_seed)

        return rs, done

    def set_goal(self, x: float, y: float) -> None:
        """Interactive user goal repositioning."""
        self.env.goal_x = float(x)
        self.env.goal_y = float(y)
        self._compute_plan()

    def add_obstacle(self, x: float, y: float, kind: str = "pothole", w: float = 1.0, h: float = 1.0) -> None:
        """Deploy interactive obstacles and hazards onto the road."""
        hazard_id = f"hazard_{len(self.env.hazards) + 1}"
        radius = max(w, h) * 0.5
        hz = RoadHazard(hazard_id, hazard_type=kind, x=x, y=y, radius=radius)
        self.env.hazards.append(hz)
        self._compute_plan()

    def get_render_state(self, events: Optional[List[str]] = None, done: bool = False, info: Optional[Dict[str, Any]] = None) -> RenderState:
        """Construct the universal RenderState JSON for Three.js."""
        events = events or []
        entities: List[Entity] = []

        # 1. Autonomous UGV Robot
        robot_extra = {
            "speed_kmh": round(self.env.robot.v * 3.6, 1),
            "heading_deg": round(math.degrees(self.env.robot.heading), 1),
            "hover_seconds": round(self.env.hover_timer, 1),
            "surface_friction": round(self.env.env_state.surface_friction, 2),
            "weather": self.env.env_state.weather.value,
            "road_condition": self.env.env_state.road.value,
            "time_of_day": self.env.env_state.time_of_day.value,
            "waterlog_depth_cm": round(self.env.env_state.waterlog_depth_cm, 1),
            "lidar_distances": [round(float(d), 2) for d in self.obs[8:16]],
            "is_recovering": self.watchdog.is_recovering,
            "recoveries": self.watchdog.total_recoveries
        }
        entities.append(Entity(
            id="indra_robot",
            kind="robot",
            x=self.env.robot.x,
            y=self.env.robot.y,
            heading=math.degrees(self.env.robot.heading),
            vx=self.env.robot.v * math.cos(self.env.robot.heading),
            vy=self.env.robot.v * math.sin(self.env.robot.heading),
            w=self.env.robot.specs.width_m,
            h=self.env.robot.specs.length_m,
            r=self.env.robot.specs.collision_radius_m,
            extra=robot_extra
        ))

        # 2. Dynamic Traffic Actors (Rickshaws, Bikes, Cows, Dogs, Carts)
        for actor in self.env.actors:
            entities.append(Entity(
                id=actor.actor_id,
                kind=actor.kind,
                x=actor.x,
                y=actor.y,
                heading=math.degrees(actor.heading),
                vx=actor.vx,
                vy=actor.vy,
                w=actor.width,
                h=actor.length,
                r=actor.radius,
                extra={"speed": round(actor.speed, 2), "is_dynamic": actor.is_dynamic}
            ))

        # 3. Road Surface Hazards (Potholes, Waterlogging, Barricades)
        for hz in self.env.hazards:
            entities.append(Entity(
                id=hz.actor_id,
                kind=hz.kind,
                x=hz.x,
                y=hz.y,
                heading=0.0,
                vx=0.0,
                vy=0.0,
                w=hz.width,
                h=hz.length,
                r=hz.radius,
                extra={"severity": hz.severity}
            ))

        # Goal definition
        goal = Goal(
            x=self.env.goal_x,
            y=self.env.goal_y,
            r=1.2,
            extra={"name": "Delivery Drop-off Hub"}
        )

        # Plan serialization
        plan_obj: Optional[Plan] = None
        if self.last_plan_info:
            alts: List[PlanAlt] = []
            for alt in self.last_plan_info.get("alternatives", []):
                alts.append(PlanAlt(
                    path=[[p[0], p[1]] for p in alt.get("path", [])],
                    score=alt.get("score", 0.0),
                    first_action=alt.get("first_action", 0)
                ))

            best_traj = self.last_plan_info.get("best_trajectory", [])
            plan_obj = Plan(
                kind="path",
                best=[[p[0], p[1]] for p in best_traj],
                alts=alts,
                chosen_action=self.last_plan_info.get("chosen_action", 0),
                ms=self.last_plan_info.get("plan_ms", 0.0)
            )

        # Layout metadata
        layout_dict = {
            "scenario_name": self.env.scenario.name if self.env.scenario else "Project INDRA Urban",
            "scenario_code": self.env.scenario.code if self.env.scenario else "urban_corridor",
            "difficulty": self.env.scenario.difficulty if self.env.scenario else "Standard",
            "environment_state": self.env.env_state.to_dict(),
            "model_metadata": self.world_model.get_model_metadata()
        }
        world = WorldLayout(
            bounds=list(self.env.bounds),
            units="m",
            scale=1.0,
            layout=layout_dict
        )

        # Metrics
        current_goal_dist = math.hypot(self.env.goal_x - self.env.robot.x, self.env.goal_y - self.env.robot.y)
        metrics = Metrics(
            reward=round(self.cum_reward, 2),
            episode=self.episode_count,
            success=(current_goal_dist < 1.4),
            collisions=self.env.collision_count,
            step_count=self.env.step_count,
            extra={
                "goal_distance_m": round(current_goal_dist, 2),
                "speed_kmh": round(self.env.robot.v * 3.6, 1),
                "plan_latency_ms": round(self.plan_latency_ms, 2),
                "model_status": self.model_status_label
            }
        )

        return RenderState(
            v=1,
            scenario="indra",
            step=self.env.step_count,
            dt=self.env.dt,
            mode=self.mode,
            world=world,
            entities=entities,
            goal=goal,
            plan=plan_obj,
            metrics=metrics,
            events=[]
        )

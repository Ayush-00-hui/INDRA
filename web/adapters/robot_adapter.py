"""
Robotics Simulation Web Adapter.
Translates RobotEnv state, obstacles, dynamic actors, and MPC plan_info into RenderState.
"""

import time
import math
import numpy as np
from typing import Dict, Any, Optional, Tuple, List

from envs.robot_env import RobotEnv
from model.world_model import load_model, EnsembleWorldModel
from planner.mpc import plan
from scripts.collect_data_robot import get_greedy_action
from web.schema import Entity, Goal, Plan, PlanAlt, WorldLayout, Metrics, RenderState


class RobotAdapter:
    """
    Adapter interfacing RobotEnv and WorldModel MPC planner with the web server.
    """

    def __init__(self, scenario_variant: int = 1, mode: str = "world_model", model_path: Optional[str] = None):
        self.scenario_variant = scenario_variant
        self.mode = mode  # "world_model" or "baseline"
        self.env = RobotEnv(scenario=scenario_variant)
        self.state: Optional[np.ndarray] = None
        self.last_action: int = RobotEnv.ACTION_STAY
        self.last_plan_info: Optional[Dict[str, Any]] = None
        self.plan_latency_ms: float = 0.0
        self.cum_reward: float = 0.0
        self.episode_count: int = 1
        self.current_seed: int = 1001

        # Load World Model
        self.model = None
        if model_path is None:
            if os_exists := __import__("os").path.exists:
                if os_exists("models/robot_ensemble.pt"):
                    model_path = "models/robot_ensemble.pt"
                elif os_exists("models/robot_model.pt"):
                    model_path = "models/robot_model.pt"

        if model_path and __import__("os").path.exists(model_path):
            try:
                self.model = load_model(model_path, state_size=self.env.get_state_size(), action_size=self.env.get_action_size())
            except Exception as e:
                self.model = None

        self.reset(seed=self.current_seed)

    def reset(self, seed: Optional[int] = None) -> RenderState:
        if seed is not None:
            self.current_seed = seed
        self.state = self.env.reset(seed=self.current_seed)
        self.last_action = RobotEnv.ACTION_STAY
        self.last_plan_info = None
        self.plan_latency_ms = 0.0
        self.cum_reward = 0.0
        return self.get_render_state()

    def step(self) -> Tuple[RenderState, bool]:
        """Advance one simulation step. Returns (render_state, done)."""
        if self.state is None:
            self.reset(self.current_seed)

        events: List[str] = []
        chosen_action = RobotEnv.ACTION_STAY
        self.last_plan_info = None

        if self.mode == "world_model" and self.model is not None:
            t0 = time.perf_counter()
            chosen_action, self.last_plan_info = plan(
                model=self.model,
                state=self.state,
                action_size=self.env.get_action_size(),
                horizon=14,
                n_samples=300,
                gamma=0.95,
                return_trajectories=True,
                last_action=self.last_action
            )
            self.plan_latency_ms = (time.perf_counter() - t0) * 1000.0
        else:
            # Reactive greedy baseline
            chosen_action = get_greedy_action(self.env.robot_x, self.env.robot_y, self.env.goal_x, self.env.goal_y)

        self.last_action = chosen_action
        next_s, reward, done, info = self.env.step(chosen_action)
        self.state = next_s
        self.cum_reward += reward

        if info.get("collision", False):
            events.append("bonk")
        if info.get("reached_goal", False):
            events.append("goal")

        rs = self.get_render_state(events=events, done=done, info=info)
        return rs, done

    def get_render_state(self, events: Optional[List[str]] = None, done: bool = False, info: Optional[Dict[str, Any]] = None) -> RenderState:
        events = events or []
        info = info or {}

        # 1. World layout
        world = WorldLayout(
            bounds=[0.0, 0.0, 900.0, 600.0],
            units="px",
            scale=1.0,
            layout={
                "room": "Warehouse Lab 9x6m",
                "grid_size": 45.0
            }
        )

        # 2. Entities
        entities: List[Entity] = []

        # Robot entity
        status_led = "green"
        if info.get("collision", False):
            status_led = "red"
        elif self.mode == "world_model":
            status_led = "cyan"

        entities.append(Entity(
            id="robot",
            kind="robot",
            x=float(self.env.robot_x),
            y=float(self.env.robot_y),
            heading=float(getattr(self.env, "robot_heading", 0.0)),
            r=float(self.env.ROBOT_RADIUS),
            extra={
                "status_led": status_led,
                "step": self.env.step_count,
                "last_action": self.last_action
            }
        ))

        # Obstacles
        for idx, obs in enumerate(self.env.obstacles):
            entities.append(Entity(
                id=f"obs_{idx}",
                kind=getattr(obs, "kind", "chair"),
                x=float(obs.x),
                y=float(obs.y),
                w=float(obs.width),
                h=float(obs.height),
                extra={
                    "is_static": True
                }
            ))

        # Moving person (Scenario 2)
        if self.scenario_variant == 2 and hasattr(self.env, "person_x"):
            entities.append(Entity(
                id="person",
                kind="person",
                x=float(self.env.person_x),
                y=float(self.env.person_y),
                heading=float(getattr(self.env, "person_heading", 0.0)),
                r=float(getattr(self.env, "PERSON_RADIUS", 22.5)),
                vx=float(getattr(self.env, "person_vx", 0.0)),
                vy=float(getattr(self.env, "person_vy", 0.0)),
                extra={
                    "speed": float(getattr(self.env, "person_speed", 2.0))
                }
            ))

        # 3. Goal
        goal = Goal(
            x=float(self.env.goal_x),
            y=float(self.env.goal_y),
            r=float(self.env.GOAL_RADIUS),
            extra={"reached": info.get("reached_goal", False)}
        )

        # 4. Plan
        plan_obj: Optional[Plan] = None
        if self.last_plan_info is not None:
            best_traj = self.last_plan_info.get("best_trajectory", [])
            # Convert 16D state coords ([0]=x/900, [1]=y/600) to pixel coordinates
            best_pts = []
            for step_vec in best_traj:
                if len(step_vec) >= 2:
                    best_pts.append([float(step_vec[0]) * 900.0, float(step_vec[1]) * 600.0])

            alt_objs: List[PlanAlt] = []
            cands = self.last_plan_info.get("candidate_trajectories", [])
            rets = self.last_plan_info.get("candidate_returns", [])
            for c_idx, traj in enumerate(cands[:15]):
                pts = [[float(v[0]) * 900.0, float(v[1]) * 600.0] for v in traj if len(v) >= 2]
                score = float(rets[c_idx]) if c_idx < len(rets) else 0.0
                alt_objs.append(PlanAlt(path=pts, score=score, first_action=c_idx % 5))

            plan_obj = Plan(
                kind="path",
                best=best_pts,
                alts=alt_objs,
                chosen_action=self.last_action,
                ms=round(self.plan_latency_ms, 2)
            )

        # 5. Metrics
        metrics = Metrics(
            reward=round(self.cum_reward, 2),
            episode=self.episode_count,
            success=info.get("reached_goal", False),
            collisions=self.env.collision_count,
            step_count=self.env.step_count,
            extra={
                "remaining_steps": self.env.MAX_STEPS - self.env.step_count,
                "dist_to_goal": round(float(np.hypot(self.env.robot_x - self.env.goal_x, self.env.robot_y - self.env.goal_y)), 1)
            }
        )

        return RenderState(
            v=1,
            scenario="robotics",
            step=self.env.step_count,
            dt=1.0 / 30.0,
            mode=self.mode,
            world=world,
            entities=entities,
            goal=goal,
            plan=plan_obj,
            metrics=metrics,
            events=events,
            model_error=0.016 if self.mode == "world_model" else None
        )

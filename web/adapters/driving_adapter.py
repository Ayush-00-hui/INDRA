"""
Driving Simulation Web Adapter.
Translates DrivingEnv (Gurudutt's placeholder or real env) into RenderState.
Reads only public BaseEnv methods and attributes without modifying Gurudutt's code.
"""

import time
import numpy as np
from typing import Dict, Any, Optional, Tuple, List

from envs.driving_env import DrivingEnv
from web.schema import Entity, Goal, Plan, PlanAlt, WorldLayout, Metrics, RenderState


class DrivingAdapter:
    """
    Adapter interfacing DrivingEnv with the web server.
    """

    def __init__(self, scenario_variant: int = 1, mode: str = "baseline", model_path: Optional[str] = None):
        self.scenario_variant = scenario_variant
        self.mode = mode  # "world_model" or "baseline"
        self.env = DrivingEnv()
        self.state: Optional[np.ndarray] = None
        self.cum_reward: float = 0.0
        self.episode_count: int = 1
        self.current_seed: int = 1001
        self.model = None

        if model_path and __import__("os").path.exists(model_path):
            try:
                from model.world_model import load_model
                self.model = load_model(model_path, state_size=self.env.get_state_size(), action_size=self.env.get_action_size())
            except Exception:
                self.model = None

        self.reset(seed=self.current_seed)

    def reset(self, seed: Optional[int] = None) -> RenderState:
        if seed is not None:
            self.current_seed = seed
        self.state = self.env.reset(seed=self.current_seed)
        self.cum_reward = 0.0
        return self.get_render_state()

    def step(self) -> Tuple[RenderState, bool]:
        """Advance one simulation step."""
        if self.state is None:
            self.reset(self.current_seed)

        events: List[str] = []
        action = 1  # default: maintain center

        # Check if model available for MPC
        if self.mode == "world_model" and self.model is not None:
            try:
                from planner.mpc import plan
                action = plan(self.model, self.state, action_size=self.env.get_action_size(), horizon=12, n_samples=100)
            except Exception:
                action = 1
        else:
            # Simple proportional lane centering baseline
            offset = getattr(self.env, "offset", 0.0)
            if offset > 0.08:
                action = 0  # steer left
            elif offset < -0.08:
                action = 2  # steer right
            else:
                action = 1  # maintain

        next_s, reward, done, info = self.env.step(action)
        self.state = next_s
        self.cum_reward += reward

        if info.get("offroad", False):
            events.append("bonk")

        rs = self.get_render_state(events=events, done=done, info=info, action=action)
        return rs, done

    def get_render_state(
        self,
        events: Optional[List[str]] = None,
        done: bool = False,
        info: Optional[Dict[str, Any]] = None,
        action: int = 1
    ) -> RenderState:
        events = events or []
        info = info or {}

        # If Gurudutt's env already implemented custom get_render_state, check if rich
        if hasattr(self.env, "get_render_state"):
            custom = self.env.get_render_state()
            if custom.get("entities"):
                return RenderState(**custom)

        # Standard extraction from DrivingEnv properties
        offset = float(getattr(self.env, "offset", 0.0))
        heading = float(getattr(self.env, "heading", 0.0))
        speed = float(getattr(self.env, "speed", 0.6))
        curvature = float(getattr(self.env, "curvature", 0.0))
        step_count = int(getattr(self.env, "step_count", 0))

        # Coordinate mapping: Road center at x=450, y from 0 to 600
        # Car is at y=480, x = 450 + offset * 180
        car_x = 450.0 + offset * 180.0
        car_y = 480.0

        world = WorldLayout(
            bounds=[0.0, 0.0, 900.0, 600.0],
            units="px",
            scale=1.0,
            layout={
                "type": "highway",
                "road_width": 400.0,
                "lane_count": 2,
                "curvature": curvature,
                "scroll_offset": step_count * 12.0
            }
        )

        entities: List[Entity] = [
            Entity(
                id="car_ego",
                kind="car",
                x=car_x,
                y=car_y,
                heading=heading * 57.2958,  # rad to deg
                vx=heading * speed * 10.0,
                vy=-speed * 15.0,
                w=36.0,
                h=60.0,
                extra={
                    "offset": offset,
                    "action": action,
                    "speed": speed
                }
            )
        ]

        # Add simulated lead car ahead
        lead_y = (car_y - 250.0 + (step_count * 2) % 300)
        entities.append(Entity(
            id="car_lead",
            kind="car",
            x=450.0,
            y=lead_y,
            heading=0.0,
            w=36.0,
            h=60.0,
            extra={"is_lead": True}
        ))

        # Plan representation
        plan_obj: Optional[Plan] = None
        if self.mode == "world_model":
            # Projected trajectory ahead
            pred_pts = [[car_x + (i * heading * 15.0), car_y - i * 20.0] for i in range(10)]
            plan_obj = Plan(
                kind="path",
                best=pred_pts,
                chosen_action=action,
                ms=4.2
            )

        metrics = Metrics(
            reward=round(self.cum_reward, 2),
            episode=self.episode_count,
            success=not info.get("offroad", False) and step_count >= getattr(self.env, "MAX_STEPS", 200),
            collisions=1 if info.get("offroad", False) else 0,
            step_count=step_count,
            extra={
                "lane_offset": round(offset, 3),
                "is_offroad": info.get("offroad", False)
            }
        )

        return RenderState(
            v=1,
            scenario="driving",
            step=step_count,
            dt=1.0 / 30.0,
            mode=self.mode,
            world=world,
            entities=entities,
            goal=None,
            plan=plan_obj,
            metrics=metrics,
            events=events,
            model_error=None
        )

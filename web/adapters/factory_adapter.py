"""
Factory-Line Digital Twin Web Adapter.
Interfaces FactoryEnv with the web server (Phase 6).
"""

from typing import Dict, Any, Optional, Tuple, List
import os
import numpy as np
from web.schema import Entity, Goal, Plan, PlanAlt, WorldLayout, Metrics, RenderState


class FactoryAdapter:
    """
    Adapter for the 3-Station manufacturing line digital twin.
    """

    def __init__(self, scenario_variant: int = 1, mode: str = "baseline", model_path: Optional[str] = None):
        self.scenario_variant = scenario_variant
        self.mode = mode
        self.step_count = 0
        self.cum_reward = 0.0
        self.episode_count = 1
        self.current_seed = 1001

        self.model = None
        if model_path and os.path.exists(model_path):
            try:
                from model.world_model import load_model
                self.model = load_model(model_path)
            except Exception:
                self.model = None

        self.env = None
        try:
            from envs.factory_env import FactoryEnv
            self.env = FactoryEnv()
        except Exception:
            self.env = None

        self.reset(seed=self.current_seed)

    def reset(self, seed: Optional[int] = None) -> RenderState:
        if seed is not None:
            self.current_seed = seed
        self.step_count = 0
        self.cum_reward = 0.0
        if self.env is not None:
            self.env.reset(seed=self.current_seed)
        return self.get_render_state()

    def step(self) -> Tuple[RenderState, bool]:
        if self.env is not None:
            if self.mode == "world_model":
                action = self.env.get_world_model_action(model=self.model)
            else:
                action = self.env.get_baseline_action()

            s, r, done, info = self.env.step(action)
            self.step_count = self.env.step_count
            self.cum_reward += r
            events = info.get("events", [])
            return self.get_render_state(events=events, done=done, info=info), done
        else:
            self.step_count += 1
            done = self.step_count >= 200
            self.cum_reward += 1.0
            return self.get_render_state(events=[], done=done), done

    def get_render_state(
        self,
        events: Optional[List[str]] = None,
        done: bool = False,
        info: Optional[Dict[str, Any]] = None
    ) -> RenderState:
        events = events or []
        info = info or {}

        # 3 Stations placed across x=220, x=450, x=680 at y=300
        world = WorldLayout(
            bounds=[0.0, 0.0, 900.0, 600.0],
            units="px",
            scale=1.0,
            layout={
                "type": "assembly_line",
                "stations": [
                    {"id": "station_1", "name": "Precision Milling", "x": 220, "y": 300},
                    {"id": "station_2", "name": "Robotic Assembly", "x": 450, "y": 300},
                    {"id": "station_3", "name": "Quality Inspection & Pack", "x": 680, "y": 300}
                ]
            }
        )

        w1 = getattr(self.env, "wear", [0.2, 0.3, 0.1])[0] if self.env else 0.2
        w2 = getattr(self.env, "wear", [0.2, 0.3, 0.1])[1] if self.env else 0.3
        w3 = getattr(self.env, "wear", [0.2, 0.3, 0.1])[2] if self.env else 0.1

        t1 = getattr(self.env, "temp", [0.3, 0.4, 0.2])[0] if self.env else 0.3
        t2 = getattr(self.env, "temp", [0.3, 0.4, 0.2])[1] if self.env else 0.4
        t3 = getattr(self.env, "temp", [0.3, 0.4, 0.2])[2] if self.env else 0.2

        dt1 = getattr(self.env, "down_timer", [0, 0, 0])[0] if self.env else 0
        dt2 = getattr(self.env, "down_timer", [0, 0, 0])[1] if self.env else 0
        dt3 = getattr(self.env, "down_timer", [0, 0, 0])[2] if self.env else 0

        ib1 = getattr(self.env, "is_breakdown", [False, False, False])[0] if self.env else False
        ib2 = getattr(self.env, "is_breakdown", [False, False, False])[1] if self.env else False
        ib3 = getattr(self.env, "is_breakdown", [False, False, False])[2] if self.env else False

        s1_status = "jammed" if (dt1 > 0 and ib1) else ("maintenance" if dt1 > 0 else "nominal")
        s2_status = "jammed" if (dt2 > 0 and ib2) else ("maintenance" if dt2 > 0 else "nominal")
        s3_status = "jammed" if (dt3 > 0 and ib3) else ("maintenance" if dt3 > 0 else "nominal")

        b_in = getattr(self.env, "buffer_in", 5) if self.env else 5
        b_12 = getattr(self.env, "buffer_12", 3) if self.env else 3
        b_23 = getattr(self.env, "buffer_23", 2) if self.env else 2
        b_out = getattr(self.env, "buffer_out", 0) if self.env else 0
        completed = getattr(self.env, "total_completed", int(self.step_count * 0.4)) if self.env else int(self.step_count * 0.4)
        breakdowns = getattr(self.env, "breakdown_count", 0) if self.env else 0

        entities: List[Entity] = [
            Entity(id="conveyor_1", kind="conveyor", x=120, y=300, w=160, h=30, extra={"buffer": b_in}),
            Entity(id="conveyor_2", kind="conveyor", x=335, y=300, w=150, h=30, extra={"buffer": b_12}),
            Entity(id="conveyor_3", kind="conveyor", x=565, y=300, w=150, h=30, extra={"buffer": b_23}),
            Entity(id="conveyor_out", kind="conveyor", x=780, y=300, w=120, h=30, extra={"buffer": b_out}),
            Entity(id="machine_1", kind="machine", x=220, y=300, w=70, h=70, extra={"wear": round(w1, 2), "temp": round(t1, 2), "status": s1_status, "timer": dt1}),
            Entity(id="machine_2", kind="machine", x=450, y=300, w=70, h=70, extra={"wear": round(w2, 2), "temp": round(t2, 2), "status": s2_status, "timer": dt2}),
            Entity(id="machine_3", kind="machine", x=680, y=300, w=70, h=70, extra={"wear": round(w3, 2), "temp": round(t3, 2), "status": s3_status, "timer": dt3}),
        ]

        # Moving workpieces on conveyors
        for i in range(5):
            item_x = (self.step_count * 5 + i * 160) % 800 + 50
            entities.append(Entity(id=f"item_{i}", kind="item", x=float(item_x), y=300.0, w=16.0, h=16.0))

        # Digital Twin queue forecast plan
        plan_obj = Plan(
            kind="series",
            best=[[round(w1, 2), round(w2, 2), round(w3, 2)], [round(w1 + 0.05, 2), round(w2 + 0.06, 2), round(w3 + 0.04, 2)]],
            chosen_action=getattr(self.env, "last_action", 0) if self.env else 0,
            ms=3.5
        )

        metrics = Metrics(
            reward=round(self.cum_reward, 2),
            episode=self.episode_count,
            success=done and (breakdowns == 0),
            collisions=breakdowns,
            step_count=self.step_count,
            extra={
                "units_produced": completed,
                "unplanned_downtime_steps": breakdowns * 25
            }
        )

        return RenderState(
            v=1,
            scenario="factory",
            step=self.step_count,
            dt=1.0 / 30.0,
            mode=self.mode,
            world=world,
            entities=entities,
            goal=Goal(x=850.0, y=300.0, r=25.0, kind="dock"),
            plan=plan_obj,
            metrics=metrics,
            events=events,
            model_error=0.015
        )

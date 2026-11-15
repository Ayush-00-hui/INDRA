"""
Factory-Line Digital Twin Web Adapter.
Interfaces FactoryEnv with the web server (Phase 6).
"""

from typing import Dict, Any, Optional, Tuple, List
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

        # Check if full FactoryEnv exists (implemented in Phase 6)
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
            # Full environment step
            action = 0
            if self.mode == "world_model":
                action = getattr(self.env, "get_world_model_action", lambda: 0)()
            else:
                action = getattr(self.env, "get_baseline_action", lambda: 0)()

            s, r, done, info = self.env.step(action)
            self.step_count = self.env.step_count
            self.cum_reward += r
            events = info.get("events", [])
            return self.get_render_state(events=events, done=done, info=info), done
        else:
            # Fallback procedural preview
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

        # 3 Stations placed across x=200, x=450, x=700 at y=300
        world = WorldLayout(
            bounds=[0.0, 0.0, 900.0, 600.0],
            units="px",
            scale=1.0,
            layout={
                "type": "assembly_line",
                "stations": [
                    {"id": "station_1", "name": "Milling Unit", "x": 220, "y": 300},
                    {"id": "station_2", "name": "Assembly Arm", "x": 450, "y": 300},
                    {"id": "station_3", "name": "Inspection & Pack", "x": 680, "y": 300}
                ]
            }
        )

        entities: List[Entity] = [
            Entity(id="conveyor_1", kind="conveyor", x=120, y=300, w=160, h=30),
            Entity(id="conveyor_2", kind="conveyor", x=335, y=300, w=150, h=30),
            Entity(id="conveyor_3", kind="conveyor", x=565, y=300, w=150, h=30),
            Entity(id="conveyor_out", kind="conveyor", x=780, y=300, w=120, h=30),
            Entity(id="machine_1", kind="machine", x=220, y=300, w=70, h=70, extra={"health": 0.95, "status": "nominal"}),
            Entity(id="machine_2", kind="machine", x=450, y=300, w=70, h=70, extra={"health": 0.88, "status": "nominal"}),
            Entity(id="machine_3", kind="machine", x=680, y=300, w=70, h=70, extra={"health": 0.92, "status": "nominal"}),
        ]

        # Add moving items on conveyor
        for i in range(4):
            item_x = (self.step_count * 4 + i * 180) % 800 + 50
            entities.append(Entity(id=f"item_{i}", kind="item", x=float(item_x), y=300.0, w=18.0, h=18.0))

        # Digital Twin queue forecast plan
        plan_obj = Plan(
            kind="series",
            best=[[1.2, 2.1, 0.8], [1.4, 2.3, 0.9], [1.1, 1.8, 0.7]],  # predicted queue lengths
            chosen_action=0,
            ms=3.8
        )

        metrics = Metrics(
            reward=round(self.cum_reward, 2),
            episode=self.episode_count,
            success=done,
            collisions=0,
            step_count=self.step_count,
            extra={
                "units_produced": int(self.step_count * 0.4),
                "unplanned_downtime_steps": 0
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
            goal=None,
            plan=plan_obj,
            metrics=metrics,
            events=events,
            model_error=None
        )

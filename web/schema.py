"""
Universal Web Render-State Schema for World Model Simulations.

Provides Pydantic models for validation, serialization (via orjson/json),
and type contracts between Python simulation adapters and frontend Three.js/Canvas renderers.
"""

from typing import List, Dict, Any, Optional, Union
from pydantic import BaseModel, Field


class Entity(BaseModel):
    id: str
    kind: str  # robot, chair, desk, crate, plant, cabinet, person, car, truck, machine, conveyor, item
    x: float
    y: float
    heading: float = 0.0  # degrees
    vx: float = 0.0
    vy: float = 0.0
    w: Optional[float] = None  # width
    h: Optional[float] = None  # height
    r: Optional[float] = None  # radius
    extra: Dict[str, Any] = Field(default_factory=dict)


class Goal(BaseModel):
    x: float
    y: float
    r: float = 20.0
    extra: Dict[str, Any] = Field(default_factory=dict)


class PlanAlt(BaseModel):
    path: Optional[List[List[float]]] = None  # e.g. [[x1, y1], [x2, y2], ...]
    values: Optional[List[float]] = None     # e.g. [q1, q2, q3] for factory queues
    score: float = 0.0
    first_action: int = 0
    uncertainty: Optional[float] = None


class Plan(BaseModel):
    kind: str = "path"  # "path" (robotics/driving) or "series" (factory)
    best: List[Any] = Field(default_factory=list)
    alts: List[PlanAlt] = Field(default_factory=list)
    chosen_action: int = 0
    ms: float = 0.0


class WorldLayout(BaseModel):
    bounds: List[float] = Field(default_factory=lambda: [0.0, 0.0, 900.0, 600.0])  # [min_x, min_y, max_x, max_y]
    units: str = "px"  # "px" (1 px = 1 cm) or "m"
    scale: float = 1.0
    layout: Dict[str, Any] = Field(default_factory=dict)  # walls, lanes, stations


class Metrics(BaseModel):
    reward: float = 0.0
    episode: int = 0
    success: bool = False
    collisions: int = 0
    step_count: int = 0
    extra: Dict[str, Any] = Field(default_factory=dict)


class RenderState(BaseModel):
    v: int = 1
    scenario: str  # "robotics", "driving", "factory"
    step: int
    dt: float = 1.0 / 30.0
    mode: str = "world_model"  # "world_model" or "baseline"
    world: WorldLayout
    entities: List[Entity] = Field(default_factory=list)
    goal: Optional[Goal] = None
    plan: Optional[Plan] = None
    metrics: Metrics
    events: List[str] = Field(default_factory=list)  # "bonk", "goal", "breakdown", "maintain"
    model_error: Optional[float] = None


class CompareRenderState(BaseModel):
    v: int = 1
    scenario: str
    is_compare: bool = True
    left: RenderState   # WITHOUT world model (baseline)
    right: RenderState  # WITH world model (MPC)


class ClientCommand(BaseModel):
    cmd: str  # "start", "reset", "set", "pause", "step", "set_goal", "add_obstacle", "clear_obstacles"
    seed: Optional[int] = None
    mode: Optional[str] = None  # "world_model", "baseline", "compare"
    speed: Optional[float] = None  # 0.25 to 4.0
    scenario_variant: Optional[int] = None  # 1 or 2
    show_plan: Optional[bool] = None
    mind_view: Optional[bool] = None
    x: Optional[float] = None
    y: Optional[float] = None
    kind: Optional[str] = None   # "crate", "cabinet", "workstation", "chair"
    w: Optional[float] = None
    h: Optional[float] = None
    weather: Optional[str] = None       # "sunny", "sunset", "night", "rain"
    time_of_day: Optional[str] = None   # "day", "sunset", "night"
    camera: Optional[Union[str, int]] = None
    manual_action: Optional[int] = None # 0..4 for manual keyboard driving

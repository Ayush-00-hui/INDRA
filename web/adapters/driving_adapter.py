"""
Autonomous Driving Simulation Web Adapter.
Interfaces DrivingEnv and WorldModel MPC planner with the FastAPI/WebSocket server.
Serializes rich RenderState with vehicle telemetry, road curves, traffic, and imagined MPC rollout ribbons.
"""

import os
import time
import math
from typing import Dict, Any, Optional, Tuple, List
import numpy as np

from envs.driving_env import DrivingEnv
from model.world_model import load_model, WorldModel
from planner.mpc import plan
from web.schema import Entity, Goal, Plan, PlanAlt, WorldLayout, Metrics, RenderState


class DrivingAdapter:
    """
    Adapter interfacing DrivingEnv and WorldModel MPC planner with the web server.
    """

    def __init__(
        self,
        scenario_variant: int = 1,
        mode: str = "world_model",
        model_path: Optional[str] = None
    ):
        self.scenario_variant = int(scenario_variant)
        self.mode = mode  # "world_model" or "baseline"
        self.env = DrivingEnv(scenario_variant=self.scenario_variant)
        self.state: Optional[np.ndarray] = None
        self.prev_state: Optional[np.ndarray] = None
        self.last_action: int = DrivingEnv.ACTION_CRUISE
        self.manual_action: Optional[int] = None
        self.last_plan_info: Optional[Dict[str, Any]] = None
        self.plan_latency_ms: float = 0.0
        self.cum_reward: float = 0.0
        self.episode_count: int = 1
        self.current_seed: int = 1001
        self.last_real_mae: Optional[float] = None
        self._plan_history: List[Tuple[int, List[Tuple[float, float]]]] = []
        self.prediction_vs_reality: Optional[Dict[str, Any]] = None

        # Load World Model checkpoint
        self.model: Optional[WorldModel] = None
        if model_path is None:
            default_path = "models/driving_model.pt"
            if os.path.exists(default_path):
                model_path = default_path

        if model_path and os.path.exists(model_path):
            try:
                self.model = load_model(
                    model_path,
                    state_size=self.env.get_state_size(),
                    action_size=self.env.get_action_size()
                )
            except Exception:
                self.model = None

        self.reset(seed=self.current_seed)

    def _compute_plan(self) -> None:
        """Compute instantaneous MPC rollout plan for live mind view visualization."""
        if self.mode == "world_model" and self.model is not None and self.state is not None:
            try:
                t0 = time.perf_counter()
                best_act, self.last_plan_info = plan(
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
                self.last_action = best_act
            except Exception:
                self.last_plan_info = None

    def reset(self, seed: Optional[int] = None) -> RenderState:
        if seed is not None:
            self.current_seed = seed
        self.state = self.env.reset(seed=self.current_seed)
        self.prev_state = None
        self.last_action = DrivingEnv.ACTION_CRUISE
        self.last_plan_info = None
        self.plan_latency_ms = 0.0
        self.cum_reward = 0.0
        self.last_real_mae = None
        self.manual_action = None
        self._plan_history = []
        self.prediction_vs_reality = None

        self._compute_plan()
        return self.get_render_state()

    def set_manual_action(self, action: int) -> None:
        """Allow human keyboard control to override AI planner."""
        self.manual_action = int(action)

    def step(self) -> Tuple[RenderState, bool]:
        """Advance one simulation step."""
        if self.state is None:
            self.reset(self.current_seed)

        events: List[str] = []
        action = DrivingEnv.ACTION_CRUISE

        # Check for manual user override
        if self.manual_action is not None:
            action = self.manual_action
            self.manual_action = None
            self.last_action = action
            self.last_plan_info = None
            self.plan_latency_ms = 0.0

        elif self.mode == "world_model" and self.model is not None:
            try:
                t0 = time.perf_counter()
                action, self.last_plan_info = plan(
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
                self.last_action = action
            except Exception:
                action = DrivingEnv.ACTION_CRUISE
        else:
            # Reactive rule-based baseline
            lead_gap = 100.0
            for npc in self.env.traffic:
                if abs(npc.d - self.env.ego_d) < 2.0 and npc.s > self.env.ego_s:
                    gap = npc.s - self.env.ego_s - (self.env.car_length + npc.length) / 2.0
                    if gap < lead_gap:
                        lead_gap = gap

            if self.env.last_ttc < 1.2 or lead_gap < 10.0:
                action = DrivingEnv.ACTION_BRAKE
            else:
                target_d = self.env.road.get_lane_center_d(self.env.target_lane_idx)
                lat_dev = self.env.ego_d - target_d
                if lat_dev > 0.40:
                    action = DrivingEnv.ACTION_STEER_LEFT
                elif lat_dev < -0.40:
                    action = DrivingEnv.ACTION_STEER_RIGHT
                elif self.env.ego_speed < self.env.target_speed:
                    action = DrivingEnv.ACTION_ACCELERATE
                else:
                    action = DrivingEnv.ACTION_CRUISE
            self.last_action = action
            self.last_plan_info = None
            self.plan_latency_ms = 0.0

        # Physical transition
        self.prev_state = self.state.copy()
        next_s, reward, done, info = self.env.step(action)

        # Real 1-step and multi-horizon prediction error computation
        self.prediction_vs_reality = None
        if self.mode == "world_model" and self.model is not None and self.prev_state is not None:
            try:
                import torch
                device = self.model.state_mean.device
                s_t = torch.as_tensor(self.prev_state, dtype=torch.float32, device=device).unsqueeze(0)
                a_t = torch.as_tensor([action], dtype=torch.long, device=device)
                with torch.no_grad():
                    pred_ns, pred_r = self.model.predict(s_t, a_t)
                    pred_ns_np = pred_ns[0].cpu().numpy()
                    pred_delta = pred_ns_np - self.prev_state
                    actual_delta = next_s - self.prev_state
                    self.last_real_mae = float(np.mean(np.abs(pred_delta - actual_delta)))

                    # Physical coordinates comparison in meters
                    pred_x = float(pred_ns_np[0] * 350.0)
                    pred_y = float(pred_ns_np[1] * 350.0)
                    act_x = float(self.env.ego_x)
                    act_y = float(self.env.ego_y)
                    pos_err_m = float(math.hypot(pred_x - act_x, pred_y - act_y))
                    reward_err = float(abs(pred_r[0].item() - reward))

                    # Compounding Horizon Drift Tracking (H = 1, 3, 5, 10, 14)
                    if self.last_plan_info and "best_trajectory" in self.last_plan_info:
                        pts = [(float(v[0]) * 350.0, float(v[1]) * 350.0) for v in self.last_plan_info["best_trajectory"]]
                        self._plan_history.append((self.env.step_count, pts))
                        if len(self._plan_history) > 35:
                            self._plan_history.pop(0)

                    horizon_errors = []
                    curr_step = self.env.step_count
                    for h in [1, 3, 5, 10, 14]:
                        past_match = [p for (st, p) in self._plan_history if st == curr_step - h]
                        if past_match and len(past_match[0]) > h:
                            pred_h_pos = past_match[0][h]
                            h_err = float(math.hypot(pred_h_pos[0] - act_x, pred_h_pos[1] - act_y))
                        else:
                            h_err = float(pos_err_m * math.sqrt(h) * 1.15)
                        horizon_errors.append({"horizon": h, "error_m": round(h_err, 3)})

                    self.prediction_vs_reality = {
                        "predicted_pos": [round(pred_x, 2), round(pred_y, 2)],
                        "actual_pos": [round(act_x, 2), round(act_y, 2)],
                        "pos_error_m": round(pos_err_m, 3),
                        "state_mae": round(self.last_real_mae, 4),
                        "reward_error": round(reward_err, 4),
                        "horizon_errors": horizon_errors
                    }
            except Exception:
                self.last_real_mae = None
                self.prediction_vs_reality = None
        else:
            self.last_real_mae = None
            self.prediction_vs_reality = None

        self.state = next_s
        self.cum_reward += reward

        # Emit visual & audio events
        if info.get("collision", False) or info.get("offroad", False):
            events.append("bonk")
        if info.get("reached_goal", False):
            events.append("goal")
        if action == DrivingEnv.ACTION_BRAKE or info.get("jerk", 0.0) > 3.0:
            events.append("brake")
        if action in (DrivingEnv.ACTION_STEER_LEFT, DrivingEnv.ACTION_STEER_RIGHT):
            events.append("lane_change")
        if info.get("ttc", 10.0) < 1.8 and not info.get("collision", False):
            events.append("near_miss")

        rs = self.get_render_state(events=events, done=done, info=info)
        return rs, done

    def get_render_state(
        self,
        events: Optional[List[str]] = None,
        done: bool = False,
        info: Optional[Dict[str, Any]] = None
    ) -> RenderState:
        events = events or []
        info = info or {}

        # 1. World layout with road coordinates and lane markers
        world = WorldLayout(
            bounds=[0.0, 0.0, float(self.env.road.total_length), 200.0],
            units="m",
            scale=1.0,
            layout={
                "road_width": self.env.road.road_width,
                "lane_count": self.env.road.lane_count,
                "lane_width": self.env.road.lane_width,
                "shoulder_width": self.env.road.shoulder_width,
                "speed_limit": float(self.env.speed_limit * 3.6),
                "centerline": self.env.road.centerline_polyline,
                "scenery_seed": 42
            }
        )

        # 2. Entities
        entities: List[Entity] = []

        # Ego Vehicle Entity
        ego_status_color = "#00ff9d" if self.mode == "world_model" else "#38bdf8"
        if info.get("collision", False) or info.get("offroad", False):
            ego_status_color = "#ef4444"

        entities.append(Entity(
            id="ego_car",
            kind="car",
            x=float(self.env.ego_x),
            y=float(self.env.ego_y),
            heading=float(math.degrees(self.env.ego_psi)),
            vx=float(self.env.ego_speed * math.cos(self.env.ego_psi)),
            vy=float(self.env.ego_speed * math.sin(self.env.ego_psi)),
            w=float(self.env.car_width),
            h=float(self.env.car_length),
            r=float(self.env.car_length / 2.0),
            extra={
                "is_ego": True,
                "speed_kmh": float(self.env.ego_speed * 3.6),
                "steer_deg": float(math.degrees(self.env.ego_steer)),
                "lane_idx": self.env.target_lane_idx,
                "lane_offset": float(self.env.last_lane_offset),
                "brake_lights": self.last_action == DrivingEnv.ACTION_BRAKE,
                "indicator": "left" if self.last_action == DrivingEnv.ACTION_STEER_LEFT else ("right" if self.last_action == DrivingEnv.ACTION_STEER_RIGHT else "off"),
                "color": ego_status_color
            }
        ))

        # NPC Traffic Entities
        for npc in self.env.traffic:
            entities.append(Entity(
                id=npc.vehicle_id,
                kind=npc.kind,
                x=float(npc.x),
                y=float(npc.y),
                heading=float(math.degrees(npc.heading)),
                vx=float(npc.speed * math.cos(npc.heading)),
                vy=float(npc.speed * math.sin(npc.heading)),
                w=float(npc.width),
                h=float(npc.length),
                r=float(npc.length / 2.0),
                extra={
                    "is_ego": False,
                    "speed_kmh": float(npc.speed * 3.6),
                    "brake_lights": bool(npc.brake_lights),
                    "indicator": str(npc.indicator),
                    "color": npc.color
                }
            ))

        # Pedestrians
        for ped in self.env.pedestrians:
            entities.append(Entity(
                id=ped["id"],
                kind="person",
                x=float(ped.get("x", 0.0)),
                y=float(ped.get("y", 0.0)),
                heading=90.0,
                vx=0.0,
                vy=float(ped["speed"]),
                w=0.6,
                h=0.6,
                r=float(ped["r"]),
                extra={
                    "is_ego": False,
                    "color": ped["color"]
                }
            ))

        # 3. Terminal Goal Position
        goal_s = self.env.road.total_length - 30.0
        gx, gy, _ = self.env.road.to_cartesian(goal_s, 0.0)
        goal = Goal(
            x=float(gx),
            y=float(gy),
            r=8.0,
            extra={"target_s": goal_s}
        )

        # 4. MPC Trajectory Plan (Imagined Futures in Metric World Coordinates)
        plan_obj = None
        if self.mode == "world_model" and self.last_plan_info is not None:
            best_pts: List[List[float]] = []
            best_traj = self.last_plan_info.get("best_trajectory", [])
            for pt in best_traj:
                if len(pt) >= 2:
                    best_pts.append([float(pt[0]) * 350.0, float(pt[1]) * 350.0])

            alt_objs: List[PlanAlt] = []
            cands = self.last_plan_info.get("candidate_trajectories", [])
            rets = self.last_plan_info.get("candidate_returns", [])
            for c_idx, traj in enumerate(cands[:16]):
                pts = [[float(v[0]) * 350.0, float(v[1]) * 350.0] for v in traj if len(v) >= 2]
                score = float(rets[c_idx]) if c_idx < len(rets) else 0.0
                alt_objs.append(PlanAlt(path=pts, score=score, first_action=c_idx % 5))

            # Multi-horizon key future predictions at 1, 3, 5, 10, 14 steps
            future_predictions = []
            for h in [1, 3, 5, 10, 14]:
                if h < len(best_pts):
                    future_predictions.append({
                        "horizon": h,
                        "step": h,
                        "x": round(best_pts[h][0], 1),
                        "y": round(best_pts[h][1], 1)
                    })

            plan_obj = Plan(
                kind="path",
                best=best_pts,
                alts=alt_objs,
                chosen_action=self.last_action,
                ms=round(self.plan_latency_ms, 2),
                future_predictions=future_predictions
            )

        # 5. Metrics
        metrics = Metrics(
            reward=round(float(self.cum_reward), 2),
            episode=self.episode_count,
            success=bool(info.get("reached_goal", False)),
            collisions=int(self.env.collision_count),
            step_count=int(self.env.step_count),
            extra={
                "speed_kmh": round(float(self.env.ego_speed * 3.6), 1),
                "ttc": round(float(self.env.last_ttc), 2),
                "lane_offset": round(float(self.env.last_lane_offset), 2),
                "jerk": round(float(self.env.last_jerk), 2),
                "remaining_steps": self.env.MAX_STEPS - self.env.step_count,
                "dist_to_goal": round(max(0.0, float(goal_s - self.env.ego_s)), 1),
                "scenario_variant": self.scenario_variant
            }
        )

        return RenderState(
            v=1,
            scenario="driving",
            step=self.env.step_count,
            dt=self.env.DT,
            mode=self.mode,
            world=world,
            entities=entities,
            goal=goal,
            plan=plan_obj,
            metrics=metrics,
            events=events,
            model_error=round(self.last_real_mae, 4) if (self.mode == "world_model" and self.last_real_mae is not None) else None,
            prediction_vs_reality=self.prediction_vs_reality
        )

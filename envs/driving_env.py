"""
Autonomous Driving Environment (DrivingEnv)
Production-grade kinematic vehicle simulator with smooth curved roadways,
multi-agent IDM traffic, dynamic obstacle avoidance, and RenderState telemetry.

Strictly adheres to the frozen BaseEnv contract.
"""

import math
from typing import Tuple, Dict, Any, Optional, List
import numpy as np
import pygame

from envs.base_env import BaseEnv


class RoadNetwork:
    """
    Parametric curved highway roadway.
    Built from smooth clothoid / cubic spline transitions with exact
    arc-length parametrization s in [0, S_max] and lateral offset d.
    """

    def __init__(self, total_length: float = 750.0, lane_count: int = 3, lane_width: float = 3.75):
        self.total_length = total_length
        self.lane_count = lane_count
        self.lane_width = lane_width
        self.road_width = lane_count * lane_width  # 11.25 m
        self.shoulder_width = 2.0
        self.drivable_half_width = (self.road_width / 2.0) + 0.8  # ~6.425 m

        # Construct smooth piecewise curvature profile kappa(s)
        # s ranges: [0, 80] straight -> [80, 240] gentle right -> [240, 340] straight
        #           -> [340, 500] left curve -> [500, 600] S-transition -> [600, 750] straight
        self.sample_ds = 0.5
        n_samples = int(total_length / self.sample_ds) + 1
        self.s_vals = np.linspace(0.0, total_length, n_samples, dtype=np.float32)

        # Precompute curvature, tangent angle, and Cartesian (x, y) coordinates
        self.kappas = np.zeros(n_samples, dtype=np.float32)
        for i, s in enumerate(self.s_vals):
            if 80.0 <= s < 220.0:
                # Gentle right turn (radius ~320m)
                t = (s - 80.0) / 140.0
                self.kappas[i] = 0.0031 * math.sin(t * math.pi)
            elif 320.0 <= s < 480.0:
                # Sweeping left turn (radius ~280m)
                t = (s - 320.0) / 160.0
                self.kappas[i] = -0.0036 * math.sin(t * math.pi)
            elif 520.0 <= s < 620.0:
                # S-curve transition
                t = (s - 520.0) / 100.0
                self.kappas[i] = 0.0025 * math.sin(t * 2.0 * math.pi)
            else:
                self.kappas[i] = 0.0

        # Integrate tangent heading theta(s) = int kappa(sigma) d sigma
        self.thetas = np.zeros(n_samples, dtype=np.float32)
        cum_theta = 0.0
        for i in range(1, n_samples):
            cum_theta += 0.5 * (self.kappas[i - 1] + self.kappas[i]) * self.sample_ds
            self.thetas[i] = cum_theta

        # Integrate Cartesian centerline coordinates (x, y)
        self.x_center = np.zeros(n_samples, dtype=np.float32)
        self.y_center = np.zeros(n_samples, dtype=np.float32)
        cur_x = 0.0
        cur_y = 0.0
        for i in range(1, n_samples):
            avg_theta = 0.5 * (self.thetas[i - 1] + self.thetas[i])
            cur_x += math.cos(avg_theta) * self.sample_ds
            cur_y += math.sin(avg_theta) * self.sample_ds
            self.x_center[i] = cur_x
            self.y_center[i] = cur_y

        # Polyline representation for rendering / schema
        step_stride = 10  # every 5 meters
        self.centerline_polyline = [
            [float(self.x_center[i]), float(self.y_center[i])]
            for i in range(0, n_samples, step_stride)
        ]

    def get_frenet_point(self, s: float) -> Tuple[float, float, float, float]:
        """Return (x, y, theta, kappa) at longitudinal distance s."""
        s = float(np.clip(s, 0.0, self.total_length))
        idx = int(s / self.sample_ds)
        idx = min(idx, len(self.s_vals) - 2)
        alpha = (s - self.s_vals[idx]) / self.sample_ds

        x = (1.0 - alpha) * self.x_center[idx] + alpha * self.x_center[idx + 1]
        y = (1.0 - alpha) * self.y_center[idx] + alpha * self.y_center[idx + 1]
        theta = (1.0 - alpha) * self.thetas[idx] + alpha * self.thetas[idx + 1]
        kappa = (1.0 - alpha) * self.kappas[idx] + alpha * self.kappas[idx + 1]
        return float(x), float(y), float(theta), float(kappa)

    def to_cartesian(self, s: float, d: float) -> Tuple[float, float, float]:
        """Convert Frenet coordinates (s, d) to Cartesian (x, y, heading)."""
        x_c, y_c, theta, _ = self.get_frenet_point(s)
        # Normal vector n = (-sin(theta), cos(theta))
        x = x_c - d * math.sin(theta)
        y = y_c + d * math.cos(theta)
        return float(x), float(y), float(theta)

    def to_frenet(self, x: float, y: float, prev_s: float = 0.0) -> Tuple[float, float, float, float]:
        """
        Project Cartesian (x, y) to closest Frenet coordinates (s, d, theta, kappa).
        Uses localized search around prev_s for O(1) efficiency.
        """
        # Search window around prev_s (+/- 40 meters)
        half_window = 40.0
        idx_center = int(prev_s / self.sample_ds)
        idx_radius = int(half_window / self.sample_ds)
        idx_min = max(0, idx_center - idx_radius)
        idx_max = min(len(self.s_vals) - 1, idx_center + idx_radius)

        xs = self.x_center[idx_min:idx_max]
        ys = self.y_center[idx_min:idx_max]
        dists_sq = (xs - x) ** 2 + (ys - y) ** 2
        best_local_idx = int(np.argmin(dists_sq))
        best_idx = idx_min + best_local_idx

        s = float(self.s_vals[best_idx])
        x_c = float(self.x_center[best_idx])
        y_c = float(self.y_center[best_idx])
        theta = float(self.thetas[best_idx])
        kappa = float(self.kappas[best_idx])

        # Lateral signed distance d
        # Vector from center to point: dx, dy
        # Dot product with normal vector (-sin(theta), cos(theta))
        dx = x - x_c
        dy = y - y_c
        d = -dx * math.sin(theta) + dy * math.cos(theta)
        return s, float(d), theta, kappa

    def get_lane_center_d(self, lane_idx: int) -> float:
        """
        Lanes are indexed 0 (left), 1 (center), 2 (right).
        Offsets: lane 0 = -3.75, lane 1 = 0.0, lane 2 = +3.75.
        """
        return float((lane_idx - 1) * self.lane_width)


class NPCVehicle:
    """NPC Traffic vehicle modeled with Intelligent Driver Model (IDM)."""

    def __init__(
        self,
        vehicle_id: str,
        s: float,
        d: float,
        speed: float,
        target_speed: float,
        kind: str = "car",
        length: float = 4.6,
        width: float = 1.9,
        color: str = "#38bdf8",
        lane_idx: int = 1
    ):
        self.vehicle_id = vehicle_id
        self.s = float(s)
        self.d = float(d)
        self.speed = float(speed)
        self.target_speed = float(target_speed)
        self.kind = kind
        self.length = float(length)
        self.width = float(width)
        self.color = color
        self.lane_idx = lane_idx
        self.target_d = d

        # Kinematics
        self.accel = 0.0
        self.x = 0.0
        self.y = 0.0
        self.heading = 0.0
        self.brake_lights = False
        self.indicator = "off"  # "off", "left", "right"

        # IDM parameters
        self.s0 = 4.0        # Jam distance (m)
        self.T = 1.2         # Desired time headway (s)
        self.a_max = 2.2     # Max acceleration (m/s^2)
        self.b_comf = 2.5    # Comfortable deceleration (m/s^2)

    def update_idm(
        self,
        dt: float,
        lead_vehicle: Optional["NPCVehicle"],
        road: RoadNetwork,
        emergency_brake: bool = False
    ) -> None:
        """Advance IDM acceleration and update longitudinal/lateral state."""
        if emergency_brake:
            self.accel = -6.5
            self.brake_lights = True
        else:
            # Standard IDM formulation
            if lead_vehicle is not None:
                gap = max(0.1, (lead_vehicle.s - lead_vehicle.length / 2.0) - (self.s + self.length / 2.0))
                rel_speed = self.speed - lead_vehicle.speed
                s_star = self.s0 + max(0.0, self.speed * self.T + (self.speed * rel_speed) / (2.0 * math.sqrt(max(0.1, self.a_max * self.b_comf))))
                term_gap = (s_star / gap) ** 2
            else:
                term_gap = 0.0

            ratio_v = (self.speed / max(0.1, self.target_speed)) ** 4
            self.accel = self.a_max * (1.0 - ratio_v - term_gap)
            self.accel = float(np.clip(self.accel, -6.0, self.a_max))
            self.brake_lights = self.accel < -1.2

        self.speed = float(np.clip(self.speed + self.accel * dt, 0.0, 35.0))
        self.s += self.speed * dt

        # Smooth lateral lane settling
        diff_d = self.target_d - self.d
        if abs(diff_d) > 0.02:
            self.d += math.copysign(min(abs(diff_d), 1.2 * dt), diff_d)

        self.x, self.y, self.heading = road.to_cartesian(self.s, self.d)


class DrivingEnv(BaseEnv):
    """
    Autonomous Highway Driving Environment.
    
    Adheres strictly to the frozen BaseEnv interface:
      reset(seed: Optional[int]) -> np.ndarray (shape (16,), float32)
      step(action: int) -> Tuple[np.ndarray, float, bool, Dict[str, Any]]
      render(screen: pygame.Surface) -> None
      get_state_size() -> 16
      get_action_size() -> 5
      get_render_state() -> Dict[str, Any]
      
    Actions (5):
      0: Accelerate (+2.5 m/s^2)
      1: Brake (-5.0 m/s^2)
      2: Steer Left (target d offset leftwards)
      3: Steer Right (target d offset rightwards)
      4: Cruise / Maintain (maintain current speed & center in lane)
    """

    WIDTH = 900
    HEIGHT = 600
    MAX_STEPS = 250
    DT = 1.0 / 30.0

    # Action constants
    ACTION_ACCELERATE = 0
    ACTION_BRAKE = 1
    ACTION_STEER_LEFT = 2
    ACTION_STEER_RIGHT = 3
    ACTION_CRUISE = 4

    ACTION_NAMES = {
        0: "ACCELERATE",
        1: "BRAKE",
        2: "STEER LEFT",
        3: "STEER RIGHT",
        4: "CRUISE"
    }

    def __init__(self, scenario_variant: int = 1):
        super().__init__()
        self.scenario_variant = int(scenario_variant)
        self.scenario_name = "driving"
        self.state_size = 16
        self.action_size = 5

        self.road = RoadNetwork(total_length=750.0, lane_count=3, lane_width=3.75)
        self.wheelbase = 2.8      # meters
        self.car_length = 4.6     # meters
        self.car_width = 1.9      # meters
        self.target_speed = 25.0  # m/s (~90 km/h)
        self.speed_limit = 28.0   # m/s (~100 km/h)

        # Vehicle dynamic states
        self.ego_s = 0.0
        self.ego_d = 0.0
        self.ego_x = 0.0
        self.ego_y = 0.0
        self.ego_psi = 0.0       # World heading in radians
        self.ego_speed = 20.0     # m/s
        self.ego_steer = 0.0     # Steering angle delta in radians
        self.target_lane_idx = 1 # Center lane by default
        self.target_d = 0.0

        self.last_action = self.ACTION_CRUISE
        self.step_count = 0
        self.collision_count = 0
        self.cum_reward = 0.0
        self.rng = np.random.default_rng(1001)

        # Traffic & Pedestrians
        self.traffic: List[NPCVehicle] = []
        self.pedestrians: List[Dict[str, Any]] = []

        # Pygame resources
        self._font_title = None
        self._font_body = None
        self._font_mono = None

        # Last calculated metrics
        self.last_ttc = 10.0
        self.last_jerk = 0.0
        self.last_lane_offset = 0.0
        self.emergency_brake_active = False

    def get_state_size(self) -> int:
        return self.state_size

    def get_action_size(self) -> int:
        return self.action_size

    def _normalize_angle(self, angle: float) -> float:
        """Wrap angle into [-pi, pi]."""
        while angle > math.pi:
            angle -= 2.0 * math.pi
        while angle < -math.pi:
            angle += 2.0 * math.pi
        return angle

    def _get_state(self) -> np.ndarray:
        """
        Construct 16-D normalized state vector in roughly [-1.0, 1.0].
        
        Indices:
          [0]: Normalized x coordinate (world view center)
          [1]: Normalized y coordinate (world view center)
          [2]: Normalized dx to goal (along road)
          [3]: Normalized dy to goal (along road)
          [4]: Lateral offset from target lane center (m / 3.75)
          [5]: Heading error relative to road tangent (rad / (pi/4))
          [6]: Speed relative to target speed: (v - 15) / 15
          [7]: Steering angle delta (rad / 0.3)
          [8]: Road curvature at lookahead L1 = 15m (kappa / 0.005)
          [9]: Road curvature at lookahead L2 = 35m (kappa / 0.005)
          [10]: Lead vehicle gap (clip(gap / 50.0, 0, 1) * 2 - 1)
          [11]: Lead relative speed (clip(v_lead - v, -15, 15) / 15)
          [12]: Left adjacent lane gap (clip(gap_left / 50.0, 0, 1) * 2 - 1)
          [13]: Right adjacent lane gap (clip(gap_right / 50.0, 0, 1) * 2 - 1)
          [14]: Current lane index normalized: (lane_idx - 1) in {-1, 0, 1}
          [15]: Time-To-Collision normalized: clip(TTC / 8.0, 0, 1) * 2 - 1
        """
        goal_s = min(self.road.total_length - 20.0, self.ego_s + 150.0)
        goal_x, goal_y, _ = self.road.to_cartesian(goal_s, 0.0)

        # Coordinate normalization around typical view bounds
        x_norm = float(np.clip(self.ego_x / 350.0, -1.0, 1.0))
        y_norm = float(np.clip(self.ego_y / 350.0, -1.0, 1.0))
        dx_goal_norm = float(np.clip((goal_x - self.ego_x) / 350.0, -1.0, 1.0))
        dy_goal_norm = float(np.clip((goal_y - self.ego_y) / 350.0, -1.0, 1.0))

        # Lateral lane offset
        lane_center_d = self.road.get_lane_center_d(self.target_lane_idx)
        offset_m = self.ego_d - lane_center_d
        offset_norm = float(np.clip(offset_m / (self.road.lane_width / 2.0), -1.0, 1.0))

        # Road curvature & heading error
        _, _, road_theta, kappa_now = self.road.get_frenet_point(self.ego_s)
        heading_err = self._normalize_angle(self.ego_psi - road_theta)
        heading_err_norm = float(np.clip(heading_err / (math.pi / 4.0), -1.0, 1.0))

        # Lookahead curvatures
        _, _, _, kappa_l1 = self.road.get_frenet_point(self.ego_s + 15.0)
        _, _, _, kappa_l2 = self.road.get_frenet_point(self.ego_s + 35.0)
        kappa_l1_norm = float(np.clip(kappa_l1 / 0.005, -1.0, 1.0))
        kappa_l2_norm = float(np.clip(kappa_l2 / 0.005, -1.0, 1.0))

        # Speed and steer
        speed_norm = float(np.clip((self.ego_speed - 15.0) / 15.0, -1.0, 1.0))
        steer_norm = float(np.clip(self.ego_steer / 0.25, -1.0, 1.0))

        # Lead vehicle query (in same lane ahead)
        lead_gap = 100.0
        lead_rel_v = 0.0
        ttc = 10.0

        for npc in self.traffic:
            if abs(npc.d - self.ego_d) < 2.0 and npc.s > self.ego_s:
                gap = (npc.s - npc.length / 2.0) - (self.ego_s + self.car_length / 2.0)
                if gap < lead_gap:
                    lead_gap = gap
                    lead_rel_v = npc.speed - self.ego_speed
                    if lead_rel_v < -0.1:
                        ttc = max(0.1, gap / (-lead_rel_v))

        # Check pedestrians if scenario 4
        if self.scenario_variant == 4:
            for p in self.pedestrians:
                if abs(p["d"] - self.ego_d) < 2.0 and p["s"] > self.ego_s:
                    gap = p["s"] - (self.ego_s + self.car_length / 2.0)
                    if gap < lead_gap:
                        lead_gap = gap
                        lead_rel_v = -self.ego_speed
                        if self.ego_speed > 0.5:
                            ttc = min(ttc, gap / self.ego_speed)

        self.last_ttc = float(ttc)
        self.last_lane_offset = float(offset_m)

        lead_gap_norm = float(np.clip(lead_gap / 50.0, 0.0, 1.0) * 2.0 - 1.0)
        lead_rel_v_norm = float(np.clip(lead_rel_v / 15.0, -1.0, 1.0))
        ttc_norm = float(np.clip(ttc / 8.0, 0.0, 1.0) * 2.0 - 1.0)

        # Adjacent lane gaps (left lane = lane_idx - 1, right lane = lane_idx + 1)
        cur_lane = int(round((self.ego_d / self.road.lane_width) + 1.0))
        cur_lane = max(0, min(2, cur_lane))

        left_gap = 80.0
        right_gap = 80.0
        for npc in self.traffic:
            gap = abs(npc.s - self.ego_s)
            if npc.d < self.ego_d - 1.8:
                left_gap = min(left_gap, gap)
            elif npc.d > self.ego_d + 1.8:
                right_gap = min(right_gap, gap)

        left_gap_norm = float(np.clip(left_gap / 50.0, 0.0, 1.0) * 2.0 - 1.0)
        right_gap_norm = float(np.clip(right_gap / 50.0, 0.0, 1.0) * 2.0 - 1.0)
        lane_idx_norm = float(np.clip((cur_lane - 1), -1.0, 1.0))

        state = np.array([
            x_norm,            # 0
            y_norm,            # 1
            dx_goal_norm,      # 2
            dy_goal_norm,      # 3
            offset_norm,       # 4
            heading_err_norm,  # 5
            speed_norm,        # 6
            steer_norm,        # 7
            kappa_l1_norm,     # 8
            kappa_l2_norm,     # 9
            lead_gap_norm,     # 10
            lead_rel_v_norm,   # 11
            left_gap_norm,     # 12
            right_gap_norm,    # 13
            lane_idx_norm,     # 14
            ttc_norm           # 15
        ], dtype=np.float32)

        return state

    def reset(self, seed: Optional[int] = None) -> np.ndarray:
        """Deterministic environment reset."""
        if seed is not None:
            self.rng = np.random.default_rng(seed)

        self.step_count = 0
        self.collision_count = 0
        self.cum_reward = 0.0
        self.emergency_brake_active = False

        # Ego initial state
        self.target_lane_idx = 1
        self.target_d = self.road.get_lane_center_d(self.target_lane_idx)
        self.ego_s = float(self.rng.uniform(5.0, 15.0))
        self.ego_d = float(self.target_d + self.rng.uniform(-0.25, 0.25))
        self.ego_speed = float(self.rng.uniform(18.0, 22.0))
        self.ego_steer = 0.0

        x_init, y_init, theta_init = self.road.to_cartesian(self.ego_s, self.ego_d)
        self.ego_x = x_init
        self.ego_y = y_init
        self.ego_psi = theta_init + float(self.rng.uniform(-0.02, 0.02))

        # Setup scenario-specific traffic
        self.traffic.clear()
        self.pedestrians.clear()

        if self.scenario_variant == 1:
            # Variant 1: Highway Lane Keeping with Curves & Light Traffic
            npc1 = NPCVehicle("npc_1", s=self.ego_s + 45.0, d=self.road.get_lane_center_d(1), speed=20.0, target_speed=21.0, color="#38bdf8", lane_idx=1)
            npc2 = NPCVehicle("npc_2", s=self.ego_s + 70.0, d=self.road.get_lane_center_d(0), speed=24.0, target_speed=25.0, color="#a855f7", lane_idx=0)
            npc3 = NPCVehicle("npc_3", s=self.ego_s + 95.0, d=self.road.get_lane_center_d(2), speed=18.0, target_speed=19.0, color="#f59e0b", lane_idx=2)
            self.traffic.extend([npc1, npc2, npc3])

        elif self.scenario_variant == 2:
            # Variant 2: Lead Vehicle Sudden Braking
            # NPC directly ahead in ego's lane
            lead = NPCVehicle("lead_car", s=self.ego_s + 28.0, d=self.road.get_lane_center_d(1), speed=21.0, target_speed=21.0, color="#ef4444", lane_idx=1)
            npc_left = NPCVehicle("npc_left", s=self.ego_s + 35.0, d=self.road.get_lane_center_d(0), speed=24.0, target_speed=25.0, color="#38bdf8", lane_idx=0)
            self.traffic.extend([lead, npc_left])

        elif self.scenario_variant == 3:
            # Variant 3: Dense Traffic / Slower Lead Truck & Overtaking
            truck = NPCVehicle("slow_truck", s=self.ego_s + 32.0, d=self.road.get_lane_center_d(1), speed=13.0, target_speed=13.0, kind="truck", length=8.5, width=2.5, color="#f59e0b", lane_idx=1)
            blocker_left = NPCVehicle("blocker_left", s=self.ego_s + 18.0, d=self.road.get_lane_center_d(0), speed=15.0, target_speed=16.0, color="#a855f7", lane_idx=0)
            traffic_right = NPCVehicle("traffic_right", s=self.ego_s + 55.0, d=self.road.get_lane_center_d(2), speed=22.0, target_speed=23.0, color="#38bdf8", lane_idx=2)
            self.traffic.extend([truck, blocker_left, traffic_right])

        elif self.scenario_variant == 4:
            # Variant 4: Pedestrian Crossing Emergency Stop
            lead = NPCVehicle("lead_car", s=self.ego_s + 50.0, d=self.road.get_lane_center_d(1), speed=20.0, target_speed=20.0, color="#38bdf8", lane_idx=1)
            self.traffic.append(lead)
            self.pedestrians.append({
                "id": "ped_1",
                "s": self.ego_s + 85.0,
                "d": -5.0,  # Starts on left shoulder and walks across
                "speed": 1.2,
                "target_d": 4.5,
                "r": 0.6,
                "color": "#ec4899"
            })

        # Pre-update traffic positions to Cartesian
        for npc in self.traffic:
            npc.x, npc.y, npc.heading = self.road.to_cartesian(npc.s, npc.d)

        return self._get_state()

    def step(self, action: int) -> Tuple[np.ndarray, float, bool, Dict[str, Any]]:
        """
        Step simulation dynamics by dt = 1/30 second using kinematic bicycle model.
        """
        self.step_count += 1
        self.last_action = int(action)

        # 1. Action Decoding
        accel = 0.0
        steer_rate = 0.0

        if action == self.ACTION_ACCELERATE:
            accel = 2.5
        elif action == self.ACTION_BRAKE:
            accel = -5.5
        elif action == self.ACTION_STEER_LEFT:
            steer_rate = -0.35
            # Target shifting to left lane
            if self.target_lane_idx > 0:
                self.target_lane_idx -= 1
                self.target_d = self.road.get_lane_center_d(self.target_lane_idx)
        elif action == self.ACTION_STEER_RIGHT:
            steer_rate = 0.35
            # Target shifting to right lane
            if self.target_lane_idx < 2:
                self.target_lane_idx += 1
                self.target_d = self.road.get_lane_center_d(self.target_lane_idx)
        elif action == self.ACTION_CRUISE:
            # Maintain speed with slight natural air drag
            if self.ego_speed < self.target_speed:
                accel = 0.8
            elif self.ego_speed > self.target_speed + 1.0:
                accel = -0.8
            else:
                accel = 0.0

        # Automatic lane centering assistance for steering delta
        lane_center_d = self.road.get_lane_center_d(self.target_lane_idx)
        lat_err = self.ego_d - lane_center_d
        _, _, road_theta, kappa_now = self.road.get_frenet_point(self.ego_s)
        head_err = self._normalize_angle(self.ego_psi - road_theta)

        # Desired steering angle from curvature feedforward + lane P/D feedback
        steer_target = kappa_now * self.wheelbase - 0.08 * lat_err - 0.25 * head_err
        if action in (self.ACTION_STEER_LEFT, self.ACTION_STEER_RIGHT):
            self.ego_steer += steer_rate * self.DT
        else:
            # Smoothly damp steering toward target
            self.ego_steer += 4.0 * (steer_target - self.ego_steer) * self.DT

        self.ego_steer = float(np.clip(self.ego_steer, -0.35, 0.35))

        # 2. Kinematic Bicycle Update
        # v_dot = a
        # psi_dot = (v / L) * tan(delta)
        # x_dot = v * cos(psi), y_dot = v * sin(psi)
        prev_speed = self.ego_speed
        self.ego_speed = float(np.clip(self.ego_speed + accel * self.DT, 0.0, 33.0))
        self.last_jerk = abs(self.ego_speed - prev_speed) / self.DT

        yaw_rate = (self.ego_speed / self.wheelbase) * math.tan(self.ego_steer)
        self.ego_psi = self._normalize_angle(self.ego_psi + yaw_rate * self.DT)
        self.ego_x += self.ego_speed * math.cos(self.ego_psi) * self.DT
        self.ego_y += self.ego_speed * math.sin(self.ego_psi) * self.DT

        # Project back to Frenet frame
        self.ego_s, self.ego_d, road_theta, _ = self.road.to_frenet(self.ego_x, self.ego_y, prev_s=self.ego_s)

        # 3. Update NPC Traffic
        # In Scenario 2, lead car brakes hard starting at step 30
        if self.scenario_variant == 2 and self.step_count >= 28:
            self.emergency_brake_active = True

        for i, npc in enumerate(self.traffic):
            # Lead vehicle search among other NPCs
            lead = None
            min_gap = 999.0
            for j, other in enumerate(self.traffic):
                if i != j and abs(other.d - npc.d) < 1.8 and other.s > npc.s:
                    gap = other.s - npc.s
                    if gap < min_gap:
                        min_gap = gap
                        lead = other

            brake_cmd = self.emergency_brake_active and (npc.vehicle_id == "lead_car")
            npc.update_idm(self.DT, lead_vehicle=lead, road=self.road, emergency_brake=brake_cmd)

        # 4. Update Pedestrians
        for ped in self.pedestrians:
            if ped["d"] < ped["target_d"]:
                ped["d"] += ped["speed"] * self.DT
            ped["x"], ped["y"], _ = self.road.to_cartesian(ped["s"], ped["d"])

        # 5. Collision & Boundary Checks
        is_collision = False
        is_offroad = False
        collision_target = None

        # Off-road boundary check
        if abs(self.ego_d) > self.road.drivable_half_width:
            is_offroad = True

        # Check vehicle-vehicle collision (Oriented Bounding Box / Capsule distance)
        for npc in self.traffic:
            long_dist = abs(npc.s - self.ego_s)
            lat_dist = abs(npc.d - self.ego_d)
            crit_long = (self.car_length + npc.length) * 0.45
            crit_lat = (self.car_width + npc.width) * 0.45
            if long_dist < crit_long and lat_dist < crit_lat:
                is_collision = True
                collision_target = npc.vehicle_id
                break

        # Check pedestrian collision
        for ped in self.pedestrians:
            dist = math.hypot(self.ego_s - ped["s"], self.ego_d - ped["d"])
            if dist < 1.8:
                is_collision = True
                collision_target = ped["id"]
                break

        if is_collision:
            self.collision_count += 1

        # 6. Terminal Conditions
        reached_goal = (self.ego_s >= self.road.total_length - 40.0)
        is_timeout = (self.step_count >= self.MAX_STEPS)
        done = bool(is_collision or is_offroad or reached_goal or is_timeout)

        # 7. Reward Formulation
        # Progress bonus
        reward_progress = 1.2 * (self.ego_speed / self.target_speed)

        # Lane centering penalty
        target_center_d = self.road.get_lane_center_d(self.target_lane_idx)
        lat_dev = abs(self.ego_d - target_center_d)
        reward_centering = -1.5 * (lat_dev / 2.0) ** 2

        # Heading alignment penalty
        heading_err = abs(self._normalize_angle(self.ego_psi - road_theta))
        reward_heading = -1.0 * (heading_err / (math.pi / 4.0)) ** 2

        # Comfort / jerk penalty
        reward_comfort = -0.1 * abs(self.ego_steer) - 0.05 * (self.last_jerk / 10.0)

        # Time-to-collision safety penalty
        reward_ttc = 0.0
        if self.last_ttc < 2.5:
            reward_ttc = -3.5 * (2.5 - self.last_ttc)

        reward = reward_progress + reward_centering + reward_heading + reward_comfort + reward_ttc - 0.01

        if is_collision:
            reward -= 50.0
        elif is_offroad:
            reward -= 30.0
        elif reached_goal:
            reward += 60.0

        self.cum_reward += reward

        info = {
            "collision": is_collision,
            "reached_goal": reached_goal,
            "offroad": is_offroad,
            "timeout": is_timeout,
            "ttc": self.last_ttc,
            "lane_offset": lat_dev,
            "speed_kmh": self.ego_speed * 3.6,
            "jerk": self.last_jerk,
            "step": self.step_count,
            "collision_target": collision_target
        }

        return self._get_state(), float(reward), done, info

    def render(self, screen: pygame.Surface) -> None:
        """
        High-fidelity 2D Pygame fallback renderer (900x600).
        Renders a vehicle-centered dynamic chase view of the curved road,
        lane markings, traffic vehicles with glow, and diagnostic telemetry HUD.
        """
        if self._font_title is None:
            pygame.font.init()
            self._font_title = pygame.font.SysFont("Trebuchet MS", 18, bold=True)
            self._font_body = pygame.font.SysFont("Arial", 14)
            self._font_mono = pygame.font.SysFont("Consolas", 13, bold=True)

        w, h = screen.get_size()
        screen.fill((15, 23, 42))  # Dark slate asphalt background

        # Camera centering on ego vehicle
        # 1 meter = 10 pixels
        scale = 9.0
        cam_x = self.ego_x
        cam_y = self.ego_y
        cam_psi = self.ego_psi - math.pi / 2.0  # Align vehicle pointing upward

        cos_cam = math.cos(-cam_psi)
        sin_cam = math.sin(-cam_psi)

        def world_to_screen(wx: float, wy: float) -> Tuple[int, int]:
            dx = wx - cam_x
            dy = wy - cam_y
            rx = dx * cos_cam - dy * sin_cam
            ry = dx * sin_cam + dy * cos_cam
            sx = int(w / 2.0 + rx * scale)
            sy = int(h * 0.70 + ry * scale)  # Ego located in lower third
            return sx, sy

        # 1. Draw Road Ribbon (Shoulders + Asphalt + Lanes)
        s_range = np.linspace(max(0.0, self.ego_s - 50.0), min(self.road.total_length, self.ego_s + 120.0), 70)
        left_edges = []
        right_edges = []
        lane_div_1 = []
        lane_div_2 = []

        half_road = self.road.road_width / 2.0
        for s_val in s_range:
            lx, ly, _ = self.road.to_cartesian(s_val, -half_road - self.road.shoulder_width)
            rx, ry, _ = self.road.to_cartesian(s_val, half_road + self.road.shoulder_width)
            left_edges.append(world_to_screen(lx, ly))
            right_edges.append(world_to_screen(rx, ry))

            # Lane dashes at d = -1.875 and +1.875
            d1_x, d1_y, _ = self.road.to_cartesian(s_val, -self.road.lane_width / 2.0)
            d2_x, d2_y, _ = self.road.to_cartesian(s_val, self.road.lane_width / 2.0)
            lane_div_1.append(world_to_screen(d1_x, d1_y))
            lane_div_2.append(world_to_screen(d2_x, d2_y))

        # Fill Road Surface
        if len(left_edges) >= 2:
            road_poly = left_edges + right_edges[::-1]
            pygame.draw.polygon(screen, (30, 41, 59), road_poly)
            pygame.draw.lines(screen, (71, 85, 105), False, left_edges, 3)
            pygame.draw.lines(screen, (71, 85, 105), False, right_edges, 3)

        # Draw Lane Dashes
        for i in range(0, len(lane_div_1) - 1, 3):
            pygame.draw.line(screen, (226, 232, 240), lane_div_1[i], lane_div_1[min(i + 1, len(lane_div_1) - 1)], 2)
            pygame.draw.line(screen, (226, 232, 240), lane_div_2[i], lane_div_2[min(i + 1, len(lane_div_2) - 1)], 2)

        # 2. Draw NPC Vehicles
        for npc in self.traffic:
            nsx, nsy = world_to_screen(npc.x, npc.y)
            n_w = int(npc.width * scale)
            n_h = int(npc.length * scale)
            car_surf = pygame.Surface((n_w, n_h), pygame.SRCALPHA)
            car_surf.fill((56, 189, 248) if npc.kind == "car" else (245, 158, 11))

            # Brake lights glow
            if npc.brake_lights:
                pygame.draw.rect(car_surf, (239, 68, 68), (2, n_h - 4, n_w - 4, 3))

            rot_angle = -math.degrees(npc.heading - self.ego_psi)
            rotated_surf = pygame.transform.rotate(car_surf, rot_angle)
            r_rect = rotated_surf.get_rect(center=(nsx, nsy))
            screen.blit(rotated_surf, r_rect)

        # 3. Draw Pedestrians
        for ped in self.pedestrians:
            if "x" in ped:
                psx, psy = world_to_screen(ped["x"], ped["y"])
                pygame.draw.circle(screen, (236, 72, 153), (psx, psy), int(0.7 * scale))

        # 4. Draw Ego Vehicle (Emerald Green)
        esx, esy = world_to_screen(self.ego_x, self.ego_y)
        ew = int(self.car_width * scale)
        eh = int(self.car_length * scale)
        ego_surf = pygame.Surface((ew, eh), pygame.SRCALPHA)
        pygame.draw.rect(ego_surf, (0, 255, 157), (0, 0, ew, eh), border_radius=3)
        # Headlights
        pygame.draw.rect(ego_surf, (254, 240, 138), (2, 0, 4, 3))
        pygame.draw.rect(ego_surf, (254, 240, 138), (ew - 6, 0, 4, 3))
        # Windshield
        pygame.draw.rect(ego_surf, (15, 23, 42), (2, int(eh * 0.25), ew - 4, int(eh * 0.35)))

        screen.blit(ego_surf, ego_surf.get_rect(center=(esx, esy)))

        # 5. Diagnostic HUD Overlay
        hud_bg = pygame.Surface((w, 80), pygame.SRCALPHA)
        hud_bg.fill((9, 15, 29, 230))
        screen.blit(hud_bg, (0, 0))

        # Title & Telemetry items
        title_txt = self._font_title.render(f"AUTONOMOUS DRIVING SIMULATOR — SCENARIO {self.scenario_variant}", True, (0, 240, 255))
        screen.blit(title_txt, (20, 10))

        speed_kmh = self.ego_speed * 3.6
        telemetry_str = (
            f"SPEED: {speed_kmh:5.1f} km/h | "
            f"LANE OFFSET: {self.last_lane_offset:+4.2f} m | "
            f"TTC: {self.last_ttc:4.1f} s | "
            f"ACTION: {self.ACTION_NAMES.get(self.last_action, 'CRUISE')} | "
            f"STEP: {self.step_count}/{self.MAX_STEPS}"
        )
        telemetry_txt = self._font_mono.render(telemetry_str, True, (241, 245, 249))
        screen.blit(telemetry_txt, (20, 42))

    def get_render_state(self) -> Dict[str, Any]:
        """
        Produce complete, additive RenderState dictionary matching web/schema.py.
        All coordinates are formatted in metric units ("m").
        """
        entities: List[Dict[str, Any]] = []

        # Ego Vehicle Entity
        entities.append({
            "id": "ego_car",
            "kind": "car",
            "x": float(self.ego_x),
            "y": float(self.ego_y),
            "heading": float(math.degrees(self.ego_psi)),
            "vx": float(self.ego_speed * math.cos(self.ego_psi)),
            "vy": float(self.ego_speed * math.sin(self.ego_psi)),
            "w": self.car_width,
            "h": self.car_length,
            "r": self.car_length / 2.0,
            "extra": {
                "is_ego": True,
                "speed_kmh": float(self.ego_speed * 3.6),
                "steer_deg": float(math.degrees(self.ego_steer)),
                "lane_idx": self.target_lane_idx,
                "lane_offset": float(self.last_lane_offset),
                "brake_lights": self.last_action == self.ACTION_BRAKE,
                "indicator": "left" if self.last_action == self.ACTION_STEER_LEFT else ("right" if self.last_action == self.ACTION_STEER_RIGHT else "off"),
                "color": "#00ff9d"
            }
        })

        # NPC Traffic Entities
        for npc in self.traffic:
            entities.append({
                "id": npc.vehicle_id,
                "kind": npc.kind,
                "x": float(npc.x),
                "y": float(npc.y),
                "heading": float(math.degrees(npc.heading)),
                "vx": float(npc.speed * math.cos(npc.heading)),
                "vy": float(npc.speed * math.sin(npc.heading)),
                "w": npc.width,
                "h": npc.length,
                "r": npc.length / 2.0,
                "extra": {
                    "is_ego": False,
                    "speed_kmh": float(npc.speed * 3.6),
                    "brake_lights": bool(npc.brake_lights),
                    "indicator": str(npc.indicator),
                    "color": npc.color
                }
            })

        # Pedestrians
        for ped in self.pedestrians:
            entities.append({
                "id": ped["id"],
                "kind": "person",
                "x": float(ped.get("x", 0.0)),
                "y": float(ped.get("y", 0.0)),
                "heading": 90.0,
                "vx": 0.0,
                "vy": float(ped["speed"]),
                "w": 0.6,
                "h": 0.6,
                "r": float(ped["r"]),
                "extra": {
                    "is_ego": False,
                    "color": ped["color"]
                }
            })

        # Terminal Goal
        goal_s = self.road.total_length - 30.0
        gx, gy, _ = self.road.to_cartesian(goal_s, 0.0)
        goal = {
            "x": float(gx),
            "y": float(gy),
            "r": 10.0,
            "extra": {"target_s": goal_s}
        }

        # World Layout
        world = {
            "bounds": [0.0, 0.0, float(self.road.total_length), 200.0],
            "units": "m",
            "scale": 1.0,
            "layout": {
                "road_width": self.road.road_width,
                "lane_count": self.road.lane_count,
                "lane_width": self.road.lane_width,
                "speed_limit": float(self.speed_limit * 3.6),
                "centerline": self.road.centerline_polyline,
                "scenery_seed": 42
            }
        }

        metrics = {
            "reward": float(self.cum_reward),
            "episode": 1,
            "success": self.ego_s >= (self.road.total_length - 50.0),
            "collisions": int(self.collision_count),
            "step_count": int(self.step_count),
            "extra": {
                "speed_kmh": float(self.ego_speed * 3.6),
                "ttc": float(self.last_ttc),
                "lane_offset": float(self.last_lane_offset),
                "jerk": float(self.last_jerk),
                "scenario_variant": self.scenario_variant
            }
        }

        return {
            "v": 1,
            "scenario": "driving",
            "step": self.step_count,
            "dt": self.DT,
            "mode": "baseline",
            "world": world,
            "entities": entities,
            "goal": goal,
            "plan": None,
            "metrics": metrics,
            "events": [],
            "model_error": None
        }

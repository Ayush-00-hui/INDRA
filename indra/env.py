"""
Project INDRA: India-Adapted Urban Robotics Simulation Environment.
Implements the frozen BaseEnv interface while incorporating continuous unicycle kinematics,
heterogeneous traffic participants, road hazards, and dynamic environmental degradation.
"""

import math
import numpy as np
from typing import Tuple, Dict, Any, List, Optional
import pygame

from envs.base_env import BaseEnv
from indra.core.kinematics import UrbanRobotKinematics, RobotSpecs
from indra.core.conditions import EnvironmentState, WeatherType, RoadCondition, TimeOfDay
from indra.core.actors import UrbanActor, RoadHazard
from indra.sensors.sensor_suite import SensorSuite
from indra.scenarios.scenario_manager import ScenarioRegistry, ScenarioDefinition


class IndraEnv(BaseEnv):
    """
    Simulation Environment for Project INDRA.
    Coordinates are in meters (1 unit = 1 meter).
    """

    STATE_DIM = 24
    ACTION_DIM = 5

    ACTION_FORWARD = 0
    ACTION_BRAKE = 1
    ACTION_LEFT = 2
    ACTION_RIGHT = 3
    ACTION_STAY = 4

    ACTION_NAMES = {
        0: "FORWARD",
        1: "BRAKE",
        2: "LEFT",
        3: "RIGHT",
        4: "STAY"
    }

    def __init__(self, scenario_variant: int = 1, max_steps: int = 300, dt: float = 0.1):
        self.scenario_variant = scenario_variant
        self.max_steps = max_steps
        self.dt = dt

        self.robot = UrbanRobotKinematics(RobotSpecs())
        self.sensors = SensorSuite(num_lidar_beams=16, max_lidar_range_m=14.0)
        self.env_state = EnvironmentState()

        self.scenario: Optional[ScenarioDefinition] = None
        self.actors: List[UrbanActor] = []
        self.hazards: List[RoadHazard] = []
        self.goal_x: float = 30.0
        self.goal_y: float = 0.0
        self.bounds: Tuple[float, float, float, float] = (-15.0, -10.0, 45.0, 10.0)

        self.last_lidar_16: List[float] = [12.0] * 16
        self.step_count: int = 0
        self.collision_count: int = 0
        self.prev_goal_dist: float = 0.0
        self.hover_timer: float = 0.0
        self._anchor_pos: Tuple[float, float] = (0.0, 0.0)

        self.seed(1001)

    def seed(self, seed: int = 1001) -> None:
        self.current_seed = seed
        self.scenario = ScenarioRegistry.create_scenario(self.scenario_variant, seed)
        self.env_state.weather = self.scenario.weather
        self.env_state.road = self.scenario.road
        self.env_state.time_of_day = self.scenario.time_of_day
        self.env_state.update_derived_effects()

    def reset(self, seed: Optional[int] = None) -> np.ndarray:
        if seed is not None:
            self.seed(seed)
        else:
            self.seed(self.current_seed)

        rx, ry, r_heading = self.scenario.robot_start
        self.robot.reset(rx, ry, r_heading)
        self.goal_x, self.goal_y = self.scenario.goal_pos
        self.bounds = self.scenario.bounds

        # Deep copy scenario actors & hazards
        self.scenario = ScenarioRegistry.create_scenario(self.scenario_variant, self.current_seed)
        self.actors = self.scenario.actors
        self.hazards = self.scenario.hazards

        self.step_count = 0
        self.collision_count = 0
        self.hover_timer = 0.0
        self._anchor_pos = (self.robot.x, self.robot.y)
        self.prev_goal_dist = math.hypot(self.goal_x - self.robot.x, self.goal_y - self.robot.y)

        return self._get_observation()

    def step(self, action: int) -> Tuple[np.ndarray, float, bool, Dict[str, Any]]:
        self.step_count += 1

        # 1. Map discrete action to commanded robot velocity and turn rate
        fwd_speed = 1.4 # m/s (~5 km/h)
        rev_speed = -0.6
        turn_rate = 1.8 # rad/s

        if action == self.ACTION_FORWARD:
            self.robot.set_control_targets(target_linear_v=fwd_speed, target_angular_w=0.0)
        elif action == self.ACTION_BRAKE:
            self.robot.set_control_targets(target_linear_v=rev_speed, target_angular_w=0.0)
        elif action == self.ACTION_LEFT:
            self.robot.set_control_targets(target_linear_v=fwd_speed * 0.7, target_angular_w=turn_rate)
        elif action == self.ACTION_RIGHT:
            self.robot.set_control_targets(target_linear_v=fwd_speed * 0.7, target_angular_w=-turn_rate)
        elif action == self.ACTION_STAY:
            self.robot.set_control_targets(target_linear_v=0.0, target_angular_w=0.0)

        # 2. Integrate robot kinematics forward with surface friction
        self.robot.update(self.dt, surface_friction=self.env_state.surface_friction)

        # Clamp robot to environment bounds
        min_x, min_y, max_x, max_y = self.bounds
        self.robot.x = max(min_x + 1.0, min(max_x - 1.0, self.robot.x))
        self.robot.y = max(min_y + 1.0, min(max_y - 1.0, self.robot.y))

        # 3. Update all dynamic actors
        for actor in self.actors:
            actor.update(self.dt, self.bounds)

        # 4. Check collisions and hazards
        is_collision = False
        collided_with = None
        robot_r = self.robot.specs.collision_radius_m

        for actor in self.actors:
            dist = math.hypot(actor.x - self.robot.x, actor.y - self.robot.y)
            if dist < (robot_r + actor.radius):
                is_collision = True
                collided_with = actor.kind
                self.collision_count += 1
                break

        # Check hazards (potholes, waterlogging, barricades)
        in_waterlog = False
        in_pothole = False
        for hazard in self.hazards:
            h_dist = math.hypot(hazard.x - self.robot.x, hazard.y - self.robot.y)
            if h_dist < (robot_r + hazard.radius):
                if hazard.kind == "waterlogging":
                    in_waterlog = True
                elif hazard.kind == "pothole":
                    in_pothole = True
                elif hazard.kind == "barricade":
                    is_collision = True
                    collided_with = "barricade"
                    self.collision_count += 1

        # 5. Goal progress and termination evaluation
        current_goal_dist = math.hypot(self.goal_x - self.robot.x, self.goal_y - self.robot.y)
        progress = self.prev_goal_dist - current_goal_dist
        self.prev_goal_dist = current_goal_dist

        # Anti-hover check: distance from anchor over last seconds
        anchor_dist = math.hypot(self.robot.x - self._anchor_pos[0], self.robot.y - self._anchor_pos[1])
        if anchor_dist < 0.35:
            self.hover_timer += self.dt
        else:
            self.hover_timer = 0.0
            self._anchor_pos = (self.robot.x, self.robot.y)

        # 6. Reward computation
        reward = progress * 15.0 - 0.05 # Progress incentive + step cost

        if is_collision:
            reward -= 20.0
        if in_waterlog:
            reward -= 5.0 # Drag / immersion penalty
        if in_pothole:
            reward -= 3.0 # Shock / suspension stress

        if self.hover_timer > 2.0:
            reward -= 2.0 * (self.hover_timer - 2.0) # Escalating anti-hover penalty

        reached_goal = current_goal_dist < 1.4 # Within 1.4m of delivery station
        if reached_goal:
            reward += 100.0

        done = reached_goal or (self.step_count >= self.max_steps)

        info = {
            "step": self.step_count,
            "goal_distance_m": round(current_goal_dist, 2),
            "progress": round(progress, 3),
            "collision": is_collision,
            "collided_with": collided_with,
            "in_waterlog": in_waterlog,
            "in_pothole": in_pothole,
            "reached_goal": reached_goal,
            "hover_seconds": round(self.hover_timer, 1),
            "speed_kmh": round(self.robot.v * 3.6, 1),
            "heading_deg": round(math.degrees(self.robot.heading), 1)
        }

        return self._get_observation(), float(reward), done, info

    def _get_observation(self) -> np.ndarray:
        """Construct the 24-dimensional normalized observation vector."""
        obs = np.zeros(self.STATE_DIM, dtype=np.float32)

        # Pose & Kinematics
        obs[0] = self.robot.x
        obs[1] = self.robot.y
        obs[2] = self.robot.v * math.cos(self.robot.heading)
        obs[3] = self.robot.v * math.sin(self.robot.heading)
        obs[4] = self.robot.heading

        # Target Goal Relative Vector
        dx = self.goal_x - self.robot.x
        dy = self.goal_y - self.robot.y
        dist = math.hypot(dx, dy)
        obs[5] = dx
        obs[6] = dy
        obs[7] = dist

        # LiDAR Beams (reduced to 8 principal sectors for state compactness)
        lidar_all = self.sensors.compute_lidar_scan(
            self.robot.x, self.robot.y, self.robot.heading,
            self.actors + self.hazards, self.bounds,
            attenuation=self.env_state.lidar_attenuation
        )
        self.last_lidar_16 = list(lidar_all)
        # Average into 8 sectors
        for i in range(8):
            obs[8 + i] = min(lidar_all[i * 2], lidar_all[i * 2 + 1]) if len(lidar_all) >= 16 else 10.0

        # Nearest dynamic actor tracking
        nearest_dist = 20.0
        nearest_heading = 0.0
        nearest_speed = 0.0
        for a in self.actors:
            ad = math.hypot(a.x - self.robot.x, a.y - self.robot.y)
            if ad < nearest_dist:
                nearest_dist = ad
                nearest_heading = math.atan2(a.y - self.robot.y, a.x - self.robot.x) - self.robot.heading
                nearest_speed = a.speed

        obs[16] = nearest_dist
        obs[17] = nearest_heading
        obs[18] = nearest_speed

        # Environment & Physical state
        obs[19] = self.env_state.surface_friction
        obs[20] = self.env_state.camera_visibility
        obs[21] = self.env_state.waterlog_depth_cm / 20.0 # Normalized depth
        obs[22] = min(1.0, self.hover_timer / 5.0)
        obs[23] = self.step_count / float(self.max_steps)

        return obs

    def render(self, screen: pygame.Surface) -> None:
        """Pygame 2D top-down fallback visualization for fast local testing."""
        if screen is None:
            return
        w, h = screen.get_size()
        screen.fill((18, 22, 32)) # Dark asphalt

        # World bounds mapping: bounds -> screen px
        min_x, min_y, max_x, max_y = self.bounds
        def world_to_screen(wx: float, wy: float) -> Tuple[int, int]:
            sx = int(((wx - min_x) / (max_x - min_x)) * w)
            sy = int(((wy - min_y) / (max_y - min_y)) * h)
            return sx, sy

        # Draw Goal
        gx, gy = world_to_screen(self.goal_x, self.goal_y)
        pygame.draw.circle(screen, (16, 185, 129), (gx, gy), 12)

        # Draw Hazards
        for hz in self.hazards:
            hx, hy = world_to_screen(hz.x, hz.y)
            color = (59, 130, 246) if hz.kind == "waterlogging" else (239, 68, 68)
            pygame.draw.circle(screen, color, (hx, hy), int(hz.radius * 8))

        # Draw Actors
        for act in self.actors:
            ax, ay = world_to_screen(act.x, act.y)
            color = (245, 158, 11) if act.kind == "auto_rickshaw" else (168, 85, 247)
            pygame.draw.circle(screen, color, (ax, ay), int(act.radius * 8))

        # Draw Robot
        rx, ry = world_to_screen(self.robot.x, self.robot.y)
        pygame.draw.circle(screen, (56, 189, 248), (rx, ry), 8)

    def get_state_size(self) -> int:
        return self.STATE_DIM

    def get_action_size(self) -> int:
        return self.ACTION_DIM

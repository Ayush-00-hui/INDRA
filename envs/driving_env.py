# PLACEHOLDER: Gurudutt will replace this file
"""
Minimal toy lane-keeping environment placeholder for autonomous driving.
Follows the exact BaseEnv interface to prove pluggability with the shared WorldModel and MPC planner.
"""

from typing import Tuple, Dict, Any, Optional
import numpy as np
import pygame

from envs.base_env import BaseEnv


class DrivingEnv(BaseEnv):
    """
    Toy 1D/2D lane-keeping driving environment.
    
    Actions (discrete):
      0: Steer Left
      1: Maintain Center
      2: Steer Right
      
    State vector (float32, dimension 4, normalized roughly to [-1.0, 1.0]):
      [0]: Lateral offset from lane center (-1.0 left shoulder to +1.0 right shoulder)
      [1]: Vehicle heading angle / drift velocity
      [2]: Normalized forward speed
      [3]: Road curvature ahead
    """

    WIDTH = 900
    HEIGHT = 600
    MAX_STEPS = 200

    def __init__(self):
        super().__init__()
        self.state_size = 4
        self.action_size = 3
        self.offset = 0.0
        self.heading = 0.0
        self.speed = 0.5
        self.curvature = 0.0
        self.step_count = 0
        self._font = None

    def get_state_size(self) -> int:
        return self.state_size

    def get_action_size(self) -> int:
        return self.action_size

    def _get_state(self) -> np.ndarray:
        return np.array([self.offset, self.heading, self.speed, self.curvature], dtype=np.float32)

    def reset(self, seed: Optional[int] = None) -> np.ndarray:
        if seed is not None:
            np.random.seed(seed)
        self.step_count = 0
        self.offset = float(np.random.uniform(-0.3, 0.3))
        self.heading = float(np.random.uniform(-0.1, 0.1))
        self.speed = 0.6
        self.curvature = float(np.random.uniform(-0.2, 0.2))
        return self._get_state()

    def step(self, action: int) -> Tuple[np.ndarray, float, bool, Dict[str, Any]]:
        self.step_count += 1

        steer = 0.0
        if action == 0:
            steer = -0.08  # left
        elif action == 2:
            steer = 0.08   # right

        self.heading += steer - self.curvature * 0.02
        self.heading = float(np.clip(self.heading, -0.5, 0.5))
        self.offset += self.heading * self.speed

        # Reward: penalize distance from center, step penalty, severe penalty if off road
        is_offroad = abs(self.offset) > 1.0
        reward = 1.0 - abs(self.offset) * 2.0 - 0.01

        if is_offroad:
            reward -= 10.0
            done = True
        else:
            done = self.step_count >= self.MAX_STEPS

        info = {
            "offroad": is_offroad,
            "timeout": self.step_count >= self.MAX_STEPS,
            "offset": self.offset,
            "step": self.step_count
        }

        return self._get_state(), float(reward), done, info

    def render(self, screen: pygame.Surface) -> None:
        """Render a top-down view of a highway lane with the car."""
        if self._font is None:
            pygame.font.init()
            self._font = pygame.font.SysFont("Arial", 18, bold=True)

        screen.fill((40, 45, 55))

        # Draw road
        road_rect = pygame.Rect(self.WIDTH // 2 - 200, 0, 400, self.HEIGHT)
        pygame.draw.rect(screen, (30, 32, 38), road_rect)

        # Lane markings
        dash_y = (self.step_count * 10) % 40
        for y in range(-40 + dash_y, self.HEIGHT, 40):
            pygame.draw.rect(screen, (220, 220, 220), (self.WIDTH // 2 - 4, y, 8, 20))

        # Draw car based on offset
        car_x = int(self.WIDTH // 2 + self.offset * 180)
        car_y = self.HEIGHT - 120
        car_rect = pygame.Rect(car_x - 18, car_y - 30, 36, 60)
        pygame.draw.rect(screen, (220, 60, 60), car_rect, border_radius=6)
        pygame.draw.rect(screen, (255, 200, 200), car_rect, 2, border_radius=6)

        # Header banner
        lbl = self._font.render("DRIVING SCENARIO (PLACEHOLDER FOR GURUDUTT)", True, (255, 200, 100))
        screen.blit(lbl, (self.WIDTH // 2 - lbl.get_width() // 2, 20))

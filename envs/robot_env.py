import math
from typing import Tuple, Dict, Any, List, Optional
import numpy as np
import pygame

from envs.base_env import BaseEnv


class Obstacle:
    """Represents an obstacle in the room (chair, table, wall, or moving person)."""
    def __init__(self, x: float, y: float, width: float, height: float, 
                 kind: str = "chair", vx: float = 0.0, vy: float = 0.0):
        self.x = float(x)
        self.y = float(y)
        self.width = float(width)
        self.height = float(height)
        self.kind = kind  # 'chair', 'block', 'person'
        self.vx = float(vx)
        self.vy = float(vy)

    @property
    def center(self) -> Tuple[float, float]:
        return self.x + self.width / 2.0, self.y + self.height / 2.0

    @property
    def rect(self) -> pygame.Rect:
        return pygame.Rect(int(self.x), int(self.y), int(self.width), int(self.height))

    def update(self, room_width: int, room_height: int) -> None:
        """Update position for moving obstacles, bouncing off room borders."""
        if self.vx != 0.0 or self.vy != 0.0:
            self.x += self.vx
            self.y += self.vy
            margin = 20
            if self.x < margin:
                self.x = margin
                self.vx = -self.vx
            elif self.x + self.width > room_width - margin:
                self.x = room_width - margin - self.width
                self.vx = -self.vx

            if self.y < margin:
                self.y = margin
                self.vy = -self.vy
            elif self.y + self.height > room_height - margin:
                self.y = room_height - margin - self.height
                self.vy = -self.vy


class RobotEnv(BaseEnv):
    """
    2D top-down navigation room environment for robotics.
    
    Features:
    - 900x600 pixel room.
    - Discrete actions: 0=up, 1=down, 2=left, 3=right, 4=stay.
    - 16-dimensional normalized state vector.
    - Collision penalty with freeze-in-place physics.
    - Scenario 1: Static obstacles (a chair blocks the direct path).
    - Scenario 2: Moving obstacles (a person walks across the room).
    """

    WIDTH = 900
    HEIGHT = 600
    ROBOT_RADIUS = 18.0
    GOAL_RADIUS = 22.0
    STEP_SIZE = 8.0  # Pixels per step (controlled, realistic warehouse AGV speed)
    MAX_STEPS = 400

    # Actions definition
    ACTION_UP = 0
    ACTION_DOWN = 1
    ACTION_LEFT = 2
    ACTION_RIGHT = 3
    ACTION_STAY = 4
    ACTION_DELTAS = {
        0: (0.0, -STEP_SIZE),
        1: (0.0, STEP_SIZE),
        2: (-STEP_SIZE, 0.0),
        3: (STEP_SIZE, 0.0),
        4: (0.0, 0.0),
    }

    def __init__(self, scenario: int = 1, include_obstacle_size: bool = False, fixed_dock_start: bool = False):
        super().__init__()
        self.scenario = scenario
        self.include_obstacle_size = include_obstacle_size
        self.fixed_dock_start = fixed_dock_start
        self.state_size = 22 if include_obstacle_size else 16
        self.action_size = 5

        # Episode state variables
        self.robot_x = 0.0
        self.robot_y = 0.0
        self.goal_x = 0.0
        self.goal_y = 0.0
        self.obstacles: List[Obstacle] = []
        self.step_count = 0
        self.episode_count = 0
        self.success_count = 0
        self.collision_count = 0

        # Kinetic & Drive Mechanics
        self.vx = 0.0
        self.vy = 0.0
        self.heading = 0.0
        self.drive_mode = "NORMAL"

        # Anti-Hovering Sentinel Mechanics (Strict max 2.0s hover constraint)
        self.hover_anchor_x = 0.0
        self.hover_anchor_y = 0.0
        self.hover_steps = 0
        self.hover_radius_threshold = 28.0  # detects micro-oscillations within ~1.5 robot radii
        self.max_hover_steps = 55           # ~1.83s at 30 FPS (strict <2.0s dwell guarantee)
        self.anti_hover_thrust_active = False

        # UI / Display helpers
        self.mode_str = "WITH WORLD MODEL"
        self._font = None
        self._small_font = None

        # Rendering configuration & fallback chain: 3D -> 2D -> Classic
        self.renderer_mode: str = "auto"
        self.use_modern_renderer: bool = True
        self._modern_renderer = None
        self.is_custom_layout: bool = False

    def get_state_size(self) -> int:
        return self.state_size

    def get_action_size(self) -> int:
        return self.action_size

    def _normalize_x(self, x: float) -> float:
        """Normalize x coordinate [0, WIDTH] to roughly [-1.0, 1.0]."""
        return (x - (self.WIDTH / 2.0)) / (self.WIDTH / 2.0)

    def _normalize_y(self, y: float) -> float:
        """Normalize y coordinate [0, HEIGHT] to roughly [-1.0, 1.0]."""
        return (y - (self.HEIGHT / 2.0)) / (self.HEIGHT / 2.0)

    @classmethod
    def denormalize_pos(cls, norm_x: float, norm_y: float) -> Tuple[float, float]:
        """Convert normalized coordinates back to pixel coordinates."""
        px = (norm_x * (cls.WIDTH / 2.0)) + (cls.WIDTH / 2.0)
        py = (norm_y * (cls.HEIGHT / 2.0)) + (cls.HEIGHT / 2.0)
        return float(px), float(py)

    def _get_state(self) -> np.ndarray:
        """
        Construct state vector:
        - 16-d (default):
            [0:2]   Robot position (norm_x, norm_y)
            [2:4]   Relative goal position (rel_gx, rel_gy)
            [4:16]  3 nearest obstacles: relative (rel_ox, rel_oy) and velocity (norm_vx, norm_vy)
        - 22-d (if include_obstacle_size=True):
            [0:2]   Robot position (norm_x, norm_y)
            [2:4]   Relative goal position (rel_gx, rel_gy)
            [4:22]  3 nearest obstacles: relative (rel_ox, rel_oy), velocity (norm_vx, norm_vy), and size (norm_w, norm_h)
        """
        state = np.zeros(self.state_size, dtype=np.float32)

        # 1. Robot position
        state[0] = self._normalize_x(self.robot_x)
        state[1] = self._normalize_y(self.robot_y)

        # 2. Goal relative position
        state[2] = (self.goal_x - self.robot_x) / (self.WIDTH / 2.0)
        state[3] = (self.goal_y - self.robot_y) / (self.HEIGHT / 2.0)

        # 3. Sort obstacles by distance to robot
        obs_distances = []
        for obs in self.obstacles:
            cx, cy = obs.center
            d = math.hypot(cx - self.robot_x, cy - self.robot_y)
            obs_distances.append((d, obs))
        obs_distances.sort(key=lambda item: item[0])

        idx = 4
        stride = 6 if self.include_obstacle_size else 4

        for i in range(3):
            if i < len(obs_distances):
                _, obs = obs_distances[i]
                cx, cy = obs.center
                state[idx] = (cx - self.robot_x) / (self.WIDTH / 2.0)
                state[idx + 1] = (cy - self.robot_y) / (self.HEIGHT / 2.0)
                state[idx + 2] = obs.vx / 10.0
                state[idx + 3] = obs.vy / 10.0
                if self.include_obstacle_size:
                    state[idx + 4] = obs.width / (self.WIDTH / 2.0)
                    state[idx + 5] = obs.height / (self.HEIGHT / 2.0)
            else:
                # Far away dummy obstacle
                state[idx] = 2.0
                state[idx + 1] = 2.0
                state[idx + 2] = 0.0
                state[idx + 3] = 0.0
                if self.include_obstacle_size:
                    state[idx + 4] = 0.0
                    state[idx + 5] = 0.0
            idx += stride

        return state

    def reset(self, seed: Optional[int] = None) -> np.ndarray:
        """Reset environment with a fresh layout where chair blocks the direct path."""
        if seed is not None:
            np.random.seed(seed)

        self.step_count = 0
        self.collision_count = 0
        self.episode_count += 1

        # Spawn robot: docking station (fixed_dock_start=True) or standard randomized starting zone
        if getattr(self, "fixed_dock_start", False):
            self.robot_x = 90.0
            self.robot_y = 480.0
        else:
            self.robot_x = float(np.random.uniform(75, 150))
            self.robot_y = float(np.random.uniform(self.HEIGHT - 170, self.HEIGHT - 90))

        # Spawn goal on the far upper-right side of the room (maximizes path length to ~820-1300px)
        self.goal_x = float(np.random.uniform(self.WIDTH - 180, self.WIDTH - 70))
        self.goal_y = float(np.random.uniform(75, 150))

        # Reset kinetic dynamics and anti-hover sentinel anchor
        self.vx = 0.0
        self.vy = 0.0
        self.heading = float(math.degrees(math.atan2(self.goal_x - self.robot_x, -(self.goal_y - self.robot_y))) % 360.0)
        self.drive_mode = "NORMAL"
        self.hover_anchor_x = self.robot_x
        self.hover_anchor_y = self.robot_y
        self.hover_steps = 0
        self.anti_hover_thrust_active = False

        self.obstacles = []

        # 1. The "Chair": always placed directly between robot and goal
        # Midpoint with a small random jitter
        mid_x = (self.robot_x + self.goal_x) / 2.0
        mid_y = (self.robot_y + self.goal_y) / 2.0
        chair_jitter_x = float(np.random.uniform(-30, 30))
        chair_jitter_y = float(np.random.uniform(-30, 30))
        chair_w = 80.0
        chair_h = 80.0
        chair_x = np.clip(mid_x + chair_jitter_x - chair_w / 2.0, 100, self.WIDTH - 180)
        chair_y = np.clip(mid_y + chair_jitter_y - chair_h / 2.0, 100, self.HEIGHT - 180)
        self.obstacles.append(Obstacle(chair_x, chair_y, chair_w, chair_h, kind="chair"))

        # 2. Add 2 additional static obstacles (desks/boxes) to create lanes
        for _ in range(2):
            box_w = float(np.random.uniform(60, 90))
            box_h = float(np.random.uniform(60, 90))
            box_x = float(np.random.uniform(250, self.WIDTH - 250))
            box_y = float(np.random.uniform(80, self.HEIGHT - 160))
            # Avoid overlapping directly with chair
            if abs(box_x - chair_x) > 100 or abs(box_y - chair_y) > 100:
                self.obstacles.append(Obstacle(box_x, box_y, box_w, box_h, kind="block"))

        # 3. Dynamic scenarios
        if self.scenario == 2:
            person_x = float(np.random.uniform(300, 600))
            person_y = float(np.random.uniform(100, self.HEIGHT - 100))
            vy = float(np.random.choice([-4.0, 4.0]))
            self.obstacles.append(Obstacle(person_x, person_y, 45.0, 45.0, kind="person", vx=0.0, vy=vy))
        elif self.scenario == 3:
            # Scenario 3: Dense Multi-Obstacle Warehouse Maze (4 to 8 randomized obstacles)
            num_extra = int(np.random.randint(2, 6))
            kinds = ["crate", "cabinet", "workstation"]
            for _ in range(num_extra):
                ow = float(np.random.uniform(55, 95))
                oh = float(np.random.uniform(55, 95))
                ox = float(np.random.uniform(160, self.WIDTH - 220))
                oy = float(np.random.uniform(80, self.HEIGHT - 150))
                k = str(np.random.choice(kinds))
                self.obstacles.append(Obstacle(ox, oy, ow, oh, kind=k))
        elif self.scenario == 4:
            # Scenario 4: Dynamic warehouse with moving person and dense static clutter
            person_x = float(np.random.uniform(280, 620))
            person_y = float(np.random.uniform(100, self.HEIGHT - 100))
            vy = float(np.random.choice([-5.0, -3.0, 3.0, 5.0]))
            self.obstacles.append(Obstacle(person_x, person_y, 45.0, 45.0, kind="person", vx=0.0, vy=vy))
            for _ in range(3):
                ox = float(np.random.uniform(180, self.WIDTH - 220))
                oy = float(np.random.uniform(90, self.HEIGHT - 160))
                self.obstacles.append(Obstacle(ox, oy, 72.0, 72.0, kind="crate"))

        return self._get_state()

    def _check_collision(self, candidate_x: float, candidate_y: float) -> bool:
        """Check if candidate robot position collides with room walls or any obstacle."""
        # 1. Wall boundary check
        margin = self.ROBOT_RADIUS + 5.0
        if (candidate_x < margin or candidate_x > self.WIDTH - margin or
                candidate_y < margin or candidate_y > self.HEIGHT - margin):
            return True

        # 2. Obstacle collision (Circle vs AABB rectangle)
        for obs in self.obstacles:
            closest_x = max(obs.x, min(candidate_x, obs.x + obs.width))
            closest_y = max(obs.y, min(candidate_y, obs.y + obs.height))
            dist = math.hypot(candidate_x - closest_x, candidate_y - closest_y)
            if dist < self.ROBOT_RADIUS:
                return True

        return False

    def get_lidar_distances(self, n_beams: int = 16, max_range: float = 250.0) -> np.ndarray:
        """
        Fast 360-degree vector LiDAR distance scanner.
        Casts n_beams rays from (robot_x, robot_y) around 360 degrees.
        Returns distance in pixels to nearest wall or obstacle AABB for each beam.
        """
        angles = np.linspace(0, 2 * math.pi, n_beams, endpoint=False)
        distances = np.full(n_beams, max_range, dtype=np.float32)
        rx, ry = self.robot_x, self.robot_y

        for i, angle in enumerate(angles):
            dx = math.cos(angle)
            dy = math.sin(angle)

            # 1. Distance to room walls (margin 10px)
            d_wall = max_range
            if dx > 1e-4:
                d_wall = min(d_wall, (self.WIDTH - 10.0 - rx) / dx)
            elif dx < -1e-4:
                d_wall = min(d_wall, (10.0 - rx) / dx)

            if dy > 1e-4:
                d_wall = min(d_wall, (self.HEIGHT - 10.0 - ry) / dy)
            elif dy < -1e-4:
                d_wall = min(d_wall, (10.0 - ry) / dy)

            min_dist = max(0.0, d_wall)

            # 2. Distance to each obstacle (Ray vs AABB slab intersection)
            for obs in self.obstacles:
                x1, x2 = obs.x, obs.x + obs.width
                y1, y2 = obs.y, obs.y + obs.height

                # Point inside box
                if x1 <= rx <= x2 and y1 <= ry <= y2:
                    min_dist = 0.0
                    break

                tmin = 0.0
                tmax = min_dist

                if abs(dx) > 1e-6:
                    tx1 = (x1 - rx) / dx
                    tx2 = (x2 - rx) / dx
                    tmin = max(tmin, min(tx1, tx2))
                    tmax = min(tmax, max(tx1, tx2))
                elif rx < x1 or rx > x2:
                    continue

                if abs(dy) > 1e-6:
                    ty1 = (y1 - ry) / dy
                    ty2 = (y2 - ry) / dy
                    tmin = max(tmin, min(ty1, ty2))
                    tmax = min(tmax, max(ty1, ty2))
                elif ry < y1 or ry > y2:
                    continue

                if tmax >= tmin and tmin >= 0.0:
                    min_dist = min(min_dist, tmin)

            distances[i] = min(max_range, max(0.0, min_dist))

        return distances

    def _compute_anti_hover_escape_action(self) -> int:
        """
        Anti-Hover Sentinel: Evaluates directional clearance and goal orientation
        to pick an immediate breakaway escape direction when hovering >= 2.0 seconds.
        """
        lidar = self.get_lidar_distances(n_beams=16, max_range=200.0)
        action_angles = {
            0: 3 * math.pi / 2,
            1: math.pi / 2,
            2: math.pi,
            3: 0.0
        }

        gdx = self.goal_x - self.robot_x
        gdy = self.goal_y - self.robot_y
        g_len = math.hypot(gdx, gdy)
        gu_x = gdx / max(1e-4, g_len)
        gu_y = gdy / max(1e-4, g_len)

        best_score = -1e9
        best_act = 0

        for act, angle in action_angles.items():
            adx, ady = self.ACTION_DELTAS[act]
            cand_x = self.robot_x + adx
            cand_y = self.robot_y + ady

            if self._check_collision(cand_x, cand_y):
                continue

            beam_idx = int(round((angle / (2 * math.pi)) * 16)) % 16
            clearance = float(lidar[beam_idx])

            # Forward alignment with goal
            mv_len = math.hypot(adx, ady)
            alignment = (adx * gu_x + ady * gu_y) / max(1e-4, mv_len)

            score = clearance + 15.0 * alignment
            if score > best_score:
                best_score = score
                best_act = act

        return best_act

    def step(self, action: int) -> Tuple[np.ndarray, float, bool, Dict[str, Any]]:
        """Advance simulation by one discrete action step with anti-hover sentinel & kinetic drive."""
        self.step_count += 1
        prev_rx, prev_ry = self.robot_x, self.robot_y

        # Update moving obstacles
        for obs in self.obstacles:
            obs.update(self.WIDTH, self.HEIGHT)

        # Kinetic drive mode based on 360-degree LiDAR clearance
        lidar_16 = self.get_lidar_distances(n_beams=16, max_range=200.0)
        min_clearance = float(np.min(lidar_16))
        if min_clearance > 75.0:
            self.drive_mode = "TURBO_CRUISE"
        elif min_clearance < 32.0:
            self.drive_mode = "PRECISION_CREEP"
        else:
            self.drive_mode = "NORMAL"

        # Anti-Hovering Displacement Tracking (Enforcing strict 2.0s max hover)
        disp_from_anchor = math.hypot(self.robot_x - self.hover_anchor_x, self.robot_y - self.hover_anchor_y)
        if disp_from_anchor < self.hover_radius_threshold:
            self.hover_steps += 1
        else:
            self.hover_anchor_x = self.robot_x
            self.hover_anchor_y = self.robot_y
            self.hover_steps = 0

        self.anti_hover_thrust_active = False

        # 2-SECOND HARD ENFORCEMENT: If hovering >= 55 steps (~1.8-2.0s), override action with breakaway escape!
        if self.hover_steps >= self.max_hover_steps:
            escape_act = self._compute_anti_hover_escape_action()
            if escape_act is not None:
                action = escape_act
                self.anti_hover_thrust_active = True
                self.hover_steps = 0
                self.hover_anchor_x = self.robot_x
                self.hover_anchor_y = self.robot_y

        dx, dy = self.ACTION_DELTAS.get(int(action), (0.0, 0.0))
        candidate_x = self.robot_x + dx
        candidate_y = self.robot_y + dy

        # Distance before movement
        prev_dist = math.hypot(self.robot_x - self.goal_x, self.robot_y - self.goal_y)

        # Check collision rule:
        # If robot would enter obstacle/wall, it does NOT move, gets penalty, info["collision"]=True
        is_collision = self._check_collision(candidate_x, candidate_y)
        if is_collision:
            self.collision_count += 1
            # Robot does not move
            curr_dist = prev_dist
        else:
            self.robot_x = candidate_x
            self.robot_y = candidate_y
            curr_dist = math.hypot(self.robot_x - self.goal_x, self.robot_y - self.goal_y)

        # Progress reward: scaled decrease in distance
        progress = (prev_dist - curr_dist) / self.STEP_SIZE
        reward = progress - 0.01  # small step penalty

        # Progressive stagnation penalty if hovering >= 1.2s (35 steps)
        if self.hover_steps >= 35:
            reward -= 0.30 * (self.hover_steps - 34)

        if is_collision:
            reward -= 10.0

        reached_goal = curr_dist < (self.ROBOT_RADIUS + self.GOAL_RADIUS)
        timeout = self.step_count >= self.MAX_STEPS
        done = False

        if reached_goal:
            reward += 20.0
            done = True
            self.success_count += 1
        elif timeout:
            done = True

        # Kinetic velocity smoothing & heading update
        actual_dx = self.robot_x - prev_rx
        actual_dy = self.robot_y - prev_ry
        self.vx = 0.75 * self.vx + 0.25 * actual_dx
        self.vy = 0.75 * self.vy + 0.25 * actual_dy
        if abs(actual_dx) > 0.05 or abs(actual_dy) > 0.05:
            self.heading = float(math.degrees(math.atan2(actual_dx, -actual_dy)) % 360.0)

        is_blocked, blocked_reason = self.is_path_blocked()

        info = {
            "collision": is_collision,
            "reached_goal": reached_goal,
            "timeout": timeout,
            "step": self.step_count,
            "collisions_total": self.collision_count,
            "robot_pos": (self.robot_x, self.robot_y),
            "goal_pos": (self.goal_x, self.goal_y),
            "path_blocked": is_blocked,
            "blocked_reason": blocked_reason,
            "hover_steps": self.hover_steps,
            "hover_duration_sec": round(self.hover_steps / 30.0, 2),
            "anti_hover_thrust": self.anti_hover_thrust_active,
            "drive_mode": self.drive_mode,
            "lidar_min_clearance": round(min_clearance, 1),
        }

        self.last_step_info = info
        return self._get_state(), float(reward), done, info

    def render(self, screen: pygame.Surface, draw_hud: bool = True, **kwargs) -> None:
        """Render the room, obstacles, robot, goal, and HUD onto Pygame screen."""
        if not getattr(self, "use_modern_renderer", True) or getattr(self, "renderer_mode", "auto") == "classic":
            self._render_classic(screen, draw_hud=draw_hud)
            return

        mode = getattr(self, "renderer_mode", "auto")

        # Initialize renderer if needed
        if getattr(self, "_modern_renderer", None) is None:
            if mode in ("3d", "auto"):
                try:
                    from viz3d.renderer3d import Renderer3D
                    self._modern_renderer = Renderer3D(width=self.WIDTH, height=self.HEIGHT)
                    if not getattr(self._modern_renderer, "_3d_enabled", True):
                        self._modern_renderer = None
                except Exception:
                    self._modern_renderer = None

            if self._modern_renderer is None and mode in ("3d", "2d", "auto"):
                try:
                    from visuals.renderer import RobotRenderer
                    self._modern_renderer = RobotRenderer(width=self.WIDTH, height=self.HEIGHT)
                except Exception:
                    self._modern_renderer = None
                    self.use_modern_renderer = False

        if self._modern_renderer is not None:
            try:
                self._modern_renderer.render(
                    env=self,
                    target_surface=screen,
                    plan_info=getattr(self, "current_plan_info", None),
                    last_info=getattr(self, "last_step_info", None),
                    method_title=f"MODE: {self.mode_str}",
                    draw_hud=draw_hud,
                    **kwargs
                )
                return
            except Exception:
                self.use_modern_renderer = False

        self._render_classic(screen, draw_hud=draw_hud)

    def _render_classic(self, screen: pygame.Surface, draw_hud: bool = True) -> None:
        """Original lightweight classic renderer fallback."""
        if self._font is None:
            pygame.font.init()
            self._font = pygame.font.SysFont("Arial", 18, bold=True)
            self._small_font = pygame.font.SysFont("Arial", 14)

        # 1. Background
        screen.fill((28, 32, 42))  # Modern slate dark theme

        # Draw grid lines for spatial reference
        for gx in range(0, self.WIDTH, 50):
            pygame.draw.line(screen, (36, 42, 54), (gx, 0), (gx, self.HEIGHT), 1)
        for gy in range(0, self.HEIGHT, 50):
            pygame.draw.line(screen, (36, 42, 54), (0, gy), (self.WIDTH, gy), 1)

        # Room boundary wall
        pygame.draw.rect(screen, (70, 80, 100), pygame.Rect(5, 5, self.WIDTH - 10, self.HEIGHT - 10), 3)

        # 2. Obstacles
        for obs in self.obstacles:
            r = obs.rect
            if obs.kind == "chair":
                # Distinct wood/orange chair with backrest indicator
                pygame.draw.rect(screen, (190, 100, 45), r, border_radius=6)
                pygame.draw.rect(screen, (240, 140, 70), r, 3, border_radius=6)
                # Inner chair seat detail
                inner_r = pygame.Rect(r.x + 8, r.y + 8, r.width - 16, r.height - 16)
                pygame.draw.rect(screen, (140, 70, 30), inner_r, border_radius=4)
                # Label
                lbl = self._small_font.render("CHAIR", True, (255, 230, 200))
                screen.blit(lbl, (r.centerx - lbl.get_width() // 2, r.centery - lbl.get_height() // 2))
            elif obs.kind == "person":
                # Moving person: magenta/purple
                pygame.draw.rect(screen, (180, 50, 180), r, border_radius=8)
                pygame.draw.rect(screen, (255, 120, 255), r, 2, border_radius=8)
                lbl = self._small_font.render("PERSON", True, (255, 255, 255))
                screen.blit(lbl, (r.centerx - lbl.get_width() // 2, r.centery - lbl.get_height() // 2))
            else:
                # Static boxes / tables
                pygame.draw.rect(screen, (60, 75, 95), r, border_radius=5)
                pygame.draw.rect(screen, (100, 120, 150), r, 2, border_radius=5)

        # 3. Goal (Glowing amber/gold target star/circle)
        goal_center = (int(self.goal_x), int(self.goal_y))
        pygame.draw.circle(screen, (255, 200, 40), goal_center, int(self.GOAL_RADIUS) + 4, 2)
        pygame.draw.circle(screen, (230, 160, 20), goal_center, int(self.GOAL_RADIUS))
        pygame.draw.circle(screen, (255, 240, 120), goal_center, int(self.GOAL_RADIUS) - 6)
        # Goal flag/text
        glbl = self._small_font.render("GOAL", True, (20, 20, 20))
        screen.blit(glbl, (goal_center[0] - glbl.get_width() // 2, goal_center[1] - glbl.get_height() // 2))

        # 4. Robot (Bright Cyan Circle with heading indicator)
        robot_center = (int(self.robot_x), int(self.robot_y))
        pygame.draw.circle(screen, (0, 180, 240), robot_center, int(self.ROBOT_RADIUS))
        pygame.draw.circle(screen, (180, 240, 255), robot_center, int(self.ROBOT_RADIUS), 2)
        pygame.draw.circle(screen, (255, 255, 255), robot_center, 4)

        # Direct line to goal (faint dashed hint)
        pygame.draw.line(screen, (60, 70, 90), robot_center, goal_center, 1)

        # 5. HUD Display
        if draw_hud:
            hud_bg = pygame.Rect(15, 12, 420, 78)
            pygame.draw.rect(screen, (15, 18, 25, 220), hud_bg, border_radius=8)
            pygame.draw.rect(screen, (50, 60, 80), hud_bg, 2, border_radius=8)

            # Mode text color
            is_wm = "WORLD MODEL" in self.mode_str
            mode_color = (80, 250, 140) if is_wm else (250, 160, 80)
            mode_txt = self._font.render(f"MODE: {self.mode_str}", True, mode_color)
            screen.blit(mode_txt, (25, 18))

            stats_txt = self._small_font.render(
                f"Ep: {self.episode_count}  |  Step: {self.step_count}/{self.MAX_STEPS}  |  "
                f"Hits: {self.collision_count}  |  Goals: {self.success_count}",
                True, (200, 210, 225)
            )
            screen.blit(stats_txt, (25, 44))

            scen_txt = self._small_font.render(
                f"Scenario: {'1 (Static Chair)' if self.scenario == 1 else '2 (Moving Person)'}  [Toggle: 1/2]",
                True, (160, 175, 195)
            )
            screen.blit(scen_txt, (25, 64))

        # Impassable blocked area warning message banner
        is_blocked = getattr(self, "last_step_info", {}).get("path_blocked", False)
        if not is_blocked and self.obstacles:
            is_blocked, _ = self.is_path_blocked()

        if is_blocked:
            banner_w = 640
            banner_h = 50
            bx = (self.WIDTH - banner_w) // 2
            by = 16
            banner_rect = pygame.Rect(bx, by, banner_w, banner_h)
            pygame.draw.rect(screen, (38, 10, 16), banner_rect, border_radius=8)
            pygame.draw.rect(screen, (239, 68, 68), banner_rect, 3, border_radius=8)
            warn_txt = self._font.render("WARNING: AREA BLOCKED BY OBSTACLES — NO VIABLE PATH TO GOAL", True, (255, 230, 230))
            screen.blit(warn_txt, (bx + (banner_w - warn_txt.get_width()) // 2, by + 14))

    def is_path_blocked(self) -> Tuple[bool, str]:
        """
        Fast sub-millisecond BFS grid reachability check (15px cells) between robot and goal.
        Evaluates whether obstacles completely seal or disconnect all traversable routes
        for a circular agent with ROBOT_RADIUS.
        
        Returns:
            (is_blocked: bool, reason: str)
        """
        if not self.obstacles:
            return False, ""

        from collections import deque

        r_margin = self.ROBOT_RADIUS + 1.0
        cell_size = 15.0
        grid_w = int(self.WIDTH // cell_size)    # 60
        grid_h = int(self.HEIGHT // cell_size)   # 40

        sgx = int(np.clip(self.robot_x // cell_size, 0, grid_w - 1))
        sgy = int(np.clip(self.robot_y // cell_size, 0, grid_h - 1))
        tgx = int(np.clip(self.goal_x // cell_size, 0, grid_w - 1))
        tgy = int(np.clip(self.goal_y // cell_size, 0, grid_h - 1))

        blocked = np.zeros((grid_h, grid_w), dtype=bool)

        # Boundary perimeter
        wall_cells_x = int(math.ceil((self.ROBOT_RADIUS + 4.0) / cell_size))
        wall_cells_y = int(math.ceil((self.ROBOT_RADIUS + 4.0) / cell_size))
        blocked[:wall_cells_y, :] = True
        blocked[-wall_cells_y:, :] = True
        blocked[:, :wall_cells_x] = True
        blocked[:, -wall_cells_x:] = True

        for obs in self.obstacles:
            x1 = max(0, int((obs.x - r_margin) // cell_size))
            x2 = min(grid_w - 1, int((obs.x + obs.width + r_margin) // cell_size))
            y1 = max(0, int((obs.y - r_margin) // cell_size))
            y2 = min(grid_h - 1, int((obs.y + obs.height + r_margin) // cell_size))
            for gy in range(y1, y2 + 1):
                cy = gy * cell_size + cell_size * 0.5
                closest_y = max(obs.y, min(cy, obs.y + obs.height))
                dy = cy - closest_y
                for gx in range(x1, x2 + 1):
                    cx = gx * cell_size + cell_size * 0.5
                    closest_x = max(obs.x, min(cx, obs.x + obs.width))
                    dx = cx - closest_x
                    if (dx * dx + dy * dy) < (r_margin * r_margin):
                        blocked[gy, gx] = True

        # Check if robot starting cell is trapped
        if blocked[sgy, sgx]:
            found = False
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    ny, nx = sgy + dy, sgx + dx
                    if 0 <= ny < grid_h and 0 <= nx < grid_w and not blocked[ny, nx]:
                        sgy, sgx = ny, nx
                        found = True
                        break
                if found:
                    break
            if not found:
                return True, "AREA BLOCKED: ROBOT IS ENCLOSED BY OBSTACLES"

        # Check if goal target cell is sealed off
        if blocked[tgy, tgx]:
            found_target = False
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    ny, nx = tgy + dy, tgx + dx
                    if 0 <= ny < grid_h and 0 <= nx < grid_w and not blocked[ny, nx]:
                        found_target = True
                        break
            if not found_target:
                return True, "AREA BLOCKED: GOAL IS ENCLOSED BY OBSTACLES"

        # 8-connected BFS queue
        q = deque([(sgx, sgy)])
        visited = {(sgx, sgy)}
        goal_reach_radius = max(1, int(self.GOAL_RADIUS // cell_size))

        while q:
            cx, cy = q.popleft()
            if abs(cx - tgx) <= goal_reach_radius and abs(cy - tgy) <= goal_reach_radius:
                return False, ""

            for dx, dy in ((0, 1), (0, -1), (1, 0), (-1, 0), (1, 1), (-1, 1), (1, -1), (-1, -1)):
                nx, ny = cx + dx, cy + dy
                if 0 <= nx < grid_w and 0 <= ny < grid_h:
                    if not blocked[ny, nx] and (nx, ny) not in visited:
                        visited.add((nx, ny))
                        q.append((nx, ny))

        return True, "AREA BLOCKED: NO NAVIGABLE ROUTE TO GOAL"

    def place_obstacle(self, x: float, y: float, kind: str = "crate", w: Optional[float] = None, h: Optional[float] = None) -> bool:
        """
        Interactive Edit Mode: Add custom obstacle to environment.
        Supports up to 36 dynamic obstacles (crates, cabinets, workstations, blocks).
        """
        if w is None or h is None:
            if kind in ("chair", "workstation"):
                w, h = 80.0, 80.0
            elif kind == "cabinet":
                w, h = 75.0, 65.0
            else:
                w, h = 70.0, 70.0

        # Clamp within room borders with margin
        x = float(np.clip(x, 15.0, self.WIDTH - w - 15.0))
        y = float(np.clip(y, 15.0, self.HEIGHT - h - 15.0))

        cx, cy = x + w * 0.5, y + h * 0.5
        # Don't place directly on top of the robot or goal
        if math.hypot(cx - self.robot_x, cy - self.robot_y) < (self.ROBOT_RADIUS + 25.0):
            return False
        if math.hypot(cx - self.goal_x, cy - self.goal_y) < (self.GOAL_RADIUS + 25.0):
            return False

        if len(self.obstacles) >= 36:
            self.obstacles.pop(0)  # Rotate oldest obstacle out to make room

        obs = Obstacle(x=x, y=y, width=w, height=h, kind=kind)
        self.obstacles.append(obs)
        self.is_custom_layout = True
        return True

    def clear_obstacles(self) -> None:
        """Clear all obstacles so user can design custom course from scratch."""
        self.obstacles = []
        self.is_custom_layout = True

    def set_goal(self, x: float, y: float) -> bool:
        """
        Interactive Edit Mode (Phase 9): Set custom goal location.
        """
        if x < 40.0 or x > self.WIDTH - 40.0 or y < 40.0 or y > self.HEIGHT - 40.0:
            return False
        if math.hypot(x - self.robot_x, y - self.robot_y) < (self.ROBOT_RADIUS + 40.0):
            return False

        self.goal_x = float(x)
        self.goal_y = float(y)
        self.is_custom_layout = True
        return True


def draw_ghost_paths(screen: pygame.Surface, plan_info: Optional[Dict[str, Any]]) -> None:
    """
    Draw imagined MPC rollout paths as semi-transparent dotted/dashed lines:
    - Candidate/alternative trajectories in subtle gray/cyan.
    - Chosen optimal trajectory highlighted in bright neon green.
    
    Args:
        screen: Pygame surface to render onto.
        plan_info: Dict containing 'best_trajectory' and optionally 'candidate_trajectories'.
    """
    if not plan_info:
        return

    # Surface for alpha blending
    overlay = pygame.Surface((RobotEnv.WIDTH, RobotEnv.HEIGHT), pygame.SRCALPHA)

    # 1. Alternative candidate trajectories (gray/blue dashed)
    candidates = plan_info.get("candidate_trajectories", [])
    for traj in candidates:
        if len(traj) < 2:
            continue
        pts = [RobotEnv.denormalize_pos(p[0], p[1]) for p in traj]
        for i in range(len(pts) - 1):
            p1 = (int(pts[i][0]), int(pts[i][1]))
            p2 = (int(pts[i + 1][0]), int(pts[i + 1][1]))
            pygame.draw.line(overlay, (120, 160, 200, 90), p1, p2, 2)
            pygame.draw.circle(overlay, (140, 180, 220, 110), p2, 2)

    # 2. Chosen best trajectory (neon green highlighted)
    best_traj = plan_info.get("best_trajectory", None)
    if best_traj is not None and len(best_traj) >= 2:
        pts = [RobotEnv.denormalize_pos(p[0], p[1]) for p in best_traj]
        for i in range(len(pts) - 1):
            p1 = (int(pts[i][0]), int(pts[i][1]))
            p2 = (int(pts[i + 1][0]), int(pts[i + 1][1]))
            # Thick vibrant green line
            pygame.draw.line(overlay, (50, 255, 120, 220), p1, p2, 3)
            # Waypoint node
            pygame.draw.circle(overlay, (120, 255, 170, 240), p2, 4)

    screen.blit(overlay, (0, 0))

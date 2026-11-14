import os
import sys
import time
import argparse
import collections
import importlib
import logging
from typing import Optional, Dict, Any, Tuple, List, Deque
import numpy as np
import pygame

# Ensure root directory is on PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
os.environ["SDL_VIDEO_CENTERED"] = "1"

from envs.robot_env import RobotEnv, draw_ghost_paths
from model.world_model import load_model, WorldModel
from planner.mpc import plan
from scripts.collect_data_robot import get_greedy_action
from scripts.evaluate_robot import get_greedy_with_unstick_action


# ---------------------------------------------------------------------------
# Logging Setup: console + logs/main.log
# ---------------------------------------------------------------------------
os.makedirs("logs", exist_ok=True)
_handlers = [logging.FileHandler("logs/main.log", mode="a", encoding="utf-8")]
if sys.stdout is not None:
    _handlers.append(logging.StreamHandler(sys.stdout))

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=_handlers
)
logger = logging.getLogger("WorldModelApp")


ACTION_NAMES = {
    RobotEnv.ACTION_UP: "UP",
    RobotEnv.ACTION_DOWN: "DOWN",
    RobotEnv.ACTION_LEFT: "LEFT",
    RobotEnv.ACTION_RIGHT: "RIGHT",
    RobotEnv.ACTION_STAY: "STAY",
}


class Application:
    """
    Main Interactive Pygame Demo Application for NBA Accreditation.
    
    Features:
    - Interactive Start Menu with Scenario Navigation
    - Split-Screen Mode (Key S): Live side-by-side comparison of WITHOUT vs WITH World Model
    - Imagination Panel (Key I): Displays last 10 steps of predicted vs actual trajectory + latency
    - Dynamic Throttle: Automatically scales n_samples to sustain 30 FPS if planning latency exceeds 25 ms
    - Live Metrics HUD: FPS, Action, Steps, Collisions, Latency, and Prediction MAE
    - Auto-Demo Mode (--demo): Hands-free showcase cycling Scenarios 1 & 2 with narrative captions
    - Help Overlay (Key H): Complete user manual
    - Full Defensive Architecture: Missing checkpoints, driving errors, and exceptions never crash
    """

    SINGLE_WIDTH = 900
    SINGLE_HEIGHT = 600
    SPLIT_WIDTH = 1800
    SPLIT_HEIGHT = 650
    FPS = 30

    STATE_MENU = "MENU"
    STATE_ROBOTICS = "ROBOTICS"
    STATE_DRIVING = "DRIVING"

    def __init__(
        self,
        demo_mode: bool = False,
        fullscreen: bool = False,
        initial_seed: int = 1000,
        initial_scenario: int = 1,
        force_split: bool = True,
        menu_mode: bool = False,
        classic: bool = False,
        quality: str = "high",
        mute: bool = False
    ):
        pygame.init()
        pygame.display.set_caption("World Model: Learn, Imagine, Act (NBA Accreditation Showcase)")

        self.demo_mode = demo_mode
        self.fullscreen = fullscreen
        self.split_mode = force_split or demo_mode
        self.current_seed = initial_seed
        self.robot_scenario = initial_scenario
        self.classic_mode = classic
        self.quality_str = quality
        self.mute_audio = mute
        self.clock = pygame.time.Clock()
        self.running = True

        # Determine screen bounds for responsive windowing (headless safe)
        disp_info = pygame.display.Info()
        raw_w = disp_info.current_w
        raw_h = disp_info.current_h
        if raw_w < 600 or raw_h < 400:
            screen_w = 1707
            screen_h = 1067
        else:
            screen_w = raw_w
            screen_h = raw_h

        if screen_w >= 1860 and screen_h >= 720:
            self.split_width = 1800
            self.split_height = 650
        else:
            self.split_width = max(self.SINGLE_WIDTH, min(1500, screen_w - 60))
            self.split_height = max(self.SINGLE_HEIGHT, min(560, screen_h - 120))

        # Setup Display Mode
        w, h = (self.split_width, self.split_height) if self.split_mode else (self.SINGLE_WIDTH, self.SINGLE_HEIGHT)
        flags = pygame.FULLSCREEN if self.fullscreen else 0
        self.screen = pygame.display.set_mode((w, h), flags)
        self._bring_to_foreground()

        # Offscreen render surfaces
        self.surf_left = pygame.Surface((self.SINGLE_WIDTH, self.SINGLE_HEIGHT))
        self.surf_right = pygame.Surface((self.SINGLE_WIDTH, self.SINGLE_HEIGHT))

        # Typography
        self.font_title = pygame.font.SysFont("Arial", 28, bold=True)
        self.font_subtitle = pygame.font.SysFont("Arial", 16)
        self.font_btn = pygame.font.SysFont("Arial", 18, bold=True)
        self.font_info = pygame.font.SysFont("Arial", 13)
        self.font_bold = pygame.font.SysFont("Arial", 13, bold=True)
        self.font_banner = pygame.font.SysFont("Arial", 15, bold=True)
        self.font_hud = pygame.font.SysFont("Consolas", 13)

        # State management: start directly in ROBOTICS simulation
        self.state = self.STATE_MENU if menu_mode else self.STATE_ROBOTICS
        self.show_imagination = True
        self.show_help = False
        self.banner_message = ""
        self.banner_color = (255, 100, 100)
        self.banner_timer = 0

        # Dynamic Throttle
        self.n_samples = 300
        self.throttle_active = False
        self.last_latency_ms = 0.0

        # Prediction History Buffer for Imagination Panel (deque of last 10 steps)
        # Each item: (actual_x, actual_y, pred_x, pred_y, error_mae)
        self.imagination_history: Deque[Tuple[float, float, float, float, float]] = collections.deque(maxlen=10)
        self.last_predicted_next_pos: Optional[Tuple[float, float]] = None
        self.current_pred_mae = 0.0
        self.last_executed_action = RobotEnv.ACTION_STAY

        # Robotics Environments & Models
        self.env_left: Optional[RobotEnv] = None
        self.env_right: Optional[RobotEnv] = None
        self.robot_model: Optional[WorldModel] = None
        self.with_world_model = True

        # Split-Screen Synchronized Episodes & Metrics
        self.state_left: Optional[np.ndarray] = None
        self.state_right: Optional[np.ndarray] = None
        self.done_left = False
        self.done_right = False
        self.plan_info_right: Optional[Dict[str, Any]] = None
        self.auto_reset_timer = 0
        self.demo_episode_counter = 0

        # Cumulative counters for split-screen comparison
        self.stats_left = {"episodes": 0, "successes": 0, "collisions": 0, "steps": 0}
        self.stats_right = {"episodes": 0, "successes": 0, "collisions": 0, "steps": 0}

        # Stuck detection
        self.stuck_counter_left = 0
        self.stuck_counter_right = 0
        self.last_pos_left = (0.0, 0.0)
        self.last_pos_right = (0.0, 0.0)

        if self.state == self.STATE_ROBOTICS:
            self._enter_robotics()

        logger.info(f"App initialized (state={self.state}, split={self.split_mode}, scenario={self.robot_scenario})")

    # =========================================================================
    # DISPLAY RESIZING & HELPERS
    # =========================================================================
    def _bring_to_foreground(self) -> None:
        try:
            import ctypes
            wm = pygame.display.get_wm_info()
            hwnd = wm.get("window")
            if hwnd:
                ctypes.windll.user32.ShowWindow(hwnd, 9)  # SW_RESTORE
                HWND_TOPMOST = -1
                HWND_NOTOPMOST = -2
                flags = 0x0002 | 0x0001 | 0x0040  # SWP_NOMOVE | SWP_NOSIZE | SWP_SHOWWINDOW
                ctypes.windll.user32.SetWindowPos(hwnd, HWND_TOPMOST, 0, 0, 0, 0, flags)
                ctypes.windll.user32.SetForegroundWindow(hwnd)
                ctypes.windll.user32.SetWindowPos(hwnd, HWND_NOTOPMOST, 0, 0, 0, 0, flags)
        except Exception:
            pass

    def _toggle_split_mode(self) -> None:
        self.split_mode = not self.split_mode
        w, h = (self.split_width, self.split_height) if self.split_mode else (self.SINGLE_WIDTH, self.SINGLE_HEIGHT)
        flags = pygame.FULLSCREEN if self.fullscreen else 0
        self.screen = pygame.display.set_mode((w, h), flags)
        self._bring_to_foreground()
        self.set_banner(
            f"Split-Screen {'ENABLED (Greedy vs MPC)' if self.split_mode else 'DISABLED (Single View)'}",
            color=(0, 200, 255),
            duration_frames=60
        )
        self._reset_episode(same_seed=True)

    def set_banner(self, message: str, color=(255, 120, 120), duration_frames=120) -> None:
        self.banner_message = message
        self.banner_color = color
        self.banner_timer = duration_frames
        logger.info(f"UI Banner: {message}")

    # =========================================================================
    # MENU STATE
    # =========================================================================
    def _draw_menu(self) -> None:
        self.screen.fill((18, 22, 30))
        w = self.screen.get_width()
        h = self.screen.get_height()

        # Ambient grid lines
        for x in range(0, w, 45):
            pygame.draw.line(self.screen, (26, 32, 44), (x, 0), (x, h), 1)
        for y in range(0, h, 45):
            pygame.draw.line(self.screen, (26, 32, 44), (0, y), (w, y), 1)

        # Title Card
        title_surf = self.font_title.render("WORLD MODEL: LEARN, IMAGINE, ACT", True, (255, 255, 255))
        self.screen.blit(title_surf, (w // 2 - title_surf.get_width() // 2, 70))

        sub_surf = self.font_subtitle.render(
            "Predictive Simulation & Model Predictive Control Showcase", True, (130, 180, 230)
        )
        self.screen.blit(sub_surf, (w // 2 - sub_surf.get_width() // 2, 115))

        desc_surf = self.font_info.render(
            "National Board of Accreditation (NBA) Technical Demonstration", True, (120, 140, 170)
        )
        self.screen.blit(desc_surf, (w // 2 - desc_surf.get_width() // 2, 142))

        # Buttons
        mouse_pos = pygame.mouse.get_pos()
        self.btn_robotics_rect = pygame.Rect(w // 2 - 180, 200, 360, 55)
        self.btn_split_rect = pygame.Rect(w // 2 - 180, 270, 360, 55)
        self.btn_driving_rect = pygame.Rect(w // 2 - 180, 340, 360, 55)
        self.btn_quit_rect = pygame.Rect(w // 2 - 180, 410, 360, 55)

        buttons = [
            (self.btn_robotics_rect, "1 - Autonomous Robotics Single View", (0, 180, 240)),
            (self.btn_split_rect, "S - Split-Screen Comparison (Evaluator)", (50, 220, 140)),
            (self.btn_driving_rect, "2 - Autonomous Driving (Gurudutt)", (160, 130, 230)),
            (self.btn_quit_rect, "ESC - Quit Application", (220, 70, 70))
        ]

        for rect, label, accent in buttons:
            is_hover = rect.collidepoint(mouse_pos)
            bg = (38, 48, 65) if is_hover else (28, 35, 48)
            pygame.draw.rect(self.screen, bg, rect, border_radius=8)
            pygame.draw.rect(self.screen, accent if is_hover else (60, 75, 100), rect, 2, border_radius=8)
            txt = self.font_btn.render(label, True, (255, 255, 255) if is_hover else (210, 225, 240))
            self.screen.blit(txt, (rect.centerx - txt.get_width() // 2, rect.centery - txt.get_height() // 2))

        foot = self.font_info.render(
            "Quick Launch: Press 1 for Single | Press S for Split-Screen | Press H for Help", True, (130, 145, 170)
        )
        self.screen.blit(foot, (w // 2 - foot.get_width() // 2, 510))

        self._draw_banner()

    def _handle_menu_event(self, event: pygame.event.Event) -> None:
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_1:
                self.split_mode = False
                self._enter_robotics()
            elif event.key == pygame.K_s:
                self.split_mode = True
                self._enter_robotics()
            elif event.key == pygame.K_2:
                self._enter_driving()
            elif event.key == pygame.K_h:
                self.show_help = not self.show_help
            elif event.key == pygame.K_ESCAPE:
                self.running = False
        elif event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
            if hasattr(self, "btn_robotics_rect") and self.btn_robotics_rect.collidepoint(event.pos):
                self.split_mode = False
                self._enter_robotics()
            elif hasattr(self, "btn_split_rect") and self.btn_split_rect.collidepoint(event.pos):
                self.split_mode = True
                self._enter_robotics()
            elif hasattr(self, "btn_driving_rect") and self.btn_driving_rect.collidepoint(event.pos):
                self._enter_driving()
            elif hasattr(self, "btn_quit_rect") and self.btn_quit_rect.collidepoint(event.pos):
                self.running = False

    # =========================================================================
    # MODEL LOADING & ROBOTICS SETUP
    # =========================================================================
    def _load_robot_model(self, scenario: int) -> None:
        scen2_path = "models/robot_model_s2.pt"
        default_path = "models/robot_model.pt"
        model_path = scen2_path if (scenario == 2 and os.path.exists(scen2_path)) else default_path

        if not os.path.exists(model_path):
            self.robot_model = None
            self.with_world_model = False
            self.set_banner(f"Model {model_path} not found. Running baseline.", duration_frames=150)
            logger.warning(f"{model_path} missing; running baseline.")
            return

        try:
            state_sz = self.env_right.get_state_size() if self.env_right else 16
            action_sz = self.env_right.get_action_size() if self.env_right else 5
            self.robot_model = load_model(model_path, state_size=state_sz, action_size=action_sz)
            self.with_world_model = True
            logger.info(f"Loaded world model checkpoint from {model_path}")
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            self.robot_model = None
            self.with_world_model = False
            self.set_banner(f"Model error: {e}. Using baseline.", duration_frames=150)

    def _enter_robotics(self) -> None:
        w, h = (self.split_width, self.split_height) if self.split_mode else (self.SINGLE_WIDTH, self.SINGLE_HEIGHT)
        flags = pygame.FULLSCREEN if self.fullscreen else 0
        self.screen = pygame.display.set_mode((w, h), flags)
        self._bring_to_foreground()

        self.env_left = RobotEnv(scenario=self.robot_scenario)
        self.env_right = RobotEnv(scenario=self.robot_scenario)

        if self.classic_mode:
            self.env_left.use_modern_renderer = False
            self.env_right.use_modern_renderer = False
        else:
            from visuals.theme import QualityLevel
            q_val = QualityLevel.from_string(self.quality_str)
            for env in [self.env_left, self.env_right]:
                if hasattr(env, "_modern_renderer") and env._modern_renderer:
                    env._modern_renderer.quality = q_val
                    if self.mute_audio:
                        env._modern_renderer.sounds.muted = True

        self._load_robot_model(self.robot_scenario)
        self._reset_episode(same_seed=True)
        self.state = self.STATE_ROBOTICS

    def _reset_episode(self, same_seed: bool = False) -> None:
        if not same_seed:
            self.current_seed += 1

        if self.env_left is not None:
            self.state_left = self.env_left.reset(seed=self.current_seed)
        if self.env_right is not None:
            self.state_right = self.env_right.reset(seed=self.current_seed)

        self.done_left = False
        self.done_right = False
        self.plan_info_right = None
        self.auto_reset_timer = 0
        self.stuck_counter_left = 0
        self.stuck_counter_right = 0
        self.imagination_history.clear()
        self.last_predicted_next_pos = None

    # =========================================================================
    # SIMULATION STEPPING & PLANNING
    # =========================================================================
    def _step_robotics(self) -> None:
        if self.env_right is None:
            return

        # Auto-reset countdown
        if (self.done_right and (not self.split_mode or self.done_left)):
            if self.auto_reset_timer > 0:
                self.auto_reset_timer -= 1
                if self.auto_reset_timer == 0:
                    self.demo_episode_counter += 1
                    # Auto-demo scenario switching: 3 episodes of S1, then 3 of S2
                    if self.demo_mode and self.demo_episode_counter >= 3:
                        self.demo_episode_counter = 0
                        self.robot_scenario = 2 if self.robot_scenario == 1 else 1
                        self.env_left.scenario = self.robot_scenario
                        self.env_right.scenario = self.robot_scenario
                        self._load_robot_model(self.robot_scenario)
                        scen_name = "Scenario 1 (Static Chair)" if self.robot_scenario == 1 else "Scenario 2 (Moving Person)"
                        self.set_banner(f"Auto-Demo Switching to {scen_name}", color=(0, 240, 180), duration_frames=90)
                    self._reset_episode()
            return

        # -------------------------------------------------------------
        # STEP LEFT: WITHOUT WORLD MODEL (Greedy Baseline)
        # -------------------------------------------------------------
        if self.split_mode and not self.done_left and self.env_left is not None:
            pos_left = (round(self.env_left.robot_x, 1), round(self.env_left.robot_y, 1))
            if pos_left == self.last_pos_left:
                self.stuck_counter_left += 1
            else:
                self.stuck_counter_left = 0
                self.last_pos_left = pos_left

            # Greedy action with evasive unstick
            action_left = get_greedy_with_unstick_action(
                self.env_left,
                consecutive_collisions=self.stuck_counter_left,
                last_action=getattr(self, "_last_act_left", RobotEnv.ACTION_STAY)
            )
            self._last_act_left = action_left

            self.state_left, r_l, self.done_left, info_l = self.env_left.step(action_left)
            self.stats_left["steps"] += 1
            if info_l["collision"]:
                self.stats_left["collisions"] += 1
            if self.done_left:
                self.stats_left["episodes"] += 1
                if info_l["reached_goal"]:
                    self.stats_left["successes"] += 1

        # -------------------------------------------------------------
        # STEP RIGHT: WITH WORLD MODEL (MPC Planner)
        # -------------------------------------------------------------
        if not self.done_right and self.env_right is not None:
            pos_right = (round(self.env_right.robot_x, 1), round(self.env_right.robot_y, 1))
            if pos_right == self.last_pos_right:
                self.stuck_counter_right += 1
            else:
                self.stuck_counter_right = 0
                self.last_pos_right = pos_right

            action_right = RobotEnv.ACTION_STAY
            self.plan_info_right = None

            if self.stuck_counter_right >= 6:
                # Evasive random non-colliding action
                valid_acts = []
                for a_cand in range(self.env_right.get_action_size()):
                    dx, dy = self.env_right.ACTION_DELTAS.get(a_cand, (0.0, 0.0))
                    if not self.env_right._check_collision(self.env_right.robot_x + dx, self.env_right.robot_y + dy):
                        valid_acts.append(a_cand)
                action_right = np.random.choice(valid_acts) if valid_acts else np.random.randint(0, self.env_right.get_action_size())
                self.stuck_counter_right = 0
            elif self.with_world_model and self.robot_model is not None:
                t0 = time.perf_counter()
                try:
                    action_right, self.plan_info_right = plan(
                        model=self.robot_model,
                        state=self.state_right,
                        action_size=self.env_right.get_action_size(),
                        horizon=14,
                        n_samples=self.n_samples,
                        gamma=0.95,
                        return_trajectories=True
                    )
                except Exception as e:
                    logger.error(f"Planning exception: {e}")
                    action_right = get_greedy_action(
                        self.env_right.robot_x, self.env_right.robot_y,
                        self.env_right.goal_x, self.env_right.goal_y
                    )

                self.last_latency_ms = (time.perf_counter() - t0) * 1000.0

                # Dynamic throttle: keep planning latency below 25 ms for solid 30 FPS
                if self.last_latency_ms > 25.0:
                    self.n_samples = max(100, int(self.n_samples * 0.85))
                    self.throttle_active = True
                elif self.last_latency_ms < 14.0 and self.n_samples < 300:
                    self.n_samples = min(300, self.n_samples + 15)
                    if self.n_samples == 300:
                        self.throttle_active = False
            else:
                action_right = get_greedy_action(
                    self.env_right.robot_x, self.env_right.robot_y,
                    self.env_right.goal_x, self.env_right.goal_y
                )

            self.last_executed_action = action_right

            # Record predicted position for step t from previous plan
            pred_next_pos = None
            if self.plan_info_right and "best_trajectory" in self.plan_info_right:
                best_traj = self.plan_info_right["best_trajectory"]
                if len(best_traj) > 1:
                    norm_px, norm_py = float(best_traj[1, 0]), float(best_traj[1, 1])
                    pred_next_pos = RobotEnv.denormalize_pos(norm_px, norm_py)

            # Step Right Environment
            self.env_right.current_plan_info = self.plan_info_right
            prev_rx, prev_ry = self.env_right.robot_x, self.env_right.robot_y
            self.state_right, r_r, self.done_right, info_r = self.env_right.step(action_right)
            curr_rx, curr_ry = self.env_right.robot_x, self.env_right.robot_y

            # Compute 1-step prediction error
            if self.last_predicted_next_pos is not None:
                exp_x, exp_y = self.last_predicted_next_pos
                err = (abs(exp_x - curr_rx) / (self.SINGLE_WIDTH / 2.0) + abs(exp_y - curr_ry) / (self.SINGLE_HEIGHT / 2.0)) / 2.0
                self.current_pred_mae = float(err)
                self.imagination_history.append((curr_rx, curr_ry, exp_x, exp_y, err))

            self.last_predicted_next_pos = pred_next_pos

            self.stats_right["steps"] += 1
            if info_r["collision"]:
                self.stats_right["collisions"] += 1
            if self.done_right:
                self.stats_right["episodes"] += 1
                if info_r["reached_goal"]:
                    self.stats_right["successes"] += 1

        # Check if episode ended
        if (self.done_right and (not self.split_mode or self.done_left)) and self.auto_reset_timer == 0:
            self.auto_reset_timer = 45  # 1.5s auto-reset delay

    # =========================================================================
    # DRAWING & HUD RENDERING
    # =========================================================================
    def _draw_robotics(self) -> None:
        self.screen.fill((16, 20, 28))

        if self.split_mode:
            # -------------------------------------------------------------
            # SPLIT-SCREEN MODE (Responsive width x height)
            # -------------------------------------------------------------
            half_w = self.split_width // 2
            viewport_h = self.split_height - 45

            # 1. Render Left Environment (Greedy)
            if self.env_left is not None:
                self.env_left.render(self.surf_left)
                self._draw_viewport_header(
                    surf=self.surf_left,
                    title="WITHOUT WORLD MODEL (Greedy Baseline)",
                    accent_col=(235, 80, 80),
                    stats=self.stats_left,
                    curr_env=self.env_left,
                    done=self.done_left
                )
                if (half_w, viewport_h) == (self.SINGLE_WIDTH, self.SINGLE_HEIGHT):
                    self.screen.blit(self.surf_left, (0, 45))
                else:
                    scaled_l = pygame.transform.smoothscale(self.surf_left, (half_w, viewport_h))
                    self.screen.blit(scaled_l, (0, 45))

            # 2. Render Right Environment (With World Model)
            if self.env_right is not None:
                self.env_right.render(self.surf_right)
                if self.with_world_model and self.plan_info_right:
                    draw_ghost_paths(self.surf_right, self.plan_info_right)
                self._draw_viewport_header(
                    surf=self.surf_right,
                    title="WITH WORLD MODEL (MPC Planner)",
                    accent_col=(40, 220, 130),
                    stats=self.stats_right,
                    curr_env=self.env_right,
                    done=self.done_right
                )
                if self.show_imagination:
                    self._draw_imagination_overlay(self.surf_right)
                if (half_w, viewport_h) == (self.SINGLE_WIDTH, self.SINGLE_HEIGHT):
                    self.screen.blit(self.surf_right, (half_w, 45))
                else:
                    scaled_r = pygame.transform.smoothscale(self.surf_right, (half_w, viewport_h))
                    self.screen.blit(scaled_r, (half_w, 45))

            # 3. Center dividing line
            pygame.draw.line(self.screen, (60, 80, 110), (half_w, 0), (half_w, self.split_height), 2)

            # 4. Top Super-Header for Demonstration
            self._draw_split_super_header()

        else:
            # -------------------------------------------------------------
            # SINGLE VIEW MODE (900 x 600)
            # -------------------------------------------------------------
            if self.env_right is not None:
                self.env_right.render(self.screen)
                if self.with_world_model and self.plan_info_right:
                    draw_ghost_paths(self.screen, self.plan_info_right)
                if self.show_imagination and self.with_world_model:
                    self._draw_imagination_overlay(self.screen)

            # Live Metrics HUD overlay in Single View
            self._draw_live_metrics_hud(self.screen)

        # End of episode Star Rating Card
        if (self.done_right and (not self.split_mode or self.done_left)) and self.env_right:
            from visuals.ui import StarRatingCard
            card_w, card_h = 360, 140
            cx = self.screen.get_width() // 2 - card_w // 2
            cy = self.screen.get_height() // 2 - card_h // 2
            card_rect = pygame.Rect(cx, cy, card_w, card_h)
            last_inf = getattr(self.env_right, "last_step_info", {}) or {}
            reached_g = bool(last_inf.get("reached_goal", False))
            StarRatingCard(card_rect).draw(
                surface=self.screen,
                reached_goal=reached_g,
                collisions=self.env_right.collision_count,
                steps=self.env_right.step_count,
                method_name="World Model MPC" if self.with_world_model else "Greedy Baseline"
            )

        # Bottom Interactive Controls Pill
        self._draw_controls_pill()

        # Alert banner
        self._draw_banner()

        # Help modal
        if self.show_help:
            self._draw_help_modal()

    def _draw_viewport_header(
        self,
        surf: pygame.Surface,
        title: str,
        accent_col: Tuple[int, int, int],
        stats: Dict[str, Any],
        curr_env: RobotEnv,
        done: bool
    ) -> None:
        header_surf = pygame.Surface((self.SINGLE_WIDTH, 34), pygame.SRCALPHA)
        header_surf.fill((14, 18, 26, 220))
        surf.blit(header_surf, (0, 0))

        # Title
        t_surf = self.font_bold.render(title, True, accent_col)
        surf.blit(t_surf, (15, 8))

        # Live counters
        ep_count = max(1, stats["episodes"])
        succ_rate = (stats["successes"] / ep_count) * 100.0
        coll_avg = stats["collisions"] / ep_count

        status_txt = f"Steps: {curr_env.step_count:3d}/{curr_env.MAX_STEPS}  |  Hits: {curr_env.collision_count:2d}  |  Win Rate: {succ_rate:4.1f}%  |  Avg Hits: {coll_avg:.1f}"
        s_surf = self.font_hud.render(status_txt, True, (210, 225, 240))
        surf.blit(s_surf, (self.SINGLE_WIDTH - s_surf.get_width() - 15, 8))

        if done:
            reached = (curr_env.step_count < curr_env.MAX_STEPS and curr_env.collision_count == 0) or curr_env.robot_x == curr_env.goal_x
            res_txt = "GOAL REACHED!" if curr_env.collision_count == 0 else f"DONE (Hits={curr_env.collision_count})"
            res_col = (40, 240, 120) if curr_env.collision_count == 0 else (255, 180, 50)
            box = pygame.Rect(self.SINGLE_WIDTH // 2 - 130, 260, 260, 48)
            pygame.draw.rect(surf, (15, 20, 30, 230), box, border_radius=8)
            pygame.draw.rect(surf, res_col, box, 2, border_radius=8)
            txt_s = self.font_btn.render(res_txt, True, res_col)
            surf.blit(txt_s, (box.centerx - txt_s.get_width() // 2, box.centery - txt_s.get_height() // 2))

    def _draw_split_super_header(self) -> None:
        bar_rect = pygame.Rect(0, 0, self.split_width, 44)
        pygame.draw.rect(self.screen, (20, 26, 38), bar_rect)
        pygame.draw.line(self.screen, (50, 65, 90), (0, 44), (self.split_width, 44), 2)

        # Accreditation Title
        title_txt = "NBA EVALUATOR SHOWCASE: WORLD MODEL PREDICTIVE CONTROL VS REACTIVE GREEDY"
        t_surf = self.font_bold.render(title_txt, True, (255, 255, 255))
        self.screen.blit(t_surf, (20, 12))

        # Narrative badge in auto-demo
        if self.demo_mode:
            act_txt = "ACT I: LEARN & IMAGINE" if self.robot_scenario == 1 else "ACT II: DYNAMIC FORECAST"
            badge_surf = self.font_bold.render(f"AUTO-DEMO [{act_txt}]", True, (0, 255, 200))
            self.screen.blit(badge_surf, (self.split_width // 2 - badge_surf.get_width() // 2, 12))

        # Seed & Scenario badge
        scen_str = f"Scenario {self.robot_scenario} | Seed: {self.current_seed}"
        scen_surf = self.font_hud.render(scen_str, True, (160, 185, 215))
        self.screen.blit(scen_surf, (self.split_width - scen_surf.get_width() - 20, 14))

    def _draw_imagination_overlay(self, surf: pygame.Surface) -> None:
        """
        Renders the Imagination overlay panel:
        - Ghost Green vs Cyan path overlay
        - 1-Step Prediction MAE
        - Planning Latency in ms (Target < 25ms)
        - Dynamic throttle indicator
        """
        panel_w, panel_h = 290, 160
        panel_x = self.SINGLE_WIDTH - panel_w - 15
        panel_y = 45

        panel_bg = pygame.Surface((panel_w, panel_h), pygame.SRCALPHA)
        panel_bg.fill((12, 16, 24, 230))
        surf.blit(panel_bg, (panel_x, panel_y))
        pygame.draw.rect(surf, (0, 200, 255), (panel_x, panel_y, panel_w, panel_h), 1, border_radius=6)

        # Header
        t_surf = self.font_bold.render("IMAGINATION ENGINE (Latent MPC)", True, (0, 220, 255))
        surf.blit(t_surf, (panel_x + 10, panel_y + 8))

        # Draw trajectory history (last 10 steps)
        # Actual in Cyan, Predicted in Ghost Green
        history_box = pygame.Rect(panel_x + 10, panel_y + 30, panel_w - 20, 36)
        pygame.draw.rect(surf, (20, 28, 40), history_box, border_radius=4)

        if len(self.imagination_history) >= 2:
            min_x = min(p[0] for p in self.imagination_history)
            max_x = max(p[0] for p in self.imagination_history) + 1e-4
            min_y = min(p[1] for p in self.imagination_history)
            max_y = max(p[1] for p in self.imagination_history) + 1e-4

            for i in range(len(self.imagination_history) - 1):
                cur_act = self.imagination_history[i]
                nxt_act = self.imagination_history[i + 1]

                # Map to box coords
                def to_box(px, py):
                    bx = history_box.x + 8 + ((px - min_x) / (max_x - min_x)) * (history_box.width - 16)
                    by = history_box.y + 6 + ((py - min_y) / (max_y - min_y)) * (history_box.height - 12)
                    return int(bx), int(by)

                # Cyan actual path
                p1_act = to_box(cur_act[0], cur_act[1])
                p2_act = to_box(nxt_act[0], nxt_act[1])
                pygame.draw.line(surf, (0, 255, 230), p1_act, p2_act, 2)
                # Ghost green predicted path
                p1_prd = to_box(cur_act[2], cur_act[3])
                p2_prd = to_box(nxt_act[2], nxt_act[3])
                pygame.draw.line(surf, (50, 255, 120), p1_prd, p2_prd, 1)

        # Legend
        l_act = self.font_hud.render("- Actual (Cyan)", True, (0, 255, 230))
        l_prd = self.font_hud.render("- Predicted (Green)", True, (50, 255, 120))
        surf.blit(l_act, (panel_x + 12, panel_y + 70))
        surf.blit(l_prd, (panel_x + 140, panel_y + 70))

        # Metrics rows
        mae_col = (50, 240, 130) if self.current_pred_mae < 0.01 else (255, 200, 50)
        m_txt = f"1-Step Delta MAE:  {self.current_pred_mae:.5f}"
        surf.blit(self.font_hud.render(m_txt, True, mae_col), (panel_x + 12, panel_y + 92))

        lat_col = (50, 240, 130) if self.last_latency_ms < 25.0 else (255, 120, 50)
        lat_txt = f"Plan Latency:      {self.last_latency_ms:5.1f} ms (<25ms)"
        surf.blit(self.font_hud.render(lat_txt, True, lat_col), (panel_x + 12, panel_y + 112))

        th_txt = f"MPC Sampling:      {self.n_samples} samples {'[THROTTLED]' if self.throttle_active else '[OPTIMAL]'}"
        th_col = (255, 150, 50) if self.throttle_active else (180, 200, 220)
        surf.blit(self.font_hud.render(th_txt, True, th_col), (panel_x + 12, panel_y + 132))

    def _draw_live_metrics_hud(self, surf: pygame.Surface) -> None:
        hud_w, hud_h = 320, 100
        hud_x = 15
        hud_y = 15

        hud_bg = pygame.Surface((hud_w, hud_h), pygame.SRCALPHA)
        hud_bg.fill((15, 20, 30, 210))
        surf.blit(hud_bg, (hud_x, hud_y))
        pygame.draw.rect(surf, (50, 70, 95), (hud_x, hud_y, hud_w, hud_h), 1, border_radius=6)

        mode_txt = "WITH WORLD MODEL" if self.with_world_model else "WITHOUT (Greedy)"
        mode_col = (40, 230, 130) if self.with_world_model else (240, 80, 80)
        surf.blit(self.font_bold.render(f"MODE: {mode_txt}", True, mode_col), (hud_x + 10, hud_y + 8))

        fps = self.clock.get_fps()
        act_name = ACTION_NAMES.get(self.last_executed_action, "STAY")
        lines = [
            f"FPS: {fps:4.1f}  |  Action: {act_name:<5}  |  Seed: {self.current_seed}",
            f"Steps: {self.env_right.step_count:3d}/{self.env_right.MAX_STEPS}  |  Collisions: {self.env_right.collision_count:2d}",
            f"Plan Latency: {self.last_latency_ms:4.1f} ms  |  MAE: {self.current_pred_mae:.5f}"
        ]
        for i, l in enumerate(lines):
            surf.blit(self.font_hud.render(l, True, (200, 220, 240)), (hud_x + 10, hud_y + 32 + i * 20))

    def _draw_controls_pill(self) -> None:
        w = self.screen.get_width()
        h = self.screen.get_height()
        pill_w = min(880, w - 40)
        pill_rect = pygame.Rect(w // 2 - pill_w // 2, h - 34, pill_w, 26)
        pygame.draw.rect(self.screen, (12, 16, 24, 220), pill_rect, border_radius=13)
        pygame.draw.rect(self.screen, (50, 70, 95), pill_rect, 1, border_radius=13)

        ctrl_txt = self.font_info.render(
            "[S] Split-Screen Compare  |  [I] Imagination HUD  |  [TAB] Toggle WM  |  [1/2] Scenario  |  [R] Reset  |  [H] Help  |  [ESC] Menu",
            True, (190, 215, 235)
        )
        self.screen.blit(ctrl_txt, (pill_rect.centerx - ctrl_txt.get_width() // 2, pill_rect.centery - ctrl_txt.get_height() // 2))

    def _draw_help_modal(self) -> None:
        w = self.screen.get_width()
        h = self.screen.get_height()
        modal_w, modal_h = 620, 390
        modal_rect = pygame.Rect(w // 2 - modal_w // 2, h // 2 - modal_h // 2, modal_w, modal_h)

        overlay = pygame.Surface((w, h), pygame.SRCALPHA)
        overlay.fill((0, 0, 0, 160))
        self.screen.blit(overlay, (0, 0))

        pygame.draw.rect(self.screen, (20, 26, 38), modal_rect, border_radius=10)
        pygame.draw.rect(self.screen, (0, 200, 255), modal_rect, 2, border_radius=10)

        t_surf = self.font_title.render("SYSTEM CONTROLS & ARCHITECTURE", True, (255, 255, 255))
        self.screen.blit(t_surf, (modal_rect.centerx - t_surf.get_width() // 2, modal_rect.y + 18))

        guide = [
            ("[S] Key", "Toggle Split-Screen side-by-side evaluator view"),
            ("[I] Key", "Toggle Imagination panel (10-step history, latency & MAE)"),
            ("[TAB] / [T]", "Toggle World Model ON/OFF in single view"),
            ("[1] / [2]", "Switch between Scenario 1 (Static Chair) and Scenario 2 (Moving Person)"),
            ("[R] Key", "Force reset current episode with same layout"),
            ("[N] Key", "Advance to next seeded layout"),
            ("[H] Key", "Toggle this help modal"),
            ("[ESC] Key", "Return to main menu or quit"),
            ("--demo Flag", "Unattended hands-free NBA booth loop with narrative cards"),
            ("Dynamic Throttle", "Keeps planning latency <25 ms by dynamically tuning sample count")
        ]

        for i, (k, desc) in enumerate(guide):
            y = modal_rect.y + 65 + i * 28
            k_surf = self.font_bold.render(k, True, (0, 220, 255))
            d_surf = self.font_info.render(desc, True, (210, 225, 240))
            self.screen.blit(k_surf, (modal_rect.x + 30, y))
            self.screen.blit(d_surf, (modal_rect.x + 180, y))

        close_surf = self.font_info.render("Press [H] or click anywhere to close", True, (140, 160, 190))
        self.screen.blit(close_surf, (modal_rect.centerx - close_surf.get_width() // 2, modal_rect.bottom - 28))

    def _draw_banner(self) -> None:
        if self.banner_timer > 0 and self.banner_message:
            self.banner_timer -= 1
            w = self.screen.get_width()
            b_surf = self.font_banner.render(self.banner_message, True, (255, 255, 255))
            b_w = b_surf.get_width() + 32
            b_h = 34
            b_rect = pygame.Rect(w // 2 - b_w // 2, 8, b_w, b_h)
            pygame.draw.rect(self.screen, self.banner_color, b_rect, border_radius=6)
            pygame.draw.rect(self.screen, (255, 255, 255), b_rect, 2, border_radius=6)
            self.screen.blit(b_surf, (b_rect.centerx - b_surf.get_width() // 2, b_rect.centery - b_surf.get_height() // 2))

    # =========================================================================
    # EVENT HANDLING
    # =========================================================================
    def _handle_robotics_event(self, event: pygame.event.Event) -> None:
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_h:
                self.show_help = not self.show_help
            elif self.show_help:
                self.show_help = False
                return
            elif event.key == pygame.K_s:
                self._toggle_split_mode()
            elif event.key == pygame.K_m:
                # Toggle Mind View on modern renderers
                new_mv = False
                for env in [self.env_left, self.env_right]:
                    if env and getattr(env, "_modern_renderer", None):
                        env._modern_renderer.show_mind_view = not env._modern_renderer.show_mind_view
                        new_mv = env._modern_renderer.show_mind_view
                self.set_banner(f"Holographic Mind View {'ENABLED' if new_mv else 'DISABLED'} (M Key)", color=(0, 220, 255), duration_frames=60)
            elif event.key == pygame.K_F3:
                new_hb = False
                for env in [self.env_left, self.env_right]:
                    if env and getattr(env, "_modern_renderer", None):
                        env._modern_renderer.show_hitboxes = not env._modern_renderer.show_hitboxes
                        new_hb = env._modern_renderer.show_hitboxes
                self.set_banner(f"Hitbox Debug Overlay {'ENABLED' if new_hb else 'DISABLED'} (F3 Key)", color=(255, 200, 50), duration_frames=60)
            elif event.key == pygame.K_q:
                from visuals.theme import QualityLevel
                new_q = QualityLevel.LOW
                for env in [self.env_left, self.env_right]:
                    if env and getattr(env, "_modern_renderer", None):
                        curr_q = env._modern_renderer.quality
                        new_q = QualityLevel.MED if curr_q == QualityLevel.LOW else (QualityLevel.HIGH if curr_q == QualityLevel.MED else QualityLevel.LOW)
                        env._modern_renderer.quality = new_q
                self.set_banner(f"Graphics Quality set to {new_q.name} (Q Key)", color=(0, 240, 180), duration_frames=60)
            elif event.key in (pygame.K_p, pygame.K_u):
                muted = False
                for env in [self.env_left, self.env_right]:
                    if env and getattr(env, "_modern_renderer", None):
                        muted = env._modern_renderer.sounds.toggle_mute()
                self.set_banner(f"Audio {'MUTED' if muted else 'UNMUTED'} (P Key)", color=(255, 180, 50), duration_frames=60)
            elif event.key == pygame.K_i:
                self.show_imagination = not self.show_imagination
                self.set_banner(f"Imagination Panel {'SHOWN' if self.show_imagination else 'HIDDEN'}", color=(0, 200, 255), duration_frames=45)
            elif event.key in (pygame.K_TAB, pygame.K_t):
                if self.robot_model is None:
                    self.set_banner("Cannot enable World Model: checkpoint not found!", duration_frames=120)
                else:
                    self.with_world_model = not self.with_world_model
                    self.set_banner(f"Mode: {'WITH WORLD MODEL' if self.with_world_model else 'WITHOUT (Greedy)'}", color=(0, 220, 120), duration_frames=45)
            elif event.key == pygame.K_r:
                self._reset_episode(same_seed=True)
                self.set_banner("Episode reset.", color=(100, 180, 255), duration_frames=45)
            elif event.key == pygame.K_n:
                self._reset_episode(same_seed=False)
                self.set_banner(f"Advanced to seed {self.current_seed}", color=(100, 180, 255), duration_frames=45)
            elif event.key == pygame.K_1:
                self.robot_scenario = 1
                if self.env_left: self.env_left.scenario = 1
                if self.env_right: self.env_right.scenario = 1
                self._load_robot_model(1)
                self._reset_episode(same_seed=True)
                self.set_banner("Switched to Scenario 1 (Static Chair)", color=(0, 220, 200), duration_frames=60)
            elif event.key == pygame.K_2:
                self.robot_scenario = 2
                if self.env_left: self.env_left.scenario = 2
                if self.env_right: self.env_right.scenario = 2
                self._load_robot_model(2)
                self._reset_episode(same_seed=True)
                self.set_banner("Switched to Scenario 2 (Moving Person)", color=(0, 220, 200), duration_frames=60)
            elif event.key == pygame.K_ESCAPE:
                if self.demo_mode:
                    self.running = False
                else:
                    self.state = self.STATE_MENU
                    pygame.display.set_mode((self.SINGLE_WIDTH, self.SINGLE_HEIGHT))
        elif event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
            if self.show_help:
                self.show_help = False

    def _enter_driving(self) -> None:
        logger.info("Attempting to load Driving scenario via importlib...")
        try:
            driving_module = importlib.import_module("envs.driving_env")
            if hasattr(driving_module, "DrivingEnv"):
                self.set_banner("Driving placeholder active! Gurudutt owns full implementation.", color=(120, 220, 150), duration_frames=180)
            else:
                self.set_banner("Driving scenario not available yet (DrivingEnv missing).", duration_frames=150)
        except Exception as e:
            logger.warning(f"Driving scenario not available: {e}")
            self.set_banner("Driving scenario not available yet. (Gurudutt's branch)", duration_frames=150)
        self.state = self.STATE_MENU

    # =========================================================================
    # APPLICATION LOOP
    # =========================================================================
    def run(self, max_frames: Optional[int] = None) -> None:
        frame = 0
        logger.info(f"Starting application loop (max_frames={max_frames}).")

        while self.running:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    self.running = False
                elif self.state == self.STATE_MENU:
                    self._handle_menu_event(event)
                elif self.state == self.STATE_ROBOTICS:
                    self._handle_robotics_event(event)

            if self.state == self.STATE_MENU:
                self._draw_menu()
            elif self.state == self.STATE_ROBOTICS:
                self._step_robotics()
                self._draw_robotics()

            pygame.display.flip()
            self.clock.tick(self.FPS)

            frame += 1
            if max_frames is not None and frame >= max_frames:
                logger.info(f"Reached max_frames limit ({max_frames}). Terminating.")
                break

        pygame.quit()
        logger.info("Application cleanly closed.")


def main():
    parser = argparse.ArgumentParser(description="World Model: Learn, Imagine, Act Demo")
    parser.add_argument("--demo", action="store_true", help="Launch in hands-free split-screen auto-demo mode.")
    parser.add_argument("--fullscreen", action="store_true", help="Launch in fullscreen mode.")
    parser.add_argument("--split", action="store_true", default=True, help="Start directly in split-screen mode (default).")
    parser.add_argument("--single", action="store_true", help="Start in single-view mode instead of split-screen.")
    parser.add_argument("--menu", action="store_true", help="Start at the selection menu instead of directly in simulation.")
    parser.add_argument("--seed", type=int, default=1000, help="Initial random seed.")
    parser.add_argument("--scenario", type=int, default=1, choices=[1, 2], help="Initial scenario.")
    parser.add_argument("--max-frames", type=int, default=None, help="Terminate after N frames (for tests).")
    parser.add_argument("--classic", action="store_true", help="Run with original lightweight classic renderer.")
    parser.add_argument("--quality", type=str, default="high", choices=["low", "med", "high"], help="Graphics quality preset.")
    parser.add_argument("--mute", action="store_true", help="Launch with procedural audio muted.")
    args = parser.parse_args()

    app = Application(
        demo_mode=args.demo,
        fullscreen=args.fullscreen,
        initial_seed=args.seed,
        initial_scenario=args.scenario,
        force_split=False if args.single else True,
        menu_mode=args.menu,
        classic=args.classic,
        quality=args.quality,
        mute=args.mute
    )
    app.run(max_frames=args.max_frames)


if __name__ == "__main__":
    main()

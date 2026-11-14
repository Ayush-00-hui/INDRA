import os
import sys
import time
import importlib
import logging
from typing import Optional, Dict, Any, Tuple
import numpy as np
import pygame

# Ensure root directory is on PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from envs.robot_env import RobotEnv, draw_ghost_paths
from model.world_model import load_model, WorldModel
from planner.mpc import plan
from scripts.collect_data_robot import get_greedy_action


# ---------------------------------------------------------------------------
# Logging Setup: console + logs/main.log
# ---------------------------------------------------------------------------
os.makedirs("logs", exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler("logs/main.log", mode="a", encoding="utf-8")
    ]
)
logger = logging.getLogger("WorldModelApp")


class Application:
    """
    Main Interactive Pygame Demo Application.
    
    Provides:
    - Interactive Start Menu (Robotics, Driving, Quit)
    - Scenario Navigation with With/Without World Model comparison
    - Ghost trajectory rendering
    - Autonomous auto-reset after goal/timeout
    - Defensive architecture: missing model, driving env failure, and planning exceptions
      are caught, reported on-screen, and never terminate the window.
    """

    WIDTH = 900
    HEIGHT = 600
    FPS = 30

    STATE_MENU = "MENU"
    STATE_ROBOTICS = "ROBOTICS"
    STATE_DRIVING = "DRIVING"

    def __init__(self):
        pygame.init()
        pygame.display.set_caption("World Model: Learn, Imagine, Act (NBA Accreditation Demo)")
        self.screen = pygame.display.set_mode((self.WIDTH, self.HEIGHT))
        self.clock = pygame.time.Clock()
        self.running = True

        # Fonts
        self.font_title = pygame.font.SysFont("Arial", 32, bold=True)
        self.font_subtitle = pygame.font.SysFont("Arial", 18)
        self.font_btn = pygame.font.SysFont("Arial", 20, bold=True)
        self.font_info = pygame.font.SysFont("Arial", 14)
        self.font_banner = pygame.font.SysFont("Arial", 16, bold=True)

        # App state
        self.state = self.STATE_MENU
        self.banner_message = ""
        self.banner_color = (255, 100, 100)
        self.banner_timer = 0

        # Robotics state
        self.robot_env: Optional[RobotEnv] = None
        self.robot_model: Optional[WorldModel] = None
        self.with_world_model = True
        self.robot_scenario = 1
        self.robot_curr_state: Optional[np.ndarray] = None
        self.robot_plan_info: Optional[Dict[str, Any]] = None
        self.auto_reset_timer = 0
        self.last_outcome_msg = ""
        self.last_outcome_color = (255, 255, 255)

        logger.info("Application initialized.")

    def set_banner(self, message: str, color=(255, 120, 120), duration_frames=120) -> None:
        """Display an on-screen alert banner for a set number of frames."""
        self.banner_message = message
        self.banner_color = color
        self.banner_timer = duration_frames
        logger.warning(f"Banner: {message}")

    # =========================================================================
    # MENU STATE
    # =========================================================================
    def _draw_menu(self) -> None:
        self.screen.fill((20, 24, 33))

        # Ambient grid lines
        for x in range(0, self.WIDTH, 45):
            pygame.draw.line(self.screen, (28, 34, 46), (x, 0), (x, self.HEIGHT), 1)
        for y in range(0, self.HEIGHT, 45):
            pygame.draw.line(self.screen, (28, 34, 46), (0, y), (self.WIDTH, y), 1)

        # Title Card
        title_surf = self.font_title.render("WORLD MODEL: LEARN, IMAGINE, ACT", True, (255, 255, 255))
        self.screen.blit(title_surf, (self.WIDTH // 2 - title_surf.get_width() // 2, 70))

        sub_surf = self.font_subtitle.render(
            "Predictive Simulation & Model Predictive Control Prototype", True, (130, 170, 210)
        )
        self.screen.blit(sub_surf, (self.WIDTH // 2 - sub_surf.get_width() // 2, 115))

        desc_surf = self.font_info.render(
            "National Board of Accreditation (NBA) Technical Demonstration", True, (100, 120, 150)
        )
        self.screen.blit(desc_surf, (self.WIDTH // 2 - desc_surf.get_width() // 2, 142))

        # Buttons
        mouse_pos = pygame.mouse.get_pos()
        self.btn_robotics_rect = pygame.Rect(self.WIDTH // 2 - 180, 210, 360, 60)
        self.btn_driving_rect = pygame.Rect(self.WIDTH // 2 - 180, 290, 360, 60)
        self.btn_quit_rect = pygame.Rect(self.WIDTH // 2 - 180, 370, 360, 60)

        buttons = [
            (self.btn_robotics_rect, "1 - Autonomous Robotics", (0, 170, 230)),
            (self.btn_driving_rect, "2 - Autonomous Driving (Gurudutt)", (160, 130, 220)),
            (self.btn_quit_rect, "ESC - Quit Application", (180, 70, 70))
        ]

        for rect, label, accent in buttons:
            is_hover = rect.collidepoint(mouse_pos)
            bg = (38, 46, 62) if is_hover else (30, 36, 50)
            pygame.draw.rect(self.screen, bg, rect, border_radius=8)
            pygame.draw.rect(self.screen, accent if is_hover else (60, 70, 95), rect, 2, border_radius=8)
            txt = self.font_btn.render(label, True, (255, 255, 255) if is_hover else (210, 220, 235))
            self.screen.blit(txt, (rect.centerx - txt.get_width() // 2, rect.centery - txt.get_height() // 2))

        # Instructions Footer
        foot = self.font_info.render(
            "Controls: Press 1 or 2 to select scenario | Click buttons | ESC to Quit", True, (120, 135, 160)
        )
        self.screen.blit(foot, (self.WIDTH // 2 - foot.get_width() // 2, 500))

        self._draw_banner()

    def _handle_menu_event(self, event: pygame.event.Event) -> None:
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_1:
                self._enter_robotics()
            elif event.key == pygame.K_2:
                self._enter_driving()
            elif event.key == pygame.K_ESCAPE:
                self.running = False
        elif event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
            if hasattr(self, "btn_robotics_rect") and self.btn_robotics_rect.collidepoint(event.pos):
                self._enter_robotics()
            elif hasattr(self, "btn_driving_rect") and self.btn_driving_rect.collidepoint(event.pos):
                self._enter_driving()
            elif hasattr(self, "btn_quit_rect") and self.btn_quit_rect.collidepoint(event.pos):
                self.running = False

    # =========================================================================
    # ROBOTICS SCENARIO
    # =========================================================================
    def _load_robot_model(self, scenario: int) -> None:
        """Load scenario-specific model checkpoint if available, falling back to default."""
        scen2_path = "models/robot_model_scenario2.pt"
        default_path = "models/robot_model.pt"
        model_path = scen2_path if (scenario == 2 and os.path.exists(scen2_path)) else default_path

        if not os.path.exists(model_path):
            self.robot_model = None
            self.with_world_model = False
            self.set_banner("Model not trained. Run scripts/train_robot.py", duration_frames=180)
            logger.warning(f"{model_path} missing; falling back to greedy baseline.")
        else:
            try:
                self.robot_model = load_model(
                    model_path,
                    state_size=self.robot_env.get_state_size(),
                    action_size=self.robot_env.get_action_size()
                )
                logger.info(f"Loaded world model from {model_path}")
            except Exception as e:
                logger.error(f"Exception loading model: {e}")
                self.robot_model = None
                self.with_world_model = False
                self.set_banner(f"Error loading model: {e}. Using baseline.", duration_frames=180)

    def _enter_robotics(self) -> None:
        logger.info("Entering Robotics Scenario...")
        try:
            self.robot_env = RobotEnv(scenario=self.robot_scenario)
            self.robot_curr_state = self.robot_env.reset()
        except Exception as e:
            logger.error(f"Failed to initialize RobotEnv: {e}")
            self.set_banner(f"Error initializing RobotEnv: {e}")
            self.state = self.STATE_MENU
            return

        self._load_robot_model(self.robot_scenario)
        self.robot_plan_info = None
        self.auto_reset_timer = 0
        self.last_outcome_msg = ""
        self.state = self.STATE_ROBOTICS

    def _step_robotics(self) -> None:
        if self.robot_env is None:
            return

        # Update environment mode string
        self.robot_env.mode_str = "WITH WORLD MODEL" if self.with_world_model else "WITHOUT (Greedy)"

        # Auto-reset logic when episode finished
        if self.auto_reset_timer > 0:
            self.auto_reset_timer -= 1
            if self.auto_reset_timer == 0:
                self.robot_curr_state = self.robot_env.reset()
                self.robot_plan_info = None
                self.last_outcome_msg = ""
            return

        # Choose action
        action = RobotEnv.ACTION_STAY
        self.robot_plan_info = None

        if self.with_world_model and self.robot_model is not None:
            try:
                action, self.robot_plan_info = plan(
                    model=self.robot_model,
                    state=self.robot_curr_state,
                    action_size=self.robot_env.get_action_size(),
                    horizon=14,
                    n_samples=300,
                    gamma=0.95,
                    return_trajectories=True
                )
            except Exception as e:
                logger.error(f"Planning exception: {e}; falling back to greedy.")
                self.set_banner("Planning error. Falling back to greedy baseline.", duration_frames=60)
                action = get_greedy_action(
                    self.robot_env.robot_x, self.robot_env.robot_y,
                    self.robot_env.goal_x, self.robot_env.goal_y
                )
        else:
            action = get_greedy_action(
                self.robot_env.robot_x, self.robot_env.robot_y,
                self.robot_env.goal_x, self.robot_env.goal_y
            )

        # Advance simulation
        try:
            next_state, reward, done, info = self.robot_env.step(action)
            self.robot_curr_state = next_state

            if done:
                if info["reached_goal"]:
                    self.last_outcome_msg = "SUCCESS! GOAL REACHED"
                    self.last_outcome_color = (60, 240, 120)
                else:
                    self.last_outcome_msg = "TIMEOUT (MAX STEPS)"
                    self.last_outcome_color = (255, 170, 60)
                # Auto-reset in ~1.5 seconds (45 frames at 30 FPS)
                self.auto_reset_timer = 45

        except Exception as e:
            logger.error(f"Step exception: {e}")
            self.set_banner(f"Simulation step error: {e}")

    def _draw_robotics(self) -> None:
        if self.robot_env is None:
            return

        # 1. Base environment render
        self.robot_env.render(self.screen)

        # 2. Ghost paths (if with world model)
        if self.with_world_model and self.robot_plan_info is not None:
            draw_ghost_paths(self.screen, self.robot_plan_info)

        # 3. Outcome banner if waiting for auto-reset
        if self.last_outcome_msg:
            out_surf = self.font_title.render(self.last_outcome_msg, True, self.last_outcome_color)
            sub_surf = self.font_info.render(f"Auto-resetting in {self.auto_reset_timer / self.FPS:.1f}s... (Press R to skip)", True, (240, 240, 240))
            box_w = max(out_surf.get_width(), sub_surf.get_width()) + 40
            box_h = 70
            box_rect = pygame.Rect(self.WIDTH // 2 - box_w // 2, self.HEIGHT // 2 - box_h // 2, box_w, box_h)
            pygame.draw.rect(self.screen, (15, 20, 28, 230), box_rect, border_radius=10)
            pygame.draw.rect(self.screen, self.last_outcome_color, box_rect, 2, border_radius=10)
            self.screen.blit(out_surf, (box_rect.centerx - out_surf.get_width() // 2, box_rect.y + 8))
            self.screen.blit(sub_surf, (box_rect.centerx - sub_surf.get_width() // 2, box_rect.y + 44))

        # 4. Interactive Bottom Controls Pill
        pill_rect = pygame.Rect(self.WIDTH // 2 - 360, self.HEIGHT - 38, 720, 28)
        pygame.draw.rect(self.screen, (15, 18, 25, 210), pill_rect, border_radius=14)
        pygame.draw.rect(self.screen, (50, 65, 85), pill_rect, 1, border_radius=14)
        ctrl_txt = self.font_info.render(
            "[TAB / T] Toggle World Model   |   [R] Reset   |   [1 / 2] Scenario   |   [ESC] Menu",
            True, (190, 205, 225)
        )
        self.screen.blit(ctrl_txt, (pill_rect.centerx - ctrl_txt.get_width() // 2, pill_rect.centery - ctrl_txt.get_height() // 2))

        self._draw_banner()

    def _handle_robotics_event(self, event: pygame.event.Event) -> None:
        if event.type == pygame.KEYDOWN:
            if event.key in (pygame.K_TAB, pygame.K_t):
                if self.robot_model is None:
                    self.set_banner("Cannot enable World Model: models/robot_model.pt not trained!", duration_frames=120)
                else:
                    self.with_world_model = not self.with_world_model
                    logger.info(f"Switched mode to: {'WITH WORLD MODEL' if self.with_world_model else 'WITHOUT'}")
            elif event.key == pygame.K_r:
                if self.robot_env is not None:
                    self.robot_curr_state = self.robot_env.reset()
                    self.robot_plan_info = None
                    self.auto_reset_timer = 0
                    self.last_outcome_msg = ""
                    logger.info("Episode reset by user.")
            elif event.key == pygame.K_1:
                self.robot_scenario = 1
                if self.robot_env is not None:
                    self.robot_env.scenario = 1
                    self.robot_curr_state = self.robot_env.reset()
                self._load_robot_model(1)
                self.robot_plan_info = None
                logger.info("Selected Scenario 1 (Static Chair).")
            elif event.key == pygame.K_2:
                self.robot_scenario = 2
                if self.robot_env is not None:
                    self.robot_env.scenario = 2
                    self.robot_curr_state = self.robot_env.reset()
                self._load_robot_model(2)
                self.robot_plan_info = None
                logger.info("Selected Scenario 2 (Moving Person).")
            elif event.key == pygame.K_ESCAPE:
                self.state = self.STATE_MENU
                logger.info("Returned to Menu.")

    # =========================================================================
    # DRIVING SCENARIO (Lazy loading & error handling)
    # =========================================================================
    def _enter_driving(self) -> None:
        """Lazily load driving environment. If unavailable, notify and return to menu."""
        logger.info("Attempting to load Driving scenario via importlib...")
        try:
            driving_module = importlib.import_module("envs.driving_env")
            if hasattr(driving_module, "DrivingEnv"):
                driving_cls = getattr(driving_module, "DrivingEnv")
                test_env = driving_cls()
                logger.info("Driving scenario successfully loaded.")
                # We can either run it or display ready status
                self.set_banner("Driving scenario placeholder active! Gurudutt will plug in full scenario.", color=(120, 220, 150), duration_frames=180)
            else:
                self.set_banner("Driving scenario not available yet (DrivingEnv class missing).", duration_frames=150)
        except Exception as e:
            logger.warning(f"Driving scenario not available: {e}")
            self.set_banner("Driving scenario not available yet. (Gurudutt's branch)", duration_frames=150)

        # Remain on menu
        self.state = self.STATE_MENU

    # =========================================================================
    # ALERT BANNER RENDERING
    # =========================================================================
    def _draw_banner(self) -> None:
        if self.banner_timer > 0 and self.banner_message:
            self.banner_timer -= 1
            b_surf = self.font_banner.render(self.banner_message, True, (255, 255, 255))
            b_w = b_surf.get_width() + 32
            b_h = 36
            b_rect = pygame.Rect(self.WIDTH // 2 - b_w // 2, 16, b_w, b_h)
            pygame.draw.rect(self.screen, self.banner_color, b_rect, border_radius=6)
            pygame.draw.rect(self.screen, (255, 255, 255), b_rect, 2, border_radius=6)
            self.screen.blit(b_surf, (b_rect.centerx - b_surf.get_width() // 2, b_rect.centery - b_surf.get_height() // 2))

    # =========================================================================
    # MAIN APPLICATION LOOP
    # =========================================================================
    def run(self, max_frames: Optional[int] = None) -> None:
        """Run application loop capped at 30 FPS. Optional max_frames for headless test."""
        frame = 0
        logger.info("Starting main loop.")

        while self.running:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    self.running = False
                elif self.state == self.STATE_MENU:
                    self._handle_menu_event(event)
                elif self.state == self.STATE_ROBOTICS:
                    self._handle_robotics_event(event)

            # Update and Render
            if self.state == self.STATE_MENU:
                self._draw_menu()
            elif self.state == self.STATE_ROBOTICS:
                self._step_robotics()
                self._draw_robotics()

            pygame.display.flip()
            self.clock.tick(self.FPS)

            frame += 1
            if max_frames is not None and frame >= max_frames:
                logger.info(f"Reached max_frames limit ({max_frames}). Exiting loop.")
                break

        pygame.quit()
        logger.info("Application cleanly closed.")


def main():
    app = Application()
    app.run()


if __name__ == "__main__":
    main()

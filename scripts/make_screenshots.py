"""
Presentation Screenshots Generator for NBA Accreditation.
Produces 8 high-resolution showcase captures in 'results/screenshots/':
1. hero_menu.png: Start Menu & scenario selection
2. hero_split_screen.png: Split-Screen live side-by-side comparison
3. hero_mind_view_s1.png: Scenario 1 Holographic Mind View with candidate ribbons
4. hero_mind_view_s2.png: Scenario 2 Dynamic Pedestrian predictive evasion
5. hero_hitbox_debug.png: F3 mathematical hitbox alignment overlay
6. hero_collision_bonk.png: Physical collision sparks and BONK badge
7. hero_goal_celebration.png: Confetti fountain and 3-Star Rating Card
8. hero_imagination_hud.png: Model-Based MPC 10-step trajectory history & latency metrics
"""

import os
import sys
import numpy as np

os.environ["SDL_VIDEODRIVER"] = "dummy"
os.environ["SDL_AUDIODRIVER"] = "dummy"
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pygame
from envs.robot_env import RobotEnv
from model.world_model import load_model
from planner.mpc import plan
from scripts.collect_data_robot import get_greedy_action
from main import Application
from visuals.theme import QualityLevel
from visuals.ui import StarRatingCard


def make_screenshots(output_dir: str = "results/screenshots") -> None:
    print("================================================================")
    print("     GENERATING 8 HERO PRESENTATION SCREENSHOTS FOR NBA         ")
    print("================================================================")

    pygame.init()
    os.makedirs(output_dir, exist_ok=True)

    # 1. HERO MENU
    print("[1/8] Capturing hero_menu.png...")
    app_menu = Application(menu_mode=True, force_split=False)
    app_menu._draw_menu()
    pygame.image.save(app_menu.screen, os.path.join(output_dir, "hero_menu.png"))

    # 2. HERO SPLIT SCREEN
    print("[2/8] Capturing hero_split_screen.png...")
    app_split = Application(menu_mode=False, force_split=True, initial_seed=1001)
    for _ in range(35):
        app_split._step_robotics()
    app_split._draw_robotics()
    pygame.image.save(app_split.screen, os.path.join(output_dir, "hero_split_screen.png"))

    # 3. HERO MIND VIEW SCENARIO 1
    print("[3/8] Capturing hero_mind_view_s1.png...")
    env_s1 = RobotEnv(scenario=1)
    s = env_s1.reset(seed=1001)
    m1 = load_model("models/robot_model.pt", state_size=16, action_size=5)
    for _ in range(12):
        a, p_info = plan(m1, s, 5, horizon=14, n_samples=300, return_trajectories=True)
        s, _, _, _ = env_s1.step(a)
    surf1 = pygame.Surface((900, 600))
    env_s1.current_plan_info = p_info
    env_s1.render(surf1)  # Initialize renderer
    if hasattr(env_s1, "_modern_renderer") and env_s1._modern_renderer:
        env_s1._modern_renderer.show_mind_view = True
        env_s1.render(surf1)
    pygame.image.save(surf1, os.path.join(output_dir, "hero_mind_view_s1.png"))

    # 4. HERO MIND VIEW SCENARIO 2 (Moving Person)
    print("[4/8] Capturing hero_mind_view_s2.png...")
    s2_path = "models/robot_model_s2.pt" if os.path.exists("models/robot_model_s2.pt") else "models/robot_model.pt"
    m2 = load_model(s2_path, state_size=16, action_size=5)
    env_s2 = RobotEnv(scenario=2)
    s2 = env_s2.reset(seed=1005)
    for _ in range(16):
        a2, p_info2 = plan(m2, s2, 5, horizon=14, n_samples=300, return_trajectories=True)
        s2, _, _, _ = env_s2.step(a2)
    surf2 = pygame.Surface((900, 600))
    env_s2.current_plan_info = p_info2
    env_s2.render(surf2)  # Initialize renderer
    if hasattr(env_s2, "_modern_renderer") and env_s2._modern_renderer:
        env_s2._modern_renderer.show_mind_view = True
        env_s2.render(surf2)
    pygame.image.save(surf2, os.path.join(output_dir, "hero_mind_view_s2.png"))

    # 5. HERO HITBOX DEBUG (F3)
    print("[5/8] Capturing hero_hitbox_debug.png...")
    surf_hit = pygame.Surface((900, 600))
    if hasattr(env_s1, "_modern_renderer") and env_s1._modern_renderer:
        env_s1._modern_renderer.show_mind_view = False
        env_s1._modern_renderer.show_hitboxes = True
    env_s1.render(surf_hit)
    pygame.image.save(surf_hit, os.path.join(output_dir, "hero_hitbox_debug.png"))

    # 6. HERO COLLISION BONK
    print("[6/8] Capturing hero_collision_bonk.png...")
    surf_bonk = pygame.Surface((900, 600))
    if hasattr(env_s1, "_modern_renderer") and env_s1._modern_renderer:
        env_s1._modern_renderer.show_hitboxes = False
        env_s1._modern_renderer.trigger_collision_effects((env_s1.robot_x, env_s1.robot_y))
    env_s1.render(surf_bonk)
    pygame.image.save(surf_bonk, os.path.join(output_dir, "hero_collision_bonk.png"))

    # 7. HERO GOAL CELEBRATION & STAR RATING CARD
    print("[7/8] Capturing hero_goal_celebration.png...")
    surf_goal = pygame.Surface((900, 600))
    if hasattr(env_s1, "_modern_renderer") and env_s1._modern_renderer:
        env_s1._modern_renderer.trigger_goal_effects((env_s1.goal_x, env_s1.goal_y))
    env_s1.render(surf_goal)
    # Draw Star Rating Card
    card_rect = pygame.Rect(900 // 2 - 170, 600 // 2 - 70, 340, 140)
    StarRatingCard(card_rect).draw(surf_goal, reached_goal=True, collisions=0, steps=38, method_name="World Model MPC")
    pygame.image.save(surf_goal, os.path.join(output_dir, "hero_goal_celebration.png"))

    # 8. HERO IMAGINATION HUD OVERLAY
    print("[8/8] Capturing hero_imagination_hud.png...")
    app_hud = Application(menu_mode=False, force_split=False, initial_seed=1001)
    for _ in range(25):
        app_hud._step_robotics()
    app_hud.show_imagination = True
    app_hud._draw_robotics()
    pygame.image.save(app_hud.screen, os.path.join(output_dir, "hero_imagination_hud.png"))

    print(f"\nAll 8 hero presentation screenshots saved cleanly to '{output_dir}/'")


def make_3d_screenshots(output_dir: str = "results/screenshots3d") -> None:
    print("================================================================")
    print("     GENERATING 5 HERO 3D PRESENTATION SCREENSHOTS FOR NBA      ")
    print("================================================================")
    os.makedirs(output_dir, exist_ok=True)
    try:
        from viz3d.renderer3d import Renderer3D
        m1 = load_model("models/robot_model.pt", state_size=16, action_size=5)

        # 1. 3D Dollhouse
        print("[3D 1/5] Capturing hero_3d_dollhouse.png...")
        env = RobotEnv(scenario=1)
        s = env.reset(seed=1001)
        r3d = Renderer3D(900, 600)
        if r3d.scene and hasattr(r3d.scene, "camera"):
            r3d.scene.camera.set_mode("overview")
        surf = pygame.Surface((900, 600))
        p_info = None
        for _ in range(15):
            a, p_info = plan(m1, s, 5, horizon=14, n_samples=300, return_trajectories=True)
            s, _, _, _ = env.step(a)
        r3d.render(env, surf, plan_info=p_info)
        pygame.image.save(surf, os.path.join(output_dir, "hero_3d_dollhouse.png"))

        # 2. 3D Mind View
        print("[3D 2/5] Capturing hero_3d_mind_view.png...")
        r3d.show_mind_view = True
        surf_mv = pygame.Surface((900, 600))
        r3d.render(env, surf_mv, plan_info=p_info)
        pygame.image.save(surf_mv, os.path.join(output_dir, "hero_3d_mind_view.png"))
        r3d.show_mind_view = False

        # 3. 3D Topdown
        print("[3D 3/5] Capturing hero_3d_topdown.png...")
        if r3d.scene and hasattr(r3d.scene, "camera"):
            r3d.scene.camera.set_mode("topdown")
        surf_td = pygame.Surface((900, 600))
        r3d.render(env, surf_td, plan_info=p_info)
        pygame.image.save(surf_td, os.path.join(output_dir, "hero_3d_topdown.png"))

        # 4. 3D POV
        print("[3D 4/5] Capturing hero_3d_pov.png...")
        if r3d.scene and hasattr(r3d.scene, "camera"):
            r3d.scene.camera.set_mode("robot_pov")
        surf_pov = pygame.Surface((900, 600))
        r3d.render(env, surf_pov, plan_info=p_info)
        pygame.image.save(surf_pov, os.path.join(output_dir, "hero_3d_pov.png"))

        # 5. 3D Split Screen
        print("[3D 5/5] Capturing hero_3d_split.png...")
        surf_split = pygame.Surface((1800, 600))
        env_greedy = RobotEnv(scenario=1)
        env_greedy.reset(seed=1001)
        for _ in range(15):
            ag = get_greedy_action(env_greedy.robot_x, env_greedy.robot_y, env_greedy.goal_x, env_greedy.goal_y)
            env_greedy.step(ag)
        surf_left = pygame.Surface((900, 600))
        if r3d.scene and hasattr(r3d.scene, "camera"):
            r3d.scene.camera.set_mode("overview")
        r3d.render(env_greedy, surf_left, method_title="WITHOUT WORLD MODEL")
        surf_split.blit(surf_left, (0, 0))
        surf_right = pygame.Surface((900, 600))
        r3d.render(env, surf_right, plan_info=p_info, method_title="WITH WORLD MODEL")
        surf_split.blit(surf_right, (900, 0))
        pygame.draw.line(surf_split, (0, 200, 255), (900, 0), (900, 600), 2)
        pygame.image.save(surf_split, os.path.join(output_dir, "hero_3d_split.png"))

        print(f"\nAll 5 3D hero presentation screenshots saved cleanly to '{output_dir}/'")
    except Exception as e:
        print(f"Warning: 3D screenshot capture encountered: {e}")


if __name__ == "__main__":
    make_screenshots()
    make_3d_screenshots()


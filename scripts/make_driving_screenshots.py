"""
Generate Showcase Screenshots for Autonomous Driving Simulator.
Saves high-res captures into results/driving_screenshots/
"""

import os
import sys
import numpy as np

os.environ["SDL_VIDEODRIVER"] = "dummy"
os.environ["SDL_AUDIODRIVER"] = "dummy"
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pygame
from envs.driving_env import DrivingEnv
from model.world_model import load_model
from planner.mpc import plan


def make_driving_screenshots(output_dir: str = "results/driving_screenshots"):
    print("================================================================")
    print("     GENERATING DRIVING SHOWCASE SCREENSHOTS                   ")
    print("================================================================")

    pygame.init()
    os.makedirs(output_dir, exist_ok=True)

    model_path = "models/driving_model.pt"
    model = load_model(model_path) if os.path.exists(model_path) else None

    # 1. Driving S1: Highway Lane Keeping
    print("[1/4] Capturing driving_s1_highway.png...")
    env_s1 = DrivingEnv(variant=1)
    s1 = env_s1.reset(seed=1001)
    surf_s1 = pygame.Surface((900, 600))
    for _ in range(40):
        act = 0 if s1[2] < 0.6 else 4
        s1, _, _, _ = env_s1.step(act)
    env_s1.render(surf_s1)
    pygame.image.save(surf_s1, os.path.join(output_dir, "driving_s1_highway.png"))

    # 2. Driving S2: Lead Vehicle Sudden Braking
    print("[1/4] Capturing driving_s2_braking.png...")
    env_s2 = DrivingEnv(variant=2)
    s2 = env_s2.reset(seed=1002)
    surf_s2 = pygame.Surface((900, 600))
    for _ in range(60):
        if model is not None:
            act = plan(model, s2, action_size=5, horizon=14, n_samples=300, gamma=0.95)
        else:
            act = 4
        s2, _, _, _ = env_s2.step(act)
    env_s2.render(surf_s2)
    pygame.image.save(surf_s2, os.path.join(output_dir, "driving_s2_braking.png"))

    # 3. Driving S3: Dense Traffic Overtaking
    print("[3/4] Capturing driving_s3_overtaking.png...")
    env_s3 = DrivingEnv(variant=3)
    s3 = env_s3.reset(seed=1003)
    surf_s3 = pygame.Surface((900, 600))
    for _ in range(50):
        if model is not None:
            act = plan(model, s3, action_size=5, horizon=14, n_samples=300, gamma=0.95)
        else:
            act = 4
        s3, _, _, _ = env_s3.step(act)
    env_s3.render(surf_s3)
    pygame.image.save(surf_s3, os.path.join(output_dir, "driving_s3_overtaking.png"))

    # 4. Driving Mind View (Imagined Trajectories Overlay)
    print("[4/4] Capturing driving_mind_view.png...")
    env_mv = DrivingEnv(variant=2)
    s_mv = env_mv.reset(seed=1004)
    surf_mv = pygame.Surface((900, 600))
    for _ in range(35):
        s_mv, _, _, _ = env_mv.step(0)
    
    # Run MPC with trajectories
    if model is not None:
        best_act, info = plan(
            model, s_mv, action_size=5, horizon=14, n_samples=300, gamma=0.95, return_trajectories=True
        )
        env_mv.render(surf_mv)
        alt_trajs = info.get("candidate_trajectories", [])
        best_traj = info.get("best_trajectory", [])

        for alt in alt_trajs:
            pts = []
            for pt in alt:
                px = int(30 + (pt[0] * 350.0 / 200.0) * 840)
                py = int(300 - pt[1] * 350.0 * 2.5)
                pts.append((px, py))
            if len(pts) > 1:
                pygame.draw.lines(surf_mv, (0, 180, 255), False, pts, 1)

        best_pts = []
        for pt in best_traj:
            px = int(30 + (pt[0] * 350.0 / 200.0) * 840)
            py = int(300 - pt[1] * 350.0 * 2.5)
            best_pts.append((px, py))
        if len(best_pts) > 1:
            pygame.draw.lines(surf_mv, (0, 255, 157), False, best_pts, 3)
    else:
        env_mv.render(surf_mv)

    pygame.image.save(surf_mv, os.path.join(output_dir, "driving_mind_view.png"))
    print(f"Screenshots successfully saved in {output_dir}")


if __name__ == "__main__":
    make_driving_screenshots()

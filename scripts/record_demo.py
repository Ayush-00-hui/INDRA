"""
Demo Recording Script for NBA Accreditation Presentation.

Executes 2 episodes of Scenario 1 (Static Chair) and 2 episodes of Scenario 2 (Moving Person)
in headless mode, recording each frame to 'results/demo_frames/'.
If ffmpeg is installed, automatically compiles to 'results/demo.mp4' (30 FPS).
Also compiles a lightweight GIF preview 'results/demo_preview.gif' via Pillow.
"""

import os
import sys
import shutil
import subprocess
from typing import Optional, List
import numpy as np
from PIL import Image

# Headless environment
os.environ["SDL_VIDEODRIVER"] = "dummy"
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pygame
from envs.robot_env import RobotEnv, draw_ghost_paths
from model.world_model import load_model
from planner.mpc import plan


def record_demo(
    output_dir: str = "results/demo_frames",
    video_output: str = "results/demo.mp4",
    gif_output: str = "results/demo_preview.gif",
    fps: int = 30
) -> None:
    print("================================================================")
    print("        RECORDING DEMO FRAMES (NBA ACCREDITATION SHOWCASE)       ")
    print("================================================================")

    pygame.init()
    width, height = 900, 600
    surface = pygame.Surface((width, height))

    font_banner = pygame.font.SysFont("Arial", 16, bold=True)
    font_hud = pygame.font.SysFont("Arial", 14)

    # Clean / prepare output directory
    os.makedirs(output_dir, exist_ok=True)
    for f in os.listdir(output_dir):
        if f.endswith(".png"):
            try:
                os.remove(os.path.join(output_dir, f))
            except OSError:
                pass

    frame_count = 0
    saved_images: List[Image.Image] = []

    # Scenarios to record: (scenario_id, model_path, episodes, seed_base)
    runs = [
        (1, "models/robot_model.pt", 2, 1001, "SCENARIO 1: STATIC OBSTACLES (CHAIR AVOIDANCE)"),
        (2, "models/robot_model_s2.pt", 2, 1005, "SCENARIO 2: DYNAMIC OBSTACLES (MOVING PERSON)")
    ]

    for scenario_id, model_path, num_episodes, seed_base, scen_title in runs:
        print(f"\nRecording {scen_title}...")
        env = RobotEnv(scenario=scenario_id)
        
        # Load model with fallback
        if os.path.exists(model_path):
            model = load_model(model_path, state_size=env.get_state_size(), action_size=env.get_action_size())
        else:
            model = load_model("models/robot_model.pt", state_size=env.get_state_size(), action_size=env.get_action_size())

        for ep in range(num_episodes):
            seed = seed_base + ep
            state = env.reset(seed=seed)
            done = False
            step = 0
            print(f"  Episode {ep+1}/{num_episodes} (Seed: {seed})...")

            while not done and step < env.MAX_STEPS:
                # Plan action with MPC and generate ghost rollouts
                action, plan_info = plan(
                    model=model,
                    state=state,
                    action_size=env.get_action_size(),
                    horizon=14,
                    n_samples=300,
                    gamma=0.95,
                    return_trajectories=True
                )

                # Render env
                env.render(surface)
                # Render imagined rollouts
                draw_ghost_paths(surface, plan_info)

                # Overlay top banner for accreditation showcase
                banner_surf = pygame.Surface((width, 36), pygame.SRCALPHA)
                banner_surf.fill((15, 20, 30, 210))
                surface.blit(banner_surf, (0, 0))

                t_surf = font_banner.render(f"NBA DEMO | {scen_title}", True, (255, 255, 255))
                surface.blit(t_surf, (15, 8))

                sub_surf = font_hud.render(f"Ep {ep+1}/{num_episodes} | Step: {step:3d} | Collisions: {env.collision_count}", True, (0, 230, 180))
                surface.blit(sub_surf, (width - sub_surf.get_width() - 15, 10))

                # Save frame
                frame_path = os.path.join(output_dir, f"frame_{frame_count:05d}.png")
                pygame.image.save(surface, frame_path)

                # Collect thumbnail frame for GIF (downsampled every 3 frames)
                if frame_count % 3 == 0 and len(saved_images) < 250:
                    pil_img = Image.open(frame_path).convert("P", palette=Image.ADAPTIVE)
                    pil_img = pil_img.resize((450, 300), Image.Resampling.BILINEAR)
                    saved_images.append(pil_img)

                frame_count += 1
                step += 1

                # Execute step
                state, reward, done, info = env.step(action)

            # Hold final frame for 10 frames to clearly show outcome
            outcome_text = "GOAL REACHED! (SUCCESS)" if env.collision_count == 0 else f"COMPLETED (Collisions: {env.collision_count})"
            outcome_col = (60, 240, 120) if info.get("reached_goal") else (255, 180, 50)
            
            box = pygame.Rect(width // 2 - 200, height // 2 - 35, 400, 70)
            pygame.draw.rect(surface, (15, 20, 28), box, border_radius=10)
            pygame.draw.rect(surface, outcome_col, box, 2, border_radius=10)
            ot_surf = font_banner.render(outcome_text, True, outcome_col)
            surface.blit(ot_surf, (box.centerx - ot_surf.get_width() // 2, box.centery - 10))

            for _ in range(12):
                frame_path = os.path.join(output_dir, f"frame_{frame_count:05d}.png")
                pygame.image.save(surface, frame_path)
                frame_count += 1

    print(f"\nSuccessfully recorded {frame_count} frames to {output_dir}")

    # 1. Compile GIF preview via Pillow
    if saved_images:
        print(f"Compiling preview GIF ({len(saved_images)} frames) to {gif_output}...")
        os.makedirs(os.path.dirname(os.path.abspath(gif_output)), exist_ok=True)
        saved_images[0].save(
            gif_output,
            save_all=True,
            append_images=saved_images[1:],
            optimize=True,
            duration=int(1000 / (fps / 3)),
            loop=0
        )
        print(f"Saved demo GIF preview to {gif_output}")

    # 2. Check for ffmpeg and compile MP4
    ffmpeg_bin = shutil.which("ffmpeg")
    if ffmpeg_bin:
        print(f"\nCompiling MP4 video via ffmpeg...")
        os.makedirs(os.path.dirname(os.path.abspath(video_output)), exist_ok=True)
        cmd = [
            ffmpeg_bin, "-y",
            "-framerate", str(fps),
            "-i", os.path.join(output_dir, "frame_%05d.png"),
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-crf", "22",
            video_output
        ]
        try:
            res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            if res.returncode == 0:
                print(f"Saved MP4 video demo to {video_output}")
            else:
                print(f"ffmpeg conversion failed: {res.stderr.decode('utf-8', errors='ignore')}")
        except Exception as e:
            print(f"Could not run ffmpeg: {e}")
    else:
        print(f"\nNote: 'ffmpeg' not found in PATH. Frame PNGs and '{gif_output}' are ready.")

    pygame.quit()


if __name__ == "__main__":
    record_demo()


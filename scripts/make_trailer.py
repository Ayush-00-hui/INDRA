"""
Automated Showcase Trailer Generator for NBA Accreditation Visit.
Produces a 30-second, high-impact demonstration trailer:
1. Title Sequence (3s): Retro-modern logo and project title
2. Baseline Failure (8s): Direct greedy approach getting stuck at obstacle
3. World Model Triumph (10s): MPC imagining candidate paths and detouring cleanly
4. Scenario 2 Dynamic Evasion (9s): Anticipating moving human trajectory
Saves to results/trailer.gif and results/trailer.mp4 (if ffmpeg is present).
"""

import os
import sys
import shutil
import subprocess
import numpy as np
from PIL import Image

os.environ["SDL_VIDEODRIVER"] = "dummy"
os.environ["SDL_AUDIODRIVER"] = "dummy"
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pygame
from envs.robot_env import RobotEnv
from model.world_model import load_model
from planner.mpc import plan
from scripts.collect_data_robot import get_greedy_action
from visuals.theme import Colors, get_font
from visuals.ui import draw_glass_panel, draw_badge


def make_trailer(
    output_dir: str = "results/trailer_frames",
    video_output: str = "results/trailer.mp4",
    gif_output: str = "results/trailer.gif",
    fps: int = 30
) -> None:
    print("================================================================")
    print("        GENERATING 30-SECOND NBA SHOWCASE TRAILER               ")
    print("================================================================")

    pygame.init()
    width, height = 900, 600
    screen = pygame.Surface((width, height))
    os.makedirs(output_dir, exist_ok=True)
    os.makedirs("results", exist_ok=True)

    # Clean existing trailer frames
    for f in os.listdir(output_dir):
        if f.endswith(".png"):
            try:
                os.remove(os.path.join(output_dir, f))
            except OSError:
                pass

    frame_idx = 0
    gif_frames = []

    def save_frame(surf: pygame.Surface, caption: str = "", caption_color=(0, 220, 255)):
        nonlocal frame_idx
        if caption:
            # Cinematic lower-third caption
            c_surf = get_font(16, bold=True).render(caption, True, (255, 255, 255))
            c_box = pygame.Rect(width // 2 - c_surf.get_width() // 2 - 16, height - 52, c_surf.get_width() + 32, 36)
            draw_glass_panel(surf, c_box, bg_color=(12, 16, 24), alpha=235, border_color=caption_color)
            surf.blit(c_surf, (c_box.centerx - c_surf.get_width() // 2, c_box.centery - c_surf.get_height() // 2))

        f_path = os.path.join(output_dir, f"frame_{frame_idx:05d}.png")
        pygame.image.save(surf, f_path)

        # Collect 1 of every 2 frames for smooth lightweight 15 FPS GIF
        if frame_idx % 2 == 0 and len(gif_frames) < 300:
            im = Image.open(f_path).convert("P", palette=Image.ADAPTIVE)
            im = im.resize((480, 320), Image.Resampling.BILINEAR)
            gif_frames.append(im)

        frame_idx += 1

    # -------------------------------------------------------------
    # 1. TITLE SEQUENCE (45 frames / 1.5s)
    # -------------------------------------------------------------
    print("[1/4] Rendering Cinematic Title Card...")
    for f in range(45):
        screen.fill((16, 20, 28))
        # Ambient grid
        for x in range(0, width, 40):
            pygame.draw.line(screen, (25, 32, 44), (x, 0), (x, height), 1)
        for y in range(0, height, 40):
            pygame.draw.line(screen, (25, 32, 44), (0, y), (width, y), 1)

        t1 = get_font(28, bold=True).render("WORLD MODEL: LEARN, IMAGINE, ACT", True, (255, 255, 255))
        t2 = get_font(16).render("Autonomous Robotics Obstacle Evasion (NBA Demonstration)", True, Colors.CYAN)
        t3 = get_font(13).render("Evaluating Reactive Greedy Failure vs. Predictive Latent MPC", True, (160, 180, 210))

        screen.blit(t1, (width // 2 - t1.get_width() // 2, 220))
        screen.blit(t2, (width // 2 - t2.get_width() // 2, 265))
        screen.blit(t3, (width // 2 - t3.get_width() // 2, 305))

        save_frame(screen, caption="National Board of Accreditation Showcase 2026")

    # -------------------------------------------------------------
    # 2. BASELINE GREEDY FAILURE (100 frames / ~3.3s)
    # -------------------------------------------------------------
    print("[2/4] Rendering Baseline Reactive Failure (Collision Trap)...")
    env_base = RobotEnv(scenario=1)
    env_base.reset(seed=1001)

    for step in range(65):
        act = get_greedy_action(env_base.robot_x, env_base.robot_y, env_base.goal_x, env_base.goal_y)
        env_base.step(act)
        env_base.render(screen)
        save_frame(screen, caption="WITHOUT WORLD MODEL: Reactive greedy agent traps on office chair", caption_color=Colors.DANGER)

    # -------------------------------------------------------------
    # 3. WORLD MODEL MPC TRIUMPH (140 frames / ~4.6s)
    # -------------------------------------------------------------
    print("[3/4] Rendering World Model Latent MPC Detour...")
    model_s1 = load_model("models/robot_model.pt", state_size=16, action_size=5)
    env_wm = RobotEnv(scenario=1)
    state = env_wm.reset(seed=1001)

    done = False
    step = 0
    while not done and step < 85:
        step += 1
        act, plan_info = plan(model=model_s1, state=state, action_size=5, horizon=14, n_samples=300, return_trajectories=True)
        env_wm.current_plan_info = plan_info
        env_wm.render(screen)
        state, _, done, _ = env_wm.step(act)
        save_frame(screen, caption="WITH WORLD MODEL: Imagining candidate rollouts & executing clean detour", caption_color=Colors.SUCCESS)

    # -------------------------------------------------------------
    # 4. SCENARIO 2: MOVING PERSON EVASION (140 frames / ~4.6s)
    # -------------------------------------------------------------
    print("[4/4] Rendering Scenario 2 Dynamic Pedestrian Evasion...")
    s2_path = "models/robot_model_s2.pt" if os.path.exists("models/robot_model_s2.pt") else "models/robot_model.pt"
    model_s2 = load_model(s2_path, state_size=16, action_size=5)
    env_s2 = RobotEnv(scenario=2)
    state2 = env_s2.reset(seed=1005)

    done2 = False
    step2 = 0
    while not done2 and step2 < 85:
        step2 += 1
        act2, plan_info2 = plan(model=model_s2, state=state2, action_size=5, horizon=14, n_samples=300, return_trajectories=True)
        env_s2.current_plan_info = plan_info2
        env_s2.render(screen)
        state2, _, done2, _ = env_s2.step(act2)
        save_frame(screen, caption="SCENARIO 2: Anticipating moving pedestrian cross-traffic in real-time", caption_color=Colors.CYAN)

    print(f"\nSaved {frame_idx} trailer frames.")

    # Compile GIF
    if gif_frames:
        print(f"Compiling GIF preview to {gif_output}...")
        gif_frames[0].save(
            gif_output,
            save_all=True,
            append_images=gif_frames[1:],
            optimize=True,
            duration=66,  # 15 FPS
            loop=0
        )
        print(f"GIF saved successfully ({os.path.getsize(gif_output) / 1024:.1f} KB).")

    # Compile MP4 via ffmpeg if available
    ffmpeg_bin = shutil.which("ffmpeg")
    if ffmpeg_bin:
        print(f"Compiling MP4 video via ffmpeg to {video_output}...")
        cmd = [
            ffmpeg_bin, "-y",
            "-framerate", str(fps),
            "-i", os.path.join(output_dir, "frame_%05d.png"),
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            video_output
        ]
        try:
            subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            print(f"Video compiled: {video_output} ({os.path.getsize(video_output) / 1024:.1f} KB)")
        except Exception as e:
            print(f"ffmpeg encoding skipped: {e}")
    else:
        print("Note: ffmpeg not found in PATH; GIF trailer compiled cleanly.")

    print("\nTrailer generation complete!")


if __name__ == "__main__":
    make_trailer()

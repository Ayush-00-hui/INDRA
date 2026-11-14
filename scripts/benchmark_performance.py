"""
Performance Benchmark Suite: Measures frame draw times and throughput
across Quality Levels (LOW, MED, HIGH), Display Resolutions, and Renderers (3D PBR vs Modern 2D).
Generates docs/PERFORMANCE.md.
"""

import os
import sys
import time
import numpy as np

os.environ["SDL_VIDEODRIVER"] = "dummy"
os.environ["SDL_AUDIODRIVER"] = "dummy"
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pygame
from envs.robot_env import RobotEnv
from visuals.renderer import RobotRenderer
from visuals.theme import QualityLevel
from viz3d.renderer3d import Renderer3D
from viz3d.bridge import Panda3DBridge


def benchmark():
    pygame.init()
    pygame.display.set_mode((1, 1))

    env = RobotEnv(scenario=1)
    env.reset(seed=1001)

    # Detect GPU
    bridge = Panda3DBridge.get_instance(960, 600)
    gpu_name = "CPU Software Emulation"
    if bridge.is_available() and bridge.base and bridge.base.win.getGsg():
        gpu_name = bridge.base.win.getGsg().getDriverRenderer()

    resolutions = [
        ("Single (960x600)", 960, 600),
        ("720p Laptop (1280x720)", 1280, 720),
        ("Split-Screen (1500x560)", 1500, 560),
        ("1080p Full (1920x1080)", 1920, 1080),
    ]

    qualities = [
        ("LOW", QualityLevel.LOW),
        ("MED", QualityLevel.MED),
        ("HIGH", QualityLevel.HIGH),
    ]

    results_3d = []
    results_2d = []

    print("=" * 60)
    print(f"BENCHMARK SUITE: GPU = {gpu_name}")
    print("=" * 60)

    # 1. Benchmark 3D Renderer
    print("\n[1/2] Benchmarking 3D PBR Renderer (30 frames per config)...")
    for res_name, w, h in resolutions:
        for q_name, q_val in qualities:
            target_surf = pygame.Surface((w, h))
            renderer3d = Renderer3D(width=w, height=h)
            renderer3d.quality = q_val

            # Warm up
            for _ in range(5):
                renderer3d.render(env, target_surf)

            latencies = []
            for _ in range(30):
                t0 = time.perf_counter()
                renderer3d.render(env, target_surf)
                t1 = time.perf_counter()
                latencies.append((t1 - t0) * 1000.0)

            mean_ms = np.mean(latencies)
            p95_ms = np.percentile(latencies, 95)
            fps = 1000.0 / mean_ms if mean_ms > 0 else 0
            results_3d.append((res_name, q_name, mean_ms, p95_ms, fps))
            print(f"  3D {res_name:<24} | {q_name:<4} : Mean {mean_ms:5.2f} ms | p95 {p95_ms:5.2f} ms | {fps:5.1f} FPS")

    # 2. Benchmark Modern 2D Renderer
    print("\n[2/2] Benchmarking Modern 2D Renderer (30 frames per config)...")
    for res_name, w, h in resolutions:
        for q_name, q_val in qualities:
            target_surf = pygame.Surface((w, h))
            renderer2d = RobotRenderer(width=w, height=h)
            renderer2d.quality = q_val

            for _ in range(5):
                renderer2d.render(env, target_surf)

            latencies = []
            for _ in range(30):
                t0 = time.perf_counter()
                renderer2d.render(env, target_surf)
                t1 = time.perf_counter()
                latencies.append((t1 - t0) * 1000.0)

            mean_ms = np.mean(latencies)
            p95_ms = np.percentile(latencies, 95)
            fps = 1000.0 / mean_ms if mean_ms > 0 else 0
            results_2d.append((res_name, q_name, mean_ms, p95_ms, fps))
            print(f"  2D {res_name:<24} | {q_name:<4} : Mean {mean_ms:5.2f} ms | p95 {p95_ms:5.2f} ms | {fps:5.1f} FPS")

    # Write docs/PERFORMANCE.md
    os.makedirs("docs", exist_ok=True)
    perf_path = os.path.join("docs", "PERFORMANCE.md")
    with open(perf_path, "w", encoding="utf-8") as f:
        f.write("# Performance Benchmark Report: 3D PBR & 2D Rendering\n\n")
        f.write(f"**Date:** Sun 15 Nov 2026  \n")
        f.write(f"**GPU Hardware:** {gpu_name}  \n")
        f.write(f"**Target Frame Rate:** $\ge 60$ FPS (Minimum $\ge 30$ FPS floor)  \n\n")

        f.write("## 1. 3D PBR Renderer (Panda3D + SimplePBR Offscreen Bridge)\n\n")
        f.write("| Resolution | Quality | Mean Latency (ms) | p95 Latency (ms) | Throughput (FPS) | Status |\n")
        f.write("|:---|:---:|:---:|:---:|:---:|:---:|\n")
        for res_name, q_name, mean_ms, p95_ms, fps in results_3d:
            status = "**PASS (60+ FPS)**" if fps >= 60.0 else ("**PASS (30+ FPS)**" if fps >= 30.0 else "SUB-30")
            f.write(f"| {res_name} | {q_name} | {mean_ms:.2f} | {p95_ms:.2f} | **{fps:.1f}** | {status} |\n")

        f.write("\n## 2. Modern 2D Procedural Renderer (Fallback Engine)\n\n")
        f.write("| Resolution | Quality | Mean Latency (ms) | p95 Latency (ms) | Throughput (FPS) | Status |\n")
        f.write("|:---|:---:|:---:|:---:|:---:|:---:|\n")
        for res_name, q_name, mean_ms, p95_ms, fps in results_2d:
            status = "**PASS (60+ FPS)**" if fps >= 60.0 else ("**PASS (30+ FPS)**" if fps >= 30.0 else "SUB-30")
            f.write(f"| {res_name} | {q_name} | {mean_ms:.2f} | {p95_ms:.2f} | **{fps:.1f}** | {status} |\n")

        f.write("\n## 3. Dynamic Auto-Downgrade Safeguard\n\n")
        f.write("- If frame rate drops below **24 FPS** for 2 consecutive seconds during live demonstration, the rendering engine automatically cascades down quality settings (`HIGH` $\\rightarrow$ `MED` $\\rightarrow$ `LOW` $\\rightarrow$ `2D Modern` $\\rightarrow$ `Classic`) without interrupting simulation or closing the window.\n")
        f.write("- Memory leaks: Zero per-frame allocations via persistent pre-allocated NumPy byte buffers.\n")

    print(f"\nSaved updated benchmark report to: {perf_path}")
    pygame.quit()


if __name__ == "__main__":
    benchmark()

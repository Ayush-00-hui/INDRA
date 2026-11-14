"""
Phase 0 Spike: Offscreen Panda3D + simplepbr + Pygame Buffer Readback Benchmark.
Validates the feasibility of 3D offscreen rendering at >= 60 FPS (<= 16 ms total budget).
"""

import os
import sys
import time
import numpy as np
import pygame

# Set up offscreen Panda3D configuration before importing ShowBase
from panda3d.core import (
    loadPrcFileData,
    NodePath,
    DirectionalLight,
    AmbientLight,
    Vec4,
    Vec3,
    GraphicsOutput,
    Texture,
    CardMaker,
    CardMaker,
)

loadPrcFileData("", "window-type offscreen")
loadPrcFileData("", "win-size 960 600")
loadPrcFileData("", "audio-library-name null")
loadPrcFileData("", "gl-version 3 2")
loadPrcFileData("", "notify-level-glgsg warning")
loadPrcFileData("", "notify-level warning")

from direct.showbase.ShowBase import ShowBase
import simplepbr


def run_spike(n_frames=300):
    print("=" * 60)
    print("Phase 0: Panda3D Offscreen Rendering Benchmark Spike")
    print("=" * 60)

    base = ShowBase()
    pipe = base.pipe
    gsg = base.win.getGsg()
    gpu_vendor = gsg.getDriverVendor() if gsg else "Unknown"
    gpu_renderer = gsg.getDriverRenderer() if gsg else "Unknown"
    driver_version = gsg.getDriverVersion() if gsg else "Unknown"

    print(f"GPU Vendor   : {gpu_vendor}")
    print(f"GPU Renderer : {gpu_renderer}")
    print(f"Driver Ver   : {driver_version}")

    # Set up simplepbr
    pbr_pipeline = simplepbr.init(
        render_node=base.render,
        window=base.win,
        camera_node=base.cam,
        enable_shadows=True,
        msaa_samples=4,
    )

    width, height = 960, 600

    # Attach RAM readback texture
    tex = Texture("offscreen_tex")
    base.win.addRenderTexture(tex, GraphicsOutput.RTM_copy_ram, GraphicsOutput.RTP_color)

    # Build a simple procedural test scene
    # Ground plane
    cm = CardMaker("ground")
    cm.setFrame(-5, 5, -5, 5)
    ground = base.render.attachNewNode(cm.generate())
    ground.setP(-90)
    ground.setColor(0.3, 0.35, 0.4, 1.0)

    # Some test cubes
    boxes = []
    for i in range(5):
        box_cm = CardMaker(f"box_{i}")
        box_cm.setFrame(-0.5, 0.5, -0.5, 0.5)
        b = base.render.attachNewNode(box_cm.generate())
        b.setPos(i * 1.5 - 3.0, 3.0, 0.5)
        b.setColor(0.2 + i * 0.15, 0.6, 0.8, 1.0)
        boxes.append(b)

    # Lights
    dlight = DirectionalLight("dlight")
    dlight.setColor(Vec4(0.9, 0.9, 0.85, 1))
    dlnp = base.render.attachNewNode(dlight)
    dlnp.setHpr(-45, -60, 0)
    base.render.setLight(dlnp)

    alight = AmbientLight("alight")
    alight.setColor(Vec4(0.25, 0.25, 0.3, 1))
    alnp = base.render.attachNewNode(alight)
    base.render.setLight(alnp)

    base.cam.setPos(0, -10, 6)
    base.cam.lookAt(0, 0, 0)

    # Initialize Pygame for blitting target test
    pygame.init()
    pg_surf = pygame.Surface((width, height), pygame.SRCALPHA)

    results = {}

    qualities = [
        ("LOW", False, 0),
        ("MED", True, 2),
        ("HIGH", True, 4),
    ]

    for q_name, shadows, msaa in qualities:
        pbr_pipeline.enable_shadows = shadows
        pbr_pipeline.msaa_samples = msaa

        # Warm up 10 frames
        for _ in range(10):
            base.taskMgr.step()

        render_times = []
        readback_times = []
        total_times = []

        for f in range(n_frames):
            # Animate objects
            for idx, b in enumerate(boxes):
                b.setH(b.getH() + 1.0 + idx)

            t0 = time.perf_counter()
            base.taskMgr.step()
            t1 = time.perf_counter()

            # Read RAM texture
            ram_img = tex.getRamImage()
            if ram_img:
                arr = np.frombuffer(ram_img, dtype=np.uint8).reshape((height, width, 4))
                flipped = np.ascontiguousarray(arr[::-1])
                pg_surf_frame = pygame.image.frombuffer(flipped, (width, height), "RGBA")
                pg_surf.blit(pg_surf_frame, (0, 0))
            t2 = time.perf_counter()

            r_ms = (t1 - t0) * 1000.0
            rb_ms = (t2 - t1) * 1000.0
            tot_ms = (t2 - t0) * 1000.0

            render_times.append(r_ms)
            readback_times.append(rb_ms)
            total_times.append(tot_ms)

        mean_r, p95_r = np.mean(render_times), np.percentile(render_times, 95)
        mean_rb, p95_rb = np.mean(readback_times), np.percentile(readback_times, 95)
        mean_tot, p95_tot = np.mean(total_times), np.percentile(total_times, 95)
        fps = 1000.0 / mean_tot if mean_tot > 0 else 0

        results[q_name] = {
            "render_mean": mean_r,
            "render_p95": p95_r,
            "readback_mean": mean_rb,
            "readback_p95": p95_rb,
            "total_mean": mean_tot,
            "total_p95": p95_tot,
            "fps": fps,
        }

        print(f"\n--- Quality: {q_name} (Shadows={shadows}, MSAA={msaa}) ---")
        print(f"Render time   : Mean {mean_r:5.2f} ms | p95 {p95_r:5.2f} ms")
        print(f"Readback time : Mean {mean_rb:5.2f} ms | p95 {p95_rb:5.2f} ms")
        print(f"Total frame   : Mean {mean_tot:5.2f} ms | p95 {p95_tot:5.2f} ms => {fps:5.1f} FPS")

    # Decision rule: GO if total <= 16 ms at MED
    med_total = results["MED"]["total_mean"]
    decision = "GO" if med_total <= 16.0 else "NO-GO"
    print("\n" + "=" * 60)
    print(f"DECISION: {decision} (MED Total: {med_total:.2f} ms <= 16.0 ms threshold)")
    print("=" * 60)

    base.destroy()
    pygame.quit()
    return gpu_renderer, results, decision


if __name__ == "__main__":
    run_spike()

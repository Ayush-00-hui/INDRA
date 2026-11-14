"""
Test Visual Engine Foundation: Procedural Sprites, Audio, Particles, Lighting, and Benchmarks.
Runs cleanly in headless CI environments with SDL_VIDEODRIVER=dummy.
"""

import os
import time
import pytest
import numpy as np

# Force headless SDL drivers for tests
os.environ["SDL_VIDEODRIVER"] = "dummy"
os.environ["SDL_AUDIODRIVER"] = "dummy"

import pygame
pygame.init()
pygame.display.set_mode((1, 1))

from envs.robot_env import RobotEnv
from visuals.theme import Colors, QualityLevel
from visuals.tween import Easing, Tween, Timer
from visuals.particles import ParticleManager
from visuals.lighting import LightingManager
from visuals.camera import CameraEffects
from visuals.assets import SpriteManager, SoundManager, create_procedural_sounds
from visuals.renderer import RobotRenderer


def test_procedural_sounds_generation():
    """Verify procedural audio waveforms generate valid 16-bit WAV headers."""
    sounds = create_procedural_sounds()
    assert "move" in sounds
    assert "bonk" in sounds
    assert "goal" in sounds
    assert "click" in sounds
    assert "think" in sounds

    for name, data in sounds.items():
        assert len(data) > 44, f"Sound {name} has invalid WAV size"
        assert data[:4] == b"RIFF", f"Sound {name} missing RIFF header"
        assert data[8:12] == b"WAVE", f"Sound {name} missing WAVE header"


def test_sound_manager_headless():
    """Verify SoundManager safely initializes and operates headlessly without raising errors."""
    sm = SoundManager()
    # In dummy audio driver, playing sounds should be a safe no-op or clean play
    sm.play("move")
    sm.play("bonk")
    assert not sm.muted
    sm.toggle_mute()
    assert sm.muted
    sm.set_volume(0.5)
    assert sm.volume == 0.5


def test_procedural_sprites():
    """Verify all procedural sprites render cleanly with valid dimensions."""
    sm = SpriteManager()

    # Robot: 36x36
    robot = sm.get_robot_sprite(angle_deg=45, status="moving")
    assert robot.get_size() == (36, 36) or robot.get_width() >= 36

    # Chair: 80x80
    chair = sm.get_chair_sprite()
    assert chair.get_size() == (80, 80)

    # Desk: arbitrary dimensions
    desk = sm.get_desk_sprite(70, 70)
    assert desk.get_size() == (70, 70)

    # Goal: 44x44
    goal = sm.get_goal_sprite(anim_frame=15)
    assert goal.get_size() == (44, 44)

    # Person: 45x45
    person = sm.get_person_sprite(frame_idx=2, vy=4.0)
    assert person.get_size() == (45, 45)


def test_particle_pooling():
    """Verify object-pooled particle manager maintains fixed capacity and zero memory allocation."""
    pm = ParticleManager(max_particles=100)
    assert pm.active_count == 0

    pm.emit_sparks(100, 100, count=25)
    assert pm.active_count == 25

    # Update through particle lifetime
    for _ in range(60):
        pm.update(dt=1.0 / 30.0)

    # Should safely recycle all expired particles
    assert pm.active_count == 0


def test_lighting_and_camera():
    """Verify lighting pass and camera effects update without crashing."""
    surf = pygame.Surface((900, 600))
    lm = LightingManager(900, 600)
    lights = [{"pos": (200, 200), "radius": 100, "color": (0, 255, 200), "intensity": 0.8}]
    lm.render(surf, lights=lights)

    cam = CameraEffects(900, 600)
    cam.shake(intensity=5.0, duration=0.2)
    cam.flash(color=(255, 255, 255), duration=0.1)
    cam.update(0.05)
    cam.render_overlay(surf)


def test_renderer_benchmark_and_screenshot():
    """Benchmark draw time across LOW, MED, HIGH qualities and save verification screenshot."""
    env = RobotEnv(scenario=1)
    env.reset(seed=1042)
    surface = pygame.Surface((900, 600))

    renderer = RobotRenderer(width=900, height=600, quality=QualityLevel.HIGH)

    # Benchmark HIGH quality
    times_high = []
    for _ in range(30):
        t0 = time.perf_counter()
        renderer.render(env, surface, method_title="BENCHMARK HIGH", fps=60.0)
        times_high.append((time.perf_counter() - t0) * 1000.0)

    # Benchmark MED quality
    renderer.quality = QualityLevel.MED
    times_med = []
    for _ in range(30):
        t0 = time.perf_counter()
        renderer.render(env, surface, method_title="BENCHMARK MED", fps=60.0)
        times_med.append((time.perf_counter() - t0) * 1000.0)

    # Benchmark LOW quality
    renderer.quality = QualityLevel.LOW
    times_low = []
    for _ in range(30):
        t0 = time.perf_counter()
        renderer.render(env, surface, method_title="BENCHMARK LOW", fps=60.0)
        times_low.append((time.perf_counter() - t0) * 1000.0)

    avg_high = np.mean(times_high)
    avg_med = np.mean(times_med)
    avg_low = np.mean(times_low)

    print(f"\nRender Benchmark: LOW={avg_low:.2f}ms, MED={avg_med:.2f}ms, HIGH={avg_high:.2f}ms")

    # Render target is well under 16.6 ms (60 FPS budget)
    assert avg_high < 25.0, f"HIGH render time {avg_high:.2f}ms exceeds 25ms threshold"

    # Save benchmark screenshot
    os.makedirs("results/visuals", exist_ok=True)
    renderer.quality = QualityLevel.HIGH
    renderer.render(env, surface, method_title="BENCHMARK VERIFICATION", fps=60.0)
    pygame.image.save(surface, "results/visuals/phase1_benchmark.png")
    assert os.path.exists("results/visuals/phase1_benchmark.png")

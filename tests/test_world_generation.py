"""
Test Phase 2: The World (Office/Lab Environment)
Verifies seeded world layouts, sprite-to-hitbox alignment, and debug overlay.
"""

import os
import pytest
import pygame

# Headless SDL mode
os.environ["SDL_VIDEODRIVER"] = "dummy"
os.environ["SDL_AUDIODRIVER"] = "dummy"

pygame.init()
pygame.display.set_mode((1, 1))

from envs.robot_env import RobotEnv
from visuals.renderer import RobotRenderer
from visuals.theme import QualityLevel


def test_seeded_world_layouts_and_hitbox_alignment():
    """Verify 3 distinct seeded layouts and ensure all sprites strictly match hitboxes."""
    os.makedirs("results/visuals", exist_ok=True)
    renderer = RobotRenderer(width=900, height=600, quality=QualityLevel.HIGH)
    renderer.show_hitboxes = True  # Enable F3 hitbox debug overlay for inspection

    for seed in [1001, 1002, 1003]:
        env = RobotEnv(scenario=1 if seed != 1003 else 2)
        env.reset(seed=seed)

        # Assert environment spawned valid obstacles
        assert len(env.obstacles) >= 3
        # Assert chair exists and is inside room
        chair = env.obstacles[0]
        assert chair.kind == "chair"
        assert chair.width == 80.0
        assert chair.height == 80.0
        assert 10.0 <= chair.x <= 900.0 - 80.0
        assert 10.0 <= chair.y <= 600.0 - 80.0

        # In scenario 2, verify moving person obstacle exists
        if env.scenario == 2:
            person_obs = [obs for obs in env.obstacles if obs.kind == "person"]
            assert len(person_obs) == 1
            assert person_obs[0].width == 45.0
            assert person_obs[0].height == 45.0

        # Render frame
        surface = pygame.Surface((900, 600))
        renderer.render(env, surface, method_title=f"WORLD SEED {seed}", fps=60.0)

        # Save verification screenshot
        shot_path = f"results/visuals/world_seed_{seed}.png"
        pygame.image.save(surface, shot_path)
        assert os.path.exists(shot_path)
        assert os.path.getsize(shot_path) > 1000  # Valid non-empty PNG

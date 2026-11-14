import os
import sys
import numpy as np

# Ensure root directory is on PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Use headless dummy video driver for automated verification
os.environ["SDL_VIDEODRIVER"] = "dummy"
os.environ["SDL_AUDIODRIVER"] = "dummy"

import pygame
from envs.robot_env import RobotEnv, draw_ghost_paths


def test_robot_env():
    pygame.init()
    screen = pygame.display.set_mode((RobotEnv.WIDTH, RobotEnv.HEIGHT))
    
    env = RobotEnv(scenario=1)
    state = env.reset(seed=42)

    assert isinstance(state, np.ndarray), "State must be numpy array"
    assert state.shape == (16,), f"Expected shape (16,), got {state.shape}"
    assert state.dtype == np.float32, f"Expected float32, got {state.dtype}"
    assert env.get_state_size() == 16
    assert env.get_action_size() == 5

    total_reward = 0.0
    collision_count = 0
    
    # Run 200 random steps
    for step in range(200):
        action = np.random.randint(0, env.get_action_size())
        next_state, reward, done, info = env.step(action)
        
        assert next_state.shape == (16,), f"Step {step}: bad shape {next_state.shape}"
        assert next_state.dtype == np.float32, f"Step {step}: bad dtype {next_state.dtype}"
        assert isinstance(reward, float), f"Step {step}: reward not float"
        assert isinstance(done, bool), f"Step {step}: done not bool"
        assert "collision" in info and "reached_goal" in info and "timeout" in info

        total_reward += reward
        if info["collision"]:
            collision_count += 1
            
        if done:
            break

    print(f"Verified 200 steps successfully. Collisions: {collision_count}, Total reward: {total_reward:.2f}")

    # Now verify rendering and ghost paths
    env.reset(seed=123)
    env.render(screen)

    # Synthetic ghost trajectory for test visualization
    rx, ry = env.robot_x, env.robot_y
    norm_rx = env._normalize_x(rx)
    norm_ry = env._normalize_y(ry)
    
    sample_best_traj = np.array([
        [norm_rx, norm_ry],
        [norm_rx + 0.08, norm_ry - 0.05],
        [norm_rx + 0.16, norm_ry - 0.08],
        [norm_rx + 0.25, norm_ry - 0.04],
        [norm_rx + 0.35, norm_ry + 0.02],
    ], dtype=np.float32)

    sample_candidates = [
        np.array([[norm_rx, norm_ry], [norm_rx, norm_ry - 0.1], [norm_rx, norm_ry - 0.2]], dtype=np.float32),
        np.array([[norm_rx, norm_ry], [norm_rx + 0.1, norm_ry], [norm_rx + 0.2, norm_ry]], dtype=np.float32),
        np.array([[norm_rx, norm_ry], [norm_rx, norm_ry + 0.1], [norm_rx, norm_ry + 0.2]], dtype=np.float32),
    ]

    draw_ghost_paths(screen, {
        "best_trajectory": sample_best_traj,
        "candidate_trajectories": sample_candidates
    })

    os.makedirs("results", exist_ok=True)
    screenshot_path = os.path.join("results", "step_b_env.png")
    pygame.image.save(screen, screenshot_path)
    print(f"Saved environment verification screenshot to {screenshot_path}")

    # Verify screenshot file exists and has non-zero size
    assert os.path.exists(screenshot_path) and os.path.getsize(screenshot_path) > 1000
    print("Step b verification PASSED!")


if __name__ == "__main__":
    test_robot_env()

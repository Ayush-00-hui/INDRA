import os
import sys

# Ensure root directory is on PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Use headless dummy video driver for automated verification
os.environ["SDL_VIDEODRIVER"] = "dummy"
os.environ["SDL_AUDIODRIVER"] = "dummy"

import numpy as np
import pygame
from envs.robot_env import RobotEnv, draw_ghost_paths
from model.world_model import load_model
from planner.mpc import plan
from scripts.collect_data_robot import get_greedy_action


def verify_step_e():
    pygame.init()
    screen = pygame.display.set_mode((RobotEnv.WIDTH, RobotEnv.HEIGHT))
    
    model_path = "models/robot_model.pt"
    assert os.path.exists(model_path), f"{model_path} missing!"
    model = load_model(model_path, state_size=16, action_size=5)

    test_seed = 1
    env = RobotEnv(scenario=1)
    env.mode_str = "WITH WORLD MODEL"
    state = env.reset(seed=test_seed)

    print(f"Starting World Model MPC rollout (seed={test_seed})...")
    print(f"Robot start: ({env.robot_x:.1f}, {env.robot_y:.1f}) | Goal: ({env.goal_x:.1f}, {env.goal_y:.1f})")
    chair = env.obstacles[0]
    print(f"Chair obstacle: ({chair.x:.1f}, {chair.y:.1f}, w={chair.width}, h={chair.height})")

    steps_taken = 0
    collisions = 0
    reached_goal = False

    saved_midpoint = False

    for t in range(200):
        # 1. Plan optimal action with trajectory forecasting
        action, plan_info = plan(
            model=model,
            state=state,
            action_size=env.get_action_size(),
            horizon=14,
            n_samples=300,
            gamma=0.95,
            return_trajectories=True
        )

        # 2. Render scene and ghost paths
        env.render(screen)
        draw_ghost_paths(screen, plan_info)

        # Save initial and midpoint frames
        if t == 0:
            pygame.image.save(screen, "results/step_e_start.png")
            print("Saved initial planning frame to results/step_e_start.png")

        # Check if robot is near chair x to save midpoint frame navigating around chair
        if not saved_midpoint and abs(env.robot_x - (chair.x + chair.width / 2.0)) < 40.0:
            pygame.image.save(screen, "results/step_e_nav_chair.png")
            print(f"Saved chair navigation frame (step {t}) to results/step_e_nav_chair.png")
            saved_midpoint = True

        # 3. Step environment
        next_state, reward, done, info = env.step(action)
        steps_taken += 1
        if info["collision"]:
            collisions += 1

        if done:
            reached_goal = info["reached_goal"]
            # Render final state
            env.render(screen)
            draw_ghost_paths(screen, plan_info)
            pygame.image.save(screen, "results/step_e_goal.png")
            print(f"Episode finished at step {steps_taken}. Reached goal: {reached_goal}, Collisions: {collisions}")
            print("Saved final frame to results/step_e_goal.png")
            break

        state = next_state

    # Now verify that the greedy baseline gets stuck on this exact same layout
    env_greedy = RobotEnv(scenario=1)
    env_greedy.mode_str = "WITHOUT (Greedy)"
    state_g = env_greedy.reset(seed=test_seed)
    greedy_collisions = 0
    greedy_reached = False

    for _ in range(200):
        act_g = get_greedy_action(env_greedy.robot_x, env_greedy.robot_y, env_greedy.goal_x, env_greedy.goal_y)
        _, _, done_g, info_g = env_greedy.step(act_g)
        if info_g["collision"]:
            greedy_collisions += 1
        if done_g:
            greedy_reached = info_g["reached_goal"]
            break

    print("\nComparison on Seed 1:")
    print(f"Greedy Baseline: Reached Goal = {greedy_reached}, Collisions = {greedy_collisions}")
    print(f"World Model MPC: Reached Goal = {reached_goal}, Collisions = {collisions}, Steps = {steps_taken}")

    assert os.path.exists("results/step_e_start.png")
    assert os.path.exists("results/step_e_nav_chair.png")
    assert os.path.exists("results/step_e_goal.png")
    assert reached_goal == True, "World model should successfully reach the goal"
    assert collisions == 0, f"Expected 0 collisions, got {collisions}"
    assert greedy_collisions > 100, f"Expected greedy to collide heavily, got {greedy_collisions}"
    print("\nStep e verification PASSED!")


if __name__ == "__main__":
    verify_step_e()

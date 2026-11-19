"""
Verify Pygame Desktop Warning Banner Rendering when Area is Blocked.
"""
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pygame
from envs.robot_env import RobotEnv, Obstacle
from visuals.renderer import RobotRenderer

os.environ["SDL_VIDEODRIVER"] = "dummy"

def test_banner():
    pygame.init()
    screen = pygame.Surface((900, 600))
    env = RobotEnv(scenario=1)
    env.robot_x, env.robot_y = 100.0, 300.0
    env.goal_x, env.goal_y = 800.0, 300.0
    env.obstacles = []
    
    # 1. Open
    renderer = RobotRenderer(width=900, height=600)
    renderer.render(env=env, target_surface=screen, method_title="TEST")
    
    # 2. Block with wall
    for y in range(0, 600, 40):
        env.obstacles.append(Obstacle(450, y, 40, 40, kind="crate"))
        
    s, r, d, info = env.step(RobotEnv.ACTION_STAY)
    assert info["path_blocked"] is True
    
    # Render with Modern Visual Renderer
    renderer.render(env=env, target_surface=screen, last_info=info, method_title="TEST")
    
    # Render with Classic Renderer
    env._render_classic(screen)
    print("[PASS] Desktop Pygame banner rendered successfully in both modern and classic renderers!")
    pygame.quit()

if __name__ == "__main__":
    test_banner()

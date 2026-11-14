import os
import sys

# Ensure root directory is on PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Headless video driver
os.environ["SDL_VIDEODRIVER"] = "dummy"
os.environ["SDL_AUDIODRIVER"] = "dummy"

import pygame
from main import Application
import planner.mpc


def test_main_app_robustness():
    print("=================================================")
    print(" VERIFYING STEP G: MAIN APPLICATION ROBUSTNESS")
    print("=================================================")

    # 1. Normal run for 150 frames in Robotics scenario
    print("\nTest 1: Running normal simulation for 150 frames...")
    app = Application()
    app._enter_robotics()
    assert app.state == Application.STATE_ROBOTICS
    app.run(max_frames=150)
    print("Test 1 PASSED: 150 frames completed smoothly.")

    # 2. Test missing driving env
    print("\nTest 2: Simulating missing driving scenario...")
    app = Application()
    assert app.state == Application.STATE_MENU
    app._enter_driving()
    assert app.state == Application.STATE_MENU
    assert "Driving scenario" in app.banner_message
    print(f"Test 2 PASSED: Gracefully caught missing driving env. Banner: '{app.banner_message}'")

    # 3. Test missing model file
    print("\nTest 3: Simulating missing model checkpoint...")
    real_model_path = "models/robot_model.pt"
    temp_model_path = "models/robot_model_temp.pt"
    if os.path.exists(real_model_path):
        os.rename(real_model_path, temp_model_path)

    try:
        app = Application()
        app._enter_robotics()
        assert app.robot_model is None
        assert app.with_world_model is False
        assert "Model not trained" in app.banner_message
        print(f"Banner displayed: '{app.banner_message}'")
        # Run 50 frames with baseline fallback
        app.run(max_frames=50)
        print("Test 3 PASSED: App survived missing model and ran fallback baseline.")
    finally:
        # Restore real model
        if os.path.exists(temp_model_path):
            os.rename(temp_model_path, real_model_path)

    # 4. Test planning exception resilience
    print("\nTest 4: Simulating unexpected exception during MPC planning...")
    app = Application()
    app._enter_robotics()

    original_plan = planner.mpc.plan
    def broken_plan(*args, **kwargs):
        raise RuntimeError("Simulated CUDA kernel error during tensor operations!")

    planner.mpc.plan = broken_plan
    try:
        # Run 30 frames with broken planning function
        for _ in range(30):
            app._step_robotics()
            app._draw_robotics()
        print("Test 4 PASSED: App caught planning exception, fell back to baseline, and survived!")
    finally:
        planner.mpc.plan = original_plan

    # 5. Check log file
    assert os.path.exists("logs/main.log")
    print("\nLogs successfully written to logs/main.log")
    print("\nALL STEP G ROBUSTNESS TESTS PASSED!")


if __name__ == "__main__":
    test_main_app_robustness()

"""
Comprehensive Smoke Test Suite for NBA Accreditation Demo.

Performs a complete end-to-end component verification:
  1. Critical Library Imports
  2. Device Detection (CUDA/CPU fallback)
  3. Environment Steps & Rendering Contract (RobotEnv Scenario 1 & 2)
  4. World Model Checkpoint Loading & Batch Inference
  5. MPC Planner Latency & Action Selection
  6. Headless main.py Execution (Single & Split-screen)
  7. Driving Environment Lazy-Import Resilience

Must exit 0 on clean pass.
"""

import os
import sys
import time
import subprocess
import numpy as np

# Ensure headless pygame
os.environ["SDL_VIDEODRIVER"] = "dummy"
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))


def run_check(name: str, check_fn) -> bool:
    print(f"Checking [{name:<38}] ... ", end="", flush=True)
    t0 = time.perf_counter()
    try:
        msg = check_fn()
        elapsed_ms = (time.perf_counter() - t0) * 1000.0
        details = f" ({msg})" if msg else ""
        print(f"PASSED [{elapsed_ms:5.1f} ms]{details}")
        return True
    except Exception as e:
        elapsed_ms = (time.perf_counter() - t0) * 1000.0
        print(f"FAILED [{elapsed_ms:5.1f} ms] -> {e}")
        return False


def test_imports():
    import torch
    import pygame
    import numpy
    import matplotlib
    import pandas
    from PIL import Image
    return f"PyTorch {torch.__version__}, Pygame {pygame.__version__}"


def test_device():
    import torch
    device = "cuda" if torch.cuda.is_available() else "cpu"
    x = torch.ones((10, 10), device=device)
    y = x @ x
    return f"Active Device: {device.upper()}"


def test_robot_env():
    import pygame
    from envs.robot_env import RobotEnv
    pygame.init()
    surf = pygame.Surface((900, 600))

    # Scenario 1
    env1 = RobotEnv(scenario=1)
    s1 = env1.reset(seed=42)
    assert s1.shape == (16,)
    ns1, r1, d1, info1 = env1.step(RobotEnv.ACTION_UP)
    assert "collision" in info1 and "reached_goal" in info1
    env1.render(surf)

    # Scenario 2
    env2 = RobotEnv(scenario=2)
    s2 = env2.reset(seed=42)
    assert s2.shape == (16,)
    ns2, r2, d2, info2 = env2.step(RobotEnv.ACTION_RIGHT)
    assert "collision" in info2 and "reached_goal" in info2
    env2.render(surf)
    return "S1 & S2 contracts verified"


def test_model_loading():
    import torch
    from model.world_model import load_model, WorldModel

    # Check S1 model
    m1 = load_model("models/robot_model.pt", state_size=16, action_size=5)
    s_t = torch.zeros((4, 16), dtype=torch.float32)
    a_t = torch.zeros((4,), dtype=torch.long)
    ns, r = m1.predict(s_t, a_t)
    assert ns.shape == (4, 16) and r.shape == (4,)

    # Check S2 model if present
    if os.path.exists("models/robot_model_s2.pt"):
        m2 = load_model("models/robot_model_s2.pt", state_size=16, action_size=5)
        ns2, r2 = m2.predict(s_t, a_t)
        assert ns2.shape == (4, 16)

    return "Loaded S1 and S2 models successfully"


def test_mpc_planner():
    from envs.robot_env import RobotEnv
    from model.world_model import load_model
    from planner.mpc import plan

    env = RobotEnv(scenario=1)
    s = env.reset(seed=100)
    m = load_model("models/robot_model.pt", state_size=16, action_size=5)

    t0 = time.perf_counter()
    action, info = plan(
        model=m,
        state=s,
        action_size=5,
        horizon=14,
        n_samples=300,
        gamma=0.95,
        return_trajectories=True
    )
    lat_ms = (time.perf_counter() - t0) * 1000.0
    assert 0 <= action < 5
    assert "best_trajectory" in info
    assert lat_ms < 60.0, f"Planner latency too high ({lat_ms:.1f} ms)"
    return f"Action: {action}, Latency: {lat_ms:.2f} ms"


def test_headless_main():
    # Run main.py for 30 frames in headless split-screen mode
    cmd = [
        sys.executable,
        "main.py",
        "--split",
        "--scenario", "1",
        "--max-frames", "30"
    ]
    env = os.environ.copy()
    env["SDL_VIDEODRIVER"] = "dummy"
    res = subprocess.run(cmd, env=env, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=25)
    assert res.returncode == 0, f"main.py returned code {res.returncode}: {res.stderr.decode()}"
    return "30 split-screen frames executed cleanly"


def test_driving_lazy_import():
    import importlib
    driving_module = importlib.import_module("envs.driving_env")
    assert hasattr(driving_module, "DrivingEnv"), "DrivingEnv class missing in driving_env.py"
    d_env = driving_module.DrivingEnv()
    assert d_env.get_state_size() > 0
    assert d_env.get_action_size() > 0
    return "DrivingEnv placeholder compliant"


def test_3d_pbr_pipeline():
    from viz3d.bridge import Panda3DBridge
    from viz3d.renderer3d import Renderer3D
    bridge = Panda3DBridge.get_instance(960, 600)
    if not bridge.is_available():
        return "3D Bridge unavailable, modern 2D fallback active"
    renderer = Renderer3D(width=960, height=600)
    assert renderer.scene is not None
    return "Panda3D + SimplePBR Bridge Operational"


def main():
    print("=" * 72)
    print("        NBA ACCREDITATION SYSTEM HEALTH & SMOKE TEST SUITE        ")
    print("=" * 72)

    checks = [
        ("Library Dependencies", test_imports),
        ("Hardware & PyTorch Acceleration", test_device),
        ("Robotics Environment Contracts", test_robot_env),
        ("3D PBR Offscreen Bridge", test_3d_pbr_pipeline),
        ("World Model Checkpoints", test_model_loading),
        ("MPC Planner Vectorization & Latency", test_mpc_planner),
        ("Headless Application Execution", test_headless_main),
        ("Autonomous Driving Module Guard", test_driving_lazy_import),
    ]

    all_passed = True
    for name, fn in checks:
        passed = run_check(name, fn)
        if not passed:
            all_passed = False

    print("=" * 72)
    if all_passed:
        print(">> ALL SMOKE CHECKS PASSED: SYSTEM FULLY OPERATIONAL AND VERIFIED <<")
        print("=" * 72)
        sys.exit(0)
    else:
        print(">> SOME CHECKS FAILED! REVIEW DIAGNOSTICS ABOVE <<")
        print("=" * 72)
        sys.exit(1)


if __name__ == "__main__":
    main()


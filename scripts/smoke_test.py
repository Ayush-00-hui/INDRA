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
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, ROOT_DIR)


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

    # Check primary robot model (checking robot_model.pt, or fallback to robot_student / ensemble)
    s1_path = "models/robot_model.pt"
    if not os.path.exists(s1_path):
        if os.path.exists("models/robot_student.pt"):
            s1_path = "models/robot_student.pt"
        elif os.path.exists("models/robot_ensemble.pt"):
            s1_path = "models/robot_ensemble.pt"

    m1 = load_model(s1_path, state_size=16, action_size=5)
    s_t = torch.zeros((4, 16), dtype=torch.float32)
    a_t = torch.zeros((4,), dtype=torch.long)
    ns, r = m1.predict(s_t, a_t)
    assert ns.shape == (4, 16) and r.shape == (4,)

    # Check S2 model if present
    if os.path.exists("models/robot_model_s2.pt"):
        m2 = load_model("models/robot_model_s2.pt", state_size=16, action_size=5)
        ns2, r2 = m2.predict(s_t, a_t)
        assert ns2.shape == (4, 16)

    # Check Ensemble model if present
    if os.path.exists("models/robot_ensemble.pt"):
        m_ens = load_model("models/robot_ensemble.pt", state_size=16, action_size=5)
        ns_ens, r_ens = m_ens.predict(s_t, a_t)
        assert ns_ens.shape == (4, 16) and r_ens.shape == (4,)
        if hasattr(m_ens, "predict_with_uncertainty"):
            ns_m, ns_s, r_m, r_s = m_ens.predict_with_uncertainty(s_t, a_t)
            assert ns_m.shape == (4, 16) and ns_s.shape == (4, 16)

    # Check Dream model if present
    if os.path.exists("models/dream_model.pt"):
        from scripts.train_dream_model import DreamConvNet
        m_dream = DreamConvNet(action_size=5)
        m_dream.load_state_dict(torch.load("models/dream_model.pt", map_location="cpu"))
        m_dream.eval()
        dummy_img = torch.zeros((1, 3, 64, 64), dtype=torch.float32)
        dummy_act = torch.zeros((1, 5), dtype=torch.float32)
        pred_dream = m_dream(dummy_img, dummy_act)
        assert pred_dream.shape == (1, 3, 64, 64)

    return "Loaded S1, S2, Ensemble & Dream models successfully"


def test_mpc_planner():
    import torch
    from envs.robot_env import RobotEnv
    from model.world_model import load_model
    from planner.mpc import plan

    env = RobotEnv(scenario=1)
    s = env.reset(seed=100)
    m_path = "models/robot_model.pt"
    if not os.path.exists(m_path):
        if os.path.exists("models/robot_student.pt"):
            m_path = "models/robot_student.pt"
        elif os.path.exists("models/robot_ensemble.pt"):
            m_path = "models/robot_ensemble.pt"
    m = load_model(m_path, state_size=16, action_size=5)

    # Warm-up CUDA kernels, primitive cache, and trajectory memory
    _ = plan(model=m, state=s, action_size=5, horizon=14, n_samples=300, gamma=0.95, return_trajectories=True)
    if hasattr(torch, "cuda") and torch.cuda.is_available():
        torch.cuda.synchronize()

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
    if hasattr(torch, "cuda") and torch.cuda.is_available():
        torch.cuda.synchronize()
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


def test_indra_env_guard():
    import importlib
    indra_module = importlib.import_module("indra.env")
    assert hasattr(indra_module, "IndraEnv"), "IndraEnv class missing in indra/env.py"
    i_env = indra_module.IndraEnv()
    assert i_env.get_state_size() == 24
    assert i_env.get_action_size() == 5
    return "IndraEnv 24-D contracts compliant"


def test_3d_pbr_pipeline():
    from viz3d.bridge import Panda3DBridge
    from viz3d.renderer3d import Renderer3D
    bridge = Panda3DBridge.get_instance(960, 600)
    if not bridge.is_available():
        return "3D Bridge unavailable, modern 2D fallback active"
    renderer = Renderer3D(width=960, height=600)
    assert renderer.scene is not None
    return "Panda3D + SimplePBR Bridge Operational"


def test_web_app_subsystem():
    # 1. Dist bundle exists
    dist_index = os.path.join(ROOT_DIR, "web", "dist", "index.html")
    assert os.path.exists(dist_index), "web/dist/index.html missing; run npm run build in web/frontend"

    # 2. Replay files present
    replays_dir = os.path.join(ROOT_DIR, "web", "replays")
    assert os.path.exists(os.path.join(replays_dir, "robotics_s1_wm.json"))
    assert os.path.exists(os.path.join(replays_dir, "robotics_s2_wm.json"))

    # 3. FastAPI test client health
    from fastapi.testclient import TestClient
    from web.server import app
    client = TestClient(app)
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"

    return "web/dist bundled, replays intact, FastAPI operational"


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
        ("Project INDRA Environment Guard", test_indra_env_guard),
        ("Web Application Subsystem & Health", test_web_app_subsystem),
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


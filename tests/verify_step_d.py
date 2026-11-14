import os
import sys
import time
import numpy as np
import torch

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from model.world_model import load_model
from planner.mpc import plan


def verify_step_d():
    model_path = "models/test_model.pt"
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model {model_path} not found. Run verify_step_c first.")

    model = load_model(model_path, state_size=16, action_size=5)
    dummy_state = np.random.randn(16).astype(np.float32)

    # 1. Test basic plan() call
    action = plan(model, dummy_state, action_size=5, horizon=10, n_samples=200, return_trajectories=False)
    assert isinstance(action, int), f"Expected int, got {type(action)}"
    assert 0 <= action < 5, f"Action {action} out of range [0, 4]"
    print(f"Basic plan() check PASSED: selected action {action}")

    # 2. Test return_trajectories=True
    action, info = plan(model, dummy_state, action_size=5, horizon=10, n_samples=200, return_trajectories=True)
    assert isinstance(action, int)
    assert isinstance(info, dict)
    assert "best_trajectory" in info
    assert "candidate_trajectories" in info
    assert "best_return" in info

    best_traj = info["best_trajectory"]
    assert best_traj.shape == (11, 2), f"Expected best_trajectory shape (11, 2), got {best_traj.shape}"
    assert len(info["candidate_trajectories"]) == 5, f"Expected 5 candidate trajectories, got {len(info['candidate_trajectories'])}"

    for cand in info["candidate_trajectories"]:
        assert cand.shape == (11, 2), f"Candidate shape error: {cand.shape}"

    print(f"return_trajectories=True check PASSED: best return = {info['best_return']:.3f}")

    # 3. Timing benchmark (50 planning calls)
    # Warmup
    for _ in range(5):
        _ = plan(model, dummy_state, action_size=5, horizon=10, n_samples=200, return_trajectories=True)

    latencies = []
    for _ in range(50):
        t0 = time.perf_counter()
        _ = plan(model, dummy_state, action_size=5, horizon=10, n_samples=200, return_trajectories=True)
        t1 = time.perf_counter()
        latencies.append((t1 - t0) * 1000.0)  # ms

    mean_lat = np.mean(latencies)
    p50_lat = np.median(latencies)
    p95_lat = np.percentile(latencies, 95)
    max_lat = np.max(latencies)

    print("\nMPC Planning Performance (batched 200 samples, horizon 10):")
    print(f"Mean Latency:   {mean_lat:.2f} ms")
    print(f"Median (P50):   {p50_lat:.2f} ms")
    print(f"95th %-tile:    {p95_lat:.2f} ms")
    print(f"Max Latency:    {max_lat:.2f} ms")

    assert mean_lat < 30.0, f"Mean latency {mean_lat:.2f} ms exceeds 30 ms threshold!"
    print(f"\nStep d verification PASSED! (Latency {mean_lat:.2f} ms < 30 ms)")


if __name__ == "__main__":
    verify_step_d()

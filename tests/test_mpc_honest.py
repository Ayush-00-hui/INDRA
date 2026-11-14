import os
import sys
import time
import numpy as np
import torch

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from model.world_model import WorldModel
from planner.mpc import plan, _generate_candidate_sequences, _PRIMITIVE_CACHE


def test_mpc_honest():
    print("=========================================================")
    print(" VERIFYING HONEST RANDOM-SHOOTING MPC & PRIMITIVE CACHING")
    print("=========================================================")

    model = WorldModel(state_size=16, action_size=5, hidden=64)
    model.eval()
    device = model.state_mean.device
    dummy_state = np.random.randn(16).astype(np.float32)

    # 1. Test Candidate Generation & Randomness Presence
    n_samples = 300
    horizon = 14
    action_size = 5

    candidates = _generate_candidate_sequences(action_size, horizon, n_samples, device, use_primitives=True)
    assert candidates.shape == (n_samples, horizon), f"Bad shape: {candidates.shape}"
    assert candidates.dtype == torch.long

    # Verify uniqueness/diversity (random sequences must be present)
    unique_seqs = torch.unique(candidates, dim=0)
    print(f"Total candidate sequences: {n_samples} | Unique sequences: {len(unique_seqs)}")
    assert len(unique_seqs) > 100, "Too few unique sequences; random sampling missing!"

    # 2. Test Primitive Caching
    _PRIMITIVE_CACHE.clear()
    key = (action_size, horizon, str(device))
    assert key not in _PRIMITIVE_CACHE

    _ = _generate_candidate_sequences(action_size, horizon, n_samples, device, use_primitives=True)
    assert key in _PRIMITIVE_CACHE, "Primitives were not cached!"
    cached_ref = _PRIMITIVE_CACHE[key]
    print(f"Cached primitive bank size: {cached_ref.shape[0]} sequences (cached once).")

    # Second call should use exact same cached reference
    _ = _generate_candidate_sequences(action_size, horizon, n_samples, device, use_primitives=True)
    assert _PRIMITIVE_CACHE[key] is cached_ref, "Cache was unexpectedly re-created!"

    # 3. Test use_primitives=False
    pure_rand_candidates = _generate_candidate_sequences(action_size, horizon, n_samples, device, use_primitives=False)
    assert pure_rand_candidates.shape == (n_samples, horizon)
    print("Pure random generation (use_primitives=False) verified.")

    # 4. Latency Benchmark
    # Warmup
    for _ in range(5):
        _ = plan(model, dummy_state, action_size=action_size, horizon=horizon, n_samples=n_samples, use_primitives=True)

    latencies = []
    for _ in range(100):
        t0 = time.perf_counter()
        _ = plan(model, dummy_state, action_size=action_size, horizon=horizon, n_samples=n_samples, use_primitives=True)
        t1 = time.perf_counter()
        latencies.append((t1 - t0) * 1000.0)

    mean_lat = np.mean(latencies)
    p95_lat = np.percentile(latencies, 95)
    max_lat = np.max(latencies)

    print("\nLatency Benchmark (100 calls, n_samples=300, horizon=14):")
    print(f"Device:         {device}")
    print(f"Mean Latency:   {mean_lat:.2f} ms")
    print(f"95th %-tile:    {p95_lat:.2f} ms")
    print(f"Max Latency:    {max_lat:.2f} ms")

    target_lat = 30.0 if device.type == "cuda" else 60.0
    assert mean_lat < target_lat, f"Mean latency {mean_lat:.2f} ms exceeds target {target_lat} ms!"
    assert p95_lat < target_lat * 1.5, f"P95 latency {p95_lat:.2f} ms too high!"

    print("\nHONEST MPC & PRIMITIVE CACHING VERIFICATION PASSED!")


if __name__ == "__main__":
    test_mpc_honest()


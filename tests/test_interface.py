import os
import sys
import numpy as np
import torch

# Ensure root directory is on PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from envs.driving_env import DrivingEnv
from model.world_model import WorldModel, train_world_model, save_model, load_model
from planner.mpc import plan


def test_driving_interface_pluggability():
    print("=================================================================")
    print(" TESTING SHARED ENGINE PLUGGABILITY WITH DRIVING SCENARIO")
    print("=================================================================")

    # 1. Initialize Driving Environment
    env = DrivingEnv()
    state_size = env.get_state_size()
    action_size = env.get_action_size()
    print(f"DrivingEnv: state_size = {state_size}, action_size = {action_size}")

    # 2. Collect sample transitions
    states = []
    actions = []
    next_states = []
    rewards = []

    s = env.reset(seed=42)
    for _ in range(500):
        a = np.random.randint(0, action_size)
        nxt_s, r, d, info = env.step(a)
        states.append(s)
        actions.append(a)
        next_states.append(nxt_s)
        rewards.append(r)
        s = env.reset() if d else nxt_s

    states = np.array(states, dtype=np.float32)
    actions = np.array(actions, dtype=np.int64)
    next_states = np.array(next_states, dtype=np.float32)
    rewards = np.array(rewards, dtype=np.float32)
    print(f"Collected {len(states)} transitions from DrivingEnv.")

    # 3. Train shared WorldModel for 5 epochs
    model = WorldModel(state_size=state_size, action_size=action_size, hidden=64)
    trained_model = train_world_model(
        model=model,
        transitions=(states, actions, next_states, rewards),
        epochs=5,
        lr=1e-3,
        batch_size=64
    )
    print("Shared WorldModel trained for 5 epochs on DrivingEnv transitions.")

    # 4. Save and load model checkpoint
    test_ckpt = "models/test_driving_model.pt"
    save_model(trained_model, test_ckpt)
    loaded_model = load_model(test_ckpt, state_size=state_size, action_size=action_size)
    print(f"Saved and loaded model checkpoint from {test_ckpt}")

    # 5. Run shared MPC planner to select action
    current_state = env.reset(seed=99)
    action, info = plan(
        model=loaded_model,
        state=current_state,
        action_size=action_size,
        horizon=8,
        n_samples=100,
        gamma=0.95,
        return_trajectories=True
    )

    print(f"MPC Plan Result on DrivingEnv: Selected Action = {action} (Steer), Expected Return = {info['best_return']:.3f}")
    assert isinstance(action, int)
    assert 0 <= action < action_size
    assert "best_trajectory" in info

    # Step env with planned action
    next_state, reward, done, _ = env.step(action)
    assert next_state.shape == (state_size,)
    print(f"Executed action in DrivingEnv -> reward: {reward:.3f}, done: {done}")

    # Cleanup temporary checkpoint
    if os.path.exists(test_ckpt):
        os.remove(test_ckpt)

    print("\nDRIVING INTERFACE PLUGGABILITY TEST PASSED!")


if __name__ == "__main__":
    test_driving_interface_pluggability()

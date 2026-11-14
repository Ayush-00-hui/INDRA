import os
import sys
import numpy as np
import torch

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from scripts.collect_data_robot import collect_data
from model.world_model import WorldModel, train_world_model, save_model, load_model


def verify_step_c():
    data_path = "data/robot_transitions.npz"
    test_model_path = "models/test_model.pt"

    # 1. Collect dataset (40,000 samples)
    if not os.path.exists(data_path):
        collect_data(n_samples=40000, scenario=1, output_path=data_path, seed=42)
    else:
        print(f"Dataset already exists at {data_path}")

    # Load dataset
    data = np.load(data_path)
    states = data["states"]
    actions = data["actions"]
    next_states = data["next_states"]
    rewards = data["rewards"]

    assert len(states) >= 40000, f"Expected at least 40000 transitions, got {len(states)}"
    print(f"Loaded {len(states)} transitions.")

    # 2. Train World Model for 15 epochs
    state_size = states.shape[1]
    action_size = 5
    model = WorldModel(state_size=state_size, action_size=action_size, hidden=128)

    trained_model = train_world_model(
        model=model,
        transitions=(states, actions, next_states, rewards),
        epochs=15,
        lr=1e-3,
        batch_size=256
    )

    # 3. Test one-step prediction accuracy on held-out test split
    test_states = torch.as_tensor(states[-1000:], dtype=torch.float32)
    test_actions = torch.as_tensor(actions[-1000:], dtype=torch.long)
    test_targets_s = torch.as_tensor(next_states[-1000:], dtype=torch.float32)
    test_targets_r = torch.as_tensor(rewards[-1000:], dtype=torch.float32)

    with torch.no_grad():
        pred_next_s, pred_r = trained_model.predict(test_states, test_actions)

    error_s = torch.mean(torch.abs(pred_next_s.cpu() - test_targets_s)).item()
    error_r = torch.mean(torch.abs(pred_r.cpu() - test_targets_r)).item()

    print(f"\nHeld-out test set accuracy (1000 samples):")
    print(f"Next State MAE: {error_s:.6f}")
    print(f"Reward MAE:     {error_r:.6f}")

    assert error_s < 0.05, f"State prediction MAE too high: {error_s}"
    assert error_r < 0.50, f"Reward prediction MAE too high: {error_r}"

    # 4. Test save and load round-trip
    save_model(trained_model, test_model_path)
    loaded_model = load_model(test_model_path, state_size=state_size, action_size=action_size)

    with torch.no_grad():
        loaded_pred_s, loaded_pred_r = loaded_model.predict(test_states, test_actions)

    diff_s = torch.max(torch.abs(pred_next_s.cpu() - loaded_pred_s.cpu())).item()
    diff_r = torch.max(torch.abs(pred_r.cpu() - loaded_pred_r.cpu())).item()

    print(f"\nSave/Load Round-Trip Max Difference:")
    print(f"State diff:  {diff_s:.8f}")
    print(f"Reward diff: {diff_r:.8f}")

    assert diff_s < 1e-5, f"Loaded model state predictions differ: {diff_s}"
    assert diff_r < 1e-5, f"Loaded model reward predictions differ: {diff_r}"

    print("\nStep c verification PASSED!")


if __name__ == "__main__":
    verify_step_c()

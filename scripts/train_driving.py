"""
World Model Training Suite for Autonomous Driving.
Trains a 3-layer neural dynamics model to predict state delta and reward transitions.
Saves model checkpoint to models/driving_model.pt.
"""

import os
import sys
import argparse
import numpy as np
import torch

# Ensure workspace root in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from model.world_model import WorldModel, train_world_model, save_model
from scripts.collect_data_driving import collect_driving_data


def train_driving_pipeline(
    data_path: str = "data/driving_transitions.npz",
    model_path: str = "models/driving_model.pt",
    epochs: int = 40,
    lr: float = 1e-3,
    hidden: int = 128
) -> WorldModel:
    os.makedirs(os.path.dirname(model_path) or ".", exist_ok=True)

    if not os.path.exists(data_path):
        print(f"Dataset {data_path} not found. Collecting fresh dataset...")
        collect_driving_data(n_episodes=150, out_path=data_path)

    print(f"Loading transitions from {data_path}...")
    with np.load(data_path) as data:
        states = data["states"]
        actions = data["actions"]
        next_states = data["next_states"]
        rewards = data["rewards"]

    n_samples = len(states)
    state_size = states.shape[1]
    action_size = 5

    print("================================================================")
    print("      TRAINING AUTONOMOUS DRIVING NEURAL WORLD MODEL           ")
    print("================================================================")
    print(f"Transitions: {n_samples:,} | State Dim: {state_size} | Action Dim: {action_size}")
    print(f"Hidden Units: {hidden} | Epochs: {epochs} | Learning Rate: {lr}")

    transitions = (states, actions, next_states, rewards)
    model = WorldModel(state_size=state_size, action_size=action_size, hidden=hidden)

    trained_model = train_world_model(
        model=model,
        transitions=transitions,
        epochs=epochs,
        lr=lr,
        batch_size=256
    )

    # Evaluate held-out validation MAE
    val_size = int(0.10 * n_samples)
    device = next(trained_model.parameters()).device
    val_s = torch.tensor(states[-val_size:], dtype=torch.float32, device=device)
    val_a = torch.tensor(actions[-val_size:], dtype=torch.long, device=device)
    val_target_ns = torch.tensor(next_states[-val_size:], dtype=torch.float32, device=device)

    trained_model.eval()
    with torch.no_grad():
        pred_ns, pred_r = trained_model.predict(val_s, val_a)
        mae_ns = torch.abs(pred_ns - val_target_ns).mean().item()
        mae_pos = torch.abs(pred_ns[:, :2] - val_target_ns[:, :2]).mean().item()

    print("----------------------------------------------------------------")
    print(f"Validation Metrics on Held-Out Split ({val_size} samples):")
    print(f" - Overall State Transition MAE:   {mae_ns:.5f}")
    print(f" - Spatial Coordinates (X, Y) MAE: {mae_pos:.5f}")
    print(f"Saving trained checkpoint to {model_path}...")
    save_model(trained_model, model_path)
    print(f"Model saved successfully ({os.path.getsize(model_path) / 1024:.1f} KB).")
    print("================================================================")

    return trained_model


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train Driving World Model")
    parser.add_argument("--data", default="data/driving_transitions.npz")
    parser.add_argument("--model", default="models/driving_model.pt")
    parser.add_argument("--epochs", type=int, default=40)
    parser.add_argument("--lr", type=float, default=1e-3)
    parser.add_argument("--hidden", type=int, default=128)
    args = parser.parse_args()

    train_driving_pipeline(
        data_path=args.data,
        model_path=args.model,
        epochs=args.epochs,
        lr=args.lr,
        hidden=args.hidden
    )

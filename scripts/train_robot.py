import os
import sys
import time
import argparse
import numpy as np
import matplotlib.pyplot as plt

# Ensure root directory is on PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from model.world_model import WorldModel, train_world_model, save_model
from scripts.collect_data_robot import collect_data


def plot_loss_curve(history: dict, output_path: str = "results/robot_loss.png") -> None:
    """Plot training and validation loss curves and save to disk."""
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    plt.figure(figsize=(8, 5))
    plt.plot(history["epochs"], history["train_loss"], label="Train Loss", color="#1f77b4", linewidth=2)
    plt.plot(history["epochs"], history["val_loss"], label="Validation Loss", color="#ff7f0e", linewidth=2, linestyle="--")
    plt.xlabel("Epoch", fontsize=12)
    plt.ylabel("MSE Loss (Delta + Reward)", fontsize=12)
    plt.title("World Model Training & Validation Loss", fontsize=14, fontweight="bold")
    plt.grid(True, linestyle=":", alpha=0.6)
    plt.legend(fontsize=12)
    plt.tight_layout()
    plt.savefig(output_path, dpi=150)
    plt.close()
    print(f"Loss curve plot saved to {output_path}")


def train_robot(
    data_path: str = "data/robot_transitions.npz",
    model_output: str = "models/robot_model.pt",
    loss_plot_output: str = "results/robot_loss.png",
    epochs: int = 35,
    lr: float = 1e-3,
    batch_size: int = 256,
    hidden: int = 128
) -> WorldModel:
    """Full training pipeline for the robotics world model."""
    if not os.path.exists(data_path):
        print(f"Data file {data_path} not found. Automatically collecting 40,000 transitions...")
        collect_data(n_samples=40000, scenario=1, output_path=data_path)

    print(f"Loading transitions from {data_path}...")
    data = np.load(data_path)
    states = data["states"]
    actions = data["actions"]
    next_states = data["next_states"]
    rewards = data["rewards"]

    print(f"Loaded {len(states)} transitions.")
    state_size = states.shape[1]
    action_size = 5

    model = WorldModel(state_size=state_size, action_size=action_size, hidden=hidden)

    start_time = time.time()
    trained_model = train_world_model(
        model=model,
        transitions=(states, actions, next_states, rewards),
        epochs=epochs,
        lr=lr,
        batch_size=batch_size
    )
    elapsed = time.time() - start_time
    print(f"Training completed in {elapsed:.2f} seconds.")

    # Save model checkpoint
    save_model(trained_model, model_output)
    print(f"Saved trained model to {model_output}")

    # Plot loss curve
    if hasattr(trained_model, "history"):
        plot_loss_curve(trained_model.history, loss_plot_output)

    return trained_model


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train World Model for Robotics scenario.")
    parser.add_argument("--data", type=str, default="data/robot_transitions.npz", help="Path to .npz transitions.")
    parser.add_argument("--output", type=str, default="models/robot_model.pt", help="Path to save trained .pt model.")
    parser.add_argument("--plot", type=str, default="results/robot_loss.png", help="Path to save loss plot.")
    parser.add_argument("--epochs", type=int, default=35, help="Number of epochs.")
    parser.add_argument("--lr", type=float, default=1e-3, help="Learning rate.")
    parser.add_argument("--batch-size", type=int, default=256, help="Batch size.")
    args = parser.parse_args()

    train_robot(
        data_path=args.data,
        model_output=args.output,
        loss_plot_output=args.plot,
        epochs=args.epochs,
        lr=args.lr,
        batch_size=args.batch_size
    )

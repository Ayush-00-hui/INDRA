"""
Train World Model for Factory-Line Digital Twin Environment.
Collects transitions from FactoryEnv, trains transition dynamics MLP,
evaluates prediction error, and saves checkpoint to models/factory_model.pt.
"""

import os
import sys
import time
import argparse
import numpy as np
import matplotlib.pyplot as plt

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from envs.factory_env import FactoryEnv
from model.world_model import WorldModel, train_world_model, save_model


def collect_factory_data(n_samples: int = 25000, output_path: str = "data/factory_transitions.npz") -> None:
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    env = FactoryEnv(max_steps=200)

    states, actions, next_states, rewards = [], [], [], []
    s = env.reset(seed=42)

    for i in range(n_samples):
        # Semi-random exploration to cover breakdowns and maintenance
        if np.random.rand() < 0.25:
            # Baseline reactive or heuristic maintenance
            a = env.get_baseline_action()
        elif np.random.rand() < 0.4:
            a = np.random.choice([1, 2, 3])
        else:
            a = np.random.choice([0, 4, 5])

        s_next, r, done, info = env.step(a)
        states.append(s)
        actions.append(a)
        next_states.append(s_next)
        rewards.append(r)

        if done:
            s = env.reset()
        else:
            s = s_next

    np.savez_compressed(
        output_path,
        states=np.array(states, dtype=np.float32),
        actions=np.array(actions, dtype=np.int64),
        next_states=np.array(next_states, dtype=np.float32),
        rewards=np.array(rewards, dtype=np.float32)
    )
    print(f"Collected {n_samples} factory transitions -> {output_path}")


def train_factory(
    data_path: str = "data/factory_transitions.npz",
    model_output: str = "models/factory_model.pt",
    loss_plot_output: str = "results/factory_loss.png",
    epochs: int = 25,
    lr: float = 1e-3,
    batch_size: int = 256,
    hidden: int = 128
) -> WorldModel:
    if not os.path.exists(data_path):
        collect_factory_data(n_samples=25000, output_path=data_path)

    data = np.load(data_path)
    states = data["states"]
    actions = data["actions"]
    next_states = data["next_states"]
    rewards = data["rewards"]

    state_size = states.shape[1]
    action_size = 6

    model = WorldModel(state_size=state_size, action_size=action_size, hidden=hidden)

    start_time = time.time()
    trained_model = train_world_model(
        model=model,
        transitions=(states, actions, next_states, rewards),
        epochs=epochs,
        lr=lr,
        batch_size=batch_size
    )
    print(f"Factory training completed in {time.time() - start_time:.2f}s")

    os.makedirs(os.path.dirname(os.path.abspath(model_output)), exist_ok=True)
    save_model(trained_model, model_output)
    print(f"Saved factory world model to {model_output}")

    if hasattr(trained_model, "training_history"):
        os.makedirs(os.path.dirname(os.path.abspath(loss_plot_output)), exist_ok=True)
        h = trained_model.training_history
        plt.figure(figsize=(7, 4))
        plt.plot(h["epochs"], h["train_loss"], label="Train Loss")
        plt.plot(h["epochs"], h["val_loss"], label="Val Loss", linestyle="--")
        plt.title("Factory Digital Twin World Model Loss")
        plt.xlabel("Epoch")
        plt.ylabel("Loss")
        plt.legend()
        plt.grid(True, linestyle=":")
        plt.tight_layout()
        plt.savefig(loss_plot_output, dpi=120)
        plt.close()

    return trained_model


if __name__ == "__main__":
    train_factory()

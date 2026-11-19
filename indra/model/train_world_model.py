"""
Project INDRA: Neural World Model Training Script.
Hardware-independent PyTorch training pipeline compatible with both local
development laptop (RTX 5070) and college DGX Spark (128GB unified memory).
Trains a multi-head Deep Residual World Model on collected transition datasets.
"""

import os
import sys
import json
import argparse
import time
from typing import Dict, Any, Tuple

import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import TensorDataset, DataLoader

# Add repo root to path
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if REPO_ROOT not in sys.path:
    sys.path.insert(0, REPO_ROOT)

from indra.model.model_interface import BaseWorldModelInterface


class ResBlock(nn.Module):
    """Residual MLP Block with LayerNorm and SiLU activation."""
    def __init__(self, hidden_dim: int, dropout: float = 0.05):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(hidden_dim, hidden_dim),
            nn.LayerNorm(hidden_dim),
            nn.SiLU(),
            nn.Dropout(dropout),
            nn.Linear(hidden_dim, hidden_dim),
            nn.LayerNorm(hidden_dim)
        )
        self.act = nn.SiLU()

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.act(x + self.net(x))


class IndraNeuralWorldModel(nn.Module, BaseWorldModelInterface):
    """
    Multi-Head Deep Residual Neural World Model for Project INDRA.
    Predicts state transition delta: s_{t+1} = s_t + Delta s_t,
    immediate scalar reward: r_t, and termination probability: d_t.
    """

    def __init__(
        self,
        obs_dim: int = 24,
        action_dim: int = 5,
        hidden_dim: int = 256,
        num_res_blocks: int = 4
    ):
        super().__init__()
        self.obs_dim = obs_dim
        self.action_dim = action_dim
        self.hidden_dim = hidden_dim

        # Input projection (concatenated state + one-hot action)
        self.in_proj = nn.Sequential(
            nn.Linear(obs_dim + action_dim, hidden_dim),
            nn.LayerNorm(hidden_dim),
            nn.SiLU()
        )

        # Residual backbone
        self.backbone = nn.Sequential(
            *[ResBlock(hidden_dim) for _ in range(num_res_blocks)]
        )

        # Output prediction heads
        self.delta_head = nn.Linear(hidden_dim, obs_dim)
        self.reward_head = nn.Linear(hidden_dim, 1)
        self.done_head = nn.Linear(hidden_dim, 1)
        self.last_latency_ms: float = 0.5

    def forward(self, obs: torch.Tensor, actions_onehot: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
        """
        Forward pass predicting next state delta, reward, and done logits.
        """
        x = torch.cat([obs, actions_onehot], dim=-1)
        h = self.in_proj(x)
        h = self.backbone(h)

        delta_s = self.delta_head(h)
        pred_next_obs = obs + delta_s
        pred_reward = self.reward_head(h).squeeze(-1)
        pred_done_logits = self.done_head(h).squeeze(-1)

        return pred_next_obs, pred_reward, pred_done_logits

    # BaseWorldModelInterface implementation for inference
    def predict_next_state(self, current_state: np.ndarray, action: int) -> Tuple[np.ndarray, float]:
        t0 = time.perf_counter()
        self.eval()
        with torch.no_grad():
            s_tensor = torch.from_numpy(current_state).float().unsqueeze(0)
            a_onehot = torch.zeros((1, self.action_dim), dtype=torch.float32)
            a_onehot[0, action] = 1.0

            device = next(self.parameters()).device
            s_tensor = s_tensor.to(device)
            a_onehot = a_onehot.to(device)

            pred_next, pred_rew, _ = self(s_tensor, a_onehot)
            self.last_latency_ms = (time.perf_counter() - t0) * 1000.0
            return pred_next.squeeze(0).cpu().numpy(), float(pred_rew.squeeze(0).cpu().item())

    def predict_trajectory(self, state: np.ndarray, action_sequence: List[int]) -> List[np.ndarray]:
        trajectory = []
        curr = np.copy(state)
        for act in action_sequence:
            next_s, _ = self.predict_next_state(curr, act)
            trajectory.append(next_s)
            curr = next_s
        return trajectory

    def predict_batch(self, current_states: np.ndarray, actions: np.ndarray) -> np.ndarray:
        self.eval()
        with torch.no_grad():
            device = next(self.parameters()).device
            s_tensor = torch.from_numpy(current_states).float().to(device)
            a_tensor = torch.from_numpy(actions).long()
            a_onehot = torch.zeros((len(actions), self.action_dim), dtype=torch.float32)
            a_onehot.scatter_(1, a_tensor.unsqueeze(1), 1.0)
            a_onehot = a_onehot.to(device)

            pred_next, _, _ = self(s_tensor, a_onehot)
            return pred_next.cpu().numpy()

    def get_inference_latency_ms(self) -> float:
        return self.last_latency_ms

    def is_neural(self) -> bool:
        return True

    def get_model_metadata(self) -> Dict[str, Any]:
        param_count = sum(p.numel() for p in self.parameters())
        return {
            "type": "NeuralWorldModel",
            "architecture": f"Deep Residual MLP ({self.hidden_dim}h, 4 blocks)",
            "parameter_count": param_count,
            "device": str(next(self.parameters()).device),
            "status": "Trained Checkpoint"
        }


def train_model(
    data_path: str,
    output_dir: str = "models",
    epochs: int = 15,
    batch_size: int = 128,
    lr: float = 1e-3,
    val_split: float = 0.15
) -> str:
    """
    Train IndraNeuralWorldModel on offline transition dataset.
    """
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[INDRA TRAINING] Target device: {device} ({torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'CPU'})")

    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Dataset not found at {data_path}. Run scripts/collect_indra_dataset.py first.")

    # Load dataset
    data = np.load(data_path)
    obs = torch.from_numpy(data["obs"]).float()
    actions = torch.from_numpy(data["actions"]).long()
    next_obs = torch.from_numpy(data["next_obs"]).float()
    rewards = torch.from_numpy(data["rewards"]).float()
    dones = torch.from_numpy(data["dones"]).float()

    total_samples = len(obs)
    val_size = int(total_samples * val_split)
    train_size = total_samples - val_size

    # One-hot actions
    actions_onehot = torch.zeros((total_samples, 5), dtype=torch.float32)
    actions_onehot.scatter_(1, actions.unsqueeze(1), 1.0)

    dataset = TensorDataset(obs, actions_onehot, next_obs, rewards, dones)
    train_set, val_set = torch.utils.data.random_split(dataset, [train_size, val_size])

    train_loader = DataLoader(train_set, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_set, batch_size=batch_size, shuffle=False)

    print(f"[INDRA TRAINING] Total Transitions: {total_samples:,} (Train: {train_size:,}, Val: {val_size:,})")

    # Initialize model
    model = IndraNeuralWorldModel(obs_dim=24, action_dim=5, hidden_dim=256, num_res_blocks=4).to(device)
    optimizer = optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs)

    mse_loss = nn.MSELoss()
    bce_loss = nn.BCEWithLogitsLoss()

    best_val_loss = float("inf")
    os.makedirs(output_dir, exist_ok=True)
    best_ckpt_path = os.path.join(output_dir, "indra_model.pt")

    for ep in range(1, epochs + 1):
        t0 = time.perf_counter()
        model.train()
        train_loss_acc = 0.0

        for b_obs, b_act, b_next_obs, b_rew, b_done in train_loader:
            b_obs = b_obs.to(device)
            b_act = b_act.to(device)
            b_next_obs = b_next_obs.to(device)
            b_rew = b_rew.to(device)
            b_done = b_done.to(device)

            pred_next, pred_rew, pred_done_logits = model(b_obs, b_act)

            l_state = mse_loss(pred_next, b_next_obs)
            l_rew = mse_loss(pred_rew, b_rew)
            l_done = bce_loss(pred_done_logits, b_done)

            loss = l_state + 0.1 * l_rew + 0.1 * l_done

            optimizer.zero_grad()
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
            optimizer.step()

            train_loss_acc += loss.item() * len(b_obs)

        train_loss = train_loss_acc / train_size
        scheduler.step()

        # Validation
        model.eval()
        val_loss_acc = 0.0
        with torch.no_grad():
            for b_obs, b_act, b_next_obs, b_rew, b_done in val_loader:
                b_obs = b_obs.to(device)
                b_act = b_act.to(device)
                b_next_obs = b_next_obs.to(device)
                b_rew = b_rew.to(device)
                b_done = b_done.to(device)

                pred_next, pred_rew, pred_done_logits = model(b_obs, b_act)
                l_state = mse_loss(pred_next, b_next_obs)
                l_rew = mse_loss(pred_rew, b_rew)
                l_done = bce_loss(pred_done_logits, b_done)
                loss = l_state + 0.1 * l_rew + 0.1 * l_done
                val_loss_acc += loss.item() * len(b_obs)

        val_loss = val_loss_acc / max(val_size, 1)
        elapsed = time.perf_counter() - t0

        print(f"Epoch {ep:02d}/{epochs:02d} | Train Loss: {train_loss:.5f} | Val Loss: {val_loss:.5f} | Time: {elapsed:.2f}s")

        if val_loss < best_val_loss:
            best_val_loss = val_loss
            torch.save({
                "epoch": ep,
                "model_state_dict": model.state_dict(),
                "optimizer_state_dict": optimizer.state_dict(),
                "val_loss": val_loss,
                "metadata": model.get_model_metadata()
            }, best_ckpt_path)
            print(f"  -> Best model checkpoint saved to {best_ckpt_path}")

    return best_ckpt_path


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train Project INDRA Neural World Model.")
    parser.add_argument("--data", type=str, default="data/indra_transitions_sample.npz")
    parser.add_argument("--output-dir", type=str, default="models")
    parser.add_argument("--epochs", type=int, default=10)
    parser.add_argument("--batch-size", type=int, default=128)
    parser.add_argument("--lr", type=float, default=1e-3)
    args = parser.parse_args()

    train_model(
        data_path=args.data,
        output_dir=args.output_dir,
        epochs=args.epochs,
        batch_size=args.batch_size,
        lr=args.lr
    )

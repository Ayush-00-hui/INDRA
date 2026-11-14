import os
from typing import Tuple, Dict, Any, Optional
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F


def get_device() -> torch.device:
    """Select CUDA if available and functional, otherwise CPU."""
    if torch.cuda.is_available():
        try:
            # Smoke test CUDA allocation
            t = torch.zeros(1, device="cuda")
            del t
            return torch.device("cuda")
        except Exception:
            return torch.device("cpu")
    return torch.device("cpu")


class WorldModel(nn.Module):
    """
    World Model neural network.
    
    Predicts next-state delta (next_state - state) and immediate reward from (state, action).
    Includes internal registered buffers for mean and standard deviation normalization,
    enabling fully batched rollouts on GPU/CPU with automatic serialization.
    """

    def __init__(self, state_size: int, action_size: int, hidden: int = 128):
        super().__init__()
        self.state_size = state_size
        self.action_size = action_size
        self.hidden = hidden

        # Shared MLP trunk
        input_dim = state_size + action_size
        self.trunk = nn.Sequential(
            nn.Linear(input_dim, hidden),
            nn.ReLU(),
            nn.Linear(hidden, hidden),
            nn.ReLU(),
            nn.Linear(hidden, hidden),
            nn.ReLU(),
        )

        # Output heads
        self.head_delta = nn.Linear(hidden, state_size)
        self.head_reward = nn.Linear(hidden, 1)

        # Normalization buffers (saved/loaded with model weights)
        self.register_buffer("state_mean", torch.zeros(state_size))
        self.register_buffer("state_std", torch.ones(state_size))
        self.register_buffer("delta_mean", torch.zeros(state_size))
        self.register_buffer("delta_std", torch.ones(state_size))
        self.register_buffer("reward_mean", torch.zeros(1))
        self.register_buffer("reward_std", torch.ones(1))

    def set_normalization(self, state_mean: np.ndarray, state_std: np.ndarray,
                          delta_mean: np.ndarray, delta_std: np.ndarray,
                          reward_mean: np.ndarray, reward_std: np.ndarray) -> None:
        """Store dataset mean and std statistics into registered buffers."""
        device = self.state_mean.device
        self.state_mean.copy_(torch.as_tensor(state_mean, dtype=torch.float32, device=device))
        self.state_std.copy_(torch.as_tensor(np.maximum(state_std, 1e-6), dtype=torch.float32, device=device))
        self.delta_mean.copy_(torch.as_tensor(delta_mean, dtype=torch.float32, device=device))
        self.delta_std.copy_(torch.as_tensor(np.maximum(delta_std, 1e-6), dtype=torch.float32, device=device))
        self.reward_mean.copy_(torch.as_tensor(reward_mean, dtype=torch.float32, device=device).reshape(1))
        self.reward_std.copy_(torch.as_tensor(np.maximum(reward_std, 1e-6), dtype=torch.float32, device=device).reshape(1))

    def forward(self, norm_states: torch.Tensor, actions_one_hot: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor]:
        """Forward pass taking normalized state and one-hot actions, returning normalized predictions."""
        x = torch.cat([norm_states, actions_one_hot], dim=-1)
        feat = self.trunk(x)
        pred_norm_delta = self.head_delta(feat)
        pred_norm_reward = self.head_reward(feat)
        return pred_norm_delta, pred_norm_reward

    def predict(self, state_batch: torch.Tensor, action_batch: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor]:
        """
        Batched prediction for MPC rollouts.
        
        Args:
            state_batch (torch.Tensor): Unnormalized states of shape (B, state_size).
            action_batch (torch.Tensor): Discrete action indices (shape (B,)) or one-hot (shape (B, action_size)).
            
        Returns:
            Tuple[torch.Tensor, torch.Tensor]:
                - next_state_batch: Unnormalized predicted states (shape (B, state_size)).
                - reward_batch: Unnormalized predicted rewards (shape (B,)).
        """
        device = self.state_mean.device

        # Ensure correct shape and device
        if state_batch.device != device:
            state_batch = state_batch.to(device)
        if action_batch.device != device:
            action_batch = action_batch.to(device)

        # Handle 1D inputs by adding batch dimension
        is_single = False
        if state_batch.ndim == 1:
            state_batch = state_batch.unsqueeze(0)
            is_single = True
        if action_batch.ndim == 0:
            action_batch = action_batch.unsqueeze(0)

        # Convert actions to one-hot if integer indices
        if action_batch.ndim == 1:
            actions_one_hot = F.one_hot(action_batch.long(), num_classes=self.action_size).float()
        else:
            actions_one_hot = action_batch.float()

        # 1. Normalize input state
        norm_states = (state_batch - self.state_mean) / self.state_std

        # 2. Forward pass (with defensive CPU fallback for CUDA kernel errors)
        try:
            pred_norm_delta, pred_norm_reward = self.forward(norm_states, actions_one_hot)
        except RuntimeError as e:
            if "CUDA" in str(e) or "cuda" in str(e):
                # Fallback model to CPU
                self.to(torch.device("cpu"))
                norm_states = norm_states.to("cpu")
                actions_one_hot = actions_one_hot.to("cpu")
                pred_norm_delta, pred_norm_reward = self.forward(norm_states, actions_one_hot)
            else:
                raise e

        # 3. Un-normalize delta and reward
        pred_delta = pred_norm_delta * self.delta_std + self.delta_mean
        next_states = state_batch + pred_delta

        pred_reward = (pred_norm_reward * self.reward_std + self.reward_mean).squeeze(-1)

        if is_single:
            return next_states.squeeze(0), pred_reward.squeeze(0)

        return next_states, pred_reward


def train_world_model(
    model: WorldModel,
    transitions: Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray],
    epochs: int = 40,
    lr: float = 1e-3,
    batch_size: int = 256,
) -> WorldModel:
    """
    Train WorldModel on transition data with Adam optimizer and MSE loss.
    
    Args:
        model: WorldModel instance.
        transitions: Tuple of (states, actions, next_states, rewards) numpy arrays.
        epochs: Number of training epochs.
        lr: Learning rate.
        batch_size: Mini-batch size.
        
    Returns:
        WorldModel: The trained model in eval mode.
    """
    states, actions, next_states, rewards = transitions
    N = len(states)
    assert N > 0, "Empty transitions dataset!"

    deltas = next_states - states

    # Split 90% train, 10% validation
    indices = np.random.permutation(N)
    val_size = max(1, int(0.10 * N))
    train_idx, val_idx = indices[val_size:], indices[:val_size]

    train_states, val_states = states[train_idx], states[val_idx]
    train_actions, val_actions = actions[train_idx], actions[val_idx]
    train_deltas, val_deltas = deltas[train_idx], deltas[val_idx]
    train_rewards, val_rewards = rewards[train_idx], rewards[val_idx]

    # Compute normalization statistics strictly from training split
    s_mean, s_std = np.mean(train_states, axis=0), np.std(train_states, axis=0)
    d_mean, d_std = np.mean(train_deltas, axis=0), np.std(train_deltas, axis=0)
    r_mean, r_std = np.mean(train_rewards), np.std(train_rewards)

    device = get_device()
    model.to(device)
    model.set_normalization(s_mean, s_std, d_mean, d_std, np.array([r_mean]), np.array([r_std]))

    # Convert training data to normalized tensors
    train_s_norm = torch.as_tensor((train_states - s_mean) / np.maximum(s_std, 1e-6), dtype=torch.float32, device=device)
    train_a_oh = F.one_hot(torch.as_tensor(train_actions, dtype=torch.long, device=device), num_classes=model.action_size).float()
    train_d_norm = torch.as_tensor((train_deltas - d_mean) / np.maximum(d_std, 1e-6), dtype=torch.float32, device=device)
    train_r_norm = torch.as_tensor((train_rewards - r_mean) / max(r_std, 1e-6), dtype=torch.float32, device=device).unsqueeze(-1)

    val_s_norm = torch.as_tensor((val_states - s_mean) / np.maximum(s_std, 1e-6), dtype=torch.float32, device=device)
    val_a_oh = F.one_hot(torch.as_tensor(val_actions, dtype=torch.long, device=device), num_classes=model.action_size).float()
    val_d_norm = torch.as_tensor((val_deltas - d_mean) / np.maximum(d_std, 1e-6), dtype=torch.float32, device=device)
    val_r_norm = torch.as_tensor((val_rewards - r_mean) / max(r_std, 1e-6), dtype=torch.float32, device=device).unsqueeze(-1)

    optimizer = torch.optim.Adam(model.parameters(), lr=lr)
    n_train = len(train_states)

    print(f"Training World Model on {device}: {n_train} train samples, {val_size} val samples, {epochs} epochs.")

    for epoch in range(1, epochs + 1):
        model.train()
        perm = torch.randperm(n_train, device=device)
        total_loss = 0.0
        batches = 0

        for start in range(0, n_train, batch_size):
            end = min(start + batch_size, n_train)
            batch_idx = perm[start:end]

            pred_d, pred_r = model(train_s_norm[batch_idx], train_a_oh[batch_idx])
            loss_d = F.mse_loss(pred_d, train_d_norm[batch_idx])
            loss_r = F.mse_loss(pred_r, train_r_norm[batch_idx])
            loss = loss_d + loss_r

            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            total_loss += loss.item()
            batches += 1

        avg_train_loss = total_loss / max(batches, 1)

        # Validation loss
        if epoch % 5 == 0 or epoch == 1 or epoch == epochs:
            model.eval()
            with torch.no_grad():
                val_pred_d, val_pred_r = model(val_s_norm, val_a_oh)
                val_loss_d = F.mse_loss(val_pred_d, val_d_norm).item()
                val_loss_r = F.mse_loss(val_pred_r, val_r_norm).item()
                val_loss = val_loss_d + val_loss_r
            print(f"Epoch [{epoch:3d}/{epochs:3d}] | Train Loss: {avg_train_loss:.5f} | Val Loss: {val_loss:.5f} (delta: {val_loss_d:.5f}, reward: {val_loss_r:.5f})")

    model.eval()
    return model


def save_model(model: WorldModel, path: str) -> None:
    """Save model state dict, architecture configuration, and normalization buffers."""
    os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
    payload = {
        "state_dict": model.state_dict(),
        "state_size": model.state_size,
        "action_size": model.action_size,
        "hidden": model.hidden,
    }
    torch.save(payload, path)


def load_model(path: str, state_size: Optional[int] = None, action_size: Optional[int] = None) -> WorldModel:
    """Load model from disk, configure device, and switch to evaluation mode."""
    device = get_device()
    checkpoint = torch.load(path, map_location=device)

    if isinstance(checkpoint, dict) and "state_dict" in checkpoint:
        s_size = checkpoint.get("state_size", state_size)
        a_size = checkpoint.get("action_size", action_size)
        hidden = checkpoint.get("hidden", 128)
        model = WorldModel(state_size=s_size, action_size=a_size, hidden=hidden)
        model.load_state_dict(checkpoint["state_dict"])
    else:
        model = WorldModel(state_size=state_size, action_size=action_size)
        model.load_state_dict(checkpoint)

    model.to(device)
    model.eval()
    return model

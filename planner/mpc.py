import time
from typing import Tuple, Dict, Any, Union, List, Optional
import numpy as np
import torch
import torch.nn.functional as F

from model.world_model import WorldModel


def generate_candidate_action_sequences(action_size: int, horizon: int, n_samples: int, device: torch.device) -> torch.Tensor:
    """
    Generate structured candidate action sequences for Random-Shooting MPC.
    
    Includes:
    1. Straight lines in each action direction.
    2. Single-turn L-shaped evasion maneuvers around obstacles.
    3. Multi-turn detour trajectories (evade obstacle, drive to goal, re-align).
    4. Temporally persistent random exploratory sequences.
    
    Returns:
        torch.Tensor: Long tensor of shape (n_samples, horizon).
    """
    seqs: List[torch.Tensor] = []

    # 1. Straight lines in every available action direction
    for a in range(action_size):
        seqs.append(torch.full((horizon,), a, device=device, dtype=torch.long))

    # 2. Single-turn L-shaped evasion maneuvers (a1 for k steps, then a2)
    for a1 in range(action_size):
        for a2 in range(action_size):
            if a1 != a2:
                for k in range(1, horizon):
                    seq = torch.full((horizon,), a2, device=device, dtype=torch.long)
                    seq[:k] = a1
                    seqs.append(seq)

    # 3. Two-turn detour maneuvers (detour, advance toward goal, re-align)
    for a1 in range(action_size):
        for a2 in range(action_size):
            if a1 != a2:
                for k1 in [2, 3, 5]:
                    for k2 in [3, 5, 7]:
                        if k1 + k2 < horizon:
                            seq = torch.full((horizon,), a1, device=device, dtype=torch.long)
                            seq[k1:k1 + k2] = a2
                            seqs.append(seq)

    # 4. Fill remaining samples with persistent random walks
    while len(seqs) < n_samples:
        seq = torch.randint(0, action_size, (horizon,), device=device, dtype=torch.long)
        chunk = np.random.randint(2, max(3, horizon // 2))
        for t in range(0, horizon, chunk):
            seq[t:min(t + chunk, horizon)] = seq[t]
        seqs.append(seq)

    # Ensure equal partition for candidate first actions if needed
    actions = torch.stack(seqs[:n_samples])
    return actions


def plan(
    model: WorldModel,
    state: np.ndarray,
    action_size: int,
    horizon: int = 14,
    n_samples: int = 300,
    gamma: float = 0.95,
    return_trajectories: bool = False
) -> Union[int, Tuple[int, Dict[str, Any]]]:
    """
    Random-Shooting Model Predictive Control (MPC) planner.
    
    Generates n_samples candidate action sequences over a planning horizon,
    evaluates them via fully batched rollouts in the learned WorldModel,
    and returns the first action of the trajectory with the highest expected discounted return.
    
    Args:
        model (WorldModel): Trained world model instance.
        state (np.ndarray): Current environment state vector of shape (state_size,).
        action_size (int): Number of discrete actions available.
        horizon (int): Planning horizon (number of future imagined steps).
        n_samples (int): Number of random action sequences to evaluate in parallel.
        gamma (float): Discount factor for future predicted rewards.
        return_trajectories (bool): If True, returns (best_action, info) with trajectory paths.
        
    Returns:
        int: Optimal first action if return_trajectories is False.
        Tuple[int, Dict[str, Any]]: (best_action, info) if return_trajectories is True.
    """
    device = model.state_mean.device

    with torch.no_grad():
        # Ensure state is a float32 tensor on model device
        if not isinstance(state, torch.Tensor):
            s_tensor = torch.as_tensor(state, dtype=torch.float32, device=device)
        else:
            s_tensor = state.to(device=device, dtype=torch.float32)

        if s_tensor.ndim == 1:
            s_batch = s_tensor.unsqueeze(0).repeat(n_samples, 1)
        else:
            s_batch = s_tensor.repeat(n_samples, 1)

        # Generate structured candidate action sequences
        actions = generate_candidate_action_sequences(action_size, horizon, n_samples, device)

        # State trajectory storage if trajectories requested
        traj_states = None
        if return_trajectories:
            traj_states = torch.empty((horizon + 1, n_samples, s_batch.shape[-1]), device=device, dtype=torch.float32)
            traj_states[0] = s_batch

        returns = torch.zeros(n_samples, device=device, dtype=torch.float32)
        curr_states = s_batch
        discount = 1.0

        # Rollout through imagined future steps (fully batched across samples)
        for t in range(horizon):
            act_t = actions[:, t]
            next_states, pred_rewards = model.predict(curr_states, act_t)

            returns += discount * pred_rewards
            discount *= gamma
            curr_states = next_states

            if return_trajectories:
                traj_states[t + 1] = curr_states

        best_idx = torch.argmax(returns).item()
        best_action = int(actions[best_idx, 0].item())

        if not return_trajectories:
            return best_action

        # Extract visualization trajectories
        # Use robot position coordinates [norm_x, norm_y] for ghost paths
        best_trajectory = traj_states[:, best_idx, :2].cpu().numpy()

        candidate_trajectories: List[np.ndarray] = []
        candidate_returns: List[float] = []

        # Extract best candidate trajectory starting with each distinct first action
        for a in range(action_size):
            mask = (actions[:, 0] == a)
            if torch.any(mask):
                masked_returns = returns.clone()
                masked_returns[~mask] = -1e9
                sub_best = torch.argmax(masked_returns).item()
                candidate_trajectories.append(traj_states[:, sub_best, :2].cpu().numpy())
                candidate_returns.append(float(returns[sub_best].item()))

        info = {
            "best_trajectory": best_trajectory,
            "candidate_trajectories": candidate_trajectories,
            "best_return": float(returns[best_idx].item()),
            "candidate_returns": candidate_returns,
            "all_returns": returns.cpu().numpy(),
        }

        return best_action, info

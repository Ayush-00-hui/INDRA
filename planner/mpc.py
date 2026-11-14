import time
from typing import Tuple, Dict, Any, Union, List, Optional
import numpy as np
import torch
import torch.nn.functional as F

from model.world_model import WorldModel


# Cache for precomputed structured motion primitives: (action_size, horizon, device) -> torch.Tensor
_PRIMITIVE_CACHE: Dict[Tuple[int, int, str], torch.Tensor] = {}


def _build_and_cache_primitives(action_size: int, horizon: int, device: torch.device) -> torch.Tensor:
    """
    Construct and cache structured motion primitives once per configuration.
    
    Includes:
    - Straight lines in all action directions.
    - Single-turn L-shaped evasion maneuvers.
    - Two-turn detour maneuvers.
    """
    key = (action_size, horizon, str(device))
    if key in _PRIMITIVE_CACHE:
        return _PRIMITIVE_CACHE[key]

    prims = []

    # 1. Straight lines in each action direction
    straight = torch.arange(action_size, device=device, dtype=torch.long).unsqueeze(1).repeat(1, horizon)
    prims.append(straight)

    # 2. Single-turn L-shaped maneuvers (a1 for k steps, then a2)
    l_turns = []
    for a1 in range(action_size):
        for a2 in range(action_size):
            if a1 != a2:
                for k in range(1, horizon):
                    seq = torch.full((horizon,), a2, device=device, dtype=torch.long)
                    seq[:k] = a1
                    l_turns.append(seq)
    if l_turns:
        prims.append(torch.stack(l_turns))

    # 3. Two-turn detour maneuvers (a1 for k1, a2 for k2, then a3)
    two_turns = []
    for a1 in range(action_size):
        for a2 in range(action_size):
            if a1 != a2:
                for k1 in [2, 3, 5]:
                    for k2 in [3, 5, 7]:
                        if k1 + k2 < horizon:
                            seq = torch.full((horizon,), a1, device=device, dtype=torch.long)
                            seq[k1:k1 + k2] = a2
                            two_turns.append(seq)
    if two_turns:
        prims.append(torch.stack(two_turns))

    cached_tensor = torch.cat(prims, dim=0)
    _PRIMITIVE_CACHE[key] = cached_tensor
    return cached_tensor


def _generate_candidate_sequences(
    action_size: int,
    horizon: int,
    n_samples: int,
    device: torch.device,
    use_primitives: bool = True
) -> torch.Tensor:
    """
    Generate candidate action sequences combining temporally persistent random walks
    and structured motion primitives (50/50 mix), shuffled so truncation never removes randomness.
    """
    if use_primitives:
        cached_prims = _build_and_cache_primitives(action_size, horizon, device)
        n_prim = min(n_samples // 2, len(cached_prims))
        n_rand = n_samples - n_prim

        # Sample n_prim primitives without replacement
        prim_indices = torch.randperm(len(cached_prims), device=device)[:n_prim]
        selected_prims = cached_prims[prim_indices]
    else:
        n_rand = n_samples
        selected_prims = None

    # Vectorized temporally persistent random sequences
    chunk_size = max(2, horizon // 3)
    n_chunks = (horizon + chunk_size - 1) // chunk_size
    chunk_acts = torch.randint(0, action_size, (n_rand, n_chunks), device=device, dtype=torch.long)
    rand_sequences = chunk_acts.repeat_interleave(chunk_size, dim=1)[:, :horizon]

    # Mix in pure uniform random exploratory sequences for 30% of random quota
    n_pure = max(1, n_rand // 3)
    rand_sequences[:n_pure] = torch.randint(0, action_size, (n_pure, horizon), device=device, dtype=torch.long)

    if selected_prims is not None and len(selected_prims) > 0:
        candidates = torch.cat([rand_sequences, selected_prims], dim=0)
    else:
        candidates = rand_sequences

    # Shuffle uniformly so random and primitive sequences are intermingled
    shuffled_indices = torch.randperm(len(candidates), device=device)[:n_samples]
    return candidates[shuffled_indices]


def plan(
    model: WorldModel,
    state: np.ndarray,
    action_size: int,
    horizon: int = 14,
    n_samples: int = 300,
    gamma: float = 0.95,
    return_trajectories: bool = False,
    use_primitives: bool = True
) -> Union[int, Tuple[int, Dict[str, Any]]]:
    """
    Random-Shooting Model Predictive Control (MPC) planner.
    
    Generates n_samples candidate action sequences over a planning horizon
    (combining temporally persistent random sequences and structured motion primitives),
    evaluates them via fully batched rollouts in the learned WorldModel,
    and returns the first action of the trajectory with the highest expected discounted return.
    
    Args:
        model (WorldModel): Trained world model instance.
        state (np.ndarray): Current environment state vector of shape (state_size,).
        action_size (int): Number of discrete actions available.
        horizon (int): Planning horizon (number of future imagined steps).
        n_samples (int): Number of action sequences to evaluate in parallel.
        gamma (float): Discount factor for future predicted rewards.
        return_trajectories (bool): If True, returns (best_action, info) with trajectory paths.
        use_primitives (bool): If True, blends 50% cached primitives with 50% random sequences.
        
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

        # Generate action sequences
        actions = _generate_candidate_sequences(action_size, horizon, n_samples, device, use_primitives=use_primitives)

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

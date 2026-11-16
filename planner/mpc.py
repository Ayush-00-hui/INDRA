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

    # 4. Docking & deceleration maneuvers (action a for k steps, then STAY action 4)
    if action_size > 4:
        docking = []
        for a in range(action_size - 1):
            for k in range(1, horizon):
                seq = torch.full((horizon,), 4, device=device, dtype=torch.long)
                seq[:k] = a
                docking.append(seq)
        if docking:
            prims.append(torch.stack(docking))

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
    use_primitives: bool = True,
    last_action: Optional[int] = None,
    method: str = "random",
    uncertainty_penalty: float = 0.0
) -> Union[int, Tuple[int, Dict[str, Any]]]:
    """
    Random-Shooting / CEM / MPPI Model Predictive Control (MPC) planner.
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
        last_action (Optional[int]): Optional previous action for anti-oscillation tie-breaking.
        
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

        # Goal tracking variables
        has_goal_coords = (s_batch.shape[-1] >= 4)
        if has_goal_coords:
            goal_x_px = (s_batch[:, 0] + s_batch[:, 2]) * 450.0 + 450.0
            goal_y_px = (s_batch[:, 1] + s_batch[:, 3]) * 300.0 + 300.0
            init_dist = torch.hypot(s_batch[:, 2] * 450.0, s_batch[:, 3] * 300.0)
            min_dist_along_traj = init_dist.clone()
            arrival_bonus = torch.zeros(n_samples, device=device, dtype=torch.float32)

        # Rollout through imagined future steps (fully batched across samples)
        for t in range(horizon):
            act_t = actions[:, t]
            if uncertainty_penalty > 0.0 and hasattr(model, "predict_with_uncertainty"):
                res = model.predict_with_uncertainty(curr_states, act_t)
                if len(res) == 4:
                    next_states, next_states_std, pred_rewards, _ = res
                    unc = next_states_std.mean(dim=-1)
                else:
                    next_states, pred_rewards, unc_tensor = res
                    unc = unc_tensor.mean(dim=-1)
                step_reward = pred_rewards - (uncertainty_penalty * unc)
            else:
                next_states, pred_rewards = model.predict(curr_states, act_t)
                step_reward = pred_rewards

            returns += discount * step_reward
            discount *= gamma
            curr_states = next_states

            if has_goal_coords:
                step_x_px = curr_states[:, 0] * 450.0 + 450.0
                step_y_px = curr_states[:, 1] * 300.0 + 300.0
                step_dist = torch.hypot(step_x_px - goal_x_px, step_y_px - goal_y_px)
                min_dist_along_traj = torch.minimum(min_dist_along_traj, step_dist)

                # Rewarding reaching the goal (<40 px) along the horizon, discounted by time-to-arrival
                arrived_step = (step_dist < 40.0) & (arrival_bonus == 0.0)
                if torch.any(arrived_step):
                    arrival_bonus[arrived_step] = 45.0 * (gamma ** t)

            if return_trajectories:
                traj_states[t + 1] = curr_states

        # Goal progress & precision docking
        if has_goal_coords:
            # Reward progress based on the closest approach achieved during the rollout
            progress = (init_dist - min_dist_along_traj) / 15.0
            returns += 3.0 * progress
            returns += arrival_bonus

            # Proximity fine guidance (< 100px): penalize moving away from goal
            term_x_px = curr_states[:, 0] * 450.0 + 450.0
            term_y_px = curr_states[:, 1] * 300.0 + 300.0
            term_dist = torch.hypot(term_x_px - goal_x_px, term_y_px - goal_y_px)
            close_mask = (init_dist < 100.0)
            overshoot_penalty = torch.clamp(term_dist - 40.0, min=0.0) / 20.0
            returns[close_mask] -= 1.5 * overshoot_penalty[close_mask]

            # Penalize idle STAY action (action 4) when goal is not yet reached
            not_at_goal = (init_dist > 40.0)
            returns[(actions[:, 0] == 4) & not_at_goal] -= 4.0

        # Anti-immediate-reversal tie-breaker (prevents 2-state back-and-forth oscillations)
        if last_action is not None and 0 <= last_action < 4:
            opposite = {0: 1, 1: 0, 2: 3, 3: 2}.get(last_action, -1)
            if opposite != -1:
                returns[actions[:, 0] == opposite] -= 0.60

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

# Shared Engine API Specification (FROZEN)

This document specifies the frozen interface of the shared World Model and Model Predictive Control (MPC) planner engine. Both the **robotics** scenario and the **driving** scenario rely on these exact signatures and semantics.

> **RULE:** Public class names, method signatures, argument types, and return formats defined here must NEVER change. New optional arguments with default values may be added if strictly necessary.

---

## 1. Environment Interface (`envs/base_env.py`)

All environments inherit from `BaseEnv`.

```python
class BaseEnv(ABC):
    @abstractmethod
    def reset(self, seed: Optional[int] = None) -> np.ndarray:
        """Reset environment. Returns initial state vector (float32, shape (state_size,))."""
        pass

    @abstractmethod
    def step(self, action: int) -> Tuple[np.ndarray, float, bool, Dict[str, Any]]:
        """Advance by discrete action. Returns (next_state, reward, done, info)."""
        pass

    @abstractmethod
    def render(self, screen: pygame.Surface) -> None:
        """Draw simulation onto a Pygame surface."""
        pass

    @abstractmethod
    def get_state_size(self) -> int:
        """Return state vector dimension."""
        pass

    @abstractmethod
    def get_action_size(self) -> int:
        """Return number of discrete actions."""
        pass
```

---

## 2. World Model Engine (`model/world_model.py`)

### `class WorldModel(state_size: int, action_size: int, hidden: int = 128)`
PyTorch neural network that predicts next-state delta `(s' - s)` and immediate reward `r` from `(state, action)`.

- **Internal Buffers:** Stores registered normalization buffers (`state_mean`, `state_std`, `delta_mean`, `delta_std`, `reward_mean`, `reward_std`) so normalization travels with model weights across GPU/CPU and save/load cycles.
- **Predict Method:**
  ```python
  predict(state_batch: torch.Tensor, action_batch: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor]
  ```
  - `state_batch`: `(B, state_size)` unnormalized state tensor.
  - `action_batch`: `(B,)` integer actions or `(B, action_size)` one-hot actions.
  - Returns `(next_state_batch, reward_batch)`:
    - `next_state_batch`: `(B, state_size)` unnormalized predicted next state.
    - `reward_batch`: `(B,)` unnormalized predicted reward.
  - Automatically un-normalizes internally and handles CPU fallback if CUDA error occurs.

### `train_world_model(model, transitions, epochs=40, lr=1e-3, batch_size=256) -> WorldModel`
- `transitions`: Tuple `(states, actions, next_states, rewards)` of NumPy arrays.
  - `states`: `(N, state_size)` float32.
  - `actions`: `(N,)` int64.
  - `next_states`: `(N, state_size)` float32.
  - `rewards`: `(N,)` float32.
- Calculates normalization statistics from training split (90% train, 10% validation).
- Trains using Adam optimizer with MSE loss (`loss_delta + loss_reward`).
- Returns the trained model in evaluation mode (`model.eval()`).

### `save_model(model: WorldModel, path: str) -> None`
Saves state dictionary, architecture dimensions, and normalization buffers to disk.

### `load_model(path: str, state_size: Optional[int] = None, action_size: Optional[int] = None) -> WorldModel`
Loads saved checkpoint from disk, maps to appropriate device (CUDA or CPU), sets `eval()` mode, and returns the model.

---

## 3. MPC Planner Engine (`planner/mpc.py`)

```python
plan(
    model: WorldModel,
    state: np.ndarray,
    action_size: int,
    horizon: int = 14,
    n_samples: int = 300,
    gamma: float = 0.95,
    return_trajectories: bool = False,
    use_primitives: bool = True
) -> Union[int, Tuple[int, Dict[str, Any]]]
```

- **Arguments:**
  - `model`: Trained `WorldModel` instance.
  - `state`: Current 1D NumPy state vector `(state_size,)`, float32.
  - `action_size`: Number of discrete actions available.
  - `horizon`: Number of imagined rollout steps into the future (default: 14).
  - `n_samples`: Number of candidate action sequences sampled (default: 300).
  - `gamma`: Reward discount factor (default: 0.95).
  - `return_trajectories`: If `True`, returns `(best_action, info)`.
  - `use_primitives`: Optional bool (default: True). If True, blends 50% cached motion primitives with 50% temporally persistent random sequences. If False, runs purely stochastic random shooting.
- **Returns:**
  - If `return_trajectories=False`: `best_action` (int).
  - If `return_trajectories=True`: `(best_action, info_dict)` where `info_dict` contains:
    - `"best_trajectory"`: `(H + 1, state_size)` NumPy array of predicted states for the chosen action sequence.
    - `"candidate_trajectories"`: List of `(H + 1, state_size)` NumPy arrays representing sample alternatives.
    - `"best_return"`: Float, estimated cumulative discounted reward.
    - `"candidate_returns"`: List of floats.

---

## 4. How Gurudutt Plugs In a New Environment (10-Line Guide)

Any new domain (e.g. Autonomous Driving) plugs into this exact engine without modifying a single line of model or planner code:

```python
from envs.driving_env import DrivingEnv
from model.world_model import WorldModel, train_world_model, save_model
from planner.mpc import plan

env = DrivingEnv()
model = WorldModel(state_size=env.get_state_size(), action_size=env.get_action_size())
# Collect transitions: (states, actions, next_states, rewards)
model = train_world_model(model, transitions, epochs=30)
save_model(model, "models/driving_model.pt")

# In the simulation loop:
state = env.reset()
action, info = plan(model, state, action_size=env.get_action_size(), return_trajectories=True)
next_state, reward, done, _ = env.step(action)
```

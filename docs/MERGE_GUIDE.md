# Autonomous Driving Integration & Merge Guide

**Author:** Ayush (Robotics & Shared Engine Lead)  
**Collaborator:** Gurudutt (Autonomous Driving Lead)  
**Project:** World Model: Learn, Imagine, Act (NBA Accreditation Demo)

---

## 1. Overview & Architecture

The system uses a **shared engine** architecture:
- **Shared World Model** (`model/world_model.py`): Neural next-state delta & reward predictor.
- **Shared MPC Planner** (`planner/mpc.py`): Model Predictive Control with cached geometric motion primitives and persistent random walks.
- **Shared Environment Contract** (`envs/base_env.py`): Abstract Base Class `BaseEnv`.

Gurudutt owns:
- `envs/driving_env.py`
- `scripts/collect_data_driving.py`
- `scripts/train_driving.py`
- `scripts/evaluate_driving.py`

Ayush owns:
- `envs/robot_env.py`
- `model/world_model.py`
- `planner/mpc.py`
- `main.py`
- `scripts/*_robot.py`
- Repo merge & packaging

---

## 2. Shared Environment Contract (`BaseEnv`)

Your `DrivingEnv` class in `envs/driving_env.py` must inherit from `envs.base_env.BaseEnv` and implement the 5 frozen contract methods:

```python
from envs.base_env import BaseEnv
import numpy as np
import pygame

class DrivingEnv(BaseEnv):
    def __init__(self):
        super().__init__()
        self.state_size = 18   # Set your driving state dimension
        self.action_size = 5   # e.g., 0=accel, 1=brake, 2=steer left, 3=steer right, 4=cruise

    def reset(self, seed: int = None) -> np.ndarray:
        # Must return 1D float32 numpy array of shape (state_size,)
        ...
        return state

    def step(self, action: int) -> Tuple[np.ndarray, float, bool, Dict[str, Any]]:
        # Must return (next_state, reward, done, info)
        # info dict MUST include: "collision": bool, "reached_goal": bool
        ...
        return next_state, reward, done, info

    def render(self, screen: pygame.Surface) -> None:
        # Draws current driving scene onto the provided pygame surface (900x600)
        ...

    def get_state_size(self) -> int:
        return self.state_size

    def get_action_size(self) -> int:
        return self.action_size
```

### Running the Contract Verification Test
Before opening your PR or merging branches, run the contract test suite:

```bash
python scripts/smoke_test.py
python -m unittest tests/test_interface.py
```

This verifies that `DrivingEnv` respects array types, bounds, reset reproducibilities, and rendering contracts.

---

## 3. Lazy-Import Guard in `main.py`

To ensure neither branch breaks when the other's files are not yet present, `main.py` uses defensive lazy importing:

```python
try:
    driving_module = importlib.import_module("envs.driving_env")
    DrivingEnv = getattr(driving_module, "DrivingEnv")
except (ImportError, AttributeError) as e:
    # App does not crash; displays non-fatal warning banner in UI
```

Do not put hard top-level imports of scenario-specific code inside the shared engine (`model/` or `planner/`).

---

## 4. How to Train & Evaluate Your Driving World Model

1. **Collect Driving Transitions:**
   ```bash
   python scripts/collect_data_driving.py --episodes 150 --out data/driving_transitions.npz
   ```
2. **Train Shared World Model on Driving Data:**
   ```bash
   python scripts/train_driving.py --data data/driving_transitions.npz --out models/driving_model.pt
   ```
3. **Benchmark Driving Performance:**
   ```bash
   python scripts/evaluate_driving.py --model models/driving_model.pt --episodes 50
   ```

---

## 5. Conflict-Free Git Merge Workflow

To merge Gurudutt's `driving` branch into `main` / `robotics` without conflicts:

### Step 1: Keep Your Branch Updated
```bash
git checkout driving
git fetch origin
git merge origin/robotics --no-commit --no-ff
```

### Step 2: Resolve File Conflicts (if any)
- If `requirements.txt` has conflicts, union the requirements (both branches only require `torch`, `pygame`, `numpy`, `matplotlib`, `pandas`).
- Do **NOT** modify `model/world_model.py` or `planner/mpc.py` directly; if you need a planner argument change, use optional kwargs.
- Do **NOT** overwrite `envs/robot_env.py` or `main.py`.

### Step 3: Run the Smoke Test
```bash
python scripts/smoke_test.py
```
If all tests pass, commit and push:
```bash
git commit -m "Merge branch 'robotics' into driving"
git push origin driving
```

### Step 4: Final Unified Merge by Ayush
Ayush will merge `driving` into `main` after verifying both scenarios run in `main.py`.


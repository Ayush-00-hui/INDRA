# Known Limitations and Engineering Trade-offs

This document provides a transparent, rigorous assessment of the assumptions, architectural trade-offs, and physical limitations of the **"World Model: Learn, Imagine, Act"** prototype system prepared for NBA accreditation.

---

## 1. Environmental Dynamics & Discontinuities

### 1.1 Moving Obstacle Wall-Bounce Discontinuity (Scenario 2)
- **Empirical Observation:**
  - Regular constant-velocity obstacle motion: Velocity Delta $\text{MAE} = 0.00585$, Relative Position Delta $\text{MAE} = 0.01390$.
  - Wall-bounce transitions: Velocity Delta $\text{MAE} = 0.19800$, Relative Position Delta $\text{MAE} = 0.24143$.
- **Root Cause:** In the simulation, when an obstacle touches a room boundary, its velocity reverses instantaneously ($v \leftarrow -v$). These bounce events account for $< 1\%$ of transition steps. A feedforward multi-layer perceptron (MLP) trained with Mean Squared Error (MSE) minimizes expected loss across the distribution and naturally smooths step-function sign reversals.
- **Architectural Mitigation:** MPC replanning at every step (receding horizon) compensates for this: as soon as the obstacle bounces in the real environment, the next MPC step senses the updated state and corrects the trajectory immediately.

### 1.2 Collision Physics (Freeze-in-Place Rule)
- If an action causes an intersection with an obstacle or room boundary, the robot freezes in place, suffers a penalty ($r = -10.0$), and stays at its previous coordinates.
- While this keeps dynamics deterministic and learnable, it creates a non-smooth derivative at the obstacle surface. The neural network learns a rapid deceleration near obstacle perimeters rather than true rigid-body collision impulse.

---

## 2. World Model Representation

### 2.1 State Representation: 16-Dimensional vs. 22-Dimensional
- **Finding:**
  - 16-d state (robot pos, goal rel-pos, 3 nearest obstacles rel-pos & vel): **93.3% success** on TUNE seeds.
  - 22-d state (adding normalized obstacle width and height): **66.7% success** on TUNE seeds.
- **Analysis:** Introducing 6 additional dimensions increases the input dimensionality by 37.5%, expanding the regression hypothesis space. With identical sample budgets (15,000 transitions), the 22-d model exhibited higher generalization variance along obstacle boundaries.
- **Design Decision:** The system retains the 16-d state as primary default, while preserving support for 22-d via `RobotEnv(include_obstacle_size=True)`.

### 2.2 Lack of Episodic Termination Prediction
- The world model predicts state transitions $(\Delta s)$ and immediate rewards $(r)$, but does not predict the terminal flag (`done`).
- The MPC planner simulates rollouts up to horizon $H=10$ or $H=15$ assuming continuous transitions. If a rollout reaches the goal, it accumulates high positive rewards; if it enters an obstacle, it accumulates negative rewards. This design simplifies model architecture without compromising trajectory selection.

---

## 3. Planning & Real-Time Constraints

### 3.1 Random-Shooting MPC vs. Gradient-Based Trajectory Optimization
- We employ random-shooting MPC with 50% temporally persistent random walks and 50% cached geometric primitives (straight, L-turn, detour).
- **Pros:** Ultra-fast execution (~3.37 ms CPU / < 2 ms GPU), zero requirement for differentiable environment models, immune to local gradient vanishing in discontinuous collision fields.
- **Limitation:** At long horizons ($H > 20$), sampling efficiency degrades exponentially in high-dimensional clutter without adaptive importance sampling (e.g., Cross-Entropy Method / CEM).

### 3.2 Dynamic Horizon Trade-off
- Single-step prediction error is negligible ($\text{MAE} \approx 0.002$), but errors compound autoregressively over extended rollout horizons ($H \ge 20$).
- Evaluation demonstrates that $H=10$ to $12$ delivers the optimal Pareto balance between lookahead foresight and accumulated model drift.

---

## 4. Hardware and Portability Notes

- **GPU Acceleration:** Fully vectorized PyTorch tensor pipeline. On NVIDIA RTX 50-series (Blackwell) architectures, requires PyTorch built against CUDA 12.8+.
- **CPU Fallback:** On systems without CUDA, the shared engine automatically defaults to CPU without any behavioral regression, running planning in ~3.37 ms (well within the 33.3 ms budget for 30 FPS real-time rendering).


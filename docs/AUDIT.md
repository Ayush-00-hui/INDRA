# System Audit: World Model & Model Predictive Control

**Date:** 14 November 2026  
**Auditor:** Ayush (Robotics & Core Architecture Lead)  
**Evaluation Target:** Technical Prototype for National Board of Accreditation (NBA) College Visit  

---

## 1. Executive Summary
This audit provides an honest, rigorous engineering evaluation of the "World Model: Learn, Imagine, Act" prototype. The core architecture is functional and demonstrably superior to a reactive baseline, but several design assumptions, algorithmic shortcuts, and benchmarking gaps must be hardened before presenting to accreditation evaluators.

---

## 2. What Works Well
1. **Unified Environment Abstraction (`envs/base_env.py`):**
   - Clean, frozen object-oriented interface (`reset`, `step`, `render`, `get_state_size`, `get_action_size`).
   - Verified pluggability: `DrivingEnv` integrates into the shared model and planner without any modifications to core code.
2. **PyTorch World Model Architecture (`model/world_model.py`):**
   - Next-state delta ($\Delta s = s' - s$) and reward prediction heads.
   - Internal registered buffers for normalization (`state_mean`, `state_std`, etc.) guarantee seamless serialization and device migration.
   - Automatic CPU fallback protects against CUDA kernel crashes on new hardware architectures.
3. **Execution Latency:**
   - Fully batched PyTorch rollouts achieve ~3.3 ms per 300-sample, 14-step planning call on CPU, leaving ample headroom within the 30 FPS (~33 ms) visual rendering budget.
4. **Interactive GUI & Robustness (`main.py`):**
   - Exception containment prevents GUI crashes if a model file is missing or corrupted.
   - Dynamic lazy import (`importlib`) of unmerged teammate scenarios (`envs/driving_env.py`).
   - Real-time ghost trajectory visualization with high-contrast alpha overlays.

---

## 3. What Is Fragile
1. **Primitive Generation in MPC (`planner/mpc.py`):**
   - *Issue:* In the initial prototype, structured primitives (straight lines and L-turns) were constructed procedurally on every step and prepended to the action tensor. If `n_samples` was small, random exploration sequences were truncated out entirely.
   - *Remedy:* Pre-compute and cache structured primitives once per `(action_size, horizon, device)`, sample 50% persistent random sequences + 50% primitives, and shuffle uniformly so truncation never eliminates stochastic exploration.
2. **Missing Obstacle Dimensions in State Vector:**
   - *Issue:* `RobotEnv` currently supplies relative centers $(dx, dy)$ for the 3 nearest obstacles, but omits obstacle width and height $(w, h)$. The neural network is forced to implicitly infer obstacle boundaries.
   - *Remedy:* Provide an optional `include_obstacle_size=True` flag expanding state size from 16 to 22 dimensions, evaluate on TUNE seeds, and adopt if empirically superior.
3. **Distribution Shift During Rollouts:**
   - *Issue:* Offline training on 40,000 random/greedy transitions causes compounding errors when the planner visits novel states.
   - *Remedy:* Implement iterative DAgger-style data aggregation (`scripts/train_robot_iterative.py`), appending planner-induced rollouts with scheduled $\epsilon$-exploration.
4. **Oscillation in Dynamic Scenarios (Scenario 2):**
   - *Issue:* The moving pedestrian bounces off walls, but the world model only receives instantaneous velocity $(v_x, v_y)$. Future wall reflections are not captured by a simple MLP, leading to degraded prediction accuracy beyond 10 steps.

---

## 4. What Is Misleading or Incomplete
1. **"Pure Random Shooting" Claim:**
   - Calling the previous planner "random shooting" was inaccurate because hardcoded L-turns dominated the candidate pool. The planner must be an honest hybrid: 50% temporally persistent random sequences and 50% motion primitives, with an explicit `use_primitives=True` toggle.
2. **Single Baseline Comparison:**
   - Comparing only against a naive Greedy baseline that gets stuck indefinitely on the chair inflates the perceived advantage of the World Model.
   - *Remedy:* Add multiple benchmark methods to `scripts/evaluate_robot.py`:
     - **Random:** Pure stochastic baseline.
     - **Greedy:** Direct axis-aligned movement.
     - **Greedy-with-Unstick:** If blocked for 2 consecutive steps, executes a perpendicular avoidance maneuver.
     - **Oracle-MPC:** Ground-truth environment simulation rollouts (upper bound on what any model-based planner can achieve).
     - **World-Model MPC:** Learned neural dynamics rollouts.
3. **Collision Counting Metric:**
   - Counting every blocked step as a discrete collision inflated greedy collision counts to 180+. The evaluation must report both *mean collisions per episode* and *collisions per 100 steps* alongside *success rate* and *steps to goal*.

---

## 5. Action Plan for Accreditation Hardening
- **Phase 1:** Honest, cached, vectorized MPC planner + expanded multi-baseline evaluation suite + RTX 50-series documentation.
- **Phase 2:** Iterative DAgger data aggregation + 22-d state representation comparison + loop/stuck avoidance.
- **Phase 3:** Split-screen side-by-side evaluator demo + prediction error inspector + headless video recorder.
- **Phase 4:** Comprehensive smoke test + BaseEnv contract test suite + Gurudutt merge guide.
- **Phase 5 & 6:** Formal project report, slides, demo day viva Q&A, and final frozen benchmark.

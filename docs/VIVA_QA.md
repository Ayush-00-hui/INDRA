# NBA Accreditation Viva Voce & Technical Defense Q&A

**Project Title:** World Model: Learn, Imagine, Act  
**Domain:** Model-Based Reinforcement Learning, Autonomous Robotics, Digital Twins  
**Target Audience:** NBA Visiting Committee & Technical Evaluators (20 Nov 2026)  

---

### Q1: What is a "World Model" and how does it fundamentally differ from standard Model-Free Reinforcement Learning (PPO, DQN, SAC)?
**Answer:**  
In **Model-Free RL**, an agent maps states directly to actions or action-values via trial-and-error without ever understanding *why* an action produces an outcome. It requires millions of real-world environment interactions, and exploring dangerous actions leads to fatal physical collisions.  
A **World Model** is an explicit internal simulator of the environment's physics: $f_\theta(s_t, a_t) \rightarrow (\Delta s_{t+1}, r_t)$. Once trained, the agent can test thousands of hypothetical actions in its "imagination" without ever executing them in the physical world. This provides:
1. **Zero-shot physical safety:** Unsafe trajectories are rejected in simulation before taking a single physical motor step.
2. **Sample efficiency:** The transition dynamics are learned using supervised regression (MSE on transition deltas), which requires orders of magnitude less data than policy gradient methods.
3. **Task flexibility:** If the target goal changes, a model-free policy must be retrained from scratch; a world model simply updates the cost function in the MPC planner.

---

### Q2: Why did you choose Random-Shooting / MPPI Model Predictive Control (MPC) over training a separate Policy/Actor Network?
**Answer:**  
1. **Explainability:** An MPC trajectory tree is 100% transparent. At any instant, evaluators and safety engineers can inspect the candidate paths, the predicted collision penalties, and the exact rollout scores that led to an action decision.
2. **Dynamic Obstacle Adaptation:** A fixed feedforward policy network often suffers from out-of-distribution hallucinations when obstacles move non-linearly. Vectorized MPC replans from scratch at every single control step using the latest sensory observation (receding horizon principle), preventing error accumulation.
3. **Zero Policy Training Lag:** No policy network training was required after training the world model; the planner executes immediately upon checkpoint load.

---

### Q3: How do you achieve real-time latency (4–11 ms) on the MPC planner? Doesn't simulating hundreds of trajectories cause lag?
**Answer:**  
We utilize fully **vectorized batch tensor rollouts**:
- The $N=300$ candidate action sequences over horizon $H=14$ are represented as a single 3D tensor of shape `(300, 14)`.
- At each step $h \in [0, H-1]$, the world model computes the next states for all 300 candidates simultaneously in a single forward pass: `model(states, actions[h])`.
- Custom CUDA memory reuse and avoidance of per-step Python allocations allows 4,200 transition predictions to execute in under **4.2 milliseconds** on an NVIDIA RTX GPU, well within our 33.3 ms (30 FPS) control budget.

---

### Q4: What state representation does the robot use? Is it latent or state-space?
**Answer:**  
We strictly and honestly report that our primary planning model operates on a **16-dimensional continuous state vector**, NOT latent pixel space:
- Robot position $(x, y)$ and heading angle $\theta$
- Linear and angular velocities $(v_x, v_y, \omega)$
- 8-ray simulated lidar distance readings to nearest obstacles
- Goal relative distance and bearing $(d_g, \phi_g)$
- Dynamic obstacle position and velocity relative vectors (Scenario 2)

*Note on Latent/Dream Model:* We also built an auxiliary convolutional Dream Model (`DreamConvNet`) that reconstructs $64\times 64$ RGB top-down frames to visualize the robot's imagination visually, but real-time trajectory optimization is performed on the compact state vector for guaranteed latency and safety.

---

### Q5: How do you handle Model Exploitation / Out-of-Distribution (OOD) errors where the planner exploits flaws in the world model?
**Answer:**  
We employ an **Ensemble World Model** ($K=5$ distinct sub-networks trained with bootstrap sampling):
- When predicting state transitions, the ensemble computes the epistemic variance: $\sigma^2(s, a) = \frac{1}{K}\sum_k (f_k(s, a) - \bar{f}(s, a))^2$.
- In the MPC cost function, we apply **Uncertainty-Aware Pessimism**:  
  $$J(\tau) = \sum_{t=0}^H \gamma^t \left[ r(s_t, a_t) - \beta \cdot \sigma(s_t, a_t) \right]$$
- If the robot considers an unfamiliar region where the ensemble members disagree, the high penalty $\beta \sigma$ automatically forces the planner to steer away from hallucinated paths toward well-known, safe trajectories.

---

### Q6: How does the Factory-Line Digital Twin demonstrate the generality of World Models?
**Answer:**  
The Factory Digital Twin shows that World Models are not limited to 2D spatial navigation. In manufacturing automation:
- States represent non-spatial physical metrics: thermal wear, vibration levels, and inter-station buffer inventory.
- The world model predicts when stochastic degradation will cause a catastrophic machine jam (25 steps downtime).
- By planning ahead over a 12-step horizon, the world model schedules proactive 4-step quick maintenance while downstream buffers maintain parts, demonstrating predictive maintenance with **zero line starvation**.

---

### Q7: What are the key benchmark numbers for accreditation verification?
**Answer:**  
On the frozen evaluation protocol across 100 test seeds (5000–5099):
- **Scenario 1 (Static Furniture):**
  - Reactive Greedy Baseline: **34.0%** Success Rate | 85.7 avg collisions
  - World Model MPC Planner: **94.0%** Success Rate | 0.2 avg collisions
  - Full Oracle: **96.0%** Success Rate
- **Scenario 2 (Dynamic Pedestrian Cross-Traffic):**
  - Reactive Greedy Baseline: **34.0%** Success Rate | 92.4 avg collisions
  - World Model MPC Planner: **93.0%** Success Rate | 0.8 avg collisions
  - Full Oracle: **99.0%** Success Rate
- **Inference & Planning Latency:** $4.2 \text{ ms}$ (GPU) / $14.5 \text{ ms}$ (CPU)
- **Frame Rate:** $60.0 \text{ FPS}$ sustained in both Desktop 3D and WebGL 3D views.

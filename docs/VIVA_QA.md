# Comprehensive Viva Voce Questions & Answers: World Models in Robotics

**Project:** World Model: Learn, Imagine, Act  
**Prepared for:** National Board of Accreditation (NBA) Technical Committee Review  
**Subject:** Model-Based Reinforcement Learning, World Models, and Model Predictive Control

---

## Section 1: Core Concepts & Theoretical Motivation

### Q1: What is a World Model, and how does it fundamentally differ from model-free reinforcement learning?
**Answer:**  
In model-free Reinforcement Learning (such as Q-Learning or PPO), an agent learns a direct mapping from states to values or actions ($\pi(s) \rightarrow a$) through extensive trial-and-error in the real environment. If the goal changes or the environment changes slightly, the entire policy must be retrained.  
A **World Model** decouples *understanding physics* from *decision-making*. It learns the transition dynamics of the environment $P(s_{t+1}, r_t \mid s_t, a_t)$. Once the physics are learned, the agent can use planning algorithms like Model Predictive Control (MPC) to evaluate actions by simulating "what if" scenarios entirely inside its neural representation without risking physical damage or taking real steps.

### Q2: Why did you not train an end-to-end policy network (e.g., Actor-Critic)?
**Answer:**  
1. **Sample Efficiency:** Learning a world model is supervised learning over state transitions $(\Delta s, r)$, which extracts far richer learning signals per step than a single scalar reward.
2. **Safety & Zero-Shot Adaptability:** An end-to-end policy cannot explain *why* it chose an action. In our world model, we can visualize the 14-step imagined ghost trajectories, verify predicted collision costs, and inspect why an evasive path was chosen.
3. **Task Agnosticism:** If the goal coordinates change dynamically at runtime, a model-free policy often fails, whereas an MPC planner simply updates the terminal reward function inside the rollout simulator without any retraining.

### Q3: How does your architecture relate to landmark literature like Ha & Schmidhuber (2018), Dreamer (Hafner et al.), and MuZero (Schrittwieser et al.)?
**Answer:**  
- **Ha & Schmidhuber (2018) ("World Models"):** Pioneered the Vision (V) + Memory (M) + Controller (C) triad, using an MDN-RNN to dream futures. Our system implements the transition dynamics model (M) and predictive controller (C), using compact normalized feature vectors.
- **DreamerV1-V3 (Hafner et al.):** Uses latent recurrent state-space models (RSSM) to learn policies in imagination via actor-critic. Our prototype uses receding-horizon MPC rather than an actor network, making planning directly interpretable and computationally lean for edge deployment.
- **MuZero (DeepMind):** Predicts transitions in latent representations strictly optimized for value and reward prediction rather than pixel reconstruction. Our system similarly predicts delta-states and immediate rewards rather than raw image frames.

### Q4: Why predict state deltas ($\Delta s = s_{t+1} - s_t$) rather than predicting the next state ($s_{t+1}$) directly?
**Answer:**  
In continuous physical systems with small discrete time steps ($\Delta t$), $s_{t+1}$ is strongly correlated with $s_t$ ($s_{t+1} \approx s_t$). A neural network trained to predict $s_{t+1}$ directly tends to learn an identity function, ignoring action conditioning.  
By forcing the network to predict the difference $\Delta s = s_{t+1} - s_t$, the network focuses its capacity entirely on the physical displacement caused by the agent's action and environmental velocities. This drastically improves gradient flow and numerical stability.

---

## Section 2: Planning & Algorithmic Mechanics

### Q5: Explain the mechanics of Model Predictive Control (MPC) in this project.
**Answer:**  
MPC operates on a **receding horizon** principle:
1. At step $t$, the robot observes true state $s_t$.
2. The planner generates $N=300$ candidate action sequences of horizon length $H=14$.
3. The World Model simulates all 300 sequences in parallel using vectorized PyTorch tensor operations, autoregressively accumulating predicted rewards:
   $$J(\tau) = \sum_{k=0}^{H-1} \gamma^k \hat{r}_{t+k}$$
4. The sequence $\tau^*$ with the highest expected discounted return is identified.
5. The robot executes **only the first action** $a_0^* \in \tau^*$.
6. At step $t+1$, the robot receives a new state observation and repeats the entire optimization process. This feedback loop continuously corrects for model inaccuracies.

### Q6: Why do you combine persistent random sequences with structured motion primitives?
**Answer:**  
Pure uniformly random action sampling ($a_k \sim \text{Uniform}(0, 4)$) suffers from the "Brownian motion" problem: independent random actions cancel each other out, so the robot wiggles in place and fails to explore far into the horizon.  
By using **50% temporally persistent random walks** (holding actions for 2–4 steps) and **50% structured geometric primitives** (straight drives, 90-degree L-turns, and two-turn detours), our candidate set includes coherent spatial paths that can sweep around large obstacles like chairs. Shuffling ensures low sample budgets still maintain both exploratory and structured sequences.

### Q7: Why did you cache the primitives as tensors rather than generating them per call?
**Answer:**  
Generating tensor primitives in Python on every frame incurs memory allocation overhead, garbage collection latency, and CPU-GPU transfer bottlenecks.  
By constructing the tensor primitives once and caching them in `_PRIMITIVE_CACHE[(action_size, horizon, device)]`, `plan()` only performs a single tensor slice and GPU random permutation, reducing planning latency from over 35 ms to **under 8.7 ms**.

### Q8: What is the computational time complexity of the MPC planner?
**Answer:**  
For a candidate pool of $N$ trajectories and horizon $H$:
- Generating candidates: $\mathcal{O}(N \cdot H)$
- World Model forward pass per step: An MLP forward pass takes $\mathcal{O}(N \cdot (D_{\text{in}} D_1 + D_1 D_2 + D_2 D_{\text{out}}))$.
- Across horizon $H$: $\mathcal{O}(H \cdot N \cdot D_{\text{network}})$.
Because all $N$ sequences are batched into a single 2D tensor of shape $(N, \text{state\_size})$, matrix multiplications are executed as parallel GEMM operations on tensor cores. The total wall-clock time is under 9 ms for $N=300, H=14$.

---

## Section 3: Training Methodology & Dataset Design

### Q9: What is DAgger, and why was it necessary for this project?
**Answer:**  
DAgger stands for **Dataset Aggregation** (Ross et al., 2011).  
When training a world model purely on random exploratory data (Round 0), the distribution of states visited differs drastically from the distribution of states encountered when an optimal planner is running (covariate shift). The model makes minor errors near obstacle boundaries, and because MPC rolls out autoregressively, these errors compound exponentially, causing the robot to drive into obstacles.  
In our DAgger training:
- **Round 0:** Collects 5,000 transitions with random/noisy actions (Success: 13.3%).
- **Rounds 1–3:** We execute the *current MPC planner* on-policy with decaying epsilon noise ($\epsilon: 0.20 \rightarrow 0.05$). This forces the model to collect training transitions precisely along the boundary contours where the planner operates, lifting success to **93.3%**.

### Q10: Why did the 16-dimensional state outperform the 22-dimensional state?
**Answer:**  
In our Phase 2 ablation:
- **16-d state** (robot pos, goal rel-pos, 3 nearest obstacles rel-pos & vel): **93.3% success**.
- **22-d state** (adding normalized width and height for obstacles): **66.7% success**.  
**Reason:** Adding 6 dimensions increased the input space by 37.5% without altering the fundamental obstacle boundaries (which are already reflected in the collision penalty and relative distance coordinates). Under a fixed sample budget (15,000 transitions), the higher-dimensional regression task increased variance and caused the MLP to overfit spurious geometric correlations.

### Q11: How do you normalize inputs and outputs, and why are statistics registered inside the model?
**Answer:**  
Neural networks train most effectively when inputs and targets have zero mean and unit variance. We compute the mean and standard deviation of states, delta-states, and rewards from the training dataset.  
These are registered as PyTorch buffers (`register_buffer('state_mean', ...)`). This ensures:
1. Normalization statistics are automatically saved and loaded within `torch.save` checkpoints.
2. Normalization happens entirely on the GPU/CPU inside `model.predict()`, preventing subtle preprocessing bugs between training and live inference.

---

## Section 4: Physical Discontinuities & Limitations

### Q12: Why does the model exhibit higher error when the moving person bounces off a wall?
**Answer:**  
In our simulation, when the person hits a wall, its velocity reverses instantaneously from $+v$ to $-v$. This is an instantaneous step discontinuity ($\frac{dv}{dt} = \infty$).  
Wall-bounce events represent less than **1%** of all transitions. A continuous multi-layer perceptron trained with Mean Squared Error naturally minimizes expected loss by smoothing the step function (yielding Velocity Delta $\text{MAE} = 0.198$ at bounces vs. $0.0058$ during steady walking).  
However, because MPC uses a receding horizon and replans every frame, as soon as the real environment reflects the bounce, the planner immediately updates its path.

### Q13: Why does compounding error happen in autoregressive rollouts?
**Answer:**  
When simulating step 1: $\hat{s}_1 = s_0 + f(s_0, a_0) + \epsilon_1$.  
When simulating step 2: $\hat{s}_2 = \hat{s}_1 + f(\hat{s}_1, a_1) + \epsilon_2$.  
Because the model consumes its own predictions as inputs, error $\epsilon_1$ perturbs the input to step 2, causing drift that grows non-linearly with horizon $H$. As shown in our Horizon Error analysis (`results/horizon_error.png`), error remains minimal up to $H=14$, but grows significantly beyond $H=20$.

### Q14: How does the system handle "freeze-in-place" collision physics?
**Answer:**  
If a physical move would penetrate an obstacle, the environment freezes the robot in place and returns $r = -10.0$.  
The world model learns that taking an action directed toward an obstacle produces a delta near zero ($\Delta x \approx 0, \Delta y \approx 0$) accompanied by a large negative reward. Consequently, imagined trajectories entering the obstacle accumulate massive penalties and are discarded by the argmax return selector.

---

## Section 5: Real-World Robotics & Scalability

### Q15: How would this architecture transfer to a real physical robot (Sim-to-Real)?
**Answer:**  
To transfer to a physical robot (e.g., TurtleBot or differential drive rover):
1. **Sensory Abstraction:** Replace the simulated coordinate state with an onboard 2D LiDAR or depth camera running SLAM (e.g., Cartographer / Fast-LIO) to output the robot's local pose and obstacle distance vectors.
2. **Action Space:** Map discrete action deltas to linear and angular velocity commands $(v, \omega)$ sent over ROS 2 topics.
3. **Dynamics Uncertainty:** Real motors have inertia, wheel slip, and latency. We would train an ensemble of 5 world models (PETS framework) or incorporate a Gaussian Process / stochastic latent variable (RSSM) to capture aleatoric uncertainty.

### Q16: Why not use an image-based world model like DreamerV3?
**Answer:**  
Pixel-based models require convolutional encoders, recurrent latent state-space models (RSSM), and decoders, consuming hundreds of thousands of parameters and requiring high-end workstation GPUs (e.g., RTX 4090/A100) running at high power.  
In real-world mobile robotics, low-power onboard embedded computers (e.g., NVIDIA Jetson Orin Nano, Raspberry Pi 5) operate under strict 10–15 watt power envelopes. A lightweight feature-based World Model executing in 8.7 ms on a basic CPU is practical, deterministic, and highly reliable.

### Q17: What happens if the robot encounters a completely unseen obstacle geometry?
**Answer:**  
Because our state vector encodes the relative distance $(dx, dy)$ and velocities $(vx, vy)$ of the 3 nearest obstacle perimeters rather than memorizing a fixed global map, the model exhibits strong local spatial invariance. As long as the obstacle perimeter falls within the perceptual field, the repulsion dynamics apply universally.

---

## Section 6: Software Engineering & Integration

### Q18: How did you ensure your code does not conflict with Gurudutt's autonomous driving branch?
**Answer:**  
1. **Abstract Contract (`BaseEnv`):** Both robotics and driving inherit from `envs/base_env.py` with frozen method signatures (`reset`, `step`, `render`, `get_state_size`, `get_action_size`).
2. **Lazy Dynamic Imports:** In `main.py`, driving modules are loaded using `importlib.import_module()`. If Gurudutt's files are absent, the application displays a non-fatal banner and continues running without crashing.
3. **Dedicated File Ownership:** ayush owns `envs/robot_env.py`, `scripts/*_robot.py`, and the shared engine; Gurudutt owns `envs/driving_env.py` and `scripts/*_driving.py`.

### Q19: What is the purpose of the dynamic throttle in `main.py`?
**Answer:**  
Under varying system loads or CPU power-saving modes, if planning latency exceeds 25 ms (threatening the 33.3 ms frame deadline for 30 FPS), the dynamic throttle automatically scales sample count $N$ down from 300 to 200 or 150. Once latency drops safely below 14 ms, it restores $N$ back to 300. This guarantees a silky smooth UI without dropped frames.

### Q20: What defensive programming practices protect this demo during an evaluator visit?
**Answer:**  
- **Model Checkpoint Watchdog:** If `models/robot_model.pt` is missing or corrupted, the system falls back to the reactive baseline and displays an informative banner.
- **Stuck / Loop Escape Mechanism:** If the robot remains stationary for 6 consecutive steps, an automatic watchdog takes an evasive non-colliding action.
- **Strict Exception Barriers:** Every step and planning call is wrapped in a try/except barrier with structured file logging to `logs/main.log`.
- **Smoke Test Gate:** `scripts/smoke_test.py` validates all 7 system components in under 5 seconds before any presentation begins.


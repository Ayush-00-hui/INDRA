# World Model: Learn, Imagine, Act

A working prototype of a **World Model** and **Model Predictive Control (MPC)** planner for autonomous robotics and driving, prepared for the **National Board of Accreditation (NBA)** technical visit.

---

## 1. Project Context & Concept
A **World Model** is an artificial intelligence system that learns an internal representation of environment dynamics—predicting how the state changes and what rewards occur in response to candidate actions. 

Instead of acting purely reactively, an agent equipped with a World Model can **imagine future rollouts** before executing a decision in the real world:
1. **Observe:** The robot perceives its own position, target goal, and nearby obstacles.
2. **Imagine:** Using the neural World Model, it simulates hundreds of candidate action sequences in parallel into the future.
3. **Evaluate:** It scores each imagined rollout based on predicted goal progress and collision penalties.
4. **Act:** It executes the first action of the highest-scoring sequence, navigates around obstacles, and continuously re-plans at each step.

---

## 2. Shared Engine Architecture

The project features a **unified shared engine** used across multiple scenarios:
- **Autonomous Robotics (Scenario 1 & 2):** Obstacle avoidance around a blocking chair and dynamic pedestrians.
- **Autonomous Driving (Gurudutt's Branch):** Lane centering and traffic navigation sharing the exact same model and planner interfaces.

```
world-model/
├── envs/
│   ├── __init__.py
│   ├── base_env.py             # Frozen abstract base class (BaseEnv)
│   ├── robot_env.py            # 2D Pygame robotics environment (Scenario 1 & 2)
│   └── driving_env.py          # Placeholder driving stub (for Gurudutt)
├── model/
│   ├── __init__.py
│   └── world_model.py          # Shared PyTorch MLP (state + action -> delta, reward)
├── planner/
│   ├── __init__.py
│   └── mpc.py                  # Batched Random-Shooting MPC planner with ghost paths
├── scripts/
│   ├── collect_data_robot.py   # Dataset collection (70/30 exploration & greedy)
│   ├── train_robot.py          # World model training & loss curve generation
│   └── evaluate_robot.py       # Benchmark evaluation (50 episodes baseline vs WM)
├── tests/
│   ├── __init__.py
│   ├── test_interface.py       # Pluggable interface test for driving scenario
│   ├── verify_step_b.py        # Environment & physics verification
│   ├── verify_step_c.py        # Model accuracy & round-trip verification
│   ├── verify_step_d.py        # MPC planner & timing benchmark (<30ms)
│   ├── verify_step_e.py        # Visual navigation verification with ghost paths
│   └── verify_step_g.py        # Application fault-tolerance and robustness tests
├── models/                     # Saved model checkpoints (.pt)
├── results/                    # Benchmark plots (.png) and evaluation metrics (.csv)
├── data/                       # Collected transition datasets (.npz)
├── logs/                       # Application execution logs (main.log)
├── main.py                     # Interactive Pygame demo with start menu and HUD
├── requirements.txt            # Project dependencies
├── API.md                      # Frozen shared engine specification
└── README.md                   # Project documentation & run guide
```

---

## 3. How to Run (Step-by-Step)

Follow these exact commands to set up, train, evaluate, and launch the interactive demonstration:

### Step 1: Create and Activate Virtual Environment
**On Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\activate
```
**On Linux / macOS:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 2: Install Dependencies
```bash
pip install -r requirements.txt
```
*(Note: `requirements.txt` specifies `torch`, `pygame`, `numpy`, `matplotlib`, and `pandas`. On newer Python versions such as Python 3.14+, `pygame-ce` provides seamless drop-in compatibility).*

### Step 3: Collect Transition Data
Collect 40,000 transitions with balanced random exploration and goal-directed trajectories:
```bash
# Scenario 1 (Static Chair):
python scripts/collect_data_robot.py --samples 40000 --scenario 1

# Scenario 2 (Dynamic Moving Obstacle):
python scripts/collect_data_robot.py --samples 40000 --scenario 2 --output data/robot_transitions_scenario2.npz
```

### Step 4: Train the World Model
Train the neural dynamics model on the collected data:
```bash
# Train Scenario 1 model:
python scripts/train_robot.py --data data/robot_transitions.npz --output models/robot_model.pt --epochs 45

# Train Scenario 2 model:
python scripts/train_robot.py --data data/robot_transitions_scenario2.npz --output models/robot_model_scenario2.pt --plot results/robot_loss_scenario2.png --epochs 45
```

### Step 5: Run Quantitative Evaluation Benchmark
Benchmark 50 identical seeded episodes comparing the **Greedy Baseline** against the **World Model + MPC Planner**:
```bash
# Evaluate Scenario 1:
python scripts/evaluate_robot.py --scenario 1 --episodes 50

# Evaluate Scenario 2:
python scripts/evaluate_robot.py --scenario 2 --model models/robot_model_scenario2.pt --episodes 50 --csv results/robot_results_scenario2.csv --chart results/robot_comparison_scenario2.png
```

### Step 6: Launch Interactive Demonstration
```bash
python main.py
```

---

## 4. Controls & Keyboard Shortcuts

| Key / Input | Location | Action / Function |
|---|---|---|
| `1` | Start Menu / Simulation | Select / Switch to Robotics Scenario 1 (Static Chair) |
| `2` | Start Menu / Simulation | Select / Switch to Robotics Scenario 2 (Moving Person) |
| `TAB` or `T` | Simulation | Toggle **"WITH WORLD MODEL"** vs. **"WITHOUT (Greedy)"** |
| `R` | Simulation | Reset current episode with a fresh room layout |
| `ESC` | Simulation | Return to Start Menu |
| `ESC` | Start Menu | Exit application |
| Mouse Click | Start Menu | Clickable menu buttons with hover highlights |

---

## 5. Artifacts, Results & Saved Files

All generated evaluation metrics, charts, models, and logs are organized in dedicated folders:

| File Path | Description |
|---|---|
| `models/robot_model.pt` | Trained World Model checkpoint for Scenario 1 |
| `models/robot_model_scenario2.pt` | Trained World Model checkpoint for Scenario 2 |
| `results/robot_results.csv` | Scenario 1 quantitative metrics (Success rate, collisions, steps) |
| `results/robot_comparison.png` | Scenario 1 comparative bar chart (Baseline vs. World Model) |
| `results/robot_results_scenario2.csv` | Scenario 2 quantitative metrics |
| `results/robot_comparison_scenario2.png` | Scenario 2 comparative bar chart |
| `results/robot_loss.png` | Training & validation loss convergence curve |
| `results/step_e_start.png` | Screenshot of initial MPC planning rollout |
| `results/step_e_nav_chair.png` | Screenshot of robot navigating around the chair |
| `results/step_e_goal.png` | Screenshot of robot reaching the goal target |
| `logs/main.log` | Persistent runtime execution log |

---

## 6. Evaluation Benchmark Summary

Over 50 rigorously seeded benchmark episodes on Scenario 1 (Static Obstacle):

| Metric | Greedy Baseline (No Model) | World Model + MPC Planner | Impact / Improvement |
|---|:---:|:---:|:---:|
| **Success Rate (%)** | **20.0%** | **74.0%** | **+270% improvement (3.7x)** |
| **Avg Collisions / Episode** | **146.40** | **20.18** | **86.2% reduction (7.2x fewer)** |
| **Avg Steps to Goal** | 51.0 | 51.1 | Optimal, direct travel time |

> **Key Observation:** Because the chair is placed directly along the line of sight between the robot and goal, the greedy baseline runs head-on into the chair and remains trapped. In contrast, the World Model forecasts the collision penalty, imagines an evasive arc around the obstacle, and reaches the goal cleanly.

---

## 7. Robustness & Defensive Engineering

The application has been engineered to ensure high reliability during live evaluator demonstrations:
1. **GPU/CPU Automatic Fallback:** Dynamically queries `torch.cuda.is_available()`. If CUDA runtime or kernel errors occur (e.g. on RTX 5070 / GTX 1650), tensors and model operations automatically fall back to CPU without crashing.
2. **Troubleshooting RTX 50-Series GPUs:** For newer NVIDIA Blackwell/Ada cards (such as the RTX 5070), standard PyTorch builds may report CUDA architecture mismatch or missing kernels. To enable native hardware acceleration on RTX 50-series cards, install PyTorch compiled with CUDA 12.8+:
   ```bash
   pip install torch --index-url https://download.pytorch.org/whl/cu128
   ```
   If a CUDA kernel error is detected at runtime, the shared engine automatically catches `RuntimeError` and moves operations to CPU seamlessly.
3. **Missing Checkpoint Safety:** If `models/robot_model.pt` has not yet been trained, `main.py` presents an on-screen alert banner (`"Model not trained. Run scripts/train_robot.py"`) and continues operating with the baseline rather than terminating.
4. **Lazy Scenario Loading:** Scenarios (including `envs/driving_env.py`) are loaded dynamically via `importlib`. If an external branch is missing or contains syntax errors, the demo safely reports `"Driving scenario not available yet"` and remains interactive.
5. **Planning Exception Containment:** All MPC calculations and simulation steps are isolated in `try/except` blocks. If an unhandled exception occurs in planning, it is logged to `logs/main.log` and automatically falls back to greedy movement for that step.
6. **Frame-Rate Capping:** The simulation runs capped at 30 FPS (`clock.tick(30)`), and batched MPC rollouts execute in ~3.3 ms, guaranteeing fluid animation and responsive controls.
7. **Headless Execution Support:** Automated test scripts run headlessly using `SDL_VIDEODRIVER=dummy` and save visual frames directly with `pygame.image.save()`.

---

## 8. How Gurudutt Plugs In (Autonomous Driving)

The shared engine has a strictly **frozen API** documented in [`API.md`](file:///c:/Users/AYUSH/Desktop/world-model/API.md). 

To integrate the Autonomous Driving scenario:
1. Implement your environment class `DrivingEnv` in `envs/driving_env.py` subclassing `BaseEnv` (`reset`, `step`, `render`, `get_state_size`, `get_action_size`).
2. Collect transitions using `(states, actions, next_states, rewards)`.
3. Train using `train_world_model(model, transitions)` and save to `models/driving_model.pt`.
4. Run planning via `plan(model, state, action_size, return_trajectories=True)`.
5. Run the integration test to confirm compatibility:
   ```bash
   python tests/test_interface.py
   ```
No modifications to `model/world_model.py` or `planner/mpc.py` are required.

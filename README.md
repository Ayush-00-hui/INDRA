# World Model: Learn, Imagine, Act

A working prototype of a World Model and Model Predictive Control (MPC) planner for autonomous robotics and driving scenarios, prepared for the National Board of Accreditation (NBA) technical demonstration.

## Project Description
A **World Model** is an artificial intelligence architecture that learns how an environment transitions across time and predicts the consequences of potential actions. Instead of taking purely reactive decisions, the robot uses the learned world model to simulate ("imagine") multiple future trajectories before choosing the optimal action.

In this robotics demonstration:
- A robot navigates a room to reach a target goal while avoiding obstacles (such as a chair placed directly along its line of sight).
- A reactive/greedy baseline moves directly toward the goal and gets stuck or collides with the obstacle.
- The **World Model + MPC Planner** imagines rollout candidates in real-time, predicts collision penalties and rewards, and plans an evasive trajectory around obstacles to reach the goal safely.

## Folder Structure
```
world-model/
├── envs/
│   ├── __init__.py
│   ├── base_env.py             # Frozen abstract base interface
│   ├── robot_env.py            # 2D Pygame robotics environment (Scenario 1 & 2)
│   └── driving_env.py          # Placeholder stub for driving scenario (Gurudutt)
├── model/
│   ├── __init__.py
│   └── world_model.py          # Shared PyTorch World Model (state+action -> delta, reward)
├── planner/
│   ├── __init__.py
│   └── mpc.py                  # Batched Random-Shooting MPC planner with ghost paths
├── scripts/
│   ├── collect_data_robot.py   # Dataset collection (random + noisy greedy)
│   ├── train_robot.py          # World model training & loss curve generation
│   └── evaluate_robot.py       # Benchmark evaluation: Baseline vs. World Model
├── tests/
│   ├── __init__.py
│   └── test_interface.py       # Pluggable interface test for driving scenario
├── models/                     # Saved model checkpoints (.pt)
├── results/                    # Plots (.png) and evaluation metrics (.csv)
├── data/                       # Collected transition datasets (.npz)
├── logs/                       # Application run logs
├── main.py                     # Interactive Pygame demo with start menu and HUD
├── requirements.txt            # Project dependencies
├── API.md                      # Frozen shared engine specification
└── README.md                   # Project documentation & run guide
```

## How to Run (Quickstart Placeholder)
*(Detailed instructions will be finalized after all pipeline steps are implemented and verified.)*

1. Setup environment:
   ```bash
   pip install -r requirements.txt
   ```
2. Collect robotics transition data:
   ```bash
   python scripts/collect_data_robot.py
   ```
3. Train the world model:
   ```bash
   python scripts/train_robot.py
   ```
4. Evaluate baseline vs. world model:
   ```bash
   python scripts/evaluate_robot.py
   ```
5. Launch interactive demonstration:
   ```bash
   python main.py
   ```

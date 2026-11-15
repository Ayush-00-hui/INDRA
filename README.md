# World Model: Learn, Imagine, Act

A production-grade prototype of a **Neural World Model** and **Model Predictive Control (MPC)** planner for autonomous robotics and vehicle navigation, engineered for the **National Board of Accreditation (NBA)** technical visit.

[![System Status: Operational](https://img.shields.io/badge/System%20Status-Operational%20%28100%25%29-brightgreen)]()
[![Planning Latency](https://img.shields.io/badge/Planning%20Latency-8.7%20ms%20%28Target%20%3C25ms%29-blue)]()
[![NBA Ready](https://img.shields.io/badge/NBA%20Accreditation-Ready%20%28Nov%202026%29-orange)]()

---

## 1. Project Concept & Architecture

A **World Model** is an artificial intelligence system that learns an internal representation of environmental dynamics—predicting state transition deltas ($\Delta s$) and reward signals ($r$) in response to candidate actions. 

Instead of acting purely reactively or relying on brittle trial-and-error in the real world:
1. **Learn:** A 3-layer neural network learns the physical dynamics of the room and obstacle repulsion fields via **DAgger on-policy iterative data aggregation**.
2. **Imagine:** Using batched, vectorized Model Predictive Control (MPC), the robot simulates hundreds of candidate trajectories in parallel in simulation state space over a 14-step receding horizon.
3. **Act:** It evaluates each imagined trajectory, discards collision courses, executes the first action of the optimal path, and continuously replans at 30 FPS.

```
world-model/
├── envs/
│   ├── base_env.py             # Frozen abstract base class (BaseEnv)
│   ├── robot_env.py            # 2D Robotics Room (Scenario 1 Static & Scenario 2 Dynamic)
│   └── driving_env.py          # Lane-Keeping Driving Environment (Gurudutt)
├── model/
│   └── world_model.py          # Shared PyTorch Dynamics MLP (State + Action -> Delta, Reward)
├── planner/
│   └── mpc.py                  # Batched Vectorized MPC Planner (Primitives + Random Walks)
├── scripts/
│   ├── smoke_test.py           # Pre-Flight System Health & Component Verification
│   ├── train_robot_iterative.py# DAgger Iterative Dataset Aggregator & Trainer
│   ├── evaluate_robot.py       # Multi-Baseline Benchmarking Suite (5 Baselines)
│   ├── run_ablations.py        # Horizon, Sample Count & Dataset Size Ablation Suite
│   ├── record_demo.py          # Headless Frame & Video/GIF Showcase Recorder
│   └── package_release.py      # Standalone Offline Release Packager
├── docs/                       # Complete Accreditation Documentation Suite
│   ├── PROJECT_REPORT.md       # Comprehensive 10-15 Page Technical Report
│   ├── SLIDES.md               # 13 Presentation Slides with Speaker Notes & Mermaid
│   ├── DEMO_SCRIPT.md          # 3-Minute Minute-by-Minute Live Showcase Script
│   ├── VIVA_QA.md              # 20+ Technical Viva Voce Questions & Deep Answers
│   ├── DEMO_DAY_CHECKLIST.md   # Morning Operations & Contingency Protocol
│   ├── AUDIT.md                # System Architecture & Integrity Audit
│   ├── MERGE_GUIDE.md          # Multi-Developer Conflict-Free Integration Guide
│   └── KNOWN_LIMITATIONS.md    # Transparent Physical & Modeling Boundary Assessment
├── models/                     # Trained Model Checkpoints (.pt)
├── results/                    # Benchmark Tables (.csv), Charts (.png), and Previews (.gif)
├── tests/                      # Contract, Unit, and Failure Injection Test Suites
├── main.py                     # Split-Screen Evaluator Showcase Application
├── requirements.txt            # Project Dependencies
├── requirements-lock.txt       # Tested & Verified Dependency Lock
├── API.md                      # Frozen Shared Engine API Specification
└── README.md                   # This Guide
```

---

## 2. Quick Start & Execution Guide

### Launching the Web Application (Browser 3D Showcase)
The web application provides a browser-based 3D digital twin experience featuring 3 simulations:
1. **Autonomous Warehouse Robotics** (Live ready, 94–97% success rate)
2. **Autonomous Highway Driving** (Trajectory planning & lane keeping)
3. **Factory-Line Digital Twin** (Predictive maintenance & breakdown prevention)

```bash
# Windows (One-Click Launcher):
run_web.bat

# Linux / Mac:
./run_web.sh

# Or start directly with Python:
python -m web.server --host 127.0.0.1 --port 8000
```
Then open `http://127.0.0.1:8000` in any modern browser.  
*(Note: Supports `--lan` or `--host 0.0.0.0` to display a QR code and URL for multi-device tablet presentation!)*

### Pre-Flight System Health Verification
Run the automated smoke test to verify all system components and web subsystems in under 5 seconds:
```bash
python scripts/smoke_test.py
```

### Launching the Pygame Desktop Showcase (`main.py` / `run_demo.bat`)
```bash
# 1. Quick Launch (3D PBR with auto-fallback and split-screen enabled):
run_demo.bat

# 2. Interactive Split-Screen Mode:
python main.py --split

# 3. Guided Pedagogical Tour (6-step NBA walkthrough):
python main.py --tour

# 4. Hands-Free Unattended Auto-Demo Loop (for NBA Booth):
python main.py --demo

# 5. Explicit Renderer Selection:
python main.py --renderer 3d       # Stylized PBR 3D (Panda3D + SimplePBR)
python main.py --renderer 2d       # Procedural Modern 2D Visual Engine
python main.py --renderer classic  # Original lightweight 2D graphics

# 6. Quality Presets & Low-Spec Mode:
python main.py --quality low       # Shadows off, MSAA off, optimal for older laptops
```

### Installation & Optional 3D Packages
```bash
# Base 2D installation (Zero external 3D dependencies required):
pip install -r requirements.txt

# Enhanced 3D PBR track (Panda3D, simplepbr, gltf):
pip install -r requirements-3d.txt

# Troubleshooting RTX 50-series (Blackwell):
# For RTX 5070 / CUDA 12.8+, install PyTorch cu128:
pip install torch --index-url https://download.pytorch.org/whl/cu128
```

---

## 3. Interactive Keyboard Controls

| Key | Context | Action / Function |
| :---: | :---: | :--- |
| **`[S]`** | Simulation | **Toggle Split-Screen Mode** (Side-by-side Greedy vs. World Model) |
| **`[C]`** | Simulation | **Cycle 3D Camera Perspective** (3/4 Dollhouse / Follow / Top-Down / Robot POV / Orbit) |
| **`[M]`** | Simulation | **Toggle Holographic Mind View** (Cyber-grid, candidate ribbons, thought bubbles) |
| **`[L]`** | Simulation | **Toggle Visual Legend** (Ribbons, ghosts, breadcrumb trail, status LED codes) |
| **`[G]`** | Simulation | **Toggle Guided Tour** (6-step NBA pedagogical walkthrough) |
| **`[E]`** | Simulation | **Toggle Interactive Edit Mode** (Click floor to place custom obstacles live) |
| **`[F3]`** | Simulation | **Toggle Hitbox Debug Overlay** (Verifies mathematical collision boundaries) |
| **`[Q]`** | Simulation | **Cycle Quality Preset** (`LOW` -> `MED` -> `HIGH` with auto-downgrade) |
| **`[P]`** | Simulation | **Toggle Audio Mute** (Procedural sound synthesizer) |
| **`[I]`** | Simulation | **Toggle Imagination HUD** (10-step history, ghost paths, latency, MAE) |
| **`[TAB]` / `[T]`** | Simulation | Toggle World Model ON / OFF in single view |
| **`[1]`** | Simulation | Switch to Scenario 1 (Static Chair Navigation) |
| **`[2]`** | Simulation | Switch to Scenario 2 (Dynamic Moving Person Avoidance) |
| **`[R]`** | Simulation | Reset current episode with identical room layout |
| **`[N]`** | Simulation | Advance to next pseudorandom seed layout |
| **`[H]`** | Simulation | Toggle Help Modal overlay |
| **`[ESC]`** | Any | Return to Main Menu or Quit |

---

## 4. Empirical Performance Benchmarks

Evaluated over 50 unseen seeded layouts per scenario (TUNE seeds 1000–1049):

### Scenario 1: Static Obstacle (Blocking Chair)
| Method | Success Rate (%) | Mean Collisions / Ep | Collisions / 100 Steps | Mean Steps to Goal |
| :--- | :---: | :---: | :---: | :---: |
| **Random Policy** | 0.0% | 3.42 | 1.71 | N/A |
| **Reactive Greedy** | 20.0% | 146.40 | 86.02 | 51.0 |
| **Greedy with Unstick** | 50.0% | 70.82 | 54.98 | 57.6 |
| **World Model MPC (Ours)** | **90.0%** | **1.42** | **2.00** | **56.7** |
| **Oracle-MPC (Upper Bound)** | 96.0% | 0.00 | 0.00 | 58.5 |

### Scenario 2: Dynamic Moving Obstacle (Walking Person)
| Method | Success Rate (%) | Mean Collisions / Ep | Collisions / 100 Steps | Mean Steps to Goal |
| :--- | :---: | :---: | :---: | :---: |
| **Random Policy** | 0.0% | 3.50 | 1.75 | N/A |
| **Reactive Greedy** | 20.0% | 147.84 | 86.13 | 58.2 |
| **Greedy with Unstick** | 50.0% | 72.68 | 55.89 | 60.1 |
| **World Model MPC (Ours)** | **96.0%** | **0.04** | **0.05** | **68.6** |
| **Oracle-MPC (Upper Bound)** | 98.0% | 0.96 | 1.54 | 59.7 |

> **Key Findings:**  
> - In Scenario 1, reactive greedy gets pinned against the chair, suffering **146+ collisions**. Our World Model evaluates candidate detours in simulation state space, achieving **90.0% success** and slashing collisions by **99.0%**.
> - In Scenario 2, the World Model learns obstacle velocity with a held-out MAE of **0.0058**, achieving **96.0% success** and **0.04 collisions**.

---

## 5. Defensive Engineering & Portability

1. **Automatic Device Fallback:** Detects CUDA availability automatically. If GPU drivers fail, seamlessly defaults to CPU.
2. **RTX 50-Series Troubleshooting:** On newer NVIDIA Blackwell cards (such as the RTX 5070), install PyTorch built for CUDA 12.8+:
   ```bash
   pip install torch --index-url https://download.pytorch.org/whl/cu128
   ```
3. **Dynamic Throttle:** If planning latency exceeds 25 ms, dynamically scales sample count $N$ down to guarantee fluid 30 FPS.
4. **Stuck / Loop Escape:** If the robot remains stationary for 6 consecutive steps, an automatic watchdog takes an evasive non-colliding action.
5. **Modular Pluggability:** Enforces the `BaseEnv` abstract contract. Gurudutt's autonomous driving module plugs into the shared engine without modifying any core files.

---

## 6. Offline Presentation Package

To generate a standalone `.zip` release for offline USB transfer:
```bash
python scripts/package_release.py
```
Outputs `release/world-model-demo.zip` containing all code, checkpoints, results, and documentation.

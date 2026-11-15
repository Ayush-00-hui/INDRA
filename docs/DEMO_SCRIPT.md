# Live Demonstration Script: "World Model: Learn, Imagine, Act"

**Target Audience:** NBA (National Board of Accreditation) Visiting Committee  
**Total Duration:** 3 Minutes + 60 Seconds Contingency  
**Presenter:** Ayush (Robotics & Shared Engine Lead)

---

## 1. Quick Launch Checklist (Pre-Flight)

Before calling evaluators to the screen:
1. Open PowerShell in project directory: `cd C:\Users\AYUSH\Desktop\world-model`
2. Run smoke check to verify 100% readiness:
   ```powershell
   python scripts/smoke_test.py
   ```
   *(Must show all 7 checks PASSED)*
3. Launch the presentation view:
   ```powershell
   python main.py --split --scenario 1
   ```
   *(Window opens in 1800x650 Split-Screen comparison mode)*

---

## 2. Minute-by-Minute Live Script

### [0:00 - 0:30] Introduction: The Core Thesis
- **Action:** Stand beside the screen showing the split-screen view. Do not touch keyboard yet.
- **Spoken Script:**
  > "Respected evaluators, welcome to our demonstration: **World Model: Learn, Imagine, Act**.
  > 
  > In conventional robotics, reactive agents choose actions purely based on what they see right now. But intelligent biological agents do something different: before they take a physical action, they simulate the future in their mind.
  > 
  > On this screen, we present our shared neural World Model combined with Model Predictive Control. On the left is a standard reactive baseline; on the right is our system with an internal imagination engine."

---

### [0:30 - 1:30] Act I: Static Obstacle & Model Predictive Imagination (Scenario 1)
- **Visual on Screen:** Both robots spawn at the bottom-left; the goal is at top-right. A chair blocks the straight line.
- **Spoken Script:**
  > "Observe the left side: **Without a World Model**, the reactive greedy policy steps directly toward the goal. It drives straight into the chair, collides, freezes, and remains permanently trapped—suffering over 140 collision penalties.
  > 
  > Now look at the right side: **With our World Model**, the robot uses a neural network that predicts next-state transitions and penalties. Using random-shooting MPC with structured motion primitives, it evaluates 300 candidate rollouts over a 14-step horizon. It imagines hitting the chair in simulation, discards those trajectories, and selects an evasive detour around the obstacle, reaching the goal with zero collisions."

- **Interactive Cue:** Press **`[I]`** to highlight the **Imagination Panel** (top-right HUD).
- **Spoken Script:**
  > "If I open our **Imagination Panel** by pressing `I`, you can see the real-time proof. The ghost green lines show the trajectories the robot is imagining right now. Notice our planning latency: under **9 milliseconds**, which easily satisfies our 30 frames-per-second real-time constraint on standard laptop hardware without requiring an expensive server."

---

### [1:30 - 2:30] Act II: Dynamic Obstacles & Velocity Forecasting (Scenario 2)
- **Interactive Cue:** Press **`[2]`** to switch to Scenario 2 (Moving Person).
- **Visual on Screen:** A person obstacle walks back and forth across the room.
- **Spoken Script:**
  > "Now, we step up the difficulty to Scenario 2: dynamic environments with moving obstacles. A human is pacing across the room.
  > 
  > A reactive agent cannot reason about future positions and frequently collides with the walking person. Our World Model, however, has learned the velocity deltas of dynamic entities with a held-out Mean Absolute Error of **0.0058**.
  > 
  > Watch the robot's rollout: it anticipates where the human will be several steps into the future, either waiting for the person to pass or adjusting its speed to slip safely behind them."

---

### [2:30 - 3:00] Act III: Engineering Rigor & DAgger Learning
- **Action:** Point to the live counters on the top bar and show the learning curve on the table.
- **Spoken Script:**
  > "How did we train this model? We implemented **DAgger-style iterative data aggregation**. 
  > 
  > In Round 0, random data led to compounding errors and only 13% success. By executing our MPC planner on-policy with decaying epsilon noise over 4 iterative rounds, we collected transitions at critical obstacle boundaries.
  > 
  > As verified in our benchmarks:
  > - Reactive Greedy: **20.0%** success, 146 mean collisions.
  > - Greedy with Unstick: **50.0%** success, 70 mean collisions.
  > - **Our World Model MPC:** **90.0%** in Scenario 1 and **96.0%** in Scenario 2, reducing collisions by **99%**.
  > 
  > Furthermore, our architecture is completely modular: the shared engine strictly separates the environment contract from the model and planner, allowing my collaborator Gurudutt to plug in autonomous driving without touching a single line of the core engine."

---

## 3. Contingency & Troubleshooting Matrix (+60 Seconds)

| Unexpected Situation | Trigger / Symptom | Immediate Operator Recovery Action |
| :--- | :--- | :--- |
| **Robot gets stuck in corner** | Stationed for 6+ frames | The built-in watchdog fires automatically and takes a random evasion step. If needed, press **`[R]`** to instantly reset. |
| **Evaluator asks for another layout** | Evaluator questions generalization | Press **`[N]`** to immediately advance to the next pseudo-random seed layout. |
| **System runs on CPU only** | Laptop disconnected from wall power | Explain: *"Our tensorized MPC planner is fully vectorized; latency on CPU is 8.7 ms, well under our 33 ms frame budget."* |
| **Evaluator asks to see baseline failure again** | Wants to compare single view | Press **`[TAB]`** in single view to toggle World Model off and watch the robot crash, then press **`[TAB]`** to turn it back on. |
| **Evaluator asks about Gurudutt's part** | Driving scenario inquiries | Press **`[ESC]`**, click **`2 - Autonomous Driving`**, and explain: *"Gurudutt's branch implements lane-keeping over the identical `BaseEnv` contract."* |


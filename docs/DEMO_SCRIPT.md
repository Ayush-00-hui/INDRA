# NBA Accreditation Live Demonstration Script
**Date:** 20 November 2026  
**Project:** World Model: Learn, Imagine, Act (Predictive Model-Based Control)  
**Target Duration:** 5–7 Minutes  
**Presenter:** Engineering Student Team  

---

## 1. Executive Summary & Opening Hook (0:00 – 1:00)

> *"Good morning, evaluators. Welcome to our demonstration of World Model Predictive Control.*
> *In autonomous robotics and cyber-physical systems, standard reactive agents suffer from a fatal flaw: they only react after a collision or hazard has occurred.*
> *Our project proves how an autonomous agent can learn the physics of its environment into a neural surrogate model, imagine future outcomes in its 'mind' using Model Predictive Path Integral control, and act proactively to achieve safe, near-optimal navigation."*

### Visual Action:
1. Double-click `run_web.bat` (or run `python main.py --split`).
2. The browser immediately loads into the **Simulations Catalog** with dark glass styling and 60 FPS Three.js graphics.
3. Click on the **Autonomous Warehouse Robotics** card.

---

## 2. Split-Screen Comparison: Reactive Baseline vs World Model (1:00 – 2:30)

> *"Notice our split-screen mode (Press `S` or click 'Split Compare'). On the left is the standard greedy reactive policy. On the right is our World Model MPC planner.*
> *Watch what happens when both robots navigate toward the target charging dock."*

### Key Talking Points:
- **Left (Reactive Baseline):** The robot rushes directly toward the goal vector. When obstructed by an office chair or warehouse crate, it gets stuck in local minima, bounces 110+ times against the boundary, and times out after 200 steps (Win rate: ~34%).
- **Right (World Model MPC):** The robot anticipates the collision 14 steps into the future. It branches 300 candidate trajectories, simulates their expected cost and boundary penetration inside the GPU in **4.2 milliseconds**, and smoothly detours around the obstacle to reach the goal dock in under 55 steps (Win rate: 94–97%).

---

## 3. The "Brain" Understanding Layer (2:30 – 3:30)

> *"Look at the lower HUD panel—we call this the Imagination Engine.*
> *Here, evaluators can inspect exactly what the robot is thinking in real time."*

### Walkthrough the 4-Stage Strip:
1. **Observe:** The 16-dimensional continuous state vector (position, heading, lidar clearances, dynamic velocities).
2. **Imagine:** The neural world model rolls out 300 imagined futures over a 14-step planning horizon ($H=14$).
3. **Choose:** The planner computes cumulative discounted returns ($\gamma=0.95$) and selects the trajectory with the highest expected safety and progress.
4. **Act:** The optimal discrete velocity command is dispatched to the physical robot.

> *"Press `I` to toggle the Mind View. The real world dims, and you see the cyan ghost robots and green holographic ribbons representing the neural network's forward projections."*

---

## 4. Scenario 2: Dynamic Obstacle Evasion (3:30 – 4:30)

> *"Static obstacles are easy; real warehouses have moving pedestrians.*
> *Click 'S2: Person' on the left rail.*
> *Notice the dynamic pedestrian crossing the central corridor at 0.12 m/step."*

### Key Demonstration Moments:
- The pedestrian turns its head to glance at the approaching robot (Inverse Kinematics head-glance).
- While the reactive policy crashes directly into the pedestrian's path, the World Model predicts the pedestrian's velocity vector, yields right-of-way, loops behind the pedestrian, and safely enters the dock with **0 collisions**.

---

## 5. Industrial Cross-Domain: Factory-Line Digital Twin (4:30 – 5:30)

> *"To prove that World Models generalize beyond 2D spatial navigation, click on our Factory Digital Twin simulation.*
> *Here we simulate a 3-station manufacturing pipeline: Precision Milling, Robotic Assembly, and Quality Packaging."*

### Industrial Value Proposition:
- **Without World Model:** Machines run until catastrophic breakdown, requiring 25 steps of emergency downtime, causing severe line starvation and queue backlogs.
- **With World Model:** The predictive model monitors thermal wear and vibration trends, forecasting machine degradation 12 steps in advance. It schedules staggered 4-step quick preventative services while upstream buffers have inventory, ensuring zero unplanned line stoppages and 95%+ factory throughput.

---

## 6. Closing & Technical Q&A (5:30 – 7:00)

> *"In summary, across warehouse navigation, dynamic pedestrian avoidance, and manufacturing digital twins, our World Model architecture turns blind trial-and-error into proactive foresight.*
> *Thank you, and we welcome your questions."*

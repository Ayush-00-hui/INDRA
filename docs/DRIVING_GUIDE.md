# Autonomous Highway Driving Simulator & World Model Guide (`docs/DRIVING_GUIDE.md`)

## 1. Overview
The Autonomous Driving scenario provides a production-grade, physically grounded highway driving simulation inside the **"World Model: Learn, Imagine, Act"** platform.

It models continuous vehicle kinematics, curved multi-lane clothoid roadways, and multi-agent non-player character (NPC) traffic with sudden lead braking and lane changes. An integrated deep World Model dynamics neural network enables Model Predictive Control (MPC) to imagine candidate trajectories across time and safely navigate dense highway traffic.

---

## 2. Vehicle Kinematics & Road Physics

### 2.1 Kinematic Bicycle Model
The ego vehicle obeys continuous bicycle dynamics integrated at $\Delta t = 1/30\text{ s}$:
$$\dot{x} = v \cos(\psi + \beta)$$
$$\dot{y} = v \sin(\psi + \beta)$$
$$\dot{\psi} = \frac{v}{L} \cos(\beta) \tan(\delta)$$
$$\beta = \arctan\left(\frac{1}{2} \tan(\delta)\right)$$
$$\dot{v} = a$$
where:
- Wheelbase $L = 2.8\text{ m}$
- Car length $4.6\text{ m}$, width $1.9\text{ m}$
- World heading $\psi$, slip angle $\beta$, steering angle $\delta$, acceleration $a$

### 2.2 Curved Road Network
The highway is constructed as a 3-lane clothoid/spline centerline spanning $200\text{ m}$:
- Lane width $w = 3.75\text{ m}$, total drivable road width $11.25\text{ m}$, shoulder $2.0\text{ m}$.
- Curvature profile $\kappa(s)$:
  - $s \in [0, 35]\text{ m}$: Straight entry
  - $s \in [35, 95]\text{ m}$: Gentle right curve ($\kappa \approx 0.0033\text{ m}^{-1}$, radius $\approx 300\text{ m}$)
  - $s \in [95, 135]\text{ m}$: Straight tangent
  - $s \in [135, 200]\text{ m}$: Sweeping left curve ($\kappa \approx -0.0036\text{ m}^{-1}$, radius $\approx 280\text{ m}$)
- Exact Frenet coordinate transforms $(s, d) \leftrightarrow (x, y, \psi_{\text{road}})$.

### 2.3 Intelligent Driver Model (IDM) Traffic
Surrounding NPC traffic vehicles follow the non-linear IDM car-following model:
$$a_{\text{IDM}} = a_{\text{max}} \left[ 1 - \left(\frac{v}{v_0}\right)^4 - \left(\frac{s^*(v, \Delta v)}{s_{\text{gap}}}\right)^2 \right]$$
$$s^*(v, \Delta v) = s_0 + v \cdot T + \frac{v \cdot \Delta v}{2 \sqrt{a_{\text{max}} b}}$$
- Minimum bumper gap $s_0 = 4.0\text{ m}$, safe time headway $T = 1.4\text{ s}$, comfortable deceleration $b = 2.0\text{ m/s}^2$.
- In Scenario 2, the lead vehicle executes emergency deceleration ($-5.5\text{ m/s}^2$) at step 30, testing predictive braking and evasion.

---

## 3. Environment Specification

### 3.1 Action Space (5 Discrete Actions)
| Action Index | Action Name | Dynamic Effect |
| :---: | :--- | :--- |
| `0` | **ACCELERATE** | Applies $+2.5\text{ m/s}^2$ longitudinal throttle acceleration |
| `1` | **BRAKE** | Applies $-5.0\text{ m/s}^2$ longitudinal braking deceleration |
| `2` | **STEER LEFT** | Shifts target lateral offset left by one lane ($-3.75\text{ m}$) |
| `3` | **STEER RIGHT** | Shifts target lateral offset right by one lane ($+3.75\text{ m}$) |
| `4` | **CRUISE** | Maintains target cruise speed ($25.0\text{ m/s}$) and lane centering |

### 3.2 State Vector (16-D Normalized, $\approx [-1, 1]$)
The observation vector adheres strictly to the frozen `BaseEnv` contract:
1. `s[0]`: Normalized world $x$ ($x / 350.0$)
2. `s[1]`: Normalized world $y$ ($y / 350.0$)
3. `s[2]`: Normalized distance to goal $\Delta x / 350.0$
4. `s[3]`: Normalized displacement to goal $\Delta y / 350.0$
5. `s[4]`: Lateral lane offset $d / 4.0$
6. `s[5]`: Heading error $\Delta \psi = \text{wrap}(\psi - \psi_{\text{road}}) / \pi$
7. `s[6]`: Forward speed ratio $(v - 15.0) / 15.0$
8. `s[7]`: Yaw rate $r / 0.5$
9. `s[8]`: Look-ahead curvature at $15\text{ m}$ ($\kappa_{15} \times 100$)
10. `s[9]`: Look-ahead curvature at $35\text{ m}$ ($\kappa_{35} \times 100$)
11. `s[10]`: Normalized lead vehicle distance gap $\text{clip}(s_{\text{lead}} / 60.0, -1, 1)$
12. `s[11]`: Lead vehicle relative velocity $\Delta v_{\text{lead}} / 15.0$
13. `s[12]`: Left adjacent lane gap safety clearance $\in [-1, 1]$
14. `s[13]`: Right adjacent lane gap safety clearance $\in [-1, 1]$
15. `s[14]`: Current discrete lane index normalized $((l - 1) / 1.0)$
16. `s[15]`: Headway Time-to-Collision (TTC) metric $\text{clip}(\text{TTC} / 10.0, 0, 1)$

---

## 4. Empirical Evaluation Benchmark

Benchmarked over **50 seeded evaluation episodes** (seeds 1000–1049) on Scenario 2 (Emergency Sudden Braking):

| Policy Agent | Success Rate | Collisions / 100 Steps | Mean TTC (s) | Mean Reward |
| :--- | :---: | :---: | :---: | :---: |
| **Random Exploration** | 8.0% | 0.36 | 8.14 s | -80.5 |
| **Reactive Baseline (IDM/PID)** | 0.0% | 1.00 | 4.41 s | -127.8 |
| **World Model MPC (Ours)** | **70.0%** | **0.02** | **8.98 s** | **+132.7** |

### Benchmark Takeaways
- **98% Collision Reduction**: The reactive baseline crashed in 100% of sudden lead-braking episodes due to reaction delay. The learned World Model imagines future lead vehicle trajectories 14 steps ahead, braking and executing lane-change bypass maneuvers before impact.
- **+260.5 Reward Improvement**: MPC maintains high cruise speed while tracking road curvature smoothly.
- **Model Accuracy**: One-step forward dynamics validation MAE is **0.0190**, and position prediction MAE is **0.00004**.

---

## 5. Web 3D Simulation & AV Dashboard

### 5.1 Three.js 3D Highway Scene (`DrivingScene`)
- **PBR Asphalt Ribbon**: Extruded highway road mesh with realistic asphalt roughness, animated dashed lane dividers, yellow continuous edge lines, and steel guardrails.
- **Procedural Vehicle Models**: Procedural sports sedan with spinning alloy wheels, dynamic front steering rack, glowing LED headlights, and brake lights that illuminate upon deceleration.
- **Instanced Environment**: Procedural low-poly trees, bushes, highway overhead gantries, and streetlights.
- **Mind View**: Renders the vectorized MPC planning search directly onto the 3D roadway:
  - Best trajectory ribbon rendered in glowing **emerald green** (`#00ff9d`).
  - Alternative candidate trajectories rendered in fading translucent **cyan** (`#00f0ff`).
  - Ghost car visualization at the terminal horizon state.

### 5.2 Interactive Cameras & Viewports
- Press **1**: **Chase Camera** (Third-person rear following with speed-adaptive FOV)
- Press **2**: **Cockpit / First-Person POV** (Driver's eye view from cabin)
- Press **3**: **Top-Down Orthographic** (Overhead tactical radar perspective)
- Press **4**: **Free Orbit** (Pan, zoom, and rotate around the ego vehicle)
- Press **5**: **Cinematic Fly-by** (Sweeping highway perspective)

### 5.3 Manual Human Driving Mode
Click **MANUAL DRIVE** in the UI or press **W / A / S / D**:
- **W**: Accelerate
- **S**: Brake
- **A**: Steer Left
- **D**: Steer Right
- **Space**: Cruise / Maintain

---

## 6. How to Run

### Run Unit & Integration Tests
```bash
pytest tests/test_driving_env.py tests/test_interface.py tests/test_web_server.py
python scripts/smoke_test.py
```

### Run Data Collection, Training & Evaluation
```bash
# 1. Collect 150 episodes of driving transitions
python scripts/collect_data_driving.py --episodes 150 --out data/driving_transitions.npz

# 2. Train deep dynamics World Model
python scripts/train_driving.py --data data/driving_transitions.npz --out models/driving_model.pt --epochs 45

# 3. Benchmark World Model MPC against reactive baseline
python scripts/evaluate_driving.py --episodes 50 --model models/driving_model.pt --out results/driving_results.csv
```

### Launch Web Simulation Server
```bash
# Build frontend bundle
cd web/frontend
npm run build
cd ../..

# Start FastAPI simulation server
python -m web.server --port 8000
```
Open [http://localhost:8000](http://localhost:8000) in your browser and switch to the **Autonomous Driving** scenario.

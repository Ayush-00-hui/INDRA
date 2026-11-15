# Visual Art Direction: University Robotics Lab Test Arena

**Document Status:** Approved & Active  
**Target Milestone:** NBA Evaluator Demonstration (v6.0-beauty)  
**Scale System:** $1\text{ px} = 1\text{ cm}$ ($900\text{ px} \times 600\text{ px} \equiv 9.0\text{ m} \times 6.0\text{ m}$)  

---

## 1. Visual Narrative & Concept

### Setting: Advanced Academic Autonomous Systems Testbed
The environment is not a cold, sci-fi cyberspace void or a generic dark-mode grid. It is an authentic, bright, high-tech **University Robotics Research Lab**. 

- **The Playable Arena:** A designated $9\text{ m} \times 6\text{ m}$ test space demarcated on a light polished industrial concrete floor by high-visibility diagonal hazard safety tape (yellow/matte black) and precision corner positioning crosshairs.
- **Architectural Shell:**
  - **Floor:** Light industrial concrete with subtle PBR roughness variation, specular micro-scuffs, and faint tire tracks from previous test runs. No murky dark-blue or cyan grid floor.
  - **Walls:** Clean eggshell/chalk-grey lab partitions with an extruded dark-charcoal baseboard ($12\text{ cm}$ height).
  - **Window Wall (South/East):** Large glass industrial windows casting soft, diffused daylight and subtle sunlit quadrilaterals onto the floor.
  - **Ceiling:** Recessed square LED panel lights ($60\text{ cm} \times 60\text{ cm}$) providing clean overhead illumination.
- **Perimeter Lab Dressing (Outside the active $9\times 6\text{ m}$ bounds):**
  - Modular birch-top workbench stations with dual monitors, oscilloscope, soldering station, and prototyping boards.
  - Steel shelving units holding labeled hardware component bins.
  - Dry-erase whiteboard with hand-sketched state-space equations ($s_{t+1} = f_\theta(s_t, a_t)$) and MPC horizon graphs.

---

## 2. Color Palette & Lighting Hierarchy

### A. Lighting System (High Dynamic Range, Warm Key / Cool Sky Fill)
To eliminate the murky dark look and achieve a mean luminance between **0.25 and 0.60** with $\ge 30\%$ midtones:
1. **Primary Key Light (Sunlight through windows):** Directional warm sunlight ($\approx 4800\text{ K}$, color `(1.0, 0.96, 0.90)`), angled at $45^\circ$, casting crisp soft-edge contact shadows.
2. **Secondary Fill Light (Sky Dome / HDRI):** Soft cool ambient fill (`(0.40, 0.45, 0.55)`) ensuring shadows never dip below $15\%$ luminance.
3. **Overhead Ceiling Panels:** Low-intensity area point highlights above the arena perimeter providing specular sheen on the robot chassis and polished floor.

### B. Restrained Color Palette
- **Architectural Neutrals:**
  - Concrete Floor: `#c4cad4` to `#b0b8c6` (roughness: $0.35$, metallic: $0.05$)
  - Lab Wall Partitions: `#d8dde4`
  - Baseboards & Trims: `#222630`
  - Workbench Tops: Natural Birch Wood `#c8a882`
- **Dynamic Action Accents (Only 4 Functional Colors):**
  - **Emerald Green (`#10b981`):** Chosen/Executed Path & World Model Success.
  - **Teal / Cyan (`#06b6d4`):** Real-time Imagination, Ghost Rollouts, and LiDAR sensor sweeps.
  - **Amber / Gold (`#f59e0b`):** Charging Dock Goal beacon and caution indicators.
  - **Coral / Red (`#ef4444`):** Ground-truth collisions, impact flares, and baseline failures.

---

## 3. Hero Asset Specifications

All hero assets are authored 3D models with verified open licenses:

| Hero Asset | Target Dimensions & Footprint | Authoring / Source | License |
| :--- | :--- | :--- | :--- |
| **Autonomous Rover (AMR)** | Radius $0.18\text{ m}$ ($36\text{ cm}$ diameter), height $0.28\text{ m}$ | Authored Rover GLB (`assets/models/robot.glb`), TurtleBot3 spec | CC0 1.0 |
| **Ergonomic Office Chair** | $0.80\text{ m} \times 0.80\text{ m}$ footprint ($\ge 85\%$ coverage) | Authored Mesh Chair GLB (`assets/models/chair.glb`) | CC0 1.0 |
| **Rigged Walking Human** | Capsule radius $0.225\text{ m}$, height $1.75\text{ m}$ | Authored Animated Humanoid (`assets/models/human.glb`) | CC0 1.0 |
| **Recharging Goal Dock** | $0.60\text{ m} \times 0.60\text{ m}$ footprint | Authored Recharging Station (`assets/models/goal_pad.glb`) | CC0 1.0 |
| **Obstacle Crates & Cabinets** | Matches $w \times h$ physics hit envelope | Kenney Modular Furniture Kit | CC0 1.0 |

---

## 4. Visual Quality Gates

1. **Luminance Gate:**
   - In Overview camera view, full-frame mean luminance must fall between $0.25$ and $0.60$.
   - At least $30\%$ of pixels must inhabit the midtone luminance range ($[0.20, 0.70]$).
2. **Never-Black Gate:**
   - All 5 camera modes (Overview, Chase, Top-Down, Robot POV, Orbit) plus Mind View must yield non-zero luminance ($\mu > 10, \sigma > 6$ on 8-bit scale).
3. **Honesty Gate:**
   - Every metric, telemetry value, and prediction error displayed on screen originates from live computation or recorded replay frames.
   - Ground truth simulation data is captioned *"from simulator state"*.

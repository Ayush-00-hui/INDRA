# Web Application Architecture & Contributor Guide (v4.0)

This guide documents the web application architecture for **"World Model: Learn, Imagine, Act"** and provides clear instructions for extending or integrating new environments (such as Gurudutt's Autonomous Driving model).

---

## 1. System Architecture

```
                       ┌─────────────────────────────────────────┐
                       │          Browser Frontend (WebGL)        │
                       │   Three.js PBR / 2D Canvas Fallback     │
                       │   Vite + TypeScript (Bundled Offline)   │
                       └───────────────────▲─────────────────────┘
                                           │
                        WebSocket / Replay │ JSON Stream (RenderState)
                                           ▼
                       ┌─────────────────────────────────────────┐
                       │       FastAPI + Uvicorn Backend         │
                       │   Port Auto-Discovery / Max 3 Sessions  │
                       └───────────────────▲─────────────────────┘
                                           │
                         Adapter Interface │ step() -> RenderState
                                           ▼
       ┌─────────────────────────┬─────────────────────────┬─────────────────────────┐
       │      RobotAdapter       │     DrivingAdapter      │     FactoryAdapter      │
       │  RobotEnv (S1 & S2)     │   DrivingEnv / Hook     │  FactoryEnv 3-Station   │
       │  Ensemble World Model   │   Lane Dynamics         │  Predictive Maintenance │
       │  Vectorized MPC Planner │   Ghost Vehicle Ribbons │  Queue & Wear Forecast  │
       └─────────────────────────┴─────────────────────────┴─────────────────────────┘
```

---

## 2. Gurudutt's 10-Line Integration Guide

Gurudutt's `envs/driving_env.py` and `scripts/*driving*.py` remain **strictly untouched**.

To connect your completed neural driving policy or MPC controller to the live 3D web interface, simply update `web/adapters/driving_adapter.py`:

```python
# In web/adapters/driving_adapter.py:
from envs.driving_env import DrivingEnv
from model.world_model import load_model
from planner.mpc import plan

class DrivingAdapter:
    def __init__(self, scenario_variant=1, mode="world_model"):
        self.env = DrivingEnv()
        self.model = load_model("models/driving_model.pt") if mode == "world_model" else None
        self.mode = mode

    def step(self):
        # 1. Plan next action using world model or baseline
        state = self.env._get_state_vector()
        action = plan(self.model, state) if self.mode == "world_model" else self.env.get_baseline_action()
        # 2. Advance environment
        next_state, reward, done, info = self.env.step(action)
        # 3. Return structured web RenderState
        return self.get_render_state(done=done, info=info), done
```

The Three.js frontend automatically renders the 3D highway, vehicle meshes, headlights, and MPC trajectory forecast ribbons!

---

## 3. Web Packet Protocol (`RenderState`)

All data streaming from server to client conforms to the Pydantic schema defined in `web/schema.py`:

```typescript
interface RenderState {
  v: number;               // Protocol version (1)
  scenario: string;        // "robotics" | "driving" | "factory"
  step: number;            // Current simulation step (0..200)
  dt: number;              // Delta time (1/30s)
  mode: string;            // "world_model" | "baseline" | "compare"
  world: WorldLayout;      // Bounds, dimensions, stations/lanes
  entities: Entity[];      // Robot, pedestrians, vehicles, machines, items
  goal?: Goal;             // Target dock or terminal point
  plan?: Plan;             // Best trajectory, alternatives, confidence, ms
  metrics: Metrics;        // Reward, collisions, step count, custom stats
  events: string[];        // "bonk" | "goal" | "jammed" | "maintenance"
  model_error?: number;    // 1-step delta prediction MAE
}
```

---

## 4. Total Offline Capability & Replay Mode

The web application does **not** rely on external CDNs or an internet connection:
- All Three.js dependencies, fonts (*Inter*, *JetBrains Mono*), and Lucide SVG icons are bundled locally in `web/dist/`.
- Pre-recorded demonstration sessions are saved in `web/replays/*.json`.
- If the Python server disconnects or is unavailable, the frontend switches automatically to **Offline Replay Mode** with zero interruption.

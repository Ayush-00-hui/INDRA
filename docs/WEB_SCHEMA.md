# Universal Web Render-State Specification (`docs/WEB_SCHEMA.md`)

Version: `1.0`  
Standard: Pydantic v2 / orjson JSON Schema

---

## 1. Overview
The web interface connects to the simulation backend via WebSockets (`/ws/{scenario}`). The backend simulates the environment and planning in Python and emits JSON `RenderState` packets at the configured simulation frequency. The browser runs Three.js / HTML5 Canvas to render the scene without executing simulation physics or neural network inference locally.

---

## 2. Packet Format: `RenderState`

```json
{
  "v": 1,
  "scenario": "robotics",
  "step": 42,
  "dt": 0.03333,
  "mode": "world_model",
  "world": {
    "bounds": [0.0, 0.0, 900.0, 600.0],
    "units": "px",
    "scale": 1.0,
    "layout": {
      "walls": [[0, 0, 900, 20], [0, 580, 900, 20]]
    }
  },
  "entities": [
    {
      "id": "robot_0",
      "kind": "robot",
      "x": 245.5,
      "y": 312.0,
      "heading": 45.0,
      "vx": 10.5,
      "vy": 10.5,
      "r": 18.0,
      "extra": {"chassis_tilt": 0.05, "status_led": "green"}
    },
    {
      "id": "chair_1",
      "kind": "chair",
      "x": 450.0,
      "y": 300.0,
      "w": 80.0,
      "h": 80.0
    }
  ],
  "goal": {
    "x": 750.0,
    "y": 300.0,
    "r": 20.0
  },
  "plan": {
    "kind": "path",
    "best": [[245.5, 312.0], [255.0, 320.0]],
    "alts": [
      {
        "path": [[245.5, 312.0], [240.0, 310.0]],
        "score": -12.5,
        "first_action": 1,
        "uncertainty": 0.04
      }
    ],
    "chosen_action": 3,
    "ms": 8.78
  },
  "metrics": {
    "reward": 14.2,
    "episode": 3,
    "success": false,
    "collisions": 0,
    "step_count": 42
  },
  "events": [],
  "model_error": 0.016
}
```

---

## 3. Dual-Stream Packet Format: `CompareRenderState`

In **Compare Mode** (`mode="compare"`), the backend runs two environments simultaneously with identical seeds (one with the reactive baseline and one with the World Model MPC controller) and streams a single synchronized packet:

```json
{
  "v": 1,
  "scenario": "robotics",
  "is_compare": true,
  "left": { ...RenderState for Baseline... },
  "right": { ...RenderState for World Model... }
}
```

---

## 4. Client WebSocket Control Commands

Clients send JSON strings to `/ws/{scenario}` to alter runtime behavior:

| Command `cmd` | Additional Fields | Description |
| :--- | :--- | :--- |
| `"start"` | `seed` (optional) | Begins streaming simulation frames. |
| `"reset"` | `seed` (optional), `scenario_variant` | Resets environment to start position. |
| `"set"` | `mode` (`"world_model"`, `"baseline"`, `"compare"`), `speed` (0.25 to 4.0), `mind_view` (bool) | Updates simulation or visualization parameters. |
| `"pause"` | None | Pauses simulation frame advancement. |
| `"step"` | None | Steps forward exactly one frame while paused. |

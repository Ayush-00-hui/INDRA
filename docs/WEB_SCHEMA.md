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
| `"set"` | `mode` (`"world_model"`, `"baseline"`, `"compare"`), `speed` (0.25 to 4.0), `mind_view` (bool), `weather` (`"clear"`, `"rain"`), `time_of_day` (`"day"`, `"sunset"`, `"night"`), `camera` (`"chase"`, `"pov"`, `"topdown"`, `"orbit"`, `"cinematic"`), `manual_action` (int 0..4) | Updates simulation, environmental, or visualization parameters. |
| `"pause"` | None | Pauses simulation frame advancement. |
| `"step"` | None | Steps forward exactly one frame while paused. |

---

## 5. Autonomous Driving Schema Extensions

When `scenario == "driving"`, `RenderState` adds highway road network and vehicle dynamics specifications:

### 5.1 World Layout & Coordinate Frame
- Coordinate units: `world.units = "m"` (SI meters).
- Road geometry defined inside `world.layout`:
  - `centerline`: `List[List[float]]` array of `[x, y]` spline coordinates along road reference line.
  - `lane_count`: integer number of lanes (default `3`).
  - `lane_width`: lateral lane width in meters (default `3.75`).
  - `road_width`: total drivable roadway width (default `11.25`).
  - `shoulder_width`: road shoulder width (default `2.0`).
  - `speed_limit`: highway speed limit in m/s (default `28.0` ~ 100 km/h).
  - `scenery_seed`: deterministic PRNG seed for instanced roadside trees, streetlights, and signage.

### 5.2 Vehicle Entities
- `entities[].kind`: `"car"`, `"truck"`, `"person"`.
- `entities[].extra`:
  - `is_ego`: boolean indicating the ego vehicle.
  - `steer_angle`: vehicle front steering wheel angle in radians.
  - `brake_lights`: boolean flag triggering tail brake light illumination.
  - `indicator`: `-1` (left indicator), `0` (none), `1` (right indicator).
  - `color`: CSS hex color string (e.g. `"#00f0ff"` for ego).
  - `target_speed`: vehicle desired cruise speed in m/s.

### 5.3 Telemetry Metrics & Events
- `metrics.extra`:
  - `speed_kmh`: forward velocity in km/h.
  - `lane_offset`: signed lateral deviation from target lane centerline in meters.
  - `ttc`: headway time-to-collision in seconds (clipped to 10.0s).
- `events`: string event tokens dispatched during frame transitions:
  - `"brake"`: sudden braking maneuver triggered by lead vehicle.
  - `"lane_change"`: lane change initiation.
  - `"near_miss"`: headway TTC drops below critical safety threshold (< 1.8s).
  - `"bonk"`: physical collision detected.
  - `"goal"`: highway termination milestone successfully reached.


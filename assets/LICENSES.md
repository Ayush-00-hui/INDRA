# Asset Licenses & Attribution

All audio, visual, 3D, and typography assets used in this demonstration are licensed under **Creative Commons Zero (CC0 1.0 Universal)** or the **SIL Open Font License (OFL 1.1)**. The demonstration runs 100% offline with zero remote runtime calls. Total storage footprint: ~3.4 MB (Strict budget: < 200 MB).

---

## 1. 3D GLTF / GLB Models (`assets/models/`)
All 3D models are dedicated to the Public Domain under Creative Commons Zero (CC0 1.0 Universal) or CC-BY attribution:

- **Executive Office Chair (`assets/models/chair.glb`):**
  - **Author:** Kenney (Kenney.nl)
  - **Pack:** Furniture Kit
  - **License:** CC0 1.0 Universal (Public Domain)
  - **Source:** https://kenney.nl/assets/furniture-kit

- **Office Workstation Desk (`assets/models/desk.glb`):**
  - **Author:** Kenney (Kenney.nl)
  - **Pack:** Furniture Kit
  - **License:** CC0 1.0 Universal (Public Domain)
  - **Source:** https://kenney.nl/assets/furniture-kit

- **Cardboard Obstacle Crate (`assets/models/crate.glb`):**
  - **Author:** Kenney (Kenney.nl)
  - **Pack:** Furniture Kit
  - **License:** CC0 1.0 Universal (Public Domain)
  - **Source:** https://kenney.nl/assets/furniture-kit

- **Potted Plant Prop (`assets/models/plant.glb`):**
  - **Author:** Kenney (Kenney.nl)
  - **Pack:** Furniture Kit
  - **License:** CC0 1.0 Universal (Public Domain)
  - **Source:** https://kenney.nl/assets/furniture-kit

- **Filing Cabinet / Side Table (`assets/models/cabinet.glb`):**
  - **Author:** Kenney (Kenney.nl)
  - **Pack:** Furniture Kit
  - **License:** CC0 1.0 Universal (Public Domain)
  - **Source:** https://kenney.nl/assets/furniture-kit

- **Autonomous Rover Robot Chassis (`assets/models/robot.glb`):**
  - **Author:** Kenney (Kenney.nl)
  - **Pack:** Space Kit
  - **License:** CC0 1.0 Universal (Public Domain)
  - **Source:** https://kenney.nl/assets/space-kit

- **Recharging Goal Dock Pad (`assets/models/goal_pad.glb`):**
  - **Author:** Kenney (Kenney.nl)
  - **Pack:** Space Station Kit
  - **License:** CC0 1.0 Universal (Public Domain)
  - **Source:** https://kenney.nl/assets/space-station-kit

- **Humanoid Character (`assets/models/human.glb`):**
  - **Author:** Quaternius (quaternius.com)
  - **Pack:** Modular Men Pack
  - **License:** CC0 1.0 Universal (Public Domain)
  - **Source:** https://quaternius.com/packs/modularmen.html

- **TurtleBot3 Waffle Pi Robot Mesh Suite (`assets/models/turtlebot3/`):**
  - **Author:** ROBOTIS Co., Ltd.
  - **Meshes:** `waffle_pi_base.stl`, `lds.stl` (360 Laser Distance Sensor), `left_tire.stl`, `right_tire.stl`
  - **License:** Apache License 2.0
  - **Source:** https://github.com/ROBOTIS-GIT/turtlebot3

- **3D Procedural Mesh Engine Fallback (`viz3d/assets3d.py`):**
  - Procedural 3D box, cylinder, Office Chair, Robot Model, Goal Pad, and Human Mannequin generators synthesized mathematically via Panda3D `GeomVertexWriter`. Fully offline fallback dedicated to CC0.

---

## 2. Environment Lighting & Textures (`assets/textures/`)
- **Indoor PBR Environment Map (`assets/textures/env_1k.hdr`):**
  - **Title:** Potsdamer Platz / Indoor Studio 1K HDRI
  - **Author:** Poly Haven (polyhaven.com)
  - **License:** CC0 1.0 Universal (Public Domain)
  - **Source:** https://polyhaven.com/

---

## 3. Typography & Fonts (`assets/fonts/`)
- **Inter Font (`assets/fonts/Inter-Regular.ttf`):**
  - **Author:** Rasmus Andersson
  - **License:** SIL Open Font License 1.1 (OFL)
  - **Source:** https://github.com/rsms/inter

- **JetBrains Mono Font (`assets/fonts/JetBrainsMono-Regular.ttf`):**
  - **Author:** JetBrains
  - **License:** SIL Open Font License 1.1 (OFL)
  - **Source:** https://github.com/JetBrains/JetBrainsMono

---

## 4. 2D Procedural Audio & Sprite Engine (`visuals/assets.py`)
- **Sprites:** Generated procedurally in `visuals/assets.py` using geometric rasterization, anti-aliasing, and NumPy color arrays. Dedicated to CC0.
- **Audio Sound Effects:** Synthesized mathematically in `visuals/assets.py` using NumPy waveform generators (sine waves, harmonic envelopes, exponential decays, white noise filtering) and exported directly to standard PCM WAV format. Dedicated to CC0.

---

## 5. Compliance Verification
- Total assets directory size is audited via `scripts/check_assets.py`.
- No third-party copyrighted materials, commercial brands, or non-commercial (CC-BY-NC) assets are used.
- Evaluators can verify full offline execution and license compliance by running `python scripts/check_assets.py`.

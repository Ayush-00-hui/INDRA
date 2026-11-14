# Asset Licenses & Attribution

All audio and visual assets used in this demonstration are **100% procedurally synthesized** at runtime using NumPy, Pillow, Pygame, and Panda3D geometry pipelines, or licensed under **Creative Commons Zero (CC0)** / Open Font License (OFL).

---

## 1. 3D Procedural Mesh & Materials Engine (`viz3d/assets3d.py`)
- **3D Robot Model:** Procedurally constructed via Panda3D `GeomVertexData` / `GeomTriangles` (cylindrical chassis, rotating side wheels, beveled headlights, emissive cyan visor, LiDAR turret, beacon). Dedicated to CC0.
- **Office Chair (Hero Obstacle):** Procedurally synthesized 5-star wheeled base, chrome piston, cushion ($0.74\text{ m} \times 0.74\text{ m}$ covering $85.5\%$ of the $0.80\text{ m} \times 0.80\text{ m}$ hit envelope), ergonomic backrest, and armrests. Dedicated to CC0.
- **Obstacle Props:** Procedurally generated wooden cargo crates with caution banding, 3-drawer steel filing cabinets, stainless steel waste receptacles, and terracotta potted plants. Dedicated to CC0.
- **Charging Dock / Goal Pad:** Procedurally generated concentric metallic pad with glowing LED rings, floating energy core, and vertical beacon light. Dedicated to CC0.
- **Articulated Human Mannequin:** Procedurally constructed mannequin with pivot joints for hips and shoulders driving realistic walk cycles and customizable clothing colors. Dedicated to CC0.

---

## 2. 2D Procedural Generation Engine (`visuals/assets.py`)
- **Sprites:** Generated in `visuals/assets.py` using procedural geometric rasterization, anti-aliased alpha blending, and NumPy color arrays.
- **Audio Sound Effects:** Synthesized mathematically in `visuals/assets.py` using NumPy waveform generators (sine waves, harmonic envelopes, exponential decays, and white noise filtering) and exported directly to standard PCM WAV format.
- **Copyright Status:** Dedicated to the Public Domain (CC0 1.0 Universal). Zero third-party copyrighted materials, brands, or commercial game rips are present.

---

## 3. Typography
- **Primary Typography:** Clean system sans-serif fonts (`Segoe UI`, `Arial`, `Helvetica`, `DejaVu Sans`, `Consolas`) natively available on Windows and Linux platforms.
- **Bundled Font Fallback:** If bundled TTF assets are loaded from `assets/fonts/`, they are restricted strictly to SIL Open Font License (OFL) / CC0 typefaces.

---

## 4. Compliance for NBA Accreditation
- **Offline Self-Sufficiency:** The system does not connect to external CDNs or remote URLs. Every 3D mesh, 2D sprite, light map, and audio sample compiles deterministically on the target machine without internet access.
- **License Integrity:** Evaluators may inspect all code in `viz3d/` and `visuals/` to verify mathematical synthesis of all audio, visual, and 3D assets.

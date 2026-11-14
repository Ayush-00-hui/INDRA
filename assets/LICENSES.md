# Asset Licenses & Attribution

All audio and visual assets used in this demonstration are **100% procedurally synthesized** at runtime using NumPy, Pillow, and Pygame, or licensed under **Creative Commons Zero (CC0)** / Open Font License (OFL).

---

## 1. Procedural Generation Engine
- **Sprites:** Generated in `visuals/assets.py` using procedural geometric rasterization, anti-aliased alpha blending, and NumPy color arrays.
- **Audio Sound Effects:** Synthesized mathematically in `visuals/assets.py` using NumPy waveform generators (sine waves, harmonic envelopes, exponential decays, and white noise filtering) and exported directly to standard PCM WAV format.
- **Copyright Status:** Dedicated to the Public Domain (CC0 1.0 Universal). Zero third-party copyrighted materials, brands, or commercial game rips are present.

---

## 2. Typography
- **Primary Typography:** Clean system sans-serif fonts (`Segoe UI`, `Arial`, `Helvetica`, `DejaVu Sans`, `Consolas`) natively available on Windows and Linux platforms.
- **Bundled Font Fallback:** If bundled TTF assets are loaded from `assets/fonts/`, they are restricted strictly to SIL Open Font License (OFL) / CC0 typefaces (e.g., *Press Start 2P*, *Inter*).

---

## 3. Compliance for NBA Accreditation
- **Offline Self-Sufficiency:** The system does not connect to external CDNs or remote URLs. Every sprite, light map, and audio sample compiles deterministically on the target machine without internet access.
- **License Integrity:** Evaluators may inspect all code in `visuals/` to verify mathematical synthesis of all audio and visual assets.

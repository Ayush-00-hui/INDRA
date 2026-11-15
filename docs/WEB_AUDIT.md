# Web Application Performance & Technical Audit (Phase 0)

**Date:** 15 November 2026  
**Target Hardware:** NVIDIA GeForce RTX 5070 Laptop GPU (8 GB VRAM), Intel/AMD CPU, 1080p-4K Displays  
**Accreditation Benchmark Target:** Client $\ge 60\text{ FPS}$, Server MPC $\le 15\text{ ms}$ (p95 $\le 25\text{ ms}$)  

---

## 1. Audit Findings & Root Cause Analysis

### Finding 1: Low Client Frame Rates (8–13 FPS on Hi-DPI / Software WebGL)
* **Root Cause 1.1 (Memory Leaks via Re-allocation):**  
  In `web/frontend/src/renderers/three_scene.ts`, every time a `plan` frame arrives from the WebSocket, alternative paths and the best trajectory tube are instantiated anew:
  ```typescript
  const tubeGeo = new THREE.TubeGeometry(curve, ...);
  const tubeMat = new THREE.MeshBasicMaterial(...);
  this.chosenRibbon = new THREE.Mesh(tubeGeo, tubeMat);
  ```
  Neither `oldGeo.dispose()` nor `oldMat.dispose()` was called. On a 30 FPS stream, 1,800 geometries and materials are leaked every minute, triggering intense Chrome garbage collection stutters and VRAM exhaustion.
* **Root Cause 1.2 (Uncapped Device Pixel Ratio):**  
  Mobile and high-resolution laptop screens run at `devicePixelRatio = 2.0` (or `3.0` for Retina/4K). A $1920 \times 1080$ viewport rendered at DPR 2.0 forces the WebGL canvas to shade $3840 \times 2160$ (8.3 million pixels per frame). On mobile GPUs, this creates a severe pixel fill-rate bottleneck.
* **Root Cause 1.3 (Software WebGL / Hardware Acceleration Disabled):**  
  In browsers like Brave or Edge where hardware graphics acceleration is disabled by default, WebGL falls back to CPU rasterizers (`SwiftShader` or `llvmpipe`), dragging FPS down to single digits.

### Finding 2: Server Planning Latency (~62 ms with Ensemble World Model)
* **Root Cause 2.1 (Ensemble Forward Pass Multiplication):**  
  The ensemble model consists of $K=5$ distinct sub-networks. Simulating $N=300$ candidate trajectories over horizon $H=14$ requires evaluating:
  $$300 \times 14 \times 5 = 21,000 \text{ forward transitions per planning cycle}$$
  On sequential CUDA execution, this pushes planning time from 8.7 ms (single model) to 58–65 ms, exceeding the 33.3 ms deadline (30 FPS).
* **Root Cause 2.2 (Per-Step CUDA Tensor Allocations):**  
  Each call to `plan()` creates new candidate action tensors and clones state buffers dynamically, incurring CUDA memory allocator overhead.
* **Root Cause 2.3 (Lack of Model Distillation):**  
  The ensemble is unnecessarily evaluated in the critical inner loop of real-time control, rather than distilling the teacher ensemble into a single ultra-fast student model with a dedicated epistemic uncertainty head.

### Finding 3: Robot POV Blackout & Camera Orientation Jitter
* **Root Cause 3.1 (Camera Position Inside Chassis):**  
  The PIP / Robot POV camera was placed at $y = 0.22\text{ m}$ with `near = 0.1\text{ m}`. Because the robot chassis radius is $0.18\text{ m}$ and height is $0.26\text{ m}$, the camera's near clipping frustum intercepted the interior faces of the robot mesh itself, rendering complete blackness.
* **Root Cause 3.2 (LookAt Snapping vs Position LERP):**  
  Position was smoothed via lerp while the lookAt target vector was computed from raw unsmoothed discrete headings, producing severe rotational snapping.

### Finding 4: Inactive "Split Compare" Viewport
* **Root Cause 4.1 (Left Stream Discarded):**  
  In `web/frontend/src/views/sim.ts`, the frame handler extracted only `frame = data.is_compare ? data.right : data`, completely ignoring `data.left`. Only a single 3D scene was initialized, so clicking "Split Compare" produced zero visual comparison.

### Finding 5: Synthetic / Hardcoded HUD Data
* **Root Cause 5.1:**  
  The "Why this move?" card displayed fixed strings with hardcoded score values (`+14.2`, `-12.0`), success rates (`94.0%`), and fixed 1-step delta MAE (`0.016`). These must be replaced with real data derived from `plan.alts`, active session counters, and server-computed prediction deltas.

---

## 2. Action Plan & Measurable Targets

| Target Metric | Baseline (Audit) | Target After Phase 1 & 2 |
| :--- | :---: | :---: |
| **Client FPS (1080p, High Quality)** | 8–13 FPS | $\ge 60\text{ FPS}$ |
| **Three.js Geometries Leaked / min** | ~1,800 | **0** (Pooled / In-Place Buffers) |
| **Server Planning Latency (GPU)** | 62 ms | $\le 12\text{ ms}$ (Student Distillation) |
| **Robot POV Visibility** | 0% (Black) | 100% (Head-Mounted $y=0.30\text{ m}$, HUD Frame) |
| **Split Compare View** | 1 Scene | 2 Synchronized Viewports (Left vs Right) |
| **HUD Metric Integrity** | Hardcoded | 100% Live Streamed from Models |

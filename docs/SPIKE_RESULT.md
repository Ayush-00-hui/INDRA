# Phase 0 Spike Results: Panda3D Offscreen Rendering

**Date:** Sun 15 Nov 2026  
**Hardware:** NVIDIA GeForce RTX 5070 Laptop GPU / PCIe / SSE2  
**Driver:** 3.2.0 NVIDIA 596.13 (OpenGL 4.6.0)  
**Resolution:** 960x600 (Single View Native)  
**Benchmark Script:** [`scripts/spike_3d.py`](file:///c:/Users/AYUSH/Desktop/world-model/scripts/spike_3d.py)  

---

## 1. Executive Summary: GO Decision

| Quality Tier | Shadows | MSAA | Render Mean (ms) | Readback Mean (ms) | Total Mean (ms) | Total p95 (ms) | FPS | Status |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **LOW** | Off | 0x | 0.81 | 6.01 | **6.82** | 7.13 | **146.6** | PASS |
| **MED** | On | 2x | 1.17 | 6.01 | **7.18** | 10.68 | **139.2** | **GO** (<= 16.0 ms) |
| **HIGH** | On | 4x | 1.56 | 5.99 | **7.55** | 11.26 | **132.5** | PASS |

**Threshold Criterion:** Total frame time $\le 16.0\text{ ms}$ at **MED** quality on the target machine.  
**Achieved:** **7.18 ms** (55% faster than the 16.0 ms budget).  
**Verdict:** **CLEAR GO FOR 3D TRACK**.

---

## 2. Key Architecture Insights

1. **Task Manager Integration for `simplepbr`:**
   - Panda3D's `simplepbr` updates camera and lighting shader uniforms in an internal task hook named `'simplepbr update'`.
   - Stepping the frame loop via `base.taskMgr.step()` runs the uniform updates, shadow maps, and render passes seamlessly.

2. **Zero-Allocation RAM Readback:**
   - Texture readback via `GraphicsOutput.RTM_copy_ram` populates buffer memory directly.
   - Array orientation: Panda3D textures are stored with origin at bottom-left; inverting height (`arr[::-1]`) aligns orientation with Pygame coordinates at $< 6.0\text{ ms}$ overhead.
   - Pre-allocated NumPy memory buffers prevent garbage collection stutter during high-framerate playback.

3. **Fallback Safety:**
   - If Panda3D encounters an initialization failure, unsupported OpenGL profile, or frame degradation below 24 FPS for 2 seconds, the system seamlessly downgrades through the fallback chain (`3D` $\rightarrow$ `2D modern` $\rightarrow$ `2D classic`) without closing the Pygame window.

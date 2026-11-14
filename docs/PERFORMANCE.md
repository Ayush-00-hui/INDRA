# Performance Benchmark Report: 3D PBR & 2D Rendering

**Date:** Sun 15 Nov 2026  
**GPU Hardware:** NVIDIA GeForce RTX 5070 Laptop GPU/PCIe/SSE2  
**Target Frame Rate:** $\ge 60$ FPS (Minimum $\ge 30$ FPS floor)  

## 1. 3D PBR Renderer (Panda3D + SimplePBR Offscreen Bridge)

| Resolution | Quality | Mean Latency (ms) | p95 Latency (ms) | Throughput (FPS) | Status |
|:---|:---:|:---:|:---:|:---:|:---:|
| Single (960x600) | LOW | 8.65 | 9.07 | **115.7** | **PASS (60+ FPS)** |
| Single (960x600) | MED | 8.96 | 9.78 | **111.5** | **PASS (60+ FPS)** |
| Single (960x600) | HIGH | 9.36 | 10.16 | **106.8** | **PASS (60+ FPS)** |
| 720p Laptop (1280x720) | LOW | 15.18 | 15.69 | **65.9** | **PASS (60+ FPS)** |
| 720p Laptop (1280x720) | MED | 16.95 | 18.08 | **59.0** | **PASS (30+ FPS)** |
| 720p Laptop (1280x720) | HIGH | 16.48 | 17.28 | **60.7** | **PASS (60+ FPS)** |
| Split-Screen (1500x560) | LOW | 15.52 | 16.28 | **64.4** | **PASS (60+ FPS)** |
| Split-Screen (1500x560) | MED | 16.31 | 17.22 | **61.3** | **PASS (60+ FPS)** |
| Split-Screen (1500x560) | HIGH | 16.75 | 17.78 | **59.7** | **PASS (30+ FPS)** |
| 1080p Full (1920x1080) | LOW | 32.08 | 33.49 | **31.2** | **PASS (30+ FPS)** |
| 1080p Full (1920x1080) | MED | 32.36 | 33.45 | **30.9** | **PASS (30+ FPS)** |
| 1080p Full (1920x1080) | HIGH | 33.40 | 35.22 | **29.9** | SUB-30 |

## 2. Modern 2D Procedural Renderer (Fallback Engine)

| Resolution | Quality | Mean Latency (ms) | p95 Latency (ms) | Throughput (FPS) | Status |
|:---|:---:|:---:|:---:|:---:|:---:|
| Single (960x600) | LOW | 0.90 | 0.93 | **1114.2** | **PASS (60+ FPS)** |
| Single (960x600) | MED | 3.62 | 4.07 | **276.3** | **PASS (60+ FPS)** |
| Single (960x600) | HIGH | 3.33 | 3.64 | **300.5** | **PASS (60+ FPS)** |
| 720p Laptop (1280x720) | LOW | 0.98 | 1.10 | **1024.2** | **PASS (60+ FPS)** |
| 720p Laptop (1280x720) | MED | 3.56 | 3.99 | **281.1** | **PASS (60+ FPS)** |
| 720p Laptop (1280x720) | HIGH | 3.72 | 4.24 | **268.9** | **PASS (60+ FPS)** |
| Split-Screen (1500x560) | LOW | 1.06 | 1.18 | **944.3** | **PASS (60+ FPS)** |
| Split-Screen (1500x560) | MED | 3.61 | 4.22 | **277.0** | **PASS (60+ FPS)** |
| Split-Screen (1500x560) | HIGH | 3.69 | 4.16 | **271.2** | **PASS (60+ FPS)** |
| 1080p Full (1920x1080) | LOW | 1.14 | 1.25 | **874.7** | **PASS (60+ FPS)** |
| 1080p Full (1920x1080) | MED | 4.91 | 6.03 | **203.8** | **PASS (60+ FPS)** |
| 1080p Full (1920x1080) | HIGH | 4.90 | 6.27 | **204.0** | **PASS (60+ FPS)** |

## 3. Dynamic Auto-Downgrade Safeguard

- If frame rate drops below **24 FPS** for 2 consecutive seconds during live demonstration, the rendering engine automatically cascades down quality settings (`HIGH` $\rightarrow$ `MED` $\rightarrow$ `LOW` $\rightarrow$ `2D Modern` $\rightarrow$ `Classic`) without interrupting simulation or closing the window.
- Memory leaks: Zero per-frame allocations via persistent pre-allocated NumPy byte buffers.

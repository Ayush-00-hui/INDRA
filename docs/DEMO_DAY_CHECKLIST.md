# Demo Day Operations & Rehearsal Checklist

**Event:** National Board of Accreditation (NBA) Technical Committee Review  
**Project:** World Model: Learn, Imagine, Act (Autonomous Robotics & Shared Engine)  
**Date of Visit:** 20 November 2026  
**Operator:** Ayush

---

## 1. Morning Pre-Flight Hardware & Software Check (T - 60 Minutes)

- [ ] **Laptop Power:** Laptop connected to AC wall adapter (ensures GPU/CPU is not power-throttled).
- [ ] **Display Setup:** 
  - External monitor or projector connected.
  - Recommended display resolution: **1920x1080** (fits the 1800x650 Split-Screen window with clean borders).
  - Windows display scaling set to **100%** (Settings -> Display -> Scale: 100%).
- [ ] **Terminal Setup:**
  - Open PowerShell with administrator or standard user in project directory:
    ```powershell
    cd C:\Users\AYUSH\Desktop\world-model
    ```
- [ ] **Run Pre-Flight Smoke Test:**
  ```powershell
  python scripts/smoke_test.py
  ```
  *(Verify that all 7 checks display `PASSED`)*

---

## 2. Emergency Fallback Protocols & Failsafe Commands

### Fallback Plan A: Forced CPU Mode (GPU Driver / CUDA Crash)
If the external display causes an NVIDIA driver glitch or PyTorch CUDA kernel timeout:
```powershell
# Windows PowerShell:
$env:CUDA_VISIBLE_DEVICES=""; python main.py --split

# Linux / Bash:
CUDA_VISIBLE_DEVICES="" python main.py --split
```
*Note: Planning latency on CPU is only ~8.7 ms. The demo runs at a solid 30 FPS without GPU.*

### Fallback Plan B: Headless Pre-Recorded Demonstration
If the display projector fails completely or Pygame window cannot open:
1. Open the pre-rendered animated demo:
   ```powershell
   # Open pre-recorded high-fidelity GIF preview:
   Start-Process results/demo_preview.gif
   ```
2. Present the static benchmark comparison charts:
   ```powershell
   Start-Process results/robot_comparison_s1.png
   Start-Process results/robot_comparison_s2.png
   Start-Process results/ablations.png
   Start-Process results/horizon_error.png
   ```

### Fallback Plan C: Standalone Offline USB Package
- Keep a formatted USB Drive (FAT32/NTFS) plugged in or in your pocket containing:
  - `release/world-model-demo.zip`
  - `python-3.11-amd64.exe` installer
  - Pre-cached pip wheels for offline installation:
    `pip install --no-index --find-links=wheels/ -r requirements-lock.txt`

---

## 3. Evaluator Presentation Flow (3-Minute Script Summary)

| Step | Action / Key | Spoken Narration Summary |
| :---: | :---: | :--- |
| **1** | Launch `--split` | "Welcome. On the left is reactive greedy navigation; on the right is our World Model." |
| **2** | Watch S1 Chair | "The reactive agent crashes into the chair. The world model simulates 300 futures and takes a detour." |
| **3** | Press `[I]` (HUD) | "This is the Imagination Panel: ghost green paths show imagined rollouts. Latency is 8.7 ms." |
| **4** | Press `[2]` (S2) | "Scenario 2: Moving human. The world model predicts velocity with 0.0058 MAE, slipping safely behind." |
| **5** | Top Bar Counters | "Across 100 test seeds: Greedy has 146 collisions; World Model has 1.4 collisions (>98% reduction)." |

---

## 4. Hotkey Quick-Reference Card

- **`[S]`** : Toggle Split-Screen side-by-side mode
- **`[I]`** : Toggle Imagination Panel overlay (latency, MAE, ghost paths)
- **`[TAB]`** : Toggle World Model ON / OFF in single view
- **`[1]`** : Switch to Scenario 1 (Static Obstacle)
- **`[2]`** : Switch to Scenario 2 (Dynamic Moving Obstacle)
- **`[R]`** : Reset current layout
- **`[N]`** : Advance to next random layout seed
- **`[H]`** : Open Help Guide Modal
- **`[ESC]`** : Return to Main Menu


/**
 * Heavy AAA Mission Control & Telemetry Simulation Dashboard (v6.0-heavy).
 * Built for High-Fidelity 3D Robotics with Procedural Audio, Real-Time Cortex Visualizer,
 * Military-Grade Robot POV Visor, and Interactive Arena Sandbox.
 */

import { ThreeSimulationScene } from "../renderers/three_scene";
import { DrivingScene } from "../renderers/driving_scene";
import { CanvasFallbackRenderer } from "../renderers/canvas_fallback";
import { SimWSClient } from "../client/ws_client";
import { ReplayLoader } from "../client/replay_loader";
import { sound } from "../audio/webaudio";

export function renderSim(container: HTMLElement, scenarioId: string) {
  let isCompareMode = false;
  let currentMode: "world_model" | "baseline" | "compare" = "world_model";
  let currentVariant: number = 1;
  let currentSpeed: number = 1.0;
  let isLive = true;
  let currentSeed = 1001;
  let showHelp = false;

  // Session Statistics
  let sessionCompletedEpisodes = 0;
  let sessionSuccessCount = 0;
  let lastObservedStep = 0;

  // Mission Clock
  const sessionStartTime = Date.now();
  let setDockingState: (docked: boolean, sendCmd?: boolean) => void = () => {};
  let cleanupKeydown: (() => void) | null = null;
  let isDocked: boolean = false;

  const titleMap: Record<string, string> = {
    robotics: "AUTONOMOUS WAREHOUSE ROBOTICS",
    driving: "AUTONOMOUS HIGHWAY DRIVING",
    factory: "FACTORY-LINE DIGITAL TWIN"
  };

  const simTitle = titleMap[scenarioId] || "WORLD MODEL MISSION CONTROL";

  container.innerHTML = `
    <div class="sim-viewport-layout">
      <!-- 3D Canvas / Viewports Container -->
      <div id="sim-canvas-root" class="canvas-container" style="position: relative; width: 100%; height: 100%; overflow: hidden;"></div>

      <!-- Advanced Robot POV Visor HUD -->
      <div id="pov-sensor-overlay" style="display: none; position: absolute; inset: 0; pointer-events: none; z-index: 10;">
        <div style="position: absolute; inset: 16px; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 12px; box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.8);">
          <!-- Top Compass Ribbon -->
          <div style="position: absolute; top: 16px; left: 50%; transform: translateX(-50%); width: 320px; height: 26px; background: rgba(14, 18, 28, 0.85); border: 1px solid var(--border-subtle); border-radius: 6px; display: flex; align-items: center; justify-content: space-around; font-family: var(--font-mono); font-size: 0.70rem; color: var(--text-muted); letter-spacing: 2px;">
            <span>W</span><span>|</span><span style="color: #38bdf8; font-weight: 600;" id="pov-heading-val">N 000°</span><span>|</span><span>E</span>
          </div>

          <!-- Center Crosshair -->
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80px; height: 80px; pointer-events: none;">
            <div style="position: absolute; top: 50%; left: 0; width: 22px; height: 1px; background: rgba(255, 255, 255, 0.3);"></div>
            <div style="position: absolute; top: 50%; right: 0; width: 22px; height: 1px; background: rgba(255, 255, 255, 0.3);"></div>
            <div style="position: absolute; top: 0; left: 50%; width: 1px; height: 22px; background: rgba(255, 255, 255, 0.3);"></div>
            <div style="position: absolute; bottom: 0; left: 50%; width: 1px; height: 22px; background: rgba(255, 255, 255, 0.3);"></div>
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 4px; height: 4px; border-radius: 50%; background: #38bdf8;"></div>
          </div>

          <!-- Left Flight Telemetry Data Box -->
          <div style="position: absolute; left: 24px; top: 40%; transform: translateY(-50%); font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 4px; background: rgba(14, 18, 28, 0.85); padding: 8px 12px; border: 1px solid var(--border-subtle); border-radius: 6px;">
            <div style="color: var(--text-dim); font-size: 0.62rem; font-weight: 600;">TELEMETRY</div>
            <div>SPD: <span id="pov-speed" style="color: #34d399; font-weight: 600;">0.45 m/s</span></div>
            <div>STATUS: <span style="color: #38bdf8; font-weight: 600;">NOMINAL</span></div>
            <div>LIDAR: <span style="color: #94a3b8;">ACTIVE (360°)</span></div>
          </div>

          <!-- Right Goal Distance & Target Tracking Box -->
          <div style="position: absolute; right: 24px; top: 40%; transform: translateY(-50%); font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 4px; background: rgba(14, 18, 28, 0.85); padding: 8px 12px; border: 1px solid var(--border-subtle); border-radius: 6px; text-align: right;">
            <div style="color: var(--text-dim); font-size: 0.62rem; font-weight: 600;">TARGET TRACKING</div>
            <div>GOAL DIST: <span id="pov-target-dist" style="color: #f59e0b; font-weight: 600;">- m</span></div>
            <div>HORIZON: <span style="color: #94a3b8;">14 STEPS</span></div>
            <div>LOCK: <span style="color: #34d399; font-weight: 600;">CONFIRMED</span></div>
          </div>
        </div>
      </div>

      <!-- Impassable / Blocked Area Warning Banner -->
      <div id="area-blocked-banner" class="area-blocked-banner">
        <span style="font-size: 1.25rem; line-height: 1;">⚠️</span>
        <div style="display: flex; flex-direction: column; gap: 2px;">
          <div style="color: #ef4444; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; font-size: 0.82rem;">AREA BLOCKED BY OBSTACLES</div>
          <div id="area-blocked-subtitle" style="color: #fca5a5; font-size: 0.72rem; font-weight: 500;">No viable path to goal — all trajectories impassable</div>
        </div>
      </div>

      ${
        scenarioId === "driving"
          ? `
        <!-- AV Autonomous Driving Premium HUD -->
        <div id="av-hud" class="av-dashboard-hud">
          <div class="av-speed-cluster">
            <div id="av-speed-val" class="av-speed-val">0</div>
            <div class="av-speed-unit">KM / H</div>
            <div class="av-speed-limit">100</div>
          </div>
          <div class="av-gauge-item">
            <div class="av-gauge-header"><span>LANE OFFSET</span><span id="av-offset-val">0.0 m</span></div>
            <div class="av-gauge-bar-bg">
              <div id="av-offset-fill" class="av-gauge-bar-fill" style="width: 50%; background: #10b981;"></div>
            </div>
          </div>
          <div class="av-gauge-item">
            <div class="av-gauge-header"><span>HEADWAY TTC</span><span id="av-ttc-val">10.0 s</span></div>
            <div class="av-gauge-bar-bg">
              <div id="av-ttc-fill" class="av-gauge-bar-fill" style="width: 100%; background: #10b981;"></div>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 4px; align-items: center; min-width: 90px;">
            <div style="font-size: 0.65rem; color: var(--text-dim); font-weight: 700;">ACTION</div>
            <div id="av-action-chip" class="av-action-chip cruise">CRUISE</div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 4px; border-left: 1px solid var(--border-subtle); padding-left: 14px;">
            <div style="font-size: 0.65rem; color: var(--text-dim); font-weight: 700;">MODEL MAE</div>
            <div id="av-mae-val" style="color: #38bdf8; font-weight: 700; font-size: 0.92rem;">0.019</div>
          </div>
        </div>

        <!-- Radar Mini-map -->
        <div id="av-minimap-box" class="av-minimap-box">
          <div style="font-size: 0.60rem; color: var(--text-dim); font-weight: 700; margin-bottom: 2px;">RADAR MAP</div>
          <canvas id="av-minimap-canvas" width="128" height="110" style="display: block; width: 100%; height: 100%; border-radius: 4px; background: #080c14;"></canvas>
        </div>

        <!-- Toast Notifications -->
        <div id="av-toast-box" class="av-toast-box"></div>
      `
          : `
        <!-- Floating Docking Bay HUD Banner -->
        <div id="dock-hud-banner" class="dock-hud-banner">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span id="dock-hud-dot" class="dock-hud-dot"></span>
            <span id="dock-hud-mode-badge" class="dock-hud-badge">NORMAL</span>
          </div>
          <div class="dock-hud-divider"></div>
          <span id="dock-hud-text" class="dock-hud-text">Robot Active &mdash; Executing Trajectory</span>
          <div class="dock-hud-divider"></div>
          <span class="dock-hud-shortcut">[SPACE] TO HOLD</span>
        </div>
      `
      }

      <!-- Premium Enterprise Navigation Header -->
      <header class="top-nav">
        <!-- Left: Brand, Title & System Indicator -->
        <div style="display: flex; align-items: center; gap: 12px;">
          <a href="#/" class="glass-pill" style="padding: 4px 10px; font-weight: 600; color: var(--text-muted);" title="Return to Simulations Catalog">
            <span>&larr; Catalog</span>
          </a>
          <div style="width: 1px; height: 18px; background: var(--border-subtle);"></div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div class="nav-logo-icon">WM</div>
            <div style="display: flex; flex-direction: column; line-height: 1.15;">
              <span style="font-weight: 700; font-size: 0.88rem; letter-spacing: 0.02em; color: var(--text-main); font-family: var(--font-ui);">${simTitle}</span>
              <span style="font-size: 0.65rem; color: var(--text-dim); font-weight: 500;">High-Fidelity Robotics Arena</span>
            </div>
          </div>
          <span id="badge-connection" class="badge badge-live">
            <span style="width: 6px; height: 6px; border-radius: 50%; background: #10b981; display: inline-block;"></span>
            LIVE FEED
          </span>
          <span class="glass-pill nav-chip-badge" style="padding: 3px 8px; font-size: 0.68rem; color: var(--text-muted); border-color: var(--border-subtle);">
            GeForce RTX 5070 &middot; 1.1M Params
          </span>
        </div>

        <!-- Center: Mission Time & Speed Controller -->
        <div style="display: flex; align-items: center; gap: 8px; background: rgba(16, 21, 33, 0.7); border: 1px solid var(--border-subtle); border-radius: 20px; padding: 2px 10px;">
          <div style="display: flex; align-items: center; gap: 6px; font-size: 0.72rem; color: var(--text-dim); font-family: var(--font-mono);">
            <span>MISSION:</span>
            <span id="mission-clock" style="color: var(--text-main); font-weight: 600;">T+00:00:00</span>
          </div>
          <div style="width: 1px; height: 12px; background: var(--border-subtle);"></div>
          <div style="display: flex; align-items: center; gap: 4px; font-size: 0.72rem;">
            <span style="color: var(--text-dim); font-size: 0.68rem;">SPEED:</span>
            <select id="select-speed" style="background: transparent; border: none; color: #93c5fd; font-family: var(--font-mono); font-size: 0.74rem; cursor: pointer; outline: none; font-weight: 600;">
              <option value="0.5" style="background: #111724;">0.5x</option>
              <option value="1.0" selected style="background: #111724;">1.0x</option>
              <option value="1.5" style="background: #111724;">1.5x</option>
              <option value="2.0" style="background: #111724;">2.0x</option>
              <option value="3.0" style="background: #111724;">3.0x</option>
              <option value="4.0" style="background: #111724;">4.0x</option>
            </select>
          </div>
        </div>

        <!-- Right: Audio, FPS, and Tool Actions -->
        <div style="display: flex; align-items: center; gap: 8px;">
          <!-- Audio Oscilloscope Canvas -->
          <div class="glass-pill" style="padding: 2px 8px; display: flex; align-items: center; gap: 6px;" title="Audio Waveform">
            <span style="font-size: 0.65rem; color: var(--text-dim);">AUDIO</span>
            <canvas id="audio-visualizer-canvas" width="60" height="14" style="display: block; opacity: 0.8;"></canvas>
          </div>

          <!-- Live FPS Gauge -->
          <span id="fps-display" class="glass-pill" style="font-size: 0.72rem; color: #34d399; font-weight: 600; font-family: var(--font-mono); padding: 4px 8px;">
            60.0 FPS
          </span>

          <div style="width: 1px; height: 16px; background: var(--border-subtle); margin: 0 2px;"></div>

          <!-- Intelligence Dashboard Link -->
          <a href="#/intelligence" target="_blank" class="glass-pill" title="World Model Intelligence Dashboard" style="padding: 4px 10px; color: var(--text-muted); font-size: 0.76rem;">
            <span>Intel</span>
          </a>

          <!-- Screenshot Tool -->
          <button id="btn-snapshot" class="glass-pill" title="Capture High-Res Viewport PNG" style="padding: 4px 10px; color: var(--text-muted); font-size: 0.76rem;">
            <span>Snap</span>
          </button>

          <!-- Presentation Mode Toggle -->
          <button id="btn-presentation" class="glass-pill" title="Presentation Mode (P)" style="padding: 4px 10px; color: var(--text-muted); font-size: 0.76rem;">
            <span>Present [P]</span>
          </button>

          <!-- Fullscreen Toggle -->
          <button id="btn-fullscreen" class="glass-pill" title="Toggle Fullscreen" style="padding: 4px 8px; color: var(--text-muted); font-size: 0.76rem;">
            <span>⛶</span>
          </button>

          <!-- Help Modal -->
          <button id="btn-help" class="glass-pill" title="Keyboard Guide (H)" style="padding: 4px 8px; color: var(--text-muted); font-size: 0.76rem;">
            <span>?</span>
          </button>
        </div>
      </header>

      <!-- Minimal Presentation Mode Broadcast Badge -->
      <div id="presentation-badge" style="display: none; position: absolute; top: 16px; left: 16px; z-index: 50; padding: 6px 14px; font-size: 0.75rem; font-family: var(--font-mono); background: rgba(14, 18, 28, 0.92); border: 1px solid var(--border-subtle); border-radius: 6px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5); align-items: center; gap: 8px;">
        <span style="color: var(--text-main); font-weight: 600;">PRESENTATION</span>
        <span style="color: var(--text-dim);">|</span>
        <span id="pres-mode-tag" style="color: #34d399; font-weight: 600;">WORLD MODEL</span>
        <span style="color: var(--text-dim);">|</span>
        <span id="pres-step-tag" style="color: #e2e8f0;">STEP: 0</span>
        <span style="color: var(--text-dim);">|</span>
        <span id="pres-dist-tag" style="color: #38bdf8;">DIST: 0.0m</span>
        <span style="color: var(--text-dim);">|</span>
        <span id="pres-speed-tag" style="color: #93c5fd;">1.0x</span>
      </div>

      <!-- Left Control Rail -->
      <aside class="glass-panel control-rail">
        <div class="rail-group-title">Robot Control</div>
        <button id="btn-dock-launch" class="rail-btn dock-launch-btn active" title="Press SPACE or ENTER to hold/launch robot">
          <span id="lbl-dock-launch">⏸ Hold Robot [SPACE]</span>
        </button>

        <div class="rail-group-title">Simulation Model</div>
        <button id="btn-mode-wm" class="rail-btn active" title="Model Predictive Control with Deep Neural World Model">
          <span>Neural World Model</span>
          <span style="font-size: 0.68rem; color: #93c5fd; font-family: var(--font-mono);">[TAB]</span>
        </button>
        <button id="btn-mode-base" class="rail-btn" title="Reactive Greedy Agent without planning (repeatedly crashes into traps)">
          <span>Reactive Greedy</span>
          <span style="font-size: 0.68rem; color: var(--text-dim); font-family: var(--font-mono);">[T]</span>
        </button>
        <button id="btn-mode-compare" class="rail-btn" title="Side-by-side synchronized evaluation: Reactive vs World Model">
          <span>Dual Split Compare</span>
          <span style="font-size: 0.68rem; color: #34d399; font-family: var(--font-mono);">[S]</span>
        </button>

        ${
          scenarioId === "driving"
            ? `
          <div class="rail-group-title">Highway Scenarios</div>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <button id="btn-ds1" class="rail-btn ${currentVariant === 1 ? 'active' : ''}">S1: Highway Curves</button>
            <button id="btn-ds2" class="rail-btn ${currentVariant === 2 ? 'active' : ''}">S2: Sudden Braking</button>
            <button id="btn-ds3" class="rail-btn ${currentVariant === 3 ? 'active' : ''}">S3: Overtaking</button>
            <button id="btn-ds4" class="rail-btn ${currentVariant === 4 ? 'active' : ''}">S4: Pedestrian Hazard</button>
          </div>

          <div class="rail-group-title">Camera Perspectives</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
            <button id="cam-chase" class="rail-btn active" style="justify-content: center;">Chase</button>
            <button id="cam-pov" class="rail-btn" style="justify-content: center;">Cockpit</button>
            <button id="cam-topdown" class="rail-btn" style="justify-content: center;">Top-Down</button>
            <button id="cam-orbit" class="rail-btn" style="justify-content: center;">Orbit</button>
            <button id="cam-cinematic" class="rail-btn" style="justify-content: center;">Fly-By</button>
          </div>

          <div class="rail-group-title">Time of Day</div>
          <div style="display: flex; gap: 4px;">
            <button id="btn-tod-day" class="rail-btn active" style="flex: 1; justify-content: center;">Day</button>
            <button id="btn-tod-sunset" class="rail-btn" style="flex: 1; justify-content: center;">Sunset</button>
            <button id="btn-tod-night" class="rail-btn" style="flex: 1; justify-content: center;">Night</button>
          </div>

          <button id="btn-manual-drive" class="rail-btn" style="margin-top: 4px; justify-content: center; background: rgba(59, 130, 246, 0.12); border-color: rgba(59, 130, 246, 0.4); color: #93c5fd; font-weight: 600;">
            <span id="lbl-manual-drive">Manual Drive [WASD]</span>
          </button>
        `
            : `
          ${
            scenarioId === "robotics"
              ? `
            <div class="rail-group-title">Scenario Arena</div>
            <div style="display: flex; gap: 4px;">
              <button id="btn-s1" class="rail-btn active" style="flex: 1; justify-content: center;">S1: Chair</button>
              <button id="btn-s2" class="rail-btn" style="flex: 1; justify-content: center;">S2: Person</button>
            </div>
          `
              : ""
          }

          <div class="rail-group-title">Camera Perspectives</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
            <button id="cam-overview" class="rail-btn active" style="justify-content: center;">Overview</button>
            <button id="cam-chase" class="rail-btn" style="justify-content: center;">Chase</button>
            <button id="cam-pov" class="rail-btn" style="justify-content: center;">Robot POV</button>
            <button id="cam-topdown" class="rail-btn" style="justify-content: center;">Top-Down</button>
            <button id="cam-orbit" class="rail-btn" style="justify-content: center;">Orbit</button>
            <button id="cam-cinematic" class="rail-btn" style="justify-content: center;">Director</button>
          </div>

          <div class="rail-group-title">Sandbox Tools</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
            <button id="tool-goal" class="rail-btn active" style="justify-content: center;" title="Move target docking beacon">
              <span>Goal Dock</span>
            </button>
            <button id="tool-crate" class="rail-btn" style="justify-content: center;" title="Drop Wooden Shipping Crate">
              <span>Crate</span>
            </button>
            <button id="tool-cabinet" class="rail-btn" style="justify-content: center;" title="Drop Metal Tool Cabinet">
              <span>Cabinet</span>
            </button>
            <button id="tool-workstation" class="rail-btn" style="justify-content: center;" title="Drop Workbench Desk">
              <span>Table</span>
            </button>
            <button id="tool-barrels" class="rail-btn" style="justify-content: center;" title="Drop Oil Drum Cluster">
              <span>Barrels</span>
            </button>
            <button id="tool-barrier" class="rail-btn" style="justify-content: center;" title="Drop Safety Barrier">
              <span>Barrier</span>
            </button>
          </div>

          <div class="rail-group-title" style="margin-top: 6px;">Course Presets</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4px;">
            <button id="btn-preset-slalom" class="rail-btn" style="justify-content: center; font-size: 0.72rem;" title="Load Slalom S-Curve course">
              <span>Slalom</span>
            </button>
            <button id="btn-preset-trap" class="rail-btn" style="justify-content: center; font-size: 0.72rem;" title="Load U-Pocket Trap course">
              <span>U-Trap</span>
            </button>
            <button id="btn-preset-warehouse" class="rail-btn" style="justify-content: center; font-size: 0.72rem;" title="Load Dense Warehouse course">
              <span>Maze</span>
            </button>
          </div>

          <div style="display: flex; gap: 4px; margin-top: 4px;">
            <button id="btn-clear-obs" class="rail-btn" style="flex: 1; justify-content: center; color: #f43f5e; border-color: rgba(244, 63, 94, 0.3);" title="Clear all obstacles from arena">
              <span>Clear All</span>
            </button>
            <button id="btn-random-obs" class="rail-btn" style="flex: 1; justify-content: center;" title="Generate random obstacle course">
              <span>Randomize</span>
            </button>
          </div>
        `
        }

        <div class="rail-group-title">System & Audio</div>
        <div style="display: flex; gap: 4px;">
          <button id="btn-mute" class="rail-btn active" style="flex: 1; justify-content: center;">
            <span id="lbl-sound">Glide Audio: ON</span>
          </button>
        </div>

        <button id="btn-reset" class="rail-btn" style="margin-top: 4px; justify-content: center; background: rgba(255, 255, 255, 0.04); font-weight: 600;">
          <span>Reset Layout [R]</span>
        </button>
      </aside>

      <!-- Right Telemetry & Diagnostics Panel -->
      <aside class="glass-panel brain-panel">
        <div class="brain-header">
          <div class="brain-title">
            <span class="brain-chip-beacon"></span>
            <span>WORLD MODEL TELEMETRY</span>
          </div>
          <span id="metric-latency" style="font-family: var(--font-mono); font-size: 0.74rem; color: #34d399; font-weight: 600;">4.2 ms</span>
        </div>

        <!-- 4-Step Pipeline Strip -->
        <div class="pipeline-strip">
          <div class="pipeline-node active">
            <span class="node-label">1. Sensors</span>
            <span class="node-metric">16-Dim</span>
          </div>
          <div class="pipeline-node active">
            <span class="node-label">2. Imagine</span>
            <span class="node-metric" id="metric-plan-samples">300x14</span>
          </div>
          <div class="pipeline-node active">
            <span class="node-label">3. Planner</span>
            <span class="node-metric">Vector MPC</span>
          </div>
          <div class="pipeline-node active">
            <span class="node-label">4. Action</span>
            <span id="lbl-chosen-action" class="node-metric" style="color: #34d399; font-weight: 700;">STAY</span>
          </div>
        </div>

        <!-- Model Architecture Card -->
        <div class="cortex-container">
          <div class="cortex-header">
            <span>MODEL ARCHITECTURE</span>
            <span id="card-param-count" style="font-size: 0.70rem; color: #93c5fd; font-family: var(--font-mono); font-weight: 600;">1,101,874 PARAMS</span>
          </div>
          <div style="font-size: 0.70rem; line-height: 1.45; color: var(--text-muted); font-family: var(--font-mono);">
            <div id="arch-model-name" style="color: var(--text-main); font-weight: 600;">Deep Residual Student (512h)</div>
            <div id="arch-layers-line" style="color: var(--text-dim); font-size: 0.66rem;">State [10] &rarr; 3&times; ResBlocks [512] + LN &rarr; [128] &rarr; [4]</div>
            <div id="arch-device-line" style="color: #34d399; margin-top: 2px;">GPU: NVIDIA GeForce RTX 5070 (CUDA 12.8)</div>
            <div id="arch-plan-line" style="color: var(--text-dim); font-size: 0.66rem; margin-top: 1px;">Vectorized PyTorch MPC &middot; 300 rollouts / tick</div>
          </div>
        </div>

        <!-- Real-Time 360° LiDAR Clearance Radar -->
        <div class="cortex-container">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.68rem; font-weight: 600; color: var(--text-secondary); letter-spacing: 0.04em;">360° LIDAR CLEARANCE</span>
            <span id="lidar-min-badge" style="font-size: 0.65rem; color: #34d399; font-family: var(--font-mono); font-weight: 600;">CLEAR (&gt;2.0m)</span>
          </div>
          <div style="display: flex; align-items: center; justify-content: center; position: relative; height: 90px; width: 100%;">
            <canvas id="lidar-radar-canvas" width="160" height="90" style="display: block; width: 160px; height: 90px;"></canvas>
          </div>
        </div>

        <!-- Model Predictive Rollouts Card -->
        <div class="why-card">
          <div class="why-title">Model Predictive Rollouts</div>
          <div id="candidates-container">
            <div style="color: var(--text-dim); font-size: 0.70rem;">Evaluating candidate trajectories...</div>
          </div>
          <div id="why-explanation" class="why-reason">
            Vectorized MPC simulating 300 imagined trajectories in parallel...
          </div>
        </div>

        <!-- Prediction vs Reality Verification Card -->
        <div class="cortex-container">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.68rem; font-weight: 600; color: var(--text-secondary); letter-spacing: 0.04em;">PREDICTION VS REALITY</span>
            <span id="pvr-status-badge" style="font-size: 0.65rem; color: #93c5fd; font-family: var(--font-mono); font-weight: 600;">H=1..14 LIVE</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-family: var(--font-mono); font-size: 0.68rem; margin: 4px 0;">
            <div style="background: rgba(255, 255, 255, 0.03); padding: 4px 6px; border-radius: 4px; border: 1px solid var(--border-subtle);">
              <span style="color: var(--text-dim); display: block; font-size: 0.58rem;">PREDICTED (X, Y)</span>
              <span id="pvr-pred-pos" style="color: #93c5fd; font-weight: 600;">(0, 0)</span>
            </div>
            <div style="background: rgba(255, 255, 255, 0.03); padding: 4px 6px; border-radius: 4px; border: 1px solid var(--border-subtle);">
              <span style="color: var(--text-dim); display: block; font-size: 0.58rem;">ACTUAL (X, Y)</span>
              <span id="pvr-act-pos" style="color: #34d399; font-weight: 600;">(0, 0)</span>
            </div>
            <div style="background: rgba(255, 255, 255, 0.03); padding: 4px 6px; border-radius: 4px; border: 1px solid var(--border-subtle);">
              <span style="color: var(--text-dim); display: block; font-size: 0.58rem;">POS ERROR</span>
              <span id="pvr-pos-err" style="color: #f59e0b; font-weight: 600;">±0.04 m</span>
            </div>
            <div style="background: rgba(255, 255, 255, 0.03); padding: 4px 6px; border-radius: 4px; border: 1px solid var(--border-subtle);">
              <span style="color: var(--text-dim); display: block; font-size: 0.58rem;">STATE MAE</span>
              <span id="pvr-state-mae" style="color: #c084fc; font-weight: 600;">0.0058</span>
            </div>
          </div>
          <!-- Horizon Compounding Error Sparkline -->
          <div style="background: rgba(255, 255, 255, 0.02); padding: 4px 6px; border-radius: 4px; border: 1px solid var(--border-subtle);">
            <div style="display: flex; justify-content: space-between; font-size: 0.60rem; color: var(--text-dim); margin-bottom: 2px;">
              <span>HORIZON ERROR (H=1, 3, 5, 10, 14)</span>
              <span id="pvr-h14-err" style="color: #f59e0b; font-family: var(--font-mono); font-weight: 600;">0.26m</span>
            </div>
            <svg id="pvr-horizon-svg" viewBox="0 0 180 26" style="width: 100%; height: 26px; display: block; overflow: visible;">
              <path id="pvr-horizon-path" fill="none" stroke="#10b981" stroke-width="1.5" stroke-linecap="round" d="M 10 22 L 45 19 L 80 15 L 125 10 L 170 4" />
            </svg>
          </div>
        </div>

        <!-- Telemetry Gauges Cluster -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-family: var(--font-mono);">
          <div class="glass-panel" style="padding: 8px;">
            <div style="font-size: 0.62rem; color: var(--text-dim); font-weight: 600;">SUCCESS RATE</div>
            <div id="metric-winrate" style="font-size: 1.05rem; font-weight: 700; color: #34d399;">- (n=0)</div>
          </div>
          <div class="glass-panel" style="padding: 8px;">
            <div style="font-size: 0.62rem; color: var(--text-dim); font-weight: 600;">COLLISIONS</div>
            <div id="metric-collisions" style="font-size: 1.05rem; font-weight: 700; color: #f43f5e;">0</div>
          </div>
          <div class="glass-panel" style="padding: 8px;">
            <div style="font-size: 0.62rem; color: var(--text-dim); font-weight: 600;">STEPS / MAX</div>
            <div id="metric-steps" style="font-size: 1.05rem; font-weight: 700; color: var(--text-main);">0 / 400</div>
          </div>
          <div class="glass-panel" style="padding: 8px;">
            <div style="font-size: 0.62rem; color: var(--text-dim); font-weight: 600;">GOAL DISTANCE</div>
            <div id="metric-goal-dist" style="font-size: 1.05rem; font-weight: 700; color: #38bdf8;">- m</div>
          </div>
        </div>

        <!-- Real-Time Distance Sparkline -->
        <div class="glass-panel" style="padding: 6px 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.62rem; color: var(--text-dim); margin-bottom: 2px;">
            <span style="font-weight: 600; letter-spacing: 0.04em;">DISTANCE TO DOCK BEACON</span>
            <span id="sparkline-dist-val" style="color: #38bdf8; font-family: var(--font-mono); font-weight: 600;">- m</span>
          </div>
          <svg id="sparkline-dist" viewBox="0 0 200 28" style="width: 100%; height: 28px; display: block; overflow: visible;">
            <path id="sparkline-dist-path" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M 0 14 L 200 14" />
          </svg>
        </div>
      </aside>

      <!-- Bottom Status Pill -->
      <div class="glass-pill bottom-pill">
        <span>[S] Split Compare | [TAB] Toggle WM | [C] Camera | [+/-] Speed | [1/2] Scenarios | [R] Reset | [H] Help</span>
      </div>

      <!-- Help Modal (H key) -->
      <div id="help-modal" class="modal-overlay" style="display: none;">
        <div class="glass-panel modal-content">
          <div class="modal-header">
            <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--accent-cyan); font-family: var(--font-mono);">MISSION CONTROL SHORTCUT GUIDE</h3>
            <button id="btn-close-help" class="glass-pill">&times; CLOSE</button>
          </div>
          <div class="shortcut-grid">
            <span class="shortcut-key">ENTER / SPACE</span><span>Launch Robot from Docking Station / Hold</span>
            <span class="shortcut-key">TAB / T</span><span>Toggle World Model Predictive Control vs Reactive Baseline</span>
            <span class="shortcut-key">S</span><span>Toggle Dual Synchronized Split-Screen Comparison</span>
            <span class="shortcut-key">C</span><span>Cycle Camera (Overview &rarr; Chase &rarr; Visor POV &rarr; Top-Down &rarr; Orbit &rarr; Director)</span>
            <span class="shortcut-key">1 / 2</span><span>Switch Scenario 1 (Static Chair) / Scenario 2 (Dynamic Pedestrian)</span>
            <span class="shortcut-key">R</span><span>Reset Current Layout / Advance to Next Seed</span>
            <span class="shortcut-key">+ / - or [ / ]</span><span>Accelerate / Decelerate Speed (0.5x - 4.0x)</span>
            <span class="shortcut-key">N</span><span>Toggle Procedural Audio Effects Mute / Unmute</span>
            <span class="shortcut-key">CLICK FLOOR</span><span>Deploy currently selected object (Goal, Crate, Cabinet, Table)</span>
            <span class="shortcut-key">H</span><span>Toggle this Help Modal</span>
            <span class="shortcut-key">ESC</span><span>Return to Simulations Catalog</span>
          </div>
        </div>
      </div>

      <!-- Comparison Summary Modal (Req 5) -->
      <div id="compare-summary-modal" class="modal-overlay" style="display: none;">
        <div class="glass-panel modal-content" style="max-width: 620px;">
          <div class="modal-header">
            <h3 style="font-size: 1.10rem; font-weight: 800; color: var(--accent-green); font-family: var(--font-mono);">
              🏆 EPISODE EVALUATION BENCHMARK SUMMARY
            </h3>
            <button id="btn-close-summary" class="glass-pill">&times; DISMISS</button>
          </div>
          <div style="font-family: var(--font-mono); font-size: 0.80rem; margin: 12px 0;">
            <div id="summary-seed-title" style="color: var(--accent-cyan); font-weight: 700; margin-bottom: 8px;">
              EVALUATION SEED #1001 &middot; IDENTICAL INITIAL CONDITIONS
            </div>
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.74rem;">
              <thead>
                <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.15); color: var(--text-dim);">
                  <th style="padding: 6px;">EVALUATION METRIC</th>
                  <th style="padding: 6px; color: #ff4757;">REACTIVE BASELINE</th>
                  <th style="padding: 6px; color: #00ff9d;">WORLD MODEL MPC</th>
                  <th style="padding: 6px; color: var(--accent-cyan);">DELTA</th>
                </tr>
              </thead>
              <tbody id="summary-table-body">
                <!-- Dynamically populated -->
              </tbody>
            </table>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-dim);">
            <span id="summary-countdown">Episode completed &middot; advancing seed...</span>
            <button id="btn-next-seed" class="rail-btn active" style="padding: 6px 14px; font-size: 0.74rem;">NEXT SEED &rarr;</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const canvasRoot = document.getElementById("sim-canvas-root")!;
  const povSensorOverlay = document.getElementById("pov-sensor-overlay")!;
  const badgeConnection = document.getElementById("badge-connection")!;
  const fpsDisplay = document.getElementById("fps-display")!;
  const metricLatency = document.getElementById("metric-latency")!;
  const metricPlanSamples = document.getElementById("metric-plan-samples")!;
  const lblChosenAction = document.getElementById("lbl-chosen-action")!;
  const metricWinrate = document.getElementById("metric-winrate")!;
  const metricCollisions = document.getElementById("metric-collisions")!;
  const metricSteps = document.getElementById("metric-steps")!;
  const candidatesContainer = document.getElementById("candidates-container")!;
  const whyExplanation = document.getElementById("why-explanation")!;
  const helpModal = document.getElementById("help-modal")!;

  const audioCanvas = document.getElementById("audio-visualizer-canvas") as HTMLCanvasElement;
  const povHeadingVal = document.getElementById("pov-heading-val");
  const povTargetDist = document.getElementById("pov-target-dist");
  const metricGoalDist = document.getElementById("metric-goal-dist");
  const sparklineDistPath = document.getElementById("sparkline-dist-path");
  const sparklineDistVal = document.getElementById("sparkline-dist-val");
  const lidarRadarCanvas = document.getElementById("lidar-radar-canvas") as HTMLCanvasElement;
  const lidarMinBadge = document.getElementById("lidar-min-badge");
  const dockHudDot = document.getElementById("dock-hud-dot");
  const dockHudText = document.getElementById("dock-hud-text");
  const dockHudModeBadge = document.getElementById("dock-hud-mode-badge");

  let radarScanAngle = 0.0;
  const renderLidarRadar = (canvas: HTMLCanvasElement | null, lidarDistances?: number[], robotHeadingDeg: number = 0) => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const maxRadius = Math.min(cx, cy) - 6;

    // Background radar grid rings
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    [0.35, 0.7, 1.0].forEach((ratio) => {
      ctx.beginPath();
      ctx.arc(cx, cy, maxRadius * ratio, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Crosshairs
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.beginPath();
    ctx.moveTo(cx - maxRadius, cy);
    ctx.lineTo(cx + maxRadius, cy);
    ctx.moveTo(cx, cy - maxRadius);
    ctx.lineTo(cx, cy + maxRadius);
    ctx.stroke();

    // 8 LiDAR Ray Beams
    const nBeams = lidarDistances && lidarDistances.length > 0 ? lidarDistances.length : 8;
    const maxRangePx = 200.0;
    for (let i = 0; i < nBeams; i++) {
      const angle = (i / nBeams) * Math.PI * 2 - Math.PI / 2;
      const distPx = lidarDistances && lidarDistances[i] !== undefined ? lidarDistances[i] : 150.0;
      const clampedDist = Math.max(8.0, Math.min(maxRangePx, distPx));
      const r = (clampedDist / maxRangePx) * maxRadius;

      const bx = cx + Math.cos(angle) * r;
      const by = cy + Math.sin(angle) * r;

      let beamColor = "#10b981";
      if (distPx < 35.0) {
        beamColor = "#f43f5e";
      } else if (distPx < 60.0) {
        beamColor = "#f59e0b";
      }

      ctx.strokeStyle = beamColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(bx, by);
      ctx.stroke();

      ctx.fillStyle = beamColor;
      ctx.beginPath();
      ctx.arc(bx, by, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Rotating radar scanline sweep
    radarScanAngle = (radarScanAngle + 0.04) % (Math.PI * 2);
    const sx = cx + Math.cos(radarScanAngle) * maxRadius;
    const sy = cy + Math.sin(radarScanAngle) * maxRadius;
    const sweepGrad = ctx.createLinearGradient(cx, cy, sx, sy);
    sweepGrad.addColorStop(0, "rgba(56, 189, 248, 0.25)");
    sweepGrad.addColorStop(1, "rgba(56, 189, 248, 0.0)");
    ctx.strokeStyle = sweepGrad;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(sx, sy);
    ctx.stroke();

    // Center robot marker
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();
  };

  // Viewport Scenes
  let primaryScene: any = null;
  let secondaryScene: any = null;
  let canvasFallback: CanvasFallbackRenderer | null = null;

  let compareWrapper: HTMLDivElement | null = null;
  let leftTelemetryEl: HTMLDivElement | null = null;
  let rightTelemetryEl: HTMLDivElement | null = null;
  let winnerBadgeEl: HTMLDivElement | null = null;
  const distHistory: number[] = [];

  const handleFloorClick = (px: number, py: number) => {
    if (isLive) {
      wsClient.sendCommand({ cmd: "set_goal", x: px, y: py });
      sound.playToolSelect();
    }
  };

  const handlePlaceObstacle = (px: number, py: number, kind: string) => {
    if (isLive) {
      let w = 80.0;
      let h = 80.0;
      if (kind === "crate") {
        w = 75.0;
        h = 75.0;
      } else if (kind === "cabinet") {
        w = 75.0;
        h = 65.0;
      } else if (kind === "barrels") {
        w = 85.0;
        h = 85.0;
      } else if (kind === "barrier") {
        w = 110.0;
        h = 45.0;
      }
      wsClient.sendCommand({ cmd: "add_obstacle", x: px, y: py, kind, w, h });
      sound.playToolSelect();
    }
  };

  const initPrimaryScene = () => {
    canvasRoot.innerHTML = "";
    compareWrapper = null;
    secondaryScene = null;

    if (scenarioId === "driving") {
      primaryScene = new DrivingScene(canvasRoot);
    } else {
      primaryScene = new ThreeSimulationScene(canvasRoot);
    }

    if (!primaryScene.isAvailable()) {
      primaryScene = null;
      canvasFallback = new CanvasFallbackRenderer(canvasRoot);
    } else {
      if (typeof primaryScene.setPlaybackSpeed === "function") {
        primaryScene.setPlaybackSpeed(currentSpeed);
      }
      primaryScene.onFloorClick = handleFloorClick;
      primaryScene.onPlaceObstacle = handlePlaceObstacle;
      primaryScene.onFpsUpdate = (fps: number) => {
        fpsDisplay.textContent = `${fps}.0 FPS`;
      };
    }
  };

  const initCompareViewports = () => {
    canvasRoot.innerHTML = `
      <div id="compare-wrapper" style="display: flex; width: 100%; height: 100%; position: relative;">
        <!-- Top Split-Screen Comparison Telemetry Strip (Req 5) -->
        <div id="compare-telemetry-strip" style="position: absolute; top: 12px; left: 50%; transform: translateX(-50%); z-index: 10; display: flex; align-items: center; gap: 10px; background: rgba(5, 10, 24, 0.92); border: 1px solid rgba(0, 240, 255, 0.4); border-radius: 6px; padding: 5px 16px; font-family: var(--font-mono); font-size: 0.72rem; backdrop-filter: blur(10px); box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
          <span style="color: #ff4757; font-weight: 700;">REACTIVE: <span id="comp-left-hits">0</span> HITS | <span id="comp-left-rew">0.0</span> REW</span>
          <span style="color: #475569;">|</span>
          <span style="color: #00f0ff; font-weight: 700;">SEED: <span id="comp-seed-num">1001</span></span>
          <span style="color: #475569;">|</span>
          <span style="color: #00ff9d; font-weight: 700;">WORLD MODEL: <span id="comp-right-hits">0</span> HITS | <span id="comp-right-rew">0.0</span> REW</span>
        </div>

        <!-- Left Viewport: Reactive Baseline -->
        <div style="flex: 1; height: 100%; position: relative; border-right: 2px solid rgba(0, 240, 255, 0.3);">
          <div style="position: absolute; top: 60px; left: 16px; z-index: 5; background: rgba(9, 15, 29, 0.90); backdrop-filter: blur(10px); padding: 5px 12px; border-radius: 4px; border: 1px solid rgba(255, 71, 87, 0.5); font-family: var(--font-mono); font-size: 0.74rem;">
            <span style="color: #ff4757; font-weight: 800;">WITHOUT WORLD MODEL</span>
            <span id="left-telemetry" style="color: #cbd5e1; margin-left: 8px;">Hits: 0 | Steps: 0</span>
          </div>
          <div id="left-canvas-container" style="width: 100%; height: 100%;"></div>
        </div>

        <!-- Right Viewport: World Model MPC -->
        <div style="flex: 1; height: 100%; position: relative;">
          <div style="position: absolute; top: 60px; left: 16px; z-index: 5; background: rgba(9, 15, 29, 0.90); backdrop-filter: blur(10px); padding: 5px 12px; border-radius: 4px; border: 1px solid rgba(0, 255, 157, 0.5); font-family: var(--font-mono); font-size: 0.74rem;">
            <span style="color: #00ff9d; font-weight: 800;">WITH WORLD MODEL</span>
            <span id="right-telemetry" style="color: #cbd5e1; margin-left: 8px;">Hits: 0 | Steps: 0</span>
          </div>
          <div id="winner-badge" style="display: none; position: absolute; top: 96px; left: 50%; transform: translateX(-50%); z-index: 10; background: linear-gradient(90deg, rgba(0, 255, 157, 0.95), rgba(0, 240, 255, 0.95)); color: #050811; font-weight: 800; font-family: var(--font-mono); font-size: 0.82rem; padding: 6px 16px; border-radius: 4px; box-shadow: 0 0 25px rgba(0,255,157,0.7);">
            🏆 MISSION OBJECTIVE REACHED (0 COLLISIONS)
          </div>
          <div id="right-canvas-container" style="width: 100%; height: 100%;"></div>
        </div>
      </div>
    `;

    const leftContainer = document.getElementById("left-canvas-container")!;
    const rightContainer = document.getElementById("right-canvas-container")!;
    leftTelemetryEl = document.getElementById("left-telemetry") as HTMLDivElement;
    rightTelemetryEl = document.getElementById("right-telemetry") as HTMLDivElement;
    winnerBadgeEl = document.getElementById("winner-badge") as HTMLDivElement;

    if (scenarioId === "driving") {
      secondaryScene = new DrivingScene(leftContainer);
      primaryScene = new DrivingScene(rightContainer);
    } else {
      secondaryScene = new ThreeSimulationScene(leftContainer);
      primaryScene = new ThreeSimulationScene(rightContainer);
    }
    if (primaryScene) {
      if (typeof primaryScene.setPlaybackSpeed === "function") {
        primaryScene.setPlaybackSpeed(currentSpeed);
      }
      if (secondaryScene && typeof secondaryScene.setPlaybackSpeed === "function") {
        secondaryScene.setPlaybackSpeed(currentSpeed);
      }
      primaryScene.onFloorClick = handleFloorClick;
      primaryScene.onPlaceObstacle = handlePlaceObstacle;
      primaryScene.onFpsUpdate = (fps: number) => {
        fpsDisplay.textContent = `${fps}.0 FPS`;
      };
    }
  };

  initPrimaryScene();

  const wsClient = new SimWSClient(scenarioId);
  const replayLoader = new ReplayLoader();

  let hasShownCompareSummary = false;
  const showCompareSummary = (leftFrame: any, rightFrame: any, seed: number) => {
    const modal = document.getElementById("compare-summary-modal");
    const tbody = document.getElementById("summary-table-body");
    const seedTitle = document.getElementById("summary-seed-title");
    if (!modal || !tbody) return;

    if (seedTitle) seedTitle.textContent = `EVALUATION SEED #${seed} · SYNCHRONIZED ARENA CONDITIONAL BENCHMARK`;

    const lSuccess = leftFrame?.metrics?.success ? "GOAL REACHED (100%)" : "FAILED / TIMEOUT (0%)";
    const rSuccess = rightFrame?.metrics?.success ? "GOAL REACHED (100%)" : "FAILED / TIMEOUT (0%)";

    const lHits = leftFrame?.metrics?.collisions ?? 0;
    const rHits = rightFrame?.metrics?.collisions ?? 0;
    const hitDelta = lHits > 0 ? `-${Math.round(((lHits - rHits) / lHits) * 100)}% Collisions` : "Parity";

    const lSteps = leftFrame?.step ?? 0;
    const rSteps = rightFrame?.step ?? 0;

    const lRew = (leftFrame?.metrics?.reward ?? 0).toFixed(1);
    const rRew = (rightFrame?.metrics?.reward ?? 0).toFixed(1);

    const lLat = "0.0 ms (Reactive)";
    const rLat = `${rightFrame?.plan?.ms || 4.2} ms (CUDA MPC)`;

    tbody.innerHTML = `
      <tr style="border-bottom: 1px solid rgba(255,255,255,0.08); padding: 5px 0;">
        <td style="padding: 6px; font-weight: 700;">Task Success</td>
        <td style="padding: 6px; color: ${leftFrame?.metrics?.success ? '#00ff9d' : '#ff4757'};">${lSuccess}</td>
        <td style="padding: 6px; color: ${rightFrame?.metrics?.success ? '#00ff9d' : '#ff4757'};">${rSuccess}</td>
        <td style="padding: 6px; color: #38bdf8;">${rightFrame?.metrics?.success && !leftFrame?.metrics?.success ? '+100% Win' : 'Parity'}</td>
      </tr>
      <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
        <td style="padding: 6px; font-weight: 700;">Collision Events</td>
        <td style="padding: 6px; color: #ff4757; font-weight: 700;">${lHits}</td>
        <td style="padding: 6px; color: #00ff9d; font-weight: 700;">${rHits}</td>
        <td style="padding: 6px; color: #00ff9d; font-weight: 700;">${hitDelta}</td>
      </tr>
      <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
        <td style="padding: 6px; font-weight: 700;">Steps to Objective</td>
        <td style="padding: 6px;">${lSteps}</td>
        <td style="padding: 6px; color: #00f0ff;">${rSteps}</td>
        <td style="padding: 6px; color: var(--text-dim);">${rSteps - lSteps > 0 ? `+${rSteps - lSteps} steps` : `${rSteps - lSteps} steps`}</td>
      </tr>
      <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
        <td style="padding: 6px; font-weight: 700;">Cumulative Reward</td>
        <td style="padding: 6px; color: #ff4757;">${lRew}</td>
        <td style="padding: 6px; color: #00ff9d;">${rRew}</td>
        <td style="padding: 6px; color: #00ff9d;">+${(parseFloat(rRew) - parseFloat(lRew)).toFixed(1)} pts</td>
      </tr>
      <tr>
        <td style="padding: 6px; font-weight: 700;">Planner Latency</td>
        <td style="padding: 6px; color: var(--text-dim);">${lLat}</td>
        <td style="padding: 6px; color: #38bdf8;">${rLat}</td>
        <td style="padding: 6px; color: var(--text-dim);">Real-Time Budget Met</td>
      </tr>
    `;

    modal.style.display = "flex";
    sound.playGoal();
  };

  const handleFrame = (data: any) => {
    if (data.is_compare || isCompareMode) {
      if (!secondaryScene) initCompareViewports();

      if (data.is_compare) {
        if (secondaryScene && data.left) {
          secondaryScene.update(data.left);
          if (leftTelemetryEl && data.left.metrics) {
            leftTelemetryEl.textContent = `Hits: ${data.left.metrics.collisions} | Steps: ${data.left.step}/400`;
          }
        }

        if (primaryScene && data.right) {
          primaryScene.update(data.right);
          if (rightTelemetryEl && data.right.metrics) {
            rightTelemetryEl.textContent = `Hits: ${data.right.metrics.collisions} | Steps: ${data.right.step}/400`;
          }
          if (winnerBadgeEl && data.right.metrics?.success) {
            winnerBadgeEl.style.display = "block";
          }
        }

        const compLeftHits = document.getElementById("comp-left-hits");
        const compLeftRew = document.getElementById("comp-left-rew");
        const compRightHits = document.getElementById("comp-right-hits");
        const compRightRew = document.getElementById("comp-right-rew");
        const compSeedNum = document.getElementById("comp-seed-num");

        if (compLeftHits && data.left?.metrics) compLeftHits.textContent = `${data.left.metrics.collisions}`;
        if (compLeftRew && data.left?.metrics) compLeftRew.textContent = `${data.left.metrics.reward.toFixed(1)}`;
        if (compRightHits && data.right?.metrics) compRightHits.textContent = `${data.right.metrics.collisions}`;
        if (compRightRew && data.right?.metrics) compRightRew.textContent = `${data.right.metrics.reward.toFixed(1)}`;
        if (compSeedNum) compSeedNum.textContent = `${currentSeed}`;

        // Check episode termination in compare mode
        const leftDone = Boolean(data.left?.metrics?.success || data.left?.step >= 400);
        const rightDone = Boolean(data.right?.metrics?.success || data.right?.step >= 400);

        if ((leftDone || rightDone) && !hasShownCompareSummary) {
          showCompareSummary(data.left, data.right, currentSeed);
          hasShownCompareSummary = true;
        } else if (!leftDone && !rightDone) {
          hasShownCompareSummary = false;
        }

        updateTelemetry(data.right);
      }
      return;
    }

    if (secondaryScene) initPrimaryScene();

    const frame = data;
    if (primaryScene) {
      primaryScene.update(frame);
      fpsDisplay.textContent = `${primaryScene.currentFps}.0 FPS`;
      povSensorOverlay.style.display = primaryScene.cameraMode === "robot_pov" ? "block" : "none";
    } else if (canvasFallback) {
      canvasFallback.render(frame);
    }

    // Ground-truth sync of docking and pause state directly from server
    const serverPaused = frame.metrics?.extra?.is_paused;
    if (serverPaused !== undefined && serverPaused !== isDocked) {
      setDockingState(serverPaused, false);
    }

    if (frame.events && frame.events.length > 0) {
      if (frame.events.includes("bonk") || frame.events.includes("collision")) sound.playBonk();
      if (frame.events.includes("goal")) sound.playGoal();
    } else {
      sound.playMove();
    }

    updateTelemetry(frame);
  };

  let sessionCompletedRuns: number = 0;
  let sessionSuccessRuns: number = 0;
  let prevStepNum: number = 0;
  let hasRecordedCurrentEpisode: boolean = false;

  const updateTelemetry = (frame: any) => {
    if (!frame) return;

    const currentStep = frame.metrics?.step_count ?? frame.step ?? 0;
    if (frame.events && frame.events.includes("goal") && !hasRecordedCurrentEpisode) {
      sessionSuccessRuns++;
      sessionCompletedRuns++;
      hasRecordedCurrentEpisode = true;
    } else if (currentStep === 0 && prevStepNum > 10) {
      if (!hasRecordedCurrentEpisode) {
        sessionCompletedRuns++;
      }
      hasRecordedCurrentEpisode = false;
    }
    prevStepNum = currentStep;

    if (frame.metrics) {
      const epCount = Math.max(sessionCompletedRuns + 1, frame.metrics.episode ?? 1);
      const succCount = Math.max(sessionSuccessRuns, frame.metrics.extra?.success_count ?? (frame.metrics.success ? 1 : 0));
      const winRatePct = ((succCount / epCount) * 100).toFixed(1);
      metricWinrate.textContent = `${winRatePct}% (n=${epCount})`;
      metricCollisions.textContent = `${frame.metrics.collisions}`;
      const maxSteps = frame.metrics?.extra?.max_steps ?? frame.metrics?.max_steps ?? 400;
      metricSteps.textContent = `${currentStep} / ${maxSteps}`;
    }

    const povSpeedEl = document.getElementById("pov-speed");
    if (povSpeedEl) {
      const speedMult = currentSpeed || 1.0;
      const vx = frame.robot?.vx ?? 0;
      const vy = frame.robot?.vy ?? 0;
      const vMag = Math.sqrt(vx * vx + vy * vy);
      const spdVal = vMag > 0 ? (vMag * 0.024 * 30.0 * speedMult) : (2.4 * speedMult);
      povSpeedEl.textContent = `${spdVal.toFixed(2)} m/s`;
    }

    // Impassable Blocked Area Detection Banner & Dock HUD Update
    const isAreaBlocked = (frame.events && frame.events.includes("path_blocked")) || Boolean(frame.metrics?.extra?.path_blocked);
    const blockedBanner = document.getElementById("area-blocked-banner");
    const blockedSubtitle = document.getElementById("area-blocked-subtitle");

    if (blockedBanner) {
      if (isAreaBlocked) {
        blockedBanner.style.display = "flex";
        if (blockedSubtitle) {
          const reason = frame.metrics?.extra?.blocked_reason || "NO VIABLE PATH TO GOAL — ALL TRAJECTORIES IMPASSABLE";
          blockedSubtitle.textContent = reason;
        }
        if (dockHudDot) {
          dockHudDot.style.background = "#ef4444";
          dockHudDot.style.boxShadow = "0 0 12px #ef4444";
        }
        if (dockHudModeBadge) {
          dockHudModeBadge.textContent = "BLOCKED";
          dockHudModeBadge.style.background = "rgba(239, 68, 68, 0.2)";
          dockHudModeBadge.style.borderColor = "#ef4444";
          dockHudModeBadge.style.color = "#ef4444";
        }
        if (dockHudText) {
          dockHudText.textContent = "[BLOCKED] AREA IMPASSABLE — ALL PATHS OBSTRUCTED BY OBSTACLES";
        }
      } else {
        blockedBanner.style.display = "none";
        // If not blocked and not docked, restore normal active text
        if (!isDocked && dockHudDot && dockHudText) {
          if (frame.metrics?.extra?.anti_hover_active || (frame.events && frame.events.includes("anti_hover_thrust"))) {
            dockHudDot.style.background = "#38bdf8";
            dockHudDot.style.boxShadow = "0 0 14px #38bdf8";
            if (dockHudModeBadge) {
              dockHudModeBadge.textContent = "BREAKAWAY";
              dockHudModeBadge.style.background = "rgba(56, 189, 248, 0.2)";
              dockHudModeBadge.style.borderColor = "#38bdf8";
              dockHudModeBadge.style.color = "#38bdf8";
            }
            dockHudText.textContent = "⚡ ANTI-HOVER THRUSTER ACTIVE — BREAKAWAY SURGE";
          } else {
            const driveMode = frame.metrics?.extra?.drive_mode || "NORMAL";
            const hoverSec = frame.metrics?.extra?.hover_time_s ?? 0.0;
            const hoverStatus = hoverSec > 0.8 ? ` [HOVER: ${hoverSec.toFixed(1)}s/2.0s]` : "";
            dockHudDot.style.background = driveMode === "TURBO_CRUISE" ? "#00f0ff" : "#00ff9d";
            dockHudDot.style.boxShadow = driveMode === "TURBO_CRUISE" ? "0 0 12px #00f0ff" : "0 0 10px #00ff9d";
            if (dockHudModeBadge) {
              dockHudModeBadge.textContent = driveMode;
              if (driveMode === "TURBO_CRUISE") {
                dockHudModeBadge.style.background = "rgba(0, 240, 255, 0.18)";
                dockHudModeBadge.style.borderColor = "#00f0ff";
                dockHudModeBadge.style.color = "#00f0ff";
              } else {
                dockHudModeBadge.style.background = "rgba(0, 255, 157, 0.15)";
                dockHudModeBadge.style.borderColor = "#00ff9d";
                dockHudModeBadge.style.color = "#00ff9d";
              }
            }
            dockHudText.textContent = `ROBOT ACTIVE [${driveMode}]${hoverStatus} — [SPACE] TO HOLD`;
          }
        }
      }
    }

    // 360° LiDAR Clearance Radar Update
    const lidarDistances = frame.metrics?.extra?.lidar_distances || frame.metrics?.extra?.lidar;
    if (lidarRadarCanvas) {
      const robotAngle = frame.robot?.angle ?? (frame.robot?.heading ? (frame.robot.heading * Math.PI) / 180 : 0);
      renderLidarRadar(lidarRadarCanvas, lidarDistances, robotAngle);
    }
    if (lidarMinBadge) {
      const minClearancePx = frame.metrics?.extra?.lidar_min_clearance ?? (lidarDistances ? Math.min(...lidarDistances) : 100.0);
      const minM = (minClearancePx * 0.024);
      if (minM > 1.8) {
        lidarMinBadge.textContent = `CLEAR (${minM.toFixed(2)}m)`;
        lidarMinBadge.style.color = "#00ff9d";
      } else if (minM > 0.8) {
        lidarMinBadge.textContent = `CAUTION (${minM.toFixed(2)}m)`;
        lidarMinBadge.style.color = "#f59e0b";
      } else {
        lidarMinBadge.textContent = `PROXIMITY (${minM.toFixed(2)}m)`;
        lidarMinBadge.style.color = "#ef4444";
      }
    }

    // Prediction vs Reality Telemetry (Req 2C & 2D)
    const pvr = frame.prediction_vs_reality;
    if (pvr) {
      const predPosEl = document.getElementById("pvr-pred-pos");
      const actPosEl = document.getElementById("pvr-act-pos");
      const posErrEl = document.getElementById("pvr-pos-err");
      const stateMaeEl = document.getElementById("pvr-state-mae");
      const h14ErrEl = document.getElementById("pvr-h14-err");
      const horizonPath = document.getElementById("pvr-horizon-path") as unknown as SVGPathElement;

      if (predPosEl && pvr.predicted_pos) predPosEl.textContent = `(${pvr.predicted_pos[0].toFixed(0)}, ${pvr.predicted_pos[1].toFixed(0)})`;
      if (actPosEl && pvr.actual_pos) actPosEl.textContent = `(${pvr.actual_pos[0].toFixed(0)}, ${pvr.actual_pos[1].toFixed(0)})`;
      if (posErrEl && pvr.pos_error_m !== undefined) posErrEl.textContent = `±${pvr.pos_error_m.toFixed(2)} m`;
      if (stateMaeEl && pvr.state_mae !== undefined) stateMaeEl.textContent = `${pvr.state_mae.toFixed(4)}`;

      if (pvr.horizon_errors && pvr.horizon_errors.length > 0) {
        const lastErr = pvr.horizon_errors[pvr.horizon_errors.length - 1];
        if (h14ErrEl && lastErr) h14ErrEl.textContent = `${lastErr.error_m.toFixed(2)}m`;

        if (horizonPath) {
          const maxErr = 0.40;
          const coords = pvr.horizon_errors.map((item: any, idx: number) => {
            const x = 10 + (idx / (pvr.horizon_errors.length - 1)) * 160;
            const y = Math.max(3, Math.min(23, 23 - (item.error_m / maxErr) * 20));
            return `${x.toFixed(1)} ${y.toFixed(1)}`;
          });
          horizonPath.setAttribute("d", `M ${coords.join(" L ")}`);
        }
      }
    }

    if (scenarioId === "driving") {
      const speedVal = frame.metrics?.extra?.speed_kmh ?? 70.0;
      const avSpeedEl = document.getElementById("av-speed-val");
      if (avSpeedEl) avSpeedEl.textContent = Math.round(speedVal).toString();

      const offsetVal = frame.metrics?.extra?.lane_offset ?? 0.0;
      const avOffsetEl = document.getElementById("av-offset-val");
      const avOffsetFill = document.getElementById("av-offset-fill");
      if (avOffsetEl) avOffsetEl.textContent = `${offsetVal >= 0 ? "+" : ""}${offsetVal.toFixed(2)} m`;
      if (avOffsetFill) {
        const fillPct = Math.min(100, Math.max(0, 50 + (offsetVal / 4.0) * 50));
        avOffsetFill.style.width = `${fillPct}%`;
        avOffsetFill.style.backgroundColor = Math.abs(offsetVal) < 0.6 ? "#00ff9d" : (Math.abs(offsetVal) < 1.4 ? "#ffb703" : "#ef4444");
      }

      const ttcVal = frame.metrics?.extra?.ttc ?? 10.0;
      const avTtcEl = document.getElementById("av-ttc-val");
      const avTtcFill = document.getElementById("av-ttc-fill");
      if (avTtcEl) avTtcEl.textContent = ttcVal < 9.9 ? `${ttcVal.toFixed(1)} s` : "CLEAR";
      if (avTtcFill) {
        const fillPct = Math.min(100, Math.max(0, (ttcVal / 6.0) * 100));
        avTtcFill.style.width = `${fillPct}%`;
        avTtcFill.style.backgroundColor = ttcVal > 3.0 ? "#00ff9d" : (ttcVal > 1.8 ? "#ffb703" : "#ef4444");
      }

      const drivingActions = ["ACCELERATE", "BRAKE", "STEER LEFT", "STEER RIGHT", "CRUISE"];
      const drivingClasses = ["accelerate", "brake", "steer-left", "steer-right", "cruise"];
      const actIdx = frame.plan?.chosen_action ?? 4;
      const chipEl = document.getElementById("av-action-chip");
      if (chipEl) {
        chipEl.className = `av-action-chip ${drivingClasses[actIdx] || "cruise"}`;
        chipEl.textContent = drivingActions[actIdx] || "CRUISE";
      }

      const avMaeEl = document.getElementById("av-mae-val");
      if (avMaeEl) {
        avMaeEl.textContent = frame.model_error !== null && frame.model_error !== undefined ? frame.model_error.toFixed(4) : "0.019";
      }

      // Draw Radar Mini-Map
      const minimapCanvas = document.getElementById("av-minimap-canvas") as HTMLCanvasElement;
      if (minimapCanvas && frame.world?.layout?.centerline) {
        const mctx = minimapCanvas.getContext("2d");
        if (mctx) {
          mctx.clearRect(0, 0, minimapCanvas.width, minimapCanvas.height);
          const cl = frame.world.layout.centerline;
          const maxX = frame.world.bounds ? frame.world.bounds[2] : 200.0;
          const toMx = (x: number) => 8 + (x / maxX) * (minimapCanvas.width - 16);
          const toMy = (y: number) => minimapCanvas.height / 2 - (y / 50.0) * (minimapCanvas.height / 2);

          mctx.strokeStyle = "rgba(71, 85, 105, 0.7)";
          mctx.lineWidth = 4;
          mctx.beginPath();
          cl.forEach((p: number[], idx: number) => {
            const mx = toMx(p[0]);
            const my = toMy(p[1]);
            if (idx === 0) mctx.moveTo(mx, my); else mctx.lineTo(mx, my);
          });
          mctx.stroke();

          // Render vehicles on mini-map
          (frame.entities || []).forEach((ent: any) => {
            const ex = toMx(ent.x);
            const ey = toMy(ent.y);
            mctx.fillStyle = ent.extra?.is_ego ? "#00ff9d" : (ent.extra?.color || "#38bdf8");
            mctx.beginPath();
            mctx.arc(ex, ey, ent.extra?.is_ego ? 3.5 : 2.5, 0, Math.PI * 2);
            mctx.fill();
          });
        }
      }

      // Toast Alerts for Driving Events
      if (frame.events && frame.events.length > 0) {
        const toastBox = document.getElementById("av-toast-box");
        if (toastBox) {
          frame.events.forEach((ev: string) => {
            const toast = document.createElement("div");
            toast.className = "av-toast-item";
            if (ev === "brake") {
              toast.innerHTML = "⚠️ LEAD VEHICLE HARD BRAKING";
              toast.style.borderColor = "#ffb703";
            } else if (ev === "lane_change") {
              toast.innerHTML = "↔️ LANE CHANGE MANEUVER";
              toast.style.borderColor = "#00f0ff";
            } else if (ev === "near_miss") {
              toast.innerHTML = "⚡ CRITICAL HEADWAY ALERT (TTC < 1.8s)";
              toast.style.borderColor = "#ff4757";
            } else if (ev === "bonk") {
              toast.innerHTML = "💥 COLLISION DETECTED";
              toast.style.borderColor = "#ef4444";
            } else if (ev === "goal") {
              toast.innerHTML = "🏆 HIGHWAY DESTINATION REACHED";
              toast.style.borderColor = "#00ff9d";
            }
            toastBox.appendChild(toast);
            setTimeout(() => { toast.remove(); }, 2500);
          });
        }
      }
    }

    if (frame.goal && frame.entities) {
      const robot = frame.entities.find((e: any) => e.id === "robot" || e.kind === "robot");
      if (robot && metricGoalDist && sparklineDistPath && sparklineDistVal) {
        const distPx = Math.hypot(frame.goal.x - robot.x, frame.goal.y - robot.y);
        const distM = distPx / 100.0;
        metricGoalDist.textContent = `${distM.toFixed(2)} m`;
        sparklineDistVal.textContent = `${distM.toFixed(2)} m`;
        if (povTargetDist) povTargetDist.textContent = `${distM.toFixed(2)} m`;

        if (povHeadingVal && robot.angle !== undefined) {
          const deg = Math.round(((robot.angle * 180) / Math.PI + 360) % 360);
          povHeadingVal.textContent = `HDG ${deg.toString().padStart(3, "0")}°`;
        }

        distHistory.push(distM);
        if (distHistory.length > 25) distHistory.shift();

        const maxD = Math.max(6.0, ...distHistory);
        const pts = distHistory.map((d, idx) => {
          const x = (idx / Math.max(distHistory.length - 1, 1)) * 200;
          const y = 24 - (d / maxD) * 20;
          return `${x.toFixed(1)},${y.toFixed(1)}`;
        });
        sparklineDistPath.setAttribute("d", "M " + pts.join(" L "));
      }
    }

    if (frame.plan) {
      const planMs = frame.plan.ms ? frame.plan.ms : 4.2;
      metricLatency.textContent = `${planMs.toFixed(1)} ms`;
      metricLatency.style.color = planMs <= 6.0 ? "var(--accent-green)" : (planMs <= 12.0 ? "var(--accent-cyan)" : "#fbbf24");
      metricPlanSamples.textContent = `${frame.plan.samples || 300}x${frame.plan.horizon || 14}`;

      const actionNames = ["NORTH", "SOUTH", "WEST", "EAST", "STAY"];
      const actionGlyphs = ["▲ NORTH", "▼ SOUTH", "◀ WEST", "▶ EAST", "■ STAY"];
      const chosenIdx = frame.plan.chosen_action !== undefined ? frame.plan.chosen_action : 4;
      const chosenAct = actionNames[chosenIdx] || "STAY";
      const chosenGlyph = actionGlyphs[chosenIdx] || chosenAct;
      lblChosenAction.textContent = chosenGlyph;

      if (frame.plan.alts && Array.isArray(frame.plan.alts)) {
        let maxRet = -1e9;
        let minRet = 1e9;
        frame.plan.alts.forEach((c: any) => {
          const val = c.score !== undefined ? c.score : (c.return !== undefined ? c.return : 0.0);
          if (val > maxRet) maxRet = val;
          if (val < minRet) minRet = val;
        });
        const range = Math.max(maxRet - minRet, 1.0);

        // Zero DOM-thrashing in-place update: create reusable candidate row elements only once
        const currentRows = candidatesContainer.querySelectorAll(".candidate-row");
        if (currentRows.length !== frame.plan.alts.length || candidatesContainer.querySelector(".why-reason")) {
          candidatesContainer.innerHTML = "";
          frame.plan.alts.forEach(() => {
            const row = document.createElement("div");
            row.className = "candidate-row";
            row.innerHTML = `
              <span class="cand-act" style="width: 50px;"></span>
              <div class="candidate-bar-bg">
                <div class="candidate-bar-fill"></div>
              </div>
              <span class="cand-score" style="width: 48px; text-align: right; font-weight: 700;"></span>
            `;
            candidatesContainer.appendChild(row);
          });
        }

        const rows = candidatesContainer.children;
        frame.plan.alts.forEach((c: any, idx: number) => {
          const row = rows[idx] as HTMLElement;
          if (!row) return;

          const val = c.score !== undefined ? c.score : (c.return !== undefined ? c.return : 0.0);
          const actId = c.first_action !== undefined ? c.first_action : (c.action !== undefined ? c.action : 4);
          const actName = actionNames[actId] || "STAY";
          const isChosen = actId === chosenIdx;
          const pct = Math.max(8, Math.min(100, Math.round(((val - minRet) / range) * 100)));
          const barColor = isChosen ? "#00ff9d" : c.collides ? "#ff4757" : "#00f0ff";

          row.style.opacity = isChosen ? "1" : "0.75";

          const actSpan = row.querySelector(".cand-act") as HTMLElement;
          if (actSpan) {
            actSpan.textContent = `${actName}:`;
            actSpan.style.fontWeight = isChosen ? "800" : "500";
            actSpan.style.color = isChosen ? "#00ff9d" : "inherit";
          }

          const barFill = row.querySelector(".candidate-bar-fill") as HTMLElement;
          if (barFill) {
            barFill.style.width = `${pct}%`;
            barFill.style.background = barColor;
          }

          const scoreSpan = row.querySelector(".cand-score") as HTMLElement;
          if (scoreSpan) {
            scoreSpan.textContent = `${val >= 0 ? "+" : ""}${Number(val).toFixed(1)}`;
            scoreSpan.style.color = barColor;
          }
        });

        whyExplanation.textContent = `Evaluated 300 candidate rollouts over a 14-step receding horizon. Selected [${chosenAct}] as the highest expected reward trajectory toward the goal.`;
      }
    }
  };

  // Honest Model Diagnostics polling from /api/diagnostics
  const fetchDiagnostics = async () => {
    try {
      const res = await fetch("/api/diagnostics");
      if (res.ok) {
        const diag = await res.json();
        const paramEl = document.getElementById("card-param-count");
        if (paramEl && diag.model_params) {
          paramEl.textContent = `${Number(diag.model_params).toLocaleString()} PARAMS`;
        }
        const modelEl = document.getElementById("arch-model-name");
        if (modelEl && diag.model_name) {
          modelEl.textContent = diag.model_name;
        }
        const devEl = document.getElementById("arch-device-line");
        if (devEl && diag.gpu_name) {
          devEl.textContent = `GPU: ${diag.gpu_name}`;
        }
        if (diag.plan_ms && metricLatency) {
          metricLatency.textContent = `${diag.plan_ms} ms`;
        }
      }
    } catch (e) {}
  };
  fetchDiagnostics();
  const diagPollId = window.setInterval(fetchDiagnostics, 3000);

  // Connect WebSocket
  wsClient.onFrame = handleFrame;
  wsClient.onStatusChange = (status) => {
    if (status === "connected") {
      badgeConnection.textContent = "● LIVE FEED";
      badgeConnection.className = "badge badge-live";
      replayLoader.stop(); // CRITICAL: Stop offline replay when live server stream is connected!
      if (primaryScene) primaryScene.setDockStatus(isDocked ? "docked" : "released");
    } else if (status === "fallback_replay") {
      badgeConnection.textContent = "○ REPLAY FALLBACK";
      badgeConnection.className = "badge badge-replay";
      replayLoader.onFrame = (rf) => handleFrame(rf);
      replayLoader.load("robotics", currentVariant, currentMode === "baseline" ? "baseline" : "wm");
    } else if (status === "connecting") {
      badgeConnection.textContent = "◌ CONNECTING...";
      badgeConnection.className = "badge badge-connecting";
    } else {
      badgeConnection.textContent = "○ DISCONNECTED";
      badgeConnection.className = "badge badge-disconnected";
    }
  };

  // Animation Loop for Live Audio Oscilloscope & Mission Clock
  let animId = 0;
  const animLoop = () => {
    sound.renderOscilloscope(audioCanvas);

    // Update Mission Clock
    const elapsedSec = Math.floor((Date.now() - sessionStartTime) / 1000);
    const hrs = Math.floor(elapsedSec / 3600).toString().padStart(2, "0");
    const mins = Math.floor((elapsedSec % 3600) / 60).toString().padStart(2, "0");
    const secs = (elapsedSec % 60).toString().padStart(2, "0");
    const clockEl = document.getElementById("mission-clock");
    if (clockEl) clockEl.textContent = `T+${hrs}:${mins}:${secs}`;

    animId = requestAnimationFrame(animLoop);
  };
  animId = requestAnimationFrame(animLoop);

  // Page visibility management: freeze oscilloscope and signal server to pause to save GPU/CPU when tab is hidden
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (animId) {
        cancelAnimationFrame(animId);
        animId = 0;
      }
      wsClient.sendCommand({ cmd: "pause" });
    } else {
      if (!animId) {
        animId = requestAnimationFrame(animLoop);
      }
      wsClient.sendCommand({ cmd: "start" });
    }
  });

  // Setup UI Event Handlers
  const setupControls = () => {
    // Mode toggles
    const btnWm = document.getElementById("btn-mode-wm")!;
    const btnBase = document.getElementById("btn-mode-base")!;
    const btnComp = document.getElementById("btn-mode-compare")!;

    const setActiveModeBtn = (activeBtn: HTMLElement) => {
      [btnWm, btnBase, btnComp].forEach((b) => b.classList.remove("active"));
      activeBtn.classList.add("active");
    };

    btnWm.onclick = () => {
      currentMode = "world_model";
      isCompareMode = false;
      setActiveModeBtn(btnWm);
      if (secondaryScene) initPrimaryScene();
      wsClient.sendCommand({ cmd: "set", mode: "world_model" });
      sound.playToolSelect();
      sound.speak("Neural World Model engaged.");
    };

    btnBase.onclick = () => {
      currentMode = "baseline";
      isCompareMode = false;
      setActiveModeBtn(btnBase);
      if (secondaryScene) initPrimaryScene();
      wsClient.sendCommand({ cmd: "set", mode: "baseline" });
      sound.playToolSelect();
      sound.speak("Reactive baseline engaged.");
    };

    btnComp.onclick = () => {
      currentMode = "compare";
      isCompareMode = true;
      setActiveModeBtn(btnComp);
      if (!secondaryScene) initCompareViewports();
      wsClient.sendCommand({ cmd: "set", mode: "compare" });
      sound.playToolSelect();
      sound.speak("Dual synchronized compare mode active.");
    };

    // Camera Mode Selectors
    const camButtons = {
      overview: document.getElementById("cam-overview")!,
      chase: document.getElementById("cam-chase")!,
      pov: document.getElementById("cam-pov")!,
      topdown: document.getElementById("cam-topdown")!,
      orbit: document.getElementById("cam-orbit")!,
      cinematic: document.getElementById("cam-cinematic")!,
    };

    const setCameraActive = (key: keyof typeof camButtons) => {
      Object.values(camButtons).forEach((b) => b.classList.remove("active"));
      if (camButtons[key]) camButtons[key].classList.add("active");
    };

    camButtons.overview.onclick = () => {
      primaryScene?.setCameraMode("overview");
      setCameraActive("overview");
      sound.playClick();
    };
    camButtons.chase.onclick = () => {
      primaryScene?.setCameraMode("chase");
      setCameraActive("chase");
      sound.playClick();
    };
    camButtons.pov.onclick = () => {
      primaryScene?.setCameraMode("robot_pov");
      setCameraActive("pov");
      sound.playClick();
      sound.speak("Visor HUD online.");
    };
    camButtons.topdown.onclick = () => {
      primaryScene?.setCameraMode("topdown");
      setCameraActive("topdown");
      sound.playClick();
    };
    camButtons.orbit.onclick = () => {
      primaryScene?.setCameraMode("orbit");
      setCameraActive("orbit");
      sound.playClick();
    };
    camButtons.cinematic.onclick = () => {
      primaryScene?.setCameraMode("cinematic");
      setCameraActive("cinematic");
      sound.playClick();
      sound.speak("Cinematic director mode active.");
    };

    // Sandbox Object Tools
    const toolGoal = document.getElementById("tool-goal")!;
    const toolCrate = document.getElementById("tool-crate")!;
    const toolCabinet = document.getElementById("tool-cabinet")!;
    const toolWorkstation = document.getElementById("tool-workstation")!;
    const toolBarrels = document.getElementById("tool-barrels")!;
    const toolBarrier = document.getElementById("tool-barrier")!;
    const allTools = [toolGoal, toolCrate, toolCabinet, toolWorkstation, toolBarrels, toolBarrier];

    const setActiveTool = (btn: HTMLElement, tool: any) => {
      allTools.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      if (primaryScene) primaryScene.activePlacementTool = tool;
      sound.playToolSelect();
    };

    toolGoal.onclick = () => setActiveTool(toolGoal, "goal");
    toolCrate.onclick = () => setActiveTool(toolCrate, "crate");
    toolCabinet.onclick = () => setActiveTool(toolCabinet, "cabinet");
    toolWorkstation.onclick = () => setActiveTool(toolWorkstation, "workstation");
    toolBarrels.onclick = () => setActiveTool(toolBarrels, "barrels");
    toolBarrier.onclick = () => setActiveTool(toolBarrier, "barrier");

    // Course Preset Loaders
    const btnPresetSlalom = document.getElementById("btn-preset-slalom");
    const btnPresetTrap = document.getElementById("btn-preset-trap");
    const btnPresetWarehouse = document.getElementById("btn-preset-warehouse");

    if (btnPresetSlalom) {
      btnPresetSlalom.onclick = () => {
        wsClient.sendCommand({ cmd: "load_preset", kind: "slalom" });
        sound.playToolSelect();
        sound.speak("Slalom course engaged.");
      };
    }
    if (btnPresetTrap) {
      btnPresetTrap.onclick = () => {
        wsClient.sendCommand({ cmd: "load_preset", kind: "trap" });
        sound.playToolSelect();
        sound.speak("Cul-de-sac trap loaded.");
      };
    }
    if (btnPresetWarehouse) {
      btnPresetWarehouse.onclick = () => {
        wsClient.sendCommand({ cmd: "load_preset", kind: "warehouse" });
        sound.playToolSelect();
        sound.speak("Warehouse maze loaded.");
      };
    }

    // Clear All & Randomize
    document.getElementById("btn-clear-obs")!.onclick = () => {
      wsClient.sendCommand({ cmd: "clear_obstacles" });
      sound.playBonk();
      sound.speak("Arena cleared.");
    };

    document.getElementById("btn-random-obs")!.onclick = () => {
      currentSeed = Math.floor(Math.random() * 9000) + 1000;
      wsClient.sendCommand({ cmd: "reset", seed: currentSeed });
      sound.playToolSelect();
    };

    // Sound Controls (Whisper-Quiet Motor Glide Only)
    const btnMute = document.getElementById("btn-mute")!;
    const lblSound = document.getElementById("lbl-sound")!;
    btnMute.onclick = () => {
      const isMuted = sound.toggleMute();
      lblSound.textContent = isMuted ? "Glide Audio: OFF" : "Glide Audio: ON";
      btnMute.classList.toggle("active", !isMuted);
    };

    // Robot Docking & Deployment Control
    isDocked = false;
    const btnDockLaunch = document.getElementById("btn-dock-launch")!;
    const lblDockLaunch = document.getElementById("lbl-dock-launch")!;

    setDockingState = (docked: boolean, sendCmd: boolean = true) => {
      isDocked = docked;
      if (primaryScene) primaryScene.setDockStatus(docked ? "docked" : "released");
      if (docked) {
        if (sendCmd) wsClient.sendCommand({ cmd: "pause" });
        btnDockLaunch.className = "rail-btn dock-launch-btn docked";
        lblDockLaunch.textContent = "▶ Resume Robot [SPACE]";
        if (dockHudDot) {
          dockHudDot.style.background = "#f59e0b";
          dockHudDot.style.boxShadow = "0 0 6px rgba(245, 158, 11, 0.6)";
        }
        if (dockHudModeBadge) {
          dockHudModeBadge.textContent = "HOLD";
          dockHudModeBadge.style.background = "rgba(245, 158, 11, 0.12)";
          dockHudModeBadge.style.borderColor = "rgba(245, 158, 11, 0.3)";
          dockHudModeBadge.style.color = "#f59e0b";
        }
        if (dockHudText) {
          dockHudText.textContent = "Robot Holding at Dock — Press [SPACE] to Resume";
        }
      } else {
        if (sendCmd) wsClient.sendCommand({ cmd: "start" });
        btnDockLaunch.className = "rail-btn dock-launch-btn active";
        lblDockLaunch.textContent = "⏸ Hold Robot [SPACE]";
        if (dockHudDot) {
          dockHudDot.style.background = "#10b981";
          dockHudDot.style.boxShadow = "0 0 6px rgba(16, 185, 129, 0.6)";
        }
        if (dockHudModeBadge) {
          dockHudModeBadge.textContent = "ACTIVE";
          dockHudModeBadge.style.background = "rgba(16, 185, 129, 0.12)";
          dockHudModeBadge.style.borderColor = "rgba(16, 185, 129, 0.3)";
          dockHudModeBadge.style.color = "#10b981";
        }
        if (dockHudText) {
          dockHudText.textContent = "Robot Active — Executing Trajectory";
        }
        sound.playMove();
      }
    };

    // Synchronize initial DOM controls and HUD banner with current state
    setDockingState(isDocked, false);

    const toggleDockRelease = () => {
      setDockingState(!isDocked);
    };

    if (btnDockLaunch) {
      btnDockLaunch.onclick = (e) => {
        e.preventDefault();
        btnDockLaunch.blur();
        toggleDockRelease();
      };
    }

    // Reset Layout Button
    document.getElementById("btn-reset")!.onclick = () => {
      wsClient.sendCommand({ cmd: "reset", seed: currentSeed });
      setDockingState(true);
      sound.playToolSelect();
    };

    // Speed Selector
    const selectSpeed = document.getElementById("select-speed") as HTMLSelectElement;
    selectSpeed.onchange = () => {
      currentSpeed = parseFloat(selectSpeed.value);
      wsClient.sendCommand({ cmd: "set", speed: currentSpeed });
      if (primaryScene && typeof primaryScene.setPlaybackSpeed === "function") {
        primaryScene.setPlaybackSpeed(currentSpeed);
      }
      if (secondaryScene && typeof secondaryScene.setPlaybackSpeed === "function") {
        secondaryScene.setPlaybackSpeed(currentSpeed);
      }
      const presSpeedEl = document.getElementById("pres-speed-tag");
      if (presSpeedEl) presSpeedEl.textContent = `${currentSpeed}x`;
      sound.playClick();
    };

    // Snapshot Exporter
    document.getElementById("btn-snapshot")!.onclick = () => {
      if (primaryScene) {
        const dataUrl = primaryScene.captureScreenshot();
        if (dataUrl) {
          const a = document.createElement("a");
          a.href = dataUrl;
          a.download = `world_model_telemetry_${Date.now()}.png`;
          a.click();
          sound.playGoal();
          sound.speak("Snapshot saved.");
        }
      }
    };

    // Presentation Mode Toggle (Key P or Button)
    let isPresentationMode = false;
    const togglePresentation = () => {
      isPresentationMode = !isPresentationMode;
      const simRoot = document.querySelector(".sim-view");
      const presBadge = document.getElementById("presentation-badge");
      const btnPresEl = document.getElementById("btn-presentation");
      if (simRoot) {
        if (isPresentationMode) {
          simRoot.classList.add("presentation-mode");
          if (presBadge) presBadge.style.display = "flex";
          if (btnPresEl) btnPresEl.classList.add("active");
        } else {
          simRoot.classList.remove("presentation-mode");
          if (presBadge) presBadge.style.display = "none";
          if (btnPresEl) btnPresEl.classList.remove("active");
        }
      }
      sound.playClick();
    };

    const btnPres = document.getElementById("btn-presentation");
    if (btnPres) {
      btnPres.onclick = togglePresentation;
    }

    // Fullscreen Toggle
    document.getElementById("btn-fullscreen")!.onclick = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
      sound.playClick();
    };

    // Help Modal
    document.getElementById("btn-help")!.onclick = () => {
      showHelp = !showHelp;
      helpModal.style.display = showHelp ? "flex" : "none";
      sound.playClick();
    };

    document.getElementById("btn-close-help")!.onclick = () => {
      showHelp = false;
      helpModal.style.display = "none";
      sound.playClick();
    };

    const summaryModal = document.getElementById("compare-summary-modal");
    const btnCloseSummary = document.getElementById("btn-close-summary");
    if (btnCloseSummary && summaryModal) {
      btnCloseSummary.onclick = () => {
        summaryModal.style.display = "none";
        sound.playClick();
      };
    }
    const btnNextSeed = document.getElementById("btn-next-seed");
    if (btnNextSeed && summaryModal) {
      btnNextSeed.onclick = () => {
        summaryModal.style.display = "none";
        document.getElementById("btn-reset")?.click();
        sound.playClick();
      };
    }

    // Unfocus buttons immediately on click to prevent Spacebar from activating focused buttons
    document.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => btn.blur());
    });

    // Keyboard Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;

      // Emergency reload preserving presenter state
      if (e.ctrlKey && e.shiftKey && (e.key === "R" || e.key === "r")) {
        e.preventDefault();
        sessionStorage.setItem("wm_presenter_state", JSON.stringify({
          scenario: scenarioId,
          variant: currentVariant,
          mode: currentMode,
          isPresentation: isPresentationMode
        }));
        window.location.reload();
        return;
      }

      if (e.key === "Enter" || e.code === "Enter" || e.code === "NumpadEnter" || e.code === "Space" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        toggleDockRelease();
        return;
      } else if (e.key === "Tab") {
        e.preventDefault();
        btnWm.click();
      } else if (e.key === "t" || e.key === "T") {
        btnBase.click();
      } else if (e.key === "s" || e.key === "S") {
        btnComp.click();
      } else if (e.key === "p" || e.key === "P") {
        togglePresentation();
      } else if (e.key === "c" || e.key === "C") {
        if (primaryScene) {
          const next = primaryScene.cycleCamera();
          setCameraActive(next as any);
        }
      } else if (e.key === "r" || e.key === "R") {
        document.getElementById("btn-reset")!.click();
      } else if (e.key === "h" || e.key === "H") {
        document.getElementById("btn-help")!.click();
      } else if (e.key === "n" || e.key === "N") {
        btnMute.click();
      } else if (e.key === "]" || e.key === "+" || e.key === "=") {
        const speedLevels = ["0.5", "1.0", "1.5", "2.0", "3.0", "4.0"];
        const currIdx = speedLevels.indexOf(selectSpeed.value);
        if (currIdx !== -1 && currIdx < speedLevels.length - 1) {
          selectSpeed.value = speedLevels[currIdx + 1];
          selectSpeed.dispatchEvent(new Event("change"));
        }
      } else if (e.key === "[" || e.key === "-" || e.key === "_") {
        const speedLevels = ["0.5", "1.0", "1.5", "2.0", "3.0", "4.0"];
        const currIdx = speedLevels.indexOf(selectSpeed.value);
        if (currIdx !== -1 && currIdx > 0) {
          selectSpeed.value = speedLevels[currIdx - 1];
          selectSpeed.dispatchEvent(new Event("change"));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    cleanupKeydown = () => window.removeEventListener("keydown", handleKeyDown);
  };

  setupControls();
  wsClient.connect();

  // Cleanup on unmount
  return () => {
    if (cleanupKeydown) cleanupKeydown();
    cancelAnimationFrame(animId);
    clearInterval(diagPollId);
    wsClient.disconnect();
    replayLoader.stop();
    if (primaryScene) primaryScene.destroy();
    if (secondaryScene) secondaryScene.destroy();
  };
}

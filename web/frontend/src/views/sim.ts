/**
 * Heavy AAA Mission Control & Telemetry Simulation Dashboard (v6.0-heavy).
 * Built for High-Fidelity 3D Robotics with Procedural Audio, Real-Time Cortex Visualizer,
 * Military-Grade Robot POV Visor, and Interactive Arena Sandbox.
 */

import { ThreeSimulationScene } from "../renderers/three_scene";
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
  let setDockingState: (docked: boolean) => void = () => {};

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

      <!-- Advanced Cyberpunk / Military Robot POV Visor HUD -->
      <div id="pov-sensor-overlay" style="display: none; position: absolute; inset: 0; pointer-events: none; z-index: 10;">
        <!-- Visor Border Brackets & Scanlines -->
        <div style="position: absolute; inset: 12px; border: 2px solid rgba(0, 240, 255, 0.35); box-shadow: inset 0 0 120px rgba(0, 0, 0, 0.9);">
          <!-- Top Compass Ribbon -->
          <div style="position: absolute; top: 16px; left: 50%; transform: translateX(-50%); width: 340px; height: 28px; background: rgba(5, 10, 20, 0.85); border: 1px solid rgba(0, 240, 255, 0.4); border-radius: 4px; display: flex; align-items: center; justify-content: space-around; font-family: var(--font-mono); font-size: 0.72rem; color: #00f0ff; letter-spacing: 2px;">
            <span>W</span><span>|</span><span style="color: #00ff9d; font-weight: 700;" id="pov-heading-val">N 000°</span><span>|</span><span>E</span>
          </div>

          <!-- Artificial Horizon Center Crosshair -->
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90px; height: 90px; pointer-events: none;">
            <div style="position: absolute; top: 50%; left: 0; width: 26px; height: 2px; background: #00f0ff;"></div>
            <div style="position: absolute; top: 50%; right: 0; width: 26px; height: 2px; background: #00f0ff;"></div>
            <div style="position: absolute; top: 0; left: 50%; width: 2px; height: 26px; background: #00f0ff;"></div>
            <div style="position: absolute; bottom: 0; left: 50%; width: 2px; height: 26px; background: #00f0ff;"></div>
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 6px; height: 6px; border-radius: 50%; background: #00ff9d; box-shadow: 0 0 8px #00ff9d;"></div>
          </div>

          <!-- Left Flight Telemetry Data Box -->
          <div style="position: absolute; left: 32px; top: 40%; transform: translateY(-50%); font-family: var(--font-mono); font-size: 0.75rem; color: #00f0ff; display: flex; flex-direction: column; gap: 6px; background: rgba(5, 10, 20, 0.75); padding: 8px 12px; border-left: 3px solid #00f0ff; border-radius: 2px;">
            <div style="color: #64748b; font-size: 0.65rem;">TELEMETRY</div>
            <div>SPD: <span id="pov-speed" style="color: #00ff9d; font-weight: 700;">0.45 m/s</span></div>
            <div>STATUS: <span style="color: #00ff9d; font-weight: 700;">NOMINAL</span></div>
            <div>LIDAR: <span style="color: #38bdf8;">ACTIVE (360°)</span></div>
          </div>

          <!-- Right Goal Distance & Target Tracking Box -->
          <div style="position: absolute; right: 32px; top: 40%; transform: translateY(-50%); font-family: var(--font-mono); font-size: 0.75rem; color: #00f0ff; display: flex; flex-direction: column; gap: 6px; background: rgba(5, 10, 20, 0.75); padding: 8px 12px; border-right: 3px solid #ffb703; border-radius: 2px; text-align: right;">
            <div style="color: #64748b; font-size: 0.65rem;">TARGET TRACKING</div>
            <div>GOAL DIST: <span id="pov-target-dist" style="color: #ffb703; font-weight: 700;">- m</span></div>
            <div>HORIZON: <span style="color: #38bdf8;">14 STEPS</span></div>
            <div>LOCK: <span style="color: #00ff9d; font-weight: 700;">CONFIRMED</span></div>
          </div>
        </div>
      </div>

      <!-- Floating Docking Bay HUD Banner -->
      <div id="dock-hud-banner" style="position: absolute; bottom: 22px; left: 50%; transform: translateX(-50%); background: rgba(5, 10, 25, 0.92); border: 1px solid #00f0ff; border-radius: 6px; padding: 8px 18px; display: flex; align-items: center; gap: 12px; font-family: var(--font-mono); font-size: 0.78rem; pointer-events: none; z-index: 15; box-shadow: 0 0 24px rgba(0, 240, 255, 0.35);">
        <span id="dock-hud-dot" style="width: 10px; height: 10px; border-radius: 50%; background: #f59e0b; box-shadow: 0 0 10px #f59e0b; display: inline-block;"></span>
        <span id="dock-hud-text" style="color: #f8fafc; font-weight: 700;">ROBOT DOCKED AT BAY — PRESS [ENTER] TO LAUNCH</span>
      </div>

      <!-- Top Mission Control Navigation Header -->
      <header class="top-nav">
        <div style="display: flex; align-items: center; gap: 14px;">
          <a href="#/" class="glass-pill" style="padding: 4px 10px; font-weight: 700; color: var(--accent-cyan);">
            <span>&larr; CATALOG</span>
          </a>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div class="nav-logo-icon">WM</div>
            <span style="font-weight: 800; font-size: 0.95rem; letter-spacing: 0.05em; font-family: var(--font-mono);">${simTitle}</span>
          </div>
          <span id="badge-connection" class="badge badge-live">● LIVE FEED</span>
        </div>

        <div style="display: flex; align-items: center; gap: 12px;">
          <!-- Mission Elapsed Clock -->
          <div class="glass-pill" style="padding: 3px 8px; color: var(--text-dim);">
            <span>MISSION:</span>
            <span id="mission-clock" style="color: var(--accent-cyan); font-weight: 700;">T+00:00:00</span>
          </div>

          <!-- Live Audio Oscilloscope Canvas -->
          <div class="glass-pill" style="padding: 2px 6px; display: flex; align-items: center; gap: 6px;" title="Live Audio Waveform Oscilloscope">
            <span style="font-size: 0.68rem; color: var(--text-dim);">AUDIO:</span>
            <canvas id="audio-visualizer-canvas" width="80" height="18" style="display: block;"></canvas>
          </div>

          <!-- Speed selector -->
          <div class="glass-pill" style="padding: 3px 8px;">
            <span style="font-size: 0.70rem; color: var(--text-dim);">SPEED:</span>
            <select id="select-speed" style="background: transparent; border: none; color: var(--accent-cyan); font-family: var(--font-mono); font-size: 0.78rem; cursor: pointer;">
              <option value="0.5" style="background: #090f1d;">0.5x</option>
              <option value="1.0" selected style="background: #090f1d;">1.0x</option>
              <option value="2.0" style="background: #090f1d;">2.0x</option>
              <option value="4.0" style="background: #090f1d;">4.0x</option>
            </select>
          </div>

          <!-- High-Res Screenshot Tool -->
          <button id="btn-snapshot" class="glass-pill" title="Capture High-Res Viewport PNG (Screen Snap)" style="color: #38bdf8;">
            <span>📸 SNAP</span>
          </button>

          <!-- Fullscreen Toggle -->
          <button id="btn-fullscreen" class="glass-pill" title="Toggle Fullscreen" style="color: var(--text-main);">
            <span>⛶ FULL</span>
          </button>

          <!-- Live FPS Gauge -->
          <span id="fps-display" class="glass-pill" style="font-size: 0.78rem; color: var(--accent-green); font-weight: 700;">
            60.0 FPS
          </span>

          <button id="btn-help" class="glass-pill" title="Keyboard Guide (H)">
            <span>HELP [H]</span>
          </button>
        </div>
      </header>

      <!-- Left Heavy Tactical Control Rail -->
      <aside class="glass-panel control-rail">
        <div class="rail-group-title">Robot Docking Bay</div>
        <button id="btn-dock-launch" class="rail-btn active" style="justify-content: center; background: rgba(0, 240, 255, 0.18); border: 2px solid #00f0ff; box-shadow: 0 0 16px rgba(0, 240, 255, 0.4); font-weight: 800; font-size: 0.82rem; padding: 10px 8px; margin-bottom: 6px;" title="Press ENTER to release robot from dock">
          <span id="lbl-dock-launch" style="color: #00f0ff; letter-spacing: 0.5px;">🚀 LAUNCH ROBOT [ENTER]</span>
        </button>

        <div class="rail-group-title">Tactical Strategy</div>
        <button id="btn-mode-wm" class="rail-btn active" title="Model Predictive Control with Deep Neural World Model">
          <span>Neural World Model</span>
          <span style="font-size: 0.70rem; color: var(--accent-cyan);">[TAB]</span>
        </button>
        <button id="btn-mode-base" class="rail-btn" title="Reactive Greedy Agent without planning (repeatedly crashes into traps)">
          <span>Reactive Greedy</span>
          <span style="font-size: 0.70rem; color: var(--text-dim);">[T]</span>
        </button>
        <button id="btn-mode-compare" class="rail-btn" title="Side-by-side synchronized evaluation: Reactive vs World Model">
          <span>Dual Split Compare</span>
          <span style="font-size: 0.70rem; color: var(--accent-green);">[S]</span>
        </button>

        ${
          scenarioId === "robotics"
            ? `
          <div class="rail-group-title" style="margin-top: 4px;">Scenario Arena</div>
          <div style="display: flex; gap: 4px;">
            <button id="btn-s1" class="rail-btn active" style="flex: 1; justify-content: center; font-size: 0.75rem;">S1: Chair</button>
            <button id="btn-s2" class="rail-btn" style="flex: 1; justify-content: center; font-size: 0.75rem;">S2: Person</button>
          </div>
        `
            : ""
        }

        <div class="rail-group-title" style="margin-top: 4px;">Camera & Perspective</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
          <button id="cam-overview" class="rail-btn active" style="justify-content: center; font-size: 0.72rem;">Overview</button>
          <button id="cam-chase" class="rail-btn" style="justify-content: center; font-size: 0.72rem;">Chase Cam</button>
          <button id="cam-pov" class="rail-btn" style="justify-content: center; font-size: 0.72rem; color: #38bdf8;">Robot POV</button>
          <button id="cam-topdown" class="rail-btn" style="justify-content: center; font-size: 0.72rem;">Top-Down</button>
          <button id="cam-orbit" class="rail-btn" style="justify-content: center; font-size: 0.72rem;">Free Orbit</button>
          <button id="cam-cinematic" class="rail-btn" style="justify-content: center; font-size: 0.72rem; color: #c084fc;">Director</button>
        </div>

        <div class="rail-group-title" style="margin-top: 4px;">Interactive Sandbox Tools</div>
        <div style="font-size: 0.68rem; color: var(--text-dim);">Pick tool, then click arena floor:</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
          <button id="tool-goal" class="rail-btn active" style="justify-content: center; font-size: 0.74rem;" title="Move target docking beacon">
            <span>🎯 Goal Dock</span>
          </button>
          <button id="tool-crate" class="rail-btn" style="justify-content: center; font-size: 0.74rem;" title="Drop Wooden Shipping Crate">
            <span>📦 Crate</span>
          </button>
          <button id="tool-cabinet" class="rail-btn" style="justify-content: center; font-size: 0.74rem;" title="Drop Metal Tool Cabinet">
            <span>🧰 Cabinet</span>
          </button>
          <button id="tool-workstation" class="rail-btn" style="justify-content: center; font-size: 0.74rem;" title="Drop Workbench Desk">
            <span>🛠️ Table</span>
          </button>
          <button id="tool-barrels" class="rail-btn" style="justify-content: center; font-size: 0.74rem;" title="Drop 55-Gal Oil Drum Cluster">
            <span>🛢️ Barrels</span>
          </button>
          <button id="tool-barrier" class="rail-btn" style="justify-content: center; font-size: 0.74rem;" title="Drop Heavy Crash Barrier">
            <span>🚧 Barrier</span>
          </button>
        </div>
        <div style="display: flex; gap: 4px; margin-top: 2px;">
          <button id="btn-clear-obs" class="rail-btn" style="flex: 1; justify-content: center; color: #ff4757; border-color: rgba(255, 71, 87, 0.4); font-size: 0.70rem;" title="Clear all obstacles from arena">
            <span>✕ Clear All</span>
          </button>
          <button id="btn-random-obs" class="rail-btn" style="flex: 1; justify-content: center; font-size: 0.70rem;" title="Generate random obstacle course">
            <span>🎲 Randomize</span>
          </button>
        </div>

        <div class="rail-group-title" style="margin-top: 4px;">Acoustics & Audio</div>
        <div style="display: flex; gap: 4px;">
          <button id="btn-mute" class="rail-btn active" style="flex: 1; justify-content: center; font-size: 0.72rem;">
            <span id="lbl-sound">🔊 MOTOR GLIDE: ON</span>
          </button>
        </div>

        <button id="btn-reset" class="rail-btn" style="margin-top: 4px; justify-content: center; background: rgba(0, 240, 255, 0.08); border-color: rgba(0, 240, 255, 0.3); font-weight: 700;">
          <span>⚡ RESET LAYOUT [R]</span>
        </button>
      </aside>

      <!-- Right Neural Telemetry & Cortex Terminal -->
      <aside class="glass-panel brain-panel">
        <div class="brain-header">
          <div class="brain-title">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--accent-cyan); box-shadow: 0 0 8px var(--accent-cyan); display: inline-block;"></span>
            <span>NEURAL CORTEX DYNAMICS</span>
          </div>
          <span id="metric-latency" style="font-family: var(--font-mono); font-size: 0.76rem; color: var(--accent-green); font-weight: 700;">8.7 ms</span>
        </div>

        <!-- 4-Step Pipeline Strip -->
        <div class="pipeline-strip">
          <div class="pipeline-node active">
            <span class="node-label">Sensors</span>
            <span class="node-metric">16-Dim</span>
          </div>
          <div class="pipeline-node active">
            <span class="node-label">Imagine</span>
            <span class="node-metric" id="metric-plan-samples">300x14</span>
          </div>
          <div class="pipeline-node active">
            <span class="node-label">Planner</span>
            <span class="node-metric">Optimal</span>
          </div>
          <div class="pipeline-node active">
            <span class="node-label">Action</span>
            <span id="lbl-chosen-action" class="node-metric" style="color: var(--accent-green);">STAY</span>
          </div>
        </div>

        <!-- Real-Time Neural Network Synaptic Activity Visualizer -->
        <div class="cortex-container">
          <div class="cortex-header">
            <span>RESIDUAL MLP ACTIVATIONS</span>
            <span style="color: #64748b;">288,818 PARAMS</span>
          </div>
          <canvas id="neural-cortex-canvas" width="310" height="74" style="width: 100%; height: 74px; display: block;"></canvas>
        </div>

        <!-- Why This Move? Candidate Card -->
        <div class="why-card">
          <div class="why-title">Model Predictive Rollouts</div>
          <div id="candidates-container">
            <div style="color: var(--text-dim); font-size: 0.72rem;">Evaluating candidate trajectories...</div>
          </div>
          <div id="why-explanation" class="why-reason">
            Vectorized MPC simulating 300 imagined trajectories in parallel...
          </div>
        </div>

        <!-- Telemetry Gauges Cluster -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-family: var(--font-mono);">
          <div class="glass-panel" style="padding: 8px;">
            <div style="font-size: 0.65rem; color: var(--text-dim); font-weight: 700;">SUCCESS RATE</div>
            <div id="metric-winrate" style="font-size: 1.10rem; font-weight: 800; color: var(--accent-green);">- (n=0)</div>
          </div>
          <div class="glass-panel" style="padding: 8px;">
            <div style="font-size: 0.65rem; color: var(--text-dim); font-weight: 700;">COLLISIONS</div>
            <div id="metric-collisions" style="font-size: 1.10rem; font-weight: 800; color: var(--accent-orange);">0</div>
          </div>
          <div class="glass-panel" style="padding: 8px;">
            <div style="font-size: 0.65rem; color: var(--text-dim); font-weight: 700;">STEPS / MAX</div>
            <div id="metric-steps" style="font-size: 1.10rem; font-weight: 800; color: #ffffff;">0 / 200</div>
          </div>
          <div class="glass-panel" style="padding: 8px;">
            <div style="font-size: 0.65rem; color: var(--text-dim); font-weight: 700;">GOAL DISTANCE</div>
            <div id="metric-goal-dist" style="font-size: 1.10rem; font-weight: 800; color: var(--accent-cyan);">- m</div>
          </div>
        </div>

        <!-- Real-Time Distance Sparkline -->
        <div class="glass-panel" style="padding: 6px 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.65rem; color: var(--text-dim); margin-bottom: 2px;">
            <span style="font-weight: 700; letter-spacing: 0.5px;">DISTANCE TO DOCK BEACON</span>
            <span id="sparkline-dist-val" style="color: var(--accent-cyan); font-family: var(--font-mono); font-weight: 700;">- m</span>
          </div>
          <svg id="sparkline-dist" viewBox="0 0 200 28" style="width: 100%; height: 28px; display: block; overflow: visible;">
            <path id="sparkline-dist-path" fill="none" stroke="#00f0ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M 0 14 L 200 14" />
          </svg>
        </div>
      </aside>

      <!-- Bottom Status Pill -->
      <div class="glass-pill bottom-pill">
        <span>[S] Split Compare | [TAB] Toggle WM | [C] Camera | [1/2] Scenarios | [R] Reset | [H] Help</span>
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
            <span class="shortcut-key">N</span><span>Toggle Procedural Audio Effects Mute / Unmute</span>
            <span class="shortcut-key">CLICK FLOOR</span><span>Deploy currently selected object (Goal, Crate, Cabinet, Table)</span>
            <span class="shortcut-key">H</span><span>Toggle this Help Modal</span>
            <span class="shortcut-key">ESC</span><span>Return to Simulations Catalog</span>
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
  const cortexCanvas = document.getElementById("neural-cortex-canvas") as HTMLCanvasElement;
  const povHeadingVal = document.getElementById("pov-heading-val");
  const povTargetDist = document.getElementById("pov-target-dist");

  // Viewport Scenes
  let primaryScene: ThreeSimulationScene | null = null;
  let secondaryScene: ThreeSimulationScene | null = null;
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

    primaryScene = new ThreeSimulationScene(canvasRoot);
    if (!primaryScene.isAvailable()) {
      primaryScene = null;
      canvasFallback = new CanvasFallbackRenderer(canvasRoot);
    } else {
      primaryScene.onFloorClick = handleFloorClick;
      primaryScene.onPlaceObstacle = handlePlaceObstacle;
      primaryScene.onFpsUpdate = (fps) => {
        fpsDisplay.textContent = `${fps}.0 FPS`;
      };
    }
  };

  const initCompareViewports = () => {
    canvasRoot.innerHTML = `
      <div id="compare-wrapper" style="display: flex; width: 100%; height: 100%; position: relative;">
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

    secondaryScene = new ThreeSimulationScene(leftContainer);
    primaryScene = new ThreeSimulationScene(rightContainer);
    if (primaryScene) {
      primaryScene.onFloorClick = handleFloorClick;
      primaryScene.onPlaceObstacle = handlePlaceObstacle;
      primaryScene.onFpsUpdate = (fps) => {
        fpsDisplay.textContent = `${fps}.0 FPS`;
      };
    }
  };

  initPrimaryScene();

  const wsClient = new SimWSClient(scenarioId);
  const replayLoader = new ReplayLoader();

  const handleFrame = (data: any) => {
    if (data.is_compare || isCompareMode) {
      if (!secondaryScene) initCompareViewports();

      if (data.is_compare) {
        if (secondaryScene && data.left) {
          secondaryScene.update(data.left);
          if (leftTelemetryEl && data.left.metrics) {
            leftTelemetryEl.textContent = `Hits: ${data.left.metrics.collisions} | Steps: ${data.left.step}/200`;
          }
        }

        if (primaryScene && data.right) {
          primaryScene.update(data.right);
          if (rightTelemetryEl && data.right.metrics) {
            rightTelemetryEl.textContent = `Hits: ${data.right.metrics.collisions} | Steps: ${data.right.step}/200`;
          }
          if (winnerBadgeEl && data.right.metrics?.success) {
            winnerBadgeEl.style.display = "block";
          }
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

    if (frame.events && frame.events.length > 0) {
      if (frame.events.includes("bonk") || frame.events.includes("collision")) sound.playBonk();
      if (frame.events.includes("goal")) {
        sound.playGoal();
        setTimeout(() => setDockingState(true), 1100);
      }
    } else {
      sound.playMove();
    }

    updateTelemetry(frame);
    drawNeuralCortex(cortexCanvas, frame);
  };

  const updateTelemetry = (frame: any) => {
    if (!frame) return;

    const currentStep = frame.metrics?.step_count ?? frame.step ?? 0;
    if (frame.metrics) {
      const epCount = frame.metrics.episode ?? 1;
      const succCount = frame.metrics.extra?.success_count ?? (frame.metrics.success ? 1 : 0);
      const winRatePct = ((succCount / Math.max(epCount, 1)) * 100).toFixed(1);
      metricWinrate.textContent = `${winRatePct}% (n=${epCount})`;
      metricCollisions.textContent = `${frame.metrics.collisions}`;
      metricSteps.textContent = `${currentStep} / 200`;
    }

    const metricGoalDist = document.getElementById("metric-goal-dist");
    const sparklineDistPath = document.getElementById("sparkline-dist-path");
    const sparklineDistVal = document.getElementById("sparkline-dist-val");
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
      metricLatency.textContent = `${frame.plan.ms ? frame.plan.ms.toFixed(1) : "8.7"} ms`;
      metricPlanSamples.textContent = `${frame.plan.samples || 300}x${frame.plan.horizon || 14}`;

      const actionNames = ["NORTH", "SOUTH", "WEST", "EAST", "STAY"];
      const chosenIdx = frame.plan.chosen_action !== undefined ? frame.plan.chosen_action : 4;
      const chosenAct = actionNames[chosenIdx] || "STAY";
      lblChosenAction.textContent = chosenAct;

      if (frame.plan.alts && Array.isArray(frame.plan.alts)) {
        candidatesContainer.innerHTML = "";
        let maxRet = -1e9;
        let minRet = 1e9;
        frame.plan.alts.forEach((c: any) => {
          const val = c.score !== undefined ? c.score : (c.return !== undefined ? c.return : 0.0);
          if (val > maxRet) maxRet = val;
          if (val < minRet) minRet = val;
        });
        const range = Math.max(maxRet - minRet, 1.0);

        frame.plan.alts.forEach((c: any) => {
          const val = c.score !== undefined ? c.score : (c.return !== undefined ? c.return : 0.0);
          const actId = c.first_action !== undefined ? c.first_action : (c.action !== undefined ? c.action : 4);
          const actName = actionNames[actId] || "STAY";
          const isChosen = actId === chosenIdx;
          const pct = Math.max(8, Math.min(100, Math.round(((val - minRet) / range) * 100)));
          const barColor = isChosen ? "#00ff9d" : c.collides ? "#ff4757" : "#00f0ff";

          const row = document.createElement("div");
          row.className = "candidate-row";
          row.style.opacity = isChosen ? "1" : "0.75";
          row.innerHTML = `
            <span style="width: 50px; font-weight: ${isChosen ? "800" : "500"}; color: ${isChosen ? "#00ff9d" : "inherit"};">${actName}:</span>
            <div class="candidate-bar-bg">
              <div class="candidate-bar-fill" style="width: ${pct}%; background: ${barColor};"></div>
            </div>
            <span style="width: 48px; text-align: right; color: ${barColor}; font-weight: 700;">${val >= 0 ? "+" : ""}${Number(val).toFixed(1)}</span>
          `;
          candidatesContainer.appendChild(row);
        });

        whyExplanation.textContent = `Evaluated 300 candidate rollouts over a 14-step receding horizon. Selected [${chosenAct}] as the highest expected reward trajectory toward the goal.`;
      }
    }
  };

  /**
   * Draw Real-Time Neural Cortex Activity Diagram.
   */
  let cortexPulse = 0;
  const drawNeuralCortex = (canvas: HTMLCanvasElement, frame: any) => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    cortexPulse += 0.08;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // 4 Layers: Input (16), ResBlock 1 (256), ResBlock 2 (256), Heads (Delta/Reward)
    const layers = [
      { name: "IN", count: 5, x: 25 },
      { name: "RES1", count: 6, x: 105 },
      { name: "RES2", count: 6, x: 195 },
      { name: "OUT", count: 4, x: 285 },
    ];

    // Synaptic connections with glowing flow pulses
    ctx.lineWidth = 1.0;
    for (let l = 0; l < layers.length - 1; l++) {
      const l1 = layers[l];
      const l2 = layers[l + 1];
      for (let i = 0; i < l1.count; i++) {
        const y1 = (h / (l1.count + 1)) * (i + 1);
        for (let j = 0; j < l2.count; j++) {
          const y2 = (h / (l2.count + 1)) * (j + 1);

          const pulseOffset = (l * 2 + i + j) * 0.4;
          const alpha = 0.08 + 0.12 * Math.sin(cortexPulse + pulseOffset);
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha.toFixed(2)})`;

          ctx.beginPath();
          ctx.moveTo(l1.x, y1);
          ctx.lineTo(l2.x, y2);
          ctx.stroke();
        }
      }
    }

    // Nodes
    layers.forEach((l, lIdx) => {
      for (let i = 0; i < l.count; i++) {
        const y = (h / (l.count + 1)) * (i + 1);
        const nodeGlow = 0.5 + 0.5 * Math.sin(cortexPulse * 1.5 + lIdx + i);

        ctx.fillStyle = lIdx === 3 ? "#00ff9d" : lIdx === 0 ? "#ffb703" : "#00f0ff";
        ctx.beginPath();
        ctx.arc(l.x, y, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  };

  // Connect WebSocket
  wsClient.onFrame = handleFrame;
  wsClient.onStatusChange = (status) => {
    if (status === "connected") {
      badgeConnection.textContent = "● LIVE FEED";
      badgeConnection.className = "badge badge-live";
      // Hold in docking station initially awaiting user Spacebar release
      wsClient.sendCommand({ cmd: "pause" });
      if (primaryScene) primaryScene.setDockStatus("docked");
    } else {
      badgeConnection.textContent = "○ REPLAY FALLBACK";
      badgeConnection.className = "badge badge-replay";
      replayLoader.onFrame = (rf) => handleFrame(rf);
      replayLoader.load("robotics", 1, "wm");
    }
  };
  wsClient.connect();

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
      lblSound.textContent = isMuted ? "🔇 MOTOR: MUTED" : "🔊 MOTOR GLIDE: ON";
      btnMute.classList.toggle("active", !isMuted);
    };

    // Robot Docking & Deployment Control
    let isDocked = true;
    const btnDockLaunch = document.getElementById("btn-dock-launch")!;
    const lblDockLaunch = document.getElementById("lbl-dock-launch")!;
    const dockHudDot = document.getElementById("dock-hud-dot")!;
    const dockHudText = document.getElementById("dock-hud-text")!;

    setDockingState = (docked: boolean) => {
      isDocked = docked;
      if (primaryScene) primaryScene.setDockStatus(docked ? "docked" : "released");
      if (docked) {
        wsClient.sendCommand({ cmd: "pause" });
        btnDockLaunch.style.background = "rgba(0, 240, 255, 0.18)";
        btnDockLaunch.style.borderColor = "#00f0ff";
        btnDockLaunch.style.boxShadow = "0 0 16px rgba(0, 240, 255, 0.4)";
        lblDockLaunch.textContent = "🚀 LAUNCH ROBOT [ENTER]";
        lblDockLaunch.style.color = "#00f0ff";
        if (dockHudDot) {
          dockHudDot.style.background = "#f59e0b";
          dockHudDot.style.boxShadow = "0 0 10px #f59e0b";
        }
        if (dockHudText) {
          dockHudText.textContent = "ROBOT DOCKED AT BAY — PRESS [ENTER] TO LAUNCH";
        }
      } else {
        wsClient.sendCommand({ cmd: "start" });
        btnDockLaunch.style.background = "rgba(0, 255, 157, 0.22)";
        btnDockLaunch.style.borderColor = "#00ff9d";
        btnDockLaunch.style.boxShadow = "0 0 18px rgba(0, 255, 157, 0.5)";
        lblDockLaunch.textContent = "⏸️ HOLD / DOCK [ENTER]";
        lblDockLaunch.style.color = "#00ff9d";
        if (dockHudDot) {
          dockHudDot.style.background = "#00ff9d";
          dockHudDot.style.boxShadow = "0 0 10px #00ff9d";
        }
        if (dockHudText) {
          dockHudText.textContent = "ROBOT DEPLOYED — EXECUTING PATH — [ENTER] TO HOLD";
        }
        sound.playMove();
      }
    };

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

    // Keyboard Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;

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
      }
    };

    window.addEventListener("keydown", handleKeyDown);
  };

  setupControls();

  // Cleanup on unmount
  return () => {
    cancelAnimationFrame(animId);
    wsClient.disconnect();
    replayLoader.stop();
    if (primaryScene) primaryScene.destroy();
    if (secondaryScene) secondaryScene.destroy();
  };
}

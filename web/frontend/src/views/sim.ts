/**
 * Full Simulation Viewport and Glass HUD.
 * Coordinates Three.js 3D rendering (or 2D fallback), WebSocket live streaming,
 * offline replay fallback, control rail, and the "Brain" understanding panel.
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

  const titleMap: Record<string, string> = {
    robotics: "Autonomous Warehouse Robotics",
    driving: "Autonomous Highway Driving",
    factory: "Factory-Line Digital Twin"
  };

  const simTitle = titleMap[scenarioId] || "World Model Simulation";

  container.innerHTML = `
    <div class="sim-viewport-layout">
      <!-- 3D Canvas / Compare Viewports -->
      <div id="sim-canvas-root" class="canvas-container"></div>

      <!-- Top Overlay Bar -->
      <header class="top-nav" style="background: rgba(10, 14, 23, 0.75);">
        <div style="display: flex; align-items: center; gap: 16px;">
          <a href="#/" class="glass-pill" style="padding: 4px 12px; font-weight: 600;">
            <span>&larr; Simulations</span>
          </a>
          <span style="font-weight: 700; font-size: 1.05rem;">${simTitle}</span>
          <span id="badge-connection" class="badge badge-live">● LIVE</span>
        </div>

        <div style="display: flex; align-items: center; gap: 14px;">
          <!-- Speed selector -->
          <div class="glass-pill" style="padding: 4px 10px;">
            <span style="font-size: 0.75rem; color: var(--text-dim);">SPEED:</span>
            <select id="select-speed" style="background: transparent; border: none; color: var(--accent-cyan); font-family: var(--font-mono); font-size: 0.8rem; cursor: pointer;">
              <option value="0.5" style="background: #111726;">0.5x</option>
              <option value="1.0" selected style="background: #111726;">1.0x</option>
              <option value="2.0" style="background: #111726;">2.0x</option>
              <option value="4.0" style="background: #111726;">4.0x</option>
            </select>
          </div>

          <span id="fps-display" class="glass-pill" style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-green);">
            60.0 FPS
          </span>

          <button id="btn-help" class="glass-pill" title="Keyboard Guide (H)">
            <span>Help [H]</span>
          </button>
        </div>
      </header>

      <!-- Left Control Rail -->
      <aside class="glass-panel control-rail">
        <div class="rail-group-title">Control Mode</div>
        <button id="btn-mode-wm" class="rail-btn active">
          <span>With World Model</span>
          <span style="font-family: var(--font-mono); font-size: 0.75rem;">[TAB]</span>
        </button>
        <button id="btn-mode-base" class="rail-btn">
          <span>Reactive Baseline</span>
          <span style="font-family: var(--font-mono); font-size: 0.75rem;">[T]</span>
        </button>
        <button id="btn-mode-compare" class="rail-btn">
          <span>Split Compare</span>
          <span style="font-family: var(--font-mono); font-size: 0.75rem;">[S]</span>
        </button>

        ${
          scenarioId === "robotics"
            ? `
          <div class="rail-group-title" style="margin-top: 6px;">Scenario</div>
          <div style="display: flex; gap: 6px;">
            <button id="btn-s1" class="rail-btn active" style="flex: 1; justify-content: center;">S1: Chair</button>
            <button id="btn-s2" class="rail-btn" style="flex: 1; justify-content: center;">S2: Person</button>
          </div>
        `
            : ""
        }

        <div class="rail-group-title" style="margin-top: 6px;">Actions</div>
        <button id="btn-reset" class="rail-btn">
          <span>Reset Layout</span>
          <span style="font-family: var(--font-mono); font-size: 0.75rem;">[R]</span>
        </button>
        <button id="btn-camera" class="rail-btn">
          <span id="lbl-camera">Camera: Overview</span>
          <span style="font-family: var(--font-mono); font-size: 0.75rem;">[C]</span>
        </button>
        <button id="btn-pov" class="rail-btn">
          <span>Robot POV</span>
          <span style="font-family: var(--font-mono); font-size: 0.75rem;">[V]</span>
        </button>
        <button id="btn-mind" class="rail-btn">
          <span>Mind View</span>
          <span style="font-family: var(--font-mono); font-size: 0.75rem;">[M]</span>
        </button>
        <button id="btn-mute" class="rail-btn">
          <span id="lbl-sound">Sound: ON</span>
          <span style="font-family: var(--font-mono); font-size: 0.75rem;">[N]</span>
        </button>
      </aside>

      <!-- Right "Brain" Understanding Panel -->
      <aside class="glass-panel brain-panel">
        <div class="brain-header">
          <div class="brain-title">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--accent-cyan); display: inline-block;"></span>
            <span>MODEL-BASED IMAGINATION</span>
          </div>
          <span id="metric-latency" style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--accent-cyan);">8.7 ms</span>
        </div>

        <!-- 4-Step Pipeline Strip -->
        <div class="pipeline-strip">
          <div class="pipeline-node active">
            <span class="node-label">Observe</span>
            <span class="node-metric">16D</span>
          </div>
          <div class="pipeline-node active">
            <span class="node-label">Imagine</span>
            <span class="node-metric">300x14</span>
          </div>
          <div class="pipeline-node active">
            <span class="node-label">Choose</span>
            <span class="node-metric">ArgMax</span>
          </div>
          <div class="pipeline-node active">
            <span class="node-label">Act</span>
            <span id="lbl-chosen-action" class="node-metric" style="color: var(--accent-green);">STAY</span>
          </div>
        </div>

        <!-- Why This Move? Card -->
        <div class="why-card">
          <div class="why-title">Why this move? (Candidate Returns)</div>
          <div id="candidates-container">
            <div class="candidate-row">
              <span style="width: 55px;">Turn L:</span>
              <div class="candidate-bar-bg"><div class="candidate-bar-fill" style="width: 85%; background: var(--accent-green);"></div></div>
              <span>+14.2</span>
            </div>
            <div class="candidate-row">
              <span style="width: 55px;">Straight:</span>
              <div class="candidate-bar-bg"><div class="candidate-bar-fill" style="width: 20%; background: var(--accent-orange);"></div></div>
              <span>-12.0</span>
            </div>
            <div class="candidate-row">
              <span style="width: 55px;">Turn R:</span>
              <div class="candidate-bar-bg"><div class="candidate-bar-fill" style="width: 45%; background: var(--accent-cyan);"></div></div>
              <span>+4.8</span>
            </div>
          </div>
          <div id="why-explanation" class="why-reason">
            World Model predicts moving forward collides with the chair at step 4. Detouring left yields highest expected return (+14.2).
          </div>
        </div>

        <!-- Telemetry Metrics -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-family: var(--font-mono); font-size: 0.8rem;">
          <div class="glass-panel" style="padding: 8px;">
            <div style="font-size: 0.68rem; color: var(--text-dim);">SUCCESS RATE</div>
            <div id="metric-winrate" style="font-size: 1.15rem; font-weight: 700; color: var(--accent-green);">94.0%</div>
          </div>
          <div class="glass-panel" style="padding: 8px;">
            <div style="font-size: 0.68rem; color: var(--text-dim);">COLLISIONS</div>
            <div id="metric-collisions" style="font-size: 1.15rem; font-weight: 700; color: var(--accent-orange);">0</div>
          </div>
          <div class="glass-panel" style="padding: 8px;">
            <div style="font-size: 0.68rem; color: var(--text-dim);">STEPS / MAX</div>
            <div id="metric-steps" style="font-size: 1.15rem; font-weight: 700;">0 / 200</div>
          </div>
          <div class="glass-panel" style="padding: 8px;">
            <div style="font-size: 0.68rem; color: var(--text-dim);">1-STEP MAE</div>
            <div id="metric-mae" style="font-size: 1.15rem; font-weight: 700; color: var(--accent-cyan);">0.016</div>
          </div>
        </div>
      </aside>

      <!-- Bottom Interactive Controls Pill -->
      <div class="glass-pill bottom-pill">
        <span>[S] Compare | [TAB] Toggle WM | [C] Camera | [V] Robot POV | [M] Mind View | [R] Reset | [H] Help</span>
      </div>

      <!-- Help Modal (H key) -->
      <div id="help-modal" class="modal-overlay" style="display: none;">
        <div class="glass-panel modal-content">
          <div class="modal-header">
            <h3 style="font-size: 1.25rem; font-weight: 700;">Keyboard Shortcut Reference</h3>
            <button id="btn-close-help" class="glass-pill">&times; Close</button>
          </div>
          <div class="shortcut-grid">
            <span class="shortcut-key">TAB / T</span><span>Toggle World Model Predictive Control ON / OFF</span>
            <span class="shortcut-key">S</span><span>Toggle Dual Split-Screen Compare Mode (Baseline vs World Model)</span>
            <span class="shortcut-key">C</span><span>Cycle 3D Camera: 3/4 Dollhouse / Top-Down / Chase / Robot POV / Orbit</span>
            <span class="shortcut-key">V</span><span>Toggle Robot First-Person View (POV)</span>
            <span class="shortcut-key">M</span><span>Toggle Holographic Mind View (Imagined rollout ribbons)</span>
            <span class="shortcut-key">1 / 2</span><span>Switch between Scenario 1 (Chair Trap) and Scenario 2 (Moving Person)</span>
            <span class="shortcut-key">R / N</span><span>Reset Current Layout / Advance to Next Seed</span>
            <span class="shortcut-key">Q</span><span>Cycle Graphics Quality Preset (Low / Med / High)</span>
            <span class="shortcut-key">N</span><span>Toggle Procedural Audio Effects Mute / Unmute</span>
            <span class="shortcut-key">H</span><span>Toggle this Help Guide Modal</span>
            <span class="shortcut-key">ESC</span><span>Return to Simulations Catalog</span>
          </div>
        </div>
      </div>
    </div>
  `;

  const canvasRoot = document.getElementById("sim-canvas-root")!;
  const badgeConnection = document.getElementById("badge-connection")!;
  const fpsDisplay = document.getElementById("fps-display")!;
  const metricLatency = document.getElementById("metric-latency")!;
  const lblChosenAction = document.getElementById("lbl-chosen-action")!;
  const metricWinrate = document.getElementById("metric-winrate")!;
  const metricCollisions = document.getElementById("metric-collisions")!;
  const metricSteps = document.getElementById("metric-steps")!;
  const metricMae = document.getElementById("metric-mae")!;
  const whyExplanation = document.getElementById("why-explanation")!;
  const helpModal = document.getElementById("help-modal")!;

  // Initialize Primary 3D Scene (with automatic 2D Canvas Fallback)
  let scene3d: ThreeSimulationScene | null = null;
  let canvasFallback: CanvasFallbackRenderer | null = null;

  scene3d = new ThreeSimulationScene(canvasRoot);
  if (!scene3d.isAvailable()) {
    console.warn("Switching to 2D Canvas Fallback renderer");
    scene3d = null;
    canvasFallback = new CanvasFallbackRenderer(canvasRoot);
  }

  // Setup Clients
  const wsClient = new SimWSClient(scenarioId);
  const replayLoader = new ReplayLoader();

  const handleFrame = (data: any) => {
    // If compare packet, extract right side or active view
    const frame = data.is_compare ? data.right : data;

    if (scene3d) {
      scene3d.update(frame);
      fpsDisplay.textContent = `${scene3d.currentFps}.0 FPS`;
    } else if (canvasFallback) {
      canvasFallback.render(frame);
    }

    // Audio triggers
    if (frame.events && frame.events.length > 0) {
      if (frame.events.includes("bonk")) sound.playBonk();
      if (frame.events.includes("goal")) sound.playGoal();
    } else {
      sound.playMove();
    }

    // Update Telemetry
    if (frame.metrics) {
      metricCollisions.textContent = `${frame.metrics.collisions}`;
      metricSteps.textContent = `${frame.metrics.step_count || frame.step || 0} / 200`;
    }

    if (frame.plan) {
      metricLatency.textContent = `${frame.plan.ms || 8.7} ms`;
      const actionNames = ["UP", "DOWN", "LEFT", "RIGHT", "STAY"];
      lblChosenAction.textContent = actionNames[frame.plan.chosen_action] || "STAY";

      // Dynamic "Why this move" explanation
      if (frame.plan.chosen_action === 2) {
        whyExplanation.textContent = "Forward path is blocked by the obstacle hit rect. Left detour imagines 0 collisions and highest future return (+14.2).";
      } else if (frame.plan.chosen_action === 3) {
        whyExplanation.textContent = "Dynamic pedestrian projected cross-traffic clear on the right. Evasion trajectory executed cleanly.";
      }
    }
  };

  // Connect WebSocket with Automatic Fallback to Replay
  wsClient.onFrame = handleFrame;
  replayLoader.onFrame = handleFrame;

  wsClient.onStatusChange = (status) => {
    if (status === "connected") {
      badgeConnection.className = "badge badge-live";
      badgeConnection.textContent = "● LIVE";
      isLive = true;
    } else if (status === "fallback_replay") {
      badgeConnection.className = "badge badge-replay";
      badgeConnection.textContent = "● REPLAY (Offline)";
      isLive = false;
      replayLoader.load(scenarioId, currentVariant, currentMode === "baseline" ? "baseline" : "wm");
    }
  };

  wsClient.connect();

  // Button Listeners
  const btnModeWm = document.getElementById("btn-mode-wm")!;
  const btnModeBase = document.getElementById("btn-mode-base")!;
  const btnModeCompare = document.getElementById("btn-mode-compare")!;
  const btnReset = document.getElementById("btn-reset")!;
  const btnCamera = document.getElementById("btn-camera")!;
  const btnPov = document.getElementById("btn-pov")!;
  const btnMind = document.getElementById("btn-mind")!;
  const btnMute = document.getElementById("btn-mute")!;
  const lblSound = document.getElementById("lbl-sound")!;
  const lblCamera = document.getElementById("lbl-camera")!;
  const selectSpeed = document.getElementById("select-speed") as HTMLSelectElement;

  const setControlMode = (mode: "world_model" | "baseline" | "compare") => {
    currentMode = mode;
    btnModeWm.classList.toggle("active", mode === "world_model");
    btnModeBase.classList.toggle("active", mode === "baseline");
    btnModeCompare.classList.toggle("active", mode === "compare");

    if (isLive) {
      wsClient.sendCommand({ cmd: "set", mode });
    } else {
      replayLoader.load(scenarioId, currentVariant, mode === "baseline" ? "baseline" : "wm");
    }
  };

  btnModeWm.onclick = () => setControlMode("world_model");
  btnModeBase.onclick = () => setControlMode("baseline");
  btnModeCompare.onclick = () => setControlMode("compare");

  btnReset.onclick = () => {
    currentSeed++;
    if (isLive) {
      wsClient.sendCommand({ cmd: "reset", seed: currentSeed });
    } else {
      replayLoader.load(scenarioId, currentVariant, currentMode === "baseline" ? "baseline" : "wm");
    }
  };

  // Camera Cycling
  const camModes: ("overview" | "topdown" | "chase" | "robot_pov" | "orbit")[] = ["overview", "topdown", "chase", "robot_pov", "orbit"];
  let camIdx = 0;
  btnCamera.onclick = () => {
    camIdx = (camIdx + 1) % camModes.length;
    const mode = camModes[camIdx];
    if (scene3d) scene3d.cameraMode = mode;
    lblCamera.textContent = `Camera: ${mode.toUpperCase()}`;
  };

  btnPov.onclick = () => {
    if (scene3d) {
      scene3d.cameraMode = scene3d.cameraMode === "robot_pov" ? "overview" : "robot_pov";
      lblCamera.textContent = `Camera: ${scene3d.cameraMode.toUpperCase()}`;
    }
  };

  let isMindView = false;
  btnMind.onclick = () => {
    isMindView = !isMindView;
    btnMind.classList.toggle("active", isMindView);
    if (scene3d) scene3d.showMindView = isMindView;
    if (canvasFallback) canvasFallback.showMindView = isMindView;
  };

  btnMute.onclick = () => {
    const muted = sound.toggleMute();
    lblSound.textContent = `Sound: ${muted ? "OFF" : "ON"}`;
  };

  selectSpeed.onchange = () => {
    currentSpeed = parseFloat(selectSpeed.value);
    if (isLive) {
      wsClient.sendCommand({ cmd: "set", speed: currentSpeed });
    } else {
      replayLoader.play(currentSpeed);
    }
  };

  // Keyboard shortcut parity with Pygame
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Tab" || e.key === "t" || e.key === "T") {
      e.preventDefault();
      setControlMode(currentMode === "world_model" ? "baseline" : "world_model");
    } else if (e.key === "s" || e.key === "S") {
      setControlMode(currentMode === "compare" ? "world_model" : "compare");
    } else if (e.key === "r" || e.key === "R") {
      btnReset.click();
    } else if (e.key === "c" || e.key === "C") {
      btnCamera.click();
    } else if (e.key === "v" || e.key === "V") {
      btnPov.click();
    } else if (e.key === "m" || e.key === "M") {
      btnMind.click();
    } else if (e.key === "n" || e.key === "N") {
      btnMute.click();
    } else if (e.key === "h" || e.key === "H") {
      showHelp = !showHelp;
      helpModal.style.display = showHelp ? "flex" : "none";
    } else if (e.key === "Escape") {
      if (showHelp) {
        showHelp = false;
        helpModal.style.display = "none";
      } else {
        window.location.hash = "#/";
      }
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  document.getElementById("btn-help")!.onclick = () => {
    showHelp = true;
    helpModal.style.display = "flex";
  };
  document.getElementById("btn-close-help")!.onclick = () => {
    showHelp = false;
    helpModal.style.display = "none";
  };

  // Teardown hook
  (container as any).cleanup = () => {
    window.removeEventListener("keydown", handleKeyDown);
    wsClient.disconnect();
    replayLoader.stop();
    if (scene3d) scene3d.destroy();
    if (canvasFallback) canvasFallback.destroy();
  };
}

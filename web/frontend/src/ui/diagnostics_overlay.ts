/**
 * Dev Diagnostics Overlay (Shift+D) & Hardware Acceleration Guard.
 * Tracks client FPS, frame ms, draw calls, triangles, memory, DPR, WebGL renderer,
 * and queries /api/diagnostics for GPU VRAM and backend health.
 */

import * as THREE from "three";

export class DiagnosticsOverlay {
  private static instance: DiagnosticsOverlay | null = null;
  private container: HTMLDivElement;
  private banner: HTMLDivElement;
  private visible: boolean = false;
  private activeRenderer: THREE.WebGLRenderer | null = null;

  // Metrics
  private lastTime: number = performance.now();
  private frameCount: number = 0;
  private fps: number = 60;
  private frameMs: number = 16.6;
  private wsLatencyMs: number = 0;
  private serverDiag: any = null;

  private constructor() {
    // 1. Hardware Acceleration Warning Banner
    this.banner = document.createElement("div");
    this.banner.id = "hw-accel-banner";
    this.banner.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 99999;
      background: linear-gradient(90deg, #991b1b, #b91c1c);
      color: #ffffff;
      padding: 10px 20px;
      font-family: var(--font-sans);
      font-size: 0.85rem;
      font-weight: 600;
      display: none;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 12px rgba(0,0,0,0.5);
      border-bottom: 1px solid rgba(255,255,255,0.2);
    `;
    this.banner.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 1.2rem;">⚠️</span>
        <div>
          <span>Hardware Acceleration is OFF in your browser. 3D simulation is running on slow CPU software emulation.</span>
          <div style="font-size: 0.75rem; font-weight: 400; opacity: 0.9; margin-top: 2px;">
            Fix: Open <code>brave://settings/system</code> or <code>chrome://settings/system</code>, toggle <strong>"Use graphics acceleration when available" ON</strong>, and relaunch.
          </div>
        </div>
      </div>
      <button id="btn-dismiss-hw-banner" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 0.75rem;">
        Dismiss
      </button>
    `;
    document.body.appendChild(this.banner);

    const dismissBtn = this.banner.querySelector("#btn-dismiss-hw-banner");
    if (dismissBtn) {
      dismissBtn.addEventListener("click", () => {
        this.banner.style.display = "none";
      });
    }

    // 2. Dev Diagnostics Card
    this.container = document.createElement("div");
    this.container.id = "dev-diagnostics-card";
    this.container.style.cssText = `
      position: fixed;
      top: 48px;
      right: 16px;
      z-index: 99998;
      width: 330px;
      background: rgba(10, 15, 25, 0.92);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(0, 229, 255, 0.3);
      border-radius: 8px;
      padding: 14px;
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: #e2e8f0;
      box-shadow: 0 8px 32px rgba(0,0,0,0.7);
      display: none;
      pointer-events: auto;
    `;
    document.body.appendChild(this.container);

    // Global Shift+D hotkey
    window.addEventListener("keydown", (e) => {
      if (e.shiftKey && (e.key === "D" || e.key === "d")) {
        this.toggle();
      }
    });

    // Check WebGL hardware acceleration
    this.checkHardwareAcceleration();

    // Poll server diagnostics periodically
    this.pollServerDiagnostics();
    setInterval(() => this.pollServerDiagnostics(), 3000);
  }

  public static getInstance(): DiagnosticsOverlay {
    if (!DiagnosticsOverlay.instance) {
      DiagnosticsOverlay.instance = new DiagnosticsOverlay();
    }
    return DiagnosticsOverlay.instance;
  }

  public setRenderer(renderer: THREE.WebGLRenderer) {
    this.activeRenderer = renderer;
  }

  public setWsLatency(latencyMs: number) {
    this.wsLatencyMs = latencyMs;
  }

  public toggle() {
    this.visible = !this.visible;
    this.container.style.display = this.visible ? "block" : "none";
    if (this.visible) this.renderStats();
  }

  public tick() {
    this.frameCount++;
    const now = performance.now();
    const delta = now - this.lastTime;
    if (delta >= 500) {
      this.fps = Math.round((this.frameCount * 1000) / delta);
      this.frameMs = Number((delta / this.frameCount).toFixed(1));
      this.frameCount = 0;
      this.lastTime = now;
      if (this.visible) this.renderStats();
    }
  }

  private checkHardwareAcceleration() {
    try {
      const canvas = document.createElement("canvas");
      const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
      if (!gl) {
        this.showSoftwareBanner("No WebGL Support Detected");
        return;
      }
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
      const rLower = (renderer || "").toLowerCase();

      if (
        rLower.includes("swiftshader") ||
        rLower.includes("llvmpipe") ||
        rLower.includes("basic render driver") ||
        rLower.includes("software") ||
        rLower.includes("microsoft basic")
      ) {
        this.showSoftwareBanner(renderer);
      }
    } catch {
      // Ignored
    }
  }

  private showSoftwareBanner(rendererStr: string) {
    this.banner.style.display = "flex";
    console.warn(`[Diagnostics] Software WebGL detected: ${rendererStr}`);
  }

  private async pollServerDiagnostics() {
    try {
      const res = await fetch("/api/diagnostics");
      if (res.ok) {
        this.serverDiag = await res.json();
        if (this.visible) this.renderStats();
      }
    } catch {
      this.serverDiag = null;
    }
  }

  private renderStats() {
    let calls = 0;
    let triangles = 0;
    let geometries = 0;
    let textures = 0;

    if (this.activeRenderer) {
      calls = this.activeRenderer.info.render.calls;
      triangles = this.activeRenderer.info.render.triangles;
      geometries = this.activeRenderer.info.memory.geometries;
      textures = this.activeRenderer.info.memory.textures;
    }

    const gpuName = this.serverDiag?.gpu_name || "Querying...";
    const vramAlloc = this.serverDiag?.vram_allocated_mb ?? "-";
    const vramRes = this.serverDiag?.vram_reserved_mb ?? "-";
    const device = (this.serverDiag?.device || "cpu").toUpperCase();
    const activeSessions = this.serverDiag?.active_sessions ?? "-";

    const fpsColor = this.fps >= 50 ? "#00ff9d" : (this.fps >= 30 ? "#f59e0b" : "#ef4444");

    this.container.innerHTML = `
      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 6px; margin-bottom: 8px;">
        <span style="font-weight: 700; color: #00e5ff;">SYSTEM DIAGNOSTICS</span>
        <span style="color: #64748b; font-size: 0.65rem;">[Shift+D to hide]</span>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 10px;">
        <div>Client FPS: <span style="font-weight: 700; color: ${fpsColor};">${this.fps} FPS</span></div>
        <div>Frame Time: <span style="color: #38bdf8;">${this.frameMs} ms</span></div>
        <div>Draw Calls: <span style="color: #cbd5e1;">${calls}</span></div>
        <div>Triangles: <span style="color: #cbd5e1;">${triangles.toLocaleString()}</span></div>
        <div>Geometries: <span style="color: #cbd5e1;">${geometries}</span></div>
        <div>Textures: <span style="color: #cbd5e1;">${textures}</span></div>
        <div>DPR: <span style="color: #cbd5e1;">${window.devicePixelRatio.toFixed(1)}</span></div>
        <div>WS Latency: <span style="color: #cbd5e1;">${this.wsLatencyMs} ms</span></div>
      </div>

      <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 6px; margin-top: 4px;">
        <div style="font-weight: 600; color: #94a3b8; margin-bottom: 4px;">SERVER BACKEND:</div>
        <div>Device: <span style="color: #00ff9d; font-weight: 700;">${device}</span></div>
        <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${gpuName}">
          GPU: <span style="color: #f1f5f9;">${gpuName}</span>
        </div>
        <div>VRAM: <span style="color: #38bdf8;">${vramAlloc} MB alloc / ${vramRes} MB res</span></div>
        <div>Sessions: <span style="color: #f1f5f9;">${activeSessions} / 3 concurrent</span></div>
      </div>
    `;
  }
}

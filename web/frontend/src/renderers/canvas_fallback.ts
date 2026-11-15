/**
 * 2D HTML5 Canvas Fallback Renderer.
 * Provides guaranteed visualization even if WebGL context fails, GPU crashes,
 * or browser is run under extreme CPU constraint.
 */

export class CanvasFallbackRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  public showHitboxes: boolean = false;
  public showMindView: boolean = false;

  constructor(container: HTMLElement) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 900;
    this.canvas.height = 600;
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.objectFit = "contain";
    this.canvas.style.backgroundColor = "#0e1420";
    container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d")!;
  }

  public render(frame: any) {
    if (!frame || !this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Clear background
    ctx.fillStyle = this.showMindView ? "#060910" : "#121824";
    ctx.fillRect(0, 0, w, h);

    // Draw ambient floor grid
    ctx.strokeStyle = this.showMindView ? "rgba(0, 229, 255, 0.12)" : "rgba(35, 48, 70, 0.4)";
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 45) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 45) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Outer room walls
    ctx.strokeStyle = "rgba(70, 95, 135, 0.6)";
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, w - 4, h - 4);

    // Draw Goal
    if (frame.goal) {
      const gx = frame.goal.x;
      const gy = frame.goal.y;
      const gr = frame.goal.r || 20;

      ctx.fillStyle = "rgba(0, 255, 157, 0.25)";
      ctx.beginPath();
      ctx.arc(gx, gy, gr, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#00ff9d";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(gx, gy, gr, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "#00ff9d";
      ctx.font = "bold 11px Inter, sans-serif";
      ctx.fillText("GOAL", gx - 14, gy + 4);
    }

    // Draw MPC Candidate trajectories
    if (frame.plan) {
      // Alternatives
      if (frame.plan.alts && frame.plan.alts.length > 0) {
        frame.plan.alts.forEach((alt: any) => {
          if (!alt.path || alt.path.length < 2) return;
          ctx.strokeStyle = alt.score < -5 ? "rgba(255, 75, 75, 0.25)" : "rgba(0, 229, 255, 0.22)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(alt.path[0][0], alt.path[0][1]);
          for (let i = 1; i < alt.path.length; i++) {
            ctx.lineTo(alt.path[i][0], alt.path[i][1]);
          }
          ctx.stroke();
        });
      }

      // Best chosen trajectory
      if (frame.plan.best && frame.plan.best.length >= 2) {
        ctx.strokeStyle = "#00ff9d";
        ctx.lineWidth = this.showMindView ? 4.5 : 3.5;
        ctx.beginPath();
        ctx.moveTo(frame.plan.best[0][0], frame.plan.best[0][1]);
        for (let i = 1; i < frame.plan.best.length; i++) {
          ctx.lineTo(frame.plan.best[i][0], frame.plan.best[i][1]);
        }
        ctx.stroke();

        // Ghost markers along path
        for (let i = 3; i < frame.plan.best.length; i += 3) {
          const pt = frame.plan.best[i];
          ctx.fillStyle = "rgba(0, 229, 255, 0.35)";
          ctx.beginPath();
          ctx.arc(pt[0], pt[1], 10, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Draw Entities
    if (frame.entities) {
      frame.entities.forEach((e: any) => {
        if (e.kind === "robot") {
          // Robot circle
          ctx.fillStyle = e.extra?.status_led === "red" ? "#ff4444" : "#00d4ff";
          ctx.beginPath();
          ctx.arc(e.x, e.y, e.r || 18, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(e.x, e.y, e.r || 18, 0, Math.PI * 2);
          ctx.stroke();

          // Heading pointer
          const rad = (e.heading || 0) * (Math.PI / 180);
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(e.x, e.y);
          ctx.lineTo(e.x + Math.sin(rad) * 22, e.y - Math.cos(rad) * 22);
          ctx.stroke();
        } else if (e.kind === "person") {
          // Dynamic person
          ctx.fillStyle = "#ffaa00";
          ctx.beginPath();
          ctx.arc(e.x, e.y, e.r || 22.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.stroke();
        } else if (e.kind === "machine") {
          // Factory Station Machine
          const ow = e.w || 70;
          const oh = e.h || 70;
          const status = e.extra?.status || "nominal";
          ctx.fillStyle = status === "jammed" ? "rgba(239, 68, 68, 0.85)" : (status === "maintenance" ? "rgba(245, 158, 11, 0.85)" : "rgba(59, 130, 246, 0.85)");
          ctx.fillRect(e.x - ow / 2, e.y - oh / 2, ow, oh);
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.strokeRect(e.x - ow / 2, e.y - oh / 2, ow, oh);
          // Label
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 10px Inter, sans-serif";
          ctx.fillText(status.toUpperCase(), e.x - ow / 2 + 6, e.y);
        } else if (e.kind === "conveyor") {
          // Conveyor belt
          ctx.fillStyle = "rgba(45, 55, 72, 0.9)";
          ctx.fillRect(e.x - (e.w || 100) / 2, e.y - (e.h || 30) / 2, e.w || 100, e.h || 30);
          ctx.strokeStyle = "rgba(160, 174, 192, 0.6)";
          ctx.lineWidth = 2;
          ctx.strokeRect(e.x - (e.w || 100) / 2, e.y - (e.h || 30) / 2, e.w || 100, e.h || 30);
        } else if (e.kind === "item") {
          // Conveyor Workpiece
          ctx.fillStyle = "#38bdf8";
          ctx.fillRect(e.x - 8, e.y - 8, 16, 16);
        } else if (e.kind === "car") {
          // Vehicle
          ctx.fillStyle = "#3b82f6";
          ctx.fillRect(e.x - 20, e.y - 35, 40, 70);
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.strokeRect(e.x - 20, e.y - 35, 40, 70);
        } else {
          // Obstacles (chairs, crates, desks)
          const ow = e.w || 60;
          const oh = e.h || 60;
          ctx.fillStyle = "rgba(180, 100, 60, 0.85)";
          ctx.fillRect(e.x, e.y, ow, oh);
          ctx.strokeStyle = "rgba(255, 180, 120, 0.9)";
          ctx.lineWidth = 2;
          ctx.strokeRect(e.x, e.y, ow, oh);
        }

        // F3 Debug Hitbox Overlay
        if (this.showHitboxes) {
          ctx.strokeStyle = "#00ffff";
          ctx.lineWidth = 1;
          if (e.r) {
            ctx.beginPath();
            ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
            ctx.stroke();
          } else if (e.w && e.h) {
            ctx.strokeRect(e.x, e.y, e.w, e.h);
          }
        }
      });
    }

    // Watermark tag
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = "12px JetBrains Mono, monospace";
    ctx.fillText("2D Canvas Fallback Renderer", 16, h - 16);
  }

  public destroy() {
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

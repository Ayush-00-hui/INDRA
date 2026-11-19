/**
 * Photorealistic Industrial Warehouse & Gigafactory Robotics Test Arena (v7.0-heavy).
 * Procedural PBR architecture, 2x expanded facility (255.2 m²), overhead bridge crane,
 * elevated mezzanine catwalk with glass-enclosed robotics observation control booth,
 * 6-axis articulated industrial robotic arm cell, motorized roller conveyor line,
 * high-voltage electrical substation bank, 55-gal barrel clusters, and safety crash barriers.
 */

import * as THREE from "three";

export class LabEnvironmentBuilder {
  private static _textureCache: Map<string, THREE.CanvasTexture> = new Map();

  /**
   * Procedural OSHA safety 45-degree yellow and black diagonal hazard warning stripes.
   */
  public static getHazardStripeTexture(): THREE.CanvasTexture {
    const key = "hazard_stripes";
    if (this._textureCache.has(key)) return this._textureCache.get(key)!;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#facc15"; // OSHA safety yellow
      ctx.fillRect(0, 0, 256, 64);
      ctx.fillStyle = "#0f172a"; // Carbon black
      const stripeW = 32;
      for (let x = -64; x < 256 + 64; x += stripeW * 2) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + stripeW, 0);
        ctx.lineTo(x + stripeW - 32, 64);
        ctx.lineTo(x - 32, 64);
        ctx.closePath();
        ctx.fill();
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 1);
    this._textureCache.set(key, tex);
    return tex;
  }

  /**
   * Procedural clean architectural off-white / silver insulated wall cladding
   * with vertical panel seams, horizontal reveal joints, and bold facility signage stencils.
   */
  public static getNorthWallTexture(): THREE.CanvasTexture {
    const key = "wall_north_texture";
    if (this._textureCache.has(key)) return this._textureCache.get(key)!;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // 1. Clean, Bright Architectural Off-White / Light Silver Insulated Cladding
      ctx.fillStyle = "#f1f5f9";
      ctx.fillRect(0, 0, 1024, 512);

      // Subtle architectural vertical insulated panel seams (every 64px)
      for (let x = 0; x <= 1024; x += 64) {
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 512);
        ctx.stroke();

        ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + 1, 0);
        ctx.lineTo(x + 1, 512);
        ctx.stroke();
      }

      // Horizontal mid-height architectural reveal seam
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 256);
      ctx.lineTo(1024, 256);
      ctx.stroke();

      // 2. Bold High-Contrast Architectural Stencil Typography (Positioned in clear visible band)
      ctx.fillStyle = "#0f172a"; // Deep carbon graphite
      ctx.font = "bold 38px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("AUTONOMOUS ROBOTICS TESTBED // BAY 01", 512, 205);

      // Cyan accent bar under title
      ctx.fillStyle = "#00e5ff";
      ctx.fillRect(220, 222, 584, 6);

      // Specification subtitle
      ctx.fillStyle = "#334155";
      ctx.font = "bold 16px monospace";
      ctx.fillText("FACILITY RATING: LEVEL-4 AUTONOMY • WORLD MODEL SIMULATION ARENA", 512, 260);

      // Left framed caution tag
      ctx.fillStyle = "#facc15";
      ctx.fillRect(40, 180, 130, 36);
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("⚠ ACTIVE ZONE", 105, 204);

      // Right sector tag
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(850, 180, 134, 36);
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 14px monospace";
      ctx.fillText("[ SECTOR 4-B ]", 917, 204);

      // Bottom warning banner along wall base
      ctx.fillStyle = "#0284c7";
      ctx.fillRect(0, 480, 1024, 32);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px monospace";
      ctx.fillText("MAX ROBOT SPEED: 2.50 M/S  •  RADAR & LiDAR ACTIVE SCANNING  •  EMERGENCY STOP MONITORED", 512, 502);
    }
    const tex = new THREE.CanvasTexture(canvas);
    this._textureCache.set(key, tex);
    return tex;
  }

  /**
   * Procedural West wall architectural cladding with metric distance calibration scale.
   */
  public static getWestWallTexture(): THREE.CanvasTexture {
    const key = "wall_west_texture";
    if (this._textureCache.has(key)) return this._textureCache.get(key)!;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Clean architectural white background
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 0, 1024, 512);

      // Vertical panel seams
      for (let x = 0; x <= 1024; x += 64) {
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 512);
        ctx.stroke();
      }

      // Large West Wall Graphic
      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 28px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("LOGISTICS & CHARGING DOCK // WEST PERIMETER", 512, 120);

      ctx.fillStyle = "#eab308";
      ctx.fillRect(280, 136, 464, 4);

      // Metric Calibration Scale hashes (0m to 14m)
      ctx.fillStyle = "#334155";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2;
      for (let m = 1; m <= 7; m++) {
        const mx = (m * 1024) / 8;
        ctx.beginPath();
        ctx.moveTo(mx, 380);
        ctx.lineTo(mx, 440);
        ctx.stroke();
        ctx.font = "bold 18px monospace";
        ctx.fillText(`${m * 2}M`, mx, 360);
      }
      ctx.beginPath();
      ctx.moveTo(60, 410);
      ctx.lineTo(964, 410);
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    this._textureCache.set(key, tex);
    return tex;
  }

  /**
   * Procedural timber plank texture with weathered grain, knots, and international shipping cargo stencils.
   */
  public static getCrateWoodTexture(isShortSide: boolean = false): THREE.CanvasTexture {
    const key = `crate_wood_${isShortSide ? "short" : "long"}`;
    if (this._textureCache.has(key)) return this._textureCache.get(key)!;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // 1. Base pine/oak wood background with plank tone variation
      const nPlanks = 6;
      const plankH = 512 / nPlanks;
      const woodTones = ["#b88a57", "#c49764", "#ad7f4c", "#bc8f5c", "#af824f", "#c09360"];
      for (let i = 0; i < nPlanks; i++) {
        ctx.fillStyle = woodTones[i % woodTones.length];
        ctx.fillRect(0, i * plankH, 512, plankH);

        // Subtle horizontal wood grain striations
        ctx.strokeStyle = "rgba(70, 45, 20, 0.12)";
        ctx.lineWidth = 1;
        for (let g = 0; g < 10; g++) {
          const gy = i * plankH + (g * plankH) / 10 + Math.sin(g) * 3;
          ctx.beginPath();
          ctx.moveTo(0, gy);
          ctx.bezierCurveTo(170, gy + Math.sin(g * 2) * 5, 340, gy - Math.sin(g) * 4, 512, gy);
          ctx.stroke();
        }

        // Wood knots
        if (i % 2 === 1) {
          ctx.fillStyle = "rgba(65, 38, 15, 0.22)";
          const knotX = 80 + (i * 120) % 360;
          const knotY = i * plankH + plankH * 0.5;
          ctx.beginPath();
          ctx.ellipse(knotX, knotY, 14, 8, 0.1, 0, Math.PI * 2);
          ctx.fill();
        }

        // Deep plank seam shadow gap
        ctx.fillStyle = "#3e2712";
        ctx.fillRect(0, (i + 1) * plankH - 3, 512, 3);
        ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
        ctx.fillRect(0, i * plankH, 512, 1.5);
      }

      // 2. International Cargo Stencil Markings
      ctx.fillStyle = "rgba(18, 14, 10, 0.88)";
      ctx.strokeStyle = "rgba(18, 14, 10, 0.88)";
      ctx.lineWidth = 4;

      // Stencil: THIS SIDE UP ↑↑
      ctx.font = "bold 26px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("THIS SIDE UP ↑↑", 256, 75);

      // Stencil: Broken wine glass (FRAGILE)
      const gx = 100, gy = 175;
      ctx.beginPath();
      ctx.arc(gx, gy - 20, 18, 0, Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(gx, gy - 2);
      ctx.lineTo(gx, gy + 24);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(gx - 14, gy + 24);
      ctx.lineTo(gx + 14, gy + 24);
      ctx.stroke();
      // Crack zig-zag in glass
      ctx.beginPath();
      ctx.moveTo(gx - 4, gy - 20);
      ctx.lineTo(gx + 3, gy - 12);
      ctx.lineTo(gx - 2, gy - 4);
      ctx.stroke();

      // Stencil: Umbrella with raindrops (KEEP DRY)
      const ux = 256, uy = 175;
      ctx.beginPath();
      ctx.arc(ux, uy - 10, 22, Math.PI, 0, false);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(ux, uy - 10);
      ctx.lineTo(ux, uy + 16);
      ctx.arc(ux - 6, uy + 16, 6, 0, Math.PI);
      ctx.stroke();
      for (const rx of [-14, 0, 14]) {
        ctx.beginPath();
        ctx.moveTo(ux + rx, uy - 32);
        ctx.lineTo(ux + rx - 2, uy - 24);
        ctx.stroke();
      }

      // Stencil: Center of gravity crosshair
      const cx = 412, cy = 175;
      ctx.beginPath();
      ctx.arc(cx, cy, 20, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 26, cy);
      ctx.lineTo(cx + 26, cy);
      ctx.moveTo(cx, cy - 26);
      ctx.lineTo(cx, cy + 26);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, 20, 0, Math.PI / 2);
      ctx.lineTo(cx, cy);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, 20, Math.PI, Math.PI * 1.5);
      ctx.lineTo(cx, cy);
      ctx.fill();

      // Red GHS Diamond Hazard Placard (Class 9 Lithium / Robotics)
      ctx.save();
      ctx.translate(110, 315);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-35, -35, 70, 70);
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#dc2626"; // Crimson GHS border
      ctx.strokeRect(-32, -32, 64, 64);
      ctx.restore();

      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 13px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("CLASS 9", 110, 310);
      ctx.font = "bold 11px sans-serif";
      ctx.fillText("BATTERIES", 110, 326);

      // Large Stencil Specification Text
      ctx.fillStyle = "rgba(18, 14, 10, 0.85)";
      ctx.textAlign = "left";
      ctx.font = "bold 20px monospace";
      ctx.fillText("PAYLOAD: AUTONOMOUS AGENT", 175, 290);
      ctx.font = "16px monospace";
      ctx.fillText("GROSS WT: 340 KG", 175, 318);
      ctx.fillText("TARE WT:   45 KG", 175, 340);

      // Industrial Barcode with Human-Readable Tracking ID
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(80, 385, 352, 85);
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 2;
      ctx.strokeRect(80, 385, 352, 85);

      ctx.fillStyle = "#0f172a";
      const bcX = 100;
      const bars = [3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 4, 1, 2];
      let curX = bcX;
      for (let b = 0; b < bars.length; b++) {
        const bw = bars[b] * 2.2;
        if (b % 2 === 0) {
          ctx.fillRect(curX, 396, bw, 46);
        }
        curX += bw + 3;
      }
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "center";
      ctx.fillText("WM-9082-AUTONOMOUS-ROBOT-V4", 256, 458);
    }
    const tex = new THREE.CanvasTexture(canvas);
    this._textureCache.set(key, tex);
    return tex;
  }

  /**
   * Procedural digital oscilloscope color LCD display showing real-time signal traces.
   */
  public static getOscilloscopeTexture(): THREE.CanvasTexture {
    const key = "oscilloscope_screen";
    if (this._textureCache.has(key)) return this._textureCache.get(key)!;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Dark LCD Screen
      ctx.fillStyle = "#071220";
      ctx.fillRect(0, 0, 256, 128);

      // Cyan LCD Grid Lines
      ctx.strokeStyle = "rgba(0, 229, 255, 0.14)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= 256; x += 16) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 128);
        ctx.stroke();
      }
      for (let y = 0; y <= 128; y += 16) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(256, y);
        ctx.stroke();
      }

      // Channel 1: Cyan Sinusoidal Waveform (Sensors)
      ctx.strokeStyle = "#00e5ff";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#00e5ff";
      ctx.shadowBlur = 4;
      ctx.beginPath();
      for (let x = 0; x < 256; x++) {
        const y = 52 + Math.sin(x * 0.08) * 26 + Math.sin(x * 0.03) * 6;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Channel 2: Neon Yellow PWM / Square Waveform (Actuators)
      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 2.0;
      ctx.shadowColor = "#facc15";
      ctx.shadowBlur = 3;
      ctx.beginPath();
      for (let x = 0; x < 256; x += 32) {
        ctx.moveTo(x, 98);
        ctx.lineTo(x + 16, 98);
        ctx.lineTo(x + 16, 78);
        ctx.lineTo(x + 32, 78);
        ctx.lineTo(x + 32, 98);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // On-Screen OSD Telemetry
      ctx.fillStyle = "#00e5ff";
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "left";
      ctx.fillText("CH1: 3.32Vpp 100kHz", 8, 16);
      ctx.fillStyle = "#facc15";
      ctx.fillText("CH2: 5.00V PWM 82%", 135, 16);
    }
    const tex = new THREE.CanvasTexture(canvas);
    this._textureCache.set(key, tex);
    return tex;
  }

  /**
   * Procedural precision DC power supply digital 7-segment readouts and terminal faceplate.
   */
  public static getPowerSupplyTexture(): THREE.CanvasTexture {
    const key = "power_supply_face";
    if (this._textureCache.has(key)) return this._textureCache.get(key)!;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#1e293b"; // Matte industrial dark steel chassis
      ctx.fillRect(0, 0, 256, 128);

      // Dual Digital 7-Segment Displays
      ctx.fillStyle = "#090d16";
      ctx.fillRect(14, 18, 105, 48); // Voltage screen
      ctx.fillRect(137, 18, 105, 48); // Current screen

      // Voltage LED (Bright Red)
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 32px monospace";
      ctx.textAlign = "center";
      ctx.shadowColor = "#ef4444";
      ctx.shadowBlur = 6;
      ctx.fillText("24.0V", 66, 54);

      // Current LED (Bright Green)
      ctx.fillStyle = "#22c55e";
      ctx.shadowColor = "#22c55e";
      ctx.shadowBlur = 6;
      ctx.fillText("05.0A", 189, 54);
      ctx.shadowBlur = 0;

      // Output terminal labels
      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText("OUTPUT (+)", 60, 96);
      ctx.fillText("GND (-)", 196, 96);

      // Red and Black Binding Post circles
      ctx.fillStyle = "#dc2626";
      ctx.beginPath();
      ctx.arc(60, 112, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.arc(196, 112, 8, 0, Math.PI * 2);
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(canvas);
    this._textureCache.set(key, tex);
    return tex;
  }

  /**
   * Procedural industrial tool roll-cabinet front face with drawer pull extrusions, labels, and chrome lock.
   */
  public static getToolCabinetFrontTexture(): THREE.CanvasTexture {
    const key = "tool_cabinet_front";
    if (this._textureCache.has(key)) return this._textureCache.get(key)!;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Glossy Crimson Powder-Coat Steel
      ctx.fillStyle = "#b91c1c";
      ctx.fillRect(0, 0, 512, 512);

      // Brand Badge at Top
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(136, 14, 240, 36);
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 2;
      ctx.strokeRect(136, 14, 240, 36);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("★ SNAP-TECH PRO 7000 ★", 256, 38);

      // Draw 6 Heavy Drawers
      const drawerH = 68;
      const startY = 62;
      const drawerLabels = [
        "WRENCHES & SOCKET SETS",
        "PRECISION TORQUE DRIVERS",
        "WIRE STRIPPERS & CRIMPERS",
        "DIAGNOSTIC MULTIMETERS",
        "PNEUMATIC & SERVO ACTUATORS",
        "HARDWARE FASTENERS M3-M8"
      ];

      for (let i = 0; i < 6; i++) {
        const dy = startY + i * (drawerH + 6);
        // Drawer panel
        ctx.fillStyle = "#991b1b";
        ctx.fillRect(16, dy, 480, drawerH);

        // Deep recessed drawer perimeter shadow
        ctx.strokeStyle = "#450a0a";
        ctx.lineWidth = 3;
        ctx.strokeRect(16, dy, 480, drawerH);

        // Extruded Brushed Aluminum Handle
        ctx.fillStyle = "#e2e8f0";
        ctx.fillRect(40, dy + 10, 432, 18);
        ctx.fillStyle = "#64748b";
        ctx.fillRect(40, dy + 26, 432, 4);

        // Classification Label Window
        ctx.fillStyle = "#f8fafc";
        ctx.fillRect(150, dy + 38, 212, 20);
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 1;
        ctx.strokeRect(150, dy + 38, 212, 20);

        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 11px monospace";
        ctx.textAlign = "center";
        ctx.fillText(drawerLabels[i], 256, dy + 52);

        // Chrome Key Cylinder on top drawer
        if (i === 0) {
          ctx.fillStyle = "#cbd5e1";
          ctx.beginPath();
          ctx.arc(460, dy + 20, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#0f172a";
          ctx.fillRect(458, dy + 15, 4, 10);
        }
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    this._textureCache.set(key, tex);
    return tex;
  }

  /**
   * Procedural GHS / OSHA hazardous chemical drum decal placards.
   */
  public static getBarrelLabelTexture(colorType: "yellow" | "blue" | "black"): THREE.CanvasTexture {
    const key = `barrel_label_${colorType}`;
    if (this._textureCache.has(key)) return this._textureCache.get(key)!;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // White Decal Backing
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 0, 256, 256);
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 4;
      ctx.strokeRect(4, 4, 248, 248);

      // Red GHS Diamond Warning Placard
      ctx.save();
      ctx.translate(68, 70);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-35, -35, 70, 70);
      ctx.strokeStyle = "#dc2626";
      ctx.lineWidth = 4;
      ctx.strokeRect(-32, -32, 64, 64);
      ctx.restore();

      ctx.fillStyle = "#dc2626";
      ctx.beginPath();
      ctx.arc(68, 70, 14, 0, Math.PI * 2);
      ctx.fill();

      // NFPA 704 Diamond at top right
      ctx.save();
      ctx.translate(186, 70);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = "#2563eb"; // Blue Health
      ctx.fillRect(-24, -24, 24, 24);
      ctx.fillStyle = "#dc2626"; // Red Fire
      ctx.fillRect(0, -24, 24, 24);
      ctx.fillStyle = "#ca8a04"; // Yellow Reactivity
      ctx.fillRect(0, 0, 24, 24);
      ctx.fillStyle = "#ffffff"; // White Specific
      ctx.fillRect(-24, 0, 24, 24);
      ctx.restore();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("2", 170, 75);
      ctx.fillText("3", 186, 59);
      ctx.fillText("0", 202, 75);

      // Bold Chemical Identification Stencils
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 15px sans-serif";
      ctx.fillText("HAZARDOUS MATERIAL", 128, 142);
      ctx.font = "bold 13px monospace";
      if (colorType === "yellow") {
        ctx.fillText("UN 1993 - HYDRAULIC FLUID", 128, 168);
        ctx.font = "11px monospace";
        ctx.fillText("SYNTHETIC DIELECTRIC OIL", 128, 186);
      } else if (colorType === "blue") {
        ctx.fillText("UN 1814 - SYSTEM COOLANT", 128, 168);
        ctx.font = "11px monospace";
        ctx.fillText("ETHYLENE GLYCOL 50/50", 128, 186);
      } else {
        ctx.fillText("UN 3082 - WASTE LUBRICANT", 128, 168);
        ctx.font = "11px monospace";
        ctx.fillText("RECOVERY SUMP GRADE", 128, 186);
      }

      ctx.font = "bold 12px monospace";
      ctx.fillText("CAPACITY: 55 US GAL (208 L)", 128, 218);
      ctx.font = "10px monospace";
      ctx.fillText("LOT: WM-2026-CH419", 128, 236);
    }
    const tex = new THREE.CanvasTexture(canvas);
    this._textureCache.set(key, tex);
    return tex;
  }
  /**
   * Generates a 2048x2048 PBR industrial concrete floor texture with
   * aggregate noise, 1m x 1m expansion joint seams, OSHA hazard chevron borders,
   * center alignment calibration target, staging bay lines, tire scuffs,
   * and high-contrast gigafactory directional floor stencils.
   */
  public static createFloorCanvasTexture(): THREE.CanvasTexture {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // 1. Concrete Base Tone with realistic industrial aggregate mottling
    const grad = ctx.createRadialGradient(1024, 1024, 150, 1024, 1024, 1300);
    grad.addColorStop(0, "#d1d5db");   // Center clean polished concrete
    grad.addColorStop(0.45, "#b5bfc9"); // Mid-tone sealed concrete
    grad.addColorStop(0.85, "#9ca3af"); // Industrial perimeter tone
    grad.addColorStop(1, "#8993a4");   // Outer edge shadow concrete
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 2048, 2048);

    // Fine concrete aggregate noise & subtle surface flecks
    const imgData = ctx.getImageData(0, 0, 2048, 2048);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const n = (Math.random() - 0.5) * 18;
      data[i] = Math.min(255, Math.max(0, data[i] + n));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + n));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + n));
    }
    ctx.putImageData(imgData, 0, 0);

    // 2. 1m x 1m Expansion Joint Grooves (Saw-cut control joints with dark sealant)
    // 20 intervals across X (19.6m), 13 intervals across Y (13.0m)
    ctx.strokeStyle = "rgba(51, 65, 85, 0.50)";
    ctx.lineWidth = 4;
    const stepX = 2048 / 20;
    for (let x = 0; x <= 2048; x += stepX) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 2048);
      ctx.stroke();
    }
    const stepY = 2048 / 13;
    for (let y = 0; y <= 2048; y += stepY) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(2048, y);
      ctx.stroke();
    }

    // 3. Realistic Rubber Tire / Wheel Scuff Marks near high-traffic paths
    ctx.save();
    ctx.strokeStyle = "rgba(30, 41, 59, 0.14)";
    ctx.lineWidth = 26;
    ctx.lineCap = "round";
    // Turning arc from center toward charging dock
    ctx.beginPath();
    ctx.arc(1200, 1024, 280, Math.PI * 0.8, Math.PI * 1.4);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(840, 960, 200, Math.PI * 0.1, Math.PI * 0.7);
    ctx.stroke();
    // Reversing scuffs near charging dock
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(1500, 980);
    ctx.lineTo(1680, 980);
    ctx.moveTo(1500, 1040);
    ctx.lineTo(1680, 1040);
    ctx.stroke();
    ctx.restore();

    // 4. OSHA Safety Border: 45-degree diagonal Yellow & Black Hazard Stripes
    const borderThickness = 64;
    ctx.save();
    this.drawHazardStripes(ctx, 0, 0, 2048, borderThickness);
    this.drawHazardStripes(ctx, 0, 2048 - borderThickness, 2048, borderThickness);
    this.drawHazardStripes(ctx, 0, 0, borderThickness, 2048);
    this.drawHazardStripes(ctx, 2048 - borderThickness, 0, borderThickness, 2048);
    ctx.restore();

    // Inner crisp yellow boundary line
    ctx.strokeStyle = "#facc15";
    ctx.lineWidth = 7;
    ctx.strokeRect(borderThickness + 8, borderThickness + 8, 2048 - (borderThickness + 8) * 2, 2048 - (borderThickness + 8) * 2);

    // Corner alignment brackets
    this.drawCornerBrackets(ctx, borderThickness + 24);

    // 5. Center Registration Target & Millimeter Calibration Crosshairs
    ctx.save();
    ctx.strokeStyle = "rgba(14, 165, 233, 0.85)"; // Cyan calibration ring
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(1024, 1024, 180, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(14, 165, 233, 0.45)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(1024, 1024, 280, 0, Math.PI * 2);
    ctx.stroke();

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(1024 - 340, 1024);
    ctx.lineTo(1024 + 340, 1024);
    ctx.moveTo(1024, 1024 - 340);
    ctx.lineTo(1024, 1024 + 340);
    ctx.stroke();

    // Cardinal direction ticks & labels
    ctx.fillStyle = "rgba(14, 165, 233, 0.90)";
    ctx.font = "bold 26px monospace";
    ctx.textAlign = "center";
    ctx.fillText("N [0°]", 1024, 1024 - 295);
    ctx.fillText("S [180°]", 1024, 1024 + 320);
    ctx.fillText("W [-90°]", 1024 - 290, 1032);
    ctx.fillText("E [+90°]", 1024 + 290, 1032);
    ctx.font = "20px monospace";
    ctx.fillText("HUMANOID NAV DATUM (0.0, 0.0) • 255.2 M² ARENA", 1024, 1024 + 48);
    ctx.restore();

    // 6. Staging & Charging Bay Markings (Docking Bay Area)
    ctx.save();
    ctx.strokeStyle = "#eab308";
    ctx.lineWidth = 6;
    ctx.setLineDash([24, 14]);
    ctx.strokeRect(1480, 680, 480, 680);
    ctx.setLineDash([]);

    // Charging bay diagonal chevron guide arrows
    this.drawFloorArrow(ctx, 1560, 1024, 120, 0);
    this.drawFloorArrow(ctx, 1680, 1024, 120, 0);

    ctx.fillStyle = "#ca8a04";
    ctx.font = "bold 28px monospace";
    ctx.textAlign = "left";
    ctx.fillText("[ CHARGING BAY 01 ]", 1510, 740);
    ctx.font = "22px monospace";
    ctx.fillText("AMR AUTO-COUPLING STATION", 1510, 780);
    ctx.fillText("48V WIRELESS INDUCTION DOCK", 1510, 815);
    ctx.fillText("KEEP CLEAR OF VEHICLE DOCK", 1510, 1320);
    ctx.restore();

    // 7. Gigafactory Test Arena Zone Stencils
    ctx.save();
    ctx.fillStyle = "rgba(51, 65, 85, 0.85)";
    ctx.font = "bold 34px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("GIGAFACTORY TESTBED CELL 01 • AUTONOMOUS OMNIDIRECTIONAL ROBOTICS", 110, 140);

    ctx.font = "22px monospace";
    ctx.fillText("FACILITY: GIGA-ROBOTICS-HQ | TOTAL ARENA: 255.2 M² | SPEED LIMIT: 1.5 M/S | 48V AMR", 110, 180);
    ctx.fillText("SAFETY INTERLOCK ACTIVE • EMERGENCY STOP MONITORED • OVERHEAD CRANE ZONE", 110, 1960);
    ctx.restore();

    // Additional traffic pathway arrows
    this.drawFloorArrow(ctx, 550, 1024, 130, 0);
    this.drawFloorArrow(ctx, 1024, 550, 130, -Math.PI / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  /**
   * Roughness map: Polished concrete is glossy, borders are rougher.
   */
  public static createFloorRoughnessTexture(): THREE.CanvasTexture {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);

    ctx.fillStyle = "#484848";
    ctx.fillRect(0, 0, 1024, 1024);

    ctx.fillStyle = "#adadad";
    const b = 32;
    ctx.fillRect(0, 0, 1024, b);
    ctx.fillRect(0, 1024 - b, 1024, b);
    ctx.fillRect(0, 0, b, 1024);
    ctx.fillRect(1024 - b, 0, b, 1024);

    ctx.strokeStyle = "#999999";
    ctx.lineWidth = 8;
    ctx.strokeRect(740, 340, 240, 340);

    return new THREE.CanvasTexture(canvas);
  }

  private static drawHazardStripes(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number
  ) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();

    ctx.fillStyle = "#eab308";
    ctx.fillRect(x, y, w, h);

    ctx.fillStyle = "#1e293b";
    const stripeWidth = 52;
    for (let i = -2048; i < 4096; i += stripeWidth * 2) {
      ctx.beginPath();
      ctx.moveTo(i, y);
      ctx.lineTo(i + stripeWidth, y);
      ctx.lineTo(i + stripeWidth + h, y + h);
      ctx.lineTo(i + h, y + h);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  private static drawCornerBrackets(ctx: CanvasRenderingContext2D, offset: number) {
    const size = 64;
    const thickness = 8;
    ctx.fillStyle = "#facc15";

    // Top-Left
    ctx.fillRect(offset, offset, size, thickness);
    ctx.fillRect(offset, offset, thickness, size);
    // Top-Right
    ctx.fillRect(2048 - offset - size, offset, size, thickness);
    ctx.fillRect(2048 - offset - thickness, offset, thickness, size);
    // Bottom-Left
    ctx.fillRect(offset, 2048 - offset - thickness, size, thickness);
    ctx.fillRect(offset, 2048 - offset - size, thickness, size);
    // Bottom-Right
    ctx.fillRect(2048 - offset - size, 2048 - offset - thickness, size, thickness);
    ctx.fillRect(2048 - offset - thickness, 2048 - offset - size, thickness, size);
  }

  private static drawFloorArrow(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    len: number,
    angle: number
  ) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = "rgba(14, 165, 233, 0.45)";
    ctx.beginPath();
    ctx.moveTo(0, -16);
    ctx.lineTo(len - 40, -16);
    ctx.lineTo(len - 40, -36);
    ctx.lineTo(len, 0);
    ctx.lineTo(len - 40, 36);
    ctx.lineTo(len - 40, 16);
    ctx.lineTo(0, 16);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  /**
   * Builds the photorealistic 2x expanded industrial warehouse architecture (255.2 m² Arena):
   * Overhead bridge crane system with hoist and runway tracks, elevated mezzanine catwalk with
   * glass observation control booth, 6-axis industrial robot arm cell, motorized roller conveyor line,
   * high-voltage electrical substation, heavy storage racks, and industrial luminaires.
   */
  public static buildWarehouseArchitecture(scene: THREE.Scene): {
    lights: THREE.PointLight[];
  } {
    const lights: THREE.PointLight[] = [];

    // Shared Materials: Clean High-Contrast Architectural Palette (NOT Camouflaged)
    const outerFloorMat = new THREE.MeshStandardMaterial({
      color: 0x0c1017,
      roughness: 0.90,
      metalness: 0.10,
    });
    const lowerWallMat = new THREE.MeshStandardMaterial({
      color: 0x334155, // Clean architectural graphite/slate wainscoting
      roughness: 0.60,
      metalness: 0.25,
    });
    const kickplateMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8, // Stainless steel kickplate
      roughness: 0.20,
      metalness: 0.92,
    });
    const datumTrimMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff, // Illuminated cyan architectural datum line
      roughness: 0.25,
      metalness: 0.50,
      emissive: 0x00e5ff,
      emissiveIntensity: 0.75,
    });
    const upperWallNorthMat = new THREE.MeshStandardMaterial({
      map: this.getNorthWallTexture(),
      roughness: 0.35,
      metalness: 0.12,
    });
    const upperWallWestMat = new THREE.MeshStandardMaterial({
      map: this.getWestWallTexture(),
      roughness: 0.35,
      metalness: 0.12,
    });
    const upperWallEastMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9, // Crisp clean architectural off-white / silver
      roughness: 0.35,
      metalness: 0.12,
    });
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.35,
      metalness: 0.85,
    });
    const yellowGuardMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.35,
      metalness: 0.25,
    });
    const rackOrangeMat = new THREE.MeshStandardMaterial({
      color: 0xea580c,
      roughness: 0.45,
      metalness: 0.4,
    });
    const rackBlueMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      roughness: 0.4,
      metalness: 0.5,
    });
    const hazardStripeTex = this.getHazardStripeTexture();
    const floorHazardMat = new THREE.MeshStandardMaterial({
      map: hazardStripeTex,
      roughness: 0.4,
      metalness: 0.2,
    });

    const wallHeight = 6.8;

    // 0. Massive Extended Foundation Floor (140m x 110m hall floor for infinite studio horizon)
    const outerFloorGeo = new THREE.PlaneGeometry(140.0, 110.0);
    const outerFloor = new THREE.Mesh(outerFloorGeo, outerFloorMat);
    outerFloor.rotation.x = -Math.PI / 2;
    outerFloor.position.set(0, -0.005, 0);
    outerFloor.receiveShadow = true;
    scene.add(outerFloor);

    // Floor Perimeter OSHA Yellow & Black Hazard Boundary Bands (Defines clear perimeter contrast)
    const hazardBorderW = 0.26;
    // North perimeter border
    const borderNorth = new THREE.Mesh(new THREE.BoxGeometry(24.0, 0.004, hazardBorderW), floorHazardMat);
    borderNorth.position.set(0, 0.002, -7.15 + hazardBorderW / 2);
    borderNorth.receiveShadow = true;
    scene.add(borderNorth);

    // West perimeter border
    const borderWest = new THREE.Mesh(new THREE.BoxGeometry(hazardBorderW, 0.004, 15.6), floorHazardMat);
    borderWest.position.set(-10.65 + hazardBorderW / 2, 0.002, 0);
    borderWest.receiveShadow = true;
    scene.add(borderWest);

    // East perimeter border
    const borderEast = new THREE.Mesh(new THREE.BoxGeometry(hazardBorderW, 0.004, 15.6), floorHazardMat);
    borderEast.position.set(10.65 - hazardBorderW / 2, 0.002, 0);
    borderEast.receiveShadow = true;
    scene.add(borderEast);

    // 1. Four Industrial Yellow Safety Bollards at Expanded Arena Corners (±9.9m x ±6.6m)
    const bollardPositions: [number, number][] = [
      [-9.9, -6.6],
      [9.9, -6.6],
      [-9.9, 6.6],
      [9.9, 6.6],
    ];
    for (const [bx, bz] of bollardPositions) {
      this.createSafetyBollard(scene, bx, bz, yellowGuardMat, steelMat);
    }

    // 2. North Wall (Back - Spacious 24.0m span, height 6.8m at z = -7.3m)
    // A. Stainless Steel Base Kickplate
    const backKickplate = new THREE.Mesh(new THREE.BoxGeometry(24.0, 0.32, 0.25), kickplateMat);
    backKickplate.position.set(0, 0.16, -7.3);
    backKickplate.receiveShadow = true;
    scene.add(backKickplate);

    // B. Architectural Lower Wainscoting (Slate Graphite)
    const backLower = new THREE.Mesh(new THREE.BoxGeometry(24.0, 1.08, 0.24), lowerWallMat);
    backLower.position.set(0, 0.32 + 1.08 / 2, -7.3);
    backLower.receiveShadow = true;
    scene.add(backLower);

    // C. Glowing Cyan Architectural Datum Channel (y = 1.40m)
    const backDatum = new THREE.Mesh(new THREE.BoxGeometry(24.0, 0.035, 0.26), datumTrimMat);
    backDatum.position.set(0, 1.40, -7.3);
    scene.add(backDatum);

    // D. Pristine Architectural Off-White / Silver Upper Wall Panels with Stencils
    const backUpperH = wallHeight - 1.42;
    const backUpper = new THREE.Mesh(new THREE.BoxGeometry(24.0, backUpperH, 0.22), upperWallNorthMat);
    backUpper.position.set(0, 1.42 + backUpperH / 2, -7.3);
    backUpper.receiveShadow = true;
    scene.add(backUpper);

    // Architectural Wall-Wash Sconce Luminaires (Mounted at y = 5.2m along North Wall)
    for (const sx of [-7.5, -2.5, 2.5, 7.5]) {
      const sconce = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.08, 0.24), steelMat);
      sconce.position.set(sx, 5.2, -7.18);
      scene.add(sconce);

      const sconceLens = new THREE.Mesh(
        new THREE.PlaneGeometry(0.50, 0.16),
        new THREE.MeshBasicMaterial({ color: 0xfffaed })
      );
      sconceLens.rotation.x = Math.PI / 2;
      sconceLens.position.set(sx, 5.15, -7.16);
      scene.add(sconceLens);
    }

    // Emergency Fire Exit Door on North Wall (x = -4.5m)
    const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.30, 2.30, 0.28), steelMat);
    doorFrame.position.set(-4.5, 1.15, -7.3);
    scene.add(doorFrame);

    const doorLeaf = new THREE.Mesh(
      new THREE.BoxGeometry(1.18, 2.18, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3, metalness: 0.4 })
    );
    doorLeaf.position.set(-4.5, 1.15, -7.22);
    scene.add(doorLeaf);

    // Vision panel glass in door
    const doorGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(0.25, 0.65),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.7 })
    );
    doorGlass.position.set(-4.5, 1.45, -7.17);
    scene.add(doorGlass);

    // Stainless steel crash / panic push-bar
    const panicBar = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.95, 12), kickplateMat);
    panicBar.rotation.z = Math.PI / 2;
    panicBar.position.set(-4.5, 1.05, -7.15);
    scene.add(panicBar);

    // Illuminated Green Emergency EXIT Sign above door
    const exitSign = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.18, 0.06),
      new THREE.MeshStandardMaterial({
        color: 0x15803d,
        emissive: 0x22c55e,
        emissiveIntensity: 1.6,
        roughness: 0.2,
      })
    );
    exitSign.position.set(-4.5, 2.45, -7.18);
    scene.add(exitSign);

    // Recessed Red Fire Hose & Extinguisher Cabinet on North Wall (x = 4.5m)
    const fireCab = new THREE.Mesh(
      new THREE.BoxGeometry(0.70, 0.90, 0.14),
      new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3, metalness: 0.4 })
    );
    fireCab.position.set(4.5, 1.45, -7.22);
    scene.add(fireCab);

    const fireCabGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(0.54, 0.74),
      new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.5, roughness: 0.1 })
    );
    fireCabGlass.position.set(4.5, 1.45, -7.14);
    scene.add(fireCabGlass);

    // Extinguisher cylinder inside
    const extCyl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.065, 0.48, 12),
      new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.2, metalness: 0.6 })
    );
    extCyl.position.set(4.5, 1.40, -7.20);
    scene.add(extCyl);

    // Industrial Conduits along North Wall
    const conduitMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.25, metalness: 0.9 });
    const conduit1 = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 23.6, 12), conduitMat);
    conduit1.rotation.z = Math.PI / 2;
    conduit1.position.set(0, 1.6, -7.18);
    scene.add(conduit1);

    const conduit2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 23.6, 12), conduitMat);
    conduit2.rotation.z = Math.PI / 2;
    conduit2.position.set(0, 3.4, -7.18);
    scene.add(conduit2);

    // 3. West Wall (Left - 16.0m depth at x = -10.8m)
    // A. Stainless Kickplate
    const leftKickplate = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.32, 16.0), kickplateMat);
    leftKickplate.position.set(-10.8, 0.16, 0);
    leftKickplate.receiveShadow = true;
    scene.add(leftKickplate);

    // B. Architectural Lower Wainscoting (Slate Graphite)
    const leftLower = new THREE.Mesh(new THREE.BoxGeometry(0.24, 1.08, 16.0), lowerWallMat);
    leftLower.position.set(-10.8, 0.32 + 1.08 / 2, 0);
    leftLower.receiveShadow = true;
    scene.add(leftLower);

    // C. Cyan Datum Accent
    const leftDatum = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.035, 16.0), datumTrimMat);
    leftDatum.position.set(-10.8, 1.40, 0);
    scene.add(leftDatum);

    // D. Pristine Architectural Off-White / Silver Upper Wall with Metric Scale
    const leftUpperH = wallHeight - 1.42;
    const leftUpper = new THREE.Mesh(new THREE.BoxGeometry(0.22, leftUpperH, 16.0), upperWallWestMat);
    leftUpper.position.set(-10.8, 1.42 + leftUpperH / 2, 0);
    leftUpper.receiveShadow = true;
    scene.add(leftUpper);

    // West Wall Wash Sconces
    for (const sz of [-5.0, 0, 5.0]) {
      const sconceW = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 0.55), steelMat);
      sconceW.position.set(-10.68, 5.2, sz);
      scene.add(sconceW);

      const lensW = new THREE.Mesh(
        new THREE.PlaneGeometry(0.16, 0.50),
        new THREE.MeshBasicMaterial({ color: 0xfffaed })
      );
      lensW.rotation.x = Math.PI / 2;
      lensW.position.set(-10.66, 5.15, sz);
      scene.add(lensW);
    }

    // 4. East Wall (Right - 16.0m depth at x = 10.8m)
    // A. Stainless Kickplate
    const rightKickplate = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.32, 16.0), kickplateMat);
    rightKickplate.position.set(10.8, 0.16, 0);
    rightKickplate.receiveShadow = true;
    scene.add(rightKickplate);

    // B. Architectural Lower Wainscoting
    const rightLower = new THREE.Mesh(new THREE.BoxGeometry(0.24, 1.08, 16.0), lowerWallMat);
    rightLower.position.set(10.8, 0.32 + 1.08 / 2, 0);
    rightLower.receiveShadow = true;
    scene.add(rightLower);

    // C. Cyan Datum Accent
    const rightDatum = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.035, 16.0), datumTrimMat);
    rightDatum.position.set(10.8, 1.40, 0);
    scene.add(rightDatum);

    // D. Pristine Architectural Off-White Upper Wall
    const rightUpperH = wallHeight - 1.42;
    const rightUpper = new THREE.Mesh(new THREE.BoxGeometry(0.22, rightUpperH, 16.0), upperWallEastMat);
    rightUpper.position.set(10.8, 1.42 + rightUpperH / 2, 0);
    rightUpper.receiveShadow = true;
    scene.add(rightUpper);

    // South Low Curb (Leaves camera sightline open at z = +7.1m)
    const southCurb = new THREE.Mesh(new THREE.BoxGeometry(24.0, 0.24, 0.16), lowerWallMat);
    southCurb.position.set(0, 0.12, 7.1);
    scene.add(southCurb);

    // 5. Heavy Structural Steel Columns (I-beams) with Yellow Impact Wraps
    const colPositions: [number, number][] = [
      [-10.7, -7.2],
      [-5.3, -7.2],
      [0.0, -7.2],
      [5.3, -7.2],
      [10.7, -7.2],
      [-10.7, 0.0],
      [10.7, 0.0],
      [-10.7, 7.0],
      [10.7, 7.0],
    ];

    for (const [cx, cz] of colPositions) {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.28, wallHeight, 0.28), steelMat);
      col.position.set(cx, wallHeight / 2, cz);
      col.receiveShadow = true;
      scene.add(col);

      const guard = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.95, 16), yellowGuardMat);
      guard.position.set(cx, 0.475, cz);
      scene.add(guard);
    }

    // 6. Heavy 3D Overhead Bridge Crane System (Spanning the facility at y = 6.4m)
    this.createOverheadCraneSystem(scene);

    // 7. Elevated Mezzanine Catwalk & Observation Control Booth along East Wall
    this.createMezzanineCatwalkAndControlRoom(scene);

    // 8. 6-Axis Articulated Industrial Robotic Arm Cell in Northwest Perimeter
    this.createRoboticArmCell(scene, -8.6, -4.8);

    // 9. Motorized Industrial Roller Conveyor Line along North Perimeter
    this.createRollerConveyorLine(scene, -6.0, 6.0, -6.1, 0.70);

    // 10. High-Voltage Electrical Substation Bank near Docking Bay
    this.createElectricalSubstation(scene, -8.8, 1.8);

    // 11. Suspended High-Bay Pendant Lights (8 Luminaires across 25m room)
    const lightCoords: [number, number][] = [
      [-7.0, -4.2],
      [-2.3, -4.2],
      [2.3, -4.2],
      [7.0, -4.2],
      [-7.0, 2.0],
      [-2.3, 2.0],
      [2.3, 2.0],
      [7.0, 2.0],
    ];

    for (const [lx, lz] of lightCoords) {
      const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.65, 8), steelMat);
      cord.position.set(lx, wallHeight - 0.32, lz);
      scene.add(cord);

      const hood = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.44, 0.28, 18, 1, true), steelMat);
      hood.position.set(lx, wallHeight - 0.62, lz);
      scene.add(hood);

      const lens = new THREE.Mesh(
        new THREE.CircleGeometry(0.42, 18),
        new THREE.MeshBasicMaterial({ color: 0xfffaed, side: THREE.DoubleSide })
      );
      lens.rotation.x = Math.PI / 2;
      lens.position.set(lx, wallHeight - 0.76, lz);
      scene.add(lens);
      // High-efficiency lighting: glowing emissive lamp lens without expensive multi-pass
      // dynamic PointLight shader loops, keeping frame rate rock-solid at 60+ FPS.
    }

    // 12. Heavy-Duty Pallet Racks behind North Perimeter
    for (const rx of [-6.2, -2.1, 2.1, 6.2]) {
      this.buildPalletRack(scene, rx, -6.95, rackOrangeMat, rackBlueMat);
    }

    // 13. Biophilic Planters at South Perimeter
    this.createBiophilicPlanters(scene);

    // 14. Wall Safety Signs
    this.createWallSafetySign(scene, -4.2, 2.8, -7.18, "caution");
    this.createWallSafetySign(scene, 4.2, 2.8, -7.18, "notice");
    this.createEmergencyStopStation(scene, 0, 1.8, -7.18);

    return { lights };
  }

  /**
   * 1. Heavy 3D Overhead Bridge Crane System:
   * Runway tracks along East/West walls, double-girder bridge crane spanning 21m,
   * motorized hoist trolley with wound steel cable and forged industrial crane hook.
   */
  public static createOverheadCraneSystem(scene: THREE.Scene) {
    const craneGroup = new THREE.Group();
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35, metalness: 0.85 });
    const craneYellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3, metalness: 0.4 });
    const cableMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.2, metalness: 0.95 });

    // Overhead Steel Lattice Box-Trusses (Placed along North perimeter to keep camera sightlines unobstructed)
    for (const zT of [-6.8, -4.8]) {
      const truss = new THREE.Mesh(new THREE.BoxGeometry(23.6, 0.24, 0.24), steelMat);
      truss.position.set(0, 6.5, zT);
      craneGroup.add(truss);

      // Diagonal cross-brace struts
      for (let xS = -10.0; xS <= 10.0; xS += 2.5) {
        const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.45, 8), steelMat);
        strut.position.set(xS, 6.62, zT);
        craneGroup.add(strut);
      }
    }

    // Runway Rails along West (x = -10.6m) and East (x = 10.6m) at y = 6.0m
    for (const rx of [-10.6, 10.6]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.28, 15.6), steelMat);
      rail.position.set(rx, 6.0, 0);
      craneGroup.add(rail);

      // End bumpers
      for (const rz of [-7.6, 7.6]) {
        const bumper = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.35, 0.35), craneYellowMat);
        bumper.position.set(rx, 6.0, rz);
        craneGroup.add(bumper);
      }
    }

    // Double-Girder Bridge Crane (Parked in North maintenance bay at z = -5.8m, y = 6.18m)
    const craneBridgeZ = -5.8;
    for (const dZ of [-0.35, 0.35]) {
      const girder = new THREE.Mesh(new THREE.BoxGeometry(21.2, 0.42, 0.16), craneYellowMat);
      girder.position.set(0, 6.18, craneBridgeZ + dZ);
      craneGroup.add(girder);
    }

    // End trucks resting on runway rails
    for (const ex of [-10.5, 10.5]) {
      const truck = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.22, 1.2), steelMat);
      truck.position.set(ex, 6.18, craneBridgeZ);
      craneGroup.add(truck);
    }

    // Hoist Trolley Unit resting on bridge girders at x = 1.4m
    const trolleyX = 1.4;
    const trolley = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.32, 1.1), steelMat);
    trolley.position.set(trolleyX, 6.42, craneBridgeZ);
    craneGroup.add(trolley);

    // Motor Drum & Cable Spool
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.75, 16), cableMat);
    drum.rotation.z = Math.PI / 2;
    drum.position.set(trolleyX, 6.62, craneBridgeZ);
    craneGroup.add(drum);

    // Steel Hoist Cables dangling down to y = 4.0m
    for (const cX of [-0.2, 0.2]) {
      const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 2.3, 8), cableMat);
      cable.position.set(trolleyX + cX, 5.25, craneBridgeZ);
      craneGroup.add(cable);
    }

    // Heavy Forged Industrial Steel Crane Hook
    const hookBlock = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.32, 0.28), craneYellowMat);
    hookBlock.position.set(trolleyX, 4.0, craneBridgeZ);
    craneGroup.add(hookBlock);

    const hookCurve = new THREE.Mesh(
      new THREE.TorusGeometry(0.16, 0.045, 12, 24, Math.PI * 1.3),
      steelMat
    );
    hookCurve.rotation.z = Math.PI * 0.85;
    hookCurve.position.set(trolleyX, 3.75, craneBridgeZ);
    craneGroup.add(hookCurve);

    // Flashing Amber Warning Beacons at bridge girder ends
    for (const bx of [-10.0, 10.0]) {
      const beacon = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 0.12, 12),
        new THREE.MeshBasicMaterial({ color: 0xf59e0b })
      );
      beacon.position.set(bx, 6.45, craneBridgeZ);
      craneGroup.add(beacon);
    }

    scene.add(craneGroup);
  }

  /**
   * 2. Elevated Mezzanine Catwalk & Observation Control Booth along East Wall:
   * Open-grate steel deck at y = 2.8m, bright yellow safety railings, stairs,
   * and glass-enclosed robotics engineering observation room with glowing telemetry dashboards.
   */
  public static createMezzanineCatwalkAndControlRoom(scene: THREE.Scene) {
    const mezzGroup = new THREE.Group();
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.8 });
    const grateMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6, metalness: 0.7 });
    const railingMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.35, metalness: 0.3 });
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.45,
    });

    const mezzX = 10.0;
    const mezzY = 2.8;

    // Catwalk Deck (Spans z = -6.0m to +6.0m, width 1.4m)
    const deck = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 12.0), grateMat);
    deck.position.set(mezzX, mezzY, 0);
    deck.receiveShadow = true;
    mezzGroup.add(deck);

    // Support Pillars from ground (y = 0 to 2.8m)
    for (const pZ of [-5.5, -2.5, 0.5, 3.5, 5.5]) {
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.16, mezzY, 0.16), steelMat);
      pillar.position.set(mezzX - 0.65, mezzY / 2, pZ);
      mezzGroup.add(pillar);
    }

    // Yellow Safety Railings along the front edge (x = mezzX - 0.7m)
    const railX = mezzX - 0.7;
    // Top handrail
    const topRail = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 12.0, 10), railingMat);
    topRail.rotation.x = Math.PI / 2;
    topRail.position.set(railX, mezzY + 1.05, 0);
    mezzGroup.add(topRail);

    // Mid rail
    const midRail = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 12.0, 10), railingMat);
    midRail.rotation.x = Math.PI / 2;
    midRail.position.set(railX, mezzY + 0.55, 0);
    mezzGroup.add(midRail);

    // Kickplate
    const kickPlate = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.15, 12.0), railingMat);
    kickPlate.position.set(railX, mezzY + 0.08, 0);
    mezzGroup.add(kickPlate);

    // Stanchions every 1.5m
    for (let sZ = -5.8; sZ <= 5.8; sZ += 1.45) {
      const stanchion = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 1.05, 10), railingMat);
      stanchion.position.set(railX, mezzY + 0.525, sZ);
      mezzGroup.add(stanchion);
    }

    // Access Stairs from ground at South end (z = 4.2m to 6.2m)
    const nSteps = 10;
    const stepRise = mezzY / nSteps;
    const stepRun = 2.0 / nSteps;
    for (let i = 0; i < nSteps; i++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.04, stepRun), steelMat);
      step.position.set(mezzX, stepRise * (i + 0.5), 6.2 - stepRun * i);
      mezzGroup.add(step);
    }

    // Robotics Observation Control Room (Enclosed Glass Booth, z = -2.2m to 2.2m, x = 10.1m)
    const boothGroup = new THREE.Group();
    boothGroup.position.set(mezzX, mezzY + 0.04, 0);

    // Dark architectural structural frame
    const boothFrameMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.9 });
    const boothCeiling = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.08, 4.4), boothFrameMat);
    boothCeiling.position.set(0, 2.4, 0);
    boothGroup.add(boothCeiling);

    // Large Front Observation Glass Window overlooking the test arena
    const frontGlass = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.0, 4.2), glassMat);
    frontGlass.position.set(-0.65, 1.2, 0);
    boothGroup.add(frontGlass);

    // Thin window mullions
    for (const mZ of [-1.4, 0.0, 1.4]) {
      const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.0, 0.05), boothFrameMat);
      mullion.position.set(-0.65, 1.2, mZ);
      boothGroup.add(mullion);
    }

    // Multi-screen Glowing Telemetry Walls inside Control Booth
    const cyanScreenMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const amberScreenMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const greenScreenMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });

    for (let i = 0; i < 4; i++) {
      const screenMat = i % 3 === 0 ? cyanScreenMat : i % 3 === 1 ? greenScreenMat : amberScreenMat;
      const mon = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.45, 0.8), screenMat);
      mon.position.set(0.4, 1.35, -1.5 + i * 1.0);
      mon.rotation.y = -0.15;
      boothGroup.add(mon);
    }

    // Control Room Interior Ambient Glow Light
    const boothLight = new THREE.PointLight(0x00f0ff, 1.5, 6.0, 1.5);
    boothLight.position.set(-0.1, 1.8, 0);
    boothGroup.add(boothLight);

    mezzGroup.add(boothGroup);
    scene.add(mezzGroup);
  }

  /**
   * 3. 6-Axis Articulated Industrial Robotic Arm Cell:
   * Heavy concrete plinth, rotating base, articulated joint links, pneumatic gripper,
   * yellow perimeter safety fence with wire mesh, and flashing beacon.
   */
  public static createRoboticArmCell(scene: THREE.Scene, x: number, z: number) {
    const cellGroup = new THREE.Group();
    cellGroup.position.set(x, 0, z);

    const concreteMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.9, metalness: 0.1 });
    const orangeMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.35, metalness: 0.5 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.9 });
    const fenceMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4, metalness: 0.3 });

    // Concrete Plinth (1.8m x 1.8m x 0.30m)
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.30, 1.8), concreteMat);
    plinth.position.y = 0.15;
    plinth.receiveShadow = true;
    cellGroup.add(plinth);

    // Yellow anchor baseplate
    const anchor = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.05, 0.85), fenceMat);
    anchor.position.y = 0.325;
    cellGroup.add(anchor);

    // Robot Arm Axis 1: Rotary Turret Base
    const baseCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 0.40, 20), steelMat);
    baseCyl.position.y = 0.525;
    cellGroup.add(baseCyl);

    // Axis 2: Lower Arm Shoulder & Boom (Angled forward)
    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), steelMat);
    shoulder.position.y = 0.82;
    cellGroup.add(shoulder);

    const lowerArm = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.95, 0.22), orangeMat);
    lowerArm.position.set(0.18, 1.25, -0.15);
    lowerArm.rotation.x = -0.35;
    lowerArm.rotation.z = 0.25;
    cellGroup.add(lowerArm);

    // Axis 3: Elbow Articulation & Forearm
    const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), steelMat);
    elbow.position.set(0.32, 1.68, -0.32);
    cellGroup.add(elbow);

    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, 0.85, 16), orangeMat);
    forearm.rotation.z = Math.PI / 3;
    forearm.rotation.y = 0.4;
    forearm.position.set(0.68, 1.55, -0.22);
    cellGroup.add(forearm);

    // Axis 5/6: Wrist & Pneumatic Gripper End-Effector
    const wrist = new THREE.Mesh(new THREE.SphereGeometry(0.10, 14, 14), steelMat);
    wrist.position.set(1.08, 1.35, -0.12);
    cellGroup.add(wrist);

    // Two pneumatic gripper fingers holding a workpiece
    for (const fY of [-0.08, 0.08]) {
      const finger = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.04), steelMat);
      finger.position.set(1.22, 1.35 + fY, -0.12);
      cellGroup.add(finger);
    }
    const workpiece = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.14, 16),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, metalness: 0.9 })
    );
    workpiece.position.set(1.25, 1.35, -0.12);
    cellGroup.add(workpiece);

    // Yellow Safety Perimeter Cage (2.6m x 2.6m)
    const cageW = 2.6;
    const cageH = 1.6;
    for (const [px, pz] of [
      [-cageW / 2, -cageW / 2],
      [cageW / 2, -cageW / 2],
      [-cageW / 2, cageW / 2],
      [cageW / 2, cageW / 2],
    ]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, cageH, 12), fenceMat);
      post.position.set(px, cageH / 2, pz);
      cellGroup.add(post);
    }
    // Perimeter safety rails
    for (const rY of [0.15, cageH * 0.5, cageH]) {
      const rail1 = new THREE.Mesh(new THREE.BoxGeometry(cageW, 0.03, 0.03), fenceMat);
      rail1.position.set(0, rY, -cageW / 2);
      cellGroup.add(rail1);

      const rail2 = new THREE.Mesh(new THREE.BoxGeometry(cageW, 0.03, 0.03), fenceMat);
      rail2.position.set(0, rY, cageW / 2);
      cellGroup.add(rail2);

      const rail3 = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, cageW), fenceMat);
      rail3.position.set(-cageW / 2, rY, 0);
      cellGroup.add(rail3);
    }

    // Flashing Amber Safety Tower Beacon
    const beaconPost = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8), steelMat);
    beaconPost.position.set(cageW / 2, cageH + 0.25, cageW / 2);
    cellGroup.add(beaconPost);

    const beaconLight = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.12, 12),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b })
    );
    beaconLight.position.set(cageW / 2, cageH + 0.56, cageW / 2);
    cellGroup.add(beaconLight);

    scene.add(cellGroup);
  }

  /**
   * 4. Motorized Industrial Roller Conveyor Line:
   * Heavy steel channel frame, rotating rollers, cardboard packages, and blue KLT plastic totes.
   */
  public static createRollerConveyorLine(
    scene: THREE.Scene,
    xStart: number,
    xEnd: number,
    z: number,
    y: number
  ) {
    const convGroup = new THREE.Group();
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.8 });
    const rollerMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.25, metalness: 0.95 });
    const boxMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.85, metalness: 0.05 });
    const toteBlueMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.35, metalness: 0.2 });

    const span = Math.abs(xEnd - xStart);
    const midX = (xStart + xEnd) / 2;
    const width = 0.85;

    // Side frame channels
    for (const dZ of [-width / 2, width / 2]) {
      const channel = new THREE.Mesh(new THREE.BoxGeometry(span, 0.12, 0.05), steelMat);
      channel.position.set(midX, y, z + dZ);
      convGroup.add(channel);
    }

    // Support legs every 2.4m
    for (let lx = xStart + 0.4; lx <= xEnd - 0.4; lx += 2.4) {
      for (const dZ of [-width / 2, width / 2]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, y, 0.06), steelMat);
        leg.position.set(lx, y / 2, z + dZ);
        convGroup.add(leg);
      }
      // Cross brace
      const brace = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, width), steelMat);
      brace.position.set(lx, y * 0.35, z);
      convGroup.add(brace);
    }

    // Metallic Cylindrical Rollers every 0.28m
    const rollerR = 0.038;
    for (let rx = xStart + 0.15; rx <= xEnd - 0.15; rx += 0.28) {
      const roller = new THREE.Mesh(new THREE.CylinderGeometry(rollerR, rollerR, width - 0.06, 12), rollerMat);
      roller.rotation.x = Math.PI / 2;
      roller.position.set(rx, y + 0.02, z);
      convGroup.add(roller);
    }

    // Cargo Boxes & Totes on the conveyor
    const cargoPositions = [
      { x: xStart + 1.2, isTote: false },
      { x: xStart + 3.4, isTote: true },
      { x: xStart + 5.8, isTote: false },
      { x: xStart + 8.2, isTote: true },
      { x: xStart + 10.5, isTote: false },
    ];

    for (const c of cargoPositions) {
      if (c.x < xEnd) {
        if (c.isTote) {
          const tote = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.28, 0.55), toteBlueMat);
          tote.position.set(c.x, y + 0.04 + 0.14, z);
          convGroup.add(tote);
        } else {
          const box = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.45, 0.55), boxMat);
          box.position.set(c.x, y + 0.04 + 0.225, z);
          convGroup.add(box);
        }
      }
    }

    // Electric Drive Motor Unit at start
    const motor = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.35), steelMat);
    motor.position.set(xStart - 0.2, y - 0.1, z);
    convGroup.add(motor);

    scene.add(convGroup);
  }

  /**
   * 5. High-Voltage Electrical Substation & Transformer Unit:
   * Placed adjacent to robot charging dock with vertical radiator cooling fins,
   * ceramic bushings, high-voltage warning lightning decals, and status LEDs.
   */
  public static createElectricalSubstation(scene: THREE.Scene, x: number, z: number) {
    const subGroup = new THREE.Group();
    subGroup.position.set(x, 0, z);

    const cabinetMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.7 });
    const finMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.85 });
    const insulatorMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.2, metalness: 0.3 }); // Ceramic maroon
    const yellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.35 });

    // Transformer Main Body (1.4m x 1.8m x 1.1m)
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.8, 1.1), cabinetMat);
    body.position.y = 0.9;
    body.receiveShadow = true;
    subGroup.add(body);

    // Vertical Cooling Radiator Fins along both sides
    for (const dZ of [-0.58, 0.58]) {
      for (let fx = -0.55; fx <= 0.55; fx += 0.12) {
        const fin = new THREE.Mesh(new THREE.BoxGeometry(0.02, 1.5, 0.18), finMat);
        fin.position.set(fx, 0.9, dZ);
        subGroup.add(fin);
      }
    }

    // High-Voltage Ceramic Insulator Bushings on Roof
    for (const bx of [-0.35, 0.0, 0.35]) {
      const bushing = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.065, 0.38, 14), insulatorMat);
      bushing.position.set(bx, 1.99, 0);
      subGroup.add(bushing);

      const cap = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2, metalness: 0.9 })
      );
      cap.position.set(bx, 2.2, 0);
      subGroup.add(cap);
    }

    // High-Voltage Danger Decal Plate
    const decalPlate = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.28, 0.02), yellowMat);
    decalPlate.position.set(0, 1.25, 0.56);
    subGroup.add(decalPlate);

    // Status Pilot Lamps (Green normal, Red trip)
    const greenLed = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0x10b981 })
    );
    greenLed.position.set(-0.25, 1.6, 0.56);
    subGroup.add(greenLed);

    const redLed = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xef4444 })
    );
    redLed.position.set(-0.15, 1.6, 0.56);
    subGroup.add(redLed);

    scene.add(subGroup);
  }

  /**
   * 6. Authored Heavy Industrial 55-Gallon Steel Drum / Barrel Cluster on Spill Pallet:
   * Used as both facility dressing and as interactive placeable obstacle (tool-barrels).
   */
  public static createBarrelCluster(w: number = 0.85, h: number = 0.95, d: number = 0.85): THREE.Group {
    const group = new THREE.Group();

    // 1. Heavy Molded Polyethylene Spill Containment Pallet Basin (Safety Yellow)
    const palletMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.40, metalness: 0.15 });
    const grateMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.65, metalness: 0.8 });
    const steelHardwareMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.35, metalness: 0.9 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, metalness: 0.85 });

    // Sump basin body
    const palletH = 0.14;
    const pallet = new THREE.Mesh(new THREE.BoxGeometry(w, palletH, d), palletMat);
    pallet.position.y = palletH / 2;
    pallet.castShadow = true;
    pallet.receiveShadow = true;
    group.add(pallet);

    // Forklift fork pockets (2 channels through the base)
    const pocketMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
    for (const px of [-w * 0.25, w * 0.25]) {
      const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.065, d + 0.01), pocketMat);
      pocket.position.set(px, 0.04, 0);
      group.add(pocket);
    }

    // Threaded sump drain plug on front face
    const drainPlug = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.02, 8), brassMat);
    drainPlug.rotation.x = Math.PI / 2;
    drainPlug.position.set(0, 0.045, d / 2 + 0.01);
    group.add(drainPlug);

    // Heavy Removable Fiberglass / Galvanized Grating Deck
    const topGrate = new THREE.Mesh(new THREE.BoxGeometry(w - 0.05, 0.022, d - 0.05), grateMat);
    topGrate.position.y = palletH + 0.01;
    topGrate.receiveShadow = true;
    group.add(topGrate);

    // 2. Trio of 55-Gallon (208L) Heavy Steel Chemical Drums
    const drumR = 0.185;
    const drumH = 0.80;
    const drumConfigs: Array<{
      x: number;
      z: number;
      color: number;
      type: "yellow" | "blue" | "black";
      hasPump: boolean;
    }> = [
      { x: -0.16, z: -0.15, color: 0xeab308, type: "yellow", hasPump: false },
      { x: 0.17, z: -0.12, color: 0x0284c7, type: "blue", hasPump: true },
      { x: 0.01, z: 0.17, color: 0x1e293b, type: "black", hasPump: false },
    ];

    for (const dc of drumConfigs) {
      const drumGroup = new THREE.Group();
      drumGroup.position.set(dc.x, palletH + 0.02, dc.z);

      const drumBodyMat = new THREE.MeshStandardMaterial({
        color: dc.color,
        roughness: 0.38,
        metalness: 0.65,
      });

      // Main cylindrical drum body
      const cyl = new THREE.Mesh(new THREE.CylinderGeometry(drumR, drumR, drumH, 24), drumBodyMat);
      cyl.position.y = drumH / 2;
      cyl.castShadow = true;
      cyl.receiveShadow = true;
      drumGroup.add(cyl);

      // Three precision swaged chime strengthening ribs along drum height
      for (const ry of [drumH * 0.28, drumH * 0.50, drumH * 0.72]) {
        const rib = new THREE.Mesh(new THREE.TorusGeometry(drumR + 0.007, 0.010, 8, 24), steelHardwareMat);
        rib.rotation.x = Math.PI / 2;
        rib.position.y = ry;
        drumGroup.add(rib);
      }

      // Top Recessed Lid with Rolled Rim Chime
      const rim = new THREE.Mesh(new THREE.TorusGeometry(drumR + 0.006, 0.009, 8, 24), steelHardwareMat);
      rim.rotation.x = Math.PI / 2;
      rim.position.y = drumH;
      drumGroup.add(rim);

      const lid = new THREE.Mesh(new THREE.CylinderGeometry(drumR - 0.005, drumR - 0.005, 0.012, 24), drumBodyMat);
      lid.position.y = drumH - 0.006;
      drumGroup.add(lid);

      // Circumferential Bolt-Ring Clamp & Hex Lug
      const clampBolt = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.018, 0.025), steelHardwareMat);
      clampBolt.position.set(drumR + 0.008, drumH, 0);
      drumGroup.add(clampBolt);

      // Dual Zinc-Plated Threaded Bungs (2" fill + 3/4" vent)
      const bung2 = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.016, 12), steelHardwareMat);
      bung2.position.set(0.09, drumH + 0.008, 0.03);
      drumGroup.add(bung2);

      const bungVent = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.014, 10), steelHardwareMat);
      bungVent.position.set(-0.09, drumH + 0.007, -0.03);
      drumGroup.add(bungVent);

      // Photorealistic GHS Hazmat Placard Decal wrapping front of drum
      const decalTex = this.getBarrelLabelTexture(dc.type);
      const decalMat = new THREE.MeshStandardMaterial({
        map: decalTex,
        roughness: 0.3,
        metalness: 0.1,
        transparent: true,
      });
      const decal = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.22), decalMat);
      decal.position.set(0, drumH * 0.62, drumR + 0.006);
      drumGroup.add(decal);

      // Rotary Hand-Crank Transfer Pump installed on the blue chemical drum
      if (dc.hasPump) {
        const pumpGroup = new THREE.Group();
        pumpGroup.position.set(0.09, drumH + 0.008, 0.03);

        const pumpBodyMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.35, metalness: 0.9 });
        const hoseMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, transparent: true, opacity: 0.75 });
        const woodKnobMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });

        // Vertical riser tube
        const riser = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.18, 10), pumpBodyMat);
        riser.position.y = 0.09;
        pumpGroup.add(riser);

        // Circular rotary impeller housing
        const impeller = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.03, 16), pumpBodyMat);
        impeller.rotation.x = Math.PI / 2;
        impeller.position.y = 0.18;
        pumpGroup.add(impeller);

        // Hand crank arm & handle knob
        const crankArm = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.09, 0.01), pumpBodyMat);
        crankArm.position.set(0.04, 0.22, 0.025);
        pumpGroup.add(crankArm);

        const crankKnob = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.035, 10), woodKnobMat);
        crankKnob.rotation.x = Math.PI / 2;
        crankKnob.position.set(0.04, 0.26, 0.04);
        pumpGroup.add(crankKnob);

        // Gooseneck discharge spout
        const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.14, 10), pumpBodyMat);
        spout.rotation.z = -Math.PI / 3;
        spout.position.set(0.07, 0.21, 0);
        pumpGroup.add(spout);

        // Flexible clear vinyl discharge hose looping downwards
        const hose = new THREE.Mesh(new THREE.CylinderGeometry(0.010, 0.010, 0.38, 10), hoseMat);
        hose.position.set(0.12, 0.04, 0);
        pumpGroup.add(hose);

        drumGroup.add(pumpGroup);
      }

      group.add(drumGroup);
    }

    // 3. Braided Copper Anti-Static Grounding Wire clamped to the pallet & drum
    const wireMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.35, metalness: 0.95 });
    const groundWire = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.52, 8), wireMat);
    groundWire.position.set(-0.24, palletH + 0.18, -0.05);
    groundWire.rotation.z = Math.PI / 4;
    group.add(groundWire);

    // Alligator grounding clamp
    const clamp = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.035, 0.015), steelHardwareMat);
    clamp.position.set(-0.16 - drumR * 0.7, palletH + 0.02 + drumH, -0.15);
    group.add(clamp);

    return group;
  }

  /**
   * 7. Authored Heavy Industrial Structural Steel Safety Crash Barrier:
   * OSHA yellow structural steel posts, dual horizontal rails with diagonal hazard slashes,
   * heavy 12mm floor baseplates with 4 anchor bolts, and amber prism retroreflectors.
   */
  public static createSafetyBarrier(w: number = 1.1, h: number = 0.85, d: number = 0.45): THREE.Group {
    const group = new THREE.Group();

    const yellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.32, metalness: 0.35 });
    const steelBaseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.45, metalness: 0.85 });
    const boltMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.25, metalness: 0.95 });
    const reflectorMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.1,
      metalness: 0.2,
      emissive: 0xd97706,
      emissiveIntensity: 0.4,
    });

    const hazardStripeTex = this.getHazardStripeTexture();
    const hazardMat = new THREE.MeshStandardMaterial({
      map: hazardStripeTex,
      roughness: 0.35,
      metalness: 0.25,
    });

    // 2 Heavy Vertical Upright Posts
    const postR = 0.048;
    const postH = h;
    for (const sx of [-w / 2 + 0.12, w / 2 - 0.12]) {
      // Main structural tubular column
      const post = new THREE.Mesh(new THREE.CylinderGeometry(postR, postR, postH, 18), yellowMat);
      post.position.set(sx, postH / 2, 0);
      post.castShadow = true;
      group.add(post);

      // Domed steel top cap
      const cap = new THREE.Mesh(new THREE.SphereGeometry(postR, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), yellowMat);
      cap.position.set(sx, postH, 0);
      group.add(cap);

      // Heavy 12mm floor flange baseplate
      const basePlate = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.024, 0.22), steelBaseMat);
      basePlate.position.set(sx, 0.012, 0);
      basePlate.receiveShadow = true;
      group.add(basePlate);

      // 4 Heavy-Duty Concrete Anchor Bolts with Hex Nuts
      for (const bx of [-0.075, 0.075]) {
        for (const bz of [-0.075, 0.075]) {
          const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.026, 6), boltMat);
          bolt.position.set(sx + bx, 0.026, bz);
          group.add(bolt);
        }
      }

      // Amber Microprismatic Retroreflective Safety Prism on outer post face
      const reflector = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.008, 12), reflectorMat);
      reflector.rotation.z = Math.PI / 2;
      reflector.position.set(sx + (sx < 0 ? -postR - 0.004 : postR + 0.004), postH * 0.75, 0);
      group.add(reflector);
    }

    // Top and Bottom Horizontal Heavy Rails wrapped in OSHA Hazard Stripes
    const railR = postR * 0.88;
    const railL = w;
    for (const ry of [h - 0.08, h * 0.44]) {
      const rail = new THREE.Mesh(new THREE.CylinderGeometry(railR, railR, railL, 18), hazardMat);
      rail.rotation.z = Math.PI / 2;
      rail.position.set(0, ry, 0);
      rail.castShadow = true;
      group.add(rail);

      // Cast steel rounded end caps
      for (const ex of [-railL / 2, railL / 2]) {
        const endCap = new THREE.Mesh(new THREE.SphereGeometry(railR, 12, 8), steelBaseMat);
        endCap.position.set(ex, ry, 0);
        group.add(endCap);
      }
    }

    return group;
  }

  /**
   * 8. Biophilic Stainless Steel Planter Pods with Lush Foliage:
   * Contemporary architectural accent pods placed at perimeter corners.
   */
  public static createBiophilicPlanters(scene: THREE.Scene) {
    const planterMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.2, metalness: 0.9 });
    const soilMat = new THREE.MeshStandardMaterial({ color: 0x271e16, roughness: 0.9 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.5, metalness: 0.1 });

    const planterCoords: [number, number][] = [
      [-9.8, 6.2],
      [9.8, 6.2],
    ];

    for (const [px, pz] of planterCoords) {
      const pGroup = new THREE.Group();
      pGroup.position.set(px, 0, pz);

      // Brushed stainless cylinder pot
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.35, 0.85, 20), planterMat);
      pot.position.y = 0.425;
      pot.receiveShadow = true;
      pGroup.add(pot);

      // Soil bed
      const soil = new THREE.Mesh(new THREE.CircleGeometry(0.40, 18), soilMat);
      soil.rotation.x = -Math.PI / 2;
      soil.position.y = 0.84;
      pGroup.add(soil);

      // Multiple broad tropical leaves
      for (let i = 0; i < 9; i++) {
        const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.32, 10, 8), leafMat);
        const ang = (i / 9) * Math.PI * 2;
        leaf.scale.set(0.65, 1.6, 0.22);
        leaf.rotation.set(0.45 * Math.cos(ang), ang, 0.45 * Math.sin(ang));
        leaf.position.set(0.18 * Math.cos(ang), 1.05 + Math.sin(i) * 0.12, 0.18 * Math.sin(ang));
        pGroup.add(leaf);
      }

      scene.add(pGroup);
    }
  }

  private static createSafetyBollard(
    scene: THREE.Scene,
    x: number,
    z: number,
    yellowMat: THREE.Material,
    blackMat: THREE.Material
  ) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const postGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.95, 16);
    const post = new THREE.Mesh(postGeo, yellowMat);
    post.position.y = 0.95 / 2;
    group.add(post);

    const capGeo = new THREE.SphereGeometry(0.11, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const cap = new THREE.Mesh(capGeo, yellowMat);
    cap.position.y = 0.95;
    group.add(cap);

    const stripeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
    const s1 = new THREE.Mesh(new THREE.CylinderGeometry(0.112, 0.112, 0.08, 16), stripeMat);
    s1.position.y = 0.72;
    group.add(s1);

    const s2 = new THREE.Mesh(new THREE.CylinderGeometry(0.112, 0.112, 0.08, 16), stripeMat);
    s2.position.y = 0.52;
    group.add(s2);

    scene.add(group);
  }

  private static createEmergencyStopStation(scene: THREE.Scene, x: number, y: number, z: number) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    const boxMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.35 });
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.42, 0.12), boxMat);
    group.add(box);

    const btnMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.2, emissive: 0xef4444, emissiveIntensity: 0.3 });
    const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.045, 0.06, 16), btnMat);
    btn.rotation.x = Math.PI / 2;
    btn.position.set(0, 0, 0.07);
    group.add(btn);

    scene.add(group);
  }

  private static buildPalletRack(
    scene: THREE.Scene,
    x: number,
    z: number,
    orangeMat: THREE.Material,
    blueMat: THREE.Material
  ) {
    const rackGroup = new THREE.Group();
    rackGroup.position.set(x, 0, z);

    const w = 3.2;
    const d = 0.75;
    const h = 3.6;

    for (const [px, pz] of [[-w / 2, -d / 2], [w / 2, -d / 2], [-w / 2, d / 2], [w / 2, d / 2]]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.09, h, 0.09), blueMat);
      post.position.set(px, h / 2, pz);
      rackGroup.add(post);
    }

    for (const tierY of [1.1, 2.2, 3.3]) {
      const frontBeam = new THREE.Mesh(new THREE.BoxGeometry(w, 0.11, 0.05), orangeMat);
      frontBeam.position.set(0, tierY, d / 2);
      rackGroup.add(frontBeam);

      const backBeam = new THREE.Mesh(new THREE.BoxGeometry(w, 0.11, 0.05), orangeMat);
      backBeam.position.set(0, tierY, -d / 2);
      rackGroup.add(backBeam);

      const pallet = this.createWoodenPallet(1.1, 0.14, 0.65);
      pallet.position.set(0, tierY + 0.07, 0);
      rackGroup.add(pallet);

      const boxMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.8 });
      const b1 = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.50, 0.55), boxMat);
      b1.position.set(-0.35, tierY + 0.38, 0);
      rackGroup.add(b1);

      const blueBinMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4, metalness: 0.2 });
      const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.40, 0.55), blueBinMat);
      b2.position.set(0.35, tierY + 0.33, 0);
      rackGroup.add(b2);
    }

    scene.add(rackGroup);
  }

  private static createWoodenPallet(w: number, h: number, d: number): THREE.Group {
    const group = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0xc4a482, roughness: 0.85 });

    for (let i = -w / 2 + 0.08; i <= w / 2 - 0.08; i += 0.18) {
      const board = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.025, d), woodMat);
      board.position.set(i, h - 0.0125, 0);
      group.add(board);
    }
    for (const sx of [-w / 2 + 0.06, 0, w / 2 - 0.06]) {
      const str = new THREE.Mesh(new THREE.BoxGeometry(0.09, h - 0.04, d), woodMat);
      str.position.set(sx, (h - 0.04) / 2 + 0.02, 0);
      group.add(str);
    }
    return group;
  }

  private static createWallSafetySign(
    scene: THREE.Scene,
    x: number,
    y: number,
    z: number,
    type: "caution" | "notice"
  ) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 512, 256);
    ctx.lineWidth = 14;
    ctx.strokeStyle = type === "caution" ? "#eab308" : "#2563eb";
    ctx.strokeRect(7, 7, 498, 242);

    ctx.fillStyle = type === "caution" ? "#eab308" : "#2563eb";
    ctx.fillRect(14, 14, 484, 68);

    ctx.fillStyle = type === "caution" ? "#000000" : "#ffffff";
    ctx.font = "bold 38px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(type === "caution" ? "⚠ CAUTION" : "NOTICE", 256, 62);

    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 26px sans-serif";
    if (type === "caution") {
      ctx.fillText("AUTONOMOUS MOBILE ROBOT", 256, 130);
      ctx.fillText("TESTING IN PROGRESS", 256, 168);
      ctx.font = "20px monospace";
      ctx.fillText("STAY CLEAR OF VEHICLE PATHWAY", 256, 212);
    } else {
      ctx.fillText("EYE PROTECTION REQUIRED", 256, 130);
      ctx.fillText("IN THIS TESTING AREA", 256, 168);
      ctx.font = "20px monospace";
      ctx.fillText("RESTRICTED ACCESS ONLY", 256, 212);
    }

    const tex = new THREE.CanvasTexture(canvas);
    const signGeo = new THREE.PlaneGeometry(1.6, 0.8);
    const signMat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
    const signMesh = new THREE.Mesh(signGeo, signMat);
    signMesh.position.set(x, y, z);
    scene.add(signMesh);
  }

  /**
   * Advanced High-Tech Robotics R&D Engineering Workstation:
   * 80/20 T-slot extruded aluminum frame, ESD anti-static worktop with yellow border,
   * overhead cantilevered equipment bridge with slimline inspection LED luminaire,
   * 4-channel digital oscilloscope with glowing waveform trace, dual-output DC power supply,
   * micro soldering station, perforated steel tool pegboard with digital calipers & Allen keys,
   * parts storage bins, 4U controller PC, and precision leveling caster feet.
   */
  public static createWorkstationObstacle(w: number, h: number, d: number): THREE.Group {
    const group = new THREE.Group();

    const aluExtrusionMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.35, metalness: 0.85 });
    const aluGussetMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.30, metalness: 0.90 });
    const woodCoreMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.65, metalness: 0.1 });
    const esdMat = new THREE.MeshStandardMaterial({ color: 0x0f3460, roughness: 0.50, metalness: 0.15 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.40, metalness: 0.85 });
    const footMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.90 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.35, metalness: 0.9 });
    const redBinMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4, metalness: 0.2 });
    const blueBinMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4, metalness: 0.2 });

    const hazardTex = this.getHazardStripeTexture();
    const hazardMat = new THREE.MeshStandardMaterial({ map: hazardTex, roughness: 0.35, metalness: 0.2 });

    const tableTopY = h * 0.76;
    const topThickness = 0.048;

    // 1. T-Slot 80/20 Extruded Aluminum Legs (4 corners)
    const legW = 0.052;
    const legH = tableTopY - topThickness / 2;
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const lx = sx * (w / 2 - legW / 2);
        const lz = sz * (d / 2 - legW / 2);

        // Main leg profile
        const leg = new THREE.Mesh(new THREE.BoxGeometry(legW, legH, legW), aluExtrusionMat);
        leg.position.set(lx, legH / 2, lz);
        leg.castShadow = true;
        group.add(leg);

        // Precision leveling foot pad with hex adjustment nut
        const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.042, 0.024, 12), footMat);
        foot.position.set(lx, 0.012, lz);
        foot.receiveShadow = true;
        group.add(foot);

        const hexNut = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.016, 6), aluGussetMat);
        hexNut.position.set(lx, 0.030, lz);
        group.add(hexNut);

        // Corner gusset bracket
        const gusset = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.035, 0.035), aluGussetMat);
        gusset.position.set(lx - sx * 0.016, tableTopY - topThickness - 0.018, lz - sz * 0.016);
        group.add(gusset);
      }
    }

    // Lower H-Frame Stretchers
    const stretcherY = 0.16;
    for (const sz of [-1, 1]) {
      const lz = sz * (d / 2 - legW / 2);
      const strX = new THREE.Mesh(new THREE.BoxGeometry(w - legW * 2, 0.04, 0.04), aluExtrusionMat);
      strX.position.set(0, stretcherY, lz);
      group.add(strX);
    }
    const centerStrZ = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, d - legW * 2), aluExtrusionMat);
    centerStrZ.position.set(0, stretcherY, 0);
    group.add(centerStrZ);

    // 2. Multi-Layer Anti-Static ESD Worktop Surface
    // Butcher-block core substrate
    const subTop = new THREE.Mesh(new THREE.BoxGeometry(w, topThickness * 0.65, d), woodCoreMat);
    subTop.position.y = tableTopY - topThickness * 0.18;
    subTop.castShadow = true;
    subTop.receiveShadow = true;
    group.add(subTop);

    // Dark Navy Anti-Static ESD Mat on top
    const esdTop = new THREE.Mesh(new THREE.BoxGeometry(w - 0.02, topThickness * 0.35, d - 0.02), esdMat);
    esdTop.position.y = tableTopY + topThickness * 0.32;
    esdTop.receiveShadow = true;
    group.add(esdTop);

    // Front Apron OSHA Hazard Chevron Warning Stripe
    const frontTrim = new THREE.Mesh(new THREE.BoxGeometry(w, 0.024, 0.012), hazardMat);
    frontTrim.position.set(0, tableTopY, d / 2 + 0.006);
    group.add(frontTrim);

    // Dual Brass ESD Grounding Studs & Wrist Strap Connection Sockets
    for (const gx of [-w * 0.36, w * 0.36]) {
      const stud = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.012, 10), brassMat);
      stud.position.set(gx, tableTopY + topThickness / 2 + 0.006, d / 2 - 0.04);
      group.add(stud);
    }

    // 3. Overhead Cantilevered Equipment Bridge & Inspection LED Luminaire
    const riserH = h - tableTopY + 0.28;
    const riserMat = aluExtrusionMat;
    const riserZ = -d / 2 + 0.04;

    for (const rx of [-w / 2 + 0.06, w / 2 - 0.06]) {
      const riser = new THREE.Mesh(new THREE.BoxGeometry(0.04, riserH, 0.04), riserMat);
      riser.position.set(rx, tableTopY + riserH / 2, riserZ);
      riser.castShadow = true;
      group.add(riser);
    }

    // Overhead Equipment Shelf
    const shelfY = tableTopY + riserH * 0.68;
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(w - 0.04, 0.025, d * 0.42), aluExtrusionMat);
    shelf.position.set(0, shelfY, riserZ + d * 0.16);
    shelf.castShadow = true;
    shelf.receiveShadow = true;
    group.add(shelf);

    // Slimline Overhead Inspection Task Luminaire (casting downward task light)
    const luminaire = new THREE.Mesh(new THREE.BoxGeometry(w * 0.85, 0.024, 0.06), steelMat);
    luminaire.position.set(0, tableTopY + riserH, riserZ + d * 0.22);
    group.add(luminaire);

    const lumLens = new THREE.Mesh(
      new THREE.BoxGeometry(w * 0.82, 0.008, 0.045),
      new THREE.MeshBasicMaterial({ color: 0xfffaed })
    );
    lumLens.position.set(0, tableTopY + riserH - 0.012, riserZ + d * 0.22);
    group.add(lumLens);

    // 4. Rackmount Electronic Test Equipment on the Shelf
    // A. 4-Channel Digital Storage Oscilloscope (with live glowing signal waveform)
    const scopeTex = this.getOscilloscopeTexture();
    const scopeMat = new THREE.MeshStandardMaterial({ map: scopeTex, roughness: 0.35, metalness: 0.2 });
    const scopeChassisMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.8 });

    const scopeW = w * 0.38;
    const scopeH = 0.14;
    const scopeD = d * 0.26;
    const scopeChassis = new THREE.Mesh(new THREE.BoxGeometry(scopeW, scopeH, scopeD), scopeChassisMat);
    scopeChassis.position.set(-w * 0.22, shelfY + scopeH / 2 + 0.012, riserZ + d * 0.16);
    scopeChassis.castShadow = true;
    group.add(scopeChassis);

    const scopeScreen = new THREE.Mesh(new THREE.PlaneGeometry(scopeW * 0.90, scopeH * 0.82), scopeMat);
    scopeScreen.position.set(-w * 0.22, shelfY + scopeH / 2 + 0.012, riserZ + d * 0.16 + scopeD / 2 + 0.002);
    group.add(scopeScreen);

    // B. Dual-Output Precision DC Power Supply (with bright LED digital readouts)
    const psuTex = this.getPowerSupplyTexture();
    const psuMat = new THREE.MeshStandardMaterial({ map: psuTex, roughness: 0.35, metalness: 0.2 });
    const psuW = w * 0.34;
    const psuH = 0.13;
    const psuD = d * 0.25;
    const psuChassis = new THREE.Mesh(new THREE.BoxGeometry(psuW, psuH, psuD), scopeChassisMat);
    psuChassis.position.set(w * 0.24, shelfY + psuH / 2 + 0.012, riserZ + d * 0.16);
    psuChassis.castShadow = true;
    group.add(psuChassis);

    const psuScreen = new THREE.Mesh(new THREE.PlaneGeometry(psuW * 0.92, psuH * 0.84), psuMat);
    psuScreen.position.set(w * 0.24, shelfY + psuH / 2 + 0.012, riserZ + d * 0.16 + psuD / 2 + 0.002);
    group.add(psuScreen);

    // 5. Perforated Steel Tool Pegboard (Back Panel between table and shelf)
    const pegH = shelfY - tableTopY - 0.02;
    const pegMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6, metalness: 0.75 });
    const pegboard = new THREE.Mesh(new THREE.BoxGeometry(w - 0.08, pegH, 0.01), pegMat);
    pegboard.position.set(0, tableTopY + topThickness / 2 + pegH / 2 + 0.01, riserZ + 0.01);
    group.add(pegboard);

    // 4 Interlocking Plastic Parts Storage Bins (Akro-bins) on pegboard rail
    const binW = 0.09;
    const binH = 0.065;
    const binD = 0.08;
    const binXs = [-w * 0.28, -w * 0.14, w * 0.14, w * 0.28];
    for (let bi = 0; bi < 4; bi++) {
      const bMat = bi % 2 === 0 ? redBinMat : blueBinMat;
      const bin = new THREE.Mesh(new THREE.BoxGeometry(binW, binH, binD), bMat);
      bin.position.set(binXs[bi], tableTopY + topThickness / 2 + 0.06, riserZ + 0.05);
      bin.castShadow = true;
      group.add(bin);
    }

    // 6. Lower Heavy Equipment Deck & 4U Industrial Controller PC Unit
    const lowerShelfY = 0.22;
    const lowerShelf = new THREE.Mesh(new THREE.BoxGeometry(w - legW * 2, 0.024, d - legW * 2), steelMat);
    lowerShelf.position.set(0, lowerShelfY, 0);
    lowerShelf.receiveShadow = true;
    group.add(lowerShelf);

    // 4U Industrial Rack Controller Unit
    const pcMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.45, metalness: 0.8 });
    const pcLEDMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const pc = new THREE.Mesh(new THREE.BoxGeometry(w * 0.52, 0.16, d * 0.65), pcMat);
    pc.position.set(0, lowerShelfY + 0.092, 0);
    pc.castShadow = true;
    group.add(pc);

    // Front blue power indicator LED
    const led = new THREE.Mesh(new THREE.CircleGeometry(0.008, 10), pcLEDMat);
    led.position.set(w * 0.22, lowerShelfY + 0.13, d * 0.325 + 0.002);
    group.add(led);

    return group;
  }

  /**
   * Heavy Export-Grade Industrial Wooden Cargo Shipping Crate:
   * Authentic 4-way wooden Euro-pallet base with 9 spacer blocks and skid runners,
   * recessed pine wood walls with procedural grain & international cargo stencils
   * (THIS SIDE UP ↑↑, FRAGILE glass, KEEP DRY umbrella, center of gravity,
   * Class 9 Lithium hazard diamond, gross/tare weights, and industrial barcode),
   * 3D outer structural timber framing with diagonal cross-battens and carriage bolts,
   * heavy-gauge galvanized 3-way corner armor caps, black steel strapping with crimp tensioners,
   * and recessed side drop handles.
   */
  public static createRealisticCrate(w: number = 0.90, h: number = 0.90, d: number = 0.90): THREE.Group {
    const group = new THREE.Group();

    const timberMat = new THREE.MeshStandardMaterial({ color: 0x9a7b56, roughness: 0.80, metalness: 0.05 });
    const palletWoodMat = new THREE.MeshStandardMaterial({ color: 0xb58b57, roughness: 0.85, metalness: 0.04 });
    const metalArmorMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.38, metalness: 0.85 });
    const boltMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.25, metalness: 0.95 });
    const strapMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.35, metalness: 0.90 });

    const crateWoodTex = this.getCrateWoodTexture(false);
    const cratePanelMat = new THREE.MeshStandardMaterial({
      map: crateWoodTex,
      roughness: 0.78,
      metalness: 0.06,
    });

    // 1. Integrated 4-Way Heavy Wooden Euro-Pallet Base
    const palletH = 0.12;
    const runnerW = 0.09;
    const blockH = palletH - 0.04;

    // 3 Bottom skid runner boards (beveled ends for pallet jacks)
    for (const sx of [-w / 2 + runnerW / 2, 0, w / 2 - runnerW / 2]) {
      const runner = new THREE.Mesh(new THREE.BoxGeometry(runnerW, 0.022, d), palletWoodMat);
      runner.position.set(sx, 0.011, 0);
      runner.receiveShadow = true;
      group.add(runner);

      // 3 Wooden Spacer Blocks per runner (Front, Center, Back)
      for (const sz of [-d / 2 + runnerW / 2, 0, d / 2 - runnerW / 2]) {
        const block = new THREE.Mesh(new THREE.BoxGeometry(runnerW, blockH, runnerW), palletWoodMat);
        block.position.set(sx, 0.022 + blockH / 2, sz);
        block.castShadow = true;
        group.add(block);
      }
    }

    // Top Pallet Deck Boards (spanning across the blocks)
    for (let pz = -d / 2 + 0.06; pz <= d / 2 - 0.06; pz += 0.14) {
      const board = new THREE.Mesh(new THREE.BoxGeometry(w, 0.022, 0.11), palletWoodMat);
      board.position.set(0, palletH - 0.011, pz);
      board.receiveShadow = true;
      group.add(board);
    }

    // 2. Main Crate Body with Recessed Stenciled Panels
    const crateH = h - palletH;
    const crateCenterY = palletH + crateH / 2;

    // Recessed inner walls textured with realistic cargo stencils
    const innerW = w - 0.04;
    const innerD = d - 0.04;
    const innerBox = new THREE.Mesh(new THREE.BoxGeometry(innerW, crateH - 0.02, innerD), cratePanelMat);
    innerBox.position.set(0, crateCenterY, 0);
    innerBox.castShadow = true;
    innerBox.receiveShadow = true;
    group.add(innerBox);

    // 3. 3D Structural Wooden Outer Framing
    const frameW = 0.065;
    const frameThick = 0.026;

    // A. 4 Corner Vertical Timber Posts
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(frameW, crateH, frameThick), timberMat);
        post.position.set(sx * (w / 2 - frameW / 2), crateCenterY, sz * (d / 2 - frameThick / 2));
        post.castShadow = true;
        group.add(post);

        const postSide = new THREE.Mesh(new THREE.BoxGeometry(frameThick, crateH, frameW), timberMat);
        postSide.position.set(sx * (w / 2 - frameThick / 2), crateCenterY, sz * (d / 2 - frameW / 2));
        postSide.castShadow = true;
        group.add(postSide);
      }
    }

    // B. Top and Bottom Horizontal Timber Rim Boards
    for (const sy of [palletH + frameW / 2, palletH + crateH - frameW / 2]) {
      // Front and back rims
      for (const sz of [-1, 1]) {
        const rimZ = new THREE.Mesh(new THREE.BoxGeometry(w, frameW, frameThick), timberMat);
        rimZ.position.set(0, sy, sz * (d / 2 - frameThick / 2));
        group.add(rimZ);
      }
      // Left and right rims
      for (const sx of [-1, 1]) {
        const rimX = new THREE.Mesh(new THREE.BoxGeometry(frameThick, frameW, d), timberMat);
        rimX.position.set(sx * (w / 2 - frameThick / 2), sy, 0);
        group.add(rimX);
      }
    }

    // C. 3D Diagonal Cross-Battens (X-Bracing) on Front and Back Faces
    const diagLen = Math.hypot(w - frameW * 2, crateH - frameW * 2);
    const diagAngle = Math.atan2(crateH - frameW * 2, w - frameW * 2);

    for (const sz of [-1, 1]) {
      const diag1 = new THREE.Mesh(new THREE.BoxGeometry(diagLen, frameW * 0.75, frameThick * 0.8), timberMat);
      diag1.rotation.z = diagAngle;
      diag1.position.set(0, crateCenterY, sz * (d / 2 - frameThick / 2 + 0.003));
      group.add(diag1);

      // Carriage bolt heads at timber intersections
      for (const bx of [-w * 0.38, w * 0.38]) {
        for (const by of [palletH + frameW * 0.5, palletH + crateH - frameW * 0.5]) {
          const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.012, 8), boltMat);
          bolt.rotation.x = Math.PI / 2;
          bolt.position.set(bx, by, sz * (d / 2 + 0.004));
          group.add(bolt);
        }
      }
    }

    // 4. Heavy-Gauge Galvanized Steel 3-Way Corner Armor Brackets (8 corners)
    const capSize = Math.min(w, h, d) * 0.17;
    for (const sx of [-1, 1]) {
      for (const sy of [0, 1]) {
        for (const sz of [-1, 1]) {
          const cornerY = sy === 0 ? palletH + capSize * 0.4 : palletH + crateH - capSize * 0.4;
          const cornerCap = new THREE.Mesh(new THREE.BoxGeometry(capSize, capSize * 0.8, capSize), metalArmorMat);
          cornerCap.position.set(
            sx * (w / 2 - capSize / 2 + 0.005),
            cornerY,
            sz * (d / 2 - capSize / 2 + 0.005)
          );
          cornerCap.castShadow = true;
          group.add(cornerCap);
        }
      }
    }

    // 5. Heavy Black Steel Tension Straps with Embossed Crimp Buckles
    for (const strapY of [palletH + crateH * 0.32, palletH + crateH * 0.76]) {
      const strap = new THREE.Mesh(new THREE.BoxGeometry(w + 0.015, 0.024, d + 0.015), strapMat);
      strap.position.y = strapY;
      group.add(strap);

      // Crimp tensioner buckle on the front face
      const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.038, 0.025), metalArmorMat);
      buckle.position.set(0, strapY, d / 2 + 0.014);
      group.add(buckle);
    }

    // 6. Recessed Zinc Side Drop-Handles
    for (const sx of [-1, 1]) {
      const handleGroup = new THREE.Group();
      handleGroup.position.set(sx * (w / 2 + 0.006), crateCenterY, 0);

      const plate = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.10, 0.14), metalArmorMat);
      handleGroup.add(plate);

      const bail = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.008, 8, 16, Math.PI), metalArmorMat);
      bail.rotation.z = sx > 0 ? -Math.PI / 2 : Math.PI / 2;
      bail.position.set(sx * 0.015, -0.01, 0);
      handleGroup.add(bail);

      group.add(handleGroup);
    }

    return group;
  }

  /**
   * Master-Grade Heavy-Duty Industrial Mobile Tool Chest & Roller Cabinet:
   * Double-wall welded steel chassis in glossy industrial crimson red powder-coat,
   * protective black corner armor guards, tubular ergonomic push handle with knurled grip,
   * 6 ball-bearing drawers with procedural aluminum pull extrusions & classification labels,
   * master cylinder key lock with brass tag, molded grooved vulcanized rubber top mat with lip,
   * stainless steel magnetic hardware dish with bolts, rugged digital multimeter (Fluke style),
   * side utility pegboard with 3 aerosol spray cans & blue shop towel roll,
   * and 4 heavy-duty 5" swivel casters with chrome forks and foot-brake pedals.
   */
  public static createToolCabinet(w: number = 0.85, h: number = 0.95, d: number = 0.75): THREE.Group {
    const group = new THREE.Group();

    const crimsonMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.32, metalness: 0.55 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.15, metalness: 0.95 });
    const rubberMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.88 });
    const armorMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6, metalness: 0.7 });
    const meterYellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.45, metalness: 0.1 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, metalness: 0.9 });
    const towelBlueMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.9 });

    const cabinetFrontTex = this.getToolCabinetFrontTexture();
    const frontDecalMat = new THREE.MeshStandardMaterial({
      map: cabinetFrontTex,
      roughness: 0.35,
      metalness: 0.3,
    });

    const casterH = 0.10;
    const bodyH = h - casterH - 0.03;
    const bodyCenterY = casterH + bodyH / 2;

    // 1. Double-Wall Welded Steel Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(w, bodyH, d), crimsonMat);
    body.position.y = bodyCenterY;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Front Face Plate with Drawers & Handles
    const frontPlate = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.04, bodyH - 0.04), frontDecalMat);
    frontPlate.position.set(0, bodyCenterY, d / 2 + 0.002);
    group.add(frontPlate);

    // 3D Extruded Brushed Aluminum Drawer Pulls (6 drawers)
    const nDrawers = 6;
    const drawerH = (bodyH - 0.10) / nDrawers;
    for (let di = 0; di < nDrawers; di++) {
      const dy = casterH + 0.06 + di * drawerH + drawerH * 0.4;
      const pull = new THREE.Mesh(new THREE.BoxGeometry(w * 0.78, 0.016, 0.018), chromeMat);
      pull.position.set(0, dy, d / 2 + 0.012);
      pull.castShadow = true;
      group.add(pull);
    }

    // 2. Protective Black Corner Edge Armor Bumpers (4 vertical edges)
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const bumper = new THREE.Mesh(new THREE.BoxGeometry(0.04, bodyH, 0.04), armorMat);
        bumper.position.set(sx * (w / 2 - 0.015), bodyCenterY, sz * (d / 2 - 0.015));
        group.add(bumper);
      }
    }

    // 3. Molded Grooved Vulcanized Rubber Top Work Mat with Raised Lip
    const topMatMesh = new THREE.Mesh(new THREE.BoxGeometry(w + 0.02, 0.028, d + 0.02), rubberMat);
    topMatMesh.position.y = casterH + bodyH + 0.014;
    topMatMesh.receiveShadow = true;
    group.add(topMatMesh);

    // Stainless Steel Magnetic Hardware Dish on top
    const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.050, 0.018, 16), chromeMat);
    dish.position.set(-w * 0.22, casterH + bodyH + 0.036, d * 0.15);
    group.add(dish);

    // Loose fasteners inside dish
    for (let f = 0; f < 5; f++) {
      const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.006, 6), brassMat);
      nut.position.set(-w * 0.22 + (f - 2) * 0.018, casterH + bodyH + 0.044, d * 0.15 + (f % 2) * 0.012);
      group.add(nut);
    }

    // Rugged Industrial Digital Multimeter (Fluke Style) on top
    const meterGroup = new THREE.Group();
    meterGroup.position.set(w * 0.18, casterH + bodyH + 0.038, -d * 0.10);
    meterGroup.rotation.y = -Math.PI / 6;

    const meterBody = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.022, 0.15), meterYellowMat);
    meterGroup.add(meterBody);

    const meterScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.055, 0.035),
      new THREE.MeshBasicMaterial({ color: 0x94a3b8 })
    );
    meterScreen.rotation.x = -Math.PI / 2;
    meterScreen.position.set(0, 0.012, -0.035);
    meterGroup.add(meterScreen);

    const rotaryDial = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.008, 12), armorMat);
    rotaryDial.position.set(0, 0.014, 0.02);
    meterGroup.add(rotaryDial);
    group.add(meterGroup);

    // 4. Heavy Steel Push-Handle Bar on Left Side
    const handleBar = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, d * 0.65, 12), chromeMat);
    handleBar.rotation.x = Math.PI / 2;
    handleBar.position.set(-w / 2 - 0.055, bodyCenterY + bodyH * 0.38, 0);
    group.add(handleBar);

    // Rubber grip around handle
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, d * 0.40, 12), rubberMat);
    grip.rotation.x = Math.PI / 2;
    grip.position.set(-w / 2 - 0.055, bodyCenterY + bodyH * 0.38, 0);
    group.add(grip);

    // 2 Standoff brackets connecting handle to body
    for (const hz of [-d * 0.28, d * 0.28]) {
      const standoff = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.022, 0.022), crimsonMat);
      standoff.position.set(-w / 2 - 0.028, bodyCenterY + bodyH * 0.38, hz);
      group.add(standoff);
    }

    // 5. Perforated Side Pegboard & 3-Can Aerosol Caddy on Right Side
    const caddyMat = armorMat;
    const caddyShelf = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.045, 0.26), caddyMat);
    caddyShelf.position.set(w / 2 + 0.045, bodyCenterY + 0.05, 0);
    group.add(caddyShelf);

    // 3 Aerosol Spray Cans (WD-40, Contact Cleaner, Degreaser)
    const canColors = [0x0284c7, 0xdc2626, 0x64748b];
    for (let ci = 0; ci < 3; ci++) {
      const canCyl = new THREE.Mesh(
        new THREE.CylinderGeometry(0.026, 0.026, 0.12, 12),
        new THREE.MeshStandardMaterial({ color: canColors[ci], roughness: 0.35, metalness: 0.6 })
      );
      canCyl.position.set(w / 2 + 0.045, bodyCenterY + 0.05 + 0.07, (ci - 1) * 0.075);
      canCyl.castShadow = true;
      group.add(canCyl);

      const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.015, 8), chromeMat);
      nozzle.position.set(w / 2 + 0.045, bodyCenterY + 0.05 + 0.135, (ci - 1) * 0.075);
      group.add(nozzle);
    }

    // Heavy Shop Paper Towel Roll (Blue lint-free shop towels)
    const towelRoll = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.22, 16), towelBlueMat);
    towelRoll.rotation.x = Math.PI / 2;
    towelRoll.position.set(w / 2 + 0.05, bodyCenterY - bodyH * 0.28, 0);
    group.add(towelRoll);

    // 6. Heavy-Duty 5" Industrial Swivel Casters with Red Polyurethane Wheels & Brake Pedals
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.45, metalness: 0.2 });
    const wheelHubMat = chromeMat;

    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const casterGroup = new THREE.Group();
        casterGroup.position.set(sx * (w / 2 - 0.08), casterH / 2, sz * (d / 2 - 0.08));

        // Chrome Swivel Fork
        const fork = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.05, 0.05), chromeMat);
        fork.position.y = 0.024;
        casterGroup.add(fork);

        // Polyurethane Wheel
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.028, 16), wheelMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.y = -0.012;
        wheel.castShadow = true;
        casterGroup.add(wheel);

        // Chrome Center Hub
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.030, 10), wheelHubMat);
        hub.rotation.z = Math.PI / 2;
        hub.position.y = -0.012;
        casterGroup.add(hub);

        // Foot-Operated Locking Brake Pedal
        const brake = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.012, 0.035), chromeMat);
        brake.position.set(0, 0.018, sz > 0 ? 0.032 : -0.032);
        casterGroup.add(brake);

        group.add(casterGroup);
      }
    }

    return group;
  }

  /**
   * Realistic modern human robotics engineer/technician (1.75m tall):
   * Safety hard hat, safety glasses, high-vis reflective vest, work trousers, boots.
   */
  public static createRealisticTechnician(): {
    root: THREE.Group;
    head: THREE.Object3D;
  } {
    const group = new THREE.Group();

    const skinMat = new THREE.MeshStandardMaterial({ color: 0xf6c8a0, roughness: 0.65 });
    const hardHatMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3, metalness: 0.3 });
    const vestMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.6 });
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2, metalness: 0.9 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const bootMat = new THREE.MeshStandardMaterial({ color: 0x3f2d1d, roughness: 0.7 });

    // Boots
    for (const sx of [-0.10, 0.10]) {
      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.24), bootMat);
      boot.position.set(sx, 0.07, 0.02);
      boot.castShadow = true;
      group.add(boot);
    }

    // Legs
    for (const sx of [-0.10, 0.10]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.74, 12), pantsMat);
      leg.position.set(sx, 0.51, 0);
      leg.castShadow = true;
      group.add(leg);
    }

    // Torso with Safety Vest
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.56, 0.22), vestMat);
    torso.position.set(0, 1.16, 0);
    torso.castShadow = true;
    group.add(torso);

    const s1 = new THREE.Mesh(new THREE.BoxGeometry(0.364, 0.04, 0.224), stripeMat);
    s1.position.set(0, 1.25, 0);
    group.add(s1);

    const s2 = new THREE.Mesh(new THREE.BoxGeometry(0.364, 0.04, 0.224), stripeMat);
    s2.position.set(0, 1.05, 0);
    group.add(s2);

    // Arms
    for (const sx of [-0.23, 0.23]) {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.52, 10), vestMat);
      arm.position.set(sx, 1.15, 0);
      arm.castShadow = true;
      group.add(arm);
    }

    // Head
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.54, 0);

    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), skinMat);
    headMesh.position.y = 0;
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Hard Hat
    const hat = new THREE.Mesh(new THREE.SphereGeometry(0.125, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), hardHatMat);
    hat.position.y = 0.05;
    headGroup.add(hat);

    const brim = new THREE.Mesh(new THREE.RingGeometry(0.11, 0.16, 16), hardHatMat);
    brim.rotation.x = -Math.PI / 2;
    brim.position.y = 0.05;
    headGroup.add(brim);

    // Safety Glasses
    const glasses = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.035, 0.04),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.8, transparent: true, opacity: 0.8 })
    );
    glasses.position.set(0, 0.01, 0.10);
    headGroup.add(glasses);

    group.add(headGroup);

    return { root: group, head: headGroup };
  }
}

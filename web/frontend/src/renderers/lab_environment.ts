/**
 * Futuristic AI Robotics Research Laboratory (Year 2050).
 * High-End Cybernetic & Neural Dynamics Research Facility:
 *  - Obsidian carbon-composite reflective floor with laser-etched hexagonal cyber-tiles & circular telemetry arena.
 *  - Dark brushed titanium and carbon-fiber modular wall architecture with vertical recessed LED light blades.
 *  - Central Quantum AI Core Reactor with magnetic containment vessel, spinning dual-axis gyro rings, and pulsing plasma core.
 *  - Holographic World Simulation Emitter projecting an illuminated 3D rotating wireframe globe with orbital latent vectors.
 *  - Articulated 6-axis precision robotic arm workcell on high-tech lab workbench with procedural idle scanning kinematics.
 *  - Autonomous exploration rover diagnostics inspection bay with elevated glass under-glow pedestal.
 *  - Master research workstation with curved ultrawide panoramic display, dual angled auxiliary screens, and liquid-cooled supercomputer.
 *  - Wall-mounted panoramic telemetry screens displaying real-time neural network loss, latent space, and LiDAR point clouds.
 *  - Biophilic hydroponic air-purification columns and illuminated glass display cabinets for robotic actuators.
 *  - High-tech modular quantum containment pods, cryogenic server racks, and plasma power cells.
 */

import * as THREE from "three";

export interface FuturisticLabHandles {
  lights: THREE.PointLight[];
  aiCore?: {
    outerRing: THREE.Object3D;
    innerRing: THREE.Object3D;
    coreOrb: THREE.Mesh;
    light: THREE.PointLight;
  };
  holoEmitter?: {
    globeGroup: THREE.Group;
    rings: THREE.Mesh[];
    beam: THREE.Mesh;
  };
  roboticArm?: {
    baseRot: THREE.Object3D;
    shoulderRot: THREE.Object3D;
    elbowRot: THREE.Object3D;
    wristRot: THREE.Object3D;
    gripperL: THREE.Object3D;
    gripperR: THREE.Object3D;
  };
  roverInspection?: {
    mast: THREE.Object3D;
    scannerHead: THREE.Object3D;
  };
  workstation?: {
    curvedScreen: THREE.Mesh;
    supercomputerLed?: THREE.Mesh;
  };
  telemetryDisplays?: {
    screens: THREE.Mesh[];
  };
}

export class LabEnvironmentBuilder {
  /**
   * Generates a 2048x2048 high-gloss obsidian cyber-tile laboratory floor texture.
   * Features laser-etched hexagonal matrix, circular robotics testing arena,
   * coordinate axes, calibration degree marks, and crisp sci-fi technical stencils.
   */
  public static createFloorCanvasTexture(): THREE.CanvasTexture {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // 1. Deep Midnight Obsidian & Carbon Base Gradient
    const bgGrad = ctx.createRadialGradient(1024, 1024, 100, 1024, 1024, 1400);
    bgGrad.addColorStop(0, "#0c1527");    // Center deep navy obsidian
    bgGrad.addColorStop(0.40, "#080e1b"); // Mid-tone carbon matrix
    bgGrad.addColorStop(0.75, "#050912"); // Perimeter dark slate
    bgGrad.addColorStop(1.0, "#020408");  // Outer edge shadow
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 2048, 2048);

    // Fine metallic carbon micro-grain noise
    const imgData = ctx.getImageData(0, 0, 2048, 2048);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const n = (Math.random() - 0.5) * 14;
      data[i] = Math.min(255, Math.max(0, data[i] + n));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + n * 1.2));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + n * 1.5));
    }
    ctx.putImageData(imgData, 0, 0);

    // 2. High-Tech Hexagonal Cyber-Tile Grid
    ctx.save();
    ctx.strokeStyle = "rgba(14, 165, 233, 0.07)";
    ctx.lineWidth = 1.5;
    const hexRadius = 48;
    const hexH = hexRadius * Math.sqrt(3);
    for (let y = -hexH; y < 2048 + hexH; y += hexH) {
      let row = 0;
      for (let x = -hexRadius; x < 2048 + hexRadius; x += hexRadius * 1.5) {
        const cy = y + (row % 2 === 0 ? 0 : hexH / 2);
        this.drawHexagon(ctx, x, cy, hexRadius * 0.94);
        row++;
      }
    }
    ctx.restore();

    // 3. Central Robotics Testing Arena (The "Neural Test Field")
    const cx = 1024;
    const cy = 1024;
    ctx.save();

    // Concentric Arena Distance Rings (Scales representing 1m, 2m, 3m, 4m, 5m)
    const ringRadii = [180, 360, 540, 720, 880];
    for (let i = 0; i < ringRadii.length; i++) {
      const r = ringRadii[i];
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = i === 2 ? "rgba(0, 240, 255, 0.40)" : "rgba(56, 189, 248, 0.16)";
      ctx.lineWidth = i === 2 ? 3 : 1.5;
      if (i % 2 === 1) ctx.setLineDash([12, 10]);
      else ctx.setLineDash([]);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Degree Ticks around the 720px Arena Ring (Every 15 degrees)
    for (let deg = 0; deg < 360; deg += 15) {
      const rad = (deg * Math.PI) / 180;
      const isMajor = deg % 45 === 0;
      const rInner = isMajor ? 700 : 710;
      const rOuter = 730;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(rad) * rInner, cy + Math.sin(rad) * rInner);
      ctx.lineTo(cx + Math.cos(rad) * rOuter, cy + Math.sin(rad) * rOuter);
      ctx.strokeStyle = isMajor ? "rgba(0, 240, 255, 0.75)" : "rgba(14, 165, 233, 0.35)";
      ctx.lineWidth = isMajor ? 3 : 1.5;
      ctx.stroke();

      if (isMajor) {
        ctx.fillStyle = "rgba(0, 240, 255, 0.70)";
        ctx.font = "bold 16px 'Courier New', monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const labelR = 752;
        ctx.fillText(`${deg}°`, cx + Math.cos(rad) * labelR, cy + Math.sin(rad) * labelR);
      }
    }

    // Coordinate Axes (+X, -X, +Z, -Z)
    ctx.strokeStyle = "rgba(0, 240, 255, 0.25)";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(cx - 900, cy);
    ctx.lineTo(cx + 900, cy);
    ctx.moveTo(cx, cy - 900);
    ctx.lineTo(cx, cy + 900);
    ctx.stroke();
    ctx.setLineDash([]);

    // Central Alignment Crosshair & Diamond Hub
    ctx.strokeStyle = "rgba(0, 255, 157, 0.65)";
    ctx.lineWidth = 3;
    ctx.strokeRect(cx - 30, cy - 30, 60, 60);
    ctx.beginPath();
    ctx.arc(cx, cy, 60, 0, Math.PI * 2);
    ctx.stroke();

    // 4. Perimeter Navigational Light Guidelines & Sleek Bevel Border
    const pad = 72;
    // Outer electric cyan perimeter conduit
    ctx.strokeStyle = "rgba(0, 240, 255, 0.60)";
    ctx.lineWidth = 4;
    ctx.strokeRect(pad, pad, 2048 - pad * 2, 2048 - pad * 2);

    // Secondary subtle violet guide channel
    ctx.strokeStyle = "rgba(168, 85, 247, 0.40)";
    ctx.lineWidth = 2;
    ctx.strokeRect(pad + 18, pad + 18, 2048 - (pad + 18) * 2, 2048 - (pad + 18) * 2);

    // Corner Alignment Tech Brackets
    this.drawCornerTechBrackets(ctx, pad + 8, 80);

    // 5. Stenciled Sci-Fi Typography & Markings
    ctx.fillStyle = "rgba(0, 240, 255, 0.85)";
    ctx.font = "900 24px 'Courier New', monospace";
    ctx.textAlign = "left";
    ctx.fillText("FACILITY SECTOR 04 // NEURAL DYNAMICS LAB", pad + 24, pad + 48);

    ctx.fillStyle = "rgba(148, 163, 184, 0.60)";
    ctx.font = "600 16px 'Courier New', monospace";
    ctx.fillText("WORLD MODEL TEST FIELD // RECEDING HORIZON MPC [N=300, H=14]", pad + 24, pad + 76);

    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(168, 85, 247, 0.85)";
    ctx.font = "900 22px 'Courier New', monospace";
    ctx.fillText("QUANTUM CORE ONLINE ● LATENT FORESIGHT", 2048 - pad - 24, pad + 48);

    ctx.fillStyle = "rgba(148, 163, 184, 0.55)";
    ctx.font = "600 15px 'Courier New', monospace";
    ctx.fillText("STAND CLEAR: AUTONOMOUS KINEMATICS ACTIVE", 2048 - pad - 24, pad + 74);

    // South Edge Status Readout
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(0, 255, 157, 0.70)";
    ctx.font = "700 18px 'Courier New', monospace";
    ctx.fillText("▲ DOCKING INGRESS LANE — AUTONOMOUS AMR CHARGING PORT ▲", cx, 2048 - pad - 28);

    // Docking Bay Stencils (West Area)
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(0, 255, 157, 0.55)";
    ctx.fillText("BAY 01: FAST RECHARGE", pad + 32, 2048 - pad - 28);

    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }

  /**
   * Generates a 2048x2048 specular roughness map for the laboratory floor.
   * Delivers high-gloss mirror reflections on polished tiles with textured seams.
   */
  public static createFloorRoughnessTexture(): THREE.CanvasTexture {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Mirror polished base (darker = more reflective specular)
    ctx.fillStyle = "#202530"; // ~0.15 roughness for gorgeous sci-fi floor reflections
    ctx.fillRect(0, 0, 2048, 2048);

    // Hex seams roughness
    ctx.strokeStyle = "#606878";
    ctx.lineWidth = 2;
    const hexRadius = 48;
    const hexH = hexRadius * Math.sqrt(3);
    for (let y = -hexH; y < 2048 + hexH; y += hexH) {
      let row = 0;
      for (let x = -hexRadius; x < 2048 + hexRadius; x += hexRadius * 1.5) {
        const cy = y + (row % 2 === 0 ? 0 : hexH / 2);
        this.drawHexagon(ctx, x, cy, hexRadius * 0.94);
        row++;
      }
    }

    // Laser-etched lines (matte roughness)
    ctx.strokeStyle = "#808898";
    ctx.lineWidth = 4;
    ctx.strokeRect(72, 72, 2048 - 144, 2048 - 144);
    ctx.strokeRect(90, 90, 2048 - 180, 2048 - 180);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }

  private static drawHexagon(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const hx = x + r * Math.cos(angle);
      const hy = y + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
    ctx.stroke();
  }

  private static drawCornerTechBrackets(ctx: CanvasRenderingContext2D, offset: number, len: number) {
    const corners = [
      [offset, offset, 1, 1],
      [2048 - offset, offset, -1, 1],
      [offset, 2048 - offset, 1, -1],
      [2048 - offset, 2048 - offset, -1, -1],
    ];
    ctx.save();
    ctx.strokeStyle = "rgba(0, 240, 255, 0.90)";
    ctx.lineWidth = 4;
    for (const [x, y, dx, dy] of corners) {
      ctx.beginPath();
      ctx.moveTo(x, y + dy * len);
      ctx.lineTo(x, y);
      ctx.lineTo(x + dx * len, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  /**
   * Builds the entire futuristic AI Robotics Laboratory:
   * Architecture, Quantum AI Core Reactor, Holographic Simulation Emitter,
   * 6-Axis Articulated Robotic Arm Workcell, Autonomous Exploration Rover,
   * Master Research Workstation, Wall Telemetry Displays, and Multi-Layer Lighting.
   */
  public static buildWarehouseArchitecture(scene: THREE.Scene): FuturisticLabHandles {
    const lights: THREE.PointLight[] = [];

    // Core Materials Palette
    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: 0x090e18,
      roughness: 0.28,
      metalness: 0.85,
    });
    const titaniumMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.22,
      metalness: 0.92,
    });
    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x0b111e,
      roughness: 0.40,
      metalness: 0.60,
    });
    const cyanLedMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
    });
    const violetLedMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
    });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      roughness: 0.08,
      metalness: 0.15,
      transmission: 0.88,
      thickness: 0.45,
      transparent: true,
      opacity: 0.82,
    });

    const wallHeight = 6.8;

    // 0. Extended Foundation Floor (48m x 36m outer hall)
    const outerFloorGeo = new THREE.PlaneGeometry(48.0, 36.0);
    const outerFloor = new THREE.Mesh(outerFloorGeo, darkMetalMat);
    outerFloor.rotation.x = -Math.PI / 2;
    outerFloor.position.set(0, -0.005, 0);
    outerFloor.receiveShadow = true;
    scene.add(outerFloor);

    // 1. Sci-Fi Walls with Modular Panels & Vertical LED Blades
    // North Wall (Back - 24m span, height 6.8m at z = -7.3m)
    const backWallGroup = new THREE.Group();
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(24.0, wallHeight, 0.25), darkMetalMat);
    backWall.position.set(0, wallHeight / 2, -7.3);
    backWall.receiveShadow = true;
    backWallGroup.add(backWall);

    // Vertical Cyan & Violet LED Light Blades along North Wall
    const bladePositionsX = [-9.6, -7.2, -4.8, -2.4, 2.4, 4.8, 7.2, 9.6];
    for (let i = 0; i < bladePositionsX.length; i++) {
      const bx = bladePositionsX[i];
      const isCyan = i % 2 === 0;
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, wallHeight - 0.6, 0.04),
        isCyan ? cyanLedMat : violetLedMat
      );
      blade.position.set(bx, wallHeight / 2, -7.16);
      backWallGroup.add(blade);
    }

    // Horizontal Illuminated Data Conduits across North Wall
    for (const cy of [1.6, 3.8, 5.6]) {
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 23.8, 12), titaniumMat);
      pipe.rotation.z = Math.PI / 2;
      pipe.position.set(0, cy, -7.16);
      backWallGroup.add(pipe);

      const glowStripe = new THREE.Mesh(new THREE.BoxGeometry(23.6, 0.015, 0.02), cyanLedMat);
      glowStripe.position.set(0, cy + 0.035, -7.15);
      backWallGroup.add(glowStripe);
    }
    scene.add(backWallGroup);

    // West Wall (Left - 16.0m depth at x = -10.8m)
    const westWallGroup = new THREE.Group();
    const westWall = new THREE.Mesh(new THREE.BoxGeometry(0.25, wallHeight, 16.0), darkMetalMat);
    westWall.position.set(-10.8, wallHeight / 2, 0);
    westWall.receiveShadow = true;
    westWallGroup.add(westWall);

    for (const bz of [-6.0, -3.0, 0.0, 3.0, 6.0]) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.04, wallHeight - 0.6, 0.06), cyanLedMat);
      blade.position.set(-10.66, wallHeight / 2, bz);
      westWallGroup.add(blade);
    }
    scene.add(westWallGroup);

    // East Wall (Right - 16.0m depth at x = 10.8m)
    const eastWallGroup = new THREE.Group();
    const eastWall = new THREE.Mesh(new THREE.BoxGeometry(0.25, wallHeight, 16.0), darkMetalMat);
    eastWall.position.set(10.8, wallHeight / 2, 0);
    eastWall.receiveShadow = true;
    eastWallGroup.add(eastWall);

    for (const bz of [-6.0, -3.0, 0.0, 3.0, 6.0]) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.04, wallHeight - 0.6, 0.06), violetLedMat);
      blade.position.set(10.66, wallHeight / 2, bz);
      eastWallGroup.add(blade);
    }
    scene.add(eastWallGroup);

    // South Perimeter Low Curb (Leaves camera sightline open)
    const southCurb = new THREE.Mesh(new THREE.BoxGeometry(24.0, 0.22, 0.22), titaniumMat);
    southCurb.position.set(0, 0.11, 7.1);
    scene.add(southCurb);
    const southLed = new THREE.Mesh(new THREE.BoxGeometry(23.6, 0.03, 0.04), cyanLedMat);
    southLed.position.set(0, 0.22, 7.02);
    scene.add(southLed);

    // 2. High-Tech Structural Spaceframe Trusses along Ceiling
    this.createCeilingArchitecture(scene, titaniumMat, cyanLedMat);

    // 3. Elevated Glass Observation Control Mezzanine along East Perimeter
    this.createObservationMezzanine(scene, darkMetalMat, titaniumMat, glassMat, cyanLedMat);

    // 4. SIGNATURE FEATURE 1: Central Quantum AI Core Reactor
    const aiCoreHandles = this.createQuantumAICore(scene);
    if (aiCoreHandles.light) lights.push(aiCoreHandles.light);

    // 5. SIGNATURE FEATURE 2: Holographic World Simulation Emitter
    const holoHandles = this.createHolographicWorldEmitter(scene);

    // 6. SIGNATURE FEATURE 3: Precision Articulated 6-Axis Robotic Arm Workcell
    const roboticArmHandles = this.createPrecisionRoboticArmCell(scene, -8.4, -3.8);

    // 7. SIGNATURE FEATURE 4: Autonomous Exploration Rover Inspection Bay
    const roverHandles = this.createAutonomousRoverInspectionBay(scene, 8.4, -3.8);

    // 8. SIGNATURE FEATURE 5: Master Research Workstation & Supercomputer
    const workstationHandles = this.createMasterWorkstation(scene, 8.0, 4.2);

    // 9. SIGNATURE FEATURE 6: Wall-Mounted Panoramic Telemetry Displays
    const telemetryScreens = this.createWallTelemetryDisplays(scene);

    // 10. Biophilic Hydroponic Plant Columns & Component Glass Cases
    this.createBiophilicColumns(scene);
    this.createGlassDisplayCabinets(scene, titaniumMat, glassMat);

    // 11. Recessed Ceiling Spotlights (High efficiency, focused illumination)
    this.createRecessedCeilingLights(scene, lights);

    return {
      lights,
      aiCore: aiCoreHandles,
      holoEmitter: holoHandles,
      roboticArm: roboticArmHandles,
      roverInspection: roverHandles,
      workstation: workstationHandles,
      telemetryDisplays: { screens: telemetryScreens },
    };
  }

  /**
   * Architectural Ceiling Spaceframe Trusses and Lighting Coves
   */
  private static createCeilingArchitecture(
    scene: THREE.Scene,
    titaniumMat: THREE.Material,
    cyanLedMat: THREE.Material
  ) {
    const trussGroup = new THREE.Group();
    // 4 Spaceframe structural trusses spanning X at y = 6.4m
    for (const tz of [-4.5, -1.5, 1.5, 4.5]) {
      const mainBeam = new THREE.Mesh(new THREE.BoxGeometry(23.6, 0.18, 0.18), titaniumMat);
      mainBeam.position.set(0, 6.4, tz);
      trussGroup.add(mainBeam);

      const underGlow = new THREE.Mesh(new THREE.BoxGeometry(23.2, 0.02, 0.04), cyanLedMat);
      underGlow.position.set(0, 6.30, tz);
      trussGroup.add(underGlow);

      // Diagonal cross-bracing struts
      for (let tx = -10.0; tx <= 10.0; tx += 2.5) {
        const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.65, 8), titaniumMat);
        strut.position.set(tx, 6.65, tz);
        trussGroup.add(strut);
      }
    }
    scene.add(trussGroup);
  }

  /**
   * Elevated Soundproof Glass Observation Control Mezzanine
   */
  private static createObservationMezzanine(
    scene: THREE.Scene,
    darkMetalMat: THREE.Material,
    titaniumMat: THREE.Material,
    glassMat: THREE.Material,
    cyanLedMat: THREE.Material
  ) {
    const mezzGroup = new THREE.Group();
    mezzGroup.position.set(9.6, 3.4, 0);

    // Mezzanine Platform Floor (2.2m wide, 14m long)
    const floor = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.25, 14.0), darkMetalMat);
    mezzGroup.add(floor);

    // Edge Safety Fascia with glowing cyan strip
    const fascia = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.35, 14.0), titaniumMat);
    fascia.position.set(-1.05, 0.05, 0);
    mezzGroup.add(fascia);

    const ledStrip = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, 13.8), cyanLedMat);
    ledStrip.position.set(-1.12, 0.05, 0);
    mezzGroup.add(ledStrip);

    // Panoramic Soundproof Tinted Glass Enclosure
    const glassWall = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.6, 13.8), glassMat);
    glassWall.position.set(-1.05, 1.45, 0);
    mezzGroup.add(glassWall);

    // Interior Observation Console Glow
    const consoleGlow = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.1, 12.0),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    consoleGlow.position.set(0.2, 0.8, 0);
    mezzGroup.add(consoleGlow);

    scene.add(mezzGroup);
  }

  /**
   * SIGNATURE FEATURE 1: Central Quantum AI Core Reactor
   * Multi-tiered hexagonal base, glass magnetic containment cylinder,
   * rotating dual quantum gyro rings, and dynamic pulsing plasma core.
   */
  private static createQuantumAICore(scene: THREE.Scene) {
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 0, -6.8);

    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.25, metalness: 0.95 });
    const chrome = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.15, metalness: 0.98 });
    const cyanEnergy = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const violetEnergy = new THREE.MeshBasicMaterial({ color: 0xa855f7 });

    // 1. Hexagonal Tiered Dais Base
    const base1 = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 0.25, 6), darkMetal);
    base1.position.y = 0.125;
    base1.receiveShadow = true;
    coreGroup.add(base1);

    const baseRing = new THREE.Mesh(new THREE.TorusGeometry(1.65, 0.03, 8, 32), cyanEnergy);
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.y = 0.25;
    coreGroup.add(baseRing);

    const base2 = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.4, 0.30, 6), chrome);
    base2.position.y = 0.40;
    coreGroup.add(base2);

    // 2. Four Vertical Magnetic Containment Pylons
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2 + Math.PI / 4;
      const px = Math.cos(angle) * 1.15;
      const pz = Math.sin(angle) * 1.15;
      const pylon = new THREE.Mesh(new THREE.BoxGeometry(0.18, 3.2, 0.18), darkMetal);
      pylon.position.set(px, 2.05, pz);
      coreGroup.add(pylon);

      const pylonGlow = new THREE.Mesh(new THREE.BoxGeometry(0.04, 3.0, 0.04), cyanEnergy);
      pylonGlow.position.set(px * 0.92, 2.05, pz * 0.92);
      coreGroup.add(pylonGlow);
    }

    // 3. Cylindrical Magnetic Containment Glass Vessel
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x00e5ff,
      roughness: 0.05,
      metalness: 0.10,
      transmission: 0.92,
      thickness: 0.40,
      transparent: true,
      opacity: 0.75,
    });
    const vessel = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 2.9, 32, 1, true), glassMat);
    vessel.position.y = 2.05;
    coreGroup.add(vessel);

    // Top Containment Cap Manifold
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.2, 0.35, 6), darkMetal);
    cap.position.y = 3.65;
    coreGroup.add(cap);

    // 4. Dual-Axis Spinning Quantum Gyro Rings
    const outerRing = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.04, 12, 48), chrome);
    outerRing.position.set(0, 2.05, 0);
    coreGroup.add(outerRing);

    const innerRing = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.035, 12, 48), violetEnergy);
    innerRing.position.set(0, 2.05, 0);
    coreGroup.add(innerRing);

    // 5. Central Pulsing Plasma Energy Core Orb
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 2.4,
      roughness: 0.1,
    });
    const coreOrb = new THREE.Mesh(new THREE.SphereGeometry(0.32, 32, 32), coreMat);
    coreOrb.position.set(0, 2.05, 0);
    coreGroup.add(coreOrb);

    // Dynamic AI Core PointLight with Breathing Pulse
    const coreLight = new THREE.PointLight(0x00f0ff, 2.8, 8.5, 1.4);
    coreLight.position.set(0, 2.05, 0);
    coreGroup.add(coreLight);

    // Vertical Upward Laser Containment Column
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.30,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 4.0, 16), beamMat);
    beam.position.set(0, 4.5, 0);
    coreGroup.add(beam);

    scene.add(coreGroup);

    return {
      outerRing,
      innerRing,
      coreOrb,
      light: coreLight,
    };
  }

  /**
   * SIGNATURE FEATURE 2: Holographic World Simulation Display Emitter
   * Pedestal projector emitting a 3D rotating wireframe globe with orbital latent vectors.
   */
  private static createHolographicWorldEmitter(scene: THREE.Scene) {
    const holoGroup = new THREE.Group();
    holoGroup.position.set(-4.6, 0, -5.8);

    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.9 });
    const cyanHolo = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    const violetHolo = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.70,
    });

    // 1. Sleek Projector Pedestal
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 0.90, 24), darkMetal);
    base.position.y = 0.45;
    holoGroup.add(base);

    const projectorLens = new THREE.Mesh(
      new THREE.CircleGeometry(0.48, 24),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide })
    );
    projectorLens.rotation.x = -Math.PI / 2;
    projectorLens.position.y = 0.905;
    holoGroup.add(projectorLens);

    // 2. Upward Semi-Transparent Projection Light Cone
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.95, 1.4, 24, 1, true), coneMat);
    cone.position.y = 1.60;
    holoGroup.add(cone);

    // 3. Floating 3D Wireframe Globe & Latent Space Rings
    const globeGroup = new THREE.Group();
    globeGroup.position.y = 2.10;

    const globe = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 2), cyanHolo);
    globeGroup.add(globe);

    // Core point in globe
    const corePoint = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    globeGroup.add(corePoint);

    // Orbiting Satellite Nodes / Trajectory Vectors
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const node = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 12), violetHolo);
      node.position.set(Math.cos(angle) * 0.62, Math.sin(angle * 2) * 0.15, Math.sin(angle) * 0.62);
      globeGroup.add(node);
    }

    const rings: THREE.Mesh[] = [];
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.015, 8, 36), cyanHolo);
    ring1.rotation.x = Math.PI / 3;
    globeGroup.add(ring1);
    rings.push(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.80, 0.012, 8, 36), violetHolo);
    ring2.rotation.y = Math.PI / 4;
    globeGroup.add(ring2);
    rings.push(ring2);

    holoGroup.add(globeGroup);
    scene.add(holoGroup);

    return {
      globeGroup,
      rings,
      beam: cone,
    };
  }

  /**
   * SIGNATURE FEATURE 3: Precision Articulated 6-Axis Robotic Arm Workcell
   * Futuristic laboratory bench, articulated robotic arm with animated joints,
   * digital oscilloscope, circuit boards, and diagnostic instruments.
   */
  private static createPrecisionRoboticArmCell(scene: THREE.Scene, x: number, z: number) {
    const cellGroup = new THREE.Group();
    cellGroup.position.set(x, 0, z);

    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.9 });
    const whiteCeramic = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.20, metalness: 0.40 });
    const cyanLed = new THREE.MeshBasicMaterial({ color: 0x00f0ff });

    // 1. High-Tech Laboratory Workbench (2.4m x 1.1m, height 0.95m)
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.10, 1.1), darkMetal);
    tableTop.position.set(0, 0.90, 0);
    cellGroup.add(tableTop);

    // Glowing edge trim
    const tableTrim = new THREE.Mesh(new THREE.BoxGeometry(2.44, 0.02, 1.14), cyanLed);
    tableTrim.position.set(0, 0.86, 0);
    cellGroup.add(tableTrim);

    for (const lx of [-1.1, 1.1]) {
      for (const lz of [-0.48, 0.48]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.85, 0.10), darkMetal);
        leg.position.set(lx, 0.425, lz);
        cellGroup.add(leg);
      }
    }

    // 2. Articulated 6-Axis Robotic Arm
    const armRoot = new THREE.Group();
    armRoot.position.set(-0.35, 0.95, 0);

    // Arm Base (Axis 1 - Yaw rotation)
    const baseMount = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.14, 24), darkMetal);
    baseMount.position.y = 0.07;
    armRoot.add(baseMount);

    const baseRot = new THREE.Group();
    baseRot.position.y = 0.14;
    armRoot.add(baseRot);

    const turret = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.16, 0.20, 24), whiteCeramic);
    turret.position.y = 0.10;
    baseRot.add(turret);

    // Shoulder (Axis 2 - Pitch)
    const shoulderRot = new THREE.Group();
    shoulderRot.position.set(0, 0.20, 0);
    baseRot.add(shoulderRot);

    const lowerArm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.55, 0.12), whiteCeramic);
    lowerArm.position.set(0, 0.275, 0);
    shoulderRot.add(lowerArm);

    // Elbow (Axis 3 - Pitch)
    const elbowRot = new THREE.Group();
    elbowRot.position.set(0, 0.55, 0);
    shoulderRot.add(elbowRot);

    const forearm = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.48, 0.10), whiteCeramic);
    forearm.position.set(0, 0.24, 0);
    elbowRot.add(forearm);

    // Wrist (Axis 4/5/6)
    const wristRot = new THREE.Group();
    wristRot.position.set(0, 0.48, 0);
    elbowRot.add(wristRot);

    const wristMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.12, 16), darkMetal);
    wristMesh.position.y = 0.06;
    wristRot.add(wristMesh);

    // Parallel Gripper Fingers
    const gripperL = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.10, 0.03), darkMetal);
    gripperL.position.set(-0.03, 0.15, 0);
    wristRot.add(gripperL);

    const gripperR = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.10, 0.03), darkMetal);
    gripperR.position.set(0.03, 0.15, 0);
    wristRot.add(gripperR);

    cellGroup.add(armRoot);

    // 3. Benchtop Scientific Equipment
    // Digital Oscilloscope
    const osc = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.26, 0.22), darkMetal);
    osc.position.set(0.65, 1.08, -0.25);
    cellGroup.add(osc);

    const oscTex = this.createOscilloscopeTexture();
    const oscScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.30, 0.18),
      new THREE.MeshBasicMaterial({ map: oscTex })
    );
    oscScreen.position.set(0.65, 1.08, -0.138);
    cellGroup.add(oscScreen);

    // Electronic Circuit Board with Micro-SMDs
    const pcb = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.02, 0.28),
      new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.4 })
    );
    pcb.position.set(0.35, 0.96, 0.12);
    cellGroup.add(pcb);

    scene.add(cellGroup);

    return {
      baseRot,
      shoulderRot,
      elbowRot,
      wristRot,
      gripperL,
      gripperR,
    };
  }

  /**
   * SIGNATURE FEATURE 4: Autonomous Exploration Rover Inspection Bay
   * Elevated glass inspection dais with under-glow, robotic rover chassis,
   * rocker-bogie suspension, stereo sensor mast, and telemetry console.
   */
  private static createAutonomousRoverInspectionBay(scene: THREE.Scene, x: number, z: number) {
    const bayGroup = new THREE.Group();
    bayGroup.position.set(x, 0, z);

    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.9 });
    const chrome = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.15, metalness: 0.95 });
    const cyanLed = new THREE.MeshBasicMaterial({ color: 0x00f0ff });

    // 1. Elevated Glass Under-Glow Inspection Dais (2.2m x 1.6m, height 0.18m)
    const daisBase = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.15, 1.6), darkMetal);
    daisBase.position.y = 0.075;
    bayGroup.add(daisBase);

    const daisGlow = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.02, 1.5), cyanLed);
    daisGlow.position.y = 0.16;
    bayGroup.add(daisGlow);

    const daisGlass = new THREE.Mesh(
      new THREE.BoxGeometry(2.16, 0.04, 1.56),
      new THREE.MeshPhysicalMaterial({ transmission: 0.85, roughness: 0.05, thickness: 0.2 })
    );
    daisGlass.position.y = 0.19;
    bayGroup.add(daisGlass);

    // 2. High-Tech Autonomous Rover Model
    const roverRoot = new THREE.Group();
    roverRoot.position.set(0, 0.21, 0);

    // Rover Chassis Body
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.28, 0.65), darkMetal);
    chassis.position.y = 0.28;
    roverRoot.add(chassis);

    // Solar Panel Arrays on top
    const solarMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.1, metalness: 0.8 });
    const solar = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.02, 0.58), solarMat);
    solar.position.y = 0.43;
    roverRoot.add(solar);

    // 6 Rover Wheels
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.8, metalness: 0.2 });
    for (const wx of [-0.42, 0.0, 0.42]) {
      for (const wz of [-0.38, 0.38]) {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.08, 18), wheelMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(wx, 0.11, wz);
        roverRoot.add(wheel);
      }
    }

    // Sensor Mast (Axis 1)
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.42, 12), chrome);
    mast.position.set(0.32, 0.64, 0);
    roverRoot.add(mast);

    // Rotating Stereo Camera & LiDAR Scanner Head
    const scannerHead = new THREE.Group();
    scannerHead.position.set(0.32, 0.85, 0);

    const headBar = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.06, 0.18), darkMetal);
    scannerHead.add(headBar);

    for (const cz of [-0.06, 0.06]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.022, 12, 12), cyanLed);
      eye.position.set(0.07, 0, cz);
      scannerHead.add(eye);
    }
    roverRoot.add(scannerHead);

    bayGroup.add(roverRoot);
    scene.add(bayGroup);

    return {
      mast,
      scannerHead,
    };
  }

  /**
   * SIGNATURE FEATURE 5: Master Research Workstation & Supercomputer
   * Massive curved ultrawide panoramic monitor, secondary displays, floating holographic UI,
   * mechanical keyboard, and liquid-cooled neural supercomputer tower.
   */
  private static createMasterWorkstation(scene: THREE.Scene, x: number, z: number) {
    const wsGroup = new THREE.Group();
    wsGroup.position.set(x, 0, z);
    wsGroup.rotation.y = -Math.PI * 0.72; // Angles toward arena center

    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.3, metalness: 0.9 });
    const chrome = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.15, metalness: 0.95 });
    const cyanLed = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const violetLed = new THREE.MeshBasicMaterial({ color: 0xa855f7 });

    // 1. Curved Carbon-Fiber Research Desk (2.2m x 0.95m, height 0.85m)
    const desk = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 0.95), darkMetal);
    desk.position.set(0, 0.80, 0);
    wsGroup.add(desk);

    const deskGlow = new THREE.Mesh(new THREE.BoxGeometry(2.24, 0.02, 0.99), cyanLed);
    deskGlow.position.set(0, 0.77, 0);
    wsGroup.add(deskGlow);

    for (const lx of [-0.98, 0.98]) {
      for (const lz of [-0.38, 0.38]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.76, 0.08), darkMetal);
        leg.position.set(lx, 0.38, lz);
        wsGroup.add(leg);
      }
    }

    // 2. Massive Curved Ultrawide Display (Radius curved cylinder segment)
    const curvedScreenGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.65, 32, 1, true, -0.38, 0.76);
    const curvedScreenTex = this.createCurvedScreenTexture();
    const curvedScreenMat = new THREE.MeshBasicMaterial({
      map: curvedScreenTex,
      side: THREE.DoubleSide,
    });
    const curvedScreen = new THREE.Mesh(curvedScreenGeo, curvedScreenMat);
    curvedScreen.position.set(0, 1.25, -0.25);
    wsGroup.add(curvedScreen);

    // Monitor Stand
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.45, 12), chrome);
    stand.position.set(0, 1.025, -0.25);
    wsGroup.add(stand);

    // Dual Angled Secondary Displays
    for (const sx of [-0.92, 0.92]) {
      const auxStand = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.35, 8), chrome);
      auxStand.position.set(sx, 1.00, -0.22);
      wsGroup.add(auxStand);

      const auxScr = new THREE.Mesh(
        new THREE.BoxGeometry(0.42, 0.58, 0.02),
        new THREE.MeshBasicMaterial({ color: sx < 0 ? 0x38bdf8 : 0xa855f7 })
      );
      auxScr.position.set(sx, 1.25, -0.20);
      auxScr.rotation.y = sx < 0 ? 0.32 : -0.32;
      wsGroup.add(auxScr);
    }

    // 3. Floating Holographic UI Panels (Semi-transparent glowing planes)
    const holoPlaneMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const holo1 = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.25), holoPlaneMat);
    holo1.position.set(-0.45, 1.08, 0.15);
    holo1.rotation.x = -0.35;
    wsGroup.add(holo1);

    const holo2 = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.25), holoPlaneMat);
    holo2.position.set(0.45, 1.08, 0.15);
    holo2.rotation.x = -0.35;
    wsGroup.add(holo2);

    // 4. Mechanical Keyboard with Illuminated Keycaps
    const kbBase = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.02, 0.16), darkMetal);
    kbBase.position.set(0, 0.85, 0.18);
    wsGroup.add(kbBase);

    const kbGlow = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.015, 0.14), cyanLed);
    kbGlow.position.set(0, 0.865, 0.18);
    wsGroup.add(kbGlow);

    // 5. Neural Supercomputer Tower (Liquid cooling tubes & glowing GPUs)
    const pcTower = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.65, 0.58), darkMetal);
    pcTower.position.set(-0.95, 0.35, 0.05);
    wsGroup.add(pcTower);

    const supercomputerLed = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.58, 0.50), cyanLed);
    supercomputerLed.position.set(-0.76, 0.35, 0.05);
    wsGroup.add(supercomputerLed);

    // 6. Futuristic Ergonomic Pilot Chair
    const chairBase = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.08, 16), chrome);
    chairBase.position.set(0, 0.12, 0.72);
    wsGroup.add(chairBase);

    const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.10, 0.52), darkMetal);
    chairSeat.position.set(0, 0.48, 0.72);
    wsGroup.add(chairSeat);

    const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.75, 0.08), darkMetal);
    chairBack.position.set(0, 0.88, 0.94);
    chairBack.rotation.x = -0.10;
    wsGroup.add(chairBack);

    scene.add(wsGroup);

    return {
      curvedScreen,
      supercomputerLed,
    };
  }

  /**
   * SIGNATURE FEATURE 6: Wall-Mounted Panoramic Telemetry Displays
   */
  private static createWallTelemetryDisplays(scene: THREE.Scene): THREE.Mesh[] {
    const screens: THREE.Mesh[] = [];

    // Screen 1 (North Wall Left at x = -4.8m, y = 3.4m, z = -7.15m): Neural Dynamics Graph
    const neuralTex = this.createWallScreenTexture("neural");
    const scr1 = new THREE.Mesh(
      new THREE.PlaneGeometry(3.6, 1.8),
      new THREE.MeshBasicMaterial({ map: neuralTex, side: THREE.DoubleSide })
    );
    scr1.position.set(-4.8, 3.4, -7.15);
    scene.add(scr1);
    screens.push(scr1);

    // Bezel border
    const bezelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.9 });
    const bezel1 = new THREE.Mesh(new THREE.BoxGeometry(3.7, 1.9, 0.04), bezelMat);
    bezel1.position.set(-4.8, 3.4, -7.18);
    scene.add(bezel1);

    // Screen 2 (North Wall Right at x = 4.8m, y = 3.4m, z = -7.15m): Receding Horizon Fan
    const trajTex = this.createWallScreenTexture("trajectories");
    const scr2 = new THREE.Mesh(
      new THREE.PlaneGeometry(3.6, 1.8),
      new THREE.MeshBasicMaterial({ map: trajTex, side: THREE.DoubleSide })
    );
    scr2.position.set(4.8, 3.4, -7.15);
    scene.add(scr2);
    screens.push(scr2);

    const bezel2 = new THREE.Mesh(new THREE.BoxGeometry(3.7, 1.9, 0.04), bezelMat);
    bezel2.position.set(4.8, 3.4, -7.18);
    scene.add(bezel2);

    return screens;
  }

  public static createWallScreenTexture(type: "neural" | "trajectories"): THREE.CanvasTexture {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);

    ctx.fillStyle = "#050a14";
    ctx.fillRect(0, 0, 1024, 512);

    // Grid lines
    ctx.strokeStyle = "rgba(14, 165, 233, 0.12)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= 1024; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }
    for (let y = 0; y <= 512; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    // Outer cyber border
    ctx.strokeStyle = type === "neural" ? "#00f0ff" : "#a855f7";
    ctx.lineWidth = 4;
    ctx.strokeRect(8, 8, 1008, 496);

    // Header bar
    ctx.fillStyle = type === "neural" ? "rgba(0, 240, 255, 0.20)" : "rgba(168, 85, 247, 0.20)";
    ctx.fillRect(8, 8, 1008, 48);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px 'Courier New', monospace";
    ctx.textAlign = "left";
    ctx.fillText(
      type === "neural"
        ? "▶ NEURAL DYNAMICS TELEMETRY // RESIDUAL MLP (288,884 PARAMS)"
        : "▶ RECEDING HORIZON MPC // VECTORIZED TRAJECTORIES (N=300, H=14)",
      24,
      40
    );

    if (type === "neural") {
      // Draw loss curve graph
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 90, 520, 360);

      // Graph grid lines
      ctx.strokeStyle = "rgba(56, 189, 248, 0.20)";
      for (let gy = 150; gy < 450; gy += 60) {
        ctx.beginPath();
        ctx.moveTo(40, gy);
        ctx.lineTo(560, gy);
        ctx.stroke();
      }

      // Smooth decaying loss curve
      ctx.strokeStyle = "#00ff9d";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(50, 420);
      for (let i = 0; i <= 50; i++) {
        const lx = 50 + i * 10;
        const ly = 120 + 290 * Math.exp(-i / 12.0) + Math.sin(i * 0.8) * 6;
        ctx.lineTo(lx, ly);
      }
      ctx.stroke();

      ctx.fillStyle = "#00ff9d";
      ctx.font = "14px 'Courier New', monospace";
      ctx.fillText("VALIDATION MAE: 0.0058 m (CONVERGED)", 60, 120);

      // Right Stats Panel
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 16px 'Courier New', monospace";
      ctx.fillText("NETWORK SPECIFICATION:", 600, 110);
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "14px 'Courier New', monospace";
      const stats = [
        "ARCH: 3x Residual Blocks with Skip",
        "STATE DIM: 10-D Normalized Vector",
        "ACTION SPACE: Discrete [Up, Down, L, R]",
        "INFERENCE LATENCY: 4.2 ms / tick",
        "DEVICE: NVIDIA RTX 5070 Laptop GPU",
        "PRECISION: FP32 Tensor Cores",
        "UNCERTAINTY: Epistemic Deep Ensemble",
        "STATUS: ONLINE (NOMINAL 60 FPS)",
      ];
      stats.forEach((st, idx) => {
        ctx.fillText(`• ${st}`, 600, 145 + idx * 32);
      });
    } else {
      // Draw Trajectory Fan Radar
      const rcx = 280;
      const rcy = 270;
      ctx.strokeStyle = "rgba(168, 85, 247, 0.35)";
      ctx.lineWidth = 1.5;
      for (let r = 40; r <= 180; r += 45) {
        ctx.beginPath();
        ctx.arc(rcx, rcy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Candidate Rollout paths fan
      for (let a = -1.2; a <= 1.2; a += 0.15) {
        ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(rcx, rcy);
        const endX = rcx + Math.sin(a) * 160 + (Math.random() - 0.5) * 20;
        const endY = rcy - Math.cos(a) * 160;
        ctx.quadraticCurveTo(rcx + Math.sin(a) * 80, rcy - 90, endX, endY);
        ctx.stroke();
      }

      // Best path in glowing emerald
      ctx.strokeStyle = "#00ff9d";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(rcx, rcy);
      ctx.quadraticCurveTo(rcx + 20, rcy - 90, rcx + 40, rcy - 165);
      ctx.stroke();

      ctx.fillStyle = "#00ff9d";
      ctx.font = "bold 15px 'Courier New', monospace";
      ctx.fillText("SELECTED OPTIMAL PATH (J* = +142.8)", 60, 480);

      // Right Side Stats
      ctx.fillStyle = "#c084fc";
      ctx.font = "bold 16px 'Courier New', monospace";
      ctx.fillText("PLANNING HORIZON DYNAMICS:", 580, 110);
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "14px 'Courier New', monospace";
      const mpcStats = [
        "CANDIDATES: 300 Trajectories / Step",
        "HORIZON: H = 14 Forward Steps",
        "DISCOUNT: Gamma = 0.95",
        "OPTIMAL ACTION: a_0* Dispatched",
        "COLLISION PENALTY: Cost = -100.0",
        "UNCERTAINTY PENALTY: Beta = 0.5",
        "PROGRESS REWARD: +10.0 to Goal",
        "SOLVER: Batched Vectorized PyTorch",
      ];
      mpcStats.forEach((st, idx) => {
        ctx.fillText(`▶ ${st}`, 580, 145 + idx * 32);
      });
    }

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }

  public static createCurvedScreenTexture(): THREE.CanvasTexture {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 384;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);

    ctx.fillStyle = "#030712";
    ctx.fillRect(0, 0, 1024, 384);

    // Left pane: Python Terminal Log
    ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 490, 364);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 14px 'Courier New', monospace";
    ctx.fillText("MISSION_CONTROL_TERMINAL // PYTHON 3.14", 25, 34);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px 'Courier New', monospace";
    const logs = [
      "[SYS] WorldModel runtime initialized on CUDA device:0",
      "[MPC] Loaded weights: models/robot_student.pt (288,884 params)",
      "[ENV] RobotEnv scenario=1 seed=1001 arena=13.85x9.23m",
      "[PLAN] Step 38: 300 rollouts evaluated in 4.18 ms",
      "[ACT] Action 3 (RIGHT) dispatched to AMR chassis",
      "[PRED] Predicted pos (370, 464) | Actual (370, 464)",
      "[MAE] 1-Step state MAE = 0.0016 m (Precision OK)",
      "[STATUS] Trajectory nominal, 0 collisions, goal dist: 4.8m",
    ];
    logs.forEach((log, i) => {
      ctx.fillText(log, 25, 65 + i * 22);
    });

    // Right pane: 3D LiDAR & Kinematics Gauge
    ctx.strokeStyle = "rgba(168, 85, 247, 0.4)";
    ctx.lineWidth = 2;
    ctx.strokeRect(515, 10, 495, 364);

    ctx.fillStyle = "#c084fc";
    ctx.font = "bold 14px 'Courier New', monospace";
    ctx.fillText("KINEMATICS & SENSORY TELEMETRY", 530, 34);

    // Speedometer arc
    ctx.strokeStyle = "rgba(0, 255, 157, 0.7)";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(660, 140, 55, Math.PI * 0.8, Math.PI * 1.8);
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.fillText("0.85", 660, 140);
    ctx.font = "11px 'Courier New', monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("M / S", 660, 160);

    // Multi-horizon prediction bar chart
    ctx.textAlign = "left";
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 12px 'Courier New', monospace";
    ctx.fillText("HORIZON DRIFT ERROR (m):", 530, 230);

    const horizons = [
      { h: "H=1", err: 0.03, col: "#00ff9d" },
      { h: "H=3", err: 0.07, col: "#38bdf8" },
      { h: "H=5", err: 0.12, col: "#00f0ff" },
      { h: "H=10", err: 0.20, col: "#a855f7" },
      { h: "H=14", err: 0.26, col: "#f59e0b" },
    ];
    horizons.forEach((item, idx) => {
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "11px 'Courier New', monospace";
      ctx.fillText(item.h, 530, 260 + idx * 22);

      ctx.fillStyle = item.col;
      const barW = item.err * 600;
      ctx.fillRect(575, 250 + idx * 22, barW, 12);

      ctx.fillStyle = "#94a3b8";
      ctx.fillText(`${item.err}m`, 585 + barW, 260 + idx * 22);
    });

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }

  public static createOscilloscopeTexture(): THREE.CanvasTexture {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);

    ctx.fillStyle = "#022c22";
    ctx.fillRect(0, 0, 256, 128);

    // Grid
    ctx.strokeStyle = "rgba(16, 185, 129, 0.25)";
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

    // Sine waveform
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let x = 0; x < 256; x++) {
      const y = 64 + Math.sin(x * 0.08) * 36 + Math.sin(x * 0.2) * 8;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.fillStyle = "#34d399";
    ctx.font = "bold 10px monospace";
    ctx.fillText("CH1: 2.50V  100kHz", 10, 18);

    return new THREE.CanvasTexture(canvas);
  }

  /**
   * Biophilic Hydroponic Plant Columns (Clean sci-fi greenery)
   */
  private static createBiophilicColumns(scene: THREE.Scene) {
    const glassMat = new THREE.MeshPhysicalMaterial({ transmission: 0.9, roughness: 0.1, thickness: 0.2 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.4 });
    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });

    for (const [px, pz] of [[-10.4, 5.2], [-10.4, -5.2]]) {
      const colGroup = new THREE.Group();
      colGroup.position.set(px, 0, pz);

      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.45, 0.35, 24), darkMetal);
      base.position.y = 0.175;
      colGroup.add(base);

      const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 3.2, 24, 1, true), glassMat);
      tube.position.y = 1.95;
      colGroup.add(tube);

      // Spiral foliage inside column
      for (let i = 0; i < 18; i++) {
        const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), leafMat);
        const y = 0.5 + i * 0.14;
        const angle = i * 0.7;
        leaf.position.set(Math.cos(angle) * 0.18, y, Math.sin(angle) * 0.18);
        colGroup.add(leaf);
      }

      scene.add(colGroup);
    }
  }

  /**
   * Glass Display Cabinets Containing Quantum Chips & Robotics Actuators
   */
  private static createGlassDisplayCabinets(
    scene: THREE.Scene,
    titaniumMat: THREE.Material,
    glassMat: THREE.Material
  ) {
    for (const [cx, cz] of [[10.4, -2.5], [10.4, 2.5]]) {
      const cab = new THREE.Group();
      cab.position.set(cx, 0, cz);

      const base = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.65, 1.2), titaniumMat);
      base.position.y = 0.325;
      cab.add(base);

      const glass = new THREE.Mesh(new THREE.BoxGeometry(0.70, 1.4, 1.15), glassMat);
      glass.position.y = 1.35;
      cab.add(glass);

      // Glowing component pedestal inside
      const ped = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 0.4, 16),
        new THREE.MeshBasicMaterial({ color: 0x00f0ff })
      );
      ped.position.y = 0.85;
      cab.add(ped);

      scene.add(cab);
    }
  }

  /**
   * Recessed Ceiling Spotlight Pods
   */
  private static createRecessedCeilingLights(scene: THREE.Scene, lights: THREE.PointLight[]) {
    const lightCoords: [number, number, number][] = [
      [-7.0, -3.8, 0x00f0ff],
      [0.0, -6.8, 0x00f0ff],
      [7.0, -3.8, 0xa855f7],
      [-5.0, 2.0, 0x38bdf8],
      [5.0, 2.0, 0x00f0ff],
    ];

    for (const [lx, lz, col] of lightCoords) {
      const light = new THREE.PointLight(col, 1.8, 7.5, 1.6);
      light.position.set(lx, 6.2, lz);
      scene.add(light);
      lights.push(light);

      // Emissive fixture lens
      const lens = new THREE.Mesh(
        new THREE.CircleGeometry(0.25, 16),
        new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide })
      );
      lens.rotation.x = Math.PI / 2;
      lens.position.set(lx, 6.38, lz);
      scene.add(lens);
    }
  }

  // =========================================================================
  // HIGH-TECH LABORATORY OBSTACLES (Conforms to existing simulation signatures)
  // =========================================================================

  /**
   * High-Tech Holographic Assembly Workstation (Replaces generic workstation)
   */
  public static createWorkstationObstacle(w: number, h: number, d: number): THREE.Group {
    const group = new THREE.Group();
    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.25, metalness: 0.9 });
    const cyanLed = new THREE.MeshBasicMaterial({ color: 0x00f0ff });

    const bench = new THREE.Mesh(new THREE.BoxGeometry(w, h * 0.12, d), darkMetal);
    bench.position.y = h * 0.88;
    bench.castShadow = true;
    bench.receiveShadow = true;
    group.add(bench);

    const trim = new THREE.Mesh(new THREE.BoxGeometry(w * 1.02, 0.02, d * 1.02), cyanLed);
    trim.position.y = h * 0.82;
    group.add(trim);

    // Legs
    for (const lx of [-w / 2 + 0.06, w / 2 - 0.06]) {
      for (const lz of [-d / 2 + 0.06, d / 2 - 0.06]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, h * 0.88, 0.08), darkMetal);
        leg.position.set(lx, (h * 0.88) / 2, lz);
        leg.castShadow = true;
        group.add(leg);
      }
    }

    // Holographic Schematic floating above
    const holo = new THREE.Mesh(
      new THREE.PlaneGeometry(w * 0.65, 0.28),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.45, side: THREE.DoubleSide })
    );
    holo.position.set(0, h + 0.15, 0);
    holo.rotation.x = -0.3;
    group.add(holo);

    return group;
  }

  /**
   * Quantum Composite Containment Pod (Replaces wooden crate)
   */
  public static createRealisticCrate(w: number, h: number, d: number): THREE.Group {
    const group = new THREE.Group();
    const podMat = new THREE.MeshStandardMaterial({ color: 0x0b1324, roughness: 0.35, metalness: 0.85 });
    const cyanLed = new THREE.MeshBasicMaterial({ color: 0x00f0ff });

    const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), podMat);
    body.position.y = h / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Glowing status light strips
    const stripe1 = new THREE.Mesh(new THREE.BoxGeometry(w * 1.01, 0.03, 0.04), cyanLed);
    stripe1.position.set(0, h * 0.70, d / 2);
    group.add(stripe1);

    const stripe2 = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, d * 1.01), cyanLed);
    stripe2.position.set(w / 2, h * 0.70, 0);
    group.add(stripe2);

    return group;
  }

  /**
   * Cryogenic Server / Electronics Rack (Replaces metal tool cabinet)
   */
  public static createToolCabinet(w: number, h: number, d: number): THREE.Group {
    const group = new THREE.Group();
    const rackMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.25, metalness: 0.95 });
    const violetLed = new THREE.MeshBasicMaterial({ color: 0xa855f7 });
    const cyanLed = new THREE.MeshBasicMaterial({ color: 0x00f0ff });

    const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), rackMat);
    body.position.y = h / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Glowing Server Blades
    for (let i = 0; i < 5; i++) {
      const sy = 0.2 + i * (h / 6);
      const blade = new THREE.Mesh(new THREE.BoxGeometry(w * 0.75, 0.02, 0.03), i % 2 === 0 ? cyanLed : violetLed);
      blade.position.set(0, sy, d / 2 + 0.01);
      group.add(blade);
    }

    return group;
  }

  /**
   * Magnetic Plasma Power Cell Cluster (Replaces 55-gal oil barrels)
   */
  public static createBarrelCluster(w: number = 0.85, h: number = 0.95, d: number = 0.85): THREE.Group {
    const group = new THREE.Group();
    const cellMat = new THREE.MeshStandardMaterial({ color: 0x0a1120, roughness: 0.2, metalness: 0.9 });
    const cyanLed = new THREE.MeshBasicMaterial({ color: 0x00f0ff });

    const barrelPositions: [number, number][] = [
      [-w * 0.24, -d * 0.24],
      [w * 0.24, -d * 0.24],
      [0.0, d * 0.24],
    ];

    const r = Math.min(w, d) * 0.22;
    for (const [bx, bz] of barrelPositions) {
      const canister = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 20), cellMat);
      canister.position.set(bx, h / 2, bz);
      canister.castShadow = true;
      group.add(canister);

      // Glowing magnetic containment rings
      for (const ry of [h * 0.3, h * 0.7]) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(r * 1.03, 0.015, 8, 24), cyanLed);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(bx, ry, bz);
        group.add(ring);
      }
    }

    return group;
  }

  /**
   * Laser-Guided Containment Barrier (Replaces yellow safety barrier)
   */
  public static createSafetyBarrier(w: number = 1.1, h: number = 0.85, d: number = 0.45): THREE.Group {
    const group = new THREE.Group();
    const stanchionMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.9 });
    const cyanLaser = new THREE.MeshBasicMaterial({ color: 0x00f0ff });

    for (const sx of [-w / 2, w / 2]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.065, h, 16), stanchionMat);
      post.position.set(sx, h / 2, 0);
      post.castShadow = true;
      group.add(post);

      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), cyanLaser);
      cap.position.set(sx, h, 0);
      group.add(cap);
    }

    // Dual Glowing Laser Energy Rails
    for (const ly of [h * 0.4, h * 0.8]) {
      const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, w, 8), cyanLaser);
      rail.rotation.z = Math.PI / 2;
      rail.position.set(0, ly, 0);
      group.add(rail);
    }

    return group;
  }

  /**
   * Lead AI Robotics Researcher (Scenario 2 Pedestrian)
   * High-tech laboratory cybernetic coat/suit with visor HUD.
   */
  public static createRealisticTechnician(): { root: THREE.Group; head: THREE.Group } {
    const root = new THREE.Group();
    const suitMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });
    const whiteCoat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.3 });
    const visorMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });

    // Legs
    for (const lx of [-0.09, 0.09]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.85, 12), suitMat);
      leg.position.set(lx, 0.425, 0);
      root.add(leg);
    }

    // Torso with Sci-Fi Research Coat
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.60, 0.22), whiteCoat);
    torso.position.y = 1.15;
    root.add(torso);

    // Head with Glowing Cybernetic Visor HUD
    const head = new THREE.Group();
    head.position.y = 1.58;

    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), suitMat);
    head.add(skull);

    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.05, 0.08), visorMat);
    visor.position.set(0, 0.02, 0.10);
    head.add(visor);

    root.add(head);

    return { root, head };
  }
}

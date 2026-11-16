/**
 * Photorealistic Industrial Warehouse & Gigafactory Robotics Test Arena (v7.0-heavy).
 * Procedural PBR architecture, 2x expanded facility (255.2 m²), overhead bridge crane,
 * elevated mezzanine catwalk with glass-enclosed robotics observation control booth,
 * 6-axis articulated industrial robotic arm cell, motorized roller conveyor line,
 * high-voltage electrical substation bank, 55-gal barrel clusters, and safety crash barriers.
 */

import * as THREE from "three";

export class LabEnvironmentBuilder {
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

    // Shared Materials
    const outerFloorMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.88,
      metalness: 0.15,
    });
    const lowerWallMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.75,
      metalness: 0.20,
    });
    const upperWallMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.65,
      metalness: 0.30,
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

    const wallHeight = 6.8;

    // 0. Massive Extended Foundation Floor (48m x 36m hall floor)
    const outerFloorGeo = new THREE.PlaneGeometry(48.0, 36.0);
    const outerFloor = new THREE.Mesh(outerFloorGeo, outerFloorMat);
    outerFloor.rotation.x = -Math.PI / 2;
    outerFloor.position.set(0, -0.005, 0);
    outerFloor.receiveShadow = true;
    scene.add(outerFloor);

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
    const backLower = new THREE.Mesh(new THREE.BoxGeometry(24.0, 1.4, 0.22), lowerWallMat);
    backLower.position.set(0, 0.7, -7.3);
    backLower.receiveShadow = true;
    scene.add(backLower);

    const backUpper = new THREE.Mesh(new THREE.BoxGeometry(24.0, wallHeight - 1.4, 0.22), upperWallMat);
    backUpper.position.set(0, 1.4 + (wallHeight - 1.4) / 2, -7.3);
    backUpper.receiveShadow = true;
    scene.add(backUpper);

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
    const leftLower = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.4, 16.0), lowerWallMat);
    leftLower.position.set(-10.8, 0.7, 0);
    leftLower.receiveShadow = true;
    scene.add(leftLower);

    const leftUpper = new THREE.Mesh(new THREE.BoxGeometry(0.22, wallHeight - 1.4, 16.0), upperWallMat);
    leftUpper.position.set(-10.8, 1.4 + (wallHeight - 1.4) / 2, 0);
    leftUpper.receiveShadow = true;
    scene.add(leftUpper);

    // 4. East Wall (Right - 16.0m depth at x = 10.8m)
    const rightLower = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.4, 16.0), lowerWallMat);
    rightLower.position.set(10.8, 0.7, 0);
    rightLower.receiveShadow = true;
    scene.add(rightLower);

    const rightUpper = new THREE.Mesh(new THREE.BoxGeometry(0.22, wallHeight - 1.4, 16.0), upperWallMat);
    rightUpper.position.set(10.8, 1.4 + (wallHeight - 1.4) / 2, 0);
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
      col.castShadow = true;
      col.receiveShadow = true;
      scene.add(col);

      const guard = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.95, 16), yellowGuardMat);
      guard.position.set(cx, 0.475, cz);
      guard.castShadow = true;
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

      const pl = new THREE.PointLight(0xfff7e6, 1.25, 18.0, 1.2);
      pl.position.set(lx, wallHeight - 0.82, lz);
      pl.castShadow = false;
      scene.add(pl);
      lights.push(pl);
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
      girder.castShadow = true;
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
    trolley.castShadow = true;
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
    hookBlock.castShadow = true;
    craneGroup.add(hookBlock);

    const hookCurve = new THREE.Mesh(
      new THREE.TorusGeometry(0.16, 0.045, 12, 24, Math.PI * 1.3),
      steelMat
    );
    hookCurve.rotation.z = Math.PI * 0.85;
    hookCurve.position.set(trolleyX, 3.75, craneBridgeZ);
    hookCurve.castShadow = true;
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
      pillar.castShadow = true;
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
    baseCyl.castShadow = true;
    cellGroup.add(baseCyl);

    // Axis 2: Lower Arm Shoulder & Boom (Angled forward)
    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), steelMat);
    shoulder.position.y = 0.82;
    shoulder.castShadow = true;
    cellGroup.add(shoulder);

    const lowerArm = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.95, 0.22), orangeMat);
    lowerArm.position.set(0.18, 1.25, -0.15);
    lowerArm.rotation.x = -0.35;
    lowerArm.rotation.z = 0.25;
    lowerArm.castShadow = true;
    cellGroup.add(lowerArm);

    // Axis 3: Elbow Articulation & Forearm
    const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), steelMat);
    elbow.position.set(0.32, 1.68, -0.32);
    elbow.castShadow = true;
    cellGroup.add(elbow);

    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, 0.85, 16), orangeMat);
    forearm.rotation.z = Math.PI / 3;
    forearm.rotation.y = 0.4;
    forearm.position.set(0.68, 1.55, -0.22);
    forearm.castShadow = true;
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
          tote.castShadow = true;
          convGroup.add(tote);
        } else {
          const box = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.45, 0.55), boxMat);
          box.position.set(c.x, y + 0.04 + 0.225, z);
          box.castShadow = true;
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
    body.castShadow = true;
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

    // Heavy Polyethylene Spill Containment Pallet (Safety Yellow)
    const palletMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.45, metalness: 0.1 });
    const grateMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6, metalness: 0.7 });
    const yellowDrumMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.35, metalness: 0.4 });
    const blueDrumMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.35, metalness: 0.5 });
    const blackDrumMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.40, metalness: 0.7 });

    const pallet = new THREE.Mesh(new THREE.BoxGeometry(w, 0.12, d), palletMat);
    pallet.position.y = 0.06;
    pallet.castShadow = true;
    pallet.receiveShadow = true;
    group.add(pallet);

    const topGrate = new THREE.Mesh(new THREE.BoxGeometry(w - 0.06, 0.02, d - 0.06), grateMat);
    topGrate.position.y = 0.13;
    group.add(topGrate);

    // 3 x 55-Gallon Steel Barrels clustered on the pallet
    const drumR = 0.18;
    const drumH = 0.82;
    const drumConfigs = [
      { x: -0.16, z: -0.16, mat: yellowDrumMat },
      { x: 0.18, z: -0.12, mat: blueDrumMat },
      { x: 0.0, z: 0.18, mat: blackDrumMat },
    ];

    for (const dc of drumConfigs) {
      const drumGroup = new THREE.Group();
      drumGroup.position.set(dc.x, 0.14, dc.z);

      // Main cylinder
      const cyl = new THREE.Mesh(new THREE.CylinderGeometry(drumR, drumR, drumH, 20), dc.mat);
      cyl.position.y = drumH / 2;
      cyl.castShadow = true;
      cyl.receiveShadow = true;
      drumGroup.add(cyl);

      // Reinforcing chime ribs (2 swaged rings)
      const ribMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35, metalness: 0.8 });
      for (const ry of [drumH * 0.35, drumH * 0.68]) {
        const rib = new THREE.Mesh(new THREE.TorusGeometry(drumR + 0.008, 0.012, 8, 20), ribMat);
        rib.rotation.x = Math.PI / 2;
        rib.position.y = ry;
        drumGroup.add(rib);
      }

      // Top Bung Plug
      const bung = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.02, 10), ribMat);
      bung.position.set(0.08, drumH + 0.01, 0);
      drumGroup.add(bung);

      group.add(drumGroup);
    }

    return group;
  }

  /**
   * 7. Authored Heavy Industrial Safety Crash Barrier:
   * Heavy yellow steel pipe railing with black hazard slashes and bolt-down baseplates (tool-barrier).
   */
  public static createSafetyBarrier(w: number = 1.1, h: number = 0.85, d: number = 0.45): THREE.Group {
    const group = new THREE.Group();

    const yellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.35, metalness: 0.3 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.85 });

    // 2 Vertical Upright Posts
    const postR = 0.045;
    const postH = h;
    for (const sx of [-w / 2 + 0.1, w / 2 - 0.1]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(postR, postR, postH, 16), yellowMat);
      post.position.set(sx, postH / 2, 0);
      post.castShadow = true;
      group.add(post);

      // Heavy Floor Base Plate
      const basePlate = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.025, 0.24), steelMat);
      basePlate.position.set(sx, 0.0125, 0);
      basePlate.receiveShadow = true;
      group.add(basePlate);
    }

    // Top and Bottom Horizontal Heavy Rails
    for (const ry of [h - 0.08, h * 0.45]) {
      const rail = new THREE.Mesh(new THREE.CylinderGeometry(postR * 0.9, postR * 0.9, w, 16), yellowMat);
      rail.rotation.z = Math.PI / 2;
      rail.position.set(0, ry, 0);
      rail.castShadow = true;
      group.add(rail);

      // Reflective black hazard band around center of rail
      const band = new THREE.Mesh(new THREE.CylinderGeometry(postR * 0.92, postR * 0.92, w * 0.25, 16), steelMat);
      band.rotation.z = Math.PI / 2;
      band.position.set(0, ry, 0);
      group.add(band);
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
      pot.castShadow = true;
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
        leaf.castShadow = true;
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
    post.castShadow = true;
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
      post.castShadow = true;
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
      b1.castShadow = true;
      rackGroup.add(b1);

      const blueBinMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4, metalness: 0.2 });
      const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.40, 0.55), blueBinMat);
      b2.position.set(0.35, tierY + 0.33, 0);
      b2.castShadow = true;
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
   * Heavy industrial robotics test workstation desk.
   */
  public static createWorkstationObstacle(w: number, h: number, d: number): THREE.Group {
    const group = new THREE.Group();
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.45, metalness: 0.75 });
    const topWoodMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.55, metalness: 0.05 });
    const yellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.35 });
    const footMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.85 });

    const topThickness = 0.06;
    const top = new THREE.Mesh(new THREE.BoxGeometry(w, topThickness, d), topWoodMat);
    top.position.y = h - topThickness / 2;
    top.castShadow = true;
    top.receiveShadow = true;
    group.add(top);

    const hazardTrim = new THREE.Mesh(new THREE.BoxGeometry(w, 0.025, 0.015), yellowMat);
    hazardTrim.position.set(0, h - topThickness / 2, d / 2 + 0.008);
    group.add(hazardTrim);

    const legW = 0.05;
    const legH = h - topThickness;
    const footH = 0.02;

    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const lx = sx * (w / 2 - legW / 2);
        const lz = sz * (d / 2 - legW / 2);

        const leg = new THREE.Mesh(new THREE.BoxGeometry(legW, legH, legW), steelMat);
        leg.position.set(lx, legH / 2, lz);
        leg.castShadow = true;
        group.add(leg);

        const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.045, footH, 12), footMat);
        foot.position.set(lx, footH / 2, lz);
        group.add(foot);
      }
    }

    const shelfY = h * 0.32;
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(w - legW * 1.5, 0.03, d - legW * 1.5), steelMat);
    shelf.position.y = shelfY;
    shelf.castShadow = true;
    group.add(shelf);

    const boxMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4, metalness: 0.3 });
    const instBox = new THREE.Mesh(new THREE.BoxGeometry(w * 0.5, 0.14, d * 0.6), boxMat);
    instBox.position.set(0, shelfY + 0.085, 0);
    instBox.castShadow = true;
    group.add(instBox);

    return group;
  }

  /**
   * Heavy industrial wooden cargo shipping crate.
   */
  public static createRealisticCrate(w: number, h: number, d: number): THREE.Group {
    const group = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x9a7b56, roughness: 0.78, metalness: 0.05 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.8 });

    const core = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), woodMat);
    core.position.y = h / 2;
    core.castShadow = true;
    core.receiveShadow = true;
    group.add(core);

    const cornerSize = Math.min(w, h, d) * 0.18;
    for (const sx of [-1, 1]) {
      for (const sy of [0, 1]) {
        for (const sz of [-1, 1]) {
          const corner = new THREE.Mesh(
            new THREE.BoxGeometry(cornerSize, cornerSize * 0.8, cornerSize),
            metalMat
          );
          corner.position.set(
            sx * (w / 2 - cornerSize / 2),
            sy * (h - cornerSize * 0.8 / 2) + (1 - sy) * (cornerSize * 0.8 / 2),
            sz * (d / 2 - cornerSize / 2)
          );
          group.add(corner);
        }
      }
    }

    const strapMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.9 });
    for (const strapY of [h * 0.3, h * 0.7]) {
      const strap = new THREE.Mesh(new THREE.BoxGeometry(w + 0.01, 0.03, d + 0.01), strapMat);
      strap.position.y = strapY;
      group.add(strap);
    }

    return group;
  }

  /**
   * Heavy industrial steel tool cabinet.
   */
  public static createToolCabinet(w: number, h: number, d: number): THREE.Group {
    const group = new THREE.Group();
    const cabinetMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.35, metalness: 0.6 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2, metalness: 0.95 });
    const topRubberMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });

    const body = new THREE.Mesh(new THREE.BoxGeometry(w, h - 0.06, d), cabinetMat);
    body.position.y = (h - 0.06) / 2 + 0.06;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    const top = new THREE.Mesh(new THREE.BoxGeometry(w + 0.02, 0.03, d + 0.02), topRubberMat);
    top.position.y = h;
    group.add(top);

    const nDrawers = 4;
    const drawerSpacing = (h - 0.15) / nDrawers;
    for (let i = 0; i < nDrawers; i++) {
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, w * 0.65, 8), chromeMat);
      handle.rotation.z = Math.PI / 2;
      handle.position.set(0, 0.14 + i * drawerSpacing, d / 2 + 0.02);
      group.add(handle);
    }

    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.5 });
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.03, 12), wheelMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(sx * (w / 2 - 0.06), 0.04, sz * (d / 2 - 0.06));
        group.add(wheel);
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

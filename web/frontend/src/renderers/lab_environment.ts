/**
 * Photorealistic Industrial Warehouse & Robotics Test Facility (v6.2-ultra).
 * Procedural PBR architecture, high-bay lighting, safety bollards, pallet racks,
 * wooden cargo crates, industrial tool cabinets, and authentic warehouse markings.
 */

import * as THREE from "three";

export class LabEnvironmentBuilder {
  /**
   * Generates a 1024x1024 PBR industrial concrete floor texture with
   * aggregate noise, expansion joint seams, OSHA hazard chevron borders,
   * center alignment calibration target, staging bay lines, tire scuffs,
   * and high-contrast directional floor stencils.
   */
  public static createFloorCanvasTexture(): THREE.CanvasTexture {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // 1. Concrete Base Tone with realistic industrial aggregate mottling
    const grad = ctx.createRadialGradient(512, 512, 80, 512, 512, 650);
    grad.addColorStop(0, "#cbd5e1");   // Center clean polished concrete
    grad.addColorStop(0.5, "#b0bec5"); // Mid-tone sealed concrete
    grad.addColorStop(1, "#94a3b8");   // Perimeter industrial concrete
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Fine concrete aggregate noise & subtle surface flecks
    const imgData = ctx.getImageData(0, 0, 1024, 1024);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const n = (Math.random() - 0.5) * 16;
      data[i] = Math.min(255, Math.max(0, data[i] + n));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + n));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + n));
    }
    ctx.putImageData(imgData, 0, 0);

    // 2. 1m x 1m Expansion Joint Grooves (Saw-cut control joints with dark sealant)
    ctx.strokeStyle = "rgba(51, 65, 85, 0.45)";
    ctx.lineWidth = 2.5;
    for (let x = 0; x <= 1024; x += 113.7) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1024);
      ctx.stroke();
    }
    for (let y = 0; y <= 1024; y += 170.6) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    // 3. Realistic Rubber Tire / Wheel Scuff Marks near high-traffic paths
    ctx.save();
    ctx.strokeStyle = "rgba(30, 41, 59, 0.12)";
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    // Turning arc from center toward charging dock
    ctx.beginPath();
    ctx.arc(620, 512, 140, Math.PI * 0.8, Math.PI * 1.4);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(420, 480, 100, Math.PI * 0.1, Math.PI * 0.7);
    ctx.stroke();
    // Reversing scuffs near charging dock
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(760, 490);
    ctx.lineTo(840, 490);
    ctx.moveTo(760, 520);
    ctx.lineTo(840, 520);
    ctx.stroke();
    ctx.restore();

    // 4. OSHA Safety Border: 45-degree diagonal Yellow & Black Hazard Stripes
    const borderThickness = 32;
    ctx.save();
    // Top border
    this.drawHazardStripes(ctx, 0, 0, 1024, borderThickness);
    // Bottom border
    this.drawHazardStripes(ctx, 0, 1024 - borderThickness, 1024, borderThickness);
    // Left border
    this.drawHazardStripes(ctx, 0, 0, borderThickness, 1024);
    // Right border
    this.drawHazardStripes(ctx, 1024 - borderThickness, 0, borderThickness, 1024);
    ctx.restore();

    // Inner crisp yellow boundary line
    ctx.strokeStyle = "#facc15";
    ctx.lineWidth = 4;
    ctx.strokeRect(borderThickness + 4, borderThickness + 4, 1024 - (borderThickness + 4) * 2, 1024 - (borderThickness + 4) * 2);

    // Corner alignment brackets
    this.drawCornerBrackets(ctx, borderThickness + 14);

    // 5. Center Registration Target & Millimeter Calibration Crosshairs
    ctx.save();
    ctx.strokeStyle = "rgba(14, 165, 233, 0.75)"; // Cyan calibration ring
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(512, 512, 95, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(14, 165, 233, 0.4)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(512, 512, 145, 0, Math.PI * 2);
    ctx.stroke();

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(512 - 175, 512);
    ctx.lineTo(512 + 175, 512);
    ctx.moveTo(512, 512 - 175);
    ctx.lineTo(512, 512 + 175);
    ctx.stroke();

    // Cardinal direction ticks & labels
    ctx.fillStyle = "rgba(14, 165, 233, 0.85)";
    ctx.font = "bold 14px monospace";
    ctx.textAlign = "center";
    ctx.fillText("N [0°]", 512, 512 - 152);
    ctx.fillText("S [180°]", 512, 512 + 164);
    ctx.fillText("W [-90°]", 512 - 145, 516);
    ctx.fillText("E [+90°]", 512 + 145, 516);
    ctx.font = "11px monospace";
    ctx.fillText("HUMANOID NAV DATUM (0.0, 0.0)", 512, 512 + 24);
    ctx.restore();

    // 6. Staging & Charging Bay Markings (Right side where charging dock resides)
    ctx.save();
    ctx.strokeStyle = "#eab308";
    ctx.lineWidth = 4;
    ctx.setLineDash([14, 8]);
    ctx.strokeRect(730, 340, 240, 340);
    ctx.setLineDash([]);

    // Charging bay diagonal chevron guide arrows
    this.drawFloorArrow(ctx, 770, 512, 70, 0);
    this.drawFloorArrow(ctx, 830, 512, 70, 0);

    ctx.fillStyle = "#ca8a04";
    ctx.font = "bold 15px monospace";
    ctx.textAlign = "left";
    ctx.fillText("[ CHARGING BAY 01 ]", 745, 372);
    ctx.font = "12px monospace";
    ctx.fillText("AMR AUTO-COUPLING STATION", 745, 392);
    ctx.fillText("48V WIRELESS INDUCTION", 745, 410);
    ctx.fillText("KEEP CLEAR OF VEHICLE DOCK", 745, 660);
    ctx.restore();

    // 7. Test Arena Zone Stencils
    ctx.save();
    ctx.fillStyle = "rgba(51, 65, 85, 0.75)";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("ZONE 01 • AUTONOMOUS ROBOTICS TEST CELL", 56, 74);

    ctx.font = "12px monospace";
    ctx.fillText("FACILITY: WM-HQ-TESTBED | SPEED LIMIT: 1.5 M/S | 24V/48V AMR", 56, 94);
    ctx.fillText("SAFETY INTERLOCK ACTIVE • EMERGENCY STOP MONITORED", 56, 980);
    ctx.restore();

    // Additional traffic pathway arrows
    this.drawFloorArrow(ctx, 280, 512, 65, 0);
    this.drawFloorArrow(ctx, 512, 280, 65, -Math.PI / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  /**
   * Roughness map: Polished concrete is glossy (low roughness),
   * painted safety stripes and joint lines are rougher (higher roughness).
   */
  public static createFloorRoughnessTexture(): THREE.CanvasTexture {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Base polished epoxy roughness (~0.28 = #484848)
    ctx.fillStyle = "#484848";
    ctx.fillRect(0, 0, 512, 512);

    // Rougher painted borders (~0.68 = #adadad)
    ctx.fillStyle = "#adadad";
    const b = 16;
    ctx.fillRect(0, 0, 512, b);
    ctx.fillRect(0, 512 - b, 512, b);
    ctx.fillRect(0, 0, b, 512);
    ctx.fillRect(512 - b, 0, b, 512);

    // Charging bay roughness
    ctx.strokeStyle = "#999999";
    ctx.lineWidth = 5;
    ctx.strokeRect(365, 170, 120, 170);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
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

    // Yellow background
    ctx.fillStyle = "#eab308";
    ctx.fillRect(x, y, w, h);

    // Black 45-deg slashes
    ctx.fillStyle = "#1e293b";
    const stripeWidth = 26;
    for (let i = -1024; i < 2048; i += stripeWidth * 2) {
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
    const size = 32;
    const thickness = 4;
    ctx.fillStyle = "#facc15";

    // Top-Left
    ctx.fillRect(offset, offset, size, thickness);
    ctx.fillRect(offset, offset, thickness, size);

    // Top-Right
    ctx.fillRect(1024 - offset - size, offset, size, thickness);
    ctx.fillRect(1024 - offset - thickness, offset, thickness, size);

    // Bottom-Left
    ctx.fillRect(offset, 1024 - offset - thickness, size, thickness);
    ctx.fillRect(offset, 1024 - offset - size, thickness, size);

    // Bottom-Right
    ctx.fillRect(1024 - offset - size, 1024 - offset - thickness, size, thickness);
    ctx.fillRect(1024 - offset - thickness, 1024 - offset - size, thickness, size);
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
    ctx.moveTo(0, -9);
    ctx.lineTo(len - 22, -9);
    ctx.lineTo(len - 22, -20);
    ctx.lineTo(len, 0);
    ctx.lineTo(len - 22, 20);
    ctx.lineTo(len - 22, 9);
    ctx.lineTo(0, 9);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  /**
   * Builds the realistic 3.6m industrial warehouse architecture:
   * Extended warehouse foundation slab, safety bollards at arena corners,
   * corrugated wall panels, structural steel I-beams with crash protectors,
   * ceiling roof trusses, industrial LED luminaires, and background pallet racks.
   */
  public static buildWarehouseArchitecture(scene: THREE.Scene): {
    lights: THREE.PointLight[];
  } {
    const lights: THREE.PointLight[] = [];

    // Materials
    const outerFloorMat = new THREE.MeshStandardMaterial({
      color: 0x182030, // Darker concrete for surrounding warehouse floor
      roughness: 0.85,
      metalness: 0.1,
    });
    const lowerWallMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b, // Dark slate concrete wainscoting kickplate
      roughness: 0.75,
      metalness: 0.15,
    });
    const upperWallMat = new THREE.MeshStandardMaterial({
      color: 0x334155, // Clean dark industrial architectural ribbed panel
      roughness: 0.7,
      metalness: 0.25,
    });
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // Structural steel
      roughness: 0.35,
      metalness: 0.85,
    });
    const yellowGuardMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15, // High-visibility safety yellow
      roughness: 0.35,
      metalness: 0.2,
    });
    const rackOrangeMat = new THREE.MeshStandardMaterial({
      color: 0xea580c, // Heavy-duty rack beam orange
      roughness: 0.45,
      metalness: 0.4,
    });
    const rackBlueMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8, // Rack upright blue
      roughness: 0.4,
      metalness: 0.5,
    });

    const wallHeight = 5.2;

    // 0. Extended Warehouse Foundation Floor (Expansive 32m x 24m training hall floor!)
    const outerFloorGeo = new THREE.PlaneGeometry(32.0, 24.0);
    const outerFloor = new THREE.Mesh(outerFloorGeo, outerFloorMat);
    outerFloor.rotation.x = -Math.PI / 2;
    outerFloor.position.set(0, -0.005, 0);
    outerFloor.receiveShadow = true;
    scene.add(outerFloor);

    // 1. Four Industrial Yellow Safety Bollards at Expanded Arena Corners
    const bollardPositions: [number, number][] = [
      [-6.95, -4.65],
      [6.95, -4.65],
      [-6.95, 4.65],
      [6.95, 4.65],
    ];
    for (const [bx, bz] of bollardPositions) {
      this.createSafetyBollard(scene, bx, bz, yellowGuardMat, steelMat);
    }

    // 2. North Wall (Back - Spacious 15.6m wall span)
    const backLower = new THREE.Mesh(new THREE.BoxGeometry(15.6, 1.2, 0.18), lowerWallMat);
    backLower.position.set(0, 0.6, -4.95);
    backLower.receiveShadow = true;
    scene.add(backLower);

    const backUpper = new THREE.Mesh(new THREE.BoxGeometry(15.6, wallHeight - 1.2, 0.18), upperWallMat);
    backUpper.position.set(0, 1.2 + (wallHeight - 1.2) / 2, -4.95);
    backUpper.receiveShadow = true;
    scene.add(backUpper);

    // Conduit Pipe along North Wall
    const conduitMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.25, metalness: 0.9 });
    const conduit1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 15.2, 12), conduitMat);
    conduit1.rotation.z = Math.PI / 2;
    conduit1.position.set(0, 1.3, -4.85);
    scene.add(conduit1);

    const conduit2 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 15.2, 12), conduitMat);
    conduit2.rotation.z = Math.PI / 2;
    conduit2.position.set(0, 2.7, -4.85);
    scene.add(conduit2);

    // 3. West Wall (Left - 10.4m depth)
    const leftLower = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.2, 10.4), lowerWallMat);
    leftLower.position.set(-7.35, 0.6, 0);
    leftLower.receiveShadow = true;
    scene.add(leftLower);

    const leftUpper = new THREE.Mesh(new THREE.BoxGeometry(0.18, wallHeight - 1.2, 10.4), upperWallMat);
    leftUpper.position.set(-7.35, 1.2 + (wallHeight - 1.2) / 2, 0);
    leftUpper.receiveShadow = true;
    scene.add(leftUpper);

    // 4. East Wall (Right - 10.4m depth)
    const rightLower = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.2, 10.4), lowerWallMat);
    rightLower.position.set(7.35, 0.6, 0);
    rightLower.receiveShadow = true;
    scene.add(rightLower);

    const rightUpper = new THREE.Mesh(new THREE.BoxGeometry(0.18, wallHeight - 1.2, 10.4), upperWallMat);
    rightUpper.position.set(7.35, 1.2 + (wallHeight - 1.2) / 2, 0);
    rightUpper.receiveShadow = true;
    scene.add(rightUpper);

    // South Low Curb (Leaves camera sightline open)
    const southCurb = new THREE.Mesh(new THREE.BoxGeometry(15.6, 0.22, 0.14), lowerWallMat);
    southCurb.position.set(0, 0.11, 4.90);
    scene.add(southCurb);

    // 5. Structural Steel Columns (I-beams) with Yellow Impact Wraps
    const colPositions: [number, number][] = [
      [-7.28, -4.90],
      [-2.4, -4.90],
      [2.4, -4.90],
      [7.28, -4.90],
      [-7.28, 0.0],
      [7.28, 0.0],
    ];

    for (const [cx, cz] of colPositions) {
      // Steel Column
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.24, wallHeight, 0.24), steelMat);
      col.position.set(cx, wallHeight / 2, cz);
      col.castShadow = true;
      col.receiveShadow = true;
      scene.add(col);

      // Yellow impact guard at base
      const guard = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.22, 0.85, 16), yellowGuardMat);
      guard.position.set(cx, 0.425, cz);
      guard.castShadow = true;
      scene.add(guard);
    }

    // 6. Ceiling Roof Trusses (High overhead at y=5.3m, framing North Wall and rafters)
    for (const zTruss of [-4.6, -3.2, -1.8]) {
      const truss = new THREE.Mesh(new THREE.BoxGeometry(15.6, 0.18, 0.18), steelMat);
      truss.position.set(0, wallHeight + 0.1, zTruss);
      scene.add(truss);
    }

    // 7. Suspended Industrial High-Bay Pendant Lights (Mounted high at y=4.5m with clear camera sightlines)
    const lightCoords: [number, number][] = [
      [-4.8, -3.2],
      [0.0, -3.2],
      [4.8, -3.2],
      [-5.2, -0.8],
      [5.2, -0.8],
    ];

    for (const [lx, lz] of lightCoords) {
      // Short Pendant Cord
      const cord = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, 0.45, 8),
        steelMat
      );
      cord.position.set(lx, wallHeight - 0.22, lz);
      scene.add(cord);

      // Bell Reflector Hood
      const hood = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.36, 0.22, 18, 1, true),
        steelMat
      );
      hood.position.set(lx, wallHeight - 0.45, lz);
      scene.add(hood);

      // Glowing Emissive Lens
      const lens = new THREE.Mesh(
        new THREE.CircleGeometry(0.34, 18),
        new THREE.MeshBasicMaterial({ color: 0xfffaed, side: THREE.DoubleSide })
      );
      lens.rotation.x = Math.PI / 2;
      lens.position.set(lx, wallHeight - 0.56, lz);
      scene.add(lens);

      // Downward Warm Industrial PointLight
      const pl = new THREE.PointLight(0xfff7e6, 1.1, 14.0, 1.2);
      pl.position.set(lx, wallHeight - 0.60, lz);
      pl.castShadow = false;
      scene.add(pl);
      lights.push(pl);
    }

    // 8. Background Heavy-Duty Industrial Pallet Racks (Mounted behind North Wall)
    for (const rx of [-4.5, 0.0, 4.5]) {
      this.buildPalletRack(scene, rx, -4.65, rackOrangeMat, rackBlueMat);
    }

    // 9. Industrial Wall Safety Signs & E-Stop Box
    this.createWallSafetySign(scene, -3.2, 2.4, -4.85, "caution");
    this.createWallSafetySign(scene, 3.2, 2.4, -4.85, "notice");
    this.createEmergencyStopStation(scene, 0, 1.6, -4.85);

    // 10. Technician Control Station / Workbench in West Background
    this.createTechnicianStation(scene, -7.55, 0, 1.5);

    return { lights };
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

    // Yellow post
    const postGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.85, 16);
    const post = new THREE.Mesh(postGeo, yellowMat);
    post.position.y = 0.85 / 2;
    post.castShadow = true;
    group.add(post);

    // Domed cap
    const capGeo = new THREE.SphereGeometry(0.09, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const cap = new THREE.Mesh(capGeo, yellowMat);
    cap.position.y = 0.85;
    group.add(cap);

    // 2 Reflective black hazard stripes
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
    const s1 = new THREE.Mesh(new THREE.CylinderGeometry(0.092, 0.092, 0.06, 16), stripeMat);
    s1.position.y = 0.65;
    group.add(s1);

    const s2 = new THREE.Mesh(new THREE.CylinderGeometry(0.092, 0.092, 0.06, 16), stripeMat);
    s2.position.y = 0.48;
    group.add(s2);

    scene.add(group);
  }

  private static createEmergencyStopStation(scene: THREE.Scene, x: number, y: number, z: number) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    // Yellow enclosure box
    const boxMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.35 });
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.32, 0.10), boxMat);
    group.add(box);

    // Red mushroom E-Stop button
    const btnMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.2, emissive: 0xef4444, emissiveIntensity: 0.3 });
    const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.035, 0.05, 16), btnMat);
    btn.rotation.x = Math.PI / 2;
    btn.position.set(0, 0, 0.06);
    group.add(btn);

    scene.add(group);
  }

  private static createTechnicianStation(scene: THREE.Scene, x: number, y: number, z: number) {
    const group = new THREE.Group();
    group.position.set(x, y, z);

    // Aluminum frame workbench
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.7 });
    const top = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 1.4), deskMat);
    top.position.set(0, 0.85, 0);
    group.add(top);

    // 4 legs
    for (const [dx, dz] of [[-0.35, -0.6], [0.35, -0.6], [-0.35, 0.6], [0.35, 0.6]]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.85, 0.05), deskMat);
      leg.position.set(dx, 0.85 / 2, dz);
      group.add(leg);
    }

    // Diagnostic Monitor with cyan display
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.28, 0.45), screenMat);
    screen.position.set(0.1, 1.05, 0);
    group.add(screen);

    // Orange Safety Cones nearby
    const coneMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.4 });
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.45, 16), coneMat);
    cone.position.set(0.2, 0.225, 0.9);
    group.add(cone);

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

    const w = 2.4;
    const d = 0.6;
    const h = 2.8;

    // 4 Upright Blue Posts
    for (const [px, pz] of [[-w / 2, -d / 2], [w / 2, -d / 2], [-w / 2, d / 2], [w / 2, d / 2]]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, h, 0.08), blueMat);
      post.position.set(px, h / 2, pz);
      post.castShadow = true;
      rackGroup.add(post);
    }

    // 3 Tiers of Orange Crossbeams
    for (const tierY of [0.85, 1.7, 2.55]) {
      const frontBeam = new THREE.Mesh(new THREE.BoxGeometry(w, 0.09, 0.04), orangeMat);
      frontBeam.position.set(0, tierY, d / 2);
      rackGroup.add(frontBeam);

      const backBeam = new THREE.Mesh(new THREE.BoxGeometry(w, 0.09, 0.04), orangeMat);
      backBeam.position.set(0, tierY, -d / 2);
      rackGroup.add(backBeam);

      // Wooden Pallet on each tier
      const pallet = this.createWoodenPallet(0.9, 0.12, 0.55);
      pallet.position.set(0, tierY + 0.06, 0);
      rackGroup.add(pallet);

      // Stacked Cardboard / Plastic Cargo
      const boxMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.8 });
      const b1 = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.40, 0.45), boxMat);
      b1.position.set(-0.2, tierY + 0.32, 0);
      b1.castShadow = true;
      rackGroup.add(b1);

      const blueBinMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4, metalness: 0.2 });
      const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.32, 0.45), blueBinMat);
      b2.position.set(0.22, tierY + 0.28, 0);
      b2.castShadow = true;
      rackGroup.add(b2);

      // 55-gallon steel drum on first tier
      if (tierY === 0.85) {
        const drumMat = new THREE.MeshStandardMaterial({ color: 0x0369a1, roughness: 0.35, metalness: 0.6 });
        const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.55, 18), drumMat);
        drum.position.set(-0.7, tierY + 0.34, 0);
        drum.castShadow = true;
        rackGroup.add(drum);
      }
    }

    scene.add(rackGroup);
  }

  private static createWoodenPallet(w: number, h: number, d: number): THREE.Group {
    const group = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0xc4a482, roughness: 0.85 });

    // Top deckboards
    for (let i = -w / 2 + 0.06; i <= w / 2 - 0.06; i += 0.14) {
      const board = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.02, d), woodMat);
      board.position.set(i, h - 0.01, 0);
      group.add(board);
    }
    // Stringer blocks
    for (const sx of [-w / 2 + 0.05, 0, w / 2 - 0.05]) {
      const str = new THREE.Mesh(new THREE.BoxGeometry(0.08, h - 0.04, d), woodMat);
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
    ctx.lineWidth = 12;
    ctx.strokeStyle = type === "caution" ? "#eab308" : "#2563eb";
    ctx.strokeRect(6, 6, 500, 244);

    // Header banner
    ctx.fillStyle = type === "caution" ? "#eab308" : "#2563eb";
    ctx.fillRect(12, 12, 488, 64);

    ctx.fillStyle = type === "caution" ? "#000000" : "#ffffff";
    ctx.font = "bold 36px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(type === "caution" ? "⚠ CAUTION" : "NOTICE", 256, 58);

    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 24px sans-serif";
    if (type === "caution") {
      ctx.fillText("AUTONOMOUS MOBILE ROBOT", 256, 125);
      ctx.fillText("TESTING IN PROGRESS", 256, 160);
      ctx.font = "18px monospace";
      ctx.fillText("STAY CLEAR OF VEHICLE PATHWAY", 256, 205);
    } else {
      ctx.fillText("EYE PROTECTION REQUIRED", 256, 125);
      ctx.fillText("IN THIS TESTING AREA", 256, 160);
      ctx.font = "18px monospace";
      ctx.fillText("RESTRICTED ACCESS ONLY", 256, 205);
    }

    const tex = new THREE.CanvasTexture(canvas);
    const signGeo = new THREE.PlaneGeometry(1.2, 0.6);
    const signMat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
    const signMesh = new THREE.Mesh(signGeo, signMat);
    signMesh.position.set(x, y, z);
    scene.add(signMesh);
  }

  /**
   * Builds an unmistakable heavy industrial robotics test workstation.
   * Solid steel frame with leveling foot pads, butcher block worktop,
   * equipment tier shelf, and OSHA hazard front banner.
   * Completely grounded with NO wheels so it can NEVER be mistaken for a robot!
   */
  public static createWorkstationObstacle(w: number, h: number, d: number): THREE.Group {
    const group = new THREE.Group();

    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b, // Dark structural steel frame
      roughness: 0.45,
      metalness: 0.75,
    });
    const topWoodMat = new THREE.MeshStandardMaterial({
      color: 0xb45309, // Heavy butcher block amber wood top
      roughness: 0.55,
      metalness: 0.05,
    });
    const yellowMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.35,
    });
    const footMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.85,
    });

    // 1. Thick Heavy Butcher Block Top Surface
    const topThickness = 0.06;
    const top = new THREE.Mesh(new THREE.BoxGeometry(w, topThickness, d), topWoodMat);
    top.position.y = h - topThickness / 2;
    top.castShadow = true;
    top.receiveShadow = true;
    group.add(top);

    // Front yellow/black hazard trim bar
    const hazardTrim = new THREE.Mesh(new THREE.BoxGeometry(w, 0.025, 0.015), yellowMat);
    hazardTrim.position.set(0, h - topThickness / 2, d / 2 + 0.008);
    group.add(hazardTrim);

    // 2. 4 Heavy Steel Legs with Leveling Foot Pads
    const legW = 0.05;
    const legH = h - topThickness;
    const footH = 0.02;

    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        const lx = sx * (w / 2 - legW / 2);
        const lz = sz * (d / 2 - legW / 2);

        // Steel leg
        const leg = new THREE.Mesh(new THREE.BoxGeometry(legW, legH, legW), steelMat);
        leg.position.set(lx, legH / 2, lz);
        leg.castShadow = true;
        group.add(leg);

        // Leveling rubber foot pad
        const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.045, footH, 12), footMat);
        foot.position.set(lx, footH / 2, lz);
        group.add(foot);
      }
    }

    // 3. Lower Structural Equipment Shelf (y = h * 0.3)
    const shelfY = h * 0.32;
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(w - legW * 1.5, 0.03, d - legW * 1.5), steelMat);
    shelf.position.y = shelfY;
    shelf.castShadow = true;
    group.add(shelf);

    // Stored Battery/Instrumentation Box on the shelf
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4, metalness: 0.3 });
    const instBox = new THREE.Mesh(new THREE.BoxGeometry(w * 0.5, 0.14, d * 0.6), boxMat);
    instBox.position.set(0, shelfY + 0.085, 0);
    instBox.castShadow = true;
    group.add(instBox);

    return group;
  }

  /**
   * Builds an authored industrial wooden cargo shipping crate with
   * metal corner brackets, stencil labels, and diagonal reinforcement planks.
   */
  public static createRealisticCrate(w: number, h: number, d: number): THREE.Group {
    const group = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x9a7b56, // Golden aged pine wood
      roughness: 0.78,
      metalness: 0.05,
    });
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x334155, // Dark galvanized steel bracket
      roughness: 0.4,
      metalness: 0.8,
    });

    // Core crate box
    const core = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), woodMat);
    core.position.y = h / 2;
    core.castShadow = true;
    core.receiveShadow = true;
    group.add(core);

    // Steel Corner Protectors
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

    // Horizontal Steel Banding Straps
    const strapMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.9 });
    for (const strapY of [h * 0.3, h * 0.7]) {
      const strap = new THREE.Mesh(new THREE.BoxGeometry(w + 0.01, 0.03, d + 0.01), strapMat);
      strap.position.y = strapY;
      group.add(strap);
    }

    return group;
  }

  /**
   * Builds an authored heavy industrial steel tool chest / cabinet.
   */
  public static createToolCabinet(w: number, h: number, d: number): THREE.Group {
    const group = new THREE.Group();
    const cabinetMat = new THREE.MeshStandardMaterial({
      color: 0xb91c1c, // Heavy industrial red powder coat
      roughness: 0.35,
      metalness: 0.6,
    });
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.2,
      metalness: 0.95,
    });
    const topRubberMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.9,
    });

    // Main cabinet body
    const body = new THREE.Mesh(new THREE.BoxGeometry(w, h - 0.06, d), cabinetMat);
    body.position.y = (h - 0.06) / 2 + 0.06;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Black Rubber Top Work Surface
    const top = new THREE.Mesh(new THREE.BoxGeometry(w + 0.02, 0.03, d + 0.02), topRubberMat);
    top.position.y = h;
    group.add(top);

    // 4 Drawer Handles (Chrome Bars)
    const nDrawers = 4;
    const drawerSpacing = (h - 0.15) / nDrawers;
    for (let i = 0; i < nDrawers; i++) {
      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, w * 0.65, 8), chromeMat);
      handle.rotation.z = Math.PI / 2;
      handle.position.set(0, 0.14 + i * drawerSpacing, d / 2 + 0.02);
      group.add(handle);
    }

    // 4 Caster Wheels at base
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

    // Proportional measurements for 1.75m human
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xf6c8a0, roughness: 0.65 });
    const hardHatMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3, metalness: 0.3 }); // Yellow hardhat
    const vestMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.6 }); // High-vis orange vest
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2, metalness: 0.9 }); // Reflective silver
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 }); // Dark navy cargo pants
    const bootMat = new THREE.MeshStandardMaterial({ color: 0x3f2d1d, roughness: 0.7 }); // Leather work boots

    // 1. Boots (y=0 to 0.14)
    for (const sx of [-0.10, 0.10]) {
      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.24), bootMat);
      boot.position.set(sx, 0.07, 0.02);
      boot.castShadow = true;
      group.add(boot);
    }

    // 2. Legs / Pants (y=0.14 to 0.88)
    for (const sx of [-0.10, 0.10]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.74, 12), pantsMat);
      leg.position.set(sx, 0.51, 0);
      leg.castShadow = true;
      group.add(leg);
    }

    // 3. Torso with High-Vis Safety Vest (y=0.88 to 1.44)
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.56, 0.22), vestMat);
    torso.position.set(0, 1.16, 0);
    torso.castShadow = true;
    group.add(torso);

    // Reflective Silver Stripes across vest
    const s1 = new THREE.Mesh(new THREE.BoxGeometry(0.364, 0.04, 0.224), stripeMat);
    s1.position.set(0, 1.25, 0);
    group.add(s1);

    const s2 = new THREE.Mesh(new THREE.BoxGeometry(0.364, 0.04, 0.224), stripeMat);
    s2.position.set(0, 1.05, 0);
    group.add(s2);

    // 4. Arms
    for (const sx of [-0.23, 0.23]) {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.52, 10), vestMat);
      arm.position.set(sx, 1.15, 0);
      arm.castShadow = true;
      group.add(arm);
    }

    // 5. Head Group (Rotates dynamically toward robot!)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.54, 0);

    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), skinMat);
    headMesh.position.y = 0;
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Safety Hard Hat
    const hat = new THREE.Mesh(new THREE.SphereGeometry(0.125, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), hardHatMat);
    hat.position.y = 0.05;
    headGroup.add(hat);

    const brim = new THREE.Mesh(new THREE.RingGeometry(0.11, 0.16, 16), hardHatMat);
    brim.rotation.x = -Math.PI / 2;
    brim.position.y = 0.05;
    headGroup.add(brim);

    // Safety Glasses (Cyan visor)
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

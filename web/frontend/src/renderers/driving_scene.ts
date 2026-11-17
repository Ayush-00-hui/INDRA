/**
 * Autonomous Driving 3D PBR WebGL Scene (driving_scene.ts).
 * Powered by Three.js with PBR asphalt road ribbons, multi-lane markings,
 * procedurally modeled vehicles with suspension dynamics, spinning wheels,
 * time-of-day lighting (Day, Sunset, Night), rain particles, and MPC Mind View ribbons.
 */

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export type CameraMode = "chase" | "cockpit" | "topdown" | "orbit" | "cinematic";
export type TimeOfDay = "day" | "sunset" | "night";

export class DrivingScene {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls | null = null;

  // Scene Lighting & Environment
  private sunLight: THREE.DirectionalLight;
  private ambientLight: THREE.AmbientLight;
  private hemiLight: THREE.HemisphereLight;
  private streetLightsGroup: THREE.Group;
  private rainParticles: THREE.Points | null = null;
  private terrainMesh: THREE.Mesh | null = null;
  private roadMesh: THREE.Mesh | null = null;
  private roadLinesMesh: THREE.Mesh | null = null;
  private guardrailsMesh: THREE.Mesh | null = null;
  private sceneryGroup: THREE.Group;

  // Camera Management
  private cameraMode: CameraMode = "chase";
  private timeOfDay: TimeOfDay = "day";
  private isRaining: boolean = false;
  private targetFov: number = 60;

  // Vehicle Meshes
  private egoVehicleGroup: THREE.Group;
  private egoWheels: THREE.Mesh[] = [];
  private egoHeadlights: THREE.SpotLight[] = [];
  private egoTaillightMeshes: THREE.Mesh[] = [];
  private egoIndicatorMeshes: { left: THREE.Mesh[]; right: THREE.Mesh[] } = { left: [], right: [] };
  private npcMeshes: Map<string, THREE.Group> = new Map();
  private pedestrianMeshes: Map<string, THREE.Group> = new Map();

  // MPC Mind View Trajectory Ribbons
  private mindViewEnabled: boolean = true;
  private bestTrajectoryLine: THREE.Line | null = null;
  private altTrajectoryLines: THREE.Line[] = [];
  private ghostCarMesh: THREE.Group | null = null;

  // Animation & Interpolation
  private animFrameId: number | null = null;
  private lastRenderTime: number = performance.now();
  private fpsCounter: number = 60;
  private frameCount: number = 0;
  private fpsTimer: number = performance.now();

  // Vehicle Dynamic Interpolation Targets
  private egoTargetPos = new THREE.Vector3(0, 0, 0);
  private egoTargetHeading: number = 0;
  private egoSpeedMps: number = 20.0;
  private egoSteerAngle: number = 0.0;
  private egoWheelSpin: number = 0.0;
  private screenShakeIntensity: number = 0.0;

  // Public Callbacks and Compatibility Hooks
  public onFpsUpdate: ((fps: number) => void) | null = null;
  public onCollision: (() => void) | null = null;
  public onFloorClick: ((e: MouseEvent, x: number, y: number) => void) | null = null;
  public onPlaceObstacle: ((x: number, y: number, kind: string) => void) | null = null;
  public activePlacementTool: string = "goal";
  public currentFps: number = 60;

  public cycleCamera(): string {
    const modes: CameraMode[] = ["chase", "cockpit", "topdown", "orbit", "cinematic"];
    const idx = modes.indexOf(this.cameraMode);
    const nextMode = modes[(idx + 1) % modes.length];
    this.setCameraMode(nextMode);
    return nextMode;
  }

  public captureScreenshot(): string {
    if (!this.renderer) return "";
    return this.renderer.domElement.toDataURL("image/png");
  }

  public setDockStatus(_status: string): void {}

  public destroy(): void {
    this.dispose();
  }

  constructor(container: HTMLElement) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a1122);
    this.scene.fog = new THREE.FogExp2(0x0a1122, 0.0035);

    this.camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / Math.max(1, container.clientHeight),
      0.1,
      800.0
    );
    this.camera.position.set(0, 10, -18);

    // Initialize WebGL Renderer
    try {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance"
      });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0));
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.15;
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(this.renderer.domElement);

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.enabled = false; // Enabled only in "orbit" mode
    } catch (err) {
      console.warn("WebGL initialization failed:", err);
      this.renderer = null;
    }

    // Initialize Scene Groups
    this.streetLightsGroup = new THREE.Group();
    this.sceneryGroup = new THREE.Group();
    this.egoVehicleGroup = new THREE.Group();
    this.scene.add(this.streetLightsGroup);
    this.scene.add(this.sceneryGroup);
    this.scene.add(this.egoVehicleGroup);

    // Setup Lighting
    this.sunLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    this.sunLight.position.set(80, 120, 60);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 350;
    this.sunLight.shadow.camera.left = -70;
    this.sunLight.shadow.camera.right = 70;
    this.sunLight.shadow.camera.top = 70;
    this.sunLight.shadow.camera.bottom = -70;
    this.scene.add(this.sunLight);

    this.ambientLight = new THREE.AmbientLight(0x384860, 0.85);
    this.scene.add(this.ambientLight);

    this.hemiLight = new THREE.HemisphereLight(0x7090b0, 0x1f2937, 0.7);
    this.scene.add(this.hemiLight);

    // Build procedural elements
    this.buildTerrain();
    this.buildEgoVehicle();
    this.buildGhostVehicle();
    this.buildTrajectoryRibbons();
    this.setupEventListeners();
    this.setTimeOfDay("day");

    // Start Animation Loop
    this.animate = this.animate.bind(this);
    this.animFrameId = requestAnimationFrame(this.animate);
  }

  public isAvailable(): boolean {
    return this.renderer !== null;
  }

  // =========================================================================
  // ENVIRONMENT & ROAD CONSTRUCTION
  // =========================================================================

  private buildTerrain(): void {
    const terrainGeo = new THREE.PlaneGeometry(1200, 1200, 32, 32);
    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x1a2e1d,
      roughness: 0.92,
      metalness: 0.05
    });
    this.terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    this.terrainMesh.rotation.x = -Math.PI / 2;
    this.terrainMesh.position.y = -0.15;
    this.terrainMesh.receiveShadow = true;
    this.scene.add(this.terrainMesh);
  }

  public buildRoadFromCenterline(centerline: number[][], roadWidth: number = 11.25): void {
    if (!centerline || centerline.length < 2) return;

    // Remove existing meshes if any
    if (this.roadMesh) this.scene.remove(this.roadMesh);
    if (this.roadLinesMesh) this.scene.remove(this.roadLinesMesh);
    if (this.guardrailsMesh) this.scene.remove(this.guardrailsMesh);

    const halfW = roadWidth / 2.0;
    const shoulderW = 1.8;
    const totalHalfW = halfW + shoulderW;

    const roadVerts: number[] = [];
    const roadUvs: number[] = [];
    const roadIndices: number[] = [];

    const lineVerts: number[] = [];
    const lineIndices: number[] = [];

    let cumDist = 0;
    let prevPt = new THREE.Vector2(centerline[0][0], centerline[0][1]);

    for (let i = 0; i < centerline.length; i++) {
      const pt = new THREE.Vector2(centerline[i][0], centerline[i][1]);
      if (i > 0) cumDist += pt.distanceTo(prevPt);
      prevPt = pt;

      // Compute forward tangent and normal
      let tangent = new THREE.Vector2(1, 0);
      if (i < centerline.length - 1) {
        tangent = new THREE.Vector2(centerline[i + 1][0] - pt.x, centerline[i + 1][1] - pt.y).normalize();
      } else if (i > 0) {
        tangent = new THREE.Vector2(pt.x - centerline[i - 1][0], pt.y - centerline[i - 1][1]).normalize();
      }
      const normal = new THREE.Vector2(-tangent.y, tangent.x);

      // Road ribbon coordinates: X = x, Y = 0, Z = -y (Three.js coordinate standard)
      // Left edge
      const lx = pt.x - normal.x * totalHalfW;
      const lz = -(pt.y - normal.y * totalHalfW);
      // Right edge
      const rx = pt.x + normal.x * totalHalfW;
      const rz = -(pt.y + normal.y * totalHalfW);

      roadVerts.push(lx, 0.0, lz);
      roadVerts.push(rx, 0.0, rz);
      roadUvs.push(0, cumDist * 0.1);
      roadUvs.push(1, cumDist * 0.1);

      if (i < centerline.length - 1) {
        const base = i * 2;
        roadIndices.push(base, base + 1, base + 2);
        roadIndices.push(base + 1, base + 3, base + 2);
      }

      // Lane markings: 2 dashed lines at -1.875m and +1.875m from center
      const laneOffsets = [-1.875, 1.875];
      laneOffsets.forEach((off) => {
        const mx = pt.x + normal.x * off;
        const mz = -(pt.y + normal.y * off);
        const lw = 0.08;
        lineVerts.push(mx - normal.x * lw, 0.02, mz + normal.y * lw);
        lineVerts.push(mx + normal.x * lw, 0.02, mz - normal.y * lw);
      });

      if (i < centerline.length - 1) {
        const lBase = i * 4;
        // Lane 1
        lineIndices.push(lBase, lBase + 1, lBase + 4);
        lineIndices.push(lBase + 1, lBase + 5, lBase + 4);
        // Lane 2
        lineIndices.push(lBase + 2, lBase + 3, lBase + 6);
        lineIndices.push(lBase + 3, lBase + 7, lBase + 6);
      }

      // Streetlights every 45 meters
      if (i % 8 === 0 && i > 0) {
        this.addStreetlight(lx - normal.x * 1.5, lz - normal.y * 1.5, -tangent);
        this.addTree(lx - normal.x * 6.0, lz - normal.y * 6.0);
        this.addTree(rx + normal.x * 6.0, rz + normal.y * 6.0);
      }
    }

    // Asphalt PBR Mesh
    const roadGeo = new THREE.BufferGeometry();
    roadGeo.setAttribute("position", new THREE.Float32BufferAttribute(roadVerts, 3));
    roadGeo.setAttribute("uv", new THREE.Float32BufferAttribute(roadUvs, 2));
    roadGeo.setIndex(roadIndices);
    roadGeo.computeVertexNormals();

    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x1e2430,
      roughness: 0.85,
      metalness: 0.12
    });
    this.roadMesh = new THREE.Mesh(roadGeo, roadMat);
    this.roadMesh.receiveShadow = true;
    this.scene.add(this.roadMesh);

    // Lane Markings Mesh
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(lineVerts, 3));
    lineGeo.setIndex(lineIndices);
    lineGeo.computeVertexNormals();

    const lineMat = new THREE.MeshBasicMaterial({
      color: 0xf8fafc,
      transparent: true,
      opacity: 0.85
    });
    this.roadLinesMesh = new THREE.Mesh(lineGeo, lineMat);
    this.scene.add(this.roadLinesMesh);
  }

  private addStreetlight(x: number, z: number, tangent: THREE.Vector2): void {
    const poleGeo = new THREE.CylinderGeometry(0.08, 0.12, 6.5, 8);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.set(x, 3.25, z);
    pole.castShadow = true;
    this.streetLightsGroup.add(pole);

    // Light head
    const headGeo = new THREE.BoxGeometry(0.4, 0.15, 0.9);
    const headMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, emissive: 0xfef08a, emissiveIntensity: 0.6 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.set(x, 6.4, z);
    this.streetLightsGroup.add(head);

    if (this.timeOfDay === "night") {
      const spot = new THREE.SpotLight(0xfff7ed, 3.0, 35, Math.PI / 4, 0.4);
      spot.position.set(x, 6.4, z);
      spot.target.position.set(x, 0, z);
      this.scene.add(spot.target);
      this.streetLightsGroup.add(spot);
    }
  }

  private addTree(x: number, z: number): void {
    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.3, 2.0, 6);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.9 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.set(x, 1.0, z);

    const foliageGeo = new THREE.ConeGeometry(1.6, 3.5, 7);
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x1b4332, roughness: 0.8 });
    const foliage = new THREE.Mesh(foliageGeo, foliageMat);
    foliage.position.set(x, 3.2, z);

    const treeGroup = new THREE.Group();
    treeGroup.add(trunk);
    treeGroup.add(foliage);
    this.sceneryGroup.add(treeGroup);
  }

  // =========================================================================
  // VEHICLE MODELING (PROCEDURAL PBR)
  // =========================================================================

  private createVehicleModel(colorHex: number, isTruck: boolean = false, isEgo: boolean = false): THREE.Group {
    const group = new THREE.Group();

    if (isTruck) {
      // Highway Cargo Truck
      const cabGeo = new THREE.BoxGeometry(2.4, 2.6, 3.2);
      const cabMat = new THREE.MeshStandardMaterial({ color: colorHex, metalness: 0.3, roughness: 0.4 });
      const cab = new THREE.Mesh(cabGeo, cabMat);
      cab.position.set(0, 1.5, 2.4);
      cab.castShadow = true;
      group.add(cab);

      // Cargo Trailer
      const trailerGeo = new THREE.BoxGeometry(2.5, 3.2, 6.5);
      const trailerMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.2, roughness: 0.5 });
      const trailer = new THREE.Mesh(trailerGeo, trailerMat);
      trailer.position.set(0, 1.8, -2.4);
      trailer.castShadow = true;
      group.add(trailer);
    } else {
      // Aerodynamic Sports Sedan
      const bodyGeo = new THREE.BoxGeometry(1.9, 0.65, 4.4);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        metalness: isEgo ? 0.75 : 0.4,
        roughness: isEgo ? 0.25 : 0.45,
        clearcoat: isEgo ? 1.0 : 0.0,
        clearcoatRoughness: 0.1
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.set(0, 0.55, 0);
      body.castShadow = true;
      group.add(body);

      // Cabin / Glass
      const cabinGeo = new THREE.BoxGeometry(1.65, 0.55, 2.3);
      const cabinMat = new THREE.MeshStandardMaterial({
        color: 0x050811,
        roughness: 0.1,
        metalness: 0.9,
        transparent: true,
        opacity: 0.85
      });
      const cabin = new THREE.Mesh(cabinGeo, cabinMat);
      cabin.position.set(0, 1.05, -0.2);
      group.add(cabin);

      // Headlights
      const headGeo = new THREE.BoxGeometry(0.35, 0.12, 0.05);
      const headMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xfef08a,
        emissiveIntensity: 1.5
      });
      const hlLeft = new THREE.Mesh(headGeo, headMat);
      hlLeft.position.set(-0.65, 0.55, 2.2);
      const hlRight = new THREE.Mesh(headGeo, headMat);
      hlRight.position.set(0.65, 0.55, 2.2);
      group.add(hlLeft);
      group.add(hlRight);

      // Taillights / Brake lights
      const tailGeo = new THREE.BoxGeometry(0.35, 0.12, 0.05);
      const tailMat = new THREE.MeshStandardMaterial({
        color: 0x7f1d1d,
        emissive: 0xef4444,
        emissiveIntensity: 0.8
      });
      const tlLeft = new THREE.Mesh(tailGeo, tailMat.clone());
      tlLeft.position.set(-0.65, 0.55, -2.2);
      const tlRight = new THREE.Mesh(tailGeo, tailMat.clone());
      tlRight.position.set(0.65, 0.55, -2.2);
      group.add(tlLeft);
      group.add(tlRight);
      group.userData.taillights = [tlLeft, tlRight];
    }

    // 4 Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.24, 16);
    wheelGeo.rotateZ(Math.PI / 2);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });

    const wheelPos = [
      [-0.95, 0.34, 1.4],  // Front Left
      [0.95, 0.34, 1.4],   // Front Right
      [-0.95, 0.34, -1.4], // Rear Left
      [0.95, 0.34, -1.4]   // Rear Right
    ];

    const wheels: THREE.Mesh[] = [];
    wheelPos.forEach((p) => {
      const w = new THREE.Mesh(wheelGeo, wheelMat);
      w.position.set(p[0], p[1], p[2]);
      w.castShadow = true;
      group.add(w);
      wheels.push(w);
    });
    group.userData.wheels = wheels;

    // Contact shadow plane
    const shadowGeo = new THREE.PlaneGeometry(2.3, 4.8);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.45
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.02;
    group.add(shadow);

    return group;
  }

  private buildEgoVehicle(): void {
    const egoMesh = this.createVehicleModel(0x00ff9d, false, true);
    this.egoVehicleGroup.add(egoMesh);
    this.egoWheels = egoMesh.userData.wheels || [];
    this.egoTaillightMeshes = egoMesh.userData.taillights || [];

    // Real-time Spotlights for Night driving
    const spotL = new THREE.SpotLight(0xffffff, 2.5, 45, Math.PI / 6, 0.3);
    spotL.position.set(-0.6, 0.6, 2.2);
    spotL.target.position.set(-0.6, 0.0, 30.0);
    const spotR = new THREE.SpotLight(0xffffff, 2.5, 45, Math.PI / 6, 0.3);
    spotR.position.set(0.6, 0.6, 2.2);
    spotR.target.position.set(0.6, 0.0, 30.0);

    this.egoVehicleGroup.add(spotL);
    this.egoVehicleGroup.add(spotL.target);
    this.egoVehicleGroup.add(spotR);
    this.egoVehicleGroup.add(spotR.target);
    this.egoHeadlights = [spotL, spotR];
  }

  private buildGhostVehicle(): void {
    // Translucent holographic ghost car representing end of lookahead horizon
    this.ghostCarMesh = this.createVehicleModel(0x00f0ff, false, false);
    this.ghostCarMesh.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshBasicMaterial({
          color: 0x00f0ff,
          wireframe: true,
          transparent: true,
          opacity: 0.35
        });
      }
    });
    this.ghostCarMesh.visible = false;
    this.scene.add(this.ghostCarMesh);
  }

  // =========================================================================
  // MIND VIEW TRAJECTORY RIBBONS
  // =========================================================================

  private buildTrajectoryRibbons(): void {
    // Best chosen path (Emerald green glowing line)
    const bestGeo = new THREE.BufferGeometry();
    const bestMat = new THREE.LineBasicMaterial({
      color: 0x00ff9d,
      linewidth: 3,
      transparent: true,
      opacity: 0.95
    });
    this.bestTrajectoryLine = new THREE.Line(bestGeo, bestMat);
    this.bestTrajectoryLine.frustumCulled = false;
    this.scene.add(this.bestTrajectoryLine);

    // Alternative candidate paths pool (16 translucent cyan lines)
    for (let i = 0; i < 16; i++) {
      const altGeo = new THREE.BufferGeometry();
      const altMat = new THREE.LineBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.25 - i * 0.012
      });
      const altLine = new THREE.Line(altGeo, altMat);
      altLine.frustumCulled = false;
      this.scene.add(altLine);
      this.altTrajectoryLines.push(altLine);
    }
  }

  // =========================================================================
  // STATE UPDATE & FRAME INTERPOLATION
  // =========================================================================

  public update(state: any): void {
    if (!state) return;

    // 1. Build Road if not yet constructed
    if (!this.roadMesh && state.world?.layout?.centerline) {
      this.buildRoadFromCenterline(
        state.world.layout.centerline,
        state.world.layout.road_width || 11.25
      );
    }

    // 2. Process Entities
    const entities = state.entities || [];
    const activeNpcIds = new Set<string>();
    const activePedIds = new Set<string>();

    for (const ent of entities) {
      if (ent.id === "ego_car" || ent.extra?.is_ego) {
        // Update Ego Vehicle Position & Target
        this.egoTargetPos.set(ent.x, 0.0, -ent.y);
        this.egoTargetHeading = THREE.MathUtils.degToRad(ent.heading || 0.0);
        this.egoSpeedMps = (ent.extra?.speed_kmh || 70.0) / 3.6;
        this.egoSteerAngle = THREE.MathUtils.degToRad(ent.extra?.steer_deg || 0.0);

        // Brake lights update
        const isBraking = Boolean(ent.extra?.brake_lights);
        this.egoTaillightMeshes.forEach((mesh) => {
          if (mesh.material instanceof THREE.MeshStandardMaterial) {
            mesh.material.emissiveIntensity = isBraking ? 2.5 : 0.6;
          }
        });
      } else if (ent.kind === "person") {
        // Pedestrian Entity
        activePedIds.add(ent.id);
        let pedGroup = this.pedestrians.get(ent.id);
        if (!pedGroup) {
          pedGroup = new THREE.Group();
          const head = new THREE.Mesh(
            new THREE.SphereGeometry(0.3, 12, 12),
            new THREE.MeshStandardMaterial({ color: 0xec4899 })
          );
          head.position.y = 1.4;
          const body = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.25, 1.2, 8),
            new THREE.MeshStandardMaterial({ color: 0x3b82f6 })
          );
          body.position.y = 0.6;
          pedGroup.add(head);
          pedGroup.add(body);
          this.scene.add(pedGroup);
          this.pedestrianMeshes.set(ent.id, pedGroup);
        }
        pedGroup.position.set(ent.x, 0.0, -ent.y);
      } else {
        // NPC Traffic Entity
        activeNpcIds.add(ent.id);
        let npcGroup = this.npcMeshes.get(ent.id);
        if (!npcGroup) {
          const colorHex = ent.extra?.color
            ? parseInt(ent.extra.color.replace("#", "0x"))
            : 0x38bdf8;
          npcGroup = this.createVehicleModel(colorHex, ent.kind === "truck", false);
          this.scene.add(npcGroup);
          this.npcMeshes.set(ent.id, npcGroup);
        }
        npcGroup.position.set(ent.x, 0.0, -ent.y);
        npcGroup.rotation.y = THREE.MathUtils.degToRad(ent.heading || 0.0);

        // NPC Brake lights
        const npcTaillights = npcGroup.userData.taillights || [];
        const isBraking = Boolean(ent.extra?.brake_lights);
        npcTaillights.forEach((mesh: THREE.Mesh) => {
          if (mesh.material instanceof THREE.MeshStandardMaterial) {
            mesh.material.emissiveIntensity = isBraking ? 2.5 : 0.6;
          }
        });
      }
    }

    // Clean up inactive NPCs
    for (const [id, mesh] of this.npcMeshes.entries()) {
      if (!activeNpcIds.has(id)) {
        this.scene.remove(mesh);
        this.npcMeshes.delete(id);
      }
    }

    // 3. Update Mind View Trajectory Ribbons
    if (this.mindViewEnabled && state.plan) {
      // Chosen Best Trajectory
      if (this.bestTrajectoryLine && state.plan.best && state.plan.best.length > 1) {
        const pts = state.plan.best.map(
          (p: number[]) => new THREE.Vector3(p[0], 0.12, -p[1])
        );
        this.bestTrajectoryLine.geometry.dispose();
        this.bestTrajectoryLine.geometry = new THREE.BufferGeometry().setFromPoints(pts);
        this.bestTrajectoryLine.visible = true;

        // Position Ghost Car at the end of the horizon
        if (this.ghostCarMesh && pts.length > 0) {
          const lastPt = pts[pts.length - 1];
          const prevPt = pts[Math.max(0, pts.length - 2)];
          this.ghostCarMesh.position.copy(lastPt);
          this.ghostCarMesh.position.y = 0.0;
          this.ghostCarMesh.rotation.y = Math.atan2(lastPt.x - prevPt.x, -(lastPt.z - prevPt.z));
          this.ghostCarMesh.visible = true;
        }
      }

      // Alternative Candidate Trajectories
      const alts = state.plan.alts || [];
      this.altTrajectoryLines.forEach((line, idx) => {
        if (idx < alts.length && alts[idx].path && alts[idx].path.length > 1) {
          const pts = alts[idx].path.map(
            (p: number[]) => new THREE.Vector3(p[0], 0.06, -p[1])
          );
          line.geometry.dispose();
          line.geometry = new THREE.BufferGeometry().setFromPoints(pts);
          line.visible = true;
        } else {
          line.visible = false;
        }
      });
    } else {
      if (this.bestTrajectoryLine) this.bestTrajectoryLine.visible = false;
      this.altTrajectoryLines.forEach((l) => (l.visible = false));
      if (this.ghostCarMesh) this.ghostCarMesh.visible = false;
    }

    // 4. Handle Collision Event (Shake & Red Flash)
    if (state.events && (state.events.includes("bonk") || state.metrics?.collisions > 0)) {
      this.screenShakeIntensity = 0.85;
      if (this.onCollision) this.onCollision();
    }
  }

  // =========================================================================
  // CAMERA & RENDER LOOP
  // =========================================================================

  public setCameraMode(mode: CameraMode): void {
    this.cameraMode = mode;
    if (this.controls) {
      this.controls.enabled = mode === "orbit";
    }
  }

  public setTimeOfDay(tod: TimeOfDay): void {
    this.timeOfDay = tod;
    if (tod === "day") {
      this.scene.background = new THREE.Color(0x0f1c30);
      this.scene.fog = new THREE.FogExp2(0x0f1c30, 0.0035);
      this.sunLight.color.setHex(0xfffaed);
      this.sunLight.intensity = 2.4;
      this.ambientLight.intensity = 0.85;
      this.egoHeadlights.forEach((h) => (h.intensity = 0.0));
    } else if (tod === "sunset") {
      this.scene.background = new THREE.Color(0x281216);
      this.scene.fog = new THREE.FogExp2(0x281216, 0.0045);
      this.sunLight.color.setHex(0xf97316);
      this.sunLight.intensity = 1.8;
      this.ambientLight.intensity = 0.6;
      this.egoHeadlights.forEach((h) => (h.intensity = 1.2));
    } else if (tod === "night") {
      this.scene.background = new THREE.Color(0x020617);
      this.scene.fog = new THREE.FogExp2(0x020617, 0.008);
      this.sunLight.color.setHex(0x1e293b);
      this.sunLight.intensity = 0.2;
      this.ambientLight.intensity = 0.25;
      this.egoHeadlights.forEach((h) => (h.intensity = 3.5));
    }
  }

  public setMindView(enabled: boolean): void {
    this.mindViewEnabled = enabled;
  }

  private updateCamera(): void {
    const egoPos = this.egoVehicleGroup.position;
    const egoRot = this.egoVehicleGroup.rotation.y;

    if (this.cameraMode === "chase") {
      // Third-person chase camera
      const dist = 14.0;
      const height = 4.8;
      const camTargetX = egoPos.x - Math.sin(egoRot) * dist;
      const camTargetZ = egoPos.z - Math.cos(egoRot) * dist;

      this.camera.position.lerp(new THREE.Vector3(camTargetX, height, camTargetZ), 0.12);
      const lookTarget = new THREE.Vector3(
        egoPos.x + Math.sin(egoRot) * 12.0,
        egoPos.y + 1.2,
        egoPos.z + Math.cos(egoRot) * 12.0
      );
      this.camera.lookAt(lookTarget);

      // Dynamic FOV widening with speed
      this.targetFov = 58.0 + Math.min(18.0, (this.egoSpeedMps / 30.0) * 18.0);
    } else if (this.cameraMode === "cockpit") {
      // First-person cockpit view
      const eyeX = egoPos.x + Math.sin(egoRot) * 0.4;
      const eyeZ = egoPos.z + Math.cos(egoRot) * 0.4;
      this.camera.position.set(eyeX, 1.15, eyeZ);
      const lookTarget = new THREE.Vector3(
        egoPos.x + Math.sin(egoRot) * 30.0,
        1.15,
        egoPos.z + Math.cos(egoRot) * 30.0
      );
      this.camera.lookAt(lookTarget);
      this.targetFov = 72.0;
    } else if (this.cameraMode === "topdown") {
      // Aerial bird's eye view
      this.camera.position.lerp(new THREE.Vector3(egoPos.x, 60.0, egoPos.z), 0.1);
      this.camera.lookAt(egoPos);
      this.targetFov = 50.0;
    } else if (this.cameraMode === "cinematic") {
      // Dramatic roadside tracking shot
      const camX = egoPos.x + 8.0;
      const camZ = egoPos.z + 16.0;
      this.camera.position.lerp(new THREE.Vector3(camX, 1.6, camZ), 0.05);
      this.camera.lookAt(egoPos);
      this.targetFov = 45.0;
    }

    // Smooth FOV interpolation
    if (Math.abs(this.camera.fov - this.targetFov) > 0.1) {
      this.camera.fov += (this.targetFov - this.camera.fov) * 0.08;
      this.camera.updateProjectionMatrix();
    }

    // Apply Screen Shake on Collision
    if (this.screenShakeIntensity > 0.01) {
      this.camera.position.x += (Math.random() - 0.5) * this.screenShakeIntensity * 0.4;
      this.camera.position.y += (Math.random() - 0.5) * this.screenShakeIntensity * 0.4;
      this.screenShakeIntensity *= 0.90;
    }
  }

  private animate(): void {
    this.animFrameId = requestAnimationFrame(this.animate);
    const now = performance.now();
    const dt = Math.min((now - this.lastRenderTime) / 1000.0, 0.1);
    this.lastRenderTime = now;

    // FPS Meter
    this.frameCount++;
    if (now - this.fpsTimer >= 1000) {
      this.fpsCounter = this.frameCount;
      this.frameCount = 0;
      this.fpsTimer = now;
      if (this.onFpsUpdate) this.onFpsUpdate(this.fpsCounter);
    }

    // 1. Smooth Vehicle Motion Interpolation
    this.egoVehicleGroup.position.lerp(this.egoTargetPos, 0.25);
    // Angular slerp approximation
    let diffAngle = this.egoTargetHeading - this.egoVehicleGroup.rotation.y;
    while (diffAngle > Math.PI) diffAngle -= 2 * Math.PI;
    while (diffAngle < -Math.PI) diffAngle += 2 * Math.PI;
    this.egoVehicleGroup.rotation.y += diffAngle * 0.22;

    // 2. Wheels Animation (Spinning + Steering)
    this.egoWheelSpin += (this.egoSpeedMps / 0.34) * dt;
    this.egoWheels.forEach((wheel, idx) => {
      wheel.rotation.x = this.egoWheelSpin;
      // Front wheels steering
      if (idx === 0 || idx === 1) {
        wheel.rotation.y = this.egoSteerAngle;
      }
    });

    // 3. Update Camera
    this.updateCamera();
    if (this.controls && this.controls.enabled) {
      this.controls.update();
    }

    // 4. Render WebGL Frame
    if (this.renderer) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  private setupEventListeners(): void {
    const onResize = () => {
      if (!this.renderer) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.camera.aspect = w / Math.max(1, h);
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);
  }

  public dispose(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
    }
    if (this.renderer) {
      this.renderer.dispose();
      if (this.container.contains(this.renderer.domElement)) {
        this.container.removeChild(this.renderer.domElement);
      }
      this.renderer = null;
    }
  }
}

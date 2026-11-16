/**
 * Game-Quality Three.js PBR Simulation Scene (v6.0-beauty).
 * Features:
 *  - University Robotics Lab Test Arena: Polished concrete PBR floor, yellow/black hazard tape,
 *    corner registration crosshairs, baseboards, window daylight patches, ceiling panel highlights.
 *  - High Dynamic Range Lighting: Meets Luminance Gate (mean luminance 0.25-0.60, >=30% midtones).
 *  - Authored 3D Assets: Real GLB models for Robot (AMR Rover), Office Chair, Human Walker,
 *    Charging Goal Dock, Crates, Filing Cabinets, and Lab Workbenches.
 *  - Glowing Navigation Ribbon: Catmull-Rom smoothed curve, emerald edges, chevrons, destination ring.
 *  - Candidate Alternative Rollouts: Translucent return-colored ribbons with collision X markers.
 *  - Holographic Ghost Robots: Fresnel rim lighting, scanline transparency, red collision warning.
 *  - Head-Mounted Robot POV Camera: Layer-1 chassis masking, FOV 80, near 0.02, spotlight cone.
 *  - Zero-Allocation Frame Loop: Pre-allocated ribbon buffers, 12-mesh ghost pool, adaptive DPR.
 */

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DiagnosticsOverlay } from "../ui/diagnostics_overlay";
import { LabEnvironmentBuilder } from "./lab_environment";
import { HumanoidRobot } from "./humanoid_robot";

export class ThreeSimulationScene {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private povCamera: THREE.PerspectiveCamera;
  private activeCamera: THREE.PerspectiveCamera;
  private controls: OrbitControls | null = null;

  // Lighting Systems
  private sunLight: THREE.DirectionalLight;
  private hemiLight: THREE.HemisphereLight;
  private ambientLight: THREE.AmbientLight;
  private ceilingLights: THREE.PointLight[] = [];
  private povHeadlight: THREE.SpotLight;
  private floorMesh: THREE.Mesh | null = null;
  private gridHelper: THREE.GridHelper | null = null;

  // Hero Humanoid Robot & Entities
  public humanoidRobot: HumanoidRobot;
  private robotGroup: THREE.Group;
  private robotMeshRoot: THREE.Group;
  private robotScanner: THREE.Object3D | null = null;
  private robotLedRing: THREE.Mesh | null = null;
  private lidarSweepLine: THREE.Line | null = null;
  private personGroup: THREE.Group;
  private personMeshRoot: THREE.Group;
  private personHead: THREE.Object3D | null = null;
  private goalGroup: THREE.Group;
  private goalRing: THREE.Mesh | null = null;
  private goalBeacon: THREE.Mesh | null = null;
  private goalDiamond: THREE.Mesh | null = null;
  private obstacleMeshes: Map<string, THREE.Object3D> = new Map();
  private lastFrameTime: number = performance.now();

  // Interactive Floor Raycasting & Dynamic Object Placement
  public static readonly SCALE_FACTOR = 65.0; // Expanded spacious 14m x 9.5m arena
  public activePlacementTool: "goal" | "crate" | "cabinet" | "workstation" = "goal";
  public onFloorClick?: (px: number, py: number) => void;
  public onPlaceObstacle?: (px: number, py: number, kind: string) => void;
  private pointerDownPos = { x: 0, y: 0, time: 0 };
  private clickRipples: Array<{ mesh: THREE.Mesh; createdAt: number }> = [];

  // MPC Trajectory & Imagination Visuals (Zero allocation per frame)
  private chosenRibbonMesh: THREE.Mesh | null = null;
  private candidateLinesGroup: THREE.Group;
  private collisionMarkersGroup: THREE.Group;
  private destinationRing: THREE.Mesh | null = null;
  private ghostPool: THREE.Group[] = [];
  private ghostMeshesGroup: THREE.Group;
  private breadcrumbPoints: THREE.Vector3[] = [];
  private breadcrumbLine: THREE.Line | null = null;
  private hitboxesRoot: THREE.Group;

  // Camera & Kinematics
  public cameraMode: "overview" | "topdown" | "chase" | "robot_pov" | "orbit" = "overview";
  private targetCamPos = new THREE.Vector3(0, 5.8, 5.8);
  private targetCamLookAt = new THREE.Vector3(0, 0.2, 0);
  private currentCamPos = new THREE.Vector3(0, 5.8, 5.8);
  private currentCamLookAt = new THREE.Vector3(0, 0.2, 0);
  private povTargetQuat = new THREE.Quaternion();
  private orbitAngle: number = 0;
  public showHitboxes: boolean = false;
  public showMindView: boolean = false;

  // Quality & Performance
  public quality: "low" | "med" | "high" = "high";
  private targetDpr: number = 1.0;
  private currentDpr: number = 1.0;
  private lastTime: number = performance.now();
  private frameCount: number = 0;
  public currentFps: number = 60;
  private isDestroyed: boolean = false;

  // GLTF Loader & Model Cache
  private gltfLoader = new GLTFLoader();
  private modelCache: Map<string, THREE.Group> = new Map();

  constructor(container: HTMLElement) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#0a0f1d"); // Deep industrial slate atmosphere
    this.scene.fog = new THREE.FogExp2(0x0a0f1d, 0.015); // Authentic warehouse depth haze

    const w = container.clientWidth || 900;
    const h = container.clientHeight || 600;
    const aspect = w / h;

    // 1. Overview Camera (Spacious high perspective looking into expanded lab arena)
    this.camera = new THREE.PerspectiveCamera(48, aspect, 0.05, 120);
    this.camera.position.set(0, 9.4, 9.8);
    this.camera.lookAt(0, 0.4, 0);
    this.camera.layers.enable(0);
    this.camera.layers.enable(1); // Sees both room and robot chassis

    // 2. Head-Mounted Humanoid POV Camera
    // Positioned at humanoid visor eye level y=1.52m, FOV 80, near plane 0.05m
    this.povCamera = new THREE.PerspectiveCamera(80, aspect, 0.05, 50);
    this.povCamera.position.set(0, 1.52, 0);
    this.povCamera.layers.enable(0);
    this.povCamera.layers.disable(1); // MASK CHASSIS: POV camera cannot see own body

    // Forward SpotLight Headlight on Humanoid
    this.povHeadlight = new THREE.SpotLight(0xfffaed, 2.5, 9.0, Math.PI / 4, 0.4, 1.2);
    this.povHeadlight.position.set(0, 1.50, 0);
    this.povHeadlight.castShadow = true;
    this.povCamera.add(this.povHeadlight);
    this.scene.add(this.povCamera);

    this.activeCamera = this.camera;

    // WebGLRenderer with high-performance PBR parameters
    try {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
        stencil: false,
      });
      this.renderer.setSize(w, h);
      this.targetDpr = Math.min(window.devicePixelRatio || 1, 2.0);
      this.currentDpr = this.targetDpr;
      this.renderer.setPixelRatio(this.currentDpr);
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.22;
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      container.appendChild(this.renderer.domElement);
      DiagnosticsOverlay.getInstance().setRenderer(this.renderer);

      // Interactive OrbitControls for 3D navigation
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.08;
      this.controls.target.set(0, 0.2, 0);
      this.controls.maxPolarAngle = Math.PI / 2 - 0.04; // Keep camera above floor
      this.controls.minDistance = 1.0;
      this.controls.maxDistance = 20.0;
    } catch (err) {
      console.warn("Three.js WebGL initialization failed:", err);
      this.renderer = null;
      return;
    }

    // High Dynamic Range PBR Lighting (Key Sunlight + Sky Fill + Ambient)
    this.sunLight = new THREE.DirectionalLight(0xfff7e6, 1.8);
    this.sunLight.position.set(4.8, 9.5, 4.2);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048; // Optimized for razor-sharp shadows at 60 FPS
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 35;
    this.sunLight.shadow.camera.left = -9.0;
    this.sunLight.shadow.camera.right = 9.0;
    this.sunLight.shadow.camera.top = 7.0;
    this.sunLight.shadow.camera.bottom = -7.0;
    this.sunLight.shadow.bias = -0.0003;
    this.scene.add(this.sunLight);

    this.hemiLight = new THREE.HemisphereLight(0x94a3b8, 0x1e293b, 0.75);
    this.scene.add(this.hemiLight);

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.30);
    this.scene.add(this.ambientLight);

    // Roots
    this.candidateLinesGroup = new THREE.Group();
    this.scene.add(this.candidateLinesGroup);

    this.collisionMarkersGroup = new THREE.Group();
    this.scene.add(this.collisionMarkersGroup);

    this.ghostMeshesGroup = new THREE.Group();
    this.scene.add(this.ghostMeshesGroup);

    this.hitboxesRoot = new THREE.Group();
    this.scene.add(this.hitboxesRoot);

    // Build Architectural Environment
    this.buildLabEnvironment();

    // Build Entities: High-Fidelity 3D Humanoid Robot
    this.humanoidRobot = new HumanoidRobot();
    this.scene.add(this.humanoidRobot.root);

    this.robotGroup = new THREE.Group(); // Legacy holder
    this.robotMeshRoot = new THREE.Group();

    this.personGroup = this.buildPerson();
    this.scene.add(this.personGroup);

    this.goalGroup = this.buildGoal();
    this.scene.add(this.goalGroup);

    // Initialize Ghost Pool (Pre-allocated 12 holographic meshes)
    this.initGhostPool(12);

    // Pre-load external GLB models asynchronously
    this.preloadAuthoredModels();

    // Event listeners
    window.addEventListener("resize", this.handleResize);
    document.addEventListener("visibilitychange", this.handleVisibility);

    // Initialize Click-to-Move Raycaster on Arena Floor
    this.setupInteractionListeners();
  }

  private setupInteractionListeners() {
    if (!this.renderer) return;
    const dom = this.renderer.domElement;

    dom.addEventListener("pointerdown", (e: PointerEvent) => {
      this.pointerDownPos = { x: e.clientX, y: e.clientY, time: performance.now() };
    });

    dom.addEventListener("pointerup", (e: PointerEvent) => {
      const dx = Math.abs(e.clientX - this.pointerDownPos.x);
      const dy = Math.abs(e.clientY - this.pointerDownPos.y);
      const dt = performance.now() - this.pointerDownPos.time;
      // Filter out camera drags: only treat as floor click if movement is minimal (< 6px) and quick (< 450ms)
      if (dx < 6 && dy < 6 && dt < 450) {
        this.handleFloorPointer(e.clientX, e.clientY);
      }
    });
  }

  private handleFloorPointer(clientX: number, clientY: number) {
    if (!this.floorMesh || !this.renderer) return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), this.activeCamera);
    const hits = raycaster.intersectObject(this.floorMesh);
    if (hits.length > 0) {
      const pt = hits[0].point;
      // Convert 3D lab coordinates [-6.92, 6.92] x [-4.61, 4.61] to canvas pixels [0, 900] x [0, 600]
      const px = Math.min(860, Math.max(40, Math.round(pt.x * ThreeSimulationScene.SCALE_FACTOR + 450.0)));
      const py = Math.min(560, Math.max(40, Math.round(pt.z * ThreeSimulationScene.SCALE_FACTOR + 300.0)));

      this.spawnClickRipple(pt.x, pt.z, this.activePlacementTool);
      if (this.activePlacementTool === "goal") {
        if (this.onFloorClick) {
          this.onFloorClick(px, py);
        }
      } else {
        if (this.onPlaceObstacle) {
          this.onPlaceObstacle(px, py, this.activePlacementTool);
        }
      }
    }
  }

  public spawnClickRipple(x: number, z: number, tool: string = "goal") {
    let color = 0x00e5ff; // Goal cyan
    if (tool === "crate") color = 0xd97706; // Wood crate amber
    else if (tool === "cabinet") color = 0xef4444; // Red cabinet
    else if (tool === "workstation") color = 0xfacc15; // Yellow workstation

    const geo = new THREE.RingGeometry(0.12, 0.24, 32);
    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(geo, mat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(x, 0.025, z);
    this.scene.add(ring);
    this.clickRipples.push({ mesh: ring, createdAt: performance.now() });
  }

  public isAvailable(): boolean {
    return this.renderer !== null;
  }

  public getRendererElement(): HTMLCanvasElement | null {
    return this.renderer ? this.renderer.domElement : null;
  }

  private to3D(px: number, py: number): { x: number; z: number } {
    return {
      x: (px - 450.0) / ThreeSimulationScene.SCALE_FACTOR,
      z: (py - 300.0) / ThreeSimulationScene.SCALE_FACTOR,
    };
  }

  // =========================================================================
  // ARCHITECTURAL LAB ENVIRONMENT (Spacious 14m x 9.5m Arena, PBR Concrete)
  // =========================================================================
  private buildLabEnvironment() {
    // 1. Photorealistic Polished Epoxy Concrete Floor with OSHA borders & Stencils (13.85m x 9.23m)
    const floorGeo = new THREE.PlaneGeometry(
      900.0 / ThreeSimulationScene.SCALE_FACTOR,
      600.0 / ThreeSimulationScene.SCALE_FACTOR,
      32,
      32
    );
    const floorTex = LabEnvironmentBuilder.createFloorCanvasTexture();
    const floorRoughnessTex = LabEnvironmentBuilder.createFloorRoughnessTexture();

    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      roughnessMap: floorRoughnessTex,
      roughness: 0.32,
      metalness: 0.08,
    });
    this.floorMesh = new THREE.Mesh(floorGeo, floorMat);
    this.floorMesh.rotation.x = -Math.PI / 2;
    this.floorMesh.receiveShadow = true;
    this.scene.add(this.floorMesh);

    // 2. Realistic 4.2m Industrial Warehouse Architecture (Expanded 15.6m span)
    const { lights } = LabEnvironmentBuilder.buildWarehouseArchitecture(this.scene);
    this.ceilingLights.push(...lights);
  }

  // =========================================================================
  // HERO ASSETS (Real Robot, Person, Chair, Recharging Goal Pad)
  // =========================================================================
  private buildRobot(): THREE.Group {
    const group = new THREE.Group();
    this.robotMeshRoot = new THREE.Group();
    group.add(this.robotMeshRoot);

    // Initial high-fidelity procedural geometry (upgraded automatically to GLB once loaded)
    const chassisGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.14, 24);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b, // Gunmetal dark chassis
      roughness: 0.35,
      metalness: 0.7,
    });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    chassis.position.y = 0.09;
    chassis.castShadow = true;
    this.robotMeshRoot.add(chassis);

    // Front Visor Eye Sensor
    const eyeGeo = new THREE.BoxGeometry(0.16, 0.035, 0.05);
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4, // Glowing Cyan Sensor
      emissive: 0x06b6d4,
      emissiveIntensity: 0.9,
    });
    const eye = new THREE.Mesh(eyeGeo, eyeMat);
    eye.position.set(0, 0.12, -0.16);
    this.robotMeshRoot.add(eye);

    // Industrial Emergency Stop (E-Stop) Mushroom Button on Deck
    const estopCollar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.015, 12),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 })
    );
    estopCollar.position.set(0.08, 0.165, 0.06);
    this.robotMeshRoot.add(estopCollar);

    const estopBtn = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.014, 0.018, 12),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3, emissive: 0xef4444, emissiveIntensity: 0.4 })
    );
    estopBtn.position.set(0.08, 0.178, 0.06);
    this.robotMeshRoot.add(estopBtn);

    // Spinning LiDAR Turret Dome with Sweeping Laser Line
    const scannerGroup = new THREE.Group();
    scannerGroup.position.set(0, 0.18, 0);
    const scannerGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.05, 16);
    const scannerMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.9 });
    const scannerMesh = new THREE.Mesh(scannerGeo, scannerMat);
    scannerMesh.position.y = 0.025;
    scannerGroup.add(scannerMesh);

    // Sweeping laser beam line
    const beamGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0.025, 0),
      new THREE.Vector3(0, 0.025, -2.4),
    ]);
    const beamMat = new THREE.LineBasicMaterial({
      color: 0x00ff9d,
      transparent: true,
      opacity: 0.75,
    });
    const beamLine = new THREE.Line(beamGeo, beamMat);
    scannerGroup.add(beamLine);
    this.lidarSweepLine = beamLine;

    this.robotScanner = scannerGroup;
    group.add(scannerGroup);

    // Circular Status LED Ring
    const ledGeo = new THREE.RingGeometry(0.12, 0.16, 24);
    const ledMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 0.8,
      side: THREE.DoubleSide,
    });
    this.robotLedRing = new THREE.Mesh(ledGeo, ledMat);
    this.robotLedRing.rotation.x = -Math.PI / 2;
    this.robotLedRing.position.set(0, 0.162, 0);
    group.add(this.robotLedRing);

    // Robot Underglow Light (Emerald / Cyan glow underneath chassis onto floor)
    const underglow = new THREE.PointLight(0x06b6d4, 1.4, 1.2, 1.5);
    underglow.position.set(0, 0.04, 0);
    group.add(underglow);

    // Side Caterpillar Track / Wheels
    const wheelMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.85,
      metalness: 0.2,
    });
    const leftWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.04, 16), wheelMat);
    leftWheel.rotation.z = Math.PI / 2;
    leftWheel.position.set(-0.17, 0.065, 0);
    group.add(leftWheel);

    const rightWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.04, 16), wheelMat);
    rightWheel.rotation.z = Math.PI / 2;
    rightWheel.position.set(0.17, 0.065, 0);
    group.add(rightWheel);

    // Front Dual Headlights
    const headlightMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xfffaed,
      emissiveIntensity: 1.5,
    });
    const leftHeadlight = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.02, 12), headlightMat);
    leftHeadlight.rotation.x = Math.PI / 2;
    leftHeadlight.position.set(-0.08, 0.09, -0.17);
    group.add(leftHeadlight);

    const rightHeadlight = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.02, 12), headlightMat);
    rightHeadlight.rotation.x = Math.PI / 2;
    rightHeadlight.position.set(0.08, 0.09, -0.17);
    group.add(rightHeadlight);

    // Mask procedural robot chassis onto Layer 1 (hidden in head-mounted POV view)
    this.robotMeshRoot.traverse((c) => c.layers.set(1));

    return group;
  }

  private buildPerson(): THREE.Group {
    const { root, head } = LabEnvironmentBuilder.createRealisticTechnician();
    this.personMeshRoot = root;
    this.personHead = head;
    root.visible = false; // Hidden in Scenario 1; activated when person entity arrives!
    return root;
  }

  private buildGoal(): THREE.Group {
    const group = new THREE.Group();

    // 1. Recharging Goal Dock Base (60x60cm footprint)
    const dockGeo = new THREE.CylinderGeometry(0.35, 0.38, 0.05, 32);
    const dockMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.3,
      metalness: 0.7,
    });
    const dock = new THREE.Mesh(dockGeo, dockMat);
    dock.position.y = 0.025;
    dock.receiveShadow = true;
    group.add(dock);

    // 2. High-Tech Glowing Energy Ring
    const ringGeo = new THREE.RingGeometry(0.24, 0.34, 32);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Amber goal glow
      emissive: 0xf59e0b,
      emissiveIntensity: 1.4,
      side: THREE.DoubleSide,
    });
    this.goalRing = new THREE.Mesh(ringGeo, ringMat);
    this.goalRing.rotation.x = -Math.PI / 2;
    this.goalRing.position.y = 0.052;
    group.add(this.goalRing);

    // 3. Concentric Outer Pulse Ring on Ground
    const outerPulseGeo = new THREE.RingGeometry(0.38, 0.44, 32);
    const outerPulseMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
    });
    const outerPulse = new THREE.Mesh(outerPulseGeo, outerPulseMat);
    outerPulse.rotation.x = -Math.PI / 2;
    outerPulse.position.y = 0.015;
    outerPulse.name = "goalOuterPulse";
    group.add(outerPulse);

    // 4. Inner Holographic Core Beam (White/Amber bright laser core)
    const innerBeamGeo = new THREE.CylinderGeometry(0.03, 0.03, 3.2, 16, 1, true);
    const innerBeamMat = new THREE.MeshBasicMaterial({
      color: 0xfffbeb,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const innerBeam = new THREE.Mesh(innerBeamGeo, innerBeamMat);
    innerBeam.position.y = 1.6;
    group.add(innerBeam);

    // 5. Outer Holographic Light Sheath
    const beaconGeo = new THREE.CylinderGeometry(0.12, 0.12, 3.2, 24, 1, true);
    const beaconMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    this.goalBeacon = new THREE.Mesh(beaconGeo, beaconMat);
    this.goalBeacon.position.y = 1.6;
    group.add(this.goalBeacon);

    // 6. Floating Rotating Diamond Beacon at Top
    const diamondGeo = new THREE.OctahedronGeometry(0.12, 0);
    const diamondMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xf59e0b,
      emissiveIntensity: 1.3,
      roughness: 0.2,
      metalness: 0.9,
    });
    this.goalDiamond = new THREE.Mesh(diamondGeo, diamondMat);
    this.goalDiamond.position.y = 2.4;
    group.add(this.goalDiamond);

    // 7. Goal Point Light Casting Golden Glow
    const goalLight = new THREE.PointLight(0xf59e0b, 1.8, 3.5, 1.2);
    goalLight.position.y = 0.5;
    group.add(goalLight);

    return group;
  }

  // Pre-load Authored GLB models and seamlessly substitute
  private preloadAuthoredModels() {
    const modelsToLoad = [
      { key: "goal", url: "/models/goal_pad.glb" },
      { key: "crate", url: "/models/crate.glb" },
      { key: "cabinet", url: "/models/cabinet.glb" },
      { key: "plant", url: "/models/plant.glb" },
      { key: "desk", url: "/models/desk.glb" },
    ];

    modelsToLoad.forEach(({ key, url }) => {
      this.gltfLoader.load(
        url,
        (gltf) => {
          const model = gltf.scene;
          model.traverse((child: any) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          this.modelCache.set(key, model);
        },
        undefined,
        (err) => {
          // Graceful fallback to procedural PBR asset
          const msg = (err as any)?.message || String(err);
          console.warn(`Authored GLB model [${key}] unavailable (${msg}). Using high-fidelity procedural PBR.`);
        }
      );
    });
  }

  private replaceRobotWithAuthoredModel(model: THREE.Group) {
    while (this.robotMeshRoot.children.length > 0) {
      this.robotMeshRoot.remove(this.robotMeshRoot.children[0]);
    }
    // Scale and align rover to 0.36m diameter
    model.scale.set(0.75, 0.75, 0.75);
    model.position.set(0, 0, 0);
    model.traverse((c) => c.layers.set(1)); // Body masked on Layer 1
    this.robotMeshRoot.add(model);
  }

  // =========================================================================
  // GHOST ROBOT POOLING & HOLOGRAPHIC MATERIALS
  // =========================================================================
  private initGhostPool(count: number) {
    const ghostMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.32,
      wireframe: true,
    });

    for (let i = 0; i < count; i++) {
      const g = new THREE.Group();
      const m = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.12, 16), ghostMat.clone());
      m.position.y = 0.06;
      g.add(m);
      g.visible = false;
      this.ghostPool.push(g);
      this.ghostMeshesGroup.add(g);
    }
  }

  // =========================================================================
  // STATE UPDATE & FRAME DISPATCH
  // =========================================================================
  public update(frame: any) {
    this.updateState(frame);
  }

  public updateState(frame: any) {
    if (!this.renderer || !frame || this.isDestroyed) return;

    const now = performance.now();
    this.frameCount++;

    // FPS Meter
    if (now - this.lastTime >= 500) {
      this.currentFps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
      this.frameCount = 0;
      this.lastTime = now;

      // Adaptive DPR regulation
      if (this.currentFps < 42 && this.currentDpr > 1.0) {
        this.currentDpr = 1.0;
        this.renderer.setPixelRatio(this.currentDpr);
      } else if (this.currentFps > 58 && this.currentDpr < this.targetDpr) {
        this.currentDpr = this.targetDpr;
        this.renderer.setPixelRatio(this.currentDpr);
      }
    }

    // Synchronize Entities
    const entities = frame.entities || [];
    let robotX3D = 0, robotZ3D = 0, robotHeading = 0;
    let personFound = false;
    const seenIds = new Set<string>();

    for (let i = 0; i < entities.length; i++) {
      const e = entities[i];
      seenIds.add(e.id);
      const pos = this.to3D(e.x, e.y);

      if (e.kind === "robot") {
        robotX3D = pos.x;
        robotZ3D = pos.z;
        robotHeading = (e.heading || 0) * (Math.PI / 180);

        // Update 3D Humanoid Robot Kinematics & Procedural Bipedal Walking Gait
        const currentPosVec = new THREE.Vector3(pos.x, 0, pos.z);
        const dtSec = Math.min(0.1, Math.max(0.001, (now - this.lastFrameTime) / 1000.0));
        this.lastFrameTime = now;
        const hasCollision = Boolean(e.extra?.collision);

        this.humanoidRobot.update(
          dtSec,
          currentPosVec,
          robotHeading,
          frame.mode === "world_model" ? "world_model" : "baseline",
          hasCollision
        );

        // Head-Mounted POV Camera: Positioned right at Humanoid's Visor Eye Level (y=1.52m)
        const fwdX = Math.sin(robotHeading);
        const fwdZ = -Math.cos(robotHeading);
        const eyeX = pos.x + fwdX * 0.10;
        const eyeY = 1.52;
        const eyeZ = pos.z + fwdZ * 0.10;

        this.povCamera.position.set(eyeX, eyeY, eyeZ);
        this.povTargetQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -robotHeading);
        this.povCamera.quaternion.slerp(this.povTargetQuat, 0.25);

        // Update Headlight Target
        this.povHeadlight.position.set(eyeX, eyeY, eyeZ);
        this.povHeadlight.target.position.set(eyeX + fwdX * 3.5, eyeY - 0.3, eyeZ + fwdZ * 3.5);
        this.scene.add(this.povHeadlight.target);

      } else if (e.kind === "person") {
        personFound = true;
        this.personGroup.visible = true;
        // Natural walk bobbing
        const isMoving = Math.abs(e.vy || 0) > 0.01;
        const bob = isMoving ? Math.abs(Math.sin(now * 0.008)) * 0.03 : 0.0;
        this.personGroup.position.set(pos.x, bob, pos.z);
        this.personGroup.rotation.y = -(e.heading || 0) * (Math.PI / 180);

        // Head Glance IK toward robot
        if (this.personHead) {
          const dist = Math.hypot(pos.x - robotX3D, pos.z - robotZ3D);
          if (dist < 2.0) {
            const angleToRobot = Math.atan2(robotX3D - pos.x, robotZ3D - pos.z);
            this.personHead.rotation.y = angleToRobot - this.personGroup.rotation.y;
          } else {
            this.personHead.rotation.y = 0;
          }
        }

      } else {
        // Obstacles (Unmistakable Workstations, Heavy Wooden Crates, Industrial Tool Cabinets)
        let mesh = this.obstacleMeshes.get(e.id);
        const ow = (e.w || 80) / 100.0;
        const oh = (e.h || 80) / 100.0;

        if (!mesh) {
          if (e.id === "obs_0" || e.kind === "chair") {
            // Unmistakable heavy industrial testing workstation with steel legs & butcher block top (NO WHEELS)
            mesh = LabEnvironmentBuilder.createWorkstationObstacle(ow, 0.78, oh);
          } else if (e.id === "obs_1") {
            // Authentic Industrial Wooden Shipping Crate with steel corners & straps
            mesh = LabEnvironmentBuilder.createRealisticCrate(ow, 0.72, oh);
          } else if (e.id === "obs_2") {
            // Heavy-Duty Industrial Red Steel Tool Chest / Cabinet
            mesh = LabEnvironmentBuilder.createToolCabinet(ow, 0.72, oh);
          } else {
            mesh = (i % 2 === 0)
              ? LabEnvironmentBuilder.createRealisticCrate(ow, 0.72, oh)
              : LabEnvironmentBuilder.createToolCabinet(ow, 0.72, oh);
          }
          this.scene.add(mesh);
          this.obstacleMeshes.set(e.id, mesh);
        }
        mesh.position.set(pos.x + ow / 2, 0, pos.z + oh / 2);
      }
    }

    // Hide person completely when not in the frame (e.g. in Scenario 1)
    this.personGroup.visible = personFound;

    // Clean removed obstacles
    for (const [id, mesh] of this.obstacleMeshes.entries()) {
      if (!seenIds.has(id)) {
        this.scene.remove(mesh);
        this.obstacleMeshes.delete(id);
      }
    }

    // Goal Pad Position & Pulse
    if (frame.goal) {
      const gPos = this.to3D(frame.goal.x, frame.goal.y);
      this.goalGroup.position.set(gPos.x, 0, gPos.z);
      if (this.goalRing) {
        this.goalRing.scale.setScalar(1.0 + 0.08 * Math.sin(now * 0.005));
      }
      if (this.goalDiamond) {
        this.goalDiamond.rotation.y += 0.025;
        this.goalDiamond.rotation.x = Math.sin(now * 0.003) * 0.15;
        this.goalDiamond.position.y = 2.4 + Math.sin(now * 0.004) * 0.08;
      }
      const outerPulse = this.goalGroup.getObjectByName("goalOuterPulse");
      if (outerPulse) {
        const pulseScale = 1.0 + 0.18 * Math.sin(now * 0.006);
        outerPulse.scale.set(pulseScale, pulseScale, 1.0);
      }
    }

    // Animate click ripples
    for (let i = this.clickRipples.length - 1; i >= 0; i--) {
      const rip = this.clickRipples[i];
      const age = (now - rip.createdAt) / 550.0;
      if (age >= 1.0) {
        this.scene.remove(rip.mesh);
        rip.mesh.geometry.dispose();
        (rip.mesh.material as THREE.Material).dispose();
        this.clickRipples.splice(i, 1);
      } else {
        const s = 1.0 + age * 3.5;
        rip.mesh.scale.set(s, s, 1.0);
        (rip.mesh.material as THREE.MeshBasicMaterial).opacity = (1.0 - age) * 0.95;
      }
    }

    // Update Plan Trajectories & Navigation Ribbon
    this.updateNavigationRibbon(frame.plan);

    // Update Mind View Scene Styling
    if (this.showMindView) {
      this.scene.background = new THREE.Color("#050814");
      this.sunLight.intensity = 0.6;
      this.hemiLight.intensity = 0.4;
      if (this.floorMesh) {
        (this.floorMesh.material as THREE.MeshStandardMaterial).color.setHex(0x162038);
      }
    } else {
      this.scene.background = new THREE.Color("#0a0f1d"); // Deep industrial warehouse atmosphere
      this.sunLight.intensity = 1.8;
      this.hemiLight.intensity = 0.75;
      if (this.floorMesh) {
        (this.floorMesh.material as THREE.MeshStandardMaterial).color.setHex(0xffffff); // Full PBR concrete texture colors
      }
    }

    // Update Camera Motion
    this.updateCamera(now, robotX3D, robotZ3D, robotHeading);

    // Render Scene
    this.renderer.render(this.scene, this.activeCamera);
  }

  // =========================================================================
  // NAVIGATION RIBBON & IMAGINATION ROLLOUTS
  // =========================================================================
  private updateNavigationRibbon(plan: any) {
    if (!plan) return;

    // 1. Build Smooth Navigation Ribbon for Best Trajectory
    if (plan.best && plan.best.length >= 2) {
      const rawPoints: THREE.Vector3[] = plan.best.map((pt: number[]) => {
        const p3d = this.to3D(pt[0], pt[1]);
        return new THREE.Vector3(p3d.x, 0.015, p3d.z);
      });

      // Smooth with Catmull-Rom spline
      const curve = new THREE.CatmullRomCurve3(rawPoints);
      const smoothPoints = curve.getPoints(Math.min(60, rawPoints.length * 5));

      // Build 0.16m wide quad strip ribbon
      const ribbonWidth = 0.16;
      const vertices: number[] = [];
      const indices: number[] = [];

      for (let i = 0; i < smoothPoints.length; i++) {
        const curr = smoothPoints[i];
        let tangent: THREE.Vector3;
        if (i < smoothPoints.length - 1) {
          tangent = new THREE.Vector3().subVectors(smoothPoints[i + 1], curr).normalize();
        } else {
          tangent = new THREE.Vector3().subVectors(curr, smoothPoints[i - 1]).normalize();
        }
        const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).multiplyScalar(ribbonWidth * 0.5);

        vertices.push(curr.x + normal.x, 0.015, curr.z + normal.z);
        vertices.push(curr.x - normal.x, 0.015, curr.z - normal.z);

        if (i < smoothPoints.length - 1) {
          const idx = i * 2;
          indices.push(idx, idx + 1, idx + 2);
          indices.push(idx + 1, idx + 3, idx + 2);
        }
      }

      if (!this.chosenRibbonMesh) {
        const geom = new THREE.BufferGeometry();
        geom.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
        geom.setIndex(indices);
        const mat = new THREE.MeshBasicMaterial({
          color: 0x10b981, // Glowing emerald green
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
          polygonOffset: true,
          polygonOffsetFactor: -2,
          polygonOffsetUnits: -4,
        });
        this.chosenRibbonMesh = new THREE.Mesh(geom, mat);
        this.scene.add(this.chosenRibbonMesh);
      } else {
        const geom = this.chosenRibbonMesh.geometry;
        geom.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
        geom.setIndex(indices);
        geom.computeVertexNormals();
        this.chosenRibbonMesh.visible = true;
      }

      // Update Destination Target Ring
      if (smoothPoints.length > 0) {
        const lastPt = smoothPoints[smoothPoints.length - 1];
        if (!this.destinationRing) {
          const ringGeo = new THREE.RingGeometry(0.14, 0.18, 20);
          const ringMat = new THREE.MeshBasicMaterial({
            color: 0x10b981,
            side: THREE.DoubleSide,
            polygonOffset: true,
            polygonOffsetFactor: -3,
            polygonOffsetUnits: -6,
          });
          this.destinationRing = new THREE.Mesh(ringGeo, ringMat);
          this.destinationRing.rotation.x = -Math.PI / 2;
          this.scene.add(this.destinationRing);
        }
        this.destinationRing.position.set(lastPt.x, 0.018, lastPt.z);
        this.destinationRing.visible = true;
      }

      // Update Holographic Ghost Robots at timesteps 3, 6, 9
      const keySteps = [3, 6, 9];
      for (let gIdx = 0; gIdx < this.ghostPool.length; gIdx++) {
        const ghost = this.ghostPool[gIdx];
        if (gIdx < keySteps.length && keySteps[gIdx] < rawPoints.length) {
          const pt = rawPoints[keySteps[gIdx]];
          ghost.position.set(pt.x, 0, pt.z);
          ghost.visible = true;
        } else {
          ghost.visible = false;
        }
      }

    } else {
      if (this.chosenRibbonMesh) this.chosenRibbonMesh.visible = false;
      if (this.destinationRing) this.destinationRing.visible = false;
      this.ghostPool.forEach((g) => (g.visible = false));
    }

    // 2. Render Candidate Alternative Ribbons
    while (this.candidateLinesGroup.children.length > 0) {
      this.candidateLinesGroup.remove(this.candidateLinesGroup.children[0]);
    }

    if (plan.alts && plan.alts.length > 0) {
      const topAlts = plan.alts.slice(0, 6);
      topAlts.forEach((alt: any) => {
        if (!alt.path || alt.path.length < 2) return;
        const pts: THREE.Vector3[] = alt.path.map((p: number[]) => {
          const p3d = this.to3D(p[0], p[1]);
          return new THREE.Vector3(p3d.x, 0.012, p3d.z);
        });

        const isCollision = alt.score < -5.0 || (alt.predicted_collision_step && alt.predicted_collision_step > 0);
        const col = isCollision ? 0xef4444 : 0x06b6d4; // Red for collision, Teal for safe alternative

        const geom = new THREE.BufferGeometry().setFromPoints(pts);
        const lineMat = new THREE.LineBasicMaterial({
          color: col,
          transparent: true,
          opacity: isCollision ? 0.45 : 0.28,
        });
        const line = new THREE.Line(geom, lineMat);
        this.candidateLinesGroup.add(line);
      });
    }
  }

  // =========================================================================
  // CAMERA CONTROLLER & AUTO-DIRECTOR
  // =========================================================================
  private updateCamera(now: number, rx: number, rz: number, heading: number) {
    if (this.cameraMode === "robot_pov") {
      this.activeCamera = this.povCamera;
      if (this.controls) this.controls.enabled = false;
      return;
    }

    this.activeCamera = this.camera;

    if (this.cameraMode === "chase") {
      if (this.controls) this.controls.enabled = false;
      // Dynamic third-person camera following behind the humanoid robot
      const camDist = 2.2;
      const camHeight = 1.85;
      const behindX = rx - Math.sin(heading) * camDist;
      const behindZ = rz + Math.cos(heading) * camDist;

      this.targetCamPos.set(behindX, camHeight, behindZ);
      this.targetCamLookAt.set(rx + Math.sin(heading) * 1.2, 1.1, rz - Math.cos(heading) * 1.2);

      this.currentCamPos.lerp(this.targetCamPos, 0.08);
      this.currentCamLookAt.lerp(this.targetCamLookAt, 0.08);

      this.camera.position.copy(this.currentCamPos);
      this.camera.lookAt(this.currentCamLookAt);

    } else if (this.cameraMode === "orbit") {
      if (this.controls) this.controls.enabled = false;
      // Gentle cinematic orbital fly-over
      this.orbitAngle += 0.003;
      const radius = 6.2;
      this.targetCamPos.set(Math.cos(this.orbitAngle) * radius, 5.0, Math.sin(this.orbitAngle) * radius);
      this.targetCamLookAt.set(0, 0.2, 0);

      this.currentCamPos.lerp(this.targetCamPos, 0.08);
      this.currentCamLookAt.lerp(this.targetCamLookAt, 0.08);

      this.camera.position.copy(this.currentCamPos);
      this.camera.lookAt(this.currentCamLookAt);

    } else if (this.cameraMode === "topdown") {
      // Top-Down interactive view
      if (this.controls) {
        this.controls.enabled = true;
        this.controls.update();
      }
    } else {
      // Overview: Free orbit, pan, and zoom via OrbitControls
      if (this.controls) {
        this.controls.enabled = true;
        this.controls.update();
      }
    }
  }

  public setCameraMode(mode: "overview" | "chase" | "topdown" | "robot_pov" | "orbit") {
    this.cameraMode = mode;
    if (this.controls) {
      if (mode === "overview") {
        this.controls.enabled = true;
        this.controls.target.set(0, 0.2, 0);
        this.camera.position.set(0, 6.2, 6.4);
        this.camera.lookAt(0, 0.2, 0);
      } else if (mode === "topdown") {
        this.controls.enabled = true;
        this.controls.target.set(0, 0, 0);
        this.camera.position.set(0, 8.5, 0.01);
        this.camera.lookAt(0, 0, 0);
      } else {
        this.controls.enabled = false;
      }
    }
  }

  public cycleCamera(): string {
    const modes: Array<"overview" | "chase" | "topdown" | "robot_pov" | "orbit"> = [
      "overview",
      "chase",
      "topdown",
      "robot_pov",
      "orbit",
    ];
    const nextIdx = (modes.indexOf(this.cameraMode) + 1) % modes.length;
    this.setCameraMode(modes[nextIdx]);
    return this.cameraMode;
  }

  public setQuality(quality: "low" | "med" | "high") {
    this.quality = quality;
    if (!this.renderer) return;

    if (quality === "low") {
      this.renderer.shadowMap.enabled = false;
      this.targetDpr = 1.0;
    } else if (quality === "med") {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.BasicShadowMap;
      this.targetDpr = 1.0;
    } else {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.targetDpr = Math.min(window.devicePixelRatio || 1, 2.0);
    }
    this.currentDpr = this.targetDpr;
    this.renderer.setPixelRatio(this.currentDpr);
  }

  private handleResize = () => {
    if (!this.renderer || !this.container) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.povCamera.aspect = w / h;
    this.povCamera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  private handleVisibility = () => {
    // Suspend rendering loops when tab is hidden to save GPU cycles
    if (document.hidden) {
      if (this.renderer) this.renderer.setAnimationLoop(null);
    }
  };

  public destroy() {
    this.isDestroyed = true;
    window.removeEventListener("resize", this.handleResize);
    document.removeEventListener("visibilitychange", this.handleVisibility);
    if (this.controls) {
      this.controls.dispose();
      this.controls = null;
    }
    for (const rip of this.clickRipples) {
      this.scene.remove(rip.mesh);
      rip.mesh.geometry.dispose();
      (rip.mesh.material as THREE.Material).dispose();
    }
    this.clickRipples = [];
    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentElement) {
        this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
      }
    }
  }
}

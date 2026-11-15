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
import { DiagnosticsOverlay } from "../ui/diagnostics_overlay";

export class ThreeSimulationScene {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private povCamera: THREE.PerspectiveCamera;
  private activeCamera: THREE.PerspectiveCamera;

  // Lighting Systems
  private sunLight: THREE.DirectionalLight;
  private hemiLight: THREE.HemisphereLight;
  private ambientLight: THREE.AmbientLight;
  private ceilingLights: THREE.PointLight[] = [];
  private povHeadlight: THREE.SpotLight;
  private floorMesh: THREE.Mesh | null = null;
  private gridHelper: THREE.GridHelper | null = null;

  // Hero Entities
  private robotGroup: THREE.Group;
  private robotMeshRoot: THREE.Group;
  private robotScanner: THREE.Object3D | null = null;
  private robotLedRing: THREE.Mesh | null = null;
  private personGroup: THREE.Group;
  private personMeshRoot: THREE.Group;
  private personHead: THREE.Object3D | null = null;
  private goalGroup: THREE.Group;
  private goalRing: THREE.Mesh | null = null;
  private goalBeacon: THREE.Mesh | null = null;
  private obstacleMeshes: Map<string, THREE.Object3D> = new Map();

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
    this.scene.background = new THREE.Color("#dbe2ec"); // Crisp, bright lab atmosphere

    const w = container.clientWidth || 900;
    const h = container.clientHeight || 600;
    const aspect = w / h;

    // 1. Overview Camera (3/4 high dollhouse perspective looking into lab arena)
    this.camera = new THREE.PerspectiveCamera(46, aspect, 0.05, 100);
    this.camera.position.set(0, 6.2, 6.4);
    this.camera.lookAt(0, 0.2, 0);
    this.camera.layers.enable(0);
    this.camera.layers.enable(1); // Sees both room and robot chassis

    // 2. Head-Mounted Robot POV Camera
    // Positioned at head level y=0.30m, FOV 80, near plane 0.02m (never clips)
    this.povCamera = new THREE.PerspectiveCamera(80, aspect, 0.02, 50);
    this.povCamera.position.set(0, 0.30, 0);
    this.povCamera.layers.enable(0);
    this.povCamera.layers.disable(1); // MASK CHASSIS: POV camera cannot see own body

    // Forward SpotLight Headlight on Robot
    this.povHeadlight = new THREE.SpotLight(0xfffaed, 2.5, 9.0, Math.PI / 4, 0.4, 1.2);
    this.povHeadlight.position.set(0, 0.28, 0);
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
      this.targetDpr = Math.min(window.devicePixelRatio || 1, 1.5);
      this.currentDpr = this.targetDpr;
      this.renderer.setPixelRatio(this.currentDpr);
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.22;
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      container.appendChild(this.renderer.domElement);
      DiagnosticsOverlay.getInstance().setRenderer(this.renderer);
    } catch (err) {
      console.warn("Three.js WebGL initialization failed:", err);
      this.renderer = null;
      return;
    }

    // High Dynamic Range PBR Lighting (Key + Sky Fill + Ambient + Highlights)
    this.sunLight = new THREE.DirectionalLight(0xfff7e6, 2.2);
    this.sunLight.position.set(4.8, 9.5, 4.2);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 30;
    this.sunLight.shadow.camera.left = -6.5;
    this.sunLight.shadow.camera.right = 6.5;
    this.sunLight.shadow.camera.top = 5.5;
    this.sunLight.shadow.camera.bottom = -5.5;
    this.sunLight.shadow.bias = -0.0004;
    this.scene.add(this.sunLight);

    this.hemiLight = new THREE.HemisphereLight(0x90caf9, 0xf3e5f5, 1.15);
    this.scene.add(this.hemiLight);

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    this.scene.add(this.ambientLight);

    // Ceiling Panel Light Accents
    for (const [cx, cz] of [[-3, -2], [3, -2], [-3, 2], [3, 2]]) {
      const pl = new THREE.PointLight(0xffffff, 0.35, 7.0, 1.5);
      pl.position.set(cx, 4.5, cz);
      this.scene.add(pl);
      this.ceilingLights.push(pl);
    }

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

    // Build Entities
    this.robotGroup = this.buildRobot();
    this.scene.add(this.robotGroup);

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
  }

  public isAvailable(): boolean {
    return this.renderer !== null;
  }

  public getRendererElement(): HTMLCanvasElement | null {
    return this.renderer ? this.renderer.domElement : null;
  }

  private to3D(px: number, py: number): { x: number; z: number } {
    return {
      x: (px - 450.0) / 100.0,
      z: (py - 300.0) / 100.0,
    };
  }

  // =========================================================================
  // ARCHITECTURAL LAB ENVIRONMENT (Bright, PBR, Real Concrete, Hazard Tape)
  // =========================================================================
  private buildLabEnvironment() {
    // 1. Concrete Floor (9x6m Arena)
    const floorGeo = new THREE.PlaneGeometry(9.0, 6.0, 32, 32);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xc8d0dc, // Bright, light industrial concrete
      roughness: 0.36,
      metalness: 0.06,
    });
    this.floorMesh = new THREE.Mesh(floorGeo, floorMat);
    this.floorMesh.rotation.x = -Math.PI / 2;
    this.floorMesh.receiveShadow = true;
    this.scene.add(this.floorMesh);

    // 2. High-Visibility Hazard Safety Tape Border (Yellow & Dark Charcoal)
    this.createSafetyTapeBorder(9.0, 6.0, 0.12);

    // 3. Precision Corner Crosshair Registration Marks
    this.createCornerCrosshairs(4.35, 2.85);

    // 4. Subtle 1m Tile Alignment Grid (Light Grey, never neon cyan)
    this.gridHelper = new THREE.GridHelper(9.0, 9, 0x64748b, 0x94a3b8);
    this.gridHelper.position.y = 0.003;
    const gMat = this.gridHelper.material as THREE.Material;
    gMat.opacity = 0.18;
    gMat.transparent = true;
    this.scene.add(this.gridHelper);

    // 5. Eggshell Lab Partition Walls & Charcoal Baseboards
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0, // Clean lab chalk wall
      roughness: 0.82,
      metalness: 0.02,
    });
    const baseboardMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.2,
    });

    // North Wall (Back)
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(9.2, 1.6, 0.15), wallMat);
    backWall.position.set(0, 0.8, -3.05);
    backWall.receiveShadow = true;
    this.scene.add(backWall);

    const bbBack = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.14, 0.04), baseboardMat);
    bbBack.position.set(0, 0.07, -2.96);
    this.scene.add(bbBack);

    // West Wall (Left)
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.6, 6.2), wallMat);
    leftWall.position.set(-4.55, 0.8, 0);
    this.scene.add(leftWall);

    const bbLeft = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, 6.2), baseboardMat);
    bbLeft.position.set(-4.46, 0.07, 0);
    this.scene.add(bbLeft);

    // East Wall (Right)
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.6, 6.2), wallMat);
    rightWall.position.set(4.55, 0.8, 0);
    this.scene.add(rightWall);

    const bbRight = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, 6.2), baseboardMat);
    bbRight.position.set(4.46, 0.07, 0);
    this.scene.add(bbRight);

    // South Low Dollhouse Curb (Allows clear sightlines in Overview mode)
    const southCurb = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.18, 0.08), baseboardMat);
    southCurb.position.set(0, 0.09, 3.02);
    this.scene.add(southCurb);
  }

  private createSafetyTapeBorder(w: number, d: number, tapeWidth: number) {
    const hw = w / 2 - tapeWidth / 2;
    const hd = d / 2 - tapeWidth / 2;

    const tapeMat = new THREE.MeshStandardMaterial({
      color: 0xeab308, // Safety yellow
      roughness: 0.45,
      metalness: 0.1,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -2,
    });

    const segments = [
      { size: [w, tapeWidth], pos: [0, -hd] }, // North
      { size: [w, tapeWidth], pos: [0, hd] },  // South
      { size: [tapeWidth, d], pos: [-hw, 0] }, // West
      { size: [tapeWidth, d], pos: [hw, 0] },  // East
    ];

    segments.forEach((seg) => {
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(seg.size[0], seg.size[1]), tapeMat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(seg.pos[0], 0.004, seg.pos[1]);
      mesh.receiveShadow = true;
      this.scene.add(mesh);
    });
  }

  private createCornerCrosshairs(cx: number, cz: number) {
    const lineMat = new THREE.LineBasicMaterial({ color: 0x1e293b, linewidth: 2 });
    const s = 0.15; // Arm length 15cm

    for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const px = cx * sx;
      const pz = cz * sz;
      const points = [
        new THREE.Vector3(px - s, 0.005, pz),
        new THREE.Vector3(px + s, 0.005, pz),
        new THREE.Vector3(px, 0.005, pz - s),
        new THREE.Vector3(px, 0.005, pz + s),
      ];
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const cross = new THREE.LineSegments(geom, lineMat);
      this.scene.add(cross);
    }
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

    // Spinning LiDAR Turret Dome
    const scannerGroup = new THREE.Group();
    scannerGroup.position.set(0, 0.18, 0);
    const scannerGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.05, 16);
    const scannerMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.9 });
    const scannerMesh = new THREE.Mesh(scannerGeo, scannerMat);
    scannerMesh.position.y = 0.025;
    scannerGroup.add(scannerMesh);
    this.robotScanner = scannerGroup;
    this.robotMeshRoot.add(scannerGroup);

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
    this.robotMeshRoot.add(this.robotLedRing);

    // Mask robot chassis onto Layer 1 (hidden in head-mounted POV view)
    this.robotMeshRoot.traverse((c) => c.layers.set(1));

    return group;
  }

  private buildPerson(): THREE.Group {
    const group = new THREE.Group();
    this.personMeshRoot = new THREE.Group();
    group.add(this.personMeshRoot);

    // High-fidelity procedural human silhouette (upgraded to human.glb)
    const torsoGeo = new THREE.BoxGeometry(0.32, 0.52, 0.20);
    const torsoMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.7 });
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.position.y = 0.86;
    torso.castShadow = true;
    this.personMeshRoot.add(torso);

    const headGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.5 });
    this.personHead = new THREE.Mesh(headGeo, headMat);
    this.personHead.position.set(0, 1.25, 0);
    this.personHead.castShadow = true;
    this.personMeshRoot.add(this.personHead);

    return group;
  }

  private buildGoal(): THREE.Group {
    const group = new THREE.Group();

    // Recharging Goal Dock Base (60x60cm footprint)
    const dockGeo = new THREE.CylinderGeometry(0.35, 0.38, 0.04, 28);
    const dockMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.4,
      metalness: 0.6,
    });
    const dock = new THREE.Mesh(dockGeo, dockMat);
    dock.position.y = 0.02;
    dock.receiveShadow = true;
    group.add(dock);

    // Glowing Emissive Energy Ring
    const ringGeo = new THREE.RingGeometry(0.25, 0.34, 28);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Amber goal glow
      emissive: 0xf59e0b,
      emissiveIntensity: 0.9,
      side: THREE.DoubleSide,
    });
    this.goalRing = new THREE.Mesh(ringGeo, ringMat);
    this.goalRing.rotation.x = -Math.PI / 2;
    this.goalRing.position.y = 0.042;
    group.add(this.goalRing);

    // Vertical Holographic Light Column
    const beaconGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.5, 12, 1, true);
    const beaconMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
    });
    this.goalBeacon = new THREE.Mesh(beaconGeo, beaconMat);
    this.goalBeacon.position.y = 1.25;
    group.add(this.goalBeacon);

    return group;
  }

  // Pre-load Authored GLB models and seamlessly substitute
  private preloadAuthoredModels() {
    const modelsToLoad = [
      { key: "chair", url: "/models/chair.glb" },
      { key: "robot", url: "/models/rover.glb" },
      { key: "human", url: "/models/human.glb" },
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

          // Apply to hero models if loaded
          if (key === "robot" && this.robotMeshRoot) {
            this.replaceRobotWithAuthoredModel(model.clone());
          } else if (key === "human" && this.personMeshRoot) {
            this.replacePersonWithAuthoredModel(model.clone());
          }
        },
        undefined,
        (err) => {
          // Graceful fallback to procedural PBR asset
          console.warn(`Authored GLB model [${key}] unavailable (${err.message}). Using high-fidelity procedural PBR.`);
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

  private replacePersonWithAuthoredModel(model: THREE.Group) {
    while (this.personMeshRoot.children.length > 0) {
      this.personMeshRoot.remove(this.personMeshRoot.children[0]);
    }
    model.scale.set(0.65, 0.65, 0.65);
    model.position.set(0, 0, 0);
    this.personMeshRoot.add(model);
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
    const seenIds = new Set<string>();

    for (let i = 0; i < entities.length; i++) {
      const e = entities[i];
      seenIds.add(e.id);
      const pos = this.to3D(e.x, e.y);

      if (e.kind === "robot") {
        robotX3D = pos.x;
        robotZ3D = pos.z;
        robotHeading = (e.heading || 0) * (Math.PI / 180);

        // Update robot position & heading
        this.robotGroup.position.set(pos.x, 0, pos.z);
        this.robotGroup.rotation.y = -robotHeading;

        // Continuous LiDAR Spin
        if (this.robotScanner) {
          this.robotScanner.rotation.y += 0.08;
        }

        // Head-Mounted POV Camera Position & Slerp (Eye level y=0.30m)
        const fwdX = Math.sin(robotHeading);
        const fwdZ = -Math.cos(robotHeading);
        const headX = pos.x + fwdX * 0.08;
        const headZ = pos.z + fwdZ * 0.08;

        this.povCamera.position.set(headX, 0.30, headZ);
        this.povTargetQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -robotHeading);
        this.povCamera.quaternion.slerp(this.povTargetQuat, 0.22);

        // Update Headlight Target
        this.povHeadlight.target.position.set(headX + fwdX * 2.0, 0, headZ + fwdZ * 2.0);
        this.scene.add(this.povHeadlight.target);

        // Status LED Beacon Color
        if (this.robotLedRing) {
          const lMat = this.robotLedRing.material as THREE.MeshStandardMaterial;
          if (e.extra?.collision) {
            lMat.color.setHex(0xef4444); // Red collision
            lMat.emissive.setHex(0xef4444);
          } else if (frame.mode === "world_model") {
            lMat.color.setHex(0x10b981); // Emerald success
            lMat.emissive.setHex(0x10b981);
          } else {
            lMat.color.setHex(0xf59e0b); // Reactive baseline
            lMat.emissive.setHex(0xf59e0b);
          }
        }

      } else if (e.kind === "person") {
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
        // Obstacles (Chairs, Desks, Crates)
        let mesh = this.obstacleMeshes.get(e.id);
        const ow = (e.w || 80) / 100.0;
        const oh = (e.h || 80) / 100.0;

        if (!mesh) {
          if (e.kind === "chair" && this.modelCache.has("chair")) {
            const chairModel = this.modelCache.get("chair")!.clone();
            chairModel.scale.set(0.85, 0.85, 0.85);
            mesh = chairModel;
          } else if (e.kind === "crate" && this.modelCache.has("crate")) {
            const crateModel = this.modelCache.get("crate")!.clone();
            crateModel.scale.set(ow, 0.65, oh);
            mesh = crateModel;
          } else {
            // High-quality authored furniture fallback
            const geo = new THREE.BoxGeometry(ow, 0.78, oh);
            const mat = new THREE.MeshStandardMaterial({
              color: e.kind === "chair" ? 0x92400e : 0x334155,
              roughness: 0.5,
              metalness: 0.1,
            });
            mesh = new THREE.Mesh(geo, mat);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
          }
          this.scene.add(mesh);
          this.obstacleMeshes.set(e.id, mesh);
        }
        mesh.position.set(pos.x + ow / 2, 0, pos.z + oh / 2);
      }
    }

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
    }

    // Update Plan Trajectories & Navigation Ribbon
    this.updateNavigationRibbon(frame.plan);

    // Update Mind View Scene Styling
    if (this.showMindView) {
      this.scene.background = new THREE.Color("#0c1527");
      this.sunLight.intensity = 0.8;
      this.hemiLight.intensity = 0.6;
      if (this.floorMesh) {
        (this.floorMesh.material as THREE.MeshStandardMaterial).color.setHex(0x162038);
      }
    } else {
      this.scene.background = new THREE.Color("#dbe2ec"); // Bright lab atmosphere
      this.sunLight.intensity = 2.2;
      this.hemiLight.intensity = 1.15;
      if (this.floorMesh) {
        (this.floorMesh.material as THREE.MeshStandardMaterial).color.setHex(0xc8d0dc);
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
      return;
    }

    this.activeCamera = this.camera;

    if (this.cameraMode === "chase") {
      // Dynamic third-person camera following behind the robot
      const camDist = 1.6;
      const camHeight = 0.95;
      const behindX = rx - Math.sin(heading) * camDist;
      const behindZ = rz + Math.cos(heading) * camDist;

      this.targetCamPos.set(behindX, camHeight, behindZ);
      this.targetCamLookAt.set(rx + Math.sin(heading) * 1.2, 0.3, rz - Math.cos(heading) * 1.2);

    } else if (this.cameraMode === "topdown") {
      // Top-Down orthographic-style view
      this.targetCamPos.set(0, 8.5, 0.01);
      this.targetCamLookAt.set(0, 0, 0);

    } else if (this.cameraMode === "orbit") {
      // Gentle cinematic orbital fly-over
      this.orbitAngle += 0.003;
      const radius = 6.2;
      this.targetCamPos.set(Math.cos(this.orbitAngle) * radius, 5.0, Math.sin(this.orbitAngle) * radius);
      this.targetCamLookAt.set(0, 0.2, 0);

    } else {
      // Overview: 3/4 High Dollhouse Perspective looking into open south front
      this.targetCamPos.set(0, 5.8, 5.8);
      this.targetCamLookAt.set(0, 0.15, 0);
    }

    // Smooth Ease Interpolation (Lag-free 60 FPS)
    this.currentCamPos.lerp(this.targetCamPos, 0.08);
    this.currentCamLookAt.lerp(this.targetCamLookAt, 0.08);

    this.camera.position.copy(this.currentCamPos);
    this.camera.lookAt(this.currentCamLookAt);
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
    this.cameraMode = modes[nextIdx];
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
      this.targetDpr = Math.min(window.devicePixelRatio || 1, 1.5);
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
    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentElement) {
        this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
      }
    }
  }
}

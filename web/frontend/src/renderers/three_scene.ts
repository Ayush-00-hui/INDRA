/**
 * Production Three.js 3D Simulation Scene (v5.0).
 * Features:
 *  - Head-mounted Robot POV camera (y=0.30m, FOV 80, near 0.02) with quaternion slerp
 *  - Layer-based robot chassis masking (body invisible in POV view)
 *  - Memory-leak free geometry pooling and disposal
 *  - Never-black Mind View (deep navy #080e1a with visible grid & ambient fill)
 *  - 5 Unified Camera Modes (Overview, Chase, Top-down, Robot POV, Cinematic)
 *  - Adaptive DPR and performance scaling
 */

import * as THREE from "three";
import { DiagnosticsOverlay } from "../ui/diagnostics_overlay";

export class ThreeSimulationScene {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private povCamera: THREE.PerspectiveCamera;
  private activeCamera: THREE.PerspectiveCamera;

  // Lighting
  private sunLight: THREE.DirectionalLight;
  private hemiLight: THREE.HemisphereLight;
  private povHeadlight: THREE.PointLight;
  private floorMesh: THREE.Mesh;
  private gridHelper: THREE.GridHelper;

  // Scene entities
  private robotGroup: THREE.Group;
  private robotEyeLight: THREE.PointLight;
  private personMesh: THREE.Group;
  private personHead: THREE.Mesh;
  private goalPad: THREE.Group;
  private goalRing: THREE.Mesh;
  private obstacleMeshes: Map<string, THREE.Object3D> = new Map();

  // Pooled MPC Visuals (Zero allocation per-frame)
  private candidateLines: THREE.LineSegments | null = null;
  private chosenRibbon: THREE.Mesh | null = null;
  private ghostPool: THREE.Mesh[] = [];
  private ghostMeshesGroup: THREE.Group;
  private hitboxesRoot: THREE.Group;

  // Camera & Smoothing
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
  private lowFpsCounter: number = 0;
  public currentFps: number = 60;
  private isDestroyed: boolean = false;

  constructor(container: HTMLElement) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#0b0f19");

    const w = container.clientWidth || 900;
    const h = container.clientHeight || 600;
    const aspect = w / h;

    // 1. Primary Orbit / Overview Camera
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.05, 100);
    this.camera.position.set(0, 6.0, 6.2);
    this.camera.lookAt(0, 0.2, 0);
    this.camera.layers.enable(0);
    this.camera.layers.enable(1); // Sees both environment and robot body

    // 2. Head-Mounted Robot POV Camera
    // Placed at y=0.30m (head level), FOV 80, near 0.02m (never clips)
    this.povCamera = new THREE.PerspectiveCamera(80, aspect, 0.02, 50);
    this.povCamera.position.set(0, 0.30, 0);
    this.povCamera.layers.enable(0);
    this.povCamera.layers.disable(1); // MASK ROBOT BODY: POV camera never renders robot's own chassis!

    // Attach headlight to POV camera
    this.povHeadlight = new THREE.PointLight(0xfffaed, 1.8, 8.0, 1.5);
    this.povHeadlight.position.set(0, 0, -0.1);
    this.povCamera.add(this.povHeadlight);
    this.scene.add(this.povCamera);

    this.activeCamera = this.camera;

    // Initialize WebGLRenderer with high-performance parameters
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
      this.renderer.toneMappingExposure = 1.15;
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      container.appendChild(this.renderer.domElement);
      DiagnosticsOverlay.getInstance().setRenderer(this.renderer);
    } catch (err) {
      console.warn("Three.js WebGL initialization failed:", err);
      this.renderer = null;
      return;
    }

    // Lighting
    this.hemiLight = new THREE.HemisphereLight(0xddeeff, 0x111624, 0.8);
    this.scene.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight(0xffffff, 1.3);
    this.sunLight.position.set(4, 9, 5);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 1024;
    this.sunLight.shadow.mapSize.height = 1024;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 25;
    this.sunLight.shadow.camera.left = -6;
    this.sunLight.shadow.camera.right = 6;
    this.sunLight.shadow.camera.top = 5;
    this.sunLight.shadow.camera.bottom = -5;
    this.scene.add(this.sunLight);

    // Ghost robots root
    this.ghostMeshesGroup = new THREE.Group();
    this.scene.add(this.ghostMeshesGroup);
    this.initGhostPool(12);

    // Hitbox debug overlay root
    this.hitboxesRoot = new THREE.Group();
    this.scene.add(this.hitboxesRoot);

    // Build Environment Geometry
    this.buildRoom();

    this.robotGroup = this.buildRobot();
    this.scene.add(this.robotGroup);

    this.personMesh = this.buildPerson();
    this.scene.add(this.personMesh);

    this.goalPad = this.buildGoal();
    this.scene.add(this.goalPad);

    window.addEventListener("resize", this.handleResize);
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

  private buildRoom() {
    // 9x6m Floor plane
    const floorGeo = new THREE.PlaneGeometry(9.0, 6.0);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x172030,
      roughness: 0.7,
      metalness: 0.2,
    });
    this.floorMesh = new THREE.Mesh(floorGeo, floorMat);
    this.floorMesh.rotation.x = -Math.PI / 2;
    this.floorMesh.receiveShadow = true;
    this.scene.add(this.floorMesh);

    // Grid Overlay (Ensures Mind View is never pitch black)
    this.gridHelper = new THREE.GridHelper(9.0, 18, 0x00e5ff, 0x1f2e48);
    this.gridHelper.position.y = 0.005;
    this.gridHelper.material.opacity = 0.25;
    this.gridHelper.material.transparent = true;
    this.scene.add(this.gridHelper);

    // Perimeter Walls
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85 });
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(9.0, 1.2, 0.1), wallMat);
    backWall.position.set(0, 0.6, -3.0);
    backWall.receiveShadow = true;
    this.scene.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 6.0), wallMat);
    leftWall.position.set(-4.5, 0.6, 0);
    this.scene.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.2, 6.0), wallMat);
    rightWall.position.set(4.5, 0.6, 0);
    this.scene.add(rightWall);
  }

  private buildRobot(): THREE.Group {
    const group = new THREE.Group();

    // Chassis Cylinder (Radius 0.18m, Height 0.18m)
    const bodyGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.18, 24);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.8,
      roughness: 0.25,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.09;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Upper Top Dome (Chamfered look)
    const domeGeo = new THREE.CylinderGeometry(0.14, 0.17, 0.06, 24);
    const domeMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.6,
      roughness: 0.3,
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.y = 0.21;
    group.add(dome);

    // Front Visor / Sensor Eye
    const eyeGeo = new THREE.BoxGeometry(0.12, 0.035, 0.06);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x00ff9d });
    const eye = new THREE.Mesh(eyeGeo, eyeMat);
    eye.position.set(0, 0.21, -0.15);
    group.add(eye);

    // Eye LED Glow Light
    this.robotEyeLight = new THREE.PointLight(0x00ff9d, 0.8, 1.5);
    this.robotEyeLight.position.set(0, 0.21, -0.18);
    group.add(this.robotEyeLight);

    // Put robot body meshes on Layer 1 so POV camera can cull them
    group.traverse((child) => {
      child.layers.set(1);
    });

    return group;
  }

  private buildPerson(): THREE.Group {
    const group = new THREE.Group();

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.45, 12);
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const legL = new THREE.Mesh(legGeo, pantsMat);
    legL.position.set(-0.08, 0.225, 0);
    const legR = new THREE.Mesh(legGeo, pantsMat);
    legR.position.set(0.08, 0.225, 0);
    group.add(legL);
    group.add(legR);

    // Torso (Jacket)
    const torsoGeo = new THREE.BoxGeometry(0.32, 0.45, 0.18);
    const torsoMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.6 });
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.position.y = 0.65;
    torso.castShadow = true;
    group.add(torso);

    // Head
    const headGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.5 });
    this.personHead = new THREE.Mesh(headGeo, headMat);
    this.personHead.position.y = 0.96;
    this.personHead.castShadow = true;
    group.add(this.personHead);

    group.position.set(100, 0, 100); // Offscreen initially
    return group;
  }

  private buildGoal(): THREE.Group {
    const group = new THREE.Group();

    // Base Pad Disc
    const padGeo = new THREE.CylinderGeometry(0.35, 0.38, 0.03, 24);
    const padMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.7 });
    const pad = new THREE.Mesh(padGeo, padMat);
    pad.position.y = 0.015;
    pad.receiveShadow = true;
    group.add(pad);

    // Glowing Neon Ring
    const ringGeo = new THREE.RingGeometry(0.24, 0.32, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00ff9d, side: THREE.DoubleSide });
    this.goalRing = new THREE.Mesh(ringGeo, ringMat);
    this.goalRing.rotation.x = -Math.PI / 2;
    this.goalRing.position.y = 0.032;
    group.add(this.goalRing);

    // Floating Diamond Beacon
    const diamGeo = new THREE.OctahedronGeometry(0.12, 0);
    const diamMat = new THREE.MeshBasicMaterial({ color: 0x00ff9d, wireframe: true });
    const diam = new THREE.Mesh(diamGeo, diamMat);
    diam.position.y = 0.45;
    group.add(diam);

    return group;
  }

  private initGhostPool(count: number) {
    const geo = new THREE.CylinderGeometry(0.18, 0.18, 0.12, 16);
    for (let i = 0; i < count; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0x00e5ff,
        transparent: true,
        opacity: 0.35,
        wireframe: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.visible = false;
      this.ghostPool.push(mesh);
      this.ghostMeshesGroup.add(mesh);
    }
  }

  public update(frame: any) {
    if (!frame || !this.renderer || this.isDestroyed) return;
    if (document.hidden) return; // Skip work when backgrounded

    const now = performance.now();
    this.frameCount++;
    DiagnosticsOverlay.getInstance().tick();

    // Dynamic FPS & Adaptive DPR Check
    if (now - this.lastTime >= 1000) {
      this.currentFps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
      this.frameCount = 0;
      this.lastTime = now;

      // Adaptive DPR regulation: drop on low FPS, restore on high FPS
      if (this.currentFps < 38 && this.currentDpr > 1.0) {
        this.currentDpr = 1.0;
        this.renderer.setPixelRatio(this.currentDpr);
      } else if (this.currentFps > 56 && this.currentDpr < this.targetDpr) {
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

        // Update robot chassis position & heading
        this.robotGroup.position.set(pos.x, 0, pos.z);
        this.robotGroup.rotation.y = -robotHeading;

        // Head-Mounted POV Camera position & orientation
        // Placed at head level y=0.30m, offset slightly forward by 0.08m
        const fwdX = Math.sin(robotHeading);
        const fwdZ = -Math.cos(robotHeading);
        const headX = pos.x + fwdX * 0.08;
        const headZ = pos.z + fwdZ * 0.08;

        this.povCamera.position.set(headX, 0.30, headZ);
        this.povTargetQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -robotHeading);
        this.povCamera.quaternion.slerp(this.povTargetQuat, 0.18);

        // Eye LED Indicator
        if (e.extra?.status_led === "red") {
          this.robotEyeLight.color.setHex(0xff3333);
        } else if (frame.mode === "world_model") {
          this.robotEyeLight.color.setHex(0x00e5ff);
        } else {
          this.robotEyeLight.color.setHex(0x00ff9d);
        }

      } else if (e.kind === "person") {
        this.personMesh.position.set(pos.x, 0, pos.z);
        this.personMesh.rotation.y = -(e.heading || 0) * (Math.PI / 180);

        // Head Glance IK: Rotate head toward robot when within 1.8m
        const dist = Math.hypot(pos.x - robotX3D, pos.z - robotZ3D);
        if (dist < 1.8) {
          const angleToRobot = Math.atan2(robotX3D - pos.x, robotZ3D - pos.z);
          this.personHead.rotation.y = angleToRobot - this.personMesh.rotation.y;
        } else {
          this.personHead.rotation.y = 0;
        }

      } else if (e.kind === "machine") {
        let mesh = this.obstacleMeshes.get(e.id);
        const mw = (e.w || 70) / 100.0;
        const mh = (e.h || 70) / 100.0;
        const status = e.extra?.status || "nominal";

        if (!mesh) {
          const group = new THREE.Group();
          const baseGeo = new THREE.BoxGeometry(mw, 0.9, mh);
          const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.6 });
          const baseMesh = new THREE.Mesh(baseGeo, baseMat);
          baseMesh.position.y = 0.45;
          baseMesh.castShadow = true;
          group.add(baseMesh);

          const beaconGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.2, 12);
          const beaconMat = new THREE.MeshStandardMaterial({ color: 0x00ff9d, emissive: 0x00ff9d, emissiveIntensity: 0.8 });
          const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
          beaconMesh.name = "beacon";
          beaconMesh.position.set(mw * 0.35, 1.0, 0);
          group.add(beaconMesh);

          mesh = group;
          this.scene.add(mesh);
          this.obstacleMeshes.set(e.id, mesh);
        }
        mesh.position.set(pos.x, 0, pos.z);
        const beacon = mesh.getObjectByName("beacon") as THREE.Mesh;
        if (beacon && beacon.material) {
          const bMat = beacon.material as THREE.MeshStandardMaterial;
          if (status === "jammed") {
            const flash = Math.sin(now * 0.01) > 0 ? 0xff2222 : 0x440000;
            bMat.color.setHex(flash);
            bMat.emissive.setHex(flash);
          } else if (status === "maintenance") {
            bMat.color.setHex(0xf59e0b);
            bMat.emissive.setHex(0xf59e0b);
          } else {
            bMat.color.setHex(0x00ff9d);
            bMat.emissive.setHex(0x00ff9d);
          }
        }

      } else if (e.kind === "conveyor") {
        let mesh = this.obstacleMeshes.get(e.id);
        const cw = (e.w || 150) / 100.0;
        const ch = (e.h || 30) / 100.0;
        if (!mesh) {
          const group = new THREE.Group();
          const beltGeo = new THREE.BoxGeometry(cw, 0.14, ch);
          const beltMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
          const belt = new THREE.Mesh(beltGeo, beltMat);
          belt.position.y = 0.07;
          group.add(belt);
          mesh = group;
          this.scene.add(mesh);
          this.obstacleMeshes.set(e.id, mesh);
        }
        mesh.position.set(pos.x, 0, pos.z);

      } else if (e.kind === "item") {
        let mesh = this.obstacleMeshes.get(e.id);
        if (!mesh) {
          const itemGeo = new THREE.BoxGeometry(0.15, 0.15, 0.15);
          const itemMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, metalness: 0.8 });
          mesh = new THREE.Mesh(itemGeo, itemMat);
          this.scene.add(mesh);
          this.obstacleMeshes.set(e.id, mesh);
        }
        mesh.position.set(pos.x, 0.21, pos.z);

      } else {
        // Obstacles (Chairs, Desks, Crates)
        let mesh = this.obstacleMeshes.get(e.id);
        const ow = (e.w || 60) / 100.0;
        const oh = (e.h || 60) / 100.0;

        if (!mesh) {
          const geo = new THREE.BoxGeometry(ow, 0.75, oh);
          const mat = new THREE.MeshStandardMaterial({
            color: e.kind === "chair" ? 0x854d0e : 0x334155,
            roughness: 0.65,
            metalness: 0.2,
          });
          mesh = new THREE.Mesh(geo, mat);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          this.scene.add(mesh);
          this.obstacleMeshes.set(e.id, mesh);
        }
        mesh.position.set(pos.x + ow / 2, 0.375, pos.z + oh / 2);
      }
    }

    // Clean removed obstacles
    for (const [id, mesh] of this.obstacleMeshes.entries()) {
      if (!seenIds.has(id)) {
        this.scene.remove(mesh);
        mesh.traverse((c: any) => {
          if (c.geometry) c.geometry.dispose();
          if (c.material) c.material.dispose();
        });
        this.obstacleMeshes.delete(id);
      }
    }

    // Goal Pad Position & Pulse
    if (frame.goal) {
      const gPos = this.to3D(frame.goal.x, frame.goal.y);
      this.goalPad.position.set(gPos.x, 0, gPos.z);
      this.goalRing.scale.setScalar(1.0 + 0.1 * Math.sin(now * 0.006));
    }

    // Update Plan Trajectories (With explicit resource disposal)
    this.updatePlanTrajectories(frame.plan);

    // Update Mind View Scene Styling
    if (this.showMindView) {
      this.scene.background = new THREE.Color("#080e1a");
      this.hemiLight.intensity = 0.55;
      this.gridHelper.material.opacity = 0.45;
    } else {
      this.scene.background = new THREE.Color("#0b0f19");
      this.hemiLight.intensity = 0.8;
      this.gridHelper.material.opacity = 0.25;
    }

    // Update Camera
    this.updateCamera(now, robotX3D, robotZ3D, robotHeading);

    // Render Scene with active camera
    this.renderer.render(this.scene, this.activeCamera);
  }

  private updatePlanTrajectories(plan: any) {
    // 1. Dispose old candidate lines safely
    if (this.candidateLines) {
      this.scene.remove(this.candidateLines);
      this.candidateLines.geometry.dispose();
      (this.candidateLines.material as THREE.Material).dispose();
      this.candidateLines = null;
    }

    // 2. Dispose old chosen path ribbon safely
    if (this.chosenRibbon) {
      this.scene.remove(this.chosenRibbon);
      this.chosenRibbon.geometry.dispose();
      (this.chosenRibbon.material as THREE.Material).dispose();
      this.chosenRibbon = null;
    }

    // 3. Reset Ghost Pool
    for (let i = 0; i < this.ghostPool.length; i++) {
      this.ghostPool[i].visible = false;
    }

    if (!plan) return;

    // Render Candidate Alternative Trajectories
    if (plan.alts && plan.alts.length > 0) {
      const linePositions: number[] = [];
      const lineColors: number[] = [];

      for (let k = 0; k < Math.min(plan.alts.length, 16); k++) {
        const alt = plan.alts[k];
        if (!alt.path || alt.path.length < 2) continue;
        const isColliding = alt.score < -5.0 || (alt.predicted_collision_step && alt.predicted_collision_step > 0);
        const r = isColliding ? 0.95 : 0.0;
        const g = isColliding ? 0.2 : 0.85;
        const b = isColliding ? 0.2 : 0.95;

        for (let i = 0; i < alt.path.length - 1; i++) {
          const p1 = this.to3D(alt.path[i][0], alt.path[i][1]);
          const p2 = this.to3D(alt.path[i + 1][0], alt.path[i + 1][1]);
          linePositions.push(p1.x, 0.025, p1.z, p2.x, 0.025, p2.z);
          lineColors.push(r, g, b, r, g, b);
        }
      }

      if (linePositions.length > 0) {
        const lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
        lineGeo.setAttribute("color", new THREE.Float32BufferAttribute(lineColors, 3));
        const lineMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.4 });
        this.candidateLines = new THREE.LineSegments(lineGeo, lineMat);
        this.scene.add(this.candidateLines);
      }
    }

    // Render Best Chosen Trajectory (Luminous Emerald Tube)
    if (plan.best && plan.best.length >= 2) {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i < plan.best.length; i++) {
        const p3d = this.to3D(plan.best[i][0], plan.best[i][1]);
        pts.push(new THREE.Vector3(p3d.x, 0.035, p3d.z));
      }

      const curve = new THREE.CatmullRomCurve3(pts);
      const tubeGeo = new THREE.TubeGeometry(curve, pts.length * 3, 0.035, 8, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: 0x00ff9d,
        transparent: true,
        opacity: this.showMindView ? 0.95 : 0.8,
      });
      this.chosenRibbon = new THREE.Mesh(tubeGeo, tubeMat);
      this.scene.add(this.chosenRibbon);

      // Deploy Ghost Robots from pre-allocated pool
      let ghostIdx = 0;
      for (let i = 3; i < pts.length; i += 3) {
        if (ghostIdx >= this.ghostPool.length) break;
        const ghost = this.ghostPool[ghostIdx++];
        ghost.position.copy(pts[i]);
        ghost.position.y = 0.08;
        ghost.visible = true;
      }
    }
  }

  private updateCamera(now: number, rx: number, rz: number, rHeading: number) {
    if (this.cameraMode === "robot_pov") {
      this.activeCamera = this.povCamera;
      return;
    }

    this.activeCamera = this.camera;

    if (this.cameraMode === "overview") {
      this.targetCamPos.set(0, 5.8, 5.8);
      this.targetCamLookAt.set(0, 0.2, 0);
    } else if (this.cameraMode === "topdown") {
      this.targetCamPos.set(0, 7.8, 0.001);
      this.targetCamLookAt.set(0, 0, 0);
    } else if (this.cameraMode === "chase") {
      const dist = 1.8;
      // Follow behind robot heading
      const cx = rx - Math.sin(rHeading) * dist;
      const cz = rz + Math.cos(rHeading) * dist;
      this.targetCamPos.set(cx, 1.3, cz);
      this.targetCamLookAt.set(rx, 0.25, rz);
    } else if (this.cameraMode === "orbit") {
      this.orbitAngle += 0.004;
      this.targetCamPos.set(Math.sin(this.orbitAngle) * 6.2, 5.0, Math.cos(this.orbitAngle) * 6.2);
      this.targetCamLookAt.set(0, 0.2, 0);
    }

    // Smooth exponential camera position & lookAt lerping
    this.currentCamPos.lerp(this.targetCamPos, 0.08);
    this.currentCamLookAt.lerp(this.targetCamLookAt, 0.08);

    this.camera.position.copy(this.currentCamPos);
    this.camera.lookAt(this.currentCamLookAt);
  }

  public setQuality(level: "low" | "med" | "high") {
    this.quality = level;
    if (!this.renderer) return;

    if (level === "low") {
      this.renderer.shadowMap.enabled = false;
      this.targetDpr = 1.0;
    } else if (level === "med") {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.BasicShadowMap;
      this.targetDpr = 1.25;
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
    if (w === 0 || h === 0) return;

    const aspect = w / h;
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();

    this.povCamera.aspect = aspect;
    this.povCamera.updateProjectionMatrix();

    this.renderer.setSize(w, h);
  };

  public destroy() {
    this.isDestroyed = true;
    window.removeEventListener("resize", this.handleResize);

    // Dispose all meshes, materials, and textures
    this.scene.traverse((obj: any) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m: any) => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });

    if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
    this.renderer = null;
  }
}

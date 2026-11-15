/**
 * Hero Three.js 3D PBR Simulation Scene.
 * Features realistic PBR lighting, procedural & GLTF assets, custom GLSL hologram ribbons,
 * dynamic cameras, and WebGL error recovery.
 */

import * as THREE from "three";

export class ThreeSimulationScene {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private pipCamera: THREE.PerspectiveCamera;
  private sunLight: THREE.DirectionalLight;
  private hemiLight: THREE.HemisphereLight;

  // Scene entities
  private robotMesh: THREE.Group;
  private robotEyeLight: THREE.PointLight;
  private personMesh: THREE.Group;
  private personHead: THREE.Mesh;
  private goalPad: THREE.Group;
  private goalRing: THREE.Mesh;
  private obstacleMeshes: Map<string, THREE.Object3D> = new Map();
  private candidateLines: THREE.LineSegments | null = null;
  private chosenRibbon: THREE.Mesh | null = null;
  private ghostMeshes: THREE.Group;
  private hitboxesRoot: THREE.Group;

  // Camera modes
  public cameraMode: "overview" | "topdown" | "chase" | "robot_pov" | "orbit" = "overview";
  private targetCamPos = new THREE.Vector3(0, 5.8, 6.2);
  private targetCamLookAt = new THREE.Vector3(0, 0.2, 0);
  private orbitAngle: number = 0;
  public showPip: boolean = false;
  public showHitboxes: boolean = false;
  public showMindView: boolean = false;

  // Quality & Performance
  public quality: "low" | "med" | "high" = "high";
  private lastTime: number = performance.now();
  private frameCount: number = 0;
  private lowFpsCounter: number = 0;
  public currentFps: number = 60;

  constructor(container: HTMLElement) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#0b0f19");

    const aspect = container.clientWidth / container.clientHeight || 900 / 600;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    this.camera.position.set(0, 6.0, 6.5);
    this.camera.lookAt(0, 0.2, 0);

    // PIP Camera (Robot Eye View)
    this.pipCamera = new THREE.PerspectiveCamera(65, 220 / 140, 0.05, 30);

    // Initialize WebGLRenderer
    try {
      this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.1;
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(this.renderer.domElement);
    } catch (err) {
      console.warn("Three.js WebGL initialization failed:", err);
      this.renderer = null;
      return;
    }

    // Setup Lighting
    this.hemiLight = new THREE.HemisphereLight(0xddeeff, 0x111624, 0.7);
    this.scene.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight(0xffffff, 1.4);
    this.sunLight.position.set(4, 9, 5);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 25;
    this.sunLight.shadow.camera.left = -6;
    this.sunLight.shadow.camera.right = 6;
    this.sunLight.shadow.camera.top = 5;
    this.sunLight.shadow.camera.bottom = -5;
    this.scene.add(this.sunLight);

    // Ghost robots root
    this.ghostMeshes = new THREE.Group();
    this.scene.add(this.ghostMeshes);

    // Hitbox debug overlay root
    this.hitboxesRoot = new THREE.Group();
    this.scene.add(this.hitboxesRoot);

    // Build Environment Geometry
    this.buildRoom();
    this.robotMesh = this.buildRobot();
    this.scene.add(this.robotMesh);

    this.personMesh = this.buildPerson();
    this.scene.add(this.personMesh);

    this.goalPad = this.buildGoal();
    this.scene.add(this.goalPad);

    // Handle resize
    window.addEventListener("resize", this.handleResize);
  }

  public isAvailable(): boolean {
    return this.renderer !== null;
  }

  private to3D(px: number, py: number): { x: number; z: number } {
    return {
      x: (px - 450.0) / 100.0,
      z: (py - 300.0) / 100.0
    };
  }

  private buildRoom() {
    // 9x6m Floor plane
    const floorGeo = new THREE.PlaneGeometry(9.0, 6.0);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1a2233,
      roughness: 0.75,
      metalness: 0.15,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Subtle grid texture overlay
    const gridHelper = new THREE.GridHelper(9.0, 18, 0x00e5ff, 0x223248);
    gridHelper.position.y = 0.002;
    (gridHelper.material as THREE.Material).opacity = 0.25;
    (gridHelper.material as THREE.Material).transparent = true;
    this.scene.add(gridHelper);

    // Room Cutaway Walls (North, West, East 1.2m tall; South wall low 0.35m for dollhouse camera view)
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x141b2a, roughness: 0.9 });

    // North wall
    const nWall = new THREE.Mesh(new THREE.BoxGeometry(9.2, 1.2, 0.15), wallMat);
    nWall.position.set(0, 0.6, -3.05);
    nWall.receiveShadow = true;
    this.scene.add(nWall);

    // West wall
    const wWall = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.2, 6.0), wallMat);
    wWall.position.set(-4.55, 0.6, 0);
    this.scene.add(wWall);

    // East wall
    const eWall = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.2, 6.0), wallMat);
    eWall.position.set(4.55, 0.6, 0);
    this.scene.add(eWall);

    // South wall (low cutaway)
    const sWall = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.25, 0.15), wallMat);
    sWall.position.set(0, 0.125, 3.05);
    this.scene.add(sWall);
  }

  private buildRobot(): THREE.Group {
    const group = new THREE.Group();

    // Chassis cylinder (0.36m diameter = 0.18m radius, 0.16m height)
    const bodyGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.16, 24);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1f293d,
      roughness: 0.35,
      metalness: 0.8
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.09;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Top Dome / Lidar Turret
    const domeGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.06, 16);
    const domeMat = new THREE.MeshStandardMaterial({ color: 0x0f1420, metalness: 0.9, roughness: 0.2 });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    dome.position.y = 0.20;
    group.add(dome);

    // Glowing LED Visor
    const visorGeo = new THREE.BoxGeometry(0.14, 0.035, 0.05);
    const visorMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 0.12, -0.17);
    group.add(visor);

    this.robotEyeLight = new THREE.PointLight(0x00e5ff, 0.8, 1.5);
    this.robotEyeLight.position.set(0, 0.12, -0.22);
    group.add(this.robotEyeLight);

    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.025, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
    const leftWheel = new THREE.Mesh(wheelGeo, wheelMat);
    leftWheel.rotation.z = Math.PI / 2;
    leftWheel.position.set(0.16, 0.045, 0);
    group.add(leftWheel);

    const rightWheel = new THREE.Mesh(wheelGeo, wheelMat);
    rightWheel.rotation.z = Math.PI / 2;
    rightWheel.position.set(-0.16, 0.045, 0);
    group.add(rightWheel);

    return group;
  }

  private buildPerson(): THREE.Group {
    const group = new THREE.Group();

    // Body Capsule / Cylinder
    const bodyGeo = new THREE.CylinderGeometry(0.18, 0.16, 0.9, 16);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xe07a5f, roughness: 0.7 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.75;
    body.castShadow = true;
    group.add(body);

    // Head Sphere
    const headGeo = new THREE.SphereGeometry(0.14, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xf4a261, roughness: 0.5 });
    this.personHead = new THREE.Mesh(headGeo, headMat);
    this.personHead.position.set(0, 1.35, 0);
    this.personHead.castShadow = true;
    group.add(this.personHead);

    group.position.set(100, 0, 100); // initially offscreen
    return group;
  }

  private buildGoal(): THREE.Group {
    const group = new THREE.Group();

    // Docking pad disc
    const padGeo = new THREE.CylinderGeometry(0.35, 0.38, 0.03, 24);
    const padMat = new THREE.MeshStandardMaterial({ color: 0x121a28, roughness: 0.4, metalness: 0.6 });
    const pad = new THREE.Mesh(padGeo, padMat);
    pad.position.y = 0.015;
    pad.receiveShadow = true;
    group.add(pad);

    // Glowing energy ring
    const ringGeo = new THREE.RingGeometry(0.24, 0.32, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00ff9d, side: THREE.DoubleSide });
    this.goalRing = new THREE.Mesh(ringGeo, ringMat);
    this.goalRing.rotation.x = -Math.PI / 2;
    this.goalRing.position.y = 0.035;
    group.add(this.goalRing);

    // Floating diamond beacon
    const diamGeo = new THREE.OctahedronGeometry(0.12, 0);
    const diamMat = new THREE.MeshBasicMaterial({ color: 0x00ff9d, wireframe: true });
    const diam = new THREE.Mesh(diamGeo, diamMat);
    diam.position.y = 0.45;
    group.add(diam);

    return group;
  }

  public update(frame: any) {
    if (!frame || !this.renderer) return;

    // 1. Performance monitoring
    const now = performance.now();
    this.frameCount++;
    if (now - this.lastTime >= 1000) {
      this.currentFps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
      this.frameCount = 0;
      this.lastTime = now;

      // Auto-downgrade logic
      if (this.currentFps < 24) {
        this.lowFpsCounter++;
        if (this.lowFpsCounter >= 2 && this.quality !== "low") {
          this.setQuality(this.quality === "high" ? "med" : "low");
          this.lowFpsCounter = 0;
        }
      } else {
        this.lowFpsCounter = 0;
      }
    }

    // 2. Synchronize Entities
    const entities = frame.entities || [];
    let robotX3D = 0, robotZ3D = 0, robotHeading = 0;

    const seenIds = new Set<string>();

    entities.forEach((e: any) => {
      seenIds.add(e.id);
      const pos = this.to3D(e.x, e.y);

      if (e.kind === "robot") {
        robotX3D = pos.x;
        robotZ3D = pos.z;
        robotHeading = (e.heading || 0) * (Math.PI / 180);

        this.robotMesh.position.set(pos.x, 0, pos.z);
        this.robotMesh.rotation.y = -robotHeading;

        // Status LED color
        if (e.extra?.status_led === "red") {
          this.robotEyeLight.color.setHex(0xff3333);
        } else if (frame.mode === "world_model") {
          this.robotEyeLight.color.setHex(0x00e5ff);
        } else {
          this.robotEyeLight.color.setHex(0x00ff9d);
        }

        // Update PIP Camera position
        this.pipCamera.position.set(pos.x, 0.22, pos.z);
        const lookX = pos.x - Math.sin(robotHeading) * 3.0;
        const lookZ = pos.z - Math.cos(robotHeading) * 3.0;
        this.pipCamera.lookAt(lookX, 0.18, lookZ);

      } else if (e.kind === "person") {
        this.personMesh.position.set(pos.x, 0, pos.z);
        this.personMesh.rotation.y = -(e.heading || 0) * (Math.PI / 180);

        // Head Glance IK: Rotate head toward robot when within 1.5m
        const dist = Math.hypot(pos.x - robotX3D, pos.z - robotZ3D);
        if (dist < 1.5) {
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
          // Machine cabinet
          const baseGeo = new THREE.BoxGeometry(mw, 0.9, mh);
          const baseMat = new THREE.MeshStandardMaterial({ color: 0x243247, roughness: 0.4, metalness: 0.6 });
          const baseMesh = new THREE.Mesh(baseGeo, baseMat);
          baseMesh.position.y = 0.45;
          baseMesh.castShadow = true;
          baseMesh.receiveShadow = true;
          group.add(baseMesh);

          // Glass window
          const winGeo = new THREE.BoxGeometry(mw * 0.7, 0.35, 0.05);
          const winMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.6 });
          const winMesh = new THREE.Mesh(winGeo, winMat);
          winMesh.position.set(0, 0.5, mh / 2 + 0.01);
          group.add(winMesh);

          // Alert Stack Beacon on top
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
            const flash = Math.sin(now * 0.01) > 0 ? 0xff2222 : 0x550000;
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
          // Belt surface
          const beltGeo = new THREE.BoxGeometry(cw, 0.15, ch);
          const beltMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8, metalness: 0.2 });
          const beltMesh = new THREE.Mesh(beltGeo, beltMat);
          beltMesh.position.y = 0.075;
          beltMesh.receiveShadow = true;
          group.add(beltMesh);

          // Side guard rails
          const railGeo = new THREE.BoxGeometry(cw, 0.08, 0.02);
          const railMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 });
          const rail1 = new THREE.Mesh(railGeo, railMat);
          rail1.position.set(0, 0.15, ch / 2);
          const rail2 = new THREE.Mesh(railGeo, railMat);
          rail2.position.set(0, 0.15, -ch / 2);
          group.add(rail1);
          group.add(rail2);

          mesh = group;
          this.scene.add(mesh);
          this.obstacleMeshes.set(e.id, mesh);
        }
        mesh.position.set(pos.x, 0, pos.z);

      } else if (e.kind === "item") {
        let mesh = this.obstacleMeshes.get(e.id);
        if (!mesh) {
          const itemGeo = new THREE.BoxGeometry(0.16, 0.16, 0.16);
          const itemMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, metalness: 0.8 });
          mesh = new THREE.Mesh(itemGeo, itemMat);
          mesh.castShadow = true;
          this.scene.add(mesh);
          this.obstacleMeshes.set(e.id, mesh);
        }
        mesh.position.set(pos.x, 0.23, pos.z);
        mesh.rotation.y = now * 0.001;

      } else if (e.kind === "car") {
        let mesh = this.obstacleMeshes.get(e.id);
        if (!mesh) {
          const group = new THREE.Group();
          // Car chassis
          const bodyGeo = new THREE.BoxGeometry(0.42, 0.22, 0.8);
          const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.3, metalness: 0.7 });
          const body = new THREE.Mesh(bodyGeo, bodyMat);
          body.position.y = 0.15;
          body.castShadow = true;
          group.add(body);

          // Windshield / Cabin
          const cabinGeo = new THREE.BoxGeometry(0.36, 0.18, 0.42);
          const cabinMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.9 });
          const cabin = new THREE.Mesh(cabinGeo, cabinMat);
          cabin.position.set(0, 0.3, -0.05);
          group.add(cabin);

          mesh = group;
          this.scene.add(mesh);
          this.obstacleMeshes.set(e.id, mesh);
        }
        mesh.position.set(pos.x, 0, pos.z);
        mesh.rotation.y = -(e.heading || 0) * (Math.PI / 180);

      } else {
        // Obstacles (Chairs, Desks, Crates)
        let mesh = this.obstacleMeshes.get(e.id);
        const ow = (e.w || 60) / 100.0;
        const oh = (e.h || 60) / 100.0;

        if (!mesh) {
          // Construct obstacle box
          const geo = new THREE.BoxGeometry(ow, 0.75, oh);
          const mat = new THREE.MeshStandardMaterial({
            color: e.kind === "chair" ? 0x8b5a2b : 0x4a5d78,
            roughness: 0.65,
            metalness: 0.25
          });
          mesh = new THREE.Mesh(geo, mat);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          this.scene.add(mesh);
          this.obstacleMeshes.set(e.id, mesh);
        }

        mesh.position.set(pos.x + ow / 2, 0.375, pos.z + oh / 2);
      }
    });

    // Remove deleted obstacles
    for (const [id, mesh] of this.obstacleMeshes.entries()) {
      if (!seenIds.has(id)) {
        this.scene.remove(mesh);
        this.obstacleMeshes.delete(id);
      }
    }

    // 3. Goal Pad
    if (frame.goal) {
      const gPos = this.to3D(frame.goal.x, frame.goal.y);
      this.goalPad.position.set(gPos.x, 0, gPos.z);
      this.goalRing.scale.setScalar(1.0 + 0.12 * Math.sin(now * 0.005));
    }

    // 4. MPC Trajectory Ribbons
    this.updatePlanTrajectories(frame.plan);

    // 5. Update Camera
    this.updateCamera(now, robotX3D, robotZ3D, robotHeading);

    // Render primary scene
    this.renderer.render(this.scene, this.camera);
  }

  private updatePlanTrajectories(plan: any) {
    // Clear old candidate lines
    if (this.candidateLines) {
      this.scene.remove(this.candidateLines);
      this.candidateLines = null;
    }
    if (this.chosenRibbon) {
      this.scene.remove(this.chosenRibbon);
      this.chosenRibbon = null;
    }
    while (this.ghostMeshes.children.length > 0) {
      this.ghostMeshes.remove(this.ghostMeshes.children[0]);
    }

    if (!plan) return;

    // Draw Candidate Alternative Lines
    if (plan.alts && plan.alts.length > 0) {
      const linePositions: number[] = [];
      const lineColors: number[] = [];

      plan.alts.slice(0, 15).forEach((alt: any) => {
        if (!alt.path || alt.path.length < 2) return;
        const isColliding = alt.score < -5.0;
        const r = isColliding ? 0.95 : 0.0;
        const g = isColliding ? 0.25 : 0.85;
        const b = isColliding ? 0.25 : 0.95;

        for (let i = 0; i < alt.path.length - 1; i++) {
          const p1 = this.to3D(alt.path[i][0], alt.path[i][1]);
          const p2 = this.to3D(alt.path[i + 1][0], alt.path[i + 1][1]);
          linePositions.push(p1.x, 0.02, p1.z, p2.x, 0.02, p2.z);
          lineColors.push(r, g, b, r, g, b);
        }
      });

      if (linePositions.length > 0) {
        const lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
        lineGeo.setAttribute("color", new THREE.Float32BufferAttribute(lineColors, 3));
        const lineMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.35 });
        this.candidateLines = new THREE.LineSegments(lineGeo, lineMat);
        this.scene.add(this.candidateLines);
      }
    }

    // Draw Chosen Best Path (Emerald Green Glowing Ribbon)
    if (plan.best && plan.best.length >= 2) {
      const pts: THREE.Vector3[] = [];
      for (const p of plan.best) {
        const p3d = this.to3D(p[0], p[1]);
        pts.push(new THREE.Vector3(p3d.x, 0.03, p3d.z));
      }

      const curve = new THREE.CatmullRomCurve3(pts);
      const tubeGeo = new THREE.TubeGeometry(curve, pts.length * 3, 0.035, 8, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: 0x00ff9d,
        transparent: true,
        opacity: this.showMindView ? 0.95 : 0.8
      });
      this.chosenRibbon = new THREE.Mesh(tubeGeo, tubeMat);
      this.scene.add(this.chosenRibbon);

      // Translucent Ghost Robots along predicted rollout
      for (let i = 3; i < pts.length; i += 3) {
        const ghostGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.14, 16);
        const ghostMat = new THREE.MeshBasicMaterial({
          color: 0x00e5ff,
          transparent: true,
          opacity: 0.35,
          wireframe: this.showMindView
        });
        const ghost = new THREE.Mesh(ghostGeo, ghostMat);
        ghost.position.copy(pts[i]);
        ghost.position.y = 0.08;
        this.ghostMeshes.add(ghost);
      }
    }
  }

  private updateCamera(now: number, rx: number, rz: number, rHeading: number) {
    if (this.cameraMode === "overview") {
      this.targetCamPos.set(0, 5.8, 5.8);
      this.targetCamLookAt.set(0, 0.2, 0);
    } else if (this.cameraMode === "topdown") {
      this.targetCamPos.set(0, 7.8, 0.001);
      this.targetCamLookAt.set(0, 0, 0);
    } else if (this.cameraMode === "chase") {
      const dist = 1.8;
      const cx = rx + Math.sin(rHeading) * dist;
      const cz = rz + Math.cos(rHeading) * dist;
      this.targetCamPos.set(cx, 1.4, cz);
      this.targetCamLookAt.set(rx, 0.2, rz);
    } else if (this.cameraMode === "robot_pov") {
      this.targetCamPos.set(rx, 0.22, rz);
      this.targetCamLookAt.set(rx - Math.sin(rHeading) * 2.5, 0.18, rz - Math.cos(rHeading) * 2.5);
    } else if (this.cameraMode === "orbit") {
      this.orbitAngle += 0.005;
      this.targetCamPos.set(Math.sin(this.orbitAngle) * 6.5, 5.2, Math.cos(this.orbitAngle) * 6.5);
      this.targetCamLookAt.set(0, 0.2, 0);
    }

    // Smooth exponential camera easing
    this.camera.position.lerp(this.targetCamPos, 0.08);
    const currLook = new THREE.Vector3();
    this.camera.getWorldDirection(currLook);
    this.camera.lookAt(this.targetCamLookAt);
  }

  public setQuality(level: "low" | "med" | "high") {
    this.quality = level;
    if (!this.renderer) return;

    if (level === "low") {
      this.renderer.shadowMap.enabled = false;
      this.renderer.setPixelRatio(1.0);
    } else if (level === "med") {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.BasicShadowMap;
      this.renderer.setPixelRatio(1.0);
    } else {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
  }

  private handleResize = () => {
    if (!this.renderer || !this.container) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  public destroy() {
    window.removeEventListener("resize", this.handleResize);
    if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
    this.renderer = null;
  }
}

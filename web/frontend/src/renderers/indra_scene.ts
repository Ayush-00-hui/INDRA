/**
 * Project INDRA: Indian Urban Robotics 3D Simulation Scene.
 * High-performance Three.js WebGL2/PBR renderer inspired by Delhi urban streets.
 * Features:
 *  - Realistic Indian urban road layout (asphalt, yellow dividers, zebra crossings, footpaths).
 *  - Custom procedural 3D meshes for Indian traffic:
 *      * Auto-Rickshaw (yellow/green livery, 3-wheels, passenger cab)
 *      * Motorcycles with riders
 *      * Sacred Indian Cattle (humped Zebu cow)
 *      * Stray Dogs
 *      * Street Vendor Thela (wooden pushcarts with canvas awnings)
 *      * Road hazards: Potholes, reflective waterlogged pools, construction barriers
 *  - Autonomous UGV Delivery Robot with rotating LiDAR turret and status LEDs.
 *  - MPC Trajectory Ribbons & Candidate Rollout Visualizations.
 *  - Dynamic weather (Delhi winter smog, monsoon rain, diurnal lighting).
 *  - Multiple camera modes (Overview, Chase, Robot POV, Top-Down, Orbit).
 */

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export class IndraScene {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private povCamera: THREE.PerspectiveCamera;
  private activeCamera: THREE.PerspectiveCamera;
  private controls: OrbitControls | null = null;

  // Lighting
  private sunLight: THREE.DirectionalLight;
  private hemiLight: THREE.HemisphereLight;
  private ambientLight: THREE.AmbientLight;
  private streetLights: THREE.SpotLight[] = [];

  // Environment Meshes
  private roadGroup: THREE.Group;
  private actorsGroup: THREE.Group;
  private hazardsGroup: THREE.Group;
  private actorMeshes: Map<string, THREE.Object3D> = new Map();

  // Hero Autonomous UGV Robot
  private robotGroup: THREE.Group;
  private lidarTurret: THREE.Object3D | null = null;
  private robotStatusLed: THREE.Mesh | null = null;
  private lidarSweepLine: THREE.Line | null = null;
  private lidarRaysGroup: THREE.Group;
  private lidarRayLines: THREE.Line[] = [];
  private lidarHitSpheres: THREE.Mesh[] = [];
  private safetyFootprintMesh: THREE.Mesh | null = null;
  private wheels: THREE.Mesh[] = [];
  public showLidar: boolean = true;
  public showTrajectories: boolean = true;
  public showFootprint: boolean = true;
  public graphicsTier: "low" | "medium" | "high" = "high";

  // Goal Beacon
  private goalGroup: THREE.Group;
  private goalBeaconRing: THREE.Mesh | null = null;

  // MPC Trajectory & Candidate Visualizations
  private bestRibbonMesh: THREE.Mesh | null = null;
  private candidateGroup: THREE.Group;

  // Weather & Atmosphere
  private rainParticles: THREE.Points | null = null;
  private rainGeo: THREE.BufferGeometry | null = null;
  private currentWeather: string = "clear";
  private currentRoadCond: string = "dry";

  // Camera settings
  public cameraMode: "overview" | "chase" | "robot_pov" | "topdown" | "orbit" = "overview";
  private targetCamPos = new THREE.Vector3(15, 18, 22);
  private targetCamLookAt = new THREE.Vector3(15, 0, 0);

  // Callbacks
  public onFloorClick?: (x: number, y: number) => void;
  public onPlaceObstacle?: (x: number, y: number, kind: string) => void;
  public onFpsUpdate?: (fps: number) => void;
  public currentFps: number = 60;

  private isRunning: boolean = true;
  private lastFrameTime: number = performance.now();
  private frameCount: number = 0;
  private fpsTimer: number = 0;
  private playbackSpeed: number = 1.0;

  constructor(container: HTMLElement) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0c1017);
    this.scene.fog = new THREE.FogExp2(0x0c1017, 0.015);

    const aspect = container.clientWidth / (container.clientHeight || 1);
    this.camera = new THREE.PerspectiveCamera(48, aspect, 0.1, 300);
    this.camera.position.set(-16, 9.5, 3.2);
    this.camera.lookAt(14, 0.8, 0);

    this.povCamera = new THREE.PerspectiveCamera(75, aspect, 0.05, 150);
    this.activeCamera = this.camera;

    // Lighting Systems
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    this.scene.add(this.ambientLight);

    this.hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x1e293b, 0.7);
    this.scene.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight(0xfffaed, 1.4);
    this.sunLight.position.set(25, 40, 20);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.scene.add(this.sunLight);

    // Groups
    this.roadGroup = new THREE.Group();
    this.actorsGroup = new THREE.Group();
    this.hazardsGroup = new THREE.Group();
    this.candidateGroup = new THREE.Group();
    this.robotGroup = new THREE.Group();
    this.lidarRaysGroup = new THREE.Group();
    this.robotGroup.add(this.lidarRaysGroup);
    this.goalGroup = new THREE.Group();

    this.scene.add(this.roadGroup);
    this.scene.add(this.hazardsGroup);
    this.scene.add(this.actorsGroup);
    this.scene.add(this.candidateGroup);
    this.scene.add(this.robotGroup);
    this.scene.add(this.goalGroup);

    this.initRenderer();
    this.buildUrbanEnvironment();
    this.buildHeroRobot();
    this.buildGoalBeacon();
    this.setupInteractivity();
    this.animate();
  }

  public isAvailable(): boolean {
    return this.renderer !== null;
  }

  public setPlaybackSpeed(speed: number) {
    this.playbackSpeed = Math.max(0.25, Math.min(4.0, speed));
  }

  public setDockStatus(status: "docked" | "released") {
    // Optional docking state hook
  }

  private initRenderer() {
    try {
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.1;

      this.container.appendChild(this.renderer.domElement);

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxPolarAngle = Math.PI / 2 - 0.05;
      this.controls.minDistance = 2;
      this.controls.maxDistance = 120;
      this.controls.target.set(14, 0.8, 0);
      this.controls.update();

      window.addEventListener("resize", this.handleResize);
    } catch (e) {
      this.renderer = null;
    }
  }

  private handleResize = () => {
    if (!this.renderer || !this.container) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / (h || 1);
    this.camera.updateProjectionMatrix();
    this.povCamera.aspect = w / (h || 1);
    this.povCamera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  /** Build Delhi-inspired two-lane asphalt road network, footpaths, curbs, markings, and lamps. */
  private buildUrbanEnvironment() {
    // 1. Foundation Ground (Soil / Earth surrounding road)
    const groundGeo = new THREE.PlaneGeometry(160, 100);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x1a1e24, roughness: 0.95 });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.set(15, -0.05, 0);
    groundMesh.receiveShadow = true;
    this.roadGroup.add(groundMesh);

    // 2. Asphalt Roadway (60m x 12m corridor: x from -15 to +45, z from -6 to +6)
    const roadGeo = new THREE.PlaneGeometry(62, 12.0);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x181c22,
      roughness: 0.82,
      metalness: 0.1
    });
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.position.set(15, 0, 0);
    roadMesh.receiveShadow = true;
    this.roadGroup.add(roadMesh);

    // 3. Central Yellow Dividing Lines (Double Yellow)
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const yellowLine1 = new THREE.Mesh(new THREE.PlaneGeometry(60, 0.12), lineMat);
    yellowLine1.rotation.x = -Math.PI / 2;
    yellowLine1.position.set(15, 0.005, 0.15);
    this.roadGroup.add(yellowLine1);

    const yellowLine2 = new THREE.Mesh(new THREE.PlaneGeometry(60, 0.12), lineMat);
    yellowLine2.rotation.x = -Math.PI / 2;
    yellowLine2.position.set(15, 0.005, -0.15);
    this.roadGroup.add(yellowLine2);

    // 4. White Lane Edge Boundaries
    const whiteMat = new THREE.MeshBasicMaterial({ color: 0xe2e8f0 });
    const edgeNorth = new THREE.Mesh(new THREE.PlaneGeometry(60, 0.15), whiteMat);
    edgeNorth.rotation.x = -Math.PI / 2;
    edgeNorth.position.set(15, 0.005, 5.8);
    this.roadGroup.add(edgeNorth);

    const edgeSouth = new THREE.Mesh(new THREE.PlaneGeometry(60, 0.15), whiteMat);
    edgeSouth.rotation.x = -Math.PI / 2;
    edgeSouth.position.set(15, 0.005, -5.8);
    this.roadGroup.add(edgeSouth);

    // 5. Pedestrian Zebra Crossings at x = -2.0 and x = 25.0
    [-2.0, 25.0].forEach((crossX) => {
      for (let stripeZ = -5.0; stripeZ <= 5.0; stripeZ += 1.2) {
        const stripe = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.6), whiteMat);
        stripe.rotation.x = -Math.PI / 2;
        stripe.position.set(crossX, 0.006, stripeZ);
        this.roadGroup.add(stripe);
      }
    });

    // 6. Raised Sidewalks / Footpaths with Black & Yellow Curb Stones
    const curbGeo = new THREE.BoxGeometry(62, 0.22, 2.8);
    const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.85 });

    // North sidewalk
    const northCurb = new THREE.Mesh(curbGeo, sidewalkMat);
    northCurb.position.set(15, 0.11, 7.4);
    northCurb.receiveShadow = true;
    this.roadGroup.add(northCurb);

    // South sidewalk
    const southCurb = new THREE.Mesh(curbGeo, sidewalkMat);
    southCurb.position.set(15, 0.11, -7.4);
    southCurb.receiveShadow = true;
    this.roadGroup.add(southCurb);

    // Painted curb edge segments (alternating yellow / black)
    const curbEdgeGeo = new THREE.BoxGeometry(1.5, 0.23, 0.25);
    const curbYelMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const curbBlkMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });

    for (let cx = -14.0; cx <= 44.0; cx += 1.5) {
      const isYel = Math.floor((cx + 15) / 1.5) % 2 === 0;
      const mat = isYel ? curbYelMat : curbBlkMat;

      const segN = new THREE.Mesh(curbEdgeGeo, mat);
      segN.position.set(cx, 0.115, 6.0);
      this.roadGroup.add(segN);

      const segS = new THREE.Mesh(curbEdgeGeo, mat);
      segS.position.set(cx, 0.115, -6.0);
      this.roadGroup.add(segS);
    }

    // 7. Street Lamps with Light Cones
    [-8.0, 10.0, 28.0].forEach((lampX) => {
      // Lamp Pole
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.10, 6.0, 8), new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 }));
      pole.position.set(lampX, 3.0, 6.8);
      pole.castShadow = true;
      this.roadGroup.add(pole);

      // Arm & Lamp Head
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 1.4), new THREE.MeshStandardMaterial({ color: 0x475569 }));
      arm.position.set(lampX, 5.8, 6.2);
      this.roadGroup.add(arm);

      // Spot Light
      const spot = new THREE.SpotLight(0xffecd1, 2.5, 25, Math.PI / 4, 0.4);
      spot.position.set(lampX, 5.7, 5.6);
      spot.target.position.set(lampX, 0, 1.0);
      spot.castShadow = true;
      this.scene.add(spot);
      this.scene.add(spot.target);
      this.streetLights.push(spot);
    });

    // 8. Signature Indian Street Architecture & Infrastructure
    this.buildStreetArchitecture();
  }

  /** Build Indian urban architecture: shopfronts, multi-story brick/plaster buildings, utility poles, overhead wiring, signs, and foliage. */
  private buildStreetArchitecture() {
    const archGroup = new THREE.Group();

    // Helper: Build an Indian urban building with optional shopfront, roll-down shutter, awning, balconies, and Sintex water tanks
    const createBuilding = (
      x: number, z: number, w: number, h: number, d: number,
      wallColor: number,
      hasShop: boolean = false,
      shopName?: string,
      awningColor: number = 0x0284c7,
      numWaterTanks: number = 1
    ) => {
      const bldg = new THREE.Group();
      bldg.position.set(x, 0, z);

      // Main structural block
      const wallMat = new THREE.MeshStandardMaterial({ color: wallColor, roughness: 0.85 });
      const mainBlock = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMat);
      mainBlock.position.y = h / 2;
      mainBlock.castShadow = true;
      mainBlock.receiveShadow = true;
      bldg.add(mainBlock);

      // Roof parapet / border
      const parapet = new THREE.Mesh(
        new THREE.BoxGeometry(w + 0.1, 0.35, d + 0.1),
        new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 })
      );
      parapet.position.y = h + 0.15;
      bldg.add(parapet);

      // Sintex black cylindrical water tanks on roof (classic Indian urban feature)
      const tankGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.9, 12);
      const tankMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5, metalness: 0.2 });
      for (let t = 0; t < numWaterTanks; t++) {
        const tank = new THREE.Mesh(tankGeo, tankMat);
        const tankX = (t - (numWaterTanks - 1) / 2) * 1.4;
        tank.position.set(tankX, h + 0.35 + 0.45, 0);
        tank.castShadow = true;
        bldg.add(tank);

        // White horizontal ring on tank
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(0.56, 0.02, 6, 16),
          new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        ring.rotation.x = Math.PI / 2;
        ring.position.set(tankX, h + 0.35 + 0.55, 0);
        bldg.add(ring);
      }

      // Front facing offset (+Z or -Z depending on side of road)
      const facingSign = z > 0 ? -1 : 1;
      const frontOffsetZ = facingSign * (d / 2 + 0.02);

      // Shopfront on ground level
      if (hasShop) {
        // Roll-down corrugated metal shutter (partially open or closed)
        const shutterMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.4, metalness: 0.6 });
        const shutter = new THREE.Mesh(new THREE.BoxGeometry(w * 0.75, 2.4, 0.05), shutterMat);
        shutter.position.set(0, 1.25, frontOffsetZ);
        bldg.add(shutter);

        // Shop awning / chhajja
        const awning = new THREE.Mesh(
          new THREE.BoxGeometry(w * 0.85, 0.08, 1.3),
          new THREE.MeshStandardMaterial({ color: awningColor, roughness: 0.6 })
        );
        awning.position.set(0, 2.6, facingSign * (d / 2 + 0.65));
        awning.rotation.x = facingSign * 0.15;
        bldg.add(awning);

        // Shop Signboard
        const signBoard = new THREE.Mesh(
          new THREE.BoxGeometry(w * 0.7, 0.5, 0.08),
          new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 })
        );
        signBoard.position.set(0, 3.1, frontOffsetZ);
        bldg.add(signBoard);
      }

      // Upper floor windows & balconies
      const numFloors = Math.floor(h / 2.8);
      const winGeo = new THREE.BoxGeometry(1.0, 1.2, 0.05);
      const winMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.9 });

      for (let f = 1; f < numFloors; f++) {
        const floorY = f * 2.8 + 1.2;
        [-w * 0.28, w * 0.28].forEach((wx) => {
          const win = new THREE.Mesh(winGeo, winMat);
          win.position.set(wx, floorY, frontOffsetZ);
          bldg.add(win);

          // Cantilever Balcony
          const balc = new THREE.Mesh(
            new THREE.BoxGeometry(1.4, 0.1, 0.6),
            new THREE.MeshStandardMaterial({ color: 0x334155 })
          );
          balc.position.set(wx, floorY - 0.65, facingSign * (d / 2 + 0.3));
          bldg.add(balc);

          // Balcony railing
          const rail = new THREE.Mesh(
            new THREE.BoxGeometry(1.4, 0.45, 0.04),
            new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 })
          );
          rail.position.set(wx, floorY - 0.4, facingSign * (d / 2 + 0.58));
          bldg.add(rail);
        });

        // AC outdoor unit mounted outside
        if (f === 1) {
          const acBox = new THREE.Mesh(
            new THREE.BoxGeometry(0.65, 0.45, 0.35),
            new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.5 })
          );
          acBox.position.set(0, floorY, facingSign * (d / 2 + 0.2));
          bldg.add(acBox);
        }
      }

      return bldg;
    };

    // North side buildings (facing South towards road)
    archGroup.add(createBuilding(-10, 13.5, 9.0, 7.5, 6.0, 0xd4a373, true, "SHARMA GENERAL STORE", 0xd97706, 1));
    archGroup.add(createBuilding(1, 14.0, 10.0, 11.0, 6.5, 0x9a3412, false, undefined, 0x0284c7, 2));
    archGroup.add(createBuilding(12, 13.0, 8.0, 6.0, 5.0, 0xfef08a, true, "CHAI & SWEETS", 0x16a34a, 1));
    archGroup.add(createBuilding(22, 14.0, 10.5, 9.5, 6.0, 0x475569, true, "DELHI CLINIC", 0x2563eb, 2));
    archGroup.add(createBuilding(35, 13.5, 9.5, 7.0, 5.5, 0xca8a04, true, "AUTO PARTS & REPAIR", 0xd97706, 1));

    // South side buildings (facing North towards road)
    archGroup.add(createBuilding(-8, -13.5, 9.5, 8.5, 6.0, 0x334155, true, "KIRANA MART", 0x0284c7, 1));
    archGroup.add(createBuilding(3, -13.0, 8.5, 6.2, 5.0, 0xf8fafc, true, "INDRA PHARMACY", 0x16a34a, 1));
    archGroup.add(createBuilding(14, -14.0, 9.0, 12.0, 6.5, 0x7c2d12, false, undefined, 0x0284c7, 2));
    archGroup.add(createBuilding(25, -13.5, 9.5, 7.0, 5.5, 0xd97706, true, "CHANDNI BAZAAR", 0xb91c1c, 1));
    archGroup.add(createBuilding(37, -13.5, 8.5, 6.0, 5.0, 0x64748b, false, undefined, 0x0284c7, 1));

    // Concrete Utility Poles with Overhead Wire Strands (Signature Indian Street Infrastructure)
    const poleXCoords = [-12, 3, 18, 33];
    const wirePointsN: THREE.Vector3[] = [];
    const wirePointsS: THREE.Vector3[] = [];

    const poleGeo = new THREE.CylinderGeometry(0.12, 0.15, 7.0, 8);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.9 });
    const crossarmGeo = new THREE.BoxGeometry(0.1, 0.1, 1.4);

    poleXCoords.forEach((px) => {
      // North Pole
      const pN = new THREE.Mesh(poleGeo, poleMat);
      pN.position.set(px, 3.5, 6.5);
      pN.castShadow = true;
      archGroup.add(pN);

      const armN = new THREE.Mesh(crossarmGeo, poleMat);
      armN.position.set(px, 6.7, 6.5);
      archGroup.add(armN);
      wirePointsN.push(new THREE.Vector3(px, 6.7, 6.5));

      // South Pole
      const pS = new THREE.Mesh(poleGeo, poleMat);
      pS.position.set(px, 3.5, -6.5);
      pS.castShadow = true;
      archGroup.add(pS);

      const armS = new THREE.Mesh(crossarmGeo, poleMat);
      armS.position.set(px, 6.7, -6.5);
      archGroup.add(armS);
      wirePointsS.push(new THREE.Vector3(px, 6.7, -6.5));
    });

    // Wire lines
    const wireMat = new THREE.LineBasicMaterial({ color: 0x090d16 });
    if (wirePointsN.length >= 2) {
      const geoN = new THREE.BufferGeometry().setFromPoints(wirePointsN);
      archGroup.add(new THREE.Line(geoN, wireMat));
    }
    if (wirePointsS.length >= 2) {
      const geoS = new THREE.BufferGeometry().setFromPoints(wirePointsS);
      archGroup.add(new THREE.Line(geoS, wireMat));
    }
    // Diagonal overhead wire sag crossing the street at px = 18
    const crossWireGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(18, 6.7, 6.5),
      new THREE.Vector3(18.5, 5.8, 0.0), // catenary sag
      new THREE.Vector3(18, 6.7, -6.5)
    ]);
    archGroup.add(new THREE.Line(crossWireGeo, wireMat));

    // Roadside Planters with Green Shrubs along Sidewalks
    const planterGeo = new THREE.BoxGeometry(0.8, 0.45, 0.8);
    const planterMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
    const shrubGeo = new THREE.DodecahedronGeometry(0.42, 1);
    const shrubMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.9 });

    [-14, -4, 6, 16, 26, 38].forEach((px) => {
      // North sidewalk shrub
      const plN = new THREE.Mesh(planterGeo, planterMat);
      plN.position.set(px, 0.35, 7.2);
      archGroup.add(plN);

      const shN = new THREE.Mesh(shrubGeo, shrubMat);
      shN.position.set(px, 0.75, 7.2);
      archGroup.add(shN);

      // South sidewalk shrub
      const plS = new THREE.Mesh(planterGeo, planterMat);
      plS.position.set(px, 0.35, -7.2);
      archGroup.add(plS);

      const shS = new THREE.Mesh(shrubGeo, shrubMat);
      shS.position.set(px, 0.75, -7.2);
      archGroup.add(shS);
    });

    this.roadGroup.add(archGroup);
  }

  /** Build Hero Autonomous UGV Delivery Robot model. */
  private buildHeroRobot() {
    this.robotGroup.position.set(-10, 0.35, 0);

    // Chassis (Rugged olive/dark-slate delivery UGV)
    const chassisGeo = new THREE.BoxGeometry(0.85, 0.32, 0.60);
    const chassisMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.5, roughness: 0.4 });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    chassis.castShadow = true;
    this.robotGroup.add(chassis);

    // Upper Payload Enclosure / Cargo Pod
    const podGeo = new THREE.BoxGeometry(0.60, 0.28, 0.52);
    const podMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, metalness: 0.2, roughness: 0.3 });
    const pod = new THREE.Mesh(podGeo, podMat);
    pod.position.set(-0.06, 0.28, 0);
    pod.castShadow = true;
    this.robotGroup.add(pod);

    // 6 Rugged All-Terrain Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.12, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.9 });
    const wheelOffsets = [
      [-0.30, -0.15, 0.34], [0.0, -0.15, 0.34], [0.30, -0.15, 0.34],
      [-0.30, -0.15, -0.34], [0.0, -0.15, -0.34], [0.30, -0.15, -0.34]
    ];
    wheelOffsets.forEach(([wx, wy, wz]) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(wx, wy, wz);
      wheel.castShadow = true;
      this.robotGroup.add(wheel);
      this.wheels.push(wheel);
    });

    // Safety Clearance Footprint (Dynamic Bounding Hull)
    const footGeo = new THREE.RingGeometry(0.55, 0.65, 32);
    const footMat = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.65, side: THREE.DoubleSide });
    const footprint = new THREE.Mesh(footGeo, footMat);
    footprint.rotation.x = -Math.PI / 2;
    footprint.position.set(0, -0.34, 0);
    this.robotGroup.add(footprint);
    this.safetyFootprintMesh = footprint;

    // 16-Beam Radial LiDAR Ray Assembly
    const lidarOrigin = new THREE.Vector3(0.25, 0.60, 0);
    for (let b = 0; b < 16; b++) {
      const angle = (b / 16) * Math.PI * 2;
      const dx = Math.cos(angle) * 3.5;
      const dz = Math.sin(angle) * 3.5;

      const pts = [lidarOrigin.clone(), new THREE.Vector3(0.25 + dx, 0.60, dz)];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45 });
      const line = new THREE.Line(lineGeo, lineMat);
      this.lidarRaysGroup.add(line);
      this.lidarRayLines.push(line);

      // Hit point dot
      const sphereGeo = new THREE.SphereGeometry(0.04, 8, 8);
      const sphereMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.set(0.25 + dx, 0.60, dz);
      this.lidarRaysGroup.add(sphere);
      this.lidarHitSpheres.push(sphere);
    }

    // Rotating LiDAR Mast & Scanner Turret
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.20, 8), new THREE.MeshStandardMaterial({ color: 0x334155 }));
    mast.position.set(0.25, 0.48, 0);
    this.robotGroup.add(mast);

    const turret = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.10, 16), new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 }));
    turret.position.set(0.25, 0.60, 0);
    this.robotGroup.add(turret);
    this.lidarTurret = turret;

    // Status LED Bar (Emerald = Nominal, Amber = Detour, Red = Hazard)
    const ledGeo = new THREE.BoxGeometry(0.04, 0.06, 0.40);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(0.43, 0.10, 0);
    this.robotGroup.add(led);
    this.robotStatusLed = led;

    // Front Headlight Spot
    const headlight = new THREE.SpotLight(0xffffff, 2.0, 12, Math.PI / 6, 0.3);
    headlight.position.set(0.45, 0.15, 0);
    headlight.target.position.set(5.0, 0, 0);
    this.robotGroup.add(headlight);
    this.robotGroup.add(headlight.target);

    // Forward Sensor POV Camera Anchor
    this.povCamera.position.set(0.40, 0.55, 0);
    this.robotGroup.add(this.povCamera);
  }

  /** Build Goal Delivery Hub Beacon with concentric glowing rings and pillar. */
  private buildGoalBeacon() {
    this.goalGroup.position.set(30, 0, 0);

    // Glowing base ring
    const ringGeo = new THREE.RingGeometry(0.8, 1.2, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.02;
    this.goalGroup.add(ring);
    this.goalBeaconRing = ring;

    // Vertical Holographic Light Beam
    const pillarGeo = new THREE.CylinderGeometry(0.25, 0.25, 6.0, 16, 1, true);
    const pillarMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const pillar = new THREE.Mesh(pillarGeo, pillarMat);
    pillar.position.y = 3.0;
    this.goalGroup.add(pillar);
  }

  /** Procedural 3D Mesh Builders for Indian Urban Traffic. */
  private createAutoRickshawMesh(): THREE.Group {
    const rickshaw = new THREE.Group();

    // 1. Lower Body (Green Chassis)
    const lowerBody = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.65, 1.25),
      new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.4 }) // Indian Auto Green
    );
    lowerBody.position.y = 0.50;
    lowerBody.castShadow = true;
    rickshaw.add(lowerBody);

    // 2. Yellow Canopy / Roof
    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.70, 1.20),
      new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.35 }) // Auto Yellow
    );
    roof.position.set(-0.25, 1.15, 0);
    roof.castShadow = true;
    rickshaw.add(roof);

    // 3. Front Windshield & Sloped Nose
    const nose = new THREE.Mesh(
      new THREE.ConeGeometry(0.60, 0.85, 4),
      new THREE.MeshStandardMaterial({ color: 0xeab308 })
    );
    nose.rotation.z = -Math.PI / 2;
    nose.position.set(1.10, 0.60, 0);
    rickshaw.add(nose);

    // 4. Wheels (1 Front, 2 Rear)
    const wheelGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.16, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.9 });

    const frontWheel = new THREE.Mesh(wheelGeo, wheelMat);
    frontWheel.rotation.x = Math.PI / 2;
    frontWheel.position.set(1.0, 0.24, 0);
    rickshaw.add(frontWheel);

    const rearWheelL = new THREE.Mesh(wheelGeo, wheelMat);
    rearWheelL.rotation.x = Math.PI / 2;
    rearWheelL.position.set(-0.7, 0.24, 0.68);
    rickshaw.add(rearWheelL);

    const rearWheelR = new THREE.Mesh(wheelGeo, wheelMat);
    rearWheelR.rotation.x = Math.PI / 2;
    rearWheelR.position.set(-0.7, 0.24, -0.68);
    rickshaw.add(rearWheelR);

    // Dual Headlights
    const headlightMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const hl = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.12), headlightMat);
    hl.position.set(1.42, 0.60, 0);
    rickshaw.add(hl);

    return rickshaw;
  }

  private createMotorcycleMesh(): THREE.Group {
    const bike = new THREE.Group();

    // Frame
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.35, 0.35), new THREE.MeshStandardMaterial({ color: 0x334155 }));
    frame.position.y = 0.55;
    bike.add(frame);

    // Wheels
    const wGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.12, 16);
    const wMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
    const wFront = new THREE.Mesh(wGeo, wMat);
    wFront.rotation.x = Math.PI / 2;
    wFront.position.set(0.8, 0.32, 0);
    bike.add(wFront);

    const wRear = new THREE.Mesh(wGeo, wMat);
    wRear.rotation.x = Math.PI / 2;
    wRear.position.set(-0.7, 0.32, 0);
    bike.add(wRear);

    // Rider Torso & Helmet
    const rider = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.55, 0.40), new THREE.MeshStandardMaterial({ color: 0x2563eb }));
    rider.position.set(-0.1, 1.05, 0);
    bike.add(rider);

    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
    helmet.position.set(-0.05, 1.45, 0);
    bike.add(helmet);

    return bike;
  }

  private createCattleMesh(): THREE.Group {
    const cow = new THREE.Group();

    // Torso (earth brown / cream)
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.90, 0.85), new THREE.MeshStandardMaterial({ color: 0xa8a29e, roughness: 0.9 }));
    body.position.y = 0.95;
    body.castShadow = true;
    cow.add(body);

    // Zebu Hump (characteristic hump behind neck)
    const hump = new THREE.Mesh(new THREE.SphereGeometry(0.30, 8, 8), new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.9 }));
    hump.position.set(0.40, 1.55, 0);
    cow.add(hump);

    // Head with Horns
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.45, 0.40), new THREE.MeshStandardMaterial({ color: 0x78716c }));
    head.position.set(1.05, 1.35, 0);
    cow.add(head);

    // Horns
    const hornGeo = new THREE.ConeGeometry(0.06, 0.35, 6);
    const hornMat = new THREE.MeshStandardMaterial({ color: 0x292524 });
    const hornL = new THREE.Mesh(hornGeo, hornMat);
    hornL.position.set(1.0, 1.65, 0.22);
    hornL.rotation.x = 0.4;
    cow.add(hornL);

    const hornR = new THREE.Mesh(hornGeo, hornMat);
    hornR.position.set(1.0, 1.65, -0.22);
    hornR.rotation.x = -0.4;
    cow.add(hornR);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.65, 8);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x57534e });
    [[-0.6, 0.32, 0.32], [0.6, 0.32, 0.32], [-0.6, 0.32, -0.32], [0.6, 0.32, -0.32]].forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(lx, ly, lz);
      cow.add(leg);
    });

    return cow;
  }

  private createStrayDogMesh(): THREE.Group {
    const dog = new THREE.Group();
    const dogMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.9 }); // Tan/brown street dog

    const body = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.30, 0.26), dogMat);
    body.position.y = 0.30;
    dog.add(body);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.22, 0.20), dogMat);
    head.position.set(0.36, 0.45, 0);
    dog.add(head);

    return dog;
  }

  private createVendorCartMesh(): THREE.Group {
    const thela = new THREE.Group();

    // Wooden Slat Platform
    const platform = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.12, 1.1), new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 }));
    platform.position.y = 0.65;
    platform.castShadow = true;
    thela.add(platform);

    // 4 Iron Spoked Wheels
    const wGeo = new THREE.CylinderGeometry(0.30, 0.30, 0.08, 16);
    const wMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.8 });
    [[-0.6, 0.30, 0.60], [0.6, 0.30, 0.60], [-0.6, 0.30, -0.60], [0.6, 0.30, -0.60]].forEach(([wx, wy, wz]) => {
      const w = new THREE.Mesh(wGeo, wMat);
      w.rotation.x = Math.PI / 2;
      w.position.set(wx, wy, wz);
      thela.add(w);
    });

    // Striped Canvas Awning Overhead
    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.08, 1.2), new THREE.MeshStandardMaterial({ color: 0x0284c7 }));
    roof.position.set(0, 1.85, 0);
    thela.add(roof);

    return thela;
  }

  private createCarMesh(): THREE.Group {
    const car = new THREE.Group();

    // Chassis / lower body (Maruti Swift / Indian compact hatchback profile)
    const bodyGeo = new THREE.BoxGeometry(3.8, 0.75, 1.65);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, metalness: 0.4, roughness: 0.3 }); // Indian Maroon
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.55;
    body.castShadow = true;
    car.add(body);

    // Cabin / Greenhouse
    const cabinGeo = new THREE.BoxGeometry(2.1, 0.65, 1.45);
    const cabinMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.8 });
    const cabin = new THREE.Mesh(cabinGeo, cabinMat);
    cabin.position.set(-0.25, 1.25, 0);
    cabin.castShadow = true;
    car.add(cabin);

    // Roof top panel
    const roof = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.08, 1.42), bodyMat);
    roof.position.set(-0.25, 1.60, 0);
    car.add(roof);

    // 4 Wheels
    const wGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.22, 16);
    const wMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
    const capMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 });
    [[-1.1, 0.32, 0.82], [1.1, 0.32, 0.82], [-1.1, 0.32, -0.82], [1.1, 0.32, -0.82]].forEach(([wx, wy, wz]) => {
      const wheel = new THREE.Mesh(wGeo, wMat);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(wx, wy, wz);
      wheel.castShadow = true;
      car.add(wheel);

      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.23, 12), capMat);
      cap.rotation.x = Math.PI / 2;
      cap.position.set(wx, wy, wz);
      car.add(cap);
    });

    // Front Headlights
    const hlMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const hlL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.35), hlMat);
    hlL.position.set(1.91, 0.65, 0.55);
    car.add(hlL);
    const hlR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.35), hlMat);
    hlR.position.set(1.91, 0.65, -0.55);
    car.add(hlR);

    // Rear Taillights
    const tlMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const tlL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.30), tlMat);
    tlL.position.set(-1.91, 0.65, 0.55);
    car.add(tlL);
    const tlR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.30), tlMat);
    tlR.position.set(-1.91, 0.65, -0.55);
    car.add(tlR);

    return car;
  }

  private createBusMesh(): THREE.Group {
    const bus = new THREE.Group();

    // Delhi DTC Green City Bus (9.5m length, 2.5m width, 3.1m height)
    // Lower body (Iconic DTC Forest Green)
    const lowerBody = new THREE.Mesh(
      new THREE.BoxGeometry(9.5, 1.4, 2.5),
      new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.4 })
    );
    lowerBody.position.y = 0.95;
    lowerBody.castShadow = true;
    bus.add(lowerBody);

    // Upper body / Windows section (Dark panoramic tinted glass)
    const upperBody = new THREE.Mesh(
      new THREE.BoxGeometry(9.4, 1.2, 2.45),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.85 })
    );
    upperBody.position.y = 2.25;
    upperBody.castShadow = true;
    bus.add(upperBody);

    // Roof
    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(9.5, 0.20, 2.5),
      new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.5 })
    );
    roof.position.y = 2.95;
    bus.add(roof);

    // Rooftop AC Condenser Pods
    const acPod = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.35, 1.6),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.6 })
    );
    acPod.position.set(0.5, 3.20, 0);
    bus.add(acPod);

    // Front Destination Board ("DTC 505: KASHMERE GATE")
    const destBoard = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.35, 1.8),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b })
    );
    destBoard.position.set(4.76, 2.55, 0);
    bus.add(destBoard);

    // 6 Heavy Duty Bus Wheels (2 front, 4 rear dual axle)
    const wheelGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.28, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.95 });
    const busWheelPositions = [
      [3.0, 0.48, 1.22], [3.0, 0.48, -1.22], // Front axle
      [-2.2, 0.48, 1.22], [-2.2, 0.48, -1.22], // Rear axle 1
      [-3.3, 0.48, 1.22], [-3.3, 0.48, -1.22]  // Rear axle 2
    ];
    busWheelPositions.forEach(([wx, wy, wz]) => {
      const w = new THREE.Mesh(wheelGeo, wheelMat);
      w.rotation.x = Math.PI / 2;
      w.position.set(wx, wy, wz);
      w.castShadow = true;
      bus.add(w);
    });

    // Front Headlights
    const hlMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const hlL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.25, 0.40), hlMat);
    hlL.position.set(4.76, 0.8, 0.95);
    bus.add(hlL);
    const hlR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.25, 0.40), hlMat);
    hlR.position.set(4.76, 0.8, -0.95);
    bus.add(hlR);

    return bus;
  }

  private createPedestrianMesh(): THREE.Group {
    const person = new THREE.Group();

    // Torso (Shirt / Kurta)
    const shirtColors = [0x2563eb, 0xe11d48, 0x059669, 0xd97706];
    const pickedColor = shirtColors[Math.floor(Math.random() * shirtColors.length)];
    const torso = new THREE.Mesh(
      new THREE.BoxGeometry(0.40, 0.55, 0.25),
      new THREE.MeshStandardMaterial({ color: pickedColor, roughness: 0.7 })
    );
    torso.position.y = 1.15;
    torso.castShadow = true;
    person.add(torso);

    // Head with Hair
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 })
    );
    head.position.y = 1.58;
    person.add(head);

    const hair = new THREE.Mesh(
      new THREE.SphereGeometry(0.145, 10, 10, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 })
    );
    hair.position.y = 1.62;
    person.add(hair);

    // Legs (Slacks/Jeans)
    const legGeo = new THREE.BoxGeometry(0.14, 0.75, 0.16);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const legL = new THREE.Mesh(legGeo, legMat);
    legL.position.set(0.10, 0.45, 0.08); // walking stride offset
    person.add(legL);

    const legR = new THREE.Mesh(legGeo, legMat);
    legR.position.set(-0.10, 0.45, -0.08);
    person.add(legR);

    // Arms
    const armGeo = new THREE.BoxGeometry(0.10, 0.50, 0.12);
    const armL = new THREE.Mesh(armGeo, torso.material);
    armL.position.set(0.26, 1.10, 0);
    person.add(armL);

    const armR = new THREE.Mesh(armGeo, torso.material);
    armR.position.set(-0.26, 1.10, 0);
    person.add(armR);

    return person;
  }

  private createHazardMesh(kind: string, radius: number = 0.8): THREE.Object3D {
    if (kind === "waterlogging") {
      // Reflective water puddle
      const puddle = new THREE.Mesh(
        new THREE.CircleGeometry(radius, 24),
        new THREE.MeshStandardMaterial({
          color: 0x0284c7,
          roughness: 0.08,
          metalness: 0.8,
          transparent: true,
          opacity: 0.85
        })
      );
      puddle.rotation.x = -Math.PI / 2;
      puddle.position.y = 0.015;
      return puddle;
    } else if (kind === "pothole") {
      // Dark asphalt pothole decal
      const pothole = new THREE.Mesh(
        new THREE.RingGeometry(0.1, radius, 16),
        new THREE.MeshBasicMaterial({ color: 0x0a0d14, side: THREE.DoubleSide })
      );
      pothole.rotation.x = -Math.PI / 2;
      pothole.position.y = 0.012;
      return pothole;
    } else {
      // Construction barricade (red/white)
      const barrier = new THREE.Group();
      const board = new THREE.Mesh(new THREE.BoxGeometry(radius * 2, 0.6, 0.12), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
      board.position.y = 0.5;
      barrier.add(board);
      return barrier;
    }
  }

  private setupInteractivity() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    this.container.addEventListener("click", (ev) => {
      if (!this.renderer) return;
      const rect = this.container.getBoundingClientRect();
      mouse.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, this.activeCamera);
      const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const hitPoint = new THREE.Vector3();

      if (raycaster.ray.intersectPlane(floorPlane, hitPoint)) {
        if (this.onFloorClick) {
          this.onFloorClick(hitPoint.x, hitPoint.z);
        }
      }
    });
  }

  /** Update Scene from Universal RenderState frame. */
  public update(state: any) {
    if (!state) return;

    // 1. Update Autonomous Robot Position & Orientation
    const robotEntity = state.entities?.find((e: any) => e.kind === "robot");
    if (robotEntity) {
      // Smooth interpolation
      const targetPos = new THREE.Vector3(robotEntity.x, 0.35, robotEntity.y);
      this.robotGroup.position.lerp(targetPos, 0.35);

      // Heading in radians (invert z-axis for Three.js world coordinates)
      const headingRad = THREE.MathUtils.degToRad(robotEntity.heading || 0);
      this.robotGroup.rotation.y = -headingRad;

      // Update LED Status color based on recovery / hover / waterlog
      if (this.robotStatusLed) {
        const mat = this.robotStatusLed.material as THREE.MeshBasicMaterial;
        let ledColor = 0x10b981; // Emerald (nominal)
        if (robotEntity.extra?.is_recovering) {
          ledColor = 0xa855f7; // Purple / Violet (Active Recovery Maneuver)
        } else if (robotEntity.extra?.hover_seconds > 1.5) {
          ledColor = 0xf59e0b; // Amber (anti-hover evasive active)
        } else if (robotEntity.extra?.waterlog_depth_cm > 10.0) {
          ledColor = 0x38bdf8; // Cyan (waterlogging caution)
        }
        mat.color.setHex(ledColor);
        if (this.safetyFootprintMesh) {
          (this.safetyFootprintMesh.material as THREE.MeshBasicMaterial).color.setHex(ledColor);
        }
      }

      // Update 16 LiDAR ray endpoints and obstacle hit markers
      const distances = robotEntity.extra?.lidar_distances;
      if (distances && Array.isArray(distances) && this.showLidar) {
        const numDist = distances.length;
        for (let i = 0; i < this.lidarRayLines.length; i++) {
          const d = distances[i % numDist] ?? 4.0;
          const angle = (i / this.lidarRayLines.length) * Math.PI * 2;
          const rayDist = Math.max(0.4, Math.min(10.0, d));
          const hx = 0.25 + Math.cos(angle) * rayDist;
          const hz = Math.sin(angle) * rayDist;

          const pts = [new THREE.Vector3(0.25, 0.60, 0), new THREE.Vector3(hx, 0.60, hz)];
          this.lidarRayLines[i].geometry.setFromPoints(pts);

          let hitColor = 0x10b981; // Green (>2.0m)
          if (d < 0.8) {
            hitColor = 0xef4444; // Red (<0.8m)
          } else if (d < 2.0) {
            hitColor = 0xf59e0b; // Amber (0.8 - 2.0m)
          }

          (this.lidarRayLines[i].material as THREE.LineBasicMaterial).color.setHex(hitColor);
          if (this.lidarHitSpheres[i]) {
            this.lidarHitSpheres[i].position.set(hx, 0.60, hz);
            (this.lidarHitSpheres[i].material as THREE.MeshBasicMaterial).color.setHex(hitColor);
          }
        }
      }
    }

    // 2. Update Goal Beacon
    if (state.goal) {
      this.goalGroup.position.set(state.goal.x, 0, state.goal.y);
    }

    // 3. Update Dynamic Traffic Actors
    const activeActorIds = new Set<string>();
    for (const ent of state.entities || []) {
      if (ent.kind === "robot") continue;
      activeActorIds.add(ent.id);

      let mesh = this.actorMeshes.get(ent.id);
      if (!mesh) {
        if (ent.kind === "auto_rickshaw") {
          mesh = this.createAutoRickshawMesh();
        } else if (ent.kind === "motorcycle") {
          mesh = this.createMotorcycleMesh();
        } else if (ent.kind === "car") {
          mesh = this.createCarMesh();
        } else if (ent.kind === "bus") {
          mesh = this.createBusMesh();
        } else if (ent.kind === "person" || ent.kind === "pedestrian") {
          mesh = this.createPedestrianMesh();
        } else if (ent.kind === "cow" || ent.kind === "cattle") {
          mesh = this.createCattleMesh();
        } else if (ent.kind === "dog") {
          mesh = this.createStrayDogMesh();
        } else if (ent.kind === "vendor_cart") {
          mesh = this.createVendorCartMesh();
        } else if (ent.kind === "pothole" || ent.kind === "waterlogging" || ent.kind === "barricade" || ent.kind === "barrier") {
          mesh = this.createHazardMesh(ent.kind, ent.r || 0.8);
        } else {
          mesh = this.createAutoRickshawMesh();
        }
        this.actorsGroup.add(mesh);
        this.actorMeshes.set(ent.id, mesh);
      }

      // Position update (x, z)
      mesh.position.set(ent.x, 0, ent.y);
      if (ent.heading !== undefined) {
        mesh.rotation.y = -THREE.MathUtils.degToRad(ent.heading);
      }
    }

    // Cleanup stale actors
    for (const [id, mesh] of this.actorMeshes.entries()) {
      if (!activeActorIds.has(id)) {
        this.actorsGroup.remove(mesh);
        this.actorMeshes.delete(id);
      }
    }

    // 4. Update MPC Planned Trajectory Ribbons
    if (state.plan && state.plan.best && state.plan.best.length >= 2) {
      this.updateTrajectoryRibbon(state.plan.best);
    }

    // 5. Update Candidate Alternative Rollouts
    if (state.plan && state.plan.alts) {
      this.updateCandidateRollouts(state.plan.alts);
    }

    // 6. Camera Follow logic
    if (robotEntity) {
      if (this.cameraMode === "chase") {
        const offset = new THREE.Vector3(-4.5, 3.2, 0);
        offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.robotGroup.rotation.y);
        this.camera.position.lerp(this.robotGroup.position.clone().add(offset), 0.15);
        this.camera.lookAt(this.robotGroup.position.clone().add(new THREE.Vector3(0, 0.8, 0)));
      } else if (this.cameraMode === "topdown") {
        this.camera.position.set(robotEntity.x, 32, robotEntity.y);
        this.camera.lookAt(robotEntity.x, 0, robotEntity.y);
      }
    }
  }

  private updateTrajectoryRibbon(points: Array<[number, number]>) {
    if (this.bestRibbonMesh) {
      this.scene.remove(this.bestRibbonMesh);
      this.bestRibbonMesh.geometry.dispose();
      this.bestRibbonMesh = null;
    }

    const curvePoints = points.map(([x, y]) => new THREE.Vector3(x, 0.08, y));
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.08, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });

    this.bestRibbonMesh = new THREE.Mesh(tubeGeo, tubeMat);
    this.scene.add(this.bestRibbonMesh);
  }

  private updateCandidateRollouts(alts: any[]) {
    // Clear previous candidates
    while (this.candidateGroup.children.length > 0) {
      const child = this.candidateGroup.children[0] as THREE.Line;
      this.candidateGroup.remove(child);
      if (child.geometry) child.geometry.dispose();
    }

    const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35 });

    alts.slice(0, 6).forEach((alt: any) => {
      if (alt.path && alt.path.length >= 2) {
        const pts = alt.path.map((p: any) => new THREE.Vector3(p[0], 0.05, p[1]));
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const line = new THREE.Line(geo, lineMat);
        this.candidateGroup.add(line);
      }
    });
  }

  private animate = () => {
    if (!this.isRunning) return;
    requestAnimationFrame(this.animate);

    const now = performance.now();
    const dt = (now - this.lastFrameTime) / 1000.0;
    this.lastFrameTime = now;

    // Rotate LiDAR turret
    if (this.lidarTurret) {
      this.lidarTurret.rotation.y += dt * 8.0 * this.playbackSpeed;
    }

    // Animate wheels
    if (this.wheels.length > 0) {
      const wheelRot = dt * 6.0 * this.playbackSpeed;
      this.wheels.forEach((w) => {
        w.rotation.y += wheelRot;
      });
    }

    // Pulse safety footprint ring
    if (this.safetyFootprintMesh) {
      const pulse = 1.0 + Math.sin(now * 0.006) * 0.08;
      this.safetyFootprintMesh.scale.set(pulse, pulse, 1.0);
    }

    // Pulse goal beacon ring
    if (this.goalBeaconRing) {
      const scale = 1.0 + Math.sin(now * 0.004) * 0.12;
      this.goalBeaconRing.scale.set(scale, scale, 1.0);
    }

    // FPS Meter
    this.frameCount++;
    this.fpsTimer += dt;
    if (this.fpsTimer >= 1.0) {
      const fps = Math.round(this.frameCount / this.fpsTimer);
      this.currentFps = fps;
      if (this.onFpsUpdate) this.onFpsUpdate(fps);
      this.frameCount = 0;
      this.fpsTimer = 0;
    }

    if (this.controls && this.cameraMode === "overview") {
      this.controls.update();
    }

    if (this.renderer) {
      this.renderer.render(this.scene, this.activeCamera);
    }
  };

  public setCameraMode(mode: "overview" | "chase" | "robot_pov" | "topdown" | "orbit") {
    this.cameraMode = mode;
    if (mode === "robot_pov") {
      this.activeCamera = this.povCamera;
    } else {
      this.activeCamera = this.camera;
      if (mode === "overview") {
        this.camera.position.set(-16, 9.5, 3.2);
        this.camera.lookAt(14, 0.8, 0);
        if (this.controls) {
          this.controls.target.set(14, 0.8, 0);
          this.controls.update();
        }
      } else if (mode === "topdown") {
        this.camera.position.set(15, 38, 0.01);
        this.camera.lookAt(15, 0, 0);
      }
    }
  }

  public toggleLidar(show?: boolean): boolean {
    this.showLidar = show !== undefined ? show : !this.showLidar;
    this.lidarRaysGroup.visible = this.showLidar;
    return this.showLidar;
  }

  public toggleTrajectories(show?: boolean): boolean {
    this.showTrajectories = show !== undefined ? show : !this.showTrajectories;
    if (this.bestRibbonMesh) this.bestRibbonMesh.visible = this.showTrajectories;
    this.candidateGroup.visible = this.showTrajectories;
    return this.showTrajectories;
  }

  public toggleFootprint(show?: boolean): boolean {
    this.showFootprint = show !== undefined ? show : !this.showFootprint;
    if (this.safetyFootprintMesh) this.safetyFootprintMesh.visible = this.showFootprint;
    return this.showFootprint;
  }

  public setGraphicsTier(tier: "low" | "medium" | "high"): void {
    this.graphicsTier = tier;
    if (!this.renderer) return;

    if (tier === "low") {
      this.renderer.shadowMap.enabled = false;
      this.renderer.setPixelRatio(1.0);
      if (this.rainParticles) this.rainParticles.visible = false;
      this.scene.fog = null;
    } else if (tier === "medium") {
      this.renderer.shadowMap.enabled = true;
      this.renderer.setPixelRatio(1.25);
      if (this.rainParticles) this.rainParticles.visible = this.currentWeather === "monsoon";
      this.scene.fog = new THREE.FogExp2(0x0c1017, 0.012);
    } else {
      this.renderer.shadowMap.enabled = true;
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
      if (this.rainParticles) this.rainParticles.visible = this.currentWeather === "monsoon";
      this.scene.fog = new THREE.FogExp2(0x0c1017, 0.015);
    }
  }

  public destroy() {
    this.isRunning = false;
    window.removeEventListener("resize", this.handleResize);
    if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      this.renderer.dispose();
    }
  }
}

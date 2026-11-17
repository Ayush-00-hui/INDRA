/**
 * Photorealistic 3D Humanoid Robot Controller & Kinematics Engine.
 * Inspired by modern bipedal humanoid robotics (Tesla Optimus, Boston Dynamics Atlas, Figure 01, Unitree G1).
 * Features:
 *  - High-precision anatomical proportions (1.60m tall).
 *  - PBR aerospace composite armor panels with dark titanium articulated actuators.
 *  - Glowing cyan optical sensor visor with active HUD emissive pulse.
 *  - Chest Arc Reactor / Brain Core LED reacting dynamically to World Model navigation states.
 *  - Procedural bipedal walking gait engine:
 *      * Antiphase leg swing with knee flexion and ankle grounding.
 *      * Dynamic reciprocal arm swing to maintain angular momentum balance.
 *      * Pelvis vertical bobbing and subtle spinal twist.
 *      * Smooth idle breathing stance when stationary at goal dock.
 *  - Masked Layer-1 chassis isolation for head-mounted POV camera.
 */

import * as THREE from "three";

export class HumanoidRobot {
  public root: THREE.Group;
  public head: THREE.Group;
  public chestCore: THREE.Mesh;
  public povAnchor: THREE.Object3D;

  // Kinematic joint anchors
  private pelvisGroup: THREE.Group;
  private torsoGroup: THREE.Group;
  private leftArmGroup: THREE.Group;
  private rightArmGroup: THREE.Group;
  private leftElbowGroup: THREE.Group;
  private rightElbowGroup: THREE.Group;
  private leftLegGroup: THREE.Group;
  private rightLegGroup: THREE.Group;
  private leftKneeGroup: THREE.Group;
  private rightKneeGroup: THREE.Group;

  // Gait parameters
  private walkPhase: number = 0;
  private basePelvisY: number = 0.88;
  private lastPos = new THREE.Vector3();
  private smoothedSpeed: number = 0;
  private walkTimer: number = 0;
  private hasInitializedPos: boolean = false;
  private walkBlend: number = 0.0;

  constructor() {
    this.root = new THREE.Group();

    // =========================================================================
    // PBR MATERIALS
    // =========================================================================
    // Aerospace white/slate composite exterior armor
    const whiteArmorMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.32,
      metalness: 0.20,
    });

    // Dark anodized titanium skeletal frame & rotary joint actuators
    const darkSkeletonMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.40,
      metalness: 0.88,
    });

    // Mid-tone gunmetal secondary armor plating
    const gunmetalMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.45,
      metalness: 0.65,
    });

    // High-tech glowing cyan optical sensor visor
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x00e5ff,
      emissiveIntensity: 1.4,
      roughness: 0.1,
      metalness: 0.9,
    });

    // Chest Brain / Arc Reactor Core (changes color dynamically)
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x00ff9d,
      emissive: 0x00ff9d,
      emissiveIntensity: 1.6,
      roughness: 0.2,
      metalness: 0.8,
    });

    // Rubber high-friction sole treads
    const soleMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.92,
      metalness: 0.05,
    });

    // =========================================================================
    // 1. PELVIS & ROOT KINEMATICS
    // =========================================================================
    this.pelvisGroup = new THREE.Group();
    this.pelvisGroup.position.y = this.basePelvisY;
    this.root.add(this.pelvisGroup);

    // Pelvic chassis block
    const pelvisGeo = new THREE.BoxGeometry(0.24, 0.12, 0.16);
    const pelvisMesh = new THREE.Mesh(pelvisGeo, darkSkeletonMat);
    pelvisMesh.castShadow = true;
    this.pelvisGroup.add(pelvisMesh);

    // Hip joint actuator cylinders
    const hipBar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.26, 16),
      darkSkeletonMat
    );
    hipBar.rotation.z = Math.PI / 2;
    this.pelvisGroup.add(hipBar);

    // =========================================================================
    // 2. TORSO & CHEST
    // =========================================================================
    this.torsoGroup = new THREE.Group();
    this.torsoGroup.position.set(0, 0.06, 0);
    this.pelvisGroup.add(this.torsoGroup);

    // Lower spine flexible actuator
    const spine = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.07, 0.10, 16),
      darkSkeletonMat
    );
    spine.position.set(0, 0.05, 0);
    this.torsoGroup.add(spine);

    // Upper Chest Armor Carapace (Tapered athletic humanoid chest)
    const chestGeo = new THREE.BoxGeometry(0.32, 0.34, 0.20);
    const chestMesh = new THREE.Mesh(chestGeo, whiteArmorMat);
    chestMesh.position.set(0, 0.26, 0);
    chestMesh.castShadow = true;
    this.torsoGroup.add(chestMesh);

    // Front Chest Armor Plate with chamfer
    const chestPlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.26, 0.04),
      gunmetalMat
    );
    chestPlate.position.set(0, 0.28, 0.10);
    this.torsoGroup.add(chestPlate);

    // Back Battery / High-Compute Pack
    const backPack = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.30, 0.08),
      darkSkeletonMat
    );
    backPack.position.set(0, 0.26, -0.12);
    backPack.castShadow = true;
    this.torsoGroup.add(backPack);

    // Chest Arc Reactor / Brain Core LED (Dynamic Status Beacon)
    const coreGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.02, 24);
    this.chestCore = new THREE.Mesh(coreGeo, coreMat);
    this.chestCore.rotation.x = Math.PI / 2;
    this.chestCore.position.set(0, 0.30, 0.125);
    this.torsoGroup.add(this.chestCore);

    // Chest Core PointLight illuminating the front of the robot
    const coreLight = new THREE.PointLight(0x00ff9d, 0.8, 1.5, 1.5);
    coreLight.position.set(0, 0.30, 0.16);
    this.torsoGroup.add(coreLight);

    // =========================================================================
    // 3. HEAD & OPTICAL SENSORS
    // =========================================================================
    this.head = new THREE.Group();
    this.head.position.set(0, 0.48, 0);
    this.torsoGroup.add(this.head);

    // Neck actuator
    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.045, 0.08, 16),
      darkSkeletonMat
    );
    neck.position.set(0, 0.03, 0);
    this.head.add(neck);

    // Aerodynamic Helmet / Head Shell
    const helmetGeo = new THREE.BoxGeometry(0.18, 0.20, 0.19);
    const helmetMesh = new THREE.Mesh(helmetGeo, whiteArmorMat);
    helmetMesh.position.set(0, 0.14, 0);
    helmetMesh.castShadow = true;
    this.head.add(helmetMesh);

    // Curved Optical Visor Faceplate
    const visorGeo = new THREE.BoxGeometry(0.16, 0.065, 0.04);
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.position.set(0, 0.15, 0.095);
    this.head.add(visorMesh);

    // Head Spotlight / Forward Perception Sensor
    const headLamp = new THREE.SpotLight(0xfffaed, 1.8, 8.0, Math.PI / 5, 0.3, 1.2);
    headLamp.position.set(0, 0.15, 0.10);
    headLamp.target.position.set(0, 0.15, 3.0);
    this.head.add(headLamp);
    this.head.add(headLamp.target);

    // POV Camera Anchor (Right at visor eye level y=1.52m)
    this.povAnchor = new THREE.Object3D();
    this.povAnchor.position.set(0, 0.15, 0.12);
    this.head.add(this.povAnchor);

    // =========================================================================
    // 4. ARMS & DEXTEROUS HANDS
    // =========================================================================
    // Left Arm (Anchored at shoulder x=-0.22, y=0.38)
    this.leftArmGroup = new THREE.Group();
    this.leftArmGroup.position.set(-0.21, 0.38, 0);
    this.torsoGroup.add(this.leftArmGroup);
    this.buildArm(this.leftArmGroup, "left", whiteArmorMat, darkSkeletonMat);

    // Right Arm (Anchored at shoulder x=+0.22, y=0.38)
    this.rightArmGroup = new THREE.Group();
    this.rightArmGroup.position.set(0.21, 0.38, 0);
    this.torsoGroup.add(this.rightArmGroup);
    this.buildArm(this.rightArmGroup, "right", whiteArmorMat, darkSkeletonMat);

    // =========================================================================
    // 5. BIPEDAL LEGS & ARTICULATED FEET
    // =========================================================================
    // Left Leg (Anchored at hip x=-0.11, y=0)
    this.leftLegGroup = new THREE.Group();
    this.leftLegGroup.position.set(-0.11, -0.06, 0);
    this.pelvisGroup.add(this.leftLegGroup);
    this.leftKneeGroup = this.buildLeg(this.leftLegGroup, whiteArmorMat, darkSkeletonMat, soleMat);

    // Right Leg (Anchored at hip x=+0.11, y=0)
    this.rightLegGroup = new THREE.Group();
    this.rightLegGroup.position.set(0.11, -0.06, 0);
    this.pelvisGroup.add(this.rightLegGroup);
    this.rightKneeGroup = this.buildLeg(this.rightLegGroup, whiteArmorMat, darkSkeletonMat, soleMat);

    // Mask humanoid chassis onto Layer 1 (hidden in head-mounted POV camera so it doesn't clip)
    this.root.traverse((c) => c.layers.set(1));
  }

  private buildArm(
    shoulderGroup: THREE.Group,
    side: "left" | "right",
    armorMat: THREE.Material,
    skeletonMat: THREE.Material
  ) {
    // Spherical Shoulder Joint
    const shoulderBall = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 16), skeletonMat);
    shoulderGroup.add(shoulderBall);

    // Upper Bicep Arm (Length: 0.22m)
    const bicepGroup = new THREE.Group();
    shoulderGroup.add(bicepGroup);

    const bicep = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.034, 0.20, 16), armorMat);
    bicep.position.set(0, -0.11, 0);
    bicep.castShadow = true;
    bicepGroup.add(bicep);

    // Elbow Joint (at y=-0.22)
    const elbowGroup = new THREE.Group();
    elbowGroup.position.set(0, -0.22, 0);
    bicepGroup.add(elbowGroup);

    if (side === "left") {
      this.leftElbowGroup = elbowGroup;
    } else {
      this.rightElbowGroup = elbowGroup;
    }

    const elbowPivot = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.06, 12), skeletonMat);
    elbowPivot.rotation.z = Math.PI / 2;
    elbowGroup.add(elbowPivot);

    // Forearm (Length: 0.20m)
    const forearm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.18, 0.06), armorMat);
    forearm.position.set(0, -0.10, 0);
    forearm.castShadow = true;
    elbowGroup.add(forearm);

    // Dexterous Robot Hand (at y=-0.20)
    const handGroup = new THREE.Group();
    handGroup.position.set(0, -0.20, 0);
    elbowGroup.add(handGroup);

    const palm = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.06, 0.03), skeletonMat);
    palm.position.set(0, -0.03, 0);
    handGroup.add(palm);

    // Articulated fingers
    for (let f = -0.018; f <= 0.018; f += 0.018) {
      const finger = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.04, 0.015), armorMat);
      finger.position.set(f, -0.075, 0.005);
      handGroup.add(finger);
    }
  }

  private buildLeg(
    hipGroup: THREE.Group,
    armorMat: THREE.Material,
    skeletonMat: THREE.Material,
    soleMat: THREE.Material
  ): THREE.Group {
    // Upper Thigh (Length: 0.38m)
    const thighGroup = new THREE.Group();
    hipGroup.add(thighGroup);

    const thigh = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.34, 0.11), armorMat);
    thigh.position.set(0, -0.18, 0);
    thigh.castShadow = true;
    thighGroup.add(thigh);

    // Knee Actuator Joint (at y=-0.36)
    const kneeGroup = new THREE.Group();
    kneeGroup.position.set(0, -0.36, 0);
    thighGroup.add(kneeGroup);

    const kneePivot = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.10, 16), skeletonMat);
    kneePivot.rotation.z = Math.PI / 2;
    kneeGroup.add(kneePivot);

    // Lower Shin (Length: 0.38m)
    const shin = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.34, 0.09), armorMat);
    shin.position.set(0, -0.18, 0);
    shin.castShadow = true;
    kneeGroup.add(shin);

    // Ankle & Articulated Foot (at y=-0.36)
    const footGroup = new THREE.Group();
    footGroup.position.set(0, -0.36, 0);
    kneeGroup.add(footGroup);

    // Foot base with rubber sole
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.05, 0.20), armorMat);
    foot.position.set(0, -0.025, 0.04);
    foot.castShadow = true;
    footGroup.add(foot);

    const sole = new THREE.Mesh(new THREE.BoxGeometry(0.105, 0.015, 0.205), soleMat);
    sole.position.set(0, -0.055, 0.04);
    footGroup.add(sole);

    return kneeGroup;
  }

  /**
   * Updates the kinematic humanoid walking stride, arm swing, and core LED status.
   */
  public update(
    dt: number,
    currentPos: THREE.Vector3,
    headingRad: number,
    mode: "world_model" | "baseline",
    hasCollision: boolean,
    isDocked: boolean = false
  ) {
    const now = performance.now();

    // 1. Calculate horizontal ground velocity
    if (!this.hasInitializedPos) {
      this.lastPos.copy(currentPos);
      this.hasInitializedPos = true;
    }

    const dx = currentPos.x - this.lastPos.x;
    const dz = currentPos.z - this.lastPos.z;
    const distMoved = Math.hypot(dx, dz);
    this.lastPos.copy(currentPos);

    const instantSpeed = dt > 0 ? distMoved / dt : 0;
    // Exponential decay smoothing for frame-rate independence (60 Hz vs 165 Hz)
    const speedDecay = 1.0 - Math.exp(-10.0 * dt);
    this.smoothedSpeed = THREE.MathUtils.lerp(this.smoothedSpeed, instantSpeed, speedDecay);

    // Dynamic walking gait with hysteresis to prevent intermittent leg resets across frame intervals
    if (!isDocked && this.smoothedSpeed > 0.04) {
      this.walkTimer = 0.22; // Sustain walking gait across network packet intervals
    } else if (this.walkTimer > 0) {
      this.walkTimer -= dt;
    }
    const isWalking = this.walkTimer > 0 && !isDocked;
    // Smooth continuous blending of walking animation to eliminate abrupt leg snapping
    const walkDecay = 1.0 - Math.exp(-8.0 * dt);
    this.walkBlend = THREE.MathUtils.lerp(this.walkBlend, isWalking ? 1.0 : 0.0, walkDecay);

    // 2. Position & Heading: aligns directly with the movement/path tangent
    this.root.position.copy(currentPos);
    this.root.rotation.y = headingRad;

    // 3. Dynamic Bipedal Walking Stride with smooth blend weight
    if (this.walkBlend > 0.01) {
      // Step frequency scales gracefully with movement speed
      const strideFreq = Math.min(6.5, Math.max(3.5, this.smoothedSpeed * 4.2));
      this.walkPhase += dt * strideFreq;

      const sinGait = Math.sin(this.walkPhase);
      const cosGait = Math.cos(this.walkPhase);

      // Alternating Hip Swing (Forward & Backward)
      this.leftLegGroup.rotation.x = sinGait * 0.48 * this.walkBlend;
      this.rightLegGroup.rotation.x = -sinGait * 0.48 * this.walkBlend;

      // Realistic Knee Flexion during leg recovery
      this.leftKneeGroup.rotation.x = Math.max(0, -sinGait) * 0.65 * this.walkBlend;
      this.rightKneeGroup.rotation.x = Math.max(0, sinGait) * 0.65 * this.walkBlend;

      // Reciprocal Arm Swing (in anti-phase with legs for dynamic balance!)
      this.leftArmGroup.rotation.x = -sinGait * 0.42 * this.walkBlend;
      this.rightArmGroup.rotation.x = sinGait * 0.42 * this.walkBlend;

      // Natural Elbow Bend
      this.leftElbowGroup.rotation.x = (0.20 + Math.max(0, -sinGait) * 0.25) * this.walkBlend + 0.18 * (1.0 - this.walkBlend);
      this.rightElbowGroup.rotation.x = (0.20 + Math.max(0, sinGait) * 0.25) * this.walkBlend + 0.18 * (1.0 - this.walkBlend);

      // Vertical Pelvic Bobbing (double-support low point, single-support high point)
      const bob = Math.abs(cosGait) * 0.025 * this.walkBlend;
      this.pelvisGroup.position.y = this.basePelvisY + bob;

      // Subtle natural spinal twist
      this.torsoGroup.rotation.y = sinGait * 0.06 * this.walkBlend;
      this.torsoGroup.rotation.z = -sinGait * 0.02 * this.walkBlend;

    } else {
      // Idle Humanoid Stance (Smoothly return limbs to resting stance via frame-rate independent exponential decay)
      const limbDecay = 1.0 - Math.exp(-9.0 * dt);
      const torsoDecay = 1.0 - Math.exp(-7.5 * dt);

      this.leftLegGroup.rotation.x = THREE.MathUtils.lerp(this.leftLegGroup.rotation.x, 0, limbDecay);
      this.rightLegGroup.rotation.x = THREE.MathUtils.lerp(this.rightLegGroup.rotation.x, 0, limbDecay);
      this.leftKneeGroup.rotation.x = THREE.MathUtils.lerp(this.leftKneeGroup.rotation.x, 0, limbDecay);
      this.rightKneeGroup.rotation.x = THREE.MathUtils.lerp(this.rightKneeGroup.rotation.x, 0, limbDecay);

      this.leftArmGroup.rotation.x = THREE.MathUtils.lerp(this.leftArmGroup.rotation.x, 0.06, limbDecay);
      this.rightArmGroup.rotation.x = THREE.MathUtils.lerp(this.rightArmGroup.rotation.x, 0.06, limbDecay);
      this.leftElbowGroup.rotation.x = THREE.MathUtils.lerp(this.leftElbowGroup.rotation.x, 0.18, limbDecay);
      this.rightElbowGroup.rotation.x = THREE.MathUtils.lerp(this.rightElbowGroup.rotation.x, 0.18, limbDecay);

      // Subtle idle breathing chest expansion
      const breathe = Math.sin(now * 0.0025) * 0.008;
      this.pelvisGroup.position.y = THREE.MathUtils.lerp(this.pelvisGroup.position.y, this.basePelvisY + breathe, torsoDecay);
      this.torsoGroup.rotation.y = THREE.MathUtils.lerp(this.torsoGroup.rotation.y, 0, torsoDecay);
      this.torsoGroup.rotation.z = THREE.MathUtils.lerp(this.torsoGroup.rotation.z, 0, torsoDecay);
    }

    // 4. Update Brain / Arc Reactor Core Color
    const coreMat = this.chestCore.material as THREE.MeshStandardMaterial;
    if (hasCollision) {
      coreMat.color.setHex(0xef4444); // Crimson Red warning
      coreMat.emissive.setHex(0xef4444);
    } else if (mode === "world_model") {
      coreMat.color.setHex(0x00ff9d); // High-tech emerald World Model
      coreMat.emissive.setHex(0x00ff9d);
    } else {
      coreMat.color.setHex(0xf59e0b); // Amber reactive mode
      coreMat.emissive.setHex(0xf59e0b);
    }

    // Active breathing pulse on the core
    coreMat.emissiveIntensity = 1.3 + Math.sin(now * 0.006) * 0.4;
  }
}


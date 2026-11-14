"""
Procedural 3D Asset Generators and Model Loader for World Model Robotics.
Generates stylized-realistic PBR models offline with zero external downloads:
- Wheeled Service Robot with articulated wheels, rotating scanner, and status LED.
- Ergonomic Office Chair covering >= 85% of the 80x80cm hit rectangle.
- Obstacle props: Crates, Filing Cabinet, Trash Bin, Potted Plant.
- Charging Dock / Goal Pad with glowing energy rings and vertical beacon.
- Articulated Human Mannequin with animatable walk-cycle joints.
"""

import math
from typing import Tuple, Dict, Any, Optional
from panda3d.core import (
    GeomVertexFormat,
    GeomVertexData,
    GeomVertexWriter,
    Geom,
    GeomTriangles,
    GeomNode,
    NodePath,
    Vec3,
    Vec4,
)


def create_box(
    dx: float,
    dy: float,
    dz: float,
    color: Tuple[float, float, float, float] = (0.7, 0.7, 0.7, 1.0),
    name: str = "box_geom"
) -> NodePath:
    """Generate a procedural 3D box centered at its local origin."""
    fmt = GeomVertexFormat.getV3n3c4()
    vdata = GeomVertexData(name, fmt, Geom.UHStatic)
    vertex = GeomVertexWriter(vdata, "vertex")
    normal = GeomVertexWriter(vdata, "normal")
    vcolor = GeomVertexWriter(vdata, "color")
    tris = GeomTriangles(Geom.UHStatic)

    hx, hy, hz = dx * 0.5, dy * 0.5, dz * 0.5
    faces = [
        # +Z (top)
        ([(-hx, -hy, hz), (hx, -hy, hz), (hx, hy, hz), (-hx, hy, hz)], (0, 0, 1)),
        # -Z (bottom)
        ([(-hx, hy, -hz), (hx, hy, -hz), (hx, -hy, -hz), (-hx, -hy, -hz)], (0, 0, -1)),
        # +Y (north)
        ([(hx, hy, -hz), (hx, hy, hz), (-hx, hy, hz), (-hx, hy, -hz)], (0, 1, 0)),
        # -Y (south)
        ([(-hx, -hy, -hz), (-hx, -hy, hz), (hx, -hy, hz), (hx, -hy, -hz)], (0, -1, 0)),
        # +X (east)
        ([(hx, -hy, -hz), (hx, -hy, hz), (hx, hy, hz), (hx, hy, -hz)], (1, 0, 0)),
        # -X (west)
        ([(-hx, hy, -hz), (-hx, hy, hz), (-hx, -hy, hz), (-hx, -hy, -hz)], (-1, 0, 0)),
    ]

    v_idx = 0
    for quad, norm in faces:
        for pt in quad:
            vertex.addData3(*pt)
            normal.addData3(*norm)
            vcolor.addData4(*color)
        tris.addVertices(v_idx, v_idx + 1, v_idx + 2)
        tris.addVertices(v_idx, v_idx + 2, v_idx + 3)
        v_idx += 4

    geom = Geom(vdata)
    geom.addPrimitive(tris)
    node = GeomNode(name)
    node.addGeom(geom)
    return NodePath(node)


def create_cylinder(
    radius: float,
    height: float,
    segments: int = 18,
    color: Tuple[float, float, float, float] = (0.8, 0.8, 0.85, 1.0),
    name: str = "cylinder_geom"
) -> NodePath:
    """Generate a procedural cylinder standing on the ground plane (Z from 0 to height)."""
    fmt = GeomVertexFormat.getV3n3c4()
    vdata = GeomVertexData(name, fmt, Geom.UHStatic)
    vertex = GeomVertexWriter(vdata, "vertex")
    normal = GeomVertexWriter(vdata, "normal")
    vcolor = GeomVertexWriter(vdata, "color")
    tris = GeomTriangles(Geom.UHStatic)

    # Top center vertex (0)
    vertex.addData3(0, 0, height)
    normal.addData3(0, 0, 1)
    vcolor.addData4(*color)

    # Bottom center vertex (1)
    vertex.addData3(0, 0, 0)
    normal.addData3(0, 0, -1)
    vcolor.addData4(*color)

    # Rings
    for i in range(segments):
        theta = 2.0 * math.pi * i / segments
        nx = math.cos(theta)
        ny = math.sin(theta)
        x = radius * nx
        y = radius * ny

        # Top ring vertex: 2 + 2*i
        vertex.addData3(x, y, height)
        normal.addData3(nx, ny, 0)
        vcolor.addData4(*color)

        # Bottom ring vertex: 2 + 2*i + 1
        vertex.addData3(x, y, 0)
        normal.addData3(nx, ny, 0)
        vcolor.addData4(*color)

    for i in range(segments):
        nxt = (i + 1) % segments
        top_curr = 2 + 2 * i
        bot_curr = top_curr + 1
        top_nxt = 2 + 2 * nxt
        bot_nxt = top_nxt + 1

        # Side quads
        tris.addVertices(top_curr, bot_curr, bot_nxt)
        tris.addVertices(top_curr, bot_nxt, top_nxt)

        # Top cap
        tris.addVertices(0, top_curr, top_nxt)

        # Bottom cap
        tris.addVertices(1, bot_nxt, bot_curr)

    geom = Geom(vdata)
    geom.addPrimitive(tris)
    node = GeomNode(name)
    node.addGeom(geom)
    return NodePath(node)


# =========================================================================
# 1. WHEELED SERVICE ROBOT MODEL
# =========================================================================
def build_robot_model() -> NodePath:
    """
    Build stylized-realistic delivery/service robot:
    Diameter: 0.36m (radius 0.18m matching ROBOT_RADIUS 18px).
    Features: chassis, rubber bumper, spinning wheels, visor, rotating scanner, status beacon.
    """
    root = NodePath("robot_root")

    # Main cylindrical chassis
    chassis = create_cylinder(
        radius=0.18, height=0.18, segments=24,
        color=(0.92, 0.94, 0.96, 1.0), name="chassis"
    )
    chassis.setPos(0, 0, 0.04)
    chassis.reparentTo(root)

    # Lower rubber bumper
    bumper = create_cylinder(
        radius=0.185, height=0.04, segments=24,
        color=(0.18, 0.20, 0.24, 1.0), name="bumper"
    )
    bumper.setPos(0, 0, 0.02)
    bumper.reparentTo(root)

    # Left & Right Wheels (pivots for rotation)
    wheels = []
    for side, x_offset in [("left", -0.175), ("right", 0.175)]:
        wheel_pivot = root.attachNewNode(f"wheel_pivot_{side}")
        wheel_pivot.setPos(x_offset, 0, 0.05)
        # Wheel cylinder oriented along X axis
        wheel_geom = create_cylinder(
            radius=0.05, height=0.03, segments=14,
            color=(0.12, 0.14, 0.16, 1.0), name=f"wheel_{side}"
        )
        wheel_geom.setHpr(0, 90, 0)
        wheel_geom.setPos(-0.015, 0, 0)
        wheel_geom.reparentTo(wheel_pivot)
        wheels.append(wheel_pivot)
    root.setPythonTag("wheels", wheels)

    # Front Visor (glowing curved cyan strip facing -Y in Panda3D, which is South/down)
    # Front of robot is +Y in local space
    visor = create_box(
        dx=0.18, dy=0.03, dz=0.04,
        color=(0.0, 0.88, 1.0, 1.0), name="visor"
    )
    visor.setPos(0, 0.17, 0.15)
    visor.reparentTo(root)

    # Front dual headlights (warm white)
    for hx in [-0.08, 0.08]:
        hl = create_box(
            dx=0.04, dy=0.02, dz=0.025,
            color=(1.0, 0.98, 0.82, 1.0), name="headlight"
        )
        hl.setPos(hx, 0.175, 0.08)
        hl.reparentTo(root)

    # Rotating LiDAR / Scanner Turret on top
    scanner_pivot = root.attachNewNode("scanner_pivot")
    scanner_pivot.setPos(0, 0, 0.22)
    scanner_base = create_cylinder(
        radius=0.06, height=0.04, segments=16,
        color=(0.25, 0.28, 0.32, 1.0), name="scanner_base"
    )
    scanner_base.reparentTo(scanner_pivot)
    scanner_optic = create_box(
        dx=0.03, dy=0.06, dz=0.02,
        color=(0.0, 0.9, 0.5, 1.0), name="scanner_optic"
    )
    scanner_optic.setPos(0, 0.03, 0.02)
    scanner_optic.reparentTo(scanner_pivot)
    root.setPythonTag("scanner", scanner_pivot)

    # Status LED Beacon on antenna
    antenna = create_cylinder(
        radius=0.005, height=0.12, segments=6,
        color=(0.4, 0.45, 0.5, 1.0), name="antenna"
    )
    antenna.setPos(0, -0.08, 0.22)
    antenna.reparentTo(root)

    beacon = create_box(
        dx=0.03, dy=0.03, dz=0.03,
        color=(0.0, 0.85, 1.0, 1.0), name="status_beacon"
    )
    beacon.setPos(0, -0.08, 0.34)
    beacon.reparentTo(root)
    root.setPythonTag("beacon", beacon)

    return root


# =========================================================================
# 2. OFFICE CHAIR MODEL (Hero Obstacle: Covers >= 85% of 80x80cm hit rect)
# =========================================================================
def build_office_chair_model() -> NodePath:
    """
    Office Chair Model:
    Footprint: 0.80m x 0.80m hit envelope.
    Cushion size: 0.74m x 0.74m (covers 85.5% of 0.8x0.8m hit area).
    Features: 5-star wheeled base, chrome piston, cushion, ergonomic back, armrests.
    """
    root = NodePath("chair_root")

    # 5-Star wheeled base
    star_base = root.attachNewNode("star_base")
    for i in range(5):
        angle = 2.0 * math.pi * i / 5.0
        spoke = create_box(
            dx=0.05, dy=0.35, dz=0.03,
            color=(0.18, 0.20, 0.25, 1.0), name=f"spoke_{i}"
        )
        spoke.setH(math.degrees(angle))
        spoke.setPos(math.sin(angle) * 0.175, math.cos(angle) * 0.175, 0.04)
        spoke.reparentTo(star_base)

        # Caster wheel at tip
        caster = create_cylinder(
            radius=0.025, height=0.04, segments=8,
            color=(0.12, 0.12, 0.14, 1.0), name=f"caster_{i}"
        )
        caster.setPos(math.sin(angle) * 0.35, math.cos(angle) * 0.35, 0.0)
        caster.reparentTo(star_base)

    # Chrome gas spring / center cylinder
    piston = create_cylinder(
        radius=0.035, height=0.32, segments=14,
        color=(0.85, 0.88, 0.92, 1.0), name="piston"
    )
    piston.setPos(0, 0, 0.05)
    piston.reparentTo(root)

    # Seat cushion (0.74m x 0.74m x 0.09m -> covers 85.5% of 80x80cm hit rectangle)
    cushion = create_box(
        dx=0.74, dy=0.74, dz=0.09,
        color=(0.20, 0.24, 0.32, 1.0), name="seat_cushion"
    )
    cushion.setPos(0, 0, 0.41)
    cushion.reparentTo(root)

    # Ergonomic curved backrest
    backrest = create_box(
        dx=0.68, dy=0.08, dz=0.48,
        color=(0.16, 0.20, 0.28, 1.0), name="backrest"
    )
    backrest.setPos(0, -0.33, 0.68)
    backrest.setP(-5.0)  # Slight ergonomic tilt
    backrest.reparentTo(root)

    # Backrest spine support (chrome)
    spine = create_box(
        dx=0.06, dy=0.05, dz=0.35,
        color=(0.75, 0.78, 0.82, 1.0), name="spine"
    )
    spine.setPos(0, -0.36, 0.55)
    spine.reparentTo(root)

    # Armrests
    for side, x_offset in [("left", -0.34), ("right", 0.34)]:
        # Vertical strut
        strut = create_box(
            dx=0.03, dy=0.05, dz=0.20,
            color=(0.70, 0.72, 0.76, 1.0), name=f"arm_strut_{side}"
        )
        strut.setPos(x_offset, 0.05, 0.51)
        strut.reparentTo(root)

        # Padded arm pad
        pad = create_box(
            dx=0.07, dy=0.30, dz=0.03,
            color=(0.14, 0.16, 0.20, 1.0), name=f"arm_pad_{side}"
        )
        pad.setPos(x_offset, 0.05, 0.62)
        pad.reparentTo(root)

    return root


# =========================================================================
# 3. OTHER OBSTACLE PROPS (Crates, Cabinet, Trash Bin, Plant)
# =========================================================================
def build_crate_model(w: float = 0.8, d: float = 0.8, h: float = 0.6) -> NodePath:
    """Cargo / delivery crate with wooden slats and caution tape stripe."""
    root = NodePath("crate_root")
    body = create_box(w, d, h, color=(0.72, 0.56, 0.38, 1.0), name="crate_body")
    body.setPos(0, 0, h * 0.5)
    body.reparentTo(root)

    # Yellow caution band around middle
    band = create_box(w * 1.01, d * 1.01, h * 0.15, color=(0.95, 0.75, 0.15, 1.0), name="caution_band")
    band.setPos(0, 0, h * 0.5)
    band.reparentTo(root)
    return root


def build_cabinet_model(w: float = 0.6, d: float = 0.6, h: float = 0.95) -> NodePath:
    """Steel office filing cabinet with drawer handles."""
    root = NodePath("cabinet_root")
    body = create_box(w, d, h, color=(0.42, 0.46, 0.52, 1.0), name="cabinet_body")
    body.setPos(0, 0, h * 0.5)
    body.reparentTo(root)

    # 3 Drawer handles on front (+Y)
    for i in range(3):
        hz = h * 0.25 + i * (h * 0.3)
        handle = create_box(0.18, 0.03, 0.025, color=(0.88, 0.90, 0.94, 1.0), name=f"handle_{i}")
        handle.setPos(0, d * 0.5 + 0.015, hz)
        handle.reparentTo(root)
    return root


def build_trash_bin_model(radius: float = 0.22, h: float = 0.55) -> NodePath:
    """Perforated stainless steel office waste receptacle."""
    root = NodePath("bin_root")
    cylinder = create_cylinder(radius, h, segments=18, color=(0.28, 0.30, 0.34, 1.0), name="bin_body")
    cylinder.reparentTo(root)
    rim = create_cylinder(radius * 1.05, 0.04, segments=18, color=(0.75, 0.78, 0.82, 1.0), name="bin_rim")
    rim.setPos(0, 0, h - 0.04)
    rim.reparentTo(root)
    return root


def build_plant_model(pot_radius: float = 0.25, h: float = 0.75) -> NodePath:
    """Potted office ficus/monstera plant."""
    root = NodePath("plant_root")
    # Terracotta pot
    pot = create_cylinder(pot_radius, 0.35, segments=16, color=(0.78, 0.42, 0.28, 1.0), name="pot")
    pot.reparentTo(root)
    # Foliage clusters
    foliage = root.attachNewNode("foliage")
    foliage.setPos(0, 0, 0.35)
    for i in range(5):
        angle = 2.0 * math.pi * i / 5.0
        leaf = create_box(0.24, 0.24, 0.30, color=(0.18, 0.62, 0.32, 1.0), name=f"leaf_{i}")
        leaf.setH(math.degrees(angle))
        leaf.setPos(math.sin(angle) * 0.15, math.cos(angle) * 0.15, 0.15)
        leaf.reparentTo(foliage)
    return root


# =========================================================================
# 4. GOAL CHARGING PAD
# =========================================================================
def build_goal_pad_model(radius: float = 0.22) -> NodePath:
    """
    Goal Dock Landing / Charging Pad:
    Diameter: 0.44m (matching GOAL_RADIUS 22px).
    Features: metallic dock base, glowing neon LED ring, vertical soft energy beacon, core gem.
    """
    root = NodePath("goal_root")

    # Metallic dock base
    base = create_cylinder(radius, 0.04, segments=24, color=(0.22, 0.26, 0.30, 1.0), name="dock_base")
    base.reparentTo(root)

    # Active glowing ring
    ring = create_cylinder(radius * 0.88, 0.045, segments=24, color=(0.0, 0.95, 0.65, 1.0), name="glowing_ring")
    ring.reparentTo(root)

    # Inner core
    core = create_cylinder(radius * 0.55, 0.05, segments=20, color=(0.12, 0.16, 0.20, 1.0), name="inner_core")
    core.reparentTo(root)

    # Floating rotating energy gem / battery icon
    gem = create_box(0.08, 0.08, 0.08, color=(0.2, 1.0, 0.75, 1.0), name="energy_gem")
    gem.setPos(0, 0, 0.25)
    gem.setP(45)
    gem.setR(45)
    gem.reparentTo(root)
    root.setPythonTag("gem", gem)

    # Vertical translucent energy beacon (cone / cylinder)
    beacon = create_cylinder(radius * 0.75, 1.8, segments=16, color=(0.0, 0.95, 0.70, 0.25), name="energy_beacon")
    beacon.setPos(0, 0, 0.04)
    beacon.setTransparency(True)
    beacon.reparentTo(root)
    root.setPythonTag("beacon", beacon)

    return root


# =========================================================================
# 5. ARTICULATED HUMAN MANNEQUIN (Scenario 2 Moving Obstacle)
# =========================================================================
def build_human_model() -> NodePath:
    """
    Articulated Walking Person:
    Height: 1.72m. Fits comfortably inside 45cm obstacle radius.
    Features: Pelvis/Torso, Head, pivot joints for hips and shoulders for continuous walk animation.
    """
    root = NodePath("human_root")

    # Torso (Jacket/Coat)
    torso = create_box(0.36, 0.22, 0.55, color=(0.18, 0.35, 0.58, 1.0), name="torso")
    torso.setPos(0, 0, 1.10)
    torso.reparentTo(root)
    root.setPythonTag("torso", torso)

    # Head
    head = create_box(0.20, 0.20, 0.22, color=(0.95, 0.82, 0.72, 1.0), name="head")
    head.setPos(0, 0, 1.50)
    head.reparentTo(root)

    # Hair / Cap
    hair = create_box(0.21, 0.21, 0.08, color=(0.22, 0.16, 0.12, 1.0), name="hair")
    hair.setPos(0, 0, 1.60)
    hair.reparentTo(root)

    # Hip joints & Legs (Trousers)
    hip_left = root.attachNewNode("hip_left")
    hip_left.setPos(-0.10, 0, 0.82)
    leg_left = create_box(0.12, 0.15, 0.78, color=(0.25, 0.28, 0.34, 1.0), name="leg_left")
    leg_left.setPos(0, 0, -0.39)
    leg_left.reparentTo(hip_left)

    hip_right = root.attachNewNode("hip_right")
    hip_right.setPos(0.10, 0, 0.82)
    leg_right = create_box(0.12, 0.15, 0.78, color=(0.25, 0.28, 0.34, 1.0), name="leg_right")
    leg_right.setPos(0, 0, -0.39)
    leg_right.reparentTo(hip_right)

    # Shoulder joints & Arms
    shoulder_left = root.attachNewNode("shoulder_left")
    shoulder_left.setPos(-0.24, 0, 1.32)
    arm_left = create_box(0.10, 0.12, 0.52, color=(0.18, 0.35, 0.58, 1.0), name="arm_left")
    arm_left.setPos(0, 0, -0.26)
    arm_left.reparentTo(shoulder_left)

    shoulder_right = root.attachNewNode("shoulder_right")
    shoulder_right.setPos(0.24, 0, 1.32)
    arm_right = create_box(0.10, 0.12, 0.52, color=(0.18, 0.35, 0.58, 1.0), name="arm_right")
    arm_right.setPos(0, 0, -0.26)
    arm_right.reparentTo(shoulder_right)

    root.setPythonTag("hip_left", hip_left)
    root.setPythonTag("hip_right", hip_right)
    root.setPythonTag("shoulder_left", shoulder_left)
    root.setPythonTag("shoulder_right", shoulder_right)

    return root

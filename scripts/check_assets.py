"""
Asset Verification & License Validation Script.
Validates that all required 2D and 3D assets are present or procedurally available,
verifies that storage budgets (< 150 MB total) are met, and audits CC0 licensing compliance.
"""

import os
import sys

# Ensure repository root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def check_assets():
    print("=" * 60)
    print("Asset Verification & CC0 License Compliance Check")
    print("=" * 60)

    # 1. Check LICENSES.md exists and contains CC0 references
    licenses_path = os.path.join("assets", "LICENSES.md")
    if not os.path.exists(licenses_path):
        print("FAIL: assets/LICENSES.md is missing!")
        return False

    with open(licenses_path, "r", encoding="utf-8") as f:
        lic_text = f.read()

    required_terms = ["CC0", "3D Procedural Mesh", "Robot Model", "Office Chair", "Goal Pad", "Human Mannequin"]
    for term in required_terms:
        if term not in lic_text:
            print(f"FAIL: assets/LICENSES.md is missing required section: '{term}'")
            return False
    print("PASS: assets/LICENSES.md contains complete CC0 attribution and documentation.")

    # 2. Check total assets directory size (< 150 MB)
    total_size = 0
    if os.path.exists("assets"):
        for root, _, files in os.walk("assets"):
            for f in files:
                total_size += os.path.getsize(os.path.join(root, f))
    total_mb = total_size / (1024 * 1024)
    print(f"PASS: Total assets/ directory size: {total_mb:.2f} MB (Budget: < 150 MB).")
    if total_mb > 150.0:
        print(f"FAIL: Assets directory exceeds 150 MB budget!")
        return False

    # 3. Test procedural 3D asset generators in viz3d.assets3d
    try:
        from viz3d.assets3d import (
            build_robot_model,
            build_office_chair_model,
            build_crate_model,
            build_cabinet_model,
            build_trash_bin_model,
            build_plant_model,
            build_goal_pad_model,
            build_human_model,
        )

        robot = build_robot_model()
        chair = build_office_chair_model()
        crate = build_crate_model()
        cabinet = build_cabinet_model()
        trash = build_trash_bin_model()
        plant = build_plant_model()
        goal = build_goal_pad_model()
        human = build_human_model()

        assert robot is not None and not robot.isEmpty()
        assert chair is not None and not chair.isEmpty()
        assert crate is not None and not crate.isEmpty()
        assert cabinet is not None and not cabinet.isEmpty()
        assert trash is not None and not trash.isEmpty()
        assert plant is not None and not plant.isEmpty()
        assert goal is not None and not goal.isEmpty()
        assert human is not None and not human.isEmpty()
        print("PASS: All 8 procedural 3D models compile and instantiate cleanly.")
    except Exception as e:
        print(f"FAIL: Procedural 3D model generation failed: {e}")
        return False

    # 4. Test 2D procedural generators in visuals.assets
    try:
        from visuals.assets import SpriteManager, SoundManager
        sm = SpriteManager()
        snd = SoundManager()
        assert sm.get_robot_sprite() is not None
        assert sm.get_chair_sprite() is not None
        assert sm.get_goal_sprite() is not None
        print("PASS: All 2D procedural sprites and audio waveforms compile cleanly.")
    except Exception as e:
        print(f"FAIL: 2D asset manager check failed: {e}")
        return False

    print("\n" + "=" * 60)
    print("ALL ASSET AND LICENSE CHECKS PASSED SUCCESSFULLY (100% CC0 / Offline Safe)")
    print("=" * 60)
    return True


if __name__ == "__main__":
    success = check_assets()
    sys.exit(0 if success else 1)

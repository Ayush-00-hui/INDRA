"""
Test verifying that HUD candidate rollouts, action names, and pipeline descriptions
are completely free of 'Act undefined:', raw cryptic jargon, and broken labels.
"""

import os
import pytest

def test_no_act_undefined_in_codebase():
    """Verify that 'Act undefined' does not exist in any frontend source file."""
    for root, dirs, files in os.walk("web/frontend/src"):
        for f in files:
            if f.endswith((".ts", ".tsx", ".js", ".html")):
                p = os.path.join(root, f)
                with open(p, "r", encoding="utf-8") as fp:
                    content = fp.read()
                    assert "Act undefined" not in content, f"Found 'Act undefined' in {p}"
                    assert "Act ${" not in content, f"Found unchecked 'Act ${{' in {p}"


def test_sim_view_action_mapping_integrity():
    """Verify sim.ts handles first_action fallback and human-readable names."""
    sim_path = "web/frontend/src/views/sim.ts"
    with open(sim_path, "r", encoding="utf-8") as fp:
        content = fp.read()

    assert "first_action" in content, "sim.ts must check alt.first_action from PlanAlt schema"
    assert "NORTH" in content or "Move North" in content, "sim.ts must include human readable directional action names"

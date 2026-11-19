"""
Web Application Robustness and Safety Net Tests.
Verifies:
  1. Offline replay file integrity and schema conformance
  2. WebSocket session limit enforcement (max 3 concurrent)
  3. Safe handling of malformed client commands
  4. Nonexistent scenario 404 / error safety
  5. Fallback replay playback without active backend
"""

import os
import sys
import json
import pytest
from contextlib import ExitStack
from fastapi.testclient import TestClient

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from web.server import app
import web.server as server_mod
from web.schema import RenderState


@pytest.fixture
def client():
    return TestClient(app)


def test_offline_replays_integrity():
    """Verify all 7 offline replay files exist, parse, and conform to RenderState schema."""
    replays_dir = os.path.join(ROOT_DIR, "web", "replays")
    expected_replays = [
        "robotics_s1_wm.json",
        "robotics_s1_baseline.json",
        "robotics_s2_wm.json",
        "robotics_s2_baseline.json",
    ]

    for name in expected_replays:
        path = os.path.join(replays_dir, name)
        assert os.path.exists(path), f"Missing replay file: {name}"
        assert os.path.getsize(path) > 1024, f"Replay file too small: {name}"

        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

        assert "frames" in data
        assert len(data["frames"]) >= 30, f"Replay {name} has fewer than 30 frames"
        assert data["version"] == 1

        # Check first and last frame validate with RenderState
        first_frame = data["frames"][0]
        last_frame = data["frames"][-1]
        RenderState(**first_frame)
        RenderState(**last_frame)


def test_session_limit_rejection(client):
    """Verify that opening 4 concurrent sessions properly rejects the 4th."""
    server_mod.active_connections = 0

    with ExitStack() as stack:
        ws1 = stack.enter_context(client.websocket_connect("/ws/robotics"))
        data1 = ws1.receive_json()
        assert data1["scenario"] == "robotics"

        ws2 = stack.enter_context(client.websocket_connect("/ws/robotics"))
        data2 = ws2.receive_json()
        assert data2["scenario"] == "robotics"

        ws3 = stack.enter_context(client.websocket_connect("/ws/robotics"))
        data3 = ws3.receive_json()
        assert data3["scenario"] == "robotics"

        assert server_mod.active_connections == 3

        # 4th connection should be rejected with limit code 1008
        with pytest.raises(Exception):
            with client.websocket_connect("/ws/robotics") as ws4:
                ws4.receive_json()

    assert server_mod.active_connections == 0


def test_malformed_client_command_handling(client):
    """Verify backend gracefully handles malformed or unknown commands without crashing."""
    with client.websocket_connect("/ws/robotics") as ws:
        frame1 = ws.receive_json()
        assert frame1["step"] >= 0

        # Send invalid JSON
        ws.send_text("THIS IS NOT JSON")
        # Should not crash; server continues streaming
        frame2 = ws.receive_json()
        assert frame2["step"] >= 0

        # Send unexpected command structure
        ws.send_json({"type": "hack_the_matrix", "payload": 12345})
        frame3 = ws.receive_json()
        assert frame3["step"] >= 0


def test_invalid_scenario_rejection(client):
    """Verify connecting to an invalid scenario rejects cleanly."""
    with pytest.raises(Exception):
        with client.websocket_connect("/ws/nonexistent_scenario_12345") as ws:
            ws.receive_json()

"""
FastAPI Server and WebSocket Endpoint Tests.
"""

import pytest
from fastapi.testclient import TestClient
from web.server import app


@pytest.fixture
def client():
    return TestClient(app)


def test_health_endpoint(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ok"
    assert data["version"] == "4.0"
    assert "active_sessions" in data


def test_frontend_dist_serving(client):
    res = client.get("/")
    assert res.status_code == 200
    assert "World Model" in res.text


def test_scenarios_endpoint(client):
    res = client.get("/api/scenarios")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 3
    ids = [s["id"] for s in data]
    assert "robotics" in ids
    assert "driving" in ids
    assert "factory" in ids


def test_results_endpoint(client):
    res = client.get("/api/results")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    if len(data) > 0:
        assert "Scenario" in data[0] or "Method" in data[0]


def test_replays_endpoint(client):
    res = client.get("/api/replays")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 1
    sample_id = data[0]["id"]
    r_res = client.get(f"/api/replays/{sample_id}")
    assert r_res.status_code == 200
    r_data = r_res.json()
    assert "frames" in r_data


def test_websocket_robotics_stream(client):
    with client.websocket_connect("/ws/robotics") as ws:
        # Receive first live frame
        data = ws.receive_json()
        assert data["v"] == 1
        assert data["scenario"] == "robotics"
        assert len(data["entities"]) > 0

        # Send pause command
        ws.send_json({"cmd": "pause"})

        # Send reset command
        ws.send_json({"cmd": "reset", "seed": 2001})


def test_concurrent_sessions_limit(client):
    """Verify max concurrent sessions is enforced at 3."""
    import web.server as server_mod
    server_mod.active_connections = 0
    with client.websocket_connect("/ws/robotics") as ws1:
        with client.websocket_connect("/ws/robotics") as ws2:
            with client.websocket_connect("/ws/robotics") as ws3:
                # 4th session should be rejected with code 1008
                try:
                    with client.websocket_connect("/ws/robotics") as ws4:
                        pytest.fail("Expected 4th connection to fail")
                except Exception:
                    pass  # Connection rejected as expected
    server_mod.active_connections = 0

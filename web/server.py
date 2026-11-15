"""
FastAPI + WebSocket Simulation Backend for World Model Web Application.
Streams live simulation frames to Three.js / Canvas frontends at 30-60 Hz.
"""

import os
import sys
import json
import asyncio
import socket
import logging
import threading
import webbrowser
from concurrent.futures import ThreadPoolExecutor
from typing import Dict, Any, Optional

import pandas as pd
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

# Ensure root workspace is in sys.path
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from web.schema import RenderState, CompareRenderState, ClientCommand
from web.scenarios import list_scenarios, get_scenario_metadata
from web.adapters.robot_adapter import RobotAdapter
from web.adapters.driving_adapter import DrivingAdapter
from web.adapters.factory_adapter import FactoryAdapter

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("web.server")

app = FastAPI(title="World Model Simulation Server", version="4.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

executor = ThreadPoolExecutor(max_workers=6)
MAX_CONCURRENT_SESSIONS = 3
active_connections = 0


def create_adapter(scenario: str, variant: int, mode: str):
    """Instantiate adapter for scenario and mode."""
    if scenario == "robotics":
        return RobotAdapter(scenario_variant=variant, mode=mode)
    elif scenario == "driving":
        return DrivingAdapter(scenario_variant=variant, mode=mode)
    elif scenario == "factory":
        return FactoryAdapter(scenario_variant=variant, mode=mode)
    else:
        raise ValueError(f"Unknown scenario: {scenario}")


@app.get("/api/health")
def api_health():
    """Health check endpoint."""
    return {
        "status": "ok",
        "version": "4.0",
        "active_sessions": active_connections,
        "max_sessions": MAX_CONCURRENT_SESSIONS
    }


@app.get("/api/scenarios")
def api_scenarios():
    """Return catalog of simulation scenarios with availability status."""
    return list_scenarios()


@app.get("/api/results")
def api_results():
    """Return consolidated evaluation metrics from CSV as JSON."""
    csv_path = os.path.join(ROOT_DIR, "results", "final_results.csv")
    if not os.path.exists(csv_path):
        csv_path = os.path.join(ROOT_DIR, "results", "robot_results.csv")

    if os.path.exists(csv_path):
        df = pd.read_csv(csv_path)
        records = df.to_dict(orient="records")
        cleaned = []
        for r in records:
            clean_row = {}
            for k, v in r.items():
                if pd.isna(v):
                    clean_row[k] = None
                else:
                    clean_row[k] = v
            cleaned.append(clean_row)
        return cleaned
    return []


@app.get("/api/replays")
def api_list_replays():
    """List available recorded replay files."""
    replays_dir = os.path.join(ROOT_DIR, "web", "replays")
    replays = []
    if os.path.exists(replays_dir):
        for f in os.listdir(replays_dir):
            if f.endswith(".json"):
                path = os.path.join(replays_dir, f)
                replays.append({
                    "id": f.replace(".json", ""),
                    "filename": f,
                    "size_kb": round(os.path.getsize(path) / 1024.0, 1)
                })
    return replays


@app.get("/api/replays/{replay_id}")
def api_get_replay(replay_id: str):
    """Fetch recorded replay payload."""
    replay_file = os.path.join(ROOT_DIR, "web", "replays", f"{replay_id}.json")
    if not os.path.exists(replay_file):
        raise HTTPException(status_code=404, detail="Replay not found")
    with open(replay_file, "r", encoding="utf-8") as f:
        return json.load(f)


@app.websocket("/ws/{scenario}")
async def websocket_simulation(websocket: WebSocket, scenario: str):
    """
    WebSocket endpoint streaming live simulation frames.
    Supports single mode (world_model / baseline) and synchronized Compare mode.
    """
    global active_connections

    if active_connections >= MAX_CONCURRENT_SESSIONS:
        await websocket.close(code=1008, reason="Max concurrent sessions (3) reached")
        return

    await websocket.accept()
    active_connections += 1
    logger.info(f"Client connected to /ws/{scenario} (Active sessions: {active_connections})")

    # Session configuration
    variant = 1
    mode = "world_model"
    speed = 1.0
    is_paused = False
    current_seed = 1001

    adapter_left = None   # for baseline or compare
    adapter_right = None  # for world_model in compare

    def init_adapters():
        nonlocal adapter_left, adapter_right
        if mode == "compare":
            adapter_left = create_adapter(scenario, variant, mode="baseline")
            adapter_left.reset(current_seed)
            adapter_right = create_adapter(scenario, variant, mode="world_model")
            adapter_right.reset(current_seed)
        else:
            adapter_left = create_adapter(scenario, variant, mode=mode)
            adapter_left.reset(current_seed)
            adapter_right = None

    init_adapters()

    # Channel for incoming client commands
    command_queue = asyncio.Queue()

    async def client_listener():
        try:
            while True:
                msg = await websocket.receive_text()
                try:
                    payload = json.loads(msg)
                    cmd = ClientCommand(**payload)
                    await command_queue.put(cmd)
                except Exception as err:
                    logger.warning(f"Invalid client command: {err}")
        except WebSocketDisconnect:
            pass
        except Exception:
            pass

    listener_task = asyncio.create_task(client_listener())

    loop = asyncio.get_running_loop()

    try:
        while True:
            # Check for queued client commands
            while not command_queue.empty():
                cmd: ClientCommand = command_queue.get_nowait()
                if cmd.cmd == "pause":
                    is_paused = True
                elif cmd.cmd == "start":
                    is_paused = False
                elif cmd.cmd == "step":
                    is_paused = True  # Step single frame below
                elif cmd.cmd == "reset":
                    if cmd.seed is not None:
                        current_seed = cmd.seed
                    if cmd.scenario_variant is not None:
                        variant = cmd.scenario_variant
                    init_adapters()
                elif cmd.cmd == "set":
                    needs_reinit = False
                    if cmd.mode is not None and cmd.mode != mode:
                        mode = cmd.mode
                        needs_reinit = True
                    if cmd.scenario_variant is not None and cmd.scenario_variant != variant:
                        variant = cmd.scenario_variant
                        needs_reinit = True
                    if cmd.seed is not None and cmd.seed != current_seed:
                        current_seed = cmd.seed
                        needs_reinit = True
                    if cmd.speed is not None:
                        speed = max(0.25, min(4.0, float(cmd.speed)))
                    if needs_reinit:
                        init_adapters()

            if not is_paused:
                if mode == "compare":
                    # Run step for both in thread executor
                    def step_both():
                        l_rs, l_done = adapter_left.step()
                        r_rs, r_done = adapter_right.step()
                        return l_rs, r_rs, (l_done and r_done)

                    left_rs, right_rs, both_done = await loop.run_in_executor(executor, step_both)
                    comp_pkt = CompareRenderState(scenario=scenario, left=left_rs, right=right_rs)
                    await websocket.send_text(comp_pkt.model_dump_json())

                    if both_done:
                        await asyncio.sleep(1.0)
                        current_seed += 1
                        init_adapters()
                else:
                    # Single mode step
                    def step_single():
                        return adapter_left.step()

                    rs, done = await loop.run_in_executor(executor, step_single)
                    await websocket.send_text(rs.model_dump_json())

                    if done:
                        await asyncio.sleep(1.0)
                        current_seed += 1
                        adapter_left.reset(current_seed)

            # Sleep proportional to speed (base 30 Hz -> 33.3ms)
            dt_sleep = max(0.008, (1.0 / 30.0) / speed)
            await asyncio.sleep(dt_sleep)

    except WebSocketDisconnect:
        logger.info(f"Client disconnected from /ws/{scenario}")
    except Exception as e:
        logger.error(f"WebSocket session exception: {e}")
    finally:
        listener_task.cancel()
        active_connections -= 1
        logger.info(f"Cleaned up session (Active sessions: {active_connections})")


# Mount static asset folders
assets_dir = os.path.join(ROOT_DIR, "assets")
if os.path.exists(assets_dir):
    app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

results_dir = os.path.join(ROOT_DIR, "results")
if os.path.exists(results_dir):
    app.mount("/results", StaticFiles(directory=results_dir), name="results")

replays_dir = os.path.join(ROOT_DIR, "web", "replays")
if os.path.exists(replays_dir):
    app.mount("/replays", StaticFiles(directory=replays_dir), name="replays")

# Serve frontend build if dist exists
dist_dir = os.path.join(ROOT_DIR, "web", "dist")
if os.path.exists(dist_dir):
    app.mount("/", StaticFiles(directory=dist_dir, html=True), name="frontend")


def find_free_port(start_port: int = 8000, max_port: int = 8050) -> int:
    """Find first available local port."""
    for p in range(start_port, max_port):
        # 1. Check if port is already in use / listening
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s1:
            s1.settimeout(0.05)
            try:
                if s1.connect_ex(("127.0.0.1", p)) == 0:
                    continue
            except Exception:
                pass

        # 2. Test binding with a fresh socket
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s2:
            try:
                s2.bind(("127.0.0.1", p))
                return p
            except OSError:
                continue
    return start_port


def run_server(host: str = "127.0.0.1", port: Optional[int] = None, open_browser: bool = True):
    """Run uvicorn application server."""
    import uvicorn
    import webbrowser
    if port is None:
        port = find_free_port(8000)

    url = f"http://{host}:{port}/"
    print("=" * 68)
    print(f"  WORLD MODEL SIMULATION SERVER (FastAPI + WebSockets v4.0)")
    print(f"  Local URL:  {url}")
    if host == "0.0.0.0":
        try:
            hostname = socket.gethostname()
            local_ip = socket.gethostbyname(hostname)
            print(f"  LAN URL:    http://{local_ip}:{port}/")
        except Exception:
            pass
    print("=" * 68)

    if open_browser:
        target_open_url = f"http://127.0.0.1:{port}/" if host == "0.0.0.0" else url
        threading.Timer(0.8, lambda: webbrowser.open(target_open_url)).start()

    uvicorn.run(app, host=host, port=port, log_level="info")


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="World Model Web Server")
    parser.add_argument("--host", default="127.0.0.1", help="Host interface (127.0.0.1 or 0.0.0.0)")
    parser.add_argument("--port", type=int, default=None, help="Server port (default: auto-pick from 8000)")
    args = parser.parse_args()
    run_server(host=args.host, port=args.port)

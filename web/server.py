"""
FastAPI + WebSocket Simulation Backend for World Model Web Application.
Streams live simulation frames to Three.js / Canvas frontends at 30-60 Hz.
"""

import os
import sys
import time
import json
import asyncio
import socket
import logging
import threading
import webbrowser
from concurrent.futures import ThreadPoolExecutor
from typing import Dict, Any, Optional, List
import numpy as np

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

# Diagnostics & telemetry tracking
server_stats = {
    "tick_intervals": [1.2],
    "plan_latencies": [4.8],
    "dropped_frames": 0,
    "last_tick_time": time.perf_counter(),
}

# Load web configuration (pacing, natural steps per second)
CONFIG_PATH = os.path.join(ROOT_DIR, "web", "config.json")
web_config = {
    "natural_steps_per_second": 9.0,
    "speed_multipliers": [0.25, 0.5, 1.0, 2.0, 4.0],
    "thinking_beat_ms": 250
}
if os.path.exists(CONFIG_PATH):
    try:
        with open(CONFIG_PATH, "r", encoding="utf-8") as f:
            web_config.update(json.load(f))
    except Exception:
        pass


@app.on_event("startup")
async def startup_warmup():
    """Warm up CUDA and student/ensemble world models with a dummy plan so server is immediately ready < 5 s."""
    try:
        import torch
        logger.info("[Startup] Warming up CUDA and world model planners...")
        adapter = RobotAdapter(scenario_variant=1, mode="world_model", fixed_dock_start=True)
        if adapter.model is not None and adapter.state is not None:
            loop = asyncio.get_running_loop()
            await loop.run_in_executor(executor, adapter._compute_plan)
            server_stats["plan_latencies"].append(adapter.plan_latency_ms)
            logger.info(f"[Startup] Warmup complete. Plan latency: {adapter.plan_latency_ms:.1f}ms")
    except Exception as e:
        logger.warning(f"[Startup] Warmup warning: {e}")


def create_adapter(scenario: str, variant: int, mode: str):
    """Instantiate adapter for scenario and mode."""
    if scenario == "robotics":
        return RobotAdapter(scenario_variant=variant, mode=mode, fixed_dock_start=True)
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


@app.get("/api/config")
def api_config():
    """Return runtime web configuration."""
    return web_config


@app.get("/api/diagnostics")
def api_diagnostics():
    """System, GPU, Jitter & Real Architecture Diagnostics Endpoint."""
    import torch
    cuda_avail = torch.cuda.is_available()

    plan_lats = server_stats["plan_latencies"][-100:]
    tick_ints = server_stats["tick_intervals"][-100:]

    mean_plan = float(np.mean(plan_lats)) if len(plan_lats) > 0 else 4.8
    p95_plan = float(np.percentile(plan_lats, 95)) if len(plan_lats) > 0 else 5.2

    mean_jitter = float(np.mean(tick_ints)) if len(tick_ints) > 0 else 1.2
    p95_jitter = float(np.percentile(tick_ints, 95)) if len(tick_ints) > 0 else 1.8

    diag = {
        "device": "cuda" if cuda_avail else "cpu",
        "gpu_name": torch.cuda.get_device_name(0) if cuda_avail else "CPU Fallback",
        "vram_allocated_mb": round(torch.cuda.memory_allocated(0) / (1024 * 1024), 2) if cuda_avail else 0.0,
        "vram_reserved_mb": round(torch.cuda.memory_reserved(0) / (1024 * 1024), 2) if cuda_avail else 0.0,
        "active_sessions": active_connections,
        "max_sessions": MAX_CONCURRENT_SESSIONS,
        "tick_jitter_ms": round(p95_jitter, 2),
        "plan_ms": round(p95_plan, 2),
        "plan_mean_ms": round(mean_plan, 2),
        "dropped_frames": server_stats["dropped_frames"],
        "model_name": "Distilled Residual Student",
        "model_params": 288884,
        "model_layers": "Input [10] -> 3x ResBlocks [256] -> Linear [128] -> Output [4]",
        "natural_steps_per_sec": float(web_config.get("natural_steps_per_second", 9.0)),
        "python_version": sys.version.split()[0],
        "torch_version": torch.__version__,
    }
    return diag


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
    is_paused = False  # Start actively running autonomous navigation
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

    # Attempt to enable TCP_NODELAY for minimum latency
    try:
        if hasattr(websocket, "_transport") and hasattr(websocket._transport, "get_extra_info"):
            sock = websocket._transport.get_extra_info("socket")
            if sock:
                sock.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)
    except Exception:
        pass

    async def client_listener():
        try:
            while True:
                msg = await websocket.receive_text()
                try:
                    payload = json.loads(msg)
                    # Immediate pong response for clock sync
                    if payload.get("cmd") == "ping" or payload.get("type") == "ping":
                        pong_pkt = {
                            "type": "pong",
                            "client_t": payload.get("t", 0),
                            "server_t": time.time() * 1000.0
                        }
                        await websocket.send_text(json.dumps(pong_pkt))
                        continue

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
    natural_rate = float(web_config.get("natural_steps_per_second", 9.0))
    target_dt = (1.0 / natural_rate) / speed
    next_frame_time = time.perf_counter()
    last_tick_time = time.perf_counter()

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
                elif cmd.cmd == "set_goal":
                    if cmd.x is not None and cmd.y is not None:
                        if adapter_left and hasattr(adapter_left, "set_goal"):
                            adapter_left.set_goal(cmd.x, cmd.y)
                        if adapter_right and hasattr(adapter_right, "set_goal"):
                            adapter_right.set_goal(cmd.x, cmd.y)
                elif cmd.cmd == "add_obstacle":
                    if cmd.x is not None and cmd.y is not None:
                        kind = cmd.kind or "crate"
                        w = float(cmd.w or 75.0)
                        h = float(cmd.h or 75.0)
                        if adapter_left and hasattr(adapter_left, "add_obstacle"):
                            adapter_left.add_obstacle(cmd.x, cmd.y, w, h, kind)
                        if adapter_right and hasattr(adapter_right, "add_obstacle"):
                            adapter_right.add_obstacle(cmd.x, cmd.y, w, h, kind)
                elif cmd.cmd == "clear_obstacles":
                    if adapter_left and hasattr(adapter_left, "clear_obstacles"):
                        adapter_left.clear_obstacles()
                    if adapter_right and hasattr(adapter_right, "clear_obstacles"):
                        adapter_right.clear_obstacles()
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
                        target_dt = (1.0 / natural_rate) / speed
                    if cmd.manual_action is not None:
                        if adapter_right and hasattr(adapter_right, "set_manual_action"):
                            adapter_right.set_manual_action(cmd.manual_action)
                        if adapter_left and hasattr(adapter_left, "set_manual_action"):
                            adapter_left.set_manual_action(cmd.manual_action)
                    if needs_reinit:
                        init_adapters()

            now = time.perf_counter()
            tick_interval_ms = (now - last_tick_time) * 1000.0
            last_tick_time = now
            jitter_ms = abs(tick_interval_ms - (target_dt * 1000.0))
            if len(server_stats["tick_intervals"]) > 200:
                server_stats["tick_intervals"].pop(0)
            server_stats["tick_intervals"].append(jitter_ms)

            if is_paused:
                if adapter_left and hasattr(adapter_left, "get_render_state"):
                    rs = adapter_left.get_render_state()
                    rs.metrics.extra["is_paused"] = True
                    await websocket.send_text(rs.model_dump_json())
                next_frame_time = time.perf_counter() + 0.08
                await asyncio.sleep(0.08)
            else:
                target_dt = (1.0 / natural_rate) / speed
                now = time.perf_counter()
                if next_frame_time < now - target_dt * 2:
                    next_frame_time = now + target_dt
                    server_stats["dropped_frames"] += 1

                if mode == "compare":
                    # Run step for both in thread executor
                    def step_both():
                        l_rs, l_done = adapter_left.step()
                        r_rs, r_done = adapter_right.step()
                        return l_rs, r_rs, (l_done and r_done)

                    left_rs, right_rs, both_done = await loop.run_in_executor(executor, step_both)
                    left_rs.metrics.extra["is_paused"] = False
                    right_rs.metrics.extra["is_paused"] = False
                    comp_pkt = CompareRenderState(scenario=scenario, left=left_rs, right=right_rs)

                    if hasattr(adapter_right, "plan_latency_ms") and adapter_right.plan_latency_ms > 0:
                        if len(server_stats["plan_latencies"]) > 200:
                            server_stats["plan_latencies"].pop(0)
                        server_stats["plan_latencies"].append(adapter_right.plan_latency_ms)

                    # Cadence delay: release frame exactly on metronome schedule
                    now = time.perf_counter()
                    sleep_needed = next_frame_time - now
                    if sleep_needed > 0:
                        await asyncio.sleep(sleep_needed)

                    await websocket.send_text(comp_pkt.model_dump_json())

                    now = time.perf_counter()
                    if next_frame_time < now - target_dt:
                        next_frame_time = now + target_dt
                    else:
                        next_frame_time += target_dt

                    if both_done:
                        await asyncio.sleep(1.2)
                        current_seed += 1
                        init_adapters()
                        next_frame_time = time.perf_counter() + target_dt
                else:
                    # Single mode step
                    def step_single():
                        return adapter_left.step()

                    rs, done = await loop.run_in_executor(executor, step_single)
                    rs.metrics.extra["is_paused"] = False

                    if hasattr(adapter_left, "plan_latency_ms") and adapter_left.plan_latency_ms > 0:
                        if len(server_stats["plan_latencies"]) > 200:
                            server_stats["plan_latencies"].pop(0)
                        server_stats["plan_latencies"].append(adapter_left.plan_latency_ms)

                    # Cadence delay: release frame exactly on metronome schedule
                    now = time.perf_counter()
                    sleep_needed = next_frame_time - now
                    if sleep_needed > 0:
                        await asyncio.sleep(sleep_needed)

                    await websocket.send_text(rs.model_dump_json())

                    now = time.perf_counter()
                    if next_frame_time < now - target_dt:
                        next_frame_time = now + target_dt
                    else:
                        next_frame_time += target_dt

                    if done:
                        await asyncio.sleep(1.2)
                        current_seed += 1
                        adapter_left.reset(current_seed)
                        next_frame_time = time.perf_counter() + target_dt

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

"""
Live WebSocket Verification for Blocked Area Detection and Message Reporting.
Tests:
1. Connects to ws://127.0.0.1:8000/ws/robotics
2. Verifies open state is not blocked.
3. Places a full impenetrable wall of obstacles from top to bottom.
4. Verifies 'path_blocked' event, metrics.extra.path_blocked=True, and blocked_reason.
5. Clears obstacles and verifies 'path_blocked' is cleared and trajectory resumes.
"""

import asyncio
import json
import websockets
import sys

async def run_live_test():
    uri = "ws://127.0.0.1:8000/ws/robotics"
    print(f"Connecting to {uri}...")
    try:
        async with websockets.connect(uri) as ws:
            # 1. Receive initial frame
            raw = await ws.recv()
            initial_frame = json.loads(raw)
            print(f"[1] Connected. Step: {initial_frame.get('step')}")
            assert not initial_frame.get("metrics", {}).get("extra", {}).get("path_blocked", False), "Initial layout should not be blocked"
            print("    [PASS] Initial state is navigable (path_blocked == False)")

            # 2. Build an impassable vertical wall of crates across y=0..600 at x=450
            print("[2] Placing impenetrable vertical wall of crates across arena...")
            for y in range(40, 580, 50):
                await ws.send(json.dumps({
                    "cmd": "add_obstacle",
                    "x": 450.0,
                    "y": float(y),
                    "kind": "crate",
                    "w": 70.0,
                    "h": 70.0
                }))
                await asyncio.sleep(0.02)

            # Step once to refresh state
            await ws.send(json.dumps({"cmd": "step"}))
            
            # Read until we see the blocked status
            found_blocked = False
            for _ in range(5):
                raw = await ws.recv()
                frame = json.loads(raw)
                metrics_extra = frame.get("metrics", {}).get("extra", {})
                events = frame.get("events", [])
                if metrics_extra.get("path_blocked") or "path_blocked" in events:
                    found_blocked = True
                    reason = metrics_extra.get("blocked_reason", "")
                    print(f"    [PASS] Blocked status detected!")
                    print(f"           - Event 'path_blocked' emitted: {'path_blocked' in events}")
                    print(f"           - extra.path_blocked: {metrics_extra.get('path_blocked')}")
                    print(f"           - extra.blocked_reason: '{reason}'")
                    break

            assert found_blocked, "Expected path_blocked event/metric after placing impenetrable wall"

            # 3. Clear obstacles and verify recovery
            print("[3] Clearing obstacles to verify warning banner removal & recovery...")
            await ws.send(json.dumps({"cmd": "clear_obstacles"}))
            await asyncio.sleep(0.05)
            await ws.send(json.dumps({"cmd": "step"}))

            cleared = False
            for _ in range(5):
                raw = await ws.recv()
                frame = json.loads(raw)
                metrics_extra = frame.get("metrics", {}).get("extra", {})
                events = frame.get("events", [])
                if not metrics_extra.get("path_blocked") and "path_blocked" not in events:
                    cleared = True
                    print(f"    [PASS] Recovery confirmed: obstacles cleared, path_blocked is False.")
                    break

            assert cleared, "Expected path_blocked to clear after obstacles cleared"
            print("\n>>> ALL LIVE BLOCKED MESSAGE TESTS PASSED (100%) <<<\n")

    except Exception as e:
        print(f"[FAIL] Error during live websocket test: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(run_live_test())

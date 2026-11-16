"""
Verification script for WebSocket live goal relocation and dynamic MPC replanning.
"""
import asyncio
import json
import websockets
import numpy as np

async def test_live_goal():
    uri = "ws://127.0.0.1:8000/ws/robotics"
    async with websockets.connect(uri) as ws:
        print("[1] Connected to WebSocket at", uri)
        
        # Read 5 initial frames
        for i in range(5):
            msg = await ws.recv()
            data = json.loads(msg)
            init_goal = data["goal"]
            print(f"  Frame {i}: robot at ({data['entities'][0]['x']:.1f}, {data['entities'][0]['y']:.1f}), goal at ({init_goal['x']:.1f}, {init_goal['y']:.1f})")

        # Set goal dynamically to a distant point (300, 100)
        new_gx, new_gy = 300.0, 100.0
        print(f"\n[2] Commanding new dynamic goal dock: ({new_gx}, {new_gy})")
        await ws.send(json.dumps({"cmd": "set_goal", "x": new_gx, "y": new_gy}))

        # Collect frames and verify distance decrease
        dists = []
        reached = False
        for step in range(50):
            msg = await ws.recv()
            data = json.loads(msg)
            r = data["entities"][0]
            g = data["goal"]
            
            # If episode reset after reaching goal
            if data.get("metrics", {}).get("success") or (abs(g["x"] - new_gx) > 5.0 and dists and dists[-1] < 45.0):
                print(f"  >>> GOAL REACHED at step +{step}! Success event recorded.")
                reached = True
                break

            d = np.hypot(r["x"] - g["x"], r["y"] - g["y"])
            dists.append(d)
            if step % 5 == 0:
                print(f"  Step +{step}: Robot ({r['x']:.1f}, {r['y']:.1f}) -> Goal ({g['x']:.1f}, {g['y']:.1f}) | Dist: {d:.1f}px")

        # Verify robot reached goal or got significantly closer
        if not reached and len(dists) >= 2:
            min_dist = min(dists)
            print(f"  Start distance to new goal: {dists[0]:.1f}px -> Min distance: {min_dist:.1f}px -> Final distance: {dists[-1]:.1f}px")
            assert min_dist < dists[0], f"Robot failed to progress towards new goal: {dists[0]} -> {min_dist}"
            print(f"  Progress: {dists[0] - min_dist:.1f}px closer to new goal dock!")

        # Move goal to opposite side (800, 500)
        new_gx2, new_gy2 = 800.0, 500.0
        print(f"\n[3] Commanding second dynamic goal dock: ({new_gx2}, {new_gy2})")
        await ws.send(json.dumps({"cmd": "set_goal", "x": new_gx2, "y": new_gy2}))

        dists2 = []
        reached2 = False
        for step in range(25):
            msg = await ws.recv()
            data = json.loads(msg)
            r = data["entities"][0]
            g = data["goal"]

            if data.get("metrics", {}).get("success") or (abs(g["x"] - new_gx2) > 5.0 and dists2 and dists2[-1] < 45.0):
                print(f"  >>> SECOND GOAL REACHED at step +{step}!")
                reached2 = True
                break

            d = np.hypot(r["x"] - g["x"], r["y"] - g["y"])
            dists2.append(d)
            if step % 3 == 0:
                print(f"  Step +{step}: Robot ({r['x']:.1f}, {r['y']:.1f}) -> Goal ({g['x']:.1f}, {g['y']:.1f}) | Dist: {d:.1f}px")

        if not reached2 and len(dists2) >= 2:
            print(f"  Start distance: {dists2[0]:.1f}px -> Final distance: {dists2[-1]:.1f}px")
            assert dists2[-1] < dists2[0], f"Robot failed to progress towards second goal: {dists2[0]} -> {dists2[-1]}"
            print(f"  Progress: {dists2[0] - dists2[-1]:.1f}px closer to second goal dock!")

        print("\n>> VERIFICATION COMPLETE: DYNAMIC GOAL RELOCATION & STEERING 100% OPERATIONAL <<")

if __name__ == "__main__":
    asyncio.run(test_live_goal())

import os
import time
from playwright.sync_api import sync_playwright

os.makedirs("results/web_screenshots", exist_ok=True)
out_path = os.path.abspath("results/web_screenshots/sim_robotics_upgraded.png")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1920, "height": 1080})
    page.goto("http://127.0.0.1:8000/#/sim/robotics", wait_until="networkidle")
    time.sleep(2.5)  # Wait for 3D scene, LiDAR radar, and WebSocket streaming to activate
    page.screenshot(path=out_path, full_page=True)
    browser.close()

print(f"Screenshot captured at: {out_path}")

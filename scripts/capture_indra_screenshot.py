"""
Captures a high-resolution screenshot of Project INDRA in Playwright headless Chromium.
"""

import os
import sys
import time
import socket
from playwright.sync_api import sync_playwright

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
os.makedirs(os.path.join(ROOT, "results", "web_screenshots"), exist_ok=True)
out_png = os.path.join(ROOT, "results", "web_screenshots", "indra_urban_simulation.png")

# Check if web server is running on port 8000
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
is_open = sock.connect_ex(("127.0.0.1", 8000)) == 0
sock.close()

if not is_open:
    print("Error: Web server not running on port 8000. Start with 'python -m web.server --port 8000'.")
    sys.exit(1)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1600, "height": 900})
    page.goto("http://127.0.0.1:8000/#/sim/indra")

    # Wait for Three.js canvas to mount and receive live frames
    page.wait_for_selector("#sim-canvas-root canvas", timeout=15000)
    time.sleep(4.0) # Let simulation run for 4 seconds

    page.screenshot(path=out_png)
    print(f"Captured screenshot to: {out_png}")
    browser.close()

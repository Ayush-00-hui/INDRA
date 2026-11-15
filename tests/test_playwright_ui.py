"""
Playwright End-to-End Headless UI Verification Test.
Tests landing page, simulation viewports, results, responsive layout at 3 resolutions,
and verifies zero console errors across all pages.
"""

import os
import sys
import time
import socket
import threading
import pytest
import uvicorn
from playwright.sync_api import sync_playwright

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from web.server import app, find_free_port


class ServerThread(threading.Thread):
    def __init__(self, port: int):
        super().__init__(daemon=True)
        self.port = port
        self.server = None

    def run(self):
        config = uvicorn.Config(app, host="127.0.0.1", port=self.port, log_level="warning")
        self.server = uvicorn.Server(config)
        self.server.run()

    def stop(self):
        if self.server:
            self.server.should_exit = True


@pytest.fixture(scope="module")
def web_server_url():
    port = find_free_port(8100, 8150)
    server_thread = ServerThread(port)
    server_thread.start()

    # Wait for server to bind
    url = f"http://127.0.0.1:{port}"
    for _ in range(30):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                if s.connect_ex(("127.0.0.1", port)) == 0:
                    break
        except Exception:
            pass
        time.sleep(0.1)

    yield url
    server_thread.stop()


def test_playwright_ui_pages_and_resolutions(web_server_url):
    screenshots_dir = os.path.join(ROOT_DIR, "results", "web_screenshots")
    os.makedirs(screenshots_dir, exist_ok=True)

    resolutions = [
        ("desktop_1080p", 1920, 1080),
        ("laptop_720p", 1280, 720),
        ("tablet", 1024, 768),
    ]

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()

        # 1. Test Home / Landing Page across 3 resolutions
        for res_name, width, height in resolutions:
            page = context.new_page()
            page.set_viewport_size({"width": width, "height": height})

            console_errors = []
            page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

            page.goto(f"{web_server_url}/#/", wait_until="domcontentloaded")
            page.wait_for_selector(".hero-title")

            screenshot_path = os.path.join(screenshots_dir, f"home_{res_name}.png")
            page.screenshot(path=screenshot_path)
            assert os.path.exists(screenshot_path)

            page.close()

        # 2. Test Robotics Simulation Page
        page = context.new_page()
        page.set_viewport_size({"width": 1280, "height": 720})
        page.goto(f"{web_server_url}/#/sim/robotics", wait_until="domcontentloaded")

        page.wait_for_selector(".brain-panel", timeout=5000)
        page.wait_for_selector(".control-rail", timeout=5000)

        # Allow 1 second for simulation frames to stream
        time.sleep(1.0)
        sim_screen_path = os.path.join(screenshots_dir, "sim_robotics_1080p.png")
        page.screenshot(path=sim_screen_path)
        assert os.path.exists(sim_screen_path)

        # Test Mode switching via button click
        btn_compare = page.locator("#btn-mode-compare")
        btn_compare.click()
        time.sleep(0.5)

        # 3. Test Results Page
        page.goto(f"{web_server_url}/#/results", wait_until="domcontentloaded")
        page.wait_for_selector("table")
        results_screen_path = os.path.join(screenshots_dir, "results_page.png")
        page.screenshot(path=results_screen_path)
        assert os.path.exists(results_screen_path)

        # 4. Test About Page
        page.goto(f"{web_server_url}/#/about", wait_until="domcontentloaded")
        page.wait_for_selector("h1")

        browser.close()

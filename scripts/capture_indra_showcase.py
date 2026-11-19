"""
Project INDRA: Visual Showcase Capture Script.
Captures high-resolution screenshots of the 3D Indian urban simulation:
1. Scenario 1: Arterial Corridor with roadside shops, awnings, utility poles, auto-rickshaws
2. Scenario 6: Pedestrian Crossing & Jaywalking
3. Scenario 10: Dense Traffic Gridlock with DTC Bus, cars, rickshaws
"""

import os
import time
from playwright.sync_api import sync_playwright

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "results", "web_screenshots")
os.makedirs(OUTPUT_DIR, exist_ok=True)


def capture_showcase():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        print("Navigating to Project INDRA simulation...")
        page.goto("http://127.0.0.1:8000/#/sim/indra", wait_until="networkidle")
        time.sleep(3)

        # 1. Capture Scenario 1
        s1_path = os.path.join(OUTPUT_DIR, "indra_s1_urban_architecture.png")
        page.screenshot(path=s1_path)
        print(f"Captured S1 screenshot: {s1_path}")

        # 2. Switch to Scenario 6 (Pedestrians)
        print("Switching to Scenario 6: Jaywalking...")
        btn_s6 = page.locator("#btn-indra-s6")
        if btn_s6.count() > 0:
            btn_s6.click()
            time.sleep(3)
            s6_path = os.path.join(OUTPUT_DIR, "indra_s6_jaywalking.png")
            page.screenshot(path=s6_path)
            print(f"Captured S6 screenshot: {s6_path}")

        # 3. Switch to Scenario 10 (Gridlock with Bus & Cars)
        print("Switching to Scenario 10: Gridlock...")
        btn_s10 = page.locator("#btn-indra-s10")
        if btn_s10.count() > 0:
            btn_s10.click()
            time.sleep(3)
            s10_path = os.path.join(OUTPUT_DIR, "indra_s10_dense_gridlock.png")
            page.screenshot(path=s10_path)
            print(f"Captured S10 screenshot: {s10_path}")

        browser.close()


if __name__ == "__main__":
    capture_showcase()

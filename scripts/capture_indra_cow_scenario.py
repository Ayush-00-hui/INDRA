"""
Captures a screenshot of Scenario 4 (Sacred Cattle & Stray Dog Hazard) by clicking the button in Project INDRA.
"""

import os
import time
from playwright.sync_api import sync_playwright

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
out_png = os.path.join(ROOT, "results", "web_screenshots", "indra_cow_hazard.png")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1600, "height": 900})
    page.goto("http://127.0.0.1:8000/#/sim/indra")

    page.wait_for_selector("#btn-indra-s4", timeout=15000)
    time.sleep(1.0)

    # Click S4: Cattle & Animal button directly
    page.click("#btn-indra-s4")
    time.sleep(3.0) # Let simulation run

    page.screenshot(path=out_png)
    print(f"Captured cow hazard screenshot to: {out_png}")
    browser.close()

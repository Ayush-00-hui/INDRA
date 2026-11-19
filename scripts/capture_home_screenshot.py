"""
Captures a screenshot of the Home Catalog page featuring Project INDRA.
"""

import os
import time
from playwright.sync_api import sync_playwright

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
out_png = os.path.join(ROOT, "results", "web_screenshots", "home_indra_card.png")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1600, "height": 900})
    page.goto("http://127.0.0.1:8000/#/")

    page.wait_for_selector(".cards-grid", timeout=15000)
    time.sleep(1.0)

    page.screenshot(path=out_png)
    print(f"Captured home screenshot to: {out_png}")
    browser.close()

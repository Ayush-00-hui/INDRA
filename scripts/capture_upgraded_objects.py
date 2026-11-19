import os, time
from playwright.sync_api import sync_playwright

os.makedirs('results/web_screenshots', exist_ok=True)
out_path = os.path.abspath('results/web_screenshots/upgraded_objects_detailed.png')

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1920, 'height': 1080})
    page.goto('http://127.0.0.1:8000/#/sim/robotics', wait_until='networkidle')
    time.sleep(2.0)

    # Click each tool and place on floor:
    # 1. Crate at (300, 200)
    page.click('#tool-crate')
    page.mouse.click(850, 480)
    time.sleep(0.3)

    # 2. Cabinet at (600, 200)
    page.click('#tool-cabinet')
    page.mouse.click(1050, 480)
    time.sleep(0.3)

    # 3. Barrels at (350, 400)
    page.click('#tool-barrels')
    page.mouse.click(900, 620)
    time.sleep(0.3)

    # 4. Barrier at (600, 400)
    page.click('#tool-barrier')
    page.mouse.click(1080, 620)
    time.sleep(0.5)

    page.screenshot(path=out_path, full_page=True)
    browser.close()

print('Saved screenshot to:', out_path)
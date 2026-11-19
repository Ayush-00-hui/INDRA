import os, time
from playwright.sync_api import sync_playwright

os.makedirs('results/web_screenshots', exist_ok=True)
out_path = os.path.abspath('results/web_screenshots/objects_close_up.png')

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1920, 'height': 1080})
    page.goto('http://127.0.0.1:8000/#/sim/robotics', wait_until='networkidle')
    time.sleep(2.0)

    # Pause simulation
    page.keyboard.press('Space')
    time.sleep(0.3)

    # Place crate, cabinet, barrels
    page.click('#tool-crate')
    page.mouse.click(800, 500)
    time.sleep(0.3)

    page.click('#tool-cabinet')
    page.mouse.click(1000, 500)
    time.sleep(0.3)

    page.click('#tool-barrels')
    page.mouse.click(900, 600)
    time.sleep(0.3)

    # Select 3D canvas
    canvas = page.locator('#sim-canvas-root canvas')
    box = canvas.bounding_box()
    if box:
        cx = box['x'] + box['width'] / 2
        cy = box['y'] + box['height'] / 2
        page.mouse.move(cx, cy)
        # Scroll up to zoom in
        page.mouse.wheel(0, -900)
        time.sleep(0.5)
        # Drag to get a dramatic isometric angle
        page.mouse.down()
        page.mouse.move(cx + 120, cy - 60, steps=10)
        page.mouse.up()
        time.sleep(0.5)

    page.screenshot(path=out_path, full_page=True)
    browser.close()

print('Saved close-up screenshot to:', out_path)
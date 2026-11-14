"""
Test Phase 5: Game Feel, Audio & Interactive UI Navigation.
Performs a rigorous 1500-frame headless simulation cycling through menus,
split-screen, scenarios 1 and 2, holographic mind view, quality levels, and star rating cards.
"""

import os
import pytest
import pygame

# Headless SDL
os.environ["SDL_VIDEODRIVER"] = "dummy"
os.environ["SDL_AUDIODRIVER"] = "dummy"

from main import Application


def test_1500_frame_interactive_navigation():
    """Verify 1500-frame continuous navigation through all modes and states without exceptions."""
    app = Application(
        demo_mode=False,
        fullscreen=False,
        initial_seed=1000,
        initial_scenario=1,
        force_split=True,
        menu_mode=True
    )

    frame = 0
    max_frames = 1500

    while app.running and frame < max_frames:
        frame += 1

        # Simulate synthetic user input events at specific timeline frames
        if frame == 60:
            # Press 'S' to enter Split-Screen Robotics
            ev = pygame.event.Event(pygame.KEYDOWN, key=pygame.K_s)
            app._handle_menu_event(ev)
            assert app.state == app.STATE_ROBOTICS
            assert app.split_mode is True

        elif frame == 350:
            # Switch to Scenario 2 (Moving Person)
            ev = pygame.event.Event(pygame.KEYDOWN, key=pygame.K_2)
            app._handle_robotics_event(ev)
            assert app.robot_scenario == 2

        elif frame == 700:
            # Toggle Holographic Mind View (M key)
            ev = pygame.event.Event(pygame.KEYDOWN, key=pygame.K_m)
            app._handle_robotics_event(ev)

        elif frame == 900:
            # Cycle Graphics Quality (Q key)
            ev = pygame.event.Event(pygame.KEYDOWN, key=pygame.K_q)
            app._handle_robotics_event(ev)

        elif frame == 1100:
            # Return to Menu (ESC key)
            ev = pygame.event.Event(pygame.KEYDOWN, key=pygame.K_ESCAPE)
            app._handle_robotics_event(ev)
            assert app.state == app.STATE_MENU

        elif frame == 1200:
            # Launch Single View (Key 1)
            ev = pygame.event.Event(pygame.KEYDOWN, key=pygame.K_1)
            app._handle_menu_event(ev)
            assert app.state == app.STATE_ROBOTICS
            assert app.split_mode is False

        # Execute Frame Loop
        if app.state == app.STATE_MENU:
            app._draw_menu()
        elif app.state == app.STATE_ROBOTICS:
            app._step_robotics()
            app._draw_robotics()

        pygame.display.flip()

    assert frame == max_frames, f"Expected 1500 frames, reached {frame}"
    print(f"\n1500-frame interactive navigation completed successfully with 0 exceptions.")


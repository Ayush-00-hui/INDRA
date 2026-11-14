@echo off
cd /d "%~dp0"
echo ======================================================================
echo   Launching World Model: Learn, Imagine, Act (NBA Showcase Demo)
echo ======================================================================
echo   Key Controls:
echo     [S]      : Toggle Split-Screen side-by-side evaluator comparison
echo     [M]      : Toggle Holographic Cyber Mind View
echo     [F3]     : Toggle Mathematical Hitbox Debug Overlay
echo     [Q]      : Cycle Graphics Quality (LOW / MED / HIGH)
echo     [P]      : Mute / Unmute Procedural Sound Effects
echo     [1] / [2]: Switch between Scenario 1 (Chair) and Scenario 2 (Person)
echo     [R]      : Reset episode (same seed)
echo     [N]      : Advance to next seed
echo     [H]      : Help modal
echo     [ESC]    : Return to menu / Quit
echo ======================================================================
python main.py %*

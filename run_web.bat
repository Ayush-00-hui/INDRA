@echo off
setlocal enabledelayedexpansion

REM ===============================================================================
REM WORLD MODEL: LEARN, IMAGINE, ACT - DEMO SUPERVISOR & LAUNCHER
REM NBA Accreditation Showcase (20 Nov 2026)
REM Automatic Crash Recovery, GPU Acceleration & Diagnostics Logging
REM ===============================================================================

title World Model Showcase Supervisor

REM Ensure logs directory exists
if not exist "logs" mkdir logs

REM Format date string for logfile YYYYMMDD
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set LOGFILE=logs\demo_%datetime:~0,8%.log

echo =============================================================================== >> "%LOGFILE%"
echo [%DATE% %TIME%] Demo Session Initialized >> "%LOGFILE%"
echo =============================================================================== >> "%LOGFILE%"

echo [*] Running Demo-Day Preflight Verification...
python scripts\preflight.py
if %ERRORLEVEL% NEQ 0 (
    echo [!] Preflight checks completed with warnings. Continuing launch...
)

REM Kill any stale processes on port 8000
echo [*] Clearing stale processes on port 8000...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8000" ^| find "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

REM Locate GPU-accelerated browser
set BROWSER_CMD=
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    set "BROWSER_CMD=C:\Program Files\Google\Chrome\Application\chrome.exe"
) else if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" (
    set "BROWSER_CMD=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
) else if exist "C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe" (
    set "BROWSER_CMD=C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe"
) else if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    set "BROWSER_CMD=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
)

REM Supervisor watchdog loop: auto-restarts server if process terminates unexpectedly
:SUPERVISOR_LOOP
echo.
echo ===============================================================================
echo   STARTING WORLD MODEL SERVER (HIGH PRIORITY SUPERVISOR)
echo   Local Web URL: http://127.0.0.1:8000/#/sim/robotics
echo ===============================================================================

REM Launch GPU-accelerated browser after 1.5s delay
start /b cmd /c "timeout /t 2 /nobreak >nul && (if defined BROWSER_CMD (start "" "!BROWSER_CMD!" --start-fullscreen --app=http://127.0.0.1:8000/#/sim/robotics --ignore-gpu-blocklist --enable-gpu-rasterization --use-gl=angle --enable-zero-copy) else (start http://127.0.0.1:8000/#/sim/robotics))"

REM Run server under high priority with logging
echo [%DATE% %TIME%] Starting Uvicorn Server... >> "%LOGFILE%"
start /b /wait /high python -m web.server --port 8000 --host 127.0.0.1 >> "%LOGFILE%" 2>&1

set EXIT_CODE=%ERRORLEVEL%
echo [%DATE% %TIME%] Server exited with code %EXIT_CODE% >> "%LOGFILE%"

if %EXIT_CODE% NEQ 0 (
    echo [!] Server exited unexpectedly with code %EXIT_CODE%.
    echo [*] Auto-restarting server in 2 seconds... (Press Ctrl+C to abort)
    timeout /t 2 /nobreak >nul
    goto SUPERVISOR_LOOP
)

echo [*] Supervisor shut down cleanly.
pause

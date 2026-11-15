@echo off
setlocal enabledelayedexpansion

echo ===============================================================================
echo         WORLD MODEL: LEARN, IMAGINE, ACT - WEB APPLICATION LAUNCHER
echo                 NBA Accreditation Showcase (20 Nov 2026)
echo ===============================================================================
echo.

REM Determine host and optional args
set HOST_ARG=127.0.0.1
if "%~1"=="--lan" set HOST_ARG=0.0.0.0
if "%~1"=="--host" set HOST_ARG=%~2

echo [*] Target host: %HOST_ARG%
echo [*] Checking Python environment...

python -c "import fastapi, uvicorn, pydantic, torch" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [!] Missing Python dependencies. Installing requirements-web.txt...
    pip install -r requirements-web.txt
)

echo [*] Starting World Model Web Server...
REM Run server through python runner which handles auto-port and opens browser
python -m web.server --host %HOST_ARG% %*

pause

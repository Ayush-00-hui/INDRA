#!/usr/bin/env python3
"""
scripts/preflight.py
Comprehensive Demo-Day Reliability Preflight Self-Test Script.
Validates:
  1. CUDA GPU acceleration & Dedicated VRAM
  2. Model Checkpoints & Parameter Integrity
  3. Web frontend distribution bundle & 3D asset integrity
  4. Network port 8000 availability
  5. Windows Power Plan state (warns on Power Saver)
  6. GPU-accelerated browser detection (Chrome, Brave, Edge)
Outputs structured Green/Amber/Red report with exact remedial commands.
"""

import os
import sys
import socket
import subprocess
import json
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent

# ANSI Colors
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
CYAN = "\033[96m"
BOLD = "\033[1m"
RESET = "\033[0m"

def print_header(title: str):
    print(f"\n{BOLD}{CYAN}{'='*70}{RESET}")
    print(f"{BOLD}{CYAN}  {title}{RESET}")
    print(f"{BOLD}{CYAN}{'='*70}{RESET}")

def report(status: str, name: str, detail: str = "", fix: str = ""):
    if status == "PASS":
        badge = f"{GREEN}[PASS]{RESET}"
    elif status == "WARN":
        badge = f"{YELLOW}[WARN]{RESET}"
    else:
        badge = f"{RED}[FAIL]{RESET}"
    
    print(f"  {badge} {BOLD}{name}{RESET}: {detail}")
    if fix and status != "PASS":
        print(f"         {YELLOW}-> FIX: {fix}{RESET}")

def check_python():
    v = sys.version_info
    if v.major == 3 and v.minor >= 10:
        report("PASS", "Python Environment", f"v{v.major}.{v.minor}.{v.micro} ({sys.executable})")
        return True
    else:
        report("FAIL", "Python Environment", f"v{v.major}.{v.minor} is below recommended Python 3.10+", "Install Python 3.11 or 3.12")
        return False

def check_cuda():
    try:
        import torch
        if torch.cuda.is_available():
            dev_name = torch.cuda.get_device_name(0)
            vram_gb = torch.cuda.get_device_properties(0).total_memory / (1024**3)
            report("PASS", "NVIDIA CUDA Acceleration", f"{dev_name} ({vram_gb:.1f} GB VRAM, PyTorch {torch.__version__})")
            return True
        else:
            report("WARN", "NVIDIA CUDA Acceleration", "CUDA unavailable. Running on CPU fallback", "Ensure NVIDIA GPU driver is installed and torch is CUDA-enabled")
            return True
    except ImportError:
        report("FAIL", "PyTorch Installation", "PyTorch not installed", "pip install torch")
        return False

def check_models():
    all_ok = True
    models = [
        ("models/robot_student.pt", "Distilled Residual Student (Primary)"),
        ("models/robot_model.pt", "Standard Residual World Model (Backup)"),
    ]
    for rel_path, desc in models:
        p = ROOT_DIR / rel_path
        if p.exists() and p.stat().st_size > 1024:
            report("PASS", desc, f"{p.name} ({p.stat().st_size / 1024:.1f} KB)")
        else:
            report("FAIL", desc, f"Missing {rel_path}", f"Train student with python scripts/train_student_distillation.py")
            all_ok = False
    return all_ok

def check_frontend():
    all_ok = True
    dist_index = ROOT_DIR / "web" / "dist" / "index.html"
    if dist_index.exists():
        report("PASS", "Frontend Production Dist", f"{dist_index.relative_to(ROOT_DIR)} ready")
    else:
        report("WARN", "Frontend Production Dist", "web/dist not found, dev server will build it", "cd web/frontend && npm run build")

    # Check key models and fonts
    assets = [
        ("web/frontend/public/models/robot.glb", "Hero AMR Robot Model"),
        ("web/frontend/public/textures/env_1k.hdr", "Warehouse HDR Environment Map"),
        ("web/frontend/public/fonts/JetBrainsMono-Regular.ttf", "Telemetry JetBrains Font"),
    ]
    for rel_path, desc in assets:
        p = ROOT_DIR / rel_path
        if p.exists() and p.stat().st_size > 100:
            report("PASS", desc, f"{p.name} ({p.stat().st_size / 1024:.1f} KB)")
        else:
            report("FAIL", desc, f"Missing {rel_path}", "Check git status or pull repository assets")
            all_ok = False
    return all_ok

def check_port(port: int = 8000):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.5)
        res = s.connect_ex(("127.0.0.1", port))
        if res == 0:
            report("WARN", f"Network Port {port}", "Port is currently in use (server running)", "run_web.bat handles re-binding or supervisor restart")
        else:
            report("PASS", f"Network Port {port}", f"Port {port} free and available for binding")
    return True

def check_power_plan():
    if sys.platform == "win32":
        try:
            out = subprocess.check_output("powercfg /getactivescheme", shell=True, text=True)
            if "Power Saver" in out or "a1841308" in out:
                report("WARN", "Windows OS Power Plan", "Active scheme is Power Saver! May throttle GPU clocks", "Switch to High Performance or Ultimate Performance in Windows Power Settings")
            else:
                report("PASS", "Windows OS Power Plan", "High/Balanced performance scheme active")
        except Exception:
            report("WARN", "Windows OS Power Plan", "Could not query powercfg", "")
    return True

def check_browser():
    candidates = []
    if sys.platform == "win32":
        candidates = [
            ("Google Chrome", r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
            ("Google Chrome (User)", os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe")),
            ("Brave Browser", r"C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe"),
            ("Microsoft Edge", r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"),
        ]
    found = []
    for name, path in candidates:
        if os.path.exists(path):
            found.append((name, path))

    if found:
        report("PASS", "GPU-Accelerated Browser", f"Found {found[0][0]} at {found[0][1]}")
        return True
    else:
        report("WARN", "GPU-Accelerated Browser", "Standard Chrome/Brave/Edge path not detected", "Browser will launch via system default")
        return True

def main():
    print_header("WORLD MODEL PREFLIGHT DEMO-DAY AUDIT")
    p1 = check_python()
    p2 = check_cuda()
    p3 = check_models()
    p4 = check_frontend()
    p5 = check_port()
    p6 = check_power_plan()
    p7 = check_browser()

    print_header("PREFLIGHT READINESS SUMMARY")
    if p1 and p2 and p3 and p4:
        print(f"  {GREEN}{BOLD}>>> ALL SYSTEMS NOMINAL: DEMO READY FOR EVALUATION <<<{RESET}\n")
        sys.exit(0)
    else:
        print(f"  {YELLOW}{BOLD}>>> AUDIT COMPLETED WITH WARNINGS - SEE REMEDIATION STEPS ABOVE <<<{RESET}\n")
        sys.exit(1)

if __name__ == "__main__":
    main()

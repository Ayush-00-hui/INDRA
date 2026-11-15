"""
Pytest root configuration and environment setup.
Initializes headless drivers and ensures PyTorch DLLs load cleanly on Windows.
"""

import os
import sys

os.environ["SDL_VIDEODRIVER"] = "dummy"
os.environ["SDL_AUDIODRIVER"] = "dummy"

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

# Pre-load PyTorch DLLs to avoid Windows C-runtime conflict
try:
    import torch
except Exception:
    pass

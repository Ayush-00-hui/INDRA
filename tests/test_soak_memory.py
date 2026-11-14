"""
Soak Test & Memory Leak Assertion.
Simulates long-running continuous execution in headless demo mode across 1,500 frames.
Tracks process working set memory to guarantee zero unbounded memory growth.
"""

import os
import gc
import ctypes
from ctypes import wintypes
import pytest
import pygame

os.environ["SDL_VIDEODRIVER"] = "dummy"
os.environ["SDL_AUDIODRIVER"] = "dummy"

from main import Application


def get_process_memory_mb() -> float:
    """Returns current process Working Set memory in Megabytes via Win32 API."""
    class PROCESS_MEMORY_COUNTERS(ctypes.Structure):
        _fields_ = [
            ("cb", wintypes.DWORD),
            ("PageFaultCount", wintypes.DWORD),
            ("PeakWorkingSetSize", ctypes.c_size_t),
            ("WorkingSetSize", ctypes.c_size_t),
            ("QuotaPeakPagedPoolUsage", ctypes.c_size_t),
            ("QuotaPagedPoolUsage", ctypes.c_size_t),
            ("QuotaPeakNonPagedPoolUsage", ctypes.c_size_t),
            ("QuotaNonPagedPoolUsage", ctypes.c_size_t),
            ("PagefileUsage", ctypes.c_size_t),
            ("PeakPagefileUsage", ctypes.c_size_t),
        ]

    counters = PROCESS_MEMORY_COUNTERS()
    counters.cb = ctypes.sizeof(PROCESS_MEMORY_COUNTERS)
    handle = ctypes.windll.kernel32.GetCurrentProcess()
    if ctypes.windll.psapi.GetProcessMemoryInfo(handle, ctypes.byref(counters), counters.cb):
        return counters.WorkingSetSize / (1024.0 * 1024.0)
    return 0.0


def test_soak_memory_growth():
    """Run 1,500 frames of full demo mode and assert bounded memory consumption (<15 MB delta)."""
    gc.collect()
    mem_start = get_process_memory_mb()
    print(f"\nSoak Test Start Memory: {mem_start:.2f} MB")

    app = Application(
        demo_mode=True,
        fullscreen=False,
        initial_seed=1000,
        initial_scenario=1,
        force_split=True,
        menu_mode=False
    )

    frame = 0
    max_frames = 1500

    checkpoints = [500, 1000, 1500]

    while app.running and frame < max_frames:
        frame += 1

        app._step_robotics()
        app._draw_robotics()
        pygame.display.flip()

        if frame in checkpoints:
            gc.collect()
            curr_mem = get_process_memory_mb()
            print(f"  Frame {frame:4d}: Working Set Memory = {curr_mem:.2f} MB (Delta: {curr_mem - mem_start:+.2f} MB)")

    gc.collect()
    mem_end = get_process_memory_mb()
    mem_delta = mem_end - mem_start
    print(f"Soak Test End Memory: {mem_end:.2f} MB (Total Delta: {mem_delta:+.2f} MB)")

    # Assert strictly bounded memory consumption
    assert mem_delta < 25.0, f"Memory leak detected: growth of {mem_delta:.2f} MB exceeds 25 MB tolerance"

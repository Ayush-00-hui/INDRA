"""
Package the standalone release archive 'release/world-model-demo.zip'
for offline evaluator testing and accreditation archiving.
"""

import os
import sys
import zipfile
import shutil

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT_ZIP = os.path.join(ROOT_DIR, "release", "world-model-demo.zip")

EXCLUDED_DIRS = {
    ".git",
    ".gemini",
    "venv",
    ".venv",
    "__pycache__",
    "data",
    "demo_frames",
    "trailer_frames"
}

EXCLUDED_EXTS = {
    ".pyc",
    ".pyo",
    ".log"
}


def package_release():
    print(f"Creating release package at {OUT_ZIP}...")
    os.makedirs(os.path.dirname(OUT_ZIP), exist_ok=True)
    if os.path.exists(OUT_ZIP):
        os.remove(OUT_ZIP)

    file_count = 0
    with zipfile.ZipFile(OUT_ZIP, "w", zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(ROOT_DIR):
            # Prune excluded directories
            dirs[:] = [d for d in dirs if d not in EXCLUDED_DIRS and not d.startswith(".")]

            for f in files:
                ext = os.path.splitext(f)[1].lower()
                if ext in EXCLUDED_EXTS:
                    continue
                if f == "world-model-demo.zip":
                    continue

                full_path = os.path.join(root, f)
                rel_path = os.path.relpath(full_path, ROOT_DIR)
                zf.write(full_path, rel_path)
                file_count += 1

    zip_size_mb = os.path.getsize(OUT_ZIP) / (1024.0 * 1024.0)
    print(f"Successfully packaged {file_count} files into {OUT_ZIP} ({zip_size_mb:.2f} MB)")


if __name__ == "__main__":
    package_release()


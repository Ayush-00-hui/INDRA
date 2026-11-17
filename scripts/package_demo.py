"""
Demo Packaging Script for NBA Review Release
Creates release/world-model-demo.zip and generates its SHA256 checksum.
Excludes large intermediate raw training datasets and video frames to keep package compact (<50 MB).
"""

import os
import zipfile
import hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = ROOT / "release"
OUTPUT_ZIP = OUTPUT_DIR / "world-model-demo.zip"
OUTPUT_SHA = OUTPUT_DIR / "world-model-demo.zip.sha256"

EXCLUDE_DIRS = {
    ".git",
    "__pycache__",
    ".pytest_cache",
    "node_modules",
    "dist_temp",
    ".idea",
    ".vscode",
    "scratch",
    "release",
    "data",
    "video_frames1",
    "video_frames2",
    "user_video_analysis",
    "live_inspection",
    "demo_frames",
    "trailer_frames",
}

EXCLUDE_EXTS = {
    ".pyc",
    ".pyo",
    ".pyd",
    ".log",
    ".mp4",
    ".avi",
}

def should_exclude(rel_path: Path) -> bool:
    for part in rel_path.parts:
        if part in EXCLUDE_DIRS:
            return True
    if rel_path.suffix.lower() in EXCLUDE_EXTS:
        return True
    return False

def package():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    if OUTPUT_ZIP.exists():
        OUTPUT_ZIP.unlink()
    
    print(f"Creating demo archive at: {OUTPUT_ZIP}")
    file_count = 0
    with zipfile.ZipFile(OUTPUT_ZIP, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
        for root, dirs, files in os.walk(ROOT):
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
            for f in files:
                file_path = Path(root) / f
                rel_path = file_path.relative_to(ROOT)
                if should_exclude(rel_path):
                    continue
                if rel_path.suffix.lower() == ".zip":
                    continue
                zf.write(file_path, arcname=str(rel_path))
                file_count += 1
                
    size_mb = OUTPUT_ZIP.stat().st_size / (1024 * 1024)
    print(f"Packaged {file_count} files into {OUTPUT_ZIP.name} ({size_mb:.2f} MB)")
    
    # Compute SHA-256
    hasher = hashlib.sha256()
    with open(OUTPUT_ZIP, "rb") as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    sha256_hash = hasher.hexdigest()
    
    OUTPUT_SHA.write_text(f"{sha256_hash}  {OUTPUT_ZIP.name}\n", encoding="utf-8")
    print(f"SHA-256: {sha256_hash}")
    print(f"Checksum written to: {OUTPUT_SHA}")

if __name__ == "__main__":
    package()

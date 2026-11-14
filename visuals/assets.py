"""
Procedural Asset Generators & Audio Synthesizer.
Zero external downloads required: generates sprites and audio waveforms on-the-fly.
"""

import os
import math
import struct
import io
import numpy as np
import pygame
from typing import Dict, Tuple, Optional, List
from visuals.theme import Colors


# ---------------------------------------------------------------------------
# AUDIO SYNTHESIS & SOUND MANAGER
# ---------------------------------------------------------------------------

def _generate_wav_bytes(samples: np.ndarray, sample_rate: int = 44100) -> bytes:
    """Encodes a 1D float numpy array (-1.0 to 1.0) into a standard 16-bit mono WAV byte string."""
    samples = np.clip(samples, -1.0, 1.0)
    int_samples = (samples * 32767).astype(np.int16)
    num_samples = len(int_samples)
    byte_rate = sample_rate * 2
    block_align = 2

    # WAV Header
    buf = io.BytesIO()
    buf.write(b"RIFF")
    buf.write(struct.pack("<I", 36 + num_samples * 2))
    buf.write(b"WAVEfmt ")
    buf.write(struct.pack("<IHHIIHH", 16, 1, 1, sample_rate, byte_rate, block_align, 16))
    buf.write(b"data")
    buf.write(struct.pack("<I", num_samples * 2))
    buf.write(int_samples.tobytes())
    return buf.getvalue()


def create_procedural_sounds() -> Dict[str, bytes]:
    """
    Generates procedural audio sound effects using pure NumPy mathematics.
    Returns a dictionary of sound_name -> WAV bytes.
    """
    sr = 44100
    sounds = {}

    # 1. move.wav: subtle mechanical step click / servo hum (35 ms)
    duration = 0.035
    t = np.linspace(0, duration, int(sr * duration), False)
    env = np.exp(-t * 120.0)
    freq = 140.0 + 40.0 * np.sin(2 * np.pi * 80.0 * t)
    wave_move = 0.35 * np.sin(2 * np.pi * freq * t) * env
    sounds["move"] = _generate_wav_bytes(wave_move, sr)

    # 2. bonk.wav: metallic physical impact with low resonant decay (120 ms)
    duration = 0.12
    t = np.linspace(0, duration, int(sr * duration), False)
    env = np.exp(-t * 35.0)
    # Pitch sweep down: 320 Hz -> 60 Hz
    sweep_freq = 60.0 + 260.0 * np.exp(-t * 40.0)
    metallic = np.sin(2 * np.pi * sweep_freq * t) + 0.4 * np.sin(2 * np.pi * (sweep_freq * 2.3) * t)
    noise = np.random.uniform(-0.15, 0.15, len(t)) * np.exp(-t * 80.0)
    wave_bonk = 0.7 * (metallic + noise) * env
    sounds["bonk"] = _generate_wav_bytes(wave_bonk, sr)

    # 3. goal.wav: bright ascending 4-note chord arpeggio (C5 - E5 - G5 - C6) (350 ms)
    duration = 0.35
    total_len = int(sr * duration)
    wave_goal = np.zeros(total_len)
    notes = [523.25, 659.25, 783.99, 1046.50]  # C5, E5, G5, C6
    note_duration = 0.14
    for i, freq in enumerate(notes):
        start_idx = int(sr * i * 0.07)
        note_len = min(int(sr * note_duration), total_len - start_idx)
        if note_len > 0:
            tn = np.linspace(0, note_duration, note_len, False)
            env_n = np.exp(-tn * 16.0)
            tone = (np.sin(2 * np.pi * freq * tn) + 0.3 * np.sin(4 * np.pi * freq * tn)) * env_n
            wave_goal[start_idx:start_idx + note_len] += 0.35 * tone
    sounds["goal"] = _generate_wav_bytes(wave_goal, sr)

    # 4. click.wav: snappy UI transient click (18 ms)
    duration = 0.018
    t = np.linspace(0, duration, int(sr * duration), False)
    env = np.exp(-t * 280.0)
    wave_click = 0.4 * np.sin(2 * np.pi * 950.0 * t) * env
    sounds["click"] = _generate_wav_bytes(wave_click, sr)

    # 5. think.wav: gentle cybernetic computation pulse / FM chirp (50 ms)
    duration = 0.05
    t = np.linspace(0, duration, int(sr * duration), False)
    modulator = np.sin(2 * np.pi * 70.0 * t) * 120.0
    carrier = 650.0 + modulator
    env = np.sin(np.pi * t / duration)  # bell envelope
    wave_think = 0.25 * np.sin(2 * np.pi * carrier * t) * env
    sounds["think"] = _generate_wav_bytes(wave_think, sr)

    return sounds


class SoundManager:
    """
    Safe procedural sound manager.
    Handles headless modes, mute toggling, and missing audio devices cleanly.
    """

    def __init__(self, assets_dir: str = "assets/audio"):
        self.enabled = False
        self.muted = False
        self.volume = 0.7
        self.sounds: Dict[str, pygame.mixer.Sound] = {}
        self.assets_dir = assets_dir

        try:
            if not pygame.mixer.get_init():
                pygame.mixer.init(frequency=44100, size=-16, channels=2, buffer=512)
            self.enabled = True
        except Exception:
            self.enabled = False

        if self.enabled:
            self._load_or_generate_sounds()

    def _load_or_generate_sounds(self) -> None:
        os.makedirs(self.assets_dir, exist_ok=True)
        procedural_data = create_procedural_sounds()

        for name, wav_bytes in procedural_data.items():
            wav_path = os.path.join(self.assets_dir, f"{name}.wav")
            # Write to disk for inspection and offline reuse
            if not os.path.exists(wav_path):
                try:
                    with open(wav_path, "wb") as f:
                        f.write(wav_bytes)
                except Exception:
                    pass

            try:
                snd = pygame.mixer.Sound(io.BytesIO(wav_bytes))
                snd.set_volume(self.volume)
                self.sounds[name] = snd
            except Exception:
                pass

    def play(self, sound_name: str) -> None:
        """Plays a registered sound if sound is enabled and unmuted."""
        if not self.enabled or self.muted:
            return
        snd = self.sounds.get(sound_name)
        if snd:
            try:
                snd.play()
            except Exception:
                pass

    def toggle_mute(self) -> bool:
        """Toggles audio mute. Returns the new muted state."""
        self.muted = not self.muted
        return self.muted

    def set_volume(self, volume: float) -> None:
        """Sets master sound volume (0.0 to 1.0)."""
        self.volume = max(0.0, min(1.0, volume))
        for snd in self.sounds.values():
            try:
                snd.set_volume(self.volume)
            except Exception:
                pass


# ---------------------------------------------------------------------------
# PROCEDURAL SPRITE GENERATORS
# ---------------------------------------------------------------------------

class SpriteManager:
    """
    Generates and caches procedural sprites with exact hitbox dimensions.
    """

    def __init__(self):
        self._cache: Dict[str, pygame.Surface] = {}
        self._rotation_cache: Dict[Tuple[str, int], pygame.Surface] = {}

    def get_robot_sprite(self, angle_deg: int = 0, status: str = "moving") -> pygame.Surface:
        """
        Generates/returns a 36x36 robot sprite matching ROBOT_RADIUS=18.0.
        Features:
        - Outer treads
        - Metallic chassis with bevel
        - Directional arrow / headlight indicators
        - Status LED (blue=thinking, green=moving, red=collision)
        """
        # Quantize angle to nearest 5 degrees to avoid unbounded rotation caching
        quantized_angle = int(round(angle_deg / 5.0) * 5) % 360
        cache_key = (f"robot_{status}", quantized_angle)
        if cache_key in self._rotation_cache:
            return self._rotation_cache[cache_key]

        base_key = f"robot_{status}_base"
        if base_key not in self._cache:
            size = 36
            surf = pygame.Surface((size, size), pygame.SRCALPHA)
            cx, cy = size // 2, size // 2

            # 1. Outer treads (left and right dark bands)
            pygame.draw.rect(surf, (35, 42, 52), (1, 4, 6, 28), border_radius=2)
            pygame.draw.rect(surf, (35, 42, 52), (size - 7, 4, 6, 28), border_radius=2)
            # Tread ridges
            for ty in range(6, 30, 4):
                pygame.draw.line(surf, (20, 25, 32), (1, ty), (6, ty), 1)
                pygame.draw.line(surf, (20, 25, 32), (size - 7, ty), (size - 2, ty), 1)

            # 2. Main circular chassis (radius 14)
            pygame.draw.circle(surf, Colors.ROBOT_BODY, (cx, cy), 14)
            pygame.draw.circle(surf, (40, 50, 68), (cx, cy), 14, 2)

            # 3. Inner core ring
            pygame.draw.circle(surf, (24, 30, 42), (cx, cy), 9)

            # 4. Status LED in center
            led_col = Colors.ROBOT_EYE
            if status == "thinking":
                led_col = Colors.ROBOT_CORE_GLOW
            elif status == "collision":
                led_col = Colors.ROBOT_COLLISION_RED
            pygame.draw.circle(surf, led_col, (cx, cy), 5)
            pygame.draw.circle(surf, (255, 255, 255), (cx, cy), 2)  # specular white dot

            # 5. Front directional indicator / headlights
            pygame.draw.polygon(surf, (255, 255, 200), [(cx - 4, 3), (cx + 4, 3), (cx, 7)])

            self._cache[base_key] = surf

        base_surf = self._cache[base_key]
        if quantized_angle == 0:
            rotated = base_surf
        else:
            rotated = pygame.transform.rotate(base_surf, -quantized_angle)

        self._rotation_cache[cache_key] = rotated
        return rotated

    def get_chair_sprite(self) -> pygame.Surface:
        """
        Generates/returns an 80x80 executive office chair sprite matching obstacle hitbox.
        Features:
        - 5-caster star base with chrome center
        - Ergonomic seat cushion with leather seam
        - Armrests on sides
        - Contoured backrest
        """
        key = "chair_80x80"
        if key in self._cache:
            return self._cache[key]

        w, h = 80, 80
        surf = pygame.Surface((w, h), pygame.SRCALPHA)
        cx, cy = w // 2, h // 2

        # 1. Soft shadow underneath
        shadow_rect = pygame.Rect(10, 14, 60, 56)
        pygame.draw.ellipse(surf, (0, 0, 0, 80), shadow_rect)

        # 2. 5-caster star base (chrome / black legs)
        for i in range(5):
            angle = i * (2 * math.pi / 5) - math.pi / 2
            leg_x = cx + math.cos(angle) * 32
            leg_y = cy + math.sin(angle) * 32
            pygame.draw.line(surf, Colors.CHAIR_FRAME, (cx, cy), (leg_x, leg_y), 4)
            # Caster wheel at the tip
            pygame.draw.circle(surf, (25, 28, 34), (int(leg_x), int(leg_y)), 4)
            pygame.draw.circle(surf, (70, 75, 85), (int(leg_x), int(leg_y)), 2)

        # Chrome center hub
        pygame.draw.circle(surf, (180, 190, 205), (cx, cy), 6)

        # 3. Main Seat Cushion (contoured rounded rect)
        seat_rect = pygame.Rect(cx - 24, cy - 20, 48, 44)
        pygame.draw.rect(surf, Colors.CHAIR_CUSHION, seat_rect, border_radius=10)
        pygame.draw.rect(surf, (20, 24, 30), seat_rect, 2, border_radius=10)
        # Cushion stitch line
        pygame.draw.line(surf, (55, 62, 75), (seat_rect.left + 8, cy + 2), (seat_rect.right - 8, cy + 2), 1)

        # 4. Left and Right Armrests
        pygame.draw.rect(surf, Colors.CHAIR_ARMREST, (cx - 28, cy - 14, 6, 28), border_radius=3)
        pygame.draw.rect(surf, Colors.CHAIR_ARMREST, (cx + 22, cy - 14, 6, 28), border_radius=3)

        # 5. Backrest at the top
        back_rect = pygame.Rect(cx - 22, cy - 28, 44, 14)
        pygame.draw.rect(surf, (45, 52, 65), back_rect, border_radius=5)
        pygame.draw.rect(surf, (25, 30, 40), back_rect, 2, border_radius=5)

        self._cache[key] = surf
        return surf

    def get_plant_sprite(self, size: int = 26) -> pygame.Surface:
        """Generates/returns a top-down decorative potted office plant."""
        key = f"plant_{size}"
        if key in self._cache:
            return self._cache[key]

        surf = pygame.Surface((size, size), pygame.SRCALPHA)
        cx, cy = size // 2, size // 2
        # Terracotta pot rim
        pygame.draw.circle(surf, Colors.PLANT_POT, (cx, cy), size // 2 - 2)
        pygame.draw.circle(surf, (140, 70, 45), (cx, cy), size // 2 - 2, 2)
        # Soil
        pygame.draw.circle(surf, (45, 35, 30), (cx, cy), size // 2 - 5)
        # Leaves radiating from center
        for i in range(5):
            angle = i * (2 * math.pi / 5)
            lx = cx + math.cos(angle) * (size // 2 - 4)
            ly = cy + math.sin(angle) * (size // 2 - 4)
            pygame.draw.ellipse(surf, Colors.PLANT_LEAF, (min(cx, lx) - 2, min(cy, ly) - 2, 8, 8))
            pygame.draw.circle(surf, Colors.PLANT_LEAF_DARK, (int(lx), int(ly)), 3)

        self._cache[key] = surf
        return surf

    def get_desk_sprite(self, width: int, height: int, seed: int = 42) -> pygame.Surface:
        """
        Generates/returns a laboratory desk / box stack matching physical width x height.
        """
        w, h = int(width), int(height)
        key = f"desk_{w}x{h}_{seed % 3}"
        if key in self._cache:
            return self._cache[key]

        surf = pygame.Surface((w, h), pygame.SRCALPHA)
        variant = seed % 3

        if variant == 0:
            # High-tech Laboratory Workstation (dark carbon top, steel frame, blue blueprint)
            pygame.draw.rect(surf, (45, 54, 68), (0, 0, w, h), border_radius=4)
            pygame.draw.rect(surf, (70, 85, 110), (0, 0, w, h), 2, border_radius=4)
            # Inner desk mat
            mat_rect = pygame.Rect(6, 6, max(10, w - 12), max(10, h - 12))
            pygame.draw.rect(surf, (30, 36, 46), mat_rect, border_radius=2)
            # Blueprint / notepad on desk
            if w > 40 and h > 40:
                doc_rect = pygame.Rect(w - 28, 10, 18, 22)
                pygame.draw.rect(surf, (0, 140, 200), doc_rect, border_radius=1)
                pygame.draw.line(surf, (255, 255, 255), (doc_rect.x + 3, doc_rect.y + 5), (doc_rect.right - 3, doc_rect.y + 5), 1)
                pygame.draw.line(surf, (255, 255, 255), (doc_rect.x + 3, doc_rect.y + 10), (doc_rect.right - 3, doc_rect.y + 10), 1)
        elif variant == 1:
            # Wooden Workbench (oak slat texture)
            pygame.draw.rect(surf, (130, 92, 58), (0, 0, w, h), border_radius=4)
            pygame.draw.rect(surf, (80, 52, 28), (0, 0, w, h), 2, border_radius=4)
            # Wood planks
            step = 16
            for px in range(step, w - 4, step):
                pygame.draw.line(surf, (95, 65, 38), (px, 2), (px, h - 3), 1)
        else:
            # Cardboard Logistics Stack (shipping boxes with tape)
            pygame.draw.rect(surf, (175, 130, 85), (0, 0, w, h), border_radius=3)
            pygame.draw.rect(surf, (120, 85, 50), (0, 0, w, h), 2, border_radius=3)
            # Packing tape cross
            tape_w = max(4, min(10, w // 6))
            pygame.draw.rect(surf, (215, 180, 120), (w // 2 - tape_w // 2, 0, tape_w, h))
            pygame.draw.rect(surf, (215, 180, 120), (0, h // 2 - tape_w // 2, w, tape_w))
            # Fragile barcode sticker
            if w > 35 and h > 35:
                pygame.draw.rect(surf, (245, 245, 245), (6, 6, 16, 12))
                pygame.draw.rect(surf, (220, 40, 40), (8, 8, 12, 3))

        self._cache[key] = surf
        return surf

    def get_goal_sprite(self, anim_frame: int = 0) -> pygame.Surface:
        """
        Generates/returns a 44x44 energetic goal charging pad matching GOAL_RADIUS=22.0.
        Pulsing concentric holographic rings and radiant center beacon.
        """
        frame = anim_frame % 30
        key = f"goal_frame_{frame}"
        if key in self._cache:
            return self._cache[key]

        size = 44
        surf = pygame.Surface((size, size), pygame.SRCALPHA)
        cx, cy = size // 2, size // 2

        # 1. Outer metallic base ring (radius 21)
        pygame.draw.circle(surf, (26, 38, 44), (cx, cy), 21)
        pygame.draw.circle(surf, (0, 180, 140), (cx, cy), 21, 2)

        # 2. Glowing animated energetic concentric rings
        pulse = (math.sin(frame * (2 * math.pi / 30)) + 1.0) / 2.0  # 0.0 to 1.0
        ring_r = int(10 + pulse * 7)
        pygame.draw.circle(surf, (0, 240, 180, 120), (cx, cy), ring_r, 2)

        # 3. Inner charging core
        pygame.draw.circle(surf, Colors.GOAL_PAD_ACTIVE, (cx, cy), 7)
        pygame.draw.circle(surf, (255, 255, 255), (cx, cy), 3)

        # 4. Radiating 4-point energy cross
        for dx, dy in [(0, -1), (0, 1), (-1, 0), (1, 0)]:
            p1 = (cx + dx * 9, cy + dy * 9)
            p2 = (cx + dx * 19, cy + dy * 19)
            pygame.draw.line(surf, (0, 255, 200, 180), p1, p2, 2)

        self._cache[key] = surf
        return surf

    def get_person_sprite(self, frame_idx: int = 0, vy: float = 0.0) -> pygame.Surface:
        """
        Generates/returns a 45x45 walking human pedestrian sprite matching 45x45 hitbox.
        4-frame walk cycle with swinging arms/feet.
        """
        frame = frame_idx % 4
        direction = 1 if vy >= 0 else -1
        key = f"person_{frame}_{direction}"
        if key in self._cache:
            return self._cache[key]

        size = 45
        surf = pygame.Surface((size, size), pygame.SRCALPHA)
        cx, cy = size // 2, size // 2

        # Foot offsets based on walk cycle frame
        foot_offsets = [(-4, 4), (0, 0), (4, -4), (0, 0)]
        f_left_dy, f_right_dy = foot_offsets[frame]

        # 1. Shoes
        pygame.draw.ellipse(surf, (35, 30, 30), (cx - 10, cy + f_left_dy * direction - 3, 7, 10))
        pygame.draw.ellipse(surf, (35, 30, 30), (cx + 3, cy + f_right_dy * direction - 3, 7, 10))

        # 2. Torso / Jacket (shoulders)
        shoulder_width = 24
        pygame.draw.ellipse(surf, Colors.PERSON_COAT, (cx - shoulder_width // 2, cy - 8, shoulder_width, 16))
        pygame.draw.ellipse(surf, (20, 30, 45), (cx - shoulder_width // 2, cy - 8, shoulder_width, 16), 1)

        # 3. Head with hair / cap
        pygame.draw.circle(surf, Colors.PERSON_SHADOW, (cx, cy), 8)
        pygame.draw.circle(surf, (220, 175, 140), (cx, cy - 1), 6)  # face skin
        pygame.draw.circle(surf, (50, 40, 35), (cx, cy - 3), 6)    # dark hair / cap

        self._cache[key] = surf
        return surf

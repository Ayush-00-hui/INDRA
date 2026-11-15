"""
HUD Layout Manager: Dynamic, responsive layout computation for all display resolutions.
Guarantees non-overlapping glass panels, anchored elements, and strict screen-boundary clipping:
- Supported standard resolutions: 900x600, 1280x720, 1920x1080
- Supported modes: Single View (2D/3D) and Split-Screen View
"""

import pygame
from typing import Dict, Tuple, Optional


class HUDLayoutManager:
    """
    Computes responsive, collision-free layout rectangles for HUD components.
    """

    def __init__(self, width: int = 900, height: int = 600, is_split: bool = False):
        self.width = width
        self.height = height
        self.is_split = is_split

    def update_dimensions(self, width: int, height: int, is_split: bool = False) -> None:
        self.width = width
        self.height = height
        self.is_split = is_split

    def get_layout(self) -> Dict[str, pygame.Rect]:
        """
        Compute bounding boxes for all active HUD panels.
        Guarantees:
        1. No two primary panels overlap.
        2. All rects lie entirely within (0, 0, width, height).
        """
        w, h = self.width, self.height
        layout: Dict[str, pygame.Rect] = {}

        if self.is_split:
            # Split screen layout: each viewport gets half the width minus divider
            half_w = w // 2
            top_bar_h = 44
            
            # Super-header across top
            layout["split_super_header"] = pygame.Rect(0, 0, w, top_bar_h)
            
            # Viewport headers
            layout["left_header"] = pygame.Rect(0, top_bar_h, half_w, 36)
            layout["right_header"] = pygame.Rect(half_w, top_bar_h, half_w, 36)
            
            # Left viewport status card
            status_w = min(360, half_w - 32)
            layout["left_status"] = pygame.Rect(16, top_bar_h + 44, status_w, 64)
            
            # Right viewport status card
            layout["right_status"] = pygame.Rect(half_w + 16, top_bar_h + 44, status_w, 64)
            
            # Controls pill at bottom
            pill_w = min(880, w - 40)
            layout["controls_pill"] = pygame.Rect(w // 2 - pill_w // 2, h - 34, pill_w, 26)
            
            return layout

        # -------------------------------------------------------------
        # Single View Layout (900x600, 1280x720, 1920x1080)
        # -------------------------------------------------------------
        margin_x = 16
        margin_y = 14

        # 1. Top-Left Status Panel
        # Width scales with screen width, capped to avoid taking up the center
        if w >= 1920:
            status_w, status_h = 460, 76
        elif w >= 1280:
            status_w, status_h = 420, 72
        else:
            status_w, status_h = 360, 68

        layout["status_panel"] = pygame.Rect(margin_x, margin_y, status_w, status_h)

        # 2. Top-Right / Center Pipeline Strip (OBSERVE -> IMAGINE -> CHOOSE -> ACT)
        if w >= 1920:
            strip_w, strip_h = 480, 38
        elif w >= 1280:
            strip_w, strip_h = 420, 36
        else:
            strip_w, strip_h = 340, 34

        strip_x = w - strip_w - margin_x
        layout["pipeline_strip"] = pygame.Rect(strip_x, margin_y, strip_w, strip_h)

        # 3. Top-Right "Why This Move?" Decision Card
        # Positioned strictly below the pipeline strip to avoid horizontal overlap
        if w >= 1920:
            why_w, why_h = 320, 120
        elif w >= 1280:
            why_w, why_h = 280, 105
        else:
            why_w, why_h = 240, 96

        why_x = w - why_w - margin_x
        why_y = layout["pipeline_strip"].bottom + 8
        layout["why_card"] = pygame.Rect(why_x, why_y, why_w, why_h)

        # 4. Imagination Engine Panel (if shown)
        # Placed below status_panel on the left or docked cleanly at bottom-left
        if w >= 1920:
            imag_w, imag_h = 340, 160
        elif w >= 1280:
            imag_w, imag_h = 300, 145
        else:
            imag_w, imag_h = 260, 130

        imag_x = margin_x
        imag_y = layout["status_panel"].bottom + 10
        layout["imagination_panel"] = pygame.Rect(imag_x, imag_y, imag_w, imag_h)

        # 5. Bottom Controls Pill
        pill_w = min(880, w - 40)
        pill_h = 26
        layout["controls_pill"] = pygame.Rect(w // 2 - pill_w // 2, h - 34, pill_w, pill_h)

        return layout

    def validate_no_overlaps(self, excluded_keys: Optional[list] = None) -> Tuple[bool, str]:
        """
        Verify that no active HUD panels overlap and nothing exceeds screen boundaries.
        Returns (True, '') on success, or (False, error_description) on failure.
        """
        layout = self.get_layout()
        excluded = set(excluded_keys or [])

        # 1. Bounds check
        screen_rect = pygame.Rect(0, 0, self.width, self.height)
        for name, rect in layout.items():
            if name in excluded:
                continue
            if not screen_rect.contains(rect):
                return False, f"Panel '{name}' ({rect}) exceeds screen bounds ({screen_rect})"

        # 2. Pairwise overlap check
        items = [(name, rect) for name, rect in layout.items() if name not in excluded]
        for i in range(len(items)):
            for j in range(i + 1, len(items)):
                name1, rect1 = items[i]
                name2, rect2 = items[j]
                if rect1.colliderect(rect2):
                    return False, f"Overlap detected between '{name1}' ({rect1}) and '{name2}' ({rect2})"

        return True, ""

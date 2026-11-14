"""
Interactive UI Components: Glassmorphism Panels, Animated Buttons, Status Badges, and Star Ratings.
"""

from typing import Tuple, Optional, Callable, List
import pygame
from visuals.theme import Colors, get_font
from visuals.tween import Easing, Tween


def draw_glass_panel(
    surface: pygame.Surface,
    rect: pygame.Rect,
    bg_color: Tuple[int, int, int] = (20, 26, 38),
    alpha: int = 210,
    border_color: Tuple[int, int, int] = (50, 70, 95),
    border_width: int = 1,
    radius: int = 8
) -> None:
    """
    Renders a translucent glassmorphic rounded panel with subtle top-edge highlight.
    """
    panel = pygame.Surface((rect.width, rect.height), pygame.SRCALPHA)
    r, g, b = bg_color
    pygame.draw.rect(panel, (r, g, b, alpha), (0, 0, rect.width, rect.height), border_radius=radius)

    # Top-edge specular highlight (glass sheen)
    if radius > 0 and rect.height > 6:
        pygame.draw.line(panel, (255, 255, 255, 35), (radius, 1), (rect.width - radius, 1), 1)

    if border_width > 0:
        br, bg, bb = border_color
        pygame.draw.rect(panel, (br, bg, bb, min(255, alpha + 30)), (0, 0, rect.width, rect.height), border_width, border_radius=radius)

    surface.blit(panel, (rect.x, rect.y))


def draw_badge(
    surface: pygame.Surface,
    text: str,
    pos: Tuple[int, int],
    bg_color: Tuple[int, int, int] = Colors.CYAN,
    text_color: Tuple[int, int, int] = (255, 255, 255),
    font: Optional[pygame.font.Font] = None,
    padding: Tuple[int, int] = (8, 4),
    radius: int = 4
) -> pygame.Rect:
    """
    Renders a compact colored status pill badge.
    """
    if font is None:
        font = get_font(12, bold=True)
    txt_surf = font.render(text, True, text_color)
    pad_x, pad_y = padding
    w = txt_surf.get_width() + pad_x * 2
    h = txt_surf.get_height() + pad_y * 2
    rect = pygame.Rect(pos[0], pos[1], w, h)

    badge_surf = pygame.Surface((w, h), pygame.SRCALPHA)
    br, bg, bb = bg_color
    pygame.draw.rect(badge_surf, (br, bg, bb, 220), (0, 0, w, h), border_radius=radius)
    badge_surf.blit(txt_surf, (pad_x, pad_y))
    surface.blit(badge_surf, (rect.x, rect.y))
    return rect


def draw_progress_bar(
    surface: pygame.Surface,
    rect: pygame.Rect,
    progress: float,
    fill_color: Tuple[int, int, int] = Colors.CYAN,
    bg_color: Tuple[int, int, int] = (30, 38, 52),
    border_color: Tuple[int, int, int] = (60, 75, 100),
    radius: int = 4
) -> None:
    """
    Renders a smoothed progress bar.
    """
    progress = max(0.0, min(1.0, progress))
    pygame.draw.rect(surface, bg_color, rect, border_radius=radius)
    if progress > 0.0:
        fill_w = max(radius * 2, int(rect.width * progress))
        fill_rect = pygame.Rect(rect.x, rect.y, min(rect.width, fill_w), rect.height)
        pygame.draw.rect(surface, fill_color, fill_rect, border_radius=radius)
    pygame.draw.rect(surface, border_color, rect, 1, border_radius=radius)


class Button:
    """
    Interactive animated UI button with hover, click easing, and keyboard shortcuts.
    """

    def __init__(
        self,
        rect: pygame.Rect,
        label: str,
        shortcut: str = "",
        accent_color: Tuple[int, int, int] = Colors.CYAN,
        callback: Optional[Callable[[], None]] = None
    ):
        self.rect = rect
        self.label = label
        self.shortcut = shortcut
        self.accent_color = accent_color
        self.callback = callback

        self.hover_progress = 0.0
        self.press_progress = 0.0
        self.font = get_font(15, bold=True)
        self.font_sc = get_font(12, bold=False)

    def update(self, dt: float, mouse_pos: Tuple[int, int], mouse_down: bool) -> None:
        is_hover = self.rect.collidepoint(mouse_pos)
        target_hover = 1.0 if is_hover else 0.0
        self.hover_progress += (target_hover - self.hover_progress) * min(1.0, dt * 15.0)

        target_press = 1.0 if (is_hover and mouse_down) else 0.0
        self.press_progress += (target_press - self.press_progress) * min(1.0, dt * 25.0)

    def handle_event(self, event: pygame.event.Event) -> bool:
        if event.type == pygame.MOUSEBUTTONUP and event.button == 1:
            if self.rect.collidepoint(event.pos):
                if self.callback:
                    self.callback()
                return True
        return False

    def draw(self, surface: pygame.Surface) -> None:
        # Interpolate background and border colors
        base_bg = (28, 35, 48)
        hover_bg = (40, 52, 72)
        r = int(base_bg[0] + (hover_bg[0] - base_bg[0]) * self.hover_progress)
        g = int(base_bg[1] + (hover_bg[1] - base_bg[1]) * self.hover_progress)
        b = int(base_bg[2] + (hover_bg[2] - base_bg[2]) * self.hover_progress)

        # Scale slightly on press
        offset_y = int(self.press_progress * 2)
        draw_rect = pygame.Rect(self.rect.x, self.rect.y + offset_y, self.rect.width, self.rect.height)

        pygame.draw.rect(surface, (r, g, b), draw_rect, border_radius=8)

        # Accent border with hover glow
        border_col = self.accent_color if self.hover_progress > 0.4 else (55, 70, 95)
        border_w = 2 if self.hover_progress > 0.1 else 1
        pygame.draw.rect(surface, border_col, draw_rect, border_w, border_radius=8)

        # Render Text
        txt_col = (255, 255, 255) if self.hover_progress > 0.2 else (210, 225, 240)
        lbl_surf = self.font.render(self.label, True, txt_col)
        surface.blit(lbl_surf, (draw_rect.centerx - lbl_surf.get_width() // 2, draw_rect.centery - lbl_surf.get_height() // 2))

        # Render shortcut tag if present
        if self.shortcut:
            draw_badge(surface, self.shortcut, (draw_rect.right - 48, draw_rect.centery - 10), bg_color=(45, 60, 85))


class StarRatingCard:
    """
    Renders an end-of-episode evaluation card with 0 to 3 animated stars.
    Criteria:
    - 3 Stars: Goal reached with 0 collisions.
    - 2 Stars: Goal reached with 1-2 collisions.
    - 1 Star: Goal reached with 3+ collisions.
    - 0 Stars: Max steps reached without reaching goal.
    """

    def __init__(self, rect: pygame.Rect):
        self.rect = rect
        self.font_title = get_font(20, bold=True)
        self.font_body = get_font(13)

    def draw(
        self,
        surface: pygame.Surface,
        reached_goal: bool,
        collisions: int,
        steps: int,
        method_name: str = "World Model MPC"
    ) -> None:
        draw_glass_panel(surface, self.rect, bg_color=(18, 24, 34), alpha=235, border_color=(0, 200, 255), radius=10)

        # Title
        t_col = Colors.SUCCESS if reached_goal else Colors.DANGER
        t_text = "MISSION ACCOMPLISHED!" if reached_goal else "TIME EXPIRED (NO GOAL)"
        t_surf = self.font_title.render(t_text, True, t_col)
        surface.blit(t_surf, (self.rect.centerx - t_surf.get_width() // 2, self.rect.y + 16))

        # Method subtitle
        m_surf = self.font_body.render(f"Controller: {method_name}", True, (160, 180, 210))
        surface.blit(m_surf, (self.rect.centerx - m_surf.get_width() // 2, self.rect.y + 44))

        # Stars calculation
        if not reached_goal:
            stars = 0
        elif collisions == 0:
            stars = 3
        elif collisions <= 2:
            stars = 2
        else:
            stars = 1

        # Draw 3 stars
        star_y = self.rect.y + 75
        star_spacing = 40
        start_x = self.rect.centerx - star_spacing
        for i in range(3):
            cx = start_x + i * star_spacing
            filled = i < stars
            self._draw_star(surface, cx, star_y, 14, filled=filled)

        # Performance summary
        stat_y = self.rect.y + 105
        stat_text = f"Steps: {steps} | Collisions: {collisions}"
        st_surf = self.font_body.render(stat_text, True, (220, 230, 245))
        surface.blit(st_surf, (self.rect.centerx - st_surf.get_width() // 2, stat_y))

    def _draw_star(self, surface: pygame.Surface, cx: int, cy: int, size: int, filled: bool) -> None:
        """Draws a 5-pointed star."""
        import math
        points = []
        for i in range(10):
            r = size if i % 2 == 0 else size * 0.45
            angle = i * math.pi / 5 - math.pi / 2
            points.append((cx + r * math.cos(angle), cy + r * math.sin(angle)))

        color = (255, 215, 0) if filled else (65, 80, 105)
        pygame.draw.polygon(surface, color, points)
        pygame.draw.polygon(surface, (255, 240, 140) if filled else (90, 110, 140), points, 1)


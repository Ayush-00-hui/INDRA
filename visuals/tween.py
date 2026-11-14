"""
Tweening, Easing Curves, and Interpolation Utilities for Smooth Animations.
"""

import math
from typing import Callable, Optional


class Easing:
    @staticmethod
    def linear(t: float) -> float:
        return max(0.0, min(1.0, t))

    @staticmethod
    def ease_in_quad(t: float) -> float:
        t = max(0.0, min(1.0, t))
        return t * t

    @staticmethod
    def ease_out_quad(t: float) -> float:
        t = max(0.0, min(1.0, t))
        return t * (2.0 - t)

    @staticmethod
    def ease_in_out_quad(t: float) -> float:
        t = max(0.0, min(1.0, t))
        return 2.0 * t * t if t < 0.5 else -1.0 + (4.0 - 2.0 * t) * t

    @staticmethod
    def ease_out_cubic(t: float) -> float:
        t = max(0.0, min(1.0, t))
        t -= 1.0
        return t * t * t + 1.0

    @staticmethod
    def ease_out_bounce(t: float) -> float:
        t = max(0.0, min(1.0, t))
        if t < (1.0 / 2.75):
            return 7.5625 * t * t
        elif t < (2.0 / 2.75):
            t -= 1.5 / 2.75
            return 7.5625 * t * t + 0.75
        elif t < (2.5 / 2.75):
            t -= 2.25 / 2.75
            return 7.5625 * t * t + 0.9375
        else:
            t -= 2.625 / 2.75
            return 7.5625 * t * t + 0.984375

    @staticmethod
    def ease_out_elastic(t: float) -> float:
        t = max(0.0, min(1.0, t))
        if t == 0.0 or t == 1.0:
            return t
        p = 0.3
        s = p / 4.0
        return math.pow(2.0, -10.0 * t) * math.sin((t - s) * (2.0 * math.pi) / p) + 1.0


class Tween:
    """Manages an interpolated float value over time using a designated easing function."""

    def __init__(
        self,
        start_val: float,
        end_val: float,
        duration: float,
        easing: Callable[[float], float] = Easing.ease_out_quad,
        on_complete: Optional[Callable[[], None]] = None
    ):
        self.start_val = float(start_val)
        self.end_val = float(end_val)
        self.duration = max(0.001, float(duration))
        self.easing = easing
        self.on_complete = on_complete
        self.elapsed = 0.0
        self.finished = False
        self.value = float(start_val)

    def update(self, dt: float) -> float:
        if self.finished:
            return self.value

        self.elapsed += dt
        if self.elapsed >= self.duration:
            self.elapsed = self.duration
            self.finished = True
            self.value = self.end_val
            if self.on_complete is not None:
                self.on_complete()
            return self.value

        norm_t = self.elapsed / self.duration
        eased_t = self.easing(norm_t)
        self.value = self.start_val + (self.end_val - self.start_val) * eased_t
        return self.value

    def reset(self, start_val: Optional[float] = None, end_val: Optional[float] = None) -> None:
        if start_val is not None:
            self.start_val = float(start_val)
        if end_val is not None:
            self.end_val = float(end_val)
        self.elapsed = 0.0
        self.finished = False
        self.value = self.start_val


class Timer:
    """Simple game timer for periodic triggers or delays."""

    def __init__(self, duration: float, looping: bool = False):
        self.duration = float(duration)
        self.looping = looping
        self.elapsed = 0.0
        self.finished = False

    def update(self, dt: float) -> bool:
        if self.finished and not self.looping:
            return False

        self.elapsed += dt
        if self.elapsed >= self.duration:
            if self.looping:
                self.elapsed %= self.duration
            else:
                self.finished = True
            return True
        return False

    def reset(self) -> None:
        self.elapsed = 0.0
        self.finished = False

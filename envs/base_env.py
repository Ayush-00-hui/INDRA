from abc import ABC, abstractmethod
from typing import Tuple, Dict, Any
import numpy as np
import pygame


class BaseEnv(ABC):
    """
    Abstract Base Class for all simulation environments in the World Model project.
    
    Both Robotics and Driving environments strictly adhere to this frozen interface.
    Actions are discrete integers.
    States are 1D float32 numpy arrays normalized roughly to [-1.0, 1.0].
    """

    @abstractmethod
    def reset(self, seed: int = None) -> np.ndarray:
        """
        Reset the environment to an initial state.
        
        Args:
            seed (int, optional): Random seed for reproducible layout generation.
            
        Returns:
            np.ndarray: Initial state vector (dtype float32, shape (state_size,)).
        """
        pass

    @abstractmethod
    def step(self, action: int) -> Tuple[np.ndarray, float, bool, Dict[str, Any]]:
        """
        Advance the environment by one step given a discrete action.
        
        Args:
            action (int): Discrete action integer in range [0, action_size - 1].
            
        Returns:
            Tuple containing:
                - next_state (np.ndarray): State after transition (shape (state_size,)).
                - reward (float): Scalar reward signal.
                - done (bool): True if episode terminates (goal reached or max steps).
                - info (dict): Diagnostic info (e.g. "collision", "reached_goal", "timeout").
        """
        pass

    @abstractmethod
    def render(self, screen: pygame.Surface) -> None:
        """
        Draw the current environment state onto a Pygame surface.
        
        Args:
            screen (pygame.Surface): Pygame surface to render onto.
        """
        pass

    @abstractmethod
    def get_state_size(self) -> int:
        """Return the dimension of the state vector."""
        pass

    @abstractmethod
    def get_action_size(self) -> int:
        """Return the number of discrete actions available."""
        pass

    def get_render_state(self) -> Dict[str, Any]:
        """
        Optional Web Render-State hook (Additive).
        Returns a serializable dictionary representation for 3D/2D web rendering.
        Default implementation provides a generic state vector wrapper.
        """
        return {
            "v": 1,
            "scenario": getattr(self, "scenario_name", "generic"),
            "step": getattr(self, "step_count", 0),
            "dt": 1.0 / 30.0,
            "mode": "baseline",
            "world": {
                "bounds": [0, 0, 900, 600],
                "units": "px",
                "scale": 1.0,
            },
            "entities": [],
            "goal": None,
            "plan": None,
            "metrics": {
                "reward": 0.0,
                "episode": 0,
                "success": False,
                "collisions": getattr(self, "collision_count", 0),
            },
            "events": [],
            "model_error": None,
        }

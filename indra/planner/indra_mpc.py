"""
Project INDRA: Model Predictive Control (MPC) Planner.
Generates candidate action sequences, rolls them out through the active World Model,
and evaluates multi-objective safety, clearance, and navigation costs.
"""

import time
import math
from typing import List, Dict, Any, Tuple, Optional
import numpy as np

from indra.model.model_interface import BaseWorldModelInterface


class IndraMpcPlanner:
    """
    Random-Shooting and Structured Motion Primitive MPC Planner.
    """

    # Action primitives
    ACTION_FORWARD = 0
    ACTION_BRAKE = 1
    ACTION_LEFT = 2
    ACTION_RIGHT = 3
    ACTION_STAY = 4
    NUM_ACTIONS = 5

    def __init__(self, horizon: int = 12, num_samples: int = 40):
        self.horizon = horizon
        self.num_samples = num_samples
        self.last_action = self.ACTION_STAY

    def generate_candidate_sequences(self, horizon: int) -> List[List[int]]:
        """Generate structured motion primitives and stochastic exploration sequences."""
        sequences: List[List[int]] = []

        # 1. Straight lines
        for a in range(self.NUM_ACTIONS):
            sequences.append([a] * horizon)

        # 2. L-turn detours: turn left/right for k steps then forward
        for turn_act in [self.ACTION_LEFT, self.ACTION_RIGHT]:
            for k in [2, 3, 4, 6]:
                if k < horizon:
                    seq = [turn_act] * k + [self.ACTION_FORWARD] * (horizon - k)
                    sequences.append(seq)

        # 3. S-curve lane change: turn left, then right, then forward
        for a1, a2 in [(self.ACTION_LEFT, self.ACTION_RIGHT), (self.ACTION_RIGHT, self.ACTION_LEFT)]:
            seq = [a1] * 2 + [a2] * 2 + [self.ACTION_FORWARD] * (horizon - 4)
            sequences.append(seq)

        # 4. Reverse escape primitives (for blocked paths and dead ends)
        for k in [2, 3, 4]:
            if k < horizon:
                sequences.append([self.ACTION_BRAKE] * k + [self.ACTION_LEFT] * (horizon - k))
                sequences.append([self.ACTION_BRAKE] * k + [self.ACTION_RIGHT] * (horizon - k))
                sequences.append([self.ACTION_BRAKE] * k + [self.ACTION_FORWARD] * (horizon - k))

        # 5. Yield-and-Proceed (Wait for dynamic crossing obstacle to clear path, then proceed)
        for k in [2, 3, 4]:
            if k < horizon:
                sequences.append([self.ACTION_STAY] * k + [self.ACTION_FORWARD] * (horizon - k))

        # 6. Decelerate-and-Detour (Brake lightly, steer around obstacle, then resume speed)
        for turn_act in [self.ACTION_LEFT, self.ACTION_RIGHT]:
            if 4 < horizon:
                sequences.append([self.ACTION_BRAKE] * 1 + [turn_act] * 3 + [self.ACTION_FORWARD] * (horizon - 4))

        # 7. Stochastic exploration sequences to fill budget
        while len(sequences) < self.num_samples:
            first_act = np.random.choice([0, 1, 2, 3, 4], p=[0.40, 0.1, 0.2, 0.2, 0.10])
            seq = [first_act]
            for _ in range(horizon - 1):
                if np.random.random() < 0.70:
                    seq.append(seq[-1]) # Action persistence
                else:
                    seq.append(int(np.random.randint(0, self.NUM_ACTIONS)))
            sequences.append(seq)

        return sequences[:self.num_samples]

    def plan(
        self,
        world_model: BaseWorldModelInterface,
        current_state: np.ndarray,
        goal_x: float,
        goal_y: float,
        actors: List[Any],
        hazard_zones: List[Any],
        hover_seconds: float = 0.0
    ) -> Tuple[int, Dict[str, Any]]:
        """
        Evaluate candidate action sequences over receding horizon.
        Returns: (best_action, plan_diagnostics_dict)
        """
        t0 = time.perf_counter()
        candidates = self.generate_candidate_sequences(self.horizon)

        # Batch trajectory rollout if supported by active world model
        if hasattr(world_model, "predict_trajectories_batch"):
            all_trajs = world_model.predict_trajectories_batch(current_state, candidates)
        else:
            all_trajs = [world_model.predict_trajectory(current_state, seq) for seq in candidates]

        best_score = -float("inf")
        best_sequence: List[int] = candidates[0]
        best_trajectory_coords: List[Tuple[float, float]] = []
        alt_trajectories: List[Dict[str, Any]] = []

        gamma = 0.94
        dt = 0.1 # Simulation integration step

        for idx, seq in enumerate(candidates):
            traj = all_trajs[idx]
            score = 0.0
            coords: List[Tuple[float, float]] = [(float(current_state[0]), float(current_state[1]))]

            has_collision = False

            # Action smoothness bonus: suppresses high-frequency steering jitter
            if seq[0] == self.last_action:
                score += 3.0

            for t, s in enumerate(traj):
                rx = float(s[0])
                ry = float(s[1])
                coords.append((round(rx, 2), round(ry, 2)))

                # 1. Goal distance reduction
                dist_to_goal = math.hypot(goal_x - rx, goal_y - ry)
                goal_reward = -dist_to_goal * 1.5

                # 2. Dynamic actor clearance: project moving obstacles along velocity vector
                lookahead_time = (t + 1) * dt
                min_actor_dist = float("inf")
                for actor in actors:
                    if getattr(actor, "is_dynamic", False):
                        pred_ax = actor.x + actor.vx * lookahead_time
                        pred_ay = actor.y + actor.vy * lookahead_time
                    else:
                        pred_ax = actor.x
                        pred_ay = actor.y

                    d = math.hypot(pred_ax - rx, pred_ay - ry)
                    if d < min_actor_dist:
                        min_actor_dist = d

                    # Critical collision threshold with physical UGV bounding radius
                    if d < (actor.radius + 0.45):
                        has_collision = True
                        score -= 250.0 * (gamma ** t)

                # Actor proximity gradient
                if min_actor_dist < 2.2:
                    score -= (2.2 - min_actor_dist) * 25.0 * (gamma ** t)

                # 3. Hazard zones (waterlogging, potholes)
                for hazard in hazard_zones:
                    hz_dist = math.hypot(hazard.x - rx, hazard.y - ry)
                    if hz_dist < (hazard.radius + 0.35):
                        # Pothole or waterlog penalty
                        penalty = 120.0 if hazard.kind == "waterlogging" else 60.0
                        score -= penalty * (gamma ** t)

                # 4. Anti-hovering incentive to move
                if hover_seconds > 2.0 and seq[0] != self.ACTION_STAY:
                    score += 25.0 * hover_seconds

                score += goal_reward * (gamma ** t)

            alt_trajectories.append({
                "path": coords,
                "score": round(score, 1),
                "first_action": seq[0],
                "has_collision": has_collision
            })

            if score > best_score:
                best_score = score
                best_sequence = seq
                best_trajectory_coords = coords

        best_action = best_sequence[0] if best_sequence else self.ACTION_FORWARD
        self.last_action = best_action
        plan_ms = (time.perf_counter() - t0) * 1000.0

        plan_info = {
            "chosen_action": best_action,
            "best_trajectory": best_trajectory_coords,
            "alternatives": alt_trajectories[:8], # Top 8 visualization candidates
            "score": round(best_score, 2),
            "plan_ms": round(plan_ms, 2),
            "horizon": self.horizon,
            "num_candidates": len(candidates)
        }

        return best_action, plan_info

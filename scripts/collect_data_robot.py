import os
import sys
import argparse
import numpy as np

# Ensure root directory is on PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from envs.robot_env import RobotEnv


def get_greedy_action(robot_x: float, robot_y: float, goal_x: float, goal_y: float) -> int:
    """Choose action moving directly toward goal on the dominant axis."""
    dx = goal_x - robot_x
    dy = goal_y - robot_y
    if abs(dx) > abs(dy):
        return RobotEnv.ACTION_RIGHT if dx > 0 else RobotEnv.ACTION_LEFT
    else:
        return RobotEnv.ACTION_DOWN if dy > 0 else RobotEnv.ACTION_UP


def collect_data(
    n_samples: int = 40000,
    scenario: int = 1,
    output_path: str = "data/robot_transitions.npz",
    seed: int = 42
) -> None:
    """
    Collect transitions for the robotics environment.
    
    Mix:
    - 70% uniform-random actions (exploration, hitting walls and obstacles).
    - 30% noisy greedy actions (aiming at goal with 30% random jitter to generate goal reaches & chair collisions).
    """
    np.random.seed(seed)
    env = RobotEnv(scenario=scenario)
    state = env.reset(seed=seed)

    states = []
    actions = []
    next_states = []
    rewards = []

    collision_count = 0
    goal_reach_count = 0
    episodes = 0

    print(f"Collecting {n_samples} transitions for Robot Scenario {scenario}...")

    while len(states) < n_samples:
        # Action selection policy: balanced exploration & goal-directed navigation
        if np.random.rand() < 0.50:
            # 50% uniform random exploration (exploring room and obstacle perimeters)
            action = np.random.randint(0, env.get_action_size())
        else:
            # 50% noisy greedy action (driving toward goal & chair, with 20% noise)
            if np.random.rand() < 0.20:
                action = np.random.randint(0, env.get_action_size())
            else:
                action = get_greedy_action(env.robot_x, env.robot_y, env.goal_x, env.goal_y)

        next_state, reward, done, info = env.step(action)

        states.append(state)
        actions.append(action)
        next_states.append(next_state)
        rewards.append(reward)

        if info["collision"]:
            collision_count += 1
        if info["reached_goal"]:
            goal_reach_count += 1

        if done:
            episodes += 1
            state = env.reset()
        else:
            state = next_state

        if (len(states) % 10000 == 0) or (len(states) == n_samples):
            print(f"Collected {len(states)}/{n_samples} steps | Collisions: {collision_count} | Goal Reaches: {goal_reach_count}")

    states = np.array(states, dtype=np.float32)
    actions = np.array(actions, dtype=np.int64)
    next_states = np.array(next_states, dtype=np.float32)
    rewards = np.array(rewards, dtype=np.float32)

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    np.savez_compressed(
        output_path,
        states=states,
        actions=actions,
        next_states=next_states,
        rewards=rewards
    )

    print("\nData collection summary:")
    print(f"Total transitions saved: {len(states)}")
    print(f"Episodes completed:      {episodes}")
    print(f"Collision events:        {collision_count} ({collision_count / len(states) * 100:.1f}%)")
    print(f"Goal reach events:       {goal_reach_count}")
    print(f"Output saved to:         {output_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Collect robot transition data for World Model training.")
    parser.add_argument("--samples", type=int, default=40000, help="Number of transitions to collect.")
    parser.add_argument("--scenario", type=int, default=1, help="Scenario (1=static chair, 2=moving person).")
    parser.add_argument("--output", type=str, default="data/robot_transitions.npz", help="Output .npz file path.")
    parser.add_argument("--seed", type=int, default=42, help="Random seed.")
    args = parser.parse_args()

    collect_data(n_samples=args.samples, scenario=args.scenario, output_path=args.output, seed=args.seed)

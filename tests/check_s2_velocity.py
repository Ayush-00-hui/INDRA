"""
Evaluate velocity and obstacle motion prediction on Scenario 2 model.
Verifies whether the moving-obstacle velocity is learned accurately.
"""
import numpy as np
import torch
from envs.robot_env import RobotEnv
from model.world_model import load_model

def evaluate_s2_motion():
    env = RobotEnv(scenario=2)
    state_size = env.get_state_size()
    action_size = env.get_action_size()
    
    model = load_model("models/robot_model_s2.pt", state_size=state_size, action_size=action_size)
    model.eval()
    
    # Collect held-out transitions from Scenario 2 using TUNE seeds (1000-1050)
    states = []
    actions = []
    next_states = []
    rewards = []
    
    for seed in range(1000, 1050):
        s = env.reset(seed=seed)
        done = False
        steps = 0
        while not done and steps < 80:
            a = np.random.randint(0, action_size)
            ns, r, done, _ = env.step(a)
            states.append(s)
            actions.append(a)
            next_states.append(ns)
            rewards.append(r)
            s = ns
            steps += 1
            
    states = np.array(states, dtype=np.float32)
    actions = np.array(actions, dtype=np.int64)
    next_states = np.array(next_states, dtype=np.float32)
    rewards = np.array(rewards, dtype=np.float32)
    
    true_deltas = next_states - states
    
    # Predict with model
    states_t = torch.as_tensor(states, dtype=torch.float32)
    actions_t = torch.as_tensor(actions, dtype=torch.long)
    
    with torch.no_grad():
        pred_next_states, pred_rewards = model.predict(states_t, actions_t)
        pred_deltas = (pred_next_states - states_t).cpu().numpy()
        
    delta_errors = np.abs(pred_deltas - true_deltas)
    
    # Robot position deltas (idx 0:2)
    robot_pos_mae = np.mean(delta_errors[:, 0:2])
    # Goal relative pos deltas (idx 2:4)
    goal_rel_mae = np.mean(delta_errors[:, 2:4])
    # Obstacle 1 relative pos deltas (idx 4:6)
    obs1_pos_mae = np.mean(delta_errors[:, 4:6])
    # Obstacle 1 velocity deltas (idx 6:8)
    obs1_vel_mae = np.mean(delta_errors[:, 6:8])
    
    # Check regular steps vs wall bounces
    # In regular steps, true_deltas[:, 6:8] is 0. In wall bounce steps, it is non-zero.
    bounce_mask = np.any(np.abs(true_deltas[:, 6:8]) > 1e-4, axis=1)
    regular_mask = ~bounce_mask
    
    regular_vel_mae = np.mean(delta_errors[regular_mask, 6:8]) if np.any(regular_mask) else 0.0
    bounce_vel_mae = np.mean(delta_errors[bounce_mask, 6:8]) if np.any(bounce_mask) else 0.0
    regular_pos_mae = np.mean(delta_errors[regular_mask, 4:6]) if np.any(regular_mask) else 0.0
    bounce_pos_mae = np.mean(delta_errors[bounce_mask, 4:6]) if np.any(bounce_mask) else 0.0

    print("================ SCENARIO 2 MOTION & VELOCITY EVALUATION ================")
    print(f"Total held-out test transitions: {len(states)}")
    print(f"Regular constant-velocity transitions: {np.sum(regular_mask)} ({100*np.mean(regular_mask):.1f}%)")
    print(f"Wall-bounce transition steps: {np.sum(bounce_mask)} ({100*np.mean(bounce_mask):.1f}%)")
    print("------------------------------------------------------------------------")
    print(f"Robot Position Delta MAE:          {robot_pos_mae:.5f}")
    print(f"Goal Relative Delta MAE:           {goal_rel_mae:.5f}")
    print(f"Obstacle 1 Relative Position MAE:  {obs1_pos_mae:.5f}")
    print(f"  - Regular motion Pos MAE:        {regular_pos_mae:.5f}")
    print(f"  - Wall bounce Pos MAE:           {bounce_pos_mae:.5f}")
    print(f"Obstacle 1 Velocity Delta MAE:     {obs1_vel_mae:.5f}")
    print(f"  - Regular motion Vel MAE:        {regular_vel_mae:.5f}")
    print(f"  - Wall bounce Vel MAE:           {bounce_vel_mae:.5f}")
    print("========================================================================")

if __name__ == "__main__":
    evaluate_s2_motion()


"""
Pixel World Model (Dream Engine): 64x64 Next-Frame Top-Down Visual Predictor.
Experimental pixel-level neural hallucination:
Given current top-down frame I_t (64x64x3) and action a_t, predicts I_{t+1}.
"""

import os
import sys
import time
import argparse
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
import pygame

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from envs.robot_env import RobotEnv
from model.world_model import get_device


class DreamConvNet(nn.Module):
    """
    Lightweight convolutional autoencoder with action conditioning
    for 64x64 next-frame pixel prediction.
    """
    def __init__(self, action_size: int = 5):
        super().__init__()
        self.action_size = action_size

        # Encoder: 64x64 -> 32x32 -> 16x16
        self.enc1 = nn.Conv2d(3, 32, kernel_size=4, stride=2, padding=1)
        self.enc2 = nn.Conv2d(32, 64, kernel_size=4, stride=2, padding=1)
        self.enc3 = nn.Conv2d(64, 128, kernel_size=4, stride=2, padding=1)  # 8x8

        # Action conditioning projection
        self.act_fc = nn.Linear(action_size, 128 * 8 * 8)

        # Decoder: 8x8 -> 16x16 -> 32x32 -> 64x64
        self.dec1 = nn.ConvTranspose2d(256, 64, kernel_size=4, stride=2, padding=1)
        self.dec2 = nn.ConvTranspose2d(64, 32, kernel_size=4, stride=2, padding=1)
        self.dec3 = nn.ConvTranspose2d(32, 3, kernel_size=4, stride=2, padding=1)

    def forward(self, img: torch.Tensor, act_one_hot: torch.Tensor) -> torch.Tensor:
        # img: (B, 3, 64, 64) in [0, 1]
        e1 = F.relu(self.enc1(img))
        e2 = F.relu(self.enc2(e1))
        e3 = F.relu(self.enc3(e2))  # (B, 128, 8, 8)

        act_feat = F.relu(self.act_fc(act_one_hot)).view(-1, 128, 8, 8)
        fused = torch.cat([e3, act_feat], dim=1)  # (B, 256, 8, 8)

        d1 = F.relu(self.dec1(fused))
        d2 = F.relu(self.dec2(d1))
        out = torch.sigmoid(self.dec3(d2))
        return out


def train_dream_model(
    output_path: str = "models/dream_model.pt",
    n_frames: int = 3000,
    epochs: int = 20,
    batch_size: int = 64,
) -> None:
    os.environ["SDL_VIDEODRIVER"] = "dummy"
    pygame.init()
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)

    print("=" * 70)
    print("   COLLECTING 64x64 TOP-DOWN FRAMES FOR PIXEL WORLD MODEL")
    print(f"   Target: {n_frames} transition pairs | Output: {output_path}")
    print("=" * 70)

    env = RobotEnv(scenario=1)
    env.reset(seed=42)
    render_surf = pygame.Surface((900, 600))
    action_size = env.get_action_size()

    frames = []
    actions = []
    next_frames = []

    def get_64x64():
        env.render(render_surf)
        small = pygame.transform.smoothscale(render_surf, (64, 64))
        arr = pygame.surfarray.array3d(small)  # (64, 64, 3)
        return np.transpose(arr, (2, 0, 1)).astype(np.float32) / 255.0

    curr_frame = get_64x64()
    for i in range(n_frames):
        act = np.random.randint(0, action_size)
        _, _, done, _ = env.step(act)
        nxt_frame = get_64x64()

        frames.append(curr_frame)
        actions.append(act)
        next_frames.append(nxt_frame)

        if done:
            env.reset()
            curr_frame = get_64x64()
        else:
            curr_frame = nxt_frame

        if (i + 1) % 1000 == 0:
            print(f"  Collected {i + 1}/{n_frames} frames...")

    frames = torch.as_tensor(np.array(frames), dtype=torch.float32)
    actions = F.one_hot(torch.as_tensor(actions, dtype=torch.long), num_classes=action_size).float()
    next_frames = torch.as_tensor(np.array(next_frames), dtype=torch.float32)

    device = get_device()
    print(f"\nTraining DreamConvNet on {device} ({len(frames)} samples, {epochs} epochs)...")
    model = DreamConvNet(action_size=action_size).to(device)
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)

    dataset = torch.utils.data.TensorDataset(frames, actions, next_frames)
    loader = torch.utils.data.DataLoader(dataset, batch_size=batch_size, shuffle=True)

    t0 = time.time()
    for ep in range(1, epochs + 1):
        model.train()
        total_loss = 0.0
        batches = 0
        for b_img, b_act, b_nxt in loader:
            b_img, b_act, b_nxt = b_img.to(device), b_act.to(device), b_nxt.to(device)
            pred = model(b_img, b_act)
            loss = F.mse_loss(pred, b_nxt)

            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            total_loss += loss.item()
            batches += 1

        avg_loss = total_loss / max(batches, 1)
        if ep % 5 == 0 or ep == 1 or ep == epochs:
            print(f"  Epoch [{ep:2d}/{epochs:2d}] | MSE Loss: {avg_loss:.5f}")

    el = time.time() - t0
    torch.save(model.state_dict(), output_path)
    print(f"\nSaved pixel world model to {output_path} (Training time: {el:.2f}s)")


if __name__ == "__main__":
    train_dream_model()

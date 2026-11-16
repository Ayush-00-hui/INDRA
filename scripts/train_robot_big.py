"""
Heavy GPU Training Script for Epistemic Uncertainty-Aware Ensemble World Model.
- Architecture: EnsembleWorldModel (K=5 members, 512-dim, 3 residual blocks, LayerNorm)
- Optimization: Mixed precision AMP (fp16), AdamW, Cosine Annealing, Grad Clipping
- Logging: Loss curves -> results/training_curves.png, GPU VRAM, Throughput (samples/sec)
"""

import os
import sys
import time
import argparse
from typing import Dict, List, Tuple, Any, Optional
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.cuda.amp import autocast, GradScaler
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

# Ensure root directory on PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from model.world_model import EnsembleWorldModel, save_model, get_device


def train_single_member(
    member_idx: int,
    member: nn.Module,
    norm_states: torch.Tensor,
    actions_one_hot: torch.Tensor,
    norm_deltas: torch.Tensor,
    norm_rewards: torch.Tensor,
    val_norm_states: torch.Tensor,
    val_actions_oh: torch.Tensor,
    val_norm_deltas: torch.Tensor,
    val_norm_rewards: torch.Tensor,
    epochs: int = 35,
    batch_size: int = 1024,
    lr: float = 1e-3,
    device: torch.device = torch.device("cuda")
) -> Dict[str, list]:
    """Train one ensemble member on a bootstrap sample of the training data."""
    n_train = len(norm_states)
    # Bootstrap sampling (sampling with replacement) to induce diversity
    boot_indices = torch.randint(0, n_train, (n_train,), device=device)
    b_states = norm_states[boot_indices]
    b_actions = actions_one_hot[boot_indices]
    b_deltas = norm_deltas[boot_indices]
    b_rewards = norm_rewards[boot_indices]

    optimizer = torch.optim.AdamW(member.parameters(), lr=lr, weight_decay=1e-4)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs, eta_min=1e-5)
    scaler = torch.amp.GradScaler('cuda', enabled=(device.type == "cuda"))

    history = {"train_loss": [], "val_loss": []}

    for epoch in range(1, epochs + 1):
        member.train()
        perm = torch.randperm(n_train, device=device)
        total_loss = 0.0
        batches = 0

        for start in range(0, n_train, batch_size):
            end = min(start + batch_size, n_train)
            idx = perm[start:end]

            optimizer.zero_grad(set_to_none=True)
            with torch.amp.autocast('cuda', enabled=(device.type == "cuda"), dtype=torch.float16):
                pred_d, pred_r = member(b_states[idx], b_actions[idx])
                loss_d = F.mse_loss(pred_d, b_deltas[idx])
                # Focal obstacle boundary weighting: penalize collision errors heavily
                coll_mask = (b_rewards[idx] < -0.2).float()
                weights = 1.0 + 1.5 * coll_mask
                loss_r = (weights * (pred_r - b_rewards[idx]).pow(2)).mean()
                loss = loss_d + 0.8 * loss_r

            scaler.scale(loss).backward()
            scaler.unscale_(optimizer)
            torch.nn.utils.clip_grad_norm_(member.parameters(), max_norm=1.0)
            scaler.step(optimizer)
            scaler.update()

            total_loss += loss.item()
            batches += 1

        scheduler.step()
        avg_train = total_loss / max(batches, 1)

        # Validation
        member.eval()
        with torch.no_grad():
            with torch.amp.autocast('cuda', enabled=(device.type == "cuda"), dtype=torch.float16):
                val_d, val_r = member(val_norm_states, val_actions_oh)
                v_loss = (F.mse_loss(val_d, val_norm_deltas) + F.mse_loss(val_r, val_norm_rewards)).item()

        history["train_loss"].append(avg_train)
        history["val_loss"].append(v_loss)

        if epoch % 5 == 0 or epoch == 1 or epoch == epochs:
            print(f"    Epoch [{epoch:2d}/{epochs:2d}] | Train: {avg_train:.5f} | Val: {v_loss:.5f}")

    return history


def train_ensemble(
    data_path: str,
    output_path: str,
    epochs: int = 35,
    batch_size: int = 1024,
    lr: float = 1e-3,
    num_models: int = 5,
    hidden: int = 512,
    num_blocks: int = 3
) -> None:
    t0 = time.time()
    device = get_device()
    print("=" * 70)
    print("   TRAINING DEEP UNCERTAINTY-AWARE ENSEMBLE WORLD MODEL (AMP fp16)")
    print(f"   Device: {device} | {torch.cuda.get_device_name(device) if device.type == 'cuda' else 'CPU'}")
    print(f"   Dataset: {data_path}")
    print(f"   Architecture: K={num_models} members, hidden={hidden}, residual_blocks={num_blocks}")
    print(f"   Batch Size: {batch_size} | Epochs per member: {epochs} | LR: {lr}")
    print("=" * 70)

    # 1. Load data
    data = np.load(data_path)
    states = data["states"]
    actions = data["actions"]
    next_states = data["next_states"]
    rewards = data["rewards"]
    n_samples = len(states)
    deltas = next_states - states

    state_size = states.shape[1]
    action_size = int(np.max(actions)) + 1
    if action_size < 5:
        action_size = 5

    # 2. Train / Val split (90% train, 10% val)
    val_size = max(1000, int(0.10 * n_samples))
    indices = np.random.permutation(n_samples)
    train_idx, val_idx = indices[val_size:], indices[:val_size]

    train_states, val_states = states[train_idx], states[val_idx]
    train_actions, val_actions = actions[train_idx], actions[val_idx]
    train_deltas, val_deltas = deltas[train_idx], deltas[val_idx]
    train_rewards, val_rewards = rewards[train_idx], rewards[val_idx]

    # Compute normalization statistics
    s_mean, s_std = np.mean(train_states, axis=0), np.std(train_states, axis=0)
    d_mean, d_std = np.mean(train_deltas, axis=0), np.std(train_deltas, axis=0)
    r_mean, r_std = np.mean(train_rewards), np.std(train_rewards)

    # Create master ensemble
    ensemble = EnsembleWorldModel(
        state_size=state_size,
        action_size=action_size,
        num_models=num_models,
        hidden=hidden,
        num_blocks=num_blocks
    ).to(device)
    ensemble.set_normalization(s_mean, s_std, d_mean, d_std, np.array([r_mean]), np.array([r_std]))

    # Transfer normalized tensors to GPU
    train_s_norm = torch.as_tensor((train_states - s_mean) / np.maximum(s_std, 1e-6), dtype=torch.float32, device=device)
    train_a_oh = F.one_hot(torch.as_tensor(train_actions, dtype=torch.long, device=device), num_classes=action_size).float()
    train_d_norm = torch.as_tensor((train_deltas - d_mean) / np.maximum(d_std, 1e-6), dtype=torch.float32, device=device)
    train_r_norm = torch.as_tensor((train_rewards - r_mean) / max(r_std, 1e-6), dtype=torch.float32, device=device).unsqueeze(-1)

    val_s_norm = torch.as_tensor((val_states - s_mean) / np.maximum(s_std, 1e-6), dtype=torch.float32, device=device)
    val_a_oh = F.one_hot(torch.as_tensor(val_actions, dtype=torch.long, device=device), num_classes=action_size).float()
    val_d_norm = torch.as_tensor((val_deltas - d_mean) / np.maximum(d_std, 1e-6), dtype=torch.float32, device=device)
    val_r_norm = torch.as_tensor((val_rewards - r_mean) / max(r_std, 1e-6), dtype=torch.float32, device=device).unsqueeze(-1)

    all_histories = []

    # 3. Train each ensemble member
    for k in range(num_models):
        m_t0 = time.time()
        print(f"\n[Member {k + 1}/{num_models}] Training bootstrap model (seed={k * 101})...")
        hist = train_single_member(
            member_idx=k,
            member=ensemble.models[k],
            norm_states=train_s_norm,
            actions_one_hot=train_a_oh,
            norm_deltas=train_d_norm,
            norm_rewards=train_r_norm,
            val_norm_states=val_s_norm,
            val_actions_oh=val_a_oh,
            val_norm_deltas=val_d_norm,
            val_norm_rewards=val_r_norm,
            epochs=epochs,
            batch_size=batch_size,
            lr=lr,
            device=device
        )
        all_histories.append(hist)
        m_el = time.time() - m_t0
        print(f"  Final Val Loss: {hist['val_loss'][-1]:.5f} | Member train time: {m_el:.1f}s")

    # 4. Save checkpoint
    ensemble.eval()
    save_model(ensemble, output_path)
    print(f"\nSaved ensemble world model to: {output_path}")

    # 5. Measure GPU throughput & memory
    total_time = time.time() - t0
    total_samples_processed = len(train_states) * epochs * num_models
    throughput = total_samples_processed / max(total_time, 0.001)

    vram_mb = 0
    if device.type == "cuda":
        vram_mb = torch.cuda.max_memory_allocated(device) / (1024 * 1024)

    print("\n" + "=" * 70)
    print("   TRAINING SUMMARY")
    print(f"   Total Wall-Clock:  {total_time:.2f} s ({total_time / 60.0:.2f} min)")
    print(f"   Training Throughput: {throughput:,.0f} transitions / sec")
    if device.type == "cuda":
        print(f"   Peak GPU VRAM:     {vram_mb:.1f} MB (Budget <= 6,144 MB)")
    print("=" * 70)

    # 6. Plot and save training curves
    plt.figure(figsize=(10, 6))
    for k, hist in enumerate(all_histories):
        plt.plot(hist["train_loss"], label=f"Member {k + 1} Train", linestyle="--", alpha=0.7)
        plt.plot(hist["val_loss"], label=f"Member {k + 1} Val")
    plt.xlabel("Epoch")
    plt.ylabel("MSE Loss (Norm Delta + Reward)")
    plt.title(f"Ensemble World Model (K={num_models}) Training Curves")
    plt.grid(True, alpha=0.3)
    plt.legend(ncol=2)
    os.makedirs("results", exist_ok=True)
    plot_path = "results/training_curves.png"
    plt.savefig(plot_path, dpi=150, bbox_inches="tight")
    plt.close()
    print(f"Training curves saved to: {plot_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train Ensemble World Model on GPU")
    parser.add_argument("--data", type=str, default="data/robot_dataset_big.npz", help="Dataset path")
    parser.add_argument("--output", type=str, default="models/robot_ensemble.pt", help="Output model path")
    parser.add_argument("--epochs", type=int, default=30, help="Epochs per member")
    parser.add_argument("--batch-size", type=int, default=1024, help="Batch size")
    parser.add_argument("--lr", type=float, default=1e-3, help="Learning rate")
    parser.add_argument("--models", type=int, default=5, help="Number of ensemble members")
    args = parser.parse_args()

    train_ensemble(
        data_path=args.data,
        output_path=args.output,
        epochs=args.epochs,
        batch_size=args.batch_size,
        lr=args.lr,
        num_models=args.models
    )

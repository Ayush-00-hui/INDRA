"""
Project INDRA: Benchmark Evaluation CLI & Experiment Runner.
Executes batch scenario trials, measures goal success rate, collision metrics,
and planning latency across the 10 Indian urban benchmark scenarios.
Generates structured JSON and CSV reports for publication and model comparison.

Usage:
    python scripts/evaluate_indra.py --scenarios 1,2,5 --trials 3 --output-json results/indra_benchmark_results.json
"""

import os
import sys
import argparse
import time

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if REPO_ROOT not in sys.path:
    sys.path.insert(0, REPO_ROOT)

from indra.benchmarks.evaluator import IndraBenchmarkEvaluator
from indra.model.model_interface import BaselineKinematicWorldModel, BaseWorldModelInterface


def load_world_model(model_path: str) -> BaseWorldModelInterface:
    if not model_path or model_path.lower() == "baseline":
        print("[Evaluator] Using BaselineKinematicWorldModel (Analytical Mode).")
        return BaselineKinematicWorldModel()

    if os.path.exists(model_path):
        try:
            import torch
            from indra.model.train_world_model import IndraNeuralWorldModel
            device = "cuda" if torch.cuda.is_available() else "cpu"
            print(f"[Evaluator] Loading Deep Residual World Model from {model_path} onto {device.upper()}...")
            checkpoint = torch.load(model_path, map_location=device)
            model = IndraNeuralWorldModel(obs_dim=24, action_dim=5, hidden_dim=256, num_res_blocks=4)
            if isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:
                model.load_state_dict(checkpoint["model_state_dict"])
            else:
                model.load_state_dict(checkpoint)
            model.to(device)
            model.eval()
            print(f"[Evaluator] World model loaded successfully ({device.upper()}).")
            return model
        except Exception as e:
            print(f"[Evaluator] Warning: Failed to load neural model from {model_path} ({e}). Falling back to baseline.")
            return BaselineKinematicWorldModel()
    else:
        print(f"[Evaluator] Checkpoint {model_path} not found. Falling back to analytical baseline.")
        return BaselineKinematicWorldModel()


def main():
    parser = argparse.ArgumentParser(description="Evaluate Project INDRA Autonomous Navigation on Indian Urban Scenarios.")
    parser.add_argument("--scenarios", type=str, default="1,2,3,4,5",
                        help="Comma-separated scenario IDs (e.g. '1,2,5' or 'all')")
    parser.add_argument("--trials", type=int, default=3,
                        help="Number of evaluation trials (seeds) per scenario")
    parser.add_argument("--start-seed", type=int, default=1001,
                        help="Starting seed for reproducible trials")
    parser.add_argument("--max-steps", type=int, default=250,
                        help="Maximum simulation steps per episode")
    parser.add_argument("--model", type=str, default="models/indra_model.pt",
                        help="Path to neural world model checkpoint or 'baseline'")
    parser.add_argument("--output-json", type=str, default="results/indra_benchmark_results.json",
                        help="Path to output JSON report")
    parser.add_argument("--output-csv", type=str, default="results/indra_benchmark_results.csv",
                        help="Path to output CSV report")

    args = parser.parse_args()

    if args.scenarios.lower() == "all":
        scenario_list = list(range(1, 11))
    else:
        scenario_list = [int(s.strip()) for s in args.scenarios.split(",") if s.strip()]

    print("\n" + "=" * 70)
    print(" PROJECT INDRA — AUTONOMOUS ROBOTICS BENCHMARK EVALUATOR")
    print("=" * 70)
    print(f" Scenarios:         {scenario_list}")
    print(f" Trials/Scenario:   {args.trials}")
    print(f" Base Seed:         {args.start_seed}")
    print(f" Max Steps:         {args.max_steps}")
    print(f" Output JSON:       {args.output_json}")
    print(f" Output CSV:        {args.output_csv}")
    print("=" * 70 + "\n")

    world_model = load_world_model(args.model)
    evaluator = IndraBenchmarkEvaluator(world_model=world_model)

    report = evaluator.evaluate_suite(
        scenarios=scenario_list,
        num_seeds=args.trials,
        start_seed=args.start_seed,
        max_steps=args.max_steps
    )

    # Save reports
    evaluator.export_json(report, args.output_json)
    evaluator.export_csv(report, args.output_csv)

    # Print summary table
    print("\n" + "=" * 70)
    print(f"{'SCENARIO':<32} | {'TRIALS':<6} | {'SUCCESS':<8} | {'COLLISIONS':<10} | {'PLAN (ms)':<9}")
    print("-" * 70)
    for sc in report.get("scenarios", []):
        sc_name = sc["scenario_name"][:30]
        trials = sc["num_trials"]
        succ = f"{sc['success_rate_pct']}%"
        coll = f"{sc['mean_collisions']:.1f}"
        ms = f"{sc['mean_plan_latency_ms']:.1f}"
        print(f"{sc_name:<32} | {trials:<6} | {succ:<8} | {coll:<10} | {ms:<9}")
    print("=" * 70)
    print(f"OVERALL SUCCESS: {report['overall_success_rate_pct']}% across {report['overall_trials']} trials")
    print(f"RESULTS SAVED TO:\n  - {args.output_json}\n  - {args.output_csv}\n")


if __name__ == "__main__":
    main()

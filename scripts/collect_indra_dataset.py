"""
Project INDRA: Mode B Batch Transition Collector CLI.
Generates standardized offline training datasets for transfer to college DGX Spark cluster.
Usage:
    python scripts/collect_indra_dataset.py --scenarios 1,2,3,4,5,6,7,8,9,10 --episodes 3 --output data/indra_transitions_sample.npz
"""

import os
import sys
import argparse

# Add repo root to path
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if REPO_ROOT not in sys.path:
    sys.path.insert(0, REPO_ROOT)

from indra.data.collector import DatasetCollector


def main():
    parser = argparse.ArgumentParser(description="Collect Project INDRA transition datasets for World Model training.")
    parser.add_argument("--scenarios", type=str, default="1,2,3,4,5,6,7,8,9,10",
                        help="Comma-separated list of scenario IDs (e.g. '1,2,3' or 'all')")
    parser.add_argument("--episodes", type=int, default=3,
                        help="Number of episodes per scenario")
    parser.add_argument("--policy", type=str, choices=["expert_mpc", "exploratory", "random"], default="exploratory",
                        help="Action selection policy for data collection")
    parser.add_argument("--epsilon", type=float, default=0.20,
                        help="Epsilon exploration probability for 'exploratory' policy")
    parser.add_argument("--seed", type=int, default=2026,
                        help="Base random seed for reproducible rollouts")
    parser.add_argument("--output", type=str, default="data/indra_transitions_sample.npz",
                        help="Output path for compressed .npz archive")
    parser.add_argument("--max-steps", type=int, default=150,
                        help="Maximum steps per episode")

    args = parser.parse_args()

    if args.scenarios.lower() == "all":
        scenario_list = list(range(1, 11))
    else:
        scenario_list = [int(s.strip()) for s in args.scenarios.split(",") if s.strip()]

    print("\n" + "=" * 65)
    print(" PROJECT INDRA: AUTONOMOUS URBAN TRANSITION DATASET COLLECTOR")
    print("=" * 65)
    print(f" Target Scenarios:        {scenario_list}")
    print(f" Episodes per Scenario:   {args.episodes}")
    print(f" Policy:                  {args.policy} (epsilon={args.epsilon})")
    print(f" Base Seed:               {args.seed}")
    print(f" Target Output:           {args.output}")
    print("=" * 65 + "\n")

    collector = DatasetCollector(
        policy=args.policy,
        epsilon=args.epsilon,
        planner_horizon=10,
        planner_samples=25
    )

    summary = collector.collect(
        scenarios=scenario_list,
        episodes_per_scenario=args.episodes,
        base_seed=args.seed,
        max_steps_per_episode=args.max_steps,
        verbose=True
    )

    saved_path = collector.save_npz(args.output)
    print(f"\n[OK] Transition dataset saved successfully to:\n     {saved_path}")
    print(f"     Metadata sidecar created at:\n     {os.path.splitext(saved_path)[0]}_metadata.json\n")


if __name__ == "__main__":
    main()

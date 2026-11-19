"""
Tests for Project INDRA Benchmark Evaluator.
Verifies deterministic reproducibility across fixed seeds, correct metric accumulation,
and valid JSON/CSV report serialization without data leakage.
"""

import os
import json
import csv
import tempfile
import pytest
import numpy as np

from indra.benchmarks.evaluator import IndraBenchmarkEvaluator
from indra.model.model_interface import BaselineKinematicWorldModel


def test_evaluator_deterministic_reproducibility():
    """Ensure two evaluation runs with the exact same seed produce identical trajectories and metrics."""
    evaluator = IndraBenchmarkEvaluator(world_model=BaselineKinematicWorldModel())

    # Run 1
    res1 = evaluator.evaluate_scenario(scenario_variant=1, num_seeds=2, start_seed=1001, max_steps=40)
    # Run 2
    res2 = evaluator.evaluate_scenario(scenario_variant=1, num_seeds=2, start_seed=1001, max_steps=40)

    assert res1["num_trials"] == res2["num_trials"]
    assert res1["mean_collisions"] == res2["mean_collisions"]
    assert res1["mean_steps"] == res2["mean_steps"]

    for ep1, ep2 in zip(res1["trial_details"], res2["trial_details"]):
        assert ep1["seed"] == ep2["seed"]
        assert ep1["success"] == ep2["success"]
        assert ep1["collisions"] == ep2["collisions"]
        assert ep1["steps"] == ep2["steps"]
        assert ep1["reward"] == pytest.approx(ep2["reward"], abs=1e-3)


def test_evaluator_suite_aggregation():
    """Verify evaluate_suite correctly aggregates metrics across multiple scenario variants."""
    evaluator = IndraBenchmarkEvaluator(world_model=BaselineKinematicWorldModel())

    suite_res = evaluator.evaluate_suite(scenarios=[1, 2], num_seeds=1, start_seed=1005, max_steps=30)

    assert suite_res["overall_trials"] == 2
    assert len(suite_res["scenarios"]) == 2
    assert "world_model" in suite_res
    assert "total_duration_seconds" in suite_res
    assert suite_res["scenarios"][0]["scenario_variant"] == 1
    assert suite_res["scenarios"][1]["scenario_variant"] == 2


def test_evaluator_json_csv_exports():
    """Verify that export_json and export_csv serialize valid, well-formed files."""
    evaluator = IndraBenchmarkEvaluator(world_model=BaselineKinematicWorldModel())
    report = evaluator.evaluate_suite(scenarios=[1], num_seeds=1, start_seed=1010, max_steps=20)

    with tempfile.TemporaryDirectory() as tmpdir:
        json_path = os.path.join(tmpdir, "test_eval.json")
        csv_path = os.path.join(tmpdir, "test_eval.csv")

        evaluator.export_json(report, json_path)
        evaluator.export_csv(report, csv_path)

        assert os.path.exists(json_path)
        assert os.path.exists(csv_path)

        # Validate JSON content
        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            assert data["overall_trials"] == 1
            assert data["scenarios"][0]["scenario_variant"] == 1

        # Validate CSV content
        with open(csv_path, "r", encoding="utf-8") as f:
            reader = list(csv.reader(f))
            assert len(reader) == 2 # header + 1 scenario row
            header = reader[0]
            assert "scenario_variant" in header
            assert "success_rate_pct" in header
            assert reader[1][0] == "1"

"""
Unit tests for Web Render-State Schema validation and serialization.
"""

import json
import pytest
from web.schema import (
    Entity,
    Goal,
    PlanAlt,
    Plan,
    WorldLayout,
    Metrics,
    RenderState,
    CompareRenderState,
    ClientCommand
)


def test_entity_schema():
    e = Entity(
        id="robot_0",
        kind="robot",
        x=100.0,
        y=150.0,
        heading=90.0,
        r=18.0,
        extra={"led": "green"}
    )
    d = e.model_dump()
    assert d["id"] == "robot_0"
    assert d["kind"] == "robot"
    assert d["x"] == 100.0
    assert d["r"] == 18.0
    assert d["extra"]["led"] == "green"


def test_render_state_serialization():
    rs = RenderState(
        scenario="robotics",
        step=10,
        dt=0.0333,
        mode="world_model",
        world=WorldLayout(bounds=[0, 0, 900, 600]),
        entities=[
            Entity(id="robot", kind="robot", x=50.0, y=50.0, r=18.0),
            Entity(id="chair", kind="chair", x=150.0, y=150.0, w=80.0, h=80.0),
        ],
        goal=Goal(x=800.0, y=300.0, r=20.0),
        plan=Plan(
            kind="path",
            best=[[50.0, 50.0], [60.0, 50.0]],
            alts=[PlanAlt(path=[[50.0, 50.0], [50.0, 60.0]], score=-5.0, first_action=1)],
            chosen_action=3,
            ms=7.5
        ),
        metrics=Metrics(reward=5.0, episode=1, success=False, collisions=0, step_count=10),
        events=["bonk"],
        model_error=0.012
    )

    json_str = rs.model_dump_json()
    assert "robotics" in json_str
    assert "bonk" in json_str

    parsed = json.loads(json_str)
    assert parsed["v"] == 1
    assert parsed["step"] == 10
    assert len(parsed["entities"]) == 2
    assert parsed["plan"]["chosen_action"] == 3


def test_compare_render_state():
    rs1 = RenderState(
        scenario="robotics",
        step=5,
        mode="baseline",
        world=WorldLayout(),
        metrics=Metrics()
    )
    rs2 = RenderState(
        scenario="robotics",
        step=5,
        mode="world_model",
        world=WorldLayout(),
        metrics=Metrics()
    )
    comp = CompareRenderState(scenario="robotics", left=rs1, right=rs2)
    dumped = comp.model_dump()
    assert dumped["is_compare"] is True
    assert dumped["left"]["mode"] == "baseline"
    assert dumped["right"]["mode"] == "world_model"


def test_client_command_validation():
    cmd = ClientCommand(cmd="set", mode="compare", speed=1.5, scenario_variant=2)
    assert cmd.cmd == "set"
    assert cmd.mode == "compare"
    assert cmd.speed == 1.5
    assert cmd.scenario_variant == 2

from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict, List

app = FastAPI(title="Ramayana RPG Backend")

SAVE_SLOTS: Dict[str, dict] = {}


class SavePayload(BaseModel):
    slot_id: str
    player_name: str
    current_scene: str
    stats: Dict[str, int]
    affection: Dict[str, int]
    inventory: List[str]
    blessings: List[str]


@app.post("/save")
def save_game(payload: SavePayload):
    SAVE_SLOTS[payload.slot_id] = payload.model_dump()
    return {"status": "saved", "slot": payload.slot_id}


@app.get("/save/{slot_id}")
def load_game(slot_id: str):
    return SAVE_SLOTS.get(slot_id, {"status": "missing"})


@app.post("/combat/resolve")
def resolve_combat(attacker_power: int, enemy_defense: int, aggression: int, strategy: int):
    total = max(1, attacker_power + aggression // 4 + strategy // 5 - enemy_defense)
    return {"damage": total, "critical": total > attacker_power}


@app.post("/event/check-loyalty")
def check_loyalty(affection: int, threshold: int = 40):
    return {"loyal": affection >= threshold}

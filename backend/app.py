import random
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi import Body
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


class ContinueStoryPayload(BaseModel):
    player_name: str
    current_title: str
    current_text: str
    stats: Dict[str, int]


@app.post("/ai/continue-story")
def continue_story(payload: ContinueStoryPayload = Body(...)):
    tones = ["storm-lit", "moonlit", "sun-burnished", "whispering"]
    conflicts = ["an oathkeeper", "a wandering sage", "a hidden rakshasa", "a bridge guardian"]
    tone = random.choice(tones)
    conflict = random.choice(conflicts)
    dharma = payload.stats.get("dharma", 50)
    title = f"Endless Chapter: {payload.current_title}"
    paragraphs = [
        f"{payload.player_name} enters a {tone} frontier beyond the known tale, where each step writes new legend.",
        f"A trial emerges in the form of {conflict}, testing balance between duty, strategy, and compassion.",
        f"With dharma at {dharma}, destiny bends but does not break; the story now grows without end."
    ]
    return {
        "title": title,
        "paragraphs": paragraphs,
        "choice_a": "Take the path of valor",
        "choice_b": "Take the path of wisdom"
    }

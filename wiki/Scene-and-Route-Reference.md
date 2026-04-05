# Scene & Route Reference

This page summarizes the implemented narrative structure as of now.

## Main arc blocks

### Part 1: Exile and early branching

- Exile opening and response branch (argue vs accept)
- Alone vs with companions divergence
- Surphanaka encounter outcomes:
  - Combat branch
  - Negotiation branch
  - Dark alliance branch -> Evil King ending

### Golden Deer and abduction arc

- Golden deer choices, including lore detour scene
- Lakshmana accompaniment decision
- Maricha reveal and cry
- Ravana deception branch (chance-driven split)
- Jatayu intervention and quiz/fate sequence

### Kishkindha + alliance arc

- Sugriva introduction
- Alliance and Vali challenge sequence
- Hanuman hub entry

### Hub/side systems arc

From Hanuman hub, player can access:

- Journey trivia
- Guessing game
- Storytelling game
- Ally conversation/training
- Ocean exploration
- Main rescue storyline continuation
- Ambient companion dialogue text shown in scene cards (no pause/reflection choice button)

### Part 2: Rescue sequence

- Rescue start
- Mission leadership and risk debate
- Surasa test
- Lanka reconnaissance progression
- Debrief loops to hub/council

## Notable ending-type scenes currently present

- Evil King Ending (17)
- Game Over (18)
- Ignore Deer Ending (21)
- Peaceful Ending (52)
- Ayodhya Return Ending (67)
- Forest Duel Ending (38)

## Special content scene IDs in use

- Lore artifact injections: 95, 96, 97
- Negotiation duel: 98
- Legacy reflection scene IDs still present in code: 61, 62, 63
- Guessing game: 93
- Storytelling game/result: 99, 100
- Ocean exploration loop: 101, 102
- Ally conversation/training: 77
- Trivia menu/question/result loop: 70–73

## Timeline model

Timeline rendering uses:

- `timelineLevels` to group scenes by columns
- `timelineEdges` to define directed transitions
- Chance edges are marked with `type: "chance"`
- Live highlighting tracks visited nodes and taken transitions
- Reveal mode shows all possible paths (otherwise only explored path + current)

## Routing compatibility notes

The scene hash route parser only restores routes that are present in the `routableSceneIds` array.

When adding any scene in the future:

1. Add display logic in `showScene()`
2. Add transition logic in `makeChoice()` or `makeDecision()`
3. Add timeline title + levels + edges
4. Add to `routableSceneIds` if route restoration is desired
5. Ensure receipts/timeline consistency is preserved

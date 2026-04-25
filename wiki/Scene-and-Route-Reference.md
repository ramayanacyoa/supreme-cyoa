# Scene & Route Reference

This page summarizes the currently implemented narrative structure.

## Main arc blocks

### Part 1: Exile and early branching

- Exile opening with response split.
- Alone-route and companion-route divergence.
- Surphanaka encounter outcomes:
  - combat,
  - negotiation,
  - dark alliance (Evil King route).

### Golden deer and abduction arc

- Golden deer sequence, including lore detours.
- Lakshmana accompaniment decision.
- Maricha reveal and cry.
- Ravana deception split.
- Jatayu intervention outcomes.

### Kishkindha and alliance arc

- Sugriva introduction.
- Alliance and Vali challenge sequence.
- Hanuman hub entry.

### Hub and side systems

From the Hanuman hub, available branches include:

- Journey trivia,
- Guessing game,
- Storytelling game,
- Ally conversation/training,
- Ocean exploration,
- Rescue storyline continuation.

### Part 2: Rescue sequence

- Rescue start and strategy debate.
- Surasa test.
- Lanka reconnaissance progression.
- Debrief loop back to hub/council scenes.

## Ending-type scenes currently present

- Evil King Ending (17)
- Game Over (18)
- Ignore Deer Ending (21)
- Peaceful Ending (52)
- Ayodhya Return Ending (67)
- Forest Duel Ending (38)

## Special scene IDs in use

- Lore artifacts: 95, 96, 97
- Negotiation duel: 98
- Legacy reflection IDs: 61, 62, 63
- Guessing game: 93
- Storytelling game/result: 99, 100
- Ocean exploration loop: 101, 102
- Ally conversation/training: 77
- Trivia loop: 70–73

## Timeline model

- `timelineLevels` groups scenes by column.
- `timelineEdges` defines directed transitions.
- Chance edges use `type: "chance"`.
- Active highlighting reflects visited nodes and taken paths.
- Reveal mode displays full path visibility.

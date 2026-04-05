# Supreme CYOA Wiki (Current State)

_Last updated: 2026-04-05 (UTC)_

Welcome to the project wiki for **The Ramayana: Choose Your Adventure**.

This wiki documents the game exactly as it exists in the repository right now, including:

- Story structure and major scene flows
- Core gameplay systems
- Minigames and unlock conditions
- Inventory artifacts and lore
- Routing/hash behavior
- File-level architecture for maintenance

## Quick links

- [Game Overview](./Game-Overview.md)
- [Scene & Route Reference](./Scene-and-Route-Reference.md)
- [Minigames, Progression, and Unlocks](./Minigames-Progression-and-Unlocks.md)
- [Developer Guide](./Developer-Guide.md)

## Snapshot

- Current visible update badge in app UI: **Update 16**
- Main entry page: `index.html`
- Story logic file: `Project.js`
- Styling file: `Project.css`
- Secondary page: `before-the-ramayana.html` (coming soon screen)

## Notes

This wiki is intentionally implementation-aware so future edits can be made safely without breaking scene flow, timeline highlighting, or inventory/trivia systems.

## Features (recent)

- Updated companion dialogue behavior so scenes keep ambient companion flavor text without adding a pause/reflection button to choices.
- Added an **Epic Chronicle linear campaign** (starting after Scene 60) that walks through the Lanka war, Sita's restoration, return to Ayodhya, Uttara Kanda events, final departure, and later traditions in strict chronological order.
- Expanded post-launch Lanka scenes with detailed prose, tactical branching buttons, and a **War Profile** system that tracks morale/mercy/renown and doctrine choices across the war arc.
- Added a **216-code Lanka Special Ending matrix** that resolves at the end of the epic campaign based on accumulated war-profile choices.
- Added a **sequential scene-order guard** for post-legacy scene IDs so new scenes must remain continuous with no skipped IDs beyond Scene 102.

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

- Current visible update badge in app UI: **Update 10**
- Main entry page: `index.html`
- Story logic file: `Project.js`
- Styling file: `Project.css`
- Secondary page: `before-the-ramayana.html` (coming soon screen)

## Notes

This wiki is intentionally implementation-aware so future edits can be made safely without breaking scene flow, timeline highlighting, or inventory/trivia systems.

## Features (recent)

- Added a **Companion Dialogue Interlude system**: every scene with choices now includes extra ambient dialogue and a "Pause for companion dialogue" option that opens a dedicated reflection scene, then returns the player to where they left off.

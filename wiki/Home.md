# Supreme CYOA Wiki (Current State)

_Last updated: 2026-04-13 (UTC)_

Welcome to the project wiki for **The Ramayana: Choose Your Adventure**.

This wiki documents the game exactly as it exists in the repository right now, including:

- Story structure and major scene flows
- Core gameplay systems
- Inventory artifacts and lore
- Routing/hash behavior
- File-level architecture for maintenance

## Quick links

- [Game Overview](./Game-Overview.md)
- [Scene & Route Reference](./Scene-and-Route-Reference.md)
- [Developer Guide](./Developer-Guide.md)

## Snapshot

- Current hidden update console marker: **Update 1**
- Main entry page: `index.html`
- Story logic file: `Project.js`
- Styling file: `Project.css`
- Secondary page: `before-the-ramayana.html` (coming soon screen)
- Reference page: `people-of-ramayana.html` (individuals + clans/tribes/kingdoms guide)

## Notes

This wiki is intentionally implementation-aware so future edits can be made safely without breaking scene flow, timeline highlighting, or inventory/trivia systems.

## Features (current)

- Core branching story gameplay across exile, forest, alliance, and rescue/war arcs.
- Scene rendering in `#storyCard` with choice-driven progression through `makeChoice()` and `makeDecision()`.
- Undo history support with Story Card toolbar button.
- Timeline modal with zoom and reveal/highlight of visited nodes and traversed edges.
- Inventory modal with collectible artifacts and lore text.
- Hash-based scene routing (`#scene-<id>`, optional `?timeline=1`) for deep-linking.
- Background music system with track switching between default and rescue campaign themes.
- Extended Scene 55–102 arc covering Hanuman's leap, Lanka reconnaissance, bridge construction, war escalation, and final duel resolution.

# Supreme CYOA Wiki (Current State)

_Last updated: 2026-04-06 (UTC)_

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
- Reference page: `people-of-ramayana.html` (individuals + clans/tribes/kingdoms guide)

## Notes

This wiki is intentionally implementation-aware so future edits can be made safely without breaking scene flow, timeline highlighting, or inventory/trivia systems.

## Features (recent)

- Added a **responsive scene readability pass** with larger scene headings/body text, standardized paragraph spacing, divider-separated sections, stronger button affordances, and a sticky mobile Previous/Next control bar.
- Added a **Story Navigator layer**: Scene counter/progress bar, next/previous controls, keyboard arrow navigation, jump-to-scene/chapter menus, chapter-grouped table of contents, and a jump sidebar with Kanda labels.
- Updated companion dialogue behavior so scenes keep ambient companion flavor text without adding a pause/reflection button to choices.
- Added an **Epic Chronicle linear campaign** (starting after Scene 60) that walks through the Lanka war, Sita's restoration, return to Ayodhya, Uttara Kanda events, final departure, and later traditions in strict chronological order.
- Expanded post-launch Lanka scenes with detailed prose, tactical branching buttons, and a **War Profile** system that tracks morale/mercy/renown and doctrine choices across the war arc.
- Added a **216-code Lanka Special Ending matrix** that resolves at the end of the epic campaign based on accumulated war-profile choices.
- Added a **sequential scene-order guard** for post-legacy scene IDs so new scenes must remain continuous with no skipped IDs beyond Scene 102.
- Added a **People of the Ramayana reference page** with category filtering for key individuals and major groups/kingdoms.

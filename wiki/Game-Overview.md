# Game Overview

## What this project is

**The Ramayana: Choose Your Adventure** is a browser-based, single-page, choice-driven narrative game inspired by the Ramayana.

The story is rendered dynamically by JavaScript and branches by scene ID transitions.

## Core experience

- Player enters a name and starts from Scene 1.
- Scene content is rendered into `#storyCard`.
- Choices transition between scenes via `makeChoice()` / `makeDecision()`.
- Endings can trigger a restart path.
- A timeline modal visualizes explored and possible routes.
- Inventory modal tracks artifact discoveries and lore.

## UI components at a glance

- Sticky top nav with:
  - About link
  - Timeline button
  - Inventory button with item count
  - Background music controls and volume dropdown
- Fixed top-left update badge (`Update 13` currently)
- Intro card + start button
- Story card with Undo button
- Timeline modal with zoom/reveal
- Inventory modal with artifact lore list

## Audio behavior

- Default soundtrack: **Sacred Path Of Rama.mp3**
- Rescue soundtrack: **Lanka Burns At Dawn.mp3**
- Track auto-switches when entering rescue phase scenes.
- Volume dropdown drives actual `<audio>` volume and muted state.

## Routing behavior

Hash-based routes are supported:

- `#scene-<id>`
- `#scene-<id>?timeline=1`
- `#timeline`

On load/hashchange, the app attempts to restore route state if the scene ID is in the routable scene list.

## State model (high-level)

The game tracks:

- Current scene ID and player name
- Scene-specific booleans (e.g., `broughtLakshmana`, `wentAlone`)
- Receipt history (scene summaries + selected choices)
- Undo history snapshots
- Timeline visit/edge history
- Minigame state objects
- Inventory artifact collection
- Story unlock counters (e.g., perfect trivia streak)

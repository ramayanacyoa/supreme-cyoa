# Developer Guide

## Repository structure

- `index.html` — main adventure shell and story container.
- `Project.js` — scene logic, state handling, transitions, and UI behavior.
- `Project.css` — styling and component layout.
- `before-the-ramayana.html` — prequel placeholder page.
- `people-of-ramayana.html` + `people-of-ramayana.js` — people and kingdoms reference page.
- `updates.html` — public release notes.

## Runtime flow

1. `DOMContentLoaded` initializes navigation and audio controls.
2. `startAdventure()` begins scene flow and normalizes volume.
3. `showScene()` renders the active scene to `#storyCard`.
4. Choice handlers move state to the next scene.

## Stability checkpoints

- Scene IDs stay unique and aligned with transition targets.
- `historyStack` supports Undo and storyline recap behavior.
- Shared navbar/audio IDs stay consistent across pages.
- Update tracking stays aligned between console marker and updates content.

# Developer Guide

## Repository structure

- `index.html` — main app shell, navbar audio controls, starter controls, and story card.
- `Project.js` — story engine, scene rendering, transitions, navbar toggle wiring, and soundtrack volume behavior.
- `Project.css` — visual system and component styling.
- `before-the-ramayana.html` — prequel landing page.
- `people-of-ramayana.html` + `people-of-ramayana.js` — people and group reference page.
- `updates.html` — release notes and latest version info.
- Root assets include `ramayana_favicon.ico`, background image, and soundtrack MP3s.

## Runtime flow

1. `DOMContentLoaded` initializes navbar and soundtrack controls.
2. Player clicks Start -> `startAdventure()` sets scene 1 and normalizes volume to 50%.
3. `showScene()` renders the current scene to `#storyCard`.
4. Choice button click updates state and loads the next scene.

## Key systems you should not break

### 1) Scene rendering and transitions

- Keep scene IDs unique.
- Keep `makeChoice()` transition targets in sync with existing scene IDs.

### 2) Storyline history

- `historyStack` powers Undo and Storyline modal rendering.
- Reset it carefully during restart/start flows.

### 3) Cross-page navbar/audio consistency

- Any navbar change should be mirrored in `index.html`, `before-the-ramayana.html`, `people-of-ramayana.html`, and `updates.html`.
- Maintain shared IDs for audio controls (`backgroundMusic`, `volumeSlider`, `volumeValue`).

### 4) Update tracking

- Hidden console marker is maintained in `Project.js` (`console.log("Update X")`).
- Public release label and details are maintained in `updates.html` and update badges.

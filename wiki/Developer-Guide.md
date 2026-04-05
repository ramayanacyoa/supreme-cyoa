# Developer Guide

## Repository structure

- `index.html` — main app shell, nav, modals, audio UI, starter controls.
- `Project.js` — complete story engine, scene rendering, transitions, timeline, minigames, routing, state management.
- `Project.css` — full visual system and component styling.
- `before-the-ramayana.html` — separate "coming soon" prequel page.
- `favicon_io/` + root image/audio assets.

## Runtime flow

1. `DOMContentLoaded` initializes timeline/inventory hooks, controls, and route application.
2. Player clicks Start -> `startAdventure()` sets scene 1.
3. `showScene()` paints scene markup to `#storyCard`.
4. Choice button click -> `makeChoice()` / `makeDecision()` mutates state and scene.
5. `showScene()` re-renders + timeline/inventory/receipt updates.

## Key systems you should not break

### 1) Scene rendering and transitions

- `showScene()` and `makeChoice()` are tightly coupled by scene IDs.
- Keep scene IDs unique and consistent across both functions.
- New scenes above legacy Scene 102 are now guarded by a strict sequential validator; do not skip IDs.

### 2) Timeline coherence

When changing story flow, update all of:

- `timelineNodeTitles`
- `timelineLevels`
- `timelineEdges`
- (optional but recommended) `routableSceneIds`

### 3) Route restoration

- Hash parser supports scene and timeline-open state.
- If route support is expected for new scenes, include IDs in routable list.

### 4) Receipt generation

`makeReceipt()` currently renders receipt card only for selected scene IDs.
If you introduce new ending/final nodes, consider whether they should generate receipts.

### 5) Inventory + lore

- Add new artifact names to `artifactLoreCatalog`.
- Ensure acquisition points call `addArtifact("...")`.

## Current known implementation notes

- `updatePlayerStatsCard()` and `closePlayerStatsModal()` are stubs (no-op).
- `makeDecision()` handles part of Part 2 progression alongside `makeChoice()`.
- Timeline edge labels are remapped to destination scene titles at runtime.
- Audio starts muted by default and relies on user interaction for reliable autoplay.

## Contribution checklist for future scene additions

- [ ] Add new `showScene()` branch
- [ ] Add transitions in `makeChoice()` or `makeDecision()`
- [ ] Add/update timeline titles/levels/edges
- [ ] Add scene to `routableSceneIds` if hash routing needed
- [ ] Update any ending receipt trigger logic
- [ ] If artifact-related, define lore and add pickup logic

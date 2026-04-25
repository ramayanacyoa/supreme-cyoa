# Features

_Last updated: 2026-04-25 (UTC)_

This page lists the live, player-facing features currently present in the project.

## 1) Story and branching

- Multi-scene CYOA structure with branching outcomes.
- Route identity changes based on earlier decisions.
- Multiple restart-capable endings.
- Dialogue blocks for key character moments.

## 2) Personalization

- Custom names for player and family.
- Canonical fallback names when inputs are blank.
- Optional family setup toggle.
- Dynamic pronoun support for sibling selections.
- Runtime placeholder interpolation in story text.
- Character-name highlighting inside scene content.

## 3) Choice logic and chance systems

- Runtime flags preserve route context.
- Randomized outcomes in selected scenes.
- Explicit restart flow for replayability.

## 4) Story UI

- Scene rendering into `#storyCard` with title, narrative, dialogue, and choices.
- Undo via decision history stack.
- **My Storyline** modal recap of visited scenes.

## 5) Navigation and pages

- Shared responsive navbar pattern.
- Core pages:
  - `index.html`
  - `updates.html`
  - `before-the-ramayana.html`
  - `people-of-ramayana.html`

## 6) Audio continuity

- Navbar soundtrack controls.
- Cross-page volume/playback persistence.
- Volume normalization at adventure start.

## 7) People reference page

- Character and kingdom catalog cards.
- Category filters (all, individuals, kingdoms).
- External reference links.
- Scroll-reveal card animations.

## 8) Updates and release communication

- Public update badges on pages.
- Dedicated `updates.html` release notes panel.
- Hidden console update marker for internal tracking.

## 9) Accessibility and resilience

- Semantic/ARIA support in key controls.
- Input guidance for setup defaults.
- Graceful fallbacks for optional browser features.

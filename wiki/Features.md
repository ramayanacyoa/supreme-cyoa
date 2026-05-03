# Features

_Last updated: 2026-05-03 (UTC)_

This page now includes both **live features** and a **comprehensive systems expansion blueprint** for the next major evolution of the Ramayana RPG.

---

## A) Live features currently in project

### 1) Story and branching
- Multi-scene CYOA structure with branching outcomes.
- Route identity changes based on earlier decisions.
- Multiple restart-capable endings.
- Dialogue blocks for key character moments.
- Extended campaign continuation from forest arc through Lanka war and Uttara Kanda endings.
- Longer scene cadence with day/night progression pacing.
- Hero-specific opening scenes for Lakshmana, Bharata, Ravana, and Sita perspectives.

### 2) Personalization
- Custom player name input on the start card.
- Playable hero selection: Rama (classic), Lakshmana, Bharata, Ravana, or Sita.
- Canonical fallback names when inputs are blank.
- Dynamic pronoun support for sibling selections.
- Runtime placeholder interpolation in story text.
- Character-name highlighting inside scene content.

### 3) Choice logic and chance systems
- Runtime flags preserve route context.
- Randomized outcomes in selected scenes.
- Toggle between in-game luck and real-life day/night influenced luck.
- Explicit restart flow for replayability.
- Random-encounter style stat growth choices in campaign expansion scenes.

### 4) Story UI
- Scene rendering into `#storyCard` with title, narrative, dialogue, and choices.
- Undo via decision history stack.
- **My Storyline** modal recap of visited scenes.
- New **Stats** modal for RPG combat attributes (Strength, Defense, Speed, Agility, Stamina, Endurance).
- New **Settings** and **Account** controls in the story toolbar.
- Save snapshots include account profile + world simulation clock for persistent continuity.

### 5) Navigation and pages
- Shared responsive navbar pattern.
- Complex scene URL routing with deep links via query params and hash anchors.
- Browser back/forward scene restoration through history state handling.
- Core pages:
  - `index.html`
  - `updates.html`
  - `before-the-ramayana.html`
  - `people-of-ramayana.html`

### 6) Audio continuity
- Navbar soundtrack controls.
- Cross-page volume/playback persistence.
- Volume normalization at adventure start.

### 7) People reference page
- Character and kingdom catalog cards.
- Category filters (all, individuals, kingdoms).
- External reference links.
- Scroll-reveal card animations.

### 8) Updates and release communication
- Public update badges on pages.
- Dedicated `updates.html` release notes panel.
- Hidden console update marker for internal tracking.

### 9) Accessibility and resilience
- Semantic/ARIA support in key controls.
- Input guidance for player-name defaults.
- Graceful fallbacks for optional browser features.

### 10) Living world simulation (new)
- Realtime and offline world passage simulation with story phase progression.
- Sleep action that triggers Slumberland dream outcomes.
- Added player stats for **Wisdom** and **Knowledge**.
- Added Travel Encounters pool (Sage, Old Man, Poor Family, Demon, Hunting Ground, Merchant, Village) that can boost Wisdom/Knowledge.
- Removed AI continuation feature to keep all progression deterministic and simulation-based.

---

## B) Major systems expansion blueprint (Ramayana RPG 2.0)

## 1) Living Affection Web (Companion Relationship 2.0)

### Function
A persistent relationship graph where each companion (Lakshmana, Hanuman, Sugriva, Vibhishana, etc.) tracks:
- `affection` (bond warmth),
- `trust` (reliability under pressure),
- `respect` (martial/leadership regard),
- `alignment` (agreement with the player’s dharma path),
- `strain` (recent unresolved conflict).

### Purpose
Transform companions from static bonuses into strategic narrative actors.

### Integration
- **Threshold unlocks**:
  - Tier I bond: camp dialogue branches and passive buffs.
  - Tier II bond: duo combat abilities (e.g., Rama–Hanuman aerial assault).
  - Tier III bond: loyalty lock that prevents betrayal triggers.
- **Conflict states**:
  - Low trust + high strain can trigger defiance, delayed orders, or temporary party exit.
- **Story impact**:
  - Companion stance modifies council scenes, mission offers, battle reinforcements, and ending slides.
- **AI impact**:
  - Enemies target weak-link companions when strain is visible in battle.

## 2) Evolving Personality Matrix (Trait Engine)

### Function
Choices continuously adjust core latent traits:
- `dharma`, `aggression`, `compassion`, `strategy`, `honor`.

Traits are never binary; they drift over time with momentum and decay.

### Purpose
Make roleplay identity mechanical, persistent, and testable across every major system.

### Integration
- **Combat modifiers**:
  - High strategy: better initiative and illusion detection.
  - High aggression: burst damage but vulnerability to bait mechanics.
  - High compassion: stronger protective and healing effects.
- **Story branching**:
  - Trait gates unlock different diplomatic, intimidating, or sacrificial choices.
- **Enemy behavior**:
  - Bosses analyze dominant trait and adapt phase scripts.
- **Illusion resistance**:
  - Dharma + strategy jointly counter maya-heavy enemy patterns.
- **Companion reaction model**:
  - Each ally has trait preferences shaping affection growth rates.
- **Ending architecture**:
  - Multi-axis ending evaluation uses trait profile + world-state + loyalty outcomes.

## 3) Unified Consequence Engine

### Function
A rule-based evaluation layer that listens to affection thresholds, traits, quest outcomes, and faction control.

### Purpose
Prevent siloed systems; ensure one decision ripples through combat, camp, world map, and ending logic.

### Integration
- Scenario “if/then packets” execute globally (dialogue swaps, enemy roster changes, alliance shifts).
- Supports delayed consequences (e.g., mercy shown in Act 1 returns as aid in Act 4).

## 4) JSON Save/Load State Capsule (Cross-Device Persistence)

### Function
Export/import full deterministic run state as JSON file.

### Required payload
- `meta`: version, build, timestamp, checksum.
- `player`: level, stats, equipment, learned skills.
- `traits`: full personality matrix + drift momentum.
- `companions`: affection/trust/respect/alignment/strain + unlock tiers.
- `inventory`: currencies, materials, relics, consumables.
- `world`: chapter, region control, unlocked hubs, camp upgrades.
- `quests`: active/completed/failed + branching flags.
- `combat`: boss phases cleared, enemy intel, challenge modifiers.
- `history`: visited scenes, choices, RNG seeds, timeline receipts.
- `events`: daily/weekly event state and claim flags.
- `settings`: audio/UI/accessibility preferences.

### Purpose
Allow exact restoration of game state across browsers and devices.

### Integration
- **Deterministic replay mode** uses saved seeds to reproduce outcomes.
- **Version migration** maps old save schema to latest schema.
- **Safety**: checksum + validation to detect corruption/tampering.

## 5) Dharma Sabha Console (Game Master / Sandbox Director)

### Function
An in-world “council simulation” interface for advanced control, framed as divine foresight instead of a cheat menu.

### Capabilities
- Modify any tracked variable (traits, affection, resources, flags).
- Trigger scenes/events/quests directly.
- Simulate alternative branch outcomes in a sandbox timeline.
- Force boss phases, test AI scripts, or spawn custom encounters.
- Unlock codex entries, companions, and challenge tiers for QA/replay.

### Purpose
Enable rapid balancing, debugging, and high-replay experimentation.

### Integration
- Writes actions to an **audit log** stored in save JSON.
- Supports “forked timeline” mode so test manipulations do not overwrite canonical run unless promoted.

## 6) Ayodhya Camp & Kingdom Progression

### Function
A persistent hub progression system (war room, forge, temple, scout tower, healer enclave).

### Purpose
Provide macro-progression and strategic pacing between narrative arcs.

### Integration
- Buildings unlock systems: crafting recipes, intelligence reports, trait training rituals, relationship events.
- Camp morale modifies affection growth and battle starting buffs.
- Territory control affects available resources and side quests.

## 7) Character Recruitment, Roles, and Ascension

### Function
Collectible companion system adapted to lore-faithful allies and factions.

### Purpose
Increase roster depth while preserving narrative coherence.

### Integration
- Unit roles: Vanguard, Archer, Mystic, Guardian, Trickster, Healer.
- Duplicate-bond conversion: extra shards strengthen personal quests rather than gacha-only inflation.
- Ascension nodes require both materials and relationship milestones.

## 8) Resource Economy and Sacred Crafting

### Function
Interlocked currencies and materials:
- Dharma Sigils, Forest Herbs, Vanara Iron, Astras Fragments, Temple Offerings.

### Purpose
Create long-term progression loops and meaningful spending decisions.

### Integration
- Crafting quality depends on strategy trait + forge level.
- Compassion trait can unlock nonviolent resource alternatives.
- Companion specialties reduce crafting cost/time.

## 9) Combat 2.0: Tactical Layers, AI, and Multi-Phase Bosses

### Function
Upgrade combat with initiative lanes, positioning influence, reaction chains, and aura zones.

### Purpose
Deliver modern system-heavy encounters while retaining mythological flavor.

### Integration
- Enemy AI profiles counter dominant player habits.
- Multi-phase bosses evolve mechanics using story context (e.g., illusion, rage, celestial invocation).
- Affection-based combo ultimates and rescue interrupts.
- Trait-driven resistance checks against fear, illusion, and corruption effects.

## 10) Quest Web: Mainline, Companion, and World Missions

### Function
Layered quest architecture:
- Epic main arcs,
- Character loyalty quests,
- Region contracts,
- Time-limited event missions.

### Purpose
Balance narrative urgency with optional depth and replay branches.

### Integration
- Quest outcomes feed affection shifts and trait adjustments.
- Failure states remain canon and can open alternate content instead of hard dead-ends.

## 11) Live-Ops Inspired Seasonal Systems

### Function
Daily rituals, rotating challenge shrines, weekly raid bosses, and seasonal myth events.

### Purpose
Maintain long-tail engagement and repeatable challenge cycles.

### Integration
- Event choices can nudge permanent traits and companion rapport.
- Save JSON stores event participation, leaderboards snapshot, and reward claims.

## 12) Presentation and Narrative Delivery Upgrade

### Function
Cinematic transitions, portrait emotion states, voiced mantra cues, layered dialogue windows, and council debate scenes.

### Purpose
Improve emotional readability and narrative immersion.

### Integration
- Dialogue lines dynamically vary by affection tier, trait profile, prior betrayals, and quest outcomes.
- Timeline recap visualizes cause-and-effect chain from major decisions.

## 13) Endgame and Multi-Ending Framework

### Function
A weighted resolution model combining:
- Trait profile,
- Companion loyalty web,
- World stability,
- Boss outcomes,
- Key moral decisions.

### Purpose
Deliver substantially different endings and post-credits world states.

### Integration
- New Game+ imports partial progression (codex knowledge, selected bonds, unlocked sandbox tools).
- Optional “Fate Divergence” starts at chapter anchors with preserved character memory markers.

## 14) Analytics, Telemetry, and Balancing Hooks (Internal)

### Function
Opt-in instrumentation for completion rates, branch frequency, boss fail points, and affection trajectory patterns.

### Purpose
Support ongoing balance and narrative tuning.

### Integration
- Dharma Sabha Console can replay anonymized scenario bundles for regression testing.
- Save schema includes anonymized debug tags for internal QA exports.

---

## C) System interaction map (unified loop)

1. **Player choice** changes traits and companion metrics.  
2. **Trait + affection state** modifies available dialogue, quest offers, and combat tools.  
3. **Quest/battle outcomes** alter world progression, camp resources, and loyalty status.  
4. **World/camp state** unlocks new upgrades, events, and encounter variants.  
5. **All state** persists in JSON save capsule and can be replayed, migrated, or sandbox-tested.  
6. **Endings** resolve from cumulative state rather than isolated binary choices.

This architecture ensures every feature reinforces the same core fantasy: leading a morally consequential, relationship-driven Ramayana campaign where decisions matter mechanically and narratively across the full lifespan of a run.

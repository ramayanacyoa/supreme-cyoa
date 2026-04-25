# Minigames, Progression, and Unlocks

## Artifact inventory system

- Inventory button shows collected item count.
- Modal lists collected artifacts with lore text from `artifactLoreCatalog`.
- Duplicate pickups are prevented by `addArtifact()`.

## Combat/chance odds

Base challenge odds:

- fight: 70
- fallback: 40

`clampOdds()` limits final odds to 5–95.

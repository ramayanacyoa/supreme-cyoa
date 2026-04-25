# Minigames, Progression, and Unlocks

## Journey Trivia

- Questions are generated from `ramayanaTriviaFacts`.
- Session limit is controlled by `triviaSessionQuestionLimit` (currently 10).
- A session ends after 3 wrong answers or when the question limit is reached.
- Perfect sessions increase `perfectTriviaSessionsInRow`.
- At 20 perfect sessions in a row, `dasharathaStoryUnlocked` becomes true.

## Guessing Game (Scene 93)

- Uses `ramayanaGuessPool` entries (`answer`, `type`, and clue list).
- Wrong guesses reveal additional clues.
- Correct guesses increase solved count and start a new round.

## Storytelling Game (Scenes 99–100)

- Uses `storytellingQuestions` entries (prompt, keywords, model answer).
- Scoring checks keyword matches in free-text responses.
- Results show feedback with a model answer.

## Ally Conversations / Training (Scene 77)

Available allies:

- Hanuman
- Sugriva
- Lakshmana
- Angada

Conversation includes tone-based replies and optional sparring. Sparring outcomes are chance-based with per-character modifiers.

## Ocean Exploration (Scenes 101–102)

Regions:

- Shoals of Setubandha
- Skies Above Lanka
- Ashoka Garden Paths

Each expedition chooses a region, grants one random artifact from that pool, and records it in inventory without duplicates.

## Artifact inventory system

- Inventory button shows collected item count.
- Modal lists collected artifacts with lore text from `artifactLoreCatalog`.
- Duplicate pickups are prevented by `addArtifact()`.

## Combat/chance odds

Base challenge odds:

- fight: 70
- journeyTrivia: 50
- guessing: 35
- fallback: 40

`clampOdds()` limits final odds to 5–95.

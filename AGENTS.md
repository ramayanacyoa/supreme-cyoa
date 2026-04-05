# Repository Instructions

## Update Badge Rule
- For every new code update, increment the top-left update badge number by exactly +1 (for example: `Update 1`, `Update 2`, `Update 3`, ...).
- If the user provides session-specific instructions that conflict with this rule, follow the user’s session-specific instructions.

## Scene Routing Rule
- If any new scenes are added, update URL routing to include routes for the new scenes.

## Update Timeline and Receipt Scenes Rule
- If any new scenes are added, update the timeline and receipts for the new scenes.

## Versioning Rule
- Current release tag/version: `1.0.0-alpha`.
- Stay in `alpha` type/stage until the user explicitly changes the type.
- Always confirm with the user before changing the version.
- Version scheme: `major.minor.patch-type`.
  - Minor changes increase `patch`.
  - Feature updates increase `minor` and reset patch to `0`.
  - Major updates increase `major` and reset minor/patch to `0`.

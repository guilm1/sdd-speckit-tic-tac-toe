# Contract: localStorage Persistence

**Feature**: 001-tic-tac-toe | **Date**: 2026-05-28

Defines the client-side persistence contract. There is no network API; the only external interface
is the browser `localStorage` key the app owns.

## Key

| Key | Purpose | Lifetime |
|-----|---------|----------|
| `ttt:state:v1` | The current in-progress game state | Until overwritten by a new move/reset or cleared by the user/browser |

> `high scores` are intentionally NOT defined in this iteration. If added later, use a separate key
> `ttt:scores:v1` and amend the spec first.

## Value schema (JSON)

```json
{
  "board": ["X" | "O" | null, ... 9 items],
  "currentPlayer": "X" | "O",
  "status": "in_progress" | "won" | "draw",
  "winner": "X" | "O" | null,
  "winningLine": [number, number, number] | null
}
```

## Operations (module: `storage.js`)

### `loadState(): Game | null`

- Reads `ttt:state:v1`.
- Returns a valid `Game` object **only if** the parsed value passes validation:
  - `board` is an array of length 9, each item is `"X"`, `"O"`, or `null`
  - `currentPlayer` is `"X"` or `"O"`
  - `status` is one of `"in_progress"`, `"won"`, `"draw"`
  - `winner`/`winningLine` consistent with `status`
- Returns `null` (caller starts a fresh game) if the key is missing, JSON is malformed, or validation
  fails. MUST NOT throw on corrupted data.

### `saveState(game: Game): void`

- Serializes the `Game` object to JSON and writes it to `ttt:state:v1`.
- MUST handle a thrown quota/availability error gracefully (e.g., private-mode restrictions): the
  game continues to function in-memory; persistence simply no-ops on failure.

### `clearState(): void`

- Removes `ttt:state:v1` (or writes a fresh game). Used on reset if not persisting the fresh game.

## Behavioral guarantees

- Loading a corrupted or absent value NEVER breaks the app — it falls back to a new game.
- Writing failures NEVER break the app — gameplay is unaffected, only persistence is skipped.
- The schema is versioned (`:v1`) so future changes can migrate or discard old data safely.

# Data Model: Tic-Tac-Toe Game

**Feature**: 001-tic-tac-toe | **Date**: 2026-05-28 | **Phase**: 1 (Design)

The app is client-only with trivial, in-memory state mirrored to `localStorage`. There is no
database and no server-side model. Entities below describe the in-memory shapes and the persisted
shape.

## Entities

### Game (state object)

The single source of truth for an active play session.

| Field | Type | Description | Validation / Rules |
|-------|------|-------------|--------------------|
| `board` | `Array<Cell>` length 9 | Cells in row-major order, indices 0–8 | Exactly 9 elements; each is `null`, `"X"`, or `"O"` |
| `currentPlayer` | `"X" \| "O"` | Whose turn it is | `"X"` on a new game; alternates after each valid move |
| `status` | `"in_progress" \| "won" \| "draw"` | Lifecycle state of the game | Derived after each move |
| `winner` | `"X" \| "O" \| null` | Winning player when `status === "won"` | `null` unless `status === "won"` |
| `winningLine` | `Array<number> \| null` | The 3 indices forming the win (for highlight) | `null` unless `status === "won"` |

### Cell

A single grid position.

| Value | Meaning |
|-------|---------|
| `null` | Empty / selectable |
| `"X"` | Occupied by player X |
| `"O"` | Occupied by player O |

### Player

Not a stored entity — a player is represented purely by the symbol `"X"` or `"O"`. X always moves
first.

## Board indexing & winning lines

Cells are indexed 0–8 in row-major order:

```text
 0 | 1 | 2
---+---+---
 3 | 4 | 5
---+---+---
 6 | 7 | 8
```

The eight winning lines (used for win detection and `winningLine`):

```text
Rows:      [0,1,2] [3,4,5] [6,7,8]
Columns:   [0,3,6] [1,4,7] [2,5,8]
Diagonals: [0,4,8] [2,4,6]
```

## State transitions

```text
        new game / reset
              │
              ▼
        in_progress ──── applyMove(emptyCell) ──▶ in_progress   (turn alternates X↔O)
              │
              ├── applyMove completes a winning line ──▶ won (winner set, winningLine set)
              │
              └── applyMove fills last empty cell, no line ──▶ draw

   won  ── applyMove(any) ──▶ (no change; input ignored)
   draw ── applyMove(any) ──▶ (no change; input ignored)
   won/draw/in_progress ── reset() ──▶ in_progress (empty board, currentPlayer = "X")
```

### Transition rules (map to spec FRs)

- `applyMove(state, index)`:
  - Ignored (returns state unchanged) if `status !== "in_progress"` (FR-007) or if `board[index]` is
    not `null` (FR-004).
  - Otherwise sets `board[index] = currentPlayer`, then:
    - If `currentPlayer` now occupies any winning line → `status = "won"`, `winner = currentPlayer`,
      `winningLine = <that line>` (FR-005). Win takes precedence over a full board.
    - Else if no `null` cells remain → `status = "draw"` (FR-006).
    - Else `currentPlayer` flips `"X" ↔ "O"` (FR-003).
- `reset(state)`: returns a fresh game — empty board, `currentPlayer = "X"`, `status =
  "in_progress"`, `winner = null`, `winningLine = null` (FR-009, FR-010).

## Persisted shape (localStorage)

Stored under key `ttt:state:v1` as JSON. Only the in-progress game state is persisted (see
`research.md` → Persistence scope; high scores are out of scope for this iteration).

```json
{
  "board": [null, "X", null, null, "O", null, null, null, null],
  "currentPlayer": "X",
  "status": "in_progress",
  "winner": null,
  "winningLine": null
}
```

**Read rules**: On load, parse the key; if missing, malformed, or failing shape validation (wrong
length, invalid symbols), discard it and start a fresh game. **Write rules**: persist after every
state change; clearing/reset writes a fresh game (or removes the key).

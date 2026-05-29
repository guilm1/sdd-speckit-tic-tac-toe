# Data Model: Game Modes & Branded Theme

**Feature**: 002-game-modes-theme | **Date**: 2026-05-28 | **Phase**: 1 (Design)

This feature adds UI/mode state and a pure opponent function on top of feature 001's game state. The
core `Game` shape (board, currentPlayer, status, winner, winningLine) is unchanged.

## Entities

### Game Mode (UI state)

| Field | Type | Description | Rules |
|-------|------|-------------|-------|
| `mode` | `"two-player" \| "vs-computer"` | Selected play style | Defaults to `"two-player"`; changing it resets the game (FR-011) |

Mode is held in the controller (`src/main.js`), **not** inside the pure `Game` object, so `game.js`
stays mode-agnostic.

### Computer Opponent (behavior, not stored)

Represented by a pure function rather than stored data:

```text
chooseComputerMove(board, computerSymbol) -> number   // a valid empty cell index 0..8
```

- Input: the current 9-cell board and the computer's symbol (`"O"` in this iteration).
- Output: the index of the cell the computer will mark.
- Pure: no DOM, no randomness, no timers — same input always yields the same output.
- Precondition: called only when the game is in progress and at least one cell is empty.

### Game (from feature 001 — unchanged)

`{ board[9], currentPlayer, status, winner, winningLine }` as defined in
`specs/001-tic-tac-toe/data-model.md`. Both human and computer moves go through the existing
`applyMove(state, index)`.

## Computer move selection rules

Given `board` and `computerSymbol` (and the derived `opponentSymbol`):

1. **Win**: for each empty cell, if placing `computerSymbol` there completes a line → choose it.
2. **Block**: else for each empty cell, if placing `opponentSymbol` there would complete a line →
   choose that cell to block.
3. **Positional**: else choose by preference order — center (4), then corners (0, 2, 6, 8), then sides
   (1, 3, 5, 7) — first available in that order.
4. **Tie-break**: within the same priority, the lowest cell index wins (deterministic).

This guarantees the opponent never ignores an immediate win or an immediate threat (SC-002) while
remaining simple and deterministic.

## Mode / turn flow (vs-computer)

```text
human clicks empty cell (mode = vs-computer, human = X)
        │
        ▼
applyMove(state, clickedIndex)
        │
        ├── status != in_progress  → render result; STOP (no computer move)
        │
        └── status == in_progress  → lock input
                  │
                  ▼
            index = chooseComputerMove(board, "O")
            applyMove(state, index)   // computer = O
                  │
                  ▼
            render; unlock input (if still in progress)
```

In **two-player** mode the computer step is skipped entirely; turns alternate between two humans as in
feature 001.

## State transitions (mode)

```text
two-player ──select "Vs Computer"──▶ vs-computer   (board reset to fresh game, X to move)
vs-computer ──select "Two Player"──▶ two-player    (board reset to fresh game, X to move)
either mode ──Reset──▶ fresh game in the SAME mode
```

## Persistence

No new required persistence. The existing `ttt:state:v1` game-state key (feature 001) is unchanged.
Persisting the selected `mode` across reloads is optional and not required for acceptance.

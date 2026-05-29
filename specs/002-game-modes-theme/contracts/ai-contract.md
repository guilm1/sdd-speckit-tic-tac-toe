# Contract: Computer Opponent

**Feature**: 002-game-modes-theme | **Date**: 2026-05-28

The opponent is a pure function in `src/ai.js`. This is the testable contract for the computer's
behavior.

## Function

```text
chooseComputerMove(board: Array<'X'|'O'|null>, computerSymbol: 'X'|'O') -> number
```

## Preconditions

- `board` is a length-9 array; at least one element is `null` (an empty cell exists).
- The game is in progress (no existing winning line). Callers ensure this.

## Postconditions / guarantees

1. **Legal**: the returned index refers to a currently empty cell (`board[index] === null`).
2. **Win-taking**: if any single move with `computerSymbol` completes a winning line, the function
   returns such a cell.
3. **Blocking**: else, if the opponent has a single move that would complete a winning line, the
   function returns that cell (blocking it).
4. **Positional fallback**: else, the function returns the first available cell in preference order
   center → corners → sides.
5. **Deterministic**: same `(board, computerSymbol)` always returns the same index; ties resolve to the
   lowest index. No randomness, no DOM, no timers.

## Examples

| Board (row-major) | computerSymbol | Expected | Why |
|-------------------|----------------|----------|-----|
| `O O _ / _ X _ / _ _ X` | `O` | `2` | Completes top row → win |
| `X X _ / _ O _ / _ _ _` | `O` | `2` | Blocks X's top-row win |
| empty board | `O` | `4` | Center preferred when no win/threat |
| `X _ _ / _ _ _ / _ _ _` | `O` | `4` | Center preferred |

## Test surface

`tests/unit/ai.test.js` covers: win-take (across multiple lines), block (across multiple lines),
center/corner/side preference, legality (never returns an occupied cell), and determinism.

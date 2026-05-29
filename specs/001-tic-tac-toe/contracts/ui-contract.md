# Contract: UI Behavior

**Feature**: 001-tic-tac-toe | **Date**: 2026-05-28

Defines the user-facing interface contract for the single-screen app. This is the "contract" for a
UI application (per the plan template): what the user sees and how it responds.

## Surfaces

| Element | Role | Accessibility |
|---------|------|---------------|
| Board (3x3) | Nine selectable cells, indices 0–8 | Each cell is a focusable `<button>` with `aria-label` describing its position and occupant; disabled when occupied or game over |
| Status message | Communicates turn or outcome at all times | Rendered in an `aria-live="polite"` region so updates are announced |
| Reset button | Starts a fresh game | Labeled `<button>` (e.g., text "Reset"); always enabled |

## States (all must be handled — UX Consistency principle)

| State | Board | Status message (example copy) |
|-------|-------|-------------------------------|
| New / empty | All cells empty and selectable | "X's turn" |
| In progress | Some cells marked; empty cells selectable | "X's turn" / "O's turn" (next player) |
| Won | Winning line highlighted; all cells locked | "X wins!" / "O wins!" |
| Draw | All cells filled; locked | "It's a draw" |

There is no async loading or remote error state (offline, client-only). A corrupted persisted state
is handled silently by starting a new game (see storage contract).

## Interactions

1. **Select empty cell (in progress)** → cell shows current player's symbol; status updates to the
   next player's turn (or to a win/draw if the move ends the game). Response < 100ms.
2. **Select occupied cell** → no change; turn unchanged (FR-004).
3. **Select any cell after game over** → no change (FR-007).
4. **Press Reset (any time)** → board clears, status returns to "X's turn", game becomes playable
   (FR-009, FR-010).
5. **Keyboard**: cells are reachable by Tab and activatable by Enter/Space; Reset likewise.

## Visual / consistency rules

- A single styling source of truth (one stylesheet or one utility system) governs all elements.
- X and O are distinguishable by glyph/text, not by color alone (contrast ≥ 4.5:1).
- Layout is clean and minimal: only the board, the status message, and the Reset control are present
  (FR-011) — no extraneous chrome.

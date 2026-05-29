# Contract: UI Behavior (Modes & Theme)

**Feature**: 002-game-modes-theme | **Date**: 2026-05-28

Extends feature 001's UI contract with a mode selector, computer-turn behavior, the purple light
theme, and the purp logo. Board, status, and Reset behaviors from feature 001 still apply.

## New / changed surfaces

| Element | Role | Accessibility |
|---------|------|---------------|
| Logo | purp brand mark near the title | `<img>` with `alt="purp"`; app stays usable if it fails to load |
| Mode selector | Choose "Two Player" or "Vs Computer" | Labeled control (e.g., radio group or segmented buttons); keyboard operable; selected option exposed to assistive tech |
| Board | Unchanged from 001; locked during computer's turn in vs-computer mode | Cells remain focusable buttons; disabled while computer move pending |
| Status | Communicates turn/outcome, appropriate to mode | `aria-live="polite"` region (from 001) |

## Modes

| Mode | Behavior |
|------|----------|
| Two Player (default) | Local hot-seat; two humans alternate; no automatic moves |
| Vs Computer | Human is X (first); computer is O; after each in-progress human move the computer moves automatically; input locked until the computer responds |

## Interactions

1. **Select a mode** → the board resets to a fresh game in that mode; status shows the starting turn.
2. **Vs Computer, human marks an empty cell (game continues)** → board locks, computer marks a cell,
   board unlocks; response feels immediate (<100ms).
3. **Vs Computer, human's move ends the game** → result is announced; computer does not move.
4. **Click during the computer's pending turn** → ignored (FR-007).
5. **Reset (either mode)** → fresh game in the current mode.
6. **Two Player** → behaves exactly as feature 001.

## States (all handled)

| State | Status message (example) |
|-------|---------------------------|
| New game (two-player) | "X's turn" |
| New game (vs-computer) | "Your turn" (or "X's turn") |
| Computer's turn (vs-computer) | board locked; brief "Computer's turn" indication acceptable |
| Won | "X wins!" / "O wins!" (or "You win!" / "Computer wins!" in vs-computer) |
| Draw | "It's a draw" |

## Theme & branding rules

- A single default **purple light** theme: light background/surfaces, purple primary accent — defined
  via CSS variables in the single `src/styles.css` (no second styling source).
- X/O marks, status text, the mode selector, and the Reset button MUST keep ≥4.5:1 contrast.
- The purp logo is displayed prominently (header/title area) and sized so the layout stays clean
  and minimal (FR-013, FR-011 of 001 style consistency).
- Marks remain distinguishable by glyph, not color alone.

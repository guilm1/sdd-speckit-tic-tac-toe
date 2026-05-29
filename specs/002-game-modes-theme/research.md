# Research: Game Modes & Branded Theme

**Feature**: 002-game-modes-theme | **Date**: 2026-05-28 | **Phase**: 0 (Outline & Research)

Decisions for adding a computer opponent, a mode selector, and a branded purple light theme on top of
feature 001. Format: Decision → Rationale → Alternatives considered.

## 1. Computer opponent strategy

**Decision**: Implement a pure function `chooseComputerMove(board, computerSymbol)` returning a cell
index, using a deterministic priority heuristic:
1. If a move wins immediately, take it.
2. Else if the opponent could win next move, block that cell.
3. Else prefer center, then a corner, then any side (a simple, sensible ordering).

**Rationale**: The spec requires a *competent* opponent (never ignores an immediate win/threat) but
explicitly scopes out selectable difficulty. This heuristic is tiny, fully deterministic (easy to
unit-test), instant (<100ms over ≤9 cells), and satisfies SC-002. It is not guaranteed perfect
(unbeatable) play, which is acceptable per the spec's single competent difficulty.

**Alternatives considered**:
- *Full minimax (unbeatable)*: Perfectly optimal and still cheap for 3x3, but the spec only asks for a
  competent opponent; minimax can also feel frustratingly unbeatable. Heuristic chosen for simplicity;
  minimax remains an easy future upgrade behind the same function signature.
- *Random legal move*: Simplest, but fails the "never ignore a threat/win" requirement (SC-002).
  Rejected.

## 2. Determinism & tie-breaking

**Decision**: When multiple cells tie at the same priority, pick the lowest index (stable order). Keep
the function pure (no randomness, no timers).

**Rationale**: Determinism makes the opponent unit-testable and reproducible (Testing principle).
A fixed tie-break avoids flaky tests.

**Alternatives considered**:
- *Randomized tie-break for variety*: More natural feel, but introduces non-determinism that
  complicates testing. Deferred; could be added later with an injectable RNG seed.

## 3. Mode state & turn orchestration

**Decision**: Track `mode` ("two-player" | "vs-computer") as UI state in `src/main.js`. In vs-computer
mode, after a human move that leaves the game in progress, invoke the computer move and re-render.
Lock the board (ignore clicks) while the computer's move is pending. Changing mode calls `reset()`.

**Rationale**: Reuses the existing pure `applyMove` for both human and computer moves; keeps `game.js`
unchanged. Resetting on mode change matches FR-011 and avoids ambiguous mixed-mode states.

**Alternatives considered**:
- *Encode mode inside the game state object*: Would entangle mode with the pure rules core; rejected to
  keep `game.js` mode-agnostic and its tests intact.

## 4. Computer move timing / UX

**Decision**: Apply the computer move effectively immediately (optionally a tiny, non-blocking delay
purely for perceived turn-taking). Input remains locked until the computer has moved.

**Rationale**: SC-006 requires the response to feel immediate. Locking input (FR-007) prevents the
human from playing the computer's turn. A short delay is a cosmetic option, not a requirement.

**Alternatives considered**:
- *Noticeable artificial "thinking" delay*: Can feel sluggish; avoided. Keep it instant.

## 5. Purple light theme

**Decision**: Define the theme via CSS custom properties in the existing `src/styles.css` (single
source of truth): a light surface/background with purple as the primary accent (drawn from the purp
brand purple, approximately `#7c3aed`/`#6d28d9` family). Ensure ≥4.5:1 text/control contrast.

**Rationale**: Reuses the existing single stylesheet and CSS-variable approach from feature 001 (UX
consistency). Tokenizing colors keeps the palette consistent and easy to verify for contrast.

**Alternatives considered**:
- *Tailwind CDN*: Allowed by the original constraint, but the project already ships a single CSS file;
  introducing Tailwind now would create a second styling source. Rejected for consistency.
- *Theme switcher (light/dark)*: Out of scope per spec; a single default theme only.

## 6. Logo integration

**Decision**: Reference `public/purp.png` as an `<img>` in the header near the title, with
descriptive `alt` text ("purp"). Constrain its size in CSS. Vite serves `public/` assets at the
site root and inlines/copies them on build.

**Rationale**: Uses the existing asset, gives an accessible text alternative, and degrades gracefully
if the image fails (alt text + title remain) per FR-015.

**Alternatives considered**:
- *CSS background-image*: Loses the `alt` text / accessibility affordance. Rejected in favor of `<img>`.
- *Inlining as base64*: Marginal footprint impact and worse readability; unnecessary. Rejected.

## 7. Single-file build with an image asset

**Decision**: Keep the `vite-plugin-singlefile` build. The PNG remains an external static asset (or is
inlined by the build); either way the JS budget is unaffected and the footprint stays minimal.

**Rationale**: The image is the brand logo and is small; it does not count against the JS budget.

**Alternatives considered**: None needed.

## Summary of resolved unknowns

| Unknown | Resolution |
|---------|------------|
| Opponent strategy | Pure heuristic: win → block → center/corner/side |
| Tie-breaking | Lowest index (deterministic) |
| Mode state location | UI state in `main.js`; `game.js` stays mode-agnostic |
| Mode change behavior | Resets to a fresh game (FR-011) |
| Computer timing | Effectively instant; input locked during its turn |
| Theme | Purple light via CSS variables in the single `styles.css` |
| Logo | `<img>` from `public/purp.png` with alt text |

All clarifications resolved. Ready for Phase 1 design.

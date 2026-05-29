# Implementation Plan: Game Modes & Branded Theme

**Branch**: `002-game-modes-theme` | **Date**: 2026-05-28 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-game-modes-theme/spec.md`

## Summary

Extend the existing Tic-Tac-Toe app (feature 001) with a **game-mode selector** ("Two Player" vs
"Vs Computer"), a **competent computer opponent**, and a **branded purple light theme** featuring the
purp logo. The computer opponent is implemented as a pure, deterministic move-selection function
(win → block → reasonable) so it can be unit-tested. Mode is UI state that resets the board on
change. The theme is applied through the single existing stylesheet (purple palette + legibility),
and the logo is served from the existing `public/purp.png` asset. No backend, no new runtime
dependencies — the existing Vite + vanilla JS toolchain carries over.

## Technical Context

**Language/Version**: JavaScript (ES2022+), HTML5, CSS3 — unchanged from feature 001

**Primary Dependencies**: Vite (build/dev) + `vite-plugin-singlefile`; zero runtime framework deps.
No new dependencies introduced by this feature.

**Storage**: Browser `localStorage` (existing). Selected mode is in-memory UI state; persisting it is
optional (not required for acceptance).

**Testing**: Vitest + jsdom (existing). New deterministic unit tests for computer move selection and
mode transitions.

**Target Platform**: Modern evergreen browsers (latest 2 versions)

**Project Type**: Single-page web application (frontend only) — extends the existing structure

**Performance Goals**: Computer responds within 100ms of the human's move (feels instant); overall
interaction latency < 100ms; 60fps. The logo is a static image asset (~9 KB) loaded once.

**Constraints**: Preserve the minimal footprint and single-file production build. Shipped JS budget
remains ≤ 30 KB minified (the computer-AI logic is tiny). The logo ships as a static asset referenced
by the HTML/CSS. No backend, no database, no runtime framework.

**Scale/Scope**: One screen, two modes, one active game. Trivial data and compute (search space is at
most 9 cells). Single user vs computer, or two local users.

### Reuse from feature 001

- `src/game.js` pure logic (board, applyMove, win/draw, reset, statusMessage) — reused as-is
- `src/storage.js`, `src/main.js`, `src/styles.css`, `index.html` — extended, not rewritten
- Existing Vitest/ESLint/Prettier/Vite config — reused

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Gates derived from `.specify/memory/constitution.md` v1.0.0:

| Principle | Gate | Status |
|-----------|------|--------|
| I. Code Quality | Lint/format zero errors; small single-responsibility modules; review | PASS — computer AI isolated in a new pure module `src/ai.js`; mode handling kept cohesive in `src/main.js` |
| II. Testing Standards | Deterministic automated tests; CI gate; critical paths covered | PASS — `ai.js` is pure (board → index), fully deterministic; tests cover win-take, block, and reasonable-move; mode-reset tested |
| III. UX Consistency | Single styling source of truth; consistent interactions; all states; WCAG AA | PASS — theme via the single `styles.css`; mode selector and logo follow existing patterns; loading/turn/win/draw states handled incl. "computer thinking"; AA contrast verified on purple theme |
| IV. Performance Requirements | Declared, measured budgets; no unjustified regressions | PASS — AI is O(1) over ≤9 cells, well under 100ms; JS budget unchanged ≤30 KB; logo is a one-time static asset |

**Initial Constitution Check: PASS.** No violations. The computer opponent is deliberately a pure
function to satisfy testability; the theme reuses the single styling source to avoid drift.

## Project Structure

### Documentation (this feature)

```text
specs/002-game-modes-theme/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── ai-contract.md
│   └── ui-contract.md
├── checklists/
│   └── requirements.md  # From /speckit.specify
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root) — additions/edits in **bold**

```text
index.html               # EDIT: add logo + mode selector markup hooks
public/
└── purp.png          # Existing brand logo asset (referenced by the app)
src/
├── main.js              # EDIT: mode state, mode selector wiring, computer-turn orchestration, logo
├── game.js              # REUSE: pure rules (unchanged)
├── ai.js                # NEW: pure computer move selection (win → block → reasonable)
├── storage.js           # REUSE (unchanged)
└── styles.css           # EDIT: purple light theme tokens, logo + mode-selector styles

tests/unit/
├── game.test.js         # REUSE (unchanged)
├── status.test.js       # REUSE (unchanged)
├── storage.test.js      # REUSE (unchanged)
└── ai.test.js           # NEW: computer move selection (win/block/reasonable/legal)
```

**Structure Decision**: Continue the single-project frontend layout from feature 001. The only new
source module is `src/ai.js`, kept pure and DOM-free so the opponent logic is unit-testable
(Testing principle) and separable from rendering (Code Quality principle). Mode orchestration lives
in `src/main.js` (the existing controller). Theme and logo changes are confined to `index.html` and
the single `src/styles.css` (UX single-source-of-truth principle).

## Complexity Tracking

> No constitution violations require justification.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (none)    | —          | —                                   |

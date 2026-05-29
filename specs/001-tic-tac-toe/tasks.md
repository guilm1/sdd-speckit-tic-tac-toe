---
description: "Task list for Tic-Tac-Toe Game implementation"
---

# Tasks: Tic-Tac-Toe Game

**Input**: Design documents from `/specs/001-tic-tac-toe/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test tasks ARE included. The project constitution (Testing Standards, NON-NEGOTIABLE) and
plan.md require deterministic automated tests (Vitest) as the CI merge gate, so they are part of this
feature's definition of done.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- File paths are relative to the repository root

## Path Conventions

Single-project frontend layout (per plan.md):

- App shell: `index.html`
- Source modules: `src/` (`main.js`, `game.js`, `storage.js`, `styles.css`)
- Tests: `tests/unit/`
- Config: `vite.config.js`, `package.json`, ESLint/Prettier config

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and tooling

- [X] T001 Initialize npm project: create `package.json` with scripts (`dev`, `build`, `preview`, `test`, `test:watch`, `lint`, `format`) per `quickstart.md`
- [X] T002 [P] Add Vite + `vite-plugin-singlefile` dev dependencies and create `vite.config.js` configured to emit a single `index.html` + single `main.js` to `dist/`
- [X] T003 [P] Add and configure ESLint + Prettier (zero-error policy) with config files at repo root
- [X] T004 [P] Add and configure Vitest + jsdom (test environment) referenced from `vite.config.js` or `vitest.config.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core shell, shared state model, persistence, and styling that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Create `index.html` app shell with a single `#app` mount point and a module script loading `src/main.js`; clean, minimal markup only
- [X] T006 Create `src/game.js` foundation: row-major board indexing constants, the eight `WINNING_LINES`, and a `createInitialState()` factory returning `{ board[9]=null, currentPlayer:"X", status:"in_progress", winner:null, winningLine:null }` per `data-model.md`
- [X] T007 [P] Create `src/storage.js` with `loadState()` (defensive parse + shape validation, returns null on missing/corrupted), `saveState(game)` (no-op on quota/availability error), and `clearState()` against key `ttt:state:v1` per `contracts/storage-contract.md`
- [X] T008 [P] Create `src/styles.css` as the single styling source of truth: minimal layout, 3x3 grid, cell buttons, status text, Reset button; ensure ≥4.5:1 contrast and X/O distinguishable by glyph not color
- [X] T009 Create `src/main.js` bootstrap: on load call `loadState()` (fallback to `createInitialState()`), set up a render scaffold mounting into `#app`, and a single `render(state)` entry point (board/status/reset placeholders wired in later story phases)

**Checkpoint**: App shell loads, state model and persistence exist, render pipeline is ready

---

## Phase 3: User Story 1 - Play a full game to a result (Priority: P1) 🎯 MVP

**Goal**: Two players alternate marks on the 3x3 grid; the game detects a win (any of 8 lines) or a draw and locks input afterward.

**Independent Test**: Play scripted sequences producing a row win, column win, diagonal win, and a full-board draw; verify the correct outcome each time and that no further moves register.

### Tests for User Story 1

> Write these tests FIRST and ensure they FAIL before implementation.

- [X] T010 [P] [US1] In `tests/unit/game.test.js`, test `applyMove` marks an empty cell with the current symbol and alternates X↔O
- [X] T011 [P] [US1] In `tests/unit/game.test.js`, test illegal moves are ignored: selecting an occupied cell (FR-004) and any selection after game over (FR-007) leave state unchanged
- [X] T012 [P] [US1] In `tests/unit/game.test.js`, test win detection for all 8 winning lines (3 rows, 3 columns, 2 diagonals), setting `status="won"`, `winner`, and `winningLine`
- [X] T013 [P] [US1] In `tests/unit/game.test.js`, test draw detection on a full board with no line, and win-precedence when the last cell completes a line (FR-006, edge case)

### Implementation for User Story 1

- [X] T014 [US1] Implement `applyMove(state, index)` in `src/game.js`: guard clauses (game over / occupied), place mark, evaluate winning lines, then draw, else flip `currentPlayer` per `data-model.md` transitions
- [X] T015 [US1] In `src/main.js`, render the 9 board cells as focusable `<button>` elements with per-cell `aria-label` (position + occupant) per `contracts/ui-contract.md`
- [X] T016 [US1] In `src/main.js`, wire cell activation → `applyMove` → `render` → `saveState`; disable/lock all cells when `status !== "in_progress"`
- [X] T017 [US1] In `src/main.js` + `src/styles.css`, visually highlight the `winningLine` cells when a player wins

**Checkpoint**: A full game is playable to a win or draw and is fully testable on its own (MVP)

---

## Phase 4: User Story 2 - Always know the game state (Priority: P2)

**Goal**: A clear status message always communicates whose turn it is, or the final outcome (winner or draw).

**Independent Test**: Observe the status message on a new game, after each move, after a win, and after a draw; confirm the text matches the actual state.

### Tests for User Story 2

- [X] T018 [P] [US2] In `tests/unit/status.test.js`, test a `statusMessage(state)` helper returns "X's turn"/"O's turn" while in progress, "X wins!"/"O wins!" on win, and "It's a draw" on draw

### Implementation for User Story 2

- [X] T019 [US2] Implement `statusMessage(state)` in `src/game.js` (pure derivation of display text from state)
- [X] T020 [US2] In `index.html` + `src/main.js`, render the status message inside an `aria-live="polite"` region and update it on every `render(state)` call per `contracts/ui-contract.md`

**Checkpoint**: Players can always read the correct turn/outcome; US1 + US2 work together

---

## Phase 5: User Story 3 - Restart at any time (Priority: P3)

**Goal**: A Reset control clears the board and starts a fresh game, both mid-game and after completion.

**Independent Test**: Press Reset during an in-progress game and after a finished game; confirm the grid clears, status returns to "X's turn", and play resumes.

### Tests for User Story 3

- [X] T021 [P] [US3] In `tests/unit/game.test.js`, test `reset()` returns a fresh initial state (empty board, `currentPlayer="X"`, `status="in_progress"`, cleared winner/winningLine) regardless of prior state

### Implementation for User Story 3

- [X] T022 [US3] Implement `reset(state)` in `src/game.js` returning `createInitialState()` (FR-009, FR-010)
- [X] T023 [US3] In `index.html` + `src/main.js`, add a labeled "Reset" `<button>` and wire it to `reset` → `render` → persist (`saveState` fresh game or `clearState`); ensure it works during and after a game

**Checkpoint**: All three user stories are independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Constitution gate verification and final hardening across all stories

- [X] T024 [P] Verify accessibility (WCAG 2.1 AA): keyboard Tab/Enter/Space operates cells and Reset, contrast ≥4.5:1, all controls labeled, status announced via aria-live (UX Consistency principle)
- [X] T025 [P] Run `npm run build` and verify single-file output (`dist/index.html` + `dist/main.js`) and JS budget ≤30 KB minified; record size (Performance principle)
- [X] T026 [P] Run `npm run lint` and `npm run format` to zero errors; run `npm test` and confirm the suite is green (Code Quality + Testing gates)
- [X] T027 Execute the `quickstart.md` manual smoke test (play to win/draw, reset, reload-restores-game) to validate FR-001..FR-011 end to end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **User Stories (Phase 3–5)**: All depend on Foundational completion
  - US1 (P1) has no dependency on US2/US3
  - US2 (P2) builds on the render pipeline; independently testable
  - US3 (P3) builds on the render pipeline; independently testable
- **Polish (Phase 6)**: Depends on all targeted user stories being complete

### User Story Dependencies

- **US1 (P1)**: Independent — only needs Foundational
- **US2 (P2)**: Independent — adds status rendering; consumes existing state
- **US3 (P3)**: Independent — adds reset; consumes existing state model

### Within Each User Story

- Tests (where present) are written first and must FAIL before implementation
- Pure logic in `src/game.js` before DOM wiring in `src/main.js`
- Story complete and independently testable before moving to the next priority

## Parallel Opportunities

- Setup: T002, T003, T004 can run in parallel (different config files) after T001
- Foundational: T007 (storage) and T008 (styles) can run in parallel; T006 before T009
- US1 tests T010–T013 can run in parallel (same test file — coordinate or split into sections)
- Polish: T024, T025, T026 can run in parallel

### Parallel Example: User Story 1 tests

```bash
# Author these test cases together (write first, watch them fail):
Task: "applyMove marks empty cell and alternates players"
Task: "illegal moves are ignored (occupied + post-game)"
Task: "win detection across all 8 lines"
Task: "draw detection + win precedence on last cell"
```

## Implementation Strategy

### MVP First (User Story 1 only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Play to win/draw; confirm input lockout
5. This is a usable, demoable game (X/O play, win/draw detected)

### Incremental Delivery

1. Setup + Foundational → pipeline ready
2. US1 → playable game (MVP) → demo
3. US2 → clear turn/outcome messaging → demo
4. US3 → reset/replay → demo
5. Polish → constitution gates verified (a11y, perf budget, lint/test green)

---

## Notes

- [P] = different files / independent, can parallelize
- [Story] label maps each task to its user story for traceability
- Pure `src/game.js` functions are the deterministic test surface (no timers/network)
- Commit after each task or logical group
- Stop at any checkpoint to validate a story independently

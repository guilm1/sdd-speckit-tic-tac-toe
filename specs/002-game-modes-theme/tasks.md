---
description: "Task list for Game Modes & Branded Theme implementation"
---

# Tasks: Game Modes & Branded Theme

**Input**: Design documents from `/specs/002-game-modes-theme/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test tasks ARE included. The project constitution (Testing Standards, NON-NEGOTIABLE) and
plan.md require deterministic automated tests; the computer opponent (`src/ai.js`) is a pure function
and is the primary new test surface.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2)
- File paths are relative to the repository root

## Path Conventions

Extends the feature-001 single-project frontend layout: `index.html`, `src/` modules, `tests/unit/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the existing toolchain covers this feature (no new dependencies expected)

- [X] T001 Verify the existing dev/build/test tooling runs clean before changes: `npm install`, `npm test`, `npm run lint` all green (baseline from feature 001)
- [X] T002 Confirm the logo asset exists at `public/purp.png` and is served by Vite at the site root (no new asset creation needed)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the mode-state scaffolding all user stories build on (no behavior yet)

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 In `src/main.js`, introduce a `mode` controller variable (`'two-player' | 'vs-computer'`) defaulting to `'two-player'`, threaded into the existing render/update flow without changing two-player behavior yet
- [X] T004 In `src/game.js`, confirm/keep the rules core mode-agnostic (no changes); document that both human and computer moves use the existing `applyMove`

**Checkpoint**: Mode state exists and defaults to two-player; existing game still works unchanged

---

## Phase 3: User Story 1 - Play against the computer (Priority: P1) 🎯 MVP

**Goal**: A mode selector lets the user choose Two Player or Vs Computer; in Vs Computer the computer (O) auto-responds competently to the human (X), and mode changes reset the board.

**Independent Test**: Select Vs Computer, make a move, confirm the computer auto-moves on an empty cell; verify it blocks an imminent player win and takes its own winning move; switch modes and confirm a fresh game.

### Tests for User Story 1

> Write these tests FIRST and ensure they FAIL before implementation.

- [X] T005 [P] [US1] In `tests/unit/ai.test.js`, test `chooseComputerMove` returns a legal empty-cell index and is deterministic (lowest-index tie-break) per `contracts/ai-contract.md`
- [X] T006 [P] [US1] In `tests/unit/ai.test.js`, test win-taking: when a one-move win exists for the computer across multiple lines, it is taken
- [X] T007 [P] [US1] In `tests/unit/ai.test.js`, test blocking: when the opponent threatens a one-move win, the computer blocks that cell
- [X] T008 [P] [US1] In `tests/unit/ai.test.js`, test positional fallback: center preferred on empty board, then corners, then sides

### Implementation for User Story 1

- [X] T009 [P] [US1] Create `src/ai.js` with pure `chooseComputerMove(board, computerSymbol)` implementing win → block → center/corner/side per `data-model.md` (reuse `WINNING_LINES` from `src/game.js`)
- [X] T010 [US1] In `index.html`, add a labeled mode selector (Two Player / Vs Computer) markup hook
- [X] T011 [US1] In `src/main.js`, render and wire the mode selector: selecting a mode sets `mode` and calls `reset()` to start a fresh game in that mode (FR-001, FR-002, FR-011)
- [X] T012 [US1] In `src/main.js`, implement the vs-computer turn flow: after an in-progress human move, lock input, call `chooseComputerMove(board, 'O')`, `applyMove`, then re-render and unlock (FR-004–FR-007)
- [X] T013 [US1] In `src/main.js`, ensure the computer does NOT move when the human's move ends the game (win/draw), and that two-player mode skips the computer step entirely (FR-003, FR-008, edge cases)
- [X] T014 [US1] In `src/main.js`, adapt the status message to the mode (e.g., turn/outcome wording) via the existing `aria-live` region (FR-009)

**Checkpoint**: Single player can play a full, correct game vs the computer and switch modes (MVP)

---

## Phase 4: User Story 2 - Branded purple light theme with logo (Priority: P2)

**Goal**: A default purple light theme and the purp logo give the app its visual identity, with legibility preserved.

**Independent Test**: Load the app and confirm a light theme with purple accents and a visible, crisp purp logo; verify text/controls stay legible.

### Implementation for User Story 2

- [X] T015 [US2] In `src/styles.css`, define the purple light theme via CSS variables (light surfaces, purple primary accent) and apply across body, board, cells, status, mode selector, and Reset — keeping a single styling source of truth
- [X] T016 [US2] In `index.html` + `src/main.js`, render the purp logo as an `<img>` from `public/purp.png` with `alt="purp"` near the title; size it cleanly (FR-013, FR-015)
- [X] T017 [P] [US2] In `src/styles.css`, verify/adjust contrast so all text, X/O marks, and controls meet ≥4.5:1 against the purple theme and marks remain glyph-distinguishable (FR-014)

**Checkpoint**: App is recognizably branded (purple + logo) and fully legible; US1 + US2 work together

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Constitution gate verification across both stories

- [X] T018 [P] Verify accessibility: mode selector is keyboard operable and labeled, board locks during computer turn, logo has alt text, status announced via aria-live (UX Consistency principle)
- [X] T019 [P] Run `npm run build` and confirm single-file output still works and JS budget stays ≤30 KB minified (logo excluded) (Performance principle)
- [X] T020 [P] Run `npm run lint`, `npm run format`, and `npm test` (incl. `ai.test.js`) to zero errors / all green (Code Quality + Testing gates)
- [X] T021 Execute the `quickstart.md` manual smoke test (logo/theme, both modes, computer block/win, input lock, reset, mode switch)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS user stories
- **User Stories (Phase 3–4)**: Depend on Foundational
  - US1 (P1) is the core new value and independent of US2
  - US2 (P2) is visual-only and independent of US1
- **Polish (Phase 5)**: Depends on the targeted user stories being complete

### User Story Dependencies

- **US1 (P1)**: Independent — needs Foundational (mode state) only
- **US2 (P2)**: Independent — theme/logo can be applied regardless of mode logic

### Within Each User Story

- US1 tests (T005–T008) are written first and must FAIL before implementing `ai.js` (T009)
- Pure `src/ai.js` before DOM wiring in `src/main.js`
- Story complete and independently testable before moving to the next priority

## Parallel Opportunities

- US1 AI tests T005–T008 can be authored in parallel (same file — split by describe block)
- T009 (`ai.js`) is independent of the `index.html`/`main.js` UI edits and can proceed in parallel with test authoring
- US2 (T015–T017) can proceed in parallel with US1 since it touches styling/markup, not game logic
- Polish T018–T020 can run in parallel

### Parallel Example: User Story 1 tests

```bash
# Author these opponent test cases together (write first, watch them fail):
Task: "chooseComputerMove returns a legal, deterministic move"
Task: "computer takes a one-move win"
Task: "computer blocks an opponent's one-move win"
Task: "computer prefers center, then corners, then sides"
```

## Implementation Strategy

### MVP First (User Story 1 only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (mode state)
3. Complete Phase 3: User Story 1 (mode selector + computer opponent)
4. **STOP and VALIDATE**: play vs computer; confirm block/win behavior and mode switching
5. This delivers the headline feature (single-player vs computer)

### Incremental Delivery

1. Setup + Foundational → mode scaffolding ready
2. US1 → computer mode + selector (MVP) → demo
3. US2 → purple theme + purp logo → demo
4. Polish → constitution gates verified (a11y, perf, lint/test green)

---

## Notes

- [P] = different files / independent, can parallelize
- `src/game.js` stays unchanged and mode-agnostic; `src/ai.js` is the new pure, deterministic test surface
- The logo is the existing `public/purp.png`; no new artwork is created
- Commit after each task or logical group
- Stop at any checkpoint to validate a story independently

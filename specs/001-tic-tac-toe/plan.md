# Implementation Plan: Tic-Tac-Toe Game

**Branch**: `001-tic-tac-toe` | **Date**: 2026-05-28 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-tic-tac-toe/spec.md`

## Summary

A minimal, single-page Tic-Tac-Toe game for two local players (hot-seat). The board, turn
indicator, win/draw messaging, and Reset control are delivered as a tiny client-only app with no
backend or database. Technical approach: a Vite-built vanilla JavaScript SPA with zero runtime
framework dependencies, styled with standard CSS (Tailwind via CDN permitted to keep styling in one
place), persisting state via the browser `localStorage` API. The production build compiles to a
single `index.html` plus a single `main.js` to keep the footprint minimal.

## Technical Context

**Language/Version**: JavaScript (ES2022+), HTML5, CSS3 — no transpilation beyond what Vite provides

**Primary Dependencies**: Vite (build/dev tooling only); zero runtime framework dependencies. Tailwind
CSS via CDN is OPTIONAL for utility styling. `vite-plugin-singlefile` (or equivalent Rollup output
config) to emit a single `index.html` + single `main.js`.

**Storage**: Browser `localStorage` for client-side persistence (no database, no backend server)

**Testing**: Vitest (Vite-native) with jsdom for pure game-logic unit tests; optional lightweight
DOM integration tests. No browser/runtime framework required.

**Target Platform**: Modern evergreen browsers (Chrome, Firefox, Safari, Edge — latest 2 versions)

**Project Type**: Single-page web application (frontend only, client-side)

**Performance Goals**: Move-to-feedback latency under 100ms (feels instant); first paint under 1s on
a typical connection; the app remains responsive at 60fps during interaction.

**Constraints**: Production output MUST be exactly one `index.html` and one `main.js`. No backend,
no database, no runtime framework. Total shipped JS budget ≤ 30 KB minified (excludes Tailwind CDN,
which is an external request). Offline-capable after first load (no network needed to play).

**Scale/Scope**: Single screen, 9 cells, two local players, one active game at a time. Trivial data
volume. No authentication, no multi-user concurrency.

### Open clarification (scope tension)

The plan input mentions persisting **"high scores"** in `localStorage`, but the current spec
(`spec.md`, Assumptions) explicitly scopes out score-keeping across games. This plan treats
`localStorage` as the persistence mechanism for **in-progress game state only** (so a refresh does
not lose the current game). A cross-game high-score / win-tally feature would require a spec
amendment (new user story + requirements) before implementation. Flagged here rather than silently
expanding scope. See `research.md` → "Persistence scope" for the recommended decision.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Gates derived from `.specify/memory/constitution.md` v1.0.0:

| Principle | Gate | Status |
|-----------|------|--------|
| I. Code Quality | Linter + formatter configured, zero errors; small single-responsibility modules; review required | PASS — ESLint + Prettier configured; game logic split into pure functions separate from DOM/render |
| II. Testing Standards | Automated, deterministic tests; CI-green gate; critical paths covered | PASS — Vitest unit tests over pure win/draw/turn logic (deterministic, no timing/network); CI runs suite |
| III. UX Consistency | Single styling source of truth; consistent interactions; loading/empty/error/success states; WCAG 2.1 AA | PASS (with notes) — single CSS source (one stylesheet or Tailwind utility set); empty/in-progress/win/draw states all defined; keyboard-operable grid, AA contrast, ARIA labels/live region |
| IV. Performance Requirements | Measurable budgets declared and measured; no unjustified regressions | PASS — budgets declared (≤30 KB JS, <100ms interaction); single-file output keeps footprint minimal; measured via build size report |

**Initial Constitution Check: PASS.** No violations requiring justification. The single-file output
constraint and Tailwind-CDN styling are consistent with the "minimal footprint" intent and the
"single source of truth" UX rule (one styling system, applied consistently).

## Project Structure

### Documentation (this feature)

```text
specs/001-tic-tac-toe/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   ├── storage-contract.md
│   └── ui-contract.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
index.html               # App shell; mounts #app and loads main.js (single HTML output)
src/
├── main.js              # Entry point: wires DOM <-> game logic, renders board, handles input
├── game.js              # Pure game logic: move, turn, win/draw detection (no DOM)
├── storage.js           # localStorage read/write wrapper for game state
└── styles.css           # Single styling source of truth (omitted if Tailwind CDN used exclusively)

tests/
└── unit/
    ├── game.test.js     # Deterministic tests for win/draw/turn rules across all 8 lines
    └── storage.test.js  # Persistence round-trip + corrupted/missing data handling

vite.config.js           # Single-file output config (vite-plugin-singlefile or rollup output)
package.json             # Scripts: dev, build, test, lint, format
.eslintrc / prettier     # Code Quality tooling config

dist/                    # Build output: single index.html + single main.js (generated)
```

**Structure Decision**: Single-project frontend layout (Option 1, web client only). Source is kept
as small ES modules during development for readability and testability (Code Quality principle),
while the Vite build bundles everything into the required single `index.html` + single `main.js`
for distribution. Pure game logic (`game.js`) is isolated from DOM/render code (`main.js`) so it can
be unit-tested deterministically (Testing principle).

## Complexity Tracking

> No constitution violations require justification. Table intentionally left empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (none)    | —          | —                                   |

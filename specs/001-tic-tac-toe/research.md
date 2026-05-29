# Research: Tic-Tac-Toe Game

**Feature**: 001-tic-tac-toe | **Date**: 2026-05-28 | **Phase**: 0 (Outline & Research)

This document resolves the technical unknowns and records the key technology decisions for the
implementation plan. Each item follows: Decision → Rationale → Alternatives considered.

## 1. Build tooling & single-file output

**Decision**: Use Vite as the dev server and build tool, with `vite-plugin-singlefile` (or an
equivalent Rollup `output.inlineDynamicImports` + single-chunk configuration) to emit a single
`index.html` and a single `main.js` for production.

**Rationale**: Vite gives a fast dev server and zero-config ES module handling without pulling in a
runtime framework. `vite-plugin-singlefile` inlines assets so the production footprint is exactly
the two files required by the spec/plan input. Build remains a dev-time dependency only — nothing
framework-like ships to the browser.

**Alternatives considered**:
- *No build tool (hand-written index.html + main.js)*: Simplest possible footprint, but loses dev
  ergonomics, module splitting for tests, and a clean test runner integration. Rejected because the
  input explicitly asks for Vite.
- *Webpack/Parcel*: Heavier configuration and slower dev loop than Vite for a trivial app. Rejected.

## 2. Runtime dependencies & styling

**Decision**: Zero runtime framework dependencies. Use vanilla JS + DOM APIs. For styling, use a
single source of truth: either one `styles.css` file or Tailwind via CDN (utility classes only) —
pick one approach and apply it consistently, not both.

**Rationale**: Satisfies the "zero external framework dependencies" constraint and the constitution's
UX Consistency principle (single styling source of truth). Tailwind CDN keeps styling inline/in-one
place if chosen; a single CSS file is equally valid and avoids an external request. Defaulting to a
single `styles.css` for offline capability; Tailwind CDN is an allowed alternative if the team
prefers utility classes.

**Alternatives considered**:
- *Mixing inline styles + CSS file + Tailwind*: Violates single-source-of-truth; causes drift.
  Rejected.
- *A CSS framework with a build step (e.g., compiled Tailwind)*: Adds tooling weight without benefit
  at this scale. Rejected.

## 3. State management

**Decision**: Plain JavaScript state held in a single in-memory game object, mutated only through a
small set of pure transition functions (`applyMove`, `reset`) that return new state. Rendering reads
from state; no reactive framework.

**Rationale**: The game has trivial state (board array, current player, status). A pure-function core
keeps logic deterministic and unit-testable (Testing Standards principle) and avoids any framework.

**Alternatives considered**:
- *Reactive store libraries (Redux, Zustand, signals)*: Overkill for 9 cells; adds dependencies.
  Rejected.
- *Direct DOM-as-state (read marks back from cells)*: Couples logic to DOM, harder to test, error
  prone. Rejected.

## 4. Persistence (localStorage) — and the "high scores" scope question

**Decision**: Use `localStorage` to persist **in-progress game state** (board, current player,
status) under a single namespaced key (e.g., `ttt:state:v1`), restored on load so a refresh does not
lose the current game. Reads MUST tolerate missing or corrupted data by falling back to a fresh game.

**High-scores note**: The plan input mentions persisting "high scores", but `spec.md` Assumptions
explicitly exclude cross-game score-keeping. **Recommended decision: defer high scores.** Treat
persistence as game-state-only for this iteration. If win-tally/high-score tracking is desired, amend
the spec first (add a user story + functional requirements + success criteria) and then extend the
`localStorage` schema with a separate `ttt:scores:v1` key. This keeps the plan aligned with the
approved spec rather than silently widening scope.

**Rationale**: localStorage is synchronous, simple, and requires no backend — matching the "no
database/server" constraint. Versioned keys (`:v1`) allow safe schema evolution. Defensive reads
prevent a corrupted entry from breaking the app (resilience, UX).

**Alternatives considered**:
- *IndexedDB*: Async, more capable, but unnecessary complexity for a few bytes of state. Rejected.
- *sessionStorage*: Cleared on tab close; would not preserve an in-progress game across reloads as
  reliably. localStorage chosen; behavior is otherwise similar.
- *Implementing high scores now*: Rejected — out of scope per spec; would require amendment.

## 5. Testing approach

**Decision**: Vitest (Vite-native) for unit tests, with jsdom as the environment. Cover all eight
winning lines (3 rows, 3 columns, 2 diagonals), the draw condition, illegal-move rejection,
post-game input lockout, and localStorage round-trip + corrupted-data fallback.

**Rationale**: Vitest integrates with the Vite toolchain with no extra runtime deps and runs fast.
The pure game core makes tests fully deterministic (no timers, no network), satisfying the Testing
Standards principle. The test suite is the CI gate before merge.

**Alternatives considered**:
- *Jest*: Works, but requires separate config/transform vs. Vite; Vitest is the natural fit. Rejected.
- *Playwright/Cypress E2E*: Valuable but heavier; optional for a single-screen app. Deferred — unit
  + light DOM integration tests cover the critical paths.

## 6. Accessibility (WCAG 2.1 AA)

**Decision**: Render the board as a keyboard-operable grid: focusable cells (buttons), `aria-label`
per cell stating position and occupant, an `aria-live="polite"` region for the status/turn message,
and a clearly labeled Reset button. Ensure color contrast ≥ 4.5:1 and that X/O are distinguishable
by text, not color alone.

**Rationale**: The constitution requires WCAG 2.1 AA. Using semantic buttons gives keyboard and
screen-reader support for free; a live region announces turn changes and results.

**Alternatives considered**:
- *Non-semantic `<div>` cells with click handlers only*: Fails keyboard/AT support. Rejected.

## 7. Performance budgets

**Decision**: Declare and measure: shipped JS ≤ 30 KB minified (excluding Tailwind CDN), interaction
latency < 100ms, 60fps during play, first paint < 1s. Verify JS size via the Vite build size report.

**Rationale**: The Performance principle requires explicit, measurable budgets verified against real
output. The single-file build and lack of frameworks make these budgets comfortably achievable; the
build report provides the measurement.

**Alternatives considered**: None — budgets are derived directly from the constitution and the
"minimal footprint" constraint.

## Summary of resolved unknowns

| Unknown | Resolution |
|---------|------------|
| Build tool / single-file output | Vite + vite-plugin-singlefile → one index.html + one main.js |
| Runtime framework | None (vanilla JS) |
| Styling source of truth | Single `styles.css` (Tailwind CDN allowed alternative) |
| State management | In-memory object + pure transition functions |
| Persistence target | localStorage (versioned, defensive reads) |
| Persistence scope | In-progress game state only; high scores deferred pending spec amendment |
| Test runner | Vitest + jsdom |
| Accessibility | Semantic button grid + aria-live status, AA contrast |
| Performance budgets | ≤30 KB JS, <100ms interaction, 60fps, <1s first paint |

All NEEDS CLARIFICATION items are resolved. Ready for Phase 1 design.

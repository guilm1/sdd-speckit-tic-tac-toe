# Quickstart: Game Modes & Branded Theme

**Feature**: 002-game-modes-theme | **Date**: 2026-05-28

This feature extends the existing Tic-Tac-Toe app (feature 001). Setup, scripts, and the toolchain are
unchanged — see `specs/001-tic-tac-toe/quickstart.md` for the base. Below are the additions.

## Run, test, build

```bash
npm install      # if not already installed
npm run dev      # play locally (http://localhost:5173)
npm test         # run the full Vitest suite (includes new ai.test.js)
npm run lint     # zero errors
npm run build    # minimal production build in dist/
```

## What changed

- `src/ai.js` — new pure computer-opponent module (`chooseComputerMove`)
- `src/main.js` — mode selector, computer-turn orchestration, logo rendering
- `src/styles.css` — purple light theme + mode selector + logo styles
- `index.html` — logo + mode selector markup
- `public/purp.png` — brand logo asset (already present)
- `tests/unit/ai.test.js` — new tests for the opponent

## Manual smoke test

1. Load the app — the **purp logo** is visible near the title and the theme is **light with purple
   accents**.
2. The default mode is **Two Player** — play a local two-person game as in feature 001.
3. Switch to **Vs Computer** — the board resets; you play as **X** and move first.
4. Make a move — the **computer (O) responds automatically** on an empty cell within a moment.
5. Try to let yourself win in one move — confirm the computer **blocks** it.
6. Give the computer a one-move win — confirm it **takes** the win.
7. Try clicking while the computer is responding — input is **ignored** until it moves.
8. Press **Reset** — a fresh game starts in the current mode.
9. Switch back to **Two Player** — the board resets and behaves as local play.

## Acceptance mapping

- US1 (computer mode + selector): steps 2–8 → FR-001..FR-011, SC-001..SC-003, SC-006
- US2 (purple theme + logo): steps 1 → FR-012..FR-015, SC-004..SC-005
- Opponent guarantees (win/block/legal/deterministic): `tests/unit/ai.test.js` and
  `contracts/ai-contract.md`

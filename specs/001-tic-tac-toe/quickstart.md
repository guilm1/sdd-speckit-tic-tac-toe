# Quickstart: Tic-Tac-Toe Game

**Feature**: 001-tic-tac-toe | **Date**: 2026-05-28

How to set up, run, test, and build the app. Assumes Node.js 18+ and npm.

## Prerequisites

- Node.js 18 or newer
- npm (bundled with Node)

## Setup

```bash
npm install
```

Expected dev dependencies (no runtime framework): `vite`, `vite-plugin-singlefile`, `vitest`,
`jsdom`, `eslint`, `prettier`.

## Run (development)

```bash
npm run dev
```

Opens the Vite dev server (default http://localhost:5173). Edit files in `src/`; the page hot-reloads.

## Test

```bash
npm test          # run the Vitest suite once
npm run test:watch  # watch mode during development
```

Tests cover: all 8 winning lines, the draw condition, illegal-move rejection, post-game input
lockout, and localStorage round-trip + corrupted-data fallback. The suite MUST be green before merge
(Testing Standards gate).

## Lint & format

```bash
npm run lint      # ESLint, must report zero errors
npm run format    # Prettier write
```

## Build (production single-file output)

```bash
npm run build
```

Produces the minimal footprint in `dist/`:

- `dist/index.html`
- `dist/main.js`

Verify the JS size against the budget (≤ 30 KB minified, excluding Tailwind CDN if used) using the
Vite build size report.

## Preview production build

```bash
npm run preview
```

## How to play (manual smoke test)

1. Open the app — status reads **"X's turn"**, board is empty.
2. Click a cell — it shows **X**; status updates to **"O's turn"**.
3. Alternate moves; complete a row/column/diagonal — status announces the winner and the board locks.
4. Or fill the board with no line — status announces a **draw**.
5. Click **Reset** at any time — the board clears and a fresh game begins.
6. Reload mid-game — the in-progress game is restored from `localStorage`.

## Acceptance mapping

Each manual step maps to spec acceptance scenarios in `spec.md` (US1 play-to-result, US2 status
messaging, US3 reset) and the functional requirements FR-001 through FR-011.

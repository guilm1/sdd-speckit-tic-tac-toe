# Tic-Tac-Toe

A simple, clean Tic-Tac-Toe game with two play modes. Place **X** and **O** on a 3x3 grid in
**Two Player** (local hot-seat) mode, or take on the computer in **Vs Computer** mode. The app shows
whose turn it is, announces the winner or a draw, and offers a **Reset** button to start over.
In-progress games survive a page reload. The default look is a branded **purple light** theme with
the purp logo.

Built with **Vite** and **vanilla JavaScript** — zero runtime framework dependencies — and persisted
with the browser's `localStorage`. No backend, no database.

## Features

- 3x3 grid with alternating X / O turns (X moves first)
- **Two game modes**: Two Player (local) and Vs Computer
- **Computer opponent**: plays competently — takes a winning move, blocks your wins, else plays a sensible move
- Mode selector; switching modes starts a fresh game
- Live status message: whose turn it is, who won, or a draw
- Win detection across all rows, columns, and diagonals (winning line highlighted)
- Draw detection when the board fills with no winner
- **Reset** button to restart at any time (mid-game or after a result)
- In-progress game restored from `localStorage` on reload
- Branded **purple light** theme with the purp logo
- Keyboard-accessible and screen-reader friendly (WCAG 2.1 AA)

## Tech stack

| Concern       | Choice                                       |
| ------------- | -------------------------------------------- |
| Build / dev   | Vite (+ `vite-plugin-singlefile` for builds) |
| Language      | Vanilla JavaScript (ES2022), HTML5, CSS3     |
| Persistence   | Browser `localStorage` (no backend/database) |
| Tests         | Vitest + jsdom                               |
| Lint / format | ESLint + Prettier                            |

## Getting started

Requires **Node.js 18+** and npm.

```bash
npm install      # install dev dependencies
npm run dev      # start the dev server (http://localhost:5173)
```

## Scripts

| Command              | Description                                     |
| -------------------- | ----------------------------------------------- |
| `npm run dev`        | Start the Vite dev server with hot reload       |
| `npm run build`      | Produce the minimal production build in `dist/` |
| `npm run preview`    | Preview the production build locally            |
| `npm test`           | Run the Vitest suite once                       |
| `npm run test:watch` | Run tests in watch mode                         |
| `npm run lint`       | Run ESLint (must report zero errors)            |
| `npm run format`     | Format the codebase with Prettier               |

## Build output

`npm run build` inlines the JS and CSS into a single, self-contained `dist/index.html`
(~5 KB, ~2 KB gzipped) for the smallest possible footprint and easy static hosting.

## How to play

1. The status reads **"X's turn"** and the board starts empty.
2. Click a cell to place your mark; the turn passes to the other player.
3. Get three of your marks in a row, column, or diagonal to win — or fill the board for a draw.
4. Click **Reset** at any time to start a fresh game.
5. Reload the page mid-game and your in-progress game is restored.

## Project structure

```text
index.html            # App shell, loads src/main.js
public/
└── purp.png       # Brand logo asset
src/
├── main.js           # DOM rendering + event wiring (modes, board, status, reset, logo, persistence)
├── game.js           # Pure game logic: moves, turns, win/draw detection (no DOM)
├── ai.js             # Pure computer opponent: win → block → positional (no DOM)
├── storage.js        # localStorage read/write with defensive validation
└── styles.css        # Single styling source of truth (purple light theme)
tests/unit/
├── game.test.js      # Move/turn/win/draw rules across all 8 lines
├── ai.test.js        # Computer opponent: win/block/positional/legality/determinism
├── status.test.js    # Status message derivation
├── storage.test.js   # Persistence round-trip + corrupted-data fallback
└── ui.test.js        # DOM wiring: logo, mode selector, computer turn, mode reset
vite.config.js        # Build (single-file output) + Vitest config
```

## Development notes

This project was built with [Spec Kit](https://github.com/github/spec-kit) Spec-Driven Development.
The full specifications, plans, and task breakdowns live in
[`specs/001-tic-tac-toe/`](./specs/001-tic-tac-toe/) (base game) and
[`specs/002-game-modes-theme/`](./specs/002-game-modes-theme/) (computer mode + theme), and the
governing principles (code quality, testing, UX consistency, performance) are in
[`.specify/memory/constitution.md`](./.specify/memory/constitution.md).

The game core in `src/game.js` is intentionally free of DOM access so the rules can be unit-tested
deterministically — see `tests/unit/`.

## License

MIT

// Pure computer-opponent logic. No DOM, no randomness, no timers — the same
// (board, computerSymbol) always yields the same move, so it is fully testable.
// Contract: specs/002-game-modes-theme/contracts/ai-contract.md
import { WINNING_LINES } from './game.js';

// Positional preference when no win/block is available: center, then corners,
// then sides. Within a tier the lower index comes first (deterministic).
const PREFERENCE_ORDER = [4, 0, 2, 6, 8, 1, 3, 5, 7];

function emptyCells(board) {
  const cells = [];
  for (let i = 0; i < board.length; i += 1) {
    if (board[i] === null) cells.push(i);
  }
  return cells;
}

// Would placing `symbol` at `index` complete a line for that symbol?
function completesLine(board, index, symbol) {
  for (const line of WINNING_LINES) {
    if (!line.includes(index)) continue;
    if (line.every((i) => (i === index ? true : board[i] === symbol))) {
      return true;
    }
  }
  return false;
}

/**
 * Choose the computer's move: win if possible, else block an opponent win,
 * else take the best positional cell. Returns an empty-cell index.
 */
export function chooseComputerMove(board, computerSymbol) {
  const opponentSymbol = computerSymbol === 'X' ? 'O' : 'X';
  const empties = emptyCells(board); // ascending → lowest-index tie-break

  // 1. Take an immediate win.
  for (const index of empties) {
    if (completesLine(board, index, computerSymbol)) return index;
  }

  // 2. Block the opponent's immediate win.
  for (const index of empties) {
    if (completesLine(board, index, opponentSymbol)) return index;
  }

  // 3. Positional preference.
  for (const index of PREFERENCE_ORDER) {
    if (board[index] === null) return index;
  }

  // Fallback (should be unreachable when a cell is empty).
  return empties[0];
}

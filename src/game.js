// Pure game logic for Tic-Tac-Toe. No DOM access lives here so the rules can be
// unit-tested deterministically (see tests/unit/game.test.js).

// Board cells are indexed 0-8 in row-major order:
//  0 | 1 | 2
//  3 | 4 | 5
//  6 | 7 | 8
export const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

/**
 * Create a fresh game state. X always moves first.
 * @returns {{board: Array<null>, currentPlayer: 'X'|'O', status: 'in_progress'|'won'|'draw', winner: ('X'|'O'|null), winningLine: (number[]|null)}}
 */
export function createInitialState() {
  return {
    board: Array(9).fill(null),
    currentPlayer: 'X',
    status: 'in_progress',
    winner: null,
    winningLine: null,
  };
}

/**
 * Find a winning line occupied entirely by one symbol.
 * @returns {number[]|null} the winning line indices, or null if none.
 */
function findWinningLine(board) {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] !== null && board[a] === board[b] && board[a] === board[c]) {
      return line;
    }
  }
  return null;
}

/**
 * Apply a move at the given cell index for the current player.
 * Returns a new state object; the input state is not mutated.
 * Ignores the move (returns an equivalent new state) when the game is over
 * or the target cell is already occupied.
 */
export function applyMove(state, index) {
  if (state.status !== 'in_progress' || state.board[index] !== null) {
    return { ...state, board: [...state.board] };
  }

  const board = [...state.board];
  board[index] = state.currentPlayer;

  const winningLine = findWinningLine(board);
  if (winningLine) {
    return {
      ...state,
      board,
      status: 'won',
      winner: state.currentPlayer,
      winningLine,
    };
  }

  if (board.every((cell) => cell !== null)) {
    return { ...state, board, status: 'draw', winner: null, winningLine: null };
  }

  return {
    ...state,
    board,
    currentPlayer: state.currentPlayer === 'X' ? 'O' : 'X',
  };
}

/**
 * Reset to a fresh game regardless of the prior state.
 */
export function reset() {
  return createInitialState();
}

/**
 * Derive the human-readable status message from state.
 */
export function statusMessage(state) {
  if (state.status === 'won') {
    return `${state.winner} wins!`;
  }
  if (state.status === 'draw') {
    return "It's a draw";
  }
  return `${state.currentPlayer}'s turn`;
}

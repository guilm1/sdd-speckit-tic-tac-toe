import { describe, it, expect } from 'vitest';
import { createInitialState, applyMove, reset, WINNING_LINES } from '../../src/game.js';

describe('createInitialState', () => {
  it('starts with an empty board and X to move', () => {
    const state = createInitialState();
    expect(state.board).toEqual(Array(9).fill(null));
    expect(state.currentPlayer).toBe('X');
    expect(state.status).toBe('in_progress');
    expect(state.winner).toBeNull();
    expect(state.winningLine).toBeNull();
  });
});

describe('applyMove - basic turns (US1)', () => {
  it('marks the chosen empty cell with the current symbol', () => {
    const state = applyMove(createInitialState(), 4);
    expect(state.board[4]).toBe('X');
  });

  it('alternates the current player after a valid move', () => {
    let state = createInitialState();
    state = applyMove(state, 0);
    expect(state.currentPlayer).toBe('O');
    state = applyMove(state, 1);
    expect(state.currentPlayer).toBe('X');
  });

  it('does not mutate the input state', () => {
    const state = createInitialState();
    applyMove(state, 0);
    expect(state.board[0]).toBeNull();
    expect(state.currentPlayer).toBe('X');
  });
});

describe('applyMove - illegal moves (US1)', () => {
  it('ignores selection of an occupied cell and keeps the same turn', () => {
    const afterX = applyMove(createInitialState(), 0); // X at 0, now O's turn
    const blocked = applyMove(afterX, 0); // O tries the same cell
    expect(blocked.board[0]).toBe('X');
    expect(blocked.currentPlayer).toBe('O');
  });

  it('ignores any move after the game is over', () => {
    // X wins on the top row: X0 O3 X1 O4 X2
    let state = createInitialState();
    for (const i of [0, 3, 1, 4, 2]) state = applyMove(state, i);
    expect(state.status).toBe('won');
    const after = applyMove(state, 5);
    expect(after.board[5]).toBeNull();
    expect(after.status).toBe('won');
    expect(after.winner).toBe('X');
  });
});

describe('applyMove - win detection across all 8 lines (US1)', () => {
  it.each(WINNING_LINES.map((line) => [line]))('detects a win on line %j', (line) => {
    const [a, b, c] = line;
    const others = [0, 1, 2, 3, 4, 5, 6, 7, 8].filter((i) => !line.includes(i));
    // X takes the line; O fills two unrelated cells in between.
    let state = createInitialState();
    state = applyMove(state, a); // X
    state = applyMove(state, others[0]); // O
    state = applyMove(state, b); // X
    state = applyMove(state, others[1]); // O
    state = applyMove(state, c); // X completes the line
    expect(state.status).toBe('won');
    expect(state.winner).toBe('X');
    expect(state.winningLine).toEqual(line);
  });
});

describe('applyMove - draw and win precedence (US1)', () => {
  it('declares a draw when the board fills with no line', () => {
    // X O X / X O O / O X X  -> full board, no three in a line
    // Move order producing that layout:
    // X:0 O:1 X:2 O:4 X:3 O:5 X:7 O:6 X:8
    let state = createInitialState();
    for (const i of [0, 1, 2, 4, 3, 5, 7, 6, 8]) state = applyMove(state, i);
    expect(state.board.every((cell) => cell !== null)).toBe(true);
    expect(state.status).toBe('draw');
    expect(state.winner).toBeNull();
  });

  it('treats a winning last move as a win, not a draw', () => {
    // Construct a board with one empty cell that completes a line for X.
    // Layout: X at 0,1 (need 2 to win row), board otherwise full without other win.
    // X:1 O:0 X:2 O:4 X:3 O:5 X:7 O:8 X:6 ... craft carefully:
    // Use: X:4 O:0 X:1 O:7 X:2 O:5 X:3 O:6 X:8? ensure last X move wins.
    // Simpler: fill all but cell 2; X to move and cell 2 completes top row.
    let state = createInitialState();
    // X plays 0,1,5,6 and O plays 3,4,7,8 with no early line; cell 2 left empty
    // with X to move. Placing X at 2 then completes the top row [0,1,2].
    for (const i of [0, 3, 1, 4, 5, 7, 6, 8]) state = applyMove(state, i);
    expect(state.board[2]).toBeNull();
    expect(state.status).toBe('in_progress');
    expect(state.currentPlayer).toBe('X');
    state = applyMove(state, 2);
    expect(state.status).toBe('won');
    expect(state.winner).toBe('X');
    expect(state.winningLine).toEqual([0, 1, 2]);
  });
});

describe('reset (US3)', () => {
  it('returns a fresh game regardless of prior state', () => {
    let state = createInitialState();
    state = applyMove(state, 0);
    state = applyMove(state, 1);
    expect(state.board[0]).toBe('X'); // confirm prior state was non-fresh
    const fresh = reset();
    expect(fresh.board).toEqual(Array(9).fill(null));
    expect(fresh.currentPlayer).toBe('X');
    expect(fresh.status).toBe('in_progress');
    expect(fresh.winner).toBeNull();
    expect(fresh.winningLine).toBeNull();
  });
});

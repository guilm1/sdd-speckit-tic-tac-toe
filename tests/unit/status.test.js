import { describe, it, expect } from 'vitest';
import { createInitialState, applyMove, statusMessage } from '../../src/game.js';

describe('statusMessage (US2)', () => {
  it("announces X's turn on a new game", () => {
    expect(statusMessage(createInitialState())).toBe("X's turn");
  });

  it("announces the next player's turn after a move", () => {
    const state = applyMove(createInitialState(), 0);
    expect(statusMessage(state)).toBe("O's turn");
  });

  it('announces the winner on a win', () => {
    let state = createInitialState();
    for (const i of [0, 3, 1, 4, 2]) state = applyMove(state, i);
    expect(statusMessage(state)).toBe('X wins!');
  });

  it('announces a draw when the board fills with no winner', () => {
    let state = createInitialState();
    for (const i of [0, 1, 2, 4, 3, 5, 7, 6, 8]) state = applyMove(state, i);
    expect(statusMessage(state)).toBe("It's a draw");
  });
});

import { describe, it, expect } from 'vitest';
import { chooseComputerMove } from '../../src/ai.js';

const _ = null;

describe('chooseComputerMove - legality & determinism (US1)', () => {
  it('returns an empty cell index', () => {
    const board = ['X', _, 'O', _, 'X', _, _, _, 'O'];
    const move = chooseComputerMove(board, 'O');
    expect(board[move]).toBeNull();
  });

  it('is deterministic for the same input', () => {
    const board = ['X', _, _, _, _, _, _, _, _];
    expect(chooseComputerMove(board, 'O')).toBe(chooseComputerMove(board, 'O'));
  });

  it('uses lowest-index tie-break among equal-priority cells', () => {
    // Empty board → center (4) preferred; deterministic single answer.
    expect(chooseComputerMove([_, _, _, _, _, _, _, _, _], 'O')).toBe(4);
  });
});

describe('chooseComputerMove - takes a win (US1)', () => {
  it('completes the top row for O', () => {
    // O O _ / _ X _ / _ _ X
    const board = ['O', 'O', _, _, 'X', _, _, _, 'X'];
    expect(chooseComputerMove(board, 'O')).toBe(2);
  });

  it('completes a diagonal for O', () => {
    // O at 0 and 4, empty at 8 completes [0,4,8]
    const board = ['O', 'X', 'X', _, 'O', _, _, _, _];
    expect(chooseComputerMove(board, 'O')).toBe(8);
  });

  it('prefers winning over blocking when both are possible', () => {
    // O can win on [0,1,2] at 2; X threatens [3,4,5] at 5. Win must come first.
    const board = ['O', 'O', _, 'X', 'X', _, _, _, _];
    expect(chooseComputerMove(board, 'O')).toBe(2);
  });
});

describe('chooseComputerMove - blocks the opponent (US1)', () => {
  it('blocks X completing the top row', () => {
    // X X _ / _ O _ / _ _ _  → block at 2
    const board = ['X', 'X', _, _, 'O', _, _, _, _];
    expect(chooseComputerMove(board, 'O')).toBe(2);
  });

  it('blocks X completing a column', () => {
    // X at 0 and 3 threaten column [0,3,6]; O at 4 and 5 has no immediate win.
    const board = ['X', _, _, 'X', 'O', 'O', _, _, _];
    expect(chooseComputerMove(board, 'O')).toBe(6);
  });
});

describe('chooseComputerMove - positional fallback (US1)', () => {
  it('prefers center on an empty board', () => {
    expect(chooseComputerMove([_, _, _, _, _, _, _, _, _], 'O')).toBe(4);
  });

  it('prefers a corner when center is taken and no win/threat', () => {
    // Only center taken by X; no win/threat → first corner (0)
    const board = [_, _, _, _, 'X', _, _, _, _];
    expect(chooseComputerMove(board, 'O')).toBe(0);
  });
});

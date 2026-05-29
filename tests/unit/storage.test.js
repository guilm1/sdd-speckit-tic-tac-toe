import { describe, it, expect, beforeEach } from 'vitest';
import { loadState, saveState, clearState } from '../../src/storage.js';
import { createInitialState, applyMove } from '../../src/game.js';

const STORAGE_KEY = 'ttt:state:v1';

describe('storage (foundational)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns null when no state is persisted', () => {
    expect(loadState()).toBeNull();
  });

  it('round-trips a valid game state', () => {
    const state = applyMove(createInitialState(), 4);
    saveState(state);
    expect(loadState()).toEqual(state);
  });

  it('returns null for malformed JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{ not valid json');
    expect(loadState()).toBeNull();
  });

  it('returns null for structurally invalid state', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ board: [1, 2, 3], currentPlayer: 'Z' }));
    expect(loadState()).toBeNull();
  });

  it('clears persisted state', () => {
    saveState(createInitialState());
    clearState();
    expect(loadState()).toBeNull();
  });
});

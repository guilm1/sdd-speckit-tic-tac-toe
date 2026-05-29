import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initGame } from '../../src/main.js';

function setup() {
  localStorage.clear();
  const root = document.createElement('div');
  document.body.appendChild(root);
  initGame(root);
  return root;
}

function cells(root) {
  return Array.from(root.querySelectorAll('.cell'));
}

function selectMode(root, value) {
  const input = root.querySelector(`input[name="mode"][value="${value}"]`);
  input.checked = true;
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

describe('UI wiring (US1/US2)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('renders the logo and the two mode options', () => {
    const root = setup();
    const logo = root.querySelector('.app__logo');
    expect(logo).not.toBeNull();
    expect(logo.getAttribute('alt')).toBe('purp');
    const modeValues = Array.from(root.querySelectorAll('input[name="mode"]')).map((i) => i.value);
    expect(modeValues).toEqual(['two-player', 'vs-computer']);
  });

  it('lets the computer respond after the human move in vs-computer mode', () => {
    const root = setup();
    selectMode(root, 'vs-computer');

    cells(root)[0].click(); // human X at 0
    expect(cells(root)[0].textContent).toBe('X');

    // Board is locked while the computer "thinks".
    expect(cells(root).every((c) => c.disabled)).toBe(true);

    vi.runAllTimers(); // let the scheduled computer move fire

    const marks = cells(root).map((c) => c.textContent);
    expect(marks.filter((m) => m === 'O')).toHaveLength(1);
    expect(marks.filter((m) => m === 'X')).toHaveLength(1);
  });

  it('resets to a fresh game when switching modes', () => {
    const root = setup();
    cells(root)[0].click(); // two-player: X at 0
    expect(cells(root)[0].textContent).toBe('X');

    selectMode(root, 'vs-computer'); // switching resets
    expect(cells(root).every((c) => c.textContent === '')).toBe(true);
  });
});

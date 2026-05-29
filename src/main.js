import './styles.css';
import { createInitialState, applyMove, reset, statusMessage } from './game.js';
import { loadState, saveState } from './storage.js';
import { chooseComputerMove } from './ai.js';

const LOGO_URL = '/purp.png';
const COMPUTER_SYMBOL = 'O';
const HUMAN_SYMBOL = 'X';
const COMPUTER_MOVE_DELAY_MS = 350;

const POSITION_LABELS = [
  'top left',
  'top center',
  'top right',
  'middle left',
  'center',
  'middle right',
  'bottom left',
  'bottom center',
  'bottom right',
];

function cellLabel(value, index) {
  const occupant = value ? `marked ${value}` : 'empty';
  return `${POSITION_LABELS[index]}, ${occupant}`;
}

/**
 * Mode-aware status text. Two-player reuses the pure statusMessage; vs-computer
 * speaks in terms of "you" and "the computer".
 */
function statusFor(state, mode, busy) {
  if (mode !== 'vs-computer') return statusMessage(state);

  if (state.status === 'won') {
    return state.winner === HUMAN_SYMBOL ? 'You win!' : 'Computer wins!';
  }
  if (state.status === 'draw') return "It's a draw";
  if (busy || state.currentPlayer === COMPUTER_SYMBOL) return "Computer's turn";
  return 'Your turn';
}

/**
 * Build the static DOM once and return references to the dynamic parts.
 */
function buildUI(root) {
  root.innerHTML = '';

  const header = document.createElement('header');
  header.className = 'app__header';

  // const logo = document.createElement('img');
  // logo.className = 'app__logo';
  // logo.src = LOGO_URL;
  // logo.alt = 'purp';
  // logo.width = 48;
  // logo.height = 48;

  const title = document.createElement('h1');
  title.className = 'app__title';
  title.textContent = 'Tic-Tac-Toe';

  header.append(/*logo,*/ title);

  const modes = document.createElement('div');
  modes.className = 'modes';
  modes.setAttribute('role', 'radiogroup');
  modes.setAttribute('aria-label', 'Game mode');

  const modeOptions = [
    { value: 'two-player', label: 'Two Player' },
    { value: 'vs-computer', label: 'Vs Computer' },
  ];
  const modeInputs = modeOptions.map(({ value, label }) => {
    const wrapper = document.createElement('label');
    wrapper.className = 'modes__option';

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'mode';
    input.value = value;

    const text = document.createElement('span');
    text.textContent = label;

    wrapper.append(input, text);
    modes.appendChild(wrapper);
    return input;
  });

  const status = document.createElement('p');
  status.className = 'status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');

  const board = document.createElement('div');
  board.className = 'board';
  board.setAttribute('role', 'grid');
  board.setAttribute('aria-label', 'Tic-Tac-Toe board');

  const cells = [];
  for (let i = 0; i < 9; i += 1) {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'cell';
    cell.dataset.index = String(i);
    board.appendChild(cell);
    cells.push(cell);
  }

  const resetButton = document.createElement('button');
  resetButton.type = 'button';
  resetButton.className = 'reset';
  resetButton.textContent = 'Reset';

  root.append(header, modes, status, board, resetButton);
  return { status, cells, resetButton, modeInputs };
}

/**
 * Render the current state into the prebuilt UI.
 */
function render(ui, state, mode, busy) {
  ui.status.textContent = statusFor(state, mode, busy);
  ui.status.classList.toggle('status--over', state.status !== 'in_progress');

  const locked = state.status !== 'in_progress' || busy;
  ui.cells.forEach((cell, index) => {
    const value = state.board[index];
    cell.textContent = value ?? '';
    cell.disabled = value !== null || locked;
    cell.setAttribute('aria-label', cellLabel(value, index));
    const isWinning = state.winningLine?.includes(index) ?? false;
    cell.classList.toggle('cell--win', isWinning);
  });

  ui.modeInputs.forEach((input) => {
    input.checked = input.value === mode;
  });
}

export function initGame(root) {
  const ui = buildUI(root);
  let state = loadState() ?? createInitialState();
  let mode = 'two-player';
  let busy = false;
  let pendingTimer = null;

  const draw = () => render(ui, state, mode, busy);

  const commit = (next) => {
    state = next;
    saveState(state);
    draw();
  };

  const cancelPending = () => {
    if (pendingTimer !== null) {
      clearTimeout(pendingTimer);
      pendingTimer = null;
    }
    busy = false;
  };

  const scheduleComputerMove = () => {
    busy = true;
    draw(); // lock the board and show the computer's turn
    pendingTimer = setTimeout(() => {
      pendingTimer = null;
      const index = chooseComputerMove(state.board, COMPUTER_SYMBOL);
      busy = false;
      commit(applyMove(state, index));
    }, COMPUTER_MOVE_DELAY_MS);
  };

  const handleHumanMove = (index) => {
    if (busy) return; // ignore input during the computer's turn
    const next = applyMove(state, index);
    if (next === state) return;
    commit(next);
    if (
      mode === 'vs-computer' &&
      next.status === 'in_progress' &&
      next.currentPlayer === COMPUTER_SYMBOL
    ) {
      scheduleComputerMove();
    }
  };

  const setMode = (nextMode) => {
    if (nextMode === mode) return;
    mode = nextMode;
    cancelPending();
    commit(reset()); // mode change starts a fresh game
  };

  ui.cells.forEach((cell) => {
    cell.addEventListener('click', () => handleHumanMove(Number(cell.dataset.index)));
  });

  ui.resetButton.addEventListener('click', () => {
    cancelPending();
    commit(reset());
  });

  ui.modeInputs.forEach((input) => {
    input.addEventListener('change', () => {
      if (input.checked) setMode(input.value);
    });
  });

  draw();
  return ui;
}

const appRoot = document.getElementById('app');
if (appRoot) {
  initGame(appRoot);
}

// localStorage persistence for in-progress game state.
// Contract: specs/001-tic-tac-toe/contracts/storage-contract.md
// Reads are defensive: missing or corrupted data never throws — callers get
// null and start a fresh game. Writes never throw (private-mode/quota safe).

const STORAGE_KEY = 'ttt:state:v1';

const SYMBOLS = new Set(['X', 'O']);
const STATUSES = new Set(['in_progress', 'won', 'draw']);

function isValidState(value) {
  if (typeof value !== 'object' || value === null) return false;
  if (!Array.isArray(value.board) || value.board.length !== 9) return false;
  if (!value.board.every((c) => c === null || SYMBOLS.has(c))) return false;
  if (!SYMBOLS.has(value.currentPlayer)) return false;
  if (!STATUSES.has(value.status)) return false;
  if (value.status === 'won' && !SYMBOLS.has(value.winner)) return false;
  if (value.status !== 'won' && value.winner !== null) return false;
  if (value.winningLine !== null && !Array.isArray(value.winningLine)) return false;
  return true;
}

/**
 * Load persisted game state. Returns null when absent or invalid.
 */
export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isValidState(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Persist game state. Silently no-ops if storage is unavailable.
 */
export function saveState(game) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
  } catch {
    // Persistence is best-effort; gameplay continues in memory.
  }
}

/**
 * Remove persisted game state.
 */
export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore — nothing to clean up if storage is unavailable.
  }
}

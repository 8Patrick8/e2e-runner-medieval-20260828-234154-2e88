const HIGHSCORE_KEY = 'highscore';

export function loadHighscore() {
  let raw = null;
  try {
    raw = globalThis.localStorage?.getItem(HIGHSCORE_KEY) ?? null;
  } catch {
    return 0;
  }
  if (raw === null) {
    return 0;
  }
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0) {
    return 0;
  }
  return Math.floor(value);
}

export function saveHighscore(v) {
  const value = Math.floor(Number(v));
  if (!Number.isFinite(value) || value < 0) {
    return;
  }
  try {
    globalThis.localStorage?.setItem(HIGHSCORE_KEY, String(value));
  } catch {
    // Storage may be unavailable (private mode, quota). The highscore still
    // lives in state for the current run.
  }
}

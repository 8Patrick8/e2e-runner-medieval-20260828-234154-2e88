import { state } from './state.js';

const JUMP_KEYS = new Set(['Space', 'ArrowUp', 'KeyW']);

export function initInput({ onJump, onActivate }) {
  function onKeyDown(e) {
    if (!JUMP_KEYS.has(e.code)) {
      return;
    }
    e.preventDefault();
    if (e.repeat) {
      return;
    }
    if (state.phase === 'playing') {
      onJump();
    } else {
      onActivate();
    }
  }

  let lastActivate = 0;

  function activate() {
    const now = Date.now();
    if (now - lastActivate < 50) {
      return;
    }
    lastActivate = now;
    onActivate();
  }

  function onPointerDown(e) {
    e.preventDefault();
    activate();
  }

  function onTouchStart(e) {
    e.preventDefault();
    activate();
  }

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('touchstart', onTouchStart, { passive: false });
}

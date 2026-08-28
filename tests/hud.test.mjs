import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { CONFIG } from '../src/config.js';
import { state } from '../src/state.js';
import { resetHud, updateHud, finalizeScore } from '../src/hud.js';
import { loadHighscore } from '../src/storage.js';

function makeStorage() {
  const data = new Map();
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => {
      data.set(key, String(value));
    },
    data,
  };
}

beforeEach(() => {
  globalThis.localStorage = makeStorage();
  state.distance = 0;
  state.score = 0;
  state.highscore = 0;
});

test('updateHud floors score from distance', () => {
  state.distance = 123.7;
  updateHud(0.016);
  assert.equal(state.score, Math.floor(123.7 * CONFIG.SCORE_PER_PX));
});

test('resetHud zeroes the score', () => {
  state.score = 999;
  resetHud();
  assert.equal(state.score, 0);
});

test('finalizeScore keeps the existing highscore when the run is lower', () => {
  state.highscore = 500;
  state.score = 100;
  finalizeScore();
  assert.equal(state.highscore, 500);
  assert.equal(loadHighscore(), 500);
});

test('finalizeScore updates and persists a new record', () => {
  state.highscore = 100;
  state.score = 250;
  finalizeScore();
  assert.equal(state.highscore, 250);
  assert.equal(loadHighscore(), 250);
});

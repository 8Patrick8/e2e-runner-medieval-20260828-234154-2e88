import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { loadHighscore, saveHighscore } from '../src/storage.js';

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

let storage;

beforeEach(() => {
  storage = makeStorage();
  globalThis.localStorage = storage;
});

test('loadHighscore returns 0 when no highscore is stored', () => {
  assert.equal(loadHighscore(), 0);
});

test('loadHighscore returns 0 for invalid stored values', () => {
  for (const bad of ['abc', '-5', 'NaN', 'Infinity', '']) {
    storage.setItem('highscore', bad);
    assert.equal(loadHighscore(), 0, `value ${JSON.stringify(bad)} -> 0`);
  }
});

test('loadHighscore reads a stored numeric highscore as a number', () => {
  storage.setItem('highscore', '42');
  assert.equal(loadHighscore(), 42);
});

test('saveHighscore stores only the number under the highscore key', () => {
  saveHighscore(120);
  assert.equal(storage.data.get('highscore'), '120');
  assert.equal(storage.data.size, 1, 'no other keys are written');
});

test('saveHighscore ignores non-numeric input without writing', () => {
  saveHighscore('nope');
  assert.equal(storage.data.size, 0);
});

test('saveHighscore round-trips through loadHighscore', () => {
  saveHighscore(1337);
  assert.equal(loadHighscore(), 1337);
});

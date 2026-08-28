import { test } from 'node:test';
import assert from 'node:assert/strict';
import { state } from '../src/state.js';
import { drawStartScreen } from '../src/startScreen.js';

function createMockCtx() {
  const calls = { fillText: [], fill: 0, stroke: 0 };
  const ctx = {
    save() {},
    restore() {},
    beginPath() {},
    moveTo() {},
    arcTo() {},
    closePath() {},
    fill() {
      calls.fill += 1;
    },
    stroke() {
      calls.stroke += 1;
    },
    fillText(text) {
      calls.fillText.push(text);
    },
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    font: '',
    textAlign: '',
    textBaseline: '',
  };
  return { ctx, calls };
}

test('drawStartScreen draws title, prompt and highscore via fillText', () => {
  const { ctx, calls } = createMockCtx();

  state.highscore = 42;
  drawStartScreen(ctx);

  assert.ok(
    calls.fillText.some((t) => t.includes('Ritterlauf')),
    'title is drawn'
  );
  assert.ok(
    calls.fillText.some((t) => t.includes('Leertaste') && t.includes('Start')),
    'start prompt is drawn'
  );
  assert.ok(
    calls.fillText.some((t) => t.includes('Highscore') && t.includes('42')),
    'highscore reflects state.highscore'
  );
});

test('drawStartScreen renders a backdrop card', () => {
  const { ctx, calls } = createMockCtx();
  drawStartScreen(ctx);

  assert.ok(calls.fill >= 1, 'card background is filled');
  assert.ok(calls.stroke >= 1, 'card border is stroked');
});

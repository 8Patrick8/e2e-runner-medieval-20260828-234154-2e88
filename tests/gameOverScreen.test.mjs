import { test } from 'node:test';
import assert from 'node:assert/strict';
import { state } from '../src/state.js';
import { drawGameOverScreen } from '../src/gameOverScreen.js';

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

test('drawGameOverScreen draws Game Over, score, highscore and restart prompt', () => {
  const { ctx, calls } = createMockCtx();

  state.score = 123;
  state.highscore = 456;
  drawGameOverScreen(ctx);

  assert.ok(calls.fillText.some((t) => t.includes('Game Over')), 'title is drawn');
  assert.ok(
    calls.fillText.some((t) => t.includes('Punkte') && t.includes('123')),
    'score reflects state.score'
  );
  assert.ok(
    calls.fillText.some((t) => t.includes('Highscore') && t.includes('456')),
    'highscore reflects state.highscore'
  );
  assert.ok(
    calls.fillText.some((t) => t.includes('Neustart')),
    'restart prompt is drawn'
  );
});

test('drawGameOverScreen renders a backdrop card', () => {
  const { ctx, calls } = createMockCtx();
  drawGameOverScreen(ctx);

  assert.ok(calls.fill >= 1, 'card background is filled');
  assert.ok(calls.stroke >= 1, 'card border is stroked');
});

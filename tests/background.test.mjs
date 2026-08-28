import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONFIG } from '../src/config.js';
import { state } from '../src/state.js';
import { resetBackground, updateBackground, drawBackground } from '../src/background.js';

function recordingCtx() {
  const calls = { fillRect: [] };
  const noop = () => {};
  const ctx = {
    fillStyle: '#000',
    strokeStyle: '#000',
    lineWidth: 1,
    fillRect(x, y, w, h) {
      calls.fillRect.push({ x, y, w, h });
    },
    strokeRect: noop,
    rect: noop,
    beginPath: noop,
    moveTo: noop,
    lineTo: noop,
    quadraticCurveTo: noop,
    arc: noop,
    closePath: noop,
    fill: noop,
    stroke: noop,
  };
  return { ctx, calls };
}

const CASTLE_TILE = 320;

function castleWallXs(calls) {
  return calls.fillRect
    .filter((r) => r.w === CASTLE_TILE && r.h === 34)
    .map((r) => r.x)
    .sort((a, b) => a - b);
}

function coversWidth(xs, tileWidth) {
  if (xs.length === 0) return false;
  if (xs[0] > 0) return false;
  return xs[xs.length - 1] + tileWidth >= CONFIG.WIDTH;
}

test('background exposes the three contract functions', () => {
  assert.equal(typeof resetBackground, 'function');
  assert.equal(typeof updateBackground, 'function');
  assert.equal(typeof drawBackground, 'function');
});

test('resetBackground draws the castle layer at the origin and covers the full width', () => {
  state.speed = 0;
  resetBackground();
  const { ctx, calls } = recordingCtx();
  drawBackground(ctx);
  const xs = castleWallXs(calls);
  assert.ok(coversWidth(xs, CASTLE_TILE), 'castle tiles cover the full width seamlessly');
  assert.ok(Math.abs(xs[0]) < 1e-6, 'first castle tile starts at x=0 after reset');
});

test('updateBackground scrolls the castle layer left and wraps within one tile', () => {
  state.speed = 300;
  resetBackground();

  const first = recordingCtx();
  drawBackground(first.ctx);
  const before = castleWallXs(first.calls)[0];

  for (let i = 0; i < 60; i++) {
    updateBackground(1 / 60);
  }

  const second = recordingCtx();
  drawBackground(second.ctx);
  const afterXs = castleWallXs(second.calls);

  assert.ok(afterXs[0] < before, 'castle layer shifted left after update');
  assert.ok(afterXs[0] > -CASTLE_TILE, 'castle layer wrapped within a single tile');
  assert.ok(coversWidth(afterXs, CASTLE_TILE), 'castle layer still seamless after wrapping');
});

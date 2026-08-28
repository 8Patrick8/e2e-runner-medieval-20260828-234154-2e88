import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONFIG } from '../src/config.js';
import { state } from '../src/state.js';
import { resetObstacles, updateObstacles } from '../src/obstacles.js';

test('resetObstacles clears obstacles and arms a random spawn gap', () => {
  state.obstacles = [{ type: 'barrel', x: 0, y: 0, width: 1, height: 1 }];
  resetObstacles();
  assert.equal(state.obstacles.length, 0);
  assert.ok(
    state.spawnTimer >= CONFIG.SPAWN_MIN_GAP && state.spawnTimer <= CONFIG.SPAWN_MAX_GAP,
    `spawnTimer ${state.spawnTimer} inside gap range`
  );
});

test('updateObstacles spawns an obstacle off-screen at ground level', () => {
  resetObstacles();
  state.speed = 0;
  state.spawnTimer = 0;
  updateObstacles(0.01);
  assert.equal(state.obstacles.length, 1);

  const o = state.obstacles[0];
  assert.ok(o.type === 'barrel' || o.type === 'fence');
  const dims = o.type === 'barrel' ? CONFIG.BARREL : CONFIG.FENCE;
  assert.equal(o.x, state.width + dims.width);
  assert.equal(o.y, state.groundY - dims.height);
  assert.equal(o.width, dims.width);
  assert.equal(o.height, dims.height);
  assert.ok(state.spawnTimer >= CONFIG.SPAWN_MIN_GAP && state.spawnTimer <= CONFIG.SPAWN_MAX_GAP);
});

test('updateObstacles moves obstacles left and removes them past the left edge', () => {
  resetObstacles();
  state.speed = 300;
  state.obstacles.push({ type: 'barrel', x: 400, y: 0, width: 36, height: 40 });
  const before = state.obstacles[0].x;
  updateObstacles(0.1);
  assert.ok(Math.abs(state.obstacles[0].x - (before - 30)) < 1e-2);

  state.obstacles.push({ type: 'fence', x: -100, y: 0, width: 48, height: 44 });
  updateObstacles(0.01);
  const offscreen = state.obstacles.some((o) => o.x + o.width < 0);
  assert.equal(offscreen, false, 'obstacles past the left edge are removed');
});

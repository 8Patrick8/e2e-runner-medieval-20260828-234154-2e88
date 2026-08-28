import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONFIG } from '../src/config.js';
import { state } from '../src/state.js';

test('CONFIG contains all contract fields', () => {
  const scalars = {
    WIDTH: 800,
    HEIGHT: 450,
    GROUND_Y: 390,
    GRAVITY: 2200,
    JUMP_VELOCITY: -720,
    BASE_SPEED: 260,
    MAX_SPEED: 700,
    SPEED_RAMP: 12,
    SPAWN_MIN_GAP: 0.9,
    SPAWN_MAX_GAP: 1.8,
    PLAYER_X: 120,
    PLAYER_WIDTH: 44,
    PLAYER_HEIGHT: 64,
    SCORE_PER_PX: 0.1,
  };
  for (const [key, value] of Object.entries(scalars)) {
    assert.equal(CONFIG[key], value, `CONFIG.${key}`);
  }
  assert.equal(CONFIG.BARREL.width, 36, 'CONFIG.BARREL.width');
  assert.equal(CONFIG.BARREL.height, 40, 'CONFIG.BARREL.height');
  assert.equal(CONFIG.FENCE.width, 48, 'CONFIG.FENCE.width');
  assert.equal(CONFIG.FENCE.height, 44, 'CONFIG.FENCE.height');
});

test('state contains all contract fields', () => {
  assert.equal(state.phase, 'start');
  assert.equal(state.width, 800);
  assert.equal(state.height, 450);
  assert.equal(state.groundY, 390);
  assert.equal(state.distance, 0);
  assert.equal(state.speed, 0);
  assert.equal(state.score, 0);
  assert.equal(state.highscore, 0);
  assert.ok(Array.isArray(state.obstacles), 'state.obstacles is an array');
  assert.equal(state.spawnTimer, 0);

  const p = state.player;
  assert.equal(p.x, 120);
  assert.equal(p.y, 0);
  assert.equal(p.vy, 0);
  assert.equal(p.width, 44);
  assert.equal(p.height, 64);
  assert.equal(p.onGround, true);
  assert.equal(p.legPhase, 0);
});

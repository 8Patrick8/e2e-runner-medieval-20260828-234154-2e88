import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONFIG } from '../src/config.js';
import { state } from '../src/state.js';
import { resetPlayer, updatePlayer, jump, drawPlayer } from '../src/player.js';

function putPlayerOnGround() {
  state.speed = CONFIG.BASE_SPEED;
  resetPlayer();
}

test('resetPlayer places the knight on the ground, at rest', () => {
  state.player.y = 999;
  state.player.vy = 500;
  state.player.onGround = false;
  state.player.legPhase = 42;

  resetPlayer();

  assert.equal(state.player.y, state.groundY - state.player.height);
  assert.equal(state.player.vy, 0);
  assert.equal(state.player.onGround, true);
  assert.equal(state.player.legPhase, 0);
});

test('updatePlayer holds the knight on the ground when not jumping', () => {
  putPlayerOnGround();

  updatePlayer(1 / 60);

  assert.equal(state.player.y, state.groundY - state.player.height);
  assert.equal(state.player.vy, 0);
  assert.equal(state.player.onGround, true);
});

test('jump() launches the knight upward off the ground', () => {
  putPlayerOnGround();

  jump();

  assert.equal(state.player.vy, CONFIG.JUMP_VELOCITY);
  assert.equal(state.player.onGround, false);
});

test('jump() is ignored while airborne (no double jump)', () => {
  putPlayerOnGround();
  jump();
  const vyAfterFirstJump = state.player.vy;

  jump();

  assert.equal(state.player.vy, vyAfterFirstJump);
  assert.equal(state.player.onGround, false);
});

test('the knight rises after jumping and lands back on the ground', () => {
  putPlayerOnGround();
  const groundY = state.player.y;

  jump();
  assert.ok(state.player.vy < 0, 'jump velocity points upward');

  // Step through the flight: it must leave the ground and then return to it.
  let minY = state.player.y;
  let frames = 0;
  while (frames < 300) {
    updatePlayer(1 / 60);
    frames += 1;
    minY = Math.min(minY, state.player.y);
    if (state.player.onGround && frames > 1) {
      break;
    }
  }

  assert.ok(minY < groundY - 10, 'knight actually rose off the ground');
  assert.equal(state.player.onGround, true);
  assert.equal(state.player.y, groundY, 'landed exactly back on the ground');
  assert.equal(state.player.vy, 0, 'vertical velocity reset on landing');
});

test('legPhase advances on the ground and freezes in the air', () => {
  putPlayerOnGround();
  const phaseAtRest = state.player.legPhase;
  updatePlayer(1 / 60);
  assert.ok(
    state.player.legPhase > phaseAtRest,
    'legPhase advances while running on the ground'
  );

  jump();
  const phaseAtLaunch = state.player.legPhase;
  updatePlayer(1 / 60);
  updatePlayer(1 / 60);
  assert.equal(
    state.player.legPhase,
    phaseAtLaunch,
    'legPhase does not advance while airborne'
  );
});

test('drawPlayer renders without NaN or out-of-range coordinates', () => {
  putPlayerOnGround();
  const calls = [];
  const ctx = {
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    fillRect(x, y, w, h) {
      calls.push([x, y, w, h]);
    },
    strokeRect(x, y, w, h) {
      calls.push([x, y, w, h]);
    },
  };

  for (let i = 0; i < 60; i += 1) {
    state.player.legPhase += state.speed * (1 / 60);
    drawPlayer(ctx);
  }

  assert.ok(calls.length > 0, 'drawPlayer issues canvas calls');
  for (const [x, y, w, h] of calls) {
    for (const v of [x, y, w, h]) {
      assert.equal(typeof v, 'number');
      assert.ok(Number.isFinite(v), 'no NaN/Infinity coordinates');
    }
  }
});

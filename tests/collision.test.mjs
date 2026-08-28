import { test } from 'node:test';
import assert from 'node:assert/strict';
import { state } from '../src/state.js';
import { checkCollision } from '../src/collision.js';

function setPlayer(x, y, w, h) {
  state.player.x = x;
  state.player.y = y;
  state.player.width = w;
  state.player.height = h;
}

test('checkCollision returns false when there are no obstacles', () => {
  state.obstacles = [];
  setPlayer(120, 0, 44, 64);
  assert.equal(checkCollision(), false);
});

test('checkCollision returns true when the player overlaps an obstacle', () => {
  state.obstacles = [{ type: 'barrel', x: 100, y: 0, width: 36, height: 40 }];
  setPlayer(120, 0, 44, 64);
  assert.equal(checkCollision(), true);
});

test('checkCollision returns false when the obstacle is to the right of the player', () => {
  state.obstacles = [{ type: 'barrel', x: 400, y: 0, width: 36, height: 40 }];
  setPlayer(120, 0, 44, 64);
  assert.equal(checkCollision(), false);
});

test('checkCollision returns false when the player is fully above the obstacle', () => {
  state.obstacles = [{ type: 'fence', x: 120, y: 100, width: 48, height: 44 }];
  setPlayer(120, 0, 44, 64);
  assert.equal(checkCollision(), false);
});

test('checkCollision returns true for the first overlapping obstacle among several', () => {
  state.obstacles = [
    { type: 'fence', x: 700, y: 0, width: 48, height: 44 },
    { type: 'barrel', x: 150, y: 0, width: 36, height: 40 },
  ];
  setPlayer(120, 0, 44, 64);
  assert.equal(checkCollision(), true);
});

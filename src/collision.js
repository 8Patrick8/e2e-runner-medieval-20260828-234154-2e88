import { state } from './state.js';

export function checkCollision() {
  const p = state.player;
  const playerLeft = p.x;
  const playerRight = p.x + p.width;
  const playerTop = p.y;
  const playerBottom = p.y + p.height;

  for (const obstacle of state.obstacles) {
    const overlapX = playerRight > obstacle.x && playerLeft < obstacle.x + obstacle.width;
    const overlapY = playerBottom > obstacle.y && playerTop < obstacle.y + obstacle.height;
    if (overlapX && overlapY) {
      return true;
    }
  }
  return false;
}

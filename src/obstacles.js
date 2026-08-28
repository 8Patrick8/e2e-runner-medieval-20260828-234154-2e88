import { CONFIG } from './config.js';
import { state } from './state.js';

const OUTLINE = '#10141a';
const BARREL_WOOD = '#8a5a34';
const BARREL_HOOP = '#3c2a1c';
const BARREL_HIGHLIGHT = '#c78b4f';
const FENCE_WOOD = '#9c6b3f';
const FENCE_POST = '#6f4a2c';
const FENCE_HIGHLIGHT = '#c8955f';

function randomGap() {
  return CONFIG.SPAWN_MIN_GAP + Math.random() * (CONFIG.SPAWN_MAX_GAP - CONFIG.SPAWN_MIN_GAP);
}

function spawnObstacle() {
  const isBarrel = Math.random() < 0.5;
  const dims = isBarrel ? CONFIG.BARREL : CONFIG.FENCE;
  state.obstacles.push({
    type: isBarrel ? 'barrel' : 'fence',
    x: state.width + dims.width,
    y: state.groundY - dims.height,
    width: dims.width,
    height: dims.height,
  });
}

export function resetObstacles() {
  state.obstacles = [];
  state.spawnTimer = randomGap();
}

export function updateObstacles(dt) {
  state.spawnTimer -= dt;
  if (state.spawnTimer <= 0) {
    spawnObstacle();
    state.spawnTimer = randomGap();
  }

  for (let i = state.obstacles.length - 1; i >= 0; i--) {
    const obstacle = state.obstacles[i];
    obstacle.x -= state.speed * dt;
    if (obstacle.x + obstacle.width < 0) {
      state.obstacles.splice(i, 1);
    }
  }
}

function roundedRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawBarrel(ctx, o) {
  const { x, y, width, height } = o;

  ctx.fillStyle = OUTLINE;
  roundedRect(ctx, x - 2, y - 2, width + 4, height + 4, 4);
  ctx.fill();

  ctx.fillStyle = BARREL_WOOD;
  roundedRect(ctx, x, y, width, height, 4);
  ctx.fill();

  const staveW = Math.max(4, Math.round(width / 6));
  ctx.fillStyle = BARREL_HIGHLIGHT;
  ctx.fillRect(x + 4, y + 4, staveW, height - 8);
  ctx.fillRect(x + width - 4 - staveW, y + 4, staveW, height - 8);

  const hoopH = Math.max(3, Math.round(height / 8));
  ctx.fillStyle = BARREL_HOOP;
  ctx.fillRect(x, y + hoopH, width, hoopH);
  ctx.fillRect(x, y + height - hoopH * 2, width, hoopH);
  ctx.fillRect(x, y + height - 3, width, 3);
}

function drawSlat(ctx, sx, y, w, h, tip) {
  ctx.fillStyle = OUTLINE;
  ctx.beginPath();
  ctx.moveTo(sx - 2, y + h + 2);
  ctx.lineTo(sx - 2, y + tip);
  ctx.lineTo(sx + w / 2, y - 2);
  ctx.lineTo(sx + w + 2, y + tip);
  ctx.lineTo(sx + w + 2, y + h + 2);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = FENCE_WOOD;
  ctx.beginPath();
  ctx.moveTo(sx, y + h);
  ctx.lineTo(sx, y + tip);
  ctx.lineTo(sx + w / 2, y);
  ctx.lineTo(sx + w, y + tip);
  ctx.lineTo(sx + w, y + h);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = FENCE_HIGHLIGHT;
  ctx.fillRect(sx + 2, y + tip + 2, Math.max(2, Math.round(w / 5)), h - tip - 4);
}

function drawFence(ctx, o) {
  const { x, y, width, height } = o;

  const slatCount = 2;
  const slatW = Math.floor(width / slatCount);
  const tip = Math.min(6, Math.round(slatW * 0.4));

  for (let i = 0; i < slatCount; i++) {
    drawSlat(ctx, x + i * slatW, y, slatW, height, tip);
  }

  const braceY = y + Math.round(height * 0.5);
  const braceH = Math.max(4, Math.round(height / 8));
  ctx.fillStyle = FENCE_POST;
  ctx.fillRect(x, braceY, width, braceH);

  ctx.fillStyle = FENCE_HIGHLIGHT;
  const nail = 3;
  for (let i = 0; i < slatCount; i++) {
    const nx = x + i * slatW + slatW / 2;
    ctx.fillRect(nx - nail / 2, braceY + braceH / 2 - nail / 2, nail, nail);
  }
}

export function drawObstacles(ctx) {
  for (const obstacle of state.obstacles) {
    if (obstacle.type === 'barrel') {
      drawBarrel(ctx, obstacle);
    } else {
      drawFence(ctx, obstacle);
    }
  }
}

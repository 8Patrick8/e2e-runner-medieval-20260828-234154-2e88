import { CONFIG } from './config.js';
import { state } from './state.js';

const CASTLE_FACTOR = 0.15;
const HILL_FACTOR = 0.4;

const CASTLE_TILE = 320;
const HILL_TILE = 240;

const COLOR_SKY = '#3b556d';
const COLOR_CASTLE_MASONRY = '#6e7b8f';
const COLOR_CASTLE_SHADOW = '#4b5667';
const COLOR_CASTLE_WINDOW = '#1b2330';
const COLOR_HILL_NEAR = '#5f7f4f';
const COLOR_HILL_SHADOW = '#46603c';
const COLOR_HILL_LIGHT = '#7fa653';
const COLOR_GROUND = '#4a3828';
const COLOR_GROUND_TOP = '#7fa653';
const COLOR_GROUND_LIGHT = '#9cc26a';
const COLOR_OUTLINE = '#10141a';

let castleOffset = 0;
let hillOffset = 0;

export function resetBackground() {
  castleOffset = 0;
  hillOffset = 0;
}

export function updateBackground(dt) {
  castleOffset = (castleOffset + state.speed * CASTLE_FACTOR * dt) % CASTLE_TILE;
  hillOffset = (hillOffset + state.speed * HILL_FACTOR * dt) % HILL_TILE;
}

export function drawBackground(ctx) {
  const groundY = state.groundY;
  drawSky(ctx, groundY);
  drawCastleLayer(ctx, groundY);
  drawHillLayer(ctx, groundY);
  drawGround(ctx, groundY);
}

function drawSky(ctx, groundY) {
  ctx.fillStyle = COLOR_SKY;
  ctx.fillRect(0, 0, CONFIG.WIDTH, groundY);
}

function drawGround(ctx, groundY) {
  ctx.fillStyle = COLOR_GROUND;
  ctx.fillRect(0, groundY, CONFIG.WIDTH, CONFIG.HEIGHT - groundY);
  ctx.fillStyle = COLOR_GROUND_TOP;
  ctx.fillRect(0, groundY, CONFIG.WIDTH, 8);
  ctx.fillStyle = COLOR_GROUND_LIGHT;
  ctx.fillRect(0, groundY, CONFIG.WIDTH, 2);
}

function drawRepeating(ctx, tileWidth, offset, drawTile) {
  let x = -(offset % tileWidth);
  while (x < CONFIG.WIDTH) {
    drawTile(ctx, x);
    x += tileWidth;
  }
}

function drawCastleLayer(ctx, groundY) {
  drawRepeating(ctx, CASTLE_TILE, castleOffset, (c, x) => drawCastleTile(c, x, groundY));
}

function drawHillLayer(ctx, groundY) {
  drawRepeating(ctx, HILL_TILE, hillOffset, (c, x) => drawHillTile(c, x, groundY));
}

function drawCastleTile(ctx, x, groundY) {
  ctx.fillStyle = COLOR_CASTLE_MASONRY;
  ctx.fillRect(x, groundY - 34, CASTLE_TILE, 34);

  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = COLOR_CASTLE_MASONRY;
    ctx.fillRect(x + i * 40, groundY - 46, 22, 12);
    ctx.fillStyle = COLOR_CASTLE_SHADOW;
    ctx.fillRect(x + i * 40 + 18, groundY - 46, 4, 12);
  }

  ctx.fillStyle = COLOR_CASTLE_SHADOW;
  ctx.fillRect(x, groundY - 10, CASTLE_TILE, 10);

  drawKeep(ctx, x + 128, groundY);
  drawTower(ctx, x + 24, groundY);
}

function drawKeep(ctx, x, groundY) {
  const w = 60;
  const h = 92;

  ctx.fillStyle = COLOR_CASTLE_MASONRY;
  ctx.fillRect(x, groundY - h, w, h);

  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = COLOR_CASTLE_MASONRY;
    ctx.fillRect(x + i * 20, groundY - h - 12, 13, 12);
    ctx.fillStyle = COLOR_CASTLE_SHADOW;
    ctx.fillRect(x + i * 20 + 9, groundY - h - 12, 4, 12);
  }

  ctx.fillStyle = COLOR_CASTLE_SHADOW;
  ctx.fillRect(x + w - 12, groundY - h, 12, h);

  ctx.fillStyle = COLOR_CASTLE_WINDOW;
  ctx.fillRect(x + 18, groundY - h + 24, 24, 30);
  ctx.fillStyle = COLOR_CASTLE_MASONRY;
  ctx.fillRect(x + 29, groundY - h + 24, 2, 30);
  ctx.fillRect(x + 18, groundY - h + 38, 24, 2);

  ctx.strokeStyle = COLOR_OUTLINE;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, groundY - h, w, h);
}

function drawTower(ctx, x, groundY) {
  const cx = x + 20;
  const r = 17;
  const top = groundY - 66;

  ctx.fillStyle = COLOR_CASTLE_MASONRY;
  ctx.beginPath();
  ctx.rect(cx - r, top, r * 2, groundY - top);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, top, r, Math.PI, 0);
  ctx.fill();

  ctx.fillStyle = COLOR_CASTLE_SHADOW;
  ctx.fillRect(cx + r - 7, top, 7, groundY - top);

  ctx.fillStyle = COLOR_CASTLE_SHADOW;
  ctx.beginPath();
  ctx.moveTo(cx - r - 3, top);
  ctx.lineTo(cx, top - 24);
  ctx.lineTo(cx + r + 3, top);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = COLOR_CASTLE_WINDOW;
  ctx.fillRect(cx - 4, top + 20, 8, 14);

  ctx.strokeStyle = COLOR_OUTLINE;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, top, r, Math.PI, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - r, top);
  ctx.lineTo(cx - r, groundY);
  ctx.lineTo(cx + r, groundY);
  ctx.lineTo(cx + r, top);
  ctx.stroke();
}

function drawHillTile(ctx, x, groundY) {
  drawHill(ctx, x, 120, 52, groundY);
  drawHill(ctx, x + 120, 120, 68, groundY);
}

function drawHill(ctx, x, w, h, groundY) {
  hillPath(ctx, x, w, h, groundY);
  ctx.fillStyle = COLOR_HILL_NEAR;
  ctx.fill();
  ctx.strokeStyle = COLOR_OUTLINE;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x + w * 0.5, groundY - h);
  ctx.quadraticCurveTo(x + w * 0.75, groundY - h * 0.65, x + w, groundY);
  ctx.lineTo(x + w * 0.5, groundY);
  ctx.closePath();
  ctx.fillStyle = COLOR_HILL_SHADOW;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(x + w * 0.12, groundY - h * 0.42);
  ctx.quadraticCurveTo(x + w * 0.35, groundY - h * 0.95, x + w * 0.5, groundY - h);
  ctx.strokeStyle = COLOR_HILL_LIGHT;
  ctx.lineWidth = 4;
  ctx.stroke();
}

function hillPath(ctx, x, w, h, groundY) {
  ctx.beginPath();
  ctx.moveTo(x, groundY);
  ctx.quadraticCurveTo(x + w * 0.25, groundY - h * 0.65, x + w * 0.5, groundY - h);
  ctx.quadraticCurveTo(x + w * 0.75, groundY - h * 0.65, x + w, groundY);
  ctx.closePath();
}

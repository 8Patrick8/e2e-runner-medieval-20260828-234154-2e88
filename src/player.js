import { CONFIG } from './config.js';
import { state } from './state.js';

const ARMOR = '#aab4c2';
const ARMOR_SHADOW = '#5d6878';
const PLUME = '#c8472e';
const SKIN = '#e8c39e';
const OUTLINE = '#10141a';

// legPhase advances at state.speed (px/s), which starts at 260 and grows to
// 700 — far too fast to read as a leg cycle on its own. Scale it down so the
// stride stays visible (roughly the ~240 ms full cycle DESIGN.md asks for).
const LEG_CYCLE = 0.1;
const LEG_SWING = 6;

export function resetPlayer() {
  const p = state.player;
  p.y = state.groundY - p.height;
  p.vy = 0;
  p.onGround = true;
  p.legPhase = 0;
}

export function updatePlayer(dt) {
  const p = state.player;
  p.vy += CONFIG.GRAVITY * dt;
  p.y += p.vy * dt;

  if (p.y + p.height >= state.groundY) {
    p.y = state.groundY - p.height;
    p.vy = 0;
    p.onGround = true;
  } else {
    p.onGround = false;
  }

  if (p.onGround) {
    p.legPhase += state.speed * dt;
  }
}

export function jump() {
  const p = state.player;
  if (!p.onGround) {
    return;
  }
  p.vy = CONFIG.JUMP_VELOCITY;
  p.onGround = false;
}

function outlinedRect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = OUTLINE;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);
}

function drawLegs(ctx, x, y, frontSwing, backSwing) {
  // back leg (shadow tone) + boot
  outlinedRect(ctx, x + 10 + backSwing, y + 48, 10, 16, ARMOR_SHADOW);
  outlinedRect(ctx, x + 8 + backSwing, y + 61, 12, 3, OUTLINE);
  // front leg (light tone) + boot
  outlinedRect(ctx, x + 24 + frontSwing, y + 48, 10, 16, ARMOR);
  outlinedRect(ctx, x + 22 + frontSwing, y + 61, 12, 3, OUTLINE);
}

function drawBody(ctx, x, y) {
  // torso
  outlinedRect(ctx, x + 14, y + 14, 18, 34, ARMOR);
  // armor shading along the back
  ctx.fillStyle = ARMOR_SHADOW;
  ctx.fillRect(x + 14, y + 14, 5, 34);
  // belt
  ctx.fillStyle = ARMOR_SHADOW;
  ctx.fillRect(x + 14, y + 26, 18, 4);
  // shield on the leading arm
  outlinedRect(ctx, x + 28, y + 16, 14, 20, ARMOR_SHADOW);
  ctx.fillStyle = PLUME;
  ctx.fillRect(x + 32, y + 20, 6, 12);
}

function drawHelmet(ctx, x, y) {
  // red plume sweeping back from the crown
  ctx.fillStyle = PLUME;
  ctx.fillRect(x + 6, y + 1, 6, 5);
  ctx.fillRect(x + 10, y + 0, 5, 6);
  ctx.fillRect(x + 13, y + 0, 6, 5);
  // helmet dome
  outlinedRect(ctx, x + 12, y + 4, 20, 12, ARMOR);
  // shading on the back of the helmet
  ctx.fillStyle = ARMOR_SHADOW;
  ctx.fillRect(x + 12, y + 4, 5, 12);
  // face opening (skin) facing forward
  outlinedRect(ctx, x + 24, y + 8, 8, 5, SKIN);
}

export function drawPlayer(ctx) {
  const p = state.player;
  const x = p.x;
  const y = p.y;

  const swing = Math.sin(p.legPhase * LEG_CYCLE);
  const frontSwing = swing * LEG_SWING;
  const backSwing = -swing * LEG_SWING;

  drawLegs(ctx, x, y, frontSwing, backSwing);
  drawBody(ctx, x, y);
  drawHelmet(ctx, x, y);
}

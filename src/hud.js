import { CONFIG } from './config.js';
import { state } from './state.js';
import { saveHighscore } from './storage.js';

const HUD_FONT = "'Courier New', ui-monospace, Menlo, Consolas, monospace";
const HUD_COLOR = '#f4ecd8';
const HUD_OUTLINE = '#10141a';
const HUD_SCRIM = 'rgba(15, 20, 25, 0.45)';
const HUD_FONT_SIZE = 18;
const HUD_MARGIN = 12;
const HUD_PADDING_X = 12;
const HUD_PADDING_Y = 8;

export function resetHud() {
  state.score = 0;
}

export function updateHud(dt) {
  state.score = Math.floor(state.distance * CONFIG.SCORE_PER_PX);
}

export function finalizeScore() {
  const current = Math.floor(state.score);
  const highscore = Math.max(current, state.highscore);
  state.highscore = highscore;
  saveHighscore(highscore);
}

function drawLabel(ctx, text, x, y, align) {
  ctx.font = `700 ${HUD_FONT_SIZE}px ${HUD_FONT}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'top';

  const width = ctx.measureText(text).width;
  const height = HUD_FONT_SIZE;

  let barX;
  if (align === 'left') {
    barX = x - HUD_PADDING_X;
  } else if (align === 'right') {
    barX = x - width - HUD_PADDING_X;
  } else {
    barX = x - width / 2 - HUD_PADDING_X;
  }

  ctx.fillStyle = HUD_SCRIM;
  ctx.fillRect(barX, y - HUD_PADDING_Y, width + HUD_PADDING_X * 2, height + HUD_PADDING_Y * 2);

  ctx.lineWidth = 2;
  ctx.strokeStyle = HUD_OUTLINE;
  ctx.strokeText(text, x, y);

  ctx.fillStyle = HUD_COLOR;
  ctx.fillText(text, x, y);
}

export function drawHud(ctx) {
  drawLabel(ctx, `Score: ${state.score}`, HUD_MARGIN, HUD_MARGIN, 'left');
  drawLabel(
    ctx,
    `Highscore: ${state.highscore}`,
    CONFIG.WIDTH - HUD_MARGIN,
    HUD_MARGIN,
    'right'
  );
}

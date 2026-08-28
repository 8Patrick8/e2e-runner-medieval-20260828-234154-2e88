import { CONFIG } from './config.js';
import { state } from './state.js';

const COLORS = {
  accent: '#c8472e',
  fg: '#f4ecd8',
  muted: '#8a94a3',
  outline: '#10141a',
  cardBg: 'rgba(15,20,25,0.72)',
  cardBorder: '#5b6b7f',
};

const FONT_FAMILY = "'Courier New', ui-monospace, Menlo, Consolas, monospace";

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function drawGameOverScreen(ctx) {
  const cx = CONFIG.WIDTH / 2;
  const cy = CONFIG.HEIGHT / 2;

  const cardWidth = 460;
  const cardHeight = 280;
  const cardX = cx - cardWidth / 2;
  const cardY = cy - cardHeight / 2;

  ctx.save();

  ctx.fillStyle = COLORS.cardBg;
  ctx.strokeStyle = COLORS.cardBorder;
  ctx.lineWidth = 1;
  roundedRect(ctx, cardX, cardY, cardWidth, cardHeight, 16);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = COLORS.accent;
  ctx.font = `700 24px ${FONT_FAMILY}`;
  ctx.fillText('Game Over', cx, cardY + 40);

  ctx.fillStyle = COLORS.fg;
  ctx.font = `700 28px ${FONT_FAMILY}`;
  ctx.fillText(`Punkte: ${Math.floor(state.score)}`, cx, cardY + 86);

  ctx.fillStyle = COLORS.muted;
  ctx.font = `400 16px ${FONT_FAMILY}`;
  ctx.fillText(`Highscore: ${Math.floor(state.highscore)}`, cx, cardY + 120);

  ctx.fillStyle = COLORS.fg;
  ctx.font = `400 16px ${FONT_FAMILY}`;
  ctx.fillText('Leertaste oder Klick/Touch zum Neustart', cx, cardY + 158);

  const btnWidth = 200;
  const btnHeight = 48;
  const btnX = cx - btnWidth / 2;
  const btnY = cardY + 200;

  ctx.fillStyle = COLORS.outline;
  roundedRect(ctx, btnX - 2, btnY - 2, btnWidth + 4, btnHeight + 4, 8);
  ctx.fill();

  ctx.fillStyle = COLORS.accent;
  roundedRect(ctx, btnX, btnY, btnWidth, btnHeight, 8);
  ctx.fill();

  ctx.fillStyle = COLORS.fg;
  ctx.font = `700 18px ${FONT_FAMILY}`;
  ctx.fillText('Neustart', cx, btnY + btnHeight / 2);

  ctx.restore();
}

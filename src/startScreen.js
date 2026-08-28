import { CONFIG } from './config.js';
import { state } from './state.js';

const COLORS = {
  fg: '#f4ecd8',
  muted: '#8a94a3',
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

export function drawStartScreen(ctx) {
  const cx = CONFIG.WIDTH / 2;
  const cy = CONFIG.HEIGHT / 2;

  const cardWidth = 460;
  const cardHeight = 200;
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

  ctx.fillStyle = COLORS.fg;
  ctx.font = `700 32px ${FONT_FAMILY}`;
  ctx.fillText('Ritterlauf', cx, cardY + 50);

  ctx.fillStyle = COLORS.muted;
  ctx.font = `400 16px ${FONT_FAMILY}`;
  ctx.fillText('Leertaste oder Klick/Touch zum Start', cx, cardY + 105);

  ctx.fillStyle = COLORS.fg;
  ctx.font = `700 18px ${FONT_FAMILY}`;
  ctx.fillText(`Highscore: ${Math.floor(state.highscore)}`, cx, cardY + 160);

  ctx.restore();
}

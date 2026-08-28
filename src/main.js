import { CONFIG } from './config.js';
import { state } from './state.js';
import * as storage from './storage.js';
import { initInput } from './input.js';
import { update, draw, onJump, onActivate } from './game.js';
import './style.css';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let scale = 1;
let offsetX = 0;
let offsetY = 0;

state.highscore = storage.loadHighscore();

function resize() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(window.innerWidth * dpr);
  canvas.height = Math.round(window.innerHeight * dpr);
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  scale = Math.min(canvas.width / CONFIG.WIDTH, canvas.height / CONFIG.HEIGHT);
  offsetX = (canvas.width - CONFIG.WIDTH * scale) / 2;
  offsetY = (canvas.height - CONFIG.HEIGHT * scale) / 2;
}

window.addEventListener('resize', resize);

initInput({ onJump, onActivate });

resize();

let lastTime = performance.now();

function loop(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;
  update(dt);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#1f2a3a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
  draw(ctx);

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

Object.defineProperty(window, '__TEST_API__', {
  get() {
    return {
      scene: {
        phase: state.phase,
        speed: state.speed,
        distance: state.distance,
        obstacleCount: state.obstacles.length,
      },
      player: { x: state.player.x, y: state.player.y },
      score: state.score,
    };
  },
});

import { CONFIG } from './config.js';
import { state } from './state.js';
import * as player from './player.js';
import * as background from './background.js';
import * as obstacles from './obstacles.js';
import * as collision from './collision.js';
import * as hud from './hud.js';
import * as startScreen from './startScreen.js';
import * as gameOverScreen from './gameOverScreen.js';

export function startGame() {
  resetRun();
  state.phase = 'playing';
  state.speed = CONFIG.BASE_SPEED;
  player.resetPlayer();
  obstacles.resetObstacles();
  background.resetBackground();
  hud.resetHud();
}

export function restartGame() {
  startGame();
}

function resetRun() {
  state.distance = 0;
  state.score = 0;
  state.speed = 0;
  state.obstacles = [];
  state.spawnTimer = 0;
  state.player.x = CONFIG.PLAYER_X;
  state.player.y = 0;
  state.player.vy = 0;
  state.player.onGround = true;
  state.player.legPhase = 0;
}

export function onJump() {
  if (state.phase === 'playing') {
    player.jump();
  }
}

export function onActivate() {
  if (state.phase === 'start') {
    startGame();
  } else if (state.phase === 'gameover') {
    restartGame();
  } else if (state.phase === 'playing') {
    player.jump();
  }
}

export function update(dt) {
  if (state.phase !== 'playing') {
    return;
  }
  state.distance += state.speed * dt;
  state.speed = Math.min(
    CONFIG.MAX_SPEED,
    CONFIG.BASE_SPEED + (state.distance * CONFIG.SPEED_RAMP) / 1000
  );
  state.score = state.distance * CONFIG.SCORE_PER_PX;
  player.updatePlayer(dt);
  obstacles.updateObstacles(dt);
  background.updateBackground(dt);
  hud.updateHud(dt);
  if (collision.checkCollision() === true) {
    state.phase = 'gameover';
    hud.finalizeScore();
  }
}

export function draw(ctx) {
  drawBaseScene(ctx);
  background.drawBackground(ctx);
  obstacles.drawObstacles(ctx);
  player.drawPlayer(ctx);
  hud.drawHud(ctx);
  if (state.phase === 'start') {
    startScreen.drawStartScreen(ctx);
  } else if (state.phase === 'gameover') {
    gameOverScreen.drawGameOverScreen(ctx);
  }
}

function drawBaseScene(ctx) {
  ctx.fillStyle = '#3b556d';
  ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.GROUND_Y);
  ctx.fillStyle = '#4a3828';
  ctx.fillRect(0, CONFIG.GROUND_Y, CONFIG.WIDTH, CONFIG.HEIGHT - CONFIG.GROUND_Y);
  ctx.fillStyle = '#7fa653';
  ctx.fillRect(0, CONFIG.GROUND_Y, CONFIG.WIDTH, 8);
}

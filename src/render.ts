import { Model, Moveable } from './types';
import { canvasWidth, canvasHeight, groundHeight } from './consts';

export function render(model: Model) {
  const { ctx, player, enemies, playTime, highScore } = model;

  const debug = document.getElementById('debug');
  if (debug && process.env.NODE_ENV === 'development') {
    debug.innerHTML = `<pre>${JSON.stringify(model, undefined, '  ')}</pre>`;
  }

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const bgGrad = ctx.createLinearGradient(0, 0, 0, 170);
  bgGrad.addColorStop(0, '#cff1ff');
  bgGrad.addColorStop(1, 'white');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight - groundHeight);

  ctx.fillStyle = 'green';
  ctx.fillRect(0, canvasHeight - groundHeight, canvasWidth, groundHeight);

  if (model.gameStarted || model.gameOver) {
    renderInfo(ctx, playTime, highScore);
  }

  model.playButton.style.display = !model.gameStarted ? 'block' : 'none';

  if (model.gameOver) {
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'red';
    ctx.fillText('Game Over', canvasWidth / 2, canvasHeight / 3);
  }

  if (!model.gameStarted || model.gameOver) {
    return;
  }

  renderMoveable(ctx, player);

  enemies.forEach(enemy => {
    renderMoveable(ctx, enemy);
  });
}

function renderInfo(
  ctx: CanvasRenderingContext2D,
  playTime: number,
  highScore: number
) {
  ctx.textAlign = 'left';

  ctx.font = '16px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText(`Survived: ${Math.round(playTime / 1000)} seconds`, 12, 20);

  if (highScore > 0) {
    ctx.font = '16px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`High Score: ${Math.round(highScore / 1000)} seconds`, 12, 40);
  }
}

function renderMoveable(ctx: CanvasRenderingContext2D, moveable: Moveable) {
  const { size, angle, x, y, color } = moveable;

  ctx.save();

  const playerX = canvasWidth / 2 + x;
  const playerY = canvasHeight - groundHeight - size - y;
  ctx.translate(playerX, playerY);
  ctx.rotate(angle);

  ctx.beginPath();
  ctx.arc(0, 0, size, 0, Math.PI * 2, true); // Outer circle
  ctx.fillStyle = color;
  ctx.fill();

  ctx.save();
  ctx.rotate(Math.PI / 4);
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.5, 0, Math.PI / 2, false); // Mouth (clockwise)
  ctx.strokeStyle = 'white';
  ctx.stroke();
  ctx.restore();

  ctx.beginPath();
  ctx.arc(
    size * (1 / 3) * -1,
    size * (1 / 3) * -1,
    size * 0.1,
    0,
    Math.PI * 2,
    true
  ); // Left eye
  ctx.strokeStyle = 'white';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(
    size * (1 / 3),
    size * (1 / 3) * -1,
    size * 0.1,
    0,
    Math.PI * 2,
    true
  ); // Left eye
  ctx.strokeStyle = 'white';
  ctx.stroke();

  ctx.restore();
}

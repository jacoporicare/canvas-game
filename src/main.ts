import { createCanvas } from './canvas';
import { engine, Handle } from './engine';
import { physics } from './physics';
import { render as renderCanvas } from './render';
import { Model } from './types';
import { canvasWidth, canvasHeight } from './consts';

import './styles.css';

const defaultMoveables = {
  player: {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    angle: 0,
    moveDir: 0,
    hSpeed: 0.5,
    vSpeed: 1,
    size: 25,
    color: 'blue',
  },
  enemies: [
    {
      x: -350,
      y: 0,
      vx: 0,
      vy: 0,
      angle: 0,
      moveDir: 0,
      hSpeed: 0.45,
      vSpeed: 0,
      size: 15,
      color: 'red',
    },
    {
      x: 350,
      y: 0,
      vx: 0,
      vy: 0,
      angle: 0,
      moveDir: 0,
      hSpeed: 0.5,
      vSpeed: 1.2,
      size: 20,
      color: 'red',
    },
  ],
};

function init(handle: Handle<Model>): Model {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  (document.getElementById('root') as HTMLDivElement).appendChild(canvas);
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const playButton = document.getElementById('playButton') as HTMLDivElement;

  handle<KeyboardEvent>(window, 'keydown', keyDown);
  handle<KeyboardEvent>(window, 'keyup', keyUp);
  handle(playButton, 'click', play);

  const { player, enemies } = defaultMoveables;

  return {
    ctx,
    playButton,
    gameStarted: false,
    gameOver: false,
    playTime: 0,
    highScore: 0,
    player,
    enemies,
  };
}

function update(dt: number, model: Model) {
  if (!model.gameStarted || model.gameOver) {
    return model;
  }

  const player = physics(dt, model.player);
  const enemies = model.enemies.map(e => {
    const enemy = physics(dt, e);
    const distance = Math.abs(enemy.x - player.x);
    let moveDir;

    if (enemy.y > 0) {
      moveDir = enemy.moveDir;
    } else {
      moveDir = enemy.x > player.x ? -1 : 1;
    }

    return {
      ...enemy,
      moveDir,
      vy: distance < 100 && enemy.vy === 0 ? enemy.vSpeed : enemy.vy,
    };
  });
  const gameOver = enemies.some(
    enemy =>
      Math.pow(enemy.x - player.x, 2) + Math.pow(player.y - enemy.y, 2) <=
      Math.pow(player.size + enemy.size, 2)
  );
  const playTime = model.playTime + dt;

  return {
    ...model,
    gameStarted: !gameOver,
    gameOver,
    playTime,
    highScore:
      gameOver && playTime > model.highScore ? playTime : model.highScore,
    player,
    enemies,
  };
}

function render(model: Model) {
  renderCanvas(model);
}

function play(model: Model): Model {
  const { player, enemies } = defaultMoveables;

  return {
    ...model,
    gameStarted: true,
    gameOver: false,
    playTime: 0,
    player,
    enemies,
  };
}

function keyDown(model: Model, event: KeyboardEvent): Model {
  switch (event.key) {
    case 'ArrowLeft':
      return {
        ...model,
        player: {
          ...model.player,
          moveDir: -1,
        },
      };

    case 'ArrowRight':
      return {
        ...model,
        player: {
          ...model.player,
          moveDir: 1,
        },
      };

    case 'ArrowUp':
      return {
        ...model,
        player: {
          ...model.player,
          vy: model.player.vy === 0 ? model.player.vSpeed : model.player.vy,
        },
      };

    case 'Enter':
      return play(model);

    default:
      return model;
  }
}

function keyUp(model: Model, event: KeyboardEvent): Model {
  switch (event.key) {
    case 'ArrowLeft':
    case 'ArrowRight':
      return {
        ...model,
        player: {
          ...model.player,
          moveDir: 0,
        },
      };

    default:
      return model;
  }
}

engine<Model>(init, update, render);

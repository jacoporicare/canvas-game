export interface Model {
  ctx: CanvasRenderingContext2D;
  playButton: HTMLDivElement;
  gameStarted: boolean;
  gameOver: boolean;
  playTime: number;
  highScore: number;
  player: Moveable;
  enemies: Moveable[];
}

export interface Moveable {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  moveDir: number;
  hSpeed: number;
  vSpeed: number;
  size: number;
  color: string;
}

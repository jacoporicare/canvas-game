import { Moveable } from './types';
import { canvasWidth } from './consts';

export function move(dt: number, obj: Moveable): Moveable {
  if (obj.moveDir === 0) {
    return obj;
  }

  return {
    ...obj,
    vx: Math.max(
      -obj.hSpeed,
      Math.min(obj.hSpeed, obj.vx + dt / 300 * obj.moveDir)
    ),
  };
}

export function friction(dt: number, obj: Moveable): Moveable {
  if (obj.vx === 0) {
    return obj;
  }

  const maxOrMin = obj.vx > 0 ? Math.max : Math.min;

  return {
    ...obj,
    vx: maxOrMin(0, obj.vx - dt / 2000 * (obj.vx > 0 ? 1 : -1)),
  };
}

export function gravity(dt: number, obj: Moveable): Moveable {
  return {
    ...obj,
    vy: obj.y > 0 ? obj.vy - dt / 300 : 0,
  };
}

export function motion(dt: number, obj: Moveable): Moveable {
  const xChange = dt * obj.vx;
  const circ = 2 * Math.PI * obj.size;
  const edgeX = canvasWidth / 2 - obj.size;

  return {
    ...obj,
    x: Math.max(-edgeX, Math.min(edgeX, obj.x + xChange)),
    y: Math.max(0, obj.y + dt * obj.vy),
    angle: (obj.angle + xChange / circ * 2 * Math.PI) % (2 * Math.PI),
  };
}

export function physics(dt: number, obj: Moveable): Moveable {
  return friction(dt, gravity(dt, motion(dt, move(dt, obj))));
}

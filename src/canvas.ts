export function getPixelRatio(): number {
  const ctx = document.createElement('canvas').getContext('2d') as any;
  const dpr: number = window.devicePixelRatio || 1;
  const bsr: number =
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio ||
    1;

  return dpr / bsr;
}

export function createCanvas(w: number, h: number): HTMLCanvasElement {
  const ratio = getPixelRatio();
  const can = document.createElement('canvas');
  can.width = w * ratio;
  can.height = h * ratio;
  can.style.width = w + 'px';
  can.style.height = h + 'px';
  const ctx = can.getContext('2d') as CanvasRenderingContext2D;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  return can;
}

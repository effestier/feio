export interface Shard {
  id: number;
  clipPath: string;
  cx: number;
  cy: number;
  dx: number;
  dy: number;
  rot: number;
  scale: number;
  opacity: number;
  delay: number;
  duration: number;
}

function nearestIndex(
  x: number,
  y: number,
  seeds: Array<[number, number]>,
): number {
  let min = Infinity;
  let idx = 0;
  for (let i = 0; i < seeds.length; i++) {
    const d = (x - seeds[i][0]) ** 2 + (y - seeds[i][1]) ** 2;
    if (d < min) {
      min = d;
      idx = i;
    }
  }
  return idx;
}

/**
 * Generates Voronoi-based shards that fragment the viewport.
 * Each shard is an irregular polygon that can be independently displaced.
 */
export function generateShards(count: number): Shard[] {
  const seeds: Array<[number, number]> = Array.from({ length: count }, () => [
    Math.random() * 100,
    Math.random() * 100,
  ]);

  const grid = 8;
  const cell = 100 / grid;
  const cellMap = new Map<number, Array<[number, number]>>();

  for (let r = 0; r < grid; r++) {
    for (let c = 0; c < grid; c++) {
      const cx = (c + 0.5) * cell;
      const cy = (r + 0.5) * cell;
      const idx = nearestIndex(cx, cy, seeds);
      if (!cellMap.has(idx)) cellMap.set(idx, []);
      cellMap.get(idx)!.push([c, r]);
    }
  }

  const jt = () => (Math.random() - 0.5) * 8;

  return Array.from(cellMap.entries()).map(([id, cells]) => {
    let minC = grid,
      maxC = -1,
      minR = grid,
      maxR = -1;
    for (const [c, r] of cells) {
      if (c < minC) minC = c;
      if (c > maxC) maxC = c;
      if (r < minR) minR = r;
      if (r > maxR) maxR = r;
    }

    const x0 = minC * cell + jt();
    const y0 = minR * cell + jt();
    const x1 = (maxC + 1) * cell + jt();
    const y1 = (maxR + 1) * cell + jt();

    // Irregular polygon — 6-8 vertices
    const mx = (x0 + x1) / 2 + (Math.random() - 0.5) * 6;
    const my = (y0 + y1) / 2 + (Math.random() - 0.5) * 6;

    const clipPath = `polygon(${x0.toFixed(1)}% ${y0.toFixed(1)}%, ${mx.toFixed(1)}% ${(y0 + jt() * 0.5).toFixed(1)}%, ${x1.toFixed(1)}% ${y0.toFixed(1)}%, ${(x1 + jt() * 0.5).toFixed(1)}% ${my.toFixed(1)}%, ${x1.toFixed(1)}% ${y1.toFixed(1)}%, ${mx.toFixed(1)}% ${(y1 + jt() * 0.5).toFixed(1)}%, ${x0.toFixed(1)}% ${y1.toFixed(1)}%, ${(x0 + jt() * 0.5).toFixed(1)}% ${my.toFixed(1)}%)`;

    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    const angle =
      Math.atan2(cy - 50, cx - 50) + (Math.random() - 0.5) * 1.4;
    const force = 12 + Math.random() * 35;

    return {
      id,
      clipPath,
      cx,
      cy,
      dx: Math.cos(angle) * force,
      dy: Math.sin(angle) * force,
      rot: (Math.random() - 0.5) * 14,
      scale: 0.82 + Math.random() * 0.36,
      opacity: 0.55 + Math.random() * 0.4,
      delay: Math.sqrt((cx - 50) ** 2 + (cy - 50) ** 2) * 0.004 + Math.random() * 0.08,
      duration: 0.5 + Math.random() * 0.3,
    };
  });
}

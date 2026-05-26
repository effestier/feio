export interface CrackSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  glow: number;
  opacity: number;
}

export interface CrackNetwork {
  originX: number;
  originY: number;
  segments: CrackSegment[];
}

/**
 * Generates a single procedural crack network radiating from a point.
 * Randomized every call — unique each trigger.
 */
export function generateCrackNetwork(
  width: number,
  height: number,
): CrackNetwork {
  const originX = width * (0.35 + Math.random() * 0.3);
  const originY = height * (0.35 + Math.random() * 0.3);

  const mainCount = 5 + Math.floor(Math.random() * 5);
  const segments: CrackSegment[] = [];
  const diag = Math.sqrt(width * width + height * height);

  for (let m = 0; m < mainCount; m++) {
    const angle =
      (m / mainCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.9;
    const length = (0.25 + Math.random() * 0.55) * diag;
    const steps = 7 + Math.floor(Math.random() * 10);

    let px = originX;
    let py = originY;

    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const jag = (1 - Math.abs(t - 0.5) * 2) * (15 + Math.random() * 35);
      const nx =
        originX +
        Math.cos(angle) * length * t +
        (Math.random() - 0.5) * jag;
      const ny =
        originY +
        Math.sin(angle) * length * t +
        (Math.random() - 0.5) * jag;

      segments.push({
        x1: px,
        y1: py,
        x2: nx,
        y2: ny,
        width: 0.4 + Math.random() * 1.6,
        glow: 3 + Math.random() * 7,
        opacity: 0.2 + Math.random() * 0.4,
      });

      // Branch
      if (Math.random() < 0.4 && t > 0.12 && t < 0.88) {
        const bCount = 1 + Math.floor(Math.random() * 2);
        for (let b = 0; b < bCount; b++) {
          const bAngle = angle + (Math.random() - 0.5) * 2.4;
          const bLen = 25 + Math.random() * 130;
          const bSteps = 2 + Math.floor(Math.random() * 4);
          let bx = nx;
          let by = ny;

          for (let j = 1; j <= bSteps; j++) {
            const bnx =
              bx +
              Math.cos(bAngle) * (bLen / bSteps) +
              (Math.random() - 0.5) * 10;
            const bny =
              by +
              Math.sin(bAngle) * (bLen / bSteps) +
              (Math.random() - 0.5) * 10;

            segments.push({
              x1: bx,
              y1: by,
              x2: bnx,
              y2: bny,
              width: 0.3 + Math.random() * 1,
              glow: 2 + Math.random() * 5,
              opacity: 0.12 + Math.random() * 0.25,
            });

            // Micro-cracks
            if (Math.random() < 0.25) {
              const mAngle = bAngle + (Math.random() - 0.5) * 2.6;
              const mLen = 8 + Math.random() * 45;
              segments.push({
                x1: bnx,
                y1: bny,
                x2: bnx + Math.cos(mAngle) * mLen,
                y2: bny + Math.sin(mAngle) * mLen,
                width: 0.2 + Math.random() * 0.5,
                glow: 1 + Math.random() * 3,
                opacity: 0.06 + Math.random() * 0.15,
              });
            }

            bx = bnx;
            by = bny;
          }
        }
      }

      px = nx;
      py = ny;
    }
  }

  return { originX, originY, segments };
}

/**
 * Draws a CrackNetwork onto a canvas context.
 * stage: 0 = primary only, 1 = +branches, 2 = all
 */
export function drawCrackNetwork(
  ctx: CanvasRenderingContext2D,
  network: CrackNetwork,
  stage: number,
  flicker = false,
): void {
  const endIdx =
    stage === 0
      ? Math.floor(network.segments.length * 0.35)
      : stage === 1
        ? Math.floor(network.segments.length * 0.65)
        : network.segments.length;

  const segs = network.segments.slice(0, endIdx);

  for (const seg of segs) {
    const extra = flicker && Math.random() < 0.15 ? 0.4 : 0;

    // Wide glow
    ctx.beginPath();
    ctx.moveTo(seg.x1, seg.y1);
    ctx.lineTo(seg.x2, seg.y2);
    ctx.strokeStyle = `rgba(255,255,255,${seg.opacity * 0.4 + extra})`;
    ctx.lineWidth = seg.glow * 1.4;
    ctx.stroke();

    // Mid glow
    ctx.beginPath();
    ctx.moveTo(seg.x1, seg.y1);
    ctx.lineTo(seg.x2, seg.y2);
    ctx.strokeStyle = `rgba(255,255,255,${seg.opacity * 0.65 + extra})`;
    ctx.lineWidth = seg.glow * 0.5;
    ctx.stroke();

    // Core
    ctx.beginPath();
    ctx.moveTo(seg.x1, seg.y1);
    ctx.lineTo(seg.x2, seg.y2);
    ctx.strokeStyle = `rgba(255,255,255,${Math.min(seg.opacity * 1.3 + extra, 1)})`;
    ctx.lineWidth = seg.width;
    ctx.stroke();
  }
}

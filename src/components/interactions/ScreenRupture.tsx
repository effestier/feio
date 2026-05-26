"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";

/* ── timing ─────────────────────────────────────────────── */

const EASE = [0.22, 1, 0.36, 1] as const;
const EXPLOSIVE = [0.16, 1, 0.3, 1] as const;

const GLYPHS = "\u2593\u2591\u2592\u2588\u2590\u258C\u2584\u2580\u25A0\u25A1\u25CA\u25C8\u00A4\u00B6\u00D7\u00F7\u2260\u2248\u221E\u220F\u2211\u2302\u2310\u2318\u2325";

/* ── content pools ──────────────────────────────────────── */

const CODE_POOL = [
  "const vessel = null;",
  "throw new SurfaceCollapseError();",
  "ref.current?.rupture();",
  "renderCycle++;",
  "memory = undefined;",
  "if (!cohesion) panic();",
  "delete context.surface;",
  "await Promise.race([void 0]);",
  "boundary.catch(entropy);",
  "return <Fragment broken />;",
  "fiber.stateNode?.unmount();",
  "scheduler.yield(Infinity);",
  "hydrate(null, vessel);",
  "reconciler.abort(Error);",
  "root.render(collapsed);",
  "useEffect(() => void null);",
  "setIntegrity(false);",
  "cache = corrupted;",
  "Promise.reject('breach');",
  "surface.depth\u2009--\u2009;",
  "const _ = require(null);",
  "window.__FEIO = undefined;",
  "yield* brokenGenerator();",
  "export default void 0;",
  "process.env.VOID = true;",
  "let entropy = MAX_ENTROPY;",
  "stack.push(new Failure());",
  "Object.seal(surface);",
  "debugger; // no escape",
  "while(cohesion > 0) decay();",
  "JSON.parse(void null);",
  "NaN === integrity",
  "catch(e) { swallow(e); }",
  "new WeakRef(surface).deref()",
  "Atomics.store(memory, 0, 0)",
  "transferControlToOffscreen()",
  "structuredClone(depth)",
  "fetch('/void', {signal: dead})",
  "resize(Infinity, NaN);",
  "yield* entropyStream()",
  "if (void 0) return NaN;",
  "scheduler.abortAll();",
];

const DOM_POOL = [
  '<div integrity="false">',
  "<surface breach />",
  "<render-vessel unstable>",
  "<entropy-index />",
  "</viewport>",
  '<mask type="void">',
  "<error-boundary caught={null}>",
  "<suspense fallback={\u2588}>",
  "<context value={undefined}>",
  '<key conflict="true"',
  "</motion.div>",
  '<canvas effect="dissolve"',
  '<aria-hidden="corrupted">',
  '<transform origin="lost">',
  '<section entropy="0.97">',
  "<button collapsed>",
  "<ghost-root />",
  '<slot name="void">',
  "<portal target={null}>",
  '<input type="entropy"',
  "<fragment uid={NaN}>",
  '<dialog open={false} forced>',
  "<shadow-dom breached>",
  "<portal detached />",
];

const UI_LABELS = [
  "RENDER FAILURE",
  "SURFACE BREACH",
  "VESSEL COMPROMISED",
  "COHERENCE: 0.003",
  "RECOVERY: \u221E",
  "ENTROPY: 0.9917",
  "DECAY: 73.4%",
  "INTEGRITY: 11%",
  "MESH: UNSTABLE",
  "FIBER: DETACHED",
  "BOUNDARY: EXCEEDED",
  "STATE: CORRUPTED",
  "MEMORY: LEAKING",
  "DEPTH: NEGATIVE",
  "CYCLE: OVERFLOW",
];

const TERMINAL_MESSAGES = [
  "attempting recovery...",
  "recovery failed",
  "user still present",
  "containment lost",
  "render vessel terminated",
  "structural integrity: 0%",
  "surface memory freed",
  "all boundaries consumed",
  "no valid render target",
  "system halt impossible",
];

/* ── seeded random ──────────────────────────────────────── */

function seededRandom(seed: number) {
  let s = seed | 0 || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ── GlitchText ─────────────────────────────────────────── */

function GlitchText({
  text,
  glitchRate = 0.2,
  interval = 2500,
}: {
  text: string;
  glitchRate?: number;
  interval?: number;
}) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() < glitchRate) {
        const corrupted = text
          .split("")
          .map((c) =>
            c === " "
              ? c
              : Math.random() > 0.45
                ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
                : c,
          )
          .join("");
        setDisplay(corrupted);
        setTimeout(() => setDisplay(text), 50 + Math.random() * 90);
      }
    }, interval + Math.random() * 1500);
    return () => clearInterval(id);
  }, [text, glitchRate, interval]);

  return <>{display}</>;
}

/* ── crack generation ───────────────────────────────────── */

export interface CrackSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  glowWidth: number;
  opacity: number;
}

export interface CrackNetwork {
  originX: number;
  originY: number;
  segments: CrackSegment[];
}

export function generateCrackNetwork(
  w: number,
  h: number,
): CrackNetwork {
  const originX = w * (0.35 + Math.random() * 0.3);
  const originY = h * (0.35 + Math.random() * 0.3);
  const mainCount = 4 + Math.floor(Math.random() * 5);
  const segments: CrackSegment[] = [];

  for (let m = 0; m < mainCount; m++) {
    const angle = (m / mainCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
    const length = 0.3 + Math.random() * 0.6;
    const diag = Math.sqrt(w * w + h * h);
    const totalLen = length * diag;
    const steps = 6 + Math.floor(Math.random() * 10);
    let px = originX;
    let py = originY;

    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const jag = (1 - Math.abs(t - 0.5) * 2) * (20 + Math.random() * 30);
      const nx = originX + Math.cos(angle) * totalLen * t + (Math.random() - 0.5) * jag;
      const ny = originY + Math.sin(angle) * totalLen * t + (Math.random() - 0.5) * jag;

      segments.push({
        x1: px, y1: py, x2: nx, y2: ny,
        width: 0.5 + Math.random() * 1.5,
        glowWidth: 3 + Math.random() * 6,
        opacity: 0.15 + Math.random() * 0.3,
      });

      if (Math.random() < 0.4 && t > 0.15 && t < 0.85) {
        const bCount = 1 + Math.floor(Math.random() * 2);
        for (let b = 0; b < bCount; b++) {
          const bAngle = angle + (Math.random() - 0.5) * 2.2;
          const bLen = 30 + Math.random() * 120;
          const bSteps = 2 + Math.floor(Math.random() * 4);
          let bx = nx, by = ny;

          for (let j = 1; j <= bSteps; j++) {
            const bt = j / bSteps;
            const bj = (Math.random() - 0.5) * 12;
            const bnx = bx + Math.cos(bAngle) * (bLen / bSteps) + bj;
            const bny = by + Math.sin(bAngle) * (bLen / bSteps) + bj;
            segments.push({
              x1: bx, y1: by, x2: bnx, y2: bny,
              width: 0.3 + Math.random() * 1,
              glowWidth: 2 + Math.random() * 4,
              opacity: 0.08 + Math.random() * 0.2,
            });

            if (Math.random() < 0.3) {
              const mAngle = bAngle + (Math.random() - 0.5) * 2.5;
              const mLen = 10 + Math.random() * 40;
              segments.push({
                x1: bnx, y1: bny,
                x2: bnx + Math.cos(mAngle) * mLen,
                y2: bny + Math.sin(mAngle) * mLen,
                width: 0.2 + Math.random() * 0.5,
                glowWidth: 1 + Math.random() * 3,
                opacity: 0.05 + Math.random() * 0.12,
              });
            }

            bx = bnx; by = bny;
          }
        }
      }

      px = nx; py = ny;
    }
  }

  return { originX, originY, segments };
}

/* ── debris generators ──────────────────────────────────── */

export interface CodeDebris {
  text: string;
  x: number;
  y: number;
  size: number;
  rot: number;
  opacity: number;
  twitchX: number;
  twitchY: number;
  twitchSpeed: number;
  glitchRate: number;
  glitchInterval: number;
}

export interface DomDebris {
  text: string;
  x: number;
  y: number;
  size: number;
  rot: number;
  opacity: number;
  flickerX: number;
  blur: number;
  cycleDuration: number;
}

export interface SkelDebris {
  type: string;
  x: number;
  y: number;
  rot: number;
  opacity: number;
  driftX: number;
  driftY: number;
  driftDuration: number;
  label?: string;
  bar1?: string;
  bar2?: string;
  bar3?: string;
  lineWidth?: number;
}

export function generateCodeDebris(count: number, seed: number): CodeDebris[] {
  const rand = seededRandom(seed);
  const shuffled = [...CODE_POOL].sort(() => rand() - 0.5);
  return shuffled.slice(0, count).map((text) => ({
    text,
    x: rand() * 92,
    y: rand() * 90,
    size: 10 + rand() * 5,
    rot: (rand() - 0.5) * 8,
    opacity: 0.14 + rand() * 0.22,
    twitchX: (rand() - 0.5) * 10,
    twitchY: (rand() - 0.5) * 6,
    twitchSpeed: 0.5 + rand() * 2.5,
    glitchRate: 0.2 + rand() * 0.4,
    glitchInterval: 800 + rand() * 2500,
  }));
}

export function generateDomDebris(count: number, seed: number): DomDebris[] {
  const rand = seededRandom(seed);
  const shuffled = [...DOM_POOL].sort(() => rand() - 0.5);
  return shuffled.slice(0, count).map((text) => ({
    text,
    x: rand() * 88,
    y: rand() * 85,
    size: 9 + rand() * 4,
    rot: (rand() - 0.5) * 6,
    opacity: 0.16 + rand() * 0.2,
    flickerX: (rand() - 0.5) * 8,
    blur: 0.3 + rand() * 2,
    cycleDuration: 1.5 + rand() * 3.5,
  }));
}

export function generateSkelDebris(count: number, seed: number): SkelDebris[] {
  const rand = seededRandom(seed);
  const types = ["button", "card", "panel", "line", "input", "modal", "header"] as const;
  const labels = [...UI_LABELS].sort(() => rand() - 0.5);

  return Array.from({ length: count }, (_, i) => {
    const type = types[Math.floor(rand() * types.length)];
    return {
      type,
      x: rand() * 82,
      y: rand() * 78,
      rot: (rand() - 0.5) * 5,
      opacity: 0.08 + rand() * 0.2,
      driftX: (rand() - 0.5) * 8,
      driftY: (rand() - 0.5) * 5,
      driftDuration: 2.5 + rand() * 4.5,
      label: labels[i % labels.length],
      bar1: `${25 + rand() * 65}%`,
      bar2: `${15 + rand() * 55}%`,
      bar3: `${10 + rand() * 40}%`,
      lineWidth: 20 + rand() * 130,
    };
  });
}

/* ── shard generation ───────────────────────────────────── */

export interface Shard {
  clipPath: string;
  cx: number;
  cy: number;
  delay: number;
  dx: number;
  dy: number;
  rot: number;
  depth: number;
  opacity: number;
  blur: number;
}

function nearestSeedIndex(x: number, y: number, seeds: Array<[number, number]>): number {
  let min = Infinity;
  let idx = 0;
  for (let i = 0; i < seeds.length; i++) {
    const dx = x - seeds[i][0];
    const dy = y - seeds[i][1];
    const d = dx * dx + dy * dy;
    if (d < min) { min = d; idx = i; }
  }
  return idx;
}

export function buildShards(count: number, seed: number): Shard[] {
  const rand = seededRandom(seed);
  const seeds: Array<[number, number]> = Array.from({ length: count }, () => [rand() * 100, rand() * 100]);
  const grid = 8;
  const cellSize = 100 / grid;
  const cellMap = new Map<number, Array<[number, number]>>();

  for (let row = 0; row < grid; row++) {
    for (let col = 0; col < grid; col++) {
      const cx = (col + 0.5) * cellSize;
      const cy = (row + 0.5) * cellSize;
      const idx = nearestSeedIndex(cx, cy, seeds);
      if (!cellMap.has(idx)) cellMap.set(idx, []);
      cellMap.get(idx)!.push([col, row]);
    }
  }

  return Array.from(cellMap.entries()).map(([, cells]) => {
    let minCol = grid, maxCol = -1, minRow = grid, maxRow = -1;
    for (const [c, r] of cells) {
      if (c < minCol) minCol = c;
      if (c > maxCol) maxCol = c;
      if (r < minRow) minRow = r;
      if (r > maxRow) maxRow = r;
    }

    const jitter = () => (rand() - 0.5) * 8;
    const x0 = minCol * cellSize + jitter();
    const y0 = minRow * cellSize + jitter();
    const x1 = (maxCol + 1) * cellSize + jitter();
    const y1 = (maxRow + 1) * cellSize + jitter();
    const mx = (x0 + x1) / 2 + (rand() - 0.5) * 5;
    const my = (y0 + y1) / 2 + (rand() - 0.5) * 5;

    const clipPath = `polygon(${x0.toFixed(1)}% ${y0.toFixed(1)}%, ${mx.toFixed(1)}% ${(y0 + (rand() - 0.5) * 4).toFixed(1)}%, ${x1.toFixed(1)}% ${y0.toFixed(1)}%, ${x1.toFixed(1)}% ${my.toFixed(1)}%, ${x1.toFixed(1)}% ${y1.toFixed(1)}%, ${mx.toFixed(1)}% ${(y1 + (rand() - 0.5) * 4).toFixed(1)}%, ${x0.toFixed(1)}% ${y1.toFixed(1)}%, ${x0.toFixed(1)}% ${my.toFixed(1)}%)`;

    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    const dist = Math.sqrt((cx - 50) ** 2 + (cy - 50) ** 2);
    const angle = Math.atan2(cy - 50, cx - 50) + (rand() - 0.5) * 1.4;
    const force = 8 + rand() * 32;

    return {
      clipPath, cx, cy,
      delay: dist * 0.003 + rand() * 0.1,
      dx: Math.cos(angle) * force,
      dy: Math.sin(angle) * force,
      rot: (rand() - 0.5) * 14,
      depth: 0.8 + rand() * 0.4,
      opacity: 0.5 + rand() * 0.4,
      blur: rand() * 1.5,
    };
  });
}

import { useRef, useCallback } from "react";

/* ── Configuration ──────────────────────────────────────── */

export interface RecursiveMirrorConfig {
  /** How many mirror depths to track */
  depth: number;
  /** Decay factor per depth level (0-1) */
  decayFactor: number;
  /** Delay in ms between mirror reflections */
  reflectionDelay: number;
}

const DEFAULT_CONFIG: RecursiveMirrorConfig = {
  depth: 4,
  decayFactor: 0.6,
  reflectionDelay: 200,
};

/* ── State snapshot ─────────────────────────────────────── */

interface StateSnapshot {
  rotation: [number, number, number];
  scale: number;
  opacity: number;
  t: number;
}

/* ── Hook ───────────────────────────────────────────────── */

export function useRecursiveMirror(config: Partial<RecursiveMirrorConfig> = {}) {
  const full = { ...DEFAULT_CONFIG, ...config };
  const bufferRef = useRef<StateSnapshot[]>([]);
  const lastPushRef = useRef(0);

  /** Push a new state snapshot into the circular buffer */
  const pushState = useCallback(
    (rotation: [number, number, number], scale: number, opacity: number) => {
      const now = performance.now();
      if (now - lastPushRef.current < full.reflectionDelay) return;
      lastPushRef.current = now;

      bufferRef.current.push({ rotation, scale, opacity, t: now });
      if (bufferRef.current.length > full.depth * 2) {
        bufferRef.current.shift();
      }
    },
    [full.reflectionDelay, full.depth],
  );

  /** Get the reflected state at a given depth */
  const getReflected = useCallback(
    (depth: number): StateSnapshot | null => {
      const buffer = bufferRef.current;
      const targetIndex = buffer.length - 1 - depth;
      if (targetIndex < 0) return null;

      const source = buffer[targetIndex];
      const decay = Math.pow(full.decayFactor, depth);

      return {
        rotation: [
          source.rotation[0] * decay,
          source.rotation[1] * decay,
          source.rotation[2] * decay,
        ],
        scale: source.scale * decay,
        opacity: source.opacity * decay,
        t: source.t,
      };
    },
    [full.decayFactor],
  );

  /** Check if the mirror is oscillating (states flipping) */
  const isOscillating = useCallback(() => {
    const buffer = bufferRef.current;
    if (buffer.length < 4) return false;

    const recent = buffer.slice(-4);
    // Check if rotation direction is flipping
    const dirX = Math.sign(recent[3].rotation[0] - recent[2].rotation[0]);
    const prevDirX = Math.sign(recent[2].rotation[0] - recent[1].rotation[0]);
    return dirX !== prevDirX;
  }, []);

  return { pushState, getReflected, isOscillating, depth: full.depth };
}

import { useRef, useEffect, useCallback } from "react";

/* ── Configuration ──────────────────────────────────────── */

interface DesyncBurst {
  /** Whether a desync burst is currently active */
  active: boolean;
  /** When the current burst started */
  startTime: number;
  /** How long this burst lasts (ms) */
  duration: number;
  /** Lag amount during this burst (ms) */
  lagMs: number;
}

/* ── Hook ───────────────────────────────────────────────── */

export function useTemporalCursor() {
  const positionRef = useRef({ x: 0, y: 0 });
  const desyncedRef = useRef({ x: 0, y: 0 });
  const burstRef = useRef<DesyncBurst>({
    active: false,
    startTime: 0,
    duration: 0,
    lagMs: 0,
  });
  const historyRef = useRef<Array<{ x: number; y: number; t: number }>>([]);

  // Mouse listener — always captures real position
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY };
      // Buffer history for lag replay
      historyRef.current.push({
        x: e.clientX,
        y: e.clientY,
        t: performance.now(),
      });
      // Keep only last 500ms of history
      const cutoff = performance.now() - 500;
      while (historyRef.current.length > 0 && historyRef.current[0].t < cutoff) {
        historyRef.current.shift();
      }
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Burst scheduler — randomly activates desync
  useEffect(() => {
    let raf: number;

    const tick = () => {
      const now = performance.now();
      const burst = burstRef.current;

      if (burst.active) {
        // Check if burst should end
        if (now - burst.startTime > burst.duration) {
          burst.active = false;
          // Snap back to real position
          desyncedRef.current = { ...positionRef.current };
        } else {
          // Replay old position from history
          const targetTime = now - burst.lagMs;
          const history = historyRef.current;
          if (history.length > 0) {
            // Find closest historical position
            let closest = history[0];
            let minDist = Math.abs(closest.t - targetTime);
            for (let i = 1; i < history.length; i++) {
              const d = Math.abs(history[i].t - targetTime);
              if (d < minDist) {
                minDist = d;
                closest = history[i];
              }
            }
            desyncedRef.current = { x: closest.x, y: closest.y };
          }
        }
      } else {
        // Follow real position
        desyncedRef.current = { ...positionRef.current };

        // Random chance to start a burst
        if (Math.random() < 0.001) {
          burst.active = true;
          burst.startTime = now;
          burst.duration = 2000 + Math.random() * 3000;
          burst.lagMs = 80 + Math.random() * 120;
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /** Get the current (possibly desynced) cursor position */
  const getDesyncedPosition = useCallback(() => {
    return { ...desyncedRef.current };
  }, []);

  /** Check if cursor is currently in a desync burst */
  const isDesynced = useCallback(() => {
    return burstRef.current.active;
  }, []);

  return { getDesyncedPosition, isDesynced, positionRef, desyncedRef };
}

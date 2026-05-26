import { useRef, useEffect, useCallback } from "react";
import { useAwarenessEngine } from "@/systems/awareness/awarenessEngine";
import { useCollapseEngine } from "./collapseEngine";

/**
 * At high collapse levels, the system begins acting on its own model of the user.
 * Pre-emptively repositions, adjusts atmosphere, reflects its model not the user's behavior.
 */

interface PointerPrediction {
  x: number;
  y: number;
  confidence: number;
}

export function useAutonomousObserver() {
  const predictionRef = useRef<PointerPrediction>({ x: 0, y: 0, confidence: 0 });
  const initiativeRef = useRef(0);
  const certaintyRef = useRef(0);
  const historyRef = useRef<Array<{ x: number; y: number; t: number }>>([]);
  const lastPredictRef = useRef(0);

  useEffect(() => {
    const unsub = useAwarenessEngine.subscribe((s) => {
      // Build prediction from pointer history
      const now = performance.now();
      historyRef.current.push({
        x: s.metrics.pointerX,
        y: s.metrics.pointerY,
        t: now,
      });

      // Keep last 2s of history
      const cutoff = now - 2000;
      while (historyRef.current.length > 0 && historyRef.current[0].t < cutoff) {
        historyRef.current.shift();
      }

      // Linear extrapolation prediction
      const h = historyRef.current;
      if (h.length >= 3 && now - lastPredictRef.current > 200) {
        lastPredictRef.current = now;
        const dt = (h[h.length - 1].t - h[h.length - 2].t) / 1000;
        if (dt > 0) {
          const vx = (h[h.length - 1].x - h[h.length - 2].x) / dt;
          const vy = (h[h.length - 1].y - h[h.length - 2].y) / dt;
          predictionRef.current = {
            x: Math.max(0, Math.min(1, h[h.length - 1].x + vx * 0.5)),
            y: Math.max(0, Math.min(1, h[h.length - 1].y + vy * 0.5)),
            confidence: Math.min(1, s.attentionLevel * 1.5),
          };
        }
      }

      certaintyRef.current = s.attentionLevel;
    });
    return unsub;
  }, []);

  // System initiative — increases with collapse level
  useEffect(() => {
    const unsub = useCollapseEngine.subscribe((s) => {
      const cl = s.collapseLevel;
      initiativeRef.current = Math.max(0, (cl - 0.5) * 2); // activates above 0.5
    });
    return unsub;
  }, []);

  return {
    predictionRef,
    initiativeRef,
    certaintyRef,
  };
}

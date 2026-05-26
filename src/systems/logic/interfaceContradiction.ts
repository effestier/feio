import { useState, useEffect, useRef, useCallback } from "react";

/* ── Contradictory label map ────────────────────────────── */

const LABEL_CONTRADICTIONS: Record<string, string[]> = {
  CLOSE: ["DEEPER", "ENTER", "OPEN", "EXPAND"],
  BACK: ["ADVANCE", "FORWARD", "PROCEED", "CONTINUE"],
  ENTER: ["EXIT", "LEAVE", "RETURN", "LOOP"],
  EXIT: ["ENTER", "RETURN", "REMAIN", "STAY"],
  OPEN: ["CLOSE", "SEAL", "COLLAPSE", "SHRINK"],
  NEXT: ["PREVIOUS", "BACK", "RETURN", "REWIND"],
  PREVIOUS: ["NEXT", "FORWARD", "ADVANCE"],
  CONFIRM: ["DENY", "REJECT", "VOID", "CANCEL"],
  DENY: ["CONFIRM", "ACCEPT", "AFFIRM"],
  ASCEND: ["DESCEND", "FALL", "SINK"],
  DESCEND: ["ASCEND", "RISE", "FLOAT"],
};

/* ── Get a contradictory label ──────────────────────────── */

export function getContradictoryLabel(realAction: string): string {
  const upper = realAction.toUpperCase();
  const contradictions = LABEL_CONTRADICTIONS[upper];
  if (!contradictions) return realAction;
  return contradictions[Math.floor(Math.random() * contradictions.length)];
}

/* ── Hook configuration ─────────────────────────────────── */

interface InterfaceLabelConfig {
  /** The real action this label represents */
  realAction: string;
  /** How often the label swaps (ms range) */
  swapInterval: [number, number];
  /** Probability (0-1) that label is contradicted at any given moment */
  contradictionProbability: number;
  /** Duration of each contradiction burst (ms) */
  burstDuration: number;
}

const DEFAULT_CONFIG: Omit<InterfaceLabelConfig, "realAction"> = {
  swapInterval: [5000, 15000],
  contradictionProbability: 0.5,
  burstDuration: 2000,
};

/* ── Hook ───────────────────────────────────────────────── */

export function useInterfaceLabel(
  realAction: string,
  config: Partial<Omit<InterfaceLabelConfig, "realAction">> = {},
) {
  const full = { ...DEFAULT_CONFIG, ...config };
  const [displayLabel, setDisplayLabel] = useState(realAction);
  const [isContradicted, setIsContradicted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const scheduleSwap = () => {
      const [min, max] = full.swapInterval;
      const delay = min + Math.random() * (max - min);

      timerRef.current = setTimeout(() => {
        // Decide if this swap contradicts
        if (Math.random() < full.contradictionProbability) {
          const contradicted = getContradictoryLabel(realAction);
          setDisplayLabel(contradicted);
          setIsContradicted(true);

          // Resolve back after burst duration
          setTimeout(() => {
            setDisplayLabel(realAction);
            setIsContradicted(false);
            scheduleSwap();
          }, full.burstDuration);
        } else {
          // Just swap and immediately resolve — false alarm
          const temp = getContradictoryLabel(realAction);
          setDisplayLabel(temp);
          setTimeout(() => {
            setDisplayLabel(realAction);
            scheduleSwap();
          }, 200 + Math.random() * 300);
        }
      }, delay);
    };

    scheduleSwap();
    return () => clearTimeout(timerRef.current);
  }, [realAction, full.swapInterval, full.contradictionProbability, full.burstDuration]);

  return { displayLabel, isContradicted };
}

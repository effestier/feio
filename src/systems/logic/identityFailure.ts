import { useState, useRef, useCallback, useEffect } from "react";

/* ── Configuration ──────────────────────────────────────── */

export interface IdentityFailureConfig {
  /** Unique object id */
  objectId: string;
  /** Position offset for the duplicate [x, y, z] */
  duplicateOffset: [number, number, number];
  /** Delay before duplicate appears (ms) */
  duplicateDelay: number;
  /** How fast behaviors drift between primary and duplicate (0-1 per second) */
  behaviorDrift: number;
  /** Cycle duration — how long identity failure is active (ms) */
  activeDuration: number;
  /** Rest duration between cycles (ms) */
  restDuration: number;
}

const DEFAULT_CONFIG: IdentityFailureConfig = {
  objectId: "",
  duplicateOffset: [1.5, 0.5, 0],
  duplicateDelay: 1500,
  behaviorDrift: 0.08,
  activeDuration: 8000,
  restDuration: 4000,
};

/* ── Hook ───────────────────────────────────────────────── */

export function useIdentityFailure(config: Partial<IdentityFailureConfig> & { objectId: string }) {
  const full = { ...DEFAULT_CONFIG, ...config };

  const [isActive, setIsActive] = useState(false);
  const [driftAmount, setDriftAmount] = useState(0);
  const [duplicateVisible, setDuplicateVisible] = useState(false);
  const [swapped, setSwapped] = useState(false);

  const cycleRef = useRef<ReturnType<typeof setTimeout>>();
  const driftRafRef = useRef(0);
  const driftStartRef = useRef(0);

  // Activate/deactivate cycle
  useEffect(() => {
    let mounted = true;

    const startCycle = () => {
      if (!mounted) return;
      setIsActive(true);
      setDriftAmount(0);
      setSwapped(false);

      // Show duplicate after delay
      const dupTimer = setTimeout(() => {
        if (!mounted) return;
        setDuplicateVisible(true);
        driftStartRef.current = performance.now();

        // Start drift animation
        const animateDrift = () => {
          if (!mounted) return;
          const elapsed = (performance.now() - driftStartRef.current) / 1000;
          const drift = Math.min(elapsed * full.behaviorDrift, 1);
          setDriftAmount(drift);

          // At 50% drift, swap which is "primary"
          if (drift >= 0.5 && !swapped) {
            setSwapped(true);
          }

          if (drift < 1) {
            driftRafRef.current = requestAnimationFrame(animateDrift);
          }
        };
        driftRafRef.current = requestAnimationFrame(animateDrift);
      }, full.duplicateDelay);

      // End active cycle
      cycleRef.current = setTimeout(() => {
        if (!mounted) return;
        setIsActive(false);
        setDuplicateVisible(false);
        setDriftAmount(0);
        setSwapped(false);
        cancelAnimationFrame(driftRafRef.current);

        // Start rest, then restart cycle
        cycleRef.current = setTimeout(startCycle, full.restDuration);
      }, full.activeDuration);
    };

    // Initial delay before first cycle
    cycleRef.current = setTimeout(startCycle, 2000 + Math.random() * 3000);

    return () => {
      mounted = false;
      clearTimeout(cycleRef.current);
      cancelAnimationFrame(driftRafRef.current);
    };
  }, [full.objectId, full.duplicateDelay, full.activeDuration, full.restDuration, full.behaviorDrift]);

  // Click handler — click one, other responds
  const onPrimaryClick = useCallback(() => {
    if (!isActive) return { target: "self" as const };
    return { target: swapped ? "self" as const : "duplicate" as const };
  }, [isActive, swapped]);

  const onDuplicateClick = useCallback(() => {
    if (!isActive) return { target: "self" as const };
    return { target: swapped ? "duplicate" as const : "self" as const };
  }, [isActive, swapped]);

  return {
    isActive,
    duplicateVisible,
    driftAmount,
    swapped,
    onPrimaryClick,
    onDuplicateClick,
  };
}

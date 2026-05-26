import { useRef, useEffect } from "react";
import { useCollapseEngine, type SystemSource } from "./collapseEngine";

/**
 * Reads collapseLevel and interference values from the collapse engine.
 * Returns smooth blended values for each prior system's bleed-through.
 * All values are refs for useFrame consumption.
 */
export function useInterferenceBleed() {
  const collapseRef = useRef(0.3);
  const fractureRef = useRef(0);
  const temporalRef = useRef(0);
  const logicRef = useRef(0);
  const awarenessRef = useRef(0);

  useEffect(() => {
    const unsub = useCollapseEngine.subscribe((s) => {
      collapseRef.current = s.collapseLevel;
      fractureRef.current = s.interference.fracture;
      temporalRef.current = s.interference.temporal;
      logicRef.current = s.interference.logic;
      awarenessRef.current = s.interference.awareness;
    });
    return unsub;
  }, []);

  return {
    collapseRef,
    fractureRef,
    temporalRef,
    logicRef,
    awarenessRef,
  };
}

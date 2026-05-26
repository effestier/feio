import { useRef, useCallback } from "react";
import { useAwarenessEngine } from "./awarenessEngine";

/**
 * Converts behavior metrics into reactive environment values.
 * All values are smooth (0-1 range) — never binary.
 */
export function useObserverResponse() {
  const metrics = useAwarenessEngine((s) => s.metrics);
  const attentionLevel = useAwarenessEngine((s) => s.attentionLevel);

  // Smoothed values via refs (for useFrame consumption)
  const ambientIntensityRef = useRef(0.02);
  const pulseRateRef = useRef(0.5);
  const driftBehaviorRef = useRef(1);
  const textToneRef = useRef(0.5);

  // Compute smooth response values
  const compute = useCallback(() => {
    // Ambient: brighter when user is active, dimmer when dormant
    const targetAmbient = 0.01 + attentionLevel * 0.03;
    ambientIntensityRef.current += (targetAmbient - ambientIntensityRef.current) * 0.05;

    // Pulse rate: faster with more clicks, slower when idle
    const targetPulse = 0.3 + metrics.clickFrequency * 0.12;
    pulseRateRef.current += (targetPulse - pulseRateRef.current) * 0.08;

    // Drift: particles move faster with faster pointer, slower when dormant
    const targetDrift = 0.5 + metrics.pointerVelocity * 0.8;
    driftBehaviorRef.current += (targetDrift - driftBehaviorRef.current) * 0.04;

    // Text tone: shifts with hesitation and acceleration
    const targetTone = 0.5 + (metrics.isHesitating ? 0.2 : 0) + (metrics.pointerAcceleration > 2 ? 0.15 : 0);
    textToneRef.current += (targetTone - textToneRef.current) * 0.06;

    return {
      ambientIntensity: ambientIntensityRef.current,
      pulseRate: pulseRateRef.current,
      driftBehavior: driftBehaviorRef.current,
      textTone: textToneRef.current,
    };
  }, [metrics, attentionLevel]);

  return {
    compute,
    ambientIntensityRef,
    pulseRateRef,
    driftBehaviorRef,
    textToneRef,
  };
}

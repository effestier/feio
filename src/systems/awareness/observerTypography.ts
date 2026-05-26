import { useState, useEffect, useRef } from "react";
import { useAwarenessEngine, type BehaviorMetrics } from "./awarenessEngine";

/* ── Observation classification ─────────────────────────── */

function classifyObserver(m: BehaviorMetrics): string {
  if (m.inactivityDuration > 8000) return "dormant";
  if (m.inactivityDuration > 5000) return "idle";
  if (m.isHesitating) return "hesitant";
  return "active";
}

function classifyPointer(m: BehaviorMetrics): string {
  if (m.pointerAcceleration > 2) return "anomalous";
  if (m.pointerVelocity > 1.5) return "elevated";
  if (m.pointerVelocity < 0.05) return "minimal";
  return "nominal";
}

function classifyInteraction(m: BehaviorMetrics): string {
  if (m.isRepeating) return "recursive";
  if (m.clickFrequency >= 5) return "compulsive";
  if (m.clickFrequency === 0 && m.inactivityDuration < 3000) return "inhibited";
  return "standard";
}

function classifyAttention(level: number): string {
  if (level > 0.7) return "focused";
  if (level > 0.4) return "attentive";
  if (level > 0.15) return "passive";
  return "ambient";
}

/* ── Hook: observer text ────────────────────────────────── */

export function useObserverText() {
  const metrics = useAwarenessEngine((s) => s.metrics);
  const attentionLevel = useAwarenessEngine((s) => s.attentionLevel);

  const [observerState, setObserverState] = useState("calibrating");
  const [pointerState, setPointerState] = useState("calibrating");
  const [interactionState, setInteractionState] = useState("calibrating");
  const [attentionState, setAttentionState] = useState("ambient");

  // Throttled updates — don't change every frame
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    const now = performance.now();
    if (now - lastUpdateRef.current < 500) return;
    lastUpdateRef.current = now;

    setObserverState(classifyObserver(metrics));
    setPointerState(classifyPointer(metrics));
    setInteractionState(classifyInteraction(metrics));
    setAttentionState(classifyAttention(attentionLevel));
  }, [metrics, attentionLevel]);

  return {
    observerState,
    pointerState,
    interactionState,
    attentionState,
    metrics,
    attentionLevel,
  };
}

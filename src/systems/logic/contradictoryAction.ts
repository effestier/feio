import { useState, useRef, useCallback } from "react";
import { useLogicEngine, type LogicOutcome } from "./logicEngine";

/* ── Configuration ──────────────────────────────────────── */

export interface ContradictoryActionConfig {
  /** Unique id for this interaction */
  actionId: string;
  /** Possible outcomes with weights */
  outcomes: Array<{
    id: string;
    label?: string;
    callback: () => void;
    weight: number;
  }>;
  /** If > 0, visual effect fires BEFORE the click (ms lead time) */
  inversionLeadMs?: number;
  /** Probability (0-1) that this action is contradictory. 0 = always does expected, 1 = always random */
  contradictionProbability?: number;
}

/* ── Hook ───────────────────────────────────────────────── */

export function useContradictoryAction(config: ContradictoryActionConfig) {
  const {
    actionId,
    outcomes,
    inversionLeadMs = 0,
    contradictionProbability = 0.6,
  } = config;

  const isActive = useLogicEngine((s) => s.isActive);
  const resolveContradiction = useLogicEngine((s) => s.resolveContradiction);
  const registerOutcomes = useLogicEngine((s) => s.registerOutcomes);
  const unregisterOutcomes = useLogicEngine((s) => s.unregisterOutcomes);
  const scheduleInversion = useLogicEngine((s) => s.scheduleInversion);

  const [lastOutcomeId, setLastOutcomeId] = useState<string | null>(null);
  const [wasInverted, setWasInverted] = useState(false);
  const [pendingInversion, setPendingInversion] = useState(false);

  // Register outcomes on mount
  const registeredRef = useRef(false);
  if (!registeredRef.current && isActive && outcomes.length > 0) {
    const logicOutcomes: LogicOutcome[] = outcomes.map((o) => ({
      id: o.id,
      weight: o.weight,
      callback: o.callback,
    }));
    registerOutcomes(actionId, logicOutcomes);
    registeredRef.current = true;
  }

  const execute = useCallback(() => {
    if (!isActive) {
      // Not in logic failure mode — first outcome is the "expected" one
      if (outcomes.length > 0) {
        outcomes[0].callback();
        setLastOutcomeId(outcomes[0].id);
        setWasInverted(false);
      }
      return;
    }

    // Check if this click will be contradictory
    const isContradictory = Math.random() < contradictionProbability;

    if (!isContradictory) {
      // Do the expected thing (first outcome)
      outcomes[0].callback();
      setLastOutcomeId(outcomes[0].id);
      setWasInverted(false);
      return;
    }

    // Causal inversion — effect fires before trigger
    if (inversionLeadMs > 0 && Math.random() < 0.4) {
      setPendingInversion(true);
      setWasInverted(true);

      // Schedule the visual effect BEFORE the click resolves
      scheduleInversion(
        `inv-${actionId}`,
        () => {
          // Visual precursor fires now
          setPendingInversion(false);
        },
        inversionLeadMs,
      );
    }

    // Resolve contradiction — pick a random weighted outcome
    const resolved = resolveContradiction(actionId);
    setLastOutcomeId(resolved);
  }, [
    isActive,
    actionId,
    outcomes,
    contradictionProbability,
    inversionLeadMs,
    resolveContradiction,
    scheduleInversion,
  ]);

  return {
    execute,
    lastOutcomeId,
    wasInverted,
    pendingInversion,
  };
}

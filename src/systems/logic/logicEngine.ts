import { create } from "zustand";

/* ── Outcome type ───────────────────────────────────────── */

export interface LogicOutcome {
  id: string;
  weight: number;
  callback: () => void;
}

/* ── Causal inversion entry ─────────────────────────────── */

interface CausalInversion {
  id: string;
  callback: () => void;
  fireAt: number;
}

/* ── Logic engine state ─────────────────────────────────── */

interface LogicState {
  /** 0–1 how logically broken the current context is */
  contradictionLevel: number;
  /** Whether logic failure systems are active */
  isActive: boolean;
  /** Registered outcome sets keyed by interaction id */
  outcomeRegistry: Map<string, LogicOutcome[]>;
  /** Pending causal inversions (effects before triggers) */
  inversions: CausalInversion[];

  /* Mutations */
  setContradictionLevel: (v: number) => void;
  activate: () => void;
  deactivate: () => void;

  /** Register multiple possible outcomes for an interaction */
  registerOutcomes: (interactionId: string, outcomes: LogicOutcome[]) => void;

  /** Remove registered outcomes */
  unregisterOutcomes: (interactionId: string) => void;

  /** Resolve a contradiction — pick one outcome via weighted random */
  resolveContradiction: (interactionId: string) => string | null;

  /** Schedule a causal inversion — effect fires BEFORE trigger */
  scheduleInversion: (id: string, callback: () => void, leadMs: number) => void;

  /** Cancel a pending inversion */
  cancelInversion: (id: string) => void;

  /** Per-frame tick — fires inversions whose time has come */
  tick: () => void;
}

export const useLogicEngine = create<LogicState>((set, get) => ({
  contradictionLevel: 0,
  isActive: false,
  outcomeRegistry: new Map(),
  inversions: [],

  setContradictionLevel: (v) =>
    set({ contradictionLevel: Math.max(0, Math.min(1, v)) }),

  activate: () => set({ isActive: true }),

  deactivate: () =>
    set({
      isActive: false,
      outcomeRegistry: new Map(),
      inversions: [],
    }),

  registerOutcomes: (interactionId, outcomes) => {
    set((s) => {
      const next = new Map(s.outcomeRegistry);
      next.set(interactionId, outcomes);
      return { outcomeRegistry: next };
    });
  },

  unregisterOutcomes: (interactionId) => {
    set((s) => {
      const next = new Map(s.outcomeRegistry);
      next.delete(interactionId);
      return { outcomeRegistry: next };
    });
  },

  resolveContradiction: (interactionId) => {
    const { outcomeRegistry } = get();
    const outcomes = outcomeRegistry.get(interactionId);
    if (!outcomes || outcomes.length === 0) return null;

    const totalWeight = outcomes.reduce((sum, o) => sum + o.weight, 0);
    let roll = Math.random() * totalWeight;

    for (const outcome of outcomes) {
      roll -= outcome.weight;
      if (roll <= 0) {
        outcome.callback();
        return outcome.id;
      }
    }

    // Fallback — last outcome
    outcomes[outcomes.length - 1].callback();
    return outcomes[outcomes.length - 1].id;
  },

  scheduleInversion: (id, callback, leadMs) => {
    const fireAt = performance.now() + leadMs;
    set((s) => {
      const filtered = s.inversions.filter((i) => i.id !== id);
      return { inversions: [...filtered, { id, callback, fireAt }] };
    });
  },

  cancelInversion: (id) => {
    set((s) => ({
      inversions: s.inversions.filter((i) => i.id !== id),
    }));
  },

  tick: () => {
    const { inversions, isActive } = get();
    if (!isActive || inversions.length === 0) return;

    const now = performance.now();
    const pending: CausalInversion[] = [];
    const fire: CausalInversion[] = [];

    for (const inv of inversions) {
      if (now >= inv.fireAt) fire.push(inv);
      else pending.push(inv);
    }

    if (fire.length > 0) {
      set({ inversions: pending });
      for (const inv of fire) inv.callback();
    }
  },
}));

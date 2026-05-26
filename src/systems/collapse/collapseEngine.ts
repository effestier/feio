import { create } from "zustand";

/* ── Interference source ────────────────────────────────── */

export type SystemSource = "fracture" | "temporal" | "logic" | "awareness";

/* ── Autonomous action ──────────────────────────────────── */

export interface AutonomousAction {
  id: string;
  trigger: string;
  callback: () => void;
  intervalMs: number;
  lastFired: number;
  probability: number;
}

/* ── Collapse state ─────────────────────────────────────── */

interface CollapseState {
  /** 0–1 how collapsed reality is. Starts at 0.3, climbs to 1.0 */
  collapseLevel: number;
  /** Whether collapse systems are active */
  isActive: boolean;
  /** Interference strength from each prior system (0–1) */
  interference: Record<SystemSource, number>;
  /** Registered autonomous actions */
  autonomousActions: AutonomousAction[];
  /** Time since collapse began (ms) */
  elapsed: number;

  /* Mutations */
  activate: () => void;
  deactivate: () => void;
  setCollapseLevel: (v: number) => void;
  setInterference: (source: SystemSource, value: number) => void;
  registerAutonomousAction: (action: Omit<AutonomousAction, "lastFired">) => void;
  unregisterAutonomousAction: (id: string) => void;
  tick: () => void;
}

const COLLAPSE_RATE = 0.00004; // per frame at 60fps — slow but relentless
const COLLAPSE_START = 0.3;

export const useCollapseEngine = create<CollapseState>((set, get) => ({
  collapseLevel: COLLAPSE_START,
  isActive: false,
  interference: {
    fracture: 0,
    temporal: 0,
    logic: 0,
    awareness: 0,
  },
  autonomousActions: [],
  elapsed: 0,

  activate: () =>
    set({
      isActive: true,
      collapseLevel: COLLAPSE_START,
      elapsed: 0,
      interference: { fracture: 0, temporal: 0, logic: 0, awareness: 0 },
    }),

  deactivate: () =>
    set({
      isActive: false,
      collapseLevel: COLLAPSE_START,
      elapsed: 0,
      autonomousActions: [],
    }),

  setCollapseLevel: (v) =>
    set({ collapseLevel: Math.max(0, Math.min(1, v)) }),

  setInterference: (source, value) =>
    set((s) => ({
      interference: { ...s.interference, [source]: Math.max(0, Math.min(1, value)) },
    })),

  registerAutonomousAction: (action) =>
    set((s) => ({
      autonomousActions: [
        ...s.autonomousActions,
        { ...action, lastFired: 0 },
      ],
    })),

  unregisterAutonomousAction: (id) =>
    set((s) => ({
      autonomousActions: s.autonomousActions.filter((a) => a.id !== id),
    })),

  tick: () => {
    const s = get();
    if (!s.isActive) return;

    const now = performance.now();

    // Increase collapse level — asymptotic approach to 1.0
    const newLevel = Math.min(1, s.collapseLevel + COLLAPSE_RATE);

    // Compute interference from each system — scales with collapse level
    // Each system bleeds in at different rates
    const elapsed = s.elapsed + 16; // ~60fps
    const t = elapsed / 1000; // seconds

    const interference: Record<SystemSource, number> = {
      // Fracture bleeds in first — structural instability
      fracture: Math.min(1, newLevel * 1.2 + Math.sin(t * 0.1) * 0.1),
      // Temporal bleeds in second — time instability
      temporal: Math.min(1, Math.max(0, (newLevel - 0.2) * 1.5) + Math.sin(t * 0.08) * 0.08),
      // Logic bleeds in third — causal instability
      logic: Math.min(1, Math.max(0, (newLevel - 0.35) * 1.8) + Math.sin(t * 0.06) * 0.06),
      // Awareness bleeds in last — observer instability
      awareness: Math.min(1, Math.max(0, (newLevel - 0.5) * 2) + Math.sin(t * 0.05) * 0.05),
    };

    // Fire autonomous actions
    const updatedActions = s.autonomousActions.map((action) => {
      if (now - action.lastFired < action.intervalMs) return action;
      if (Math.random() > action.probability * newLevel) return action;

      action.callback();
      return { ...action, lastFired: now };
    });

    set({
      collapseLevel: newLevel,
      interference,
      elapsed,
      autonomousActions: updatedActions,
    });
  },
}));

import { create } from "zustand";

/* ── Delayed action queue ───────────────────────────────── */

interface DelayedAction {
  id: string;
  callback: () => void;
  fireAt: number;
}

/* ── Temporal engine state ──────────────────────────────── */

interface TemporalState {
  temporalDrift: number;
  isActive: boolean;
  actions: DelayedAction[];

  scheduleDelayed: (id: string, callback: () => void, delayMs: number) => void;
  cancelDelayed: (id: string) => void;
  tick: () => void;
  setDrift: (v: number) => void;
  activate: () => void;
  deactivate: () => void;
}

export const useTemporalEngine = create<TemporalState>((set, get) => ({
  temporalDrift: 0,
  isActive: false,
  actions: [],

  scheduleDelayed: (id, callback, delayMs) => {
    const { actions } = get();
    // Cancel any existing action with same id
    const filtered = actions.filter((a) => a.id !== id);
    filtered.push({
      id,
      callback,
      fireAt: performance.now() + delayMs,
    });
    set({ actions: filtered });
  },

  cancelDelayed: (id) => {
    const { actions } = get();
    set({ actions: actions.filter((a) => a.id !== id) });
  },

  tick: () => {
    const { actions, isActive } = get();
    if (!isActive || actions.length === 0) return;

    const now = performance.now();
    const pending: DelayedAction[] = [];
    const fire: DelayedAction[] = [];

    for (const action of actions) {
      if (now >= action.fireAt) {
        fire.push(action);
      } else {
        pending.push(action);
      }
    }

    if (fire.length > 0) {
      set({ actions: pending });
      for (const action of fire) {
        action.callback();
      }
    }
  },

  setDrift: (v) => set({ temporalDrift: Math.min(Math.max(v, 0), 1) }),

  activate: () => set({ isActive: true }),

  deactivate: () => set({ isActive: false, actions: [] }),
}));

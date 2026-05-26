import { create } from "zustand";

const MAX_DIMENSION = 7;

export type TransitionPhase = "idle" | "tension" | "destabilize" | "fracture" | "separate" | "complete";

interface DimensionState {
  currentDimension: number;
  targetDimension: number;
  transitionPhase: TransitionPhase;
  isTransitioning: boolean;
  advanceDimension: () => void;
  setDimension: (n: number) => void;
  resetDimensions: () => void;
  startTransition: () => void;
  setTransitionPhase: (phase: TransitionPhase) => void;
  completeTransition: () => void;
  /** Directly jump to a dimension (bypasses FractureTransition) */
  jumpDimension: (n: number) => void;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export const useDimensionStore = create<DimensionState>((set, get) => ({
  currentDimension: 0,
  targetDimension: 0,
  transitionPhase: "idle",
  isTransitioning: false,

  advanceDimension: () => {
    const { isTransitioning, currentDimension } = get();
    if (isTransitioning) return;
    const next = clamp(currentDimension + 1, 0, MAX_DIMENSION);
    if (next === currentDimension) return;
    set({ targetDimension: next, isTransitioning: true, transitionPhase: "tension" });
  },

  setDimension: (n: number) => {
    const { isTransitioning } = get();
    if (isTransitioning) return;
    const clamped = clamp(n, 0, MAX_DIMENSION);
    set({ targetDimension: clamped, isTransitioning: true, transitionPhase: "tension" });
  },

  startTransition: () => {
    set({ isTransitioning: true, transitionPhase: "tension" });
  },

  setTransitionPhase: (phase: TransitionPhase) => {
    set({ transitionPhase: phase });
  },

  completeTransition: () => {
    const { targetDimension } = get();
    set({
      currentDimension: targetDimension,
      transitionPhase: "idle",
      isTransitioning: false,
    });
  },

  jumpDimension: (n: number) => {
    const clamped = clamp(n, 0, MAX_DIMENSION);
    set({
      currentDimension: clamped,
      targetDimension: clamped,
      transitionPhase: "idle",
      isTransitioning: false,
    });
  },

  resetDimensions: () =>
    set({
      currentDimension: 0,
      targetDimension: 0,
      transitionPhase: "idle",
      isTransitioning: false,
    }),
}));

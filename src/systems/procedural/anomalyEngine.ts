import { create } from "zustand";

/* ── Anomaly geometry ───────────────────────────────────── */

export type AnomalyGeometry =
  | "torus"
  | "icosa"
  | "sphere"
  | "cube"
  | "ring"
  | "knot"
  | "octahedron"
  | "dodecahedron";

/* ── Anomaly behavior ───────────────────────────────────── */

export type AnomalyBehavior =
  | "drift"
  | "orbit"
  | "pulse"
  | "fade-cycle"
  | "mirror-user"
  | "anticipate";

/* ── Anomaly interactivity ──────────────────────────────── */

export type AnomalyInteractivity =
  | "click-delayed"
  | "hover-react"
  | "contradictory"
  | "inert"
  | "recursive";

/* ── Anomaly type ───────────────────────────────────────── */

export type AnomalyType =
  | "portal"
  | "dead-control"
  | "contradictory-button"
  | "drifting-object"
  | "duplicate-entity"
  | "broken-panel"
  | "echo-fragment"
  | "dimensional-bleed";

/* ── Anomaly rarity ─────────────────────────────────────── */

export type AnomalyRarity = "common" | "uncommon" | "rare";

/* ── Anomaly config ─────────────────────────────────────── */

export interface AnomalyConfig {
  type: AnomalyType;
  geometry: AnomalyGeometry;
  behavior: AnomalyBehavior;
  interactivity: AnomalyInteractivity;
  position: [number, number, number];
  scale: number;
  baseOpacity: number;
  lifespan: number; // ms, or -1 for persistent
  rarity: AnomalyRarity;
}

/* ── Active anomaly ─────────────────────────────────────── */

export interface ActiveAnomaly extends AnomalyConfig {
  id: string;
  spawnedAt: number;
  fadeInComplete: boolean;
  fadeOutStarted: boolean;
}

/* ── Scheduled spawn ────────────────────────────────────── */

interface ScheduledSpawn {
  id: string;
  config: AnomalyConfig;
  fireAt: number;
}

/* ── Anomaly engine state ───────────────────────────────── */

interface AnomalyEngineState {
  activeAnomalies: ActiveAnomaly[];
  spawnQueue: ScheduledSpawn[];
  sessionSeed: number;
  isActive: boolean;

  activate: () => void;
  deactivate: () => void;
  scheduleSpawn: (config: AnomalyConfig, delayMs: number) => string;
  cancelSpawn: (id: string) => void;
  despawnAnomaly: (id: string) => void;
  tick: () => void;
}

let nextId = 0;
function genId(): string {
  return `anom-${nextId++}-${Math.random().toString(36).slice(2, 6)}`;
}

const MAX_ACTIVE = 8;

export const useAnomalyEngine = create<AnomalyEngineState>((set, get) => ({
  activeAnomalies: [],
  spawnQueue: [],
  sessionSeed: Date.now(),
  isActive: false,

  activate: () =>
    set({
      isActive: true,
      activeAnomalies: [],
      spawnQueue: [],
      sessionSeed: Date.now(),
    }),

  deactivate: () =>
    set({
      isActive: false,
      activeAnomalies: [],
      spawnQueue: [],
    }),

  scheduleSpawn: (config, delayMs) => {
    const id = genId();
    const fireAt = performance.now() + delayMs;
    set((s) => ({
      spawnQueue: [...s.spawnQueue, { id, config, fireAt }],
    }));
    return id;
  },

  cancelSpawn: (id) => {
    set((s) => ({
      spawnQueue: s.spawnQueue.filter((sp) => sp.id !== id),
    }));
  },

  despawnAnomaly: (id) => {
    set((s) => ({
      activeAnomalies: s.activeAnomalies.filter((a) => a.id !== id),
    }));
  },

  tick: () => {
    const s = get();
    if (!s.isActive) return;

    const now = performance.now();
    let changed = false;

    // Process spawn queue
    const dueSpawns: ScheduledSpawn[] = [];
    const pendingSpawns: ScheduledSpawn[] = [];
    for (const sp of s.spawnQueue) {
      if (now >= sp.fireAt) dueSpawns.push(sp);
      else pendingSpawns.push(sp);
    }

    // Spawn due anomalies (respect MAX_ACTIVE)
    const newAnomalies: ActiveAnomaly[] = [...s.activeAnomalies];
    for (const sp of dueSpawns) {
      if (newAnomalies.length >= MAX_ACTIVE) break;
      newAnomalies.push({
        ...sp.config,
        id: sp.id,
        spawnedAt: now,
        fadeInComplete: false,
        fadeOutStarted: false,
      });
      changed = true;
    }

    // Age anomalies — mark fade states, remove expired
    const alive: ActiveAnomaly[] = [];
    for (const a of newAnomalies) {
      const age = now - a.spawnedAt;

      if (a.lifespan > 0 && age > a.lifespan) {
        changed = true;
        continue; // expired — remove
      }

      // Fade in complete after 1.5s
      if (!a.fadeInComplete && age > 1500) {
        a.fadeInComplete = true;
        changed = true;
      }

      // Fade out starts 3s before lifespan end
      if (a.lifespan > 0 && !a.fadeOutStarted && age > a.lifespan - 3000) {
        a.fadeOutStarted = true;
        changed = true;
      }

      alive.push(a);
    }

    if (changed || dueSpawns.length > 0 || newAnomalies.length !== alive.length) {
      set({
        activeAnomalies: alive,
        spawnQueue: pendingSpawns,
      });
    } else if (pendingSpawns.length !== s.spawnQueue.length) {
      set({ spawnQueue: pendingSpawns });
    }
  },
}));

import { create } from "zustand";
import { generateDNA, type AnimationDNA } from "./animationDNA";

/* ── Anomaly geometry ───────────────────────────────────── */

export type AnomalyGeometry =
  | "torus"
  | "icosa"
  | "sphere"
  | "cube"
  | "ring"
  | "knot"
  | "octahedron"
  | "dodecahedron"
  | "tetrahedron"
  | "cone";

/* ── Anomaly behavior ───────────────────────────────────── */

export type AnomalyBehavior =
  | "drift"
  | "orbit"
  | "pulse"
  | "fade-cycle"
  | "mirror-user"
  | "anticipate"
  | "time-replay"
  | "ghost-follow"
  | "recursion-splinter"
  | "impossible-mirror"
  | "observer-mimic";

/* ── Anomaly interactivity ──────────────────────────────── */

export type AnomalyInteractivity =
  | "click-delayed"
  | "hover-react"
  | "contradictory"
  | "inert"
  | "recursive"
  | "phantom"
  | "ghost";

/* ── Anomaly type ───────────────────────────────────────── */

export type AnomalyType =
  | "portal"
  | "dead-control"
  | "contradictory-button"
  | "drifting-object"
  | "duplicate-entity"
  | "broken-panel"
  | "echo-fragment"
  | "dimensional-bleed"
  | "phantom-node"
  | "ghost-entity"
  | "impossible-duplicate"
  | "anticipatory-anomaly"
  | "temporal-echo"
  | "observer-mimic"
  | "recursion-splinter"
  | "false-prior-state";

/* ── Anomaly rarity ─────────────────────────────────────── */

export type AnomalyRarity = "common" | "uncommon" | "rare" | "legendary";

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
  /** Optional offset for duplicate/splinter entities */
  mirrorOffset?: [number, number, number];
}

/* ── Active anomaly ─────────────────────────────────────── */

export interface ActiveAnomaly extends AnomalyConfig {
  id: string;
  spawnedAt: number;
  fadeInComplete: boolean;
  fadeOutStarted: boolean;
  /** Animation DNA — randomized per entity for unique motion */
  dna: AnimationDNA;
}

/* ── Scheduled spawn ────────────────────────────────────── */

interface ScheduledSpawn {
  id: string;
  config: AnomalyConfig;
  fireAt: number;
}

/* ── Rare event definition ──────────────────────────────── */

export interface RareEvent {
  id: string;
  type: "recursion-burst" | "portal-multiplication" | "impossible-mirror" | "dimensional-bleed-storm";
  configs: AnomalyConfig[];
  fireAt: number;
}

/* ── Anomaly engine state ───────────────────────────────── */

interface AnomalyEngineState {
  activeAnomalies: ActiveAnomaly[];
  spawnQueue: ScheduledSpawn[];
  rareEventQueue: RareEvent[];
  sessionSeed: number;
  isActive: boolean;
  globalMaxActive: number;
  /** Pointer of spawned anomalies for temporal echo / recursion */
  recentPositions: Array<{ x: number; y: number; z: number; t: number }>;

  activate: () => void;
  deactivate: () => void;
  setGlobalMax: (n: number) => void;
  scheduleSpawn: (config: AnomalyConfig, delayMs: number) => string;
  cancelSpawn: (id: string) => void;
  despawnAnomaly: (id: string) => void;
  scheduleRareEvent: (event: Omit<RareEvent, "id">) => void;
  recordPosition: (pos: [number, number, number]) => void;
  tick: () => void;
}

let nextId = 0;
function genId(): string {
  return `anom-${nextId++}-${Math.random().toString(36).slice(2, 6)}`;
}

const MAX_RECENT_POSITIONS = 60;

export const useAnomalyEngine = create<AnomalyEngineState>((set, get) => ({
  activeAnomalies: [],
  spawnQueue: [],
  rareEventQueue: [],
  sessionSeed: Date.now(),
  isActive: false,
  globalMaxActive: 14,
  recentPositions: [],

  activate: () =>
    set({
      isActive: true,
      activeAnomalies: [],
      spawnQueue: [],
      rareEventQueue: [],
      sessionSeed: Date.now(),
      recentPositions: [],
    }),

  deactivate: () =>
    set({
      isActive: false,
      activeAnomalies: [],
      spawnQueue: [],
      rareEventQueue: [],
      recentPositions: [],
    }),

  setGlobalMax: (n) => set({ globalMaxActive: n }),

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

  scheduleRareEvent: (event) => {
    const id = `rare-${genId()}`;
    set((s) => ({
      rareEventQueue: [...s.rareEventQueue, { ...event, id }],
    }));
  },

  recordPosition: (pos) => {
    set((s) => {
      const next = [...s.recentPositions, { x: pos[0], y: pos[1], z: pos[2], t: performance.now() }];
      if (next.length > MAX_RECENT_POSITIONS) next.shift();
      return { recentPositions: next };
    });
  },

  tick: () => {
    const s = get();
    if (!s.isActive) return;

    const now = performance.now();
    let changed = false;

    // ── Process rare events ──
    const dueRare: RareEvent[] = [];
    const pendingRare: RareEvent[] = [];
    for (const ev of s.rareEventQueue) {
      if (now >= ev.fireAt) dueRare.push(ev);
      else pendingRare.push(ev);
    }

    const newAnomalies: ActiveAnomaly[] = [...s.activeAnomalies];

    // Spawn rare event anomalies
    for (const ev of dueRare) {
      for (const config of ev.configs) {
        if (newAnomalies.length >= s.globalMaxActive) break;
        newAnomalies.push({
          ...config,
          id: genId(),
          spawnedAt: now,
          fadeInComplete: false,
          fadeOutStarted: false,
          dna: generateDNA(),
        });
        changed = true;
      }
    }

    // ── Process spawn queue ──
    const dueSpawns: ScheduledSpawn[] = [];
    const pendingSpawns: ScheduledSpawn[] = [];
    for (const sp of s.spawnQueue) {
      if (now >= sp.fireAt) dueSpawns.push(sp);
      else pendingSpawns.push(sp);
    }

    for (const sp of dueSpawns) {
      if (newAnomalies.length >= s.globalMaxActive) break;
      newAnomalies.push({
        ...sp.config,
        id: sp.id,
        spawnedAt: now,
        dna: generateDNA(),
        fadeInComplete: false,
        fadeOutStarted: false,
      });
      changed = true;
    }

    // ── Age anomalies ──
    const alive: ActiveAnomaly[] = [];
    for (const a of newAnomalies) {
      const age = now - a.spawnedAt;

      if (a.lifespan > 0 && age > a.lifespan) {
        changed = true;
        continue;
      }

      if (!a.fadeInComplete && age > 1500) {
        a.fadeInComplete = true;
        changed = true;
      }

      if (a.lifespan > 0 && !a.fadeOutStarted && age > a.lifespan - 3000) {
        a.fadeOutStarted = true;
        changed = true;
      }

      alive.push(a);
    }

    // Clean old recent positions
    const recentPositions = s.recentPositions.filter((p) => now - p.t < 15000);

    if (
      changed ||
      dueSpawns.length > 0 ||
      dueRare.length > 0 ||
      newAnomalies.length !== alive.length ||
      recentPositions.length !== s.recentPositions.length
    ) {
      set({
        activeAnomalies: alive,
        spawnQueue: pendingSpawns,
        rareEventQueue: pendingRare,
        recentPositions,
      });
    }
  },
}));

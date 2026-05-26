import { useEffect, useRef, useCallback } from "react";
import {
  useAnomalyEngine,
  type AnomalyConfig,
  type AnomalyGeometry,
  type AnomalyBehavior,
  type AnomalyInteractivity,
  type AnomalyType,
  type AnomalyRarity,
} from "./anomalyEngine";

/* ── Dimension spawn profile ────────────────────────────── */

export interface DimensionAnomalyProfile {
  allowedTypes: AnomalyType[];
  allowedGeometries: AnomalyGeometry[];
  allowedBehaviors: AnomalyBehavior[];
  allowedInteractivity: AnomalyInteractivity[];
  /** Spawn interval range in ms — adaptive, gets faster as anomaly count drops */
  spawnInterval: [number, number];
  maxConcurrent: number;
  initialBatch: number;
  positionBounds: [[number, number], [number, number], [number, number]];
  scaleRange: [number, number];
  opacityRange: [number, number];
  lifespanRange: [number, number];
  rarityWeights: [number, number, number, number]; // common, uncommon, rare, legendary
  /** Rare event types available in this dimension */
  rareEventTypes: Array<"recursion-burst" | "portal-multiplication" | "impossible-mirror" | "dimensional-bleed-storm">;
  /** Rare event chance per spawn cycle (0-1) */
  rareEventChance: number;
}

/* ── Dimension profiles ─────────────────────────────────── */

export const DIMENSION_PROFILES: Record<string, DimensionAnomalyProfile> = {
  depth: {
    allowedTypes: [
      "drifting-object", "echo-fragment", "dead-control",
      "phantom-node", "ghost-entity",
    ],
    allowedGeometries: ["torus", "icosa", "sphere", "ring", "cone"],
    allowedBehaviors: ["drift", "orbit", "fade-cycle", "ghost-follow", "time-replay"],
    allowedInteractivity: ["inert", "hover-react", "click-delayed", "phantom"],
    spawnInterval: [3000, 8000],
    maxConcurrent: 6,
    initialBatch: 3,
    positionBounds: [[-5, 5], [-3, 3], [-6, -1]],
    scaleRange: [0.15, 0.5],
    opacityRange: [0.03, 0.08],
    lifespanRange: [12000, 28000],
    rarityWeights: [0.5, 0.28, 0.17, 0.05],
    rareEventTypes: ["recursion-burst"],
    rareEventChance: 0.03,
  },

  temporal: {
    allowedTypes: [
      "echo-fragment", "duplicate-entity", "drifting-object", "broken-panel",
      "temporal-echo", "ghost-entity", "false-prior-state", "impossible-duplicate",
    ],
    allowedGeometries: ["torus", "icosa", "sphere", "cube", "knot", "ring", "tetrahedron"],
    allowedBehaviors: ["drift", "fade-cycle", "pulse", "mirror-user", "time-replay", "ghost-follow", "recursion-splinter"],
    allowedInteractivity: ["click-delayed", "hover-react", "inert", "recursive", "ghost", "phantom"],
    spawnInterval: [2000, 6000],
    maxConcurrent: 10,
    initialBatch: 4,
    positionBounds: [[-6, 6], [-4, 4], [-8, -1]],
    scaleRange: [0.12, 0.55],
    opacityRange: [0.035, 0.1],
    lifespanRange: [10000, 22000],
    rarityWeights: [0.42, 0.32, 0.18, 0.08],
    rareEventTypes: ["recursion-burst", "portal-multiplication"],
    rareEventChance: 0.04,
  },

  logic: {
    allowedTypes: [
      "contradictory-button", "dead-control", "duplicate-entity", "portal",
      "impossible-duplicate", "phantom-node", "recursion-splinter",
    ],
    allowedGeometries: ["dodecahedron", "icosa", "cube", "torus", "knot", "octahedron"],
    allowedBehaviors: ["pulse", "fade-cycle", "mirror-user", "anticipate", "impossible-mirror", "recursion-splinter"],
    allowedInteractivity: ["contradictory", "click-delayed", "recursive", "inert", "phantom"],
    spawnInterval: [2500, 7000],
    maxConcurrent: 9,
    initialBatch: 3,
    positionBounds: [[-5, 5], [-3.5, 3.5], [-6, -1]],
    scaleRange: [0.15, 0.5],
    opacityRange: [0.035, 0.09],
    lifespanRange: [12000, 28000],
    rarityWeights: [0.45, 0.3, 0.18, 0.07],
    rareEventTypes: ["impossible-mirror", "portal-multiplication"],
    rareEventChance: 0.035,
  },

  observer: {
    allowedTypes: [
      "drifting-object", "echo-fragment", "duplicate-entity", "dead-control",
      "observer-mimic", "anticipatory-anomaly", "ghost-entity",
    ],
    allowedGeometries: ["sphere", "icosa", "octahedron", "torus", "ring"],
    allowedBehaviors: ["drift", "mirror-user", "anticipate", "fade-cycle", "observer-mimic", "ghost-follow"],
    allowedInteractivity: ["hover-react", "inert", "click-delayed", "ghost"],
    spawnInterval: [2500, 7000],
    maxConcurrent: 7,
    initialBatch: 3,
    positionBounds: [[-5, 5], [-3, 3], [-7, -1]],
    scaleRange: [0.15, 0.45],
    opacityRange: [0.025, 0.08],
    lifespanRange: [14000, 30000],
    rarityWeights: [0.48, 0.3, 0.17, 0.05],
    rareEventTypes: ["impossible-mirror"],
    rareEventChance: 0.025,
  },

  collapse: {
    allowedTypes: [
      "dimensional-bleed", "duplicate-entity", "echo-fragment", "portal", "drifting-object",
      "phantom-node", "ghost-entity", "impossible-duplicate", "temporal-echo",
      "observer-mimic", "recursion-splinter", "false-prior-state", "anticipatory-anomaly",
    ],
    allowedGeometries: ["torus", "icosa", "sphere", "cube", "knot", "ring", "octahedron", "dodecahedron", "tetrahedron", "cone"],
    allowedBehaviors: ["drift", "orbit", "pulse", "fade-cycle", "mirror-user", "anticipate", "time-replay", "ghost-follow", "recursion-splinter", "impossible-mirror", "observer-mimic"],
    allowedInteractivity: ["click-delayed", "hover-react", "contradictory", "recursive", "inert", "phantom", "ghost"],
    spawnInterval: [2000, 5000],
    maxConcurrent: 14,
    initialBatch: 4,
    positionBounds: [[-7, 7], [-5, 5], [-10, -1]],
    scaleRange: [0.12, 0.6],
    opacityRange: [0.025, 0.1],
    lifespanRange: [8000, 22000],
    rarityWeights: [0.35, 0.32, 0.22, 0.11],
    rareEventTypes: ["recursion-burst", "portal-multiplication", "impossible-mirror", "dimensional-bleed-storm"],
    rareEventChance: 0.06,
  },
};

/* ── Helpers ────────────────────────────────────────────── */

function randRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickRarity(weights: [number, number, number, number]): AnomalyRarity {
  const roll = Math.random();
  if (roll < weights[0]) return "common";
  if (roll < weights[0] + weights[1]) return "uncommon";
  if (roll < weights[0] + weights[1] + weights[2]) return "rare";
  return "legendary";
}

/* ── Anomaly config generator ───────────────────────────── */

function generateAnomaly(profile: DimensionAnomalyProfile): AnomalyConfig {
  const rarity = pickRarity(profile.rarityWeights);
  const isRare = rarity === "rare" || rarity === "legendary";
  const isLegendary = rarity === "legendary";
  const type = pick(profile.allowedTypes);

  const mirrorOffset: [number, number, number] | undefined =
    type === "impossible-duplicate" || type === "recursion-splinter"
      ? [randRange(-1.5, 1.5), randRange(-1, 1), randRange(-0.5, 0.5)]
      : undefined;

  return {
    type,
    geometry: pick(profile.allowedGeometries),
    behavior: pick(profile.allowedBehaviors),
    interactivity: pick(profile.allowedInteractivity),
    position: [
      randRange(...profile.positionBounds[0]),
      randRange(...profile.positionBounds[1]),
      randRange(...profile.positionBounds[2]),
    ],
    scale: randRange(...profile.scaleRange) * (isLegendary ? 1.4 : isRare ? 1.2 : 1),
    baseOpacity: randRange(...profile.opacityRange) * (isLegendary ? 1.5 : isRare ? 1.3 : 1),
    lifespan: randRange(...profile.lifespanRange) * (isLegendary ? 1.5 : 1),
    rarity,
    mirrorOffset,
  };
}

/* ── Rare event generator ───────────────────────────────── */

function generateRareEvent(
  profile: DimensionAnomalyProfile,
  eventType: "recursion-burst" | "portal-multiplication" | "impossible-mirror" | "dimensional-bleed-storm",
  recentPositions: Array<{ x: number; y: number; z: number; t: number }>,
) {
  const configs: AnomalyConfig[] = [];
  const count = eventType === "recursion-burst" ? 5 : eventType === "portal-multiplication" ? 4 : 3;

  for (let i = 0; i < count; i++) {
    const rarity: AnomalyRarity = i === 0 ? "legendary" : i < 3 ? "rare" : "uncommon";

    let position: [number, number, number];
    if (recentPositions.length > 0 && Math.random() < 0.5) {
      const rp = pick(recentPositions);
      position = [rp.x + randRange(-1, 1), rp.y + randRange(-1, 1), rp.z + randRange(-0.5, 0.5)];
    } else {
      position = [
        randRange(...profile.positionBounds[0]),
        randRange(...profile.positionBounds[1]),
        randRange(...profile.positionBounds[2]),
      ];
    }

    configs.push({
      type: eventType === "recursion-burst" ? "recursion-splinter"
        : eventType === "portal-multiplication" ? "portal"
        : eventType === "impossible-mirror" ? "impossible-duplicate"
        : "dimensional-bleed",
      geometry: pick(profile.allowedGeometries),
      behavior: eventType === "recursion-burst" ? "recursion-splinter"
        : eventType === "impossible-mirror" ? "impossible-mirror"
        : pick(profile.allowedBehaviors),
      interactivity: eventType === "portal-multiplication" ? "click-delayed" : "inert",
      position,
      scale: randRange(0.2, 0.6) * (rarity === "legendary" ? 1.4 : 1.2),
      baseOpacity: randRange(0.04, 0.12),
      lifespan: randRange(12000, 25000),
      rarity,
      mirrorOffset: eventType === "impossible-mirror"
        ? [randRange(-2, 2), randRange(-1.5, 1.5), randRange(-0.5, 0.5)]
        : undefined,
    });
  }

  return { type: eventType, configs, fireAt: 0 };
}

/* ── Hook ───────────────────────────────────────────────── */

export function useAnomalySpawner(profile: DimensionAnomalyProfile) {
  const scheduleSpawn = useAnomalyEngine((s) => s.scheduleSpawn);
  const scheduleRareEvent = useAnomalyEngine((s) => s.scheduleRareEvent);
  const isActive = useAnomalyEngine((s) => s.isActive);
  const activeAnomalies = useAnomalyEngine((s) => s.activeAnomalies);
  const recentPositions = useAnomalyEngine((s) => s.recentPositions);
  const setGlobalMax = useAnomalyEngine((s) => s.setGlobalMax);

  const spawnedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  // Adaptive spawn interval — faster when count is low
  const getAdaptiveInterval = useCallback(() => {
    const count = useAnomalyEngine.getState().activeAnomalies.length;
    const [min, max] = profile.spawnInterval;
    const ratio = count / profile.maxConcurrent;
    // When room is available: fast. When near capacity: slow.
    const base = min + (max - min) * ratio;
    return base + randRange(-500, 500);
  }, [profile]);

  useEffect(() => {
    if (!isActive || spawnedRef.current) return;
    spawnedRef.current = true;

    setGlobalMax(profile.maxConcurrent);

    // Initial batch — staggered
    for (let i = 0; i < profile.initialBatch; i++) {
      const config = generateAnomaly(profile);
      const delay = 1000 + i * randRange(800, 2000);
      scheduleSpawn(config, delay);
    }

    // Periodic spawning with adaptive pacing
    const spawnNext = () => {
      const state = useAnomalyEngine.getState();
      if (!state.isActive) return;

      const count = state.activeAnomalies.length;
      if (count < profile.maxConcurrent) {
        const config = generateAnomaly(profile);
        scheduleSpawn(config, 0);

        // Record position for rare event generation
        state.recordPosition(config.position);
      }

      // Rare event check
      if (Math.random() < profile.rareEventChance && profile.rareEventTypes.length > 0) {
        const eventType = pick(profile.rareEventTypes);
        const positions = useAnomalyEngine.getState().recentPositions;
        const event = generateRareEvent(profile, eventType, positions);
        scheduleRareEvent(event);
      }

      intervalRef.current = setTimeout(spawnNext, getAdaptiveInterval()) as unknown as ReturnType<typeof setInterval>;
    };

    intervalRef.current = setTimeout(spawnNext, getAdaptiveInterval()) as unknown as ReturnType<typeof setInterval>;

    return () => {
      clearTimeout(intervalRef.current as unknown as number);
      spawnedRef.current = false;
    };
  }, [isActive, profile, scheduleSpawn, scheduleRareEvent, setGlobalMax, getAdaptiveInterval]);

  return activeAnomalies;
}

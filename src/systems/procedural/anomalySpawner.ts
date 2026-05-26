import { useEffect, useRef } from "react";
import { useAnomalyEngine, type AnomalyConfig, type AnomalyGeometry, type AnomalyBehavior, type AnomalyInteractivity, type AnomalyType, type AnomalyRarity } from "./anomalyEngine";

/* ── Dimension spawn profile ────────────────────────────── */

export interface DimensionAnomalyProfile {
  /** Which anomaly types can spawn in this dimension */
  allowedTypes: AnomalyType[];
  /** Which geometries */
  allowedGeometries: AnomalyGeometry[];
  /** Which behaviors */
  allowedBehaviors: AnomalyBehavior[];
  /** Which interactivity modes */
  allowedInteractivity: AnomalyInteractivity[];
  /** Spawn interval range in ms */
  spawnInterval: [number, number];
  /** Max concurrent anomalies from this profile */
  maxConcurrent: number;
  /** Initial batch size */
  initialBatch: number;
  /** Position generation bounds [xRange, yRange, zRange] */
  positionBounds: [[number, number], [number, number], [number, number]];
  /** Scale range */
  scaleRange: [number, number];
  /** Opacity range */
  opacityRange: [number, number];
  /** Lifespan range in ms (-1 = persistent allowed) */
  lifespanRange: [number, number];
  /** Rarity weights: [common, uncommon, rare] — probabilities must sum to 1 */
  rarityWeights: [number, number, number];
}

/* ── Default profiles per dimension ─────────────────────── */

export const DIMENSION_PROFILES: Record<string, DimensionAnomalyProfile> = {
  depth: {
    allowedTypes: ["drifting-object", "echo-fragment", "dead-control"],
    allowedGeometries: ["torus", "icosa", "sphere", "ring"],
    allowedBehaviors: ["drift", "orbit", "fade-cycle"],
    allowedInteractivity: ["inert", "hover-react", "click-delayed"],
    spawnInterval: [15000, 30000],
    maxConcurrent: 3,
    initialBatch: 2,
    positionBounds: [[-5, 5], [-3, 3], [-6, -1]],
    scaleRange: [0.2, 0.5],
    opacityRange: [0.03, 0.08],
    lifespanRange: [15000, 30000],
    rarityWeights: [0.6, 0.3, 0.1],
  },
  temporal: {
    allowedTypes: ["echo-fragment", "duplicate-entity", "drifting-object", "broken-panel"],
    allowedGeometries: ["torus", "icosa", "sphere", "cube", "knot", "ring"],
    allowedBehaviors: ["drift", "fade-cycle", "pulse", "mirror-user"],
    allowedInteractivity: ["click-delayed", "hover-react", "inert", "recursive"],
    spawnInterval: [8000, 20000],
    maxConcurrent: 4,
    initialBatch: 3,
    positionBounds: [[-6, 6], [-4, 4], [-8, -1]],
    scaleRange: [0.15, 0.55],
    opacityRange: [0.04, 0.1],
    lifespanRange: [12000, 25000],
    rarityWeights: [0.5, 0.35, 0.15],
  },
  logic: {
    allowedTypes: ["contradictory-button", "dead-control", "duplicate-entity", "portal"],
    allowedGeometries: ["dodecahedron", "icosa", "cube", "torus", "knot"],
    allowedBehaviors: ["pulse", "fade-cycle", "mirror-user", "anticipate"],
    allowedInteractivity: ["contradictory", "click-delayed", "recursive", "inert"],
    spawnInterval: [10000, 25000],
    maxConcurrent: 3,
    initialBatch: 2,
    positionBounds: [[-5, 5], [-3.5, 3.5], [-6, -1]],
    scaleRange: [0.2, 0.5],
    opacityRange: [0.04, 0.09],
    lifespanRange: [15000, 30000],
    rarityWeights: [0.5, 0.3, 0.2],
  },
  observer: {
    allowedTypes: ["drifting-object", "echo-fragment", "duplicate-entity", "dead-control"],
    allowedGeometries: ["sphere", "icosa", "octahedron", "torus"],
    allowedBehaviors: ["drift", "mirror-user", "anticipate", "fade-cycle"],
    allowedInteractivity: ["hover-react", "inert", "click-delayed"],
    spawnInterval: [12000, 28000],
    maxConcurrent: 3,
    initialBatch: 2,
    positionBounds: [[-5, 5], [-3, 3], [-7, -1]],
    scaleRange: [0.2, 0.45],
    opacityRange: [0.03, 0.08],
    lifespanRange: [18000, 35000],
    rarityWeights: [0.55, 0.3, 0.15],
  },
  collapse: {
    allowedTypes: ["dimensional-bleed", "duplicate-entity", "echo-fragment", "portal", "drifting-object"],
    allowedGeometries: ["torus", "icosa", "sphere", "cube", "knot", "ring", "octahedron", "dodecahedron"],
    allowedBehaviors: ["drift", "orbit", "pulse", "fade-cycle", "mirror-user", "anticipate"],
    allowedInteractivity: ["click-delayed", "hover-react", "contradictory", "recursive", "inert"],
    spawnInterval: [6000, 16000],
    maxConcurrent: 5,
    initialBatch: 3,
    positionBounds: [[-7, 7], [-5, 5], [-10, -1]],
    scaleRange: [0.15, 0.6],
    opacityRange: [0.03, 0.1],
    lifespanRange: [10000, 25000],
    rarityWeights: [0.4, 0.35, 0.25],
  },
};

/* ── Random helpers ─────────────────────────────────────── */

function randRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickRarity(weights: [number, number, number]): AnomalyRarity {
  const roll = Math.random();
  if (roll < weights[0]) return "common";
  if (roll < weights[0] + weights[1]) return "uncommon";
  return "rare";
}

/* ── Generate a random anomaly config from a profile ────── */

function generateAnomaly(profile: DimensionAnomalyProfile): AnomalyConfig {
  const rarity = pickRarity(profile.rarityWeights);
  const isRare = rarity === "rare";

  return {
    type: pick(profile.allowedTypes),
    geometry: pick(profile.allowedGeometries),
    behavior: pick(profile.allowedBehaviors),
    interactivity: pick(profile.allowedInteractivity),
    position: [
      randRange(...profile.positionBounds[0]),
      randRange(...profile.positionBounds[1]),
      randRange(...profile.positionBounds[2]),
    ],
    scale: randRange(...profile.scaleRange) * (isRare ? 1.2 : 1),
    baseOpacity: randRange(...profile.opacityRange) * (isRare ? 1.3 : 1),
    lifespan: randRange(...profile.lifespanRange),
    rarity,
  };
}

/* ── Hook ───────────────────────────────────────────────── */

export function useAnomalySpawner(profile: DimensionAnomalyProfile) {
  const scheduleSpawn = useAnomalyEngine((s) => s.scheduleSpawn);
  const isActive = useAnomalyEngine((s) => s.isActive);
  const activeAnomalies = useAnomalyEngine((s) => s.activeAnomalies);
  const spawnedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  // Initial batch
  useEffect(() => {
    if (!isActive || spawnedRef.current) return;
    spawnedRef.current = true;

    for (let i = 0; i < profile.initialBatch; i++) {
      const config = generateAnomaly(profile);
      const delay = 2000 + i * randRange(1000, 3000);
      scheduleSpawn(config, delay);
    }

    // Periodic spawning
    intervalRef.current = setInterval(() => {
      const currentCount = useAnomalyEngine.getState().activeAnomalies.length;
      if (currentCount >= profile.maxConcurrent) return;

      const config = generateAnomaly(profile);
      scheduleSpawn(config, 0);
    }, randRange(...profile.spawnInterval));

    return () => {
      clearInterval(intervalRef.current);
      spawnedRef.current = false;
    };
  }, [isActive, profile, scheduleSpawn]);

  return activeAnomalies;
}

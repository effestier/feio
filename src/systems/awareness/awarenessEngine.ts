import { create } from "zustand";

/* ── Behavior metrics ───────────────────────────────────── */

export interface BehaviorMetrics {
  /** Current pointer velocity in px/ms */
  pointerVelocity: number;
  /** Pointer acceleration (velocity delta per second) */
  pointerAcceleration: number;
  /** Clicks in the last 10 seconds */
  clickFrequency: number;
  /** Duration of current hover in ms */
  hoverDwell: number;
  /** Time since last interaction in ms */
  inactivityDuration: number;
  /** Whether a repeating interaction pattern is detected */
  isRepeating: boolean;
  /** Whether pointer is near interactive element but not clicking */
  isHesitating: boolean;
  /** Normalized pointer position */
  pointerX: number;
  pointerY: number;
  /** Total interactions tracked */
  totalClicks: number;
  /** Dimensions traversed */
  dimensionsTraversed: number;
}

/* ── Raw event buffers ──────────────────────────────────── */

interface PointerSample {
  x: number;
  y: number;
  t: number;
}

interface ClickSample {
  t: number;
}

/* ── Awareness state ────────────────────────────────────── */

interface AwarenessState {
  metrics: BehaviorMetrics;
  observations: string[];
  attentionLevel: number;
  isActive: boolean;

  /* Raw buffers (not in metrics) */
  pointerBuffer: PointerSample[];
  clickBuffer: ClickSample[];

  /* Mutations */
  activate: () => void;
  deactivate: () => void;
  recordPointerMove: (x: number, y: number) => void;
  recordClick: () => void;
  recordHover: (isHovering: boolean) => void;
  recordDimensionTraversal: () => void;
  tick: () => void;
  getObservation: () => string;
}

const WINDOW_MS = 10000;
const VELOCITY_WINDOW = 5;
const HESITATION_VELOCITY_THRESHOLD = 0.02; // px/ms
const HESITATION_PROXIMITY = 0.15; // normalized distance
const RAPID_CLICK_THRESHOLD = 4; // clicks per 10s
const IDLE_THRESHOLD = 5000; // ms
const REPEAT_PATTERN_MIN = 3;

const DEFAULT_METRICS: BehaviorMetrics = {
  pointerVelocity: 0,
  pointerAcceleration: 0,
  clickFrequency: 0,
  hoverDwell: 0,
  inactivityDuration: 0,
  isRepeating: false,
  isHesitating: false,
  pointerX: 0,
  pointerY: 0,
  totalClicks: 0,
  dimensionsTraversed: 0,
};

/* ── Observation generator ──────────────────────────────── */

function generateObservations(m: BehaviorMetrics, hoverStart: number | null, now: number): string[] {
  const obs: string[] = [];

  // Inactivity
  if (m.inactivityDuration > IDLE_THRESHOLD) {
    obs.push("observer state: dormant");
  } else if (m.isHesitating) {
    obs.push("decision latency: elevated");
  } else {
    obs.push("observer state: active");
  }

  // Pointer behavior
  if (m.pointerAcceleration > 2) {
    obs.push("pointer acceleration: anomalous");
  } else if (m.pointerVelocity > 1.5) {
    obs.push("pointer velocity: elevated");
  } else if (m.pointerVelocity < 0.05 && m.inactivityDuration < 2000) {
    obs.push("pointer velocity: minimal");
  }

  // Click patterns
  if (m.clickFrequency >= RAPID_CLICK_THRESHOLD) {
    obs.push("interaction compulsion: detected");
  } else if (m.clickFrequency === 0 && m.inactivityDuration < 3000) {
    obs.push("click inhibition: observed");
  }

  // Repetition
  if (m.isRepeating) {
    obs.push("recursive behavior: recognized");
  }

  // Hover
  if (hoverStart !== null) {
    const dwell = now - hoverStart;
    if (dwell > 3000) {
      obs.push("focus fixation: sustained");
    }
  }

  return obs;
}

/* ── Attention level computation ────────────────────────── */

function computeAttention(m: BehaviorMetrics): number {
  let attention = 0;

  // Active pointer movement
  attention += Math.min(m.pointerVelocity * 0.3, 0.3);

  // Click activity
  attention += Math.min(m.clickFrequency * 0.08, 0.3);

  // Hover engagement
  attention += Math.min(m.hoverDwell * 0.0001, 0.2);

  // Decay for inactivity
  attention -= Math.min(m.inactivityDuration * 0.00005, 0.4);

  // Boost for hesitation (the system is watching more closely)
  if (m.isHesitating) attention += 0.15;

  return Math.max(0, Math.min(1, attention));
}

/* ── Repeating pattern detection ────────────────────────── */

function detectRepetition(clickBuffer: ClickSample[]): boolean {
  if (clickBuffer.length < REPEAT_PATTERN_MIN) return false;

  // Check if click intervals are roughly uniform (periodic clicking)
  const intervals: number[] = [];
  for (let i = 1; i < clickBuffer.length; i++) {
    intervals.push(clickBuffer[i].t - clickBuffer[i - 1].t);
  }

  if (intervals.length < 2) return false;

  const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const variance = intervals.reduce((s, i) => s + (i - mean) ** 2, 0) / intervals.length;
  const cv = Math.sqrt(variance) / (mean || 1);

  // Low coefficient of variation = periodic clicking
  return cv < 0.3 && mean < 2000;
}

/* ── Store ──────────────────────────────────────────────── */

export const useAwarenessEngine = create<AwarenessState>((set, get) => ({
  metrics: { ...DEFAULT_METRICS },
  observations: ["observer state: initializing"],
  attentionLevel: 0,
  isActive: false,
  pointerBuffer: [],
  clickBuffer: [],

  activate: () =>
    set({
      isActive: true,
      metrics: { ...DEFAULT_METRICS },
      observations: ["observer state: calibrating"],
      attentionLevel: 0,
      pointerBuffer: [],
      clickBuffer: [],
    }),

  deactivate: () =>
    set({
      isActive: false,
      pointerBuffer: [],
      clickBuffer: [],
    }),

  recordPointerMove: (x, y) => {
    const now = performance.now();
    set((s) => {
      const buffer = [...s.pointerBuffer, { x, y, t: now }];
      // Keep last 2 seconds of samples
      const cutoff = now - 2000;
      while (buffer.length > 0 && buffer[0].t < cutoff) buffer.shift();

      // Compute velocity from recent samples
      let velocity = 0;
      let acceleration = 0;
      if (buffer.length >= 2) {
        const recent = buffer.slice(-VELOCITY_WINDOW);
        const velocities: number[] = [];
        for (let i = 1; i < recent.length; i++) {
          const dx = recent[i].x - recent[i - 1].x;
          const dy = recent[i].y - recent[i - 1].y;
          const dt = recent[i].t - recent[i - 1].t;
          if (dt > 0) {
            velocities.push(Math.sqrt(dx * dx + dy * dy) / dt);
          }
        }
        velocity = velocities.length > 0
          ? velocities.reduce((a, b) => a + b, 0) / velocities.length
          : 0;

        if (velocities.length >= 2) {
          acceleration = (velocities[velocities.length - 1] - velocities[0]) /
            ((recent[recent.length - 1].t - recent[0].t) / 1000);
        }
      }

      return {
        pointerBuffer: buffer,
        metrics: {
          ...s.metrics,
          pointerVelocity: velocity,
          pointerAcceleration: Math.abs(acceleration),
          pointerX: x,
          pointerY: y,
          inactivityDuration: 0,
        },
      };
    });
  },

  recordClick: () => {
    const now = performance.now();
    set((s) => {
      const clickBuffer = [...s.clickBuffer, { t: now }];
      const cutoff = now - WINDOW_MS;
      while (clickBuffer.length > 0 && clickBuffer[0].t < cutoff) clickBuffer.shift();

      return {
        clickBuffer,
        metrics: {
          ...s.metrics,
          clickFrequency: clickBuffer.length,
          totalClicks: s.metrics.totalClicks + 1,
          inactivityDuration: 0,
        },
      };
    });
  },

  recordHover: (isHovering) => {
    set((s) => ({
      metrics: {
        ...s.metrics,
        hoverDwell: isHovering ? s.metrics.hoverDwell + 16 : 0,
        isHesitating: isHovering && s.metrics.pointerVelocity < HESITATION_VELOCITY_THRESHOLD,
      },
    }));
  },

  recordDimensionTraversal: () => {
    set((s) => ({
      metrics: {
        ...s.metrics,
        dimensionsTraversed: s.metrics.dimensionsTraversed + 1,
      },
    }));
  },

  tick: () => {
    const s = get();
    if (!s.isActive) return;

    const now = performance.now();

    // Decay click frequency (remove old entries)
    const clickBuffer = s.clickBuffer.filter((c) => now - c.t < WINDOW_MS);

    // Inactivity
    const lastInteraction = s.pointerBuffer.length > 0
      ? s.pointerBuffer[s.pointerBuffer.length - 1].t
      : now;
    const lastClick = clickBuffer.length > 0
      ? clickBuffer[clickBuffer.length - 1].t
      : now;
    const lastActivity = Math.max(lastInteraction, lastClick);
    const inactivity = now - lastActivity;

    // Detect repetition
    const isRepeating = detectRepetition(clickBuffer);

    const metrics: BehaviorMetrics = {
      ...s.metrics,
      clickFrequency: clickBuffer.length,
      inactivityDuration: inactivity,
      isRepeating,
    };

    const observations = generateObservations(metrics, null, now);
    const attentionLevel = computeAttention(metrics);

    set({ metrics, observations, attentionLevel, clickBuffer });
  },

  getObservation: () => {
    const { observations } = get();
    if (observations.length === 0) return "observer state: calibrating";
    return observations[Math.floor(Math.random() * observations.length)];
  },
}));

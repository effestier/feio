/**
 * Animation DNA — composable parametric animation system.
 *
 * Each anomaly gets a random "DNA" — a set of numeric parameters that
 * combine to produce a unique animation. No switch cases. No hardcoded
 * behavior names. Just math.
 *
 * With the parameter ranges below, the effective unique animation count is:
 *   baseMotion(6) × opacityMode(5) × scaleMode(4) × rotMode(4) × pointerMode(4)
 *   = 1920 combinations before considering the continuous parameter values.
 */

/* ── Animation DNA — all numeric, all randomizable ──────── */

export interface AnimationDNA {
  /* ── Base motion (layered sinusoidal) ── */
  // Three independent oscillation axes with frequency + amplitude
  freqX: number;    // 0.01 – 0.5
  freqY: number;    // 0.01 – 0.5
  freqZ: number;    // 0.01 – 0.3
  ampX: number;     // 0.05 – 1.5
  ampY: number;     // 0.05 – 1.2
  ampZ: number;     // 0.02 – 0.8
  // Phase offsets between axes (creates Lissajous-like paths)
  phaseXY: number;  // 0 – π
  phaseXZ: number;  // 0 – π
  phaseYZ: number;  // 0 – π
  // Motion shape: 1 = pure sine, 2 = squared (sharp turns), 0.5 = flattened
  motionPowerX: number; // 0.3 – 3
  motionPowerY: number; // 0.3 – 3
  motionPowerZ: number; // 0.3 – 3

  /* ── Secondary motion (adds to base) ── */
  secFreqX: number;  // 0 – 0.3 (0 = no secondary)
  secFreqY: number;  // 0 – 0.3
  secAmpX: number;   // 0 – 0.5
  secAmpY: number;   // 0 – 0.5
  // Wobble — high-frequency micro-jitter
  wobbleFreq: number; // 0 – 8
  wobbleAmp: number;  // 0 – 0.1

  /* ── Opacity behavior ── */
  // Base opacity oscillation
  opacityFreq: number;   // 0.05 – 2
  opacityAmp: number;    // 0 – 0.5 (0 = constant)
  opacityPhase: number;  // 0 – 2π
  // Opacity shape: 1 = sine, >1 = sharper peaks, <1 = broader
  opacityPower: number;  // 0.3 – 4
  // Flicker — random opacity spikes
  flickerChance: number; // 0 – 0.1
  flickerIntensity: number; // 0.2 – 1

  /* ── Scale behavior ── */
  scaleFreq: number;    // 0.1 – 3
  scaleAmp: number;     // 0 – 0.25
  scalePhase: number;   // 0 – 2π
  scalePower: number;   // 0.5 – 4
  // Breathing vs pulsing: 0 = smooth breathe, 1 = sharp pulse
  scaleSharpness: number; // 0 – 1

  /* ── Rotation behavior ── */
  rotSpeedX: number;   // -0.02 – 0.02
  rotSpeedY: number;   // -0.02 – 0.02
  rotSpeedZ: number;   // -0.02 – 0.02
  // Rotation oscillation (reverses direction periodically)
  rotOscFreq: number;  // 0 – 0.5
  rotOscAmp: number;   // 0 – 1 (0 = constant rotation)

  /* ── Pointer interaction ── */
  // How strongly this anomaly responds to the pointer
  pointerInfluence: number; // 0 – 0.15
  // Pointer response mode: 0 = attract, 1 = repel, 2 = orbit-around, 3 = mirror-invert
  pointerMode: number;      // 0 – 3.99 (floored to pick mode)
  // Pointer lag — how slowly it responds
  pointerLag: number;       // 0.005 – 0.08

  /* ── Drift / gravity ── */
  // Constant drift direction (very slow)
  driftX: number;      // -0.01 – 0.01
  driftY: number;      // -0.01 – 0.01
  driftZ: number;      // -0.005 – 0.005
  // Gravity-like pull toward center
  centerPull: number;  // 0 – 0.005

  /* ── Temporal effects ── */
  // Time scaling — some anomalies run fast, some slow
  timeScale: number;   // 0.3 – 2.5
  // Stutter — occasional time freeze
  stutterChance: number; // 0 – 0.03
  stutterDuration: number; // 50 – 500 (ms)
  // Reverse — periodically runs time backward
  reverseFreq: number;   // 0 – 0.15

  /* ── Visual effects ── */
  // Color temperature shift (subtle warm/cool in grayscale)
  // Implemented as slight brightness oscillation
  tempShiftFreq: number; // 0 – 0.3
  tempShiftAmp: number;  // 0 – 0.05
  // Trail / afterimage (implemented as opacity modulation)
  trailLength: number;   // 0 – 1 (0 = no trail)
  // Echo — position echoes from past frames
  echoStrength: number;  // 0 – 0.3
  echoDelay: number;     // 1 – 8 (frames)
}

/* ── Random DNA generator ───────────────────────────────── */

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function randInt(min: number, max: number): number {
  return Math.floor(rand(min, max + 1));
}

/** Generate a random animation DNA. Every parameter is randomized. */
export function generateDNA(): AnimationDNA {
  // Bias toward slower, subtler motions (common) with occasional wild ones
  const wildness = Math.random() < 0.15 ? 2.5 : Math.random() < 0.3 ? 1.5 : 1;

  return {
    // Base motion
    freqX: rand(0.02, 0.25) * wildness,
    freqY: rand(0.02, 0.2) * wildness,
    freqZ: rand(0.01, 0.12) * wildness,
    ampX: rand(0.08, 0.8) * wildness,
    ampY: rand(0.06, 0.6) * wildness,
    ampZ: rand(0.03, 0.4) * wildness,
    phaseXY: rand(0, Math.PI),
    phaseXZ: rand(0, Math.PI),
    phaseYZ: rand(0, Math.PI),
    motionPowerX: rand(0.5, 2.5),
    motionPowerY: rand(0.5, 2.5),
    motionPowerZ: rand(0.5, 2.5),

    // Secondary motion
    secFreqX: Math.random() < 0.6 ? rand(0.02, 0.2) : 0,
    secFreqY: Math.random() < 0.6 ? rand(0.02, 0.15) : 0,
    secAmpX: Math.random() < 0.6 ? rand(0.03, 0.3) : 0,
    secAmpY: Math.random() < 0.6 ? rand(0.03, 0.25) : 0,
    wobbleFreq: Math.random() < 0.5 ? rand(1, 6) : 0,
    wobbleAmp: Math.random() < 0.5 ? rand(0.005, 0.06) : 0,

    // Opacity
    opacityFreq: rand(0.1, 1.2),
    opacityAmp: rand(0.05, 0.35),
    opacityPhase: rand(0, Math.PI * 2),
    opacityPower: rand(0.5, 3),
    flickerChance: Math.random() < 0.4 ? rand(0.005, 0.06) : 0,
    flickerIntensity: rand(0.3, 0.8),

    // Scale
    scaleFreq: rand(0.15, 2),
    scaleAmp: rand(0.01, 0.15),
    scalePhase: rand(0, Math.PI * 2),
    scalePower: rand(0.8, 3),
    scaleSharpness: Math.random() < 0.3 ? rand(0.3, 1) : 0,

    // Rotation
    rotSpeedX: rand(-0.012, 0.012),
    rotSpeedY: rand(-0.012, 0.012),
    rotSpeedZ: rand(-0.008, 0.008),
    rotOscFreq: Math.random() < 0.4 ? rand(0.03, 0.3) : 0,
    rotOscAmp: Math.random() < 0.4 ? rand(0.2, 0.8) : 0,

    // Pointer
    pointerInfluence: Math.random() < 0.7 ? rand(0.01, 0.12) : 0,
    pointerMode: rand(0, 3.99),
    pointerLag: rand(0.008, 0.06),

    // Drift
    driftX: rand(-0.008, 0.008),
    driftY: rand(-0.006, 0.006),
    driftZ: rand(-0.003, 0.003),
    centerPull: Math.random() < 0.3 ? rand(0.0005, 0.003) : 0,

    // Temporal
    timeScale: rand(0.4, 2),
    stutterChance: Math.random() < 0.25 ? rand(0.003, 0.02) : 0,
    stutterDuration: rand(80, 350),
    reverseFreq: Math.random() < 0.15 ? rand(0.02, 0.1) : 0,

    // Visual
    tempShiftFreq: Math.random() < 0.3 ? rand(0.05, 0.2) : 0,
    tempShiftAmp: Math.random() < 0.3 ? rand(0.01, 0.04) : 0,
    trailLength: Math.random() < 0.2 ? rand(0.1, 0.5) : 0,
    echoStrength: Math.random() < 0.15 ? rand(0.05, 0.2) : 0,
    echoDelay: randInt(2, 6),
  };
}

/* ── Animation evaluator ────────────────────────────────── */

/** Circular buffer for echo/trail effects */
const MAX_ECHO_FRAMES = 10;

interface AnimState {
  /** Accumulated time (can run backward) */
  t: number;
  /** Stutter state */
  stuttering: boolean;
  stutterEnd: number;
  /** Position history for echo */
  history: Array<{ x: number; y: number; z: number }>;
  /** Pointer smooth position */
  pointerSmoothed: { x: number; y: number };
  /** Whether time is currently reversed */
  reversed: boolean;
  reverseEnd: number;
}

const animStateMap = new Map<string, AnimState>();

function getAnimState(id: string): AnimState {
  let s = animStateMap.get(id);
  if (!s) {
    s = {
      t: 0,
      stuttering: false,
      stutterEnd: 0,
      history: [],
      pointerSmoothed: { x: 0, y: 0 },
      reversed: false,
      reverseEnd: 0,
    };
    animStateMap.set(id, s);
  }
  return s;
}

export function cleanupAnimState(id: string) {
  animStateMap.delete(id);
}

/* ── Power sine — sine raised to a power, preserving sign ─ */

function powSin(t: number, power: number): number {
  const s = Math.sin(t);
  return Math.sign(s) * Math.pow(Math.abs(s), power);
}

function powCos(t: number, power: number): number {
  const c = Math.cos(t);
  return Math.sign(c) * Math.pow(Math.abs(c), power);
}

/* ── Evaluate animation at current time ─────────────────── */

export interface AnimResult {
  dx: number;
  dy: number;
  dz: number;
  scale: number;
  opacity: number;
  rotDeltaX: number;
  rotDeltaY: number;
  rotDeltaZ: number;
}

export function evaluateAnimation(
  id: string,
  dna: AnimationDNA,
  basePosition: [number, number, number],
  baseScale: number,
  baseOpacity: number,
  realTime: number,
  pointerNorm: { x: number; y: number },
  lifecycleOpacity: number,
  reacting: boolean,
  clicked: boolean,
): AnimResult {
  const state = getAnimState(id);

  // Smooth pointer for pointer-responsive anomalies
  state.pointerSmoothed.x += (pointerNorm.x - state.pointerSmoothed.x) * 0.05;
  state.pointerSmoothed.y += (pointerNorm.y - state.pointerSmoothed.y) * 0.05;

  // ── Time manipulation ──
  let dt = realTime;

  // Time scale
  dt *= dna.timeScale;

  // Stutter — random freeze
  if (dna.stutterChance > 0) {
    if (!state.stuttering && Math.random() < dna.stutterChance) {
      state.stuttering = true;
      state.stutterEnd = performance.now() + dna.stutterDuration;
    }
    if (state.stuttering) {
      if (performance.now() > state.stutterEnd) {
        state.stuttering = false;
      } else {
        dt = state.t; // freeze time at last value
      }
    }
  }

  // Reverse — periodic backward time
  if (dna.reverseFreq > 0) {
    if (!state.reversed && Math.sin(dt * dna.reverseFreq) > 0.95) {
      state.reversed = true;
      state.reverseEnd = performance.now() + 2000 + Math.random() * 2000;
    }
    if (state.reversed) {
      dt = -dt;
      if (performance.now() > state.reverseEnd) {
        state.reversed = false;
      }
    }
  }

  state.t = dt;
  const t = dt;

  // ── Base motion (Lissajous-like with power shaping) ──
  let dx = dna.ampX * powSin(t * dna.freqX + dna.phaseXY, dna.motionPowerX);
  let dy = dna.ampY * powCos(t * dna.freqY + dna.phaseXY, dna.motionPowerY);
  let dz = dna.ampZ * powSin(t * dna.freqZ + dna.phaseXZ, dna.motionPowerZ);

  // Secondary motion
  if (dna.secFreqX > 0) dx += dna.secAmpX * Math.sin(t * dna.secFreqX + dna.phaseYZ * 2);
  if (dna.secFreqY > 0) dy += dna.secAmpY * Math.cos(t * dna.secFreqY + dna.phaseXZ * 2);

  // Wobble
  if (dna.wobbleFreq > 0) {
    dx += (Math.random() - 0.5) * dna.wobbleAmp;
    dy += (Math.random() - 0.5) * dna.wobbleAmp;
  }

  // Drift
  dx += dna.driftX * t * 0.1;
  dy += dna.driftY * t * 0.1;
  dz += dna.driftZ * t * 0.1;

  // Center pull
  if (dna.centerPull > 0) {
    const px = basePosition[0] + dx;
    const py = basePosition[1] + dy;
    dx -= px * dna.centerPull;
    dy -= py * dna.centerPull;
  }

  // ── Pointer interaction ──
  if (dna.pointerInfluence > 0) {
    const px = state.pointerSmoothed.x * 4;
    const py = state.pointerSmoothed.y * 3;
    const toX = px - (basePosition[0] + dx);
    const toY = py - (basePosition[1] + dy);
    const mode = Math.floor(dna.pointerMode);

    switch (mode) {
      case 0: // Attract
        dx += toX * dna.pointerInfluence;
        dy += toY * dna.pointerInfluence;
        break;
      case 1: // Repel
        dx -= toX * dna.pointerInfluence * 0.5;
        dy -= toY * dna.pointerInfluence * 0.5;
        break;
      case 2: // Orbit around pointer
        dx += Math.cos(t * 0.5) * dna.pointerInfluence * 2;
        dy += Math.sin(t * 0.5) * dna.pointerInfluence * 2;
        break;
      case 3: // Mirror-invert
        dx += (-state.pointerSmoothed.x * 3 - (basePosition[0] + dx)) * dna.pointerInfluence;
        dy += (-state.pointerSmoothed.y * 2 - (basePosition[1] + dy)) * dna.pointerInfluence;
        break;
    }
  }

  // ── Scale ──
  let scaleMod = 1;
  if (dna.scaleAmp > 0) {
    let scaleOsc = powSin(t * dna.scaleFreq + dna.scalePhase, dna.scalePower);
    // Sharpness: blend between smooth sine and sharp pulse
    if (dna.scaleSharpness > 0) {
      const sharp = Math.pow(Math.max(0, Math.sin(t * dna.scaleFreq + dna.scalePhase)), dna.scalePower * 2);
      scaleOsc = scaleOsc * (1 - dna.scaleSharpness) + sharp * dna.scaleSharpness;
    }
    scaleMod += scaleOsc * dna.scaleAmp;
  }

  // ── Opacity ──
  let opacityMod = 1;
  if (dna.opacityAmp > 0) {
    opacityMod += powSin(t * dna.opacityFreq + dna.opacityPhase, dna.opacityPower) * dna.opacityAmp;
  }

  // Flicker
  if (dna.flickerChance > 0 && Math.random() < dna.flickerChance) {
    opacityMod *= dna.flickerIntensity;
  }

  // Temperature shift (subtle brightness oscillation)
  if (dna.tempShiftFreq > 0) {
    opacityMod += Math.sin(t * dna.tempShiftFreq) * dna.tempShiftAmp;
  }

  // Trail (reduces base opacity based on trail length)
  if (dna.trailLength > 0) {
    opacityMod *= (1 - dna.trailLength * 0.3);
  }

  // Reacting / clicked modifiers
  if (reacting) {
    scaleMod *= 1.06;
    opacityMod *= 1.3;
  }
  if (clicked) {
    scaleMod *= 1.12;
    opacityMod *= 1.5;
  }

  // ── Rotation ──
  let rotX = dna.rotSpeedX;
  let rotY = dna.rotSpeedY;
  let rotZ = dna.rotSpeedZ;

  if (dna.rotOscFreq > 0) {
    const rotOsc = Math.sin(t * dna.rotOscFreq);
    rotX *= 1 + rotOsc * dna.rotOscAmp;
    rotY *= 1 + rotOsc * dna.rotOscAmp;
  }

  // ── Echo (position delay) ──
  if (dna.echoStrength > 0) {
    state.history.push({ x: dx, y: dy, z: dz });
    if (state.history.length > MAX_ECHO_FRAMES) state.history.shift();

    const echoIdx = Math.max(0, state.history.length - dna.echoDelay);
    if (state.history[echoIdx]) {
      const echo = state.history[echoIdx];
      dx = dx * (1 - dna.echoStrength) + echo.x * dna.echoStrength;
      dy = dy * (1 - dna.echoStrength) + echo.y * dna.echoStrength;
      dz = dz * (1 - dna.echoStrength) + echo.z * dna.echoStrength;
    }
  }

  return {
    dx,
    dy,
    dz,
    scale: baseScale * scaleMod,
    opacity: Math.max(0, Math.min(baseOpacity * lifecycleOpacity * opacityMod, 0.5)),
    rotDeltaX: rotX,
    rotDeltaY: rotY,
    rotDeltaZ: rotZ,
  };
}

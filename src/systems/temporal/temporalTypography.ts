import { useState, useRef, useCallback, useEffect } from "react";

/* ── Character substitution map ─────────────────────────── */

const SUBSTITUTIONS: Record<string, string[]> = {
  A: ["∀", "Λ", "Δ"],
  B: ["Β", "ß", "8"],
  C: ["Ƈ", "Ͼ", "©"],
  D: ["Ð", "Ɗ", "∂"],
  E: ["∃", "Ξ", "€"],
  F: ["Ƒ", "Ϝ", "Ғ"],
  G: ["Ǥ", "Ǥ", "Ğ"],
  H: ["Ħ", "Η", "н"],
  I: ["Ɨ", "Ι", "|"],
  J: ["Ĵ", "Ϳ", "Ɉ"],
  K: ["Ķ", "Κ", "к"],
  L: ["Ŀ", "£", "Ł"],
  M: ["Μ", "Ϻ", "м"],
  N: ["Ň", "Ν", "ɳ"],
  O: ["Ø", "0", "Θ"],
  P: ["Ƥ", "Ρ", "р"],
  Q: ["Ɋ", "ℚ", "φ"],
  R: ["Ř", "ℜ", "Я"],
  S: ["§", "Ś", "Ʃ"],
  T: ["Ŧ", "Τ", "т"],
  U: ["Ʉ", "μ", "Ц"],
  V: ["Ѵ", "√", "ν"],
  W: ["Ŵ", "ω", "ш"],
  X: ["Χ", "✕", "Ж"],
  Y: ["Ý", "Υ", "Ч"],
  Z: ["Ž", "Ζ", "Ƶ"],
  "0": ["○", "∘", "◯"],
  "1": ["│", "∣", "╎"],
  ".": ["·", "•", "°"],
  ":": ["∶", "ː", "˸"],
  "/": ["∕", "⁄", "÷"],
  "(": ["〔", "⁽", "⌊"],
  ")": ["〕", "⁾", "⌋"],
  "[": ["〚", "⁅", "⟦"],
  "]": ["〛", "⁆", "⟧"],
  "_": ["‗", "‾", "▂"],
  "-": ["─", "–", "—"],
  " ": [" ", " ", "\u2009"],
};

/* ── Scramble utility ───────────────────────────────────── */

export function scrambleText(original: string, intensity: number = 0.5): string {
  return original
    .split("")
    .map((ch) => {
      if (Math.random() > intensity) return ch;
      const subs = SUBSTITUTIONS[ch.toUpperCase()];
      if (subs) return subs[Math.floor(Math.random() * subs.length)];
      return ch;
    })
    .join("");
}

/* ── Hook configuration ─────────────────────────────────── */

export interface TemporalTextConfig {
  /** Scramble on mount */
  scrambleOnMount: boolean;
  /** Scramble on hover */
  scrambleOnHover: boolean;
  /** Time before text resolves (ms) */
  resolveDelay: number;
  /** How long scramble lasts (ms) */
  scrambleDuration: number;
  /** Scramble intensity 0–1 */
  intensity: number;
  /** Interval between scramble attempts (ms) */
  interval: number;
}

const DEFAULT_CONFIG: TemporalTextConfig = {
  scrambleOnMount: true,
  scrambleOnHover: true,
  resolveDelay: 800,
  scrambleDuration: 300,
  intensity: 0.5,
  interval: 6000,
};

/* ── Hook ───────────────────────────────────────────────── */

export function useTemporalText(
  text: string,
  config: Partial<TemporalTextConfig> = {},
) {
  const full = { ...DEFAULT_CONFIG, ...config };
  const [displayText, setDisplayText] = useState(
    full.scrambleOnMount ? scrambleText(text, full.intensity) : text,
  );
  const [isScrambling, setIsScrambling] = useState(full.scrambleOnMount);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);
  const mountedRef = useRef(false);

  // Resolve on mount after delay
  useEffect(() => {
    if (full.scrambleOnMount && !mountedRef.current) {
      mountedRef.current = true;
      const timer = setTimeout(() => {
        setDisplayText(text);
        setIsScrambling(false);
      }, full.resolveDelay);
      return () => clearTimeout(timer);
    }
  }, [text, full.scrambleOnMount, full.resolveDelay]);

  // Periodic re-scramble
  useEffect(() => {
    if (full.scrambleOnMount && !mountedRef.current) return;

    intervalRef.current = setInterval(() => {
      if (Math.random() > 0.4) return; // 60% chance to skip

      setIsScrambling(true);
      const frames = 4;
      let frame = 0;

      const animate = setInterval(() => {
        frame++;
        const decayIntensity = full.intensity * (1 - frame / frames);
        setDisplayText(scrambleText(text, decayIntensity));

        if (frame >= frames) {
          clearInterval(animate);
          setDisplayText(text);
          setIsScrambling(false);
        }
      }, full.scrambleDuration / frames);
    }, full.interval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, full.intensity, full.scrambleDuration, full.interval, full.scrambleOnMount]);

  // Hover scramble trigger
  const triggerScramble = useCallback(() => {
    if (!full.scrambleOnHover) return;
    setIsScrambling(true);

    const frames = 5;
    let frame = 0;
    const animate = setInterval(() => {
      frame++;
      const decayIntensity = full.intensity * (1 - frame / frames);
      setDisplayText(scrambleText(text, decayIntensity));

      if (frame >= frames) {
        clearInterval(animate);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, full.scrambleDuration / frames);
  }, [text, full.scrambleOnHover, full.intensity, full.scrambleDuration]);

  return { displayText, isScrambling, triggerScramble };
}

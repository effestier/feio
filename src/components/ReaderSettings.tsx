"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface ReaderPrefs {
  fontSize: number;
  fontFamily: "sans" | "serif";
  theme: "light" | "sepia" | "dark";
  lineHeight: number;
}

const DEFAULT_PREFS: ReaderPrefs = {
  fontSize: 18,
  fontFamily: "serif",
  theme: "dark",
  lineHeight: 1.85,
};

const STORAGE_KEY = "feio-reader-prefs";

function loadPrefs(): ReaderPrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...DEFAULT_PREFS, ...JSON.parse(stored) };
  } catch {}
  return DEFAULT_PREFS;
}

function savePrefs(prefs: ReaderPrefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {}
}

export default function ReaderSettings({ iframeRef }: { iframeRef: React.RefObject<HTMLIFrameElement | null> }) {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<ReaderPrefs>(DEFAULT_PREFS);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPrefs(loadPrefs());
  }, []);

  const sendToIframe = useCallback((p: ReaderPrefs) => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: "feio-reader-prefs", prefs: p },
      "*"
    );
  }, [iframeRef]);

  const update = useCallback((partial: Partial<ReaderPrefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...partial };
      savePrefs(next);
      sendToIframe(next);
      return next;
    });
  }, [sendToIframe]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [open]);

  const themes = [
    { key: "light" as const, bg: "#FAF7F0", color: "#2C2C2C", label: "Light" },
    { key: "sepia" as const, bg: "#F4ECD8", color: "#5B4636", label: "Sepia" },
    { key: "dark" as const, bg: "#1A1A1A", color: "#E0E0E0", label: "Dark" },
  ];

  return (
    <>
      {/* Floating gear button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-paper shadow-lg border border-charcoal/10 flex items-center justify-center text-muted hover:text-charcoal hover:shadow-xl transition-all"
        aria-label="Reader settings"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Settings panel */}
      {open && (
        <div
          ref={panelRef}
          className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-72 bg-paper rounded-xl shadow-2xl border border-charcoal/10 p-4 sm:p-5 space-y-4 sm:space-y-5 max-h-[70vh] overflow-y-auto"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-muted">Reading Preferences</p>

          {/* Font size */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-charcoal">Font Size</span>
              <span className="text-xs text-muted">{prefs.fontSize}px</span>
            </div>
            <input
              type="range"
              min={14}
              max={24}
              step={1}
              value={prefs.fontSize}
              onChange={(e) => update({ fontSize: Number(e.target.value) })}
              className="w-full h-1.5 bg-cream-dark rounded-full appearance-none cursor-pointer accent-gold"
            />
          </div>

          {/* Font family */}
          <div>
            <span className="text-sm text-charcoal block mb-2">Font</span>
            <div className="flex gap-2">
              {[
                { key: "sans" as const, label: "Sans-serif", preview: "Aa" },
                { key: "serif" as const, label: "Serif", preview: "Aa" },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => update({ fontFamily: f.key })}
                  className={`flex-1 py-2 rounded-lg text-center transition-colors ${
                    prefs.fontFamily === f.key
                      ? "bg-cream-dark text-charcoal"
                      : "bg-cream-dark text-charcoal hover:bg-cream"
                  }`}
                >
                  <span className={`text-lg block ${f.key === "serif" ? "font-serif" : "font-sans"}`}>
                    {f.preview}
                  </span>
                  <span className="text-[10px] text-muted mt-0.5 block">{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div>
            <span className="text-sm text-charcoal block mb-2">Theme</span>
            <div className="flex gap-2">
              {themes.map((t) => (
                <button
                  key={t.key}
                  onClick={() => update({ theme: t.key })}
                  className={`flex-1 py-2 rounded-lg text-center border-2 transition-all ${
                    prefs.theme === t.key
                      ? "border-gold scale-105"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: t.bg, color: t.color }}
                >
                  <span className="text-lg font-medium">Aa</span>
                  <span className="text-[10px] block mt-0.5 opacity-70">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Line spacing */}
          <div>
            <span className="text-sm text-charcoal block mb-2">Spacing</span>
            <div className="flex gap-2">
              {[
                { key: 1.5, label: "Compact" },
                { key: 1.8, label: "Normal" },
                { key: 2.0, label: "Relaxed" },
              ].map((s) => (
                <button
                  key={s.key}
                  onClick={() => update({ lineHeight: s.key })}
                  className={`flex-1 py-1.5 rounded-lg text-xs transition-colors ${
                    prefs.lineHeight === s.key
                      ? "bg-cream-dark text-charcoal"
                      : "bg-cream-dark text-charcoal hover:bg-cream"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

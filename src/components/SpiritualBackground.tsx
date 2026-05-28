export default function SpiritualBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient — deep black to dark indigo */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0d0b14] to-[#08060e]" />

      {/* Subtle radial gold glow — top center */}
      <div
        className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] rounded-full opacity-15"
        style={{
          background:
            "radial-gradient(circle, rgba(196,163,90,0.4) 0%, rgba(196,163,90,0.05) 40%, transparent 70%)",
        }}
      />

      {/* Lilac ambient — bottom left */}
      <div
        className="absolute -bottom-[10%] -left-[10%] w-[60vw] h-[60vw] rounded-full opacity-10"
        style={{
          background:
            "radial-gradient(circle, rgba(180,160,220,0.4) 0%, rgba(180,160,220,0.05) 45%, transparent 70%)",
        }}
      />

      {/* Gold ambient — bottom right */}
      <div
        className="absolute -bottom-[5%] -right-[15%] w-[50vw] h-[50vw] rounded-full opacity-10"
        style={{
          background:
            "radial-gradient(circle, rgba(196,163,90,0.35) 0%, rgba(196,163,90,0.03) 40%, transparent 65%)",
        }}
      />

      {/* Sacred geometry — centered mandala */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(90vw,800px)] h-[min(90vw,800px)] opacity-[0.04]">
        <svg viewBox="0 0 800 800" fill="none" className="w-full h-full">
          {/* Outer circle */}
          <circle cx="400" cy="400" r="380" stroke="currentColor" strokeWidth="0.5" className="text-gold" />
          <circle cx="400" cy="400" r="350" stroke="currentColor" strokeWidth="0.3" className="text-gold" />
          {/* Inner circles */}
          <circle cx="400" cy="400" r="260" stroke="currentColor" strokeWidth="0.5" className="text-gold" />
          <circle cx="400" cy="400" r="180" stroke="currentColor" strokeWidth="0.3" className="text-gold" />
          <circle cx="400" cy="400" r="100" stroke="currentColor" strokeWidth="0.5" className="text-gold" />
          {/* Radial lines — 12-fold symmetry */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x1 = 400 + 100 * Math.cos(angle);
            const y1 = 400 + 100 * Math.sin(angle);
            const x2 = 400 + 380 * Math.cos(angle);
            const y2 = 400 + 380 * Math.sin(angle);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeWidth="0.3"
                className="text-gold"
              />
            );
          })}
          {/* Inner diamond / yantra shape */}
          <polygon
            points="400,220 580,400 400,580 220,400"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
            className="text-gold"
          />
          <polygon
            points="400,280 520,400 400,520 280,400"
            stroke="currentColor"
            strokeWidth="0.3"
            fill="none"
            className="text-gold"
          />
          {/* Petals — 8-fold */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            const cx = 400 + 180 * Math.cos(angle);
            const cy = 400 + 180 * Math.sin(angle);
            return (
              <circle
                key={`p-${i}`}
                cx={cx}
                cy={cy}
                r="40"
                stroke="currentColor"
                strokeWidth="0.3"
                fill="none"
                className="text-gold"
              />
            );
          })}
          {/* Center dot */}
          <circle cx="400" cy="400" r="6" fill="currentColor" className="text-gold" />
        </svg>
      </div>

      {/* Floating particles — CSS-only */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gold/30 animate-float"
            style={{
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
              left: `${(i * 17 + 5) % 100}%`,
              top: `${(i * 23 + 10) % 100}%`,
              animationDelay: `${(i * 1.7) % 10}s`,
              animationDuration: `${12 + (i % 8) * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)",
        }}
      />
    </div>
  );
}

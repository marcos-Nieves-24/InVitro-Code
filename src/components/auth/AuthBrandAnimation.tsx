"use client";

interface AuthBrandAnimationProps {
  className?: string;
}

/**
 * Sci-fi biotech SVG animation for the auth brand panel.
 * DNA double helix + holographic panels + floating particles.
 * Uses CSS animations only (no framer-motion) for minimal bundle impact.
 * Deterministic — no Math.random() in render.
 */
export function AuthBrandAnimation({ className = "" }: AuthBrandAnimationProps) {
  // DNA Helix: 12 base-pair rows, sinusoidal x-offset per strand
  const PAIRS = 12;
  const SPACING = 22;
  const CENTER_X = 250;
  const CENTER_Y = 100;
  const WAVE_AMP = 55;

  const dnaRows = Array.from({ length: PAIRS }, (_, i) => {
    const y = CENTER_Y + i * SPACING;
    const phase = (i / PAIRS) * Math.PI * 2;
    const offsetX = Math.sin(phase) * WAVE_AMP;
    const brightness = Math.sin(((i + 0.5) / PAIRS) * Math.PI); // 0..1
    return { y, offsetX, brightness, delay: i * 0.15 };
  });

  // Deterministic particle positions (seeded by index)
  const PARTICLES = [
    { cx: 90, cy: 120, r: 1.5, dx: 25, dy: -18, dur: 9 },
    { cx: 160, cy: 85, r: 2, dx: -15, dy: 30, dur: 11 },
    { cx: 380, cy: 110, r: 1.8, dx: 20, dy: 25, dur: 8 },
    { cx: 420, cy: 200, r: 1.2, dx: -22, dy: -12, dur: 10 },
    { cx: 80, cy: 350, r: 2.2, dx: 18, dy: -20, dur: 12 },
    { cx: 200, cy: 400, r: 1.4, dx: -10, dy: -28, dur: 9 },
    { cx: 350, cy: 420, r: 1.8, dx: 22, dy: -15, dur: 11 },
    { cx: 440, cy: 380, r: 1.6, dx: -18, dy: 20, dur: 10 },
    { cx: 120, cy: 280, r: 1.3, dx: 30, dy: 10, dur: 8 },
    { cx: 400, cy: 300, r: 2, dx: -25, dy: -22, dur: 12 },
    { cx: 300, cy: 90, r: 1.1, dx: -12, dy: 18, dur: 9 },
    { cx: 180, cy: 430, r: 1.7, dx: 15, dy: -25, dur: 10 },
    { cx: 430, cy: 260, r: 1.4, dx: -20, dy: 15, dur: 11 },
    { cx: 70, cy: 200, r: 1.9, dx: 28, dy: -10, dur: 8 },
    { cx: 320, cy: 380, r: 1.2, dx: -8, dy: 22, dur: 12 },
    { cx: 260, cy: 440, r: 1.6, dx: 12, dy: -18, dur: 9 },
  ];

  return (
    <svg
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Glow filters */}
        <filter id="ab-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="ab-glow-strong" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Gradient for DNA connecting lines */}
        <linearGradient id="ab-dna-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00b2b2" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#00f5ff" stopOpacity="1" />
          <stop offset="100%" stopColor="#00b2b2" stopOpacity="0.2" />
        </linearGradient>

        {/* Gradient for holo panels */}
        <linearGradient id="ab-holo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00b2b2" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#00f5ff" stopOpacity="0.06" />
        </linearGradient>
      </defs>

      {/* Background grid lines — subtle pulse */}
      <g className="ab-grid" opacity="0">
        {Array.from({ length: 10 }).map((_, i) => (
          <line
            key={`gh${i}`}
            x1="50"
            y1={60 + i * 40}
            x2="450"
            y2={60 + i * 40}
            stroke="#00b2b2"
            strokeWidth="0.4"
            className="ab-grid-line"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <line
            key={`gv${i}`}
            x1={50 + i * 40}
            y1="60"
            x2={50 + i * 40}
            y2="460"
            stroke="#00b2b2"
            strokeWidth="0.4"
            className="ab-grid-line"
            style={{ animationDelay: `${i * 0.25 + 0.5}s` }}
          />
        ))}
      </g>

      {/* DNA Double Helix */}
      <g filter="url(#ab-glow)" className="ab-dna">
        {dnaRows.map((row, i) => (
          <g key={`dna${i}`} className="ab-dna-pair" style={{ animationDelay: `${row.delay}s` }}>
            {/* Left strand node */}
            <circle
              cx={CENTER_X - row.offsetX}
              cy={row.y}
              r={3.5}
              fill="#00f5ff"
              filter="url(#ab-glow-strong)"
              className="ab-dna-node"
              style={{ animationDelay: `${row.delay}s` }}
            />
            {/* Right strand node */}
            <circle
              cx={CENTER_X + row.offsetX}
              cy={row.y}
              r={3.5}
              fill="#00b2b2"
              filter="url(#ab-glow-strong)"
              className="ab-dna-node"
              style={{ animationDelay: `${row.delay + 0.1}s` }}
            />
            {/* Connecting bridge */}
            <line
              x1={CENTER_X - row.offsetX}
              y1={row.y}
              x2={CENTER_X + row.offsetX}
              y2={row.y}
              stroke="url(#ab-dna-grad)"
              strokeWidth={1.5 * row.brightness}
              className="ab-dna-bridge"
              style={{ animationDelay: `${row.delay + 0.2}s` }}
            />
            {/* Base-pair dot (every 3rd) */}
            {i % 3 === 0 && (
              <circle
                cx={CENTER_X}
                cy={row.y}
                r={2}
                fill="#00e6e6"
                className="ab-dna-base"
                style={{ animationDelay: `${row.delay + 0.4}s` }}
              />
            )}
          </g>
        ))}
      </g>

      {/* Holographic panels */}
      <g className="ab-panels">
        {/* Panel 1 — top-left */}
        <g className="ab-panel ab-panel--1">
          <rect x="55" y="115" width="95" height="65" rx="4" fill="url(#ab-holo-grad)" stroke="#00b2b2" strokeWidth="0.8" />
          <line x1="65" y1="135" x2="135" y2="135" stroke="#00f5ff" strokeWidth="0.8" className="ab-panel-line" style={{ animationDelay: "1.2s" }} />
          <line x1="65" y1="148" x2="115" y2="148" stroke="#00b2b2" strokeWidth="0.8" className="ab-panel-line" style={{ animationDelay: "1.4s" }} />
          <line x1="65" y1="161" x2="125" y2="161" stroke="#00b2b2" strokeWidth="0.8" className="ab-panel-line" style={{ animationDelay: "1.6s" }} />
        </g>
        {/* Panel 2 — top-right */}
        <g className="ab-panel ab-panel--2">
          <rect x="345" y="130" width="95" height="55" rx="4" fill="url(#ab-holo-grad)" stroke="#00b2b2" strokeWidth="0.8" />
          <line x1="355" y1="150" x2="425" y2="150" stroke="#00f5ff" strokeWidth="0.8" className="ab-panel-line" style={{ animationDelay: "1.5s" }} />
          <line x1="355" y1="163" x2="405" y2="163" stroke="#00b2b2" strokeWidth="0.8" className="ab-panel-line" style={{ animationDelay: "1.7s" }} />
        </g>
        {/* Panel 3 — bottom-right */}
        <g className="ab-panel ab-panel--3">
          <rect x="335" y="335" width="105" height="75" rx="4" fill="url(#ab-holo-grad)" stroke="#00b2b2" strokeWidth="0.8" />
          <circle cx="365" cy="368" r="14" fill="none" stroke="#00f5ff" strokeWidth="0.8" className="ab-panel-ring" style={{ animationDelay: "1.8s" }} />
          <line x1="390" y1="355" x2="425" y2="355" stroke="#00b2b2" strokeWidth="0.8" className="ab-panel-line" style={{ animationDelay: "2s" }} />
          <line x1="390" y1="368" x2="418" y2="368" stroke="#00b2b2" strokeWidth="0.8" className="ab-panel-line" style={{ animationDelay: "2.2s" }} />
          <line x1="390" y1="381" x2="430" y2="381" stroke="#00f5ff" strokeWidth="0.8" className="ab-panel-line" style={{ animationDelay: "2.4s" }} />
        </g>
      </g>

      {/* Floating particles */}
      <g className="ab-particles">
        {PARTICLES.map((p, i) => (
          <circle
            key={`p${i}`}
            cx={p.cx}
            cy={p.cy}
            r={p.r}
            fill={i % 3 === 0 ? "#00f5ff" : "#00b2b2"}
            filter={i % 4 === 0 ? "url(#ab-glow-strong)" : "url(#ab-glow)"}
            className="ab-particle"
            style={{
              "--dx": `${p.dx}px`,
              "--dy": `${p.dy}px`,
              animationDuration: `${p.dur}s`,
              animationDelay: `${2 + i * 0.2}s`,
            } as React.CSSProperties}
          />
        ))}
      </g>

      {/* Rotating outer ring */}
      <circle
        cx="250"
        cy="250"
        r="105"
        fill="none"
        stroke="#00b2b2"
        strokeWidth="0.4"
        strokeDasharray="6 6"
        className="ab-outer-ring"
      />
    </svg>
  );
}

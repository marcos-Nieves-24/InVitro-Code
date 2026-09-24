"use client";

import { useId } from "react";

type ScienceLabBackgroundProps = {
  className?: string;
  withNoise?: boolean;
};

/**
 * ScienceLabBackground — decorative lab grid / glow / lattice.
 * Self-contained via CSS vars (--ink #062f49 etc). Use as absolute backdrop.
 * Keeps grid 44, radial glow, rail, molecular lattice, pulse (strokeDashoffset 5s),
 * and feTurbulence noise at .09 opacity. Noise is gated via withNoise (default true)
 * so small card wrappers don't pay turbulence cost when not needed.
 */
export function ScienceLabBackground({ className, withNoise = true }: ScienceLabBackgroundProps) {
  const gridId = useId();
  const glowId = useId();
  const noiseId = useId();

  return (
    <div
      className={["science-lab-background pointer-events-none", className].filter(Boolean).join(" ")}
      aria-hidden="true"
      style={
        {
          "--ink": "#062f49",
          "--muted": "#677381",
          "--aqua": "#00b5c5",
          "--electric": "#45dcc6",
          "--paper": "#ffffff",
        } as React.CSSProperties
      }
    >
      <svg
        className="science-lab-art absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          {/* grid 44 */}
          <pattern id={gridId} width={44} height={44} patternUnits="userSpaceOnUse">
            <path d="M 44 0 L 0 0 0 44" fill="none" stroke="var(--ink)" strokeOpacity="0.06" strokeWidth="1" />
          </pattern>

          {/* glow radial */}
          <radialGradient id={glowId} cx="50%" cy="0%" r="85%">
            <stop offset="0%" stopColor="var(--electric)" stopOpacity="0.14" />
            <stop offset="55%" stopColor="var(--aqua)" stopOpacity="0.06" />
            <stop offset="100%" stopColor="var(--paper)" stopOpacity="0" />
          </radialGradient>

          {/* noise — feTurbulence */}
          <filter id={noiseId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={4} stitchTiles="stitch" result="turbulence" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>

        {/* base paper */}
        <rect width="100%" height="100%" fill="var(--paper)" />

        {/* grid */}
        <rect width="100%" height="100%" fill={`url(#${gridId})`} />

        {/* glow wash */}
        <rect width="100%" height="100%" fill={`url(#${glowId})`} />

        {/* rail — bottom technical rail */}
        <g className="lab-rail" opacity="0.9">
          <rect x="0" y="88%" width="100%" height="1" fill="var(--ink)" opacity="0.08" />
          <rect x="2%" y="88%" width="14%" height="2" rx="1" fill="var(--aqua)" opacity="0.35" />
          <rect x="20%" y="88%" width="8%" height="2" rx="1" fill="var(--electric)" opacity="0.25" />
        </g>

        {/* molecular lattice — nodes + bonds */}
        <g className="lab-lattice" opacity="0.5">
          {/* bonds */}
          <line x1="8%" y1="18%" x2="14%" y2="26%" stroke="var(--muted)" strokeWidth="1" strokeOpacity="0.12" />
          <line x1="14%" y1="26%" x2="20%" y2="18%" stroke="var(--muted)" strokeWidth="1" strokeOpacity="0.12" />
          <line x1="20%" y1="18%" x2="24%" y2="28%" stroke="var(--muted)" strokeWidth="1" strokeOpacity="0.12" />
          <line x1="78%" y1="14%" x2="84%" y2="22%" stroke="var(--muted)" strokeWidth="1" strokeOpacity="0.1" />
          <line x1="84%" y1="22%" x2="90%" y2="16%" stroke="var(--muted)" strokeWidth="1" strokeOpacity="0.1" />
          {/* nodes */}
          <circle cx="8%" cy="18%" r="4.5" fill="var(--paper)" stroke="var(--aqua)" strokeWidth="1.2" strokeOpacity="0.5" />
          <circle cx="14%" cy="26%" r="3.5" fill="var(--electric)" opacity="0.85" />
          <circle cx="20%" cy="18%" r="4" fill="var(--paper)" stroke="var(--ink)" strokeWidth="1" strokeOpacity="0.12" />
          <circle cx="24%" cy="28%" r="3" fill="var(--aqua)" opacity="0.5" />
          <circle cx="78%" cy="14%" r="3.5" fill="var(--paper)" stroke="var(--aqua)" strokeWidth="1.2" strokeOpacity="0.4" />
          <circle cx="84%" cy="22%" r="4" fill="var(--electric)" opacity="0.7" />
          <circle cx="90%" cy="16%" r="3" fill="var(--paper)" stroke="var(--muted)" strokeWidth="1" strokeOpacity="0.2" />
        </g>

        {/* pulse — strokeDashoffset 5s */}
        <path
          className="lab-pulse"
          d="M -10 42 L 120 42 L 145 26 L 168 58 L 192 42 L 340 42"
          fill="none"
          stroke="var(--electric)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.55"
          strokeDasharray="8 10"
          pathLength={100}
        />

        {/* noise overlay — opacity .09 gated by withNoise */}
        {withNoise ? (
          <rect width="100%" height="100%" filter={`url(#${noiseId})`} opacity={0.09} />
        ) : null}
      </svg>

      <style>{`
        .science-lab-background {
          background: var(--paper);
        }
        .science-lab-background .lab-pulse {
          stroke-dashoffset: 0;
          animation: lab-pulse-shift 5s linear infinite;
        }
        @keyframes lab-pulse-shift {
          to { stroke-dashoffset: -36; }
        }
        @media (prefers-reduced-motion: reduce) {
          .science-lab-background .lab-pulse {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

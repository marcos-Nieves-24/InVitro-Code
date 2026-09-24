"use client";

type Props = {
  percent: number;
  fast: boolean;
  shouldReduce: boolean;
};

export function BioreactorSvg({ percent, fast, shouldReduce }: Props) {
  const clamped = Math.min(100, Math.max(0, percent));
  const y = 230 - (clamped / 100) * 200;

  const impellerClass = shouldReduce
    ? ""
    : fast
      ? "animate-impeller-fast"
      : "animate-impeller-normal";

  const wave1Class = shouldReduce ? "" : "wave-1";
  const wave2Class = shouldReduce ? "" : "wave-2";
  const motorClass = shouldReduce ? "" : "animate-motor-hum";

  return (
    <svg
      viewBox="0 0 240 340"
      xmlns="http://www.w3.org/2000/svg"
      role="presentation"
      aria-hidden="true"
      className="h-full w-full"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-graphite)" />
          <stop offset="25%" stopColor="var(--color-slate)" />
          <stop offset="50%" stopColor="var(--color-surface-raised)" />
          <stop offset="75%" stopColor="var(--color-slate)" />
          <stop offset="100%" stopColor="var(--color-graphite)" />
        </linearGradient>

        <linearGradient id="motorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-fog)" />
          <stop offset="100%" stopColor="var(--color-slate)" />
        </linearGradient>

        <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--color-fog)" />
          <stop offset="100%" stopColor="var(--color-mint)" />
        </linearGradient>

        <linearGradient id="glassShine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-surface-card)" stopOpacity="0" />
          <stop offset="15%" stopColor="var(--color-surface-card)" stopOpacity="0.45" />
          <stop offset="35%" stopColor="var(--color-surface-card)" stopOpacity="0" />
        </linearGradient>

        <clipPath id="vesselInnerClip">
          <path d="M45,65 L195,65 L195,225 C195,268 162,288 120,288 C78,288 45,268 45,225 Z" />
        </clipPath>
      </defs>

      {/* Stand base */}
      <g id="standBase" aria-hidden="true">
        <path d="M35,315 L205,315 L200,325 L40,325 Z" fill="var(--color-graphite)" opacity="0.95" />
        <path d="M50,325 L55,340 L65,340 L60,325 Z" fill="var(--color-slate)" />
        <path d="M180,325 L185,340 L195,340 L190,325 Z" fill="var(--color-slate)" />
      </g>

      {/* Vessel outline / glass */}
      <path
        d="M45,65 L195,65 L195,225 C195,268 162,288 120,288 C78,288 45,268 45,225 Z"
        fill="var(--color-surface-card)"
        fillOpacity="0.55"
        stroke="var(--color-surface-raised)"
        strokeWidth="1.5"
      />

      {/* Liquid container clipped */}
      <g clipPath="url(#vesselInnerClip)">
        <g id="liquidContainer" transform={`translate(0, ${y})`}>
          {/* Liquid body */}
          <rect x="45" y="15" width="150" height="300" fill="url(#liquidGrad)" />
          {/* Wave top layers */}
          <path
            className={wave1Class}
            d="M45,15 Q 82.5,0 120,15 T195,15 L195,30 Q 157.5,30 120,15 T45,30 Z"
            fill="var(--color-mint)"
            opacity="0.9"
          />
          <path
            className={wave2Class}
            d="M45,18 Q 82.5,6 120,18 T195,18 L195,28 Q 157.5,28 120,18 T45,28 Z"
            fill="var(--color-fog)"
            opacity="0.55"
          />
        </g>
      </g>

      {/* Bubble tank foreignObject — BubbleLayer renders overlay, left empty for DOM overlay */}
      <foreignObject x="45" y="65" width="150" height="223" style={{ overflow: "visible", pointerEvents: "none" }}>
        <div
          // @ts-expect-error foreignObject child
          xmlns="http://www.w3.org/1999/xhtml"
          style={{ width: "100%", height: "100%" }}
        />
      </foreignObject>

      {/* Agitator shaft */}
      <rect x="115" y="45" width="10" height="220" rx="3" fill="url(#metalGradient)" />

      {/* Impeller group */}
      <g id="impellerGroup" className={impellerClass} style={{ transformOrigin: "120px 240px" }}>
        <ellipse cx="120" cy="240" rx="22" ry="6" fill="var(--color-graphite)" opacity="0.9" />
        <path d="M98,238 L75,232 L75,248 L98,242 Z" fill="var(--color-slate)" stroke="var(--color-graphite)" strokeWidth="0.8" />
        <path d="M142,238 L165,232 L165,248 L142,242 Z" fill="var(--color-slate)" stroke="var(--color-graphite)" strokeWidth="0.8" />
        <circle cx="120" cy="240" r="5" fill="var(--color-graphite)" />
      </g>

      {/* Top flange */}
      <rect x="36" y="52" width="168" height="16" rx="3" fill="url(#metalGradient)" stroke="var(--color-graphite)" strokeWidth="0.6" />

      {/* Motor */}
      <g id="motor" className={motorClass}>
        <rect x="90" y="8" width="60" height="30" rx="4" fill="url(#motorGradient)" stroke="var(--color-graphite)" strokeWidth="0.8" />
        {/* Motor vents */}
        <rect x="98" y="16" width="44" height="2.5" rx="1" fill="var(--color-graphite)" opacity="0.7" />
        <rect x="98" y="22" width="44" height="2.5" rx="1" fill="var(--color-graphite)" opacity="0.7" />
        <rect x="98" y="28" width="44" height="2.5" rx="1" fill="var(--color-graphite)" opacity="0.7" />
        {/* Motor top indicator */}
        <circle cx="120" cy="14" r="3" fill="var(--color-mint)" opacity="0.9" />
      </g>

      {/* Glass reflection */}
      <path
        d="M50,70 Q 62,150 58,230 Q 72,260 88,278 L 76,282 Q 52,268 50,230 Z"
        fill="url(#glassShine)"
        opacity="0.9"
        pointerEvents="none"
      />

      {/* Outer glow stroke */}
      <path
        d="M45,65 L195,65 L195,225 C195,268 162,288 120,288 C78,288 45,268 45,225 Z"
        fill="none"
        stroke="var(--color-mint)"
        strokeOpacity="0.12"
        strokeWidth="2"
        className={shouldReduce ? "" : "bioreactor-glow"}
      />
    </svg>
  );
}

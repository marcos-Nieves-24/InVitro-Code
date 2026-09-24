"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

type Props = {
  percent: number;
  fast: boolean;
  shouldReduce: boolean;
};

type SvgBubble = { id: number; cx: number; r: number; delay: number; duration: number; wobble: number };

const SVG_BUBBLES: SvgBubble[] = [
  { id: 0, cx: 88, r: 5, delay: 0, duration: 2.8, wobble: 3 },
  { id: 1, cx: 108, r: 4, delay: 0.4, duration: 3.1, wobble: -2.5 },
  { id: 2, cx: 128, r: 6, delay: 0.7, duration: 2.9, wobble: 2 },
  { id: 3, cx: 142, r: 3.5, delay: 1.0, duration: 3.0, wobble: -3 },
  { id: 4, cx: 100, r: 4.5, delay: 1.3, duration: 2.7, wobble: 2.8 },
  { id: 5, cx: 132, r: 4, delay: 1.6, duration: 3.2, wobble: -2 },
  { id: 6, cx: 118, r: 5.5, delay: 0.2, duration: 2.85, wobble: 1.5 },
];

export function BioreactorSvg({ percent, fast, shouldReduce }: Props) {
  const clamped = Math.min(100, Math.max(0, percent));
  const targetY = 230 - (clamped / 100) * 200;
  const yMotion = useMotionValue(230);
  const springY = useSpring(yMotion, {
    stiffness: fast ? 220 : 180,
    damping: fast ? 14 : 15,
    mass: 0.8,
  });

  useEffect(() => {
    yMotion.set(targetY);
  }, [targetY, yMotion]);

  const impellerClass = shouldReduce
    ? ""
    : fast
      ? "animate-impeller-fast"
      : "animate-impeller-normal";

  const motorClass = shouldReduce ? "" : "animate-motor-hum";

  return (
    <svg
      viewBox="0 0 240 340"
      xmlns="http://www.w3.org/2000/svg"
      role="presentation"
      aria-hidden="true"
      className="h-full w-full"
      style={{ overflow: "hidden", contain: "paint" as const }}
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

      {/* Liquid — 21st Liquid Button contained ellipse technique */}
      <g clipPath="url(#vesselInnerClip)">
        <motion.g
          id="waveRoot"
          style={{
            y: springY,
            overflow: "hidden",
            willChange: shouldReduce ? "auto" : "transform",
          }}
        >
          <motion.g
            id="liquidSquash"
            animate={
              shouldReduce || !fast ? undefined : { scaleY: [1, 0.985, 1] }
            }
            transition={
              shouldReduce || !fast
                ? undefined
                : { duration: 0.7, repeat: Infinity, ease: "easeInOut" }
            }
            style={{
              transformOrigin: "120px 280px",
              willChange: shouldReduce ? "auto" : "transform",
            }}
          >
            <rect x="45" y="15" width="150" height="300" fill="url(#liquidGrad)" />
            {shouldReduce ? (
              <>
                <ellipse cx="120" cy="12" rx="110" ry="34" fill="var(--color-mint)" opacity="0.92" />
                <ellipse cx="120" cy="16" rx="105" ry="30" fill="var(--color-fog)" opacity="0.55" />
              </>
            ) : (
              <>
                <motion.ellipse
                  cx="120"
                  cy="12"
                  rx="110"
                  ry="34"
                  fill="var(--color-mint)"
                  opacity={0.92}
                  className="liquid-wave liquid-wave-1"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: fast ? 4 : 7,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    transformOrigin: "120px 12px",
                    willChange: "transform",
                  }}
                />
                <motion.ellipse
                  cx="120"
                  cy="16"
                  rx="105"
                  ry="30"
                  fill="var(--color-fog)"
                  opacity={0.55}
                  className="liquid-wave liquid-wave-2"
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    transformOrigin: "120px 16px",
                    willChange: "transform",
                  }}
                />
              </>
            )}
          </motion.g>
        </motion.g>

        {/* Bubbles rising inside liquid — clipped, visible against mint/fog */}
        {!shouldReduce && clamped >= 5 && (
          <g id="bubbleGroup" aria-hidden="true">
            {SVG_BUBBLES.map((b) => (
              <motion.circle
                key={b.id}
                cx={b.cx}
                cy={272}
                r={b.r}
                fill="var(--color-surface-card)"
                fillOpacity="0.92"
                stroke="var(--color-bubble-highlight)"
                strokeOpacity="0.9"
                strokeWidth="0.9"
                style={{ willChange: "transform, opacity" }}
                animate={{
                  cy: [272, 90],
                  opacity: [0, 0.95, 0],
                  x: [0, b.wobble, -b.wobble * 0.6, 0],
                }}
                transition={{
                  duration: b.duration,
                  repeat: Infinity,
                  delay: b.delay,
                  ease: "easeOut",
                }}
              />
            ))}
          </g>
        )}
        {shouldReduce && clamped >= 5 && (
          <g id="bubbleGroupStatic" aria-hidden="true" opacity="0.45">
            <circle cx="100" cy="250" r="3.5" fill="var(--color-surface-card)" stroke="var(--color-bubble-highlight)" strokeWidth="0.6" />
            <circle cx="120" cy="260" r="4" fill="var(--color-surface-card)" stroke="var(--color-bubble-highlight)" strokeWidth="0.6" />
            <circle cx="135" cy="255" r="3" fill="var(--color-surface-card)" stroke="var(--color-bubble-highlight)" strokeWidth="0.6" />
          </g>
        )}
      </g>

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

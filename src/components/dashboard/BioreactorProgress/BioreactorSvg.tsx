"use client";

import { useEffect, useId } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { getBioreactorPhysics } from "./useBioreactorMotion";

type Props = {
  percent: number;
  fast: boolean;
  shouldReduce: boolean;
};

type SvgBubble = { id: number; cx: number; r: number; wobble: number };

const SVG_BUBBLE_TEMPLATES: SvgBubble[] = [
  { id: 0, cx: 88, r: 5, wobble: 3 },
  { id: 1, cx: 108, r: 4, wobble: -2.5 },
  { id: 2, cx: 128, r: 6, wobble: 2 },
  { id: 3, cx: 142, r: 3.5, wobble: -3 },
  { id: 4, cx: 100, r: 4.5, wobble: 2.8 },
  { id: 5, cx: 132, r: 4, wobble: -2 },
  { id: 6, cx: 118, r: 5.5, wobble: 1.5 },
  { id: 7, cx: 112, r: 3.8, wobble: -1.8 },
];

export function BioreactorSvg({ percent, fast, shouldReduce }: Props) {
  const uid = useId().replace(/:/g, "");
  const physics = getBioreactorPhysics(percent);
  const clamped = physics.clamped;
  const h = physics.h;
  const impellerDuration = physics.duration;
  const sloshAmplitude = physics.sloshAmplitude;
  const squashDuration = physics.squashDuration;
  const squashMin = physics.squashMin;
  const visibleBubbles = physics.visibleBubbles;
  const bubbleDuration = physics.bubbleDuration;

  const targetY = 230 - (clamped / 100) * 200;
  const yMotion = useMotionValue(230);
  const springY = useSpring(yMotion, {
    stiffness: fast ? 220 : 180 + 40 * h,
    damping: fast ? 14 : 15,
    mass: 0.8,
  });

  useEffect(() => {
    yMotion.set(targetY);
  }, [targetY, yMotion]);

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
        <linearGradient id={`metalGradient-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-graphite)" />
          <stop offset="25%" stopColor="var(--color-slate)" />
          <stop offset="50%" stopColor="var(--color-surface-raised)" />
          <stop offset="75%" stopColor="var(--color-slate)" />
          <stop offset="100%" stopColor="var(--color-graphite)" />
        </linearGradient>

        <linearGradient id={`motorGradient-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-fog)" />
          <stop offset="100%" stopColor="var(--color-slate)" />
        </linearGradient>

        <linearGradient id={`liquidGrad-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--color-fog)" />
          <stop offset="100%" stopColor="var(--color-mint)" />
        </linearGradient>

        <linearGradient id={`glassShine-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-surface-card)" stopOpacity="0" />
          <stop offset="15%" stopColor="var(--color-surface-card)" stopOpacity="0.45" />
          <stop offset="35%" stopColor="var(--color-surface-card)" stopOpacity="0" />
        </linearGradient>

        <clipPath id={`vesselInnerClip-${uid}`}>
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

      {/* Liquid — 21st Liquid Button contained ellipse technique, slosh coupled to impeller rpm */}
      <g clipPath={`url(#vesselInnerClip-${uid})`}>
        <motion.g
          id="waveRoot"
          style={{
            y: springY,
            overflow: "hidden",
            willChange: shouldReduce ? "auto" : "transform",
          }}
        >
          <motion.g
            id="sloshGroup"
            animate={
              shouldReduce || h < 0.02
                ? undefined
                : { x: [-sloshAmplitude, sloshAmplitude] }
            }
            transition={
              shouldReduce || h < 0.02
                ? undefined
                : {
                    duration: impellerDuration * 2,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                  }
            }
            style={{
              willChange: shouldReduce ? "auto" : "transform",
            }}
          >
            <motion.g
              id="liquidSquash"
              animate={
                shouldReduce || h < 0.02 ? undefined : { scaleY: [1, squashMin, 1] }
              }
              transition={
                shouldReduce || h < 0.02
                  ? undefined
                  : { duration: squashDuration, repeat: Infinity, ease: "easeInOut" }
              }
              style={{
                transformOrigin: "120px 280px",
                willChange: shouldReduce ? "auto" : "transform",
              }}
            >
              <rect x="45" y="15" width="150" height="300" fill={`url(#liquidGrad-${uid})`} />
              {/* Wave surface — conectado al tanque, animado con background wave del SCSS tube */}
              {!shouldReduce && (
                <motion.g
                  animate={{ x: [0, -25, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  style={{ willChange: "transform" }}
                >
                  <path
                    d="M45 15 Q57 6 70 15 T95 15 T120 15 T145 15 T170 15 T195 15 L195 18 L45 18 Z"
                    fill="var(--color-mint)"
                    opacity={0.35}
                  />
                  <path
                    d="M45 17 Q57 26 70 17 T95 17 T120 17 T145 17 T170 17 T195 17 L195 20 L45 20 Z"
                    fill="white"
                    opacity={0.12}
                  />
                </motion.g>
              )}
            </motion.g>
          </motion.g>
        </motion.g>

        {/* Bubbles rising inside liquid — clipped, visible against mint/fog, count/speed ∝ fill */}
        {!shouldReduce && clamped >= 5 && (
          <g id="bubbleGroup" aria-hidden="true">
            {SVG_BUBBLE_TEMPLATES.slice(0, visibleBubbles).map((b, i) => {
              const delay = (i * 1.6) / visibleBubbles;
              return (
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
                    duration: bubbleDuration,
                    repeat: Infinity,
                    delay,
                    ease: "easeOut",
                  }}
                />
              );
            })}
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

      {/* Impeller — Rushton real: eje vertical fijo, disco y 6 palas radiales, flujo radial */}
      <g id="impellerGroup" aria-hidden="true">
        <rect x="118" y="65" width="4" height="175" rx="2" fill={`url(#metalGradient-${uid})`} opacity="0.9" />
        <ellipse cx="120" cy="240" rx="16" ry="6" fill="var(--color-graphite)" opacity="0.95" />
        {/* Palas — visto lateral: rotación alrededor de Y se ve como scaleX alternado, no rotate plano */}
        <motion.rect
          x="72" y="237" width="34" height="6" rx="2"
          fill="var(--color-slate)" stroke="var(--color-graphite)" strokeWidth="0.8"
          animate={shouldReduce ? undefined : { scaleX: [1, 0.15, 1] }}
          transition={shouldReduce ? undefined : { duration: impellerDuration * 0.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "120px 240px", willChange: shouldReduce ? "auto" : "transform" } as React.CSSProperties}
        />
        <motion.rect
          x="134" y="237" width="34" height="6" rx="2"
          fill="var(--color-slate)" stroke="var(--color-graphite)" strokeWidth="0.8"
          animate={shouldReduce ? undefined : { scaleX: [1, 0.15, 1] }}
          transition={shouldReduce ? undefined : { duration: impellerDuration * 0.5, repeat: Infinity, ease: "easeInOut", delay: impellerDuration * 0.25 }}
          style={{ transformOrigin: "120px 240px", willChange: shouldReduce ? "auto" : "transform" } as React.CSSProperties}
        />
        <circle cx="120" cy="240" r="4" fill="var(--color-surface-card)" stroke="var(--color-graphite)" strokeWidth="0.6" />
      </g>

      {/* Top flange */}
      <rect x="36" y="52" width="168" height="16" rx="3" fill={`url(#metalGradient-${uid})`} stroke="var(--color-graphite)" strokeWidth="0.6" />

      {/* Motor */}
      <g id="motor" className={motorClass}>
        <rect x="90" y="8" width="60" height="30" rx="4" fill={`url(#motorGradient-${uid})`} stroke="var(--color-graphite)" strokeWidth="0.8" />
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
        fill={`url(#glassShine-${uid})`}
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

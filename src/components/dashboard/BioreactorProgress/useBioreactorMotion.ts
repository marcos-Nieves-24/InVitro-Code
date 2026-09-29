"use client";

import { useReducedMotion } from "motion/react";

export type BioreactorState = "idle" | "filling" | "levelUp";

export interface BioreactorPhysics {
  clamped: number;
  h: number;
  slip: number;
  rpm: number;
  duration: number;
  sloshAmplitude: number;
  squashDuration: number;
  squashMin: number;
  visibleBubbles: number;
  bubbleDuration: number;
}

export function clampPercent(percent: number): number {
  if (!Number.isFinite(percent)) return 0;
  return Math.min(100, Math.max(0, percent));
}

/**
 * Coupled bioreactor physics:
 * - slip = exp(-4*h) → low fill slips, high fill coupled
 * - rpm  = 60 + 120*h*(1-slip)
 * - duration = 60/rpm s per rotation
 * - slosh 8*h*(rpm/120)
 * - squash duration 0.9-0.3*h, amplitude ∝ rpm/120
 * - bubbles count 4+round(h*4), duration 3.2-1.5*h
 */
export function getBioreactorPhysics(percent: number): BioreactorPhysics {
  const clamped = clampPercent(percent);
  const h = clamped / 100;
  const slip = Math.exp(-4 * h);
  const rpm = 60 + 120 * h * (1 - slip);
  const duration = 60 / rpm;
  const sloshAmplitude = 8 * h * (rpm / 120);
  const squashDuration = 0.9 - 0.3 * h;
  const squashMin = 1 - 0.018 * (rpm / 120);
  const visibleBubbles = 4 + Math.round(h * 4);
  const bubbleDuration = 3.2 - 1.5 * h;
  return {
    clamped,
    h,
    slip,
    rpm,
    duration,
    sloshAmplitude,
    squashDuration,
    squashMin,
    visibleBubbles,
    bubbleDuration,
  };
}

export function useBioreactorMotion(state: BioreactorState, percent: number) {
  const shouldReduce = useReducedMotion();
  const physics = getBioreactorPhysics(percent);

  const vesselVariants = shouldReduce
    ? {}
    : {
        idle: { scale: 1 },
        filling: { scale: 1 },
        levelUp: {
          scale: [1, 1.04, 1],
          transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] as const },
        },
      };

  const liquidVariants = shouldReduce
    ? { height: `${percent}%` }
    : {
        initial: { height: 0 },
        animate: { height: `${percent}%` },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
      };

  const bubbleCount = shouldReduce ? 0 : physics.visibleBubbles;
  const shouldAnimate = !shouldReduce;

  return { vesselVariants, liquidVariants, bubbleCount, shouldAnimate, shouldReduce, physics };
}

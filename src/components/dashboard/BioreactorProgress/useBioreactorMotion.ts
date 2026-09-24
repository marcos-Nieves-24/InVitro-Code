"use client";

import { useReducedMotion } from "motion/react";

export type BioreactorState = "idle" | "filling" | "levelUp";

export function useBioreactorMotion(state: BioreactorState, percent: number) {
  const shouldReduce = useReducedMotion();

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

  const bubbleCount = shouldReduce ? 0 : 7;
  const shouldAnimate = !shouldReduce;

  return { vesselVariants, liquidVariants, bubbleCount, shouldAnimate, shouldReduce };
}

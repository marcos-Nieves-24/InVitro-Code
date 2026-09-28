"use client";

import {
  motion,
  useReducedMotion,
  type TargetAndTransition,
  type Transition,
} from "motion/react";
import { useMemo } from "react";

export type AuthStatus = "idle" | "loading" | "success" | "error";

interface LiquidWaveProps {
  status: AuthStatus;
  mode: "signin" | "signup";
}

// Organic wave path data - creates a fluid, natural wave shape
const WAVE_PATHS = {
  primary:
    "M0,64 C120,88 240,32 360,64 C480,96 600,40 720,64 C840,88 960,32 1080,64 C1200,96 1320,40 1440,64 L1440,160 L0,160 Z",
  secondary:
    "M0,80 C160,56 320,104 480,80 C640,56 800,104 960,80 C1120,56 1280,104 1440,80 L1440,160 L0,160 Z",
  tertiary:
    "M0,96 C200,72 400,120 600,96 C800,72 1000,120 1200,96 C1300,84 1380,108 1440,96 L1440,160 L0,160 Z",
};

// Color schemes per mode
const COLORS = {
  signin: {
    primary: "#00b2b2", // mint
    secondary: "#00a0a0",
    tertiary: "#008f8f",
    gradient: "rgba(0, 178, 178, 0.8)",
  },
  signup: {
    primary: "#111439", // ink
    secondary: "#1a1f4d",
    tertiary: "#232a61",
    gradient: "rgba(17, 20, 57, 0.8)",
  },
};

// Animation variants based on auth status
const getWaveAnimation = (
  status: AuthStatus,
  reducedMotion: boolean
): TargetAndTransition => {
  if (reducedMotion) {
    const reducedAnimations: Record<AuthStatus, TargetAndTransition> = {
      idle: { opacity: 0.6 },
      loading: { opacity: 0.8 },
      success: { opacity: 0.9 },
      error: { opacity: 0.7 },
    };
    return reducedAnimations[status];
  }

  const animations: Record<AuthStatus, TargetAndTransition> = {
    idle: {
      opacity: 0.6,
      x: 0,
      transition: {
        duration: 2,
        ease: "easeInOut",
      },
    },
    loading: {
      opacity: 1,
      x: [0, -1440],
      transition: {
        x: {
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        },
        opacity: {
          duration: 0.3,
        },
      },
    },
    success: {
      opacity: [1, 0.8, 0],
      y: [0, -10, 20],
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
    error: {
      opacity: [1, 0.6, 0.8],
      x: [0, -5, 5, 0],
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
  };

  return animations[status];
};

export function LiquidWave({ status, mode }: LiquidWaveProps) {
  const reducedMotion = useReducedMotion();
  const colors = COLORS[mode];

  const animation = useMemo(
    () => getWaveAnimation(status, reducedMotion ?? false),
    [status, reducedMotion]
  );

  // Subtle idle animation for reduced motion
  const idleAnimation = useMemo(() => {
    if (!reducedMotion) return undefined;
    return {
      opacity: [0.5, 0.7, 0.5],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    };
  }, [reducedMotion]);

  return (
    <div
      className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient for wave fill */}
          <linearGradient
            id={`wave-gradient-${mode}`}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor={colors.primary} stopOpacity="0.9" />
            <stop
              offset="50%"
              stopColor={colors.secondary}
              stopOpacity="0.7"
            />
            <stop
              offset="100%"
              stopColor={colors.tertiary}
              stopOpacity="0.5"
            />
          </linearGradient>

          {/* Blur filter for softer look */}
          <filter id="wave-blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
          </filter>
        </defs>

        {/* Tertiary wave (back) */}
        <motion.path
          d={WAVE_PATHS.tertiary}
          fill={colors.tertiary}
          fillOpacity="0.3"
          filter="url(#wave-blur)"
          animate={
            status === "idle" && !reducedMotion
              ? { opacity: [0.3, 0.5, 0.3] }
              : { opacity: 0.3 }
          }
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut" as const,
          }}
        />

        {/* Secondary wave (middle) */}
        <motion.path
          d={WAVE_PATHS.secondary}
          fill={colors.secondary}
          fillOpacity="0.5"
          filter="url(#wave-blur)"
          animate={
            status === "idle" && !reducedMotion
              ? { opacity: [0.4, 0.6, 0.4] }
              : { opacity: 0.5 }
          }
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut" as const,
            delay: 0.5,
          }}
        />

        {/* Primary wave (front) */}
        <motion.path
          d={WAVE_PATHS.primary}
          fill={`url(#wave-gradient-${mode})`}
          animate={animation}
        />

        {/* Loading state - additional moving wave */}
        {status === "loading" && !reducedMotion && (
          <motion.path
            d={WAVE_PATHS.primary}
            fill={colors.primary}
            fillOpacity="0.3"
            animate={{
              x: [-1440, 0],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              x: {
                duration: 8,
                repeat: Infinity,
                ease: "linear" as const,
              },
              opacity: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut" as const,
              },
            }}
          />
        )}
      </svg>

      {/* Glow effect for loading state */}
      {status === "loading" && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-16"
          style={{
            background: `linear-gradient(to top, ${colors.primary}40, transparent)`,
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut" as const,
          }}
        />
      )}

      {/* Success flash effect */}
      {status === "success" && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{
            background: `linear-gradient(to top, ${colors.primary}60, transparent)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0] }}
          transition={{
            duration: 0.6,
            ease: "easeOut" as const,
          }}
        />
      )}

      {/* Error shake effect */}
      {status === "error" && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-16"
          style={{
            background: "linear-gradient(to top, #ef444440, transparent)",
          }}
          animate={{
            opacity: [0, 0.5, 0],
            x: [-3, 3, -3, 3, 0],
          }}
          transition={{
            duration: 0.4,
            ease: "easeInOut" as const,
          }}
        />
      )}
    </div>
  );
}

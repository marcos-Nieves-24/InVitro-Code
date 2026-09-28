"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { TerminalChrome } from "@/components/shared/TerminalChrome";
import { TypingText } from "@/components/ui/TypingText";

export function HubConsole() {
  const shouldReduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<"typing" | "helix">(
    shouldReduceMotion ? "helix" : "typing",
  );

  useEffect(() => {
    if (shouldReduceMotion) {
      setPhase("helix");
      return;
    }
    const t = setTimeout(() => setPhase("helix"), 1600);
    return () => clearTimeout(t);
  }, [shouldReduceMotion]);

  // Two sinusoidal strands formed with Q curves every 20px, rungs every 20px
  const strandA =
    "M 32 0 Q 52 10 32 20 Q 12 30 32 40 Q 52 50 32 60 Q 12 70 32 80 Q 52 90 32 100 Q 12 110 32 120 Q 52 130 32 140 Q 12 150 32 160 Q 52 170 32 180";
  const strandB =
    "M 68 0 Q 48 10 68 20 Q 88 30 68 40 Q 48 50 68 60 Q 88 70 68 80 Q 48 90 68 100 Q 88 110 68 120 Q 48 130 68 140 Q 88 150 68 160 Q 48 170 68 180";
  const rungs = [15, 35, 55, 75, 95, 115, 135, 155, 175];

  return (
    <TerminalChrome title="python invitro-code --lab hub" className="flex flex-col">
      <div className="flex h-[420px] flex-col gap-3 overflow-hidden">
        <TypingText
          text="> Secuenciando ADN..."
          delay={28}
          smooth={false}
          className="text-sm font-bold text-[var(--color-brand-300)]"
          cursor={<span className="text-[var(--color-brand-300)]">█</span>}
        />
        {phase === "typing" ? (
          <p className="text-sm text-white/60">Inicializando hebra...</p>
        ) : (
          <div className="flex flex-1 items-center justify-center overflow-hidden rounded-lg bg-white/5 p-3">
            <svg
              viewBox="0 0 100 180"
              className="h-full w-auto"
              aria-label="DNA double helix"
              role="img"
            >
              <defs>
                <linearGradient id="dna-a" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#5eead4" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.95} />
                </linearGradient>
                <linearGradient id="dna-b" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#a7f3d0" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#67e8f9" stopOpacity={0.95} />
                </linearGradient>
              </defs>

              {/* Rungs every 20px */}
              {rungs.map((y, i) =>
                shouldReduceMotion ? (
                  <line
                    key={i}
                    x1={32}
                    x2={68}
                    y1={y}
                    y2={y}
                    stroke="white"
                    strokeWidth={0.8}
                    opacity={0.35}
                  />
                ) : (
                  <motion.line
                    key={i}
                    x1={32}
                    x2={68}
                    y1={y}
                    y2={y}
                    stroke="white"
                    strokeWidth={0.8}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.35 }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
                  />
                ),
              )}

              {shouldReduceMotion ? (
                <>
                  <path d={strandA} fill="none" stroke="url(#dna-a)" strokeWidth={2.2} strokeLinecap="round" />
                  <path d={strandB} fill="none" stroke="url(#dna-b)" strokeWidth={2.2} strokeLinecap="round" />
                </>
              ) : (
                <motion.g
                  initial={{ y: 0 }}
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <motion.path
                    d={strandA}
                    fill="none"
                    stroke="url(#dna-a)"
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.1, ease: "easeOut" }}
                  />
                  <motion.path
                    d={strandB}
                    fill="none"
                    stroke="url(#dna-b)"
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.1, delay: 0.15, ease: "easeOut" }}
                  />
                </motion.g>
              )}

              {/* base pairs dots */}
              {rungs.map((y, i) => (
                <circle key={`dot-${i}`} cx={50} cy={y} r={1.6} fill="white" opacity={0.55} />
              ))}
            </svg>
          </div>
        )}
      </div>
    </TerminalChrome>
  );
}

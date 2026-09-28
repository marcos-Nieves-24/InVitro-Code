"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { TerminalChrome } from "@/components/shared/TerminalChrome";
import { TypingText } from "@/components/ui/TypingText";

export function StatsConsole() {
  const shouldReduceMotion = useReducedMotion();
  const [showChart, setShowChart] = useState(shouldReduceMotion ?? false);

  useEffect(() => {
    if (shouldReduceMotion) {
      setShowChart(true);
      return;
    }
    const t = setTimeout(() => setShowChart(true), 900);
    return () => clearTimeout(t);
  }, [shouldReduceMotion]);

  const bellPath = "M20,160 C60,20 260,20 300,160";
  const fillPath = "M20,160 C60,20 260,20 300,160 L300,160 L20,160 Z";

  return (
    <TerminalChrome title="python invitro-code --lab stats" className="flex flex-col">
      <div className="flex h-[420px] flex-col gap-3">
        <TypingText text="import scipy.stats as st" delay={22} className="text-sm text-cyan-400" />
        <p className="font-mono text-xs text-white/50">st.norm.pdf(x, μ=0, σ=1)</p>
        <p className="font-mono text-xs text-white/40">dist = st.norm(μ=0, σ=1) · n=120 · Shapiro p=0.42</p>

        <div className="flex-1 overflow-hidden rounded-lg bg-white/5 p-3">
          <svg viewBox="0 0 320 180" className="h-full w-full" aria-label="Gaussian bell curve" role="img">
            <defs>
              <linearGradient id="bell-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5eead4" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.08} />
              </linearGradient>
            </defs>

            {/* grid */}
            <g stroke="white" strokeWidth={0.3} opacity={0.06}>
              {[40, 80, 120, 160, 200, 240, 280].map((x) => (
                <line key={`v-${x}`} x1={x} y1={20} x2={x} y2={160} />
              ))}
              {[40, 60, 80, 100, 120, 140].map((y) => (
                <line key={`h-${y}`} x1={20} y1={y} x2={300} y2={y} />
              ))}
            </g>

            {/* x axis */}
            <line x1={20} y1={160} x2={300} y2={160} stroke="white" strokeWidth={0.6} opacity={0.15} />
            {/* y axis */}
            <line x1={20} y1={20} x2={20} y2={160} stroke="white" strokeWidth={0.6} opacity={0.15} />

            {/* fill under bell */}
            {shouldReduceMotion ? (
              <path d={fillPath} fill="url(#bell-fill)" />
            ) : (
              <motion.path
                d={fillPath}
                fill="url(#bell-fill)"
                initial={{ opacity: 0 }}
                animate={showChart ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              />
            )}

            {/* bell stroke */}
            {shouldReduceMotion ? (
              <path d={bellPath} fill="none" stroke="#5eead4" strokeWidth={2.5} strokeLinecap="round" />
            ) : (
              <motion.path
                d={bellPath}
                fill="none"
                stroke="#5eead4"
                strokeWidth={2.5}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={showChart ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            )}

            {/* mean dashed line μ */}
            {shouldReduceMotion ? (
              <line x1={160} y1={20} x2={160} y2={160} stroke="white" strokeWidth={0.9} strokeDasharray="5 5" opacity={0.45} />
            ) : (
              <motion.line
                x1={160}
                y1={20}
                x2={160}
                y2={160}
                stroke="white"
                strokeWidth={0.9}
                strokeDasharray="5 5"
                initial={{ opacity: 0 }}
                animate={showChart ? { opacity: 0.45 } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
              />
            )}

            {/* labels */}
            <text x={160} y={174} textAnchor="middle" fontSize={9} fill="white" opacity={0.55} fontFamily="monospace">
              μ
            </text>
            <text x={210} y={174} textAnchor="middle" fontSize={8} fill="white" opacity={0.35} fontFamily="monospace">
              μ+σ
            </text>
            <text x={110} y={174} textAnchor="middle" fontSize={8} fill="white" opacity={0.35} fontFamily="monospace">
              μ-σ
            </text>
          </svg>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-green-400">
          <span>μ=0.03</span>
          <span className="text-white/20">·</span>
          <span>σ=0.98</span>
          <span className="text-white/20">·</span>
          <span className="text-white/60">p=0.42 ns</span>
        </div>
      </div>
    </TerminalChrome>
  );
}

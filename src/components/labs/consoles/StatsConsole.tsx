"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { TerminalChrome } from "@/components/shared/TerminalChrome";
import { TypingText } from "@/components/ui/TypingText";

const bins = [12, 28, 45, 38, 22, 18, 9];

export function StatsConsole() {
  const shouldReduceMotion = useReducedMotion();
  const [showChart, setShowChart] = useState(shouldReduceMotion ?? false);

  useEffect(() => {
    if (shouldReduceMotion) {
      setShowChart(true);
      return;
    }
    const t = setTimeout(() => setShowChart(true), 1400);
    return () => clearTimeout(t);
  }, [shouldReduceMotion]);

  const max = Math.max(...bins);

  return (
    <TerminalChrome title="python invitro-code --lab stats" className="flex flex-col">
      <div className="flex h-[420px] flex-col gap-3">
        <TypingText
          text="import scipy.stats as st"
          delay={22}
          className="text-sm text-cyan-400"
        />
        <p className="font-mono text-xs text-white/50">dist = st.norm(μ=0, σ=1) · n=120 · Shapiro p=0.42</p>

        <div className="flex flex-1 items-end gap-1.5 rounded-lg bg-white/5 p-4">
          {bins.map((v, i) => {
            const h = (v / max) * 100;
            return (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full flex-1 items-end justify-center">
                  {shouldReduceMotion ? (
                    <div
                      className="w-full rounded-t bg-gradient-to-t from-cyan-600 to-mint"
                      style={{ height: `${h}%` }}
                    />
                  ) : (
                    <motion.div
                      className="w-full rounded-t bg-gradient-to-t from-cyan-600 to-mint"
                      initial={{ height: 0 }}
                      animate={showChart ? { height: `${h}%` } : { height: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: i * 0.08,
                        ease: "easeOut",
                      }}
                    />
                  )}
                </div>
                <span className="font-mono text-[10px] text-white/30">{i}</span>
              </div>
            );
          })}
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

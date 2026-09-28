"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { TerminalChrome } from "@/components/shared/TerminalChrome";
import { TypingText } from "@/components/ui/TypingText";

// Points mapped to 320x180 grid: x 20-300, y 20-160 (y inverted: smaller y = higher)
const points: { x: number; y: number; c: number }[] = [
  { x: 52, y: 122, c: 0 },
  { x: 72, y: 118, c: 0 },
  { x: 64, y: 100, c: 0 },
  { x: 88, y: 108, c: 0 },
  { x: 102, y: 102, c: 0 },
  { x: 78, y: 84, c: 0 },
  { x: 190, y: 58, c: 1 },
  { x: 202, y: 72, c: 1 },
  { x: 228, y: 42, c: 1 },
  { x: 182, y: 86, c: 1 },
  { x: 158, y: 68, c: 1 },
  { x: 244, y: 76, c: 1 },
  { x: 132, y: 92, c: 0 },
  { x: 168, y: 62, c: 1 },
  { x: 96, y: 130, c: 0 },
  { x: 216, y: 52, c: 1 },
];

export function MlConsole() {
  const shouldReduceMotion = useReducedMotion();
  const [show, setShow] = useState(shouldReduceMotion ?? false);

  useEffect(() => {
    if (shouldReduceMotion) {
      setShow(true);
      return;
    }
    const t = setTimeout(() => setShow(true), 900);
    return () => clearTimeout(t);
  }, [shouldReduceMotion]);

  const decisionPath = "M20,140 Q160,80 300,30";

  return (
    <TerminalChrome title="python invitro-code --lab ml" className="flex flex-col">
      <div className="flex h-[420px] flex-col gap-3">
        <TypingText
          text="from sklearn.ensemble import RandomForestClassifier"
          delay={18}
          className="text-sm text-cyan-400"
        />
        <p className="font-mono text-xs text-white/50">rf.fit(X_train, y) · accuracy 0.91 · f1 0.89</p>

        <div className="flex-1 overflow-hidden rounded-lg bg-white/5 p-3">
          <svg viewBox="0 0 320 180" className="h-full w-full" aria-label="Random Forest decision boundary">
            {/* grid gap 20 */}
            <g stroke="white" strokeWidth={0.25} opacity={0.07}>
              {Array.from({ length: 15 }, (_, i) => {
                const x = 20 + i * 20;
                if (x > 300) return null;
                return <line key={`vg-${x}`} x1={x} y1={20} x2={x} y2={160} />;
              })}
              {Array.from({ length: 8 }, (_, i) => {
                const y = 20 + i * 20;
                if (y > 160) return null;
                return <line key={`hg-${y}`} x1={20} y1={y} x2={300} y2={y} />;
              })}
            </g>

            {/* axes fixed to grid borders */}
            <line x1={20} y1={160} x2={300} y2={160} stroke="white" strokeWidth={0.6} opacity={0.15} />
            <line x1={20} y1={20} x2={20} y2={160} stroke="white" strokeWidth={0.6} opacity={0.15} />

            {/* ticks 0, 0.5, 1 on x and y */}
            <g fontFamily="monospace" fontSize={7} fill="white" opacity={0.35}>
              <text x={20} y={172} textAnchor="middle">0</text>
              <text x={160} y={172} textAnchor="middle">0.5</text>
              <text x={300} y={172} textAnchor="middle">1</text>
              <text x={12} y={164} textAnchor="end">0</text>
              <text x={12} y={94} textAnchor="end">0.5</text>
              <text x={12} y={24} textAnchor="end">1</text>
            </g>
            <g stroke="white" strokeWidth={0.4} opacity={0.2}>
              <line x1={160} y1={158} x2={160} y2={162} />
              <line x1={300} y1={158} x2={300} y2={162} />
              <line x1={18} y1={90} x2={22} y2={90} />
              <line x1={18} y1={20} x2={22} y2={20} />
            </g>

            {/* decision boundary touching borders */}
            {shouldReduceMotion ? (
              <path d={decisionPath} fill="none" stroke="#00b2b2" strokeWidth={1} opacity={0.6} strokeDasharray="5 4" />
            ) : (
              <motion.path
                d={decisionPath}
                fill="none"
                stroke="#00b2b2"
                strokeWidth={1}
                opacity={0.6}
                strokeDasharray="5 4"
                initial={{ pathLength: 0 }}
                animate={show ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              />
            )}

            {/* points */}
            {points.map((p, i) =>
              shouldReduceMotion ? (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={4}
                  fill={p.c === 0 ? "#00b2b2" : "#a0c0d0"}
                  stroke="#0a0a0a"
                  strokeWidth={0.7}
                  opacity={0.95}
                />
              ) : (
                <motion.circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={4}
                  fill={p.c === 0 ? "#00b2b2" : "#a0c0d0"}
                  stroke="#0a0a0a"
                  strokeWidth={0.7}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={show ? { scale: 1, opacity: 0.95 } : { scale: 0, opacity: 0 }}
                  transition={{ duration: 0.28, delay: i * 0.05, ease: "easeOut" }}
                />
              ),
            )}
          </svg>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="inline-flex items-center gap-1.5 text-white/70">
            <span className="h-2 w-2 rounded-full bg-[#00b2b2]" /> clase 0
          </span>
          <span className="inline-flex items-center gap-1.5 text-white/70">
            <span className="h-2 w-2 rounded-full bg-[#a0c0d0]" /> clase 1
          </span>
          <span className="ml-auto text-green-400">accuracy 0.91</span>
        </div>
      </div>
    </TerminalChrome>
  );
}

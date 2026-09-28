"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { TerminalChrome } from "@/components/shared/TerminalChrome";
import { TypingText } from "@/components/ui/TypingText";

const points: { x: number; y: number; c: number }[] = [
  { x: 18, y: 72, c: 0 },
  { x: 28, y: 68, c: 0 },
  { x: 22, y: 55, c: 0 },
  { x: 35, y: 62, c: 0 },
  { x: 42, y: 58, c: 0 },
  { x: 31, y: 44, c: 0 },
  { x: 68, y: 28, c: 1 },
  { x: 72, y: 38, c: 1 },
  { x: 78, y: 22, c: 1 },
  { x: 62, y: 45, c: 1 },
  { x: 55, y: 35, c: 1 },
  { x: 82, y: 42, c: 1 },
];

export function MlConsole() {
  const shouldReduceMotion = useReducedMotion();
  const [show, setShow] = useState(shouldReduceMotion ?? false);

  useEffect(() => {
    if (shouldReduceMotion) {
      setShow(true);
      return;
    }
    const t = setTimeout(() => setShow(true), 1300);
    return () => clearTimeout(t);
  }, [shouldReduceMotion]);

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
          <svg viewBox="0 0 100 100" className="h-full w-full" aria-label="Random Forest decision boundary">
            {/* decision boundary line */}
            {shouldReduceMotion ? (
              <line x1={8} y1={88} x2={92} y2={12} stroke="#00b2b2" strokeWidth={0.8} opacity={0.6} strokeDasharray="3 3" />
            ) : (
              <motion.line
                x1={8}
                y1={88}
                x2={92}
                y2={12}
                stroke="#00b2b2"
                strokeWidth={0.8}
                opacity={0.6}
                strokeDasharray="3 3"
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
                  r={2.8}
                  fill={p.c === 0 ? "#00b2b2" : "#a0c0d0"}
                  stroke="#0a0a0a"
                  strokeWidth={0.6}
                  opacity={0.95}
                />
              ) : (
                <motion.circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={2.8}
                  fill={p.c === 0 ? "#00b2b2" : "#a0c0d0"}
                  stroke="#0a0a0a"
                  strokeWidth={0.6}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={show ? { scale: 1, opacity: 0.95 } : { scale: 0, opacity: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.06, ease: "easeOut" }}
                />
              ),
            )}
            {/* axes */}
            <line x1={8} y1={92} x2={92} y2={92} stroke="white" strokeWidth={0.4} opacity={0.2} />
            <line x1={8} y1={8} x2={8} y2={92} stroke="white" strokeWidth={0.4} opacity={0.2} />
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

"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { TerminalChrome } from "@/components/shared/TerminalChrome";
import { TypingText } from "@/components/ui/TypingText";

const outputLines = [
  "Fundamentos de IA cargados",
  "Historia: Turing → perceptron → deep learning",
  "Agentes, busqueda y logica proposicional OK",
];

export function IntroConsole() {
  const shouldReduceMotion = useReducedMotion();
  const [showOutput, setShowOutput] = useState(shouldReduceMotion ?? false);

  useEffect(() => {
    if (shouldReduceMotion) {
      setShowOutput(true);
      return;
    }
    const t = setTimeout(() => setShowOutput(true), 1600);
    return () => clearTimeout(t);
  }, [shouldReduceMotion]);

  return (
    <TerminalChrome title="python invitro-code --lab ia" className="flex flex-col">
      <div className="flex h-[420px] flex-col gap-2 overflow-hidden">
        <TypingText
          text="> Hola IA"
          delay={30}
          className="text-sm font-bold text-cyan-400"
        />
        <div className="mt-2 flex flex-col gap-1.5">
          {showOutput &&
            outputLines.map((line, i) => (
              <p
                key={i}
                className="text-sm text-white/70"
                style={
                  shouldReduceMotion
                    ? undefined
                    : ({ animationDelay: `${i * 120}ms` } as React.CSSProperties)
                }
              >
                <span className="text-green-400">✔</span> {line}
              </p>
            ))}
        </div>
        <p className="mt-auto font-mono text-xs text-white/40">ia · 4 labs · 100 XP</p>
      </div>
    </TerminalChrome>
  );
}

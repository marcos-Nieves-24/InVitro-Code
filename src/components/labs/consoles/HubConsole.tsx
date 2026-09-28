"use client";

import { useEffect, useState, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { TerminalChrome } from "@/components/shared/TerminalChrome";
import { TypingText } from "@/components/ui/TypingText";
import { DendrogramSVG } from "@/components/landing/DendrogramSVG";

export function HubConsole() {
  const shouldReduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<"typing" | "dendrogram">(
    shouldReduceMotion ? "dendrogram" : "typing",
  );

  useEffect(() => {
    if (shouldReduceMotion) {
      setPhase("dendrogram");
      return;
    }
    const t = setTimeout(() => setPhase("dendrogram"), 1800);
    return () => clearTimeout(t);
  }, [shouldReduceMotion]);

  return (
    <TerminalChrome title="python invitro-code --lab hub" className="flex flex-col">
      <div className="flex h-[420px] flex-col gap-3 overflow-hidden">
        <TypingText
          text="> Sala de laboratorios"
          delay={28}
          smooth={false}
          className="text-sm font-bold text-[var(--color-brand-300)]"
          cursor={<span className="text-[var(--color-brand-300)]">█</span>}
        />
        {phase === "typing" ? (
          <p className="text-sm text-white/60">Inicializando modulos...</p>
        ) : (
          <div className="flex-1 overflow-hidden">
            <DendrogramSVG active />
          </div>
        )}
      </div>
    </TerminalChrome>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { TerminalChrome } from "@/components/shared/TerminalChrome";
import { TypingText } from "@/components/ui/TypingText";
import { SlideArrowButton } from "@/components/ui/SlideArrowButton";

type Bubble = { role: "user" | "assistant"; text: string };

const bubbles: Bubble[] = [
  { role: "user", text: "¿Qué es la IA en biotech?" },
  {
    role: "assistant",
    text: "¡Vamos! Comprimiremos un FASTA y entrenaremos tu primer clasificador. La IA lee secuencias como vos lees un microscopio.",
  },
  { role: "user", text: "¿Por dónde empiezo?" },
  {
    role: "assistant",
    text: "Por el módulo IA: agentes, búsqueda y lógica. Después Python + stats + ML. Paso a paso, sin humo.",
  },
];

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60 [animation-delay:0ms]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60 [animation-delay:150ms]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60 [animation-delay:300ms]" />
    </span>
  );
}

export function IntroConsole() {
  const shouldReduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(shouldReduceMotion ? bubbles.length : 0);
  const [showDots, setShowDots] = useState(false);
  const [showCta, setShowCta] = useState(shouldReduceMotion ?? false);

  useEffect(() => {
    if (shouldReduceMotion) {
      setVisible(bubbles.length);
      setShowCta(true);
      return;
    }
    let idx = 0;
    let active = true;
    const tick = () => {
      if (!active) return;
      if (idx < bubbles.length) {
        // show typing dots briefly before assistant bubbles
        const next = bubbles[idx];
        if (next.role === "assistant") {
          setShowDots(true);
          setTimeout(() => {
            if (!active) return;
            setShowDots(false);
            setVisible((v) => v + 1);
            idx++;
            setTimeout(tick, 650);
          }, 700);
        } else {
          setVisible((v) => v + 1);
          idx++;
          setTimeout(tick, 650);
        }
      } else {
        setShowCta(true);
      }
    };
    const t = setTimeout(tick, 1100);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [shouldReduceMotion]);

  return (
    <TerminalChrome title="llm invitro-code --chat" className="flex flex-col">
      <div className="flex h-[420px] flex-col gap-3 overflow-hidden">
        <TypingText
          text="> Hola, explorador"
          delay={30}
          className="text-sm font-bold text-cyan-400"
        />

        <div className="flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
          {bubbles.slice(0, visible).map((b, i) =>
            shouldReduceMotion ? (
              <div
                key={i}
                className={
                  b.role === "user"
                    ? "self-end max-w-[85%] rounded-2xl rounded-br-sm bg-white/10 px-3 py-2 text-sm text-white/90"
                    : "self-start max-w-[85%] rounded-2xl rounded-bl-sm bg-[var(--color-brand-300)]/20 px-3 py-2 text-sm text-mint"
                }
              >
                <span className="font-mono text-[11px] opacity-60">{b.role === "user" ? "vos" : "invitro-code"}</span>
                <p className="mt-0.5 leading-snug">{b.text}</p>
              </div>
            ) : (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className={
                  b.role === "user"
                    ? "self-end max-w-[85%] rounded-2xl rounded-br-sm bg-white/10 px-3 py-2 text-sm text-white/90"
                    : "self-start max-w-[85%] rounded-2xl rounded-bl-sm bg-[var(--color-brand-300)]/20 px-3 py-2 text-sm text-mint"
                }
              >
                <span className="font-mono text-[11px] opacity-60">{b.role === "user" ? "vos" : "invitro-code"}</span>
                <p className="mt-0.5 leading-snug">{b.text}</p>
              </motion.div>
            ),
          )}

          {showDots && (
            <div className="self-start rounded-2xl rounded-bl-sm bg-white/5 px-3 py-2">
              <TypingDots />
            </div>
          )}
        </div>

        {showCta &&
          (shouldReduceMotion ? (
            <div className="flex items-center gap-3">
              <p className="font-mono text-xs text-white/50">Da click en Empezar</p>
              <SlideArrowButton size="sm" text="Empezar" href="#mision" />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3"
            >
              <p className="font-mono text-xs text-white/50">Da click en Empezar</p>
              <SlideArrowButton size="sm" text="Empezar" href="#mision" />
            </motion.div>
          ))}
      </div>
    </TerminalChrome>
  );
}

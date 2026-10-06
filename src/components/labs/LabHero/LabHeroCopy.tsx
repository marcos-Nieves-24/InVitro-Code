"use client";

import { useEffect, useState } from "react";
import { TypingText } from "@/components/ui/TypingText";

const PHRASES = [
  "Python potencia el análisis de datos biotecnológicos, del laboratorio al código.",
  "La estadística revela patrones ocultos en tus experimentos.",
  "Machine learning predice resultados a partir de datos biológicos.",
  "Cada proyecto te acerca a dominar IA aplicada a biotech.",
  "Visualiza, analiza y modela: tus datos cobran vida en el laboratorio.",
  "De secuencias genómicas a modelos predictivos: programa tu descubrimiento.",
  "Entrena modelos, valida hipótesis y acelera tu investigación.",
];

interface LabHeroCopyProps {
  className?: string;
}

/**
 * Rotating typed phrases about lab projects.
 * MIT-owned typing animation via TypingText.
 */
export function LabHeroCopy({ className }: LabHeroCopyProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const text = PHRASES[current];
    const typeMs = text.length * 38;
    const backMs = text.length * 22;
    const totalMs = typeMs + 1400 + backMs;

    const id = setTimeout(() => {
      setCurrent((i) => (i + 1) % PHRASES.length);
    }, totalMs);

    return () => clearTimeout(id);
  }, [current]);

  return (
    <p
      className={`font-mono text-sm md:text-base text-[var(--color-comic-accent)] ${className ?? ""}`}
      aria-live="polite"
    >
      <TypingText
        key={current}
        text={PHRASES[current]}
        delay={38}
        cursor="|"
      />
    </p>
  );
}

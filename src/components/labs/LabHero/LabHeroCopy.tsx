"use client";

import { useEffect, useRef } from "react";
import Typed from "typed.js";

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
 * Uses typed.js — must be client-only.
 */
export function LabHeroCopy({ className }: LabHeroCopyProps) {
  const elRef = useRef<HTMLSpanElement>(null);
  const typedRef = useRef<Typed | null>(null);

  useEffect(() => {
    if (!elRef.current) return;

    typedRef.current = new Typed(elRef.current, {
      strings: PHRASES,
      typeSpeed: 38,
      backSpeed: 22,
      backDelay: 1400,
      loop: true,
      showCursor: true,
      cursorChar: "|",
    });

    return () => {
      typedRef.current?.destroy();
    };
  }, []);

  return (
    <p
      className={`font-mono text-sm md:text-base text-[var(--color-comic-accent)] ${className ?? ""}`}
      aria-live="polite"
    >
      <span ref={elRef} />
    </p>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Typed from "typed.js";

const PHRASES = [
  "Los biorreactores mantienen condiciones optimales para el crecimiento celular.",
  "pH, oxígeno disuelto y temperatura determinan la productividad metabólica.",
  "Del laboratorio a planta piloto: el escalado exige control preciso de parámetros.",
  "Las células CHO producen anticuerpos monoclonales en biorreactores de 2000L.",
  "La cinética de Monod describe el crecimiento microbiano como función del sustrato.",
  "El control de espuma previene la degradación de proteínas recombinantes.",
  "fermentación continua vs batch: cada estrategia tiene ventajas específicas.",
];

interface LabHeroCopyProps {
  className?: string;
}

/**
 * Rotating typed phrases about bioreactors.
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

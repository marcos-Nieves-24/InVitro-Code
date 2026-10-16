"use client";

import { Children, isValidElement, useCallback, useState } from "react";
import type { ReactNode } from "react";

/**
 * EquationStep — una parada del tour: fragmento de ecuación (MDX con $...$,
 * compilado por el pipeline remark-math/rehype-katex) + explicación corta.
 */
export function EquationStep({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div data-equation-step={label}>
      <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-brand-600">
        {label}
      </p>
      <div className="[&_p]:text-[15px] [&_p]:leading-relaxed [&_p]:text-gray-700">
        {children}
      </div>
    </div>
  );
}

interface EquationTourProps {
  /** Leyenda obligatoria: qué enseña este tour. */
  caption: string;
  children: ReactNode;
}

/**
 * EquationTour — recorre una ecuación por partes, un paso a la vez.
 *
 * Cada hijo <EquationStep> es una parada: su fragmento de ecuación (ya
 * compilado por el pipeline MDX, sin KaTeX en runtime) más su explicación.
 * Controles propios Atrás/Siguiente + puntos; no se registra como advance
 * owner del RevealSequence para no anidar protocolos de avance.
 * Sin autoplay ni animación: seguro bajo prefers-reduced-motion por diseño.
 */
export function EquationTour({ caption, children }: EquationTourProps) {
  const steps = Children.toArray(children).filter(isValidElement);
  const total = steps.length;
  const [index, setIndex] = useState(0);
  const current = total > 0 ? Math.min(index, total - 1) : 0;

  const prev = useCallback(
    () => setIndex((i) => Math.max(0, i - 1)),
    [],
  );
  const next = useCallback(
    () => setIndex((i) => Math.min(total - 1, i + 1)),
    [total],
  );

  if (total === 0) return null;

  return (
    <div
      role="region"
      aria-label={`Recorrido de ecuación: ${caption}`}
      className="w-full rounded-card border border-gray-200 bg-surface-card p-4 md:p-5"
    >
      <div aria-live="polite" aria-atomic="true" key={current}>
        {steps[current]}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            disabled={current === 0}
            aria-label="Parte anterior de la ecuación"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-gray-200 bg-surface-card px-4 text-sm font-medium text-storm shadow-sm transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"
          >
            <span aria-hidden="true">←</span> Atrás
          </button>
          <button
            type="button"
            onClick={next}
            disabled={current === total - 1}
            aria-label="Siguiente parte de la ecuación"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-brand-200 bg-brand-50 px-5 text-sm font-semibold text-brand-700 shadow-sm transition hover:bg-brand-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"
          >
            Siguiente <span aria-hidden="true">→</span>
          </button>
        </div>

        <div
          className="flex items-center gap-1.5"
          role="group"
          aria-label="Partes de la ecuación"
        >
          <span className="mr-1 font-mono text-xs text-storm">
            {current + 1} / {total}
          </span>
          {steps.map((_, i) => (
            <button
              key={`eq-dot-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ir a la parte ${i + 1} de ${total}`}
              aria-current={i === current ? "true" : undefined}
              className="flex h-6 w-6 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2"
            >
              <span
                aria-hidden="true"
                className={
                  i === current
                    ? "h-2.5 w-6 rounded-full bg-brand-500"
                    : "h-2.5 w-2.5 rounded-full bg-gray-300"
                }
              />
            </button>
          ))}
        </div>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-gray-500">{caption}</p>
    </div>
  );
}

export default EquationTour;

"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

interface LabCompletionBannerProps {
  hasNextLab: boolean;
  nextLabHref: string | null;
  moduleHref: string;
  onNext?: () => void;
}

/**
 * REQ-LC-02 / REQ-LC-03: Banner shown after completing a lab.
 * - Heading "Laboratorio completado" with CheckCircle2 + motion entry
 * - Two actions: "Siguiente laboratorio" (hidden/disabled when last) and "Volver al módulo"
 * - Last-lab variant shows message "¡Módulo completado!" and disables/hides Siguiente
 * - Spanish literals exactly as spec-quoted; a11y focus + accent success-green
 */
export function LabCompletionBanner({
  hasNextLab,
  nextLabHref,
  moduleHref,
  onNext,
}: LabCompletionBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      role="status"
      aria-live="polite"
      className="rounded-xl border border-success-green/30 bg-success-green/[0.06] p-5 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success-green/15">
          <CheckCircle2 className="h-5 w-5 text-success-green" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-ink">Laboratorio completado</h3>
          {!hasNextLab && (
            <p className="mt-1 text-sm font-medium text-success-green">¡Módulo completado!</p>
          )}
          <p className="mt-1 text-xs text-storm">
            {hasNextLab
              ? "¡Excelente trabajo! Continúa con el siguiente laboratorio."
              : "Completaste todos los laboratorios de este módulo."}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {hasNextLab && nextLabHref ? (
              <Link
                href={nextLabHref}
                onClick={onNext}
                className="inline-flex items-center justify-center rounded-full bg-success-green px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-success-green/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success-green focus-visible:ring-offset-2"
              >
                Siguiente laboratorio
              </Link>
            ) : (
              <span
                aria-disabled="true"
                className="inline-flex cursor-not-allowed items-center justify-center rounded-full bg-surface-raised px-5 py-2 text-sm font-semibold text-storm opacity-60"
                title="No hay siguiente laboratorio"
              >
                Siguiente laboratorio
              </span>
            )}
            <Link
              href={moduleHref}
              className="inline-flex items-center justify-center rounded-full border border-surface-raised bg-surface-card px-5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2"
            >
              Volver al módulo
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import Link from "next/link";
import { Clock, CheckCircle2, Circle, Dot } from "lucide-react";
import { formatLabDate } from "@/lib/validation/labProgress";
import { getLabCardTheme } from "./LabCardTheme";
import type { CompletionStatus } from "@/lib/content/modules";

interface LabHistoryCardProps {
  moduleSlug: string;
  lessonSlug: string;
  title: string;
  status: CompletionStatus;
  completionDate: string | null;
  updatedAt: string | null;
  href: string;
  /** When true, card action is "Repasar" (Caso 3 all completed). */
  isRepasar?: boolean;
}

const STATUS_LABEL: Record<CompletionStatus, string> = {
  not_started: "No iniciado",
  in_progress: "En progreso",
  completed: "Completado",
};

const STATUS_BADGE: Record<CompletionStatus, string> = {
  not_started: "bg-surface-raised text-storm border-surface-raised",
  in_progress: "bg-xp-gold/10 text-xp-gold border-xp-gold/20",
  completed: "bg-success-green/10 text-success-green border-success-green/20",
};

/**
 * REQ-LC-04 / REQ-LC-05: History card per lab with
 * Nombre, Estado badge, Última fecha (dd/MM/yyyy or "—"), visual accent per status,
 * link to /laboratorios/{module}/{lesson}, "Repasar" variant for Caso 3.
 */
export function LabHistoryCard({
  moduleSlug,
  lessonSlug,
  title,
  status,
  completionDate,
  updatedAt,
  href,
  isRepasar = false,
}: LabHistoryCardProps) {
  const theme = getLabCardTheme(moduleSlug);
  const displayDate =
    status === "completed"
      ? formatLabDate(completionDate)
      : status === "in_progress"
        ? formatLabDate(updatedAt)
        : "—";

  const borderAccent =
    status === "completed" ? "#22c55e" : status === "not_started" ? theme.accent : "#9ca3af";

  const bgColor =
    status === "completed"
      ? undefined
      : status === "in_progress"
        ? "rgba(243,244,246,0.6)"
        : `${theme.tint}99`;

  return (
    <Link
      href={href}
      aria-label={`${title} — ${STATUS_LABEL[status]}`}
      className="group relative flex flex-col gap-3 rounded-2xl border-t-[3px] bg-surface-card p-5 transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2"
      style={{
        borderTopColor: borderAccent,
        backgroundColor: bgColor,
      }}
    >
      {/* Status dot for in_progress */}
      {status === "in_progress" && (
        <span
          className="absolute right-4 top-4 inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-xp-gold"
          aria-label="En progreso"
        />
      )}
      {status === "completed" && (
        <span className="absolute right-4 top-4">
          <CheckCircle2 className="h-5 w-5 text-success-green" aria-label="Completado" />
        </span>
      )}
      {status === "not_started" && (
        <span className="absolute right-4 top-4">
          <Circle className="h-4 w-4 text-storm" aria-label="No iniciado" />
        </span>
      )}

      {/* Nombre */}
      <h3 className="pr-10 text-sm font-bold leading-snug text-ink group-hover:text-mint transition-colors">
        {title}
      </h3>

      {/* Estado + fecha */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_BADGE[status]}`}
        >
          {status === "in_progress" && <Dot className="h-3 w-3 shrink-0" aria-hidden="true" />}
          {STATUS_LABEL[status]}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] text-storm">
          <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
          {displayDate}
        </span>
      </div>

      {/* Repasar action (Caso 3) */}
      {isRepasar && (
        <span className="mt-1 inline-flex w-fit items-center rounded-full border border-mint/30 bg-mint/10 px-3 py-1 text-xs font-semibold text-mint">
          Repasar
        </span>
      )}
      {!isRepasar && status !== "completed" && status !== "not_started" && (
        <span className="mt-1 text-xs font-medium text-storm">Continuar →</span>
      )}
    </Link>
  );
}

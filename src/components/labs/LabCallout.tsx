import type { ReactNode } from "react";
import { Target, Clock, Database, PackageCheck } from "lucide-react";

type LabCalloutKind = "objetivo" | "duracion" | "dataset" | "entregables";

const KIND_STYLES: Record<
  LabCalloutKind,
  {
    icon: typeof Target;
    variant: string;
    labelClass: string;
  }
> = {
  objetivo: {
    icon: Target,
    variant: "border-mint/25 bg-mint/10",
    labelClass: "text-mint",
  },
  duracion: {
    icon: Clock,
    variant: "border-amber-500/25 bg-amber-50/60",
    labelClass: "text-amber-600",
  },
  dataset: {
    icon: Database,
    variant: "border-secondary/25 bg-secondary-fixed/40",
    labelClass: "text-secondary",
  },
  entregables: {
    icon: PackageCheck,
    variant: "border-teal-500/25 bg-teal-50/60",
    labelClass: "text-teal-600",
  },
};

interface LabCalloutProps {
  kind: string;
  title?: string;
  children: ReactNode;
}

/**
 * LabCallout — wraps the conventional lab sections (Objetivo, Duración,
 * Dataset, Entregables) into a labelled card. `kind` drives the icon and
 * color; `title` is the original (bilingual) heading text, falling back to
 * the Spanish default label. `not-prose` prevents prose typography from
 * cascading into the card; inner content keeps light utility styling.
 */
export function LabCallout({ kind, title, children }: LabCalloutProps) {
  const styles = KIND_STYLES[kind as LabCalloutKind] ?? KIND_STYLES.objetivo;
  const Icon = styles.icon;
  const label =
    title ?? (kind === "objetivo"
      ? "Objetivo"
      : kind === "duracion"
        ? "Duración"
        : kind === "dataset"
          ? "Dataset"
          : "Entregables");

  return (
    <div
      className={`not-prose my-5 rounded-card border p-4 md:p-5 ${styles.variant}`}
    >
      <p
        className={`mb-2 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] ${styles.labelClass}`}
      >
        <Icon className="h-3.5 w-3.5" />
        {label}
      </p>
      <div className="space-y-2 text-sm leading-relaxed text-graphite [&_strong]:font-semibold [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_code]:rounded [&_code]:bg-surface-raised [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[12px]">
        {children}
      </div>
    </div>
  );
}

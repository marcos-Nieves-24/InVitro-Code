import { FlaskConical } from "lucide-react";

/**
 * LabHeader — hero for the lab title extracted from `# Lab: <title>`.
 * Replaces the flat h1 with an eyebrow + title panel. `not-prose` keeps
 * the Tailwind typography plugin from restyling the inner elements.
 */
export function LabHeader({ title }: { title: string }) {
  return (
    <header className="not-prose mb-6 rounded-card border border-surface-container bg-surface-container-low p-5 md:p-6">
      <p className="eyebrow flex items-center gap-2">
        <FlaskConical className="h-3.5 w-3.5" />
        <span>Laboratorio</span>
      </p>
      <h1 className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-deep-navy">
        {title}
      </h1>
    </header>
  );
}

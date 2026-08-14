import type { ReactNode } from "react";
import { MessageCircleQuestionMark } from "lucide-react";

interface ReflectionPromptProps {
  /** Original prompt heading text (bilingual) — e.g. "Preguntas para reflexionar". */
  label?: string;
  children: ReactNode;
}

/**
 * ReflectionPrompt — wraps the `**Preguntas para reflexionar:**` list into a
 * "check"-style callout. The original bold paragraph becomes the card label;
 * the following markdown list renders as the questions.
 */
export function ReflectionPrompt({
  label = "Preguntas para reflexionar",
  children,
}: ReflectionPromptProps) {
  return (
    <div className="not-prose my-4 rounded-card border border-teal-500/25 bg-teal-50/60 p-4">
      <p className="mb-2 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-teal-600">
        <MessageCircleQuestionMark className="h-3.5 w-3.5" />
        {label}
      </p>
      <div className="space-y-1.5 text-sm leading-relaxed text-gray-700 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_strong]:font-semibold [&_strong]:text-gray-900">
        {children}
      </div>
    </div>
  );
}

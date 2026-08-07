"use client";

import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";

interface LabRunnerProps {
  /** Pre-compiled MDX content (ReactNode from server-side compileMDX). */
  content: ReactNode;
  /** If compilation failed, this is the raw markdown string. */
  rawFallback: string | null;
}

/**
 * REQ-LABRUN-01/05: Renders pre-compiled lab.md MDX.
 *
 * The page (server component) compiles lab.md with compileMDX using
 * `pre: LabCodeBlock` + `table: MarkdownTable` and passes the result
 * here. If compilation failed, we render the raw markdown with a notice.
 */
export function LabRunner({ content, rawFallback }: LabRunnerProps) {
  // REQ-LABRUN-05: Compile failure fallback
  if (rawFallback !== null) {
    return (
      <div className="rounded-card border border-amber-200 bg-amber-50 p-6">
        <div className="mb-4 flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <h3 className="text-sm font-semibold text-amber-800">
              Laboratorio no disponible
            </h3>
            <p className="mt-1 text-sm text-amber-700">
              El contenido de este laboratorio no se pudo interpretar. Se
              muestra en formato original:
            </p>
          </div>
        </div>
        <pre className="max-h-96 overflow-y-auto whitespace-pre-wrap rounded-lg border border-amber-200 bg-amber-100/50 p-4 font-mono text-sm text-gray-800">
          {rawFallback}
        </pre>
      </div>
    );
  }

  // REQ-LABRUN-01: Render compiled MDX (headings, LaTeX math, tables via
  // MarkdownTable, and code fences via LabCodeBlock → PyodideRunner)
  return (
    <div className="prose prose-base max-w-none prose-headings:font-display prose-headings:font-semibold prose-headings:tracking-tight prose-h2:mt-0 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-4 prose-h3:text-xl prose-p:text-gray-700 prose-strong:text-gray-900 prose-code:font-mono prose-code:text-[13px] prose-pre:my-0 prose-pre:bg-transparent prose-pre:p-0 prose-pre:shadow-none prose-pre:border-0 prose-table:text-sm prose-th:font-mono prose-th:text-[11px] prose-th:uppercase prose-th:tracking-[0.08em] prose-th:text-gray-500 prose-td:text-gray-700 prose-a:text-brand hover:prose-a:text-brand-hover prose-a:no-underline">
      {content}
    </div>
  );
}

"use client";

import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";
import { NotebookDownloadButton } from "./NotebookDownloadButton";
import { labProseClass } from "@/lib/ui/prose";

interface AssignmentViewerProps {
  /** Pre-compiled MDX content (ReactNode from server-side compileMDX). */
  content: ReactNode;
  /** If compilation failed, this is the raw markdown string. */
  rawFallback: string | null;
  module: string;
  lesson: string;
  hasNotebook: boolean;
}

/**
 * REQ-ASGN-01/02/03/04: Renders pre-compiled assignment.md MDX.
 *
 * - REQ-ASGN-01: Same MDX pipeline as lessons (remarkMath, remarkGfm,
 *   rehypeKatex, table: MarkdownTable).
 * - REQ-ASGN-02: Rubric tables styled by MarkdownTable.
 * - REQ-ASGN-03: Notebook download control (hidden when notebook absent).
 * - REQ-ASGN-04: Compile failure fallback.
 */
export function AssignmentViewer({
  content,
  rawFallback,
  module: mod,
  lesson,
  hasNotebook,
}: AssignmentViewerProps) {
  // REQ-ASGN-04: Compile failure fallback
  if (rawFallback !== null) {
    return (
      <div className="rounded-card border border-amber-200 bg-amber-50 p-6">
        <div className="mb-4 flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <h3 className="text-sm font-semibold text-amber-800">
              Proyecto no disponible
            </h3>
            <p className="mt-1 text-sm text-amber-700">
              El contenido de este proyecto no se pudo interpretar. Se muestra
              en formato original:
            </p>
          </div>
        </div>
        <pre className="max-h-96 overflow-y-auto whitespace-pre-wrap rounded-lg border border-amber-200 bg-amber-100/50 p-4 font-mono text-sm text-gray-800">
          {rawFallback}
        </pre>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* REQ-ASGN-01/02: Compiled MDX with MarkdownTable for rubric tables */}
      <div className={labProseClass}>
        {content}
      </div>

      {/* REQ-ASGN-03: Notebook download */}
      <NotebookDownloadButton
        mod={mod}
        lesson={lesson}
        disabled={!hasNotebook}
      />
    </div>
  );
}

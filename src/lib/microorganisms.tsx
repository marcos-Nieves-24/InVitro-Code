"use client";

import type { ReactNode } from "react";

// Cursivas para microorganismos: envuelve nombres científicos en <em>
// Usado en expediciones (ia) para Aspergillus, Penicillium y genéricos frecuentes.
const MICRO_RE = /(Aspergillus|Penicillium|Escherichia\s+coli|E\.\s*coli|Bacillus|Staphylococcus|Candida|Saccharomyces|Salmonella|Lactobacillus)/g;

export function renderWithMicroorganismItalics(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  // Reset regex state
  MICRO_RE.lastIndex = 0;
  while ((match = MICRO_RE.exec(text)) !== null) {
    const start = match.index;
    const end = start + match[0].length;
    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start));
    }
    parts.push(
      <em key={`${start}-${match[0]}`} className="italic">
        {match[0]}
      </em>,
    );
    lastIndex = end;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  // Si no hubo matches, devolver texto plano como un solo elemento para evitar fragment vacío
  if (parts.length === 0) return [text];
  return parts;
}

export function containsMicroorganism(text: string): boolean {
  MICRO_RE.lastIndex = 0;
  return MICRO_RE.test(text);
}

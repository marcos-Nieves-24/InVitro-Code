"use client";

import type { ReactNode } from "react";

// Cursivas para microorganismos: envuelve nombres científicos en <em>
// Consume los marcadores markdown adyacentes (* o **) para no dejar
// asteriscos literales cuando el origen ya venía con *Nombre* o **Nombre**.
const MICRO_RE = /\*{0,2}(Aspergillus|Penicillium|Escherichia\s+coli|E\.\s*coli|Bacillus|Staphylococcus|Candida|Saccharomyces|Salmonella|Lactobacillus)\*{0,2}/g;

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
      <em key={`${start}-${match[1]}`} className="italic">
        {match[1]}
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

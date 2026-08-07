import type { ReactNode } from "react";

/**
 * MarkdownTable wraps MDX-emitted <table> children in a styled container.
 * Pure presentational server component — no "use client", no state.
 *
 * Structural styles (D2 additive): container, borders, backgrounds, padding,
 * zebra striping, hover, overflow.
 * Typography (font-mono, text-[11px], uppercase, text-gray-500 on th;
 * text-sm, text-gray-700 on td) is injected by the lessonProseClass prose
 * plugin — MarkdownTable does not duplicate it.
 */
export function MarkdownTable({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table
        className="w-full [&_thead_tr]:border-b [&_thead_tr]:border-gray-200 [&_thead_tr]:bg-gray-50 [&_th]:px-4 [&_th]:py-3 [&_td]:px-4 [&_td]:py-3 [&_tbody_tr:nth-child(odd)]:bg-white [&_tbody_tr:nth-child(even)]:bg-gray-50/50 [&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-blue-50/40"
      >
        {children}
      </table>
    </div>
  );
}

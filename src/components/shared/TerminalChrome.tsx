import type { ReactNode } from "react";

export interface TerminalChromeProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Extracted terminal chrome from InteractiveTerminal.tsx:213
 * Reusable shell: header with traffic lights + body.
 */
export function TerminalChrome({ title = "terminal", children, className }: TerminalChromeProps) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl shadow-black/50 ${className ?? ""}`}
    >
      <div className="flex items-center gap-2 border-b border-white/10 bg-[#1a1a1a] px-4 py-3">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-red-500/60" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
          <span className="h-3 w-3 rounded-full bg-green-500/60" />
        </div>
        <span className="ml-2 font-mono text-xs text-white/40">{title}</span>
      </div>
      <div className="p-5 font-mono text-sm">{children}</div>
    </div>
  );
}

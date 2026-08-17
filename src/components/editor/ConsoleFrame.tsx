"use client";

import type { ReactNode } from "react";

interface ConsoleFrameProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Terminal/console chrome shared by the lab code consoles. Mirrors the
 * animated terminal aesthetic from src/components/lesson/code-block.tsx:
 * traffic-light dots, dark title bar, subtle scanline overlay.
 */
export function ConsoleFrame({
  title,
  action,
  children,
  className = "",
}: ConsoleFrameProps) {
  return (
    <div className={`not-prose my-6 ${className}`}>
      <div className="overflow-hidden rounded-xl border border-[#222] bg-[#0a0a0a] shadow-2xl shadow-black/40">
        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-[#1d1d1d] bg-[#111] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
            <span className="ml-3 font-mono text-[12px] font-medium tracking-tight text-[#888]">
              {title}
            </span>
          </div>

          {action ? (
            <div className="flex items-center gap-2">{action}</div>
          ) : null}
        </div>

        {/* Body */}
        <div className="relative bg-[#0a0a0a]">
          {children}

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.15) 1px, rgba(255,255,255,0.15) 2px)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
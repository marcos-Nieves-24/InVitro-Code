"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

interface ConsoleFrameProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  /** When true, shows a maximize/minimize toggle in the title bar. */
  maximizable?: boolean;
  /** Unique sessionStorage key for persisting maximize state per console instance. */
  storageKey?: string;
}

/**
 * Terminal/console chrome shared by the lab code consoles. Mirrors the
 * animated terminal aesthetic from src/components/lesson/code-block.tsx:
 * traffic-light dots, dark title bar, subtle scanline overlay.
 *
 * When `maximizable` is true, a toggle button appears in the title bar.
 * The maximized state is persisted in sessionStorage so it survives
 * navigation within the session but resets on new sessions.
 */
export function ConsoleFrame({
  title,
  action,
  children,
  className = "",
  maximizable = false,
  storageKey,
}: ConsoleFrameProps) {
  const [isMaximized, setIsMaximized] = useState(false);

  // Restore maximize state from sessionStorage on mount
  useEffect(() => {
    if (!maximizable || !storageKey) return;
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored === "true") setIsMaximized(true);
    } catch {
      // sessionStorage unavailable — ignore
    }
  }, [maximizable, storageKey]);

  // Persist maximize state to sessionStorage on toggle
  useEffect(() => {
    if (!maximizable || !storageKey) return;
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(isMaximized));
    } catch {
      // sessionStorage unavailable — ignore
    }
  }, [isMaximized, maximizable, storageKey]);

  const titleBar = (
    <div className="flex items-center justify-between border-b border-[#1d1d1d] bg-[#111] px-4 py-2.5">
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
        <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
        <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
        <span className="ml-3 font-mono text-[12px] font-medium tracking-tight text-[#888]">
          {title}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {action}
        {maximizable && (
          <button
            onClick={() => setIsMaximized((prev) => !prev)}
            aria-label={isMaximized ? "Restaurar" : "Maximizar"}
            className="rounded-md p-1 text-[#888] transition-colors hover:bg-[#2a2a2a] hover:text-white"
          >
            {isMaximized ? (
              <Minimize2 size={16} />
            ) : (
              <Maximize2 size={16} />
            )}
          </button>
        )}
      </div>
    </div>
  );

  const body = (
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
  );

  // Maximised overlay: fixed fullscreen below sidebar (z-40 < z-50)
  if (isMaximized) {
    return (
      <div
        className="fixed inset-0 z-40 flex flex-col overflow-auto bg-[#0a0a0a] py-4 pr-4"
        style={{
          paddingLeft: "var(--sidebar-offset, 0px)",
          transition: "padding-left 300ms ease-in-out",
        }}
      >
        <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-[#222] bg-[#0a0a0a] shadow-2xl shadow-black/40">
          {titleBar}
          {body}
        </div>
      </div>
    );
  }

  return (
    <div className={`not-prose my-6 ${className}`}>
      <div className="overflow-hidden rounded-xl border border-[#222] bg-[#0a0a0a] shadow-2xl shadow-black/40">
        {titleBar}
        {body}
      </div>
    </div>
  );
}
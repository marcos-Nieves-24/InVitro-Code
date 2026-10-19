"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

export const ConsoleFrameContext = createContext(false);
export const useConsoleFrameMaximized = () => useContext(ConsoleFrameContext);

interface ConsoleFrameProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  /** When true, shows a maximize/minimize toggle in the title bar. */
  maximizable?: boolean;
  /** Unique sessionStorage key for persisting maximize state per console instance. */
  storageKey?: string;
  /** Controlled maximized state — when provided, ConsoleFrame is controlled by parent. */
  isMaximized?: boolean;
  onMaximizedChange?: (v: boolean) => void;
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
  isMaximized: controlledMaximized,
  onMaximizedChange,
}: ConsoleFrameProps) {
  const [internalMaximized, setInternalMaximized] = useState(false);
  const isControlled = controlledMaximized !== undefined;
  const isMaximized = isControlled ? controlledMaximized : internalMaximized;
  const setIsMaximized = (v: boolean | ((prev: boolean) => boolean)) => {
    const next = typeof v === "function" ? (v as (p: boolean) => boolean)(isMaximized) : v;
    if (isControlled) onMaximizedChange?.(next);
    else setInternalMaximized(next);
    if (storageKey) {
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(next));
        window.dispatchEvent(new Event("console-editor-toggle"));
      } catch {}
    }
  };

  // Restore maximize state from sessionStorage on mount (uncontrolled only)
  useEffect(() => {
    if (isControlled || !maximizable || !storageKey) return;
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored === "true") setInternalMaximized(true);
    } catch {
      // sessionStorage unavailable — ignore
    }
  }, [isControlled, maximizable, storageKey]);

  const titleBar = (
    <div className="flex items-center justify-between border-b border-[#1d1d1d] bg-[#111] px-4 py-2.5">
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
        <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
        <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
        <span className="ml-3 font-mono text-[12px] font-medium tracking-tight text-[#a0a0a0]">
          {title}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {action}
        {maximizable && (
          <button
            onClick={() => setIsMaximized((prev) => !prev)}
            aria-label={isMaximized ? "Restaurar" : "Maximizar"}
            className="rounded-md p-1 text-[#a0a0a0] transition-colors hover:bg-[#2a2a2a] hover:text-white"
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
    <div className={`relative bg-[#0a0a0a] ${isMaximized ? "flex-1 min-h-0 flex flex-col overflow-hidden" : ""}`}>
      <div className={isMaximized ? "flex-1 min-h-0 flex flex-col overflow-auto p-2 [&>div]:flex-1 [&>div]:min-h-0 [&>div]:flex [&>div]:flex-col" : ""}>
        {children}
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.15) 1px, rgba(255,255,255,0.15) 2px)",
        }}
      />
    </div>
  );

  // Maximised overlay: fixed fullscreen below sidebar (z-40 < z-50) — portaled to body to escape any transformed ancestor
  if (isMaximized) {
    const content = (
      <ConsoleFrameContext.Provider value={true}>
        <div
          className="fixed inset-0 z-40 flex flex-col bg-[#0a0a0a] p-4"
          style={{
            paddingLeft: "var(--sidebar-offset, 0px)",
            transition: "padding-left 300ms ease-in-out",
          }}
        >
          <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-[#222] bg-[#0a0a0a] shadow-2xl shadow-black/40 min-h-0">
            {titleBar}
            {body}
          </div>
        </div>
      </ConsoleFrameContext.Provider>
    );
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return typeof document !== "undefined" ? createPortal(content, document.body) : content;
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
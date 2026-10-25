"use client";

import { useState, useEffect, useRef } from "react";
import { X, Users, ChevronUp } from "lucide-react";
import type { SocialUser } from "@/domain/profile/social";

interface ConectaFloatingWidgetProps {
  suggested: SocialUser[];
  onConnect?: (userId: string) => void;
}

export function ConectaFloatingWidget({ suggested, onConnect }: ConectaFloatingWidgetProps) {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMobileOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Focus trap simple: focus first button when opened
  useEffect(() => {
    if (open && !mobileOpen) {
      const firstBtn = dialogRef.current?.querySelector("button");
      (firstBtn as HTMLElement | null)?.focus();
    }
  }, [open, mobileOpen]);

  if (!open && !mobileOpen) {
    return (
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-mint text-ink shadow-lg hover:bg-fog focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2"
        aria-label="Abrir Conecta"
      >
        <Users className="h-6 w-6" />
      </button>
    );
  }

  return (
    <>
      {/* Desktop floating card */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="false"
        aria-label="Conecta - usuarios sugeridos"
        className="fixed bottom-6 right-6 z-50 hidden w-[317px] rounded-card border border-surface-raised bg-surface-card p-4 shadow-xl md:block"
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink">Conecta</h3>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded p-1 text-storm hover:bg-surface hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint"
              aria-label="Minimizar"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded p-1 text-storm hover:bg-surface hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {suggested.slice(0, 4).map((u) => {
            const initials = u.username.slice(0, 2).toUpperCase();
            return (
              <div key={u.id} className="flex items-center gap-3 rounded-btn bg-surface px-3 py-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fog text-[10px] font-bold text-ink">
                  {initials}
                </div>
                <span className="flex-1 truncate text-sm font-medium text-ink">{u.username}</span>
                <button
                  type="button"
                  onClick={() => onConnect?.(u.id)}
                  className="shrink-0 rounded-btn bg-mint px-3 py-1 text-xs font-semibold text-ink hover:bg-fog focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint"
                >
                  Conectar
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: FAB + drawer */}
      <button
        type="button"
        onClick={() => setMobileOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-mint text-ink shadow-lg hover:bg-fog focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 md:hidden"
        aria-label={mobileOpen ? "Cerrar Conecta" : "Abrir Conecta"}
        aria-expanded={mobileOpen}
      >
        {mobileOpen ? <X className="h-6 w-6" /> : <Users className="h-6 w-6" />}
      </button>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Conecta - usuarios sugeridos"
            className="fixed inset-x-0 bottom-0 z-50 max-h-[70vh] overflow-y-auto rounded-t-card border-t border-surface-raised bg-surface-card p-4 shadow-xl md:hidden"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink">Conecta</h3>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded p-1 text-storm hover:bg-surface hover:text-ink"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {suggested.slice(0, 4).map((u) => {
                const initials = u.username.slice(0, 2).toUpperCase();
                return (
                  <div key={u.id} className="flex items-center gap-3 rounded-btn bg-surface px-3 py-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fog text-[10px] font-bold text-ink">
                      {initials}
                    </div>
                    <span className="flex-1 truncate text-sm font-medium text-ink">{u.username}</span>
                    <button
                      type="button"
                      onClick={() => onConnect?.(u.id)}
                      className="shrink-0 rounded-btn bg-mint px-3 py-1 text-xs font-semibold text-ink hover:bg-fog"
                    >
                      Conectar
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}

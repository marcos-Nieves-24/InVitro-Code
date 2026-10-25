"use client";

import { useEffect, useRef, useState } from "react";
import { X, ChevronUp } from "lucide-react";
import type { SocialUser } from "@/domain/profile/social";

interface ConectaFloatingWidgetProps {
  suggested: SocialUser[];
  isOpen: boolean;
  onClose: () => void;
  onConnect?: (userId: string) => void;
}

export function ConectaFloatingWidget({ suggested, isOpen, onClose, onConnect }: ConectaFloatingWidgetProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  // ESC to close
  useEffect(() => {
    if (!isOpen && !mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, mobileOpen, onClose]);

  // Focus first button when opened (desktop)
  useEffect(() => {
    if (isOpen && !mobileOpen) {
      const firstBtn = dialogRef.current?.querySelector("button");
      (firstBtn as HTMLElement | null)?.focus();
    }
  }, [isOpen, mobileOpen]);

  // Sync mobile with isOpen: when isOpen true, also open mobile drawer on small screens
  useEffect(() => {
    if (isOpen) setMobileOpen(true);
    else setMobileOpen(false);
  }, [isOpen]);

  if (!isOpen && !mobileOpen) return null;

  return (
    <>
      {/* Desktop floating card — controlled by isOpen */}
      {isOpen && (
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
                onClick={onClose}
                className="rounded p-1 text-storm hover:bg-surface hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint"
                aria-label="Minimizar"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
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
      )}

      {/* Mobile drawer — also controlled by isOpen */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
            onClick={() => {
              setMobileOpen(false);
              onClose();
            }}
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
                onClick={() => {
                  setMobileOpen(false);
                  onClose();
                }}
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

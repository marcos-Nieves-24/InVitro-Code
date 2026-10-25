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
      {/* Desktop floating card — controlled by isOpen, amplificado y despliega hacia arriba */}
      {isOpen && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="false"
          aria-label="Conecta - usuarios sugeridos"
          className="fixed bottom-24 right-6 z-50 hidden max-h-[520px] w-[420px] overflow-y-auto rounded-card border border-surface-raised bg-surface-card p-6 shadow-2xl md:block animate-in slide-in-from-bottom-2 duration-200"
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
              return <ConectaUserRow key={u.id} user={u} onConnect={onConnect} />;
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
                return <ConectaUserRow key={u.id} user={u} onConnect={onConnect} />;
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}

function ConectaUserRow({ user, onConnect }: { user: SocialUser; onConnect?: (id: string) => void }) {
  const [status, setStatus] = useState<"idle" | "pending" | "sent" | "friends">("idle");
  const [loading, setLoading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const initials = user.username.slice(0, 2).toUpperCase();
  const showImg = !!user.avatar_url && !imgError;

  const handleConnect = async () => {
    if (onConnect) {
      onConnect(user.id);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/friend-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: user.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      setStatus("sent");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error";
      if (msg.includes("Ya enviaste")) setStatus("pending");
      else alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-btn bg-surface px-3 py-2">
      {showImg ? (
        <img
          src={user.avatar_url!}
          alt={user.username}
          className="h-8 w-8 shrink-0 rounded-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fog text-[10px] font-bold text-ink">
          {initials}
        </div>
      )}
      <span className="flex-1 truncate text-sm font-medium text-ink">{user.username}</span>
      {status === "sent" || status === "pending" ? (
        <span className="shrink-0 rounded-btn bg-surface px-3 py-1 text-xs font-semibold text-storm">Enviada</span>
      ) : status === "friends" ? (
        <span className="shrink-0 rounded-btn bg-fog px-3 py-1 text-xs font-semibold text-ink">Amigos</span>
      ) : (
        <button
          type="button"
          onClick={handleConnect}
          disabled={loading}
          className="shrink-0 rounded-btn bg-mint px-3 py-1 text-xs font-semibold text-ink hover:bg-fog focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint disabled:opacity-50"
        >
          {loading ? "..." : "Conectar"}
        </button>
      )}
    </div>
  );
}

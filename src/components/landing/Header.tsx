"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { UserAvatar, UserAvatarPlaceholder } from "@/components/ui/UserAvatar";
import { useAvatar } from "@/lib/avatar/AvatarContext";

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Mision", href: "#mision" },
  { label: "Modulos", href: "#modulos" },
  { label: "Equipo", href: "#equipo" },
  { label: "Contacto", href: "#contacto" },
];

interface HeaderUser {
  name: string;
  imageUrl?: string | null;
}

export function Header({ user }: { user?: HeaderUser | null }) {
  const [scrolled, setScrolled] = useState(false);
  const { avatarUrl: contextAvatarUrl, isLoading: avatarLoading } = useAvatar();

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isAuthed = !!user;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 header-bg ${
        scrolled
          ? "bg-surface-card/95 shadow-sm backdrop-blur-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-negativo.svg"
            alt="InVitro-Code"
            className={`h-8 w-8 ${scrolled ? "" : "brightness-0 invert"}`}
          />
          <span
            className={`font-display text-lg font-bold ${
              scrolled ? "text-ink" : "text-white"
            }`}
          >
            InVitro-Code
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                scrolled
                  ? "text-slate hover:text-ink"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
          {isAuthed ? (
            <div className="flex items-center gap-3">
              <a
                href="/dashboard"
                className={`text-sm font-medium transition-colors ${
                  scrolled ? "text-ink hover:text-brand-600" : "text-white hover:text-mint"
                }`}
              >
                Dashboard
              </a>
              <a
                href="/perfil"
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm transition-colors hover:bg-white/20"
                title={user!.name}
              >
                {avatarLoading ? (
                  <UserAvatarPlaceholder size="sm" className="h-6 w-6" />
                ) : (
                  <UserAvatar
                    username={user!.name}
                    avatarUrl={contextAvatarUrl ?? user!.imageUrl ?? null}
                    size="sm"
                    className="h-6 w-6"
                  />
                )}
                <span
                  className={`max-w-[120px] truncate text-sm font-medium ${
                    scrolled ? "text-ink" : "text-white"
                  }`}
                >
                  {user!.name}
                </span>
              </a>
            </div>
          ) : (
            <a
              href="/sign-up"
              className="rounded-[10px] bg-mint px-5 py-2.5 text-sm font-medium text-ink transition-all hover:shadow-glow"
            >
              Comenzar
            </a>
          )}
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="landing-mobile-nav"
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors md:hidden ${
            scrolled ? "text-ink hover:bg-surface-raised" : "text-white hover:bg-white/10"
          }`}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <nav
          id="landing-mobile-nav"
          aria-label="Navegación móvil"
          className={`mx-4 mb-4 rounded-2xl border p-2 shadow-xl md:hidden ${
            scrolled
              ? "border-surface-raised bg-surface-card/95 backdrop-blur-sm"
              : "border-white/10 bg-[#111439]/95 backdrop-blur-sm"
          }`}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                scrolled
                  ? "text-slate hover:bg-surface-raised hover:text-ink"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
          {isAuthed ? (
            <a
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="mt-1 block rounded-xl bg-mint px-4 py-3 text-center text-base font-semibold text-ink"
            >
              Ir al Dashboard
            </a>
          ) : (
            <a
              href="/sign-up"
              onClick={() => setMobileOpen(false)}
              className="mt-1 block rounded-xl bg-mint px-4 py-3 text-center text-base font-semibold text-ink"
            >
              Comenzar
            </a>
          )}
        </nav>
      )}
    </header>
  );
}

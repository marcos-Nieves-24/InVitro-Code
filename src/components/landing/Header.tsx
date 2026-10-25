"use client";

import { useEffect, useState } from "react";

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
                {user!.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user!.imageUrl}
                    alt={user!.name}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mint text-xs font-bold text-ink">
                    {user!.name.charAt(0).toUpperCase()}
                  </span>
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
      </div>
    </header>
  );
}

"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useClerk } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Flame, LogOut, Menu, Search, X } from "lucide-react";
import Link from "next/link";

interface InVitroShellProps {
  children: ReactNode;
  userName?: string;
  userMeta?: string;
  userRole?: string | null;
  topBar?: ReactNode;
  theme?: string | null;
  hud?: ReactNode;
  currentStreak?: number;
}

export function InVitroShell({
  children,
  userName,
  topBar,
  theme,
  hud,
  currentStreak,
}: InVitroShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { signOut } = useClerk();

  useEffect(() => {
    if (!theme) return;
    document.documentElement.classList.remove("light", "dark");
    if (theme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.add(prefersDark ? "dark" : "light");
    } else {
      document.documentElement.classList.add(theme);
    }
  }, [theme]);

  const initials = userName
    ?.split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase() ?? "?";

  const pathname = usePathname();
  const HEADER_SECTIONS = [
    { label: "Expediciones", href: "/learn" },
    { label: "Laboratorios", href: "/laboratorios" },
    { label: "Proyectos", href: "/proyectos" },
    { label: "Misiones", href: "/niveles" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Logros", href: "/logros" },
    { label: "Comunidad", href: "/comunidad" },
  ] as const;

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/") || false;

  return (
    <div className="min-h-screen bg-surface text-ink">
      <header className="sticky top-0 z-50 border-b border-surface-raised bg-surface/80 backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between gap-4 px-4 md:px-8">
          {/* Left: Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/" className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-negativo.svg" alt="InVitro-Code" className="h-8 w-8" />
              <span className="font-display text-lg font-bold hidden sm:inline">InVitro-Code</span>
            </Link>
          </div>

          {/* Center: Secciones ocupando el div del header */}
          <nav
            className="hidden flex-1 items-center justify-center gap-1 lg:flex"
            aria-label="Secciones"
          >
            {HEADER_SECTIONS.map((s) => {
              const active = isActive(s.href);
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-surface-raised text-ink"
                      : "text-storm hover:bg-surface-raised/70 hover:text-ink"
                  }`}
                >
                  {s.label}
                  {active && (
                    <span className="absolute -bottom-[9px] left-1/2 h-[2px] w-6 -translate-x-1/2 rounded-full bg-brand-500" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Search + Streak + User info + Logout */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
              className="hidden sm:flex items-center gap-2 rounded-full border border-surface-raised bg-surface px-3 py-1.5 text-xs font-medium text-storm hover:bg-surface-raised hover:text-ink transition-colors"
              aria-label="Buscar (⌘K)"
              title="Buscar (⌘K)"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">Buscar</span>
              <kbd className="hidden lg:inline rounded bg-surface-raised px-1 py-0.5 text-[10px]">⌘K</kbd>
            </button>
            {currentStreak !== undefined && (
              <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-surface-raised px-3 py-1 text-xs font-bold text-ink">
                <Flame className="h-3.5 w-3.5 text-[var(--color-error)]" />
                {currentStreak} días
              </div>
            )}
            <Link href="/perfil" className="hidden sm:flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors hover:bg-surface-raised">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-mint text-xs font-bold text-ink">
                {initials}
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-bold text-ink">{userName}</p>
              </div>
            </Link>
            <button
              onClick={() => signOut()}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-storm transition-colors hover:bg-red-500/10 hover:text-red-500"
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-storm md:hidden"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div id="mobile-nav" className="border-t border-surface-raised px-4 py-3 md:hidden">
            {currentStreak !== undefined && (
              <div className="mb-3 flex items-center gap-1.5 rounded-full bg-surface-raised px-3 py-1.5 text-xs font-bold text-ink w-fit">
                <Flame className="h-3.5 w-3.5 text-[var(--color-error)]" />
                {currentStreak} días de racha
              </div>
            )}
            <nav className="flex flex-col gap-2">
              <Link href="/" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-surface-raised" onClick={() => setMobileMenuOpen(false)}>Inicio</Link>
              <Link href="/learn" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-surface-raised" onClick={() => setMobileMenuOpen(false)}>Expediciones</Link>
              <Link href="/laboratorios" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-surface-raised" onClick={() => setMobileMenuOpen(false)}>Laboratorios</Link>
              <Link href="/proyectos" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-surface-raised" onClick={() => setMobileMenuOpen(false)}>Proyectos</Link>
              <Link href="/niveles" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-surface-raised" onClick={() => setMobileMenuOpen(false)}>Misiones</Link>
              <Link href="/dashboard" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-surface-raised" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
              <Link href="/logros" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-surface-raised" onClick={() => setMobileMenuOpen(false)}>Logros</Link>
              <Link href="/comunidad" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-surface-raised" onClick={() => setMobileMenuOpen(false)}>Comunidad</Link>
              <Link href="/perfil" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-surface-raised" onClick={() => setMobileMenuOpen(false)}>Perfil</Link>
              <Link href="/configuracion" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-surface-raised" onClick={() => setMobileMenuOpen(false)}>Configuración</Link>
            </nav>
          </div>
        )}
      </header>

      {hud && (
        <div className="hud-bar sticky top-14 z-40 border-b border-[var(--color-hud-border)] bg-[var(--color-hud-bg)] backdrop-blur-xl">
          {hud}
        </div>
      )}

      <main id="main-content" className="min-h-[calc(100vh-56px)]">
        {topBar && <div className="sticky top-14 z-40">{topBar}</div>}
        {children}
      </main>
    </div>
  );
}

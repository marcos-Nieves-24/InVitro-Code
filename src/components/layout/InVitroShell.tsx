"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useClerk } from "@clerk/nextjs";
import { LogOut, Search, Menu, X } from "lucide-react";
import Link from "next/link";
import { CommandPalette } from "./CommandPalette";

interface InVitroShellProps {
  children: ReactNode;
  userName?: string;
  userMeta?: string;
  userRole?: string | null;
  topBar?: ReactNode;
  theme?: string | null;
}

export function InVitroShell({
  children,
  userName,
  userMeta,
  topBar,
  theme,
}: InVitroShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { signOut } = useClerk();

  // Apply theme to html element
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

  return (
    <div className="min-h-screen bg-surface text-ink">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-surface-raised bg-surface/80 backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between px-4 md:px-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-negativo.svg" alt="InVitro-Code" className="h-8 w-8" />
              <span className="font-display text-lg font-bold hidden sm:inline">InVitro-Code</span>
            </Link>
          </div>

          {/* Center: Search trigger */}
          <button
            onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }))}
            className="flex items-center gap-2 rounded-lg border border-surface-raised bg-surface-card px-4 py-2 text-sm text-storm transition-colors hover:bg-surface-raised"
          >
            <Search className="h-4 w-4" />
            <span className="hidden md:inline">Buscar...</span>
            <kbd className="hidden rounded border border-surface-raised bg-surface px-1.5 py-0.5 text-[10px] font-medium md:inline">Ctrl+K</kbd>
          </button>

          {/* Right: User info */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-mint text-xs font-bold text-ink">
                {initials}
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-bold text-ink">{userName}</p>
                <p className="text-[10px] text-storm">{userMeta}</p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-storm transition-colors hover:bg-red-500/10 hover:text-red-500"
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-storm md:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-surface-raised px-4 py-3 md:hidden">
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

      {/* Main content — full width, no sidebar */}
      <main id="main-content" className="min-h-[calc(100vh-56px)]">
        {topBar && <div className="sticky top-14 z-40">{topBar}</div>}
        {children}
      </main>

      <CommandPalette />
    </div>
  );
}

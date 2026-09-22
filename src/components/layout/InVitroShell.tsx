"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useClerk } from "@clerk/nextjs";
import { LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { SectionsDropdown } from "./SectionsDropdown";

interface InVitroShellProps {
  children: ReactNode;
  userName?: string;
  userMeta?: string;
  userRole?: string | null;
  topBar?: ReactNode;
  theme?: string | null;
  hud?: ReactNode;
}

export function InVitroShell({
  children,
  userName,
  topBar,
  theme,
  hud,
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

  return (
    <div className="min-h-screen bg-surface text-ink">
      <header className="sticky top-0 z-50 border-b border-surface-raised bg-surface/80 backdrop-blur-xl">
        <div className="flex h-14 items-center justify-between px-4 md:px-8">
          {/* Left: Logo + Sections dropdown */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 mr-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-negativo.svg" alt="InVitro-Code" className="h-8 w-8" />
              <span className="font-display text-lg font-bold hidden sm:inline">InVitro-Code</span>
            </Link>
            <SectionsDropdown />
          </div>

          {/* Right: User info + Logout */}
          <div className="flex items-center gap-3">
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
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

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

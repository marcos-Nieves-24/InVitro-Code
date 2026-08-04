"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  Compass,
  FlaskConical,
  Landmark,
  ClipboardList,
  BarChart3,
  Trophy,
  Users,
  Menu,
  X,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Inicio", href: "/", icon: Boxes },
  { label: "Expediciones", href: "/learn", icon: Compass },
  { label: "Laboratorios", href: "/laboratorios", icon: FlaskConical },
  { label: "Proyectos", href: "/proyectos", icon: Landmark },
  { label: "Misiones", href: "/niveles", icon: ClipboardList },
  { label: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { label: "Logros", href: "/logros", icon: Trophy },
  { label: "Comunidad", href: "/comunidad", icon: Users },
];

interface AppSidebarProps {
  userName?: string;
  userMeta?: string;
}

export function AppSidebar({
  userName = "Investigador InVitro-Code",
  userMeta = "Nivel 4 · Investigador",
}: AppSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const initials = userName
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-4 top-4 z-[60] flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant bg-white text-on-surface shadow-sm transition-colors hover:bg-surface-container md:hidden"
        aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
        type="button"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-deep-navy/30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar HUD */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col gap-8 border-r border-outline-variant bg-surface px-6 py-8 transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-on-primary">
            <Boxes className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none tracking-tight text-on-surface">
              InVitro-Code
            </h1>
            <p className="text-xs font-medium text-on-surface-variant">
              AI LEARNING
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-grow flex-col gap-2">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${
                  active
                    ? "bg-primary-fixed font-semibold text-primary"
                    : "text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User card */}
        <div className="mt-auto flex flex-col gap-4 border-t border-outline-variant pt-6">
          <div className="glass-card flex items-center gap-3 rounded-xl p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-container text-sm font-bold text-on-secondary">
              {initials}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-bold text-primary">{userMeta}</span>
              <span className="truncate text-sm font-semibold text-on-surface">
                {userName}
              </span>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 rounded-lg border border-primary py-2 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-on-primary"
          >
            Ver perfil <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </aside>
    </>
  );
}

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
  ChevronLeft,
  ChevronRight,
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
  collapsed?: boolean;
  onToggle?: () => void;
}

export function AppSidebar({
  userName = "Investigador",
  userMeta = "Investigador",
  collapsed = false,
  onToggle,
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
        className="fixed left-4 top-4 z-[60] flex h-10 w-10 items-center justify-center rounded-xl border border-surface-raised bg-surface-card text-ink shadow-sm transition-colors hover:bg-surface-raised md:hidden"
        aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
        type="button"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-graphite/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar HUD */}
      <aside
        aria-label="Navegación principal"
        className={`fixed inset-y-0 left-0 z-50 flex flex-col gap-8 border-r border-surface-raised bg-graphite py-8 transition-[width,transform] duration-300 ${
          collapsed ? "md:w-[72px] md:px-2" : "md:w-[280px] md:px-6"
        } ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Logo + desktop collapse toggle */}
        <div
          className={`flex items-center ${
            collapsed ? "md:flex-col md:gap-3" : "justify-between"
          }`}
        >
          <div
            className={`flex items-center gap-3 ${collapsed ? "md:mx-auto" : ""}`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint text-ink">
              <Boxes className="h-5 w-5" aria-hidden="true" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold leading-none tracking-tight text-ink">
                  InVitro-Code
                </h1>
                <p className="text-xs font-medium text-storm">
                  AI LEARNING
                </p>
              </div>
            )}
          </div>

          {/* Desktop-only collapse toggle */}
          {onToggle && (
            <button
              onClick={onToggle}
              className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full border border-surface-raised bg-surface-raised text-storm transition-colors hover:bg-surface-card hover:text-ink md:flex"
              aria-label={collapsed ? "Expandir navegación" : "Colapsar navegación"}
              type="button"
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex flex-grow flex-col gap-2" aria-label="Navegación de módulos">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 rounded-xl py-3 text-sm transition-colors ${
                  collapsed ? "md:justify-center md:px-0" : "px-4"
                } ${
                  active
                    ? "bg-mint/30 font-semibold text-ink"
                    : "text-storm hover:bg-surface-raised"
                }`}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User card */}
        <div className="mt-auto flex flex-col gap-4 border-t border-surface-raised pt-6">
          <div
            className={`glass-card flex items-center gap-3 rounded-xl p-4 ${
              collapsed ? "md:justify-center md:p-2" : ""
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fog text-sm font-bold text-ink">
              {initials}
            </div>
            {!collapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-bold text-mint">{userMeta}</span>
                <span className="truncate text-sm font-semibold text-ink">
                  {userName}
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
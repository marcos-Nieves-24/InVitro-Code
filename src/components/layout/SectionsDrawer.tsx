"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Compass, FlaskConical, Landmark, ClipboardList, BarChart3, Trophy, Users, Settings, Home } from "lucide-react";
import Link from "next/link";

interface Section {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  category: string;
}

const SECTIONS: Section[] = [
  { id: "hero", title: "Inicio", description: "Bienvenida y progreso rápido", href: "/", icon: Home, category: "Principal" },
  { id: "learn", title: "Expediciones", description: "Explorar cursos y lecciones", href: "/learn", icon: Compass, category: "Aprender" },
  { id: "labs", title: "Laboratorios", description: "Ejecutar código en entornos interactivos", href: "/laboratorios", icon: FlaskConical, category: "Aprender" },
  { id: "projects", title: "Proyectos", description: "Aplicar conocimientos en proyectos reales", href: "/proyectos", icon: Landmark, category: "Aprender" },
  { id: "missions", title: "Misiones", description: "Completar objetivos y ganar XP", href: "/niveles", icon: ClipboardList, category: "Progreso" },
  { id: "dashboard", title: "Dashboard", description: "Ver estadísticas y progreso general", href: "/dashboard", icon: BarChart3, category: "Progreso" },
  { id: "achievements", title: "Logros", description: "Desbloquear insignias y reconocimientos", href: "/logros", icon: Trophy, category: "Progreso" },
  { id: "community", title: "Comunidad", description: "Conectar con otros investigadores", href: "/comunidad", icon: Users, category: "Social" },
  { id: "settings", title: "Configuración", description: "Ajustar preferencias de la cuenta", href: "/configuracion", icon: Settings, category: "Cuenta" },
];

export function SectionsDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const categories = [...new Set(SECTIONS.map(s => s.category))];

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-surface-raised bg-surface-card px-4 py-2 text-sm text-storm transition-colors hover:bg-surface-raised"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span className="hidden md:inline">Secciones</span>
        <kbd className="hidden rounded border border-surface-raised bg-surface px-1.5 py-0.5 text-[10px] font-medium md:inline">Ctrl+K</kbd>
      </button>

      {/* Drawer overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={shouldReduceMotion ? false : { x: "-100%" }}
              animate={{ x: 0 }}
              exit={shouldReduceMotion ? undefined : { x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-[70] w-80 bg-surface shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-surface-raised px-6 py-4">
                <h2 className="font-display text-lg font-bold">Secciones</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-storm transition-colors hover:bg-surface-raised"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Sections list */}
              <nav className="overflow-y-auto p-4" style={{ height: "calc(100vh - 64px)" }}>
                {categories.map(category => (
                  <div key={category} className="mb-6">
                    <h3 className="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-storm/60">
                      {category}
                    </h3>
                    <div className="space-y-1">
                      {SECTIONS.filter(s => s.category === category).map(section => {
                        const Icon = section.icon;
                        const isAnchor = section.href.startsWith("#");
                        return isAnchor ? (
                          <a
                            key={section.id}
                            href={section.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface-raised"
                          >
                            <Icon className="h-5 w-5 shrink-0 text-storm" />
                            <div>
                              <p>{section.title}</p>
                              <p className="text-xs text-storm">{section.description}</p>
                            </div>
                          </a>
                        ) : (
                          <Link
                            key={section.id}
                            href={section.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface-raised"
                          >
                            <Icon className="h-5 w-5 shrink-0 text-storm" />
                            <div>
                              <p>{section.title}</p>
                              <p className="text-xs text-storm">{section.description}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Search,
  Compass,
  FlaskConical,
  Landmark,
  ClipboardList,
  BarChart3,
  Trophy,
  Users,
  Settings,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  category: string;
}

const ALL_ITEMS: SearchResult[] = [
  { id: "learn", title: "Expediciones", description: "Explorar cursos y lecciones", href: "/learn", icon: Compass, category: "Módulos" },
  { id: "labs", title: "Laboratorios", description: "Ejecutar código en entornos interactivos", href: "/laboratorios", icon: FlaskConical, category: "Módulos" },
  { id: "projects", title: "Proyectos", description: "Aplicar conocimientos en proyectos reales", href: "/proyectos", icon: Landmark, category: "Módulos" },
  { id: "missions", title: "Misiones", description: "Completar objetivos y ganar XP", href: "/niveles", icon: ClipboardList, category: "Progreso" },
  { id: "dashboard", title: "Dashboard", description: "Ver estadísticas y progreso general", href: "/dashboard", icon: BarChart3, category: "Progreso" },
  { id: "achievements", title: "Logros", description: "Desbloquear insignias y reconocimientos", href: "/logros", icon: Trophy, category: "Progreso" },
  { id: "community", title: "Comunidad", description: "Conectar con otros investigadores", href: "/comunidad", icon: Users, category: "Social" },
  { id: "settings", title: "Configuración", description: "Ajustar preferencias de la cuenta", href: "/configuracion", icon: Settings, category: "Cuenta" },
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const filtered = query
    ? ALL_ITEMS.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
      )
    : ALL_ITEMS;

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

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[activeIndex]) {
      window.location.href = filtered[activeIndex].href;
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 pt-[20vh] backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="w-full max-w-[640px] overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-surface-raised)] bg-[var(--color-surface-card)] shadow-[0_25px_60px_-12px_rgba(0,0,0,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-surface-raised px-4">
              <Search className="h-5 w-5 text-storm" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Buscar módulos, cursos, configuración..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent px-6 py-4 text-base text-[var(--color-ink)] placeholder:text-[var(--color-storm)] outline-none"
              />
              <kbd className="hidden rounded-md border border-surface-raised bg-surface px-2 py-1 text-xs text-storm md:inline">
                ESC
              </kbd>
            </div>

            <div className="max-h-[320px] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="p-6 text-center text-storm">
                  <p className="font-medium">Sin resultados</p>
                  <p className="mt-1 text-sm">Intenta con otros términos</p>
                </div>
              ) : (
                filtered.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] px-4 py-3 transition-colors hover:bg-[var(--color-surface-raised)] ${index === activeIndex ? "bg-[rgba(0,178,178,0.1)] text-[var(--color-mint)]" : ""}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-storm">{item.description}</p>
                      </div>
                      <span className="text-xs text-storm">{item.category}</span>
                      <ArrowRight className="h-4 w-4 text-storm" />
                    </Link>
                  );
                })
              )}
            </div>

            <div className="border-t border-surface-raised px-4 py-3 text-xs text-storm">
              <span className="font-medium">Ctrl+K</span> para abrir •{" "}
              <span className="font-medium">↑↓</span> navegar •{" "}
              <span className="font-medium">Enter</span> seleccionar
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

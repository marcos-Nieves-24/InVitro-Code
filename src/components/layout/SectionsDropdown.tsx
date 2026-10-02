"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Compass, FlaskConical, Landmark, ClipboardList, BarChart3, Trophy, Users, Settings, Home, ChevronDown } from "lucide-react";
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

export function SectionsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = [...new Set(SECTIONS.map(s => s.category))];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-raised"
      >
        Secciones
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 z-50 mt-1 w-72 rounded-xl border border-surface-raised bg-surface-card shadow-xl"
            onMouseLeave={() => setIsOpen(false)}
          >
            <div className="p-2">
              {categories.map(category => (
                <div key={category} className="mb-2 last:mb-0">
                  <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-storm/50">
                    {category}
                  </p>
                  {SECTIONS.filter(s => s.category === category).map(section => {
                    const Icon = section.icon;
                    const isAnchor = section.href.startsWith("#");
                    return isAnchor ? (
                      <a
                        key={section.id}
                        href={section.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink transition-colors hover:bg-surface-raised"
                      >
                        <Icon className="h-4 w-4 shrink-0 text-storm" />
                        <span>{section.title}</span>
                      </a>
                    ) : (
                      <Link
                        key={section.id}
                        href={section.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink transition-colors hover:bg-surface-raised"
                      >
                        <Icon className="h-4 w-4 shrink-0 text-storm" />
                        <span>{section.title}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

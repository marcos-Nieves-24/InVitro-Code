"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface NavSection {
  id: string;
  label: string;
}

const SECTIONS: NavSection[] = [
  { id: "hero", label: "Inicio" },
  { id: "stats", label: "Estadísticas" },
  { id: "mission", label: "Misión" },
  { id: "modules", label: "Módulos" },
  { id: "ranking", label: "Ranking" },
];

export function FloatingNav() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isVisible, setIsVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-100px 0px -50% 0px" }
    );

    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/20 bg-white/10 px-6 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-[20px] transition-all hover:bg-white/15"
          aria-label="Navegación de secciones"
        >
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all hover:bg-white/10 hover:text-white ${activeSection === section.id ? "bg-[var(--color-mint)] font-semibold text-[var(--color-ink)]" : "text-white/70"}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(section.id)?.scrollIntoView({
                  behavior: shouldReduceMotion ? "auto" : "smooth",
                });
              }}
            >
              {section.label}
            </a>
          ))}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

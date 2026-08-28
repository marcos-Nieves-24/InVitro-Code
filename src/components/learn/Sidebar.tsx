"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react";

interface Lesson {
  slug: string;
  title: string;
}

interface ModuleEntry {
  slug: string;
  name: string;
  lessons: Lesson[];
}

export function Sidebar({ modules }: { modules: ModuleEntry[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const pathname = usePathname();

  // Set --sidebar-offset on documentElement for ConsoleFrame overlay
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const update = () => {
      document.documentElement.style.setProperty(
        "--sidebar-offset",
        mql.matches ? (desktopCollapsed ? "0px" : "256px") : "0px"
      );
    };
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [desktopCollapsed]);

  // Extract current module and lesson from path: /learn/{module}/{lesson}
  const pathParts = pathname.split("/").filter(Boolean);
  const currentModule = pathParts[1] === "learn" ? pathParts[2] : undefined;
  const currentLesson = pathParts[1] === "learn" ? pathParts[3] : undefined;

  const isActive = (modSlug: string, lessonSlug: string) =>
    currentModule === modSlug && currentLesson === lessonSlug;

  const isModuleActive = (modSlug: string) => currentModule === modSlug;

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-btn border border-gray-200 bg-surface-card shadow-sm transition-colors hover:bg-gray-50 lg:hidden"
        aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
        type="button"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop collapse toggle */}
      <button
        onClick={() => setDesktopCollapsed(!desktopCollapsed)}
        className="fixed top-1/2 z-[60] hidden h-8 w-5 -translate-y-1/2 items-center justify-center rounded-r-md border border-l-0 border-gray-200 bg-surface-card text-gray-400 shadow-sm transition-all hover:bg-gray-50 hover:text-storm lg:flex"
        aria-label={desktopCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        type="button"
        style={{ left: desktopCollapsed ? 0 : "16rem" }}
      >
        {desktopCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 shrink-0 overflow-y-auto border-r border-gray-200 bg-surface-card
          transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          ${desktopCollapsed ? "lg:w-0 lg:overflow-hidden lg:border-r-0" : "lg:w-64"}
        `}
        aria-label="Lecciones"
      >
        <div className="p-4 pt-16 lg:pt-4">
          <div className="mb-6">
            <Link
              href="/"
              className="font-display text-base font-semibold tracking-tight text-ink hover:text-mint"
            >
              InVitro-Code
            </Link>
            <Link
              href="/dashboard"
              className="mt-2 block text-sm text-mint hover:underline"
            >
              ← Dashboard
            </Link>
          </div>

          <h2 className="eyebrow mb-4">Módulos</h2>

          <nav aria-label="Módulos">
            {modules.length === 0 && (
              <p className="text-sm text-storm">
                No hay módulos disponibles aún.
              </p>
            )}

            {modules.map((mod) => (
              <div key={mod.slug} className="mb-4">
                <h3
                  className={`mb-2 font-display text-sm font-semibold tracking-tight ${
                    isModuleActive(mod.slug)
                      ? "text-mint"
                      : "text-graphite"
                  }`}
                >
                  {mod.name}
                </h3>
                <ul className="ml-1 space-y-0.5">
                  {mod.lessons.map((lesson) => {
                    const active = isActive(mod.slug, lesson.slug);
                    return (
                      <li key={lesson.slug}>
                        <Link
                          href={`/learn/${mod.slug}/${lesson.slug}`}
                          onClick={() => setMobileOpen(false)}
                          className={`block rounded-btn px-2 py-1.5 text-sm transition-colors ${
                            active
                              ? "bg-mint/10 font-medium text-mint"
                              : "text-storm hover:bg-mint/15 hover:text-mint"
                          }`}
                        >
                          {lesson.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}

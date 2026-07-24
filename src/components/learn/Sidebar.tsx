"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

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
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── Toggle button (mobile) ─────────────── */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-md ring-1 ring-gray-200 transition-colors hover:bg-gray-50 lg:hidden"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* ── Backdrop (mobile) ──────────────────── */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Sidebar ────────────────────────────── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 shrink-0 overflow-y-auto bg-white shadow-md
          transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-4 pt-16 lg:pt-4">
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="text-sm text-blue-600 hover:underline"
            >
              ← Dashboard
            </Link>
          </div>

          <h2 className="mb-4 text-xl font-bold text-gray-800">Módulos</h2>

          <nav>
            {modules.length === 0 && (
              <p className="text-sm text-gray-500">
                No hay módulos disponibles aún.
              </p>
            )}

            {modules.map((mod) => (
              <div key={mod.slug} className="mb-4">
                <h3 className="mb-2 text-sm font-semibold text-gray-700">
                  {mod.name}
                </h3>
                <ul className="ml-2 space-y-1">
                  {mod.lessons.map((lesson) => (
                    <li key={lesson.slug}>
                      <Link
                        href={`/learn/${mod.slug}/${lesson.slug}`}
                        onClick={() => setOpen(false)}
                        className="block rounded px-2 py-1 text-sm text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
                      >
                        {lesson.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}

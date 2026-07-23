"use client";

import { useState } from "react";
import Link from "next/link";

interface LessonCarouselProps {
  header: React.ReactNode;
  slides: React.ReactNode[];
  nextLessonHref?: string;
}

export function LessonCarousel({
  header,
  slides,
  nextLessonHref,
}: LessonCarouselProps) {
  const total = slides.length + 1; // header + sections
  const [current, setCurrent] = useState(0);
  const isHeader = current === 0;
  const isLast = current === total - 1;
  const sectionIndex = current - 1; // slides index when not header

  return (
    <div className="flex min-h-[70vh] flex-col">
      {/* ── Progress bar ──────────────────────────────── */}
      <div className="mb-8 flex gap-1.5">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= current ? "bg-blue-600" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* ── Content ───────────────────────────────────── */}
      <div className="flex-1">
        {isHeader ? header : slides[sectionIndex]}
      </div>

      {/* ── Navigation ────────────────────────────────── */}
      <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
        <button
          onClick={() => setCurrent((c) => c - 1)}
          disabled={current === 0}
          className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-30"
        >
          ← Anterior
        </button>

        <span className="font-mono text-xs text-gray-400">
          {current + 1} / {total}
        </span>

        {isLast ? (
          <div className="flex gap-3">
            <Link
              href="/"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              Volver al inicio
            </Link>
            {nextLessonHref && (
              <Link
                href={nextLessonHref}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Siguiente lección →
              </Link>
            )}
          </div>
        ) : (
          <button
            onClick={() => setCurrent((c) => c + 1)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Siguiente →
          </button>
        )}
      </div>
    </div>
  );
}

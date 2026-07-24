"use client";

import { useState } from "react";
import Link from "next/link";
import { LabProgress } from "./lab-progress";
import { CelebrationOverlay } from "./celebration-overlay";

interface LessonCarouselProps {
  slides: React.ReactNode[];
  nextLessonHref?: string;
  lessonTitle?: string;
}

export function LessonCarousel({
  slides,
  nextLessonHref,
  lessonTitle = "",
}: LessonCarouselProps) {
  const total = slides.length;
  const [current, setCurrent] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const isLast = current === total - 1;

  const handleFinish = () => {
    setShowCelebration(true);
  };

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col">
        {/* ── Lab Progress ─────────────────────────────── */}
        <LabProgress total={total} current={current} />

        {/* ── Content (scrollable si excede el viewport) ── */}
        <div className="min-h-0 flex-1 overflow-y-auto">{slides[current]}</div>

        {/* ── Navigation ───────────────────────────────── */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
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
            <button
              onClick={handleFinish}
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
            >
              Finalizar
            </button>
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

      {/* ── Celebration Overlay ────────────────────────── */}
      {showCelebration && (
        <CelebrationOverlay
          lessonTitle={lessonTitle}
          nextLessonHref={nextLessonHref}
          onClose={() => setShowCelebration(false)}
        />
      )}
    </>
  );
}

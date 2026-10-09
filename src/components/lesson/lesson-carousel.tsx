"use client";

import { useState, useRef, useEffect } from "react";
import { LabProgress } from "./lab-progress";
import { CelebrationOverlay } from "./celebration-overlay";
import { Button } from "@/components/ui";
import { ConsentPendingCard } from "@/components/consent/ConsentPendingCard";
import { useLessonCompletion } from "@/hooks/useLessonCompletion";

interface LessonCarouselProps {
  slides: React.ReactNode[];
  nextLessonHref?: string;
  lessonTitle?: string;
  moduleSlug: string;
  lessonSlug: string;
}

export function LessonCarousel({
  slides,
  nextLessonHref,
  lessonTitle = "",
  moduleSlug,
  lessonSlug,
}: LessonCarouselProps) {
  const total = slides.length;
  const [current, setCurrent] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const isLast = current === total - 1;
  const slideRef = useRef<HTMLDivElement>(null);
  const { state, xp, streak, error, complete } = useLessonCompletion();

  // Scroll the page so the current slide is at the top of the viewport
  useEffect(() => {
    slideRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [current]);

  const handleFinish = async () => {
    const r = await complete(moduleSlug, lessonSlug);
    if (r.ok) setShowCelebration(true);
  };

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <LabProgress total={total} current={current} />

        <div ref={slideRef} className="min-h-0 flex-1 overflow-y-auto">
          {slides[current]}
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 pt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrent((c) => c - 1)}
            disabled={current === 0}
          >
            ← Anterior
          </Button>

          <span className="font-mono text-xs text-gray-400">
            {current + 1} / {total}
          </span>

          {isLast ? (
            <Button
              size="sm"
              className="bg-teal-600 hover:bg-teal-700 shadow-teal-600/20"
              onClick={handleFinish}
              disabled={state === "loading"}
            >
              {state === "loading" ? "Guardando progreso…" : "Finalizar"}
            </Button>
          ) : (
            <Button variant="secondary" size="sm" onClick={() => setCurrent((c) => c + 1)}>
              Siguiente →
            </Button>
          )}
        </div>

        {state === "consent" && (
          <div className="mt-2">
            <p className="mb-2 text-sm font-medium text-amber-800">
              Completá tu autorización para guardar tu progreso.
            </p>
            <ConsentPendingCard />
          </div>
        )}

        {state === "error" && error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
      </div>

      {showCelebration && state === "done" && (
        <CelebrationOverlay
          lessonTitle={lessonTitle}
          nextLessonHref={nextLessonHref}
          xp={xp}
          streak={streak}
          onClose={() => setShowCelebration(false)}
        />
      )}
    </>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { LabProgress } from "./lab-progress";
import { CelebrationOverlay } from "./celebration-overlay";
import { Button } from "@/components/ui";

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
  const slideRef = useRef<HTMLDivElement>(null);

  // Scroll to top whenever the slide changes
  useEffect(() => {
    slideRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [current]);

  const handleFinish = () => {
    setShowCelebration(true);
  };

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <LabProgress total={total} current={current} />

        <div
          ref={slideRef}
          className="min-h-0 flex-1 overflow-y-auto"
        >
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
            >
              Finalizar
            </Button>
          ) : (
            <Button size="sm" onClick={() => setCurrent((c) => c + 1)}>
              Siguiente →
            </Button>
          )}
        </div>
      </div>

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

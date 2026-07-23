"use client";

import Link from "next/link";
import { MascotMessage } from "./mascot-message";

interface CelebrationOverlayProps {
  lessonTitle: string;
  nextLessonHref?: string;
  onClose?: () => void;
}

/** Generate deterministic confetti pieces for CSS animation */
function ConfettiDrops() {
  const colors = [
    "#3B82F6",
    "#14B8A6",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#10B981",
  ];
  const pieces = Array.from({ length: 30 }, (_, i) => {
    const color = colors[i % colors.length];
    const left = `${(i * 3.7) % 100}%`;
    const delay = `${(i * 0.15) % 2}s`;
    const size = `${6 + (i % 3) * 3}px`;
    const duration = `${2 + (i % 3) * 0.5}s`;

    return (
      <div
        key={i}
        className="absolute animate-confetti-fall rounded-sm opacity-70"
        style={{
          left,
          width: size,
          height: size,
          backgroundColor: color,
          animationDelay: delay,
          animationDuration: duration,
        }}
      />
    );
  });

  return <>{pieces}</>;
}

export function CelebrationOverlay({
  lessonTitle,
  nextLessonHref,
  onClose,
}: CelebrationOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/50">
      {/* confetti layer */}
      <div className="pointer-events-none absolute inset-0">
        <ConfettiDrops />
      </div>

      {/* card */}
      <div className="relative mx-4 max-w-md rounded-[16px] border border-gray-200 bg-white p-8 text-center shadow-2xl">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-50">
            <svg
              viewBox="0 0 24 24"
              className="h-8 w-8 text-teal-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
          Leccion completada
        </h2>
        <p className="mb-6 text-sm text-gray-500">{lessonTitle}</p>

        <div className="mb-6 text-left">
          <MascotMessage mood="celebrating">
            Buen trabajo. Cada concepto que aprendes es un paso mas para entender
            como la IA transforma la biotecnologia.
          </MascotMessage>
        </div>

        <div className="flex flex-col gap-3">
          {nextLessonHref && (
            <Link
              href={nextLessonHref}
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Siguiente leccion
            </Link>
          )}
          <Link
            href="/"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            Volver al inicio
          </Link>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="mt-4 text-xs text-gray-400 underline hover:text-gray-600"
          >
            Seguir viendo esta leccion
          </button>
        )}
      </div>
    </div>
  );
}

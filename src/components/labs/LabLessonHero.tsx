"use client";

import { useState } from "react";
import { Gem } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import type { LabCardTheme } from "./LabCardTheme";
import { LabXpToast } from "./LabXpToast";

const RiveBioreactor = dynamic(
  () => import("./LabHero/RiveBioreactor").then((m) => m.RiveBioreactor),
  { ssr: false },
);

interface LabLessonHeroProps {
  moduleSlug: string;
  lessonTitle: string;
  moduleLabel: string;
  theme: LabCardTheme;
  progress: {
    completed: number;
    totalXpForLesson: number;
  };
  showXpToast?: boolean;
}

/**
 * Compact hero bar for lab lesson pages — 120px top bar with module favicon,
 * breadcrumb, XP badge, and subtle Rive mini. Uses LabCardTheme for accent/tint.
 */
export function LabLessonHero({
  moduleSlug,
  lessonTitle,
  moduleLabel,
  theme,
  progress,
  showXpToast = false,
}: LabLessonHeroProps) {
  const [toastVisible, setToastVisible] = useState(showXpToast);
  const xpPercent =
    progress.completed > 0
      ? Math.round(
          (progress.completed / Math.max(progress.completed + 1, 1)) * 100,
        )
      : 0;

  return (
    <section
      className="relative overflow-hidden border-l-4 bg-[var(--color-comic-bg)]"
      style={{ borderColor: theme.accent, minHeight: 120 }}
    >
      {/* Tint overlay */}
      <div
        className="absolute inset-0 z-0 opacity-40"
        style={{ backgroundColor: theme.tint }}
      />

      <div className="relative z-10 mx-auto flex h-[120px] max-w-screen-2xl items-center gap-4 px-6 md:gap-6 md:px-10">
        {/* Module favicon */}
        <Image
          src={theme.art}
          alt={moduleLabel}
          width={40}
          height={40}
          className="shrink-0"
          style={{ color: theme.accent }}
          priority
        />

        {/* Breadcrumb + title */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <nav
            className="flex items-center gap-1.5 text-[11px] text-[var(--color-comic-accent)]"
            aria-label="Breadcrumb"
          >
            <span className="opacity-60">Laboratorios</span>
            <span aria-hidden="true">/</span>
            <span className="opacity-80">{moduleLabel}</span>
            <span aria-hidden="true">/</span>
            <span className="font-medium text-[var(--color-comic-text)]">
              {lessonTitle}
            </span>
          </nav>

          {/* XP badge */}
          <div className="flex items-center gap-1.5">
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold"
              style={{
                backgroundColor: `${theme.accent}1A`,
                color: theme.accent,
              }}
            >
              <Gem className="h-3 w-3" />
              +{progress.totalXpForLesson} XP
            </span>
          </div>
        </div>

        {/* Rive mini — subtle burbujeo */}
        <div className="hidden shrink-0 md:block" style={{ width: 64, height: 64, transform: "scale(0.5)", transformOrigin: "center" }}>
          <RiveBioreactor progress={progress.completed} />
        </div>
      </div>

      {/* Progress bar (only if completed > 0) */}
      {progress.completed > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-hud-border)]">
          <div
            className="h-full rounded-r-full bg-[var(--color-mint)]"
            style={{ width: `${xpPercent}%` }}
          />
        </div>
      )}

      {/* XP Toast — shown when showXpToast is true */}
      <LabXpToast
        xp={progress.totalXpForLesson}
        visible={toastVisible}
        onDismiss={() => setToastVisible(false)}
      />
    </section>
  );
}

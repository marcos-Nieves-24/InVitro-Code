"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";

interface Props {
  moduleSlug: string;
  lessonSlug: string;
  initialBookmarked?: boolean;
}

export function BookmarkButton({ moduleSlug, lessonSlug, initialBookmarked = false }: Props) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const onToggle = async () => {
    if (loading) return;
    setLoading(true);
    setFeedback(null);
    try {
      if (bookmarked) {
        const res = await fetch("/api/bookmarks", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ module_slug: moduleSlug, lesson_slug: lessonSlug }),
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error((j as { error?: string }).error ?? "No se pudo quitar el guardado");
        }
        setBookmarked(false);
        setFeedback("Quitado de guardados");
      } else {
        const res = await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ module_slug: moduleSlug, lesson_slug: lessonSlug }),
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error((j as { error?: string }).error ?? "No se pudo guardar");
        }
        setBookmarked(true);
        setFeedback("Guardado");
      }
      // auto-clear feedback
      setTimeout(() => setFeedback(null), 1600);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error";
      setFeedback(msg);
      // eslint-disable-next-line no-console
      console.error("[BookmarkButton]", msg);
      setTimeout(() => setFeedback(null), 2200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={onToggle}
        disabled={loading}
        aria-pressed={bookmarked}
        aria-label={bookmarked ? "Quitar de guardados" : "Guardar lección"}
        title={bookmarked ? "Quitar de guardados" : "Guardar lección"}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint disabled:opacity-50 ${
          bookmarked
            ? "border-mint bg-mint text-ink hover:bg-mint/90"
            : "border-surface-raised bg-surface text-storm hover:bg-surface-raised hover:text-ink"
        }`}
      >
        <Bookmark className="h-4 w-4" fill={bookmarked ? "currentColor" : "none"} aria-hidden />
      </button>
      {feedback && (
        <span className="text-xs font-medium text-storm" role="status" aria-live="polite">
          {feedback}
        </span>
      )}
    </span>
  );
}

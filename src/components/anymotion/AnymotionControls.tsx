"use client";

import type { AnymotionTimeline } from "./hooks/useAnymotionTimeline";

interface AnymotionControlsProps {
  /** Timeline object returned by `useAnymotionTimeline`. */
  timeline: AnymotionTimeline;
  /** Accessible name used for the control group and the scrubber. */
  label?: string;
  className?: string;
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Playback controls for Anymotion animations.
 *
 * Rendered below the stage and mirroring the standard playback bar: play/pause
 * toggle, a replay button, a range scrubber and a current/duration readout.
 * The component is fully controlled — every action maps onto the timeline
 * contract (`toggle`, `seek`, `reset`, `play`), so the same instance drives any
 * player wired through `useAnymotionTimeline`.
 */
export function AnymotionControls({
  timeline,
  label = "Línea de tiempo",
  className = "",
}: AnymotionControlsProps) {
  const { isPlaying, toggle, seek, time, duration, reset, play } = timeline;

  const handleReplay = () => {
    reset();
    play();
  };

  return (
    <div
      role="group"
      aria-label={`Controles de la animación: ${label}`}
      className={`flex items-center gap-3 rounded-b-card bg-surface-card px-4 py-2.5 text-storm ${className}`}
    >
      <button
        type="button"
        onClick={toggle}
        className="flex h-11 w-11 min-h-11 min-w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-xs font-semibold transition-colors hover:bg-mint/10 hover:text-mint"
        aria-label={isPlaying ? "Pausar animación" : "Reproducir animación"}
      >
        {isPlaying ? (
          <svg className="h-3.5 w-3.5" viewBox="0 0 10 10" fill="currentColor">
            <rect x="1" y="1" width="3" height="8" />
            <rect x="6" y="1" width="3" height="8" />
          </svg>
        ) : (
          <svg className="ml-0.5 h-3.5 w-3.5" viewBox="0 0 10 10" fill="currentColor">
            <polygon points="1,0 10,5 1,10" />
          </svg>
        )}
      </button>

      <button
        type="button"
        onClick={handleReplay}
        className="flex h-11 w-11 min-h-11 min-w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-xs font-semibold transition-colors hover:bg-mint/10 hover:text-mint"
        aria-label="Repetir desde el inicio"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 3-6.7" />
          <polyline points="3 4 3 9 8 9" />
        </svg>
      </button>

      <input
        type="range"
        min={0}
        max={duration}
        step={0.01}
        value={time}
        onChange={(e) => seek(Number(e.target.value))}
        className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-gray-200 accent-mint"
        aria-label={label}
      />

      <span className="font-mono text-xs text-storm tabular-nums">
        {formatTime(time)} / {formatTime(duration)}
      </span>
    </div>
  );
}

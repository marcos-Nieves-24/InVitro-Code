"use client";

interface AnymotionControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  speed: number;
  onPlayPause: () => void;
  onSeek: (t: number) => void;
  onSpeedChange?: (s: number) => void;
  className?: string;
}

const SPEED_OPTIONS = [0.25, 0.5, 1, 1.5, 2];

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Playback controls for Anymotion animations.
 *
 * Renders below the stage and mirrors the standard playback bar: play/pause
 * toggle, a range scrubber, current/duration readout, and optional speed
 * selector. The component is controlled — all state lives in the parent
 * (typically an AnymotionPlayer).
 */
export function AnymotionControls({
  isPlaying,
  currentTime,
  duration,
  speed,
  onPlayPause,
  onSeek,
  onSpeedChange,
  className = "",
}: AnymotionControlsProps) {
  return (
    <div
      className={`flex items-center gap-3 rounded-b-card bg-surface-card px-4 py-2.5 text-storm ${className}`}
    >
      <button
        type="button"
        onClick={onPlayPause}
        className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-[10px] font-semibold transition-colors hover:bg-mint/10 hover:text-mint"
        aria-label={isPlaying ? "Pausar" : "Reproducir"}
      >
        {isPlaying ? (
          <svg className="h-3 w-3" viewBox="0 0 10 10" fill="currentColor">
            <rect x="1" y="1" width="3" height="8" />
            <rect x="6" y="1" width="3" height="8" />
          </svg>
        ) : (
          <svg className="ml-0.5 h-3 w-3" viewBox="0 0 10 10" fill="currentColor">
            <polygon points="1,0 10,5 1,10" />
          </svg>
        )}
      </button>

      <input
        type="range"
        min={0}
        max={duration}
        step={0.01}
        value={currentTime}
        onChange={(e) => onSeek(Number(e.target.value))}
        className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-gray-200 accent-mint"
        aria-label="Línea de tiempo"
      />

      <span className="font-mono text-[11px] text-storm tabular-nums">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>

      {onSpeedChange && (
        <select
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="h-6 rounded border border-gray-200 bg-white px-1.5 font-mono text-[11px] text-storm"
          aria-label="Velocidad de reproducción"
        >
          {SPEED_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}×
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
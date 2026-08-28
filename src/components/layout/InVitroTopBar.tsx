import { Gem, Flame } from "lucide-react";

interface InVitroTopBarProps {
  totalXp: number;
  currentStreak: number;
  trail?: string;
}

export function InVitroTopBar({ totalXp, currentStreak, trail }: InVitroTopBarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-surface-raised bg-surface/80 px-8 pl-16 backdrop-blur-md md:pl-8">
      <div
        className={`hidden items-center gap-2 text-sm text-storm md:flex ${
          trail ? "" : "font-semibold text-ink"
        }`}
      >
        {trail ? (
          <>
            <span>{trail}</span>
          </>
        ) : (
          <span>Dashboard de Expedición</span>
        )}
      </div>
      <div className="flex items-center gap-4 md:gap-6">
        <div className="flex items-center gap-2 rounded-full bg-fog/20 px-3 py-1.5 text-sm font-bold text-ink">
          <Gem className="h-4 w-4 text-mint" fill="currentColor" />
          <span className="tabular-nums">{totalXp.toLocaleString("es")} XP</span>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-surface-raised px-3 py-1.5 text-sm font-bold text-ink">
          <Flame className="h-4 w-4 text-error" />
          <span className="tabular-nums">
            {currentStreak} día{currentStreak !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </header>
  );
}
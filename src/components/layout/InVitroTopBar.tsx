import { Gem, Flame, Bell } from "lucide-react";

interface InVitroTopBarProps {
  totalXp: number;
  currentStreak: number;
  trail?: string;
}

export function InVitroTopBar({ totalXp, currentStreak, trail }: InVitroTopBarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-outline-variant bg-surface/80 px-8 pl-16 backdrop-blur-md md:pl-8">
      <div
        className={`hidden items-center gap-2 text-sm text-outline md:flex ${
          trail ? "" : "font-semibold text-on-surface"
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
        <div className="flex items-center gap-2 rounded-full bg-primary-fixed px-3 py-1.5 text-sm font-bold text-primary">
          <Gem className="h-4 w-4" fill="currentColor" />
          <span>{totalXp.toLocaleString("es-AR")} XP</span>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-surface-container px-3 py-1.5 text-sm font-bold text-on-surface">
          <Flame className="h-4 w-4 text-error" />
          <span>
            {currentStreak} día{currentStreak !== 1 ? "s" : ""}
          </span>
        </div>
        <button
          className="relative rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container"
          aria-label="Notificaciones"
          type="button"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-surface bg-error" />
        </button>
      </div>
    </header>
  );
}
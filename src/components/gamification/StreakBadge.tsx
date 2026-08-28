import { Flame } from "lucide-react";

interface StreakBadgeProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakBadge({ currentStreak, longestStreak }: StreakBadgeProps) {
  if (currentStreak === 0) {
    return (
      <div className="rounded-full bg-fog/20 px-3 py-1 text-sm text-storm">
        No hay racha
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-full bg-fog/20 px-3 py-1">
      <Flame className="h-4 w-4 text-mint" />
      <span className="text-sm font-semibold text-storm">
        {currentStreak} día{currentStreak !== 1 ? "s" : ""}
      </span>
      {currentStreak >= 7 && (
        <span className="text-xs font-medium text-mint">Racha de oro</span>
      )}
    </div>
  );
}
import { Flame } from "lucide-react";

interface StreakBadgeProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakBadge({ currentStreak, longestStreak }: StreakBadgeProps) {
  if (currentStreak === 0) {
    return (
      <div className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-500">
        No hay racha
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1">
      <Flame className="h-4 w-4 text-orange-500" />
      <span className="text-sm font-semibold text-orange-700">
        {currentStreak} día{currentStreak !== 1 ? "s" : ""}
      </span>
      {currentStreak >= 7 && (
        <span className="text-xs text-orange-600">Racha de oro</span>
      )}
    </div>
  );
}

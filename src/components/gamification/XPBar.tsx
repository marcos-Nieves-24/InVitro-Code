import { calcLevel } from "@/lib/gamification/utils";

interface XPBarProps {
  totalXp: number;
}

export function XPBar({ totalXp }: XPBarProps) {
  const levelInfo = calcLevel(totalXp);
  const progressPercentage = (levelInfo.progressToNext / levelInfo.nextLevelXp) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink">Nivel {levelInfo.level}</span>
        <span className="text-sm text-storm">
          {totalXp} XP / {levelInfo.nextLevelXp} XP para siguiente nivel
        </span>
      </div>
      <div className="relative h-4 w-full overflow-hidden rounded-full bg-surface-raised">
        <div
          className="absolute inset-0 rounded-full xp-gradient transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}
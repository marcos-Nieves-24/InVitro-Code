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
        <span className="text-sm font-medium">Nivel {levelInfo.level}</span>
        <span className="text-sm text-gray-600">
          {totalXp} XP / {levelInfo.nextLevelXp} XP para siguiente nivel
        </span>
      </div>
      <div className="relative h-4 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}

import { calcLevel } from "@/lib/gamification/utils";

interface LevelBadgeProps {
  totalXp: number;
}

export function LevelBadge({ totalXp }: LevelBadgeProps) {
  const levelInfo = calcLevel(totalXp);

  const getLevelColor = (level: number) => {
    if (level < 5) return "bg-graphite text-surface";
    if (level < 10) return "bg-fog text-ink";
    if (level < 20) return "bg-mint text-ink";
    return "bg-ink text-mint";
  };

  return (
    <div className="flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold text-ink">
      <span className={`${getLevelColor(levelInfo.level)} rounded-full px-2 py-1`}>Nivel {levelInfo.level}</span>
      {levelInfo.level >= 10 && <span>Expert</span>}
      {levelInfo.level >= 20 && <span>Master</span>}
    </div>
  );
}
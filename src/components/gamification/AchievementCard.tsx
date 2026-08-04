import type { LucideIcon } from "lucide-react";
import { CheckCircle2, Gem, Lock } from "lucide-react";

interface AchievementCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  xp?: number;
  completed?: boolean;
  locked?: boolean;
  progressPercent?: number;
}

export function AchievementCard({
  title,
  description,
  icon: Icon,
  xp,
  completed = false,
  locked = false,
  progressPercent,
}: AchievementCardProps) {
  const hasProgress = progressPercent !== undefined && !locked && !completed;

  return (
    <div
      className={`glass-card flex items-center gap-5 rounded-2xl p-5 transition-all hover:border-primary ${
        locked
          ? "border-dashed bg-surface-container-low opacity-70"
          : "cursor-pointer"
      }`}
    >
      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
        <Icon
          className={`h-8 w-8 ${
            locked ? "text-on-surface-variant" : "text-primary"
          }`}
        />
      </div>
      <div className="min-w-0 flex-1">
        {hasProgress ? (
          <div className="flex items-start justify-between">
            <h4 className="truncate font-bold text-on-surface">{title}</h4>
            <span className="ml-2 shrink-0 text-[10px] font-bold text-primary">
              {Math.round(progressPercent)}%
            </span>
          </div>
        ) : (
          <h4 className="truncate font-bold text-on-surface">{title}</h4>
        )}
        <p className="line-clamp-1 text-sm text-on-surface-variant">
          {description}
        </p>
        <div className="mt-2 flex items-center gap-2">
          {xp !== undefined && (
            <span className="flex items-center gap-1 text-xs font-bold text-xp-gold">
              <Gem className="h-3.5 w-3.5" fill="currentColor" />
              {xp} XP
            </span>
          )}
          {hasProgress && (
            <div className="ml-auto h-1.5 w-full max-w-[8rem] overflow-hidden rounded-full bg-surface-container-high">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}
        </div>
      </div>
      {completed && (
        <CheckCircle2 className="h-5 w-5 shrink-0 text-tertiary" />
      )}
      {locked && <Lock className="h-5 w-5 shrink-0 text-outline" />}
    </div>
  );
}
import { dailyGoalProgress } from "@/domain/dailyGoal";

export interface DailyGoalRingProps {
  todayXp: number;
  goal: number;
  onChangeGoal?: (n: number) => void;
}

export function DailyGoalRing({ todayXp, goal, onChangeGoal }: DailyGoalRingProps) {
  const { percent, remaining, achieved } = dailyGoalProgress(todayXp, goal);

  // SVG ring r=44 stroke 8
  const r = 44;
  const stroke = 8;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - percent / 100);

  return (
    <div className="glass-card flex items-center gap-6 p-5 md:p-6">
      <div className="relative shrink-0" style={{ width: 104, height: 104 }}>
        <svg width={104} height={104} viewBox="0 0 104 104" aria-hidden="true" className="block">
          <circle
            cx={52}
            cy={52}
            r={r}
            fill="none"
            stroke="var(--color-surface-raised, #e8eef2)"
            strokeWidth={stroke}
            className="text-surface-raised"
          />
          <circle
            cx={52}
            cy={52}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            transform="rotate(-90 52 52)"
            className="text-mint transition-[stroke-dashoffset] duration-500"
          />
        </svg>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext={`${todayXp} de ${goal} XP, ${percent}%`}
          aria-label="Meta diaria"
        >
          <span className="font-display text-sm font-bold leading-none text-ink">
            {todayXp}/{goal}
          </span>
          <span className="text-[11px] font-medium tracking-wider text-storm">XP</span>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-storm">Meta diaria</h3>
        <p className="mt-1 text-sm text-ink">
          {achieved ? (
            <span className="font-bold text-mint">¡Meta lograda!</span>
          ) : (
            <>
              Te faltan <span className="font-bold text-mint">{remaining} XP</span> · {percent}%
            </>
          )}
        </p>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-raised">
          <div
            className="h-full rounded-full bg-gradient-to-r from-fog to-mint transition-[width] duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        {onChangeGoal ? (
          <p className="mt-2 text-xs text-storm">Ajustá tu meta en Configuración</p>
        ) : null}
      </div>
    </div>
  );
}

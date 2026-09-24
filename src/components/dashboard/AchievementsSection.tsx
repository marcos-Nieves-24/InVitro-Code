import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { achievementIcon } from "@/lib/gamification/icons";
import { rankTitle } from "@/lib/gamification/utils";
import { EMPTY_STATES } from "@/lib/ui/empty-states";
import { BioreactorProgress } from "./BioreactorProgress";

export interface AchievementsSectionProps {
  levelInfo: { level: number; nextLevelXp: number; progressToNext: number };
  totalXp: number;
  recentAchievements: {
    id: string;
    title: string;
    description: string;
    icon: string;
    xpReward: number;
  }[];
}

export function AchievementsSection({ levelInfo, totalXp, recentAchievements }: AchievementsSectionProps) {
  return (
    <section id="progress" className="scroll-mt-20">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Tu Progreso</h2>
        <Link href="/niveles" className="flex items-center gap-1 text-sm font-bold text-mint hover:underline">
          Ver roadmap <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Nivel y XP — Bioreactor */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-center">
            <BioreactorProgress
              exp={totalXp}
              expToNext={levelInfo.nextLevelXp}
              level={levelInfo.level}
              rank={rankTitle(levelInfo.level)}
              progressToNext={levelInfo.progressToNext}
              size="md"
            />
            <div className="text-center md:text-left">
              <p className="font-display text-lg font-bold">{rankTitle(levelInfo.level)}</p>
              <p className="mt-1 text-sm text-storm">
                <span className="font-bold text-mint">{totalXp.toLocaleString("es")}</span> / {levelInfo.nextLevelXp.toLocaleString("es")} XP
              </p>
              <div className="mt-3 h-2 w-full max-w-[10rem] overflow-hidden rounded-full bg-surface-raised md:mx-0 mx-auto">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-fog to-mint transition-all duration-500"
                  style={{ width: `${Math.min(100, (levelInfo.progressToNext / levelInfo.nextLevelXp) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Logros Recientes */}
        <div className="glass-card rounded-xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold">Logros Recientes</h3>
            <Link href="/logros" className="text-xs font-bold text-mint hover:underline">
              Ver todos
            </Link>
          </div>
          {recentAchievements.length > 0 ? (
            <div className="space-y-3">
              {recentAchievements.map((achievement) => {
                const Icon = achievementIcon(achievement.icon);
                return (
                  <div key={achievement.id} className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-fog/20 text-mint">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <h5 className="text-xs font-bold">{achievement.title}</h5>
                        <span className="text-[10px] font-bold text-mint">+{achievement.xpReward} XP</span>
                      </div>
                      <p className="text-[10px] text-storm">{achievement.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState icon={Trophy} {...EMPTY_STATES.achievements} />
          )}
        </div>
      </div>
    </section>
  );
}

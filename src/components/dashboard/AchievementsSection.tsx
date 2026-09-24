import Link from "next/link";
import { Trophy } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { achievementIcon } from "@/lib/gamification/icons";
import { EMPTY_STATES } from "@/lib/ui/empty-states";

export interface AchievementsSectionProps {
  levelInfo?: { level: number; nextLevelXp: number; progressToNext: number };
  totalXp?: number;
  recentAchievements: {
    id: string;
    title: string;
    description: string;
    icon: string;
    xpReward: number;
  }[];
}

export function AchievementsSection({ recentAchievements }: AchievementsSectionProps) {
  return (
    <section id="achievements" className="scroll-mt-20">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Logros Recientes</h2>
        <Link href="/logros" className="text-xs font-bold text-mint hover:underline">
          Ver todos
        </Link>
      </div>

      <div className="glass-card rounded-xl p-6">
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
    </section>
  );
}

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { InVitroShell } from "@/components/layout/InVitroShell";
import { InVitroTopBar } from "@/components/layout/InVitroTopBar";
import { AchievementCard } from "@/components/gamification/AchievementCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { createAdminClient } from "@/lib/supabase/admin";
import { calcLevel, rankTitle } from "@/lib/gamification/utils";
import { getTotalXp, getDisplayName } from "@/lib/gamification/user";
import {
  evaluateAchievements,
  getWeeklyXp,
  type AchievementState,
} from "@/lib/gamification/achievements";
import { achievementIcon } from "@/lib/gamification/icons";
import { EMPTY_STATES } from "@/lib/ui/empty-states";
import { Gift, Trophy } from "lucide-react";

const WEEK_DAYS = ["L", "M", "X", "J", "V", "S", "D"];

export default async function LogrosPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const supabase = createAdminClient();

  const [profileRes, streakRes, { achievements, summary }, weeklyXp] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("username, email")
        .eq("id", userId)
        .maybeSingle(),
      supabase
        .from("streaks")
        .select("current_streak")
        .eq("user_id", userId)
        .maybeSingle(),
      evaluateAchievements(userId, supabase),
      getWeeklyXp(userId, supabase),
    ]);

  const userName = getDisplayName(profileRes.data ?? {});
  const currentStreak = streakRes.data?.current_streak ?? 0;

  const totalXp = await getTotalXp(userId, supabase);
  const levelInfo = calcLevel(totalXp);

  // Group the real catalog by category, preserving catalog order.
  const categories: { name: string; items: AchievementState[] }[] = [];
  for (const achievement of achievements) {
    const category = categories.find((c) => c.name === achievement.category);
    if (category) category.items.push(achievement);
    else categories.push({ name: achievement.category, items: [achievement] });
  }

  const maxDayXp = Math.max(...weeklyXp.days, 1);

  return (
    <InVitroShell
      userName={userName}
      userMeta={`Nivel ${levelInfo.level} · ${rankTitle(levelInfo.level)}`}
    >
      <InVitroTopBar
        totalXp={totalXp}
        currentStreak={currentStreak}
        trail="Mis Logros"
      />

      <div className="mx-auto max-w-[1440px] space-y-10 px-6 py-10 md:px-10">
        {/* Hero progress — real % (REQ-ACH-06) */}
        <section className="space-y-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h2 className="font-display text-3xl font-extrabold text-ink">
                Mis Logros
              </h2>
              <p className="text-storm">
                Tu camino hacia la excelencia en Inteligencia Artificial y
                biotecnología.
              </p>
            </div>
            <div className="text-left md:text-right">
              <span className="font-display text-2xl font-bold text-mint">
                {summary.percent}% Completado
              </span>
                <p className="text-sm text-storm">
                {summary.unlocked} de {summary.total} Logros Desbloqueados
              </p>
            </div>
          </div>
          <div className="h-4 w-full overflow-hidden rounded-full bg-surface-raised">
            <div
              className="progress-gradient relative h-full"
              style={{ width: `${summary.percent}%` }}
            />
          </div>
        </section>

        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
          {/* Achievements grid */}
          <div className="space-y-10 xl:col-span-2">
            {summary.unlocked === 0 || achievements.length === 0 ? (
              <EmptyState icon={Trophy} {...EMPTY_STATES.achievements} />
            ) : (
              categories.map((category) => {
                const unlocked = category.items.filter((a) => a.unlocked).length;
                return (
                  <section key={category.name} className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                    <h3 className="font-display text-xl font-semibold text-ink">
                      {category.name}
                    </h3>
                    <span className="rounded-full bg-fog/20 px-3 py-1 text-xs font-semibold text-mint">
                        {unlocked} de {category.items.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {category.items.map((a) => (
                        <AchievementCard
                          key={a.id}
                          title={a.title}
                          description={a.description}
                          icon={achievementIcon(a.icon)}
                          xp={a.xpReward}
                          completed={a.unlocked}
                          locked={!a.unlocked}
                        />
                      ))}
                    </div>
                  </section>
                );
              })
            )}
          </div>

          {/* Side panel — real weekly XP (REQ-ACH-06) */}
          <aside className="space-y-6">
            <div className="glass-card space-y-6 rounded-2xl p-6">
              <h3 className="flex items-center justify-between font-display text-lg font-semibold text-ink">
                Recompensa Semanal
                <Gift className="h-5 w-5 text-mint" />
              </h3>
              {weeklyXp.total > 0 ? (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-storm">
                      XP de esta semana
                    </span>
                    <span className="font-bold text-ink">
                      {weeklyXp.total.toLocaleString("es")} XP
                    </span>
                  </div>
                  <div className="grid grid-cols-7 items-end gap-1">
                    {WEEK_DAYS.map((day, i) => (
                      <div key={day} className="flex flex-col items-center gap-2">
                        <div
                          className="w-2 rounded-full bg-mint"
                          style={{
                            height: `${
                              Math.round((weeklyXp.days[i] / maxDayXp) * 64) || 2
                            }px`,
                          }}
                        />
                        <span className="text-[10px] uppercase text-storm">
                          {day}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
              <p className="text-sm text-storm">
                  Aún no ganaste XP esta semana. Completa una lección para
                  sumar.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </InVitroShell>
  );
}

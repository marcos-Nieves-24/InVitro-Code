import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { InVitroShell } from "@/components/layout/InVitroShell";
import { InVitroTopBar } from "@/components/layout/InVitroTopBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { createAdminClient } from "@/lib/supabase/admin";
import { calcLevel, rankTitle } from "@/lib/gamification/utils";
import { getTotalXp, getDisplayName } from "@/lib/gamification/user";
import { EMPTY_STATES } from "@/lib/ui/empty-states";
import {
  Medal,
  Trophy,
  Users,
  Flame,
  ArrowRight,
  FlaskConical,
} from "lucide-react";

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase();
}

export default async function ComunidadPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const supabase = createAdminClient();

  const [leaderboardRes, rankRes, streaksRes, profileRes, myStreakRes] =
    await Promise.all([
      supabase.rpc("get_leaderboard", { limit_n: 50 }),
      supabase.rpc("get_leaderboard_rank", { target_user_id: userId }),
      supabase
        .from("streaks")
        .select("user_id, current_streak")
        .gt("current_streak", 0)
        .limit(20),
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
    ]);

  const entries = (leaderboardRes.data ?? []) as Array<{
    userId: string;
    username: string | null;
    totalXp: number;
  }>;
  const myRank = rankRes.data as { position: number } | null;
  const myProfile = profileRes.data ?? {};

  // Real XP per leaderboard user, to derive honest level/rank chips.
  const xpByUser = new Map(
    entries.map((entry) => [entry.userId, entry.totalXp ?? 0]),
  );

  // Active researchers: real profiles with an active streak (current_streak > 0).
  const streakRows = (streaksRes.data ?? []).filter(
    (row) => (row.current_streak ?? 0) > 0,
  );
  const streakUserIds = streakRows.map((row) => row.user_id);
  const researchersRes =
    streakUserIds.length > 0
      ? await supabase
          .from("profiles")
          .select("id, username, email")
          .in("id", streakUserIds)
      : { data: [] };

  const streakByUser = new Map(
    streakRows.map((row) => [row.user_id, row.current_streak ?? 0]),
  );
  const researchers = (researchersRes.data ?? [])
    .map((profile) => ({
      id: profile.id,
      name: getDisplayName(profile),
      streak: streakByUser.get(profile.id) ?? 0,
      xp: xpByUser.get(profile.id) ?? null,
    }))
    .sort((a, b) => b.streak - a.streak);

  const totalXp = await getTotalXp(userId, supabase);
  const levelInfo = calcLevel(totalXp);
  const userName = getDisplayName(myProfile);
  const myEntry = entries.find((entry) => entry.userId === userId);

  return (
    <InVitroShell
      userName={userName}
      userMeta={`Nivel ${levelInfo.level} · ${rankTitle(levelInfo.level)}`}
    >
      <InVitroTopBar
        totalXp={totalXp}
        currentStreak={myStreakRes.data?.current_streak ?? 0}
        trail="Centro de la Comunidad"
      />

      <div className="mx-auto max-w-[1440px] space-y-10 px-6 py-10 md:px-10">
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left column: real challenge + active researchers */}
          <div className="space-y-6 lg:col-span-8">
            {/* Desafío real de la expedición (D1: static, no fake numbers) */}
            <div className="glass-card flex flex-col gap-4 rounded-2xl p-6 md:flex-row md:items-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                <FlaskConical className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-2xl font-bold text-on-surface">
                  Desafío Bio-Data 2026
                </h2>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Análisis de 11 variables físico-químicas para predecir la
                  calidad sensorial del vino. Resolvelo en las lecciones del
                  módulo de Machine Learning.
                </p>
              </div>
              <a
                href="/proyectos"
                className="flex shrink-0 items-center gap-1 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg transition-colors hover:bg-primary/90"
              >
                Explorar
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {/* Active researchers (real) */}
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-on-surface">
                Investigadores Activos
              </h2>
              {researchers.length > 0 ? (
                <div className="glass-card divide-y divide-outline-variant/30 rounded-2xl">
                  {researchers.map((researcher) => (
                    <div
                      key={researcher.id}
                      className="flex items-center gap-4 p-4 transition-colors hover:bg-surface-container-low"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary/20 bg-secondary-container text-xs font-bold text-on-secondary">
                        {initials(researcher.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-on-surface">
                          {researcher.name}
                        </p>
                        <p className="flex items-center gap-1 truncate text-xs text-on-surface-variant">
                          <Flame className="h-3.5 w-3.5 text-error" />
                          Racha de {researcher.streak}{" "}
                          {researcher.streak !== 1 ? "días" : "día"}
                        </p>
                      </div>
                      {researcher.xp !== null ? (
                        <span className="rounded-full bg-primary-container px-2.5 py-0.5 text-[10px] font-bold text-primary">
                          {rankTitle(calcLevel(researcher.xp).level)}
                        </span>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState icon={Users} {...EMPTY_STATES.activeUsers} />
              )}
            </div>
          </div>

          {/* Right column: real global leaderboard */}
          <div className="space-y-6 lg:col-span-4">
            <h2 className="font-display text-2xl font-bold text-on-surface">
              Global Leaderboard
            </h2>
            {entries.length > 0 ? (
              <div className="glass-card space-y-4 rounded-2xl p-6">
                <div className="space-y-4">
                  {entries.slice(0, 10).map((row, index) => {
                    const isMe = row.userId === userId;
                    return (
                      <div
                        key={row.userId}
                        className={`flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-surface-container-low ${
                          isMe
                            ? "border border-primary/30 bg-primary-fixed/40"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-container-highest text-xs font-black text-on-surface-variant">
                            {index < 3 ? (
                              <Medal
                                className={`h-4 w-4 ${
                                  index === 0
                                    ? "text-xp-gold"
                                    : index === 1
                                      ? "text-streak-orange"
                                      : "text-outline"
                                }`}
                                fill="currentColor"
                              />
                            ) : (
                              index + 1
                            )}
                          </span>
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-highest text-[10px] font-bold">
                            {initials(row.username ?? "Investigador")}
                          </div>
                          <span
                            className={`text-sm font-bold ${
                              isMe ? "text-primary" : "text-on-surface"
                            }`}
                          >
                            {row.username ?? "Investigador"}
                            {isMe ? " (tú)" : ""}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-primary">
                          {(row.totalXp ?? 0).toLocaleString("es")} XP
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <EmptyState icon={Trophy} {...EMPTY_STATES.leaderboard} />
            )}

            {/* Tu posición — real rank from get_leaderboard_rank */}
            <div className="rounded-2xl border-t-4 border-t-tertiary glass-card space-y-4 p-6">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-tertiary" />
                <span className="text-sm font-black uppercase tracking-widest text-on-surface">
                  Tu posición
                </span>
              </div>
              {myRank && entries.length > 0 ? (
                <>
                  <p className="text-3xl font-black text-tertiary">
                    #{myRank.position}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {myEntry
                      ? `${(myEntry.totalXp ?? 0).toLocaleString("es")} XP reales`
                      : "Ranking calculado sobre XP real."}
                  </p>
                </>
              ) : (
                <p className="text-sm text-on-surface-variant">
                  {totalXp > 0
                    ? `Todavía no entras en el top 50 — tienes ${totalXp.toLocaleString("es")} XP.`
                    : "Completa tu primera lección para aparecer en el ranking."}
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </InVitroShell>
  );
}

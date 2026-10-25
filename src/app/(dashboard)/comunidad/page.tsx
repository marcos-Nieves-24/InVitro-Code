import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { InVitroShell } from "@/components/layout/InVitroShell";
import { InVitroTopBar } from "@/components/layout/InVitroTopBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { createAdminClient } from "@/lib/supabase/admin";
import { calcLevel, rankTitle } from "@/lib/gamification/utils";
import { getTotalXp, getDisplayName } from "@/lib/gamification/user";
import { EMPTY_STATES } from "@/lib/ui/empty-states";
import { UserAvatar } from "@/components/ui/UserAvatar";
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
        .select("username, email, role, theme")
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
    avatar_url: string | null;
    totalXp: number;
  }>;
  // get_leaderboard_rank returns INTEGER directly, not object
  const rawRank = rankRes.data as number | { position: number } | null;
  const myRank: { position: number } | null =
    typeof rawRank === "number" ? { position: rawRank } : rawRank;
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
          .select("id, username, email, avatar_url")
          .in("id", streakUserIds)
      : { data: [] };

  const streakByUser = new Map(
    streakRows.map((row) => [row.user_id, row.current_streak ?? 0]),
  );
  const researchers = (researchersRes.data ?? [])
    .map((profile) => ({
      id: profile.id,
      name: getDisplayName(profile),
      avatar_url: (profile as { avatar_url?: string | null }).avatar_url ?? null,
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
      userRole={profileRes.data?.role}
      theme={profileRes.data?.theme}
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
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-fog/20 text-mint">
                <FlaskConical className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-2xl font-bold text-ink">
                  Desafío Bio-Data 2026
                </h2>
                <p className="mt-1 text-sm text-storm">
                  Análisis de 11 variables físico-químicas para predecir la
                  calidad sensorial del vino. Resolvelo en las lecciones del
                  módulo de Machine Learning.
                </p>
              </div>
              <a
                href="/proyectos"
                className="flex shrink-0 items-center gap-1 rounded-xl bg-mint px-5 py-3 text-sm font-bold text-ink shadow-lg transition-colors hover:bg-mint/90"
              >
                Explorar
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {/* Leaderboard de estudiantes */}
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-ink">
                Leaderboard de estudiantes
              </h2>
              {entries.length > 0 ? (
                <div className="space-y-3">
                  {/* Podio Top 3 */}
                  <div className="grid grid-cols-3 gap-3">
                    {entries.slice(0, 3).map((row, idx) => {
                      const isMe = row.userId === userId;
                      const level = calcLevel(row.totalXp ?? 0).level;
                      return (
                        <div
                          key={row.userId}
                          className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center ${
                            idx === 0 ? "border-mint bg-mint/10" : idx === 1 ? "border-fog bg-fog/10" : "border-storm/20 bg-surface-card"
                          } ${isMe ? "ring-2 ring-mint" : ""}`}
                        >
                          <div className="relative">
                            <UserAvatar username={row.username ?? "Investigador"} avatarUrl={row.avatar_url} size="md" className="border-2 border-white" />
                            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-surface-raised text-[10px] font-black">
                              {idx === 0 ? <Medal className="h-3.5 w-3.5 text-mint" fill="currentColor" /> : idx + 1}
                            </span>
                          </div>
                          <p className="truncate text-xs font-bold text-ink max-w-[80px]">{row.username ?? "Investigador"}{isMe ? " (tú)" : ""}</p>
                          <p className="text-[10px] font-bold text-mint">{rankTitle(level)} · Lv {level}</p>
                          <p className="text-xs font-black text-ink">{(row.totalXp ?? 0).toLocaleString("es")} XP</p>
                        </div>
                      );
                    })}
                  </div>
                  {/* Lista 4-10 con barra progreso vs líder */}
                  <div className="glass-card divide-y divide-outline-variant/30 rounded-2xl">
                    {entries.slice(3, 10).map((row, i) => {
                      const idx = i + 3;
                      const isMe = row.userId === userId;
                      const leaderXp = entries[0]?.totalXp ?? 1;
                      const pct = Math.round(((row.totalXp ?? 0) / leaderXp) * 100);
                      const level = calcLevel(row.totalXp ?? 0).level;
                      return (
                        <div key={row.userId} className={`flex items-center gap-3 p-3 ${isMe ? "bg-mint/5" : ""}`}>
                          <span className="w-6 text-center text-xs font-black text-storm">{idx + 1}</span>
                          <UserAvatar username={row.username ?? "Investigador"} avatarUrl={row.avatar_url} size="sm" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-ink">{row.username ?? "Investigador"}{isMe ? " (tú)" : ""}</p>
                            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-raised">
                              <div className="h-full bg-mint" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-ink">{(row.totalXp ?? 0).toLocaleString("es")} XP</p>
                            <p className="text-[10px] text-storm">{rankTitle(level)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <EmptyState icon={Trophy} {...EMPTY_STATES.leaderboard} />
              )}
            </div>
          </div>

          {/* Right column: Tu posición */}
          <div className="space-y-6 lg:col-span-4">
            {/* Tu posición — real rank + XP comparado */}
            <div className="rounded-2xl border-t-4 border-t-mint glass-card space-y-4 p-6">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-mint" />
                <span className="text-sm font-black uppercase tracking-widest text-ink">
                  Tu posición
                </span>
              </div>
              {myRank && entries.length > 0 && myEntry ? (
                (() => {
                  const leaderXp = entries[0]?.totalXp ?? 0;
                  const myXp = myEntry.totalXp ?? 0;
                  const diff = leaderXp - myXp;
                  const pct = leaderXp > 0 ? Math.round((myXp / leaderXp) * 100) : 0;
                  return (
                    <>
                      <div className="flex items-baseline gap-3">
                        <p className="text-3xl font-black text-mint">#{myRank.position}</p>
                        <p className="text-sm font-bold text-ink">{myXp.toLocaleString("es")} XP</p>
                        <span className="text-xs text-storm">/ {leaderXp.toLocaleString("es")} XP líder</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-raised">
                          <div className="h-full bg-mint transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-ink">{pct}% del líder</span>
                          <span className="text-storm">
                            {diff > 0 ? `Te faltan ${diff.toLocaleString("es")} XP` : "¡Vas líder!"}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-storm">
                        Comparado con {entries.length} usuarios en el ranking.
                      </p>
                    </>
                  );
                })()
              ) : myRank && entries.length > 0 ? (
                <>
                  <p className="text-3xl font-black text-mint">#{myRank.position}</p>
                  <p className="text-xs text-storm">Ranking calculado sobre XP real.</p>
                </>
              ) : (
                <p className="text-sm text-storm">
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

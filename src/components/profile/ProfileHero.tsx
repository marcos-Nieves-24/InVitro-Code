"use client";

import { Trophy, Calendar } from "lucide-react";

interface ProfileHeroProps {
  username?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  created_at?: string | null;
  leaderboardRank?: number | null;
  level?: number;
  totalXp?: number;
}

function formatJoinDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ProfileHero({
  username,
  email,
  avatar_url,
  bio,
  created_at,
  leaderboardRank,
  level,
  totalXp,
}: ProfileHeroProps) {
  const displayName = username || email?.split("@")[0] || "Investigador";
  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase();
  const joinDate = formatJoinDate(created_at);

  return (
    <div className="rounded-card border border-surface-raised bg-surface-card p-6 shadow-sm md:p-8">
      {/* Avatar row — mirrors Excalidraw left column: large avatar centered */}
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          {avatar_url ? (
            <img
              src={avatar_url}
              alt={displayName}
              className="h-24 w-24 rounded-full object-cover ring-2 ring-surface-raised md:h-[120px] md:w-[120px]"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-fog text-2xl font-bold text-ink ring-2 ring-surface-raised md:h-[120px] md:w-[120px] md:text-3xl">
              {initials}
            </div>
          )}
        </div>

        <h2 className="mt-4 font-display text-2xl font-bold text-ink md:text-[28px]">
          {displayName}
        </h2>
        {email && <p className="text-sm text-storm">{email}</p>}

        {bio && (
          <p className="mt-3 max-w-md text-sm leading-relaxed text-graphite">
            {bio}
          </p>
        )}
      </div>

      {/* Meta row: Fecha de unión + Posición en leaderboard — as in wireframe bottom */}
      <div className="mt-6 grid grid-cols-1 gap-3 border-t border-surface-raised pt-6 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-btn bg-surface px-4 py-3">
          <Calendar className="h-5 w-5 shrink-0 text-storm" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-storm">
              Fecha de unión
            </p>
            <p className="truncate text-sm font-medium text-ink">
              {joinDate ?? "—"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-btn bg-surface px-4 py-3">
          <Trophy className="h-5 w-5 shrink-0 text-storm" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-storm">
              Posición en leaderboard
            </p>
            <p className="truncate text-sm font-medium text-ink">
              {leaderboardRank != null ? `#${leaderboardRank}` : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Optional XP/Level row — kept for gamification continuity */}
      {(level !== undefined || totalXp !== undefined) && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {level !== undefined && (
            <span className="rounded-full bg-fog/20 px-3 py-1.5 text-sm font-bold text-ink">
              Nivel {level}
            </span>
          )}
          {totalXp !== undefined && (
            <span className="rounded-full bg-fog/20 px-3 py-1.5 text-sm font-bold text-ink">
              {totalXp.toLocaleString("es")} XP
            </span>
          )}
        </div>
      )}
    </div>
  );
}

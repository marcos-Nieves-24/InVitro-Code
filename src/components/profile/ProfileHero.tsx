"use client";

import { Trophy, Calendar, Pencil } from "lucide-react";
import { UserAvatar } from "@/components/ui/UserAvatar";

interface ProfileHeroProps {
  username?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  created_at?: string | null;
  leaderboardRank?: number | null;
  level?: number;
  totalXp?: number;
  onEdit?: () => void;
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
  onEdit,
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
    <div className="relative rounded-card border border-surface-raised bg-surface-card p-8 shadow-md md:p-10">
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-btn border border-surface-raised bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-surface-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint"
          aria-label="Editar perfil"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          Editar perfil
        </button>
      )}
      {/* Avatar row — mirrors Excalidraw left column: large avatar centered - AMPLIFIED */}
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <UserAvatar username={displayName} email={email} avatarUrl={avatar_url} size="xl" className="ring-2 ring-surface-raised" />
        </div>

        <h2 className="mt-6 font-display text-3xl font-bold text-ink md:text-[32px]">
          {displayName}
        </h2>
        {email && <p className="mt-1 text-sm text-storm md:text-[15px]">{email}</p>}

        {bio && (
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-graphite md:text-[15px]">
            {bio}
          </p>
        )}
      </div>

      {/* Meta row: Fecha de unión + Posición en leaderboard — as in wireframe bottom */}
      <div className="mt-8 grid grid-cols-1 gap-4 border-t border-surface-raised pt-8 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-btn bg-surface px-5 py-4">
          <Calendar className="h-6 w-6 shrink-0 text-storm" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-storm">
              Fecha de unión
            </p>
            <p className="text-base font-semibold text-ink">
              {joinDate ?? "—"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-btn bg-surface px-5 py-4">
          <Trophy className="h-6 w-6 shrink-0 text-storm" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-storm">
              Posición en leaderboard
            </p>
            <p className="text-base font-semibold text-ink">
              {leaderboardRank != null ? `#${leaderboardRank}` : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Optional XP/Level row — kept for gamification continuity */}
      {(level !== undefined || totalXp !== undefined) && (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {level !== undefined && (
            <span className="rounded-full bg-fog/20 px-4 py-2 text-sm font-bold text-ink">
              Nivel {level}
            </span>
          )}
          {totalXp !== undefined && (
            <span className="rounded-full bg-fog/20 px-4 py-2 text-sm font-bold text-ink">
              {totalXp.toLocaleString("es")} XP
            </span>
          )}
        </div>
      )}
    </div>
  );
}

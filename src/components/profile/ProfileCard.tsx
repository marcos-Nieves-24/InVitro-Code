"use client";

import { User } from "lucide-react";

interface ProfileCardProps {
  username?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  level?: number;
  totalXp?: number;
  currentStreak?: number;
}

export function ProfileCard({
  username,
  email,
  avatar_url,
  bio,
  level,
  totalXp,
  currentStreak,
}: ProfileCardProps) {
  const displayName = username || email?.split("@")[0] || "Investigador";
  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <div className="rounded-card border border-surface-raised bg-surface-card p-6 shadow-sm">
      <div className="flex items-start gap-6">
        <div className="relative">
          {avatar_url ? (
            <img
              src={avatar_url}
              alt={displayName}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-fog text-2xl font-bold text-ink">
              {initials}
            </div>
          )}
        </div>

        <div className="flex-1">
          <h2 className="font-display text-2xl font-bold text-ink">
            {displayName}
          </h2>
          <p className="text-sm text-storm">{email}</p>

          {bio && (
            <p className="mt-3 text-sm leading-relaxed text-graphite">{bio}</p>
          )}

          <div className="mt-4 flex flex-wrap gap-4">
            {level !== undefined && (
              <div className="flex items-center gap-2 rounded-full bg-fog/20 px-3 py-1.5 text-sm font-bold text-ink">
                <span>Nivel {level}</span>
              </div>
            )}
            {totalXp !== undefined && (
              <div className="flex items-center gap-2 rounded-full bg-fog/20 px-3 py-1.5 text-sm font-bold text-ink">
                <span>{totalXp.toLocaleString("es")} XP</span>
              </div>
            )}
            {currentStreak !== undefined && (
              <div className="flex items-center gap-2 rounded-full bg-fog/20 px-3 py-1.5 text-sm font-bold text-ink">
                <span>
                  {currentStreak} día{currentStreak !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

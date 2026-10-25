"use client";

import type { SocialUser } from "@/domain/profile/social";

interface FollowStatsProps {
  following: SocialUser[];
  followers: SocialUser[];
  onConnect?: (userId: string) => void;
  onOpenConecta?: () => void;
}

function UserRow({ user, onConnect }: { user: SocialUser; onConnect?: (id: string) => void }) {
  const initials = user.username
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-fog text-sm font-bold text-ink">
        {initials}
      </div>
      <span className="flex-1 truncate text-sm font-semibold text-ink">{user.username}</span>
      {onConnect && (
        <button
          type="button"
          onClick={() => onConnect(user.id)}
          className="shrink-0 rounded-btn bg-mint px-3 py-1.5 text-xs font-bold text-ink hover:bg-fog"
        >
          Conectar
        </button>
      )}
    </div>
  );
}

export function FollowStats({ following, followers, onConnect, onOpenConecta }: FollowStatsProps) {
  return (
    <div className="rounded-card border border-surface-raised bg-surface-card p-8 shadow-md">
      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-btn bg-surface px-4 py-4 text-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-storm">
            Siguiendo
          </h3>
          <p className="mt-2 text-center text-3xl font-bold text-ink">{following.length}</p>
        </div>
        <div className="rounded-btn bg-surface px-4 py-4 text-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-storm">
            Seguidores
          </h3>
          <p className="mt-2 text-center text-3xl font-bold text-ink">{followers.length}</p>
        </div>
      </div>

      <div className="mt-8 border-t border-surface-raised pt-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-storm">Siguiendo</p>
        <div className="space-y-2">
          {following.slice(0, 3).map((u) => (
            <UserRow key={u.id} user={u} onConnect={onConnect} />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={onOpenConecta}
          className="w-full rounded-btn bg-mint px-5 py-3 text-sm font-bold text-ink shadow-sm hover:bg-fog focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint"
        >
          Conectar
        </button>
      </div>
    </div>
  );
}

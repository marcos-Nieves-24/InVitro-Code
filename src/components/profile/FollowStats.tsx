"use client";

import type { SocialUser } from "@/domain/profile/social";

interface FollowStatsProps {
  following: SocialUser[];
  followers: SocialUser[];
  onConnect?: (userId: string) => void;
}

function UserRow({ user, onConnect }: { user: SocialUser; onConnect?: (id: string) => void }) {
  const initials = user.username
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fog text-xs font-bold text-ink">
        {initials}
      </div>
      <span className="flex-1 truncate text-sm font-medium text-ink">{user.username}</span>
      {onConnect && (
        <button
          type="button"
          onClick={() => onConnect(user.id)}
          className="shrink-0 rounded-btn bg-mint px-3 py-1 text-xs font-semibold text-ink hover:bg-fog"
        >
          Conectar
        </button>
      )}
    </div>
  );
}

export function FollowStats({ following, followers, onConnect }: FollowStatsProps) {
  return (
    <div className="rounded-card border border-surface-raised bg-surface-card p-6 shadow-sm">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-center text-xs font-bold uppercase tracking-wider text-storm">
            Siguiendo
          </h3>
          <p className="mt-1 text-center text-2xl font-bold text-ink">{following.length}</p>
        </div>
        <div>
          <h3 className="text-center text-xs font-bold uppercase tracking-wider text-storm">
            Seguidores
          </h3>
          <p className="mt-1 text-center text-2xl font-bold text-ink">{followers.length}</p>
        </div>
      </div>

      <div className="mt-6 border-t border-surface-raised pt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-storm">Siguiendo</p>
        <div className="space-y-1">
          {following.slice(0, 3).map((u) => (
            <UserRow key={u.id} user={u} onConnect={onConnect} />
          ))}
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          className="w-full rounded-btn bg-mint px-4 py-2 text-sm font-semibold text-ink hover:bg-fog"
        >
          Conectar
        </button>
      </div>
    </div>
  );
}

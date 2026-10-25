"use client";

import { useState } from "react";
import type { SocialUser } from "@/domain/profile/social";
import { FollowButton } from "./FollowButton";
import { UserAvatar } from "@/components/ui/UserAvatar";

interface FollowStatsProps {
  following: SocialUser[];
  followers: SocialUser[];
  onConnect?: (userId: string) => void;
  onOpenConecta?: () => void;
}

function UserRow({ user }: { user: SocialUser }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <UserAvatar username={user.username} avatarUrl={user.avatar_url} size="md" />
      <span className="flex-1 truncate text-sm font-semibold text-ink">{user.username}</span>
      <FollowButton targetUserId={user.id} />
    </div>
  );
}

export function FollowStats({ following, followers, onOpenConecta }: FollowStatsProps) {
  const [activeTab, setActiveTab] = useState<"following" | "followers">("following");
  const list = activeTab === "following" ? following : followers;

  return (
    <div className="rounded-card border border-surface-raised bg-surface-card p-8 shadow-md">
      <div className="grid grid-cols-2 gap-6">
        <button
          type="button"
          onClick={() => setActiveTab("following")}
          className={`rounded-btn px-4 py-4 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint ${
            activeTab === "following" ? "bg-mint text-ink" : "bg-surface text-storm hover:bg-surface-card"
          }`}
          aria-pressed={activeTab === "following"}
        >
          <h3 className="text-xs font-bold uppercase tracking-wider">Siguiendo</h3>
          <p className="mt-2 text-center text-3xl font-bold">{following.length}</p>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("followers")}
          className={`rounded-btn px-4 py-4 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint ${
            activeTab === "followers" ? "bg-mint text-ink" : "bg-surface text-storm hover:bg-surface-card"
          }`}
          aria-pressed={activeTab === "followers"}
        >
          <h3 className="text-xs font-bold uppercase tracking-wider">Seguidores</h3>
          <p className="mt-2 text-center text-3xl font-bold">{followers.length}</p>
        </button>
      </div>

      <div className="mt-8 border-t border-surface-raised pt-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-storm">
          {activeTab === "following" ? "Siguiendo" : "Seguidores"}
        </p>
        <div className="space-y-2">
          {list.slice(0, 5).map((u) => (
            <UserRow key={u.id} user={u} />
          ))}
          {list.length === 0 && (
            <p className="py-4 text-center text-sm text-storm">Aún no hay usuarios aquí.</p>
          )}
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

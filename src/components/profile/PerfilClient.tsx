"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { ProfileHero } from "./ProfileHero";
import { FollowStats } from "./FollowStats";
import { ConectaFloatingWidget } from "./ConectaFloatingWidget";
import { FriendsSection } from "./FriendsSection";
import { AvatarUpload } from "./AvatarUpload";
import { ProfileForm } from "./ProfileForm";
import type { SocialUser } from "@/domain/profile/social";

interface PerfilClientProps {
  profile: {
    username?: string | null;
    email?: string | null;
    avatar_url?: string | null;
    bio?: string | null;
    created_at?: string | null;
    gender?: string | null;
  };
  leaderboardRank: number | null;
  following: SocialUser[];
  followers: SocialUser[];
  suggested: SocialUser[];
  onAvatarUpload: (file: File) => Promise<void>;
  onProfileSave: (data: { username: string; bio: string; gender: "f" | "m" | "x" | null }) => Promise<void>;
}

export function PerfilClient({
  profile,
  leaderboardRank,
  following,
  followers,
  suggested,
  onAvatarUpload,
  onProfileSave,
}: PerfilClientProps) {
  const router = useRouter();
  const [conectaOpen, setConectaOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[560px_1fr] lg:items-start">
        <div>
          <ProfileHero
            username={profile.username}
            email={profile.email}
            avatar_url={profile.avatar_url}
            bio={profile.bio}
            created_at={profile.created_at ?? null}
            leaderboardRank={leaderboardRank}
            onEdit={() => setEditOpen(true)}
          />
        </div>
        <div>
          <FollowStats
            following={following}
            followers={followers}
            onOpenConecta={() => setConectaOpen(true)}
          />
        </div>
      </div>

      <ConectaFloatingWidget
        suggested={suggested}
        isOpen={conectaOpen}
        onClose={() => setConectaOpen(false)}
      />

      <div className="mt-8">
        <FriendsSection />
      </div>

      {/* Edit modal */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setEditOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Editar perfil"
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-card border border-surface-raised bg-surface-card p-6 shadow-xl md:p-8"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-ink">Editar perfil</h2>
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="rounded p-2 text-storm hover:bg-surface hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="rounded-card border border-surface-raised bg-surface p-6">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-storm">
                  Foto de perfil
                </h3>
                <AvatarUpload
                  currentAvatar={profile.avatar_url}
                  onUpload={async (file) => {
                    const formData = new FormData();
                    formData.append("avatar", file);
                    const res = await fetch("/api/profile/avatar", {
                      method: "POST",
                      body: formData,
                    });
                    const data = await res.json();
                    if (!res.ok) {
                      throw new Error(data.error || "Error al subir la foto");
                    }
                    router.refresh();
                  }}
                />
              </div>

              <div className="rounded-card border border-surface-raised bg-surface p-6">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-storm">
                  Información personal
                </h3>
                <ProfileForm
                  username={profile.username}
                  bio={profile.bio}
                  gender={profile.gender ?? null}
                  onSave={async (data) => {
                    await onProfileSave(data);
                    router.refresh();
                    setEditOpen(false);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { ProfileHero } from "@/components/profile/ProfileHero";
import { FollowStats } from "@/components/profile/FollowStats";
import { ConectaFloatingWidget } from "@/components/profile/ConectaFloatingWidget";

const MOCK_FOLLOWING = [
  { id: "1", username: "ana_bio" },
  { id: "2", username: "carlos_lab" },
  { id: "3", username: "sofia_gen" },
];
const MOCK_FOLLOWERS = [
  { id: "4", username: "lucia_ml" },
  { id: "5", username: "diego_data" },
  { id: "6", username: "vale_stat" },
];
const MOCK_SUGGESTED = [
  { id: "7", username: "mariana_ia" },
  { id: "8", username: "juan_crispr" },
  { id: "9", username: "camila_eco" },
  { id: "10", username: "pedro_prot" },
];

export default function PreviewPerfilFull() {
  return (
    <div className="min-h-screen bg-surface p-6 md:p-8">
      <div className="mx-auto max-w-[1379px]">
        <h1 className="font-display text-3xl font-bold text-ink">Mi Perfil</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[560px_1fr] lg:items-start">
          <div>
            <ProfileHero
              username="ana_bio"
              email="ana@invitro.code"
              avatar_url={null}
              bio="Estudiante de Biotecnología — explorando ML para análisis de secuencias."
              created_at="2024-03-15T10:00:00.000Z"
              leaderboardRank={7}
              level={4}
              totalXp={3420}
            />
          </div>
          <FollowStats following={MOCK_FOLLOWING} followers={MOCK_FOLLOWERS} />
        </div>

        <ConectaFloatingWidget suggested={MOCK_SUGGESTED} />
      </div>
    </div>
  );
}

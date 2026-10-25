"use client";

import { PerfilClient } from "@/components/profile/PerfilClient";

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
        <p className="mt-1 text-xs text-storm">Preview — mock sin auth (mismo layout que /perfil)</p>
        <div className="mt-8">
          <PerfilClient
            profile={{
              username: "ana_bio",
              email: "ana@invitro.code",
              avatar_url: null,
              bio: "Estudiante de Biotecnología — explorando ML para análisis de secuencias.",
              created_at: "2024-03-15T10:00:00.000Z",
              gender: null,
            }}
            leaderboardRank={7}
            following={MOCK_FOLLOWING}
            followers={MOCK_FOLLOWERS}
            suggested={MOCK_SUGGESTED}
            onAvatarUpload={async () => {
              alert("Preview: avatar upload mock");
            }}
            onProfileSave={async () => {
              alert("Preview: save mock");
            }}
          />
        </div>
      </div>
    </div>
  );
}

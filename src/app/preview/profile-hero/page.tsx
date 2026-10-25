"use client";

import { ProfileHero } from "@/components/profile/ProfileHero";
import { useState } from "react";

export default function PreviewProfileHero() {
  const [rank, setRank] = useState(7);
  return (
    <div className="min-h-screen bg-surface px-6 py-10">
      <div className="mx-auto max-w-[1379px]">
        <h1 className="font-display text-2xl font-bold text-ink">
          Preview — ProfileHero (T1-T2) — Excalidraw 621×440
        </h1>
        <p className="mt-1 text-sm text-storm">
          Hero del perfil: avatar 120px, Fecha de unión, Posición en leaderboard. Mock para revisión Playwright.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[621px_1fr]">
          <ProfileHero
            username="ana_bio"
            email="ana@invitro.code"
            avatar_url={null}
            bio="Estudiante de Biotecnología — explorando ML para análisis de secuencias. Apasionada por CRISPR y datos."
            created_at="2024-03-15T10:00:00.000Z"
            leaderboardRank={rank}
            level={4}
            totalXp={3420}
          />
          <div className="rounded-card border border-dashed border-surface-raised bg-surface-card p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-storm">
              Controles de prueba
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-ink">Rank</span>
              <input
                type="range"
                min={1}
                max={100}
                value={rank}
                onChange={(e) => setRank(Number(e.target.value))}
                className="w-40 accent-mint"
              />
              <span className="font-mono text-sm font-bold text-mint">#{rank}</span>
            </div>
            <p className="mt-2 text-xs text-storm">
              Verifica: avatar fallback iniciales, fecha “15 de marzo de 2024”, badge Nivel 4 / 3.420 XP, responsive.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-card border border-surface-raised bg-surface-card p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-storm">
            Estado sin datos (fallback)
          </p>
          <div className="mt-4">
            <ProfileHero username={null} email={null} avatar_url={null} bio={null} created_at={null} leaderboardRank={null} />
          </div>
        </div>
      </div>
    </div>
  );
}

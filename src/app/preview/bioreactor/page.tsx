"use client";

import { useState, useEffect } from "react";
import { BioreactorProgress } from "@/components/gamification/BioreactorProgress";

export default function PreviewBioreactor() {
  const [xp, setXp] = useState(340);
  const [playing, setPlaying] = useState(true);
  const progressPercentage = Math.min(100, (xp / 400) * 100);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setXp((e) => (e >= 400 ? 0 : e + 18));
    }, 900);
    return () => clearInterval(id);
  }, [playing]);

  return (
    <div className="min-h-screen bg-surface px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-display text-2xl font-bold">Preview — BioreactorProgress</h1>
        <p className="mt-1 text-sm text-storm">
          Canonical DOM bubble layer · pool 12–16 · {Math.round(progressPercentage)}% ·{" "}
          {playing ? "animando" : "pausado"}
        </p>

        <div className="mt-8 flex flex-col items-center gap-8">
          <div className="glass-card flex flex-col items-center gap-4 rounded-2xl p-8 md:flex-row md:gap-10">
            {/* The layer is absolutely positioned, so every host must be
                `relative` with a real size — that is the whole contract. */}
            <div className="relative h-48 w-40 overflow-hidden rounded-2xl bg-surface-raised/40">
              <BioreactorProgress progressPercentage={progressPercentage} />
            </div>
            <div className="text-center md:text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-storm">Demo controls</p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => setPlaying((v) => !v)}
                  className="rounded-full bg-mint px-4 py-2 text-sm font-bold text-ink hover:opacity-90"
                >
                  {playing ? "Pausar" : "Animar"}
                </button>
                <input
                  type="range"
                  min={0}
                  max={400}
                  value={xp}
                  onChange={(e) => setXp(Number(e.target.value))}
                  className="w-40 accent-mint"
                />
                <span className="font-mono text-sm font-bold text-mint">{xp} / 400</span>
              </div>
              <p className="mt-2 text-xs text-storm">
                Arrastra el slider o deja el loop 0→400 para ver cómo crece la densidad de burbujas.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-4">
            <div className="glass-card rounded-xl p-4">
              <p className="mb-2 text-xs font-bold text-storm">Barra (como XPBar / ModuleProgress)</p>
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-surface-raised">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-fog to-mint"
                  style={{ width: `${progressPercentage}%` }}
                />
                <BioreactorProgress progressPercentage={progressPercentage} />
              </div>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="mb-2 text-xs font-bold text-storm">Panel ancho</p>
              <div className="relative h-24 w-full overflow-hidden rounded-xl bg-surface-raised/40">
                <BioreactorProgress progressPercentage={100} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

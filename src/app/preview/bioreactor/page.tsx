"use client";

import { useState, useEffect } from "react";
import { BioreactorProgress } from "@/components/dashboard/BioreactorProgress";

export default function PreviewBioreactor() {
  const [exp, setExp] = useState(340);
  const expToNext = 400;
  const level = 4;
  const rank = "Investigador Jr.";
  const progressToNext = exp;

  const [playing, setPlaying] = useState(true);
  const percent = Math.min(100, (progressToNext / expToNext) * 100);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setExp((e) => (e >= 400 ? 40 : e + 18));
    }, 900);
    return () => clearInterval(id);
  }, [playing]);

  return (
    <div className="min-h-screen bg-surface px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-display text-2xl font-bold">Preview — BioreactorProgress</h1>
        <p className="mt-1 text-sm text-storm">
          Vessel 160×220 md · fill fog→mint · burbujeo continuo · {Math.round(percent)}% · {playing ? "animando" : "pausado"}
        </p>

        <div className="mt-8 flex flex-col items-center gap-8">
          <div className="glass-card flex flex-col items-center gap-4 rounded-2xl p-8 md:flex-row md:gap-10">
            <BioreactorProgress
              exp={exp}
              expToNext={expToNext}
              level={exp >= 400 ? 5 : level}
              rank={exp >= 400 ? "Investigador" : rank}
              progressToNext={progressToNext}
              size="md"
              state={exp >= 400 ? "levelUp" : percent > 80 ? "filling" : "idle"}
            />
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
                  value={exp}
                  onChange={(e) => setExp(Number(e.target.value))}
                  className="w-40 accent-mint"
                />
                <span className="font-mono text-sm font-bold text-mint">{exp} EXP</span>
              </div>
              <p className="mt-2 text-xs text-storm">Arrastra el slider o deja el loop 40→400 para ver idle → filling → levelUp.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="glass-card rounded-xl p-4">
              <p className="mb-2 text-center text-xs font-bold text-storm">sm 96×132</p>
              <BioreactorProgress exp={120} expToNext={400} level={2} rank="Aprendiz" progressToNext={120} size="sm" />
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="mb-2 text-center text-xs font-bold text-storm">lg 220×300</p>
              <BioreactorProgress exp={340} expToNext={400} level={4} rank="Investigador Jr." progressToNext={340} size="lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

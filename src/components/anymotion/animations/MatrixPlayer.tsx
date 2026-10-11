"use client";

import { AnymotionStage } from "../AnymotionStage";
import { Dna } from "lucide-react";

interface MatrixPlayerProps {
  caption?: string;
  controls?: boolean;
  autoPlay?: boolean;
}

const MATRIX = [
  [142, 67, 201],
  [89, 210, 45],
  [178, 33, 99],
];

export function MatrixPlayer({ caption }: MatrixPlayerProps) {
  return (
    <figure className="my-5">
      <AnymotionStage title="Cerebro vs matriz de numeros">
        <div className="flex h-full w-full items-center justify-center gap-8 bg-gradient-to-br from-[#0a0a0a] to-[#141414] p-8 sm:gap-12">
          {/* Left: biological */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-mint/40 bg-mint/10 transition-transform hover:scale-[1.02] sm:h-24 sm:w-24">
              <Dna className="h-10 w-10 text-mint sm:h-12 sm:w-12" aria-hidden />
            </div>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-white sm:text-xs">
              Imagen
            </span>
            <span className="max-w-[12ch] text-center font-mono text-[10px] leading-tight text-white/60">
              Lo que ve el ojo
            </span>
          </div>

          {/* Center arrow */}
          <div className="flex flex-col items-center gap-1">
            <div className="h-0.5 w-14 bg-gradient-to-r from-mint to-brand-500 sm:w-20" style={{ animation: "draw-line 1s ease-out both" }} />
            <span className="font-mono text-[9px] tracking-widest text-white/50">convierte</span>
            <div className="h-2 w-2 rotate-45 border-r-2 border-t-2 border-brand-400" style={{ animation: "fade-in 0.6s 0.9s both" }} aria-hidden />
          </div>

          {/* Right: matrix */}
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-lg border border-brand-300/20 bg-white/[0.04] p-2 backdrop-blur">
              <div className="grid grid-cols-3 gap-1">
                {MATRIX.flat().map((val, i) => (
                  <div
                    key={i}
                    className="flex h-8 w-10 items-center justify-center rounded bg-brand-500/15 font-mono text-[11px] font-semibold text-brand-300 sm:h-9 sm:w-12 sm:text-xs"
                    style={{
                      animation: `matrix-cell 1.8s ease-in-out ${i * 0.12}s both`,
                    }}
                  >
                    {val}
                  </div>
                ))}
              </div>
              <p className="mt-1.5 text-center font-mono text-[8px] uppercase tracking-widest text-white/40">
                Matriz 3 x 3
              </p>
            </div>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-white sm:text-xs">
              Numeros
            </span>
            <span className="max-w-[12ch] text-center font-mono text-[10px] leading-tight text-white/60">
              Lo que ve la IA
            </span>
          </div>
        </div>
      </AnymotionStage>
      {caption && <figcaption className="mt-2 text-center font-mono text-[11px] text-storm">{caption}</figcaption>}
      <style>{`@keyframes draw-line { from { transform: scaleX(0); opacity: 0; } to { transform: scaleX(1); opacity: 1; } } @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } } @keyframes matrix-cell { 0% { opacity: 0.7; background-color: rgba(0,181,197,0.12); } 50% { opacity: 1; background-color: rgba(69,220,198,0.28); } 100% { opacity: 0.85; background-color: rgba(0,181,197,0.16); } } @media (prefers-reduced-motion: reduce) { div[style*="matrix-cell"], div[style*="draw-line"], div[style*="fade-in"] { animation: none !important; } }`}</style>
    </figure>
  );
}

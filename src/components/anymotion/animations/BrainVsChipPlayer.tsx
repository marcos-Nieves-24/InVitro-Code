"use client";

import { AnymotionStage } from "../AnymotionStage";
import { Brain, Cpu } from "lucide-react";

interface BrainVsChipPlayerProps {
  caption?: string;
  controls?: boolean;
  autoPlay?: boolean;
}

export function BrainVsChipPlayer({ caption }: BrainVsChipPlayerProps) {
  return (
    <figure className="my-5">
      <AnymotionStage title="IA vs inteligencia natural">
        <div className="flex h-full w-full items-center justify-center gap-6 bg-[#0a0a0a] p-6 sm:gap-8">
          {/* Left: human */}
          <div className="flex flex-col items-center gap-2 animate-pulse">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-mint/40 bg-mint/10 sm:h-20 sm:w-20">
              <Brain className="h-8 w-8 text-mint sm:h-10 sm:w-10" aria-hidden />
            </div>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-white sm:text-xs">
              Humana
            </span>
            <span className="max-w-[10ch] text-center font-mono text-[10px] leading-tight text-white/60">
              Intuicion visual
            </span>
          </div>

          {/* Center: animated connection */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1">
              <div className="h-0.5 w-10 origin-left bg-gradient-to-r from-mint to-brand-500 sm:w-14" style={{ animation: "draw-line 1s ease-out both" }} />
              <div className="h-2 w-2 rotate-45 border-r-2 border-t-2 border-brand-400" style={{ animation: "fade-in 0.6s 0.9s both" }} aria-hidden />
            </div>
            <div className="flex items-center gap-1 opacity-60">
              <div className="h-2 w-2 rotate-45 border-b-2 border-l-2 border-white/40" style={{ animation: "fade-in 0.6s 1.1s both" }} aria-hidden />
              <div className="h-px w-10 origin-left bg-gradient-to-l from-white/30 to-transparent sm:w-14" style={{ animation: "draw-line 1s 0.3s ease-out both" }} />
            </div>
            <span className="font-mono text-[9px] text-white/40">vs</span>
          </div>

          {/* Right: artificial */}
          <div className="flex flex-col items-center gap-2" style={{ animation: "pulse 2s ease-in-out 0.5s infinite" }}>
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-brand-300/40 bg-brand-500/10 sm:h-20 sm:w-20">
              <Cpu className="h-8 w-8 text-brand-300 sm:h-10 sm:w-10" aria-hidden />
            </div>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-white sm:text-xs">
              Artificial
            </span>
            <span className="max-w-[10ch] text-center font-mono text-[10px] leading-tight text-white/60">
              Patrones estadisticos
            </span>
          </div>
        </div>
      </AnymotionStage>
      {caption && <figcaption className="mt-2 text-center font-mono text-[11px] text-storm">{caption}</figcaption>}
      <style>{`@keyframes draw-line { from { transform: scaleX(0); opacity: 0; } to { transform: scaleX(1); opacity: 1; } } @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </figure>
  );
}

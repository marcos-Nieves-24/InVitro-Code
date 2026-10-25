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
        <div className="flex h-full w-full items-center justify-center gap-8 bg-gradient-to-br from-[#0a0a0a] to-[#141414] p-8 sm:gap-12">
          {/* Left: human */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-mint/40 bg-mint/10 transition-transform hover:scale-[1.02] sm:h-24 sm:w-24">
              <Brain className="h-10 w-10 text-mint sm:h-12 sm:w-12" aria-hidden />
            </div>
            <span className="font-mono text-sm font-semibold uppercase tracking-widest text-white sm:text-sm">
              Humana
            </span>
            <span className="max-w-[10ch] text-center font-mono text-sm leading-tight text-white/60">
              Intuicion visual
            </span>
          </div>

          {/* Center: animated connection — loop */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1">
              <div className="h-0.5 w-14 origin-left bg-gradient-to-r from-mint to-brand-500 sm:w-20" style={{ animation: "draw-line 1.8s ease-in-out infinite" }} />
              <div className="h-2 w-2 rotate-45 border-r-2 border-t-2 border-brand-400" style={{ animation: "fade-in 1.8s ease-in-out infinite" }} aria-hidden />
            </div>
            <div className="flex items-center gap-1 opacity-60">
              <div className="h-2 w-2 rotate-45 border-b-2 border-l-2 border-white/40" style={{ animation: "fade-in 1.8s ease-in-out infinite" }} aria-hidden />
              <div className="h-px w-14 origin-left bg-gradient-to-l from-white/30 to-transparent sm:w-20" style={{ animation: "draw-line 1.8s ease-in-out 0.3s infinite" }} />
            </div>
            <span className="font-mono text-sm text-white/40">vs</span>
          </div>

          {/* Right: artificial */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-brand-300/40 bg-brand-500/10 transition-transform hover:scale-[1.02] sm:h-24 sm:w-24">
              <Cpu className="h-10 w-10 text-brand-300 sm:h-12 sm:w-12" aria-hidden />
            </div>
            <span className="font-mono text-sm font-semibold uppercase tracking-widest text-white sm:text-sm">
              Artificial
            </span>
            <span className="max-w-[10ch] text-center font-mono text-sm leading-tight text-white/60">
              Patrones estadisticos
            </span>
          </div>
        </div>
      </AnymotionStage>
      {caption && <figcaption className="mt-2 text-center font-mono text-sm text-storm">{caption}</figcaption>}
      <style>{`@keyframes draw-line { from { transform: scaleX(0); opacity: 0; } to { transform: scaleX(1); opacity: 1; } } @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </figure>
  );
}

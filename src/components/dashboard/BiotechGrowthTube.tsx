"use client";

import { CSSProperties, useEffect, useId, useMemo, useRef, useState } from "react";

export type BiotechGrowthTubeProps = {
  exp: number;
  maxExp?: number;
  label?: string;
  size?: number | string;
  className?: string;
  onComplete?: () => void;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function BiotechGrowthTube({
  exp,
  maxExp = 1000,
  label = "Plant growth progress",
  size = 320,
  className,
  onComplete,
}: BiotechGrowthTubeProps) {
  const safeMax = Math.max(1, maxExp);
  const progress = clamp(exp / safeMax, 0, 1);
  const previousProgress = useRef(progress);
  const [levelUp, setLevelUp] = useState(false);
  const id = useId().replace(/:/g, "");

  useEffect(() => {
    if (progress === 1 && previousProgress.current < 1) {
      setLevelUp(true);
      onComplete?.();
      const timer = window.setTimeout(() => setLevelUp(false), 1000);
      return () => window.clearTimeout(timer);
    }
    previousProgress.current = progress;
  }, [progress, onComplete]);

  const scene = useMemo(() => {
    const liquidTop = 333 - progress * 55;
    const stemTop = 308 - progress * 142;
    const stemLength = 308 - stemTop;
    const leafScale = 0.22 + progress * 0.78;
    const hasPair = progress >= 0.24;
    const hasTopLeaf = progress >= 0.72;
    return { liquidTop, stemTop, stemLength, leafScale, hasPair, hasTopLeaf };
  }, [progress]);

  const ariaText = `${label}: ${Math.round(progress * 100)}% complete, ${Math.round(exp)} of ${safeMax} EXP.`;
  const style = { "--bg": "#061423", "--cyan": "#73f5ff" } as CSSProperties;

  return (
    <div className={className} style={{ width: size, maxWidth: "100%", ...style }} aria-label={ariaText}>
      <style>{`
        .bgt-root { display:block; width:100%; height:auto; overflow:visible; }
        .bgt-root * { vector-effect: non-scaling-stroke; }
        .bgt-liquid, .bgt-stem, .bgt-leaf { transition: all 900ms cubic-bezier(.2,.85,.25,1); }
        .bgt-bubble { animation: bgt-rise 4.2s ease-in infinite; transform-box: fill-box; transform-origin: center; }
        .bgt-bubble--two { animation-delay:-1.2s; animation-duration:5s; }
        .bgt-bubble--three { animation-delay:-2.5s; animation-duration:4.6s; }
        .bgt-leaf { transform-box: fill-box; transform-origin: bottom center; }
        .bgt-sway { animation: bgt-sway 4.5s ease-in-out infinite; transform-origin: 160px 308px; }
        .bgt-surface { animation: bgt-ripple 4s ease-in-out infinite; }
        .bgt-complete { animation: bgt-complete 1s ease-out both; transform-origin:160px 300px; }
        @keyframes bgt-rise { 0%{opacity:0;transform:translateY(0)} 15%{opacity:.7} 86%{opacity:.45} 100%{opacity:0;transform:translateY(-52px)} }
        @keyframes bgt-sway { 0%,100%{transform:rotate(-1.5deg)} 50%{transform:rotate(1.5deg)} }
        @keyframes bgt-ripple { 0%,100%{transform:scaleX(.98)} 50%{transform:scaleX(1.02)} }
        @keyframes bgt-complete { 0%{filter:brightness(1)} 45%{filter:brightness(1.38) drop-shadow(0 0 13px #67f7ff)} 100%{filter:brightness(1)} }
        @media (prefers-reduced-motion: reduce) { .bgt-root * { animation:none!important; transition:none!important; } }
      `}</style>
      <svg className="bgt-root" viewBox="0 0 320 420" role="img" aria-labelledby={`bgt-title-${id} bgt-desc-${id}`}>
        <title id={`bgt-title-${id}`}>{label}</title>
        <desc id={`bgt-desc-${id}`}>A glass laboratory tube with a cyan nutrient solution and a seedling whose growth reflects experience progress.</desc>
        <defs>
          <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#081827"/><stop offset="1" stopColor="#030a13"/></linearGradient>
          <linearGradient id={`glass-${id}`} x1="0" y1="0" x2="1" y2="0"><stop stopColor="#86f7ff" stopOpacity=".48"/><stop offset=".15" stopColor="#f4ffff" stopOpacity=".08"/><stop offset=".53" stopColor="#20c9df" stopOpacity=".035"/><stop offset=".86" stopColor="#ffffff" stopOpacity=".08"/><stop offset="1" stopColor="#91f9ff" stopOpacity=".44"/></linearGradient>
          <linearGradient id={`liquid-${id}`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#a6ffff" stopOpacity=".86"/><stop offset=".24" stopColor="#64edf5" stopOpacity=".8"/><stop offset="1" stopColor="#129cc8" stopOpacity=".65"/></linearGradient>
          <linearGradient id={`leaf-${id}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#b4f28a"/><stop offset=".5" stopColor="#62bf66"/><stop offset="1" stopColor="#2b744b"/></linearGradient>
          <radialGradient id={`pool-${id}`}><stop stopColor="#6df5ff" stopOpacity=".5"/><stop offset="1" stopColor="#33ddec" stopOpacity="0"/></radialGradient>
          <filter id={`soft-${id}`} x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="9"/></filter>
          <filter id={`glow-${id}`} x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <clipPath id={`clip-${id}`}><path d="M84 86H236V304a56 56 0 0 1-56 56h-40a56 56 0 0 1-56-56Z"/></clipPath>
        </defs>
        {/* fondo removido — solo tubo transparente */}
        <g opacity="0" aria-hidden="true">
          <rect width="320" height="420" rx="28" fill={`url(#bg-${id})`} />
          <ellipse cx="160" cy="365" rx="112" ry="33" fill={`url(#pool-${id})`} filter={`url(#soft-${id})`} />
        </g>
        <g className={levelUp ? "bgt-complete" : undefined}>
          <path d="M84 86H236V304a56 56 0 0 1-56 56h-40a56 56 0 0 1-56-56Z" fill={`url(#glass-${id})`} stroke="#8af7ff" strokeOpacity=".76" strokeWidth="2.5" />
          <g clipPath={`url(#clip-${id})`}>
            <path className="bgt-liquid" d={`M78 ${scene.liquidTop + 8} Q118 ${scene.liquidTop - 4} 160 ${scene.liquidTop + 4} T242 ${scene.liquidTop + 8} V374 H78Z`} fill={`url(#liquid-${id})`} />
            <path className="bgt-surface" d={`M79 ${scene.liquidTop + 8} Q118 ${scene.liquidTop - 4} 160 ${scene.liquidTop + 4} T241 ${scene.liquidTop + 8}`} fill="none" stroke="#dcffff" strokeWidth="1.6" opacity=".9" />
            <circle className="bgt-bubble" cx="125" cy="328" r="2.4" fill="#e2ffff"/><circle className="bgt-bubble bgt-bubble--two" cx="196" cy="338" r="3" fill="#e2ffff"/><circle className="bgt-bubble bgt-bubble--three" cx="174" cy="350" r="1.6" fill="#e2ffff"/>
            <g className="bgt-sway">
              <path className="bgt-stem" d={`M160 310 C160 270, 160 ${scene.stemTop + 24}, 160 ${scene.stemTop}`} fill="none" stroke="#6cc678" strokeWidth="3.2" strokeLinecap="round" />
              {scene.hasPair && <g opacity={clamp((progress - .24) / .28, 0, 1)}>
                <path className="bgt-leaf" d="M158 239 C134 238 120 220 126 198 C151 201 165 216 158 239Z" fill={`url(#leaf-${id})`} transform={`translate(0 ${scene.stemTop - 166}) scale(${scene.leafScale}) translate(0 ${-(scene.stemTop - 166)})`} />
                <path className="bgt-leaf" d="M162 229 C169 203 188 189 211 192 C206 216 187 232 162 229Z" fill={`url(#leaf-${id})`} transform={`translate(0 ${scene.stemTop - 166}) scale(${scene.leafScale}) translate(0 ${-(scene.stemTop - 166)})`} />
              </g>}
              {scene.hasTopLeaf && <path className="bgt-leaf" d="M160 184 C147 169 151 149 162 138 C177 153 176 171 160 184Z" fill={`url(#leaf-${id})`} opacity={clamp((progress - .72) / .28, 0, 1)} transform={`translate(0 ${scene.stemTop - 138}) scale(${scene.leafScale}) translate(0 ${-(scene.stemTop - 138)})`} />}
            </g>
          </g>
          <path d="M95 104V290c0 24 6 42 20 53" fill="none" stroke="#e9ffff" strokeOpacity=".42" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M225 109V286c0 15-3 29-9 39" fill="none" stroke="#b8ffff" strokeOpacity=".2" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="160" cy="86" rx="77" ry="14" fill="#0d3d56" fillOpacity=".35" stroke="#9afaff" strokeWidth="2.5" />
          <ellipse cx="160" cy="86" rx="68" ry="8" fill="#04111d" fillOpacity=".65" stroke="#e7ffff" strokeOpacity=".55" strokeWidth="1.4" />
          <path d="M89 91c4 4 11 6 18 7" fill="none" stroke="#fff" strokeOpacity=".56" strokeWidth="1.5" strokeLinecap="round" />
        </g>
        <text x="160" y="402" textAnchor="middle" fill="#bcecf2" opacity=".82" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="11" letterSpacing="1.3">{Math.round(progress * 100)}% GROWTH</text>
      </svg>
    </div>
  );
}

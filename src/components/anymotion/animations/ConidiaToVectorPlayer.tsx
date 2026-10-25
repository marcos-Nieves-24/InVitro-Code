"use client";

import { AnymotionStage } from "../AnymotionStage";
import { AnymotionControls } from "../AnymotionControls";
import { useAnymotionTimeline } from "../hooks/useAnymotionTimeline";

interface ConidiaToVectorPlayerProps {
  caption?: string;
  autoPlay?: boolean;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function fade(p: number, start: number, dur: number): number {
  return clamp01((p - start) / dur);
}

function eased(p: number, start: number, dur: number): number {
  const t = fade(p, start, dur);
  return 1 - Math.pow(1 - t, 3);
}

export function ConidiaToVectorPlayer({ caption, autoPlay = true }: ConidiaToVectorPlayerProps) {
  const timeline = useAnymotionTimeline({ duration: 2.5, autoPlay });
  const p = timeline.progress;

  // Sequential opacities
  const areaO = eased(p, 0.0, 0.3);
  const circO = eased(p, 0.3, 0.2);
  const texturaO = eased(p, 0.5, 0.2);
  const intensidadO = eased(p, 0.7, 0.2);
  const completeO = eased(p, 0.9, 0.1);

  const arrowO = eased(p, 0.18, 0.22);
  const vectorBoxO = eased(p, 0.12, 0.25);

  // Vector number opacities
  const nArea = eased(p, 0.0, 0.18);
  const nCirc = eased(p, 0.3, 0.15);
  const nText = eased(p, 0.5, 0.15);
  const nInt = eased(p, 0.7, 0.15);

  return (
    <figure className="my-5">
      <AnymotionStage title="Conidia a vector">
        <svg viewBox="0 0 800 450" className="h-full w-full bg-[#0a0a0a]" role="img" aria-label="Conidia a vector">
          {/* Subtle grid */}
          <g opacity={0.04}>
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`v-${i}`} x1={80 + i * 80} y1={20} x2={80 + i * 80} y2={430} stroke="white" strokeWidth={0.5} />
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={`h-${i}`} x1={20} y1={60 + i * 80} x2={780} y2={60 + i * 80} stroke="white" strokeWidth={0.5} />
            ))}
          </g>

          {/* === LEFT: Conidia === */}
          <g>
            {/* Conidia base circle */}
            <circle cx={170} cy={190} r={72} fill="none" stroke="#45dcc6" strokeWidth={2.2} opacity={0.9} />
            <circle cx={170} cy={190} r={58} fill="#45dcc6" opacity={0.06} />
            {/* Texture dots inside conidia */}
            <g opacity={texturaO}>
              <circle cx={150} cy={175} r={4} fill="#00b5c5" opacity={0.9} />
              <circle cx={175} cy={165} r={3} fill="#00b5c5" opacity={0.75} />
              <circle cx={188} cy={192} r={4.5} fill="#00b5c5" opacity={0.8} />
              <circle cx={165} cy={210} r={3.2} fill="#00b5c5" opacity={0.7} />
              <circle cx={142} cy={202} r={2.5} fill="#00b5c5" opacity={0.6} />
              <circle cx={182} cy={215} r={3} fill="#00b5c5" opacity={0.65} />
            </g>
            {/* Inner intensity shading */}
            <circle cx={170} cy={190} r={50} fill="white" opacity={intensidadO * 0.08} />

            {/* Area calipers — horizontal measurement */}
            <g opacity={areaO}>
              {/* baseline */}
              <line x1={98} y1={285} x2={242} y2={285} stroke="#f59e0b" strokeWidth={1.4} opacity={0.95} />
              {/* left arrow */}
              <path d="M98 285 L108 280 L108 290 Z" fill="#f59e0b" />
              {/* right arrow */}
              <path d="M242 285 L232 280 L232 290 Z" fill="#f59e0b" />
              {/* vertical ticks */}
              <line x1={98} y1={268} x2={98} y2={298} stroke="#f59e0b" strokeWidth={1} opacity={0.7} />
              <line x1={242} y1={268} x2={242} y2={298} stroke="#f59e0b" strokeWidth={1} opacity={0.7} />
              <text x={170} y={304} textAnchor="middle" fill="#f59e0b" fontSize={14} fontFamily="monospace" fontWeight={600}>
                Area
              </text>
              <text x={170} y={316} textAnchor="middle" fill="white" fontSize={12} fontFamily="monospace" opacity={0.55}>
                12.3 um2
              </text>
            </g>

            {/* Circularidad — dashed outline + label */}
            <g opacity={circO}>
              <circle cx={170} cy={190} r={82} fill="none" stroke="#a78bfa" strokeWidth={1.3} strokeDasharray="7 5" opacity={0.9} />
              <text x={170} y={128} textAnchor="middle" fill="#a78bfa" fontSize={14} fontFamily="monospace" fontWeight={600}>
                Circularidad
              </text>
              <text x={170} y={140} textAnchor="middle" fill="white" fontSize={12} fontFamily="monospace" opacity={0.55}>
                0.87
              </text>
            </g>

            {/* Labels for textura / intensidad at bottom of left panel */}
            <g opacity={texturaO}>
              <text x={88} y={350} fill="#00b5c5" fontSize={13} fontFamily="monospace" fontWeight={600}>
                textura
              </text>
              <text x={88} y={362} fill="white" fontSize={12} fontFamily="monospace" opacity={0.6}>
                42
              </text>
            </g>
            <g opacity={intensidadO}>
              <text x={210} y={350} fill="#f472b6" fontSize={13} fontFamily="monospace" fontWeight={600}>
                intensidad
              </text>
              <text x={210} y={362} fill="white" fontSize={12} fontFamily="monospace" opacity={0.6}>
                128
              </text>
            </g>

            {/* Left panel title */}
            <text x={170} y={42} textAnchor="middle" fill="white" fontSize={13} fontFamily="sans-serif" fontWeight={700} opacity={0.92}>
              Conidia
            </text>
            <text x={170} y={58} textAnchor="middle" fill="white" fontSize={12} fontFamily="monospace" opacity={0.45}>
              imagen microscopio
            </text>
          </g>

          {/* === CENTER: Arrow === */}
          <g opacity={arrowO} transform={`translate(${(1 - arrowO) * -8},0)`}>
            <line x1={310} y1={190} x2={400} y2={190} stroke="white" strokeWidth={1.8} opacity={0.85} />
            <polygon points="400,190 388,182 388,198" fill="white" opacity={0.9} />
            <text x={355} y={178} textAnchor="middle" fill="white" fontSize={12} fontFamily="monospace" opacity={0.5} letterSpacing="0.08em">
              extrae
            </text>
          </g>

          {/* === RIGHT: Vector === */}
          <g opacity={vectorBoxO}>
            <text x={580} y={42} textAnchor="middle" fill="white" fontSize={13} fontFamily="sans-serif" fontWeight={700} opacity={0.92}>
              Vector
            </text>
            <text x={580} y={58} textAnchor="middle" fill="white" fontSize={12} fontFamily="monospace" opacity={0.45}>
              numeros para la IA
            </text>

            {/* Vector box */}
            <rect x={410} y={88} width={340} height={220} rx={14} fill="white" opacity={0.04} stroke="white" strokeOpacity={0.12} strokeWidth={1} />
            {/* Bracket / vector display */}
            <text x={428} y={158} fill="white" fontSize={22} fontFamily="monospace" opacity={0.35}>
              [
            </text>
            <text x={722} y={158} fill="white" fontSize={22} fontFamily="monospace" opacity={0.35}>
              ]
            </text>

            {/* Four numbers with per-slot reveal */}
            <g fontFamily="monospace" fontSize={18} fontWeight={600}>
              <text x={448} y={162} fill="#f59e0b" opacity={nArea}>
                12.3
              </text>
              <text x={512} y={162} fill="white" fontSize={16} opacity={0.3}>
                ,
              </text>
              <text x={528} y={162} fill="#a78bfa" opacity={nCirc}>
                0.87
              </text>
              <text x={584} y={162} fill="white" fontSize={16} opacity={0.3}>
                ,
              </text>
              <text x={600} y={162} fill="#00b5c5" opacity={nText}>
                42
              </text>
              <text x={634} y={162} fill="white" fontSize={16} opacity={0.3}>
                ,
              </text>
              <text x={650} y={162} fill="#f472b6" opacity={nInt}>
                128
              </text>
            </g>

            {/* Labels under vector */}
            <g fontFamily="monospace" fontSize={12} textAnchor="middle">
              <text x={466} y={188} fill="#f59e0b" opacity={nArea * 0.85}>area</text>
              <text x={546} y={188} fill="#a78bfa" opacity={nCirc * 0.85}>circ.</text>
              <text x={612} y={188} fill="#00b5c5" opacity={nText * 0.85}>text.</text>
              <text x={668} y={188} fill="#f472b6" opacity={nInt * 0.85}>inten.</text>
            </g>

            {/* Complete check when done */}
            <g opacity={completeO}>
              <rect x={488} y={210} width={184} height={28} rx={14} fill="#00b5c5" opacity={0.14} />
              <text x={580} y={228} textAnchor="middle" fill="#45dcc6" fontSize={14} fontFamily="monospace" fontWeight={700}>
                vector listo
              </text>
            </g>

            {/* Feature count hint */}
            <text x={580} y={342} textAnchor="middle" fill="white" fontSize={13} fontFamily="monospace" opacity={0.38}>
              4 features  4 dimensiones
            </text>
          </g>
        </svg>
      </AnymotionStage>
      <AnymotionControls timeline={timeline} label="Conidia a vector" />
      {caption && <figcaption className="mt-2 text-center font-mono text-sm text-storm">{caption}</figcaption>}
    </figure>
  );
}

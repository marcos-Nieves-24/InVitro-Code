"use client";

import { AnymotionStage } from "../AnymotionStage";
import { AnymotionControls } from "../AnymotionControls";
import { useAnymotionTimeline } from "../hooks/useAnymotionTimeline";

interface PipelineStagesPlayerProps {
  caption?: string;
  autoPlay?: boolean;
}

/**
 * Explanatory animation for the ML pipeline in biotechnology.
 *
 * The stage names, their biotech examples and their wording come verbatim from
 * the lesson table this animation replaces. A static table flattens a sequence
 * into six independent rows; here the sequence is felt: a token travels along
 * the chain and each stage lights up as the token passes through it, so the
 * student sees that every stage transforms the output of the previous one.
 *
 * Deterministic by construction: the stage data is a module constant, the text
 * wrapping is a pure function of that data, and every property of a frame
 * descends from `timeline.progress`. No `Math.random()` anywhere — scrubbing to
 * any t renders exactly the same frame on every client and during SSR.
 */

type Stage = {
  /** Stage name, as written in the lesson. */
  name: string;
  /** Biotech example for this stage, as written in the lesson. */
  detail: string;
};

const STAGES: Stage[] = [
  { name: "Datos", detail: "Secuencias, imágenes microscopía, PDB, datos ómicos" },
  { name: "Limpieza", detail: "Lotes de laboratorio, errores de medición, bias de equipos" },
  { name: "Features", detail: "Fingerprints moleculares, perfiles evolutivos, descriptores de forma" },
  { name: "Modelo", detail: "AlphaFold, CNN para imágenes, modelos de predicción de interacciones" },
  { name: "Validación", detail: "RMSD, sensibilidad/especificidad, validación cruzada por laboratorio" },
  { name: "Interpretación", detail: "SHAP para entender qué features importan" },
];

const COUNT = STAGES.length;

// ---------------------------------------------------------------------------
// Text wrapping — pure and deterministic (no measurement, no randomness)
// ---------------------------------------------------------------------------

/** Greedy word wrap against a character budget, so identical input yields
 *  identical lines on every render and every client. */
function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
      continue;
    }
    if (current) lines.push(current);
    // A single word longer than the budget still has to go somewhere.
    current = word;
  }
  if (current) lines.push(current);
  return lines;
}

const DETAIL_CHARS_PER_LINE = 17;
const DETAIL_LINES = STAGES.map((s) => wrapText(s.detail, DETAIL_CHARS_PER_LINE));

// ---------------------------------------------------------------------------
// Geometry (single 16:9 viewBox — no hardcoded pixel widths)
// ---------------------------------------------------------------------------

const VB_W = 1024;
const VB_H = 520;

const CARD_W = 148;
const CARD_GAP = 14;
const CARD_TOP = 96;
const CARD_H = 300;
const TOTAL_W = COUNT * CARD_W + (COUNT - 1) * CARD_GAP;
const START_X = (VB_W - TOTAL_W) / 2;
const cardX = (i: number) => START_X + i * (CARD_W + CARD_GAP);
const cardCx = (i: number) => cardX(i) + CARD_W / 2;

const TRACK_Y = 70;
const RAIL_Y = 404;

const COLORS = {
  accent: "#45dcc6",
  text: "#ffffff",
  dim: "rgba(255,255,255,0.55)",
};

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

/** Cubic ease-out used to soften the token's travel. */
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Smooth 0..1 ramp between two progress thresholds. */
function ramp(p: number, start: number, end: number): number {
  if (end === start) return p >= end ? 1 : 0;
  return clamp01((p - start) / (end - start));
}

export function PipelineStagesPlayer({ caption, autoPlay = true }: PipelineStagesPlayerProps) {
  const timeline = useAnymotionTimeline({ duration: 3.6, autoPlay });
  const p = timeline.progress;

  // Token travel: starts slightly after 0 and settles just before 1 so the first
  // and last stage are both held long enough to be read.
  const travel = easeOut(ramp(p, 0.06, 0.88));
  const tokenX = cardCx(0) + travel * (cardCx(COUNT - 1) - cardCx(0));

  // The stage the token is currently in (0 at t=0, last at t=1).
  const currentIndex = Math.round(travel * (COUNT - 1));
  // Everything before the token is "done"; everything after is "pending".
  const passThrough = (i: number) => clamp01((tokenX - cardCx(i)) / CARD_W + 0.5);

  const current = STAGES[currentIndex];

  return (
    <figure className="my-5">
      <AnymotionStage title="Pipeline de ML en biotecnología: seis etapas encadenadas">
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="h-full w-full bg-[#0a0a0a]" role="img" aria-label="Pipeline de machine learning: token que recorre las etapas de datos a interpretación">
          {/* Title */}
          <text x={VB_W / 2} y={30} textAnchor="middle" fill="white" fontSize={17} fontFamily="sans-serif" fontWeight={700} opacity={0.92}>
            Pipeline de ML: de datos brutos a predicciones útiles
          </text>
          <text x={VB_W / 2} y={48} textAnchor="middle" fill="white" fontSize={15} fontFamily="monospace" opacity={0.45}>
            cada etapa transforma la salida de la anterior
          </text>

          {/* === Travel track === */}
          <line x1={cardCx(0)} y1={TRACK_Y} x2={cardCx(COUNT - 1)} y2={TRACK_Y} stroke="white" strokeWidth={1} opacity={0.28} />
          {STAGES.map((s, i) => (
            <line key={`stub-${i}`} x1={cardCx(i)} y1={TRACK_Y} x2={cardCx(i)} y2={CARD_TOP} stroke="white" strokeWidth={1} opacity={0.18} />
          ))}
          <line x1={cardCx(0)} y1={TRACK_Y} x2={tokenX} y2={TRACK_Y} stroke={COLORS.accent} strokeWidth={1.6} opacity={0.9} />

          {/* Token: glow + core, drawn last so it always sits above the track */}
          <circle cx={tokenX} cy={TRACK_Y} r={13} fill={COLORS.accent} opacity={0.14} />
          <circle cx={tokenX} cy={TRACK_Y} r={6} fill={COLORS.accent} stroke="#0a0a0a" strokeWidth={1.2} />

          {/* === Stage cards === */}
          {STAGES.map((stage, i) => {
            const passed = passThrough(i);
            const isCurrent = i === currentIndex;
            const fillOpacity = 0.05 + passed * 0.16;
            const stroke = isCurrent ? COLORS.accent : "rgba(255,255,255,0.16)";
            const strokeWidth = isCurrent ? 2 : 1.2;
            const strokeOpacity = isCurrent ? 1 : 0.25 + passed * 0.5;
            const nameFill = isCurrent ? COLORS.accent : COLORS.text;
            const detailOpacity = 0.45 + passed * 0.5;
            const badgeFill = passed > 0.5 ? COLORS.accent : "transparent";
            const badgeStroke = passed > 0.5 ? COLORS.accent : "rgba(255,255,255,0.4)";
            const badgeTextFill = passed > 0.5 ? "#0a0a0a" : "rgba(255,255,255,0.6)";

            return (
              <g key={`stage-${i}`}>
                <rect
                  x={cardX(i)}
                  y={CARD_TOP}
                  width={CARD_W}
                  height={CARD_H}
                  rx={14}
                  fill={COLORS.accent}
                  opacity={fillOpacity}
                />
                <rect
                  x={cardX(i)}
                  y={CARD_TOP}
                  width={CARD_W}
                  height={CARD_H}
                  rx={14}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  opacity={strokeOpacity}
                />

                {/* Step number badge */}
                <circle cx={cardCx(i)} cy={CARD_TOP + 30} r={14} fill={badgeFill} stroke={badgeStroke} strokeWidth={1.4} />
                <text x={cardCx(i)} y={CARD_TOP + 35} textAnchor="middle" fill={badgeTextFill} fontSize={13} fontFamily="monospace" fontWeight={700}>
                  {i + 1}
                </text>

                {/* Stage name */}
                <text x={cardCx(i)} y={CARD_TOP + 74} textAnchor="middle" fill={nameFill} fontSize={16} fontFamily="sans-serif" fontWeight={700}>
                  {stage.name}
                </text>

                {/* Biotech example, wrapped deterministically */}
                <g fontFamily="monospace" fontSize={15} fill="white" opacity={detailOpacity} textAnchor="middle">
                  {DETAIL_LINES[i].map((line, li) => (
                    <text key={`d-${i}-${li}`} x={cardCx(i)} y={CARD_TOP + 104 + li * 16}>
                      {line}
                    </text>
                  ))}
                </g>

                {/* Connector chevron to the next stage */}
                {i < COUNT - 1 && (
                  <polygon
                    points={`${cardX(i) + CARD_W + 3},${CARD_TOP + CARD_H / 2 - 7} ${cardX(i) + CARD_W + 13},${CARD_TOP + CARD_H / 2} ${cardX(i) + CARD_W + 3},${CARD_TOP + CARD_H / 2 + 7}`}
                    fill="white"
                    opacity={0.2 + passThrough(i) * 0.5}
                  />
                )}
              </g>
            );
          })}

          {/* === Bottom progress rail === */}
          <line x1={cardCx(0)} y1={RAIL_Y} x2={cardCx(COUNT - 1)} y2={RAIL_Y} stroke="white" strokeWidth={2} opacity={0.15} />
          <line x1={cardCx(0)} y1={RAIL_Y} x2={tokenX} y2={RAIL_Y} stroke={COLORS.accent} strokeWidth={2.4} opacity={0.85} />
          {STAGES.map((s, i) => (
            <circle
              key={`tick-${i}`}
              cx={cardCx(i)}
              cy={RAIL_Y}
              r={passThrough(i) > 0.5 ? 4 : 3}
              fill={passThrough(i) > 0.5 ? COLORS.accent : "rgba(255,255,255,0.35)"}
            />
          ))}
          <g fontFamily="monospace" fontSize={14} fill={COLORS.dim} textAnchor="middle">
            {STAGES.map((s, i) => (
              <text key={`rl-${i}`} x={cardCx(i)} y={RAIL_Y + 20} opacity={i === currentIndex ? 1 : 0.6}>
                {s.name}
              </text>
            ))}
          </g>
        </svg>
      </AnymotionStage>

      <AnymotionControls timeline={timeline} label="Recorrido del pipeline de ML" />

      {/* Readable readout of the stage the token is in — the SVG keeps the
          sequence legible, this keeps the wording legible at any stage size. */}
      <div className="mt-2 flex flex-col gap-1 rounded-card border border-white/10 bg-surface-card px-4 py-3 text-storm sm:flex-row sm:items-center sm:gap-4">
        <span className="font-mono text-base whitespace-nowrap text-storm">
          Etapa{" "}
          <span className="font-semibold text-mint">
            {currentIndex + 1} / {COUNT}
          </span>
        </span>
        <span className="text-base font-semibold text-storm">{current.name}</span>
        <span className="text-base text-storm">{current.detail}</span>
      </div>

      {caption && <figcaption className="mt-2 text-center font-mono text-sm text-storm">{caption}</figcaption>}
    </figure>
  );
}

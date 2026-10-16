"use client";

import { useState } from "react";
import { AnymotionStage } from "../AnymotionStage";
import { AnymotionControls } from "../AnymotionControls";
import { useAnymotionTimeline } from "../hooks/useAnymotionTimeline";

interface SupervisedFlowPlayerProps {
  caption?: string;
  autoPlay?: boolean;
}

type SupervisedStage = {
  id: string;
  title: string;
  subtitle: string;
  biotechDetail: string;
  analogy: string;
  sampleCode: string;
};

const STAGES: SupervisedStage[] = [
  {
    id: "training-data",
    title: "Ejemplos de entrenamiento",
    subtitle: "Conidias + especie",
    biotechDetail:
      "Conidias etiquetadas (Aspergillus / Penicillium) con sus features medibles: [área, circularidad, textura].",
    analogy: "Ejercicios resueltos de un libro de texto",
    sampleCode: "[4.8µm, 0.91, rugosa] → Aspergillus",
  },
  {
    id: "algorithm",
    title: "Algoritmo",
    subtitle: "Búsqueda de patrones",
    biotechDetail:
      "Busca patrones matemáticos que relacionen las features numéricas con la etiqueta de cada especie.",
    analogy: "El estudiante que estudia y practica",
    sampleCode: "ajustar f(x) para minimizar error",
  },
  {
    id: "model",
    title: "Modelo",
    subtitle: "Patrones aprendidos",
    biotechDetail:
      "Representación matemática de los patrones encontrados en los datos durante el entrenamiento.",
    analogy: "El conocimiento adquirido por el estudiante",
    sampleCode: "w₁·área + w₂·textura + b = 0",
  },
  {
    id: "predictions",
    title: "Predicciones",
    subtitle: "Nuevas conidias",
    biotechDetail:
      "Clasifica nuevas conidias nunca vistas aplicando el modelo aprendido en segundos.",
    analogy: "Ejercicios nuevos que resuelve en el examen",
    sampleCode: "nueva muestra → 94% Aspergillus",
  },
];

const COUNT = STAGES.length;

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
    current = word;
  }
  if (current) lines.push(current);
  return lines;
}

const BIOTECH_LINES = STAGES.map((s) => wrapText(s.biotechDetail, 24));
const ANALOGY_LINES = STAGES.map((s) => wrapText(`Analogía: ${s.analogy}`, 24));

const VB_W = 880;
const VB_H = 495;

const CARD_W = 190;
const CARD_GAP = 22;
const CARD_TOP = 102;
const CARD_H = 290;
const TOTAL_W = COUNT * CARD_W + (COUNT - 1) * CARD_GAP;
const START_X = (VB_W - TOTAL_W) / 2;
const cardX = (i: number) => START_X + i * (CARD_W + CARD_GAP);
const cardCx = (i: number) => cardX(i) + CARD_W / 2;

const TRACK_Y = 74;
const RAIL_Y = 434;

const COLORS = {
  accent: "#45dcc6",
  amber: "#f59e0b",
  sky: "#38bdf8",
  text: "#ffffff",
  dim: "rgba(255,255,255,0.58)",
};

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function ramp(p: number, start: number, end: number): number {
  if (end === start) return p >= end ? 1 : 0;
  return clamp01((p - start) / (end - start));
}

export function SupervisedFlowPlayer({
  caption,
  autoPlay = true,
}: SupervisedFlowPlayerProps) {
  const timeline = useAnymotionTimeline({ duration: 3.2, autoPlay });
  const [selectedStage, setSelectedStage] = useState<number | null>(null);

  const p = timeline.progress;
  const travel = easeOut(ramp(p, 0.05, 0.9));
  const timelineIndex = Math.round(travel * (COUNT - 1));
  const activeIndex = selectedStage ?? timelineIndex;

  const tokenX =
    selectedStage !== null
      ? cardCx(selectedStage)
      : cardCx(0) + travel * (cardCx(COUNT - 1) - cardCx(0));

  const passThrough = (i: number) =>
    selectedStage !== null
      ? i <= selectedStage
        ? 1
        : 0
      : clamp01((tokenX - cardCx(i)) / CARD_W + 0.5);

  const current = STAGES[activeIndex];

  const handleSelectStage = (idx: number) => {
    setSelectedStage(idx);
    const targetTime = (idx / (COUNT - 1)) * timeline.duration;
    timeline.seek(targetTime);
  };

  return (
    <figure className="my-3">
      <AnymotionStage title="Flujo del aprendizaje supervisado: cuatro etapas conectadas">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="h-full w-full bg-[#0a0a0a]"
          role="img"
          aria-label="Diagrama animado del aprendizaje supervisado: Ejemplos de entrenamiento, Algoritmo, Modelo y Predicciones"
        >
          {/* Header */}
          <text
            x={VB_W / 2}
            y={30}
            textAnchor="middle"
            fill="white"
            fontSize={16}
            fontFamily="sans-serif"
            fontWeight={700}
            opacity={0.94}
          >
            Aprendizaje supervisado: de ejemplos etiquetados a predicciones
          </text>
          <text
            x={VB_W / 2}
            y={50}
            textAnchor="middle"
            fill={COLORS.accent}
            fontSize={11}
            fontFamily="monospace"
            opacity={0.85}
          >
            {`etapa activa (${activeIndex + 1}/${COUNT}): ${current.title} — ${current.analogy}`}
          </text>

          {/* Signal track */}
          <line
            x1={cardCx(0)}
            y1={TRACK_Y}
            x2={cardCx(COUNT - 1)}
            y2={TRACK_Y}
            stroke="white"
            strokeWidth={1.2}
            opacity={0.25}
          />
          {STAGES.map((_, i) => (
            <line
              key={`stub-${i}`}
              x1={cardCx(i)}
              y1={TRACK_Y}
              x2={cardCx(i)}
              y2={CARD_TOP}
              stroke="white"
              strokeWidth={1.1}
              opacity={0.2}
            />
          ))}
          <line
            x1={cardCx(0)}
            y1={TRACK_Y}
            x2={tokenX}
            y2={TRACK_Y}
            stroke={COLORS.accent}
            strokeWidth={2}
            opacity={0.92}
          />

          {/* Animated signal token */}
          <circle
            cx={tokenX}
            cy={TRACK_Y}
            r={14}
            fill={COLORS.accent}
            opacity={0.18}
          />
          <circle
            cx={tokenX}
            cy={TRACK_Y}
            r={6.5}
            fill={COLORS.accent}
            stroke="#0a0a0a"
            strokeWidth={1.4}
          />

          {/* Stage cards */}
          {STAGES.map((stage, i) => {
            const passed = passThrough(i);
            const isCurrent = i === activeIndex;
            const fillOpacity = isCurrent ? 0.16 : 0.04 + passed * 0.08;
            const stroke = isCurrent
              ? COLORS.accent
              : "rgba(255,255,255,0.18)";
            const strokeWidth = isCurrent ? 2.2 : 1.2;
            const badgeFill =
              passed > 0.5 || isCurrent ? COLORS.accent : "transparent";
            const badgeTextFill =
              passed > 0.5 || isCurrent ? "#0a0a0a" : "rgba(255,255,255,0.7)";

            return (
              <g key={stage.id}>
                <rect
                  x={cardX(i)}
                  y={CARD_TOP}
                  width={CARD_W}
                  height={CARD_H}
                  rx={16}
                  fill={COLORS.accent}
                  opacity={fillOpacity}
                />
                <rect
                  x={cardX(i)}
                  y={CARD_TOP}
                  width={CARD_W}
                  height={CARD_H}
                  rx={16}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                />

                {/* Step badge */}
                <circle
                  cx={cardCx(i)}
                  cy={CARD_TOP + 28}
                  r={14}
                  fill={badgeFill}
                  stroke={COLORS.accent}
                  strokeWidth={1.4}
                />
                <text
                  x={cardCx(i)}
                  y={CARD_TOP + 33}
                  textAnchor="middle"
                  fill={badgeTextFill}
                  fontSize={12}
                  fontFamily="monospace"
                  fontWeight={700}
                >
                  {i + 1}
                </text>

                {/* Stage title & subtitle */}
                <text
                  x={cardCx(i)}
                  y={CARD_TOP + 64}
                  textAnchor="middle"
                  fill={isCurrent ? COLORS.accent : COLORS.text}
                  fontSize={12.5}
                  fontFamily="sans-serif"
                  fontWeight={700}
                >
                  {stage.title}
                </text>
                <text
                  x={cardCx(i)}
                  y={CARD_TOP + 82}
                  textAnchor="middle"
                  fill={COLORS.sky}
                  fontSize={10.5}
                  fontFamily="monospace"
                  opacity={0.9}
                >
                  {stage.subtitle}
                </text>

                {/* Biotech detail wrapped */}
                <g
                  fontFamily="sans-serif"
                  fontSize={10.5}
                  fill="white"
                  opacity={isCurrent ? 0.95 : 0.65}
                  textAnchor="middle"
                >
                  {BIOTECH_LINES[i].map((line, li) => (
                    <text
                      key={`bio-${i}-${li}`}
                      x={cardCx(i)}
                      y={CARD_TOP + 112 + li * 15}
                    >
                      {line}
                    </text>
                  ))}
                </g>

                {/* Sample formula/vector chip */}
                <rect
                  x={cardX(i) + 12}
                  y={CARD_TOP + 184}
                  width={CARD_W - 24}
                  height={26}
                  rx={8}
                  fill="rgba(255,255,255,0.06)"
                  stroke="rgba(255,255,255,0.14)"
                  strokeWidth={1}
                />
                <text
                  x={cardCx(i)}
                  y={CARD_TOP + 201}
                  textAnchor="middle"
                  fill={COLORS.accent}
                  fontSize={9.5}
                  fontFamily="monospace"
                >
                  {stage.sampleCode}
                </text>

                {/* Textbook analogy */}
                <g
                  fontFamily="monospace"
                  fontSize={9.5}
                  fill={COLORS.amber}
                  opacity={isCurrent ? 0.95 : 0.65}
                  textAnchor="middle"
                >
                  {ANALOGY_LINES[i].map((line, li) => (
                    <text
                      key={`ana-${i}-${li}`}
                      x={cardCx(i)}
                      y={CARD_TOP + 234 + li * 14}
                    >
                      {line}
                    </text>
                  ))}
                </g>

                {/* Arrow to next stage */}
                {i < COUNT - 1 && (
                  <polygon
                    points={`${cardX(i) + CARD_W + 5},${CARD_TOP + CARD_H / 2 - 7} ${cardX(i) + CARD_W + 17},${CARD_TOP + CARD_H / 2} ${cardX(i) + CARD_W + 5},${CARD_TOP + CARD_H / 2 + 7}`}
                    fill={COLORS.accent}
                    opacity={0.35 + passed * 0.55}
                  />
                )}
              </g>
            );
          })}

          {/* Bottom rail */}
          <line
            x1={cardCx(0)}
            y1={RAIL_Y}
            x2={cardCx(COUNT - 1)}
            y2={RAIL_Y}
            stroke="white"
            strokeWidth={2}
            opacity={0.16}
          />
          <line
            x1={cardCx(0)}
            y1={RAIL_Y}
            x2={tokenX}
            y2={RAIL_Y}
            stroke={COLORS.accent}
            strokeWidth={2.4}
            opacity={0.88}
          />
          {STAGES.map((stage, i) => (
            <g key={`rail-${stage.id}`}>
              <circle
                cx={cardCx(i)}
                cy={RAIL_Y}
                r={i === activeIndex ? 5 : 3.5}
                fill={
                  i <= activeIndex
                    ? COLORS.accent
                    : "rgba(255,255,255,0.35)"
                }
              />
              <text
                x={cardCx(i)}
                y={RAIL_Y + 22}
                textAnchor="middle"
                fill={i === activeIndex ? COLORS.accent : COLORS.dim}
                fontSize={10}
                fontFamily="monospace"
              >
                {`${i + 1}. ${stage.title}`}
              </text>
            </g>
          ))}
        </svg>
      </AnymotionStage>

      <AnymotionControls
        timeline={timeline}
        label="Recorrido del aprendizaje supervisado"
      />

      {/* Interactive stage selector pills */}
      <div
        role="group"
        aria-label="Seleccionar etapa del aprendizaje supervisado"
        className="mt-2 flex flex-wrap gap-2"
      >
        {STAGES.map((stage, idx) => {
          const active = idx === activeIndex;
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => handleSelectStage(idx)}
              aria-pressed={active}
              className={`min-h-11 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 motion-reduce:transition-none ${
                active
                  ? "border-mint bg-mint/20 text-mint"
                  : "border-gray-200 bg-surface-card text-storm hover:border-mint/60 hover:text-mint"
              }`}
            >
              {idx + 1}. {stage.title}
            </button>
          );
        })}
      </div>

      {/* HTML readout card below the stage */}
      <div
        aria-live="polite"
        className="mt-2 flex flex-col gap-1.5 rounded-card border border-gray-200 bg-surface-card px-4 py-3 text-storm sm:flex-row sm:items-center sm:justify-between sm:gap-4"
      >
        <div>
          <span className="font-mono text-xs font-semibold text-brand-600">
            Etapa {activeIndex + 1} de {COUNT}: {current.title}
          </span>
          <p className="mt-0.5 text-sm text-ink">{current.biotechDetail}</p>
        </div>
        <div className="shrink-0 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-900">
          <span className="font-semibold">Analogía:</span> {current.analogy}
        </div>
      </div>

      {caption && (
        <figcaption className="mt-2 text-center font-mono text-xs text-storm">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

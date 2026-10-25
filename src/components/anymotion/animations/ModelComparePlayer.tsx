"use client";

import { useState } from "react";
import { AnymotionStage } from "../AnymotionStage";

interface ModelComparePlayerProps {
  caption?: string;
}

type DimensionSpec = {
  id: string;
  label: string;
  alphafold: string;
  evo: string;
  traditional: string;
  takeaway: string;
};

const DIMENSIONS: DimensionSpec[] = [
  {
    id: "input",
    label: "Entrada / Dato",
    alphafold: "Secuencia de aminoácidos (proteínas)",
    evo: "Secuencia de ADN (genomas completos, incl. regiones no codificantes)",
    traditional: "Datos experimentales de laboratorio",
    takeaway:
      "AlphaFold lee proteínas; Evo lee el genoma completo de ADN (entrenado con 300 mil millones de bases).",
  },
  {
    id: "task",
    label: "Tarea principal",
    alphafold: "Predicción estructural 3D",
    evo: "Modelado y diseño generativo de secuencias",
    traditional: "Determinación física (cristalografía, criomicroscopía)",
    takeaway:
      "AlphaFold resuelve cómo se pliega una secuencia; Evo modela y diseña secuencias nuevas.",
  },
  {
    id: "output",
    label: "Salida principal",
    alphafold: "Coordenadas 3D de cada átomo de la proteína",
    evo: "Predicciones de variantes + secuencias y proteínas diseñadas",
    traditional: "Estructura o función validada experimentalmente",
    takeaway:
      "AlphaFold entrega geometría atómica 3D; Evo entrega predicciones funcionales y secuencias generadas.",
  },
  {
    id: "generative",
    label: "¿Genera secuencias?",
    alphafold: "No (predice forma a partir de secuencia existente)",
    evo: "Sí (modelo generativo entrenado con 300 mil millones de bases)",
    traditional: "No (mide estructuras existentes)",
    takeaway:
      "Evo es un modelo generativo capaz de proponer secuencias de ADN y proteínas novedosas.",
  },
  {
    id: "lab",
    label: "Relación con el laboratorio",
    alphafold: "Reduce la necesidad de cristalografía de rayos X",
    evo: "Amplía la ingeniería genética más allá de lo experimental",
    traditional: "Validación experimental indispensable",
    takeaway:
      "Ni AlphaFold ni Evo eliminan el laboratorio: priorizan candidatos que luego deben validarse experimentalmente.",
  },
];

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

const VB_W = 880;
const VB_H = 495;

const COL_W = 256;
const COL_GAP = 24;
const TOTAL_W = 3 * COL_W + 2 * COL_GAP;
const START_X = (VB_W - TOTAL_W) / 2;
const colX = (i: number) => START_X + i * (COL_W + COL_GAP);
const colCx = (i: number) => colX(i) + COL_W / 2;

const CARD_Y = 92;
const CARD_H = 318;

const MODELS = [
  {
    key: "alphafold" as const,
    name: "AlphaFold",
    org: "DeepMind (2021)",
    badge: "Estructura 3D",
    color: "#38bdf8",
  },
  {
    key: "evo" as const,
    name: "Evo",
    org: "Arc Institute (Science, 2024)",
    badge: "Genómica Generativa",
    color: "#45dcc6",
  },
  {
    key: "traditional" as const,
    name: "Métodos tradicionales",
    org: "Cristalografía / Criomicroscopía",
    badge: "Validación Física",
    color: "#f59e0b",
  },
];

export function ModelComparePlayer({ caption }: ModelComparePlayerProps) {
  const [activeDimId, setActiveDimId] = useState<string>(DIMENSIONS[0].id);
  const currentDim =
    DIMENSIONS.find((d) => d.id === activeDimId) ?? DIMENSIONS[0];

  return (
    <figure className="my-3">
      <AnymotionStage title="Comparación visual: AlphaFold vs Evo vs Métodos tradicionales">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="h-full w-full bg-[#0a0a0a]"
          role="img"
          aria-label={`Comparación entre AlphaFold, Evo y Métodos tradicionales en la dimensión: ${currentDim.label}`}
        >
          {/* Header */}
          <text
            x={VB_W / 2}
            y={32}
            textAnchor="middle"
            fill="white"
            fontSize={16}
            fontFamily="sans-serif"
            fontWeight={700}
            opacity={0.95}
          >
            AlphaFold vs Evo vs Métodos tradicionales
          </text>
          <text
            x={VB_W / 2}
            y={54}
            textAnchor="middle"
            fill="#45dcc6"
            fontSize={12}
            fontFamily="monospace"
            opacity={0.92}
          >
            {`dimensión comparada: ${currentDim.label}`}
          </text>

          {/* 3 Model columns */}
          {MODELS.map((model, i) => {
            const x = colX(i);
            const cx = colCx(i);
            const valueText = currentDim[model.key];
            const lines = wrapText(valueText, 27);

            return (
              <g key={model.key}>
                <rect
                  x={x}
                  y={CARD_Y}
                  width={COL_W}
                  height={CARD_H}
                  rx={18}
                  fill={model.color}
                  fillOpacity={0.08}
                  stroke={model.color}
                  strokeWidth={1.8}
                  strokeOpacity={0.75}
                />

                {/* Top badge */}
                <rect
                  x={cx - 84}
                  y={CARD_Y + 18}
                  width={168}
                  height={24}
                  rx={12}
                  fill={model.color}
                  fillOpacity={0.18}
                  stroke={model.color}
                  strokeWidth={1}
                />
                <text
                  x={cx}
                  y={CARD_Y + 34}
                  textAnchor="middle"
                  fill={model.color}
                  fontSize={13}
                  fontFamily="monospace"
                  fontWeight={700}
                >
                  {model.badge}
                </text>

                {/* Model name & org */}
                <text
                  x={cx}
                  y={CARD_Y + 72}
                  textAnchor="middle"
                  fill="white"
                  fontSize={16}
                  fontFamily="sans-serif"
                  fontWeight={700}
                >
                  {model.name}
                </text>
                <text
                  x={cx}
                  y={CARD_Y + 92}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.62)"
                  fontSize={13}
                  fontFamily="monospace"
                >
                  {model.org}
                </text>

                {/* Divider */}
                <line
                  x1={x + 22}
                  y1={CARD_Y + 112}
                  x2={x + COL_W - 22}
                  y2={CARD_Y + 112}
                  stroke="white"
                  strokeOpacity={0.14}
                  strokeWidth={1}
                />

                {/* Dimension label inside card */}
                <text
                  x={cx}
                  y={CARD_Y + 140}
                  textAnchor="middle"
                  fill={model.color}
                  fontSize={14}
                  fontFamily="monospace"
                  fontWeight={700}
                >
                  {currentDim.label.toUpperCase()}
                </text>

                {/* Wrapped value */}
                <g
                  fontFamily="sans-serif"
                  fontSize={13}
                  fontWeight={600}
                  fill="white"
                  textAnchor="middle"
                >
                  {lines.map((line, li) => (
                    <text
                      key={`${model.key}-l-${li}`}
                      x={cx}
                      y={CARD_Y + 178 + li * 20}
                    >
                      {line}
                    </text>
                  ))}
                </g>
              </g>
            );
          })}

          {/* Bottom synthesis bar */}
          <text
            x={VB_W / 2}
            y={VB_H - 28}
            textAnchor="middle"
            fill="rgba(255,255,255,0.75)"
            fontSize={14}
            fontFamily="monospace"
          >
            {currentDim.takeaway}
          </text>
        </svg>
      </AnymotionStage>

      {/* Dimension selector buttons */}
      <div
        role="group"
        aria-label="Dimensión a comparar entre modelos"
        className="mt-2 flex flex-wrap gap-2"
      >
        {DIMENSIONS.map((dim) => {
          const active = dim.id === currentDim.id;
          return (
            <button
              key={dim.id}
              type="button"
              onClick={() => setActiveDimId(dim.id)}
              aria-pressed={active}
              className={`min-h-11 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 motion-reduce:transition-none ${
                active
                  ? "border-mint bg-mint/20 text-mint"
                  : "border-gray-200 bg-surface-card text-storm hover:border-mint/60 hover:text-mint"
              }`}
            >
              {dim.label}
            </button>
          );
        })}
      </div>

      {/* Crisp HTML readout cards below the stage */}
      <div
        aria-live="polite"
        className="mt-2 grid gap-2 sm:grid-cols-3"
      >
        <div className="rounded-card border border-sky-200 bg-sky-50/70 px-3.5 py-2.5">
          <p className="m-0 font-mono text-sm font-semibold text-sky-800">
            AlphaFold · {currentDim.label}
          </p>
          <p className="mt-1 mb-0 text-sm font-medium text-ink">
            {currentDim.alphafold}
          </p>
        </div>
        <div className="rounded-card border border-teal-200 bg-teal-50/70 px-3.5 py-2.5">
          <p className="m-0 font-mono text-sm font-semibold text-teal-800">
            Evo (Arc Institute) · {currentDim.label}
          </p>
          <p className="mt-1 mb-0 text-sm font-medium text-ink">
            {currentDim.evo}
          </p>
        </div>
        <div className="rounded-card border border-amber-200 bg-amber-50/70 px-3.5 py-2.5">
          <p className="m-0 font-mono text-sm font-semibold text-amber-900">
            Métodos tradicionales · {currentDim.label}
          </p>
          <p className="mt-1 mb-0 text-sm font-medium text-ink">
            {currentDim.traditional}
          </p>
        </div>
      </div>

      {caption && (
        <figcaption className="mt-2 text-center font-mono text-sm text-storm">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

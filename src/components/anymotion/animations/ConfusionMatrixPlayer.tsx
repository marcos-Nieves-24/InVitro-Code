"use client";

import { useState } from "react";
import { AnymotionStage } from "../AnymotionStage";
import { renderWithMicroorganismItalics } from "@/lib/microorganisms";

interface ConfusionMatrixPlayerProps {
  caption?: string;
}

type LensId = "matrix" | "precision" | "recall" | "f1";

type LensSpec = {
  id: LensId;
  buttonLabel: string;
  title: string;
  formula: string;
  calculation: string;
  meaning: string;
  clinicalNote: string;
  activeCells: ("TP" | "FN" | "FP" | "TN")[];
};

const LENSES: LensSpec[] = [
  {
    id: "matrix",
    buttonLabel: "Matriz (n = 100)",
    title: "Desglose de 100 conidias clasificadas (Aspergillus = positivo)",
    formula: "Total = 35 + 10 + 5 + 50 = 100",
    calculation: "Aciertos 85/100 (85%) · Errores 15",
    meaning:
      "La matriz de confusión separa los aciertos (TP, TN) y desagrega qué tipo de errores comete el clasificador (FP vs FN).",
    clinicalNote:
      "En clínica, perder un patógeno real (FN = 10 Aspergillus no detectados) tiene un costo muy distinto a una falsa alarma (FP = 5).",
    activeCells: ["TP", "FN", "FP", "TN"],
  },
  {
    id: "precision",
    buttonLabel: "Precisión (87.5%)",
    title: "Precisión: confiabilidad de las predicciones positivas",
    formula: "Precisión = TP / (TP + FP)",
    calculation: "35 / (35 + 5) = 35 / 40 = 0.875 (87.5%)",
    meaning:
      "¿Qué tan confiables son las predicciones positivas? De las 40 conidias que el modelo etiquetó como Aspergillus, 35 realmente lo eran.",
    clinicalNote:
      "Mira la primera columna (Predicho Aspergillus): penaliza los Falsos Positivos (FP = 5).",
    activeCells: ["TP", "FP"],
  },
  {
    id: "recall",
    buttonLabel: "Recall / Sensibilidad (77.8%)",
    title: "Recall (Sensibilidad): cobertura de los positivos reales",
    formula: "Recall = TP / (TP + FN)",
    calculation: "35 / (35 + 10) = 35 / 45 ≈ 0.778 (77.8%)",
    meaning:
      "¿Qué proporción de los positivos reales detectamos? De las 45 conidias reales de Aspergillus en la muestra, detectamos 35 y perdimos 10.",
    clinicalNote:
      "Mira la primera fila (Real Aspergillus): penaliza los Falsos Negativos (FN = 10 patógenos no detectados).",
    activeCells: ["TP", "FN"],
  },
  {
    id: "f1",
    buttonLabel: "F1-Score (0.824)",
    title: "F1-Score: equilibrio armónico entre precisión y sensibilidad",
    formula: "F1 = 2 · (Precisión · Recall) / (Precisión + Recall)",
    calculation: "2 · (0.875 · 0.778) / (0.875 + 0.778) ≈ 0.824",
    meaning:
      "Es la media armónica entre precisión y recall: exige que ambas métricas sean altas simultáneamente.",
    clinicalNote:
      "Resume en un solo indicador el balance entre no dar falsas alarmas (FP) y no dejar escapar infecciones reales (FN).",
    activeCells: ["TP", "FN", "FP"],
  },
];

type CellData = {
  key: "TP" | "FN" | "FP" | "TN";
  row: 0 | 1;
  col: 0 | 1;
  count: number;
  shortTag: string;
  fullLabel: string;
  detail: string;
  color: string;
};

const CELLS: CellData[] = [
  {
    key: "TP",
    row: 0,
    col: 0,
    count: 35,
    shortTag: "35 (TP)",
    fullLabel: "Verdadero Positivo",
    detail: "Real Aspergillus · Predicho Aspergillus",
    color: "#45dcc6",
  },
  {
    key: "FN",
    row: 0,
    col: 1,
    count: 10,
    shortTag: "10 (FN)",
    fullLabel: "Falso Negativo",
    detail: "Real Aspergillus · Predicho Penicillium (patógeno no detectado)",
    color: "#f43f5e",
  },
  {
    key: "FP",
    row: 1,
    col: 0,
    count: 5,
    shortTag: "5 (FP)",
    fullLabel: "Falso Positivo",
    detail: "Real Penicillium · Predicho Aspergillus (falsa alarma)",
    color: "#f59e0b",
  },
  {
    key: "TN",
    row: 1,
    col: 1,
    count: 50,
    shortTag: "50 (TN)",
    fullLabel: "Verdadero Negativo",
    detail: "Real Penicillium · Predicho Penicillium",
    color: "#38bdf8",
  },
];

const VB_W = 880;
const VB_H = 495;

const GRID_X = 160;
const GRID_Y = 104;
const CELL_W = 200;
const CELL_H = 140;
const CELL_GAP = 14;

const PANEL_X = 580;
const PANEL_Y = 104;
const PANEL_W = 285;
const PANEL_H = 294;

export function ConfusionMatrixPlayer({ caption }: ConfusionMatrixPlayerProps) {
  const [activeLensId, setActiveLensId] = useState<LensId>("matrix");
  const lens = LENSES.find((l) => l.id === activeLensId) ?? LENSES[0];

  return (
    <figure className="my-3">
      <AnymotionStage title="Matriz de confusión interactiva: clasificador de conidias (n=100)">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="h-full w-full bg-[#0a0a0a]"
          role="img"
          aria-label={`Matriz de confusión para 100 conidias. Lente activa: ${lens.title}`}
        >
          {/* Title */}
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
            Matriz de confusión: <tspan font-style="italic">Aspergillus</tspan> (positivo) vs <tspan font-style="italic">Penicillium</tspan> (negativo)
          </text>
          <text
            x={VB_W / 2}
            y={50}
            textAnchor="middle"
            fill="#45dcc6"
            fontSize={14.5}
            fontFamily="monospace"
            opacity={0.9}
          >
            {lens.title}
          </text>

          {/* Column headers */}
          <text
            x={GRID_X + CELL_W / 2}
            y={GRID_Y - 14}
            textAnchor="middle"
            fill="white"
            fontSize={14.5}
            fontFamily="monospace"
            fontWeight={700}
            opacity={0.9}
          >
            Predicho <tspan font-style="italic">Aspergillus</tspan>
          </text>
          <text
            x={GRID_X + CELL_W + CELL_GAP + CELL_W / 2}
            y={GRID_Y - 14}
            textAnchor="middle"
            fill="white"
            fontSize={14.5}
            fontFamily="monospace"
            fontWeight={700}
            opacity={0.9}
          >
            Predicho <tspan font-style="italic">Penicillium</tspan>
          </text>

          {/* Row headers */}
          <text
            x={GRID_X - 14}
            y={GRID_Y + CELL_H / 2 - 4}
            textAnchor="end"
            fill="white"
            fontSize={14.5}
            fontFamily="monospace"
            fontWeight={700}
            opacity={0.9}
          >
            Real <tspan font-style="italic">Aspergillus</tspan>
          </text>
          <text
            x={GRID_X - 14}
            y={GRID_Y + CELL_H / 2 + 12}
            textAnchor="end"
            fill="rgba(255,255,255,0.55)"
            fontSize={13}
            fontFamily="monospace"
          >
            (45 reales)
          </text>

          <text
            x={GRID_X - 14}
            y={GRID_Y + CELL_H + CELL_GAP + CELL_H / 2 - 4}
            textAnchor="end"
            fill="white"
            fontSize={14.5}
            fontFamily="monospace"
            fontWeight={700}
            opacity={0.9}
          >
            Real <tspan font-style="italic">Penicillium</tspan>
          </text>
          <text
            x={GRID_X - 14}
            y={GRID_Y + CELL_H + CELL_GAP + CELL_H / 2 + 12}
            textAnchor="end"
            fill="rgba(255,255,255,0.55)"
            fontSize={13}
            fontFamily="monospace"
          >
            (55 reales)
          </text>

          {/* 2x2 Matrix cells */}
          {CELLS.map((cell) => {
            const x = GRID_X + cell.col * (CELL_W + CELL_GAP);
            const y = GRID_Y + cell.row * (CELL_H + CELL_GAP);
            const cx = x + CELL_W / 2;
            const isHighlighted = lens.activeCells.includes(cell.key);

            return (
              <g
                key={cell.key}
                opacity={isHighlighted ? 1 : 0.28}
              >
                <rect
                  x={x}
                  y={y}
                  width={CELL_W}
                  height={CELL_H}
                  rx={16}
                  fill={cell.color}
                  fillOpacity={isHighlighted ? 0.16 : 0.05}
                  stroke={cell.color}
                  strokeWidth={isHighlighted ? 2.4 : 1.1}
                />

                <text
                  x={cx}
                  y={y + 48}
                  textAnchor="middle"
                  fill={cell.color}
                  fontSize={28}
                  fontFamily="monospace"
                  fontWeight={700}
                >
                  {cell.shortTag}
                </text>

                <text
                  x={cx}
                  y={y + 78}
                  textAnchor="middle"
                  fill="white"
                  fontSize={13}
                  fontFamily="sans-serif"
                  fontWeight={700}
                >
                  {cell.fullLabel}
                </text>

                <text
                  x={cx}
                  y={y + 104}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.78)"
                  fontSize={13}
                  fontFamily="monospace"
                >
                  {cell.row === 0 ? (
                    <>Real: <tspan font-style="italic">Aspergillus</tspan></>
                  ) : (
                    <>Real: <tspan font-style="italic">Penicillium</tspan></>
                  )}
                </text>
                <text
                  x={cx}
                  y={y + 120}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.78)"
                  fontSize={13}
                  fontFamily="monospace"
                >
                  {cell.col === 0 ? (
                    <>Pred: <tspan font-style="italic">Aspergillus</tspan></>
                  ) : (
                    <>Pred: <tspan font-style="italic">Penicillium</tspan></>
                  )}
                </text>
              </g>
            );
          })}

          {/* Right metric formula & summary panel */}
          <rect
            x={PANEL_X}
            y={PANEL_Y}
            width={PANEL_W}
            height={PANEL_H}
            rx={16}
            fill="rgba(255,255,255,0.04)"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth={1.2}
          />
          <text
            x={PANEL_X + PANEL_W / 2}
            y={PANEL_Y + 32}
            textAnchor="middle"
            fill="#45dcc6"
            fontSize={12}
            fontFamily="monospace"
            fontWeight={700}
          >
            FÓRMULA ACTIVA
          </text>
          <text
            x={PANEL_X + PANEL_W / 2}
            y={PANEL_Y + 62}
            textAnchor="middle"
            fill="white"
            fontSize={12}
            fontFamily="monospace"
            fontWeight={700}
          >
            {lens.formula}
          </text>
          <rect
            x={PANEL_X + 10}
            y={PANEL_Y + 80}
            width={PANEL_W - 20}
            height={34}
            rx={10}
            fill="rgba(69,220,198,0.14)"
            stroke="#45dcc6"
            strokeWidth={1}
          />
          <text
            x={PANEL_X + PANEL_W / 2}
            y={PANEL_Y + 102}
            textAnchor="middle"
            fill="#45dcc6"
            fontSize={11.5}
            fontFamily="monospace"
            fontWeight={700}
          >
            {lens.calculation}
          </text>

          {/* All 3 reference metrics always visible for quick comparison */}
          <g fontFamily="monospace" fontSize={14} fill="white">
            <text x={PANEL_X + 20} y={PANEL_Y + 150} opacity={activeLensId === "precision" ? 1 : 0.65}>
              • Precisión: 35 / 40 = 0.875
            </text>
            <text x={PANEL_X + 20} y={PANEL_Y + 180} opacity={activeLensId === "recall" ? 1 : 0.65}>
              • Recall:    35 / 45 = 0.778
            </text>
            <text x={PANEL_X + 20} y={PANEL_Y + 210} opacity={activeLensId === "f1" ? 1 : 0.65}>
              • F1-Score:  ≈ 0.824
            </text>
            <text x={PANEL_X + 20} y={PANEL_Y + 240} opacity={activeLensId === "matrix" ? 1 : 0.65}>
              • Muestra:   n = 100 conidias
            </text>
          </g>

          {/* Footer note */}
          <text
            x={VB_W / 2}
            y={VB_H - 26}
            textAnchor="middle"
            fill="rgba(255,255,255,0.65)"
            fontSize={14}
            fontFamily="monospace"
          >
            Selecciona una métrica abajo para resaltar qué celdas de la matriz intervienen en su cálculo
          </text>
        </svg>
      </AnymotionStage>

      {/* Interactive lens selector */}
      <div
        role="group"
        aria-label="Seleccionar métrica de la matriz de confusión"
        className="mt-2 flex flex-wrap gap-2"
      >
        {LENSES.map((item) => {
          const active = item.id === activeLensId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveLensId(item.id)}
              aria-pressed={active}
              className={`min-h-11 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 motion-reduce:transition-none ${
                active
                  ? "border-mint bg-mint/20 text-mint"
                  : "border-gray-200 bg-surface-card text-storm hover:border-mint/60 hover:text-mint"
              }`}
            >
              {item.buttonLabel}
            </button>
          );
        })}
      </div>

      {/* Crisp HTML readout below the stage */}
      <div
        aria-live="polite"
        className="mt-2 rounded-card border border-gray-200 bg-surface-card px-4 py-3 text-storm"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-sm font-semibold text-brand-600">
            {renderWithMicroorganismItalics(lens.title)}
          </span>
          <span className="rounded-md bg-brand-50 px-2.5 py-1 font-mono text-sm font-semibold text-brand-700">
            {lens.formula}  {lens.calculation}
          </span>
        </div>
        <p className="mt-1.5 text-sm text-ink">{renderWithMicroorganismItalics(lens.meaning)}</p>
        <p className="mt-1 text-sm text-storm">{renderWithMicroorganismItalics(lens.clinicalNote)}</p>
      </div>

      {caption && (
        <figcaption className="mt-2 text-center font-mono text-sm text-storm">
          {renderWithMicroorganismItalics(caption)}
        </figcaption>
      )}
    </figure>
  );
}

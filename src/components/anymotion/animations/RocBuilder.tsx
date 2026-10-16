"use client";

import { useMemo, useState } from "react";
import { AnymotionStage } from "../AnymotionStage";

// ---------------------------------------------------------------------------
// Dataset determinista (~100 casos). Sin Math.random(): la semilla fija
// garantiza conteos idénticos en cada carga (SSR y cliente).
// Positivo = "Aspergillus" (patógeno real), negativo = "Penicillium".
// ---------------------------------------------------------------------------

interface Case {
  truth: 0 | 1; // 1 = positivo real
  score: number; // probabilidad estimada por el modelo, [0,1]
}

function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function buildDataset(): Case[] {
  const rng = makeRng(20250314);
  const cases: Case[] = [];
  const nPos = 45;
  const nNeg = 55;
  for (let i = 0; i < nPos; i++) {
    // Positivos con score alto pero con solapamiento realista.
    const score = clamp(0.62 + (rng() - 0.5) * 0.7, 0.02, 0.99);
    cases.push({ truth: 1, score });
  }
  for (let i = 0; i < nNeg; i++) {
    const score = clamp(0.38 + (rng() - 0.5) * 0.7, 0.01, 0.98);
    cases.push({ truth: 0, score });
  }
  return cases;
}

const DATASET: Case[] = buildDataset();

// ---------------------------------------------------------------------------
// Geometría del SVG (viewBox 800x450, 16:9)
// ---------------------------------------------------------------------------
const VB_W = 800;
const VB_H = 450;
const PLOT_L = 84;
const PLOT_R = 736;
const PLOT_T = 56;
const PLOT_B = 380;
const PLOT_W = PLOT_R - PLOT_L;
const PLOT_H = PLOT_B - PLOT_T;

const xPx = (fpr: number) => PLOT_L + fpr * PLOT_W;
const yPx = (tpr: number) => PLOT_B - tpr * PLOT_H;

// ---------------------------------------------------------------------------
// ROC: precomputa la curva completa para todos los umbrales posibles.
// ---------------------------------------------------------------------------
interface RocPoint {
  fpr: number;
  tpr: number;
  threshold: number;
}

function computeRoc(cases: Case[]): RocPoint[] {
  const positives = cases.filter((c) => c.truth === 1).length;
  const negatives = cases.filter((c) => c.truth === 0).length;

  // Umbrales candidatos: cada score único + extremos.
  const thresholds = Array.from(new Set(cases.map((c) => c.score)));
  thresholds.sort((a, b) => b - a);

  const pts: RocPoint[] = [];
  // Extremo superior: nadie clasificado positivo -> (0,0).
  pts.push({ fpr: 0, tpr: 0, threshold: 1 });

  for (const t of thresholds) {
    let tp = 0;
    let fp = 0;
    for (const c of cases) {
      if (c.score >= t) {
        if (c.truth === 1) tp++;
        else fp++;
      }
    }
    const tpr = positives > 0 ? tp / positives : 0;
    const fpr = negatives > 0 ? fp / negatives : 0;
    pts.push({ fpr, tpr, threshold: t });
  }
  // Extremo inferior: todos clasificados positivo -> (1,1).
  pts.push({ fpr: 1, tpr: 1, threshold: 0 });

  // Elimina puntos duplicados consecutivos.
  const cleaned: RocPoint[] = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const prev = cleaned[cleaned.length - 1];
    if (Math.abs(prev.fpr - pts[i].fpr) < 1e-9 && Math.abs(prev.tpr - pts[i].tpr) < 1e-9) continue;
    cleaned.push(pts[i]);
  }
  return cleaned;
}

function computeAuc(pts: RocPoint[]): number {
  // Integración trapezoidal sobre FPR creciente.
  let auc = 0;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].fpr - pts[i - 1].fpr;
    const avgY = (pts[i].tpr + pts[i - 1].tpr) / 2;
    auc += dx * avgY;
  }
  return auc;
}

function youdenBest(pts: RocPoint[]): RocPoint {
  let best = pts[0];
  let bestJ = -Infinity;
  for (const p of pts) {
    const j = p.tpr - p.fpr;
    if (j > bestJ) {
      bestJ = j;
      best = p;
    }
  }
  return best;
}

interface RocBuilderProps {
  caption: string;
}

export function RocBuilder({ caption }: RocBuilderProps) {
  const roc = useMemo(() => computeRoc(DATASET), []);
  const auc = useMemo(() => computeAuc(roc), [roc]);
  const best = useMemo(() => youdenBest(roc), [roc]);

  const [threshold, setThreshold] = useState<number>(0.5);
  const [pinned, setPinned] = useState<boolean>(false);

  // Conteos en el umbral operativo actual (sobre el dataset fijo).
  const counts = useMemo(() => {
    let tp = 0;
    let fp = 0;
    let fn = 0;
    let tn = 0;
    for (const c of DATASET) {
      const predPos = c.score >= threshold;
      if (predPos && c.truth === 1) tp++;
      else if (predPos && c.truth === 0) fp++;
      else if (!predPos && c.truth === 1) fn++;
      else tn++;
    }
    const pos = tp + fn;
    const neg = fp + tn;
    const tpr = pos > 0 ? tp / pos : 0;
    const fpr = neg > 0 ? fp / neg : 0;
    return { tp, fp, fn, tn, tpr, fpr };
  }, [threshold]);

  // Punto operativo redondeado al punto de la curva más cercano (para marcar).
  const opPoint = { fpr: counts.fpr, tpr: counts.tpr };

  const applyYouden = () => {
    setThreshold(best.threshold);
    setPinned(true);
  };

  const resetPinned = () => setPinned(false);

  const rocPath = roc.map((p) => `${xPx(p.fpr).toFixed(1)},${yPx(p.tpr).toFixed(1)}`).join(" ");
  const shadePath = [
    ...roc.map((p) => `${xPx(p.fpr).toFixed(1)},${yPx(p.tpr).toFixed(1)}`),
    `${xPx(1).toFixed(1)},${yPx(0).toFixed(1)}`,
  ].join(" ");

  return (
    <figure className="my-5">
      <AnymotionStage title="Curva ROC: umbral y trade-off FP vs FN">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="h-full w-full bg-[#0a0a0a]"
          role="img"
          aria-label="Curva ROC con punto operativo movido por el umbral"
        >
          {/* Título */}
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
            Curva ROC — clasificador de conidias (n = {DATASET.length})
          </text>

          {/* Ejes */}
          <line x1={PLOT_L} y1={PLOT_T} x2={PLOT_L} y2={PLOT_B} stroke="white" strokeWidth={1.1} opacity={0.55} />
          <line x1={PLOT_L} y1={PLOT_B} x2={PLOT_R} y2={PLOT_B} stroke="white" strokeWidth={1.1} opacity={0.55} />

          {/* Ticks y etiquetas */}
          {[0, 0.25, 0.5, 0.75, 1].map((v) => (
            <g key={`tx-${v}`}>
              <line x1={xPx(v)} y1={PLOT_B} x2={xPx(v)} y2={PLOT_B + 6} stroke="white" strokeWidth={1} opacity={0.5} />
              <text x={xPx(v)} y={PLOT_B + 20} textAnchor="middle" fill="white" fontSize={11} fontFamily="monospace" opacity={0.7}>
                {v.toFixed(2)}
              </text>
            </g>
          ))}
          {[0, 0.25, 0.5, 0.75, 1].map((v) => (
            <g key={`ty-${v}`}>
              <line x1={PLOT_L - 6} y1={yPx(v)} x2={PLOT_L} y2={yPx(v)} stroke="white" strokeWidth={1} opacity={0.5} />
              <text x={PLOT_L - 10} y={yPx(v) + 4} textAnchor="end" fill="white" fontSize={11} fontFamily="monospace" opacity={0.7}>
                {v.toFixed(2)}
              </text>
            </g>
          ))}

          {/* Etiquetas de ejes */}
          <text x={(PLOT_L + PLOT_R) / 2} y={PLOT_B + 46} textAnchor="middle" fill="white" fontSize={12} fontFamily="sans-serif" fontWeight={700} opacity={0.85}>
            FPR = FP / (FP + TN)  (falsas alarmas)
          </text>
          <text
            x={PLOT_L - 62}
            y={(PLOT_T + PLOT_B) / 2}
            textAnchor="middle"
            fill="white"
            fontSize={12}
            fontFamily="sans-serif"
            fontWeight={700}
            opacity={0.85}
            transform={`rotate(-90 ${PLOT_L - 62} ${(PLOT_T + PLOT_B) / 2})`}
          >
            TPR = Recall = TP / (TP + FN)
          </text>

          {/* Recta del azar */}
          <line
            x1={xPx(0)}
            y1={yPx(0)}
            x2={xPx(1)}
            y2={yPx(1)}
            stroke="rgba(255,255,255,0.4)"
            strokeWidth={1.2}
            strokeDasharray="6 5"
          />
          <text x={xPx(0.55)} y={yPx(0.55) - 8} fill="rgba(255,255,255,0.6)" fontSize={11} fontFamily="monospace">
            azar
          </text>

          {/* Área bajo la curva sombreada */}
          <polygon points={shadePath} fill="rgba(69,220,198,0.18)" stroke="none" />

          {/* Curva ROC completa */}
          <polyline points={rocPath} fill="none" stroke="#45dcc6" strokeWidth={2.2} opacity={0.95} />

          {/* Punto operativo actual */}
          <circle
            cx={xPx(opPoint.fpr)}
            cy={yPx(opPoint.tpr)}
            r={7}
            fill="#f59e0b"
            stroke="#0a0a0a"
            strokeWidth={1.5}
          />
          <text
            x={Math.min(PLOT_R - 8, xPx(opPoint.fpr) + 12)}
            y={Math.max(PLOT_T + 12, yPx(opPoint.tpr) - 10)}
            fill="#f59e0b"
            fontSize={11}
            fontFamily="monospace"
            fontWeight={700}
          >
            umbral {threshold.toFixed(2)}
          </text>

          {/* Readout AUC */}
          <g fontFamily="monospace" fontSize={12}>
            <rect x={PLOT_R - 150} y={PLOT_T + 4} width={146} height={26} rx={8} fill="rgba(69,220,198,0.14)" stroke="#45dcc6" strokeWidth={1} />
            <text x={PLOT_R - 77} y={PLOT_T + 22} textAnchor="middle" fill="#45dcc6" fontWeight={700}>
              AUC = {auc.toFixed(3)}
            </text>
          </g>

          {/* Leyenda */}
          <g fontFamily="monospace" fontSize={10} opacity={0.85}>
            <line x1={PLOT_L} y1={PLOT_B + 62} x2={PLOT_L + 24} y2={PLOT_B + 62} stroke="#45dcc6" strokeWidth={2.2} />
            <text x={PLOT_L + 30} y={PLOT_B + 66} fill="white">curva ROC</text>
            <rect x={PLOT_L + 130} y={PLOT_B + 56} width={12} height={12} rx={2} fill="rgba(69,220,198,0.18)" stroke="#45dcc6" strokeWidth={1} />
            <text x={PLOT_L + 148} y={PLOT_B + 66} fill="white">área (AUC)</text>
            <circle cx={PLOT_L + 260} cy={PLOT_B + 62} r={5} fill="#f59e0b" />
            <text x={PLOT_L + 270} y={PLOT_B + 66} fill="white">punto operativo</text>
          </g>
        </svg>
      </AnymotionStage>

      {/* Controles */}
      <div
        role="group"
        aria-label="Controles de la curva ROC"
        className="mt-2 flex flex-col gap-2 rounded-card border border-white/10 bg-surface-card px-4 py-3 text-storm"
      >
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="roc-threshold" className="font-mono text-xs whitespace-nowrap text-storm">
            Umbral{" "}
            <span className="font-semibold text-mint">{threshold.toFixed(2)}</span>
          </label>
          <input
            id="roc-threshold"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={threshold}
            onChange={(e) => {
              setThreshold(Number(e.target.value));
              setPinned(false);
            }}
            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-gray-200 accent-mint"
            aria-label="Umbral de probabilidad"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={applyYouden}
            className="min-h-11 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-storm transition-colors hover:border-mint/60 hover:text-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 motion-reduce:transition-none"
            aria-label="Fijar mejor umbral según Youden J"
          >
            Mejor umbral (Youden J)
          </button>
          {pinned && (
            <button
              type="button"
              onClick={resetPinned}
              className="min-h-11 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-storm transition-colors hover:border-mint/60 hover:text-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 motion-reduce:transition-none"
              aria-label="Liberar umbral fijado"
            >
              Liberar
            </button>
          )}
          <span className="font-mono text-xs text-storm" aria-live="polite">
            {pinned ? "Umbral fijado en el óptimo de Youden J." : "Mueve el deslizador para explorar el trade-off."}
          </span>
        </div>

        {/* Lectura viva */}
        <div
          aria-live="polite"
          className="grid grid-cols-2 gap-x-4 gap-y-1 rounded-card border border-gray-200 bg-white px-3 py-2 font-mono text-xs text-storm sm:grid-cols-4"
        >
          <span>TP = {counts.tp}</span>
          <span>FP = {counts.fp}</span>
          <span>FN = {counts.fn}</span>
          <span>TN = {counts.tn}</span>
          <span>TPR (recall) = {counts.tpr.toFixed(3)}</span>
          <span>FPR = {counts.fpr.toFixed(3)}</span>
          <span>Umbral = {threshold.toFixed(2)}</span>
          <span>AUC = {auc.toFixed(3)}</span>
        </div>
      </div>

      {caption && (
        <figcaption className="mt-2 text-center font-mono text-xs text-storm">{caption}</figcaption>
      )}
    </figure>
  );
}

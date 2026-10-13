"use client";

import { useMemo, useState } from "react";
import { AnymotionStage } from "../AnymotionStage";
import { useAnymotionTimeline } from "../hooks/useAnymotionTimeline";
import { AnymotionControls } from "../AnymotionControls";

interface OverfittingPlayerProps {
  caption?: string;
  autoPlay?: boolean;
}

const MIN_DEGREE = 1;
const MAX_DEGREE = 12;

// Deterministic pseudo-random generator (fixed seed => identical dataset on
// every render, every client, and during SSR). Never call Math.random() here:
// the same degree must always produce the same curve.
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

// The true underlying signal — the one the model never gets to see, just like
// in real data. Stays inside the plot's value range for t in [0, 1].
function fTrue(t: number): number {
  return 0.5 * Math.sin(3.4 * t + 0.4) + 0.5;
}

type Sample = { t: number; y: number };

function buildDataset(): { train: Sample[]; test: Sample[] } {
  const rng = makeRng(20240917);
  const train: Sample[] = [];
  const test: Sample[] = [];
  const nTrain = 16;
  const nTest = 12;
  const noise = 0.14;
  for (let i = 0; i < nTrain; i++) {
    const t = i / (nTrain - 1);
    train.push({ t, y: fTrue(t) + (rng() * 2 - 1) * noise });
  }
  for (let i = 0; i < nTest; i++) {
    const t = (i + 0.5) / nTest;
    test.push({ t, y: fTrue(t) + (rng() * 2 - 1) * noise });
  }
  return { train, test };
}

const DATASET = buildDataset();

// Polynomial least squares via normal equations with a light ridge term
// (keeps degree 12 invertible) and Gauss-Jordan elimination. Coefficients are
// deterministic, so a given degree always yields the same fit.
function fitPolynomial(train: Sample[], degree: number): (t: number) => number {
  const size = degree + 1;
  const ridge = 1e-3;
  const ata: number[][] = Array.from({ length: size }, () => new Array(size).fill(0));
  const aty: number[] = new Array(size).fill(0);

  for (const s of train) {
    const pows = new Array<number>(size);
    pows[0] = 1;
    for (let j = 1; j < size; j++) pows[j] = pows[j - 1] * s.t;
    for (let a = 0; a < size; a++) {
      aty[a] += pows[a] * s.y;
      for (let b = 0; b < size; b++) ata[a][b] += pows[a] * pows[b];
    }
  }
  for (let a = 0; a < size; a++) ata[a][a] += ridge;

  for (let col = 0; col < size; col++) {
    let pivot = col;
    for (let r = col + 1; r < size; r++) {
      if (Math.abs(ata[r][col]) > Math.abs(ata[pivot][col])) pivot = r;
    }
    if (pivot !== col) {
      [ata[col], ata[pivot]] = [ata[pivot], ata[col]];
      [aty[col], aty[pivot]] = [aty[pivot], aty[col]];
    }
    const diag = ata[col][col];
    if (diag === 0) continue;
    for (let b = 0; b < size; b++) ata[col][b] /= diag;
    aty[col] /= diag;
    for (let r = 0; r < size; r++) {
      if (r === col) continue;
      const factor = ata[r][col];
      if (factor === 0) continue;
      for (let b = 0; b < size; b++) ata[r][b] -= factor * ata[col][b];
      aty[r] -= factor * aty[col];
    }
  }

  const w = aty;
  return (t: number) => {
    let acc = 0;
    let p = 1;
    for (let j = 0; j < size; j++) {
      acc += w[j] * p;
      p *= t;
    }
    return acc;
  };
}

function mse(fn: (t: number) => number, data: Sample[]): number {
  if (data.length === 0) return 0;
  let acc = 0;
  for (const s of data) acc += (fn(s.t) - s.y) ** 2;
  return acc / data.length;
}

type ErrorRow = { degree: number; train: number; val: number };

// Whole error curve over the degree range plus the optimum degree (minimum
// validation error). Computed once, deterministically, at module load.
const ERROR_CURVE: ErrorRow[] = (() => {
  const rows: ErrorRow[] = [];
  for (let d = MIN_DEGREE; d <= MAX_DEGREE; d++) {
    const fn = fitPolynomial(DATASET.train, d);
    rows.push({ degree: d, train: mse(fn, DATASET.train), val: mse(fn, DATASET.test) });
  }
  return rows;
})();

const OPTIMUM_DEGREE = ERROR_CURVE.reduce(
  (best, r) => (r.val < best.val ? r : best),
  ERROR_CURVE[0],
).degree;

const MAX_ECM = ERROR_CURVE.reduce((m, r) => Math.max(m, r.train, r.val), 0);
const ECM_SCALE = Math.min(Math.max(MAX_ECM * 1.08, 0.6), 2);

const COLORS = {
  train: "#38bdf8",
  test: "#f43f5e",
  fit: "#45dcc6",
  true: "#9ca3af",
};

// Geometry: a left scatter panel and a right error-curve panel inside one
// scaled viewBox. No hardcoded pixel width — the SVG scales to its container.
const LX0 = 66;
const LX1 = 452;
const LY0 = 62;
const LY1 = 320;
const VMIN = -0.5;
const VMAX = 1.6;
const xL = (t: number) => LX0 + t * (LX1 - LX0);
const yL = (v: number) => LY1 - ((v - VMIN) / (VMAX - VMIN)) * (LY1 - LY0);
const yLc = (v: number) => yL(Math.max(VMIN, Math.min(VMAX, v)));

const RX0 = 560;
const RX1 = 748;
const RY0 = 70;
const RY1 = 320;
const xd = (d: number) => RX0 + ((d - MIN_DEGREE) / (MAX_DEGREE - MIN_DEGREE)) * (RX1 - RX0);
const yc = (e: number) => RY1 - (Math.min(e, ECM_SCALE) / ECM_SCALE) * (RY1 - RY0);

/**
 * Interactive overfitting demo.
 *
 * Unlike the linear players this one teaches by INTERACTION, not playback: the
 * student drags the polynomial degree and sees the fit, the training error and
 * the validation error react instantly. The timeline is still wired in — its
 * `progress` sweeps a tracer along the current curve (and drives the shared
 * playback bar), so pressing play or scrubbing reads off the model's prediction
 * across the feature range. Everything is deterministic.
 */
export function OverfittingPlayer({ caption, autoPlay = false }: OverfittingPlayerProps) {
  const [degree, setDegree] = useState(2);
  const timeline = useAnymotionTimeline({ duration: 2.4, autoPlay });

  const fit = useMemo(() => fitPolynomial(DATASET.train, degree), [degree]);
  const current = ERROR_CURVE[degree - MIN_DEGREE];

  const tracerT = timeline.progress;
  const tracerPred = fit(tracerT);

  const truePath = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      pts.push(`${xL(t).toFixed(1)},${yLc(fTrue(t)).toFixed(1)}`);
    }
    return pts.join(" ");
  }, []);

  const fitPath = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 120; i++) {
      const t = i / 120;
      pts.push(`${xL(t).toFixed(1)},${yLc(fit(t)).toFixed(1)}`);
    }
    return pts.join(" ");
  }, [fit]);

  const trainCurve = ERROR_CURVE.map((r) => `${xd(r.degree).toFixed(1)},${yc(r.train).toFixed(1)}`).join(" ");
  const valCurve = ERROR_CURVE.map((r) => `${xd(r.degree).toFixed(1)},${yc(r.val).toFixed(1)}`).join(" ");

  let diagnosis: string;
  let tone: string;
  if (degree === OPTIMUM_DEGREE) {
    diagnosis = "Punto óptimo: generaliza sin memorizar.";
    tone = "text-mint";
  } else if (degree < OPTIMUM_DEGREE) {
    diagnosis = "Subajuste: el modelo es demasiado simple.";
    tone = "text-amber-300";
  } else {
    diagnosis = "Sobreajuste: memoriza el ruido y falla con datos nuevos.";
    tone = "text-rose-300";
  }

  const setDegreeClamped = (v: number) => {
    setDegree(Math.max(MIN_DEGREE, Math.min(MAX_DEGREE, v)));
  };

  return (
    <figure className="my-5">
      <AnymotionStage title="Overfitting: grado del polinomio y error">
        <svg viewBox="0 0 800 450" className="h-full w-full bg-[#0a0a0a]" role="img" aria-label="Ajuste polinomial y errores de entrenamiento y validación">
          {/* Panel titles */}
          <text x={(LX0 + LX1) / 2} y={34} textAnchor="middle" fill="white" fontSize={13} fontFamily="sans-serif" fontWeight={700} opacity={0.92}>
            Ajuste polinomio grado {degree}
          </text>
          <text x={(RX0 + RX1) / 2} y={34} textAnchor="middle" fill="white" fontSize={13} fontFamily="sans-serif" fontWeight={700} opacity={0.92}>
            ECM vs grado
          </text>

          {/* === LEFT: scatter + curves === */}
          {/* axes */}
          <line x1={LX0} y1={LY0} x2={LX0} y2={LY1} stroke="white" strokeWidth={1.1} opacity={0.5} />
          <line x1={LX0} y1={LY1} x2={LX1} y2={LY1} stroke="white" strokeWidth={1.1} opacity={0.5} />

          {/* true function (dashed gray) */}
          <polyline points={truePath} fill="none" stroke={COLORS.true} strokeWidth={1.4} strokeDasharray="6 5" opacity={0.7} />
          {/* fitted curve (mint) */}
          <polyline points={fitPath} fill="none" stroke={COLORS.fit} strokeWidth={2.2} opacity={0.95} />

          {/* points */}
          {DATASET.train.map((s, i) => (
            <circle key={`tr-${i}`} cx={xL(s.t)} cy={yL(s.y)} r={4} fill={COLORS.train} opacity={0.85} stroke="#0a0a0a" strokeWidth={0.6} />
          ))}
          {DATASET.test.map((s, i) => (
            <circle key={`te-${i}`} cx={xL(s.t)} cy={yL(s.y)} r={4} fill={COLORS.test} opacity={0.85} stroke="#0a0a0a" strokeWidth={0.6} />
          ))}

          {/* tracer following timeline progress */}
          <line x1={xL(tracerT)} y1={yLc(tracerPred)} x2={xL(tracerT)} y2={LY1} stroke={COLORS.fit} strokeWidth={0.8} strokeDasharray="2 3" opacity={0.5} />
          <circle cx={xL(tracerT)} cy={yLc(tracerPred)} r={5.5} fill={COLORS.fit} stroke="#0a0a0a" strokeWidth={1} />
          <text
            x={Math.max(LX0 + 30, Math.min(LX1 - 30, xL(tracerT)))}
            y={Math.max(LY0 + 8, yLc(tracerPred) - 12)}
            textAnchor="middle"
            fill="white"
            fontSize={9}
            fontFamily="monospace"
            opacity={0.7}
          >
            {`x ${tracerT.toFixed(2)} → ŷ ${tracerPred.toFixed(2)}`}
          </text>

          {/* legend (left panel) */}
          <g fontFamily="monospace" fontSize={9} opacity={0.85}>
            <circle cx={LX0 + 6} cy={350} r={4} fill={COLORS.train} />
            <text x={LX0 + 14} y={353} fill="white">entrenamiento</text>
            <circle cx={LX0 + 118} cy={350} r={4} fill={COLORS.test} />
            <text x={LX0 + 126} y={353} fill="white">prueba</text>
            <line x1={LX0 + 190} y1={350} x2={LX0 + 214} y2={350} stroke={COLORS.fit} strokeWidth={2.2} />
            <text x={LX0 + 220} y={353} fill="white">ajuste</text>
            <line x1={LX0 + 272} y1={350} x2={LX0 + 296} y2={350} stroke={COLORS.true} strokeWidth={1.4} strokeDasharray="5 4" />
            <text x={LX0 + 302} y={353} fill="white">función real</text>
          </g>

          {/* === RIGHT: error curves === */}
          <line x1={RX0} y1={RY0} x2={RX0} y2={RY1} stroke="white" strokeWidth={1.1} opacity={0.45} />
          <line x1={RX0} y1={RY1} x2={RX1} y2={RY1} stroke="white" strokeWidth={1.1} opacity={0.5} />
          <text x={RX0 - 8} y={RY0 - 8} fill="white" fontSize={9} fontFamily="monospace" opacity={0.6} transform={`rotate(-90 ${RX0 - 8} ${RY0 - 8})`} textAnchor="end">
            ECM
          </text>

          {/* optimum vertical marker */}
          <line x1={xd(OPTIMUM_DEGREE)} y1={RY0} x2={xd(OPTIMUM_DEGREE)} y2={RY1} stroke="#f59e0b" strokeWidth={1} strokeDasharray="4 4" opacity={0.8} />
          <polygon points={`${xd(OPTIMUM_DEGREE)},${RY0 - 2} ${xd(OPTIMUM_DEGREE) - 4},${RY0 - 9} ${xd(OPTIMUM_DEGREE) + 4},${RY0 - 9}`} fill="#f59e0b" />
          <text x={xd(OPTIMUM_DEGREE)} y={RY0 - 14} textAnchor="middle" fill="#f59e0b" fontSize={9} fontFamily="monospace" fontWeight={700}>
            punto óptimo
          </text>

          {/* curves */}
          <polyline points={trainCurve} fill="none" stroke={COLORS.train} strokeWidth={1.8} opacity={0.9} />
          <polyline points={valCurve} fill="none" stroke={COLORS.test} strokeWidth={1.8} opacity={0.9} />

          {/* current degree marker + readouts */}
          <line x1={xd(degree)} y1={RY0} x2={xd(degree)} y2={RY1} stroke="white" strokeWidth={1} opacity={0.5} />
          <circle cx={xd(degree)} cy={yc(current.train)} r={4} fill={COLORS.train} stroke="#0a0a0a" strokeWidth={1} />
          <circle cx={xd(degree)} cy={yc(current.val)} r={4} fill={COLORS.test} stroke="#0a0a0a" strokeWidth={1} />

          {/* x ticks */}
          <g fontSize={8} fontFamily="monospace" fill="white" opacity={0.45} textAnchor="middle">
            <text x={xd(MIN_DEGREE)} y={RY1 + 14}>{MIN_DEGREE}</text>
            <text x={xd(Math.round((MIN_DEGREE + MAX_DEGREE) / 2))} y={RY1 + 14}>{Math.round((MIN_DEGREE + MAX_DEGREE) / 2)}</text>
            <text x={xd(MAX_DEGREE)} y={RY1 + 14}>{MAX_DEGREE}</text>
          </g>
          <text x={(RX0 + RX1) / 2} y={RY1 + 30} textAnchor="middle" fill="white" fontSize={9} fontFamily="monospace" opacity={0.55}>
            grado del polinomio
          </text>

          {/* numeric ECM readouts (Spanish) */}
          <g fontFamily="monospace" fontSize={10}>
            <rect x={RX0} y={RY0 + 8} width={9} height={9} rx={2} fill={COLORS.train} />
            <text x={RX0 + 14} y={RY0 + 16} fill="white">ECM entrenamiento: <tspan fill={COLORS.train}>{current.train.toFixed(3)}</tspan></text>
            <rect x={RX0} y={RY0 + 26} width={9} height={9} rx={2} fill={COLORS.test} />
            <text x={RX0 + 14} y={RY0 + 34} fill="white">ECM validación: <tspan fill={COLORS.test}>{current.val.toFixed(3)}</tspan></text>
          </g>
        </svg>
      </AnymotionStage>

      <AnymotionControls timeline={timeline} label="Recorrido de la curva de ajuste" />

      <div className="mt-2 flex flex-col gap-2 rounded-card border border-white/10 bg-surface-card px-4 py-3 text-storm sm:flex-row sm:items-center sm:gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDegreeClamped(degree - 1)}
            disabled={degree <= MIN_DEGREE}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-sm font-semibold text-storm transition-colors hover:bg-mint/10 hover:text-mint disabled:opacity-40"
            aria-label="Reducir grado del polinomio"
          >
            −
          </button>
          <label htmlFor="overfit-degree" className="font-mono text-xs whitespace-nowrap text-storm">
            Grado{" "}
            <span className="font-semibold text-mint">
              {degree} / {MAX_DEGREE}
            </span>
          </label>
          <button
            type="button"
            onClick={() => setDegreeClamped(degree + 1)}
            disabled={degree >= MAX_DEGREE}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-sm font-semibold text-storm transition-colors hover:bg-mint/10 hover:text-mint disabled:opacity-40"
            aria-label="Aumentar grado del polinomio"
          >
            +
          </button>
        </div>
        <input
          id="overfit-degree"
          type="range"
          min={MIN_DEGREE}
          max={MAX_DEGREE}
          step={1}
          value={degree}
          onChange={(e) => setDegreeClamped(Number(e.target.value))}
          className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-gray-200 accent-mint"
          aria-label="Grado del polinomio"
        />
        <span className={`font-mono text-[11px] ${tone}`} aria-live="polite">
          {diagnosis}
        </span>
      </div>

      {caption && <figcaption className="mt-2 text-center font-mono text-[11px] text-storm">{caption}</figcaption>}
    </figure>
  );
}

"use client"

import { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";

// Plotly MUST be loaded only on the client — it accesses browser globals (self) at import time
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false }) as React.ComponentType<any>;

// ── Data types (mirrors perceptron-trainer.json) ──

interface DataPoint {
  radius_mean: number;
  texture_mean: number;
  label: number; // 0 = benigno, 1 = maligno
}

interface DatasetJson {
  points: DataPoint[];
  n_samples: number;
  n_benign: number;
  n_malignant: number;
  feature_names: string[];
  feature_keys: string[];
  source: string;
  source_url: string;
}

// ── Split / subsample result ──

interface FitResult {
  coefs: number[];       // polynomial coefficients [c₀, c₁, ..., c_d] from QR
  predsTrain: number[];  // ŷ for train
  predsTest: number[];   // ŷ for test
  ecmTrain: number;      // MSE on train
  ecmTest: number;       // MSE on test
}

interface PrecomputedResults {
  trainAbs: number[];       // indices into dataset.points for the 50 train points
  testAbs: number[];        // indices into dataset.points for the 172 test points
  fits: FitResult[];        // fits[0] = degree 1, ..., fits[14] = degree 15
}

// ── Constants ──

const DATA_URL = "/data/perceptron-trainer.json";
const SPLIT_SEED = 42;
const SUBSAMPLE_SEED = 7;
const SPLIT_TRAIN_RATIO = 0.7;
const SUBSAMPLE_SIZE = 50;
const MIN_DEGREE = 1;
const MAX_DEGREE = 15;
const DEFAULT_DEGREE = 1;

const sourceUrl = "https://archive.ics.uci.edu/dataset/17/breast+cancer+wisconsin+diagnostic";

// ── Deterministic PRNG (mulberry32) ──
// Same implementation as knn-trainer.tsx

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], rand: () => number): T[] {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Min-max normalization ──

function normalizeX(points: DataPoint[]): { xMin: number; xMax: number; xn: Float64Array } {
  let xMin = Infinity;
  let xMax = -Infinity;
  for (const p of points) {
    if (p.radius_mean < xMin) xMin = p.radius_mean;
    if (p.radius_mean > xMax) xMax = p.radius_mean;
  }
  const range = xMax - xMin;
  const xn = new Float64Array(points.length);
  for (let i = 0; i < points.length; i++) {
    xn[i] = range > 0 ? (points[i].radius_mean - xMin) / range : 0;
  }
  return { xMin, xMax, xn };
}

// ── Householder QR decomposition ──
// V = Q·R where V is m×(d+1) Vandermonde (first column all 1's, then x, x², …, x^d)
// Returns R matrix (d+1 × d+1 upper triangular) and Qᵀy vector (compacted)
// λ=0 strictly — NO regularization.

function householderQR(
  V: number[][],
  y: Float64Array,
): { R: number[][]; Qty: number[] } {
  const m = V.length;        // rows (50)
  const n = V[0].length;     // cols (d+1)

  // Make mutable copies
  const A: number[][] = V.map((row) => row.slice());
  const b: number[] = Array.from(y);

  for (let j = 0; j < n; j++) {
    // Compute Householder vector for column j (lower part)
    let sigma = 0;
    for (let i = j; i < m; i++) sigma += A[i][j] * A[i][j];
    const norm = Math.sqrt(sigma);
    if (norm < 1e-15) continue; // column already zero

    const alpha = A[j][j] > 0 ? -norm : norm;
    const beta = 1 / (sigma - alpha * A[j][j]);

    // v = column - alpha * e₁
    const v: number[] = [];
    for (let i = 0; i < m - j; i++) {
      v.push(i === 0 ? A[j + i][j] - alpha : A[j + i][j]);
    }

    // Apply to remaining columns of A
    for (let k = j; k < n; k++) {
      // Compute dot(v, column_k[j:])
      let dot = 0;
      for (let i = 0; i < v.length; i++) dot += v[i] * A[j + i][k];
      const tau = beta * dot;
      for (let i = 0; i < v.length; i++) A[j + i][k] -= tau * v[i];
    }

    // Apply to b
    let dotB = 0;
    for (let i = 0; i < v.length; i++) dotB += v[i] * b[j + i];
    const tauB = beta * dotB;
    for (let i = 0; i < v.length; i++) b[j + i] -= tauB * v[i];
  }

  // Extract R (upper triangular) and Qᵀy (first n rows of b after transformations)
  const R: number[][] = [];
  for (let i = 0; i < n; i++) {
    R.push(A[i].slice(i, n));
    // Pad with leading zeros to make R upper triangular
    while (R[i].length < n) R[i].unshift(0);
  }

  return { R, Qty: b.slice(0, n) };
}

// ── Back-substitution for R·c = Qᵀy (R is upper triangular) ──

function backSubstitute(R: number[][], Qty: number[]): number[] {
  const n = R.length;
  const c = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < n; j++) {
      sum += R[i][j] * c[j];
    }
    c[i] = (Qty[i] - sum) / R[i][i];
  }
  return c;
}

// ── Build Vandermonde matrix: [1, x, x², …, x^d] for each row ──

function buildVandermonde(xn: Float64Array, indices: number[], degree: number): number[][] {
  const V: number[][] = [];
  for (const idx of indices) {
    const row: number[] = [];
    const x = xn[idx];
    for (let d = 0; d <= degree; d++) {
      row.push(d === 0 ? 1 : (d === 1 ? x : Math.pow(x, d)));
    }
    V.push(row);
  }
  return V;
}

// ── Polynomial prediction from coefficients ──

function polyPredict(xn: Float64Array, coefs: number[]): number[] {
  const preds: number[] = [];
  const d = coefs.length - 1; // degree
  for (let i = 0; i < xn.length; i++) {
    let y = 0;
    const x = xn[i];
    for (let j = 0; j <= d; j++) {
      y += coefs[j] * (j === 0 ? 1 : (j === 1 ? x : Math.pow(x, j)));
    }
    preds.push(y);
  }
  return preds;
}

function computeECM(yTrue: number[], yPred: number[]): number {
  let sum = 0;
  for (let i = 0; i < yTrue.length; i++) {
    const e = yTrue[i] - yPred[i];
    sum += e * e;
  }
  return sum / yTrue.length;
}

// ── Stratified split + subsample + precompute fits ──
// Deterministic: mulberry32(42) → 70/30 stratified → mulberry32(7) → 50 train stratified

function computeSplitsAndFits(dataset: DatasetJson): PrecomputedResults {
  const allPoints = dataset.points;
  const n = allPoints.length;
  const { xn } = normalizeX(allPoints);

  // Separate indices by class
  const benignIdx: number[] = [];
  const malignIdx: number[] = [];
  for (let i = 0; i < n; i++) {
    if (allPoints[i].label === 1) malignIdx.push(i);
    else benignIdx.push(i);
  }

  // Mulberry32(42) stratified 70/30 split
  const rand42 = mulberry32(SPLIT_SEED);
  const shufB = shuffle(benignIdx, rand42);
  const shufM = shuffle(malignIdx, rand42);

  const nB = Math.floor(shufB.length * SPLIT_TRAIN_RATIO);
  const nM = Math.floor(shufM.length * SPLIT_TRAIN_RATIO);

  const trainPoolB = shufB.slice(0, nB);
  const trainPoolM = shufM.slice(0, nM);
  const testAbs = [...shufB.slice(nB), ...shufM.slice(nM)];

  // Mulberry32(7) stratified subsample train to 50
  const ratioFull = allPoints.filter((p) => p.label === 0).length / n;
  const nSubB = Math.round(SUBSAMPLE_SIZE * ratioFull);
  const nSubM = SUBSAMPLE_SIZE - nSubB;

  // Shuffle train pools again with seed 7 and take proportional amounts
  const rand7 = mulberry32(SUBSAMPLE_SEED);
  const subB = shuffle(trainPoolB, rand7).slice(0, nSubB);
  const subM = shuffle(trainPoolM, rand7).slice(0, nSubM);
  const trainAbs = [...subB, ...subM];

  // Precompute fits for degrees 1–15
  const fits: FitResult[] = [];
  for (let deg = MIN_DEGREE; deg <= MAX_DEGREE; deg++) {
    const Vtrain = buildVandermonde(xn, trainAbs, deg);
    const yTrain = new Float64Array(trainAbs.map((i) => allPoints[i].label));

    const { R, Qty } = householderQR(Vtrain, yTrain);
    const coefs = backSubstitute(R, Qty);

    const Vtest = buildVandermonde(xn, testAbs, deg);
    const predsTrain = polyPredict(
      new Float64Array(trainAbs.map((i) => xn[i])),
      coefs,
    );
    const predsTest = polyPredict(
      new Float64Array(testAbs.map((i) => xn[i])),
      coefs,
    );

    fits.push({
      coefs,
      predsTrain,
      predsTest,
      ecmTrain: computeECM(
        trainAbs.map((i) => allPoints[i].label),
        predsTrain,
      ),
      ecmTest: computeECM(
        testAbs.map((i) => allPoints[i].label),
        predsTest,
      ),
    });
  }

  return { trainAbs, testAbs, fits };
}

// ── Diagnosis bands per §12 table ──

function getDiagnosis(degree: number): { label: string; severity: "subajuste" | "optimo" | "transicion" | "sobreajuste" } {
  if (degree <= 2) return { label: "Subajuste", severity: "subajuste" };
  if (degree <= 6) return { label: "Punto óptimo", severity: "optimo" };
  if (degree === 7) return { label: "transición (óptimo)", severity: "transicion" };
  return { label: "Sobreajuste", severity: "sobreajuste" };
}

// ── Component ──

export function OverfittingTrainer() {
  const [dataset, setDataset] = useState<DatasetJson | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [precomputed, setPrecomputed] = useState<PrecomputedResults | null>(null);
  const [xMin, setXMin] = useState<number>(0);
  const [xMax, setXMax] = useState<number>(0);
  const [degree, setDegree] = useState(DEFAULT_DEGREE);

  const abortRef = useRef<AbortController | null>(null);

  // Fetch dataset on mount
  useEffect(() => {
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    setFetchLoading(true);
    setFetchError(null);

    fetch(DATA_URL, { signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<DatasetJson>;
      })
      .then((data) => {
        const norm = normalizeX(data.points);
        const results = computeSplitsAndFits(data);
        setXMin(norm.xMin);
        setXMax(norm.xMax);
        setDataset(data);
        setPrecomputed(results);
        setFetchLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setFetchError(err.message);
        setFetchLoading(false);
      });

    return () => {
      abortRef.current?.abort();
    };
  }, []);

  // Current fit
  const currentFit = useMemo(
    () => (precomputed ? precomputed.fits[degree - 1] : null),
    [precomputed, degree],
  );

  // Smooth curve points for the fit line
  const curveData = useMemo(() => {
    if (!precomputed || !dataset) return null;
    const fit = precomputed.fits[degree - 1];
    const nCurve = 200;
    const xnCurve: number[] = [];
    const yCurve: number[] = [];
    const realX: number[] = [];
    for (let i = 0; i <= nCurve; i++) {
      const xn = i / nCurve;
      xnCurve.push(xn);
      // Predict from coefficients
      let y = 0;
      for (let j = 0; j < fit.coefs.length; j++) {
        y += fit.coefs[j] * (j === 0 ? 1 : (j === 1 ? xn : Math.pow(xn, j)));
      }
      yCurve.push(y);
      realX.push(xMin + xn * (xMax - xMin));
    }
    return { realX, yCurve };
  }, [precomputed, dataset, degree, xMin, xMax]);

  // ── Loading state ──

  if (fetchLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-card border border-gray-200 shadow-sm p-8 text-center">
          <div className="inline-flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand"></div>
            <span className="text-sm text-gray-600">Cargando datos de biopsias…</span>
          </div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-card p-6 text-center">
          <p className="text-sm text-red-800 mb-2">Error al cargar los datos: {fetchError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-btn hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!dataset || !precomputed || !currentFit || !curveData) return null;

  const allPoints = dataset.points;
  const { trainAbs, testAbs } = precomputed;
  const diagnosis = getDiagnosis(degree);

  // ── LEFT plot: scatter + fit curve ──

  const trainX = trainAbs.map((i) => allPoints[i].radius_mean);
  const trainY = trainAbs.map((i) => allPoints[i].label);
  const testX = testAbs.map((i) => allPoints[i].radius_mean);
  const testY = testAbs.map((i) => allPoints[i].label);

  // Shift test points slightly in Y so they don't overlap train at the same label
  const testYJitter = testY.map((y) => (y === 0 ? -0.05 : 1.05));

  const leftData: any[] = [
    {
      x: trainX,
      y: trainY,
      mode: "markers",
      type: "scatter",
      name: "Entrenamiento (50)",
      marker: { color: "#14b8a6", size: 8, opacity: 0.85, symbol: "circle" },
      hovertemplate: `radio: %{x:.2f}<br>clase: %{y:d}<extra>Entrenamiento</extra>`,
    },
    {
      x: testX,
      y: testYJitter,
      mode: "markers",
      type: "scatter",
      name: "Prueba (172)",
      marker: { color: "#f59e0b", size: 5, opacity: 0.7, symbol: "x" },
      hovertemplate: `radio: %{x:.2f}<br>clase: %{customdata:d}<extra>Prueba</extra>`,
      customdata: testY,
    },
    {
      x: curveData.realX,
      y: curveData.yCurve,
      mode: "lines",
      type: "scatter",
      name: `Grado ${degree}`,
      line: { color: "#0f172a", width: 2 },
      hoverinfo: "skip",
    },
  ];

  const leftLayout: any = {
    title: {
      text: `Ajuste polinomial — Grado ${degree}`,
      font: { size: 13 },
    },
    xaxis: {
      title: "Radio medio (µm)",
      gridcolor: "#f1f5f9",
      zerolinecolor: "#e2e8f0",
      range: [xMin - 0.5, xMax + 0.5],
    },
    yaxis: {
      title: "Clase (0 = benigno, 1 = maligno)",
      gridcolor: "#f1f5f9",
      zerolinecolor: "#e2e8f0",
      range: [-0.25, 1.25],
      tickvals: [0, 1],
      ticktext: ["Benigno (0)", "Maligno (1)"],
    },
    height: 400,
    margin: { t: 40, r: 20, b: 50, l: 55 },
    paper_bgcolor: "white",
    plot_bgcolor: "white",
    legend: {
      orientation: "h" as const,
      y: -0.25,
      x: 0,
      font: { size: 10 },
    },
    hovermode: "closest" as const,
    showlegend: true,
  };

  // ── RIGHT plot: log-scale ECM bars ──

  const rightData: any[] = [
    {
      x: ["Entrenamiento", "Prueba"],
      y: [currentFit.ecmTrain, currentFit.ecmTest],
      type: "bar",
      marker: {
        color: ["#14b8a6", "#f59e0b"],
        opacity: 0.85,
      },
      hovertemplate: "ECM: %{y:.4f}<extra></extra>",
      text: [currentFit.ecmTrain.toFixed(4), currentFit.ecmTest.toFixed(4)],
      textposition: "outside" as const,
      textfont: { size: 11 },
    },
  ];

  const rightLayout: any = {
    title: {
      text: `ECM — Grado ${degree}`,
      font: { size: 13 },
    },
    yaxis: {
      type: "log",
      title: "ECM (escala log)",
      gridcolor: "#f1f5f9",
      zeroline: false,
    },
    xaxis: {
      gridcolor: "#f1f5f9",
    },
    height: 400,
    margin: { t: 40, r: 20, b: 60, l: 65 },
    paper_bgcolor: "white",
    plot_bgcolor: "white",
    showlegend: false,
  };

  const plotConfig = {
    responsive: true,
    displayModeBar: false,
    staticPlot: false,
  };

  const primaryBtnClass =
    "px-4 py-2 bg-brand text-white rounded-btn hover:bg-brand-hover transition-colors text-sm font-medium " +
    "focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:opacity-50 disabled:cursor-not-allowed";
  const secondaryBtnClass =
    "px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-btn hover:bg-gray-50 transition-colors text-sm font-medium " +
    "focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:opacity-50 disabled:cursor-not-allowed";

  const severityColors: Record<string, string> = {
    subajuste: "text-amber-700 bg-amber-50 border-amber-200",
    optimo: "text-emerald-700 bg-emerald-50 border-emerald-200",
    transicion: "text-sky-700 bg-sky-50 border-sky-200",
    sobreajuste: "text-red-700 bg-red-50 border-red-200",
  };

  const formatECM = (v: number): string => {
    if (v < 1) return v.toFixed(4);
    if (v < 1000) return v.toFixed(2);
    return v.toExponential(2);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-card border border-gray-200 shadow-sm p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="font-display text-lg font-semibold text-gray-900">
              Entrenador de sobreajuste
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Explora cómo la complejidad del modelo afecta la generalización con datos reales de biopsias.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
            <span className="inline-flex items-center gap-1.5">
              <span
                className="inline-block h-3 w-3 rounded-full bg-[#14b8a6]"
                aria-hidden="true"
              ></span>
              {trainAbs.length} entrenamiento
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-[#f59e0b] font-bold">×</span>
              {testAbs.length} prueba
            </span>
            <span className="font-mono text-gray-500">
              50 biopsias de entrenamiento (submuestra fija) · 172 de prueba
            </span>
          </div>
        </div>

        {/* Dual-panel plots */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* LEFT plot */}
          <div className="w-full overflow-hidden">
            <Plot
              data={leftData}
              layout={leftLayout}
              config={plotConfig}
              className="w-full"
              useResizeHandler={true}
            />
          </div>

          {/* RIGHT plot */}
          <div className="w-full overflow-hidden">
            <Plot
              data={rightData}
              layout={rightLayout}
              config={plotConfig}
              className="w-full"
              useResizeHandler={true}
            />
          </div>
        </div>

        {/* Controls + metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Degree slider */}
          <div className="rounded-card border border-gray-200 p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
              Grado del polinomio
            </h4>
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="degree-slider" className="text-sm font-medium text-gray-700">
                  Grado
                </label>
                <span className="font-mono text-sm text-gray-900">{degree}</span>
              </div>
              <input
                id="degree-slider"
                type="range"
                min={MIN_DEGREE}
                max={MAX_DEGREE}
                step={1}
                value={degree}
                onChange={(e) => setDegree(Number(e.target.value))}
                aria-label="Grado del polinomio"
                className="w-full accent-brand focus:outline-none"
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mb-2">
              <span>1</span>
              <span>7</span>
              <span>15</span>
            </div>
            {/* Zone labels */}
            <div className="flex justify-between text-[10px] font-medium">
              <span className="text-amber-600">Subajuste</span>
              <span className="text-emerald-600">Óptimo</span>
              <span className="text-red-600">Sobreajuste</span>
            </div>
          </div>

          {/* Metrics */}
          <div className="rounded-card border border-gray-200 p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
              Métricas — Grado {degree}
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">ECM Entrenamiento</span>
                <span className="font-mono text-gray-900">{formatECM(currentFit.ecmTrain)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">ECM Prueba</span>
                <span className="font-mono text-gray-900">{formatECM(currentFit.ecmTest)}</span>
              </div>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="rounded-card border border-gray-200 p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
              Diagnóstico
            </h4>
            <div
              aria-live="polite"
              className={`rounded-btn border px-3 py-2 text-sm font-medium ${severityColors[diagnosis.severity]}`}
            >
              {diagnosis.label}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Prueba arrastrar el slider: grados bajos subajustan, grados altos sobreajustan.
              Con datos reales el error de entrenamiento nunca llega a cero — el piso es ~0.10.
            </p>
          </div>
        </div>

        {/* Dataset citation */}
        <p className="mt-4 text-xs text-gray-500 leading-relaxed">
          Street, W.N., Wolberg, W.H. &amp; Mangasarian, O.L. (1993) — Breast Cancer Wisconsin
          (Diagnostic), UCI Machine Learning Repository.{" "}
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand underline underline-offset-2 hover:text-brand-hover"
          >
            archive.ics.uci.edu
          </a>
        </p>
      </div>
    </div>
  );
}

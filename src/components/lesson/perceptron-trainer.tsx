"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";

// Plotly MUST be loaded only on the client — it accesses browser globals (self) at import time
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false }) as React.ComponentType<any>;

interface DataPoint {
  radius_mean: number;
  texture_mean: number;
  label: number;
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

interface Weights {
  w1: number;
  w2: number;
  b: number;
}

interface NormParams {
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
}

interface LogEntry {
  id: number;
  sample: number;
  epoch: number;
  real: number;
  predicted: number;
  updated: boolean;
}

interface EvaluatedSample {
  x: number;
  y: number;
  sample: number;
  real: number;
  predicted: number;
  updated: boolean;
}

interface HypotheticalPoint {
  id: number;
  x: number;
  y: number;
}

const DATA_URL = "/data/perceptron-trainer.json";
const LOG_LIMIT = 20;
const AUTO_STEP_MS = 250;

const sourceUrl = "https://archive.ics.uci.edu/dataset/17/breast+cancer+wisconsin+diagnostic";

// Min-max normalization computed once over the full dataset
function computeNorm(points: DataPoint[]): NormParams {
  let xmin = Infinity;
  let xmax = -Infinity;
  let ymin = Infinity;
  let ymax = -Infinity;
  for (const p of points) {
    if (p.radius_mean < xmin) xmin = p.radius_mean;
    if (p.radius_mean > xmax) xmax = p.radius_mean;
    if (p.texture_mean < ymin) ymin = p.texture_mean;
    if (p.texture_mean > ymax) ymax = p.texture_mean;
  }
  return { xmin, xmax, ymin, ymax };
}

// Perceptron prediction on a normalized sample: signed +1/-1, ties break to +1
function predictSigned(w: Weights, xn: number, yn: number): number {
  return w.w1 * xn + w.w2 * yn + w.b >= 0 ? 1 : -1;
}

function predictLabel(w: Weights, xn: number, yn: number): number {
  return predictSigned(w, xn, yn) === 1 ? 1 : 0;
}

// Full-dataset accuracy (0..1) with the current weights
function computeAccuracy(dataset: DatasetJson, weights: Weights, norm: NormParams): number {
  const { xmin, xmax, ymin, ymax } = norm;
  let correct = 0;
  for (const p of dataset.points) {
    const xn = xmax !== xmin ? (p.radius_mean - xmin) / (xmax - xmin) : 0;
    const yn = ymax !== ymin ? (p.texture_mean - ymin) / (ymax - ymin) : 0;
    if (predictLabel(weights, xn, yn) === p.label) correct++;
  }
  return correct / dataset.points.length;
}

// Map a pixel click back to data coordinates using Plotly internals
function clickToDataCoords(ev: any): { x: number; y: number } | null {
  if (ev.points && ev.points.length > 0) {
    const pt = ev.points[0];
    if (typeof pt.x === "number" && typeof pt.y === "number") {
      return { x: pt.x, y: pt.y };
    }
  }
  const browserEv = ev?.event;
  const target = browserEv?.target as Element | undefined;
  const gd = target?.closest?.(".js-plotly-plot") as any;
  if (!gd || !gd._fullLayout) return null;
  const rect = gd.getBoundingClientRect();
  const xa = gd._fullLayout.xaxis;
  const ya = gd._fullLayout.yaxis;
  if (!xa || !ya) return null;
  const px = browserEv.clientX - rect.left;
  const py = browserEv.clientY - rect.top;
  const x = xa.range[0] + ((px - xa._offset) / xa._length) * (xa.range[1] - xa.range[0]);
  const y = ya.range[0] + ((py - ya._offset) / ya._length) * (ya.range[1] - ya.range[0]);
  return { x, y };
}

export function PerceptronTrainer() {
  const [dataset, setDataset] = useState<DatasetJson | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [norm, setNorm] = useState<NormParams | null>(null);

  const [weights, setWeights] = useState<Weights>({ w1: 0, w2: 0, b: 0 });
  const [learningRate, setLearningRate] = useState(0.1);
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [sampleIndex, setSampleIndex] = useState(0);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [evaluated, setEvaluated] = useState<EvaluatedSample | null>(null);
  const [hypothetical, setHypothetical] = useState<HypotheticalPoint[]>([]);

  const abortRef = useRef<AbortController | null>(null);
  const datasetRef = useRef<DatasetJson | null>(null);
  const normRef = useRef<NormParams | null>(null);
  const weightsRef = useRef<Weights>({ w1: 0, w2: 0, b: 0 });
  const lrRef = useRef(0.1);
  const epochRef = useRef(0);
  const sampleIndexRef = useRef(0);
  const logIdRef = useRef(0);
  const hypoIdRef = useRef(0);

  // Fetch pre-computed dataset on mount
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
        const n = computeNorm(data.points);
        datasetRef.current = data;
        normRef.current = n;
        setDataset(data);
        setNorm(n);
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

  // Keep refs in sync with state
  useEffect(() => {
    lrRef.current = learningRate;
  }, [learningRate]);

  // Single training step: evaluate the current sample and update weights if needed
  const stepSample = useCallback(() => {
    const ds = datasetRef.current;
    const n = normRef.current;
    if (!ds || !n || ds.points.length === 0) return;

    const lr = lrRef.current;
    const w = weightsRef.current;
    const i = sampleIndexRef.current;
    const p = ds.points[i];
    const { xmin, xmax, ymin, ymax } = n;
    const xn = xmax !== xmin ? (p.radius_mean - xmin) / (xmax - xmin) : 0;
    const yn = ymax !== ymin ? (p.texture_mean - ymin) / (ymax - ymin) : 0;

    const ySigned = p.label === 1 ? 1 : -1;
    const predSigned = predictSigned(w, xn, yn);
    const updated = predSigned !== ySigned;

    if (updated) {
      const nextW = {
        w1: w.w1 + lr * ySigned * xn,
        w2: w.w2 + lr * ySigned * yn,
        b: w.b + lr * ySigned,
      };
      weightsRef.current = nextW;
      setWeights(nextW);
    }

    const predicted = predSigned === 1 ? 1 : 0;
    logIdRef.current += 1;
    const entry: LogEntry = {
      id: logIdRef.current,
      sample: i + 1,
      epoch: epochRef.current + 1,
      real: p.label,
      predicted,
      updated,
    };
    setLog((prev) => [entry, ...prev].slice(0, LOG_LIMIT));
    setEvaluated({ x: p.radius_mean, y: p.texture_mean, sample: i + 1, real: p.label, predicted, updated });

    const next = i + 1;
    if (next >= ds.points.length) {
      epochRef.current += 1;
      sampleIndexRef.current = 0;
      setEpoch(epochRef.current);
      setSampleIndex(0);
    } else {
      sampleIndexRef.current = next;
      setSampleIndex(next);
    }
  }, []);

  // Auto training interval: same step on a timer until paused/reset/unmount
  useEffect(() => {
    if (!isTraining) return;
    const id = setInterval(() => stepSample(), AUTO_STEP_MS);
    return () => clearInterval(id);
  }, [isTraining, stepSample]);

  const handleReset = useCallback(() => {
    weightsRef.current = { w1: 0, w2: 0, b: 0 };
    epochRef.current = 0;
    sampleIndexRef.current = 0;
    setWeights({ w1: 0, w2: 0, b: 0 });
    setIsTraining(false);
    setEpoch(0);
    setSampleIndex(0);
    setLog([]);
    setEvaluated(null);
    setHypothetical([]);
  }, []);

  const handlePlotClick = useCallback((ev: any) => {
    const coords = clickToDataCoords(ev);
    if (!coords) return;
    hypoIdRef.current += 1;
    setHypothetical((prev) => [...prev, { id: hypoIdRef.current, x: coords.x, y: coords.y }]);
  }, []);

  // Derived values
  const accuracy = useMemo(() => {
    if (!dataset || !norm) return 0;
    return computeAccuracy(dataset, weights, norm);
  }, [dataset, norm, weights]);

  // Decision boundary in original coordinates (w1*xn + w2*yn + b = 0)
  const boundary = useMemo(() => {
    if (!norm) return null;
    const { w1, w2, b } = weights;
    const { xmin, xmax, ymin, ymax } = norm;
    const xs: number[] = [];
    const ys: number[] = [];
    if (Math.abs(w2) < 1e-9) {
      if (Math.abs(w1) < 1e-9) return null;
      const xn0 = -b / w1;
      const x0 = xmin + xn0 * (xmax - xmin);
      const yPad = 0.1 * (ymax - ymin);
      xs.push(x0, x0);
      ys.push(ymin - yPad, ymax + yPad);
    } else {
      const xPad = 0.1 * (xmax - xmin);
      for (const xn of [-0.1, 1.1]) {
        const yn = -(w1 * xn + b) / w2;
        xs.push(xmin + xn * (xmax - xmin));
        ys.push(ymin + yn * (ymax - ymin));
      }
    }
    return { xs, ys };
  }, [norm, weights]);

  // Live predictions for hypothetical samples using current weights
  const hypotheticalPredictions = useMemo(() => {
    if (!norm || !dataset) return [];
    return hypothetical.map((h) => {
      const { xmin, xmax, ymin, ymax } = norm;
      const xn = xmax !== xmin ? (h.x - xmin) / (xmax - xmin) : 0;
      const yn = ymax !== ymin ? (h.y - ymin) / (ymax - ymin) : 0;
      return { ...h, prediction: predictLabel(weights, xn, yn) };
    });
  }, [hypothetical, norm, weights, dataset]);

  const classLabel = (label: number): string => (label === 1 ? "maligno" : "benigno");

  const formatWeights = (value: number): string => value.toFixed(3);

  // --- Loading state ---

  if (fetchLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-surface-card rounded-card border border-gray-200 shadow-sm p-8 text-center">
          <div className="inline-flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-mint"></div>
            <span className="text-sm text-storm">Cargando datos de biopsias…</span>
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

  const nSamples = dataset?.n_samples ?? 0;
  const displayEpoch = epoch + 1;
  const displaySample = sampleIndex + 1;

  // --- Plot data ---
  const benignXs: number[] = [];
  const benignYs: number[] = [];
  const malignXs: number[] = [];
  const malignYs: number[] = [];
  if (dataset) {
    for (const p of dataset.points) {
      if (p.label === 1) {
        malignXs.push(p.radius_mean);
        malignYs.push(p.texture_mean);
      } else {
        benignXs.push(p.radius_mean);
        benignYs.push(p.texture_mean);
      }
    }
  }

  const data: any[] = [
    {
      x: benignXs,
      y: benignYs,
      mode: "markers",
      type: "scatter",
      name: "Benigno",
      marker: { color: "#14b8a6", size: 6, opacity: 0.75, symbol: "circle" },
      hovertemplate: `%{x:.2f}<br>%{y:.2f}<extra>Benigno</extra>`,
    },
    {
      x: malignXs,
      y: malignYs,
      mode: "markers",
      type: "scatter",
      name: "Maligno",
      marker: { color: "#3525cd", size: 6, opacity: 0.75, symbol: "triangle-up" },
      hovertemplate: `%{x:.2f}<br>%{y:.2f}<extra>Maligno</extra>`,
    },
  ];

  if (boundary) {
    data.push({
      x: boundary.xs,
      y: boundary.ys,
      mode: "lines",
      type: "scatter",
      name: "Frontera de decisión",
      line: { color: "#0f172a", width: 2.5, dash: "dot" },
      hoverinfo: "skip",
    });
  }

  if (evaluated) {
    data.push({
      x: [evaluated.x],
      y: [evaluated.y],
      mode: "markers",
      type: "scatter",
      name: "Muestra evaluada",
      marker: {
        color: "#f59e0b",
        size: 16,
        symbol: "circle",
        line: { color: "#0f172a", width: 2.5 },
      },
      customdata: [
        [
          evaluated.sample,
          classLabel(evaluated.real),
          classLabel(evaluated.predicted),
          evaluated.updated ? "pesos actualizados" : "sin cambio",
        ],
      ],
      hovertemplate: `Muestra #%{customdata[0]}<br>Real: %{customdata[1]}<br>Predicción: %{customdata[2]}<br>%{customdata[3]}<extra>Muestra evaluada</extra>`,
    });
  }

  if (hypotheticalPredictions.length > 0) {
    data.push({
      x: hypotheticalPredictions.map((h) => h.x),
      y: hypotheticalPredictions.map((h) => h.y),
      mode: "markers",
      type: "scatter",
      name: "Muestra hipotética",
      marker: {
        color: "#6b7280",
        size: 10,
        symbol: "diamond",
        opacity: 0.9,
        line: { color: "#000000", width: 1.5 },
      },
      customdata: hypotheticalPredictions.map((h) => [classLabel(h.prediction)]),
      hovertemplate: `%{x:.2f}<br>%{y:.2f}<br>Predicción: %{customdata[0]}<extra>Muestra hipotética</extra>`,
    });
  }

  const layout: any = {
    title: {
      text: "Biopsias de mama: radio medio vs. textura media",
      font: { size: 13 },
    },
    xaxis: {
      title: dataset?.feature_names[0] ?? "radio medio",
      gridcolor: "#f1f5f9",
      zerolinecolor: "#e2e8f0",
      range: [norm?.xmin ?? 0, norm?.xmax ?? 1],
    },
    yaxis: {
      title: dataset?.feature_names[1] ?? "textura media",
      gridcolor: "#f1f5f9",
      zerolinecolor: "#e2e8f0",
      range: [norm?.ymin ?? 0, norm?.ymax ?? 1],
    },
    height: 420,
    margin: { t: 40, r: 20, b: 50, l: 55 },
    paper_bgcolor: "white",
    plot_bgcolor: "white",
    legend: {
      orientation: "h" as const,
      y: -0.25,
      x: 0,
      font: { size: 11 },
    },
    hovermode: "closest" as const,
  };

  const config = {
    responsive: true,
    displayModeBar: false,
    staticPlot: false,
  };

  const primaryBtnClass =
    "px-4 py-2 bg-mint text-ink rounded-btn hover:bg-fog transition-colors text-sm font-medium " +
    "focus:outline-none focus:ring-2 focus:ring-mint/40 disabled:opacity-50 disabled:cursor-not-allowed";
  const secondaryBtnClass =
    "px-4 py-2 bg-surface-card text-gray-700 border border-gray-200 rounded-btn hover:bg-gray-50 transition-colors text-sm font-medium " +
    "focus:outline-none focus:ring-2 focus:ring-mint/40 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-surface-card rounded-card border border-gray-200 shadow-sm p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="font-display text-lg font-semibold text-ink">
              Entrenador de perceptrón
            </h3>
            <p className="text-sm text-storm mt-1">
              Aprende a separar biopsias benignas de malignas con una línea.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-storm">
            <span className="inline-flex items-center gap-1.5">
              <span
                className="inline-block h-3 w-3 rounded-full bg-[#14b8a6]"
                aria-hidden="true"
              ></span>
              Benigno ({dataset?.n_benign ?? 0})
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="inline-block h-0 w-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-[#3525cd]"
                aria-hidden="true"
              ></span>
              Maligno ({dataset?.n_malignant ?? 0})
            </span>
            <span className="font-mono text-storm">{nSamples} muestras</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Plot */}
          <div className="lg:col-span-2">
            <div className="w-full overflow-hidden">
              <Plot
                data={data}
                layout={layout}
                config={config}
                className="w-full"
                useResizeHandler={true}
                onClick={handlePlotClick}
              />
            </div>

            {/* Hypothetical prediction readout */}
            <div
              aria-live="polite"
              className="mt-3 rounded-card border border-gray-200 bg-gray-50 p-3"
            >
              {hypotheticalPredictions.length > 0 ? (
                <ul className="space-y-1">
                  {hypotheticalPredictions.map((h) => (
                    <li key={h.id} className="text-xs text-gray-700">
                      <span className="font-mono">
                        ({h.x.toFixed(1)}, {h.y.toFixed(1)})
                      </span>{" "}
                      → Predicción:{" "}
                      <span
                        className={`font-medium ${
                          h.prediction === 1 ? "text-[#3525cd]" : "text-[#14b8a6]"
                        }`}
                      >
                        {classLabel(h.prediction)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-storm">
                  Haz clic en una zona vacía del gráfico para predecir una muestra hipotética.
                </p>
              )}
            </div>

            {/* Dataset citation */}
            <p className="mt-3 text-xs text-storm leading-relaxed">
              Street, W.N., Wolberg, W.H. &amp; Mangasarian, O.L. (1993) — Breast Cancer Wisconsin
              (Diagnostic), UCI Machine Learning Repository.{" "}
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-mint underline underline-offset-2 hover:text-fog"
              >
                archive.ics.uci.edu
              </a>
            </p>
          </div>

          {/* Status + controls panel */}
          <div className="space-y-4">
            {/* Status */}
            <div className="rounded-card border border-gray-200 p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-storm mb-3">
                Estado del modelo
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-storm">w₁ (radio)</span>
                  <span className="font-mono text-ink">{formatWeights(weights.w1)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-storm">w₂ (textura)</span>
                  <span className="font-mono text-ink">{formatWeights(weights.w2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-storm">b (sesgo)</span>
                  <span className="font-mono text-ink">{formatWeights(weights.b)}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                  <span className="text-storm">Accuracy</span>
                  <span className="font-mono font-semibold text-ink">
                    {(accuracy * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-storm">Progreso</span>
                  <span className="font-mono text-ink">
                    Época {displayEpoch} · muestra {displaySample}/{nSamples}
                  </span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="rounded-card border border-gray-200 p-4">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="lr-slider" className="text-sm font-medium text-gray-700">
                    Tasa de aprendizaje
                  </label>
                  <span className="font-mono text-sm text-ink">{learningRate.toFixed(2)}</span>
                </div>
                <input
                  id="lr-slider"
                  type="range"
                  min={0.01}
                  max={0.5}
                  step={0.01}
                  value={learningRate}
                  onChange={(e) => setLearningRate(Number(e.target.value))}
                  aria-label="Tasa de aprendizaje"
                  className="w-full accent-brand focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={stepSample}
                  disabled={!dataset}
                  aria-label="Avanzar un paso de entrenamiento"
                  className={primaryBtnClass}
                >
                  Paso
                </button>
                <button
                  onClick={() => setIsTraining((t) => !t)}
                  disabled={!dataset}
                  aria-label={isTraining ? "Pausar el entrenamiento automático" : "Entrenar automáticamente"}
                  className={primaryBtnClass}
                >
                  {isTraining ? "Pausar" : "Entrenar"}
                </button>
                <button
                  onClick={handleReset}
                  aria-label="Reiniciar el entrenamiento"
                  className={secondaryBtnClass}
                >
                  Reiniciar
                </button>
              </div>

              {hypotheticalPredictions.length > 0 && (
                <button
                  onClick={() => setHypothetical([])}
                  aria-label="Limpiar las muestras hipotéticas"
                  className={`${secondaryBtnClass} mt-2 w-full`}
                >
                  Limpiar muestras hipotéticas
                </button>
              )}
            </div>

            {/* Update log */}
            <div className="rounded-card border border-gray-200 p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-storm mb-2">
                Bitácora de actualizaciones
              </h4>
              <div role="log" aria-live="polite" className="max-h-52 overflow-y-auto space-y-1 pr-1">
                {log.length === 0 ? (
                  <p className="text-xs text-gray-400">Todavía no se evaluó ninguna muestra.</p>
                ) : (
                  log.map((entry) => (
                    <p key={entry.id} className="font-mono text-xs text-gray-700">
                      #{entry.sample} · real: {classLabel(entry.real)} · pred:{" "}
                      {classLabel(entry.predicted)} ·{" "}
                      <span
                        className={
                          entry.updated ? "font-semibold text-mint" : "text-storm"
                        }
                      >
                        {entry.updated ? "pesos actualizados" : "sin cambio"}
                      </span>
                    </p>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
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

interface OLSResult {
  m: number;
  b: number;
  mse: number;
  r2: number;
}

interface NormParams {
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
}

const DATA_URL = "/data/perceptron-trainer.json";
const sourceUrl = "https://archive.ics.uci.edu/dataset/17/breast+cancer+wisconsin+diagnostic";

// Min-max bounds computed once over the full dataset
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

// OLS closed-form solution (AD2): m = Σ((x−x̄)(y−ȳ)) / Σ((x−x̄)²), b = ȳ − m·x̄
function computeOLS(points: DataPoint[]): OLSResult {
  const n = points.length;
  const xs = points.map((p) => p.radius_mean);
  const ys = points.map((p) => p.texture_mean);

  const x̄ = xs.reduce((a, v) => a + v, 0) / n;
  const ȳ = ys.reduce((a, v) => a + v, 0) / n;

  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - x̄;
    num += dx * (ys[i] - ȳ);
    den += dx * dx;
  }

  if (den === 0) return { m: 0, b: ȳ, mse: 0, r2: 0 };

  const m = num / den;
  const b = ȳ - m * x̄;

  // MSE and R²
  let ss_res = 0;
  let ss_tot = 0;
  for (let i = 0; i < n; i++) {
    const yPred = m * xs[i] + b;
    ss_res += (ys[i] - yPred) ** 2;
    ss_tot += (ys[i] - ȳ) ** 2;
  }

  const mse = ss_res / n;
  const r2 = ss_tot > 0 ? 1 - ss_res / ss_tot : 0;

  return { m, b, mse, r2 };
}

// Compute ECM and R² for an arbitrary m, b pair (live updates)
function computeMetricsSW(
  points: DataPoint[],
  m: number,
  b: number,
): { mse: number; r2: number } {
  const n = points.length;
  const ys = points.map((p) => p.texture_mean);
  const ȳ = ys.reduce((a, v) => a + v, 0) / n;

  let ss_res = 0;
  let ss_tot = 0;
  for (let i = 0; i < n; i++) {
    const yPred = m * points[i].radius_mean + b;
    ss_res += (points[i].texture_mean - yPred) ** 2;
    ss_tot += (points[i].texture_mean - ȳ) ** 2;
  }

  const mse = ss_res / n;
  const r2 = ss_tot > 0 ? 1 - ss_res / ss_tot : 0;
  return { mse, r2 };
}

export function RegressionTrainer() {
  const [dataset, setDataset] = useState<DatasetJson | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [norm, setNorm] = useState<NormParams | null>(null);
  const [ols, setOls] = useState<OLSResult | null>(null);

  // Slider state — defaults to OLS optimum once computed (AD3)
  const [m, setM] = useState<number>(0);
  const [b, setB] = useState<number>(0);

  // Predict state (AD4)
  const [predictInput, setPredictInput] = useState<string>("");
  const [predictResult, setPredictResult] = useState<string | null>(null);
  const [predictError, setPredictError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const datasetRef = useRef<DataPoint[]>([]);

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
        const olsResult = computeOLS(data.points);
        datasetRef.current = data.points;
        setDataset(data);
        setNorm(n);
        setOls(olsResult);
        setM(olsResult.m);
        setB(olsResult.b);
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

  // Snap to OLS optimum (AD2: "Calcular mejor recta")
  const handleSnapOptimum = useCallback(() => {
    if (!ols) return;
    setM(ols.m);
    setB(ols.b);
  }, [ols]);

  // Predict with range validation (AD4)
  const handlePredict = useCallback(() => {
    setPredictError(null);
    setPredictResult(null);

    const val = parseFloat(predictInput);
    if (isNaN(val)) {
      setPredictError("Ingresá un valor numérico.");
      return;
    }
    if (!norm) return;

    if (val < norm.xmin || val > norm.xmax) {
      setPredictError(
        `El valor debe estar entre ${norm.xmin.toFixed(1)} y ${norm.xmax.toFixed(1)} µm.`,
      );
      return;
    }

    const predicted = m * val + b;
    setPredictResult(
      `textura = ${m.toFixed(4)} · ${val.toFixed(1)} + ${b.toFixed(4)} = ${predicted.toFixed(2)}`,
    );
  }, [predictInput, m, b, norm]);

  // Reset: clear prediction, snap sliders to optimum (AD7 requirement)
  const handleReset = useCallback(() => {
    setPredictInput("");
    setPredictResult(null);
    setPredictError(null);
    if (ols) {
      setM(ols.m);
      setB(ols.b);
    }
  }, [ols]);

  // Live metrics based on current m, b (AD3)
  const liveMetrics = useMemo(() => {
    const pts = datasetRef.current;
    if (pts.length === 0) return { mse: 0, r2: 0 };
    return computeMetricsSW(pts, m, b);
  }, [m, b]);

  // --- Loading state ---
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

  const points = datasetRef.current;

  // --- Plot data (AD5: uniform color + error_y whiskers, AD6: #6366f1) ---
  const xs = points.map((p) => p.radius_mean);
  const ys = points.map((p) => p.texture_mean);

  // Residuals from current line: |y - (m*x + b)|
  const residuals = points.map((p) => Math.abs(p.texture_mean - (m * p.radius_mean + b)));

  // OLS line spanning the X range
  const lineX = [norm!.xmin, norm!.xmax];
  const lineY = [m * norm!.xmin + b, m * norm!.xmax + b];

  const data: any[] = [
    {
      x: xs,
      y: ys,
      mode: "markers",
      type: "scatter",
      name: "BCW Data",
      marker: { color: "#6366f1", size: 5, opacity: 0.7, symbol: "circle" },
      hovertemplate: `%{x:.2f}<br>%{y:.2f}<extra>Biopsia</extra>`,
      error_y: {
        type: "data",
        array: residuals,
        visible: true,
        color: "#94a3b8",
        thickness: 0.8,
        width: 0,
      },
    },
    {
      x: lineX,
      y: lineY,
      mode: "lines",
      type: "scatter",
      name: "Recta de regresión",
      line: { color: "#0f172a", width: 2.5 },
      hoverinfo: "skip",
    },
  ];

  const layout: any = {
    title: {
      text: "Biopsias de mama: radio medio vs. textura media",
      font: { size: 13 },
    },
    xaxis: {
      title: dataset?.feature_names[0] ?? "radio medio (µm)",
      gridcolor: "#f1f5f9",
      zerolinecolor: "#e2e8f0",
      range: [norm!.xmin, norm!.xmax],
    },
    yaxis: {
      title: dataset?.feature_names[1] ?? "textura media",
      gridcolor: "#f1f5f9",
      zerolinecolor: "#e2e8f0",
      range: [norm!.ymin, norm!.ymax],
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
    showlegend: false,
  };

  const config = {
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

  const formatMetric = (value: number): string => value.toFixed(3);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-card border border-gray-200 shadow-sm p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="font-display text-lg font-semibold text-gray-900">
              Entrenador de regresión
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Ajustá la mejor recta sobre biopsias reales y explorá el error.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
            <span className="font-mono text-gray-500">{dataset?.n_samples ?? 0} muestras</span>
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
              />
            </div>

            {/* Prediction result */}
            <div
              aria-live="polite"
              className="mt-3 rounded-card border border-gray-200 bg-gray-50 p-3"
            >
              {predictResult ? (
                <p className="text-sm text-gray-800">
                  <span className="font-mono">{predictResult}</span>
                </p>
              ) : (
                <p className="text-xs text-gray-500">
                  Probá "Predecir" para estimar la textura a partir de un valor de radio.
                </p>
              )}
            </div>

            {/* Dataset citation */}
            <p className="mt-3 text-xs text-gray-500 leading-relaxed">
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

          {/* Status + controls panel */}
          <div className="space-y-4">
            {/* Metrics */}
            <div className="rounded-card border border-gray-200 p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
                Métricas del modelo
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Pendiente (m)</span>
                  <span className="font-mono text-gray-900">{m.toFixed(4)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Intercepto (b)</span>
                  <span className="font-mono text-gray-900">{b.toFixed(4)}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                  <span className="text-gray-500">ECM</span>
                  <span className="font-mono font-semibold text-gray-900">
                    {formatMetric(liveMetrics.mse)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">R²</span>
                  <span className="font-mono font-semibold text-gray-900">
                    {formatMetric(liveMetrics.r2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Sliders */}
            <div className="rounded-card border border-gray-200 p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
                Ajuste manual
              </h4>

              {/* m slider (AD3: -0.5 to 1.0, step 0.005) */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="m-slider" className="text-sm font-medium text-gray-700">
                    Pendiente (m)
                  </label>
                  <span className="font-mono text-sm text-gray-900">{m.toFixed(3)}</span>
                </div>
                <input
                  id="m-slider"
                  type="range"
                  min={-0.5}
                  max={1.0}
                  step={0.005}
                  value={m}
                  onChange={(e) => setM(Number(e.target.value))}
                  aria-label="Pendiente de la recta de regresión"
                  className="w-full accent-brand focus:outline-none"
                />
              </div>

              {/* b slider (AD3: 0 to 30, step 0.5) */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="b-slider" className="text-sm font-medium text-gray-700">
                    Intercepto (b)
                  </label>
                  <span className="font-mono text-sm text-gray-900">{b.toFixed(1)}</span>
                </div>
                <input
                  id="b-slider"
                  type="range"
                  min={0}
                  max={30}
                  step={0.5}
                  value={b}
                  onChange={(e) => setB(Number(e.target.value))}
                  aria-label="Intercepto de la recta de regresión"
                  className="w-full accent-brand focus:outline-none"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="rounded-card border border-gray-200 p-4">
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  onClick={handleSnapOptimum}
                  aria-label="Calcular la mejor recta por mínimos cuadrados"
                  className={primaryBtnClass}
                >
                  Calcular mejor recta
                </button>
                <button
                  onClick={handleReset}
                  aria-label="Reiniciar los sliders y limpiar la predicción"
                  className={secondaryBtnClass}
                >
                  Reiniciar
                </button>
              </div>

              {/* Predict input (AD4) */}
              <div className="space-y-2">
                <label htmlFor="predict-input" className="text-sm font-medium text-gray-700">
                  Predecir textura
                </label>
                <div className="flex gap-2">
                  <input
                    id="predict-input"
                    type="number"
                    value={predictInput}
                    onChange={(e) => {
                      setPredictInput(e.target.value);
                      setPredictResult(null);
                      setPredictError(null);
                    }}
                    placeholder={norm ? `${norm.xmin.toFixed(1)}–${norm.xmax.toFixed(1)} µm` : "radio medio"}
                    aria-label="Valor de radio medio para predecir textura"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-btn focus:outline-none focus:ring-2 focus:ring-brand/40"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handlePredict();
                    }}
                  />
                  <button
                    onClick={handlePredict}
                    aria-label="Predecir textura a partir del valor de radio ingresado"
                    className={primaryBtnClass}
                  >
                    Predecir
                  </button>
                </div>
                {predictError && (
                  <p className="text-xs text-red-600" role="alert">
                    {predictError}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

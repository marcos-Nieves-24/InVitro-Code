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

interface NormParams {
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
}

interface KnnResult {
  benignCount: number;
  malignCount: number;
  prediction: number;
  neighborIndices: number[];
  kthDistNorm: number;
}

interface AccuracyData {
  train: number[];
  test: number[];
  trainSize: number;
  testSize: number;
}

interface MeshGrid {
  x: number[];
  y: number[];
  order: Int16Array[];
}

const DATA_URL = "/data/perceptron-trainer.json";
const K_DEFAULT = 3;
const K_MAX = 30;
const GRID_N = 80;
const MESH_PAD = 0.05;
const SPLIT_TRAIN_RATIO = 0.7;
const BOUNDARY_DEBOUNCE_MS = 80;

const COLOR_BENIGN = "#14b8a6";
const COLOR_MALIGN = "#3525cd";
const COLOR_TEST_POINT = "#6b7280";
const COLOR_NEIGHBOR_BORDER = "#0f172a";
const COLOR_TRAIN = "#3b82f6";
const COLOR_TEST_LINE = "#f59e0b";
const COLOR_K_MARKER = "#9ca3af";

const sourceUrl = "https://archive.ics.uci.edu/dataset/17/breast+cancer+wisconsin+diagnostic";

// Deterministic PRNG (mulberry32) so the stratified train/test split is reproducible with seed 42
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

// Fisher-Yates shuffle (copy) for the stratified split
function shuffle<T>(items: T[], rand: () => number): T[] {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

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

function classLabel(label: number): string {
  return label === 1 ? "maligno" : "benigno";
}

// For each query point, sort its references by distance once and accumulate the
// majority vote for every k in [1, K_MAX] with prefix class counts (ties go to
// the nearest neighbor). Fills `correct` with per-k hit counts.
function accumulatePredictions(
  queryAbs: number[],
  refAbs: number[],
  xn: Float64Array,
  yn: Float64Array,
  refLabels: number[],
  trueLabels: number[],
  correct: Int32Array,
): void {
  const m = refAbs.length;
  const dists = new Float64Array(m);
  const order: number[] = [];
  for (let i = 0; i < m; i++) order.push(i);

  for (let qi = 0; qi < queryAbs.length; qi++) {
    const qa = queryAbs[qi];
    const qx = xn[qa];
    const qy = yn[qa];
    for (let j = 0; j < m; j++) {
      const a = refAbs[j];
      const dx = xn[a] - qx;
      const dy = yn[a] - qy;
      dists[j] = dx * dx + dy * dy;
    }
    order.sort((a, b) => dists[a] - dists[b]);

    let nb = 0;
    let nm = 0;
    for (let k = 1; k <= K_MAX; k++) {
      if (refLabels[order[k - 1]] === 1) nm++;
      else nb++;
      const pred = nb !== nm ? (nb > nm ? 0 : 1) : refLabels[order[0]];
      if (pred === trueLabels[qi]) correct[k - 1]++;
    }
  }
}

// Deterministic stratified 70/30 split (seed 42) + train/test accuracy for all k.
// Train accuracy uses only training points (including the query itself), so at
// k=1 it is 100% — the pedagogical overfitting point.
function computeAccuracyData(dataset: DatasetJson, norm: NormParams): AccuracyData {
  const points = dataset.points;
  const n = points.length;

  const xn = new Float64Array(n);
  const yn = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    xn[i] =
      norm.xmax !== norm.xmin
        ? (points[i].radius_mean - norm.xmin) / (norm.xmax - norm.xmin)
        : 0;
    yn[i] =
      norm.ymax !== norm.ymin
        ? (points[i].texture_mean - norm.ymin) / (norm.ymax - norm.ymin)
        : 0;
  }

  const rand = mulberry32(42);
  const benignIdx: number[] = [];
  const malignIdx: number[] = [];
  for (let i = 0; i < n; i++) {
    if (points[i].label === 1) malignIdx.push(i);
    else benignIdx.push(i);
  }
  const shufB = shuffle(benignIdx, rand);
  const shufM = shuffle(malignIdx, rand);
  const nB = Math.floor(shufB.length * SPLIT_TRAIN_RATIO);
  const nM = Math.floor(shufM.length * SPLIT_TRAIN_RATIO);
  const trainAbs = [...shufB.slice(0, nB), ...shufM.slice(0, nM)];
  const testAbs = [...shufB.slice(nB), ...shufM.slice(nM)];
  const trainLabels = trainAbs.map((i) => points[i].label);
  const testLabels = testAbs.map((i) => points[i].label);

  const trainCorrect = new Int32Array(K_MAX);
  const testCorrect = new Int32Array(K_MAX);
  accumulatePredictions(trainAbs, trainAbs, xn, yn, trainLabels, trainLabels, trainCorrect);
  accumulatePredictions(testAbs, trainAbs, xn, yn, trainLabels, testLabels, testCorrect);

  return {
    train: Array.from(trainCorrect, (c) => (c / trainAbs.length) * 100),
    test: Array.from(testCorrect, (c) => (c / testAbs.length) * 100),
    trainSize: trainAbs.length,
    testSize: testAbs.length,
  };
}

// 80×80 meshgrid over the data range (padded 5%). For every cell center, sort the
// neighbor indices by normalized distance ONCE — the boundary then only re-votes
// when k changes instead of re-sorting all 6400 cells.
function buildMeshNeighbors(
  dataset: DatasetJson,
  norm: NormParams,
  normCoords: { nx: Float64Array; ny: Float64Array },
): MeshGrid {
  const { xmin, xmax, ymin, ymax } = norm;
  const xPad = MESH_PAD * (xmax - xmin);
  const yPad = MESH_PAD * (ymax - ymin);
  const gxmin = xmin - xPad;
  const gxmax = xmax + xPad;
  const gymin = ymin - yPad;
  const gymax = ymax + yPad;

  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i < GRID_N; i++) {
    xs.push(gxmin + (i / (GRID_N - 1)) * (gxmax - gxmin));
    ys.push(gymin + (i / (GRID_N - 1)) * (gymax - gymin));
  }

  const n = dataset.points.length;
  const dists = new Float64Array(n);
  const scratch: number[] = [];
  for (let i = 0; i < n; i++) scratch.push(i);

  const order: Int16Array[] = [];
  for (let j = 0; j < GRID_N; j++) {
    const gy = ys[j];
    for (let i = 0; i < GRID_N; i++) {
      const gx = xs[i];
      const qxn = xmax !== xmin ? (gx - xmin) / (xmax - xmin) : 0;
      const qyn = ymax !== ymin ? (gy - ymin) / (ymax - ymin) : 0;
      for (let p = 0; p < n; p++) {
        const dx = normCoords.nx[p] - qxn;
        const dy = normCoords.ny[p] - qyn;
        dists[p] = dx * dx + dy * dy;
        scratch[p] = p;
      }
      scratch.sort((a, b) => dists[a] - dists[b]);
      const cell = new Int16Array(n);
      for (let v = 0; v < n; v++) cell[v] = scratch[v];
      order.push(cell);
    }
  }
  return { x: xs, y: ys, order };
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

export function KnnTrainer() {
  const [dataset, setDataset] = useState<DatasetJson | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [norm, setNorm] = useState<NormParams | null>(null);

  const [testPoint, setTestPoint] = useState<{ x: number; y: number } | null>(null);
  const [k, setK] = useState(K_DEFAULT);
  const [kBoundary, setKBoundary] = useState(K_DEFAULT);
  const [accuracyData, setAccuracyData] = useState<AccuracyData | null>(null);
  const [meshNeighbors, setMeshNeighbors] = useState<MeshGrid | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const meanRef = useRef<{ x: number; y: number } | null>(null);

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
        let sx = 0;
        let sy = 0;
        for (const p of data.points) {
          sx += p.radius_mean;
          sy += p.texture_mean;
        }
        const mean = { x: sx / data.points.length, y: sy / data.points.length };
        meanRef.current = mean;
        setNorm(n);
        setAccuracyData(computeAccuracyData(data, n));
        setTestPoint(mean);
        setDataset(data);
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

  // Normalized coordinates computed once — shared by the boundary mesh, the
  // readout and the neighbor sorting.
  const normCoords = useMemo(() => {
    if (!dataset || !norm) return null;
    const nx = new Float64Array(dataset.points.length);
    const ny = new Float64Array(dataset.points.length);
    for (let i = 0; i < dataset.points.length; i++) {
      nx[i] =
        norm.xmax !== norm.xmin
          ? (dataset.points[i].radius_mean - norm.xmin) / (norm.xmax - norm.xmin)
          : 0;
      ny[i] =
        norm.ymax !== norm.ymin
          ? (dataset.points[i].texture_mean - norm.ymin) / (norm.ymax - norm.ymin)
          : 0;
    }
    return { nx, ny };
  }, [dataset, norm]);

  const labels = useMemo(() => dataset?.points.map((p) => p.label) ?? [], [dataset]);

  const kValues = useMemo(() => Array.from({ length: K_MAX }, (_, i) => i + 1), []);

  // Decision boundary mesh is independent of k: build the per-cell neighbor
  // order once, then only re-vote when k changes.
  useEffect(() => {
    if (!dataset || !norm || !normCoords) return;
    setMeshNeighbors(buildMeshNeighbors(dataset, norm, normCoords));
  }, [dataset, norm, normCoords]);

  // Debounce the boundary recompute while dragging the k slider
  useEffect(() => {
    const id = setTimeout(() => setKBoundary(k), BOUNDARY_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [k]);

  const boundary = useMemo(() => {
    if (!meshNeighbors || !dataset) return null;
    const pts = dataset.points;
    const z: number[][] = [];
    for (let j = 0; j < GRID_N; j++) {
      const row: number[] = [];
      for (let i = 0; i < GRID_N; i++) {
        const cell = meshNeighbors.order[j * GRID_N + i];
        let nb = 0;
        let nm = 0;
        for (let v = 0; v < kBoundary && v < cell.length; v++) {
          if (pts[cell[v]].label === 1) nm++;
          else nb++;
        }
        row.push(nb !== nm ? (nb > nm ? 0 : 1) : pts[cell[0]].label);
      }
      z.push(row);
    }
    return { x: meshNeighbors.x, y: meshNeighbors.y, z };
  }, [meshNeighbors, dataset, kBoundary]);

  // KNN readout for the current test point: neighbor counts, prediction and the
  // k-th nearest distance (normalized) used to draw the dashed circle.
  const knnResult = useMemo(() => {
    if (!dataset || !norm || !testPoint || !normCoords) return null;
    const n = dataset.points.length;
    const qxn =
      norm.xmax !== norm.xmin ? (testPoint.x - norm.xmin) / (norm.xmax - norm.xmin) : 0;
    const qyn =
      norm.ymax !== norm.ymin ? (testPoint.y - norm.ymin) / (norm.ymax - norm.ymin) : 0;
    const dists = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      const dx = normCoords.nx[i] - qxn;
      const dy = normCoords.ny[i] - qyn;
      dists[i] = dx * dx + dy * dy;
    }
    const order: number[] = [];
    for (let i = 0; i < n; i++) order.push(i);
    order.sort((a, b) => dists[a] - dists[b]);

    let nb = 0;
    let nm = 0;
    for (let v = 0; v < k; v++) {
      if (labels[order[v]] === 1) nm++;
      else nb++;
    }
    const prediction = nb !== nm ? (nb > nm ? 0 : 1) : labels[order[0]];
    return {
      benignCount: nb,
      malignCount: nm,
      prediction,
      neighborIndices: order.slice(0, k),
      kthDistNorm: Math.sqrt(dists[order[k - 1]]),
    };
  }, [dataset, norm, testPoint, k, normCoords, labels]);

  const handlePlotClick = useCallback((ev: any) => {
    const coords = clickToDataCoords(ev);
    if (!coords) return;
    setTestPoint({ x: coords.x, y: coords.y });
  }, []);

  const handleRandomPoint = useCallback(() => {
    if (!norm) return;
    const { xmin, xmax, ymin, ymax } = norm;
    setTestPoint({
      x: xmin + Math.random() * (xmax - xmin),
      y: ymin + Math.random() * (ymax - ymin),
    });
  }, [norm]);

  const handleReset = useCallback(() => {
    setK(K_DEFAULT);
    if (meanRef.current) setTestPoint(meanRef.current);
  }, []);

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

  if (!dataset || !norm || !testPoint) return null;

  const trainAcc = accuracyData?.train[k - 1] ?? 0;
  const testAcc = accuracyData?.test[k - 1] ?? 0;

  // --- Plot data ---

  const benignXs: number[] = [];
  const benignYs: number[] = [];
  const malignXs: number[] = [];
  const malignYs: number[] = [];
  const benignKnnXs: number[] = [];
  const benignKnnYs: number[] = [];
  const malignKnnXs: number[] = [];
  const malignKnnYs: number[] = [];

  const neighborSet = new Set<number>(knnResult?.neighborIndices ?? []);
  for (let i = 0; i < dataset.points.length; i++) {
    const p = dataset.points[i];
    const isNeighbor = neighborSet.has(i);
    if (p.label === 1) {
      if (isNeighbor) {
        malignKnnXs.push(p.radius_mean);
        malignKnnYs.push(p.texture_mean);
      } else {
        malignXs.push(p.radius_mean);
        malignYs.push(p.texture_mean);
      }
    } else {
      if (isNeighbor) {
        benignKnnXs.push(p.radius_mean);
        benignKnnYs.push(p.texture_mean);
      } else {
        benignXs.push(p.radius_mean);
        benignYs.push(p.texture_mean);
      }
    }
  }

  // Dashed circle centered on the test point with radius = k-th neighbor
  // distance in normalized space scaled back via the y-axis.
  const circleXs: number[] = [];
  const circleYs: number[] = [];
  if (knnResult) {
    const radius = knnResult.kthDistNorm * (norm.ymax - norm.ymin);
    const steps = 72;
    for (let s = 0; s <= steps; s++) {
      const theta = (s / steps) * Math.PI * 2;
      circleXs.push(testPoint.x + radius * Math.cos(theta));
      circleYs.push(testPoint.y + radius * Math.sin(theta));
    }
  }

  const data: any[] = [];

  if (boundary) {
    data.push({
      x: boundary.x,
      y: boundary.y,
      z: boundary.z,
      type: "heatmap",
      opacity: 0.35,
      showscale: false,
      hoverinfo: "skip",
      showlegend: false,
      zsmooth: "best",
      colorscale: [
        [0, COLOR_BENIGN],
        [1, COLOR_MALIGN],
      ],
    });
  }

  data.push({
    x: benignXs,
    y: benignYs,
    mode: "markers",
    type: "scatter",
    name: "Benigno",
    marker: { color: COLOR_BENIGN, size: 6, opacity: 0.75, symbol: "circle" },
    hovertemplate: `%{x:.2f}<br>%{y:.2f}<extra>Benigno</extra>`,
  });
  data.push({
    x: malignXs,
    y: malignYs,
    mode: "markers",
    type: "scatter",
    name: "Maligno",
    marker: { color: COLOR_MALIGN, size: 6, opacity: 0.75, symbol: "triangle-up" },
    hovertemplate: `%{x:.2f}<br>%{y:.2f}<extra>Maligno</extra>`,
  });

  if (benignKnnXs.length > 0) {
    data.push({
      x: benignKnnXs,
      y: benignKnnYs,
      mode: "markers",
      type: "scatter",
      name: "Vecinos (benigno)",
      showlegend: false,
      hoverinfo: "skip",
      marker: {
        color: COLOR_BENIGN,
        size: 10,
        opacity: 0.9,
        symbol: "circle",
        line: { color: COLOR_NEIGHBOR_BORDER, width: 1.5 },
      },
    });
  }
  if (malignKnnXs.length > 0) {
    data.push({
      x: malignKnnXs,
      y: malignKnnYs,
      mode: "markers",
      type: "scatter",
      name: "Vecinos (maligno)",
      showlegend: false,
      hoverinfo: "skip",
      marker: {
        color: COLOR_MALIGN,
        size: 10,
        opacity: 0.9,
        symbol: "triangle-up",
        line: { color: COLOR_NEIGHBOR_BORDER, width: 1.5 },
      },
    });
  }

  if (circleXs.length > 0) {
    data.push({
      x: circleXs,
      y: circleYs,
      mode: "lines",
      type: "scatter",
      name: "Vecino k-ésimo",
      showlegend: false,
      hoverinfo: "skip",
      line: { color: COLOR_NEIGHBOR_BORDER, width: 1.5, dash: "dot" },
    });
  }

  data.push({
    x: [testPoint.x],
    y: [testPoint.y],
    mode: "markers",
    type: "scatter",
    name: "Punto de prueba",
    marker: {
      color: COLOR_TEST_POINT,
      size: 10,
      symbol: "diamond",
      opacity: 0.9,
      line: { color: "#000000", width: 1.5 },
    },
    hovertemplate: `%{x:.2f}<br>%{y:.2f}<extra>Punto de prueba</extra>`,
  });

  const layout: any = {
    title: {
      text: "Biopsias de mama: radio medio vs. textura media",
      font: { size: 13 },
    },
    xaxis: {
      title: dataset.feature_names[0] ?? "radio medio",
      gridcolor: "#f1f5f9",
      zerolinecolor: "#e2e8f0",
      range: [norm.xmin, norm.xmax],
    },
    yaxis: {
      title: dataset.feature_names[1] ?? "textura media",
      gridcolor: "#f1f5f9",
      zerolinecolor: "#e2e8f0",
      range: [norm.ymin, norm.ymax],
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

  // --- Accuracy vs k curve ---

  const curveData: any[] = [
    {
      x: kValues,
      y: accuracyData?.train ?? [],
      mode: "lines",
      type: "scatter",
      name: "Entreno",
      line: { color: COLOR_TRAIN, width: 1.5, dash: "dash" },
      hovertemplate: `k=%{x}<br>Entreno: %{y:.1f}%<extra></extra>`,
    },
    {
      x: kValues,
      y: accuracyData?.test ?? [],
      mode: "lines",
      type: "scatter",
      name: "Prueba",
      line: { color: COLOR_TEST_LINE, width: 2 },
      hovertemplate: `k=%{x}<br>Prueba: %{y:.1f}%<extra></extra>`,
    },
  ];

  const curveLayout: any = {
    title: { text: "Accuracy vs k", font: { size: 12 } },
    xaxis: {
      title: "k",
      range: [0.5, K_MAX + 0.5],
      tick0: 1,
      dtick: 5,
      gridcolor: "#f1f5f9",
      zerolinecolor: "#e2e8f0",
    },
    yaxis: {
      title: "Accuracy (%)",
      range: [0, 100],
      gridcolor: "#f1f5f9",
      zerolinecolor: "#e2e8f0",
    },
    height: 200,
    margin: { t: 30, r: 10, b: 30, l: 40 },
    paper_bgcolor: "white",
    plot_bgcolor: "white",
    showlegend: true,
    legend: {
      orientation: "h" as const,
      y: -0.3,
      x: 0,
      font: { size: 10 },
    },
    hovermode: "closest" as const,
    shapes: [
      {
        type: "line" as const,
        xref: "x" as const,
        yref: "y" as const,
        x0: k,
        x1: k,
        y0: 0,
        y1: 100,
        line: { color: COLOR_K_MARKER, width: 1.5, dash: "dot" },
      },
    ],
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
              Entrenador de KNN
            </h3>
            <p className="text-sm text-storm mt-1">
              Elige k y explora cómo los vecinos más cercanos clasifican cada biopsia.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-storm">
            <span className="inline-flex items-center gap-1.5">
              <span
                className="inline-block h-3 w-3 rounded-full bg-[#14b8a6]"
                aria-hidden="true"
              ></span>
              Benigno ({dataset.n_benign})
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="inline-block h-0 w-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-[#3525cd]"
                aria-hidden="true"
              ></span>
              Maligno ({dataset.n_malignant})
            </span>
            <span className="font-mono text-storm">{dataset.n_samples} muestras</span>
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

            {/* Prediction readout */}
            <div
              aria-live="polite"
              className="mt-3 rounded-card border border-gray-200 bg-gray-50 p-3"
            >
              {knnResult ? (
                <p className="text-xs text-gray-700">
                  <span className="font-mono">k={k}</span> → {knnResult.benignCount} benigno,{" "}
                  {knnResult.malignCount} maligno → predice:{" "}
                  <span
                    className={`font-medium ${
                      knnResult.prediction === 1 ? "text-[#3525cd]" : "text-[#14b8a6]"
                    }`}
                  >
                    {classLabel(knnResult.prediction)}
                  </span>
                </p>
              ) : (
                <p className="text-xs text-storm">Calculando predicción…</p>
              )}
              <p className="text-xs text-storm mt-1">
                Haz clic en una zona vacía del gráfico para mover el punto de prueba.
              </p>
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

          {/* Accuracy + curve + controls */}
          <div className="space-y-4">
            {/* Accuracy */}
            <div className="rounded-card border border-gray-200 p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-storm mb-3">
                Accuracy (k={k})
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-storm">Entreno</span>
                  <span className="font-mono text-ink">{trainAcc.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-storm">Prueba</span>
                  <span className="font-mono text-ink">{testAcc.toFixed(1)}%</span>
                </div>
              </div>
              <p className="mt-2 text-xs text-storm">
                Split estratificado 70/30 (seed 42): {accuracyData?.trainSize} de entrenamiento ·{" "}
                {accuracyData?.testSize} de prueba. Con k=1 el accuracy de entreno es 100%: el
                modelo "memoriza".
              </p>
            </div>

            {/* Accuracy vs k curve */}
            <div className="rounded-card border border-gray-200 p-4">
              <div className="w-full overflow-hidden">
                <Plot
                  data={curveData}
                  layout={curveLayout}
                  config={config}
                  className="w-full"
                  useResizeHandler={true}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="rounded-card border border-gray-200 p-4">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="k-slider" className="text-sm font-medium text-gray-700">
                    k (vecinos)
                  </label>
                  <span className="font-mono text-sm text-ink">{k}</span>
                </div>
                <input
                  id="k-slider"
                  type="range"
                  min={1}
                  max={K_MAX}
                  step={1}
                  value={k}
                  onChange={(e) => setK(Number(e.target.value))}
                  aria-label="k (vecinos)"
                  className="w-full accent-brand focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleRandomPoint}
                  disabled={!dataset}
                  aria-label="Colocar un punto de prueba aleatorio"
                  className={secondaryBtnClass}
                >
                  Punto aleatorio
                </button>
                <button
                  onClick={handleReset}
                  aria-label="Reiniciar k y el punto de prueba"
                  className={secondaryBtnClass}
                >
                  Reiniciar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

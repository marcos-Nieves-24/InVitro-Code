"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnymotionStage } from "../AnymotionStage";

interface KMeansPlayerProps {
  caption: string;
}

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

type Point = { x: number; y: number };
type DatasetKey = "blobs" | "rings";

const CLUSTER_COLORS = ["#38bdf8", "#f43f5e", "#4ade80", "#fbbf24", "#a78bfa"];

function genBlobs(rng: () => number): Point[] {
  const centers = [
    { x: 0.28, y: 0.3 },
    { x: 0.72, y: 0.3 },
    { x: 0.5, y: 0.75 },
  ];
  const pts: Point[] = [];
  const perCluster = 42;
  for (const c of centers) {
    for (let i = 0; i < perCluster; i++) {
      const angle = rng() * Math.PI * 2;
      const r = Math.sqrt(rng()) * 0.11;
      const x = Math.min(0.98, Math.max(0.02, c.x + Math.cos(angle) * r));
      const y = Math.min(0.98, Math.max(0.02, c.y + Math.sin(angle) * r));
      pts.push({ x, y });
    }
  }
  return pts;
}

function genRings(rng: () => number): Point[] {
  const pts: Point[] = [];
  const rings = [0.16, 0.34, 0.5];
  const counts = [55, 80, 110];
  for (let ri = 0; ri < rings.length; ri++) {
    for (let i = 0; i < counts[ri]; i++) {
      const angle = (i / counts[ri]) * Math.PI * 2 + (rng() - 0.5) * 0.06;
      const r = rings[ri] + (rng() - 0.5) * 0.05;
      const x = Math.min(0.98, Math.max(0.02, 0.5 + Math.cos(angle) * r));
      const y = Math.min(0.98, Math.max(0.02, 0.5 + Math.sin(angle) * r));
      pts.push({ x, y });
    }
  }
  return pts;
}

function initCentroids(points: Point[], k: number): Point[] {
  const n = points.length;
  const out: Point[] = [];
  for (let i = 0; i < k; i++) {
    const idx = k === 1 ? 0 : Math.round((i / (k - 1)) * (n - 1));
    out.push({ x: points[idx].x, y: points[idx].y });
  }
  return out;
}

function assignClusters(points: Point[], centroids: Point[]): number[] {
  return points.map((p) => {
    let best = 0;
    let bestD = Infinity;
    centroids.forEach((c, i) => {
      const d = (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    return best;
  });
}

function updateCentroids(
  points: Point[],
  assignments: number[],
  k: number,
  prev: Point[],
): Point[] {
  const sums = Array.from({ length: k }, () => ({ x: 0, y: 0, n: 0 }));
  points.forEach((p, i) => {
    const a = assignments[i];
    if (a < 0 || a >= k) return;
    sums[a].x += p.x;
    sums[a].y += p.y;
    sums[a].n += 1;
  });
  return sums.map((s, i) =>
    s.n > 0 ? { x: s.x / s.n, y: s.y / s.n } : { x: prev[i].x, y: prev[i].y },
  );
}

function arraysEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

const VB_W = 800;
const VB_H = 450;
const PLOT_X0 = 50;
const PLOT_X1 = 750;
const PLOT_Y0 = 40;
const PLOT_Y1 = 410;
const toSvgX = (x: number) => PLOT_X0 + x * (PLOT_X1 - PLOT_X0);
const toSvgY = (y: number) => PLOT_Y0 + (1 - y) * (PLOT_Y1 - PLOT_Y0);

export function KMeansPlayer({ caption }: KMeansPlayerProps) {
  const [dataset, setDataset] = useState<DatasetKey>("blobs");
  const [k, setK] = useState(3);

  const points = useMemo<Point[]>(() => {
    const rng = mulberry32(dataset === "blobs" ? 10101 : 20202);
    return dataset === "blobs" ? genBlobs(rng) : genRings(rng);
  }, [dataset]);

  const [centroids, setCentroids] = useState<Point[]>(() => initCentroids(points, k));
  const [assignments, setAssignments] = useState<number[]>(() => points.map(() => -1));
  const [prevAssignments, setPrevAssignments] = useState<number[]>(() => points.map(() => -1));
  const [phase, setPhase] = useState<"assign" | "update">("assign");
  const [iteration, setIteration] = useState(0);
  const [converged, setConverged] = useState(false);

  useEffect(() => {
    setCentroids(initCentroids(points, k));
    setAssignments(points.map(() => -1));
    setPrevAssignments(points.map(() => -1));
    setPhase("assign");
    setIteration(0);
    setConverged(false);
  }, [points, k]);

  const reset = useCallback(() => {
    setCentroids(initCentroids(points, k));
    setAssignments(points.map(() => -1));
    setPrevAssignments(points.map(() => -1));
    setPhase("assign");
    setIteration(0);
    setConverged(false);
  }, [points, k]);

  const step = useCallback(() => {
    if (converged) return;
    if (phase === "assign") {
      const a = assignClusters(points, centroids);
      if (assignments.some((v) => v !== -1) && arraysEqual(a, assignments)) {
        setConverged(true);
      }
      setPrevAssignments(assignments);
      setAssignments(a);
      setPhase("update");
    } else {
      const newC = updateCentroids(points, assignments, k, centroids);
      const moved = newC.some(
        (c, i) => Math.abs(c.x - centroids[i].x) > 1e-6 || Math.abs(c.y - centroids[i].y) > 1e-6,
      );
      if (!moved && assignments.some((v) => v !== -1)) setConverged(true);
      setCentroids(newC);
      setIteration((i) => i + 1);
      setPhase("assign");
    }
  }, [phase, points, centroids, assignments, k, converged]);

  const onDatasetChange = (next: DatasetKey) => setDataset(next);
  const onKChange = (next: number) => setK(next);

  const phaseLabel = phase === "assign" ? "Asignar puntos a centroides" : "Actualizar centroides";

  return (
    <figure className="my-5">
      <AnymotionStage title={`K-Means interactivo: ${dataset === "blobs" ? "blobs" : "anillos"}`}>
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="h-full w-full bg-[#0a0a0a]"
          role="img"
          aria-label={`Visualización de K-Means sobre dataset ${dataset === "blobs" ? "blobs" : "anillos"}.`}
        >
          <rect
            x={PLOT_X0}
            y={PLOT_Y0}
            width={PLOT_X1 - PLOT_X0}
            height={PLOT_Y1 - PLOT_Y0}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={1}
          />

          {points.map((p, i) => {
            const a = assignments[i];
            const color = a >= 0 && a < k ? CLUSTER_COLORS[a % CLUSTER_COLORS.length] : "#9ca3af";
            return (
              <circle
                key={`pt-${i}`}
                cx={toSvgX(p.x)}
                cy={toSvgY(p.y)}
                r={4.5}
                fill={color}
                opacity={0.85}
                stroke="#0a0a0a"
                strokeWidth={0.6}
              />
            );
          })}

          {centroids.map((c, i) => {
            const color = CLUSTER_COLORS[i % CLUSTER_COLORS.length];
            const cx = toSvgX(c.x);
            const cy = toSvgY(c.y);
            return (
              <g key={`ct-${i}`} transform={`translate(${cx},${cy})`}>
                <line x1={-9} y1={0} x2={9} y2={0} stroke={color} strokeWidth={2.4} strokeLinecap="round" />
                <line x1={0} y1={-9} x2={0} y2={9} stroke={color} strokeWidth={2.4} strokeLinecap="round" />
                <circle r={3} fill={color} stroke="#0a0a0a" strokeWidth={0.8} />
              </g>
            );
          })}
        </svg>
      </AnymotionStage>

      {caption ? (
        <figcaption className="mt-2 text-center text-sm text-storm">{caption}</figcaption>
      ) : null}

      <div className="mt-3 flex flex-col gap-3 rounded-b-card bg-surface-card px-4 py-3 text-storm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold uppercase tracking-wide opacity-70">Dataset</span>
          <div role="group" aria-label="Selector de dataset" className="flex gap-2">
            {(["blobs", "rings"] as DatasetKey[]).map((d) => {
              const active = d === dataset;
              const label = d === "blobs" ? "Blobs (3 grupos)" : "Anillos (falla K-Means)";
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => onDatasetChange(d)}
                  aria-pressed={active}
                  className={`rounded-full border px-3 py-1 text-sm font-semibold transition-colors ${
                    active
                      ? "border-mint bg-mint/15 text-mint"
                      : "border-gray-200 bg-white text-storm hover:bg-mint/10 hover:text-mint"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold uppercase tracking-wide opacity-70">K</span>
          <div role="group" aria-label="Selector de K" className="flex gap-2">
            {[2, 3, 4].map((kk) => {
              const active = kk === k;
              return (
                <button
                  key={kk}
                  type="button"
                  onClick={() => onKChange(kk)}
                  aria-pressed={active}
                  className={`h-9 w-9 rounded-full border text-sm font-semibold transition-colors ${
                    active
                      ? "border-mint bg-mint/15 text-mint"
                      : "border-gray-200 bg-white text-storm hover:bg-mint/10 hover:text-mint"
                  }`}
                >
                  {kk}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={step}
            disabled={converged}
            className="rounded-full border border-mint bg-mint/15 px-4 py-1.5 text-sm font-semibold text-mint transition-colors hover:bg-mint/25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Paso
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-semibold text-storm transition-colors hover:bg-mint/10 hover:text-mint"
          >
            Reiniciar
          </button>
          <span className="font-mono text-sm tabular-nums">
            Iteración: {iteration}
          </span>
          <span
            className={`rounded-full border px-3 py-1 text-sm font-semibold ${
              phase === "assign"
                ? "border-sky-400/40 bg-sky-400/10 text-sky-300"
                : "border-amber-400/40 bg-amber-400/10 text-amber-300"
            }`}
          >
            Fase: {phaseLabel}
          </span>
          {converged ? (
            <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-300">
              Convergido
            </span>
          ) : null}
        </div>
      </div>
    </figure>
  );
}

"use client";

import { useMemo, useState } from "react";
import { AnymotionStage } from "../AnymotionStage";

interface TreeSplitProps {
  caption: string;
}

// Generador determinista mulberry32 (misma semilla => mismos datos siempre).
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

type Point = { x: number; y: number; cls: 0 | 1 };

// Dataset fijo: dos clases claramente separadas, ~60 puntos, generado una sola
// vez con semilla fija (sin Math.random).
function buildPoints(): Point[] {
  const rng = mulberry32(424242);
  const pts: Point[] = [];
  const perClass = 30;
  for (let i = 0; i < perClass; i++) {
    const x = 0.18 + rng() * 0.28;
    const y = 0.18 + rng() * 0.32;
    pts.push({ x, y, cls: 0 });
  }
  for (let i = 0; i < perClass; i++) {
    const x = 0.58 + rng() * 0.3;
    const y = 0.55 + rng() * 0.32;
    pts.push({ x, y, cls: 1 });
  }
  return pts;
}

const POINTS: Point[] = buildPoints();

type Feature = "x" | "y";

function coord(p: Point, f: Feature): number {
  return f === "x" ? p.x : p.y;
}

// Impureza de Gini de un conjunto de índices de puntos.
function gini(indices: number[]): number {
  if (indices.length === 0) return 0;
  let n0 = 0;
  let n1 = 0;
  for (const i of indices) {
    if (POINTS[i].cls === 0) n0++;
    else n1++;
  }
  const n = indices.length;
  const p0 = n0 / n;
  const p1 = n1 / n;
  return 1 - (p0 * p0 + p1 * p1);
}

type TreeNode = {
  id: string;
  depth: number;
  indices: number[];
  impurity: number;
  splitFeature?: Feature;
  splitThreshold?: number;
  left?: TreeNode;
  right?: TreeNode;
};

function makeRoot(): TreeNode {
  const indices = POINTS.map((_, i) => i);
  return { id: "raiz", depth: 0, indices, impurity: gini(indices) };
}

function findNode(node: TreeNode, id: string): TreeNode | null {
  if (node.id === id) return node;
  if (node.left) {
    const r = findNode(node.left, id);
    if (r) return r;
  }
  if (node.right) {
    const r = findNode(node.right, id);
    if (r) return r;
  }
  return null;
}

function applySplit(
  node: TreeNode,
  targetId: string,
  feature: Feature,
  threshold: number,
): TreeNode {
  if (node.id === targetId) {
    const leftIdx = node.indices.filter(
      (i) => coord(POINTS[i], feature) <= threshold,
    );
    const rightIdx = node.indices.filter(
      (i) => coord(POINTS[i], feature) > threshold,
    );
    return {
      ...node,
      splitFeature: feature,
      splitThreshold: threshold,
      left: {
        id: targetId + "-I",
        depth: node.depth + 1,
        indices: leftIdx,
        impurity: gini(leftIdx),
      },
      right: {
        id: targetId + "-D",
        depth: node.depth + 1,
        indices: rightIdx,
        impurity: gini(rightIdx),
      },
    };
  }
  return {
    ...node,
    left: node.left ? applySplit(node.left, targetId, feature, threshold) : undefined,
    right: node.right ? applySplit(node.right, targetId, feature, threshold) : undefined,
  };
}

// Geometría del stage (viewBox 800 x 450).
const VB_W = 800;
const VB_H = 450;

// Panel de dispersión (mitad izquierda).
const SX0 = 40;
const SX1 = 380;
const SY0 = 50;
const SY1 = 410;
const sx = (v: number) => SX0 + v * (SX1 - SX0);
const sy = (v: number) => SY1 - v * (SY1 - SY0);

// Panel del árbol (mitad derecha).
const TX0 = 420;
const TX1 = 780;
const TY0 = 60;
const ROW_H = 95;

export function TreeSplit({ caption }: TreeSplitProps) {
  const [tree, setTree] = useState<TreeNode>(() => makeRoot());
  const [activeId, setActiveId] = useState<string>("raiz");
  const [feature, setFeature] = useState<Feature>("x");
  const [threshold, setThreshold] = useState<number>(0.5);

  const activeNode = useMemo(() => findNode(tree, activeId) ?? tree, [tree, activeId]);

  const isLeaf = !activeNode.left && !activeNode.right;
  const canSplit =
    isLeaf && activeNode.indices.length > 0 && activeNode.depth < 2;

  // Índices de cada hijo para la división candidata actual.
  const leftIdx = useMemo(
    () =>
      activeNode.indices.filter(
        (i) => coord(POINTS[i], feature) <= threshold,
      ),
    [activeNode.indices, feature, threshold],
  );
  const rightIdx = useMemo(
    () =>
      activeNode.indices.filter(
        (i) => coord(POINTS[i], feature) > threshold,
      ),
    [activeNode.indices, feature, threshold],
  );

  const parentImp = activeNode.impurity;
  const nActive = activeNode.indices.length;
  const leftImp = gini(leftIdx);
  const rightImp = gini(rightIdx);
  const currentGain =
    nActive > 0 && leftIdx.length > 0 && rightIdx.length > 0
      ? parentImp -
        (leftIdx.length / nActive) * leftImp -
        (rightIdx.length / nActive) * rightImp
      : 0;

  // Mejor división disponible entre las features candidatas (X e Y) y sus
  // umbrales (puntos medios entre valores consecutivos).
  const { bestGain, bestFeature } = useMemo(() => {
    let bestG = -Infinity;
    let bestF: Feature = feature;
    for (const f of ["x", "y"] as Feature[]) {
      const coords = activeNode.indices
        .map((i) => coord(POINTS[i], f))
        .sort((a, b) => a - b);
      const thrSet = new Set<number>();
      for (let i = 0; i < coords.length - 1; i++) {
        if (coords[i] !== coords[i + 1]) {
          thrSet.add((coords[i] + coords[i + 1]) / 2);
        }
      }
      for (const t of thrSet) {
        const L = activeNode.indices.filter(
          (i) => coord(POINTS[i], f) <= t,
        );
        const R = activeNode.indices.filter(
          (i) => coord(POINTS[i], f) > t,
        );
        if (L.length === 0 || R.length === 0) continue;
        const g =
          parentImp -
          (L.length / nActive) * gini(L) -
          (R.length / nActive) * gini(R);
        if (g > bestG + 1e-12) {
          bestG = g;
          bestF = f;
        }
      }
    }
    if (bestG === -Infinity) {
      bestG = 0;
    }
    return { bestGain: bestG, bestFeature: bestF };
  }, [activeNode.indices, parentImp, nActive]);

  const isBest =
    feature === bestFeature && currentGain >= bestGain - 1e-9;

  // Posiciones de los nodos del árbol.
  const positions = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    function rec(node: TreeNode, x0: number, x1: number, depth: number) {
      map.set(node.id, { x: (x0 + x1) / 2, y: TY0 + depth * ROW_H });
      if (node.left && node.right) {
        const mid = (x0 + x1) / 2;
        rec(node.left, x0, mid, depth + 1);
        rec(node.right, mid, x1, depth + 1);
      }
    }
    rec(tree, TX0, TX1, 0);
    return map;
  }, [tree]);

  // Lista plana de nodos para dibujar.
  const nodes: TreeNode[] = useMemo(() => {
    const out: TreeNode[] = [];
    function rec(n: TreeNode) {
      out.push(n);
      if (n.left) rec(n.left);
      if (n.right) rec(n.right);
    }
    rec(tree);
    return out;
  }, [tree]);

  const handleSplit = () => {
    if (!canSplit) return;
    if (leftIdx.length === 0 || rightIdx.length === 0) return;
    setTree((prev) => applySplit(prev, activeId, feature, threshold));
    setActiveId(activeId + "-I");
  };

  const handleReset = () => {
    setTree(makeRoot());
    setActiveId("raiz");
    setFeature("x");
    setThreshold(0.5);
  };

  const handleSelectLeaf = (id: string, node: TreeNode) => {
    if (node.left || node.right) return; // solo hojas seleccionables
    setActiveId(id);
  };

  // Conjunto de índices del nodo activo para atenuar el resto.
  const activeSet = new Set(activeNode.indices);

  // Línea de corte en coordenadas SVG.
  const splitLine =
    feature === "x"
      ? {
          x1: sx(threshold),
          y1: SY0,
          x2: sx(threshold),
          y2: SY1,
        }
      : {
          x1: SX0,
          y1: sy(threshold),
          x2: SX1,
          y2: sy(threshold),
        };

  return (
    <figure className="my-5">
      <AnymotionStage title="Árbol de decisión: cómo elegir dónde partir">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="h-full w-full bg-[#0a0a0a]"
          role="img"
          aria-label="Visualización interactiva de un árbol de decisión con nube de puntos y árbol."
        >
          {/* Panel de dispersión */}
          <rect
            x={SX0}
            y={SY0}
            width={SX1 - SX0}
            height={SY1 - SY0}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={1}
          />

          {/* Sombreado de las dos regiones resultantes */}
          {feature === "x" ? (
            <>
              <rect
                x={SX0}
                y={SY0}
                width={Math.max(0, sx(threshold) - SX0)}
                height={SY1 - SY0}
                fill="rgba(56,189,248,0.08)"
              />
              <rect
                x={sx(threshold)}
                y={SY0}
                width={Math.max(0, SX1 - sx(threshold))}
                height={SY1 - SY0}
                fill="rgba(244,63,94,0.08)"
              />
            </>
          ) : (
            <>
              <rect
                x={SX0}
                y={sy(threshold)}
                width={SX1 - SX0}
                height={Math.max(0, SY1 - sy(threshold))}
                fill="rgba(56,189,248,0.08)"
              />
              <rect
                x={SX0}
                y={SY0}
                width={SX1 - SX0}
                height={Math.max(0, sy(threshold) - SY0)}
                fill="rgba(244,63,94,0.08)"
              />
            </>
          )}

          {/* Puntos */}
          {POINTS.map((p, i) => {
            const inActive = activeSet.has(i);
            const color = p.cls === 0 ? "#38bdf8" : "#f43f5e";
            return (
              <circle
                key={`pt-${i}`}
                cx={sx(p.x)}
                cy={sy(p.y)}
                r={4}
                fill={color}
                opacity={inActive ? 0.85 : 0.25}
                stroke="#0a0a0a"
                strokeWidth={0.6}
              />
            );
          })}

          {/* Línea de corte candidata */}
          <line
            x1={splitLine.x1}
            y1={splitLine.y1}
            x2={splitLine.x2}
            y2={splitLine.y2}
            stroke="#fbbf24"
            strokeWidth={2}
            strokeDasharray="6 4"
          />

          {/* Etiquetas de los ejes */}
          <text
            x={(SX0 + SX1) / 2}
            y={SY1 + 16}
            textAnchor="middle"
            fill="white"
            fontSize={13}
            fontFamily="monospace"
            opacity={0.6}
          >
            X
          </text>
          <text
            x={SX0 - 12}
            y={(SY0 + SY1) / 2}
            textAnchor="middle"
            fill="white"
            fontSize={13}
            fontFamily="monospace"
            opacity={0.6}
            transform={`rotate(-90 ${SX0 - 12} ${(SY0 + SY1) / 2})`}
          >
            Y
          </text>

          {/* Separador visual entre paneles */}
          <line
            x1={400}
            y1={20}
            x2={400}
            y2={VB_H - 20}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
          />

          {/* Panel del árbol */}
          <text
            x={(TX0 + TX1) / 2}
            y={34}
            textAnchor="middle"
            fill="white"
            fontSize={12}
            fontFamily="sans-serif"
            fontWeight={700}
            opacity={0.9}
          >
            Árbol (nodo activo resaltado)
          </text>

          {/* Aristas */}
          {nodes.map((n) => {
            if (!n.left || !n.right) return null;
            const p = positions.get(n.id)!;
            const pl = positions.get(n.left.id)!;
            const pr = positions.get(n.right.id)!;
            return (
              <g key={`edge-${n.id}`}>
                <line
                  x1={p.x}
                  y1={p.y + 18}
                  x2={pl.x}
                  y2={pl.y - 18}
                  stroke="rgba(255,255,255,0.35)"
                  strokeWidth={1.2}
                />
                <line
                  x1={p.x}
                  y1={p.y + 18}
                  x2={pr.x}
                  y2={pr.y - 18}
                  stroke="rgba(255,255,255,0.35)"
                  strokeWidth={1.2}
                />
              </g>
            );
          })}

          {/* Nodos */}
          {nodes.map((n) => {
            const p = positions.get(n.id)!;
            const isActive = n.id === activeId;
            const isLeafNode = !n.left && !n.right;
            return (
              <g
                key={n.id}
                transform={`translate(${p.x},${p.y})`}
                onClick={() => handleSelectLeaf(n.id, n)}
                style={{ cursor: isLeafNode ? "pointer" : "default" }}
              >
                <rect
                  x={-46}
                  y={-18}
                  width={92}
                  height={36}
                  rx={8}
                  fill={isActive ? "rgba(20,184,166,0.25)" : "rgba(255,255,255,0.06)"}
                  stroke={isActive ? "#14b8a6" : "rgba(255,255,255,0.25)"}
                  strokeWidth={isActive ? 2 : 1}
                />
                <text
                  x={0}
                  y={-2}
                  textAnchor="middle"
                  fill="white"
                  fontSize={12}
                  fontFamily="monospace"
                  fontWeight={700}
                >
                  {`Gini ${n.impurity.toFixed(3)}`}
                </text>
                <text
                  x={0}
                  y={11}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.7)"
                  fontSize={8}
                  fontFamily="monospace"
                >
                  {`n=${n.indices.length}`}
                </text>
                {n.splitFeature && n.splitThreshold !== undefined ? (
                  <text
                    x={0}
                    y={-28}
                    textAnchor="middle"
                    fill="rgba(251,191,36,0.9)"
                    fontSize={8}
                    fontFamily="monospace"
                  >
                    {`${n.splitFeature.toUpperCase()} ≤ ${n.splitThreshold.toFixed(2)}`}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
      </AnymotionStage>

      <div className="mt-3 flex flex-col gap-3 rounded-b-card bg-surface-card px-4 py-3 text-storm">
        {/* Selector de característica */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold uppercase tracking-wide opacity-70">
            Característica
          </span>
          <div role="group" aria-label="Selector de característica" className="flex gap-2">
            {(["x", "y"] as Feature[]).map((f) => {
              const active = f === feature;
              const label = f === "x" ? "X" : "Y";
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFeature(f)}
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

        {/* Umbral */}
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="treesplit-threshold" className="font-mono text-sm whitespace-nowrap text-storm">
            Umbral{" "}
            <span className="font-semibold text-mint">{threshold.toFixed(2)}</span>
          </label>
          <input
            id="treesplit-threshold"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-gray-200 accent-mint"
            aria-label="Umbral de la división candidata"
          />
        </div>

        {/* Lectura viva */}
        <div className="grid grid-cols-1 gap-1 font-mono text-sm sm:grid-cols-3">
          <span>
            Gini padre: <span className="text-mint">{parentImp.toFixed(3)}</span>
          </span>
          <span>
            Gini hijo izq.: <span className="text-sky-300">{leftImp.toFixed(3)}</span>{" "}
            (n={leftIdx.length})
          </span>
          <span>
            Gini hijo der.: <span className="text-rose-300">{rightImp.toFixed(3)}</span>{" "}
            (n={rightIdx.length})
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 font-mono text-sm">
          <span>
            Reducción de impureza:{" "}
            <span className="text-mint">{currentGain.toFixed(4)}</span>
          </span>
          <span
            className={`rounded-full border px-3 py-1 text-sm font-semibold ${
              isBest
                ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                : "border-amber-400/40 bg-amber-400/10 text-amber-300"
            }`}
          >
            {isBest ? "Mejor división" : "No es la mejor"}
          </span>
          <span className="text-storm/70">
            Mejor disponible: {bestFeature.toUpperCase()} (ganancia{" "}
            {bestGain.toFixed(4)})
          </span>
        </div>

        {/* Botones */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSplit}
            disabled={!canSplit || leftIdx.length === 0 || rightIdx.length === 0}
            className="rounded-full border border-mint bg-mint/15 px-4 py-1.5 text-sm font-semibold text-mint transition-colors hover:bg-mint/25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Dividir
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-semibold text-storm transition-colors hover:bg-mint/10 hover:text-mint"
          >
            Reiniciar
          </button>
          <span className="font-mono text-sm tabular-nums">
            Nodo activo: {activeNode.id} (nivel {activeNode.depth + 1})
          </span>
          {!isLeaf ? (
            <span className="rounded-full border border-sky-400/40 bg-sky-400/10 px-3 py-1 text-sm font-semibold text-sky-300">
              Nodo ya dividido (elige otra hoja)
            </span>
          ) : null}
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

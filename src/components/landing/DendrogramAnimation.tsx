"use client";

import { useState, useEffect } from "react";

type DendroState = "idle" | "drawing" | "done";

interface TreeNode {
  id: string;
  x: number;
  y: number;
  label: string;
  delay: number;
}

interface TreeEdge {
  from: string;
  to: string;
  delay: number;
}

const TREE_NODES: TreeNode[] = [
  { id: "root", x: 50, y: 15, label: "Raíz", delay: 0 },
  { id: "a", x: 30, y: 35, label: "A", delay: 300 },
  { id: "b", x: 70, y: 35, label: "B", delay: 300 },
  { id: "a1", x: 20, y: 55, label: "A1", delay: 600 },
  { id: "a2", x: 40, y: 55, label: "A2", delay: 600 },
  { id: "b1", x: 70, y: 55, label: "B1", delay: 600 },
  { id: "a1a", x: 15, y: 75, label: "A1a", delay: 900 },
  { id: "a1b", x: 25, y: 75, label: "A1b", delay: 900 },
  { id: "b1a", x: 60, y: 75, label: "B1a", delay: 900 },
  { id: "b1b", x: 80, y: 75, label: "B1b", delay: 900 },
];

const TREE_EDGES: TreeEdge[] = [
  { from: "root", to: "a", delay: 150 },
  { from: "root", to: "b", delay: 150 },
  { from: "a", to: "a1", delay: 450 },
  { from: "a", to: "a2", delay: 450 },
  { from: "b", to: "b1", delay: 450 },
  { from: "a1", to: "a1a", delay: 750 },
  { from: "a1", to: "a1b", delay: 750 },
  { from: "b1", to: "b1a", delay: 750 },
  { from: "b1", to: "b1b", delay: 750 },
];

function getPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function DendrogramAnimation() {
  const [state, setState] = useState<DendroState>("idle");
  const [visibleNodes, setVisibleNodes] = useState<Set<string>>(new Set());
  const [visibleEdges, setVisibleEdges] = useState<Set<number>>(new Set());
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setPrefersReducedMotion(getPrefersReducedMotion());
  }, []);

  const handleVisualize = () => {
    if (prefersReducedMotion) {
      setVisibleNodes(new Set(TREE_NODES.map((n) => n.id)));
      setVisibleEdges(new Set(TREE_EDGES.map((_, i) => i)));
      setState("done");
      return;
    }

    setState("drawing");
    setVisibleNodes(new Set());
    setVisibleEdges(new Set());

    TREE_EDGES.forEach((edge, i) => {
      setTimeout(() => {
        setVisibleEdges((prev) => new Set([...prev, i]));
      }, edge.delay);
    });

    TREE_NODES.forEach((node) => {
      setTimeout(() => {
        setVisibleNodes((prev) => new Set([...prev, node.id]));
      }, node.delay + 150);
    });

    setTimeout(() => setState("done"), 1200);
  };

  const getNode = (id: string) => TREE_NODES.find((n) => n.id === id)!;

  return (
    <div className="rounded-2xl border border-surface-raised bg-surface-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-mint">
            Visualización
          </p>
          <h3 className="font-display text-lg font-bold text-ink">
            Dendrograma de Clasificación
          </h3>
        </div>
        {state === "idle" && (
          <button
            onClick={handleVisualize}
            className="flex items-center gap-1.5 rounded-lg bg-mint px-4 py-2 text-sm font-bold text-ink transition-all hover:scale-105 hover:shadow-lg"
          >
            ▶ Visualizar
          </button>
        )}
        {state === "done" && (
          <span className="text-sm text-mint">Completado</span>
        )}
      </div>

      <div className="relative overflow-hidden rounded-xl border border-surface-raised bg-[#fafbfc] p-4">
        <svg viewBox="0 0 100 90" className="h-64 w-full">
          {/* Edges */}
          {TREE_EDGES.map((edge, i) => {
            const from = getNode(edge.from);
            const to = getNode(edge.to);
            const isVisible = visibleEdges.has(i);
            return (
              <line
                key={`edge-${i}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="#00b2b2"
                strokeWidth="0.8"
                className={isVisible ? "animate-[draw-line_0.4s_ease-out_forwards]" : "opacity-0"}
                style={{ strokeDasharray: 100, strokeDashoffset: isVisible ? 0 : 100 }}
              />
            );
          })}

          {/* Nodes */}
          {TREE_NODES.map((node) => {
            const isVisible = visibleNodes.has(node.id);
            return (
              <g
                key={node.id}
                className={isVisible ? "animate-[node-appear_0.3s_ease-out_forwards]" : "opacity-0"}
                style={{ transformOrigin: `${node.x}px ${node.y}px` }}
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="4"
                  fill="#005f88"
                  stroke="#00b2b2"
                  strokeWidth="0.8"
                />
                <text
                  x={node.x}
                  y={node.y + 8}
                  textAnchor="middle"
                  fontSize="5"
                  fill="#111439"
                  fontWeight="600"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-6 text-xs text-storm">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#005f88]" />
            <span>Nodo</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-0.5 w-4 bg-[#00b2b2]" />
            <span>Conexión</span>
          </div>
        </div>
      </div>
    </div>
  );
}

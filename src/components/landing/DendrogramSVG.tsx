"use client";

import { useEffect, useRef, useState } from "react";

/*
  Real hierarchical dendrogram drawn left-to-right, exactly as scipy/R render them.
  Structure: Ward linkage on 8 simulated gene-expression samples.

  Layout rules (so nothing escapes the axes):
  - Leaf markers span TOP_PAD..AXIS_H, always ABOVE the X-axis baseline.
  - X-axis sits near the bottom border; tick labels + title below it.
  - Y labels (Gen-*) hug the left border.
  - Ward domain is 0.0..0.6 so the tree fills the full plot width.
*/

const W = 760;
const H = 520;

const LEAF_X = 90;
const ROOT_X = W - 20;
const TOP_PAD = 24;
const AXIS_H = 440; // X-axis baseline

const X_MAX = 0.6;
const MAX_W = ROOT_X - LEAF_X;

const LABELS = [
  "Gen-8",
  "Gen-7",
  "Gen-6",
  "Gen-5",
  "Gen-4",
  "Gen-3",
  "Gen-2",
  "Gen-1",
];
const N = LABELS.length;

// Leaves span TOP_PAD..AXIS_H — strictly inside the plot area.
const leafY = LABELS.map(
  (_, i) => TOP_PAD + (i * (AXIS_H - TOP_PAD)) / (N - 1),
);

function h(ward: number) {
  return LEAF_X + MAX_W * (ward / X_MAX);
}

// Merge table: [leftIdx, rightIdx, wardHeight, isLeafLeft, isLeafRight]
const mergeData: [number, number, number, boolean, boolean][] = [
  [6, 7, h(0.08), true, true], // merge0: Gen-2 & Gen-1 → cluster A
  [4, 5, h(0.1), true, true], // merge1: Gen-4 & Gen-3 → cluster B
  [2, 3, h(0.11), true, true], // merge2: Gen-6 & Gen-5 → cluster C
  [0, 1, h(0.09), true, true], // merge3: Gen-8 & Gen-7 → cluster D
  [2, 1, h(0.32), false, false], // merge4: cluster C (merge2) + cluster B (merge1)
  [3, 0, h(0.28), false, false], // merge5: cluster D (merge3) + cluster A (merge0)
  [4, 5, h(0.58), false, false], // merge6: (C+B) (merge4) + (D+A) (merge5)
];

function computeMergeYs(): number[] {
  const mergeYs: number[] = [];
  for (const [li, ri, , isLL, isRL] of mergeData) {
    const ly = isLL ? leafY[li] : mergeYs[li];
    const ry = isRL ? leafY[ri] : mergeYs[ri];
    mergeYs.push((ly + ry) / 2);
  }
  return mergeYs;
}

interface Segment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay: number;
}

function buildSegments(mergeYs: number[]): Segment[] {
  const segs: Segment[] = [];
  const BASE_DELAY = 200;

  mergeData.forEach(([li, ri, hx, isLL, isRL], idx) => {
    const ly = isLL ? leafY[li] : mergeYs[li];
    const ry = isRL ? leafY[ri] : mergeYs[ri];
    const midY = mergeYs[idx];

    segs.push({ x1: hx, y1: ly, x2: hx, y2: midY, delay: BASE_DELAY * idx });
    segs.push({ x1: hx, y1: ry, x2: hx, y2: midY, delay: BASE_DELAY * idx });

    const prevLX = isLL ? LEAF_X : mergeData[li][2];
    const prevRX = isRL ? LEAF_X : mergeData[ri][2];
    segs.push({
      x1: prevLX,
      y1: ly,
      x2: hx,
      y2: ly,
      delay: BASE_DELAY * idx + 60,
    });
    segs.push({
      x1: prevRX,
      y1: ry,
      x2: hx,
      y2: ry,
      delay: BASE_DELAY * idx + 60,
    });
  });

  return segs;
}

interface AnimatedLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay: number;
  active: boolean;
  color?: string;
  width?: number;
}

function AnimatedLine({
  x1,
  y1,
  x2,
  y2,
  delay,
  active,
  color = "#00b2b2",
  width = 3,
}: AnimatedLineProps) {
  const len = Math.abs(x2 - x1) + Math.abs(y2 - y1);
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      style={{
        strokeDasharray: len,
        strokeDashoffset: active ? 0 : len,
        transition: active
          ? `stroke-dashoffset 0.45s ease-out ${delay}ms`
          : "none",
      }}
    />
  );
}

function getPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function DendrogramSVG({ active = true }: { active?: boolean }) {
  const mergeYs = computeMergeYs();
  const segments = buildSegments(mergeYs);
  const totalDuration = mergeData.length * 200 + 600;

  const [started, setStarted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (getPrefersReducedMotion()) {
      setStarted(true);
      return;
    }
    if (!active) {
      setStarted(false);
      return;
    }
    timerRef.current = setTimeout(() => setStarted(true), 100);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active]);

  const leafLabelVisible = started;
  const axisTickCount = 4; // 0.0 · 0.2 · 0.4 · 0.6

  return (
    <svg
      viewBox={`-12 -14 ${W + 40} ${H + 34}`}
      className="h-auto w-full select-none"
      aria-label="Dendrograma Ward linkage — expresion genica"
    >
      {/* Background grid lines */}
      {Array.from({ length: axisTickCount }).map((_, i) => {
        const frac = i / (axisTickCount - 1);
        const x = LEAF_X + MAX_W * frac;
        return (
          <line
            key={i}
            x1={x}
            y1={TOP_PAD - 8}
            x2={x}
            y2={AXIS_H + 10}
            stroke="#ffffff"
            strokeWidth={0.8}
            strokeDasharray="6 8"
            opacity={0.18}
          />
        );
      })}

      {/* X-axis baseline */}
      <line
        x1={LEAF_X}
        y1={AXIS_H}
        x2={ROOT_X}
        y2={AXIS_H}
        stroke="#ffffff"
        strokeWidth={1}
      />

      {/* X-axis ticks + labels */}
      {Array.from({ length: axisTickCount }).map((_, i) => {
        const frac = i / (axisTickCount - 1);
        const x = LEAF_X + MAX_W * frac;
        const val = (frac * X_MAX).toFixed(1);
        return (
          <g key={i}>
            <line
              x1={x}
              y1={AXIS_H}
              x2={x}
              y2={AXIS_H + 8}
              stroke="#ffffff"
              strokeWidth={1}
            />
            <text
              x={x}
              y={AXIS_H + 34}
              textAnchor="middle"
              fontSize="20"
              fontFamily="JetBrains Mono, monospace"
              fill="#ffffff"
            >
              {val}
            </text>
          </g>
        );
      })}

      {/* DISTANCIA WARD */}
      <text
        x={(LEAF_X + ROOT_X) / 2}
        y={AXIS_H + 78}
        textAnchor="middle"
        fontSize="30"
        fontFamily="JetBrains Mono, monospace"
        fontWeight="700"
        fill="#ffffff"
        letterSpacing="0.05em"
      >
        DISTANCIA WARD
      </text>

      {/* Dendrogram lines */}
      {segments.map((seg, i) => (
        <AnimatedLine
          key={i}
          x1={seg.x1}
          y1={seg.y1}
          x2={seg.x2}
          y2={seg.y2}
          delay={seg.delay}
          active={started}
          color="#00b2b2"
          width={3}
        />
      ))}

      {/* Leaf dots */}
      {leafY.map((ly, i) => (
        <circle
          key={`dot-${i}`}
          cx={LEAF_X}
          cy={ly}
          r={6}
          fill="#00b2b2"
          style={{
            opacity: leafLabelVisible ? 1 : 0,
            transition: `opacity 0.3s ease-out ${i * 80}ms`,
          }}
        />
      ))}

      {/* Leaf labels — hugging the left border */}
      {LABELS.map((label, i) => (
        <text
          key={`label-${i}`}
          x={LEAF_X - 14}
          y={leafY[i] + 7}
          textAnchor="end"
          fontSize="20"
          fontFamily="JetBrains Mono, monospace"
          fontWeight="600"
          fill="#a0c0d0"
          style={{
            opacity: leafLabelVisible ? 1 : 0,
            transition: `opacity 0.4s ease-out ${i * 80 + 100}ms`,
          }}
        >
          {label}
        </text>
      ))}

      {/* Merge node circles */}
      {mergeYs.map((my, i) => (
        <circle
          key={`merge-${i}`}
          cx={mergeData[i][2]}
          cy={my}
          r={7}
          fill="#005f88"
          stroke="#00b2b2"
          strokeWidth={2.5}
          style={{
            opacity: started ? 1 : 0,
            transition: `opacity 0.3s ease-out ${mergeData[i][2] * 0.5 + 200}ms`,
          }}
        />
      ))}

      {/* Cluster highlight brackets at leaves */}
      <rect
        x={LEAF_X - 4}
        y={leafY[0] - 14}
        width={8}
        height={leafY[3] - leafY[0] + 28}
        rx={4}
        fill="#00b2b2"
        opacity={started ? 0.15 : 0}
        style={{
          transition: `opacity 0.6s ease-out ${totalDuration * 0.6}ms`,
        }}
      />
      <rect
        x={LEAF_X - 4}
        y={leafY[4] - 14}
        width={8}
        height={leafY[7] - leafY[4] + 28}
        rx={4}
        fill="#a0c0d0"
        opacity={started ? 0.15 : 0}
        style={{
          transition: `opacity 0.6s ease-out ${totalDuration * 0.7}ms`,
        }}
      />

      {/* Cluster labels — same column as leaf names, smaller + offset */}
      <text
        x={LEAF_X - 20}
        y={(leafY[0] + leafY[3]) / 2 + 6}
        textAnchor="end"
        fontSize="16"
        fontFamily="JetBrains Mono, monospace"
        fill="#a0c0d0"
        style={{
          opacity: started ? 0.65 : 0,
          transition: `opacity 0.5s ease-out ${totalDuration * 0.7}ms`,
        }}
      >
        Grupo A
      </text>
      <text
        x={LEAF_X - 20}
        y={(leafY[4] + leafY[7]) / 2 + 6}
        textAnchor="end"
        fontSize="16"
        fontFamily="JetBrains Mono, monospace"
        fill="#a0c0d0"
        style={{
          opacity: started ? 0.65 : 0,
          transition: `opacity 0.5s ease-out ${totalDuration * 0.8}ms`,
        }}
      >
        Grupo B
      </text>
    </svg>
  );
}

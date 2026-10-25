"use client";

import { AnymotionStage } from "../AnymotionStage";
import { AnymotionControls } from "../AnymotionControls";
import { useAnymotionTimeline } from "../hooks/useAnymotionTimeline";

interface FeatureSpace2DPlayerProps {
  caption?: string;
  autoPlay?: boolean;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function eased(p: number, start: number, dur: number): number {
  const t = clamp01((p - start) / dur);
  return 1 - Math.pow(1 - t, 3);
}

type Point = { x1: number; y2: number; color: string; label: string };

// 1D positions (overlapping); y2 is target 2D vertical position
const POINTS: Point[] = [
  { x1: 160, y2: 150, color: "#f59e0b", label: "A" },
  { x1: 210, y2: 260, color: "#38bdf8", label: "P" },
  { x1: 260, y2: 130, color: "#f59e0b", label: "A" },
  { x1: 300, y2: 280, color: "#38bdf8", label: "P" },
  { x1: 340, y2: 170, color: "#f59e0b", label: "A" },
  { x1: 380, y2: 240, color: "#f59e0b", label: "A" },
  { x1: 420, y2: 180, color: "#38bdf8", label: "P" },
  { x1: 460, y2: 300, color: "#38bdf8", label: "P" },
  { x1: 500, y2: 140, color: "#f59e0b", label: "A" },
  { x1: 560, y2: 270, color: "#38bdf8", label: "P" },
];

const AXIS_Y_1D = 260;
const AXIS_X0 = 80;
const AXIS_X1 = 720;
const AXIS_Y0 = 80;
const AXIS_Y1 = 360;

export function FeatureSpace2DPlayer({ caption, autoPlay = true }: FeatureSpace2DPlayerProps) {
  const timeline = useAnymotionTimeline({ duration: 2, autoPlay });
  const p = timeline.progress;

  // Phases:
  // 0 - 0.4 : 1D axis only
  // 0.4 - 0.9 : second axis appears + points migrate to 2D
  // 0.8 - 1.0 : frontier line
  const show1D = eased(p, 0.0, 0.22);
  const overlapHintO = p < 0.4 ? eased(p, 0.18, 0.15) : 1 - eased(p, 0.4, 0.18);
  const yAxisO = eased(p, 0.36, 0.22);
  const migrationT = eased(p, 0.4, 0.5);
  const frontierO = eased(p, 0.78, 0.18);
  const label2DO = eased(p, 0.55, 0.2);
  const title2DO = eased(p, 0.4, 0.18);

  // Points interpolate Y from AXIS_Y_1D to y2
  // X stays at x1 (mapped later). No X change to keep correlation.

  return (
    <figure className="my-5">
      <AnymotionStage title="Dos features separan mejor que una">
        <svg viewBox="0 0 800 450" className="h-full w-full bg-[#0a0a0a]" role="img" aria-label="Espacio de features 1D a 2D">
          {/* Grid */}
          <g opacity={0.04}>
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`v-${i}`} x1={80 + i * 80} y1={60} x2={80 + i * 80} y2={380} stroke="white" strokeWidth={0.5} />
            ))}
            {Array.from({ length: 7 }).map((_, i) => (
              <line key={`h-${i}`} x1={60} y1={80 + i * 48} x2={740} y2={80 + i * 48} stroke="white" strokeWidth={0.5} />
            ))}
          </g>

          {/* Title that morphs */}
          <text x={400} y={38} textAnchor="middle" fill="white" fontSize={13} fontFamily="sans-serif" fontWeight={700} opacity={0.92}>
            {p < 0.4 ? "1 dimension: superposicion" : "2 dimensiones: separacion"}
          </text>
          <text x={400} y={54} textAnchor="middle" fill="white" fontSize={12} fontFamily="monospace" opacity={0.42}>
            {p < 0.4 ? "solo area" : "area x circularidad"}
          </text>

          {/* X axis (always) — inset para no desplazarse */}
          <g opacity={show1D}>
            <line x1={AXIS_X0} y1={AXIS_Y1} x2={AXIS_X1} y2={AXIS_Y1} stroke="white" strokeWidth={1.2} opacity={0.9} />
            <polygon points={`${AXIS_X1},${AXIS_Y1} ${AXIS_X1 - 8},${AXIS_Y1 - 4} ${AXIS_X1 - 8},${AXIS_Y1 + 4}`} fill="white" opacity={0.9} />
            <text x={AXIS_X1 - 12} y={AXIS_Y1 - 8} fill="white" fontSize={14} fontFamily="monospace" opacity={0.7} textAnchor="end">
              area
            </text>
            {/* ticks */}
            <g fontSize={8} fontFamily="monospace" fill="white" opacity={0.35}>
              <text x={160} y={376} textAnchor="middle">pequena</text>
              <text x={400} y={376} textAnchor="middle">media</text>
              <text x={640} y={376} textAnchor="middle">grande</text>
            </g>
          </g>

          {/* Y axis (appears at 0.4) — inset */}
          <g opacity={yAxisO}>
            <line x1={AXIS_X0} y1={AXIS_Y1} x2={AXIS_X0} y2={AXIS_Y0} stroke="white" strokeWidth={1.2} opacity={0.9} />
            <polygon points={`${AXIS_X0},${AXIS_Y0} ${AXIS_X0 - 4},${AXIS_Y0 + 8} ${AXIS_X0 + 4},${AXIS_Y0 + 8}`} fill="white" opacity={0.9} />
            <text x={32} y={88} fill="white" fontSize={14} fontFamily="monospace" opacity={0.7} transform="rotate(-90 32 88)">
              circularidad
            </text>
            <g fontSize={8} fontFamily="monospace" fill="white" opacity={0.35} textAnchor="middle">
              <text x={58} y={132} transform="rotate(-90 58 132)">alta</text>
              <text x={58} y={360} transform="rotate(-90 58 360)">baja</text>
            </g>
          </g>

          {/* Overlap hint (only in 1D) */}
          <g opacity={overlapHintO}>
            <rect x={290} y={288} width={220} height={22} rx={11} fill="#f59e0b" opacity={0.12} />
            <text x={400} y={303} textAnchor="middle" fill="#f59e0b" fontSize={13} fontFamily="monospace" fontWeight={600}>
              se superponen
            </text>
          </g>

          {/* Frontier line in 2D */}
          <g opacity={frontierO}>
            <line x1={180} y1={300} x2={620} y2={110} stroke="#45dcc6" strokeWidth={1.4} strokeDasharray="8 5" opacity={0.95} />
            <text x={520} y={118} fill="#45dcc6" fontSize={13} fontFamily="monospace" fontWeight={600} opacity={0.9}>
              frontera
            </text>
          </g>

          {/* Points */}
          {POINTS.map((pt, i) => {
            // stagger slight per point during migration
            const stagger = (i % 4) * 0.04;
            const t = clamp01((migrationT - stagger) / (1 - stagger));
            // ease
            const te = 1 - Math.pow(1 - t, 3);
            const cy = AXIS_Y_1D * (1 - te) + pt.y2 * te;
            const cx = pt.x1;
            const isOrange = pt.color === "#f59e0b";
            return (
              <g key={i} opacity={show1D}>
                {/* halo */}
                <circle cx={cx} cy={cy} r={14} fill={pt.color} opacity={isOrange ? 0.08 : 0.09} />
                <circle cx={cx} cy={cy} r={7} fill={pt.color} opacity={0.95} stroke="white" strokeWidth={0.8} strokeOpacity={0.85} />
                {/* label inside? */}
                <text x={cx} y={cy + 18} textAnchor="middle" fill={pt.color} fontSize={8} fontFamily="monospace" fontWeight={700} opacity={0.9}>
                  {pt.label}
                </text>
              </g>
            );
          })}

          {/* Legend bottom */}
          <g opacity={label2DO}>
            <g transform="translate(540,400)">
              <circle cx={0} cy={0} r={6} fill="#f59e0b" />
              <text x={12} y={4} fill="white" fontSize={13} fontFamily="monospace" opacity={0.85}>
                Aspergillus
              </text>
              <circle cx={110} cy={0} r={6} fill="#38bdf8" />
              <text x={122} y={4} fill="white" fontSize={13} fontFamily="monospace" opacity={0.85}>
                Penicillium
              </text>
            </g>
          </g>

          {/* 1D legend when not yet migrated */}
          <g opacity={p < 0.45 ? eased(p, 0.12, 0.15) : 1 - eased(p, 0.45, 0.12)}>
            {p < 0.5 && (
              <g>
                <circle cx={120} cy={400} r={6} fill="#f59e0b" opacity={0.9} />
                <circle cx={138} cy={400} r={6} fill="#38bdf8" opacity={0.9} />
                <text x={152} y={404} fill="white" fontSize={13} fontFamily="monospace" opacity={0.6}>
                  mezclados
                </text>
              </g>
            )}
          </g>

          {/* Callout for separation */}
          <g opacity={frontierO}>
            <text x={400} y={418} textAnchor="middle" fill="#45dcc6" fontSize={13} fontFamily="monospace" fontWeight={600}>
              dos features  separacion clara
            </text>
          </g>
        </svg>
      </AnymotionStage>
      <AnymotionControls timeline={timeline} label="Espacio de features 1D a 2D" />
      {caption && <figcaption className="mt-2 text-center font-mono text-sm text-storm">{caption}</figcaption>}
    </figure>
  );
}

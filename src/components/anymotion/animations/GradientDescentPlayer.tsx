"use client";

import { useEffect, useMemo, useState } from "react";
import { AnymotionStage } from "../AnymotionStage";
import { useAnymotionTimeline } from "../hooks/useAnymotionTimeline";
import { AnymotionControls } from "../AnymotionControls";

interface GradientDescentPlayerProps {
  caption: string;
  autoPlay?: boolean;
}

const MAX_STEPS = 40;
const THETA_MIN = -6;
const THETA_MAX = 6;
const J_MAX = 26;
const PLOT_X0 = 100;
const PLOT_X1 = 700;
const PLOT_Y0 = 80;
const PLOT_Y1 = 400;

function thetaToX(t: number): number {
  return PLOT_X0 + ((t - THETA_MIN) / (THETA_MAX - THETA_MIN)) * (PLOT_X1 - PLOT_X0);
}

function jToY(j: number): number {
  const clamped = Math.max(0, Math.min(J_MAX, j));
  return PLOT_Y1 - (clamped / J_MAX) * (PLOT_Y1 - PLOT_Y0);
}

function cost(theta: number): number {
  const d = theta - 1;
  return d * d;
}

function grad(theta: number): number {
  return 2 * (theta - 1);
}

export function GradientDescentPlayer({ caption, autoPlay = true }: GradientDescentPlayerProps) {
  const [lr, setLr] = useState(0.3);
  const [start, setStart] = useState(-3);

  const { path, diverged } = useMemo(() => {
    const pts: number[] = [start];
    let theta = start;
    let didDiverge = false;
    for (let i = 0; i < MAX_STEPS; i++) {
      const next = theta - lr * grad(theta);
      theta = next;
      pts.push(theta);
      if (Math.abs(theta) > THETA_MAX) {
        didDiverge = true;
        break;
      }
    }
    if (Math.abs(start) > THETA_MAX) didDiverge = true;
    return { path: pts, diverged: didDiverge };
  }, [lr, start]);

  const timeline = useAnymotionTimeline({ duration: 4, autoPlay });
  const { progress, seek, reset, pause } = timeline;

  const prefersReduced =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    reset();
    if (prefersReduced) seek(timeline.duration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lr, start]);

  useEffect(() => {
    if (diverged) pause();
  }, [diverged, pause]);

  const stepCount = path.length - 1;
  const idx =
    stepCount > 0
      ? Math.max(0, Math.min(stepCount, Math.round(progress * stepCount)))
      : 0;
  const currentTheta = path[idx];
  const currentJ = cost(currentTheta);

  useEffect(() => {
    if (prefersReduced) seek(timeline.duration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const curvePoints = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 120; i++) {
      const t = THETA_MIN + (i / 120) * (THETA_MAX - THETA_MIN);
      pts.push(`${thetaToX(t).toFixed(1)},${jToY(cost(t)).toFixed(1)}`);
    }
    return pts.join(" ");
  }, []);

  const visitedPoints = path.slice(0, idx + 1);
  const visitedPolyline = visitedPoints
    .map((th) => `${thetaToX(th).toFixed(1)},${jToY(cost(th)).toFixed(1)}`)
    .join(" ");

  const g = grad(currentTheta);
  const cx = thetaToX(currentTheta);
  const cy = jToY(currentJ);
  let arrowEndX = cx;
  let arrowEndY = cy;
  if (Math.abs(g) > 1e-9) {
    const sign = g > 0 ? 1 : -1;
    const dx = sign * 50;
    const dy = -(Math.abs(g)) * (PLOT_Y1 - PLOT_Y0) / J_MAX;
    const len = Math.hypot(dx, dy) || 1;
    const L = 46;
    arrowEndX = cx + (dx / len) * L;
    arrowEndY = cy + (dy / len) * L;
  }

  const clampX = (v: number) => Math.max(0, Math.min(800, v));
  const clampY = (v: number) => Math.max(0, Math.min(450, v));

  const setLrClamped = (v: number) => setLr(Math.max(0.01, Math.min(1.2, v)));
  const setStartClamped = (v: number) => setStart(Math.max(-4, Math.min(4, v)));

  return (
    <figure className="my-5">
      <AnymotionStage title="Descenso por gradiente sobre J(theta)">
        <svg
          viewBox="0 0 800 450"
          className="h-full w-full bg-[#0a0a0a]"
          role="img"
          aria-label="Descenso por gradiente sobre una curva de costo convexa"
        >
          <g opacity={0.04}>
            {Array.from({ length: 9 }).map((_, i) => (
              <line
                key={`v-${i}`}
                x1={100 + i * 75}
                y1={60}
                x2={100 + i * 75}
                y2={400}
                stroke="white"
                strokeWidth={0.5}
              />
            ))}
          </g>

          <line x1={PLOT_X0} y1={PLOT_Y0} x2={PLOT_X0} y2={PLOT_Y1} stroke="white" strokeWidth={1.1} opacity={0.5} />
          <line x1={PLOT_X0} y1={PLOT_Y1} x2={PLOT_X1} y2={PLOT_Y1} stroke="white" strokeWidth={1.1} opacity={0.5} />
          <text x={PLOT_X1 + 6} y={PLOT_Y1 + 4} fill="white" fontSize={11} fontFamily="monospace" opacity={0.7}>
            θ
          </text>
          <text x={PLOT_X0 - 8} y={PLOT_Y0 - 8} fill="white" fontSize={11} fontFamily="monospace" opacity={0.7}>
            J(θ)
          </text>

          <polyline points={curvePoints} fill="none" stroke="#9ca3af" strokeWidth={1.6} opacity={0.85} />

          <line x1={thetaToX(1)} y1={PLOT_Y1} x2={thetaToX(1)} y2={jToY(0)} stroke="#f59e0b" strokeWidth={1} strokeDasharray="4 4" opacity={0.7} />
          <circle cx={thetaToX(1)} cy={jToY(0)} r={4} fill="#f59e0b" stroke="#0a0a0a" strokeWidth={1} />
          <text x={thetaToX(1)} y={jToY(0) - 10} textAnchor="middle" fill="#f59e0b" fontSize={9} fontFamily="monospace" fontWeight={700}>
            mínimo
          </text>

          {visitedPolyline && (
            <polyline points={visitedPolyline} fill="none" stroke="#45dcc6" strokeWidth={2} opacity={0.9} />
          )}

          {path.map((th, i) => {
            if (i <= idx) return null;
            return (
              <circle
                key={`future-${i}`}
                cx={clampX(thetaToX(th))}
                cy={clampY(jToY(cost(th)))}
                r={3}
                fill="#6b7280"
                opacity={0.5}
              />
            );
          })}

          <circle
            cx={clampX(cx)}
            cy={clampY(cy)}
            r={7}
            fill="#45dcc6"
            stroke="#0a0a0a"
            strokeWidth={1.5}
          />

          {Math.abs(g) > 1e-9 && (
            <g>
              <line
                x1={clampX(cx)}
                y1={clampY(cy)}
                x2={clampX(arrowEndX)}
                y2={clampY(arrowEndY)}
                stroke="#f59e0b"
                strokeWidth={2}
                markerEnd="url(#gd-arrow)"
              />
            </g>
          )}

          {idx + 1 < path.length && (
            <circle
              cx={clampX(thetaToX(path[idx + 1]))}
              cy={clampY(jToY(cost(path[idx + 1])))}
              r={4}
              fill="none"
              stroke="#45dcc6"
              strokeWidth={1.5}
              opacity={0.7}
            />
          )}

          <defs>
            <marker id="gd-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <polygon points="0,0 8,4 0,8" fill="#f59e0b" />
            </marker>
          </defs>

          <g fontFamily="monospace" fontSize={11} fill="white">
            <text x={PLOT_X0 + 8} y={PLOT_Y0 + 14} opacity={0.9}>
              {`θ = ${currentTheta.toFixed(3)}`}
            </text>
            <text x={PLOT_X0 + 8} y={PLOT_Y0 + 30} opacity={0.9}>
              {`J(θ) = ${currentJ.toFixed(3)}`}
            </text>
            <text x={PLOT_X0 + 8} y={PLOT_Y0 + 46} opacity={0.9}>
              {`Paso ${idx} / ${stepCount}`}
            </text>
          </g>

          {diverged && (
            <g>
              <rect x={260} y={190} width={280} height={44} rx={8} fill="#7f1d1d" opacity={0.92} />
              <text x={400} y={217} textAnchor="middle" fill="#fecaca" fontSize={13} fontFamily="sans-serif" fontWeight={700}>
                Divergió: baja la tasa
              </text>
            </g>
          )}
        </svg>
      </AnymotionStage>

      <AnymotionControls timeline={timeline} label="Descenso por gradiente" />

      <div className="mt-2 flex flex-col gap-2 rounded-card border border-white/10 bg-surface-card px-4 py-3 text-storm sm:flex-row sm:items-center sm:gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="gd-lr" className="font-mono text-xs whitespace-nowrap text-storm">
            Tasa de aprendizaje{" "}
            <span className="font-semibold text-mint">{lr.toFixed(2)}</span>
          </label>
          <input
            id="gd-lr"
            type="range"
            min={0.01}
            max={1.2}
            step={0.01}
            value={lr}
            onChange={(e) => setLrClamped(Number(e.target.value))}
            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-gray-200 accent-mint"
            aria-label="Tasa de aprendizaje"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="gd-start" className="font-mono text-xs whitespace-nowrap text-storm">
            Punto inicial{" "}
            <span className="font-semibold text-mint">{start.toFixed(1)}</span>
          </label>
          <input
            id="gd-start"
            type="range"
            min={-4}
            max={4}
            step={0.1}
            value={start}
            onChange={(e) => setStartClamped(Number(e.target.value))}
            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-gray-200 accent-mint"
            aria-label="Punto inicial"
          />
        </div>
      </div>

      {diverged && (
        <p className="mt-2 text-center font-mono text-xs text-rose-300" aria-live="polite">
          Divergió: baja la tasa de aprendizaje.
        </p>
      )}

      {caption && <figcaption className="mt-2 text-center font-mono text-xs text-storm">{caption}</figcaption>}
    </figure>
  );
}

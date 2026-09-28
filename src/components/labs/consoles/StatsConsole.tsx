"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { TerminalChrome } from "@/components/shared/TerminalChrome";
import { TypingText } from "@/components/ui/TypingText";

const MU = 0;
const SIGMA = 1;
const X_MIN = -3;
const X_MAX = 3;
const VIEW_X0 = 20;
const VIEW_X1 = 300;
const VIEW_Y0 = 160;
const VIEW_Y1 = 20;
const VIEW_W = VIEW_X1 - VIEW_X0; // 280
const VIEW_H = VIEW_Y0 - VIEW_Y1; // 140
const Y_MAX = 0.4;
const N = 80;

function gaussianPdf(x: number, mu = MU, sigma = SIGMA): number {
  return Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
}

function xToPx(x: number): number {
  return VIEW_X0 + ((x - X_MIN) / (X_MAX - X_MIN)) * VIEW_W;
}

function yToPy(density: number): number {
  const clamped = Math.max(0, Math.min(density, Y_MAX));
  return VIEW_Y0 - (clamped / Y_MAX) * VIEW_H;
}

export function StatsConsole() {
  const shouldReduceMotion = useReducedMotion();
  const [showChart, setShowChart] = useState(shouldReduceMotion ?? false);

  useEffect(() => {
    if (shouldReduceMotion) {
      setShowChart(true);
      return;
    }
    const t = setTimeout(() => setShowChart(true), 900);
    return () => clearTimeout(t);
  }, [shouldReduceMotion]);

  const { bellPath, fillPath, xTicks, yTicks } = useMemo(() => {
    const pts: { px: number; py: number; x: number; density: number }[] = [];
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1);
      const x = X_MIN + t * (X_MAX - X_MIN);
      const density = gaussianPdf(x, MU, SIGMA);
      const px = xToPx(x);
      const py = yToPy(density);
      pts.push({ px, py, x, density });
    }
    const first = pts[0];
    const bell = `M ${first.px.toFixed(2)},${first.py.toFixed(2)} ` + pts.slice(1).map((p) => `L ${p.px.toFixed(2)},${p.py.toFixed(2)}`).join(" ");
    const fill = `${bell} L ${VIEW_X1},${VIEW_Y0} L ${VIEW_X0},${VIEW_Y0} Z`;

    const xTickValues = [-3, -2, -1, 0, 1, 2, 3];
    const xTicksArr = xTickValues.map((v) => ({ label: String(v), px: xToPx(v), value: v }));

    const yTickValues = [0, 0.1, 0.2, 0.3, 0.4];
    const yTicksArr = yTickValues.map((d) => ({ label: d.toFixed(1), py: yToPy(d), value: d }));

    return { bellPath: bell, fillPath: fill, xTicks: xTicksArr, yTicks: yTicksArr, pts };
  }, []);

  const muPx = xToPx(MU);
  const muMinusPx = xToPx(MU - SIGMA);
  const muPlusPx = xToPx(MU + SIGMA);
  const peakPy = yToPy(gaussianPdf(MU, MU, SIGMA));

  return (
    <TerminalChrome title="python invitro-code --lab stats" className="flex flex-col">
      <div className="flex h-[420px] flex-col gap-3">
        <TypingText text="import scipy.stats as st" delay={22} className="text-sm text-cyan-400" />
        <p className="font-mono text-xs text-white/50">st.norm.pdf(x, μ=0, σ=1)</p>
        <p className="font-mono text-xs text-white/40">dist = st.norm(μ=0, σ=1) · n=120 · Shapiro p=0.42</p>

        <div className="flex-1 overflow-hidden rounded-lg bg-white/5 p-3">
          <svg viewBox="0 0 320 180" className="h-full w-full" aria-label="Distribución normal N(μ=0, σ=1) — media μ y desviación σ" role="img">
            <defs>
              <linearGradient id="bell-fill-true" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5eead4" stopOpacity={0.32} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.06} />
              </linearGradient>
            </defs>

            {/* grid */}
            <g stroke="white" strokeWidth={0.3} opacity={0.06}>
              {xTicks
                .filter((_, i) => i !== 0 && i !== xTicks.length - 1)
                .map((t) => (
                  <line key={`vg-${t.label}`} x1={t.px} y1={VIEW_Y1} x2={t.px} y2={VIEW_Y0} />
                ))}
              {yTicks.map((t) => (
                <line key={`hg-${t.label}`} x1={VIEW_X0} y1={t.py} x2={VIEW_X1} y2={t.py} />
              ))}
            </g>

            {/* σ band (μ±σ) subtle highlight */}
            <rect
              x={muMinusPx}
              y={VIEW_Y1}
              width={muPlusPx - muMinusPx}
              height={VIEW_H}
              fill="#5eead4"
              opacity={0.04}
              rx={1}
            />

            {/* area under curve */}
            {shouldReduceMotion ? (
              <path d={fillPath} fill="url(#bell-fill-true)" />
            ) : (
              <motion.path
                d={fillPath}
                fill="url(#bell-fill-true)"
                initial={{ opacity: 0 }}
                animate={showChart ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              />
            )}

            {/* true Gaussian stroke — 80-point polyline, symmetric at μ */}
            {shouldReduceMotion ? (
              <path d={bellPath} fill="none" stroke="#5eead4" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <motion.path
                d={bellPath}
                fill="none"
                stroke="#5eead4"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={showChart ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            )}

            {/* vertical dashed line at μ */}
            {shouldReduceMotion ? (
              <line x1={muPx} y1={peakPy} x2={muPx} y2={VIEW_Y0} stroke="white" strokeWidth={0.9} strokeDasharray="5 5" opacity={0.45} />
            ) : (
              <motion.line
                x1={muPx}
                y1={peakPy}
                x2={muPx}
                y2={VIEW_Y0}
                stroke="white"
                strokeWidth={0.9}
                strokeDasharray="5 5"
                initial={{ opacity: 0 }}
                animate={showChart ? { opacity: 0.45 } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
              />
            )}

            {/* μ±σ markers — dashed lighter */}
            <line x1={muMinusPx} y1={VIEW_Y1} x2={muMinusPx} y2={VIEW_Y0} stroke="white" strokeWidth={0.7} strokeDasharray="3 5" opacity={0.22} />
            <line x1={muPlusPx} y1={VIEW_Y1} x2={muPlusPx} y2={VIEW_Y0} stroke="white" strokeWidth={0.7} strokeDasharray="3 5" opacity={0.22} />

            {/* axes */}
            <line x1={VIEW_X0} y1={VIEW_Y0} x2={VIEW_X1} y2={VIEW_Y0} stroke="white" strokeWidth={0.6} opacity={0.18} />
            <line x1={VIEW_X0} y1={VIEW_Y1} x2={VIEW_X0} y2={VIEW_Y0} stroke="white" strokeWidth={0.6} opacity={0.18} />

            {/* X axis ticks + labels -3..3 */}
            <g>
              {xTicks.map((t) => (
                <g key={`xt-${t.label}`}>
                  <line x1={t.px} y1={VIEW_Y0} x2={t.px} y2={VIEW_Y0 + 4} stroke="white" strokeWidth={0.5} opacity={0.32} />
                  <text x={t.px} y={VIEW_Y0 + 12} textAnchor="middle" fontSize={7} fill="white" opacity={t.value === 0 ? 0.75 : 0.45} fontFamily="monospace">
                    {t.label}
                  </text>
                </g>
              ))}
            </g>

            {/* Y axis ticks + labels 0→0.4 */}
            <g>
              {yTicks.map((t) => (
                <g key={`yt-${t.label}`}>
                  <line x1={VIEW_X0 - 4} y1={t.py} x2={VIEW_X0} y2={t.py} stroke="white" strokeWidth={0.5} opacity={0.28} />
                  <text x={VIEW_X0 - 6} y={t.py + 2.5} textAnchor="end" fontSize={6.5} fill="white" opacity={0.45} fontFamily="monospace">
                    {t.label}
                  </text>
                </g>
              ))}
            </g>

            {/* axis titles */}
            <text x={(VIEW_X0 + VIEW_X1) / 2} y={184 - 8} textAnchor="middle" fontSize={7} fill="white" opacity={0.38} fontFamily="monospace" letterSpacing={0.3}>
              X
            </text>
            <text
              x={6}
              y={(VIEW_Y0 + VIEW_Y1) / 2}
              textAnchor="middle"
              fontSize={6.5}
              fill="white"
              opacity={0.38}
              fontFamily="monospace"
              transform={`rotate(-90 6 ${(VIEW_Y0 + VIEW_Y1) / 2})`}
            >
              densidad
            </text>

            {/* μ and σ annotations near baseline */}
            <text x={muPx} y={VIEW_Y0 + 12} textAnchor="middle" fontSize={8} fill="white" opacity={0.9} fontFamily="monospace">
              μ
            </text>
            <text x={muPx} y={peakPy - 6} textAnchor="middle" fontSize={6} fill="white" opacity={0.5} fontFamily="monospace">
              Media μ
            </text>
            {/* σ labels slightly offset to avoid overlapping μ */}
            <g fontFamily="monospace" fontSize={6.5} fill="white" opacity={0.5}>
              <text x={muMinusPx} y={VIEW_Y0 - 2} textAnchor="middle">
                μ−σ
              </text>
              <text x={muPlusPx} y={VIEW_Y0 - 2} textAnchor="middle">
                μ+σ
              </text>
            </g>

            {/* peak marker dot for μ */}
            <circle cx={muPx} cy={peakPy} r={2.2} fill="#5eead4" opacity={0.95} stroke="#0a0a0a" strokeWidth={0.6} />
          </svg>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-green-400">
          <span className="tabular-nums">μ=0.03</span>
          <span className="text-white/20">·</span>
          <span className="tabular-nums">σ=0.98</span>
          <span className="text-white/20">·</span>
          <span className="text-white/60">p=0.42 ns</span>
          <span className="ml-auto hidden text-[11px] text-white/40 md:inline">μ=0 · σ=1 · N(0,1)</span>
        </div>
      </div>
    </TerminalChrome>
  );
}

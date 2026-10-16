"use client";

import { useMemo, useState } from "react";
import { AnymotionStage } from "../AnymotionStage";

interface DistributionShapeProps {
  caption: string;
}

type Shape = "sym" | "right" | "left" | "bimodal";

// ---------------------------------------------------------------------------
// Geometría del SVG (viewBox 800x450, 16:9).
// ---------------------------------------------------------------------------
const VB_W = 800;
const VB_H = 450;
const PLOT_L = 60;
const PLOT_R = 760;
const PLOT_T = 46;
const PLOT_B = 370;

const X_MIN = -2;
const X_MAX = 12;
const N_POINTS = 401;

const XS: number[] = (() => {
  const out: number[] = [];
  for (let i = 0; i < N_POINTS; i++) {
    out.push(X_MIN + (i * (X_MAX - X_MIN)) / (N_POINTS - 1));
  }
  return out;
})();

// ---------------------------------------------------------------------------
// Funciones analíticas de densidad (cerradas, deterministas, sin Math.random).
// ---------------------------------------------------------------------------

// Aproximación de erf (Abramowitz & Stegun 7.1.26).
function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1;
  const a = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * a);
  const poly =
    t *
    (0.254829592 +
      t *
        (-0.284496736 +
          t *
            (1.421413741 +
              t * (-1.453153528 + t * 1.061405429))));
  const val = 1 - poly * Math.exp(-a * a);
  return sign * val;
}

function normalPdf(x: number, mu: number, sigma: number): number {
  const z = (x - mu) / sigma;
  return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
}

// Densidad skew-normal (Azzalini): asimetría controlada por alpha.
function skewNormalPdf(
  x: number,
  xi: number,
  omega: number,
  alpha: number,
): number {
  const z = (x - xi) / omega;
  const phi = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z);
  const Phi = 0.5 * (1 + erf((alpha * z) / Math.sqrt(2)));
  return (2 / omega) * phi * Phi;
}

// Integración trapezoidal.
function trapz(xs: number[], ys: number[]): number {
  let s = 0;
  for (let i = 1; i < xs.length; i++) {
    s += (xs[i] - xs[i - 1]) * (ys[i] + ys[i - 1]) * 0.5;
  }
  return s;
}

interface Stats {
  mean: number;
  median: number;
  modes: number[];
  std: number;
  skew: number;
}

// Estadísticos por integración numérica sobre la grilla (determinista).
function computeStats(xs: number[], pdf: number[]): Stats {
  const z = trapz(xs, pdf);

  const meanIntegrand = xs.map((x, i) => x * pdf[i]);
  const mean = trapz(xs, meanIntegrand) / z;

  const varIntegrand = xs.map((x, i) => (x - mean) ** 2 * pdf[i]);
  const variance = trapz(xs, varIntegrand) / z;
  const std = Math.sqrt(variance);

  const skewIntegrand = xs.map((x, i) => (x - mean) ** 3 * pdf[i]);
  const m3 = trapz(xs, skewIntegrand) / z;
  const skew = std > 0 ? m3 / std ** 3 : 0;

  // Mediana por acumulada.
  const cum: number[] = [0];
  for (let i = 1; i < xs.length; i++) {
    cum.push(
      cum[i - 1] +
        (xs[i] - xs[i - 1]) * (pdf[i] + pdf[i - 1]) * 0.5,
    );
  }
  const half = z * 0.5;
  let median = xs[xs.length - 1];
  for (let i = 1; i < xs.length; i++) {
    if (cum[i] >= half) {
      const prev = cum[i - 1];
      const denom = cum[i] - prev;
      const frac = denom > 0 ? (half - prev) / denom : 0;
      median = xs[i - 1] + frac * (xs[i] - xs[i - 1]);
      break;
    }
  }

  // Modas: picos locales que superen el 60% del máximo.
  const maxPdf = Math.max(...pdf);
  const peaks: { x: number; y: number }[] = [];
  for (let i = 1; i < xs.length - 1; i++) {
    if (pdf[i] > pdf[i - 1] && pdf[i] > pdf[i + 1]) {
      peaks.push({ x: xs[i], y: pdf[i] });
    }
  }
  peaks.sort((a, b) => b.y - a.y);
  const modePeaks = peaks.filter((p) => p.y >= maxPdf * 0.6);
  const modes: number[] = [];
  for (const p of modePeaks) {
    if (modes.every((m) => Math.abs(m - p.x) > 0.6)) modes.push(p.x);
  }
  if (modes.length === 0) {
    modes.push(xs[pdf.indexOf(maxPdf)]);
  }
  modes.sort((a, b) => a - b);

  return { mean, median, modes, std, skew };
}

const SHAPE_LABELS: Record<Shape, string> = {
  sym: "Simétrica (normal)",
  right: "Derecha-asimétrica (cola a la derecha)",
  left: "Izquierda-asimétrica (cola a la izquierda)",
  bimodal: "Bimodal (dos modos)",
};

export function DistributionShape({ caption }: DistributionShapeProps) {
  const [shape, setShape] = useState<Shape>("sym");
  const [s, setS] = useState<number>(0.5); // fuerza de la asimetría [0,1]

  // Densidad analítica según forma y fuerza.
  const pdf = useMemo(() => {
    return XS.map((x) => {
      if (shape === "sym") {
        return normalPdf(x, 5, 1.2);
      }
      if (shape === "right") {
        const alpha = 10 * s;
        return skewNormalPdf(x, 5, 1.2, alpha);
      }
      if (shape === "left") {
        const alpha = -10 * s;
        return skewNormalPdf(x, 5, 1.2, alpha);
      }
      // Bimodal: dos normales simétricas alrededor de 5; s controla separación.
      const d = 1.2 + 2.3 * s;
      return (
        0.5 * normalPdf(x, 5 - d, 0.9) +
        0.5 * normalPdf(x, 5 + d, 0.9)
      );
    });
  }, [shape, s]);

  const stats = useMemo(() => computeStats(XS, pdf), [pdf]);

  const isSym = Math.abs(stats.skew) < 0.15;

  const explanation = useMemo(() => {
    if (isSym) {
      if (shape === "bimodal") {
        return "Hay dos grupos mezclados: la media cae entre los dos picos y no describe a ninguno por separado, aunque la distribución sea simétrica en conjunto.";
      }
      return "La media, la mediana y la moda coinciden: la distribución es balanceada y la media representa bien al sujeto típico.";
    }
    if (stats.skew > 0) {
      return "Con la cola a la derecha, unos pocos valores muy altos arrastran la media por encima de la mediana, así que la media NO representa al sujeto típico.";
    }
    return "Con la cola a la izquierda, unos pocos valores muy bajos arrastran la media por debajo de la mediana, así que la media NO representa al sujeto típico.";
  }, [isSym, shape, stats.skew]);

  // Escala vertical dinámica.
  const maxY = Math.max(...pdf) * 1.15;

  const xPx = (v: number) =>
    PLOT_L + ((v - X_MIN) / (X_MAX - X_MIN)) * (PLOT_R - PLOT_L);
  const yPx = (d: number) =>
    PLOT_B - (d / maxY) * (PLOT_B - PLOT_T);

  // Curva SVG.
  const curvePath = pdf
    .map((d, i) => `${i === 0 ? "M" : "L"} ${xPx(XS[i]).toFixed(1)} ${yPx(d).toFixed(1)}`)
    .join(" ");

  // Banda sombreada entre media y mediana.
  const bandLeft = xPx(Math.min(stats.mean, stats.median));
  const bandRight = xPx(Math.max(stats.mean, stats.median));

  const sliderDisabled = shape === "sym";

  return (
    <figure className="my-5">
      <AnymotionStage title="Forma de la distribución y medidas de centro">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="h-full w-full bg-[#0a0a0a]"
          role="img"
          aria-label="Curva de densidad con marcadores de media, mediana y moda"
        >
          {/* Título */}
          <text
            x={VB_W / 2}
            y={26}
            textAnchor="middle"
            fill="white"
            fontSize={15}
            fontFamily="sans-serif"
            fontWeight={700}
            opacity={0.94}
          >
            Forma de la distribución — {SHAPE_LABELS[shape]}
          </text>

          {/* Ejes */}
          <line
            x1={PLOT_L}
            y1={PLOT_T}
            x2={PLOT_L}
            y2={PLOT_B}
            stroke="white"
            strokeWidth={1.1}
            opacity={0.55}
          />
          <line
            x1={PLOT_L}
            y1={PLOT_B}
            x2={PLOT_R}
            y2={PLOT_B}
            stroke="white"
            strokeWidth={1.1}
            opacity={0.55}
          />

          {/* Ticks eje x */}
          {[-2, 0, 2, 4, 5, 6, 8, 10, 12].map((v) => (
            <g key={`tx-${v}`}>
              <line
                x1={xPx(v)}
                y1={PLOT_B}
                x2={xPx(v)}
                y2={PLOT_B + 5}
                stroke="white"
                strokeWidth={1}
                opacity={0.5}
              />
              <text
                x={xPx(v)}
                y={PLOT_B + 18}
                textAnchor="middle"
                fill="white"
                fontSize={10}
                fontFamily="monospace"
                opacity={0.7}
              >
                {v}
              </text>
            </g>
          ))}

          {/* Banda entre media y mediana */}
          <rect
            x={bandLeft}
            y={PLOT_T}
            width={Math.max(0, bandRight - bandLeft)}
            height={PLOT_B - PLOT_T}
            fill="rgba(251,191,36,0.12)"
            stroke="none"
          />

          {/* Curva de densidad */}
          <path
            d={curvePath}
            fill="none"
            stroke="#45dcc6"
            strokeWidth={2.4}
            opacity={0.95}
          />

          {/* Sombreado bajo la curva */}
          <path
            d={`${curvePath} L ${xPx(X_MAX).toFixed(1)} ${PLOT_B} L ${xPx(X_MIN).toFixed(1)} ${PLOT_B} Z`}
            fill="rgba(69,220,198,0.12)"
            stroke="none"
          />

          {/* Línea vertical: mediana */}
          <line
            x1={xPx(stats.median)}
            y1={PLOT_T}
            x2={xPx(stats.median)}
            y2={PLOT_B}
            stroke="#38bdf8"
            strokeWidth={2}
            strokeDasharray="5 4"
          />
          {/* Línea vertical: media */}
          <line
            x1={xPx(stats.mean)}
            y1={PLOT_T}
            x2={xPx(stats.mean)}
            y2={PLOT_B}
            stroke="#f59e0b"
            strokeWidth={2}
          />

          {/* Marcadores sobre la curva: moda */}
          {stats.modes.map((m, idx) => {
            // densidad en el modo (interpolación simple).
            let d = 0;
            for (let i = 0; i < XS.length - 1; i++) {
              if (XS[i] <= m && m <= XS[i + 1]) {
                const frac =
                  (m - XS[i]) / (XS[i + 1] - XS[i]);
                d = pdf[i] + frac * (pdf[i + 1] - pdf[i]);
                break;
              }
            }
            return (
              <g key={`mode-${idx}`}>
                <circle
                  cx={xPx(m)}
                  cy={yPx(d)}
                  r={6}
                  fill="#f43f5e"
                  stroke="#0a0a0a"
                  strokeWidth={1.5}
                />
                <text
                  x={xPx(m)}
                  y={yPx(d) - 10}
                  textAnchor="middle"
                  fill="#f43f5e"
                  fontSize={10}
                  fontFamily="monospace"
                  fontWeight={700}
                >
                  moda
                </text>
              </g>
            );
          })}

          {/* Punto sobre la curva para la media */}
          {(() => {
            let d = 0;
            const m = stats.mean;
            for (let i = 0; i < XS.length - 1; i++) {
              if (XS[i] <= m && m <= XS[i + 1]) {
                const frac = (m - XS[i]) / (XS[i + 1] - XS[i]);
                d = pdf[i] + frac * (pdf[i + 1] - pdf[i]);
                break;
              }
            }
            return (
              <circle
                cx={xPx(m)}
                cy={yPx(d)}
                r={5}
                fill="#f59e0b"
                stroke="#0a0a0a"
                strokeWidth={1.5}
              />
            );
          })()}

          {/* Punto sobre la curva para la mediana */}
          {(() => {
            let d = 0;
            const m = stats.median;
            for (let i = 0; i < XS.length - 1; i++) {
              if (XS[i] <= m && m <= XS[i + 1]) {
                const frac = (m - XS[i]) / (XS[i + 1] - XS[i]);
                d = pdf[i] + frac * (pdf[i + 1] - pdf[i]);
                break;
              }
            }
            return (
              <circle
                cx={xPx(m)}
                cy={yPx(d)}
                r={5}
                fill="#38bdf8"
                stroke="#0a0a0a"
                strokeWidth={1.5}
              />
            );
          })()}

          {/* Etiqueta de diferencia media - mediana */}
          <g fontFamily="monospace" fontSize={11}>
            <rect
              x={PLOT_R - 200}
              y={PLOT_T + 4}
              width={196}
              height={24}
              rx={8}
              fill="rgba(251,191,36,0.14)"
              stroke="#f59e0b"
              strokeWidth={1}
            />
            <text
              x={PLOT_R - 102}
              y={PLOT_T + 20}
              textAnchor="middle"
              fill="#f59e0b"
              fontWeight={700}
            >
              media − mediana = {(stats.mean - stats.median).toFixed(3)}
            </text>
          </g>

          {/* Leyenda */}
          <g fontFamily="monospace" fontSize={10} opacity={0.85}>
            <line
              x1={PLOT_L}
              y1={PLOT_B + 26}
              x2={PLOT_L + 20}
              y2={PLOT_B + 26}
              stroke="#45dcc6"
              strokeWidth={2.4}
            />
            <text x={PLOT_L + 26} y={PLOT_B + 30} fill="white">
              densidad
            </text>
            <line
              x1={PLOT_L + 110}
              y1={PLOT_B + 26}
              x2={PLOT_L + 130}
              y2={PLOT_B + 26}
              stroke="#f59e0b"
              strokeWidth={2}
            />
            <text x={PLOT_L + 136} y={PLOT_B + 30} fill="white">
              media
            </text>
            <line
              x1={PLOT_L + 195}
              y1={PLOT_B + 26}
              x2={PLOT_L + 215}
              y2={PLOT_B + 26}
              stroke="#38bdf8"
              strokeWidth={2}
              strokeDasharray="5 4"
            />
            <text x={PLOT_L + 221} y={PLOT_B + 30} fill="white">
              mediana
            </text>
            <circle
              cx={PLOT_L + 290}
              cy={PLOT_B + 26}
              r={4}
              fill="#f43f5e"
            />
            <text x={PLOT_L + 300} y={PLOT_B + 30} fill="white">
              moda
            </text>
            <rect
              x={PLOT_L + 360}
              y={PLOT_B + 20}
              width={14}
              height={12}
              rx={2}
              fill="rgba(251,191,36,0.12)"
              stroke="#f59e0b"
              strokeWidth={1}
            />
            <text x={PLOT_L + 380} y={PLOT_B + 30} fill="white">
              zona media-mediana
            </text>
          </g>
        </svg>
      </AnymotionStage>

      {/* Controles */}
      <div className="mt-2 flex flex-col gap-3 rounded-card border border-white/10 bg-surface-card px-4 py-3 text-storm">
        {/* Selector de forma */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide opacity-70">
            Forma de la distribución
          </span>
          <div role="group" aria-label="Selector de forma de la distribución" className="flex flex-wrap gap-2">
            {(["sym", "right", "left", "bimodal"] as Shape[]).map((sh) => {
              const active = sh === shape;
              return (
                <button
                  key={sh}
                  type="button"
                  onClick={() => {
                    setShape(sh);
                    if (sh === "sym") setS(0);
                  }}
                  aria-pressed={active}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    active
                      ? "border-mint bg-mint/15 text-mint"
                      : "border-gray-200 bg-white text-storm hover:bg-mint/10 hover:text-mint"
                  }`}
                >
                  {SHAPE_LABELS[sh]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Deslizador de fuerza de la asimetría */}
        <div className="flex flex-wrap items-center gap-3">
          <label
            htmlFor="dist-shape-strength"
            className="font-mono text-xs whitespace-nowrap text-storm"
          >
            Fuerza de la cola (asimetría){" "}
            <span className="font-semibold text-mint">{s.toFixed(2)}</span>
          </label>
          <input
            id="dist-shape-strength"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={s}
            disabled={sliderDisabled}
            onChange={(e) => setS(Number(e.target.value))}
            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-gray-200 accent-mint disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Fuerza de la asimetría de la distribución"
          />
        </div>

        {/* Etiqueta de simetría */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              isSym
                ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                : "border-amber-400/40 bg-amber-400/10 text-amber-300"
            }`}
          >
            {isSym ? "Simétrica" : "Asimétrica"}
          </span>
          <span className="font-mono text-xs text-storm/80">
            coeficiente de asimetría = {stats.skew.toFixed(3)}
          </span>
        </div>

        {/* Lectura viva */}
        <div
          aria-live="polite"
          className="grid grid-cols-2 gap-x-4 gap-y-1 rounded-card border border-gray-200 bg-white px-3 py-2 font-mono text-xs text-storm sm:grid-cols-3"
        >
          <span>
            Media = <span className="text-amber-600">{stats.mean.toFixed(3)}</span>
          </span>
          <span>
            Mediana = <span className="text-sky-600">{stats.median.toFixed(3)}</span>
          </span>
          <span>
            Moda ={" "}
            <span className="text-rose-600">
              {stats.modes.map((m) => m.toFixed(2)).join(" y ")}
            </span>
          </span>
          <span>
            Desvío estándar = <span className="text-storm">{stats.std.toFixed(3)}</span>
          </span>
          <span>
            Asimetría = <span className="text-storm">{stats.skew.toFixed(3)}</span>
          </span>
          <span>
            Media − mediana ={" "}
            <span className="text-storm">
              {(stats.mean - stats.median).toFixed(3)}
            </span>
          </span>
        </div>

        {/* Explicación en lenguaje llano */}
        <p className="rounded-card border border-gray-200 bg-white px-3 py-2 text-xs text-storm">
          {explanation}
        </p>
      </div>

      {caption && (
        <figcaption className="mt-2 text-center font-mono text-xs text-storm">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

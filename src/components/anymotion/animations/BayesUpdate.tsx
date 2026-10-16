"use client";

import { useEffect, useMemo, useState } from "react";
import { AnymotionStage } from "../AnymotionStage";

// ---------------------------------------------------------------------------
// Teorema de Bayes como actualización de una creencia.
// Todo determinista: sin Math.random(). Población fija de N = 1000 personas.
// ---------------------------------------------------------------------------

const N = 1000;

interface BayesUpdateProps {
  caption: string;
}

// Helpers de formato.
function pct(x: number): string {
  return `${x.toFixed(1)}%`;
}

export function BayesUpdate({ caption }: BayesUpdateProps) {
  // Controles del alumno.
  const [prevalence, setPrevalence] = useState<number>(5); // % base de enfermedad
  const [sensitivity, setSensitivity] = useState<number>(90); // % sensibilidad
  const [specificity, setSpecificity] = useState<number>(90); // % especificidad

  // Paso actual de la partición (0 = inicio, 1..4 = pasos).
  const [step, setStep] = useState<number>(0);

  // Si cambia algún parámetro, se reinicia la partición para que el alumno
  // vuelva a recorrerla con los nuevos números.
  useEffect(() => {
    setStep(0);
  }, [prevalence, sensitivity, specificity]);

  // Conteos derivados (deterministas).
  const counts = useMemo(() => {
    const sick = Math.round((N * prevalence) / 100);
    const healthy = N - sick;
    const tp = Math.round((sick * sensitivity) / 100);
    const fp = Math.round((healthy * (100 - specificity)) / 100);
    const totalPos = tp + fp;
    const posterior = totalPos > 0 ? (tp / totalPos) * 100 : 0;
    const fn = sick - tp;
    const tn = healthy - fp;
    return { sick, healthy, tp, fp, totalPos, posterior, fn, tn };
  }, [prevalence, sensitivity, specificity]);

  const { sick, healthy, tp, fp, totalPos, posterior, fn, tn } = counts;

  // Texto explicativo del paso actual, en lenguaje llano.
  const stepText = useMemo(() => {
    switch (step) {
      case 1:
        return `De ${N} personas, ${sick} tienen la enfermedad (prevalencia ${prevalence}%).`;
      case 2:
        return `De esas ${sick} enfermas, el test detecta ${tp} (sensibilidad ${sensitivity}%).`;
      case 3:
        return `Pero también marca positivo a ${fp} personas sanas (especificidad ${specificity}% implica ${100 - specificity}% de falsos positivos).`;
      case 4:
        return `Entonces, de ${totalPos} positivos, solo ${tp} son verdaderos: la probabilidad real de estar enfermo tras un positivo es ${pct(posterior)}.`;
      default:
        return `Pulsa «Siguiente paso» para recorrer cómo se actualiza la creencia.`;
    }
  }, [step, sick, tp, fp, totalPos, posterior, prevalence, sensitivity, specificity]);

  const advance = () => {
    setStep((s) => (s >= 4 ? 4 : s + 1));
  };

  const reset = () => setStep(0);

  // Geometría del SVG (viewBox 800 x 450, 16:9).
  const VB_W = 800;
  const VB_H = 450;
  const BAR_X = 120;
  const BAR_W = 560;
  const ROW_H = 46;

  // Anchos proporcionales a N (fila 1 y 2) para que las barras sean comparables.
  const wSick = (sick / N) * BAR_W;
  const wHealthy = (healthy / N) * BAR_W;
  const wTp = (tp / N) * BAR_W;
  const wFp = (fp / N) * BAR_W;
  const wNeg = ((N - totalPos) / N) * BAR_W;

  // Opacidades por paso (resaltado incremental).
  const op1 = step >= 1 ? 1 : 0.25;
  const op2 = step >= 2 ? 1 : 0.25;
  const op3 = step >= 3 ? 1 : 0.25;
  const op4 = step >= 4 ? 1 : 0.25;

  const posteriorColor = posterior >= 50 ? "#4ade80" : posterior >= 20 ? "#f59e0b" : "#f43f5e";

  return (
    <figure className="my-5">
      <AnymotionStage title="Teorema de Bayes: actualización de la creencia">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="h-full w-full bg-[#0a0a0a]"
          role="img"
          aria-label="Actualización bayesiana de la creencia sobre la enfermedad tras un test positivo"
        >
          {/* Título */}
          <text
            x={VB_W / 2}
            y={30}
            textAnchor="middle"
            fill="white"
            fontSize={16}
            fontFamily="sans-serif"
            fontWeight={700}
            opacity={0.94}
          >
            Teorema de Bayes — actualizar la creencia
          </text>
          <text
            x={VB_W / 2}
            y={50}
            textAnchor="middle"
            fill="#45dcc6"
            fontSize={11.5}
            fontFamily="monospace"
            opacity={0.9}
          >
            P(enfermedad | positivo) = {pct(posterior)}
          </text>

          {/* Fila 1: prevalencia */}
          <text x={BAR_X} y={76} fill="white" fontSize={12} fontFamily="sans-serif" fontWeight={700} opacity={op1}>
            1) Prevalencia (base)
          </text>
          <rect
            x={BAR_X}
            y={84}
            width={BAR_W}
            height={ROW_H}
            rx={10}
            fill="rgba(255,255,255,0.06)"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth={1}
            opacity={op1}
          />
          <rect
            x={BAR_X}
            y={84}
            width={wSick}
            height={ROW_H}
            rx={10}
            fill="#f43f5e"
            fillOpacity={0.75}
            opacity={op1}
          />
          <rect
            x={BAR_X + wSick}
            y={84}
            width={wHealthy}
            height={ROW_H}
            rx={10}
            fill="#38bdf8"
            fillOpacity={0.45}
            opacity={op1}
          />
          <text x={BAR_X + wSick / 2} y={84 + ROW_H / 2 + 4} textAnchor="middle" fill="white" fontSize={11} fontFamily="monospace" fontWeight={700} opacity={op1}>
            Enfermos {sick}
          </text>
          <text x={BAR_X + wSick + wHealthy / 2} y={84 + ROW_H / 2 + 4} textAnchor="middle" fill="white" fontSize={11} fontFamily="monospace" opacity={op1}>
            Sanos {healthy}
          </text>

          {/* Fila 2: positivos del test */}
          <text x={BAR_X} y={156} fill="white" fontSize={12} fontFamily="sans-serif" fontWeight={700} opacity={op2 < 1 && step < 2 ? 0.35 : 1}>
            2) Resultados del test (positivos)
          </text>
          <rect
            x={BAR_X}
            y={164}
            width={BAR_W}
            height={ROW_H}
            rx={10}
            fill="rgba(255,255,255,0.06)"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth={1}
            opacity={step >= 2 ? 1 : 0.25}
          />
          {/* TP */}
          <rect
            x={BAR_X}
            y={164}
            width={step >= 2 ? wTp : 0}
            height={ROW_H}
            rx={10}
            fill="#4ade80"
            fillOpacity={0.75}
            opacity={op2}
          />
          {/* FP */}
          <rect
            x={BAR_X + wTp}
            y={164}
            width={step >= 3 ? wFp : 0}
            height={ROW_H}
            rx={10}
            fill="#f59e0b"
            fillOpacity={0.75}
            opacity={op3}
          />
          {/* resto negativos */}
          <rect
            x={BAR_X + wTp + wFp}
            y={164}
            width={wNeg}
            height={ROW_H}
            rx={10}
            fill="#6b7280"
            fillOpacity={0.35}
            opacity={step >= 2 ? 0.6 : 0.2}
          />
          {step >= 2 && (
            <text x={BAR_X + wTp / 2} y={164 + ROW_H / 2 + 4} textAnchor="middle" fill="#0a0a0a" fontSize={11} fontFamily="monospace" fontWeight={700}>
              TP {tp}
            </text>
          )}
          {step >= 3 && (
            <text x={BAR_X + wTp + wFp / 2} y={164 + ROW_H / 2 + 4} textAnchor="middle" fill="#0a0a0a" fontSize={11} fontFamily="monospace" fontWeight={700}>
              FP {fp}
            </text>
          )}

          {/* Fila 3: posterior */}
          <text x={BAR_X} y={236} fill="white" fontSize={12} fontFamily="sans-serif" fontWeight={700} opacity={op4}>
            3) Creencia actualizada
          </text>
          <rect
            x={BAR_X}
            y={244}
            width={BAR_W}
            height={ROW_H}
            rx={10}
            fill="rgba(255,255,255,0.06)"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth={1}
            opacity={op4}
          />
          <rect
            x={BAR_X}
            y={244}
            width={step >= 4 ? (posterior / 100) * BAR_W : 0}
            height={ROW_H}
            rx={10}
            fill={posteriorColor}
            fillOpacity={0.8}
            opacity={op4}
          />
          {step >= 4 && (
            <text x={BAR_X + (posterior / 100) * BAR_W / 2} y={244 + ROW_H / 2 + 4} textAnchor="middle" fill="#0a0a0a" fontSize={11} fontFamily="monospace" fontWeight={700}>
              {tp} verdaderos
            </text>
          )}
          <text
            x={BAR_X + BAR_W + 12}
            y={244 + ROW_H / 2 + 4}
            fill="white"
            fontSize={13}
            fontFamily="monospace"
            fontWeight={700}
            opacity={op4}
          >
            {pct(posterior)}
          </text>

          {/* Detalle numérico lateral */}
          <g fontFamily="monospace" fontSize={11} fill="white" opacity={0.85}>
            <text x={BAR_X} y={316}>Enfermos (TP+FN) = {sick} (TP {tp} + FN {fn})</text>
            <text x={BAR_X} y={336}>Sanos (TN+FP) = {healthy} (TN {tn} + FP {fp})</text>
            <text x={BAR_X} y={356}>Positivos totales = TP {tp} + FP {fp} = {totalPos}</text>
            <text x={BAR_X} y={376} fill="#45dcc6" fontWeight={700}>
              Posterior = {tp} / {totalPos} = {pct(posterior)}
            </text>
          </g>

          {/* Pie */}
          <text
            x={VB_W / 2}
            y={VB_H - 18}
            textAnchor="middle"
            fill="rgba(255,255,255,0.6)"
            fontSize={10.5}
            fontFamily="monospace"
          >
            Avanza paso a paso para ver cómo la prevalencia se actualiza con la evidencia del test
          </text>
        </svg>
      </AnymotionStage>

      {/* Controles */}
      <div
        role="group"
        aria-label="Controles de la actualización bayesiana"
        className="mt-2 flex flex-col gap-3 rounded-card border border-white/10 bg-surface-card px-4 py-3 text-storm"
      >
        {/* Deslizadores */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor="bayes-prevalence" className="font-mono text-xs whitespace-nowrap text-storm">
              Prevalencia{" "}
              <span className="font-semibold text-mint">{prevalence}%</span>
            </label>
            <input
              id="bayes-prevalence"
              type="range"
              min={1}
              max={50}
              step={1}
              value={prevalence}
              onChange={(e) => setPrevalence(Number(e.target.value))}
              className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-gray-200 accent-mint"
              aria-label="Prevalencia de la enfermedad"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor="bayes-sensitivity" className="font-mono text-xs whitespace-nowrap text-storm">
              Sensibilidad{" "}
              <span className="font-semibold text-mint">{sensitivity}%</span>
            </label>
            <input
              id="bayes-sensitivity"
              type="range"
              min={50}
              max={100}
              step={1}
              value={sensitivity}
              onChange={(e) => setSensitivity(Number(e.target.value))}
              className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-gray-200 accent-mint"
              aria-label="Sensibilidad del test"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor="bayes-specificity" className="font-mono text-xs whitespace-nowrap text-storm">
              Especificidad{" "}
              <span className="font-semibold text-mint">{specificity}%</span>
            </label>
            <input
              id="bayes-specificity"
              type="range"
              min={50}
              max={100}
              step={1}
              value={specificity}
              onChange={(e) => setSpecificity(Number(e.target.value))}
              className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-gray-200 accent-mint"
              aria-label="Especificidad del test"
            />
          </div>
        </div>

        {/* Botón de paso */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={advance}
            disabled={step >= 4}
            className="min-h-11 rounded-full border border-mint bg-mint/15 px-4 py-1.5 text-xs font-semibold text-mint transition-colors hover:bg-mint/25 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 motion-reduce:transition-none"
            aria-label="Avanzar al siguiente paso de la partición"
          >
            {step === 0 ? "Siguiente paso" : step >= 4 ? "Completado" : "Siguiente paso"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="min-h-11 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-storm transition-colors hover:border-mint/60 hover:text-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 motion-reduce:transition-none"
            aria-label="Reiniciar la partición"
          >
            Reiniciar
          </button>
          <span className="font-mono text-xs tabular-nums text-storm">
            Paso {step} / 4
          </span>
        </div>

        {/* Texto explicativo del paso actual */}
        <div
          aria-live="polite"
          className="rounded-card border border-gray-200 bg-white px-3 py-2 text-sm text-ink"
        >
          {stepText}
        </div>

        {/* Lectura numérica viva */}
        <div
          aria-live="polite"
          className="grid grid-cols-2 gap-x-4 gap-y-1 rounded-card border border-gray-200 bg-white px-3 py-2 font-mono text-xs text-storm sm:grid-cols-4"
        >
          <span>Prevalencia = {prevalence}%</span>
          <span>Sensibilidad = {sensitivity}%</span>
          <span>Especificidad = {specificity}%</span>
          <span>Enfermos = {sick}</span>
          <span>TP = {tp}</span>
          <span>FP = {fp}</span>
          <span>Positivos = {totalPos}</span>
          <span className="font-bold text-mint">Posterior = {pct(posterior)}</span>
        </div>
      </div>

      {/* La trampa clásica */}
      <div
        role="group"
        aria-label="La trampa del test perfecto"
        className="mt-2 rounded-card border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-storm"
      >
        <p className="font-mono text-xs font-semibold text-amber-300">
          La trampa clásica
        </p>
        <p className="mt-1 text-sm text-ink">
          Un test con {sensitivity}% de sensibilidad NO significa {sensitivity}% de probabilidad de estar enfermo.
          La probabilidad real depende también de la prevalencia y de los falsos positivos.
        </p>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex-1">
            <div className="mb-1 flex justify-between font-mono text-[10px] text-storm">
              <span>Creencia ingenua (sensibilidad)</span>
              <span>{sensitivity}%</span>
            </div>
            <div className="h-2 rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-amber-400"
                style={{ width: `${sensitivity}%` }}
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="mb-1 flex justify-between font-mono text-[10px] text-storm">
              <span>Probabilidad real (posterior)</span>
              <span>{pct(posterior)}</span>
            </div>
            <div className="h-2 rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-mint"
                style={{ width: `${Math.min(100, posterior)}%` }}
              />
            </div>
          </div>
        </div>
        <p className="mt-2 text-xs text-storm">
          Con prevalencia baja, incluso un test bueno genera muchos falsos positivos: la mayoría de los positivos no está enferma.
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

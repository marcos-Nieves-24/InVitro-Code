"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  PlayCircle,
  ArrowLeft,
  ArrowRight,
  Brain,
  Database,
  MemoryStick,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

const STEPS = ["Concepto", "Visualización", "Laboratorio", "Desafío"];

const PyodideRunner = dynamic(
  () => import("@/components/editor/PyodideRunner"),
  { ssr: false },
);

const DEFAULT_CODE = `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_absolute_error

# Datos de ejemplo: contenido de alcohol y calidad percibida
alcohol = np.array([8.8, 9.1, 9.6, 10.2, 10.8, 11.3, 11.9, 12.4, 9.4, 10.6])
quality = np.array([4.5, 5.0, 5.4, 5.8, 6.2, 6.5, 6.9, 7.2, 5.1, 6.0])

# 1. Preparar variables
X = alcohol.reshape(-1, 1)
y = quality

# 2. Entrenar modelo de Regresión Lineal
model = LinearRegression()
model.fit(X, y)

# 3. Evaluar rendimiento
pred = model.predict(X)
print(f"R2: {r2_score(y, pred):.2f}")
print(f"MAE: {mean_absolute_error(y, pred):.2f}")
print(f"Pendiente: {model.coef_[0]:.3f}")`;

export interface LabMissionProps {
  /** Real level derived from total XP (REQ-UP-03). */
  level: number;
  /** Real rank name for the level (D10, shared rankTitle). */
  rankName: string;
  /** Real current mission label (next incomplete lesson). */
  missionLabel: string;
  /**
   * Real persisted progress percent, or `null` when no real run exists
   * (honest empty state, REQ-UP-04 / D1).
   */
  progressPercent: number | null;
  /** Total lessons in the mission's module (real module metadata). */
  lessonTotal: number;
  /** Completed lessons in the mission's module (real progress rows). */
  completedLessonCount: number;
}

export function LabMission({
  level,
  rankName,
  missionLabel,
  progressPercent,
  lessonTotal,
  completedLessonCount,
}: LabMissionProps) {
  const [step, setStep] = useState(2);

  return (
    <div className="space-y-8">
      {/* Mission intro */}
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">
            Nivel {level} - {rankName}
          </p>
          <h2 className="flex items-center gap-3 font-display text-3xl font-extrabold text-deep-navy md:text-4xl">
            {missionLabel}
            <PlayCircle className="h-8 w-8 text-primary" />
          </h2>
          <p className="text-lg text-outline">
            Aprenderás qué es un modelo de Machine Learning entrenando tu
            primer modelo de Regresión Lineal para predecir la calidad del
            vino.
          </p>
        </div>
        {progressPercent !== null ? (
          <div className="rounded-xl border border-surface-container bg-white p-2 shadow-sm">
            <p className="text-center text-[10px] font-bold text-outline">
              Progreso
            </p>
            <p className="text-center text-sm font-black text-primary">
              {progressPercent}%
            </p>
          </div>
        ) : (
          <div className="max-w-[200px] rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              Sin progreso registrado
            </p>
            <p className="mt-1 text-[10px] leading-relaxed text-on-surface-variant">
              Ejecutá el código para ver tu progreso real.
            </p>
          </div>
        )}
      </div>

      {/* Steps nav */}
      <div className="flex flex-wrap items-center gap-4 border-b border-surface-container pb-1">
        <div className="flex flex-wrap gap-2">
          {STEPS.map((label, i) => {
            const active = i === step;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setStep(i)}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm transition-colors ${
                  active
                    ? "font-bold text-primary"
                    : "font-semibold text-outline hover:text-deep-navy"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                    active
                      ? "bg-primary text-white"
                      : "border border-outline text-outline"
                  }`}
                >
                  {i + 1}
                </span>
                {label}
                {active && (
                  <span className="absolute inset-x-0 bottom-[-2px] h-0.5 rounded bg-primary" />
                )}
              </button>
            );
          })}
        </div>
        {completedLessonCount > 0 && (
          <span className="ml-auto rounded-full bg-surface-container px-3 py-1 text-[10px] font-bold text-on-surface-variant">
            {completedLessonCount} de {lessonTotal} lecciones del módulo
          </span>
        )}
      </div>

      {/* Step content */}
      {step === 0 && (
        <div className="glass-card space-y-6 rounded-xl p-6">
          <h3 className="font-display text-xl font-bold">¿Qué es un modelo?</h3>
          <p className="text-on-surface-variant">
            Un modelo aprende patrones de los datos para hacer predicciones
            sobre nuevos casos. En esta misión entrenarás un modelo de
            <strong> Regresión Lineal </strong> que relaciona el contenido de
            alcohol del vino con su calidad percibida.
          </p>
          <div className="flex items-center justify-between rounded-2xl bg-surface-container-low px-4 py-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <span className="text-[9px] font-bold uppercase text-outline">
                Datos
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-surface-container-highest" />
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <MemoryStick className="h-5 w-5 text-primary" />
              </div>
              <span className="text-[9px] font-bold uppercase text-outline">
                Modelo
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-surface-container-highest" />
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <span className="text-[9px] font-bold uppercase text-outline">
                Predicción
              </span>
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="glass-card flex h-[500px] flex-col rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-sm font-bold">Visualización del modelo</h3>
          </div>
          <div className="relative mb-4 flex-1">
            <div className="absolute inset-0 flex flex-col justify-between">
              <div className="relative h-full w-full border-b-2 border-l-2 border-surface-container">
                <div className="absolute bottom-1/4 left-0 h-[2px] w-full origin-bottom-left -rotate-[22deg] bg-success-green" />
                <div className="absolute left-[15%] top-[20%] h-2 w-2 rounded-full bg-xp-blue/40" />
                <div className="absolute left-[25%] top-[40%] h-2 w-2 rounded-full bg-xp-blue/60" />
                <div className="absolute left-[45%] top-[45%] h-2 w-2 rounded-full bg-primary/80" />
                <div className="absolute left-[65%] top-[60%] h-2 w-2 rounded-full bg-xp-blue/50" />
                <div className="absolute left-[80%] top-[10%] h-2 w-2 rounded-full bg-xp-blue/30" />
                <div className="absolute left-[20%] top-[55%] h-2 w-2 rounded-full bg-primary/70" />
                <div className="absolute left-[70%] top-[30%] h-2 w-2 rounded-full bg-xp-blue/40" />
              </div>
            </div>
          </div>
          <p className="text-xs text-outline">
            Ejecutá el código del laboratorio para ver las métricas reales de
            tu modelo.
          </p>
        </div>
      )}

      {step === 2 && (
        <div className="rounded-xl border border-white/10 bg-deep-navy p-4 shadow-2xl">
          <div className="mb-3 flex items-center justify-between border-b border-white/10 px-2 py-2">
            <div className="flex items-center gap-2">
              <TerminalDot />
              <span className="font-mono text-xs text-white/70">
                wine_model.py
              </span>
            </div>
          </div>
          <PyodideRunner defaultValue={DEFAULT_CODE} height="360px" />
        </div>
      )}

      {step === 3 && (
        <div className="glass-card space-y-6 rounded-xl p-6">
          <h3 className="font-display text-xl font-bold">El Desafío Final</h3>
          <p className="text-on-surface-variant">
            Modificá el código del laboratorio para lograr un <strong>R²
            superior a 0.80</strong>. Consejo: probá agregar una segunda
            variable (por ejemplo, <code className="rounded bg-surface-container px-1.5 py-0.5 font-mono text-xs">acidez</code>)
            al modelo.
          </p>
          <ul className="space-y-3">
            {[
              "Agregá una segunda variable explicativa.",
              "Compará el R² antes y después.",
              "¿Qué variable parece predecir mejor la calidad?",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-success-green" />
                <span className="text-sm font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* InVitro-Code bot feedback — honest, no fabricated success (D1) */}
      {step >= 2 && (
        <div className="flex items-center gap-6 rounded-xl border border-primary/20 bg-primary/[0.03] p-6">
          <div className="relative">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/20 bg-white shadow-lg">
              <Brain className="h-7 w-7 text-primary" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-success-green" />
          </div>
          <div>
            <p className="mb-1 font-bold text-primary">Consejo del laboratorio</p>
            <p className="text-sm leading-relaxed text-on-surface-variant">
              Ejecutá el código y observá tus propios resultados: el R² y el
              MAE que aparezcan en la consola son los reales de tu modelo.
            </p>
          </div>
        </div>
      )}

      {/* Navigation footer */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="flex items-center gap-2 rounded-xl border border-surface-container px-6 py-3 text-sm font-bold transition-colors hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" /> Anterior
        </button>
        <button
          type="button"
          onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}
          disabled={step === STEPS.length - 1}
          className="flex items-center gap-3 rounded-xl bg-primary px-8 py-3 font-bold text-white shadow-lg transition-all hover:bg-primary/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {step === STEPS.length - 1 ? "Misión completada" : "Continuar"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function TerminalDot() {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary text-white">
      <span className="h-2.5 w-2.5 rounded-[3px] bg-white" />
    </span>
  );
}

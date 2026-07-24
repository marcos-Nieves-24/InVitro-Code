"use client"

import { useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Target, TrendingUp } from "lucide-react";

interface Metrics {
  accuracy: number;
  true_positives: number;
  true_negatives: number;
  false_positives: number;
  false_negatives: number;
  total: number;
}

interface DatasetJson {
  min_radius: number;
  max_radius: number;
  n_samples: number;
  feature_name: string;
  radius_values: number[];
  labels: number[];
  best_accuracy: number;
  best_threshold: number;
}

interface ThresholdLabProps {
  moduleSlug: string;
  lessonSlug: string;
  blockId: string;
}

const DATA_URL = "/data/threshold-lab.json";

function computeMetrics(threshold: number, radiusValues: number[], labels: number[]): Metrics {
  let tp = 0, tn = 0, fp = 0, fn = 0;
  for (let i = 0; i < radiusValues.length; i++) {
    const pred = radiusValues[i] > threshold ? 1 : 0;
    const actual = labels[i];
    if (pred === 1 && actual === 1) tp++;
    else if (pred === 0 && actual === 0) tn++;
    else if (pred === 1 && actual === 0) fp++;
    else fn++;
  }
  const total = tp + tn + fp + fn;
  return {
    accuracy: (tp + tn) / total,
    true_positives: tp,
    true_negatives: tn,
    false_positives: fp,
    false_negatives: fn,
    total,
  };
}

export function ThresholdLab({
  moduleSlug,
  lessonSlug,
  blockId,
}: ThresholdLabProps) {
  const [dataset, setDataset] = useState<DatasetJson | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [threshold, setThreshold] = useState<number>(0);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);
  const [prevBestAccuracy, setPrevBestAccuracy] = useState<number>(0);

  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch pre-computed dataset on mount
  useEffect(() => {
    setFetchLoading(true);
    fetch(DATA_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<DatasetJson>;
      })
      .then((data) => {
        setDataset(data);
        setThreshold(data.min_radius);
        // Compute initial metrics at min_radius
        const initial = computeMetrics(data.min_radius, data.radius_values, data.labels);
        setMetrics(initial);
        setPrevBestAccuracy(data.best_accuracy);
        setFetchLoading(false);
      })
      .catch((err) => {
        setFetchError(err.message);
        setFetchLoading(false);
      });
  }, []);

  // Handle slider changes with debouncing
  const handleThresholdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newThreshold = Number(event.target.value);
    setThreshold(newThreshold);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      if (!dataset) return;

      const newMetrics = computeMetrics(newThreshold, dataset.radius_values, dataset.labels);
      setMetrics(newMetrics);

      // Update live best (might discover a better threshold than pre-computed
      // if we're using a non-pre-computed value, though with step=0.1 the
      // pre-computed best should be the true optimum)
      if (newMetrics.accuracy > prevBestAccuracy) {
        setPrevBestAccuracy(newMetrics.accuracy);
      }
    }, 80); // 80ms debounce — instant computation, just avoid too many renders
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Handle completion
  const handleComplete = async () => {
    if (!hasCompleted) {
      try {
        await fetch("/api/progress/reflection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            moduleSlug,
            lessonSlug,
            blockId,
          }),
        });
        setHasCompleted(true);
      } catch (error) {
        console.error("Error completing lab:", error);
      }
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 0.9) return "text-green-600 bg-green-50 border-green-200";
    if (accuracy >= 0.8) return "text-blue-600 bg-blue-50 border-blue-200";
    if (accuracy >= 0.7) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const formatAccuracy = (accuracy: number) => {
    return (accuracy * 100).toFixed(1) + "%";
  };

  const bestAccuracy = dataset?.best_accuracy ?? 0;
  const bestAccuracyThreshold = dataset?.best_threshold ?? 0;

  // --- Loading state ---

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos del laboratorio...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar el laboratorio</h3>
          <p className="text-gray-600 mb-4">{fetchError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Experimento de umbral de clasificación</h1>
        <p className="text-gray-600">
          Ajusta el umbral para clasificar muestras de {dataset?.feature_name || "feature"} como benignas (1) o malignas (0)
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
          <span>Datos pre-computados · scikit-learn (seed=42)</span>
        </div>
      </div>

      {/* Main lab content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Slider section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Slider card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="threshold-slider" className="text-sm font-medium text-gray-700">
                  Umbral (threshold)
                </label>
                <span className="text-lg font-mono font-bold text-gray-900">
                  {threshold.toFixed(2)}
                </span>
              </div>

              <input
                id="threshold-slider"
                type="range"
                min={dataset?.min_radius ?? 0}
                max={dataset?.max_radius ?? 1}
                step={0.1}
                value={threshold}
                onChange={handleThresholdChange}
                className="w-full accent-blue-600"
              />

              <div className="flex justify-between text-xs text-gray-500">
                <span>{dataset?.min_radius.toFixed(1)}</span>
                <span>{dataset?.max_radius.toFixed(1)}</span>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Target className="h-4 w-4" />
                  <span>
                    Total de muestras: {dataset?.n_samples || "--"} (0=maligno, 1=benigno)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics grid */}
          {metrics && (
            <div className="space-y-4">
              {/* Current accuracy card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Accuracy actual</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`rounded-lg border p-4 text-center transition-all ${getAccuracyColor(metrics.accuracy)}`}
                  >
                    <div className="text-2xl font-bold">{formatAccuracy(metrics.accuracy)}</div>
                    <div className="text-xs mt-1 opacity-75">Accuracy</div>
                  </div>

                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {metrics.true_positives + metrics.false_positives}
                    </div>
                    <div className="text-xs mt-1 text-gray-600">Total predicto 1</div>
                  </div>

                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {metrics.true_negatives + metrics.false_negatives}
                    </div>
                    <div className="text-xs mt-1 text-gray-600">Total predicto 0</div>
                  </div>
                </div>

                {metrics.accuracy > prevBestAccuracy && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        ¡Nuevo récord de accuracy: {formatAccuracy(metrics.accuracy)}!
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confusion matrix style cards */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Matriz de confusión</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Verdadero positivo (verdadero benigno)</div>
                      <div className="text-2xl font-bold text-green-700">
                        TP: {metrics.true_positives}
                      </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Falso negativo (verdadero maligno, predicto 0)</div>
                      <div className="text-2xl font-bold text-red-700">
                        FN: {metrics.false_negatives}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Falso positivo (verdadero maligno, predicto 1)</div>
                      <div className="text-2xl font-bold text-red-700">
                        FP: {metrics.false_positives}
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Verdadero negativo (verdadero maligno, predicto 0)</div>
                      <div className="text-2xl font-bold text-green-700">
                        TN: {metrics.true_negatives}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Best accuracy card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Mejor accuracy</h3>
            </div>

            {bestAccuracy > 0 ? (
              <div className="space-y-3">
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-3xl font-bold text-blue-700">
                    {formatAccuracy(bestAccuracy)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    en umbral {bestAccuracyThreshold.toFixed(2)}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setThreshold(bestAccuracyThreshold);
                    if (dataset) {
                      const m = computeMetrics(bestAccuracyThreshold, dataset.radius_values, dataset.labels);
                      setMetrics(m);
                    }
                  }}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Ir al mejor umbral
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-sm">Pre-computado desde scikit-learn</div>
              </div>
            )}
          </div>

          {/* Best possible accuracy card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Ver resultado</h3>

            <p className="text-sm text-gray-600 mb-4">
              El mejor umbral posible para este dataset con 200 evaluaciones:
            </p>

            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-4">
              {bestAccuracy > 0 ? (
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatAccuracy(bestAccuracy)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    en umbral {bestAccuracyThreshold.toFixed(2)}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <div className="text-sm">Pre-computado desde scikit-learn</div>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setThreshold(bestAccuracyThreshold);
                if (dataset) {
                  const m = computeMetrics(bestAccuracyThreshold, dataset.radius_values, dataset.labels);
                  setMetrics(m);
                }
              }}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Ir al mejor umbral
            </button>
          </div>

          {/* Complete button */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <button
              onClick={handleComplete}
              disabled={hasCompleted}
              className={`w-full px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                hasCompleted
                  ? "bg-green-100 text-green-800 cursor-default"
                  : "bg-teal-600 text-white hover:bg-teal-700 active:scale-95"
              }`}
            >
              {hasCompleted ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Actividad completada
                </span>
              ) : (
                "Completar"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

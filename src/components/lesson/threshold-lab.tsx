"use client"

import { useEffect, useRef, useState } from "react";
import { usePyodideWorker } from "@/hooks/usePyodideWorker";
import { AlertCircle, CheckCircle2, Target, TrendingUp } from "lucide-react";

interface Metrics {
  accuracy: number;
  true_positives: number;
  true_negatives: number;
  false_positives: number;
  false_negatives: number;
  total: number;
}

interface DatasetInfo {
  min_radius: number;
  max_radius: number;
  n_samples: number;
  feature_name: string;
}

interface BestAccuracy {
  best_accuracy: number;
  best_threshold: number;
}

interface ThresholdLabProps {
  moduleSlug: string;
  lessonSlug: string;
  blockId: string;
}

export function ThresholdLab({
  moduleSlug,
  lessonSlug,
  blockId,
}: ThresholdLabProps) {
  const { status, run, error } = usePyodideWorker();
  const [datasetInfo, setDatasetInfo] = useState<DatasetInfo | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [bestAccuracy, setBestAccuracy] = useState<number>(0);
  const [bestAccuracyThreshold, setBestAccuracyThreshold] = useState<number>(0);
  const [threshold, setThreshold] = useState<number>(0);
  const [isCalculatingBest, setIsCalculatingBest] = useState<boolean>(false);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);

  const bestAccuracyFetchedRef = useRef(false);
  const loadingSetupRef = useRef(false);
  const loadingBestRef = useRef(false);
  const requestIdRef = useRef<number>(0);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousRequestIdRef = useRef<number>(0);
  const sliderChangeCountRef = useRef<number>(0);

  // Initial setup - load dataset
  useEffect(() => {
    if (!loadingSetupRef.current && status === "ready") {
      loadingSetupRef.current = true;

      const setupCode = `from sklearn.datasets import load_breast_cancer
import numpy as np, json

data = load_breast_cancer()
X = data.data[:, 0]  # mean radius feature
y = data.target       # 0=malignant, 1=benign

# Guardar en globales del worker para reuso
globals()['__X_radius'] = X
globals()['__y_true'] = y

json.dumps({
  "min_radius": float(X.min()),
  "max_radius": float(X.max()),
  "n_samples": len(y),
  "feature_name": "mean radius"
})`;

      run(setupCode)
        .then((result) => {
          const info = JSON.parse(result as string) as DatasetInfo;
          setDatasetInfo(info);
          setThreshold(info.min_radius);
        })
        .catch((err) => {
          console.error("Error setting up dataset:", err);
        });
    }
  }, [status, run]);

  // Load best accuracy (only once)
  useEffect(() => {
    if (!loadingBestRef.current && status === "ready" && datasetInfo && !bestAccuracyFetchedRef.current) {
      loadingBestRef.current = true;
      bestAccuracyFetchedRef.current = true;

      const bestAccuracyCode = `import numpy as np, json
X = __X_radius
y = __y_true

best_acc = 0
best_th = 0
thresholds = np.linspace(float(X.min()), float(X.max()), 200)
for t in thresholds:
    acc = ((X > t).astype(int) == y).mean()
    if acc > best_acc:
        best_acc = acc
        best_th = t
json.dumps({"best_accuracy": round(float(best_acc), 4), "best_threshold": round(float(best_th), 2)})`;

      run(bestAccuracyCode)
        .then((result) => {
          const best = JSON.parse(result as string) as BestAccuracy;
          setBestAccuracy(best.best_accuracy);
          setBestAccuracyThreshold(best.best_threshold);
        })
        .catch((err) => {
          console.error("Error calculating best accuracy:", err);
        });
    }
  }, [status, run, datasetInfo]);

  // Handle slider changes with debouncing and requestId tracking
  const handleThresholdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newThreshold = Number(event.target.value);

    // Cleanup previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Increment requestId for this slider change
    requestIdRef.current += 1;
    const currentRequestId = requestIdRef.current;

    // Increment change count for each slider change (even if debounced)
    sliderChangeCountRef.current += 1;

    // Set new timeout for debounced execution
    debounceTimeoutRef.current = setTimeout(() => {
      const pythonCode = `import numpy as np, json

X = __X_radius
y = __y_true
threshold = ${newThreshold}

preds = (X > threshold).astype(int)
acc = (preds == y).mean()
tp = ((preds == 1) & (y == 1)).sum()
tn = ((preds == 0) & (y == 0)).sum()
fp = ((preds == 1) & (y == 0)).sum()
fn = ((preds == 0) & (y == 1)).sum()

json.dumps({
  "accuracy": round(float(acc), 4),
  "true_positives": int(tp),
  "true_negatives": int(tn),
  "false_positives": int(fp),
  "false_negatives": int(fn),
  "total": int(len(y))
})`;

      run(pythonCode, { threshold: newThreshold })
        .then((result) => {
          const latestId = requestIdRef.current;
          if (currentRequestId !== latestId) {
            console.log(`[threshold-lab] DISCARD response ${currentRequestId} — latest is ${latestId}`);
            return;
          }
          previousRequestIdRef.current = currentRequestId;

          const newMetrics = JSON.parse(result as string) as Metrics;
          setMetrics(newMetrics);

          // Update best accuracy if this is better
          if (newMetrics.accuracy > bestAccuracy) {
            setBestAccuracy(newMetrics.accuracy);
          }
        })
        .catch((err) => {
          console.error("Error calculating metrics:", err);
        });
    }, 200);
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

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos de乳腺肿瘤...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar el laboratorio</h3>
          <p className="text-gray-600 mb-4">{error || "Ocurrió un error inesperado"}</p>
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
          Ajusta el umbral para clasificar muestras de {datasetInfo?.feature_name || "feature"} como benignas (1) o malignas (0)
        </p>
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
                min={datasetInfo?.min_radius ?? 0}
                max={datasetInfo?.max_radius ?? 1}
                step={0.1}
                value={threshold}
                onChange={handleThresholdChange}
                className="w-full accent-blue-600"
                disabled={!datasetInfo}
              />

              <div className="flex justify-between text-xs text-gray-500">
                <span>{datasetInfo?.min_radius.toFixed(1)}</span>
                <span>{datasetInfo?.max_radius.toFixed(1)}</span>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Target className="h-4 w-4" />
                  <span>
                    Total de muestras: {datasetInfo?.n_samples || "--"} (0=maligno, 1=benigno)
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

                {metrics.accuracy > bestAccuracy && (
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
                  onClick={() => setThreshold(bestAccuracyThreshold)}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Ir al mejor umbral
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <div className="text-sm">Calculando mejor accuracy...</div>
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
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400 mx-auto mb-2"></div>
                  <div className="text-xs">Evaluando 200 umbrales...</div>
                </div>
              )}
            </div>

            <button
              onClick={() => setThreshold(bestAccuracyThreshold)}
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
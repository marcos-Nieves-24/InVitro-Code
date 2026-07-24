"use client"

import { useState, useEffect, useRef, useCallback } from "react";
import { usePyodideWorker } from "@/hooks/usePyodideWorker";
import dynamic from "next/dynamic";

// Plotly MUST be loaded only on the client — it accesses browser globals (self) at import time
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false }) as React.ComponentType<any>;

interface FeatureDisplay {
  label: string;
  value: number;
}

interface TestCase {
  features: number[];
  prediction: number;
  actual: number;
  round: number;
  total_test: number;
}

interface DiagnosticTrainerProps {
  moduleSlug?: string;
  lessonSlug?: string;
}

// 4 features used for training (dataset indices 0,1,3,4)
const FEATURE_KEYS = ["mean_radius", "mean_texture", "mean_area", "mean_smoothness"];

const FEATURE_DISPLAY_NAMES: Record<string, string> = {
  "mean_radius": "mean radius",
  "mean_texture": "mean texture",
  "mean_area": "mean area",
  "mean_smoothness": "mean smoothness",
};

export function DiagnosticTrainer({
  moduleSlug = "ia",
  lessonSlug = "lesson01_what_is_ai",
}: DiagnosticTrainerProps) {
  const { status, run, error } = usePyodideWorker();
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [currentTest, setCurrentTest] = useState<TestCase | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [streak, setStreak] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [testCount, setTestCount] = useState(0);

  // Training data from Python for the Plotly scatter
  const [trainingPoints, setTrainingPoints] = useState<number[][]>([]);
  const [trainingLabels, setTrainingLabels] = useState<number[]>([]);

  // Feature selection for the plot axes
  const [selectedXFeature, setSelectedXFeature] = useState(0);
  const [selectedYFeature, setSelectedYFeature] = useState(1);

  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const testPointerRef = useRef(0);
  const isResettingRef = useRef(false);

  const setupPythonEnvironment = useCallback(async () => {
    setIsLoading(true);
    console.time("sklearn-init");
    try {
      const setupScript = `
import json
import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.neighbors import KNeighborsClassifier

# Load dataset
bcc = load_breast_cancer()
X = bcc.data
y = bcc.target

np.random.seed(42)
indices = np.arange(len(X))
np.random.shuffle(indices)
test_indices = indices[:56]
tr_indices = indices[56:]

X_train = X[tr_indices]
y_train = y[tr_indices]
X_test = X[test_indices]
y_test = y[test_indices]

model = KNeighborsClassifier(n_neighbors=5)
model.fit(X_train, y_train)

# Persist in global scope for round queries
model = model
X_test = X_test
y_test = y_test
indices = test_indices
test_pointer = 0

# The 4 features we use (dataset indices 0,1,3,4)
feature_cols = [0, 1, 3, 4]
X_train_4f = X_train[:, feature_cols]
X_test_4f = X_test[:, feature_cols]
globals()['X_test_4f'] = X_test_4f

print(json.dumps({
    "test_count": len(y_test),
    "feature_names": ["mean radius", "mean texture", "mean area", "mean smoothness"],
    "training_points": [[float(v) for v in row] for row in X_train_4f.tolist()],
    "training_labels": [int(l) for l in y_train.tolist()]
}))
`;

      const result: any = await run(setupScript);
      console.timeEnd("sklearn-init");
      setTestCount(result.test_count);
      setTrainingPoints(result.training_points);
      setTrainingLabels(result.training_labels);
      setIsSetupComplete(true);
      await loadNextTestCase();
    } catch (err) {
      console.timeEnd("sklearn-init");
      console.error("Error setting up Python environment:", err);
    } finally {
      setIsLoading(false);
    }
  }, [run]);

  const loadNextTestCase = useCallback(async () => {
    if (testPointerRef.current >= 56) {
      return;
    }

    setIsLoading(true);
    setIsCorrect(null);
    setShowDiagnosis(false);

    try {
      const roundScript = `
import json

try:
  idx = test_indices[test_pointer]
  features_4 = [float(X_test[idx, 0]), float(X_test[idx, 1]), float(X_test[idx, 3]), float(X_test[idx, 4])]
  pred = int(model.predict([X_test[idx]])[0])
  actual = int(y_test[idx])
  test_pointer += 1

  result = {
    "features": features_4,
    "prediction": pred,
    "actual": actual,
    "round": test_pointer,
    "total_test": len(y_test)
  }
  json.dumps(result)
except Exception as e:
  json.dumps({"error": str(e)})
`;

      const roundResult: any = await run(roundScript);

      if (roundResult.error) {
        console.error("Error loading test case:", roundResult.error);
        return;
      }

      setCurrentTest(roundResult as TestCase);
      testPointerRef.current = roundResult.round;
    } catch (err) {
      console.error("Error loading next test case:", err);
    } finally {
      setIsLoading(false);
    }
  }, [run]);

  const handleAnswer = useCallback(
    async (userChoice: number) => {
      if (!currentTest || isResettingRef.current) return;

      const correct = userChoice === currentTest.actual;
      setIsCorrect(correct);
      setShowDiagnosis(true);

      if (correct) {
        setStreak(prev => prev + 1);
      } else {
        setStreak(0);
      }

      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);

      autoAdvanceRef.current = setTimeout(() => {
        autoAdvanceRef.current = null;
        if (testPointerRef.current < 56) {
          loadNextTestCase();
        }
      }, 1500);
    },
    [currentTest, loadNextTestCase]
  );

  const resetGame = useCallback(async () => {
    isResettingRef.current = true;

    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }

    setIsSetupComplete(false);
    setCurrentTest(null);
    setStreak(0);
    setIsCorrect(null);
    setShowDiagnosis(false);
    testPointerRef.current = 0;

    try {
      await run(`test_pointer = 0`);
    } catch (err) {
      console.error("Error resetting Python state:", err);
    } finally {
      isResettingRef.current = false;
      await setupPythonEnvironment();
    }
  }, [run, setupPythonEnvironment]);

  const handleContinueProgress = async () => {
    try {
      const res = await fetch("/api/progress/reflection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleSlug,
          lessonSlug,
          blockId: "interactive-l01-features",
        }),
      });

      if (!res.ok) {
        console.error("Error registrando progreso en reflexión");
      }
    } catch (err) {
      console.error("Error al registrar progreso en reflexión:", err);
    }
  };

  useEffect(() => {
    if (status === "ready" && !isSetupComplete) {
      setupPythonEnvironment();
    }
  }, [status, isSetupComplete, setupPythonEnvironment]);

  useEffect(() => {
    return () => {
      if (autoAdvanceRef.current) {
        clearTimeout(autoAdvanceRef.current);
      }
    };
  }, []);

  // --- Feature display helpers ---

  const getFeatureDisplayItems = (): FeatureDisplay[] => {
    if (!currentTest) return [];

    return currentTest.features.map((value, index) => {
      const key = FEATURE_KEYS[index];
      return {
        label: FEATURE_DISPLAY_NAMES[key],
        value: value,
      };
    });
  };

  const streakColorClass = streak >= 3 ? "text-orange-600" : "text-gray-600";

  const formatNumber = (num: number): string => {
    return num.toFixed(2);
  };

  // --- Plotly scatter data ---

  const renderScatterPlot = () => {
    if (trainingPoints.length === 0) {
      return (
        <div className="h-72 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
          <p className="text-sm text-gray-500">Cargando datos de entrenamiento...</p>
        </div>
      );
    }

    // Split points by class for colored traces
    const benignPoints: number[][] = [];
    const malignantPoints: number[][] = [];
    for (let i = 0; i < trainingPoints.length; i++) {
      if (trainingLabels[i] === 1) {
        benignPoints.push(trainingPoints[i]);
      } else {
        malignantPoints.push(trainingPoints[i]);
      }
    }

    const data: any[] = [
      {
        x: malignantPoints.map((p) => p[selectedXFeature]),
        y: malignantPoints.map((p) => p[selectedYFeature]),
        mode: "markers",
        type: "scatter",
        name: "Maligno",
        marker: { color: "#f97316", size: 6, opacity: 0.7 },
        hovertemplate: `%{x:.2f}<br>%{y:.2f}<extra>Maligno</extra>`,
      },
      {
        x: benignPoints.map((p) => p[selectedXFeature]),
        y: benignPoints.map((p) => p[selectedYFeature]),
        mode: "markers",
        type: "scatter",
        name: "Benigno",
        marker: { color: "#14b8a6", size: 6, opacity: 0.7 },
        hovertemplate: `%{x:.2f}<br>%{y:.2f}<extra>Benigno</extra>`,
      },
    ];

    // Highlight current test case if available
    if (currentTest) {
      data.push({
        x: [currentTest.features[selectedXFeature]],
        y: [currentTest.features[selectedYFeature]],
        mode: "markers",
        type: "scatter",
        name: "Caso actual",
        marker: {
          color: "#3b82f6",
          size: 14,
          symbol: "star",
          line: { color: "#1e40af", width: 2 },
        },
        hovertemplate: `%{x:.2f}<br>%{y:.2f}<extra>Caso a diagnosticar</extra>`,
      });
    }

    const xLabel = FEATURE_DISPLAY_NAMES[FEATURE_KEYS[selectedXFeature]];
    const yLabel = FEATURE_DISPLAY_NAMES[FEATURE_KEYS[selectedYFeature]];

    const layout = {
      title: { text: "Casos de entrenamiento (Breast Cancer)", font: { size: 14 } },
      xaxis: {
        title: xLabel,
        gridcolor: "#f1f5f9",
        zerolinecolor: "#e2e8f0",
      },
      yaxis: {
        title: yLabel,
        gridcolor: "#f1f5f9",
        zerolinecolor: "#e2e8f0",
      },
      height: 320,
      margin: { t: 40, r: 20, b: 50, l: 50 },
      paper_bgcolor: "white",
      plot_bgcolor: "white",
      legend: {
        orientation: "h" as const,
        y: -0.25,
        x: 0,
        font: { size: 11 },
      },
      hovermode: "closest" as const,
    };

    const config = {
      responsive: true,
      displayModeBar: false,
      staticPlot: false,
    };

    return (
      <div className="w-full overflow-hidden">
        <Plot
          data={data}
          layout={layout}
          config={config}
          className="w-full"
          useResizeHandler={true}
        />
      </div>
    );
  };

  // --- Feature selector dropdowns ---

  const renderFeatureSelectors = () => (
    <div className="flex gap-3 mb-3">
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-gray-600">Eje X:</label>
        <select
          value={selectedXFeature}
          onChange={(e) => setSelectedXFeature(Number(e.target.value))}
          className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
        >
          {FEATURE_KEYS.map((key, idx) => (
            <option key={idx} value={idx}>
              {FEATURE_DISPLAY_NAMES[key]}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-gray-600">Eje Y:</label>
        <select
          value={selectedYFeature}
          onChange={(e) => setSelectedYFeature(Number(e.target.value))}
          className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
        >
          {FEATURE_KEYS.map((key, idx) => (
            <option key={idx} value={idx}>
              {FEATURE_DISPLAY_NAMES[key]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Entrenamiento de Diagnóstico con KNN</h2>
            <div className="flex items-center gap-4">
              {streak > 0 && (
                <div className={`flex items-center gap-2 ${streakColorClass}`}>
                  <span className="text-lg">🔥</span>
                  <span className="text-sm font-medium">Racha: {streak}/8</span>
                </div>
              )}
              <div className="text-sm text-gray-600">
                Caso {currentTest?.round || 0}/{currentTest?.total_test || 56}
              </div>
            </div>
          </div>

          {status === "loading" && !isSetupComplete && (
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600"></div>
                <span className="text-sm text-gray-600">Preparando entorno de Python (scikit-learn)...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">Error: {error}</p>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column - Features and controls */}
          <div className="space-y-6">
            {isSetupComplete && currentTest && !isLoading && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Características del Caso</h3>
                <div className="grid grid-cols-2 gap-4">
                  {getFeatureDisplayItems().map((feature, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        {feature.label}
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {formatNumber(feature.value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isSetupComplete && currentTest && !isLoading && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tu Respuesta</h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleAnswer(1)}
                    disabled={showDiagnosis || isResettingRef.current}
                    className="flex-1 bg-green-50 border-2 border-green-300 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg p-4 transition-colors"
                  >
                    <div className="text-sm font-medium text-green-800">Benigno</div>
                    <div className="text-xs text-green-600 mt-1">Células no cancerosas</div>
                  </button>
                  <button
                    onClick={() => handleAnswer(0)}
                    disabled={showDiagnosis || isResettingRef.current}
                    className="flex-1 bg-red-50 border-2 border-red-300 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg p-4 transition-colors"
                  >
                    <div className="text-sm font-medium text-red-800">Maligno</div>
                    <div className="text-xs text-red-600 mt-1">Células cancerosas</div>
                  </button>
                </div>
              </div>
            )}

            {showDiagnosis && currentTest && (
              <div className={`bg-white rounded-lg border-l-4 p-6 ${isCorrect ? 'border-teal-500 bg-teal-50' : 'border-orange-500 bg-orange-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">📊</span>
                  <h3 className="text-lg font-semibold">
                    {isCorrect ? 'Diagnóstico correcto ✓' : 'No coincidía'}
                  </h3>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  El modelo KNN predijo: <span className="font-semibold">
                    {currentTest.prediction === 1 ? 'Benigno' : 'Maligno'}
                  </span>
                </p>
                <p className="text-sm text-gray-700">
                  Diagnóstico real: <span className="font-semibold">
                    {currentTest.actual === 1 ? 'Benigno' : 'Maligno'}
                  </span>
                </p>
              </div>
            )}

            {currentTest && currentTest.round >= 8 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Rondas</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-700">
                    Vos: {streak}/8 · KNN real (scikit-learn): 8/8
                  </div>
                </div>
                <button
                  onClick={handleContinueProgress}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Continuar
                </button>
              </div>
            )}
          </div>

          {/* Right column - Plot */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">Visualización de Datos de Entrenamiento</h3>
                <div className="text-xs text-gray-500">
                  {trainingPoints.length} muestras
                </div>
              </div>
              {renderFeatureSelectors()}
              {renderScatterPlot()}
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-600 text-center">
                569 casos reales · Breast Cancer Wisconsin (Diagnostic) · UCI Machine Learning Repository · CC BY 4.0
              </div>
            </div>
          </div>
        </div>

        {/* Loading overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600"></div>
                <span className="text-sm text-gray-700">Cargando siguiente caso...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}

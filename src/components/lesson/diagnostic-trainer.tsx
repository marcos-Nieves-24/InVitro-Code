"use client"

import { useState, useEffect, useRef, useCallback } from "react";
import { usePyodideWorker } from "@/hooks/usePyodideWorker";
import Plot from "react-plotly.js";

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

const FEATURE_NAMES = {
  0: "mean_radius",
  1: "mean_texture", 
  3: "mean_area",
  4: "mean_smoothness"
};

const FEATURE_DISPLAY_NAMES = {
  "mean_radius": "mean radius",
  "mean_texture": "mean texture",
  "mean_area": "mean area",
  "mean_smoothness": "mean smoothness"
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
  const [featureNames, setFeatureNames] = useState<string[]>([]);
  const [selectedXFeature, setSelectedXFeature] = useState("mean_radius");
  const [selectedYFeature, setSelectedYFeature] = useState("mean_texture");
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const testPointerRef = useRef(0);
  const isResettingRef = useRef(false);

  // Known features used for training (indices 0,1,3,4)
  const [xFeatureIndex, setXFeatureIndex] = useState(0);
  const [yFeatureIndex, setYFeatureIndex] = useState(1);

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

# Barajar indices y asegurar consistencia entre ejecuciones aleatorias
np.random.seed(42)  # Para reproducibilidad
indices = np.arange(len(X))
np.random.shuffle(indices)
test_indices = indices[:56]  # 10% test
tr_indices = indices[56:]    # 90% train

# Separar datos
X_train = X[tr_indices]
y_train = y[tr_indices]
X_test = X[test_indices]
y_test = y[test_indices]

# Entrenar modelo KNN
model = KNeighborsClassifier(n_neighbors=5)
model.fit(X_train, y_train)

# Guardar todo en scope global
model = model
X_test = X_test
y_test = y_test
indices = test_indices
test_pointer = 0
X_train_2d = X_train[:, [0, 1]]  # SOLO 2 features (0=mean_radius, 1=mean_texture) para graficar

# Mostrar resultado
print(json.dumps({
    "test_count": len(y_test),
    "feature_names": ["mean radius", "mean texture", "mean area", "mean smoothness"]
}))
`;

      const result: any = await run(setupScript);
      console.timeEnd("sklearn-init");
      setTestCount(result.test_count);
      setFeatureNames(result.feature_names);
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
      return; // All tests completed
    }

    setIsLoading(true);
    setIsCorrect(null);
    setShowDiagnosis(false);

    try {
      const roundScript = `
import json

# Usa variables globales
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
`

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

      // Clear any pending auto-advance
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
      // Reset test_pointer in Python global scope
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

  const FEATURE_DISPLAY_KEYS = ["mean_radius", "mean_texture", "mean_area", "mean_smoothness"];

  const getFeatureDisplayItems = (): FeatureDisplay[] => {
    if (!currentTest) return [];
    
    return currentTest.features.map((value, index) => {
      const key = FEATURE_DISPLAY_KEYS[index] as keyof typeof FEATURE_DISPLAY_NAMES;
      return {
        label: FEATURE_DISPLAY_NAMES[key],
        value: value
      };
    });
  };

  const streakColorClass = streak >= 3 ? "text-orange-600" : "text-gray-600";

  const getStrokeColor = () => {
    if (!currentTest || !showDiagnosis) return "transparent";
    return isCorrect ? "#14b8a6" : "#f97316";
  };

  const formatNumber = (num: number): string => {
    return num.toFixed(2);
  };

  const renderPlot = () => {
    // This would be implemented with actual data from Python
    // For now, return a placeholder
    return (
      <div className="h-64 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
        <p className="text-gray-500">Plotly visualization would appear here</p>
      </div>
    );
  };

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
                    disabled={!showDiagnosis || isResettingRef.current}
                    className="flex-1 bg-green-50 border-2 border-green-300 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg p-4 transition-colors"
                  >
                    <div className="text-sm font-medium text-green-800">Benigno</div>
                    <div className="text-xs text-green-600 mt-1">Células no cancerosas</div>
                  </button>
                  <button
                    onClick={() => handleAnswer(0)}
                    disabled={!showDiagnosis || isResettingRef.current}
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
                    Vos: {streak}/8 · KNN real (scikit-learn): Y/8
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Visualización de Datos de Entrenamiento</h3>
                <div className="text-xs text-gray-500">
                  Eje X: {selectedXFeature} | Eje Y: {selectedYFeature}
                </div>
              </div>
              {renderPlot()}
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
    );;
}

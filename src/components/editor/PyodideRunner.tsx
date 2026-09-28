"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import CodeEditor from "./CodeEditor";
import OutputPanel from "./OutputPanel";
import VisualizationPanel from "./VisualizationPanel";
import { pyodideWorker, PyodideOfflineError } from "@/lib/pyodide-worker";

interface TestCase {
  input: string;
  expectedOutput: string;
  note: string;
}

interface Exercise {
  lessonId: string;
  testCases: TestCase[];
}

interface PyodideRunnerProps {
  defaultValue?: string;
  exercise?: Exercise;
  height?: string;
  language?: string;
  /** Server-side flag (FEATURE_FLAG_CERTIFY), forwarded to OutputPanel (REQ-CER-04). */
  certifyEnabled?: boolean;
}

export default function PyodideRunner({
  defaultValue = "# Escribe tu código aquí...\nprint('Hola Mundo!')",
  exercise,
  height,
  language,
  certifyEnabled,
}: PyodideRunnerProps) {
  const [isWorkerReady, setIsWorkerReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  // Bumped by the retry button and by the browser's "online" event to
  // re-run the init effect (the shared worker singleton is not re-creatable
  // from the outside, only resettable).
  const [initAttempt, setInitAttempt] = useState(0);
  const [code, setCode] = useState(defaultValue);
  const [output, setOutput] = useState<string[]>([]);
  const [figures, setFigures] = useState<string[]>([]);
  const [validationResult, setValidationResult] = useState<
    "" | "valid" | "invalid"
  >("");

  // Initialise the SHARED Pyodide worker (one per session, not per block).
  useEffect(() => {
    let cancelled = false;

    const markOffline = () => {
      if (cancelled) return;
      setIsOffline(true);
      setIsWorkerReady(false);
      setIsLoading(false);
    };

    const handleOffline = () => markOffline();

    const handleOnline = () => {
      if (cancelled) return;
      setIsOffline(false);
      // Connectivity came back — retry the handshake automatically.
      setInitAttempt((n) => n + 1);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    setIsLoading(true);

    // Pyodide is streamed from a CDN, so an offline run can never succeed.
    // Bail out immediately instead of waiting out the 120s init timeout.
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      markOffline();
    } else {
      pyodideWorker
        .ready()
        .then(() => {
          if (cancelled) return;
          setIsWorkerReady(true);
          setIsLoading(false);
        })
        .catch((err) => {
          if (cancelled) return;
          setIsLoading(false);
          if (err instanceof PyodideOfflineError) {
            setIsOffline(true);
            return;
          }
          const msg = err instanceof Error ? err.message : String(err);
          setOutput((prev) => [...prev, `Error del worker: ${msg}`]);
        });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [initAttempt]);

  const handleRetry = useCallback(() => {
    pyodideWorker.reset();
    setIsWorkerReady(false);
    setOutput([]);
    setInitAttempt((n) => n + 1);
  }, []);

  const handleRun = useCallback(async () => {
    if (!isWorkerReady || isRunning) return;

    setIsRunning(true);
    setOutput([]);
    setFigures([]);
    setValidationResult("");

    try {
      const result = await pyodideWorker.run(code);
      if (result.output !== undefined && result.output !== null && result.output !== "") {
        setOutput((prev) => [...prev, String(result.output)]);
      }
      if (Array.isArray(result.figures)) {
        setFigures(result.figures);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setOutput((prev) => [...prev, `Error: ${msg}`]);
    } finally {
      setIsRunning(false);
    }
  }, [isWorkerReady, isRunning, code]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setValidationResult("");
  };

  const clearOutput = () => {
    setOutput([]);
    setValidationResult("");
  };

  // Validate once output changes and exercise is defined
  useEffect(() => {
    if (!exercise || isRunning || output.length === 0) return;

    const lastOutput = output[output.length - 1] || "";
    const allPassed = exercise.testCases.every((tc) =>
      lastOutput.includes(tc.expectedOutput),
    );

    setValidationResult(allPassed ? "valid" : "invalid");
  }, [output, exercise, isRunning]);

  return (
    <div className="my-6">
      {isOffline && (
        <div
          role="status"
          className="mb-4 flex flex-col gap-3 rounded-lg border border-orange-900/50 bg-orange-950/30 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-sm font-medium text-orange-400">
              Sin conexión — los labs requieren red
            </p>
            <p className="mt-1 text-xs text-orange-300/80">
              Pyodide se descarga desde internet. Vuelve a conectarte y
              reintenta para continuar.
            </p>
          </div>
          <button
            type="button"
            onClick={handleRetry}
            className="shrink-0 rounded-md bg-[#1d1d1d] px-3 py-1.5 text-[12px] font-medium text-[#e6edf3] transition-colors hover:bg-[#2a2a2a]"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Editor + Output side by side on desktop */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        {/* Editor */}
        <div className="flex-1">
          <CodeEditor
            value={code}
            onChange={handleCodeChange}
            height={height || "400px"}
            language={language || "python"}
            onRun={handleRun}
            isRunning={isRunning}
            isWorkerReady={isWorkerReady}
            status={
              isOffline
                ? "Sin conexión"
                : isLoading
                  ? "Cargando Pyodide…"
                  : isWorkerReady
                    ? "Listo"
                    : "Error al cargar"
            }
          />
        </div>

        {/* Output */}
        <div className="flex-1">
          <OutputPanel
            output={output}
            validationResult={validationResult}
            isRunning={isRunning}
            onClear={clearOutput}
            code={code}
            exercise={exercise}
            certifyEnabled={certifyEnabled}
          />
        </div>
      </div>

      {/* Visualization console — always visible so labs know it exists */}
      <VisualizationPanel figures={figures} isRunning={isRunning} />
    </div>
  );
}
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import CodeEditor from "./CodeEditor";
import OutputPanel from "./OutputPanel";
import { pyodideWorker } from "@/lib/pyodide-worker";

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
  const [code, setCode] = useState(defaultValue);
  const [output, setOutput] = useState<string[]>([]);
  const [validationResult, setValidationResult] = useState<
    "" | "valid" | "invalid"
  >("");

  // Initialise the SHARED Pyodide worker (one per session, not per block).
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
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
        const msg = err instanceof Error ? err.message : String(err);
        setOutput((prev) => [...prev, `Error del worker: ${msg}`]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRun = useCallback(async () => {
    if (!isWorkerReady || isRunning) return;

    setIsRunning(true);
    setOutput([]);
    setValidationResult("");

    try {
      const out = await pyodideWorker.run(code);
      if (out !== undefined && out !== null && out !== "") {
        setOutput((prev) => [...prev, String(out)]);
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
      {/* Status bar */}
      <div className="mb-4 flex items-center justify-between rounded-t-lg border border-b-0 border-gray-200 bg-gray-50 px-4 py-2">
        <span className="font-mono text-sm font-semibold text-gray-700">
          Python
        </span>
        <span className="text-xs text-gray-500">
          {isLoading
            ? "Cargando Pyodide..."
            : isWorkerReady
              ? "Listo"
              : "Error al cargar"}
        </span>
      </div>

      {/* Editor + Output side by side on desktop */}
      <div className="flex flex-col gap-0 lg:flex-row lg:gap-4">
        {/* Editor */}
        <div className="flex-1 lg:w-1/2">
          <CodeEditor
            value={code}
            onChange={handleCodeChange}
            height={height || "400px"}
            language={language || "python"}
            onRun={handleRun}
            isRunning={isRunning}
            isWorkerReady={isWorkerReady}
          />
        </div>

        {/* Output */}
        <div className="flex-1 lg:w-1/2">
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
    </div>
  );
}

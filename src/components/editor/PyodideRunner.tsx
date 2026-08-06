"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import CodeEditor from "./CodeEditor";
import OutputPanel from "./OutputPanel";

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
  const [worker, setWorker] = useState<Worker | null>(null);
  const [isWorkerReady, setIsWorkerReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [code, setCode] = useState(defaultValue);
  const [output, setOutput] = useState<string[]>([]);
  const [validationResult, setValidationResult] = useState<
    "" | "valid" | "invalid"
  >("");

  // Initialize worker
  useEffect(() => {
    const w = new Worker("/pyodide-worker.js");

    w.onmessage = (event) => {
      const { type, output: out, error } = event.data;

      if (type === "ready") {
        setIsWorkerReady(true);
        setIsLoading(false);
      } else if (type === "error") {
        setIsLoading(false);
        setOutput((prev) => [...prev, `Error del worker: ${error}`]);
      } else if (type === "result") {
        setIsRunning(false);
        setOutput((prev) => {
          const next = [...prev];
          if (out) next.push(out);
          if (error) next.push(`Error: ${error}`);
          return next;
        });
      }
    };

    w.onerror = (err) => {
      setIsLoading(false);
      setIsRunning(false);
      setOutput((prev) => [...prev, `Error del worker: ${err.message}`]);
    };

    w.postMessage({ type: "init" });
    setWorker(w);

    return () => w.terminate();
  }, []);

  const handleRun = useCallback(() => {
    if (!worker || !isWorkerReady || isRunning) return;

    setIsRunning(true);
    setOutput([]);
    setValidationResult("");

    worker.postMessage({ type: "runPython", code });
  }, [worker, isWorkerReady, isRunning, code]);

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

"use client";

import { useRef, useState } from "react";

interface OutputPanelProps {
  output: string[];
  validationResult: "" | "valid" | "invalid";
  isRunning: boolean;
  onClear: () => void;
  code?: string;
  exercise?: {
    testCases: Array<{ expectedOutput: string; note: string }>;
  };
}

type CertifyState = "idle" | "loading" | "passed" | "failed" | "unavailable";

export default function OutputPanel({
  output,
  validationResult,
  isRunning,
  onClear,
  code,
  exercise,
}: OutputPanelProps) {
  const outputRef = useRef<HTMLDivElement>(null);
  const [certifyState, setCertifyState] = useState<CertifyState>("idle");
  const [certifyMessage, setCertifyMessage] = useState("");

  const handleCertify = async () => {
    if (!code || certifyState === "loading") return;

    setCertifyState("loading");
    setCertifyMessage("");

    try {
      const res = await fetch("/api/certify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (data.certified) {
        setCertifyState("passed");
        setCertifyMessage(
          `¡Certificado! Pasaste los ${data.testsPassed ?? "?"} tests.`,
        );
      } else {
        setCertifyState("failed");
        setCertifyMessage(
          data.message ?? "No pasaste todos los tests — intentá de nuevo.",
        );
      }
    } catch {
      setCertifyState("unavailable");
      setCertifyMessage(
        "Certificación no disponible — intentá de nuevo más tarde.",
      );
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Consola de Salida
          </h3>
          <div className="flex items-center gap-2">
            {/* Estoy listo — only when client-side validation passed */}
            {validationResult === "valid" && (
              <button
                onClick={handleCertify}
                disabled={certifyState === "loading"}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  certifyState === "loading"
                    ? "bg-yellow-100 text-yellow-700 cursor-wait"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                {certifyState === "loading"
                  ? "Certificando..."
                  : "Estoy listo"}
              </button>
            )}

            <button
              onClick={onClear}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* Certification status */}
        {certifyState !== "idle" && (
          <div
            className={`mt-2 text-sm px-3 py-1.5 rounded ${
              certifyState === "loading"
                ? "bg-yellow-50 text-yellow-800"
                : certifyState === "passed"
                  ? "bg-green-50 text-green-800"
                  : certifyState === "failed"
                    ? "bg-red-50 text-red-800"
                    : "bg-gray-50 text-gray-600"
            }`}
          >
            {certifyState === "loading"
              ? "Ejecutando certificacion server-side..."
              : certifyState === "passed"
                ? `${certifyMessage}`
                : `${certifyMessage}`}
          </div>
        )}

        {exercise && (
          <div className="mt-2 text-sm text-gray-600">
            {exercise.testCases.length} test
            {exercise.testCases.length !== 1 ? "s" : ""}
            {" | "}Estado:{" "}
            <span
              className={`font-medium ${
                validationResult === "valid"
                  ? "text-green-600"
                  : validationResult === "invalid"
                    ? "text-red-600"
                    : "text-gray-600"
              }`}
            >
              {validationResult === "valid"
                ? "Validacion superada"
                : validationResult === "invalid"
                  ? "No superado"
                  : "En espera"}
            </span>
          </div>
        )}

        {/* Per-test-case hints when validation fails */}
        {exercise && validationResult === "invalid" && (
          <div className="mt-2 text-sm bg-orange-50 border border-orange-200 rounded p-2">
            <p className="font-medium text-orange-800 mb-1">
              Pistas
            </p>
            {exercise.testCases.map((tc, i) => (
              <p key={i} className="text-orange-700 text-xs ml-2">
                Test {i + 1}: {tc.note}
              </p>
            ))}
          </div>
        )}

        {isRunning && (
          <div className="mt-2 flex items-center gap-2">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600" />
            <span className="text-sm text-blue-600">Ejecutando...</span>
          </div>
        )}
      </div>

      {/* Output Content */}
      <div
        ref={outputRef}
        className="flex-1 overflow-auto p-4 font-mono text-sm bg-gray-900 text-gray-100"
        style={{ maxHeight: "400px" }}
      >
        {output.length === 0 ? (
          <div className="text-gray-500 text-center mt-8">
            La salida aparecerá aquí cuando ejecutes tu código.
            <br />
            <span className="text-xs">
              Usá "Ejecutar" para probar tu código
            </span>
          </div>
        ) : (
          output.map((line, i) => {
            const isLast = i === output.length - 1;
            const isError = line.startsWith("Error:");

            if (isLast && validationResult === "valid") {
              return (
                <div key={i} className="flex items-center gap-2 my-2">
                  <span className="text-green-400 text-lg font-bold">OK</span>
                  <span className="text-green-300 font-semibold bg-green-900/30 px-3 py-1 rounded-full">
                    Correcto — todos los tests pasaron
                  </span>
                </div>
              );
            }

            if (isLast && validationResult === "invalid") {
              return (
                <div key={i} className="flex items-center gap-2 my-2">
                  <span className="text-red-400 text-lg font-bold">X</span>
                  <span className="text-red-300 font-semibold bg-red-900/30 px-3 py-1 rounded-full">
                    No coincide con el test — intentá de nuevo
                  </span>
                </div>
              );
            }

            return (
              <div
                key={i}
                className={
                  isError
                    ? "text-red-400 bg-red-950/30 border-l-2 border-red-500 pl-3 py-1.5 rounded"
                    : "pl-3 py-1"
                }
              >
                {line}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

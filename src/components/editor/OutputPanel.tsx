"use client";

import { useRef, useState } from "react";
import { ConsoleFrame } from "./ConsoleFrame";

interface OutputPanelProps {
  output: string[];
  validationResult: "" | "valid" | "invalid";
  isRunning: boolean;
  onClear: () => void;
  code?: string;
  exercise?: {
    testCases: Array<{ expectedOutput: string; note: string }>;
  };
  /** Server-side flag (FEATURE_FLAG_CERTIFY), default off (REQ-CER-02/04). */
  certifyEnabled?: boolean;
}

type CertifyState = "idle" | "loading" | "passed" | "failed" | "unavailable";

export default function OutputPanel({
  output,
  validationResult,
  isRunning,
  onClear,
  code,
  exercise,
  certifyEnabled = false,
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
          data.message ?? "No pasaste todos los tests — intenta de nuevo.",
        );
      }
    } catch {
      setCertifyState("unavailable");
      setCertifyMessage(
        "Certificación no disponible — intenta de nuevo más tarde.",
      );
    }
  };

  return (
    <ConsoleFrame
      title="Consola de Salida"
      action={
        <>
          {/* Estoy listo — only when client-side validation passed AND flag on */}
          {validationResult === "valid" && certifyEnabled && (
            <button
              onClick={handleCertify}
              disabled={certifyState === "loading"}
              className={`rounded-md px-3 py-1 text-[12px] font-medium transition-colors ${
                certifyState === "loading"
                  ? "cursor-wait bg-yellow-900/30 text-yellow-400"
                  : "bg-[#27c93f] text-[#0a0a0a] hover:bg-[#3fb950]"
              }`}
            >
              {certifyState === "loading"
                ? "Certificando..."
                : "Estoy listo"}
            </button>
          )}

          <button
            onClick={onClear}
            className="rounded-md bg-[#1d1d1d] px-3 py-1 text-[12px] font-medium text-[#888] transition-colors hover:bg-[#2a2a2a] hover:text-white"
          >
            Limpiar
          </button>
        </>
      }
    >
      {/* Certification status */}
      {certifyState !== "idle" && (
        <div
          className={`border-b border-[#1d1d1d] px-4 py-2 text-sm ${
            certifyState === "loading"
              ? "bg-yellow-900/20 text-yellow-400"
              : certifyState === "passed"
                ? "bg-green-900/20 text-green-400"
                : certifyState === "failed"
                  ? "bg-red-950/40 text-red-400"
                  : "bg-[#111] text-[#888]"
          }`}
        >
          {certifyState === "loading"
            ? "Ejecutando certificacion server-side..."
            : `${certifyMessage}`}
        </div>
      )}

      {exercise && (
        <div className="border-b border-[#1d1d1d] px-4 py-2 text-sm text-[#888]">
          {exercise.testCases.length} test
          {exercise.testCases.length !== 1 ? "s" : ""}
          {" | "}Estado:{" "}
          <span
            className={`font-medium ${
              validationResult === "valid"
                ? "text-green-400"
                : validationResult === "invalid"
                  ? "text-red-400"
                  : "text-[#888]"
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
        <div className="mx-4 mt-4 rounded-md border border-orange-900/50 bg-orange-950/30 p-3">
          <p className="mb-1 font-medium text-orange-400">Pistas</p>
          {exercise.testCases.map((tc, i) => (
            <p key={i} className="ml-2 text-xs text-orange-300/80">
              Test {i + 1}: {tc.note}
            </p>
          ))}
        </div>
      )}

      {isRunning && (
        <div className="flex items-center gap-2 px-4 pt-4 text-sm text-[#888]">
          <div className="h-3 w-3 animate-spin rounded-full border-b-2 border-[#3fb950]" />
          <span>Ejecutando...</span>
        </div>
      )}

      {/* Output Content */}
      <div
        ref={outputRef}
        className="overflow-auto p-4 font-mono text-sm text-[#e6edf3]"
        style={{ minHeight: "200px", maxHeight: "600px" }}
      >
        {output.length === 0 ? (
          <div className="mt-8 text-center text-[#888]">
            La salida aparecerá aquí cuando ejecutes tu código.
            <br />
            <span className="text-xs">
              Usa "Ejecutar" para probar tu código
            </span>
          </div>
        ) : (
          output.map((line, i) => {
            const isLast = i === output.length - 1;
            const isError = line.startsWith("Error:");

            if (isLast && validationResult === "valid") {
              return (
                <div key={i} className="my-2 flex items-center gap-2">
                  <span className="text-lg font-bold text-green-400">OK</span>
                  <span className="rounded-full bg-green-900/30 px-3 py-1 font-semibold text-green-300">
                    Correcto — todos los tests pasaron
                  </span>
                </div>
              );
            }

            if (isLast && validationResult === "invalid") {
              return (
                <div key={i} className="my-2 flex items-center gap-2">
                  <span className="text-lg font-bold text-red-400">X</span>
                  <span className="rounded-full bg-red-900/30 px-3 py-1 font-semibold text-red-300">
                    No coincide con el test — intenta de nuevo
                  </span>
                </div>
              );
            }

            return (
              <div
                key={i}
                className={
                  isError
                    ? "rounded border-l-2 border-red-500 bg-red-950/30 py-1.5 pl-3 text-red-400"
                    : "py-1 pl-3"
                }
              >
                {line}
              </div>
            );
          })
        )}
      </div>
    </ConsoleFrame>
  );
}
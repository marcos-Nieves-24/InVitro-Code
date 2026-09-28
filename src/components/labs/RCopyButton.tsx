"use client";

import { useState } from "react";
import { FileCode } from "lucide-react";
import { SlideArrowButton } from "@/components/ui/SlideArrowButton";

interface RCopyButtonProps {
  mod: string;
  lesson: string;
  hasRScript: boolean;
}

export function RCopyButton({ mod, lesson, hasRScript }: RCopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  if (!hasRScript) return null;

  const handleCopy = async () => {
    setError(null);
    try {
      const res = await fetch(`/api/rscript/${mod}/${lesson}`);
      if (!res.ok) throw new Error("Error al obtener el código R");
      const code = await res.text();
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al copiar");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SlideArrowButton
        variant="primary"
        primaryColor="#059669"
        size="sm"
        text={copied ? "Copiado" : "Copiar código R"}
        onClick={handleCopy}
      />

      <SlideArrowButton
        variant="secondary"
        size="sm"
        text="Ejecutar en navegador"
        onClick={() => setShowModal(true)}
      />

      {error && <p className="text-xs text-red-600">{error}</p>}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-w-lg rounded-xl bg-surface-card p-6 shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <FileCode className="h-6 w-6 text-emerald-600" />
              <h3 className="text-lg font-semibold">Ejecutar código R</h3>
            </div>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <p className="mb-1 font-medium text-gray-900">
                  Opción 1: En el navegador (sin instalar nada)
                </p>
                <ol className="ml-2 list-decimal list-inside space-y-1">
                  <li>Copia el código con el botón anterior</li>
                  <li>
                    Abre{" "}
                    <a
                      href="https://www.datanovia.com/apps/webr-console"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 underline"
                    >
                      Datanovia R Console
                    </a>
                  </li>
                  <li>Pega el código y presiona Enter</li>
                </ol>
              </div>
              <div>
                <p className="mb-1 font-medium text-gray-900">
                  Opción 2: En RStudio (instalado localmente)
                </p>
                <ol className="ml-2 list-decimal list-inside space-y-1">
                  <li>Copia el código con el botón anterior</li>
                  <li>Abre RStudio → File → New File → R Script</li>
                  <li>Pega el código y presiona Ctrl+Enter</li>
                </ol>
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-xs text-amber-800">
                  <strong>Nota:</strong> Los paquetes se instalan
                  automáticamente en la consola web. En RStudio, ejecuta{" "}
                  <code className="rounded bg-amber-100 px-1">
                    install.packages(c("tidyverse", "tidymodels",
                    "randomForest"))
                  </code>{" "}
                  la primera vez.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              type="button"
              className="mt-6 w-full rounded-btn bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

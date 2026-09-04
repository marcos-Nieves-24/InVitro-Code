"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, FileCode } from "lucide-react";

interface RCopyButtonProps {
  mod: string;
  lesson: string;
  hasRScript: boolean;
}

const actionClass =
  "inline-flex items-center gap-2 rounded-btn bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:pointer-events-none disabled:opacity-50";

const linkClass =
  "inline-flex items-center gap-2 rounded-btn bg-slate-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600";

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
      <button onClick={handleCopy} type="button" className={actionClass}>
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            Copiado
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copiar código R
          </>
        )}
      </button>

      <button
        onClick={() => setShowModal(true)}
        type="button"
        className={linkClass}
      >
        <ExternalLink className="h-4 w-4" />
        Ejecutar en navegador
      </button>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-w-lg rounded-xl bg-white p-6 shadow-xl">
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

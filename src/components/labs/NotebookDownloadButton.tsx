"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

interface NotebookDownloadButtonProps {
  mod: string;
  lesson: string;
  disabled: boolean;
}

/**
 * REQ-ASGN-03: Fetches the notebook from /api/notebook/[module]/[lesson]
 * and triggers a browser download. Disabled/hidden when the notebook file
 * is absent.
 */
export function NotebookDownloadButton({
  mod,
  lesson,
  disabled,
}: NotebookDownloadButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/notebook/${mod}/${lesson}`);
      if (!res.ok) {
        throw new Error(
          res.status === 404
            ? "No se encontró el notebook para esta lección."
            : "Error al descargar el notebook.",
        );
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "notebook.ipynb";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error inesperado al descargar.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (disabled) return null;

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={handleDownload}
        disabled={loading}
        type="button"
        className="inline-flex items-center gap-2 rounded-btn bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm shadow-brand/20 transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:pointer-events-none disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Descargando...
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Descargar notebook
          </>
        )}
      </button>
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SlideArrowButton } from "@/components/ui/SlideArrowButton";

interface NotebookActionsProps {
  mod: string;
  lesson: string;
  hasNotebook: boolean;
}

/** Base URL for the Colab "open from GitHub" flow (public repo). */
const COLAB_BASE =
  "https://colab.research.google.com/github/marcos-Nieves-24/InVitro-Code/blob/main";

/**
 * REQ-NB-01/02/03/04: Shared notebook actions — Download (GET
 * /api/notebook/[module]/[lesson] + blob) and "Abrir en Colab" link derived
 * from the module/lesson slugs. Renders nothing when `hasNotebook` is false.
 */
export function NotebookActions({
  mod,
  lesson,
  hasNotebook,
}: NotebookActionsProps) {
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

  // REQ-NB-02: hidden when the notebook file is absent
  if (!hasNotebook) return null;

  const colabHref = `${COLAB_BASE}/src/content/modules/${mod}/lessons/${lesson}/notebook.ipynb`;

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <SlideArrowButton
          variant="primary"
          primaryColor="#059669"
          size="sm"
          text={loading ? "Descargando..." : "Descargar notebook"}
          onClick={handleDownload}
          disabled={loading}
          aria-busy={loading}
        />

        <Button
          variant="secondary"
          size="sm"
          href={colabHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink className="h-4 w-4" />
          Abrir en Colab
        </Button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
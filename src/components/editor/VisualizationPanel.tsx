"use client";

import dynamic from "next/dynamic";
import { ConsoleFrame } from "./ConsoleFrame";

// Plotly MUST be loaded only on the client — it accesses browser globals (self) at import time
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
}) as React.ComponentType<any>;

interface VisualizationPanelProps {
  figures: string[];
  isRunning?: boolean;
}

export default function VisualizationPanel({
  figures,
  isRunning = false,
}: VisualizationPanelProps) {
  return (
    <ConsoleFrame title="Consola de Visualización">
      {figures.length === 0 ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 px-4 py-12 text-center">
          {isRunning ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-[#3fb950]" />
              <span className="text-sm text-[#888]">Ejecutando...</span>
            </>
          ) : (
            <span className="text-sm text-[#888]">
              La visualización aparecerá aquí cuando ejecutes código que genere
              gráficos.
            </span>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4 p-4">
          {figures.map((figureJson, i) => {
            try {
              const parsed = JSON.parse(figureJson);
              return (
                <div key={i} className="bg-[#0a0a0a]">
                  <p className="mb-2 font-mono text-[11px] text-[#888]">
                    Gráfico {i + 1}
                  </p>
                  <Plot
                    figure={parsed}
                    style={{ width: "100%" }}
                    useResizeHandler
                  />
                </div>
              );
            } catch {
              // Skip invalid figure JSON
              return null;
            }
          })}
        </div>
      )}
    </ConsoleFrame>
  );
}
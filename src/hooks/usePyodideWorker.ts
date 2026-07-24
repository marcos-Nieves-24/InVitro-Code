"use client";

import { useState, useCallback, useRef } from "react";
import { pyodideWorker } from "@/lib/pyodide-worker";

export type PyodideStatus = "idle" | "loading" | "ready" | "error";

interface UsePyodideWorkerReturn {
  status: PyodideStatus;
  run: (code: string, context?: Record<string, unknown>) => Promise<unknown>;
  error: string | null;
}

/**
 * Singleton React hook over the Pyodide worker.
 *
 * - Shared worker instance (one per session regardless of how many components
 *   mount this hook).
 * - Status transitions: idle → loading (on first run()) → ready → error.
 * - The worker is NOT created on mount — only on first run() call.
 */
export function usePyodideWorker(): UsePyodideWorkerReturn {
  const [status, setStatus] = useState<PyodideStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const firstRunRef = useRef(true);

  const run = useCallback(
    async (code: string, context?: Record<string, unknown>) => {
      if (firstRunRef.current) {
        firstRunRef.current = false;
        setStatus("loading");
      }

      try {
        const result = await pyodideWorker.run(code, context);
        // Once a run succeeds, we know sklearn/Pyodide is ready
        setStatus("ready");
        setError(null);
        return result;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
        setStatus("error");
        throw err;
      }
    },
    [],
  );

  return { status, run, error };
}

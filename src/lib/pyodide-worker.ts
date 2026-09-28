/**
 * Singleton wrapper around the Pyodide Web Worker.
 *
 * Manages one worker instance per page session with:
 * - Lazy initialisation (worker is created on first usage)
 * - Request queuing (calls made before the worker is ready are queued)
 * - Request IDs for race-condition safety
 * - Typed run() interface
 * - Self-healing: a failed init or a dead worker is never cached, so the next
 *   ready()/run() rebuilds it
 */

let workerInstance: Worker | null = null;
let readyPromise: Promise<void> | null = null;
let requestCounter = 0;

/** Cold Pyodide + numpy is ~10 MB from a CDN; this is the realistic worst case. */
const INIT_TIMEOUT_MS = 120_000;

const pending = new Map<
  number,
  { resolve: (v: PyodideRunResult) => void; reject: (e: Error) => void }
>();

export interface PyodideRunResult {
  output: string | null;
  figures: string[];
}

/**
 * Raised when the browser reports no connectivity. Pyodide is streamed from a
 * CDN, so a run cannot start offline — failing fast beats waiting out the
 * full init timeout with an error that never arrives.
 */
export class PyodideOfflineError extends Error {
  constructor() {
    super(
      "Sin conexión a internet: Pyodide se descarga desde la red, así que el runner no puede arrancar.",
    );
    this.name = "PyodideOfflineError";
  }
}

function isOffline(): boolean {
  return typeof navigator !== "undefined" && navigator.onLine === false;
}

/** `onerror` receives an ErrorEvent at runtime but a bare Event in some paths. */
function describeWorkerError(event: Event | ErrorEvent): string {
  if (typeof event === "object" && event !== null && "message" in event) {
    const { message } = event as { message?: unknown };
    if (typeof message === "string" && message.length > 0) return message;
  }
  return "El worker de Pyodide terminó inesperadamente.";
}

function failAllPending(message: string): void {
  for (const [, entry] of pending) {
    entry.reject(new Error(message));
  }
  pending.clear();
}

function createWorker(): Worker {
  const w = new Worker("/pyodide-worker.js");

  w.onmessage = (event) => {
    const { requestId, output, error, figures } = event.data;
    if (requestId === undefined) return; // system message, not for us

    const entry = pending.get(requestId);
    if (!entry) return; // stale/out-of-order response
    pending.delete(requestId);

    if (error) {
      entry.reject(new Error(error));
    } else {
      entry.resolve({ output, figures: Array.isArray(figures) ? figures : [] });
    }
  };

  w.onmessageerror = () => {
    discardWorker(w, "Respuesta ilegible del worker de Pyodide.");
  };

  w.onerror = (event) => {
    // A dead worker poisons every later call: postMessage becomes a no-op and
    // the cached readyPromise never settles. Tear it down so the next
    // ready()/run() recreates it.
    discardWorker(w, describeWorkerError(event));
  };

  return w;
}

/** Rejects everything in flight and forgets the worker so it can be rebuilt. */
function discardWorker(w: Worker, message: string): void {
  failAllPending(message);
  if (workerInstance === w) {
    workerInstance = null;
    readyPromise = null;
  }
  w.terminate();
}

function getWorker(): Worker {
  if (!workerInstance) {
    workerInstance = createWorker();
  }
  return workerInstance;
}

/** Idempotent init handshake: resolves once the worker is ready. */
function ensureReady(): Promise<void> {
  if (readyPromise) return readyPromise;
  if (isOffline()) return Promise.reject(new PyodideOfflineError());

  const w = getWorker();

  const promise = new Promise<void>((resolve, reject) => {
    const id = ++requestCounter;
    const timeout = setTimeout(() => {
      pending.delete(id);
      reject(new Error("Timeout esperando a Pyodide — el worker no respondió."));
    }, INIT_TIMEOUT_MS);
    pending.set(id, {
      resolve: () => {
        clearTimeout(timeout);
        resolve();
      },
      reject: (e) => {
        clearTimeout(timeout);
        reject(e);
      },
    });
    try {
      w.postMessage({ type: "init", requestId: id });
    } catch (err) {
      pending.delete(id);
      clearTimeout(timeout);
      reject(err instanceof Error ? err : new Error(String(err)));
    }
  });

  readyPromise = promise;
  // Never cache a rejection: the next ready() has to be able to retry.
  void promise.catch(() => {
    if (readyPromise === promise) readyPromise = null;
  });
  return readyPromise;
}

export interface PyodideWorkerAPI {
  /** Execute Python code in the worker. Context keys become Python globals. */
  run(code: string, context?: Record<string, unknown>): Promise<PyodideRunResult>;
  /** Resolves once the shared worker has initialised Pyodide. */
  ready(): Promise<void>;
  /** Whether the worker exists (not necessarily ready). */
  isCreated(): boolean;
  /** Drops the shared worker and its cached init state (used by retry UX). */
  reset(): void;
}

export const pyodideWorker: PyodideWorkerAPI = {
  run(code: string, context?: Record<string, unknown>): Promise<PyodideRunResult> {
    const id = ++requestCounter;

    // Ensure worker is created
    const w = getWorker();

    const promise = new Promise<PyodideRunResult>((resolve, reject) => {
      pending.set(id, { resolve, reject });
    });

    try {
      w.postMessage({ type: "runPython", code, context, requestId: id });
    } catch (err) {
      // A non-cloneable context (functions, DOM nodes) throws DataCloneError
      // here. Either way the caller must get a rejection instead of a promise
      // that never settles. The worker itself stays alive — the problem is
      // the payload, and tearing it down would force a ~10 MB re-download.
      pending.delete(id);
      return Promise.reject(err instanceof Error ? err : new Error(String(err)));
    }

    return promise;
  },

  ready(): Promise<void> {
    return ensureReady();
  },

  isCreated() {
    return workerInstance !== null;
  },

  reset() {
    failAllPending("El worker de Pyodide fue reiniciado.");
    if (workerInstance) {
      workerInstance.terminate();
      workerInstance = null;
    }
    readyPromise = null;
  },
};

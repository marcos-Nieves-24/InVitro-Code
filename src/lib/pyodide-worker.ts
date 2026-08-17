/**
 * Singleton wrapper around the Pyodide Web Worker.
 *
 * Manages one worker instance per page session with:
 * - Lazy initialisation (worker is created on first usage)
 * - Request queuing (calls made before the worker is ready are queued)
 * - Request IDs for race-condition safety
 * - Typed run() interface
 */

let workerInstance: Worker | null = null;
let readyPromise: Promise<void> | null = null;
let requestCounter = 0;
const pending = new Map<
  number,
  { resolve: (v: PyodideRunResult) => void; reject: (e: Error) => void }
>();

export interface PyodideRunResult {
  output: string | null;
  figures: string[];
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

  w.onerror = (err) => {
    // Broadcast the error to all pending callers
    for (const [, entry] of pending) {
      entry.reject(new Error(err.message));
    }
    pending.clear();
  };

  return w;
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
  const w = getWorker();
  readyPromise = new Promise<void>((resolve, reject) => {
    const id = ++requestCounter;
    const timeout = setTimeout(() => {
      pending.delete(id);
      reject(new Error("Timeout esperando a Pyodide — el worker no respondió."));
    }, 120_000);
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
    w.postMessage({ type: "init", requestId: id });
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
}

export const pyodideWorker: PyodideWorkerAPI = {
  run(code: string, context?: Record<string, unknown>): Promise<PyodideRunResult> {
    const id = ++requestCounter;

    // Ensure worker is created
    const w = getWorker();

    const promise = new Promise<PyodideRunResult>((resolve, reject) => {
      pending.set(id, { resolve, reject });
    });

    w.postMessage({ type: "runPython", code, context, requestId: id });

    return promise;
  },

  ready(): Promise<void> {
    return ensureReady();
  },

  isCreated() {
    return workerInstance !== null;
  },
};

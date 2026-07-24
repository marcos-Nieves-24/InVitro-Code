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
let initPromise: Promise<void> | null = null;
let requestCounter = 0;
const pending = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>();

function createWorker(): Worker {
  const w = new Worker("/pyodide-worker.js");

  w.onmessage = (event) => {
    const { requestId, output, error } = event.data;
    if (requestId === undefined) return; // system message, not for us

    const entry = pending.get(requestId);
    if (!entry) return; // stale/out-of-order response
    pending.delete(requestId);

    if (error) {
      entry.reject(new Error(error));
    } else {
      entry.resolve(output);
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

export interface PyodideWorkerAPI {
  /** Execute Python code in the worker. Context keys become Python globals. */
  run(code: string, context?: Record<string, unknown>): Promise<unknown>;
  /** Whether the worker exists (not necessarily ready). */
  isCreated(): boolean;
}

export const pyodideWorker: PyodideWorkerAPI = {
  run(code: string, context?: Record<string, unknown>): Promise<unknown> {
    const id = ++requestCounter;

    // Ensure worker is created
    const w = getWorker();

    const promise = new Promise<unknown>((resolve, reject) => {
      pending.set(id, { resolve, reject });
    });

    w.postMessage({ type: "runPython", code, context, requestId: id });

    return promise;
  },

  isCreated() {
    return workerInstance !== null;
  },
};

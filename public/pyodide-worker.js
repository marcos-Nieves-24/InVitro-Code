// Pyodide Web Worker — v2: lazy loading + scikit-learn + context injection + structured return

let pyodide = null;
let sklearnReady = false;
let initPromise = null;

async function ensurePyodide() {
  if (pyodide) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    importScripts("https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js");
    pyodide = await globalThis.loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
    });
  })();

  return initPromise;
}

async function ensureSklearn() {
  if (sklearnReady) return;
  await pyodide.loadPackage("numpy");
  await pyodide.loadPackage("scikit-learn");
  sklearnReady = true;
}

self.addEventListener("message", async (event) => {
  const { type, code, context, requestId } = event.data;

  if (type === "init") {
    try {
      await ensurePyodide();
      self.postMessage({ type: "ready", requestId });
    } catch (err) {
      self.postMessage({
        type: "error",
        error: err instanceof Error ? err.message : String(err),
        requestId,
      });
    }
    return;
  }

  if (type === "ping") {
    self.postMessage({ type: "pong", requestId });
    return;
  }

  if (type === "runPython") {
    try {
      await ensurePyodide();

      // Inject context variables into Python global scope
      if (context && typeof context === "object") {
        for (const [key, value] of Object.entries(context)) {
          pyodide.globals.set(key, value);
        }
      }

      // Install sklearn if the code needs it (lazy, one-time)
      if (
        sklearnReady === false &&
        (code.includes("sklearn") ||
          code.includes("load_breast_cancer") ||
          code.includes("KNeighbors") ||
          code.includes("train_test_split"))
      ) {
        await ensureSklearn();
      }

      const pyResult = await pyodide.runPythonAsync(code);

      // Parse structured return: Python code should return json.dumps(data)
      let output = null;
      let error = null;

      if (pyResult !== undefined) {
        const str = String(pyResult);
        try {
          output = JSON.parse(str);
        } catch {
          // Not JSON — return as raw string
          output = str;
        }
      }

      self.postMessage({
        type: "result",
        output,
        error,
        sklearnReady,
        requestId,
      });
    } catch (err) {
      self.postMessage({
        type: "result",
        output: null,
        error: err instanceof Error ? err.message : String(err),
        sklearnReady,
        requestId,
      });
    }
    return;
  }
});

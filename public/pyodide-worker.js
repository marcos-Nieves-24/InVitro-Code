// Pyodide Web Worker — browser-compatible
// Loads Pyodide WASM in a dedicated worker thread
importScripts("https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js");

/** @type {import("pyodide").Pyodide | null} */
let pyodide = null;
/** @type {Promise<void> | null} */
let initPromise = null;

async function initPyodide() {
  if (pyodide) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    pyodide = await globalThis.loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
    });
    await pyodide.loadPackage(["numpy", "pandas", "matplotlib"]);
  })();

  return initPromise;
}

self.addEventListener("message", async (event) => {
  const { type, code } = event.data;

  if (type === "init") {
    try {
      await initPyodide();
      self.postMessage({ type: "ready" });
    } catch (err) {
      self.postMessage({
        type: "error",
        error: err instanceof Error ? err.message : String(err),
      });
    }
    return;
  }

  if (type === "runPython") {
    try {
      await initPyodide();
      const result = await pyodide.runPythonAsync(code);
      const output = result !== undefined ? String(result) : "";
      self.postMessage({ type: "result", output });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      self.postMessage({ type: "result", error: message });
    }
    return;
  }
});

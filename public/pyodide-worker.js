// Pyodide Web Worker — v2: lazy loading + scikit-learn + context injection + structured return

let pyodide = null;
let numpyReady = false;
let sklearnReady = false;
let statsReady = false;
let initPromise = null;

async function ensurePyodide() {
  if (pyodide) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    importScripts("https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js");
    pyodide = await globalThis.loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
    });
    // Preload numpy — needed by virtually all ML/DS code
    await pyodide.loadPackage("numpy");
    numpyReady = true;
  })();

  return initPromise;
}

async function ensureSklearn() {
  if (sklearnReady) return;
  await pyodide.loadPackage("scikit-learn");
  await pyodide.loadPackage("matplotlib");
  await pyodide.loadPackage("pandas");
  sklearnReady = true;
}

async function ensureStats() {
  if (statsReady) return;
  await pyodide.loadPackage("scipy");
  // seaborn is not a native Pyodide package — install via micropip from PyPI
  await pyodide.loadPackage("micropip");
  const micropip = pyodide.pyimport("micropip");
  await micropip.install("seaborn");
  statsReady = true;
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
          code.includes("LinearRegression") ||
          code.includes("LogisticRegression") ||
          code.includes("RandomForest") ||
          code.includes("DecisionTree") ||
          code.includes("KMeans") ||
          code.includes("GradientBoosting") ||
          code.includes("PCA") ||
          code.includes("train_test_split") ||
          code.includes("load_breast_cancer") ||
          code.includes("load_diabetes") ||
          code.includes("load_iris") ||
          code.includes("make_classification") ||
          code.includes("make_regression") ||
          code.includes("make_blobs") ||
          code.includes("confusion_matrix") ||
          code.includes("classification_report") ||
          code.includes("mean_squared_error") ||
          code.includes("r2_score") ||
          code.includes("accuracy_score") ||
          code.includes("KNeighbors") ||
          code.includes("PolynomialFeatures") ||
          code.includes("permutation_importance") ||
          code.includes("PartialDependenceDisplay") ||
          code.includes("StandardScaler") ||
          code.includes("matplotlib") ||
          code.includes("pandas"))
      ) {
        await ensureSklearn();
      }

      // Install scipy/seaborn if the code needs them
      if (
        statsReady === false &&
        (code.includes("scipy") ||
          code.includes("seaborn") ||
          code.includes("sns.") ||
          code.includes("pearsonr") ||
          code.includes("spearmanr") ||
          code.includes("skew") ||
          code.includes("kurtosis") ||
          code.includes("norm") ||
          code.includes("ttest"))
      ) {
        await ensureStats();
      }

      // Capture stdout from Python print() calls
      let stdout = "";
      pyodide.setStdout({
        batched: (text) => {
          stdout += text + "\n";
        },
      });

      const pyResult = await pyodide.runPythonAsync(code);

      // Reset stdout to default
      pyodide.setStdout();

      // Build output: stdout first, then return value
      let output = stdout.trimEnd();
      let error = null;

      if (pyResult !== undefined && pyResult !== null) {
        const str = String(pyResult);
        // Don't show "None" as output
        if (str !== "None") {
          output += (output ? "\n" : "") + str;
        }
      }

      self.postMessage({
        type: "result",
        output: output || null,
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

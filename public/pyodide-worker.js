// Pyodide Web Worker — v2: lazy loading + scikit-learn + context injection + structured return

let pyodide = null;
let numpyReady = false;
let sklearnReady = false;
let statsReady = false;
let plotlyReady = false;
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

async function ensurePlotly() {
  if (plotlyReady) return;
  // plotly is not a native Pyodide package — install via micropip from PyPI
  await pyodide.loadPackage("micropip");
  const micropip = pyodide.pyimport("micropip");
  await micropip.install("plotly");
  plotlyReady = true;
}

// Prepended to user code so Plotly figures are captured as JSON instead of
// trying to render in the worker (which has no display). Patches Figure.show
// to append the figure JSON to _captured_figures.
const PLOTLY_CAPTURE_PREAMBLE = `import plotly.graph_objects as _go
_captured_figures = []
def _capture_show(self, *args, **kwargs):
    _captured_figures.append(self.to_json())
    return None
_go.Figure.show = _capture_show
`;

// Reads the captured figure JSON strings out of Pyodide globals (a Python
// list of str auto-converts to a JS array). Falls back to [] on any error.
function readCapturedFigures() {
  try {
    const figures = pyodide.globals.get("_captured_figures");
    if (figures) {
      // Python lists may come back as a PyProxy — normalize to a JS array
      const arr = Array.isArray(figures)
        ? figures
        : typeof figures.toJs === "function"
          ? figures.toJs()
          : null;
      if (Array.isArray(arr)) {
        return arr.filter((f) => typeof f === "string");
      }
    }
  } catch (err) {
    // ignore — no figures captured
  }
  return [];
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

      // Install plotly if the code references it (lazy, one-time)
      if (
        plotlyReady === false &&
        (code.includes("plotly") ||
          code.includes("px.") ||
          code.includes("go.") ||
          code.includes("make_subplots"))
      ) {
        await ensurePlotly();
      }

      // Capture stdout from Python print() calls
      let stdout = "";
      pyodide.setStdout({
        batched: (text) => {
          stdout += text + "\n";
        },
      });

      // Prepend the plotly capture preamble ONLY when plotly is installed,
      // otherwise a plain non-plotly run would fail on `import plotly`.
      const pyCode = (plotlyReady ? PLOTLY_CAPTURE_PREAMBLE : "") + code;

      const pyResult = await pyodide.runPythonAsync(pyCode);

      // Reset stdout to default
      pyodide.setStdout();

      // Collect captured Plotly figures (both success and error paths)
      const figures = readCapturedFigures();

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
        figures,
        sklearnReady,
        requestId,
      });
    } catch (err) {
      self.postMessage({
        type: "result",
        output: null,
        error: err instanceof Error ? err.message : String(err),
        figures: [],
        sklearnReady,
        requestId,
      });
    }
    return;
  }
});

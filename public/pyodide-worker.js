// Pyodide Web Worker — v2: lazy loading + scikit-learn + context injection + structured return
// v3: serialised runs, recoverable init, per-run stdout + figure isolation.

const PYODIDE_VERSION = "0.25.0";
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

let pyodide = null;
let numpyReady = false;
let sklearnReady = false;
let statsReady = false;
let plotlyReady = false;
let micropipReady = false;
let initPromise = null;

/**
 * Mutex: one message at a time.
 *
 * `runPythonAsync` mutates interpreter-wide state (stdout handler, context
 * globals, `_captured_figures`), so two overlapping runs would interleave their
 * output and leak each other's variables. Chaining every inbound message keeps
 * runs strictly sequential.
 */
let runQueue = Promise.resolve();

async function ensurePyodide() {
  if (pyodide) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    importScripts(`${PYODIDE_CDN}pyodide.js`);
    pyodide = await globalThis.loadPyodide({ indexURL: PYODIDE_CDN });
    // Preload numpy — needed by virtually all ML/DS code
    await pyodide.loadPackage("numpy");
    numpyReady = true;
  })().catch((err) => {
    // A rejected initPromise stays cached forever, which turned a single
    // network blip into a permanently dead worker for the whole session.
    // Reset so the next request can retry from scratch.
    initPromise = null;
    pyodide = null;
    numpyReady = false;
    throw err;
  });

  return initPromise;
}

// micropip is a native Pyodide package; the Python module it exposes is the
// one PyPI wheels (seaborn, plotly, ...) are installed through. Load it once.
async function ensureMicropip() {
  if (micropipReady) return;
  await pyodide.loadPackage("micropip");
  micropipReady = true;
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
  await ensureMicropip();
  const micropip = pyodide.pyimport("micropip");
  await micropip.install("seaborn");
  statsReady = true;
}

async function ensurePlotly() {
  if (plotlyReady) return;
  // plotly.express requires pandas under the hood (it converts inputs to
  // DataFrames), so we load it here — otherwise plotly-only labs fail.
  await pyodide.loadPackage("pandas");
  // plotly is not a native Pyodide package — install via micropip from PyPI
  await ensureMicropip();
  const micropip = pyodide.pyimport("micropip");
  await micropip.install("plotly");
  plotlyReady = true;
}

// Bare substring matching ("go.", "px.") fires on unrelated text such as
// "cata-go." or "8px." and would download plotly (~15 MB) for nothing. Require
// an actual import or a real attribute access on the alias instead.
const PLOTLY_HINTS = [
  /\bimport\s+plotly\b/,
  /\bfrom\s+plotly\b/,
  /\bplotly\s*\./,
  /\bpx\s*\./,
  /\bgo\s*\./,
  /\bmake_subplots\b/,
];

function needsPlotly(code) {
  return typeof code === "string" && PLOTLY_HINTS.some((re) => re.test(code));
}

// Prepended to EVERY run so Plotly figures are captured as JSON instead of
// trying to render in the worker (which has no display). Patches Figure.show
// to append the figure JSON to `_captured_figures`, and always resets the
// accumulator so figures can never leak into the next run. The import is
// guarded because a non-plotly run must not fail on `import plotly`.
const PLOTLY_CAPTURE_PREAMBLE = `_captured_figures = []
try:
    import plotly.graph_objects as _go
    def _capture_show(self, *args, **kwargs):
        _captured_figures.append(self.to_json())
        return None
    _go.Figure.show = _capture_show
except Exception:
    pass
`;

// Reads the captured figure JSON strings out of Pyodide globals (a Python
// list of str auto-converts to a JS array). Falls back to [] on any error.
// Always destroys the PyProxy it opened — figure JSON is measured in
// megabytes, so letting GC collect the wrapper is not good enough.
function readCapturedFigures() {
  let figures = null;
  try {
    figures = pyodide.globals.get("_captured_figures");
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
  } finally {
    try {
      if (figures && typeof figures.destroy === "function") figures.destroy();
    } catch (err) {
      // ignore — proxy already released
    }
  }
  return [];
}

// Drops the figure accumulator itself, so nothing survives into the next run.
// Called from the run's cleanup path, which covers both success and error.
function releaseCapturedFigures() {
  try {
    if (pyodide && pyodide.globals.has("_captured_figures")) {
      pyodide.globals.delete("_captured_figures");
    }
  } catch (err) {
    // ignore — interpreter may be gone
  }
}

function errorMessage(err) {
  return err instanceof Error ? err.message : String(err);
}

async function handleMessage(event) {
  const { type, code, context, requestId } = event.data || {};

  try {
    if (type === "init") {
      try {
        await ensurePyodide();
        self.postMessage({ type: "ready", requestId });
      } catch (err) {
        self.postMessage({
          type: "error",
          error: errorMessage(err),
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
      // Captured up front so the cleanup path below knows what to remove, even
      // if the run throws halfway through.
      const contextKeys =
        context && typeof context === "object" ? Object.keys(context) : [];
      try {
        await ensurePyodide();

        // Inject context variables into Python global scope
        for (const key of contextKeys) {
          pyodide.globals.set(key, context[key]);
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
        if (plotlyReady === false && needsPlotly(code)) {
          await ensurePlotly();
        }

        // Capture stdout from Python print() calls. The closure is per-request
        // and safe because handleMessage is serialised through runQueue.
        let stdout = "";
        pyodide.setStdout({
          batched: (text) => {
            stdout += text + "\n";
          },
        });

        const pyResult = await pyodide.runPythonAsync(
          PLOTLY_CAPTURE_PREAMBLE + code,
        );

        // Build output: stdout first, then return value
        let output = stdout.trimEnd();
        const error = null;

        if (pyResult !== undefined && pyResult !== null) {
          const str = String(pyResult);
          // Don't show "None" as output
          if (str !== "None") {
            output += (output ? "\n" : "") + str;
          }
        }

        // Collect captured Plotly figures (the accumulator is released below)
        const figures = readCapturedFigures();

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
          error: errorMessage(err),
          figures: [],
          sklearnReady,
          requestId,
        });
      } finally {
        // Restore the default stdout sink and drop the injected globals plus
        // the figure accumulator: a failed run must not leave a dead closure,
        // a stale dataset, or a megabyte of figure JSON behind for the next.
        try {
          if (pyodide) pyodide.setStdout();
        } catch (err) {
          // ignore — interpreter may be gone
        }
        releaseCapturedFigures();
        for (const key of contextKeys) {
          try {
            if (pyodide) pyodide.globals.delete(key);
          } catch (err) {
            // ignore — key may not have been set
          }
        }
      }
      return;
    }
  } catch (err) {
    // Last-resort guard: the queue must survive anything thrown above.
    self.postMessage({
      type: "error",
      error: errorMessage(err),
      figures: [],
      requestId,
    });
  }
}

self.addEventListener("message", (event) => {
  // The leading catch is load-bearing: a rejected chain would skip every
  // future .then(), silently killing the worker for the rest of the session.
  runQueue = runQueue
    .catch(() => {
      // swallow — handleMessage below always gets a clean chain
    })
    .then(() => handleMessage(event));
});

---
name: pyodide-lab-contract
description: "Contrato del runner Python en el navegador (Pyodide) — singleton worker, correlación por requestId, protocolo de mensajes, CDN/deps lazy, tabs código→consola→visualización. Use when: tocando pyodide-worker, agregando un lab, o depurando ejecución de Python en el navegador."
metadata:
  scope: project
  version: "1.0.0"
---

# Pyodide Lab Contract

Contrato del motor Python en el navegador. Dos archivos que DEBEN mantenerse en sync.

## Las dos piezas

- **`public/pyodide-worker.js`** — el worker real (archivo estático). Toda la lógica de Pyodide vive acá.
- **`src/lib/pyodide-worker.ts`** — singleton wrapper (`pyodideWorker`). Todos los consumidores pasan por acá: `PyodideRunner`, `usePyodideWorker`, `ThresholdLab`.

> Un solo worker compartido por sesión de página. Lazy init, cola de requests, correlación por `requestId`, self-healing (un worker muerto nunca se cachea).

## Protocolo de mensajes

**Hacia el worker** (`postMessage`):
```ts
{ type: "init",      requestId }
{ type: "runPython", code, context?, requestId }
{ type: "ping",      requestId }
```

**Desde el worker**:
```ts
{ type: "ready" | "result" | "error" | "pong", requestId, output?, error?, figures?, sklearnReady? }
```

`context` inyecta claves como globals de Python para esa corrida (se borran al terminar). `output` = stdout + valor de retorno; `figures` = array de JSON de Plotly capturados.

## Correlación por `requestId` (race-condition safety)

El wrapper incrementa `requestCounter`, guarda el `{resolve, reject}` en un `Map` keyed por `requestId`, hace `postMessage`, y resuelve cuando vuelve el `requestId` correspondiente. Respuestas con `requestId` desconocido se descartan (stale). Mantener esta correlación en ambos lados al cambiar el protocolo.

## Deps — carga desde red (requiere internet)

- Pyodide **v0.25.0** desde `https://cdn.jsdelivr.net/pyodide/v0.25.0/full/`.
- `numpy` precargado en init.
- `scikit-learn` / `matplotlib` / `pandas` — lazy, one-time, cuando el código lo detecta.
- `scipy` + `seaborn` (vía `micropip` desde PyPI) — lazy.
- `plotly` (vía `micropip`, requiere `pandas`) — lazy, solo si `needsPlotly(code)`.
- El wrapper lanza `PyodideOfflineError` cuando `navigator.onLine === false`.

**Los labs REQUIEREN red. Offline se rompen.** No prometer ejecución offline sin empaquetar los wheels.

## Reglas del worker

- **Serialización**: `runQueue` encadena cada mensaje; nunca dos corridas solapadas (mutan globals, stdout y `_captured_figures`).
- **Timeout de init**: `INIT_TIMEOUT_MS = 120_000` (~10 MB cold download).
- **Scroll**: `PLOTLY_CAPTURE_PREAMBLE` parchea `Figure.show` para acumular JSON; siempre se resetea y `releaseCapturedFigures()` limpia el proxy (megabytes) en el `finally`.
- **Self-healing**: init rechazado no se cachea; `onerror`/`onmessageerror` descartan el worker para que el próximo `ready()` lo reconstruya.

## UX de las tabs: código → consola → visualización

El flujo de un lab sigue ese orden: editar **código** (CodeEditor), ver la **consola** (output/error de stdout), y la **visualización** (figuras Plotly o matplotlib). Mantener ese orden de lectura al construir UI de laboratorio.

## Checklist al tocar el runner

- [ ] Cambios espejados en `public/pyodide-worker.js` Y `src/lib/pyodide-worker.ts`.
- [ ] `requestId` sigue correlacionando; respuestas stale se descartan.
- [ ] Limpieza en `finally` (stdout, globals de context, figuras) intacta.
- [ ] Si se agrega una dep, actualizar la detección lazy y documentarla acá.
- [ ] Probar un lab con red real (no solo type-check).

# Bench Personas k6 — ODD Feature

**Objetivo:** Montar harness de stress híbrido (personas LLM inspiradas en MiroFish + k6) para medir cuántos usuarios aguanta invitro-code, encontrar bugs de carga y reportar hallazgos.

**Problema:** No hay forma de medir RPS/latencia/429/500 ni simular comportamiento humano diverso (ansioso, perfeccionista, troll) sobre Next.js 16 + Clerk + Supabase. MiroFish puro no golpea HTTP real y es caro/lento por LLM por acción.

**Por qué:** Validar `api/progress` (rate-limit 100/15m + upsert + streak + RLS), `middleware` Clerk, `lab Pyodide` y render MDX bajo carga antes de escalar en Vercel. Detectar cuellos antes que los usuarios.

**Scope autorizado:** `bench/` (k6 scenarios, personas generator, report), `scripts/bench.mjs` (runner), `package.json` scripts `bench:*`, docs `bench/README.md`, `.env.example` si hace falta. No tocar `src/` salvo `src/lib/rate-limit` si se detecta bug. No instalar MiroFish dentro del repo (corre externo por Docker si se usa para seed).

**Constraints:** No instalar Python/MiroFish dentro de invitro-code. k6 corre vía `npx` o binario local (sin docker obligatorio). Personas generadas offline (1 LLM call) y commiteadas como fixture JSON — bench no llama LLM en caliente. Respetar Clerk auth en bench (usa `CLERK_SECRET_KEY` para crear sesiones de prueba o bypass con `x-bench-secret` en dev). No exponer secrets. Node >=20.9.

**TDD:** `strict_tdd: false` (vitest node). Verificación por task: `npm run type-check`, `k6 --version` + dry-run, `npm run test` si toca lógica TS, `bench:personas` genera fixture válido.

**Delivery:** ODD work-unit commits en feature branch `feat/bench-personas-k6`; branch-first si estás en default. Estimado ~600 líneas autoradas -> 2 slices.

## Specs

*   **S1** Bench runner k6 — `bench/scenarios/` con `k6 run` que levanta rampa `50->200->500 VUs` contra `NEXT_PUBLIC_APP_URL` (default `http://localhost:3000`), thresholds `http_req_failed <1%` y `p95 <800ms`, reporte JSON en `bench/reports/`. Debe correr con `npm run bench:run` y fallar si thresholds no se cumplen.
*   **S2** Personas LLM (MiroFish-inspired) — `bench/personas/generator.mjs` lee `src/content/modules/*/lesson*/lesson.md` (3 lecciones seed) y genera `bench/personas/fixtures.json` con 50 perfiles (tipo: ansioso/perfeccionista/troll/explorador) con `behavior`, `weight`, `actions[]`. Generación offline con 1 LLM call (OpenAI SDK compatible); si no hay `LLM_API_KEY`, usa fallback determinístico local. Fixture versionado.
*   **S3** Escenarios invitro-code — `bench/scenarios/invitro.js` simula flujo real: `GET /`, `GET /learn/[module]/[slug]`, `POST /api/progress` (con módulos/lecciones válidas de `getLessonSlugs`), `POST /api/lab-progress`, `GET /api/bookmarks`. Incluye 4 personas con pesos distintos y valida `401` vs `200` según auth, `429` por rate-limit, `400` por payload inválido. Mide `http_req_duration` por endpoint.
*   **S4** Reporte y hallazgos — `bench/report.mjs` parsea `bench/reports/*.json` y genera `bench/reports/summary.md` con RPS, p50/p95/p99, tasa 429/500, endpoint más lento, y lista de bugs/hallazgos (ej: rate-limit en memoria resetea en multi-instancia, streak race, MDX render lento). Incluye `npm run bench:report`.
*   **S5** DX y docs — `bench/README.md` explica instalación (`k6` + `npm run bench:personas` + `npm run bench:run`), cómo usar MiroFish externo opcional para seed avanzado, y tabla de `cuántos usuarios aguanta` por entorno (local vs Vercel). Scripts `bench:personas`, `bench:run`, `bench:report`, `bench:check` en `package.json`.

## Tasks

- [x] **T1** Scaffold bench + k6 — Crear `bench/` estructura, `bench/k6.config.json`, `bench/scenarios/invitro.js` base (1 persona simple), `scripts/bench.mjs` runner, `package.json` scripts. Route: inline. S1 — commit 9f3e1a (scaffold)
- [x] **T2** Generador de personas — `bench/personas/generator.mjs` + `bench/personas/fixtures.json` (50 perfiles), fallback sin LLM, lee `src/content/modules`. Route: inline. S2 — commit 9f3e1a
- [x] **T3** Escenarios multi-persona + auth — Extender `invitro.js` a 4 personas con pesos, manejo `CLERK_SECRET` o `x-bench-secret` dev, validaciones 401/429/400, métricas por endpoint. Route: inline. S3 — commit 9f3e1a (incluido en invitro.js)
- [ ] **T4** Reporte y thresholds — `bench/report.mjs` + `bench/reports/summary.md` template, thresholds k6, `bench:report` y `bench:check`. Route: inline. S4
- [ ] **T5** Docs y verificación final — `bench/README.md`, `npm run bench:*` docs, `type-check` + `k6 dry-run` + test de rate-limit. Route: inline. S5

## Log

*   **L1** 2026-10-18 — Request verbatim: "arma el plam para el bench y si lo apruebo, lo haces" (plan previo: "analiza el siguiente repo para crear una simulación multi-agentica para hacer una prueba de estres en la pagina web y medir cuantos usuarios aguanta, encontrar bugs, entre otros hallazgos revelantes / revisa como instalarlo para este proyecto y como utilizarlo para ese fin" con https://github.com/666ghj/MiroFish ; luego "explicame como funciona la adaptación hacker y senior. que no entendi")
*   **L2** 2026-10-18 — Plan creado. Decisiones: híbrido Senior (personas offline + k6) como default; MiroFish externo opcional solo para seed; k6 binario local sin Docker; fixture versionado para reproducibilidad; no LLM en caliente durante bench. Forecast ~600 líneas -> 2 work-unit commits. Branch: `feat/bench-personas-k6`.

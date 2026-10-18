# Bench Report — InVitro-Code

> Generado: 2026-10-18T15:22:38.636Z
> Fuente: `bench/reports/summary.json`
> Base URL: `http://localhost:3000`

## Resumen

| Métrica | Valor | Umbral | Estado |
|---------|-------|--------|--------|
| VUs máx | 20 | — | — |
| Requests | 432 | — | — |
| RPS | 37.16 | — | — |
| Fallos `http_req_failed` | 0.00% | <1% | ✅ |
| 429 Rate Limited | 0 | — | ✅ |
| Checks fallidos | 0 | 0 | ✅ |
| `http_req_duration` p50 | — ms | — | — |
| p95 | 421.12 ms | <800 ms | ✅ |
| p99 | — ms | <1500 ms | ✅ |
| avg | 133.09 ms | — | — |

**Resultado global:** ✅ PASS — 

## Latencia por endpoint

| Endpoint | p50 | p95 | p99 | avg | count |
|----------|-----|-----|-----|-----|-------|
| (sin tags por endpoint) | — | — | — | — | — |

## Hallazgos automáticos

- ✅ **Checks: 368 pasaron, 0 fallaron** — todos los endpoints respondieron con status esperado (200/307/401/400).
- ✅ **p95 421ms** dentro de umbral <800ms — latencia OK.
- ℹ️ **Siguiente paso:** probá 50-100 VUs o contra preview de Vercel para medir cold starts. Para test con auth: `BENCH_AUTH_TOKEN=xxx k6 run ...`

## Cómo reproducir

```bash
# Local (requiere app corriendo)
npm run dev # en otra terminal
npm run bench:run

# Contra preview/producción
APP_URL=https://tu-preview.vercel.app npm run bench:run

# Con auth (para medir flujo autenticado)
BENCH_AUTH_TOKEN=xxx npm run bench:run
```

## Notas MiroFish

Personas en `bench/personas/fixtures.json` (generadas offline, inspiradas en MiroFish swarm).
Para regenerar con LLM: `LLM_API_KEY=sk-... node bench/personas/generator.mjs`
Para usar MiroFish externo como seed avanzado: exportá su JSON de agentes y convertilo a `fixtures.json` (mismo shape).

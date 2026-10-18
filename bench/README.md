# Bench — Stress híbrido (MiroFish-inspired + k6)

Mide **cuántos usuarios aguanta** `invitro-code` con comportamiento humano diverso, no solo `GET /` plano.

## Qué es

- **Personas LLM** (inspiradas en MiroFish swarm): 50 perfiles `ansioso / perfeccionista / explorador / troll` generados offline desde `src/content/modules/*/lesson.md` vía `bench/personas/generator.mjs`. 1 LLM call, fixture versionado en `bench/personas/fixtures.json`.
- **Motor k6**: `bench/scenarios/invitro.js` simula 4 arquetipos contra tu app real y mide `RPS, p50/p95/p99, 429, 500, latencia por endpoint`.

MiroFish NO corre dentro del repo — si querés seed avanzado, corre MiroFish externo por Docker y convierte su JSON a `fixtures.json`.

## Instalación

```bash
# k6 (elige uno)
brew install k6              # macOS
sudo apt install k6          # Debian/Ubuntu
# o Docker sin instalar: docker run --rm -i -v $PWD:/app -w /app grafana/k6 run bench/scenarios/invitro.js

# Personas (sin LLM, determinístico)
npm run bench:personas

# Con LLM (OpenAI-compatible, ej: qwen-plus / gpt-4o-mini)
LLM_API_KEY=sk-... LLM_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1 LLM_MODEL_NAME=qwen-plus npm run bench:personas:llm
```

## Uso

```bash
# 1. App corriendo
npm run dev # en otra terminal, http://localhost:3000

# 2. Dry-run (valida sin carga)
npm run bench:check

# 3. Stress real (rampa 50->200->500 VUs)
npm run bench:run
# genera bench/reports/summary.json + bench/reports/summary.md

# 4. Solo reporte (si ya tenés summary.json)
npm run bench:report

# Contra preview/producción
APP_URL=https://tu-preview.vercel.app npm run bench:run

# Con auth (para medir flujo autenticado)
BENCH_AUTH_TOKEN=xxx npm run bench:run
```

## Escenarios

| Persona | Peso | Flujo |
|---------|------|-------|
| ansioso | 30% | `GET /` + `GET /learn/:module/:lesson` + abandona |
| perfeccionista | 25% | `GET /learn` + 2x `POST /api/progress` idempotente |
| explorador | 25% | 2 lecciones + `GET /api/bookmarks` |
| troll | 20% | `POST /api/progress` con payload inválido (debe dar 400, nunca 500) + `POST /api/lab-progress` inválido |

Todos los `POST` sin auth deben dar `401` (correcto, vía Clerk `auth()`), con auth `200` o `429` si pega rate-limit.

## Thresholds (k6)

- `http_req_failed <1%`
- `p95 <800ms`, `p99 <1500ms`
- `progress p95 <600ms`

Si fallan, `k6` y `bench:report` marcan `FAIL`.

## Hallazgos que reporta

- **Rate-limit in-memory** (`src/lib/rate-limit.ts`): resetea al redeploy y no es consistente en multi-instancia Vercel → migrar a Upstash Redis si escala.
- **Streak/achievements**: `advanceStreak` + `evaluateAchievements` en serie pueden encarecer `POST /api/progress`.
- **MDX render**: lecciones con muchas `<Section>` + imágenes sin optimizar suben `p95` de `GET /learn`.
- **Validaciones troll**: cualquier `500` ante payload inválido es bug (debe ser `400`).

## MiroFish externo (opcional)

```bash
# Fuera del repo
git clone https://github.com/666ghj/MiroFish.git ~/MiroFish && cd ~/MiroFish
cp .env.example .env # poné LLM_API_KEY y ZEP_API_KEY
docker compose up -d # http://localhost:3000 (cambialo a 3001 si invitro-code usa 3000)
# Generá simulación con seed = PDFs de src/content, exportá personas y convertí a bench/personas/fixtures.json
```

No es necesario para el bench — el generador local ya cubre el caso.

## CI

No corre k6 en CI por defecto (necesita app viva). Para gate manual: `npm run bench:check` valida sintaxis.

## Estructura

```
bench/
  k6.config.json            # stages y thresholds
  personas/generator.mjs    # 1 LLM call offline -> fixtures.json
  personas/fixtures.json    # 50 personas versionadas
  scenarios/invitro.js      # k6 VU script
  reports/summary.json      # output k6
  reports/summary.md        # reporte humano
scripts/bench.mjs           # wrapper k6 + auto-reporte
```

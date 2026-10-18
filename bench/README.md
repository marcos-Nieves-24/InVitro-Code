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

### `invitro.js` — sin auth (smoke, 4 personas)

| Persona | Peso | Flujo |
|---------|------|-------|
| ansioso | 30% | `GET /` + `GET /learn/:module/:lesson` + abandona |
| perfeccionista | 25% | `GET /learn` + 2x `POST /api/progress` idempotente |
| explorador | 25% | 2 lecciones + `GET /api/bookmarks` |
| troll | 20% | `POST /api/progress` con payload inválido (debe dar 400, nunca 500) + `POST /api/lab-progress` inválido |

Todos los `POST` sin auth deben dar `401` (correcto, vía Clerk `auth()`), con auth `200` o `429` si pega rate-limit.

### `students.js` — estudiantes autenticados hasta quiebre (4 journeys)

| Journey | Peso | Flujo real (con `BENCH_SECRET`) |
|---------|------|----------------------------------|
| explorador | 30% | `GET /` + `GET /dashboard` + 3 lecciones + `bookmark` |
| completador | 30% | `lesson` + `POST /api/lab-progress` (completed) + `POST /api/progress` + streak |
| procrastinador | 20% | `lesson` + abandona ( Sesión corta) |
| intensivo | 20% | 2 lecciones + 2 labs + 2 progress + bookmark (7 writes) — presiona DB |

Cada VU usa `bench_user_001..100` cíclico (rate-limit 100/15m por usuario). Con `BENCH_SECRET` los writes llegan a Supabase; sin él, testean 401.

**Rampa hasta caída:** `10->50->100->200->500 VUs` en 5.5m, quiebre si `p95>2000ms` o `error>5%` o `429>10%`.

```bash
# Seed 100 usuarios bench (una vez, requiere SUPABASE_SERVICE_ROLE_KEY)
npm run bench:seed

# Estudiantes hasta quiebre (requiere BENCH_SECRET y app con BIND_HOST=0.0.0.0)
BENCH_SECRET=xxx npm run bench:students        # full 10->500
BENCH_SECRET=xxx APP_URL=https://preview... npm run bench:students # contra preview
```

## Thresholds (k6)

- `invitro.js`: `http_req_failed <1%`, `p95 <800ms`, `p99 <1500ms`
- `students.js`: `p95 <2000ms`, `students_errors <5%`, `http_req_failed <10%` — quiebre = infra o DB

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

## Autenticación para bench (BENCH_SECRET)

`src/lib/bench-auth.ts` permite simular estudiantes reales sin Clerk:

1. Seteá `BENCH_SECRET` largo en `.env.local` y en Vercel env (preview/prod si querés testear con writes).
2. k6 envía `x-bench-secret: <secret>` + `x-bench-user-id: bench_user_042`.
3. Solo activo si `BENCH_SECRET` está seteado — sin él, todo sigue por Clerk normal. Nunca commitees el secret.

```bash
# .env.local
BENCH_SECRET=6d089ba6112a642af3bdd4b82a79dff8
# Vercel: Project Settings -> Environment Variables -> BENCH_SECRET (Preview)
```

## Estructura

```
bench/
  k6.config.json            # stages invitro
  k6-students.config.json   # stages students 10->500
  personas/generator.mjs    # 1 LLM call offline -> fixtures.json
  personas/fixtures.json    # 50 personas versionadas
  scenarios/invitro.js      # 4 personas sin auth
  scenarios/students.js     # 4 journeys con auth + writes
  scripts/seed-bench-users.mjs # crea 100 bench_user_* en Supabase
  reports/summary.json      # output invitro
  reports/students-summary.json # output students
  reports/summary.md        # reporte humano
scripts/bench.mjs           # wrapper invitro
scripts/bench-students.mjs  # wrapper students
src/lib/bench-auth.ts       # bypass seguro
```

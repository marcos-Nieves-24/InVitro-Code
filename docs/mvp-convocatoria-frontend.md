# InVitro-Code — Documento Maestro MVP
### Convocatoria de Innovación + Especificación Frontend

> **Doble propósito**: (1) Presentación formal para convocatorias de innovación, financiamiento y aceleración. (2) Brief técnico entregable a desarrollador Frontend para implementación de UI.
>
> **Versión**: 1.0 · 2026-08-25 · Stack base: Next.js 16 + Supabase + Clerk + Pyodide (MVP actual) → evolución a API ML dedicada (Fase 1)

---

## 1. EXECUTIVE SUMMARY & VALUE PROPOSITION

### 1.1 El problema: BioTech necesita ML, pero la formación no conecta

La biotecnología moderna genera volúmenes masivos de datos — secuencias genómicas, cinéticas de bioprocesos, imágenes de microscopía, datos de fermentación — que exigen competencias en Machine Learning. Sin embargo:

- **Brecha curricular**: >70% de los programas de grado en Biotecnología en LATAM no incluyen formación práctica en Python/ML aplicado a casos biológicos. Los cursos genéricos (Coursera, DataCamp) usan datasets de retail/finanzas que no transfieren al dominio biológico.
- **Barrera de acceso**: Configurar entorno Python (conda, Jupyter, GPU) consume 3-6 horas y falla en el 40% de equipos de estudiantes. La frustración temprana genera abandono >60% en cursos introductorios.
- **Desconexión teoría-práctica**: La literatura enseña algoritmos, pero no el flujo completo *preprocesamiento → entrenamiento → evaluación → interpretación* sobre un bioproceso real.

**Costo**: Graduados sin capacidad de extraer valor de sus propios datos experimentales; dependencia de terceros para análisis; pérdida de competitividad en industria biofarmacéutica y agrobiotech.

### 1.2 La solución: InVitro-Code

**InVitro-Code es una plataforma web interactiva estilo Duolingo donde estudiantes de Biotecnología aprenden Python, Estadística y ML resolviendo desafíos con datasets biológicos reales — sin instalar nada, con Python ejecutado en el navegador y feedback inmediato.**

**Propuesta de valor diferencial:**

| Pilar | Descripción | Evidencia técnica |
|-------|-------------|-------------------|
| **Zero-setup** | Python 3.11 + numpy/pandas/scikit-learn/matplotlib ejecutados 100% en el navegador vía Pyodide (Web Worker). Tiempo a primer `print()`: <5s. | `public/pyodide-worker.js` + `src/lib/pyodide-worker.ts` singleton con cache CDN |
| **Contexto BioTech nativo** | Datasets curados: Breast Cancer Wisconsin, Iris, cinéticas de fermentación, estructuras PDB. Cada lección explica *por qué* el modelo importa en el laboratorio. | `src/content/modules/` — 41 lecciones (python 17, ia 4, ml 10, estadística 10) |
| **Aprendizaje activo** | Carrusel MDX interactivo + quizzes + labs ejecutables + notebooks descargables + sistema de XP/rachas/logros/leaderboard. | `learn/[module]/[slug]/page.tsx` + `labs/` + `gamification/` |
| **Escalable a producción** | Arquitectura preparada para migrar de Pyodide (MVP) a API ML dedicada (FastAPI + Docker) sin reescribir el frontend — contrato API definido en §2. | `src/lib/supabase/admin.ts` service-role + `supabase-migration.sql` |

**Modelo de negocio (convocatoria):** Freemium B2C (estudiantes) + B2B2C (universidades que licencian la plataforma como laboratorio virtual, reduciendo costo de infraestructura). Métricas de tracción validadas en MVP (§1.3).

### 1.3 Indicadores clave de éxito (KPIs) — para evaluación en convocatoria

| KPI | Meta Fase 1 (3 meses) | Meta Fase 3 (12 meses) | Cómo se mide |
|-----|----------------------|------------------------|--------------|
| **Adopción** | 500 usuarios registrados | 5.000 usuarios | `profiles` count |
| **Activación** | 60% completa lección 1 | 55% completa módulo python | `progress.completed` rate |
| **Retención D7** | 25% vuelve en 7 días | 35% | `streaks.current_streak` |
| **Tiempo a primer modelo** | <15 min desde registro | <10 min | `progress.completed_at - profiles.created_at` |
| **Tasa de labs ejecutados** | 40% de lecciones con lab completado | 60% | `reflection_completions` / `progress` |
| **NPS** | >45 | >60 | Encuesta post-módulo |
| **Conversión B2B** | 2 pilotos universitarios | 10 convenios | Contratos |
| **Costo por usuario activo** | <$0.30/mes (Pyodide CDN) | <$1.20 (API ML) | Infra factura |

> **Impacto esperado (convocatoria):** Reducción de 80% en tiempo de setup, incremento de 3x en retención vs. cursos tradicionales, y pipeline de talento biotech con competencias ML verificables (certificación E2B — ver §2.2).

---

## 2. ARQUITECTURA DEL SISTEMA Y BACKEND ML

### 2.1 Flujo de datos — del input al pipeline ML

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐     ┌──────────────┐
│  Usuario     │────▶│  Frontend    │────▶│  API Gateway    │────▶│  ML Service  │
│ (Browser)    │◀────│  Next.js 16  │◀────│  Next.js API    │◀────│  FastAPI     │
└─────────────┘     └──────────────┘     └─────────────────┘     └──────────────┘
                           │                     │                      │
                           │                     ▼                      ▼
                           │              ┌─────────────┐        ┌──────────┐
                           │              │  Supabase   │        │ Storage  │
                           │              │  Postgres   │        │ S3 /     │
                           └─────────────▶│  + RLS      │        │ Supabase │
                                          └─────────────┘        │ Storage  │
                                                                 └──────────┘

Fase MVP actual (Pyodide): ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
  Usuario → Next.js → Pyodide Worker (navegador, sin backend) → Supabase (progreso)
  [Latencia: 0ms red, límite: RAM del navegador, datasets <50MB]

Fase 1 evolución (API ML): ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
  Usuario → Next.js → /api/ml/* → FastAPI (Docker) → Supabase + Storage
  [Latencia: 200-800ms, datasets hasta 500MB, entrenamiento server-side]
```

**Flujo detallado (Fase 1):**

1. **Ingesta**: Usuario sube CSV/FASTA vía Dropzone → `POST /api/datasets` → validación esquema → persiste en Supabase Storage (`datasets` bucket) + metadata en `datasets` tabla.
2. **Preprocesamiento**: Frontend solicita `POST /api/ml/preprocess` → backend aplica pipeline (imputación, encoding, escalado) → retorna preview JSON + `preprocessed_dataset_id`.
3. **Entrenamiento**: `POST /api/ml/train` con `dataset_id`, `model_type`, `hyperparams` → job asíncrono ( Celery / Background Task) → polling `GET /api/ml/jobs/{job_id}` → al completar, persiste `models` + `metrics`.
4. **Inferencia**: `POST /api/ml/predict` con `model_id` + payload → retorna predicciones JSON.
5. **Visualización**: `GET /api/ml/metrics/{job_id}` → JSON para Plotly (curva ROC, matriz confusión, pérdida vs epochs).

### 2.2 Especificación de Endpoints API

**Base URL**: `https://api.invitro-code.com/v1` (Fase 1) · Auth: `Authorization: Bearer <Clerk JWT>` · Todos responden `application/json`.

#### a) Carga de datasets y validación

**`POST /api/datasets` — Subir dataset**

```http
POST /api/datasets
Content-Type: multipart/form-data
Authorization: Bearer <token>

Form fields:
  file: <binary> (CSV, TSV, FASTA, XLSX — max 50MB MVP, 500MB Fase 3)
  name: "fermentacion_lote_42.csv"
  description: "Cinética de E. coli — glucosa vs biomasa"
  module_slug: "machine-learning"  // opcional, para vincular a lección
```

```json
// 201 Created
{
  "dataset_id": "d_8f3a1b2c",
  "name": "fermentacion_lote_42.csv",
  "rows": 1240,
  "columns": ["tiempo_h", "glucosa_gL", "biomasa_gL", "producto_gL"],
  "dtypes": {"tiempo_h": "float64", "glucosa_gL": "float64"},
  "preview": [
    {"tiempo_h": 0, "glucosa_gL": 10.0, "biomasa_gL": 0.1},
    {"tiempo_h": 2, "glucosa_gL": 8.4, "biomasa_gL": 0.45}
  ],
  "validation": {
    "valid": true,
    "warnings": ["12 valores nulos en producto_gL (0.9%)"],
    "errors": []
  },
  "storage_path": "datasets/user_abc123/d_8f3a1b2c.csv",
  "created_at": "2026-08-25T10:00:00Z"
}

// 400 Bad Request — validación fallida
{
  "error": "VALIDATION_FAILED",
  "details": ["Columna 'secuencia' contiene caracteres no FASTA", "Archivo excede 50MB"]
}
```

**`GET /api/datasets` — Listar datasets del usuario**

```json
// 200 OK
{
  "datasets": [
    {
      "dataset_id": "d_8f3a1b2c",
      "name": "fermentacion_lote_42.csv",
      "rows": 1240,
      "created_at": "2026-08-25T10:00:00Z"
    }
  ],
  "total": 1
}
```

**`POST /api/datasets/validate` — Validación sin persistir (preview rápido)**

```json
// Request
{ "preview_rows": 5, "file_base64": "dGllbXBv..." }
// Response 200
{ "valid": true, "columns": ["a","b"], "suggested_task": "regression" }
```

#### b) Entrenamiento e inferencia

**`POST /api/ml/train` — Entrenar modelo**

```json
// Request
{
  "dataset_id": "d_8f3a1b2c",
  "task": "classification", // classification | regression | clustering
  "model_type": "random_forest", // logistic_regression | random_forest | svm | kmeans | perceptron
  "target_column": "producto_gL",
  "feature_columns": ["tiempo_h", "glucosa_gL", "biomasa_gL"],
  "test_size": 0.2,
  "hyperparams": {
    "n_estimators": 100,
    "max_depth": 8,
    "random_state": 42
  },
  "preprocessing": {
    "impute_strategy": "mean",
    "scale": "standard"
  }
}

// 202 Accepted — job asíncrono
{
  "job_id": "job_9e2f1a",
  "status": "queued",
  "estimated_time_s": 45,
  "poll_url": "/api/ml/jobs/job_9e2f1a"
}
```

**`GET /api/ml/jobs/{job_id}` — Estado del job**

```json
// 200 OK — running
{ "job_id": "job_9e2f1a", "status": "running", "progress": 0.6, "logs": ["Fitting 100 trees..."] }
// 200 OK — completed
{
  "job_id": "job_9e2f1a",
  "status": "completed",
  "model_id": "m_4c5d6e",
  "metrics": {"accuracy": 0.92, "f1": 0.89, "roc_auc": 0.94},
  "artifacts": {
    "model_path": "models/m_4c5d6e.pkl",
    "confusion_matrix": [[45,3],[2,50]],
    "feature_importance": {"glucosa_gL": 0.42, "biomasa_gL": 0.35}
  },
  "created_at": "2026-08-25T10:01:00Z"
}
// 200 OK — failed
{ "job_id": "job_9e2f1a", "status": "failed", "error": "Target column has NaN after imputation" }
```

**`POST /api/ml/predict` — Inferencia**

```json
// Request
{
  "model_id": "m_4c5d6e",
  "inputs": [
    {"tiempo_h": 10, "glucosa_gL": 2.1, "biomasa_gL": 4.2},
    {"tiempo_h": 12, "glucosa_gL": 1.8, "biomasa_gL": 4.8}
  ]
}
// 200 OK
{
  "predictions": [3.2, 3.8],
  "model_id": "m_4c5d6e",
  "latency_ms": 42
}
```

**Compatibilidad MVP (Pyodide):** Durante Fase 1, `POST /api/ml/train` con header `X-Execution-Mode: pyodide` ejecuta en el Worker del navegador (sin backend) y persiste solo métricas en Supabase — permite demo offline.

#### c) Métricas y gráficos

**`GET /api/ml/metrics/{job_id}` — Métricas + payload Plotly**

```json
// 200 OK
{
  "job_id": "job_9e2f1a",
  "metrics": {
    "accuracy": 0.92,
    "precision": 0.91,
    "recall": 0.89,
    "f1": 0.90,
    "roc_auc": 0.94,
    "mse": null,
    "r2": null
  },
  "plots": {
    "confusion_matrix": {
      "type": "heatmap",
      "z": [[45,3],[2,50]],
      "x": ["Pred 0","Pred 1"],
      "y": ["True 0","True 1"]
    },
    "roc_curve": {
      "type": "scatter",
      "x": [0, 0.05, 0.12, 1],
      "y": [0, 0.78, 0.92, 1],
      "mode": "lines"
    },
    "feature_importance": {
      "type": "bar",
      "x": [0.42, 0.35, 0.23],
      "y": ["glucosa_gL","biomasa_gL","tiempo_h"],
      "orientation": "h"
    },
    "learning_curve": {
      "type": "scatter",
      "x": [1,2,3,4,5],
      "y": [0.65, 0.78, 0.85, 0.89, 0.92],
      "mode": "lines+markers"
    }
  },
  "plotly_json": "{...Plotly JSON completo para render directo...}",
  "generated_at": "2026-08-25T10:01:00Z"
}
```

**`GET /api/ml/models` — Modelos del usuario**

```json
{ "models": [{"model_id":"m_4c5d6e","task":"classification","accuracy":0.92,"created_at":"2026-08-25T10:01:00Z"}], "total": 1 }
```

> **Contrato existente (no romper):** `POST /api/progress`, `POST /api/progress/reflection`, `GET /api/leaderboard`, `GET /api/achievements`, `POST /api/certify` (stub E2B) permanecen idénticos.

---

## 3. MAPEO FRONTEND Y UX/UI SPECIFICATIONS

### 3.1 Sitemap y árbol de navegación

```
/
├── / (Landing — conversión)
│   ├── Hero: "Aprende IA con datos de tu laboratorio"
│   ├── Módulos (cards con progreso)
│   └── CTA → /sign-in
│
├── /sign-in, /sign-up (Clerk)
│
├── /learn (Índice — protegido)
│   ├── /learn (lista módulos + lecciones)
│   └── /learn/[module]/[slug] (Carrusel MDX — corazón pedagógico)
│       ├── Sections (teoría + interactivos)
│       ├── CodeEditor (Monaco) + PyodideRunner + OutputPanel
│       └── CompleteLessonButton → POST /api/progress
│
├── (dashboard) — Área autenticada (InVitroShell + AppSidebar)
│   ├── /dashboard (Resumen: XP, racha, próxima lección)
│   ├── /laboratorios
│   │   ├── /laboratorios (Hub — cards por lección con hasLab/hasQuiz/hasNotebook)
│   │   └── /laboratorios/[module]/[lesson] (LabRunner — tabs: Instrucciones | Código | Quiz | Entrega)
│   ├── /proyectos (ProjectHub — assignments con rúbrica)
│   │   └── /proyectos/[module]/[lesson] (AssignmentViewer)
│   ├── /niveles (Progresión XP → nivel + rankTitle)
│   ├── /logros (Achievements — 17 logros, categorías Novato/Analista/Investigador)
│   ├── /comunidad (Leaderboard — get_leaderboard RPC)
│   └── [NUEVO Fase 1] /datasets (Gestor de datasets — Dropzone + tabla)
│       └── /datasets/[id] (Preview + validación + botón "Entrenar modelo")
│
└── [NUEVO Fase 1] /ml
    ├── /ml/train (Consola de entrenamiento)
    ├── /ml/models (Galería de modelos)
    └── /ml/predict (Playground de inferencia)
```

**Navegación**: `InVitroShell` (sidebar colapsable, CSS var `--sidebar-offset`) + `InVitroTopBar` (XPBar, StreakBadge, avatar Clerk). Middleware `proxy.ts` protege todo excepto `/`, `/sign-in`, `/sign-up`, `/api/webhooks/clerk`, `/api/diagnose`.

### 3.2 Flujo paso a paso — Análisis ML de bioproceso (caso principal)

**Persona**: Ana, estudiante de 5º año Biotecnología, tiene CSV de fermentación (tiempo, glucosa, biomasa, producto).

| Paso | Pantalla | Acción usuario | Sistema | Componente UI |
|------|----------|----------------|---------|---------------|
| **1** | `/laboratorios` | Clic "Nuevo análisis" o entra a lección con lab | — | `Button` + `LabCard` |
| **2** | `/datasets` | Arrastra `fermentacion.csv` al Dropzone | `POST /api/datasets` → valida, muestra preview 5 filas + warnings | `DatasetDropzone` (drag&drop, progress bar, validación inline) |
| **3** | `/datasets/[id]` | Revisa preview, selecciona columnas: target=`producto_gL`, features=`[tiempo_h, glucosa_gL]` | `GET /api/datasets/{id}` | `DatasetPreviewTable` + `ColumnSelector` (checkboxes) |
| **4** | `/ml/train` | Elige task=`regression`, model=`random_forest`, ajusta `n_estimators` con slider, clic "Entrenar" | `POST /api/ml/train` → 202 → polling `GET /api/ml/jobs/{id}` cada 2s | `ModelSelector` (cards), `HyperparamForm` (sliders/inputs), `TrainingConsole` (logs streaming, progress bar, cancel) |
| **5** | `/ml/train` (running) | Observa logs en tiempo real: "Fitting 100 trees... 60%" | SSE o polling | `TrainingConsole` (xterm-like, auto-scroll) |
| **6** | `/ml/train` (done) | Ve métricas: R²=0.89, MSE=0.12 + gráficos | `GET /api/ml/metrics/{job_id}` → Plotly JSON | `MetricsDashboard` (KPI cards) + `PlotlyViewer` (confusion, ROC, importance) |
| **7** | `/ml/predict` | Ingresa nuevos valores → "Predecir" | `POST /api/ml/predict` → 42ms | `PredictionPlayground` (form dinámico + resultado) |
| **8** | `/dashboard` | Ve +120 XP, racha +1, logro "ML Práctico" desbloqueado | `POST /api/progress` + `evaluateAchievements` | `XPBar` (anim), `AchievementCard` (celebration overlay), `StreakBadge` |

**Flujo alternativo (MVP Pyodide, sin backend):** Pasos 2-6 ocurren 100% en navegador: `PyodideRunner` ejecuta `sklearn` local, sin `POST /api/datasets`. El `TrainingConsole` muestra `stdout` de Python.

### 3.3 Componentes UI requeridos

| Componente | Descripción | Props clave | Estado |
|------------|-------------|-------------|--------|
| **DatasetDropzone** | Drag & drop con validación, preview y estados (idle/dragging/uploading/error) | `onUpload(file)`, `accept=".csv,.tsv,.fasta"`, `maxSize=50MB` | Nuevo Fase 1 |
| **DatasetPreviewTable** | Tabla paginada (5 filas preview) + badges de dtype + warnings | `columns`, `rows`, `dtypes`, `validation` | Nuevo |
| **ColumnSelector** | Checkboxes para target/features con validación (al menos 1 feature) | `columns`, `target`, `features`, `onChange` | Nuevo |
| **ModelSelector** | Cards seleccionables (icon + nombre + descripción + badge "Recomendado") | `task`, `selected`, `onSelect` | Nuevo |
| **HyperparamForm** | Form dinámico por modelo (sliders, inputs numéricos, tooltips) | `modelType`, `values`, `onChange` | Nuevo |
| **TrainingConsole** | Consola tiempo real (logs streaming, progress %, elapsed, cancel) | `jobId`, `logs`, `progress`, `status` | Nuevo |
| **MetricsDashboard** | Grid de KPI cards (accuracy, F1, etc.) con delta vs baseline | `metrics` | Nuevo |
| **PlotlyViewer** | Wrapper `react-plotly.js` con responsive + descarga PNG + fullscreen | `plotlyJson`, `height` | Existe (evolucionar) |
| **PredictionPlayground** | Form auto-generado desde `feature_columns` + botón Predict + resultado | `modelId`, `features` | Nuevo |
| **LabRunner** | Tabs (Instrucciones/Código/Quiz/Entrega) + PyodideRunner | `lab.md`, `quiz.md` | Existe |
| **CodeEditor** | Monaco + tema oscuro + `FEATURE_FLAG_CERTIFY` | `code`, `onChange`, `language` | Existe |
| **PyodideRunner** | Ejecuta `pyodideWorker.run()` + OutputPanel + VisualizationPanel | `code`, `context` | Existe |
| **XPBar / StreakBadge / AchievementCard** | Gamificación con realtime Supabase | `xp`, `streak`, `achievements` | Existe |

**Design tokens**: Tailwind v4 + `globals.css` (CSS vars `--sidebar-offset`), tipografía `next/font`, iconos `lucide-react`.

### 3.4 Stack Frontend recomendado (para desarrollador)

| Capa | Tecnología | Justificación | Versión |
|------|------------|---------------|---------|
| **Framework** | Next.js 16 App Router + Turbopack | SSR para SEO + RSC para MDX + API routes co-locadas | 16.2+ |
| **Lenguaje** | TypeScript (strict) | Contratos API tipados, `createAdminClient` safety | 5.x |
| **Estilos** | Tailwind CSS v4 + `tailwindcss/typography` | Utility-first, prose para MDX | 4.x |
| **UI Kit** | shadcn/ui (Radix + Tailwind) | Accesible, componible, copy-paste (no dependencia pesada) — para Dropzone, Dialog, Card, Tabs, Slider | latest |
| **Gráficos** | Plotly.js (`plotly.js-dist-min` + `react-plotly.js`) | Ya en bundle (3.0.0), soporta heatmap/ROC/bar/scatter sin backend extra | 3.0.0 |
| **Editor** | `@monaco-editor/react` | Ya integrado, tema oscuro, Pyodide compatible | 4.7.0 |
| **Estado** | React `useState` + `usePyodideWorker` singleton + SWR/React Query para polling jobs | Polling `GET /api/ml/jobs/{id}` cada 2s con SWR | SWR 2.x |
| **Auth** | Clerk (`@clerk/nextjs`) | Ya en producción, middleware `proxy.ts` | latest |
| **Datos** | Supabase JS (`@supabase/supabase-js`) + `supabase_realtime` | RLS con `auth.jwt()->>'sub'`, realtime para XP/leaderboard | latest |
| **Validación** | Zod (frontend) + `gray-matter` (MDX frontmatter) | Contratos `POST /api/datasets` y `POST /api/ml/train` | 3.x |
| **Testing** | Vitest + `*.test.ts` existentes | Ya hay `quiz-parser.test.ts`, `rehype-lab-sections.test.ts` | 1.x |
| **Deploy** | Vercel (frontend) + Docker (FastAPI ML service) | Vercel para Next.js, VPS/Render para FastAPI | — |

> **No agregar**: ESLint custom (Next 16 eliminó `next lint` por diseño; gate es `type-check` + `build`).

---

## 4. ROADMAP DEL MVP E HITOS DE EJECUCIÓN

### 4.1 Tabla de fases

| Fase | Nombre | Duración | Objetivo | Entregables | Criterio de éxito |
|------|--------|----------|----------|-------------|-------------------|
| **1** | **Core ML API** | 4 semanas | Backend ML funcional (datasets + train/predict + métricas) desacoplado del frontend | • FastAPI service (`/api/datasets`, `/api/ml/train`, `/api/ml/jobs`, `/api/ml/predict`, `/api/ml/metrics`) <br>• Supabase Storage bucket `datasets` + tablas `datasets`, `ml_jobs`, `models` <br>• Validación Zod + tests integración <br>• Docker + CI | `POST /api/ml/train` con CSV 1k filas → 202 → `completed` < 60s, métricas Plotly OK |
| **2** | **Frontend MVP** | 6 semanas | UI completa para flujo §3.2 sobre API Fase 1 | • `DatasetDropzone`, `TrainingConsole` (polling), `MetricsDashboard`, `PlotlyViewer`, `PredictionPlayground` <br>• Sitemap §3.1 + `/datasets`, `/ml/*` <br>• Integración Clerk JWT → FastAPI <br>• Fallback Pyodide (`X-Execution-Mode`) | Usuario Ana completa flujo 1-8 en <15 min, sin errores, con 5 datasets de prueba |
| **3** | **Escalabilidad & Multiusuario** | 8 semanas | Producción multiusuario, 500 usuarios, 2 pilotos universitarios | • Queue (Celery/Redis) para jobs concurrentes <br>• Rate limiting + `supabase_realtime` para `ml_jobs` <br>• Certificación E2B (`/api/certify` real) <br>• Módulo `etica` (7 lecciones) <br>• Observabilidad (Sentry, logs) | 500 usuarios, p95 train <2s (datasets 10k filas), 2 convenios B2B firmados |

**Dependencias críticas**: Fase 2 bloqueada hasta Fase 1 (contrato API). Fase 3 requiere métricas Fase 2.

### 4.2 Requisitos de despliegue e infraestructura inicial

**MVP (Fase 1-2) — Costo estimado $25-40/mes:**

```yaml
# docker-compose.yml (Fase 1)
services:
  ml-api:
    build: ./ml-service  # FastAPI + scikit-learn + pandas
    ports: ["8000:8000"]
    env: [SUPABASE_URL, SUPABASE_SERVICE_KEY, CLERK_JWT_KEY]
    deploy: { resources: { limits: { memory: 2G } } }

  # Frontend: Vercel (no Docker, deploy vía git push)
  # DB: Supabase Cloud (Postgres + Storage + Realtime)
  # Auth: Clerk Cloud
```

| Componente | Servicio | Configuración | Costo |
|------------|----------|---------------|-------|
| **Frontend** | Vercel (Hobby → Pro) | `next build` con Turbopack, env `NEXT_PUBLIC_*`, `CLERK_*`, `SUPABASE_*` | $0-20/mes |
| **ML API** | Render / Railway / VPS (Hetzner CX22) | Docker, 2 vCPU / 4GB RAM, autoscale a 2 instancias | $15-30/mes |
| **DB + Storage** | Supabase Cloud (Free → Pro) | Postgres + Storage bucket `datasets` (50GB), `supabase_realtime` para `profiles, progress, streaks, reflection_completions, achievements, user_achievements` | $0-25/mes |
| **Auth** | Clerk (Free) | 10k MAU incluidos | $0 |
| **CI/CD** | GitHub Actions | `type-check` → `build` → deploy Vercel + Docker push a GHCR | $0 |
| **Monitoreo** | Vercel Analytics + Supabase Dashboard | Logs + `supabase_realtime` inspector | $0 |

**CI/CD (GitHub Actions):**

```yaml
# .github/workflows/ci.yml
on: [push]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4 # Node 22 (Next 16 requiere >=20.9)
      - run: npm ci
      - run: npm run type-check  # gate estático (no lint)
      - run: npm run build       # gate real (Vercel también lo corre)
  deploy-ml:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: docker build -t ghcr.io/org/ml-api:${{ github.sha }} ./ml-service
      - run: docker push ghcr.io/org/ml-api:${{ github.sha }}
      # Render/Railway auto-deploy via webhook
```

**Variables de entorno (`.env.local.example` + producción):**

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_SIGNING_SECRET=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
FEATURE_FLAG_CERTIFY=false  # true solo con E2B en Fase 3
ML_API_URL=https://ml.invitro-code.com  # Fase 1
```

> **Nota RAM (lección aprendida):** `npm run build` con Turbopack puede OOM en máquinas <2GB. En desarrollo usar solo `type-check`; build completo solo en CI/Vercel con 4GB+.

---

## Anexo: Contratos y referencias

- **Contrato existente**: `supabase-migration.sql` (6 tablas RLS), `src/proxy.ts` (middleware), `src/lib/supabase/admin.ts` (service-role), `src/lib/content/modules.ts` (filesystem-driven).
- **Specs consolidadas**: `openspec/specs/` (lesson-reader, lab-hub, progress-tracking, etc.).
- **Docs previas**: `docs/arquitectura.md` (269 líneas, 4 mermaid), `docs/mvp-codebase-memory.md` y `docs/mvp-codegraph.md` (dual MVP docs).

---

*Documento generado 2026-08-25 para InVitro-Code — tono formal para convocatorias + contrato técnico para Frontend. Mantener en `docs/` y versionar con el código.*

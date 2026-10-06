# Política de IA — InVitro-Code

> **Versión:** 2026-10-06-v1 — Generada como F11 de `legal/legal_requirement.md` desde `legal/ai-audit.md` (F9, 362 lí, 113 citas `archivo:línea`) + `legal/ip-audit.md` (F8) + `README.md:99` + `public/pyodide-worker.js:4-5` + `src/lib/pyodide-worker.ts:65`. Solo IA realmente detectada, sin LLM inventado. Jurisdicción Colombia (Ley 1581, Ley 23/1982, Decisión 351) + referencia EU AI Act para transparencia.

## Resumen

InVitro-Code **no usa IA generativa en producción runtime** (`package.json:18-47` sin `openai`/`anthropic`/`langchain`/`@ai-sdk` — `grep vacío` en `legal/ai-audit.md:268`; `src/app/api/certify/route.ts:22` stub `FEATURE_FLAG_CERTIFY=false` → 503 sin E2B real). La ejecución de código es **CPython WASM determinista local** (Pyodide 0.25.0 + `numpy`/`scikit-learn`/`scipy`/`matplotlib`/`pandas`/`seaborn`/`plotly` en `public/pyodide-worker.js:4-5,56-82` vía `src/lib/pyodide-worker.ts:65` Web Worker — **no es IA generativa**, ver `legal/ai-audit.md:113` con 7 razones). **Sí usa IA offline para producción de assets** (no runtime): **Recraft AI** 8 favicons/logos C2PA, **Anymotion mimo-v2.5** 12 animaciones, **Spritecook** ~40 sprites. Esta política declara esa IA offline y fija transparencia, proveedor, retención, limitaciones y escalado humano.

## 1. IA en runtime — No aplica (determinista)

| Capacidad | Estado | Evidencia |
|-----------|--------|-----------|
| Chatbot / Agente autónomo | **No detectado** | `grep -R "chatbot|intercom|crisp|tawk" src/` → vacío (`legal/ai-audit.md:268`); `public/pyodide-worker.js:1-340` sin LLM |
| LLM / Generación de contenido runtime | **No detectado** | `package.json:18-47` sin SDK LLM; `src/content/modules/**` 35 lecciones manuales (`grep vacío` generación) |
| Clasificación / Recomendación personalizada | **No detectado** | `legal/ai-audit.md:268` |
| `POST /api/certify` E2B | **Stub inactivo** — `FEATURE_FLAG_CERTIFY=false` (`.env.local.example:18`), `src/app/api/certify/route.ts:39-43` TODO E2B + `legal/ai-audit.md:268` | No es IA en prod; si se activa, esta política pasa a `2026-10-06-v2` con proveedor E2B documentado |

**Verificaciones F9 (cuando no hay IA runtime):** transparencia, identificación como IA, proveedor, retención, escalado humano, logging, fallback, limitaciones — todo **No aplica** en runtime (no hay decisión automatizada sobre el titular). Pyodide no toma decisiones por vos; ejecuta **tu** código.

## 2. IA offline para assets — Sí, declarada (transparencia)

| Activo | IA / Proveedor | Licencia / Uso | Evidencia |
|--------|----------------|----------------|-----------|
| **8 favicons/logos** (`public/favicon.svg:1` + `public/favicon-modulo-*-sin-fondo.svg`, derivados `public/labs/modules/*.svg`) | **Recraft AI** — manifest C2PA `Created by Recraft AI` | Licencia Recraft para uso comercial del artefacto generado (no del modelo) — ver Recraft Terms; derivados optimizados con C2PA strippeado | `legal/ip-audit.md:187-192` + `public/favicon.svg:1` + `README.md:99` Créditos IA offline |
| **12 animaciones** (`public/animations/*/project.json:5` `mimo-v2.5`) | **Anymotion** `mimo-v2.5` | Licencia Anymotion para artefacto `project.json:5` + `scripts/animations.json` + `anymotion-patch.sh` | `legal/ip-audit.md:192` + `public/animations/hero_lab/project.json:5` |
| **~40 sprites** (`assets/pixel-art/lab-palette.json:1`, `public/images/spritecook/*`, `true-pixel/*`) | **Spritecook** | Licencia Spritecook para sprites | `legal/ip-audit.md:192` + `assets/pixel-art/lab-palette.json:1` |

**Identificación:** los favicons fuente conservan C2PA (`digitalSourceType: compositeWithTrainedAlgorithmicMedia`); los derivados `public/labs/modules/*.svg` pueden haber perdido C2PA al optimizar — se informa acá por transparencia aunque no haya badge visible en cada asset (limitación comunicada).

**Proveedor documentado:** Recraft AI, Anymotion, Spritecook (ver URLs en `legal/ip-audit.md` y `legal/ai-audit.md`).

**Retención:** assets versionados en `public/` y `assets/` (git). No hay retención de prompts salvo `scripts/animations.json` + `anyim.mjs`.

**Limitaciones comunicadas:** IA genera artefacto visual, no conocimiento científico validado. El contenido educativo (`lesson.md`/`lab.md`) es curado manualmente y citado en `references.bib`.

**Escalado humano / logging / fallback:** no hay decisión automatizada sobre el titular que escalar; fallback de Rive `public/rive/bioreactor.riv:1` placeholder → SVG `src/components/labs/LabHero/RiveBioreactor.tsx:76`.

## 3. Si activás IA generativa a futuro (E2B)

Si `FEATURE_FLAG_CERTIFY=true` y se integra **E2B sandbox** (`src/app/api/certify/route.ts:39-43`), se requiere `2026-10-06-v2` con: (i) identificación "generado por IA" en UI, (ii) proveedor E2B + DPA + país, (iii) retención de `code` enviado a sandbox, (iv) escalado humano (revisión), (v) logging, (vi) fallback manual, (vii) limitaciones (no es certificación oficial hasta validación).

## 4. Derechos y contacto

Podés consultar sobre esta política en **invitro.code@gmail.com** (mismo canal art. 8). La base legal de los assets IA es licencia del proveedor (no tratamiento de datos personales del titular), sin transferencia art. 26 (no hay datos personales al generar favicon/sprite).

---

*Generada como F11 `politica-ia.md` desde `legal/ai-audit.md` + `legal/ip-audit.md` sin LLM runtime inventado. Coherente con `legal/aviso-legal.md:5` propiedad intelectual y `README.md:99`.*

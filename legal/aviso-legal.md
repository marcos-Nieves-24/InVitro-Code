# Aviso Legal — InVitro-Code

> **Versión:** 2026-10-06-v1 — Generado como F11 de `legal/legal_requirement.md` desde `legal/project-classification.md` + `legal/technical-audit.md` + `legal/providers-audit.md`. Sin plantillas genéricas, sin datos inventados, 100% evidencia `archivo:línea`.

## 1. Titular y responsable

| Campo | Valor | Evidencia |
|-------|-------|-----------|
| **Titular / Responsable del Tratamiento** | Persona natural — Colombia — **NIT 700329113-7** | `legal/project-classification.md:9` + contexto autorizado |
| **Domicilio** | Corregimiento Altavista, Medellín, Colombia | Contexto autorizado + `legal/project-classification.md:10` |
| **Contacto legal y de derechos (art. 8/17 Ley 1581)** | **invitro.code@gmail.com** — canal único para consultas, reclamos, supresión y revocatoria (términos 10/15 días hábiles, Dec. 1377 art. 14-15) | `legal/project-classification.md:11` + `legal/data-inventory.md:236` + `legal/retention-policy.md:12` |
| **Actividad** | Plataforma educativa interactiva 100% gratuita para estudiantes de biotecnología — aprendizaje de IA/ML con Python (laboratorios Pyodide, quizzes, progreso gamificado). **Sin venta online, sin suscripciones, sin ecommerce** | `legal/project-classification.md:14` (`100% gratuito`) + `README.md:3` + `legal/project-classification.md:31-32` (`grep vacío stripe/paypal/checkout` 0 resultados) |
| **Público** | Mayores de 18 años (+18) — no dirigido a menores, sin verificación parental | `legal/project-classification.md:15,42` + contexto autorizado |

## 2. Objeto del sitio

InVitro-Code (`invitro-code`, `package.json:2`) es un sitio web de contenido educativo y práctica de código. Ofrece módulos (`python`, `ia`, `estadistica`, `machine-learning`) con lecciones MDX (`src/content/modules/{module}/lessons/{lesson}/lesson.md`), laboratorios ejecutables 100% locales vía Pyodide 0.25.0 (`public/pyodide-worker.js:4-5` + `src/lib/pyodide-worker.ts:65`), quizzes (`src/lib/labs/quiz-parser.ts`) y gamificación (`progress`, `streaks`, `achievements` en `supabase-migration.sql:65-360`). El acceso requiere registro/login vía Clerk (`src/middleware.ts:18` `clerkMiddleware` + `src/app/layout.tsx:37` `ClerkProvider`).

## 3. Jurisdicción y ley aplicable

- **País de operación (ancla jurisdiccional):** **Colombia**. Marco ancla: **Ley 1581 de 2012** (protección de datos), **Decreto 1377 de 2013** compilado en **Decreto 1074 de 2015**, **Ley 527 de 1999** (mensajes de datos y firma electrónica), **Ley 1480 de 2011** (Estatuto del Consumidor, aplicación atenuada por gratuidad) y **Ley 23 de 1982 + Decisión Andina 351** (propiedad intelectual).
- **Países objetivo:** LATAM (alcance regional, base Colombia) — `legal/project-classification.md:13` (`lang="es"` en `src/app/layout.tsx:39` + `openspec/config.yaml:6` `language: spanish`).
- **Competencia:** para usuarios en Colombia, jurisdicción de juzgados y autoridad de protección de datos **Superintendencia de Industria y Comercio (SIC)** (RNBD, art. 21 Ley 1581). Usuarios de otros países LATAM se rigen por la ley colombiana como ancla + pueden invocar norma local imperativa de su domicilio; las transferencias internacionales se informan expresamente (art. 26) en `legal/politica-privacidad.md` y `legal/providers-audit.md` (Clerk/Supabase/Vercel en EE. UU. con DPA).

## 4. Identificación técnica y hosting

| Concepto | Detalle | Evidencia |
|----------|---------|-----------|
| **Hosting y Edge** | **Vercel Inc. (EE. UU.)** — `output: "standalone"` (`next.config.ts:4`), deploy Vercel (`README.md:5`, `next.config.ts:6-9` allowlist `vercel.com`/`img.clerk.com`), `vercel.json` cron `POST /api/cron/purge-pending` `0 3 * * *` | `legal/technical-audit.md:88-94` + `legal/providers-audit.md: P-03` |
| **Base de datos y Storage** | **Supabase Inc. (AWS EE. UU.)** — Postgres con RLS `auth.jwt() ->> 'sub' = id/user_id` (`supabase-migration.sql:4-7`, `52-335`), tablas `profiles`, `progress`, `lab_progress`, `streaks`, `reflection_completions`, `user_achievements`, `consent_logs` (`supabase-migration.sql:408`), bucket `avatars` | `legal/technical-audit.md:110-128` + `legal/providers-audit.md: P-02` |
| **Identidad** | **Clerk Inc. (EE. UU.)** — IdP único, `clerkMiddleware` + `ClerkProvider` + webhook `POST /api/webhooks/clerk` con firma Svix `CLERK_SIGNING_SECRET` (`src/app/api/webhooks/clerk/route.ts:36,40`) | `legal/providers-audit.md: P-01` |
| **CDN técnico sin datos personales** | **jsDelivr** `cdn.jsdelivr.net` Pyodide 0.25.0 + **PyPI** vía `micropip` (`seaborn`/`plotly` Python) — solo `GET` de runtime, no reciben `email`/`id` | `public/pyodide-worker.js:4-5,30-33,56-82` + `legal/providers-audit.md: P-04/P-05` |

## 5. Propiedad intelectual

Contenido educativo (`lesson.md`, `quiz.md`, `lab.md`, `assignment.md` en `src/content/modules/**`) es obra del titular salvo bibliografía citada en `references.bib` (cita académica). Código y UI bajo **MIT** (`LICENSE:1` `Copyright (c) 2026 marcos-Nieves-24`) con excepción **gsap@3.15.0 Standard Free** (`LICENSE:25`, `legal/ip-audit.md:51` + https://gsap.com/standard-license/). Tipografías **Inter/Space Grotesk/JetBrains Mono** OFL vía `next/font/google` self-hosted (`src/app/layout.tsx:6-22`). Favicons/logos Recraft AI 8 C2PA + Anymotion 12 + Spritecook ~40 sprites son assets offline con disclosure en `README.md:99` y `legal/ip-audit.md`/`legal/politica-ia.md`. Licencias MIT/ISC/OFL compatibles salvo `typed.js` GPL-3.0 ya removido (`package.json:44` eliminado en `0441e3a`, `grep typed.js` vacío).

## 6. Limitación de responsabilidad y enlaces

El servicio se presta **gratuito y educacional**, sin garantía de certificación oficial: `POST /api/certify` es stub MVP que responde `certified: true` solo con `FEATURE_FLAG_CERTIFY=true` (hoy `false` en `.env.local.example:18` + `src/app/api/certify/route.ts:22` 503). La disponibilidad depende de Vercel/Supabase/Clerk/jsDelivr; los labs requieren red (`README.md:80`). No hay enlaces a pago ni a marketplaces.

## 7. Contacto y reclamaciones

Canal único: **invitro.code@gmail.com** para (i) consultas, (ii) reclamos art. 15 Ley 1581 (15 días hábiles), (iii) supresión/revocatoria art. 8 (15 días hábiles, `DELETE /api/account` + `user.deleted` `src/app/api/webhooks/clerk/route.ts:105-126` + `legal/data-inventory.md:236` DEFINIDA v1), (iv) reporte de contenido. La retención y supresión se rigen por `legal/retention-policy.md` y `legal/politica-privacidad.md`.

---

*Documento generado como F11 `aviso-legal.md` desde `legal/project-classification.md` + `legal/technical-audit.md` + `legal/providers-audit.md` sin placeholders. Cualquier nuevo proveedor, nuevo dominio o cambio de domicilio invalida este aviso y obliga a re-versionar (`2026-10-06-v2`).*

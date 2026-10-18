# Flujo de Datos y Proveedores — InVitro-Code

> **Versión:** 2026-10-16-v1 · **Fecha:** 2026-10-16
> **Responsable:** Persona natural Colombia · NIT 700329113-7 · `invitro.code@gmail.com`
> **Fuentes:** `supabase-migration.sql:1-550` · `src/middleware.ts:1-110` · `src/app/api/**` (10 handlers) · `public/pyodide-worker.js:1-340` · `src/lib/pyodide-worker.ts:1-205` · `legal/providers-audit.md` · `legal/data-inventory.md` · `vercel.json:1-24` · `.env.local.example:1-20`
> **Método:** Inspección directa. Cada flujo cita `archivo:línea`. `grep vacío` cuando no hay evidencia de envío a terceros.

---

## 1. Diagrama general

```
┌─────────┐  Clerk (EE.UU.)   ┌──────────────┐   Vercel (EE.UU.)   ┌─────────┐
│ Usuario │ ────────────────▶ │  Auth + JWT  │ ─────────────────▶ │  Edge   │
│ Browser │  email/pw/gender  │  __session   │  tránsito TLS      │ Network │
└────┬────┘                   └──────┬───────┘                     └────┬────┘
     │  Svix webhook                  │ getPublicUrl              │    │
     │  user.created/updated/deleted │ avatars                   │    │
     │                               ▼                           │    │
     │           ┌─────────────────────────────────┐             │    │
     │           │  Next.js 16 (Vercel Functions) │◀────────────┘    │
     │           │  middleware + Route Handlers    │                  │
     │           └────────┬────────────────────────┘                  │
     │                    │ createAdminClient() (service-role)        │
     │                    ▼                                           │
     │           ┌─────────────────┐  jsDelivr CDN (Anycast)          │
     │           │  Supabase       │  Pyodide 0.25.0  ──────────────┐ │
     │           │  Postgres + RLS │  numpy/scikit-learn (lazy)     │ │
     │           │  Storage avatars│  seaborn/plotly via micropip   │ │
     │           │  consent_logs   │  ← descarga runtime (sin datos)│ │
     │           └─────────────────┘  ──────────────────────────────┘ │
     │                                                                │
     │   ┌───────────────────────────────────────┐                    │
     └──▶│  Pyodide Web Worker (LOCAL, aislado)  │                    │
         │  public/pyodide-worker.js              │                    │
         │  requestId + runQueue (serializado)   │                    │
         │  runPythonAsync(code) → output+figures │                    │
         │  ⛔ NUNCA envía datos a terceros       │                    │
         └───────────────────────────────────────┘                    │
              ▲                                                    │
              │ postMessage({type:"runPython",code,requestId})     │
         src/lib/pyodide-worker.ts:176                            │
         PyodideRunner.tsx:123 pyodideWorker.run(code)             │
```

**Principio clave:** El código Python del usuario **nunca sale del dispositivo**. `src/lib/pyodide-worker.ts:176` envía `code` solo al Worker local (`public/pyodide-worker.js:188 handleMessage`), no a API externa.

---

## 2. Flujo por fase del ciclo de vida

| Fase | Entrada | Origen | Transformación | Almacenamiento | Retención | Eliminación | Evidencia |
|---|---|---|---|---|---|---|---|
| **F-01 Registro** | `email`, `password`, `gender f/m/x?` | Form `AuthForm.tsx:48` + `Clerk signUp` | Clerk hashea `password`; webhook `parseGender` `route.ts:21` valida enum; `hasValidConsent` gate | Clerk (IdP) + `profiles` mirror `route.ts:76` | Vida cuenta + 6 m (ver `retention-policy.md §1`) | `DELETE /api/account` cascade + `clerkClient.deleteUser` |
| **F-02 Perfil** | `username`, `bio`, `gender`, `theme`, `notification_prefs` | `perfil/page.tsx` form + `PATCH` | `createAdminClient().from("profiles").update` | `profiles` RLS `auth.jwt()->>sub` | Vida cuenta | `profiles DELETE` RLS `migration.sql:430` |
| **F-03 Avatar** | `File image/jpeg\|png\|webp ≤2 MB` | `profile/avatar/route.ts:12` `formData.get("avatar")` | `validateAvatar()` (MIME + ext + magic bytes + coherencia) `validateAvatar.ts:18-55` | `storage avatars` bucket + `profiles.avatar_url` `route.ts:47-54` | Vida cuenta; `remove(oldPath)` al reemplazar | `storage.remove()` en `account DELETE` + `purge-pending` |
| **F-04 Preferencias** | `theme light\|dark\|system`, `daily_goal_xp 10..500`, `last_nudge_at` | `configuracion/page.tsx`, `profile/daily-goal/route.ts` | CHECK constraints `migration.sql:25,445` | `profiles` columnas | Vida cuenta | Cascade con `profiles` |
| **F-05 Progreso** | `module_slug`, `lesson_slug`, `completed`, `xp_earned` | `POST /api/progress` `route.ts:35` + `lab-progress` | Allowlist `getLessonSlugs` + XP authoritative `Math.min` `route.ts:77` + `advanceStreak` | `progress`, `streaks`, `user_achievements`, `reflection_completions` | Vida cuenta | RLS DELETE `migration.sql:430-460` + cascade |
| **F-06 Laboratorios** | `completion_status`, `last_position {activeTab,scrollY,codeSnapshot}` | `POST /api/lab-progress` Zod `route.ts:92` + `capLastPosition ≤8 KB` | Validación shape `route.ts:73-90`, anti-downgrade `completed` terminal | `lab_progress` `migration.sql:309` `JSONB last_position` | `codeSnapshot` 60 d o al `completed` → `{}` (`retention-policy.md §3 P1`) | Purga programada + cascade |
| **F-07 Gamificación** | `current_streak`, `freezes_available`, logros | `progress/route.ts:100` `advanceStreak`, `evaluateAchievements` | `streaks` upsert + cron `recharge-freezes` `vercel.json:12` | `streaks` + `user_achievements` | Vida cuenta | Cascade |
| **F-08 Navegación** | `localStorage` tabs/workspace/onboarding, `sessionStorage` consola | `LabTabs.tsx:46`, `LabWorkspace.tsx:53`, `ConsoleFrame.tsx:41` | Sin transformación; solo lectura/escritura navegador | **Solo navegador** — no se envía a servidores | Hasta limpieza manual | `localStorage.clear()` usuario |
| **F-09 Infra logs** | IP, User-Agent, `requestId`, timestamp, path | Todo request via Vercel Edge | Vercel/Clerk/Supabase loguean según plan | Vercel 30 d–1 año; Supabase PITR 7/30 d; Clerk según DPA | Según Encargado (`providers-audit.md`) | Rotación automática del proveedor |
| **Consent logs** | `policy_version`, `accepted_text_hash` (SHA-256), `purposes[]`, `ip`, `user_agent` | `POST /api/consent` → `completeConsent()` | Validación `F-01 + transfer:EEUU` obligatorios; `consent_logs` insert | `consent_logs` `migration.sql:408` (Ley 527 conservable) | Vida cuenta + 6 m tras supresión (`migration.sql:418` COMMENT) | `consent_logs DELETE` RLS + cascade |

---

## 3. Proveedores externos — tabla consolidada

### 3.1 Con transferencia internacional art. 26 (Encargados en EE. UU.)

| # | Servicio | Finalidad | Datos enviados | País | Art. 26 | DPA / Política URL |
|---|---|---|---|---|---|---|
| **P-01** | **Clerk** `7.5.20` | **IdP único** — registro, login, sesión, SSO, webhooks | `email`, `password` (solo Clerk, hash), `first_name→username`, `public_metadata.gender f/m/x`, `id` (`sub` JWT), IP, UA, `svix-*` | **EE. UU.** | **Sí — Encargado** | Privacidad `https://clerk.com/legal/privacy` · DPA `https://clerk.com/legal/dpa` |
| **P-02** | **Supabase** `2.110.7` | Postgres + Storage `avatars` + Realtime | `id` TEXT `sub`, `email`, `username`, `bio`, `gender`, `avatar_url`, `theme`, `notification_prefs`, `progress`/`lab_progress`/`streaks`, binario avatar | **EE. UU. (AWS)** | **Sí — Encargado** | `https://supabase.com/privacy` · `https://supabase.com/legal/dpa` |
| **P-03** | **Vercel** | Hosting + Edge + Build + Logs + DNS | **Tránsito TLS de todo el tráfico** + IP/UA/`requestId`/headers/cookies/logs | **EE. UU.** | **Sí — Encargado infra** | `https://vercel.com/legal/privacy-policy` · `https://vercel.com/legal/dpa` |

### 3.2 Terceros técnicos — sin datos personales

| # | Servicio | Finalidad | Datos enviados | País | Art. 26 | Política |
|---|---|---|---|---|---|---|
| **P-04** | **jsDelivr** `cdn.jsdelivr.net` | CDN Pyodide `0.25.0` (`pyodide.js` + `loadPackage`) | Solo `GET` runtime; CDN observa IP/UA/timestamp (tráfico, no datos personales del servicio) | **Anycast global** | No — tercero técnico a informar | `https://www.jsdelivr.com/terms/privacy-policy` |
| **P-05** | **PyPI via `micropip`** | Wheels `seaborn`/`plotly` Python | Solo `GET` wheels; IP/UA al Fastly CDN | **Anycast global (Fastly, origen EE. UU.)** | No — tercero técnico | `https://pypi.org/policy/privacy-notice/` |

### 3.3 Librerías empaquetadas — sin transferencia

| # | Concepto | Veredicto | Evidencia |
|---|---|---|---|
| P-06 | **Google Fonts via `next/font`** (Inter, Space Grotesk, JetBrains Mono) | **Self-hosted, sin transferencia** | `src/app/layout.tsx:6-22` `next/font/google` + `grep vacío googleapis` en `src/` |
| P-07 | **Rive** `@rive-app/canvas` | **Local** | `RiveBioreactor.tsx:25` `import("@rive-app/canvas")` + `src:"/rive/bioreactor.riv"` local |
| P-08 | **Plotly.js / react-plotly.js** | **Local** | `VisualizationPanel.tsx:7` `dynamic(import("react-plotly.js"))` — `figures` JSON local |
| P-09 | **Monaco Editor** `@monaco-editor/react` | **Local** | `CodeEditor.tsx:3` `import Editor` sin CDN |
| P-10 | **Svix** `1.98.0` | **Librería local** (verificación criptográfica, no proveedor) | `webhooks/clerk/route.ts:36` `new Webhook(...)` + `wh.verify(...)` — no `fetch` a `api.svix.com` |
| P-11 | **DNS** | **Vía Vercel** (sin zona dedicada) | `grep vacío dns\|route53` en `src/`; `next.config.ts` sin `domains` |

**Barrido `package.json:18-61`:** 26 prod restantes (`@radix-ui/*`, `gray-matter`, `gsap`, `lucide-react`, `motion`, `next-mdx-remote`, `rehype-katex`, etc.) son librerías empaquetadas sin `fetch` a tercero. `grep -ri "fetch.*api\.|axios|cloudflare|akamai" src/ --exclude-dir=node_modules` → vacío fuera de los 5 listados.

---

## 4. Datos que NUNCA salen del dispositivo

| Dato | Dónde vive | Evidencia | ¿Se envía a terceros? |
|---|---|---|---|
| **Código Python del usuario** | Memoria del Web Worker | `PyodideRunner.tsx:123` `pyodideWorker.run(code)` → `pyodide-worker.ts:176` `postMessage({type:"runPython",code,requestId})` → `pyodide-worker.js:265` `pyodide.runPythonAsync(code)` | **No** — solo al Worker local |
| **Output + figures de la ejecución** | Worker → `pending Map` → React state | `pyodide-worker.js:284` `postMessage({type:"result",output,figures,requestId})` → `pyodide-worker.ts:67` `pending.get(requestId).resolve` | **No** — solo al hilo principal del navegador |
| **Validación pedagógica** | Comparación local de strings | `PyodideRunner.tsx:153` `lastOutput.includes(tc.expectedOutput)` | **No** — validación por `includes()` en cliente |
| **Datasets de ejercicios** | Archivos estáticos en `src/content/modules/**/lesson.md` | Contenido pre-existente, no generado por IA | **No** — solo lectura local |

> Pyodide no es IA generativa (ver `POLITICA_GOBERNANZA_IA.md §3`). No hay `openai`/`anthropic`/`cohere` en `package.json:18-47` (`grep vacío openai|anthropic|langchain` en `src/`).

---

## 5. Transferencias internacionales — resumen art. 26

**Responsable:** Persona natural Colombia (territorio Ley 1581). **Encargados con transferencia:** 3 en EE. UU. (Clerk, Supabase/AWS, Vercel). **Terceros técnicos:** 2 redes Anycast sin datos personales (jsDelivr, PyPI).

**Requisitos art. 26 habilitados en la implementación:**

| Requisito | Estado | Evidencia |
|---|---|---|
| Autorización con mención expresa "transferencia a EE. UU. (Clerk/Supabase/Vercel)" | ✅ | `AuthForm.tsx:18` `getConsentText()` incluye "proveedores tecnológicos ubicados en Estados Unidos (Clerk, Supabase y Vercel)" + `domain/consent.ts:11` `TRANSFER_EEUU` obligatorio |
| Consentimiento granular separado para `gender:x` (sensible art. 6) | ✅ | `AuthForm.tsx:57` `acceptGenderX` + `domain/consent.ts:15` `GENDER_X` + webhook gate `route.ts:60` |
| Contrato con garantías (DPA) | ⚠️ Plantilla | `legal/dpa-register.md` v1 con URLs y pasos; pendiente firma y `sha256sum legal/receipts/*.pdf` |
| Información al Titular (país destino) | ✅ | `POLITICA_PRIVACIDAD.md §5` + `/privacidad` + `/aviso` |
| Registro RNBD | ⚠️ Pendiente | `retention-policy.md §2` 7 bases por inscribir en `https://rnbd.sic.gov.co` (Decreto 1074 Título 3) |

---

## 6. Retención y purga — flujos programados

| Flujo | Disparador | Acción | Estado | Evidencia |
|---|---|---|---|---|
| **P1 `codeSnapshot` 60 d** | `lab_progress.updated_at < NOW()-60d` o `completed` | `UPDATE lab_progress SET last_position='{}'` | **Norma documental** (sin job físico) | `retention-policy.md §3 P1` · `migration.sql:315,337` |
| **P2 Inactividad 24 m** | `profiles.last_active_at < NOW()-24m` | Aviso si `notification_prefs.email=true`; 15 d sin reacción → anonimizar PII (preserva `id`) | **Norma documental** | `retention-policy.md §3 P2` · `migration.sql:28-29` |
| **P3 Supresión art. 8** | `DELETE /api/account` o `invitro.code@gmail.com` o `user.deleted` webhook | Cascade 7 tablas + `storage.remove()` + `clerkClient.deleteUser` (≤15 d hábiles) | **Implementado** | `account/route.ts:11-45` · `webhooks/clerk/route.ts:105-126` |
| **P4 `pending` 24 h** | `consent_status=pending ∧ pending_since < NOW()-24h` | `GET /api/cron/purge-pending` → `purgeUser()` (cascade + Clerk) | **Implementado** | `cron/purge-pending/route.ts:60-80` + `vercel.json:4` cron `0 3 * * *` + `domain/consent.ts:21` `PENDING_TTL_HOURS=24` |

---

*Flujo 2026-10-16-v1 — cada fase cita `archivo:línea`. Un nuevo proveedor, nuevo bucket o nuevo header `x-*` obliga a re-auditar y versionar.*

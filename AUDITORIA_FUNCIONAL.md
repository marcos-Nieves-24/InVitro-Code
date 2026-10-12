# Auditoría Funcional — InVitro-Code

- **Fecha:** 2026-10-11
- **Repo:** `invitro-code` (worktree `presentation-reemplazo-directo`)
- **Alcance:** flujos funcionales por lectura de código + evidencia de checks automáticos ya ejecutados hoy. **No se ejecutó la app contra producción** y **no se tocó git**.
- **Método:** verificación estática (lectura de rutas, middleware, workers), correlación con docs (AGENTS.md, README, openspec/config.yaml, ADRs) y resultados de `npm run type-check` / `test` / `build` de hoy.
- **Nota de formato:** cada hallazgo usa el contrato `ID | categoría | estado | descripción | evidencia | impacto | prioridad | solución | archivos | criterio de aceptación | prueba`.

---

## 1. Evidencia de checks automáticos (2026-10-11)

| Check | Resultado | Evidencia |
|-------|-----------|-----------|
| `npm run type-check` | **OK, sin errores** (tsc --noEmit) | salida limpia del día |
| `npm run test` | **19 archivos / 187 tests, todos PASS** (vitest 4.1.10, env node) | salida del día |
| `npm run build` | **Exitoso, 30 rutas** (incluye `/laboratorios/[module]/[lesson]`, `/proyectos/[module]/[lesson]`, `/admin`, 16 APIs, `/preview/*`, `(legal)`) | salida del día |

> La documentación declara 6 archivos / 37 tests: **desactualizada** (ver `FN-GOV-01`).

---

## 2. Resumen por prioridad

| Prioridad | IDs | Cantidad |
|-----------|-----|----------|
| **P1** | FN-ACC-01, FN-CRON-01 | 2 |
| **P2** | FN-AUTH-03, FN-PROG-02, FN-LAB-02, FN-BK-02, FN-CER-01, FN-E2E-01, FN-UI-01, FN-GOV-01 | 8 |
| **P3** | FN-AUTH-01, FN-AUTH-02, FN-PROG-01, FN-LAB-01, FN-BK-01, FN-BK-03, FN-NAV-01, FN-PRE-01, FN-CONT-01, FN-CONT-02, FN-GOV-02 | 11 |
| **P0** | — | 0 |

---

## 3. Hallazgos

### FN-AUTH-01
- **categoría:** seguridad / control de acceso
- **estado:** OK
- **descripción:** Contrato de rutas correcto. `publicRoutes` explícitas (inicio, `/sign-in`, `/sign-up`, `/sso-callback`, webhook Clerk, `/api/diagnose`, `/api/cron/purge-pending`, legales, `/ia`, `/preview/cards`). Todo lo demás exige sesión: API sin sesión → `401 {error:"Authentication required"}`; página sin sesión → redirect a `/sign-in?redirect_url=<ruta>`.
- **evidencia:** `src/middleware.ts:5-19` (lista pública), `:45-58` (401 en API / redirect en páginas).
- **impacto:** ninguno; contrato de autenticación consistente.
- **prioridad:** P3 (informativo)
- **solución:** mantener; cubrir con E2E (FN-E2E-01).
- **archivos:** `src/middleware.ts`
- **criterio de aceptación:** request a `/api/*` sin sesión responde 401; request a página protegida redirige a `/sign-in` con `redirect_url`.
- **prueba:** lectura de código + E2E manual propuesto.

### FN-AUTH-02
- **categoría:** seguridad / autorización
- **estado:** OK
- **descripción:** Acceso admin **fail-closed**. Para `/admin` y `/api/admin`: primero lee el rol desde el JWT de Clerk (`publicMetadata.role` / `metadata.role`); si no hay claim, hace fallback a DB vía service-role (`profiles.role`). Si el rol efectivo ≠ `admin` → `403` (API) o redirect `/dashboard` (página). Sin claim y sin fila en DB (`data?.role !== "admin"`) → deniega.
- **evidencia:** `src/middleware.ts:61-102` (bloque admin, claims `:66-77`, fallback DB `:87-92`, denegación `:94-100`).
- **impacto:** portal admin protegido; no hay bypass por defecto.
- **prioridad:** P3 (informativo)
- **solución:** añadir test de claims (rol admin vs no-admin) para blindar regresiones.
- **archivos:** `src/middleware.ts`
- **criterio de aceptación:** request sin rol admin a `/admin` y `/api/admin/*` recibe 403/redirect; con rol admin pasa.
- **prueba:** test de integración mockeando `session.sessionClaims` y respuesta de `profiles`.

### FN-AUTH-03
- **categoría:** verificación funcional
- **estado:** NO_AUDITADO
- **descripción:** El flujo completo de sign-in/sign-up y `sso-callback` (OAuth con proveedor real) **no se ejecutó en vivo**. La ruta `sso-callback` está declarada pública pero el recorrido real (redirección del proveedor → creación de `profile` → aterrizaje) no está probado.
- **evidencia:** `src/middleware.ts:9` (sso-callback pública); no hay ejecución con credenciales OAuth reales.
- **impacto:** fricción no detectada en onboarding (redirect de OAuth, alta de perfil) podría llegar a producción sin cobertura.
- **prioridad:** P2
- **solución:** ejecutar registro OAuth end-to-end en staging y cubrirlo con Playwright.
- **archivos:** `src/middleware.ts`, rutas de Clerk.
- **criterio de aceptación:** un usuario nuevo completa OAuth y aterriza autenticado con `profile` creado.
- **prueba:** E2E (ver FN-E2E-01, flujo 1).

### FN-PROG-01
- **categoría:** integridad de datos / controles de escritura
- **estado:** OK
- **descripción:** `POST /api/progress` aplica tres controles correctos: (a) **XP server-authoritative** — el cliente puede pedir menos, nunca más (`xp = min(requested, serverXp)`); (b) **consent gate art.9** — `consent_status === "pending"` bloquea la escritura con `403` (solo POST; GET permitido); (c) **rate limit** 100 req / 15 min por usuario (`429` con `Retry-After`). Además exige `auth()` y valida `module_slug`/`lesson_slug` contra el catálogo, e ignora cualquier `user_id` de cuerpo (deriva sólo de sesión). Upsert idempotente sobre `(user_id, module_slug, lesson_slug)`; ADR 003 fija Next.js como único writer.
- **evidencia:** `src/app/api/progress/route.ts:43` (rate), `:81-88` (consent), `:90-93` (XP), `:66-74` (allowlist slugs), `:95-109` (upsert idempotente), `:38,99` (identidad desde auth). ADR: `docs/adr/003-single-writer-progress.md`.
- **impacto:** escritura de progreso resistente a manipulación de XP y a spam.
- **prioridad:** P3 (informativo)
- **solución:** añadir unit tests de `min(requested, serverXp)` y del consent gate con mock de Supabase.
- **archivos:** `src/app/api/progress/route.ts`
- **criterio de aceptación:** POST con `xp_earned > serverXp` persiste `serverXp`; profile `pending` responde 403; requé-101 responde 429.
- **prueba:** unit test con mock de `createAdminClient`.

### FN-PROG-02
- **categoría:** verificación funcional
- **estado:** NO_AUDITADO (estado esperado correcto)
- **descripción:** La **persistencia tras recarga** y el **aislamiento entre usuarios** son correctos *por diseño* (upsert idempotente + `user_id` siempre desde `auth()`), pero **no hay test unitario que ejercite `api/progress`, `api/bookmarks`, `lab-progress` ni escenarios de `user_id`/aislamiento** (grep en `src/__tests__` sin coincidencias). Persistencia y no-fuga entre usuarios no están probados de forma automatizada.
- **evidencia:** `src/app/api/progress/route.ts:95-109`; `grep "api/progress|bookmarks|user_id" src/__tests__` → **sin matches**.
- **impacto:** confianza basada en diseño, no en prueba; una regresión en la derivación de `user_id` pasaría inadvertida.
- **prioridad:** P2
- **solución:** test de integración (mock Supabase) + E2E: usuario A completa lección → recarga → persiste; datos de A invisibles para B.
- **archivos:** `src/app/api/progress/route.ts`, suites de test nuevas.
- **criterio de aceptación:** escritura de A sobrevive recarga; lectura de B no muestra filas de A.
- **prueba:** E2E (FN-E2E-01 flujos 2 y 3) + test de integración.

### FN-LAB-01
- **categoría:** robustez de entrada
- **estado:** OK
- **descripción:** `POST /api/lab-progress` valida con **zod** (`labProgressPostSchema`), aplica **allowlist de filesystem** (`getLessonSlugs`), **strip de `user_id` inyectado**, **consent gate art.9** (POST) y **rate limit** 100/15min. Protege `last_position` (cap ≤8KB) y hace la completitud **sticky** (un lab `completed` no baja a `in_progress`).
- **evidencia:** `src/app/api/lab-progress/route.ts:98` (zod), `:118-121` (allowlist), `:131-138` (consent), `:73-76` (strip user_id), `:60` (rate), `:156-164` (sticky completed).
- **impacto:** entrada saneada; progreso de lab íntegro.
- **prioridad:** P3 (informativo)
- **solución:** unit tests del schema y de la regla sticky.
- **archivos:** `src/app/api/lab-progress/route.ts`
- **criterio de aceptación:** payload inválido → 400; `completed` no se degrada; `last_position` capped.
- **prueba:** unit test de `labProgressPostSchema` + `capLastPosition`.

### FN-LAB-02
- **categoría:** integridad de datos
- **estado:** RIESGO
- **descripción:** Al completar un lab hay **dual-write best-effort sin transacción** a `progress` (+ avance de streak). Si el upsert secundario a `progress` falla, `lab_progress` queda `completed` pero `progress`/XP/streak no se actualizan: **divergencia silenciosa** (sólo `console.error`), y el handler devuelve `200 {data}` igual.
- **evidencia:** `src/app/api/lab-progress/route.ts:211-239` (dual-write, errores sólo logueados).
- **impacto:** XP, racha y logros pueden quedar desincronizados del progreso real del lab tras un fallo parcial; el usuario percibe éxito.
- **prioridad:** P2
- **solución:** transacción/compensación o job de reconciliación; no devolver éxito opaco si el dual-write falla; alertar.
- **archivos:** `src/app/api/lab-progress/route.ts`
- **criterio de aceptación:** si el upsert a `progress` falla, se registra/reconcilia o se refleja el fallo; `lab_progress` y `progress` convergen.
- **prueba:** test de integración inyectando fallo en el upsert secundario.

### FN-BK-01
- **categoría:** seguridad / robustez
- **estado:** OK
- **descripción:** `POST /api/bookmarks` hace **strip del `user_id` inyectado** (se descarta y se deriva de `auth()`) y valida contra **allowlist de filesystem** (`getLessonSlugs`). `GET`/`DELETE` derivan `user_id` sólo de sesión y filtran por él (`.eq("user_id", userId)`).
- **evidencia:** `src/app/api/bookmarks/route.ts:73-77` (strip), `:88-92` (allowlist), `:26,183` (scoping por sesión).
- **impacto:** evita spoofing de ownership y filas basura.
- **prioridad:** P3 (informativo)
- **solución:** cubrir con unit test.
- **archivos:** `src/app/api/bookmarks/route.ts`
- **criterio de aceptación:** POST con `user_id` ajeno lo ignora y usa el de sesión; slug inexistente → 400.
- **prueba:** unit test con mock Supabase.

### FN-BK-02
- **categoría:** resiliencia / abuso
- **estado:** RIESGO
- **descripción:** El **rate limit solo aplica a POST** (`50/15min`); `GET` (`:13-46`) y `DELETE` (`:123-195`) **no tienen throttle**. DELETE permite borrar bookmarks propios en ráfaga sin límite (impacto acotado porque requiere sesión y sólo afecta datos propios).
- **evidencia:** `src/app/api/bookmarks/route.ts:58` (rate sólo en POST); ausencia de `checkRateLimit` en GET/DELETE.
- **impacto:** superficie de abuso menor (operaciones autenticadas sobre datos propios); riesgo bajo.
- **prioridad:** P2
- **solución:** aplicar `checkRateLimit` también a `DELETE` (y opcionalmente `GET`).
- **archivos:** `src/app/api/bookmarks/route.ts`
- **criterio de aceptación:** DELETE por encima del umbral responde 429 con `Retry-After`.
- **prueba:** test de rate-limit sobre DELETE.

### FN-BK-03
- **categoría:** calidad de código
- **estado:** RIESGO
- **descripción:** En `DELETE`, el bloque `:163-172` es **código muerto/engañoso**: usa `request.clone?.()` dentro de una expresión que siempre evalúa a `null` (`const body = await request.clone?.() ? null : null`) y no tiene efecto. La lógica de fallback de parseo queda confusa.
- **evidencia:** `src/app/api/bookmarks/route.ts:163-172`.
- **impacto:** mantenibilidad; riesgo de confusión en futuros cambios.
- **prioridad:** P3
- **solución:** eliminar el bloque muerto y simplificar el parseo query/body.
- **archivos:** `src/app/api/bookmarks/route.ts`
- **criterio de aceptación:** DELETE funciona vía query y vía body sin código residual.
- **prueba:** unit test de DELETE (query, body, mixto) + revisión.

### FN-CER-01
- **categoría:** funcionalidad simulada + documentación
- **estado:** DESACTUALIZADO (doc) / SIMULADO (función)
- **descripción:** `/api/certify` con `FEATURE_FLAG_CERTIFY=true` responde **siempre** `certified:true, testsPassed:3` **sin ejecutar código** (stub E2B). Sin el flag (default) responde `503`. Es funcionalidad de certificación **simulada (P2/P3)**. La doc `AGENTS.md:34` afirma "MVP stub que siempre retorna `certified:true`", lo cual **ya no es cierto** (el default es 503).
- **evidencia:** `src/app/api/certify/route.ts:22-27` (503 default), `:50-56` (stub siempre-pass). Doc: `AGENTS.md:34`.
- **impacto:** la certificación no evalúa código real; el flag protege el default, pero la doc induce a error.
- **prioridad:** P2
- **solución:** integrar E2B real y retirar el pass simulado; actualizar `AGENTS.md:34`.
- **archivos:** `src/app/api/certify/route.ts`, `AGENTS.md`
- **criterio de aceptación:** con flag on y código real, corre en sandbox E2B y refleja el resultado real; AGENTS.md describe el comportamiento real (flag-gated, default 503).
- **prueba:** test de integración E2B + revisión de doc.

### FN-ACC-01
- **categoría:** cumplimiento / integridad de datos (supresión art.8, Ley 1581)
- **estado:** RIESGO
- **descripción:** `DELETE /api/account` ejecuta una **cascada secuencial best-effort sin transacción**: borra 7 tablas (`lab_progress`, `progress`, `reflection_completions`, `streaks`, `user_achievements`, `consent_logs`, `profiles`) + storage `avatars`, y elimina el usuario de Clerk al final (también best-effort). Si un delete intermedio falla, queda **estado parcial con datos residuales**, pero la respuesta igual es `200 {deleted:true}`. Además borra `consent_logs`, lo que puede eliminar la trazabilidad de la propia supresión.
- **evidencia:** `src/app/api/account/route.ts:18-31` (cascada sin transacción), `:33-43` (Clerk best-effort), `:45-46` (200 incondicional).
- **impacto:** posible incumplimiento de supresión efectiva (datos residuales) y respuesta 200 engañosa; riesgo de cumplimiento.
- **prioridad:** P1
- **solución:** envolver en transacción (RPC/`pg`) o verificar cada paso; no devolver 200 si quedan datos; registrar fallos; considerar conservar un tombstone mínimo de `consent_logs` para acreditar la supresión.
- **archivos:** `src/app/api/account/route.ts`
- **criterio de aceptación:** si cualquier delete falla, la respuesta no es 200 exitosa y quedan 0 filas residuales del usuario tras el proceso exitoso.
- **prueba:** test inyectando fallo en un delete + E2E de supresión con verificación de tablas.

### FN-CRON-01
- **categoría:** disponibilidad / scheduling
- **estado:** RIESGO
- **descripción:** `vercel.json` define 3 crons. Los handlers validan `Authorization: Bearer ${CRON_SECRET}`, pero **el middleware corre primero** sobre todas las rutas `/api/*`. `daily-nudge` y `recharge-freezes` **no están en `publicRoutes`**: al ser invocados por Vercel Cron (sin sesión Clerk) el middleware responde `401` antes de llegar al handler. **Sólo `purge-pending` está en `publicRoutes`** y funciona.
- **evidencia:** `vercel.json:1-16` (3 crons); `src/middleware.ts:12` (sólo purge-pending pública), `:45-54` (401 a API sin sesión); `src/app/api/cron/daily-nudge/route.ts:37` y `recharge-freezes/route.ts:26` (su propio 401 nunca alcanzado). Cross-ref: AUDITORIA_SEGURIDAD (archivo no presente en este worktree; verificado aquí de forma independiente).
- **impacto:** los crons de **nudge diario** y **recarga de freezes** no se ejecutan (401), funcionalidad programada caída.
- **prioridad:** P1
- **solución:** añadir `/api/cron/daily-nudge` y `/api/cron/recharge-freezes` a `publicRoutes` (o hacer bypass de middleware cuando el header de cron coincide con `CRON_SECRET`).
- **archivos:** `vercel.json`, `src/middleware.ts`
- **criterio de aceptación:** request de cron con `Bearer` válido supera el middleware y ejecuta el handler (200); sin header válido sigue denegado.
- **prueba:** invocación local con header `Authorization: Bearer <CRON_SECRET>` y verificación de ejecución.

### FN-NAV-01
- **categoría:** navegación
- **estado:** OK
- **descripción:** `AppSidebar` expone **11 ítems** y **todos apuntan a rutas con `page.tsx` existente**: `/`, `/learn`, `/laboratorios`, `/proyectos`, `/niveles`, `/dashboard`, `/logros`, `/comunidad`, `/perfil`, `/configuracion`, `/admin`. El ítem `Admin` se filtra por `userRole === "admin"`. No se detectan enlaces rotos; `learn/Sidebar` sin observaciones.
- **evidencia:** `src/components/layout/AppSidebar.tsx:39-76` (ítems), `:97-102` (filtro admin); rutas confirmadas en `src/app/**` (p. ej. `(dashboard)/{dashboard,admin,laboratorios,proyectos,niveles,logros,comunidad,perfil,configuracion}/page.tsx`, `learn/page.tsx`, `page.tsx`).
- **impacto:** navegación íntegra.
- **prioridad:** P3 (informativo)
- **solución:** opcional: script de CI que valide `href` del sidebar contra rutas existentes.
- **archivos:** `src/components/layout/AppSidebar.tsx`
- **criterio de aceptación:** cada `href` del sidebar resuelve a un `page.tsx`.
- **prueba:** verificación de rutas (script o build).

### FN-PRE-01
- **categoría:** consistencia de acceso
- **estado:** INCONSISTENTE
- **descripción:** `/preview/cards` es **pública** (en `publicRoutes`) y usa datos reales del filesystem + progreso mock; `/preview/bioreactor` **no está en `publicRoutes`**, por lo que exige login (redirige a `/sign-in`). Dos páginas de demo con políticas de acceso distintas.
- **evidencia:** `src/app/preview/cards/page.tsx:1-4` (sin auth, mock); `src/middleware.ts:18` (sólo cards pública); `src/app/preview/bioreactor/page.tsx:1` (`"use client"`, no pública).
- **impacto:** demos con distinta exposición; la pública filtra estructura de contenido.
- **prioridad:** P3
- **solución:** unificar política (ambas públicas con datos mock, o ambas privadas).
- **archivos:** `src/middleware.ts`, `src/app/preview/*`
- **criterio de aceptación:** el acceso sin sesión a `/preview/cards` y `/preview/bioreactor` sigue la misma política.
- **prueba:** request sin sesión a ambas rutas.

### FN-CONT-01
- **categoría:** contenido / entregas
- **estado:** OK
- **descripción:** Contenido evaluativo y práctico presente: `ChoiceQuestion` evaluativa en lecciones `ia` lesson01–04 (conteos ≈ l1=7, l2=13, l3=11, l4=12), con `notebook.ipynb` y `lab.md` reales por lección.
- **evidencia:** `src/content/modules/ia/lessons/lesson0{1-4}_*/lesson.md` (ocurrencias `<ChoiceQuestion`); estructura de lección documentada en `AGENTS.md`.
- **impacto:** entregas/evaluaciones cubren teoría (choice) y práctica (lab/notebook).
- **prioridad:** P3 (informativo)
- **solución:** mantener; validar render MDX en build.
- **archivos:** `src/content/modules/ia/...`
- **criterio de aceptación:** cada `ChoiceQuestion` renderiza y valida respuesta; labs/notebooks cargan.
- **prueba:** build + revisión MDX.

### FN-CONT-02
- **categoría:** contenido / trazabilidad
- **estado:** RIESGO (bajo)
- **descripción:** Hay `references.bib` por lección (ia, estadística, etc.), pero **sin archivos locales**: no hay campos `file = {...}`; las entradas dependen de URLs/DOI externos.
- **evidencia:** `grep "file ?=" src/content/**/*.bib` → **sin matches**; entradas del tipo `@book/@article` en `src/content/modules/ia/lessons/lesson01_what_is_ai/references.bib:1-43`.
- **impacto:** referencias no resolubles offline; trazabilidad académica incompleta sin red.
- **prioridad:** P3
- **solución:** documentar que requieren red, o añadir copias locales/DOIs estables.
- **archivos:** `src/content/**/references.bib`
- **criterio de aceptación:** cada entrada es resolvible (URL/DOI alcanzable o copia local).
- **prueba:** revisión de entradas.

### FN-E2E-01
- **categoría:** verificación end-to-end
- **estado:** NO_AUDITADO
- **descripción:** **No hay e2e configurado** (sin Playwright; `openspec/config.yaml` declara `e2e.available:false`). Los flujos críticos **no están probados extremo a extremo**: (1) registro/sign-in con OAuth, (2) aislamiento entre usuarios, (3) persistencia de progreso tras recarga.
- **evidencia:** `openspec/config.yaml:56` (`e2e.available:false`); ausencia de configuración Playwright.
- **impacto:** regresiones en flujos críticos no las detecta el CI.
- **prioridad:** P2
- **solución:** introducir Playwright con los 3 flujos y ejecutarlos en staging.
- **archivos:** `openspec/config.yaml`, specs e2e nuevos.
- **criterio de aceptación:** los 3 flujos pasan en staging (registro → profile; A no ve datos de B; completar lección → recargar → persiste).
- **prueba:** suite Playwright (nueva).

### FN-UI-01
- **categoría:** robustez UX (estados de carga/error)
- **estado:** RIESGO
- **descripción:** Sólo existe **un** `error.tsx` (`src/app/learn/[module]/[slug]/error.tsx`) y **no hay ningún `loading.tsx`** en `src/app`. Las rutas que leen de Supabase/dinámicas (dashboard, learn, laboratorios, proyectos, admin, perfil, etc.) **no tienen estado de carga ni de error propios**: dependen del default de Next (spinner/500 genérico) o de nada.
- **evidencia:** `glob src/app/**/loading.tsx` → **0 archivos**; `glob src/app/**/error.tsx` → **1 archivo** (`learn/[module]/[slug]/error.tsx`).
- **impacto:** UX pobre en carga y en fallos de datos (errores genéricos sin reintentar) en la mayoría de rutas.
- **prioridad:** P2
- **solución:** añadir `loading.tsx` (skeleton) y `error.tsx` (con reintentar) en las rutas clave que fetchean datos.
- **archivos:** `src/app/**/{loading,error}.tsx`
- **criterio de aceptación:** cada ruta con fetch muestra skeleton al cargar y UI de error con acción de reintento al fallar.
- **prueba:** revisión + build + (opcional) test de render.

### FN-GOV-01
- **categoría:** gobernanza / documentación
- **estado:** DESACTUALIZADO
- **descripción:** La doc declara "**6 archivos / 37 tests**", pero la medición de hoy es **19 archivos / 187 tests**. Apariciones desactualizadas en `openspec/config.yaml` (2), `AGENTS.md` y `README.md` (2).
- **evidencia:** `openspec/config.yaml:14` y `:66-68`; `AGENTS.md:10`; `README.md:24` y `:33`. Real: `npm run test` → 19 archivos / 187 tests (día de hoy).
- **impacto:** planificación SDD y expectativas de cobertura mal informadas; gobernanza desalineada.
- **prioridad:** P2
- **solución:** actualizar los conteos en los cuatro sitios. **Nota adicional:** el estado de *coverage* también es inconsistente entre documentos (`AGENTS.md:10` dice "no configurado"; `README.md:33` afirma v8, 90%+; `openspec/config.yaml:58-60` dice disponible). Homogeneizar.
- **archivos:** `openspec/config.yaml`, `AGENTS.md`, `README.md`
- **criterio de aceptación:** los conteos coinciden con la salida real de `npm run test`; el estado de coverage es consistente entre los tres archivos.
- **prueba:** re-ejecutar `npm run test` y cotejar.

### FN-GOV-02
- **categoría:** gobernanza / documentación
- **estado:** DESACTUALIZADO (menor)
- **descripción:** El ADR 003 menciona en su verificación "build (28 rutas)"; el build actual lista **30 rutas**. Deriva menor de documentación.
- **evidencia:** `docs/adr/003-single-writer-progress.md:40` ("28 rutas"); `npm run build` → 30 rutas (hoy).
- **impacto:** dato histórico levemente desalineado; sin impacto funcional.
- **prioridad:** P3
- **solución:** actualizar la nota de verificación del ADR o marcarla como histórica.
- **archivos:** `docs/adr/003-single-writer-progress.md`
- **criterio de aceptación:** la cifra citada coincide con el build actual o se etiqueta como histórico.
- **prueba:** build + revisión del ADR.

---

## 4. Metodología y limitaciones

- **No se ejecutó la app contra producción**; la verificación fue estática (lectura de rutas, middleware, worker y tests) más los resultados de `type-check` / `test` / `build` ya ejecutados hoy.
- Los flujos marcados **NO_AUDITADO** (AUTH-03, PROG-02, E2E-01) requieren ejecución real: registro OAuth, aislamiento entre usuarios y persistencia. Se propone el método en cada hallazgo.
- **AUDITORIA_SEGURIDAD** no está presente en este worktree; el bloqueo de crons por middleware (FN-CRON-01) se verificó aquí de forma independiente sobre `src/middleware.ts` y los handlers de cron.
- No se modificó git ni se ejecutó `npm install`.

## 5. Próximos pasos sugeridos (orden)

1. **P1:** desbloquear crons nudge/freezes (FN-CRON-01).
2. **P1:** transaccionar/verificar la cascada de borrado de cuenta (FN-ACC-01).
3. **P2:** configurar Playwright con los 3 flujos críticos (FN-E2E-01) que cubre además FN-AUTH-03/FN-PROG-02.
4. **P2:** estados `loading`/`error` en rutas con datos (FN-UI-01) y rate limit en DELETE de bookmarks (FN-BK-02).
5. **P2:** integrar E2B real en certify y actualizar doc (FN-CER-01); refrescar conteos de tests en la doc (FN-GOV-01).

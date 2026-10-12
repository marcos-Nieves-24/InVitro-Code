# Auditoría de Seguridad — InVitro-Code

**Fecha:** 2026-10-11
**Alcance:** `src/`, `supabase-migration.sql`, `vercel.json`, `.gitignore`, `legal/security-audit.md`
**Método:** auditoría **estática** por lectura directa de fuentes (`read` con offset + `grep` con contexto). **No se ejecutaron pruebas de intrusión activas ni explotación contra entornos vivos** — ninguna está autorizada. Los `curl` documentados son **hipótesis de reproducibilidad** derivadas de la lectura del código, no ejecuciones contra el despliegue.
**Fuente de verdad:** el código verificado. `legal/security-audit.md` (2026-10-06) se reconcilia en HX-DOC-15 y contiene afirmaciones **stale**.
**Sin mutación:** este documento no modifica código, git ni dependencias.

---

## Resumen ejecutivo

**18 hallazgos — 1 × P0, 6 × P1, 7 × P2, 4 × P3.**

| Prioridad | Cantidad | Hallazgos |
|---|---|---|
| **P0** | 1 | HX-CRON-01 |
| **P1** | 6 | HX-CRON-02, HX-RATE-03, HX-DATA-05, HX-SUP-06, HX-AUTH-07, HX-DIAG-08 |
| **P2** | 7 | HX-PRIV-09, HX-SEC-10, HX-ARCH-11, HX-ARCH-12, HX-SEC-13, HX-SEC-14, HX-DOC-15 |
| **P3** | 4 | HX-AUTH-16, HX-SEC-17, HX-SEC-18, HX-DATA-19 |

**Postura: PARCIALMENTE SEGURA.** La base es sólida — Clerk como único proveedor de identidad, RLS comparando `auth.jwt() ->> 'sub'` contra columnas TEXT, verificación real de firma Svix, cero secretos commiteados — pero hay **un agujero P0**: un endpoint destructivo purga cuentas completas (borrado en Supabase + Clerk) y se puede invocar sin autenticación real. Sumado a los crons inalcanzables y a la ausencia de límite en el borrado de cuenta, el riesgo de destrucción de datos personales es alto.

**Tres acciones inmediatas, en orden:** (1) cerrar HX-CRON-01 exigiendo `Bearer CRON_SECRET` y removiendo la ruta de `publicRoutes`; (2) corregir HX-CRON-02 — hoy solo 1 de 3 crons es alcanzable; (3) transacción o compensación en HX-SUP-06, porque un fallo a mitad deja datos residuales del derecho de supresión (Ley 1581 art. 8).

---

## Hallazgos

### HX-CRON-01 | Cron destructivo sin autenticación real | P0 — Crítica

- **Categoría:** Broken Access Control (OWASP A01). **Estado:** ❌ No conforme — explotable.
- **Descripción:** `src/middleware.ts:12` declara `/api/cron/purge-pending` como ruta pública, así que el request llega al handler sin sesión de Clerk. `isAuthorized()` (`src/app/api/cron/purge-pending/route.ts:9-24`) acepta cualquiera de tres condiciones: (a) `Bearer CRON_SECRET` correcto — **válido**; (b) `vercelCronHeader !== null` — **la mera presencia del header `x-vercel-cron` autoriza**, sin validar valor ni procedencia; (c) `!cronSecret && NODE_ENV !== "production"` — **bypass total si `CRON_SECRET` no está configurado** fuera de producción. Si pasa, `purgeUser()` (`:26-55`) borra `lab_progress`, `progress`, `reflection_completions`, `streaks`, `user_achievements`, `consent_logs`, archivos del bucket `avatars` y `profiles`, y luego `clerkClient().users.deleteUser(id)`. Selecciona hasta 100 usuarios `consent_status = "pending"` con `pending_since` anterior al TTL (`:65-70`) y se ejecuta sobre `GET` (`:57`).
- **Evidencia:** `src/middleware.ts:12` → `"/api/cron/purge-pending",` dentro de `publicRoutes` (`:5-19`); `src/app/api/cron/purge-pending/route.ts:17-19` → `if (vercelCronHeader !== null) { return true; }`; `:20-22` → `if (!cronSecret && process.env.NODE_ENV !== "production") { return true; }`; `vercel.json:4-5` registra el cron `"0 3 * * *"`, confirmando que Vercel lo invoca periódicamente.
- **Reproducción (hipotética):**
  ```bash
  # A) Header spoofeado, sin credenciales
  curl -i -X GET "https://<host>/api/cron/purge-pending" -H "x-vercel-cron: 1"
  # → 200 OK y purga de usuarios pending hasta el TTL

  # B) Sin CRON_SECRET definido, fuera de producción
  curl -i "https://<preview>.vercel.app/api/cron/purge-pending"
  # → 200 OK, sin ninguna credencial
  ```
- **Impacto:** un atacante anónimo provoca borrado masivo e irreversible de cuentas y datos personales. La destrucción de `consent_logs` es especialmente grave: son la evidencia del cumplimiento Ley 1581 art. 9/art. 6 y su borrado deliberado puede leerse como obstaculización de la rendición de cuentas. Un `GET` destructivo además puede dispararse accidentalmente por cualquier escáner o rastreador.
- **Prioridad P0 — justificación:** destrucción de datos no autorizada, sin autenticación, alcanzable desde internet, con impacto irreversible y violación potencial de obligaciones legales de conservación. Es el único hallazgo con pérdida de datos masiva por actor no autenticado.
- **Solución propuesta:** (1) eliminar el bypass por `x-vercel-cron` — la presencia de un header no prueba origen; (2) eliminar la rama de bypass en no-producción: si falta `CRON_SECRET`, responder **503** y loguear; (3) remover la ruta de `publicRoutes` en `src/middleware.ts:12`; (4) cambiar `GET`→`POST` y añadir IP allowlist de Vercel; (5) proteger `consent_logs` con borrado lógico o retención mínima legal antes de eliminar.
- **Archivos afectados:** `src/app/api/cron/purge-pending/route.ts`, `src/middleware.ts`, `vercel.json`.
- **Criterio de aceptación medible:** con `CRON_SECRET=segredo`, `curl -H "x-vercel-cron: 1"` → **401** y `curl -H "Authorization: Bearer segredo"` → **200**; sin `CRON_SECRET`, en cualquier `NODE_ENV` → **503**, nunca 200; `grep -c "api/cron/purge-pending" src/middleware.ts` → **0**; `GET` sin headers → **401 o 405**.
- **Prueba para confirmar corrección:** repetir los `curl` A (debe dar 401) y B (debe dar 503); test unitario de `isAuthorized()` con los 4 casos; `npm run test` y `npm run build` limpios.

### HX-CRON-02 | Crons programados inalcanzables (401 antes del handler) | P1 — Alta

- **Categoría:** Security Misconfiguration. **Estado:** ❌ No conforme.
- **Descripción:** `vercel.json:2-14` registra 3 crons. El middleware (`src/middleware.ts:41-58`) exige sesión de Clerk para toda ruta fuera de `publicRoutes`, pero solo `/api/cron/purge-pending` está listada (`:12`). Los otros dos reciben **401 JSON del middleware** (`:50-53`) antes de ejecutar una línea del handler. Ambos handlers **sí** validan su secreto (`src/app/api/cron/daily-nudge/route.ts:8-22`, `:35-37`; `src/app/api/cron/recharge-freezes/route.ts:8-20`, `:24-26`) pero nunca llegan a correr.
- **Evidencia:** `grep -n "publicRoutes" -A 15 src/middleware.ts` — sin `daily-nudge` ni `recharge-freezes`; `src/middleware.ts:49-53` → `NextResponse.json({ error: "Authentication required" }, { status: 401 })`; `vercel.json:2-14` — los 3 crons existen.
- **Reproducción (hipotética):**
  ```bash
  curl -i "https://<host>/api/cron/daily-nudge" -H "Authorization: Bearer $CRON_SECRET"
  # → 401 {"error":"Authentication required"}  ← emitido por el middleware, no por el handler
  ```
- **Impacto:** recordatorios diarios y recarga semanal de freezes **nunca se ejecutan en producción**. Fallo silencioso: los crons "existen" en `vercel.json`, dando falsa sensación de control; nadie recibe alerta. Un mecanismo que se cree activo y no lo está es peor que no tenerlo.
- **Prioridad P1 — justificación:** degradación completa de dos funciones por configuración incorrecta, sin explotación necesaria y con fallo silencioso.
- **Solución propuesta:** (1) añadir `"/api/cron/daily-nudge"` y `"/api/cron/recharge-freezes"` a `publicRoutes`; (2) **unificar** la autorización en `src/lib/cron/auth.ts` con `isCronAuthorized(req)` que compare solo contra `CRON_SECRET`, eliminando 3 copias divergentes del mismo bug; (3) healthcheck `/api/cron/health` con alerta si un cron no corre en su ventana; (4) test de integración 200/401 por cron.
- **Archivos afectados:** `src/middleware.ts`, `src/app/api/cron/daily-nudge/route.ts`, `src/app/api/cron/recharge-freezes/route.ts`, (nuevo) `src/lib/cron/auth.ts`.
- **Criterio de aceptación medible:** `grep -c "api/cron/" src/middleware.ts` → **3**; `curl -H "Authorization: Bearer $CRON_SECRET"` a cada cron → **200**; `curl` sin header → **401 emitido por el handler** (cuerpo distinto de `{"error":"Authentication required"}`); `grep -rn "x-vercel-cron" src/ | wc -l` → **1**.
- **Prueba para confirmar corrección:** los 3 `curl` con y sin secreto (200/401); logs de Vercel mostrando ejecución real de los 3; `npm run test` y `npm run build`.

### HX-RATE-03 | Rate limit in-memory por instancia y cobertura parcial | P1 — Alta

- **Categoría:** Insecure Design (OWASP A04). **Estado:** ⚠️ Parcialmente conforme.
- **Descripción:** `src/lib/rate-limit.ts` (ventana fija en memoria, `:1-32`) tiene dos limitaciones graves. (1) **Estado por instancia**: `const store = new Map()` (`:5`) vive en el heap de cada instancia serverless; en Vercel cada invocación efímera puede caer en otra instancia, por lo que el conteo no es global y se reinicia en cada cold start — el archivo lo admite en `:1` (*"resetea al redeploy"*). (2) **Cobertura mínima**: solo 4 rutas POST lo usan (`bookmarks` 50, `progress` 100, `lab-progress` 100, `daily-goal` 20); `grep -rn checkRateLimit src/` da 5 coincidencias (definición + 4 llamadas). **`DELETE /api/account` no tiene ningún límite** (`src/app/api/account/route.ts:1-47` no referencia `checkRateLimit`), igual que `POST /api/profile/avatar`, `POST /api/certify`, `POST /api/consent` y los webhooks.
- **Evidencia:** `grep -rn "checkRateLimit" src/` → `src/lib/rate-limit.ts:12`, `src/app/api/bookmarks/route.ts:58`, `src/app/api/progress/route.ts:43`, `src/app/api/lab-progress/route.ts:60`, `src/app/api/profile/daily-goal/route.ts:39`; `src/app/api/account/route.ts:15-31` pasa directo de `auth()` a borrado en cascada. Las rutas con límite sí devuelven `429` + `Retry-After` (`src/app/api/bookmarks/route.ts:59-64`).
- **Reproducción (hipotética):**
  ```bash
  for i in $(seq 1 200); do curl -s -o /dev/null -w "%{http_code}\n" -X DELETE \
    "https://<host>/api/account" -b "<cookie-clerk>"; done | sort | uniq -c
  # → 200 ×200 (ningún 429)
  ```
- **Impacto:** abuso de recursos y manipulación de negocio — spam de `progress`/`lab-progress` para inflar XP y falsear el leaderboard (HX-PRIV-09), y `DELETE /api/account` en loop destruye cuentas legítimas de forma irreversible sin dejar rastro de limitación.
- **Prioridad P1 — justificación:** la protección existe pero es ineficaz a escala serverless y no cubre el endpoint más destructivo. No es P0 porque las rutas requieren credenciales válidas (el middleware las protege).
- **Solución propuesta:** (1) migrar a límite distribuido (`@upstash/ratelimit` + Redis, o Vercel Firewall en edge); (2) límite de 3/hora en `DELETE /api/account` antes de cualquier borrado, más reconfirmación de contraseña o 2.º factor; (3) extender a `avatar`, `certify`, `consent` y `webhooks/clerk` (este último con allowlist de IPs de Clerk); (4) clave `usuario + ruta + ventana`, siempre `429` + `Retry-After` + log.
- **Archivos afectados:** `src/lib/rate-limit.ts`, `src/app/api/account/route.ts`, `src/app/api/profile/avatar/route.ts`, `src/app/api/certify/route.ts`, `src/app/api/consent/route.ts`, `src/app/api/webhooks/clerk/route.ts`, `package.json`.
- **Criterio de aceptación medible:** 200 requests desde ≥3 instancias producen `429` tras el umbral (límite **global**, no por instancia); el 4.º `DELETE /api/account` en 1 hora → `429` + `Retry-After`; `grep -rn "checkRateLimit\|ratelimit" src/app/api | wc -l` → **≥ 8**; p95 del límite < 20 ms.
- **Prueba para confirmar corrección:** script de carga con 500 requests repartidos en 3 instancias verificando que los éxitos no superan el límite; test de integración del límite en `account`.

### HX-DATA-05 | Tabla `modules` sin RLS | P1 — Alta

- **Categoría:** Broken Access Control (OWASP A01). **Estado:** ❌ No conforme.
- **Descripción:** `supabase-migration.sql` crea 10 tablas; nueve tienen `ALTER TABLE … ENABLE ROW LEVEL SECURITY`. **`modules` (`:276-283`) es la única sin ninguna sentencia de RLS**, por lo que hereda el comportamiento por defecto de Postgres: sin RLS habilitada, cualquier cliente con la anon key puede **leer y escribir** la tabla completa.
- **Evidencia:** `grep -n "ENABLE ROW LEVEL SECURITY" supabase-migration.sql` → 52 (profiles), 76 (progress), 102 (streaks), 129 (reflection_completions), 186 (achievements), 201 (user_achievements), 320 (lab_progress), 425 (consent_logs), 514 (bookmarks) — **ninguna para `modules`**; `supabase-migration.sql:276-283` → `CREATE TABLE IF NOT EXISTS modules (slug TEXT PRIMARY KEY, name TEXT, lesson_count INTEGER, updated_at TIMESTAMPTZ …)` + seed `:286-293`, sin política; la tabla se lee con service-role en `src/lib/gamification/achievements.ts:55` y `src/lib/gamification/activity.ts:164`.
- **Reproducción (hipotética, proyecto Supabase de prueba):** `select * from modules;` con rol anon → devuelve todas las filas; `update modules set lesson_count = 999 where slug = 'ia';` → escritura aceptada.
- **Impacto:** la tabla solo contiene metadatos públicos de contenido (**sin datos personales**), por lo que el riesgo de confidencialidad es bajo; el riesgo real es de **integridad**: alterar `lesson_count` degrada el contenido y permite enumeración. La escritura anónima es el aspecto grave.
- **Prioridad P1 — justificación:** escritura no autorizada en un recurso del sistema. Por la baja sensibilidad de los datos no es P0, pero es la **única** tabla sin RLS y su existencia invalida la garantía de "todas las tablas con RLS".
- **Solución propuesta:** (1) añadir tras `:283`: `ALTER TABLE modules ENABLE ROW LEVEL SECURITY;` + `CREATE POLICY "modules readable by authenticated" ON modules FOR SELECT USING ((auth.jwt() ->> 'sub') IS NOT NULL);`; (2) escritura solo vía service-role en migraciones/seed, sin policies de `INSERT`/`UPDATE`; (3) query de verificación que afirme RLS en las 10 tablas.
- **Archivos afectados:** `supabase-migration.sql` (aplicación manual en SQL editor).
- **Criterio de aceptación medible:** `grep -c "ENABLE ROW LEVEL SECURITY" supabase-migration.sql` → **10**; con anon key, `select` y `update` sobre `modules` → **permission denied**; con service-role, lectura de conteos sigue funcionando (tests de gamificación verdes).
- **Prueba para confirmar corrección:** aplicar la migración en Supabase de staging; script Node con anon key intentando leer y escribir `modules` (ambos deben fallar); verificar que la app sigue mostrando conteos de lecciones.

### HX-SUP-06 | Cascadas de borrado sin transacción ni compensación | P1 — Alta

- **Categoría:** Insecure Design / atomicidad de operaciones destructivas. **Estado:** ❌ No conforme.
- **Descripción:** tres recorridos repiten la misma cadena "best-effort" **sin transacción**: `src/app/api/account/route.ts:15-31` (DELETE autoservicio), `src/app/api/webhooks/clerk/route.ts:110-123` (webhook `user.deleted`) y `src/app/api/cron/purge-pending/route.ts:26-55` (`purgeUser`). Cada `delete()` es independiente: si uno falla, los anteriores ya están aplicados y el flujo continúa (comentario `:17`: *"Best-effort sequential cascade, log without aborting"*). El estado resultante puede ser `profiles` borrado con `consent_logs` intacto, o filas huérfanas sin perfil. Peor: en `account/route.ts:33-43`, si Supabase tiene éxito pero `client.users.deleteUser()` falla, se responde **`200 {deleted:true}`** — el usuario cree que su cuenta fue eliminada cuando el usuario de Clerk sigue existiendo, contradiciendo el derecho de supresión que el propio comentario `:7` invoca (Ley 1581 art. 8).
- **Evidencia:** `src/app/api/account/route.ts:15-31` — 7 `await admin.from(...).delete()` sin `BEGIN`/`COMMIT` ni `rpc` transaccional; `:33-43` — `catch` que solo hace `console.warn` y devuelve 200; `src/app/api/webhooks/clerk/route.ts:110-123` y `src/app/api/cron/purge-pending/route.ts:26-55` replican la cadena por segunda y tercera vez; `supabase-migration.sql` no tiene función `rpc` de purga ni `ON DELETE CASCADE` transversal.
- **Reproducción (hipotética):** en un entorno de prueba, revocar el permiso DELETE sobre `streaks` al rol service-role y ejecutar `DELETE /api/account` → respuesta 200, pero filas residuales en las tablas posteriores a la que falló, con `profiles` ya eliminado.
- **Impacto:** inconsistencias de datos personales en el ejercicio de un derecho fundamental; el usuario recibe confirmación de supresión que el sistema no puede garantizar. Genera filas huérfanas (viola minimización, Ley 1581 art. 4 lit. c) y deja rastros que el titular pidió eliminar.
- **Prioridad P1 — justificación:** no requiere explotación — ocurre por fallos normales (red, timeouts, rate limit de Supabase) e impacta el cumplimiento legal directamente.
- **Solución propuesta:** (1) crear **una** función Postgres transaccional `purge_user_data(target_id TEXT)` que borre todo en una sola transacción y devuelva resumen, invocada por `admin.rpc()` desde los 3 recorridos; (2) compensación con Clerk: si `deleteUser` falla, marcar `profiles.deletion_pending = true`, registrar y **no** devolver 200 (devolver 202 "pendiente de reintento" + job de reintento); (3) unificar la cascada en `src/application/use-cases/purgeUser.ts`, dejando las tres entradas como adaptadores delgados; (4) evaluar `ON DELETE CASCADE` en las FKs a `profiles`.
- **Archivos afectados:** `src/app/api/account/route.ts`, `src/app/api/webhooks/clerk/route.ts`, `src/app/api/cron/purge-pending/route.ts`, `supabase-migration.sql`, (nuevo) `src/application/use-cases/purgeUser.ts`.
- **Criterio de aceptación medible:** `grep -rn "purge_user_data" src/ | wc -l` → **3** (un caso de uso, tres adaptadores), eliminando las cadenas duplicadas; con fallo inyectado en la 3.ª tabla, la respuesta **no** es 200 y ninguna fila queda borrada (rollback completo); con fallo de Clerk, respuesta 202/5xx con marca de reintento persistida; 0 tablas con datos del usuario tras una purga exitosa.
- **Prueba para confirmar corrección:** suite que simule (a) purga completa → 200 y 0 filas en las 7 tablas; (b) fallo inyectado a mitad → rollback verificable fila por fila; (c) fallo de Clerk → estado pendiente persistido y reintento exitoso posterior.

### HX-AUTH-07 | `consent` acepta identidad del body como fallback | P1 — Alta

- **Categoría:** Broken Authentication (OWASP A07). **Estado:** ❌ No conforme.
- **Descripción:** `src/app/api/consent/route.ts:22-52`: la ruta obtiene el usuario de `auth()` y, si eso falla o da `null`, **acepta el `userId` recibido en el cuerpo** (`const userId = clerkUserId ?? bodyUserId ?? null;`, `:49`). El schema declara `userId` opcional (`:17-19`). Consecuencia: un cliente anónimo puede registrar consentimiento **en nombre de otro usuario** con solo conocer su Clerk ID, o generar registros de `consent_logs` basura para IDs inexistentes. El comentario `:22` justifica el fallback por una "pre-webhook race"; si esa carrera existe, la solución es reintentar o encolar, no confiar en el body.
- **Evidencia:** `src/app/api/consent/route.ts:22` — `// Auth: prefer Clerk session, fallback to body userId for pre-webhook race`; `:48-52` — `// Prioritize auth() userId, fallback to body userId` + 401 solo si ambos son nulos. Contraste: `src/app/api/bookmarks/route.ts:73-77` **sí** hace strip del `user_id` inyectado con el comentario *"Strip any injected user_id — derive exclusively from auth()"*.
- **Reproducción (hipotética):**
  ```bash
  curl -i -X POST "https://<host>/api/consent" -H "Content-Type: application/json" \
    -d '{"policyVersion":"2026-10-01","acceptedTextHash":"deadbeef","purposes":["transfer_eeuu"],"userId":"user_VICTIMA"}'
  # → 200: consentimiento registrado para user_VICTIMA sin sesión
  ```
- **Impacto:** suplantación de manifestación de voluntad — se puede registrar consentimiento a nombre de un tercero (afirmando que aceptó la transferencia internacional cuando no lo hizo) o falsear el estado real. `consent_logs` es la evidencia legal del cumplimiento Ley 1581 art. 9; falsificarla invalida la cadena de custodia del dato personal.
- **Prioridad P1 — justificación:** requiere solo conocer un ID (no credenciales), ataca directamente la validez de la evidencia de consentimiento, y el fallback no tiene justificación técnica sólida.
- **Solución propuesta:** (1) eliminar `userId` del schema y del body; derivar exclusivamente de `auth()`, y 401 si no hay sesión; (2) para la carrera pre-webhook, si `completeConsent` falla porque el perfil aún no existe, responder **409** con `retry_after` y reintentar desde el cliente (o encolar vía `user.created`); (3) convertir el patrón de `bookmarks` en convención documentada del repo; (4) añadir rate limiting (HX-RATE-03) y validar que el `acceptedTextHash` corresponde a la política vigente.
- **Archivos afectados:** `src/app/api/consent/route.ts`, `src/domain/consent.ts`, `AGENTS.md`.
- **Criterio de aceptación medible:** `curl -X POST /api/consent` con `userId` en el body y sin sesión → **401**; con sesión y `userId` ajeno en el body → se registra solo el ID de la sesión (verificar `consent_logs.user_id`); `grep -c "bodyUserId" src/app/api/consent/route.ts` → **0**.
- **Prueba para confirmar corrección:** repetir el `curl` de la reproducción (debe dar 401) y el caso con sesión (debe registrar solo el ID de sesión); consultar `consent_logs` y confirmar cero registros asociados a IDs no autenticados.

### HX-DIAG-08 | `/api/diagnose` público en middleware y expone metadatos | P1 — Alta

- **Categoría:** Security Misconfiguration / Information Exposure (OWASP A05). **Estado:** ❌ No conforme.
- **Descripción:** `src/middleware.ts:11` lista `/api/diagnose` en `publicRoutes`, así que el request anónimo atraviesa el middleware. El handler **sí** valida sesión (`src/app/api/diagnose/route.ts:8-11` → 401 si no hay `userId`), así que no hay bypass: es una **inconsistencia de configuración con fuga de información**. El endpoint devuelve metadatos internos del sistema de contenido: `fileExists` (`:33`) y claves de frontmatter (`:36-40`), útiles para fingerprinting y para mapear el árbol de contenido antes de atacar.
- **Evidencia:** `src/middleware.ts:11` → `"/api/diagnose",`; `src/app/api/diagnose/route.ts:7-11` → `const { userId } = await auth(); if (!userId) return 401;`; `:30-34` → respuesta `{ module, slug, fileExists }` + frontmatter; `:17-20` y `:25-28` — sanitización `^[a-zA-Z0-9_-]+$` y comprobación de path traversal, ambas correctas.
- **Reproducción (hipotética):** sin cookie, `curl -i "https://<host>/api/diagnose?module=ia&slug=lesson01_what_is_ai"` → `401 {"error":"Unauthorized"}` (del handler); con sesión, `curl ... "?module=ia&slug=no_existe"` → `200 {"module":"ia","slug":"no_existe","fileExists":false, ...}`.
- **Impacto:** revelación de estructura interna (existe/no existe cada lección, claves de frontmatter) a cualquier usuario autenticado sin necesidad de rol; base para enumeración. No hay exposición de datos personales.
- **Prioridad P1 — justificación:** es una herramienta de diagnóstico que no debería existir en producción y expone superficie de reconocimiento, aunque esté detrás de sesión. Impacto de contenido, por eso no es P0.
- **Solución propuesta:** (1) sacar `/api/diagnose` de `publicRoutes` para que la protección ocurra en el middleware (coherencia + defensa en profundidad); (2) restringir a rol admin vía `adminRoutes` (`src/middleware.ts:21`) o guard de rol en el handler; (3) alternativamente protegerlo con `FEATURE_FLAG_DEBUG !== "true"` → 404; (4) reducir la respuesta a un booleano de salud, sin claves de frontmatter.
- **Archivos afectados:** `src/middleware.ts`, `src/app/api/diagnose/route.ts`.
- **Criterio de aceptación medible:** `grep -c "api/diagnose" src/middleware.ts` → **0**; request anónimo → **401 emitido por el middleware** (cuerpo `{"error":"Authentication required"}`); usuario autenticado sin rol admin → **403**; la respuesta ya no incluye claves de frontmatter.
- **Prueba para confirmar corrección:** `curl` anónimo (401 del middleware), con sesión de usuario normal (403) y con sesión admin verificando que ya no filtra frontmatter; `npm run build` limpio.

---

### HX-PRIV-09 | Leaderboard expone `user_id` + `username` enumerables | P2 — Media

- **Categoría:** Information Exposure / diseño de privacidad. **Estado:** ⚠️ Conforme con observaciones.
- **Descripción:** `supabase-migration.sql:239-252` define `get_leaderboard(limit_n INT)` que retorna `user_id TEXT, username TEXT, total_xp BIGINT`, y `src/app/(dashboard)/comunidad/page.tsx:39` la invoca con `limit_n: 50` usando el cliente **service-role** (bypasea RLS). Cualquier usuario autenticado obtiene así los IDs internos de Clerk de los 50 mejores correlacionados con su nombre de usuario, y puede reconstruir la base paginando por XP. El `user_id` se usa solo del lado del servidor (`:58-62`, `:75`) y **no** se renderiza ni se pasa a componentes cliente (no hay `"use client"` en el directorio).
- **Evidencia:** `supabase-migration.sql:239-252` — `RETURNS TABLE(user_id TEXT, username TEXT, total_xp BIGINT)`, `SELECT p.id, p.username, …`; `src/app/(dashboard)/comunidad/page.tsx:39` — `supabase.rpc("get_leaderboard", { limit_n: 50 })`; sin `GRANT` ni `SECURITY DEFINER`, la función corre como invoker, así que con anon key las policies de `profiles` la bloquean — la exposición ocurre solo por el service-role del servidor.
- **Reproducción (hipotética):** con sesión de usuario normal, observar la respuesta HTML de `/comunidad`; desde el servidor, un script con service-role variando `limit_n` confirma la enumerabilidad.
- **Impacto:** exposición de identificadores directos (Clerk ID + username) y métrica de progreso a usuarios autenticados. Bajo el principio de minimización (Ley 1581 art. 4 lit. c) el leaderboard no necesita el identificador real: basta un alias estable o el ranking posicional.
- **Prioridad P2 — justificación:** no hay bypass de acceso y el dato no se filtra al cliente; es un problema de diseño por sobreexposición, no un fallo de control.
- **Solución propuesta:** (1) devolver un alias opaco (`rank_<posición>` o hash truncado) en lugar de `profiles.id`, conservando el ID real solo para resaltar la fila del usuario actual y resolviéndolo idealmente con el ID de la sesión; (2) tope server-side de `limit_n` en 50 ignorando valores mayores; (3) hacer la función `SECURITY DEFINER` con el conjunto mínimo de columnas, o reemplazarla por una vista; (4) opción de exclusión del leaderboard (`profiles.show_in_leaderboard BOOLEAN`) para el derecho de oposición.
- **Archivos afectados:** `supabase-migration.sql`, `src/app/(dashboard)/comunidad/page.tsx`, (nuevo) `src/domain/leaderboard.ts`.
- **Criterio de aceptación medible:** `grep -n "RETURNS TABLE" supabase-migration.sql` en `get_leaderboard` ya **no** expone `profiles.id` real; la respuesta de `/comunidad` con sesión del usuario A **no** contiene el Clerk ID del usuario B; `limit_n` > 50 → se limita a 50; la fila propia sigue resaltada.
- **Prueba para confirmar corrección:** renderizar `/comunidad` con dos sesiones distintas y confirmar ausencia del ID ajeno; invocar la RPC con `limit_n: 5000` y verificar el tope.

### HX-SEC-10 | Ausencia total de headers de seguridad | P2 — Media

- **Categoría:** Security Misconfiguration (OWASP A05). **Estado:** ❌ No conforme.
- **Descripción:** `next.config.ts:1-13` solo define `output: "standalone"` e `images.remotePatterns`. **No hay función `headers()`** ni se setean headers en `src/middleware.ts`. Resultado: sin `Strict-Transport-Security`, sin `Content-Security-Policy`, sin `X-Frame-Options`/`frame-ancestors`, sin `X-Content-Type-Options`, sin `Referrer-Policy`, sin `Permissions-Policy`. Además `/api/diagnose` (público en middleware) no aplica CORS restrictivo.
- **Evidencia:** `cat next.config.ts` → 13 líneas sin `headers`; `grep -rn "Content-Security-Policy\|Strict-Transport-Security\|X-Frame-Options" src/ next.config.ts` → **0 resultados**; `src/middleware.ts:25-113` → solo redirects y validación de sesión.
- **Reproducción (hipotética):** `curl -sI "https://<host>/" | grep -iE "content-security|strict-transport|x-frame|x-content-type|referrer-policy"` → vacío.
- **Impacto:** clickjacking, MIME sniffing, fuga de URL por `Referer` y sin restricción de permisos de dispositivo. La ausencia de CSP elimina una capa de defensa frente a XSS, que varios endpoints harían más dañinas.
- **Prioridad P2 — justificación:** hardening independiente, sin explotación directa en el código actual.
- **Solución propuesta:** (1) `headers()` en `next.config.ts` con HSTS (2 años, includeSubDomains), `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` restrictiva; (2) CSP progresiva (`default-src 'self'; img-src 'self' https://img.clerk.com https://vercel.com data:; script-src 'self' …`, ajustando `cdn.jsdelivr.net` que requiere Pyodide), en `Report-Only` primero; (3) CORS restrictivo a `/api/*` (mismo origen por defecto).
- **Archivos afectados:** `next.config.ts`, `src/middleware.ts`.
- **Criterio de aceptación medible:** `curl -sI https://<host>/ | grep -ci "content-security-policy\|strict-transport-security\|x-frame-options\|x-content-type-options\|referrer-policy"` → **≥ 5**; 0 violaciones críticas CSP tras 7 días en `Report-Only`.
- **Prueba para confirmar corrección:** `curl -sI` contra `/` y `/api/diagnose`; test de integración que afirme la presencia de los headers.

### HX-ARCH-11 | `service-role` sobre-privilegiado en toda la capa de servidor | P2 — Media

- **Categoría:** Excessive Privileges / arquitectura. **Estado:** ⚠️ Conforme con observaciones.
- **Descripción:** `createAdminClient()` (`src/lib/supabase/admin.ts`) bypasea RLS por diseño y se usa en **10 rutas API** (`account`, `bookmarks`, `cron/daily-nudge`, `cron/purge-pending`, `cron/recharge-freezes`, `lab-progress`, `profile/avatar`, `profile/daily-goal`, `progress` y `webhooks/clerk`), en el **middleware** (`src/middleware.ts:3,87`) y en **13 server components** (`grep -rln createAdminClient src/app --include=page.tsx | wc -l` → 13: admin, bookmarks, comunidad, configuracion, laboratorios×4, logros, niveles, perfil, proyectos×4). En total `grep -rn "createAdminClient" src/ | wc -l` → **79** usos en **32 archivos**. Cualquier error de filtro por `user_id` en esos puntos expone datos de terceros. El punto más sensible es el middleware: `:87` crea el cliente admin dentro del guard de rutas admin, con radio de explosión transversal. `legal/security-audit.md:152` (H-12) documenta que en `perfil/page.tsx` el service-role se usa donde bastaría anon + RLS.
- **Evidencia:** los tres greps de arriba; `src/middleware.ts:3` (import) y `:87` (`const supabase = createAdminClient();`); 13 `page.tsx` con service-role.
- **Impacto:** superficie de error amplia — un `SELECT` sin `.eq("user_id", …)` en cualquiera de los 79 puntos expone datos personales.
- **Prioridad P2 — justificación:** no es un fallo concreto verificado, es deuda arquitectónica que multiplica el impacto de cualquier otro bug.
- **Solución propuesta:** (1) crear `src/lib/supabase/server.ts` con cliente **anon + `auth.getToken()`** para las operaciones que solo ven datos propios (`perfil`, `bookmarks`, `progreso`, `logros`, `comunidad`), de modo que las policies RLS sean segunda línea de defensa efectiva y no decorativa; (2) reservar service-role para webhooks, crons y `adminRoutes`, marcando cada uso restante con `// AUDIT: service-role justificado porque …`; (3) mover la consulta del middleware a un helper con test unitario y log de auditoría por acceso admin; (4) introducir repositorios/puertos en `application` para no filtrar dependencia de infraestructura hacia presentation (regla 1 de los Anti-Vibe Guardrails de `AGENTS.md`).
- **Archivos afectados:** `src/middleware.ts`, `src/lib/supabase/admin.ts`, (nuevo) `src/lib/supabase/server.ts`, 13 server components, `AGENTS.md`.
- **Criterio de aceptación medible:** `grep -rln createAdminClient src/app | wc -l` reducido ≥ 50% respecto a la línea base (32 archivos); cada uso restante tiene justificación (`grep -rn "AUDIT: service-role" src/ | wc -l` ≥ usos restantes); test de aislamiento donde un usuario solo lee sus filas incluso si el código omite el filtro.
- **Prueba para confirmar corrección:** suite de tests de RLS con JWT real de Clerk (Supabase local) intentando leer filas ajenas con cliente anon → 0 filas; `grep` de justificaciones.

### HX-ARCH-12 | Identidad derivada siempre de `auth()`, nunca del body | P2 — Cumple

- **Categoría:** Broken Authentication — verificación de control. **Estado:** ✅ Cumple (con la excepción HX-AUTH-07).
- **Descripción:** de las **15** rutas API, **11** derivan la identidad de `await auth()`. Las 4 excepciones son las correctas por diseño: `webhooks/clerk` (firma Svix, sin sesión) y los 3 crons (validación por secreto). Ninguna ruta toma `userId` del body como fuente de verdad **salvo** `consent` (HX-AUTH-07).
- **Evidencia:** `find src/app/api -name "route.ts" | wc -l` → **15**; el bucle `grep -q "auth()"` sobre las 15 solo falla en `webhooks/clerk`, `cron/purge-pending`, `cron/recharge-freezes` y `cron/daily-nudge`; patrón modelo en `src/app/api/bookmarks/route.ts:73-77`; `src/app/api/account/route.ts:10-13` — `const { userId } = await auth();` antes de cualquier operación; `src/app/api/bookmarks/route.ts:55` — 401 sin sesión.
- **Impacto:** positivo. Sin este control, la mayoría de los hallazgos de acceso serían críticos; la única excepción está aislada.
- **Solución propuesta:** extraer un guard compartido `requireUserId()` en `src/application/ports/auth.ts` para que la convención sea imposible de romper por omisión.
- **Archivos afectados:** (nuevo) `src/application/ports/auth.ts`, `AGENTS.md`.
- **Criterio de aceptación medible:** `grep -L "await auth()" $(find src/app/api -name "route.ts" ! -path "*cron*" ! -path "*webhooks*")` → **vacío**.
- **Prueba para confirmar corrección:** test de integración por ruta que verifique 401 sin sesión en las 11 rutas protegidas.

### HX-SEC-13 | Webhook Clerk verifica firma Svix real | P2 — Cumple

- **Categoría:** Integridad de mensajes. **Estado:** ✅ Cumple.
- **Descripción:** `src/app/api/webhooks/clerk/route.ts:27-49` exige los tres headers Svix, lee el body como **texto crudo** (`:37`, requisito indispensable para no romper la firma) y verifica con `new Webhook(requireEnv("CLERK_SIGNING_SECRET")).verify(...)` (`:38-46`), devolviendo 400 ante cualquier anomalía (`:47-49`). La clave se lee de entorno sin valor por defecto. La ruta es pública en el middleware (`src/middleware.ts:10`) por necesidad: un webhook no lleva sesión de Clerk.
- **Evidencia:** `:29-35` — rechazo si falta cualquier header; `:37-49` — `await req.text()` + `wh.verify(payload, {...})` + `catch → "Invalid signature" 400`.
- **Impacto:** sin este control, un atacante podría forjar eventos `user.created`/`user.deleted` y manipular perfiles. Está correctamente implementado.
- **Solución propuesta:** añadir rate limiting con allowlist de IPs de Clerk (HX-RATE-03) e idempotencia por `svix-id` para rechazar eventos duplicados.
- **Archivos afectados:** `src/app/api/webhooks/clerk/route.ts`.
- **Criterio de aceptación medible:** request sin headers → **400**; con firma inválida → **400**; con firma válida → **200**.
- **Prueba para confirmar corrección:** test de integración con secreto de prueba Svix cubriendo los tres casos.

### HX-SEC-14 | Secretos: cero expuestos; `.gitignore` cubre `.env` | P2 — Cumple

- **Categoría:** Gestión de secretos. **Estado:** ✅ Cumple.
- **Descripción:** `git grep -cE "sk_live|sk_test|SUPABASE_SERVICE_ROLE_KEY="` sobre el árbol trackeado devuelve **1 coincidencia**: `.env.local.example:9`, con la línea `SUPABASE_SERVICE_ROLE_KEY=` — **valor vacío**, plantilla documental, no un secreto real. `.gitignore` cubre `.env` y `.env*.local`.
- **Evidencia:** `git grep -cE "sk_live|sk_test|SUPABASE_SERVICE_ROLE_KEY=" -- .` → `.env.local.example:1`; `.gitignore:15-17` → `.env` / `.env*.local`; `.env.local.example:1-16` → todas las claves con valor vacío.
- **Reproducción:**
  ```bash
  git grep -nE "sk_live|sk_test|SUPABASE_SERVICE_ROLE_KEY=" -- .   # → solo el placeholder
  git log --all --diff-filter=A --name-only | grep -c "\.env$"    # → 0 archivos .env commiteados
  ```
- **Impacto:** ninguno actual. Riesgo residual: nada impide que un operador salte `.gitignore`.
- **Solución propuesta:** añadir hook de pre-commit (`gitleaks` o equivalente) y verificación en CI.
- **Archivos afectados:** (nuevo) `.githooks/pre-commit` / `.github/workflows/secret-scan.yml`, `.env.local.example`.
- **Criterio de aceptación medible:** `git grep -cE "sk_live|SUPABASE_SERVICE_ROLE_KEY=.+"` → **0**; el hook falla ante un secreto de prueba.
- **Prueba para confirmar corrección:** commit intencional de una clave falsa `sk_test_…` en un entorno de prueba y verificar que el hook/CI lo bloquean.

### HX-DOC-15 | Divergencias de `legal/security-audit.md` frente al código | P2 — Media

- **Categoría:** Gobernanza / riesgo documental. **Estado:** ❌ No conforme — afirmaciones **stale**.
- **Descripción:** el documento (fechado 2026-10-06) contiene afirmaciones que el código actual **contradice**. Como es la base del cumplimiento art. 19 Ley 1581, la divergencia es un hallazgo en sí misma.

| # | Afirmación del documento | Realidad verificada | Impacto de la divergencia |
|---|---|---|---|
| 1 | *"Rate limiting: `grep vacío` en todo `src/`"* (`:22`, C-07 `:40`, H-02 `:62-68`, métrica `:276`) | Existe `src/lib/rate-limit.ts`, usado en **4 rutas POST** con `429` + `Retry-After` | Declara ALTA inexistente y subestima el riesgo real (límite no global, sin cobertura en DELETE) |
| 2 | *"Falta handler `user.deleted`; perfiles huérfanos"* (`:128-131`, H-09, R-11) | Implementado: `src/app/api/webhooks/clerk/route.ts:105-126` con cascada completa | Planifica trabajo ya hecho; ignora el problema real (falta transacción, HX-SUP-06) |
| 3 | *"Vercel WAF / Supabase rate no evidenciado en repo (**no hay `vercel.json` con `firewall`**)"* (C-07 `:40`) | `vercel.json` **sí existe** con 3 crons (`vercel.json:2-14`), aunque sin reglas de firewall | La confusión es archivo vs. configuración de firewall; lo grave es que ignora que 2 de esos 3 crons son inalcanzables (HX-CRON-02) |
| 4 | *"6 `publicRoutes`: …, `/api/diagnose`"* (C-03 `:36`) | Hay **14** entradas (`src/middleware.ts:5-19`) | El inventario de superficie pública está incompleto; omite los crons, `/aviso`, `/privacidad`, etc. |
| 5 | *"Sin `DELETE` policies"* | `supabase-migration.sql:453-485` define **6** políticas `FOR DELETE` + `profiles` `:483-485` | Declara una carencia inexistente; distrae del hueco real (`modules` sin RLS, HX-DATA-05) |
| 6 | *"`429`/`Retry-After` (vacío)"* (`:276`) | `src/app/api/bookmarks/route.ts:59-64` devuelve `429` + `Retry-After` | La métrica de verificación usada para el informe es incorrecta |

- **Evidencia:** `legal/security-audit.md:22,36,40,62-68,128-131,276`; `src/lib/rate-limit.ts:1-32`; `src/app/api/webhooks/clerk/route.ts:105-126`; `vercel.json:1-16`; `src/middleware.ts:5-19`; `supabase-migration.sql:453-485`; `src/app/api/bookmarks/route.ts:59-64`.
- **Impacto:** la organización decidiría inversiones sobre una fotografía desactualizada de su postura. Tres hallazgos reales y nuevos de esta auditoría (HX-CRON-01, HX-CRON-02, HX-DATA-05) **no aparecen** en el documento, mientras que 6 de sus afirmaciones son falsas. Material para el deber de medidas útiles (art. 19 Ley 1581).
- **Prioridad P2 — justificación:** no es una vulnerabilidad técnica, pero la desactualización documental ya produjo efectos concretos: el sistema de crons se dio por funcional.
- **Solución propuesta:** (1) regenerar `legal/security-audit.md` o añadir un anexo "Revisión 2026-10-11" con las 6 correcciones; (2) versionar los greps de verificación como `scripts/security-verify.sh` para que no vuelvan a divergir; (3) incorporar los hallazgos nuevos al registro de riesgos (R-01…R-12).
- **Archivos afectados:** `legal/security-audit.md`, (nuevo) `scripts/security-verify.sh`.
- **Criterio de aceptación medible:** cada fila de la tabla tiene una sección corregida en el documento; `scripts/security-verify.sh` reproduce todas sus métricas y sale con código 0.
- **Prueba para confirmar corrección:** ejecutar el script sobre el repo y confirmar que ninguna métrica del documento queda en "vacío" cuando sí existe el código.

### HX-AUTH-16 | `bookmarks` hace strip del `user_id` inyectado | P3 — Cumple

- **Categoría:** verificación positiva. **Estado:** ✅ Cumple.
- **Descripción y evidencia:** `src/app/api/bookmarks/route.ts:73-77` elimina explícitamente cualquier `user_id` recibido en el body antes de usarlo — comentario `// Strip any injected user_id — derive exclusively from auth()` — y valida `module_slug`/`lesson_slug` contra el filesystem (`:88-89`) con rate limiting (`:58`). Es el patrón correcto y debe ser la convención del repo.
- **Impacto:** positivo; es la razón por la que `bookmarks` no comparte la debilidad de `consent` (HX-AUTH-07).
- **Criterio de aceptación medible:** `curl -X POST /api/bookmarks -d '{"user_id":"user_AJENO",…}'` con sesión propia → el registro queda con el ID de la sesión; `grep -c "user_id"` sobre el body recibido → 0 tras el strip.

### HX-SEC-17 | `service-role` nunca expuesto al cliente | P3 — Cumple

- **Categoría:** verificación positiva. **Estado:** ✅ Cumple.
- **Descripción y evidencia:** `grep -rn "createBrowserClient\|NEXT_PUBLIC_SUPABASE_ANON_KEY" src/` → **0 resultados**. La anon key (pública por diseño) no se usa en ninguna parte del cliente, y `createAdminClient()` solo aparece en módulos de servidor. Esto elimina toda una clase de vulnerabilidades (service-role embebida en el bundle del navegador).
- **Criterio de aceptación medible:** el grep debe seguir en 0; el bundle del cliente (`npm run build` + análisis de `.next/static`) no debe contener `service_role`.

### HX-SEC-18 | Placeholders de entorno sin valores | P3 — Cumple

- **Categoría:** verificación positiva. **Estado:** ✅ Cumple.
- **Descripción y evidencia:** `.env.local.example:1-16` contiene todas las claves requeridas con valores vacíos (`CLERK_SECRET_KEY=`, `SUPABASE_SERVICE_ROLE_KEY=`, …), sirviendo como checklist de despliegue sin filtrar material sensible. `.gitignore` protege los archivos reales.
- **Criterio de aceptación medible:** `grep -cE "=.+" .env.local.example` → **0** (salvo `NEXT_PUBLIC_APP_URL=http://localhost:3000`, valor público no sensible).

### HX-DATA-19 | RLS por tabla: 10 tablas, 9 protegidas, 0 políticas permisivas | P3 — Cumple con observación

- **Categoría:** verificación del modelo de datos. **Estado:** ✅ Cumple salvo `modules` (HX-DATA-05).
- **Descripción:** inventario completo de `supabase-migration.sql`. **Son 10 tablas, no 11**: el comentario *"11. Modules table"* (`:272`) es el número de **sección** del archivo, no la cantidad de tablas (`grep -c "CREATE TABLE"` → 10).

| # | Tabla | CREATE | RLS | Policies | Compara |
|---|---|---|---|---|---|
| 1 | `profiles` | 18 | ✅ 52 | SELECT/UPDATE `:55-62`; DELETE `:483-485` | `auth.jwt() ->> 'sub' = id` |
| 2 | `progress` | 65 | ✅ 76 | SELECT/INSERT/UPDATE `:79-91`; DELETE `:453-455` | `= user_id` |
| 3 | `streaks` | 94 | ✅ 102 | SELECT/INSERT/UPDATE `:105-117`; DELETE `:463-465` | `= user_id` |
| 4 | `reflection_completions` | 120 | ✅ 129 | SELECT/INSERT `:132-139`; DELETE `:458-460` | `= user_id` |
| 5 | `achievements` | 174 | ✅ 186 | SELECT `:189-191` | `IS NOT NULL` (catálogo público) |
| 6 | `user_achievements` | 194 | ✅ 201 | SELECT/INSERT `:204-211`; DELETE `:473-475` | `= user_id` |
| 7 | **`modules`** | **276** | ❌ **—** | **ninguna** | — |
| 8 | `lab_progress` | 309 | ✅ 320 | SELECT/INSERT/UPDATE `:323-335`; DELETE `:456-458` | `= user_id` |
| 9 | `consent_logs` | 408 | ✅ 425 | SELECT `:428-430`; DELETE `:478-480` | `= user_id` |
| 10 | `bookmarks` | 507 | ✅ 514 | `FOR ALL` `:516` | `= user_id` (USING + WITH CHECK) |

- **Verificaciones de modelo:** `grep -c "ENABLE ROW LEVEL SECURITY" supabase-migration.sql` → **9** (falta `modules`); `grep -n "USING (true)" supabase-migration.sql` → **0** políticas permisivas ✅; todas las policies comparan `(auth.jwt() ->> 'sub')` contra columnas TEXT (`id`/`user_id`), **nunca `auth.uid()`** ✅ (encabezado `:7`); las funciones de leaderboard (`:239-252`, `:254-269`) no son `SECURITY DEFINER` ni tienen `GRANT`, así que corren como invoker y la RLS de `profiles` las protege frente al cliente anon. **Observación:** `achievements` permite lectura a cualquier autenticado (`:189-191`), intencional por ser catálogo de logros; no constituye fuga de datos personales.
- **Reproducción (verificación):**
  ```bash
  grep -c "CREATE TABLE" supabase-migration.sql            # 10
  grep -c "ENABLE ROW LEVEL SECURITY" supabase-migration.sql   # 9  → 10 tras HX-DATA-05
  grep -n "USING (true)" supabase-migration.sql            # 0
  grep -c "auth.jwt() ->> 'sub'" supabase-migration.sql    # 30
  grep -c "auth.uid()" supabase-migration.sql              # 0
  ```
- **Criterio de aceptación medible:** los cinco greps mantienen sus valores tras aplicar HX-DATA-05 (el primero y el segundo pasan a 10).

---

## Plan de remediación priorizado

| Orden | Hallazgo | Acción | Esfuerzo |
|---|---|---|---|
| 1 | HX-CRON-01 | Endurecer `isAuthorized`, quitar de `publicRoutes`, GET→POST | 1 h |
| 2 | HX-CRON-02 | Añadir 2 crons a `publicRoutes` + helper compartido | 30 min |
| 3 | HX-AUTH-07 | Eliminar `userId` del body en `/api/consent` | 1 h |
| 4 | HX-SUP-06 | Función transaccional `purge_user_data` + compensación Clerk | 4 h |
| 5 | HX-DATA-05 | `ENABLE RLS` + policy en `modules` | 15 min |
| 6 | HX-RATE-03 | Upstash + límite en `DELETE /api/account` | 1 sprint |
| 7 | HX-SEC-10 | `headers()` de seguridad + CSP | 4 h |
| 8 | HX-DIAG-08 | Sacar de `publicRoutes`, restringir a admin | 30 min |
| 9 | HX-DOC-15 | Corregir `legal/security-audit.md` + script de verificación | 2 h |
| 10 | HX-ARCH-11 / HX-PRIV-09 | Cliente anon + RLS; alias en leaderboard | 1-2 sprints |

**Gates de verificación:** `npm run type-check` y `npm run build` deben pasar tras cada cambio (`npm run lint` está roto por diseño en Next 16). Tests: `npm run test` (vitest, 37 tests).

**Nota final:** esta auditoría es estática. No se realizó pentesting activo, explotación, fuzzing ni pruebas contra entornos de producción. Todos los `curl` documentados reproducen el comportamiento **esperado** según la lectura del código y deben ejecutarse solo en entornos de prueba autorizados. No se modificó código, git ni dependencias durante la auditoría.

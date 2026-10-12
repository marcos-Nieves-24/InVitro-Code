# AUDITORIA_SOSTENIBILIDAD.md — InVitro-Code

**Fecha:** 2026-10-11 · **Auditor:** subagente de sostenibilidad técnica y económica · **Repo:** `presentation-reemplazo-directo` (HEAD desacoplado)

**Restricciones cumplidas:** sin tocar git, sin commits, sin `npm install`, sin contratación de servicios, sin acceso a paneles de proveedores. Todo se verificó leyendo archivos del repo.

**Regla de evidencia:** cada hallazgo cita `archivo:línea` verificable. Cuando no existe prueba en el repo (plan contratado, precios, datos de uso), el hallazgo se marca **BLOQUEADO** o **NO_AUDITADO** — no se inventan precios ni límites.

---

## Resumen ejecutivo

La plataforma es 100 % gratuita, operada por una persona natural (NIT 700329113-7, Colombia), sobre cinco terceros técnicos reales (Clerk, Supabase, Vercel, jsDelivr, PyPI/Fastly). Los labs dependen de internet (Pyodide desde CDN). El modelo no tiene ingresos: toda la infraestructura la sostiene el mantenedor. La deuda principal no es técnica sino **documental verificable** (conteo de tests 6/37 cuando la realidad es 19/187; componentes inexistentes citados en DESIGN.md; AGENTS.md afirmando algo falso sobre `/api/certify`). Costos por usuario y backups reales: **BLOQUEADO** sin acceso a paneles ni datos de uso.

| Prioridad | Cantidad | Hallazgos |
|---|---|---|
| P0 | 1 | SO-PROV-01 (transferencias art. 26 sin autorización conservable) |
| P1 | 8 | SO-PROV-02/03/04/05, SO-RED-01, SO-COST-01, SO-BKP-01, SO-MOD-01 |
| P2 | 8 | SO-PROV-06, SO-RED-02, SO-NPM-01/03, SO-DOC-01/03/04, SO-CONT-01 |
| P3 | 2 | SO-NPM-02, SO-DOC-02 |

---

## 1. Proveedores reales y transferencias internacionales (art. 26)

Fuente: `legal/providers-audit.md` (Fase 6, 11 fichas P-01..P-11, fecha 2026-10-06).

### 1.1 Inventario de proveedores reales

| # | Proveedor | Rol en el servicio | País | ¿Datos personales? | art. 26 |
|---|-----------|--------------------|------|--------------------|---------|
| P-01 | **Clerk** (`@clerk/nextjs` 7.5.20, `package.json:19`) | Único IdP: registro, login, sesión, webhooks `user.created/updated` | EE. UU. | Sí (`email`, `gender=f/m/x`, `id`) | **Sí** |
| P-02 | **Supabase** (`@supabase/supabase-js` 2.110.7, `package.json:24`) | Postgres + Storage (`avatars`) + publicación Realtime | EE. UU. (AWS) | Sí (perfil, progreso, rachas, logros) | **Sí** |
| P-03 | **Vercel** | Hosting Next.js standalone, Edge, logs, DNS implícito (P-11) | EE. UU. | Tránsito TLS + IP en logs | **Sí** |
| P-04 | **jsDelivr** (`cdn.jsdelivr.net`) | CDN del runtime Pyodide v0.25.0 + paquetes Python nativos | Global Anycast | No (solo IP/User-Agent de tráfico) | Tercero técnico a informar |
| P-05 | **PyPI vía micropip** (`files.pythonhosted.org`, Fastly) | Wheels `seaborn`/`plotly` no nativos de Pyodide | Global (origen EE. UU.) | No | Tercero técnico a informar |

Evidencia: `legal/providers-audit.md:15-18` (totales), `:21-29` (orden por criticidad), `:52-56` (fichas consolidadas), `:284-290` (flujos F-01 a F-07 + tránsito Vercel).

Las 5 transferencias auditadas son exactamente: **Clerk, Supabase, Vercel** (con datos personales, Encargados en EE. UU.) + **jsDelivr y PyPI/Fastly** (terceros técnicos sin datos personales). No se detectó ningún otro proveedor (`grep vacío` documentado en `legal/providers-audit.md:64`).

### 1.2 Criticidad y failover (qué pasa si cae cada uno)

| Proveedor | Criticidad | Si cae | Failover real hoy |
|---|---|---|---|
| **Clerk** | **Crítica** | Todo lo no-público exige sesión (`src/middleware.ts:45-58`): sin Clerk nadie entra, ni usuarios nuevos ni existentes | **Ninguno.** Clerk es el único IdP por diseño (`supabase-migration.sql:4-7`, `README.md:72`) |
| **Supabase** | **Alta** | Perfil, progreso, rachas, logros y avatares caen; el middleware admin consulta `profiles.role` en cada request admin (`src/middleware.ts:59-64`) | **Ninguno.** Sin réplica ni export; las lecturas de contenido MDX son filesystem y sobreviven |
| **Vercel** | **Alta** | Cae el servicio completo (hosting + edge + builds) | **Manual y no documentado como runbook**: `Dockerfile.nextjs` + `docker-compose.prod.yml` permiten self-host, pero es opción, no failover |
| **jsDelivr** | **Media** | Los labs no cargan: Pyodide no se descarga (`public/pyodide-worker.js:4-5,30-31`). Lecciones MDX siguen | **Ninguno.** Sin mirror ni cache offline; pin de versión `0.25.0` ya fija integridad |
| **PyPI/Fastly** | **Media-baja** | Solo fallan labs que importan `seaborn`/`plotly` Python (numpy/sklearn/matplotlib vienen de jsDelivr) | **Ninguno.** Wheels sin pin de versión (`public/pyodide-worker.js:70,82`) |

### 1.3 Estado de cumplimiento art. 26 (Ley 1581/2012)

- **Autorización del titular con mención expresa de transferencia a EE. UU.: NO EXISTE prueba conservable** (`legal/providers-audit.md:306` — sin `consent_logs` en la migración original del informe; remediación posterior documentada en `legal/legal-final-report.md:7` como mergeada en `main@d5c6f6c`; en este worktree existe `src/domain/consent.test.ts`, señal de que el trabajo de consentimiento está presente).
- **DPAs:** aceptados/versionados **2026-10-06-v1** en `legal/dpa-register.md`, pero **pendiente firma/receipt conservable** (`legal/providers-audit.md:318`).
- Conclusión del auditor externo del repo: la transferencia requiere **bloqueo o regularización** antes de publicar política (`legal/providers-audit.md:316`). **Persiste como P0** hasta verificar firma + receipt.

---

## 2. Dependencia de red del producto (Pyodide)

- **Evidencia:** `public/pyodide-worker.js:4` `PYODIDE_VERSION = "0.25.0"`, `:5` CDN `cdn.jsdelivr.net`, `:30-31` `importScripts` + `loadPyodide`, `:33` `loadPackage("numpy")`, `:56-84` carga bajo demanda de scikit-learn/matplotlib/pandas/scipy y `micropip.install("seaborn"|"plotly")` desde PyPI. Consumidor único vía singleton `src/lib/pyodide-worker.ts` (correlación `requestId`).
- **Implicación de continuidad:** sin internet, **todos los labs quedan muertos** mientras el contenido MDX sobrevive. Es una dependencia binaria del core del producto ("Duolingo-style coding challenges"), no una feature accesoria. jsDelivr y PyPI son servicios **gratuitos sin SLA**: la indisponibilidad no se factura pero tumba la diferenciación del producto.
- **Implicación de costo:** el egress de Pyodide (~15-25 MB de runtime + packages bajo demanda) lo absorbe jsDelivr/Fastly — **costo directo $0 para el proyecto**, pero implica ~2 proveedores adicionales de cadena de suministro que auditar y un único punto de fallo para el 100 % de la funcionalidad interactiva.
- **Higiene:** versión de Pyodide pineada (bien); wheels de `micropip` **sin pin** (mal) — `legal/providers-audit.md:331` (PROV-04).

---

## 3. Dependencias npm y costo de mantenimiento

Lectura directa de `package.json:18-59` y `package-lock.json`.

| Hallazgo | Evidencia | Costo de mantenimiento |
|---|---|---|
| **Plotly duplicado**: `plotly.js ^4.1.1` + `plotly.js-dist-min ^3.7.0` + `react-plotly.js ^4.0.0` | `package.json:32-33,37` | Dos majors de la misma librería (4.x y 3.x) conviven en el bundle; actualizar/seguridad exige decidir qué variante sobrevive. Ya señalado en `legal/technical-audit.md:177` y `legal/providers-audit.md:333` (PROV-06) |
| **`lucide-react ^1.25.0` atípico** | `package.json:28`; resuelve `lucide-react-1.25.0.tgz` desde `registry.npmjs.org` (`package-lock.json:5452-5454`) | El ecosistema lucide histórico es línea 0.x; una major 1.x con caret `^` permite drift de minor sin pin. Verificar que la major sea intencional; iconos pesan import tree si no hay auditoría de bundle |
| **Estrategia de pin inconsistente** | Exactos para seguridad (`next`, `@clerk/nextjs`, `@supabase/supabase-js`, `svix` — `package.json:19,24,30,43`) vs caret (`^`) para el resto | Mezcla defendible, pero sin lockfile-audit en CI el drift entra silencioso en 20+ paquetes |
| **Sin linter** | `openspec/config.yaml:62` (linter `available: false`, "roto por diseño"); `README.md:29` | Único gate estático real: `npm run type-check`. Un bug de lint (imports prohibidos, `createAdminClient` en cliente) solo lo detiene el build de Vercel |
| **Sin gate de coverage** | `openspec/config.yaml:43` `coverage_threshold: 0`; `@vitest/coverage-v8` instalado pero sin umbral | La cobertura se mide, no se exige: puede bajar a 0 sin romper nada |
| **Sin e2e** | `openspec/config.yaml:56` (`e2e available: false`) | Regresiones de flujo completo (lab→progreso) solo las detecta el humano |

---

## 4. Deuda documental (verificada, no especulada)

### 4.1 Conteo de tests: doc dice 6/37, realidad 19/187

- **Real (verificado hoy):** 19 archivos `.test.ts/.tsx` bajo `src/` y **187** casos `it(/test(`; un archivo adicional `src/__tests__/requestId-descarte.test.mjs` que **NO corre** porque `vitest.config.mts:6` solo incluye `src/**/*.test.ts` y `src/**/*.test.tsx`.
- **Doc desactualizada:** `openspec/config.yaml:14` ("6 unit test files / 37 tests"), `README.md:24` y `:33` (6 archivos / 37 tests), `AGENTS.md:10` (6 files / 37 tests).
- **Doc además falsa:** `openspec/config.yaml:65-68` y `AGENTS.md:10` afirman que `requestId-descarte.test.mjs` "está incluido en el `include`" — el glob no lo cubre. Test muerto documentado como vivo.

### 4.2 DESIGN.md cita componentes inexistentes

- `DESIGN.md:180` → `src/components/ui/PageShell.tsx` **no existe** (en `src/components/ui/` solo hay `Button`, `Card`, `Callout`, `EmptyState`, `ScrollReveal`, `TypingText`, `SlideArrowButton`).
- `DESIGN.md:185` → `src/components/ui/SiteHeader.tsx` **no existe**.
- Onboarding costoso: un dev nuevo busca archivos fantasma o asume que faltan.

### 4.3 DESIGN.md vs middleware sobre `/learn`

- `DESIGN.md:518` declara `/learn` como "**Índice de módulos (público)**".
- `src/middleware.ts:5-19` (`publicRoutes`) **no incluye `/learn`** → sin sesión redirige a `/sign-in` (`middleware.ts:45-57`). La doc promete acceso público que el código niega.

### 4.4 AGENTS.md afirma algo falso sobre `/api/certify`

- `AGENTS.md:34`: "`/api/certify` is an MVP stub that **always returns `certified: true`**".
- Real: `src/app/api/certify/route.ts:22-27` responde **503 `certified:false`** salvo `FEATURE_FLAG_CERTIFY=true`, que está en `false` por defecto (`.env.local.example:17`). El stub solo corre con flag ON.
- Impacto: información veraz al consumidor (Ley 1480/2011) — una doc que dice "siempre certifica" contradice el comportamiento real y ya está señalado como "MVP no certificante" en `legal/project-classification.md:81`.

**Costo de onboarding agregado (4.1-4.4):** el repo tiene 4 fuentes de verdad en desacuerdo verificable. Un desarrollador (o auditor) pierde tiempo reconciliando docs vs código; el riesgo de negocio es tomar decisiones sobre datos falsos (ej. creer que hay 37 tests protegiendo el cambio).

---

## 5. Costos por usuario — BLOQUEADO

**Estado: BLOQUEADO.** No hay autorización para acceder a paneles (Vercel/Clerk/Supabase) ni datos de uso en el repo. No se inventan precios ni límites.

**Metodología documentada (lista para ejecutar cuando haya acceso):**

1. **Variables a medir/obtener:** MAU (m); requests por usuario/mes (r); ancho de banda por usuario/mes (b) — assets Next + descarga Pyodide ~15-25 MB + packages bajo demanda; sesiones de lab por usuario/mes (l); almacenamiento DB por usuario (s) + avatares (a, ≤2 MB c/u, `src/app/api/profile/avatar/route.ts:26`).
2. **Fórmulas:** BW total = m·b; invocaciones serverless = m·r; filas DB ≈ m·(1 + l·k) con k = filas de progreso por lab; storage = m·(s+a).
3. **Costo por usuario** = (plan efectivo + overage) / m — **requiere el plan real, NO_AUDITADO** (el repo solo menciona "Free 7d / Pro 30d" como referencia de PITR, `legal/retention-policy.md:21`, sin evidencia del plan contratado).
4. **A verificar en panel (BLOQUEADO):** plan efectivo de Vercel (Hobby/Pro) y sus límites vigentes de bandwidth/invocaciones; MAU y límites del plan Clerk; tamaño de DB, egress y límites de Storage en Supabase; si el bucket `avatars` acumula objetos (`upsert:true`, `src/app/api/profile/avatar/route.ts:41`).
5. **Riesgo económico a verificar:** los términos de Vercel Hobby condicionan el uso **no comercial**; el proyecto opera con NIT (actividad económica, `legal/project-classification.md:9`). Si la operación se considera comercial, el plan efectivo debería ser Pro — **confirmar en panel antes de estimar costo**.

---

## 6. Backups — RPO/RTO

- **Estado en repo:** `legal/security-audit.md:23` (C-08: **"No conforme" — sin evidencia de backups**), `:41` (detalle C-08), `:70-76` (H-03), `:215` (`grep vacío` de `backup|PITR|pg_dump|snapshot` en todo el repo), `:252` (checklist G-05: "confirmar plan Supabase/Vercel y ventana PITR" — **pendiente**).
- **Documentación existente:** `legal/security-audit.md:198-231` ya propone RPO/RTO: **Supabase PITR con RPO minutos y RTO minutos-horas; retención Free 7d / Pro 30d** (`:204-206`); Storage 30 d; self-host `pg_dump` diario cifrado + test de restore (`:228-231`).
- **Qué falta (hechos, no propuestas):** el plan real (Free vs Pro) es **NO_AUDITADO**; no hay evidencia de restore drill ni de job `pg_dump` para la ruta self-host (`docker-compose.prod.yml` solo rota logs, `legal/security-audit.md:41`). La remediación "E-retención/PITR" se declara mergeada en `main@d5c6f6c` (`legal/legal-final-report.md:7,41`) pero es **documentación, no código**.
- **Recomendación (no ejecutada):** fijar RPO ≤ 24 h / RTO ≤ 4 h como contrato interno; captura del panel de Supabase como prueba; un `pg_dump` cifrado mensual + restore drill trimestral; versionar el resultado en `legal/backups.md`.

---

## 7. Modelo de sostenibilidad

- **Plataforma gratuita, sin e-commerce:** `legal/project-classification.md:14` (modelo 100 % gratuito, `grep vacío` stripe/paypal/checkout) y `legal/legal-final-report.md:7`: `legal/politica-comercial.md` documentada como **NO APLICA** (el archivo no existe en `legal/` — verificado por glob). No hay ingreso que cruce contra el costo de infraestructura.
- **Riesgo de dependencia:** 5 terceros externos, 3 de ellos con datos personales en EE. UU. y sin contrato firmado aún (P0). El producto core (labs) depende de 2 CDN sin SLA.
- **Alternativas self-host evaluadas como OPCIONES (no como failover activo):** `Dockerfile.nextjs:1-60` (build standalone reproducible) y `docker-compose.prod.yml` (límites 512M/1.0 CPU, `read_only`) ya existen en el repo; `docker-compose.monitoring.yml` agregaría observabilidad. Permiten reducir dependencia de Vercel y bajar costos, a cambio de que el mantenedor asuma operación (backups, TLS, monitoreo). Trade-off documentado, sin ejecución.

---

## 8. Continuidad

- **Mantenedor:** persona natural, NIT 700329113-7, Altavista-Medellín, contacto `invitro.code@gmail.com` (`legal/project-classification.md:9`). Proyecto unipersonal: riesgo de bus factor 1 sobre credenciales de Clerk/Supabase/Vercel y sobre el repo.
- **Plan de continuidad mínimo propuesto (recomendación, no hecho):**
  1. Runbook de 1 página: variables de entorno (`.env.local.example`), aplicación del schema (`supabase-migration.sql`), procedimiento de restore (ver §6) y pin de Pyodide.
  2. Gestor de secretos con recovery codes; segundo acceso de emergencia documentado (aunque sea solo para revocar/rotar).
  3. Export periódico del schema + dump de datos (vinculado a §6).
  4. Documentar en README que `openspec/` + `legal/` son la fuente de verdad de decisiones para un mantenedor futuro.

---

## Hallazgos (formato obligatorio)

| ID | Categoría | Estado | Descripción | Evidencia | Impacto | Prioridad | Solución | Archivos / Proveedor | Criterio de aceptación | Prueba |
|---|---|---|---|---|---|---|---|---|---|---|
| SO-PROV-01 | Sostenibilidad legal | ABIERTO | Transferencias art. 26 a EE. UU. (Clerk/Supabase/Vercel) sin autorización conservable con mención expresa de país; `gender=x` sin autorización reforzada art. 6 | `legal/providers-audit.md:306,316`; `legal/legal-final-report.md:7` | Tratamiento sin base habilitante; sancionable SIC; bloquea publicación de política | **P0** | Cerrar consentimiento (checkbox no pre-marcado + `consent_logs` conservable Ley 527) y reflejarlo en `politica-privacidad.md` | Clerk, Supabase, Vercel / `politica-privacidad.md` | Existe prueba conservable de autorización que mencione EE. UU. + `gender=x` facultativo | Leer `consent_logs` en migración y formulario de sign-up |
| SO-PROV-02 | Sostenibilidad legal | PARCIAL | DPAs aceptados/versionados 2026-10-06-v1 pero **pendiente firma/receipt** conservable | `legal/providers-audit.md:318`; `legal/dpa-register.md` | Sin contrato firmado, la transferencia carece de garantías contractuales | **P1** | Firmar/aceptar los 3 DPAs; guardar PDF/receipt en `legal/receipts/`; versionar subencargados vigentes | Clerk, Supabase, Vercel / `legal/dpa-register.md` | Receipt con fecha+hash por Encargado en `legal/receipts/` | `ls legal/receipts/` + cotejar hash en `dpa-register.md` |
| SO-PROV-03 | Continuidad técnica | ABIERTO | Clerk es único IdP: si cae, todo lo no-público ( middleware exige sesión) queda inaccesible; sin failover | `src/middleware.ts:5-19,45-58`; `supabase-migration.sql:4-7` | Caída total de auth; usuarios nuevos y existentes fuera | **P1** | Documentar runbook de incidentes Clerk; evaluar proveedor secundario o página estática de aviso (costo/beneficio) | Clerk / `src/middleware.ts` | Runbook publicado + prueba de mesa de "Clerk caído" | Revisar runbook; simular 401/redirect con sesión inválida |
| SO-PROV-04 | Continuidad técnica | ABIERTO | Supabase concentra datos y el middleware admin consulta `profiles.role` por request admin; sin réplica ni export | `src/middleware.ts:59-64`; `legal/providers-audit.md:100` | Caída de perfil/progreso/rachas/logros; latencia extra en rutas admin | **P1** | Cachear rol en `public_metadata` de Clerk (mitigación ya sugerida en `legal/technical-audit.md:279`); export periódico | Supabase / `src/middleware.ts` | Request admin sin roundtrip a Supabase; export mensual versionado | Medir query por request admin; verificar export |
| SO-PROV-05 | Continuidad técnica | ABIERTO | Vercel es hosting único; si cae, cae el servicio completo. Self-host existe como opción, no como failover automático | `README.md:5`; `next.config.ts:4`; `Dockerfile.nextjs:1-60`; `docker-compose.prod.yml` | Indisponibilidad total del producto | **P1** | Documentar procedimiento de deploy self-host de emergencia (runbook) con estimación de tiempo | Vercel / `docker-compose.prod.yml` | Runbook con pasos verificados al menos una vez en staging | Ensayo de deploy self-host |
| SO-PROV-06 | Continuidad técnica | ABIERTO | jsDelivr y PyPI/Fastly son CDN gratuitos **sin SLA**: si caen, los labs no cargan (Pyodide) o fallan seaborn/plotly Python | `public/pyodide-worker.js:4-5,30-31,56-84`; `legal/providers-audit.md:132` | Core del producto (labs) inerte sin red o con CDN caído | **P2** | Cachear runtime en service worker o servir `pyodide/` desde el propio origen (self-host del runtime) | jsDelivr, PyPI / `public/pyodide-worker.js` | Lab funcional con jsDelivr bloqueado | Bloquear `cdn.jsdelivr.net` en dev y verificar fallback |
| SO-RED-01 | Dependencia de red | VERIFICADO (riesgo aceptado) | Los labs requieren internet: Pyodide v0.25.0 + paquetes se descargan de CDN en cada sesión nueva | `public/pyodide-worker.js:4-5`; `README.md:80` | Descarga ~15-25 MB por sesión fría; funcionalidad 100 % atada a red | **P1** | Documentar el requisito en UI de labs (aviso "requiere conexión") + evaluar cache persistente del runtime | jsDelivr / `public/pyodide-worker.js` | Usuario ve aviso explícito; runtime cacheado entre sesiones | Abrir lab offline y observar mensaje controlado |
| SO-RED-02 | Supply-chain | ABIERTO | `micropip.install("seaborn"/"plotly")` sin pin de versión: wheels pueden cambiar bajo los pies | `public/pyodide-worker.js:70,82`; `legal/providers-audit.md:331` (PROV-04) | Ruptura no reproducible de labs; superficie de supply-chain | **P2** | Pin `seaborn==x.y.z` / `plotly==x.y.z` compatibles con Pyodide 0.25.0 + test de humo | PyPI / `public/pyodide-worker.js` | Versiones fijas en el worker y documentadas | Cambiar pin y correr `npm run test` + lab manual |
| SO-NPM-01 | Deuda de dependencias | ABIERTO | Plotly duplicado: `plotly.js ^4.1.1` + `plotly.js-dist-min ^3.7.0` + `react-plotly.js ^4.0.0` | `package.json:32-33,37`; `legal/providers-audit.md:333` (PROV-06) | Bundle más pesado; dos majors que mantener/auditar | **P2** | Eliminar la variante no usada (dejar la que consume `react-plotly.js`) y medir bundle | Plotly / `package.json` | Una sola variante Plotly en `dependencies`; bundle menor o igual | Revisar `package.json` + comparar tamaño de build |
| SO-NPM-02 | Deuda de dependencias | ABIERTO | `lucide-react ^1.25.0` atípico para el ecosistema (histórico 0.x) y con caret que permite drift | `package.json:28`; `package-lock.json:5452-5454` | Drift silencioso de iconos; peso de bundle si el tree-shaking falla | **P3** | Confirmar que la major 1.x es intencional; fijar pin exacto como el resto de deps de UI o documentar excepción | lucide-react / `package.json` | Pin exacto o decisión documentada en `openspec/` | `npm ls lucide-react` + revisar pin |
| SO-NPM-03 | Calidad / gates | ABIERTO | Sin linter (roto por diseño), sin umbral de coverage (`coverage_threshold: 0`), sin e2e | `openspec/config.yaml:43,56,62`; `README.md:29` | Solo `type-check` + build de Vercel protegen el repo | **P2** | Añadir chequeo en CI: `no-restricted-imports` para `createAdminClient` en cliente + umbral de coverage > 0 cada tanto | Repo / `vitest.config.mts`, CI | CI falla si se importa admin client en `"use client"` o la coverage baja del umbral acordado | Correr CI con violación de prueba |
| SO-DOC-01 | Doc-drift | VERIFICADO | Docs dicen 6 archivos/37 tests; la realidad es **19 archivos/187 tests**; afirman que `requestId-descarte.test.mjs` corre y **no corre** (glob solo cubre `.ts/.tsx`) | `openspec/config.yaml:14,65-68`; `README.md:24,33`; `AGENTS.md:10`; `vitest.config.mts:6` | Falsa sensación de cobertura; test muerto documentado como vivo; decisiones sobre datos falsos | **P2** | Actualizar los 4 lugares al conteo real y añadir `.mjs` al `include` (o borrar el archivo) | `openspec/config.yaml`, `README.md`, `AGENTS.md` | `vitest run` reporta 20 archivos/188+ tests y la doc coincide | `npm run test` y comparar conteo |
| SO-DOC-02 | Doc-drift | VERIFICADO | DESIGN.md cita `ui/PageShell` y `ui/SiteHeader` que **no existen** | `DESIGN.md:180,185`; glob de `src/components/ui/` ausente | Onboarding confuso; búsquedas de archivos fantasma | **P3** | Borrar las filas o crear los componentes; alinear tabla 2.2 | DESIGN.md / `src/components/ui/` | Toda fila de DESIGN.md §2.2 apunta a archivo existente | Script que valide paths de DESIGN.md |
| SO-DOC-03 | Doc-drift | VERIFICADO | DESIGN.md declara `/learn` público; middleware lo protege (redirect a `/sign-in`) | `DESIGN.md:518`; `src/middleware.ts:5-19,45-57` | Promesa de acceso público incumplida; fricción de conversión | **P2** | Decidir producto: añadir `/learn` a `publicRoutes` o corregir DESIGN.md | `src/middleware.ts` / DESIGN.md | Doc y middleware coinciden | Request anónimo a `/learn` |
| SO-DOC-04 | Doc-drift / información al consumidor | VERIFICADO | AGENTS.md dice que `/api/certify` "siempre retorna `certified: true`"; en realidad responde 503 `certified:false` salvo flag ON (default `false`) | `AGENTS.md:34`; `src/app/api/certify/route.ts:22-27,51-56`; `.env.local.example:17` | Afirmación falsa sobre certificación (Ley 1480: información veraz); riesgo de inducir a error al usuario | **P2** | Corregir AGENTS.md: "503 por defecto; stub certificante solo con flag ON, etiquetado MVP no certificante" | `AGENTS.md` / `src/app/api/certify/route.ts` | Texto de AGENTS.md coincide con comportamiento verificado | POST sin flag → 503; con flag → stub |
| SO-COST-01 | Costo por usuario | **BLOQUEADO** | No hay datos de uso ni autorización para paneles; plan efectivo (Vercel/Clerk/Supabase) NO_AUDITADO; límites free tier a verificar en panel | `legal/retention-policy.md:21` (única referencia Free/Pro, sin evidencia de plan); ausencia de métricas en repo | Imposible presupuestar; riesgo de que plan Hobby (uso no comercial) no cubra operación con NIT | **P1** | Ejecutar la metodología de §5 con acceso a paneles; capturar límites y uso; recalcular costo por usuario | Vercel, Clerk, Supabase / este documento §5 | Tabla de costo por usuario con plan, límites y uso real citados | Capturas de panel + export de métricas |
| SO-BKP-01 | Backups | PARCIAL (doc, sin código) | Sin evidencia de backups/PITR en repo (`grep vacío`); RPO/RTO ya propuestos (PITR RPO minutos, RTO minutos-horas, Free 7d/Pro 30d); plan real y restore drill NO_AUDITADO | `legal/security-audit.md:23,41,70-76,198-231,252`; `legal/technical-audit.md:119` | Pérdida de datos posible sin recuperación probada; art. 19 Ley 1581 (medidas útiles) | **P1** | Crear `legal/backups.md` con RPO/RTO declarados, captura del panel Supabase, `pg_dump` cifrado y restore drill trimestral | Supabase, Vercel / `legal/backups.md` | `legal/backups.md` con evidencia de plan + drill ejecutado y fechado | Restore de un dump en entorno de prueba |
| SO-MOD-01 | Modelo económico | VERIFICADO (riesgo) | Plataforma 100 % gratuita sin ingresos; todos los costos (infra + mantenimiento) los absorbe la persona natural NIT 700329113-7 | `legal/project-classification.md:9,14`; `legal/legal-final-report.md:7` (política comercial NO APLICA) | Sostenibilidad depende de la capacidad de gasto del mantenedor; sin colchón para planes pagos | **P1** | Documentar techo de gasto mensual; alertas de uso en paneles; evaluar plan Pro solo si el uso lo exige | Vercel/Clerk/Supabase (planes) | Presupuesto documentado + alertas configuradas | Captura de alertas de billing |
| SO-CONT-01 | Continuidad organizacional | ABIERTO | Bus factor 1: mantenedor único (persona natural) con credenciales de 5 terceros y el repo | `legal/project-classification.md:9` | Pérdida de acceso = proyecto congelado (auth, DB, hosting en manos de una persona) | **P2** | Plan mínimo de §8: runbook, gestor de secretos con recovery, segundo acceso de emergencia, export periódico | Repo / paneles de proveedores | Runbook versionado + segundo acceso probado | Ensayo de recuperación con el runbook |

---

## Muestreo de verificación de paths (5)

Paths citados en este documento, verificados por lectura directa durante la auditoría:

1. `legal/providers-audit.md` — leído (393 líneas); fichas P-01..P-11 y GAPs PROV-01..07.
2. `legal/security-audit.md` — leído (§Backups líneas 198-231, C-08, H-03, checklist G-05).
3. `src/app/api/certify/route.ts` — leído (67 líneas); 503 con flag OFF, stub con flag ON.
4. `package.json` — leído (60 líneas); `plotly.js:32-33`, `lucide-react:28`.
5. `vitest.config.mts` — leído (19 líneas); `include` sin `.mjs` en línea 6.

Además verificado por glob/grep: 19 archivos de test `.ts/.tsx` + 1 `.mjs`; 187 casos `it/test(`; ausencia de `PageShell.tsx` y `SiteHeader.tsx` en `src/components/ui/`; `lucide-react` resuelto 1.25.0 en `package-lock.json:5454`; ausencia de `legal/politica-comercial.md` en `legal/`.

---

*Documento de auditoría interna. No modifica código ni configuración. Cada hallazgo BLOQUEADO/NO_AUDITADO requiere autorización y acceso a paneles para cerrarse.*

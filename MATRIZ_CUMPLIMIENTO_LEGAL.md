# Matriz de Cumplimiento Legal — InVitro-Code

> **Qué es:** inventario técnico de conformidad legal de InVitro-Code (plataforma educativa gratuita, B2C, público +18, operada desde Colombia). **Alcance:** worktree `presentation-reemplazo-directo`, verificado el 2026-10-11 contra los bytes reales del repositorio y las auditorías de `legal/`. **Método:** cada afirmación cita `archivo:línea` verificable; donde una auditoría previa contradice al código actual, se señala explícitamente. Se distinguen **HECHOS** (verificados en código/documentos publicados) de **PENDIENTES** (obligaciones no ejecutadas).

## Resumen ejecutivo

| Estado | Filas | Lectura |
|--------|-------|---------|
| **CUMPLE** | 22 | Obligación implementada y evidenciada en código o página publicada |
| **PARCIAL** | 7 | Implementada a medias o con brecha residual documentada |
| **NO_CUMPLE** | 1 | Obligación vigente sin ejecutar (RNBD) |
| **NO_APLICA** | 5 | Inaplicable por modelo de negocio/gratuidad, documentado con razón |
| **NO_AUDITADO** | 1 | Fuera del alcance auditado (otras leyes LATAM) |

**Conclusión:** la base habilitante de protección de datos (autorización art. 9/6/26 conservable, supresión art. 8, retención definida) **está implementada en código**, no solo documentada. Los pendientes reales son de **gestión externa**: firmar DPAs, inscribir el RNBD e implementar las purgas 60d/24m que hoy son solo norma.

## Cómo leer esta matriz

- **Aplicabilidad:** si la norma aplica al modelo verificado (gratuito, sin pagos, +18, Colombia).
- **Estado:** `CUMPLE` / `PARCIAL` / `NO_CUMPLE` / `BLOQUEADO` / `NO_APLICA` / `NO_AUDITADO`. No se afirma cumplimiento por la mera existencia de un archivo: la evidencia debe mostrar el comportamiento (código) o el contenido publicado (página renderizada).
- **Validación profesional:** `SÍ` cuando la fila depende de una interpretación jurídica o de un trámite externo (abogado/SIC); `NO` cuando es un hecho técnico verificable.

## Datos del responsable (verificados, no inventados)

| Campo | Valor | Evidencia |
|-------|-------|-----------|
| Titular | Persona natural — Colombia | `legal/project-classification.md:9` |
| NIT | 700329113-7 | `legal/project-classification.md:9`; `src/app/(legal)/aviso/page.tsx:34,65` |
| Domicilio | Corregimiento Altavista, Medellín | `legal/project-classification.md:10`; `src/app/(legal)/aviso/page.tsx:66` |
| Contacto / canal de derechos | invitro.code@gmail.com | `legal/project-classification.md:11`; `src/app/(legal)/privacidad/page.tsx:62` |
| Modelo | 100 % gratuito, sin monetización | `legal/project-classification.md:14`; `src/app/(legal)/aviso/page.tsx:68` |
| Páginas legales publicadas | aviso, privacidad, cookies, términos, ia (sin placeholders) | `src/app/(legal)/aviso/page.tsx:1`; `src/app/(legal)/privacidad/page.tsx:1`; `src/app/(legal)/cookies/page.tsx:1`; `src/app/(legal)/terminos/page.tsx:1`; `src/app/(legal)/ia/page.tsx:1`; enlaces en `src/components/landing/Footer.tsx:75-83` |

---

## 1. Tabla de conformidad

| ID | Requisito | Norma / fuente | Aplicabilidad | Estado | Evidencia (path:line) | Brecha | Validación profesional |
|----|-----------|----------------|---------------|--------|----------------------|--------|------------------------|
| R-01 | 1.1 · Identificación del responsable (NIT, domicilio, contacto) | Ley 1581 art. 3; Decreto 1074 Tít. 3 | Aplica | **CUMPLE** | `legal/project-classification.md:9-11`; `src/app/(legal)/aviso/page.tsx:34,65-67` | Ninguna | NO |
| R-02 | 1.1 · Aviso legal publicado (titular, jurisdicción, infraestructura) | Ley 1581 art. 9 (información); Ley 1480 | Aplica | **CUMPLE** | `src/app/(legal)/aviso/page.tsx:62-99`; `legal/aviso-legal.md:9,21` | Ninguna | NO |
| R-03 | 1.1 · Términos y condiciones publicados | Ley 1480; práctica contractual | Aplica | **CUMPLE** | `src/app/(legal)/terminos/page.tsx:45`; `legal/terminos-condiciones.md:7` | Ninguna | NO |
| R-04 | 1.1 · Público objetivo +18 declarado | Ley 1581 (protección menores) | Aplica | **PARCIAL** | `legal/project-classification.md:15,42`; `src/app/(legal)/terminos/page.tsx:45` | Declarado en documentos; sin verificación de edad en el registro (`grep vacío` age verification, `legal/project-classification.md:42`) | NO |
| R-05 | 1.1 · Marco jurídico y alcance territorial declarados | Ley 1581; Decreto 1377/1074 | Aplica | **CUMPLE** | `legal/project-classification.md:13,16`; `src/app/layout.tsx:39` (`lang="es"`); `openspec/config.yaml:6` | alcance LATAM es declaración de negocio, sin segmentación por país | NO |
| R-06 | 1.2 · Autorización previa, expresa e informada (art. 9) | Ley 1581 art. 9; Decreto 1377 art. 5 | Aplica | **CUMPLE** | `src/components/auth/AuthForm.tsx:427-481` (checkbox no pre-marcado `:433`); `src/app/api/consent/route.ts:21`; gate en `src/app/api/webhooks/clerk/route.ts:57-85` | Registro de consentimiento es best-effort en el cliente (`AuthForm.tsx:170`) | NO |
| R-07 | 1.2 · Autorización explícita y reforzada para `gender=x` (art. 6) | Ley 1581 arts. 5-6 | Aplica | **CUMPLE** | `src/components/profile/ProfileForm.tsx:124-147` (checkbox art. 6); enforcement servidor `src/app/(dashboard)/perfil/page.tsx:110-117`; `src/app/api/webhooks/clerk/route.ts:60-68`; columna `supabase-migration.sql:300` | La calificación de `gender=x` como sensible es interpretación SIC (`legal/data-inventory.md:25`) | **SÍ** |
| R-08 | 1.2 · Mención expresa de transferencia internacional (art. 26) | Ley 1581 art. 26 | Aplica | **CUMPLE** | Texto de autorización menciona EE. UU.: `src/components/auth/AuthForm.tsx:18`; `legal/politica-privacidad.md:34,51` | EE. UU. sin nivel adecuado declarado por la SIC: se sostiene en DPA/SCC aún sin firmar (R-17) | **SÍ** |
| R-09 | 1.2 · Prueba conservable de la autorización | Ley 527 arts. 5-12 | Aplica | **CUMPLE** | `supabase-migration.sql:408-440` (`consent_logs` + COMMENT "Ley 527"); persistencia con hash/IP/UA/versión: `src/lib/supabase/consent.ts:47-56` | Ninguna | NO |
| R-10 | 1.2 · Política de privacidad publicada | Ley 1581 art. 9 (información) | Aplica | **CUMPLE** | `src/app/(legal)/privacidad/page.tsx:62,109`; `legal/politica-privacidad.md:3,17-25` | Ninguna | NO |
| R-11 | 1.2 · Canal y procedimiento de derechos del titular (consulta, reclamo, revocatoria) | Ley 1581 art. 8; Decreto 1377 arts. 14-15 | Aplica | **CUMPLE** | `legal/politica-privacidad.md:10,39` (10/15 días hábiles); `src/app/(legal)/aviso/page.tsx:107` | Ninguna | NO |
| R-12 | 1.2 · Supresión implementada (borrado en cascada + Clerk + Storage) | Ley 1581 art. 8 | Aplica | **CUMPLE** | `src/app/api/account/route.ts:9,18-36`; `user.deleted`: `src/app/api/webhooks/clerk/route.ts:105-126`; RLS DELETE: `supabase-migration.sql:477-485` | Borrado en Clerk/Storage es best-effort (`webhooks/clerk/route.ts:118-123`) | NO |
| R-13 | 1.2 · Inventario de datos y finalidades | Ley 1581 art. 4 (finalidad) | Aplica | **CUMPLE** | `legal/data-inventory.md:13-27,37-58` (flujos F-01 a F-09; `gender` semi-sensible `:25`) | Ninguna | NO |
| R-14 | 1.2 · Retención definida por base | Ley 1581 art. 4 (temporalidad); Decreto 1074 Tít. 3 | Aplica | **PARCIAL** | Norma v1: `legal/retention-policy.md:12-23`; publicada: `src/app/(legal)/privacidad/page.tsx:56,109` | Norma documental; purgas P1/P2 sin ejecutar (R-15) | **SÍ** |
| R-15 | 1.2 · Purgas automáticas ejecutables | Ley 1581 art. 4 (minimización) | Aplica | **PARCIAL** | **Implementado:** purga `pending` 24 h — `vercel.json:3-6` + `src/app/api/cron/purge-pending/route.ts:57-62` + `src/domain/consent.ts:33`. **Pendiente:** `legal/retention-policy.md:41-42,50` ("SQL TTL no implementado en v1") | `pg_cron`/cron de 60 días (`codeSnapshot`) y 24 meses (inactividad) sin código | **SÍ** |
| R-16 | 1.2 · Inscripción de bases de datos en el RNBD (SIC) | Decreto 1074 Tít. 3 | Aplica (a evaluar) | **NO_CUMPLE** | Plan sin ejecutar: `legal/retention-policy.md:29-35` (casillas sin marcar); `legal/legal-final-report.md:46`; `legal/project-classification.md:64` | 7 bases sin inscribir; la obligación de una persona natural gratuita requiere interpretación profesional | **SÍ** |
| R-17 | 1.2 · DPAs de Encargados firmados con receipt | Ley 1581 arts. 17-18, 26 | Aplica | **PARCIAL** | Registro versionado: `legal/dpa-register.md:15-17` (Clerk, Supabase, Vercel — "pendiente firma"); pasos `:33-39` | Sin PDFs firmados ni hashes en `legal/receipts/` | **SÍ** |
| R-18 | 1.2 · Medidas de seguridad técnicas y administrativas | Ley 1581 art. 4 lit. g); art. 19 Decreto 1377 | Aplica | **PARCIAL** | Guard service-role: `src/lib/supabase/admin.ts:11`; RLS DELETE: `supabase-migration.sql:477-485`; rate limit + 429: `src/lib/rate-limit.ts:12`, `src/app/api/progress/route.ts:45`, `src/app/api/lab-progress/route.ts:62`; avatar: `src/lib/profile/validateAvatar.ts`; auditoría: `legal/security-audit.md:18,26` | Backups sin evidencia en repo (`legal/security-audit.md:41`); rate-limit in-memory (`src/lib/rate-limit.ts:1`) | NO |
| R-19 | 1.3 · Cookies técnicas identificadas e informadas | Ley 1581 art. 9 (funcional); LSSI art. 22.2 | Aplica | **CUMPLE** | `legal/cookies-audit.md:33-34` (C-01 `__session`, C-02 familia Clerk); `legal/politica-cookies.md:13-14` | Ninguna | NO |
| R-20 | 1.3 · Ausencia de cookies/analítica/píxeles no necesarios | Ley 1581 art. 9; LSSI | Aplica (por ausencia) | **CUMPLE** | `legal/cookies-audit.md:102` (V-01 "cumple por ausencia"); `legal/analytics-audit.md:33-41` (I-01..I-05 "sin medición") | Riesgo futuro si se añaden analíticas sin CMP (`legal/cookies-audit.md:102`) | NO |
| R-21 | 1.3 · Banner de consentimiento de cookies (CMP) | LSSI / art. 9 (solo cookies no necesarias) | No aplica | **NO_APLICA** | `src/app/(legal)/cookies/page.tsx:82` ("no hay cookies que bloquear"); `legal/cookies-audit.md:102` | No aplica mientras no existan cookies no necesarias | NO |
| R-22 | 1.3 · Política de cookies publicada con cláusula de salvaguarda | Deber de información | Aplica | **CUMPLE** | `src/app/(legal)/cookies/page.tsx:82`; `legal/politica-cookies.md:3,23-29,52` | Ninguna | NO |
| R-23 | 1.4 · TyC: registro, mayoría de edad, datos veraces | Ley 1480; contractual | Aplica | **CUMPLE** | `src/app/(legal)/terminos/page.tsx:45`; `legal/terminos-condiciones.md:16` | Ninguna | NO |
| R-24 | 1.4 · Etiquetado honesto de la certificación (stub) | Ley 1480 (información veraz) | Aplica | **CUMPLE** | Flag desactivado: `src/app/api/certify/route.ts:22`; `.env.local.example:17`; disclaimer: `legal/terminos-condiciones.md:36` | Ninguna | NO |
| R-25 | 1.4 · Limitación de responsabilidad y disponibilidad | Contractual | Aplica | **CUMPLE** | `legal/terminos-condiciones.md:44` | Ninguna | NO |
| R-26 | 1.5 · Venta online, checkout, pagos, suscripciones | Ley 1480 (comercio electrónico) | No aplica | **NO_APLICA** | `legal/legal-final-report.md:69`; `grep vacío` stripe/paypal/checkout: `legal/project-classification.md:14,31`; `legal/data-inventory.md:50` | No aplica: plataforma 100 % gratuita | NO |
| R-27 | 1.5 · Retracto, reversión de pagos, garantía legal con precio | Ley 1480 Cap. V | No aplica | **NO_APLICA** | `legal/terminos-condiciones.md:32`; `legal/project-classification.md:82` | No aplica: sin transacción ni precio | NO |
| R-28 | 1.5 · Deber de información veraz y no publicidad engañosa | Ley 1480 arts. 3, 23-29 | Aplica (atenuada) | **CUMPLE** | `legal/project-classification.md:77-82`; `legal/terminos-condiciones.md:32,36` | La aplicación "atenuada por gratuidad" es interpretación a validar | **SÍ** |
| R-29 | 1.5 · Política comercial (cambios, devoluciones, facturación) | Ley 1480 | No aplica | **NO_APLICA** | `legal/legal-final-report.md:69` | Documentado como NO APLICA (sin checkout); no existe archivo `politica-comercial.md`: el NO APLICA consta en `legal/legal-final-report.md:69` | NO |
| R-30 | 1.6 · Licencia del proyecto declarada con excepciones | Ley 23/1982; Decisión 351 | Aplica | **CUMPLE** | `LICENSE:1` (MIT) + `LICENSE:25` (excepción gsap Standard Free); `legal/terminos-condiciones.md:28` | Ninguna | NO |
| R-31 | 1.6 · Conflictos de licencia en dependencias | Decisión 351 art. 13 | Aplica | **PARCIAL** | Conflicto GPL resuelto: `legal/ip-audit.md:39,51`; `legal/aviso-legal.md:36` ("typed.js GPL-3.0 ya removido"); `legal/legal-final-report.md:32` | Activos gráficos/animados sin licencia explícita (`legal/ip-audit.md:45,62`) | **SÍ** |
| R-32 | 1.6 · Contenido de terceros y bibliografía citada | Ley 23/1982; Decisión 351 (cita) | Aplica | **CUMPLE** | `legal/project-classification.md:43` (`references.bib`); `legal/terminos-condiciones.md:28` | Ninguna | NO |
| R-33 | 1.7 · Transparencia de IA (offline y runtime) | Ley 1581 (información); referencia EU AI Act | Aplica | **CUMPLE** | `legal/politica-ia.md:7,16`; `src/app/(legal)/ia/page.tsx:84` | Ninguna | NO |
| R-34 | 1.7 · Ausencia de IA generativa / LLM en runtime | — (declaración de alcance) | No aplica | **NO_APLICA** | `legal/ai-audit.md:58,100`; ejecución local: `public/pyodide-worker.js:4-5`; stub inactivo: `src/app/api/certify/route.ts:39-43` | Si se activa E2B, re-versionar política (`legal/politica-ia.md:38-40`) | NO |
| R-35 | 1.7 · Certificación presentada como no oficial | Ley 1480 (información veraz) | Aplica | **CUMPLE** | `legal/terminos-condiciones.md:36`; `src/app/api/certify/route.ts:22,50` | Ninguna | NO |
| R-36 | 1.7 · Accesibilidad web | WCAG 2.1 A/AA; NTC 5854 (referencia) | Aplica (orientativa) | **PARCIAL** | `legal/accessibility-audit.md:21,25`; fortalezas 6/10: `:30-32` | 4 gaps AA (contraste, foco visible, etiqueta de formulario, jerarquía de encabezados); no bloquea uso con teclado/lector | NO |
| R-37 | 1.7 · Cumplimiento en otros países LATAM destino | LGPD / LFPDPPP (referencia) | No auditado | **NO_AUDITADO** | `legal/project-classification.md:13,91` | Sin evaluación de leyes locales de países destino | **SÍ** |

---

## 2. Detalle por área

### 1.1 Identidad y situación jurídica

**HECHOS verificados**

- Responsable persona natural colombiana con NIT 700329113-7, domicilio en Corregimiento Altavista (Medellín) y canal único `invitro.code@gmail.com`, publicados con datos reales y sin placeholders en `/aviso` (`src/app/(legal)/aviso/page.tsx:34,65-67`) y reflejados en `legal/project-classification.md:9-11`.
- Marco jurídico declarado: Ley 1581/2012, Decreto 1377/2013 (compilado en el Decreto 1074/2015), Ley 527/1999, Ley 1480/2011, Ley 23/1982 + Decisión 351 (`legal/project-classification.md:16`; `src/app/(legal)/aviso/page.tsx:80`).
- Público declarado +18 y modelo 100 % gratuito (`legal/project-classification.md:14-15`; `src/app/(legal)/terminos/page.tsx:45`).

**PENDIENTES**

- Sin verificación técnica de edad en el registro: la restricción +18 es declaración documental, no control implementado (`legal/project-classification.md:42`).

### 1.2 Protección de datos personales

**HECHOS verificados (código, no solo documentos)**

- **Autorización art. 9 implementada:** checkbox no pre-marcado en `/sign-up` con texto que declara finalidades, mención de EE. UU. y vía de retiro (`src/components/auth/AuthForm.tsx:18,427-481`); persistencia vía `POST /api/consent` (`src/app/api/consent/route.ts:21`).
- **Prueba conservable (Ley 527):** tabla `consent_logs` con `policy_version`, `accepted_text_hash`, `purposes`, `ip`, `user_agent` (`supabase-migration.sql:408-440`; `src/lib/supabase/consent.ts:47-56`).
- **Dato sensible art. 6:** `gender=x` exige autorización explícita y separada; el webhook rechaza la persistencia sin ella (`src/app/api/webhooks/clerk/route.ts:60-68`), el perfil bloquea el guardado sin consentimiento (`src/app/(dashboard)/perfil/page.tsx:110-117`) y la UI ofrece casilla facultativa (`src/components/profile/ProfileForm.tsx:124-147`).
- **Transferencia art. 26 informada:** la autorización menciona expresamente el país destino (EE. UU.) (`src/components/auth/AuthForm.tsx:18`; `legal/politica-privacidad.md:34,51`).
- **Derechos art. 8 operativos:** `DELETE /api/account` con cascada y borrado en Clerk (`src/app/api/account/route.ts:9,18-36`), handler `user.deleted` (`src/app/api/webhooks/clerk/route.ts:105-126`), políticas RLS `DELETE` por titular (`supabase-migration.sql:477-485`) y canal con términos 10/15 días hábiles (`legal/politica-privacidad.md:10,39`).
- **Retención:** norma v1 por base (`legal/retention-policy.md:12-23`) y purga automática de consentimientos `pending` a las 24 h efectivamente programada (`vercel.json:3-6`; `src/app/api/cron/purge-pending/route.ts:57-62`; `src/domain/consent.ts:33`).
- **Encargados identificados:** 11 conceptos auditados P-01..P-11, con 5 proveedores en transferencia internacional (Clerk, Supabase, Vercel + jsDelivr y PyPI como terceros técnicos sin datos personales) (`legal/providers-audit.md:17,52-62`).

**PENDIENTES**

- **RNBD sin inscripción** (R-16): plan documentado, casillas sin marcar (`legal/retention-policy.md:29-35`).
- **DPAs sin firmar** (R-17): registro versionado con URLs oficiales, sin receipts ni hashes (`legal/dpa-register.md:15-17,39`).
- **Purgas P1/P2 sin implementar** (R-15): 60 días para `codeSnapshot` y 24 meses de inactividad son norma documental, no jobs ejecutables (`legal/retention-policy.md:41-42,50`).
- **Backups sin evidencia en repo** (R-18): PITR de Supabase y retención de Vercel no verificables desde el repositorio (`legal/security-audit.md:41`).

**Nota de verificación contra auditorías previas (HECHOS actuales > snapshot documental):** `legal/security-audit.md:37` reporta "sin política DELETE en ninguna tabla" y `:40` "sin rate limiting", y `legal/technical-audit.md:91,120` afirma que `vercel.json` no existe. En los bytes actuales del worktree **sí existen**: políticas RLS `DELETE` (`supabase-migration.sql:477-485`), rate limiting con 429 (`src/lib/rate-limit.ts:12`; `src/app/api/progress/route.ts:45`; `src/app/api/lab-progress/route.ts:62`) y `vercel.json:1-16` con el cron de purga. Esas tres auditorías son snapshots previos a las mitigaciones; la matriz se basa en el código actual.

### 1.3 Cookies y analítica

**HECHOS verificados**

- Solo cookies técnicas de Clerk (C-01 `__session`, C-02 familia `__clerk_*`), documentadas con finalidad, titular y duración (`legal/cookies-audit.md:33-34`; `legal/politica-cookies.md:13-14`).
- Cero cookies de tracking, cero analítica, cero píxeles: verificado por `grep vacío` en cada categoría (`legal/cookies-audit.md:102`; `legal/analytics-audit.md:33-41`).
- Política de cookies publicada con cláusula de salvaguarda ante la incorporación futura de analítica (`src/app/(legal)/cookies/page.tsx:82`; `legal/politica-cookies.md:52`).

**PENDIENTES**

- Ninguno bloqueante. El banner CMP es **NO APLICA** por ausencia de cookies no necesarias; se congestionaría solo si se añaden analíticas (`legal/cookies-audit.md:102`).

### 1.4 Términos

**HECHOS verificados**

- TyC publicados con requisitos de registro, mayoría de edad y datos veraces (`src/app/(legal)/terminos/page.tsx:45`; `legal/terminos-condiciones.md:16`).
- Etiquetado honesto de la certificación: el endpoint es stub desactivado por flag (`src/app/api/certify/route.ts:22`; `.env.local.example:17`) y los TyC lo declaran "no oficial" (`legal/terminos-condiciones.md:36`).
- Limitación de responsabilidad coherente con el modelo gratuito (`legal/terminos-condiciones.md:44`).

**PENDIENTES**

- Ninguno.

### 1.5 Comercio electrónico

**HECHOS verificados — NO APLICA documentado, con la razón**

- **Razón:** la plataforma es 100 % gratuita; no hay venta, precio, checkout, suscripciones ni carrito. Evidencia: `grep vacío` de `stripe|paypal|mercadopago|checkout|paddle|lemonsqueezy` en `src/` y `package.json` (`legal/project-classification.md:14,31`; `legal/data-inventory.md:50`).
- Consecuencia normativa: no aplican retracto, reversión de pagos ni garantía legal de producto con precio (Ley 1480 Cap. V); sí aplica el deber de información veraz (`legal/terminos-condiciones.md:32`; `legal/project-classification.md:82`).
- El NO APLICA de la política comercial consta en `legal/legal-final-report.md:69` (no existe archivo `politica-comercial.md`; no se inventa su contenido).

**PENDIENTES**

- Validar la aplicación "atenuada" de la Ley 1480 a un servicio gratuito (R-28).

### 1.6 Propiedad intelectual

**HECHOS verificados**

- Licencia propia declarada: MIT con excepción explícita para gsap Standard Free (`LICENSE:1,25`; `legal/terminos-condiciones.md:28`).
- Conflicto GPL resuelto: `typed.js` (GPL-3.0) removido del proyecto (`legal/aviso-legal.md:36`; `legal/legal-final-report.md:32`; `grep typed.js` en `package.json` sin resultados).
- Bibliografía de terceros citada como referencia académica (`legal/project-classification.md:43`; `legal/terminos-condiciones.md:28`).

**PENDIENTES**

- Activos gráficos/animados (~15) sin licencia explícita documentada (`legal/ip-audit.md:45,62`).

### 1.7 Publicidad y transparencia educativa

**HECHOS verificados**

- Sin IA generativa en runtime: ejecución Python local vía Pyodide (`legal/ai-audit.md:100`; `public/pyodide-worker.js:4-5`); stub de certificación inactivo tras flag (`src/app/api/certify/route.ts:22`).
- IA offline usada en producción de assets declarada con proveedores (Recraft, Anymotion, Spritecook) (`legal/politica-ia.md:7`).
- Sin publicidad engañosa: la certificación se presenta como no oficial (`legal/terminos-condiciones.md:36`).
- Accesibilidad: WCAG 2.1 nivel A conforme, AA parcialmente conforme con 4 gaps identificados (`legal/accessibility-audit.md:21,25`).

**PENDIENTES**

- Cerrar los 4 gaps AA de accesibilidad (contraste, foco visible, etiqueta de formulario, jerarquía de encabezados) (`legal/accessibility-audit.md:25,30-32`).
- Evaluar cumplimiento en países LATAM destino si el alcance se consolida (`legal/project-classification.md:91`).

---

## 3. Cuestiones pendientes de validación profesional

> Estas cuestiones **no** pueden cerrarse con evidencia técnica del repositorio: requieren abogado, trámite ante la SIC o configuración externa verificable.

| # | Cuestión | Por qué requiere validación profesional | Evidencia | Estado |
|---|----------|----------------------------------------|-----------|--------|
| 1 | **Firma de DPAs** (Clerk, Supabase, Vercel) y conservación de receipts con hash | La transferencia art. 26 a EE. UU. (país sin nivel adecuado declarado por la SIC) se sostiene hoy en la autorización; falta confirmar si el DPA estándar basta o se requieren cláusulas contractuales (SCC) firmadas | `legal/dpa-register.md:15-17,33-39`; `legal/politica-privacidad.md:51` | Pendiente |
| 2 | **Inscripción en el RNBD** de 7 bases (`profiles`, `progress`, `lab_progress`, `streaks`, `reflection_completions`, `user_achievements`, bucket `avatars` + `consent_logs`) | La obligación de registrar aplica a sociedades/entidades; para una persona natural con actividad gratuita la obligación es una interpretación que debe confirmar un abogado antes de inscribir (o de justificar la no inscripción) | `legal/retention-policy.md:29-35`; `legal/legal-final-report.md:46`; `legal/project-classification.md:64` | Pendiente |
| 3 | **Implementación de purgas P1/P2** (`codeSnapshot` 60 días; inactividad 24 meses) | La retención v1 es norma sin SQL TTL ni cron: los plazos deben validarse jurídicamente y luego ejecutarse con `pg_cron` o Vercel Cron | `legal/retention-policy.md:41-42,50`; `legal/legal-final-report.md:49` | Pendiente |
| 4 | **Plazos de retención v1** (6 meses post-supresión; 24 meses de inactividad → anonimización) | Son criterios técnicos propuestos; su suficiencia frente al principio de temporalidad y a reclamaciones art. 8 debe validarse profesionalmente | `legal/retention-policy.md:3,12-23` | Pendiente |
| 5 | **Calificación de `gender=x` como dato sensible** | La implementación ya lo trata con estándar reforzado art. 6; corresponde confirmar que el tratamiento (checkbox facultativa, no condicionada, autorización destacada) cubre el criterio de la SIC | `legal/data-inventory.md:25`; `legal/project-classification.md:41` | Implementado, pendiente de validación |
| 6 | **Aplicabilidad atenuada de la Ley 1480** y alcance en otros países LATAM | Que un servicio gratuito sea "relación de consumo" atenuada —y qué ley aplica a usuarios fuera de Colombia— es interpretación jurídica | `legal/project-classification.md:77-82,91` | Pendiente |
| 7 | **Backups / PITR** como medida art. 19 | La configuración real de backups de Supabase/Vercel no es verificable desde el repo; requiere confirmación del proveedor y documentación | `legal/security-audit.md:41` | Pendiente |

---

## 4. Nota final

Este documento es un inventario técnico, no asesoría jurídica; los requisitos inciertos requieren validación profesional. Distingue hechos verificados en el código (`archivo:línea`) de pendientes de ejecución o trámite; cualquier proveedor, cookie, columna o flujo nuevo invalida esta matriz y obliga a re-auditar.

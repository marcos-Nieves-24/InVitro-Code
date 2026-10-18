# Preguntas Pendientes — InVitro-Code

> **Versión:** 2026-10-16-v1 · **Fecha:** 2026-10-16
> **Responsable:** Persona natural Colombia · NIT 700329113-7 · `invitro.code@gmail.com`
> **Propósito:** Información y decisiones que **solo el titular o su asesor jurídico** puede confirmar. Sin estas respuestas, algunos documentos quedan en estado `DEFINIDA v1` (norma operativa) pero no en `CERTIFICADA` (opinión jurídica).
> **Método:** Cada pregunta cita por qué se necesita, qué documento afecta y qué pasa si no se responde.

---

## 1. Jurídico — Ley 1581 / Decreto 1074

| # | Pregunta | Por qué se necesita | Afecta | Si no se responde |
|---|---|---|---|---|
| J-01 | **¿El texto de `AuthForm.tsx:18` `getConsentText()` es suficiente para la SIC como autorización art. 9/26, o requiere doble checkbox separado (uno para tratamiento + uno para transferencia EE. UU.)?** Hoy es un solo `acceptBase` que bundledifica F-01 + `TRANSFER_EEUU`. | La SIC ha objetado `bundling` en algunos conceptos. Si exige granular, hay que partir `acceptBase` en dos. | `AuthForm.tsx`, `domain/consent.ts`, `politica-privacidad.md §3` | Se mantiene como está (riesgo medio de observación SIC). |
| J-02 | **¿`gender=x` debe inscribirse como base separada en RNBD (dato sensible) o basta una base `profiles` con flag `sensible=true`?** | RNBD exige declarar bases con datos sensibles por separado en algunos casos. | `retention-policy.md §2`, `data-inventory.md §3`, RNBD | Se inscribe como una sola base `profiles` con nota de sensible (criterio operativo v1). |
| J-03 | **¿El plazo de conservación de `consent_logs` "vida de la cuenta + 6 meses" (`migration.sql:418`) es suficiente para Ley 527, o la SIC exige 10 años (término mercantil) o plazo distinto?** | Ley 527 no fija plazo único; depende de interpretación. 6 m es criterio operativo para reclamaciones art. 8 (15 d + bloqueo), no término probatorio mercantil. | `retention-policy.md §1`, `supabase-migration.sql:408`, `legal/dpa-register.md` | Se mantiene 6 m (defendible para B2C gratuito sin facturación mercantil). |
| J-04 | **¿La anonimización de `profiles` tras 24 m de inactividad (`retention-policy.md §3 P2` — preserva `id` para integridad referencial, borra PII) cumple art. 8/11, o exige borrado total con `ON DELETE CASCADE`?** | La SIC distingue anonimización vs supresión. Preservar `id` puede no ser anonimización suficiente si es re-identificable. | `retention-policy.md §3 P2`, `supabase-migration.sql:19` | Se mantiene P2 como norma; si SIC exige borrado total, se cambia a `DELETE` cascade. |
| J-05 | **¿Se requiere Aviso de Privacidad separado del texto de consentimiento, o el `getConsentText()` + `/privacidad` + `/aviso` ya cumple art. 12?** | Art. 12 exige aviso con Responsable, finalidades, derechos, canal, etc. Hoy está en `/privacidad` y `/aviso` pero no como popup separado en el registro. | `aviso-legal.md`, `politica-privacidad.md`, `AuthForm.tsx` | Se mantiene (el link a `/privacidad` en `getConsentText` es el aviso). |
| J-06 | **¿El canal `invitro.code@gmail.com` (Gmail) es suficiente para art. 14-15, o exige dominio propio con SPF/DKIM/DMARC y bandeja auditada?** | Gmail es funcional pero no corporativo; la SIC no exige dominio propio pero un auditor puede observarlo. | `POLITICA_PRIVACIDAD.md §4`, `aviso-legal.md §6` | Se mantiene Gmail (criterio v1: gratuito, sin dominio propio aún). |

---

## 2. Transferencias y Encargados

| # | Pregunta | Por qué | Afecta | Si no se responde |
|---|---|---|---|---|
| T-01 | **¿Se han aceptado/firmado efectivamente los DPAs de Clerk (`https://clerk.com/legal/dpa`), Supabase (`https://supabase.com/legal/dpa`) y Vercel (`https://vercel.com/legal/dpa`) y se conservan los receipts en `legal/receipts/*.pdf` con `sha256sum`?** | Art. 26 exige contrato con garantías. `legal/dpa-register.md` v1 es plantilla con URLs, no prueba de firma. | `dpa-register.md §3`, `MATRIZ_CUMPLIMIENTO_INTERNACIONAL.md CO-03/EU-04/BR-03` | Estado queda **Parcial** en matriz; riesgo Alto si hay inspección sin DPA. |
| T-02 | **¿Cuál es la región efectiva de Supabase (AWS `us-east-1` vs otra) y de Vercel (región de Functions)?** `supabase-migration.sql` no declara `SUPABASE_REGION`; `vercel.json` no declara `regions`. | Determina país destino exacto para art. 26 y para GDPR art. 44 si entra UE. | `providers-audit.md P-02/P-03`, `FLUJO_DATOS_Y_PROVEEDORES.md §3` | Se declara "EE. UU. (región por defecto)" (criterio v1). |
| T-03 | **¿Se ha evaluado si Vercel Logs (IP/User-Agent) constituyen tratamiento por Encargado que debe declararse en RNBD como base separada o como parte de `profiles`?** | `MATRIZ CO-09` y `data-inventory.md F-09` lo listan como tercer Encargado, pero RNBD checklist `retention-policy.md §2` no lo inscribe como base separada. | `retention-policy.md §2`, `MATRIZ CO-09` | Se informa como Encargado en `privacidad §5` sin base RNBD separada (criterio v1: logs son infra, no base del Responsable). |

---

## 3. Producto y operación

| # | Pregunta | Por qué | Afecta | Si no se responde |
|---|---|---|---|---|
| P-01 | **¿Se confirma que la certificación E2B seguirá siendo simulación sin valor oficial (`certify/route.ts:51` stub) hasta nueva versión de políticas, o hay fecha prevista para activarla?** | Activar `FEATURE_FLAG_CERTIFY=true` sin actualizar `terminos §4` y `ia §1` sería engañoso (Ley 1480). | `POLITICA_GOBERNANZA_IA.md §2`, `terminos §4`, `PLAN_REMEDIACION.md Fase 3` | Se mantiene deshabilitada; cualquier activación obliga a versionar políticas. |
| P-02 | **¿Se confirma que no se incorporará LLM/chatbot/agente en runtime sin re-auditar y versionar `POLITICA_GOBERNANZA_IA.md` y `MATRIZ` (AI Act art. 50, GDPR art. 35 DPIA)?** | Un `import openai` sin gobernanza activa riesgos R-AI-01..04. | `POLITICA_GOBERNANZA_IA.md §2`, `REGISTRO_RIESGOS.md R-AI` | Se mantiene `grep vacío` como invariante CI; un nuevo `import` rompe el gate. |
| P-03 | **¿Se autoriza migrar `avatars` de `getPublicUrl` (público) a `createSignedUrl` (privado) en próximo sprint (`PLAN_REMEDIACION.md Fase 2`)?** | Requiere cambio en Supabase Storage config (bucket privado) y puede afectar URLs existentes. | `REGISTRO_RIESGOS.md R-02`, `PLAN_REMEDIACION.md Fase 2` | Se mantiene público con mitigación `validateAvatar` + `remove(oldPath)` (riesgo medio aceptado temporalmente). |
| P-04 | **¿Se autoriza implementar crons `purge-snapshots` (60 d) y `purge-inactive` (24 m) con el texto de aviso por correo propuesto en `retention-policy.md §3 P2`?** | El aviso por correo requiere texto aprobado ("Tu cuenta será anonimizada en 15 días por inactividad..."). | `retention-policy.md §3`, `REGISTRO_RIESGOS.md R-03` | Se mantiene solo norma documental sin job físico (riesgo medio). |
| P-05 | **¿Se confirma el público +18 y la no directriz a menores (COPPA no aplica)?** `aviso-legal.md §1` y `legal/project-classification.md` lo declaran, pero ¿hay verificación de edad en `AuthForm.tsx`?** | Hoy `AuthForm` no pide fecha de nacimiento; la declaración +18 es normativa pero sin gate técnico. | `aviso-legal.md §1`, `MATRIZ US-03` | Se mantiene declaración normativa; si se exige gate, añadir checkbox "Confirmo que soy mayor de 18 años". |
| P-06 | **¿Se han generado/rotado efectivamente `CLERK_SECRET_KEY`, `CLERK_SIGNING_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET` en Vercel y Supabase, o siguen los valores iniciales?** | `AGENTS.md` no exige rotación, pero `security-audit.md` la recomienda semestral. | `security-audit.md C-01/C-02`, `.env.local.example` | Se documenta recomendación de rotación semestral en `PLAN_REMEDIACION.md Fase 5`. |

---

## 4. Infra y dominios

| # | Pregunta | Por qué | Afecta | Si no se responde |
|---|---|---|---|---|
| I-01 | **¿Hay dominio propio (tel. confirmado 3122555086 — titular con 5 usuarios a 2026-10-16) (ej. `invitrocode.com`) o se opera en `*.vercel.app`?** `NEXT_PUBLIC_APP_URL=http://localhost:3000` en `.env.local.example:11` es placeholder local; no hay `vercel.json` con `domains`. | Determina DNS (P-11) y si hay que declarar dominio en `aviso-legal.md §4` y en RNBD. | `aviso-legal.md §4`, `FLUJO_DATOS_Y_PROVEEDORES.md §3` | Se declara "DNS gestionado implícitamente por Vercel" (criterio v1). |
| I-02 | **¿El plan de Supabase es Free (PITR 7 d) o Pro (PITR 30 d)?** | Determina RPO/RTO para `security-audit.md §Backups` y `retention-policy.md §1`. | `AUDITORIA_TECNICA.md §3`, `retention-policy.md §1` | Se documenta "7 d free / 30 d Pro" (ambos, ver `AUDITORIA_TECNICA.md §3`). |
| I-03 | **¿Se usa `docker-compose.prod.yml` / `monitoring.yml` en producción o solo Vercel?** | Si hay self-host, `CRON_SECRET` y `GF_SECURITY_ADMIN_PASSWORD` deben estar en `.env` del host, no solo en Vercel. | `AUDITORIA_TECNICA.md §3`, `security-audit.md C-02` | Se declara Vercel como deploy primario; Docker es opcional self-host (criterio v1). |

---

## 5. Cómo responder

- Responde cada ID con **"Confirma / No confirma / Confirma con ajuste: ..."** y, si aplica, el texto o valor aprobado.
- Las respuestas se incorporan a la **v2** de los documentos afectados y se versiona `CURRENT_POLICY_VERSION` (`src/domain/consent.ts:21`) si cambia una finalidad, un Encargado o un país.
- Sin respuesta, el criterio **v1** listado en "Si no se responde" queda como norma operativa, pero el riesgo asociado permanece abierto en `REGISTRO_RIESGOS.md`.

---

*Preguntas 2026-10-16-v1 — 16 preguntas en 4 bloques. Sin respuesta, el proyecto opera bajo criterios v1 documentados, con riesgos medios/bajos aceptados temporalmente.*

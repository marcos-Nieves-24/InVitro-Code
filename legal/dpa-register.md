# Registro de DPA y Subencargados — InVitro-Code

> **Advertencia metodológica:** complemento de `legal/providers-audit.md` §3.3 (Fase 6, PROV-02) y de `legal/data-inventory.md` §3. No utiliza plantillas genéricas, no inventa información y no asume DPAs firmados no evidenciados. Cada URL corresponde al dominio oficial verificado a octubre 2026; el contenido de dichas políticas puede cambiar y debe re-verificarse antes de publicar `politica-privacidad.md`. Este registro versiona la aceptación y conserva la prueba (Ley 527 art. 12).

**Fecha de versión:** 2026-10-06-v1
**Responsable declarado:** Persona natural Colombia NIT 700329113-7 — invitro.code@gmail.com — Jurisdicción Colombia (Ley 1581 de 2012, Decreto 1377/Decreto 1074, Ley 527 de 1999)
**Alcance:** Encargados con transferencia internacional art. 26 (Clerk, Supabase, Vercel). Terceros técnicos sin datos personales (jsDelivr, PyPI) no requieren DPA y se documentan solo por transparencia.

---

## 1. Tabla de DPAs versionados

| Proveedor | DPA URL | Versión / Fecha aceptada | Subencargados vigentes (con fecha) | Receipt hash | Estado |
|-----------|---------|---------------------------|-------------------------------------|--------------|--------|
| **Clerk Inc. (EE. UU.)** | https://clerk.com/legal/dpa | 2026-10-06-v1 | https://clerk.com/legal/subprocessors (vigente a 2026-10-06) | pendiente — generar al aceptar | pendiente firma — usar DPA estándar Clerk, conservar PDF/receipt en `legal/receipts/clerk-dpa-2026-10-06-v1.pdf` |
| **Supabase Inc. (AWS EE. UU.)** | https://supabase.com/legal/dpa | 2026-10-06-v1 | https://supabase.com/legal/subprocessors (vigente a 2026-10-06) | pendiente — generar al aceptar | pendiente firma — usar DPA estándar Supabase, conservar PDF/receipt en `legal/receipts/supabase-dpa-2026-10-06-v1.pdf` |
| **Vercel Inc. (EE. UU.)** | https://vercel.com/legal/dpa | 2026-10-06-v1 | https://vercel.com/legal/sub-processors (vigente a 2026-10-06) | pendiente — generar al aceptar | pendiente firma — usar DPA estándar Vercel, conservar PDF/receipt en `legal/receipts/vercel-dpa-2026-10-06-v1.pdf` |

> **Cómo versionar:** cada aceptación genera una nueva fila o actualiza `Versión / Fecha aceptada` (formato `YYYY-MM-DD-vN`) y registra el hash del PDF/receipt. No sobrescribir filas previas sin conservar histórico.

---

## 2. Notas de alcance

- **Vercel Cron es Encargado de purga:** el job `POST /api/cron/purge-pending` (Vercel Cron) actúa como subencargado de infraestructura para la purga automática de `consent_status=pending` a las 24 h. No implica DPA separado; queda cubierto por el DPA de **Vercel Inc.** y debe listarse como Encargado de tránsito/purga en `politica-privacidad.md` § Encargados.
- **jsDelivr (`cdn.jsdelivr.net`) y PyPI (`files.pythonhosted.org` vía Fastly) no requieren DPA:** son terceros técnicos que solo sirven runtime/wheels Pyodide mediante `GET` sin datos personales (`public/pyodide-worker.js:5,30-33,56-82`). No hay encargo de tratamiento (art. 26 no activa), pero se informan por transparencia en `legal/providers-audit.md` P-04/P-05 y en `politica-privacidad.md` como "CDN técnico sin datos personales".
- **URLs oficiales preservadas:** Clerk `https://clerk.com/legal/dpa` y `https://clerk.com/legal/subprocessors`; Supabase `https://supabase.com/legal/dpa` y `https://supabase.com/legal/subprocessors`; Vercel `https://vercel.com/legal/dpa` y `https://vercel.com/legal/sub-processors`. Si alguna migra, actualizar este registro y `legal/providers-audit.md` §1 sin alterar evidencia de código.

---

## 3. Próximos pasos: aceptar DPAs y guardar receipt en `legal/receipts/`

1. Aceptar/firmar cada DPA estándar en su URL oficial (Clerk, Supabase, Vercel) con la cuenta del Responsable.
2. Descargar el PDF o capturar el receipt/confirmación con fecha y versión y guardarlo en `legal/receipts/` con nombre `clerk-dpa-2026-10-06-v1.pdf`, `supabase-dpa-2026-10-06-v1.pdf`, `vercel-dpa-2026-10-06-v1.pdf` (ajustar nombre si el proveedor emite otro formato).
3. Calcular hash (ej. `sha256sum legal/receipts/*.pdf`) y registrarlo en la columna `Receipt hash` de la tabla §1 junto con la fecha de aceptación.
4. Actualizar `legal/providers-audit.md` §3.3 y `politica-privacidad.md` § Encargados con la fecha de vigencia de subencargados y la referencia a este registro.
5. Re-versionar este registro (`2026-10-06-v2`, etc.) ante cualquier cambio de subencargados notificado por el proveedor.

> **Estado actual:** pendiente firma, template listo — no se inventan PDFs inexistentes. Este archivo es la plantilla versionada `2026-10-06-v1`; los receipts se incorporarán al aceptar.

---

*Registro generado como COMP-08 de `odd/tasks/compliance-hibrido-consent-supresion.md` para cerrar brecha PROV-02. Cualquier nuevo Encargado o cambio de subencargados invalida la versión y obliga a re-versionar.*

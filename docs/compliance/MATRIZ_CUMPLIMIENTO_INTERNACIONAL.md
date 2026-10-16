# Matriz de Cumplimiento Internacional — InVitro-Code

> **Versión:** 2026-10-16-v1 · **Fecha:** 2026-10-16 · **Corte normativo:** Octubre 2026
> **Responsable:** Persona natural Colombia · NIT 700329113-7 · Corregimiento Altavista, Medellín · `invitro.code@gmail.com`
> **Actividad:** Plataforma educativa 100 % gratuita, sin pagos, público +18, idioma español, alcance LATAM, hosting Vercel (EE. UU.), IdP Clerk (EE. UU.), DB Supabase/AWS (EE. UU.), runtime Python local (Pyodide, sin IA generativa en prod)
> **Advertencia:** Esta matriz es una **evaluación técnica preliminar, no una opinión jurídica vinculante**. Cada fila requiere validación de abogado competente en la jurisdicción. La vigencia normativa debe re-verificarse en fuentes oficiales antes de publicar políticas.
> **Fuentes oficiales consultadas (oct 2026):** Ley 1581 de 2012 (funcionpublica.gov.co) · Decreto 1377 de 2013 / Decreto 1074 de 2015 Título 3 (s Gestor Normativo) · Ley 527 de 1999 (secretariasenado.gov.co) · GDPR Reglamento (UE) 2016/679 (eur-lex.europa.eu) · AI Act Reglamento (UE) 2024/1689 (eur-lex.europa.eu) · CCPA/CPRA Cal. Civ. Code §1798 (leginfo.legislature.ca.gov) · UK GDPR + Data Protection Act 2018 (legislation.gov.uk) · LGPD Lei 13.709/2018 (planalto.gov.br / anpd.gov.br)

---

## 1. Criterios de aplicabilidad territorial

| Jurisdicción | ¿Aplica? | Criterio | Evidencia / Razonamiento |
|---|---|---|---|
| **Colombia** | **Sí — ancla** | Responsable domiciliado en Colombia (NIT 700329113-7, Altavista Medellín) + Titulares en Colombia/LATAM + tratamiento en territorio y con Encargados en EE. UU. (art. 2 Ley 1581) | `legal/project-classification.md:9` · `aviso-legal.md §1` · `supabase-migration.sql:4-7` |
| **UE/EEE (GDPR + AI Act)** | **Condicional — No por defecto, Sí si hay Titulares en UE** | GDPR art. 3.2: aplica si se ofrecen servicios a interesados en la UE o se monitorea su comportamiento. AI Act art. 2: aplica si el sistema de IA se comercializa o sus salidas se usan en la UE. Hoy **no hay evidencia** de oferta dirigida a UE (idioma `es`, público LATAM, sin `eu`/`en` i18n, sin precios en EUR) — pero **un solo usuario en la UE activa GDPR**. | `src/app/layout.tsx:39` `lang="es"` · `legal/project-classification.md` LATAM · `grep vacío i18n|locale.*eu` en `src/` |
| **EE. UU. (CCPA/CPRA + federal/sectorial)** | **Condicional — Sí si hay residentes de California u otros estados con ley de privacidad** | CCPA §1798.140(c): residente de California + umbrales (100 k consumidores/hogares o 25 M USD revenue o 50 % revenue por venta de datos). InVitro-Code es **gratuito, sin venta de datos, sin revenue por datos** → umbrales no alcanzados hoy. Pero si escala a 100 k usuarios CA, aplica. Otras leyes estatales (Colorado, Connecticut, Virginia, etc.) tienen umbrales similares. | `legal/project-classification.md` gratuito · `grep vacío stripe|checkout|sale.*data` en `src/` |
| **Reino Unido (UK GDPR + DPA 2018)** | **Condicional — igual que UE** | UK GDPR art. 3.2 (equivalente a GDPR). No hay oferta dirigida a UK hoy. | Mismo razonamiento que UE |
| **Brasil (LGPD)** | **Condicional — Sí si hay Titulares en Brasil** | LGPD art. 3: aplica si tratamiento en Brasil, oferta a brasileños o recolección de datos en Brasil. Idioma `es` (no `pt-BR`), sin oferta dirigida, pero **un usuario en Brasil activa LGPD**. | `src/app/layout.tsx:39` `lang="es"` · sin `pt-BR` en `src/` |

**Conclusión:** Solo **Colombia** aplica con certeza. Las demás son **condicionales** y deben monitorearse: si la plataforma adquiere usuarios en UE/UK/Brasil/California, la matriz pasa a "Aplica" y se activan las obligaciones marcadas como "Condicional".

---

## 2. Matriz por jurisdicción

### 2.1 Colombia — Ley 1581 de 2012, Decreto 1377/1074, Ley 527, Ley 1480

| # | Norma y disposición | Ámbito | Obligación concreta | Evidencia en código/docs | Estado | Riesgo | Acción correctiva | Prioridad | Fuente oficial (oct 2026) |
|---|---|---|---|---|---|---|---|---|---|
| CO-01 | Ley 1581 art. 9 — Autorización previa, expresa e informada | Responsable en Colombia | Obtener autorización con información de finalidades, derechos, identificación del Responsable y carácter facultativo de respuestas | `AuthForm.tsx:18` `getConsentText()` con finalidades + Responsable + canal + base + versión; checkbox no pre-marcado `AuthForm.tsx:57`; `domain/consent.ts:21` `CURRENT_POLICY_VERSION` | **Cumple** | Alto si falta | Mantener texto y versionar en cada cambio de finalidad | Alta | `https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=49981` |
| CO-02 | Ley 1581 art. 6 — Datos sensibles (género `x`) | Dato sensible `gender=x` | Autorización explícita reforzada + información de no obligatoriedad | `AuthForm.tsx:57` `acceptGenderX` separado + `domain/consent.ts:15` `GENDER_X` + webhook gate `route.ts:60` `gender===x && !hasGender → 403` | **Cumple** | Alto | Mantener gate; inscribir base separada en RNBD si lo exige SIC | Alta | Gestor Normativo — Ley 1581 |
| CO-03 | Ley 1581 art. 26 — Transferencia internacional a EE. UU. | Transferencia a Encargado en país sin nivel adecuado | Autorización con mención expresa del país + contrato con garantías (DPA) | `AuthForm.tsx:18` "proveedores tecnológicos ubicados en Estados Unidos (Clerk, Supabase y Vercel)" + `domain/consent.ts:11` `TRANSFER_EEUU` obligatorio `completeConsent.ts:17` | **Cumple** (mención) / **Parcial** (DPA) | Alto | Firmar DPAs Clerk/Supabase/Vercel y conservar `legal/receipts/*.pdf` con `sha256sum` (`legal/dpa-register.md §3`) | Alta | Gestor Normativo — Ley 1581 |
| CO-04 | Ley 1581 art. 8 + Decreto 1377 art. 9 — Supresión y revocatoria | Titular art. 8 | Supresión ≤15 d hábiles + revocatoria sin costo + canal informado | `DELETE /api/account` `route.ts:11` cascade 8 tablas + Clerk + `webhooks/clerk/route.ts:105` `user.deleted` + `invitro.code@gmail.com` en `AuthForm.tsx:18` y `privacidad §4` | **Cumple** | Alto | Monitorear cron `purge-pending` 24 h + testar `account DELETE` e2e | Alta | Gestor Normativo |
| CO-05 | Ley 1581 art. 4 lit. g + art. 19 — Seguridad y medidas útiles | Todo tratamiento | Medidas técnicas, humanas y administrativas útiles, apropiadas y demostrables | RLS `auth.jwt()->>sub` `migration.sql:52-460` + `validateAvatar` magic bytes `validateAvatar.ts` + `rate-limit.ts` + `admin.ts:11` guard + TLS Vercel | **Cumple parcialmente** | Medio | Añadir CSP/HSTS en `next.config.ts` + `createSignedUrl` para avatares + documentar backups PITR | Media | Gestor Normativo |
| CO-06 | Ley 527 de 1999 — Mensaje de datos conservable | Evidencia de autorización | Conservar autorización con integridad (hash), fecha, IP/UA, versión | `consent_logs` `migration.sql:408` `policy_version`/`accepted_text_hash`/`purposes[]`/`ip`/`user_agent`/`created_at` + COMMENT Ley 527 `migration.sql:418` | **Cumple** | Alto | Mantener `consent_logs` + 6 m tras supresión + hash SHA-256 `AuthForm.tsx:28` | Alta | `https://www.secretariasenado.gov.co/senado/basedoc/ley_0527_1999.html` |
| CO-07 | Decreto 1074 Título 3 — RNBD | Bases con datos personales | Registrar 7 bases en `https://rnbd.sic.gov.co` con finalidades/Encargados/medidas | `retention-policy.md §2` checklist 7 bases + `data-inventory.md §4` DEFINIDA v1 | **No cumple** (pendiente inscripción) | Medio | Inscribir 7 bases con `retention-policy.md §1` + Encargados P-01..P-03 + DPA | Media | Gestor Normativo — Decreto 1074 |
| CO-08 | Ley 1581 art. 12 + Decreto 1377 — Aviso de privacidad | Información al Titular | Aviso con Responsable, finalidades, derechos, canal, retención, transferencias | `/privacidad` `2026-10-06-v1` + `/aviso` + `/cookies` + `/terminos` publicados `src/app/(legal)/*/page.tsx` | **Cumple** | Medio | Re-verificar vigencia antes de cada deploy; versionar en cada cambio art. 26 | Media | Gestor Normativo |
| CO-09 | Decreto 1377 art. 14-15 — Consultas y reclamos | Ejercicio de derechos | 10 d (consulta) / 15 d (reclamo) + aviso de prórroga | `POLITICA_PRIVACIDAD.md §4` tabla de canales/plazos + `invitro.code@gmail.com` | **Cumple** (documental) | Medio | Implementar SLA interno y log de reclamos | Media | Gestor Normativo |
| CO-10 | Ley 1480 de 2011 — Estatuto del consumidor | Relación de consumo | Información veraz, no engañosa, sobre gratuidad y simulación de certificación | `/terminos §5` "Todo el servicio es gratuito. No vendemos ni suscribimos" + `/ia §1` "Certificación simulación sin valor oficial" | **Cumple** | Bajo | Mantener disclaimer si se activa E2B | Baja | `https://www.secretariasenado.gov.co/senado/basedoc/ley_1480_2011.html` |

### 2.2 Unión Europea / EEE — GDPR (Reglamento (UE) 2016/679) + AI Act (Reglamento (UE) 2024/1689)

| # | Norma | Ámbito (condicional) | Obligación | Evidencia | Estado | Riesgo | Acción | Prioridad | Fuente |
|---|---|---|---|---|---|---|---|---|---|
| EU-01 | GDPR art. 6 — Base jurídica | Si hay interesado en UE | Una de 6 bases (consentimiento, contrato, interés legítimo, etc.) | Hoy no hay interesado UE; si lo hubiera, la autorización art. 9 colombiana **no equivale** a consentimiento GDPR art. 7 (requiere granular + revocable + no condicionado) | **No aplicable hoy** / **No cumple si entra UE** | Alto si entra UE sin base GDPR | Preparar consentimiento GDPR separado (granular por finalidad, sin `nuclear` bundle) | Media | `https://eur-lex.europa.eu/eli/reg/2016/679/oj` |
| EU-02 | GDPR art. 13-14 — Información | Si aplica art. 3.2 | Identidad del Responsable, DPO, finalidades, base, destinatarios, transferencias, derechos, retención, reclamación a AEPD | `/privacidad` ya contiene Responsable/finalidades/derechos/retención/transfer EE. UU. — faltan DPO (no requerido si <250 empleados sin riesgo alto, pero documentar) y mención GDPR explícita | **Parcial** (base lista, falta capa GDPR) | Medio | Añadir anexo GDPR a `privacidad` si se activa UE | Media | EUR-Lex GDPR |
| EU-03 | GDPR art. 17 — Supresión ("derecho al olvido") | Si aplica | Borrado sin dilación indebida (≤1 mes) | `DELETE /api/account` + cascade ya cumple ≤15 d hábiles (más estricto que GDPR) | **Cumple** (si aplica) | Bajo | Mantener | Baja |
| EU-04 | GDPR art. 44-49 — Transferencias a tercer país (EE. UU. sin adecuación) | Si hay transferencia UE→EE. UU. | Garantías adecuadas (SCC, BCR) + información al interesado | DPAs con SCC cubrirían; hoy no hay transferencia UE→EE. UU. porque no hay interesado UE | **No aplicable hoy** | Alto si entra UE | Firmar DPAs con SCC (ya en `dpa-register.md`) | Media |
| EU-05 | GDPR art. 25 — Protección desde el diseño | Si aplica | Minimización, seudonimización, RLS, minimización de `codeSnapshot` | RLS + `capLastPosition 8 KB` + `codeSnapshot` 60 d + `validateAvatar` | **Cumple** | Bajo | Mantener | Baja |
| EU-06 | GDPR art. 35 — DPIA | Si tratamiento de alto riesgo (sensible `gender=x`, evaluación sistemática) | DPIA si riesgo alto | `gender=x` sensible + `progress` sistemático podrían exigir DPIA en UE | **No evaluable hoy** | Medio | Si entra UE, evaluar DPIA para `gender=x` | Media |
| EU-07 | AI Act art. 3.1 / 50 — Sistema de IA + transparencia | Si hay sistema de IA en UE | Si Pyodide fuera IA, sería riesgo limitado (transparencia art. 50) | **Pyodide no es IA** (ver `POLITICA_GOBERNANZA_IA.md §Resumen` — CPython WASM, no LLM) · sin chatbot/LLM en runtime `grep vacío openai` | **No aplicable** (no hay IA generativa en runtime) | Bajo | Si se incorpora LLM, añadir etiquetado art. 50 + registro UE | Baja | `https://eur-lex.europa.eu/eli/reg/2024/1689/oj` |
| EU-08 | AI Act art. 5 — Prácticas prohibidas | Si hay IA | Prohibiciones (biometría, social scoring, etc.) | No hay IA que pueda violar art. 5 | **No aplicable** | — | — | — |

### 2.3 Estados Unidos — CCPA/CPRA (Cal. Civ. Code §1798.100 et seq.) + sectorial

| # | Norma | Ámbito | Obligación | Evidencia | Estado | Riesgo | Acción | Prioridad | Fuente |
|---|---|---|---|---|---|---|---|---|---|
| US-01 | CCPA §1798.100 — Derecho a saber / eliminar / no vender | Residente CA + umbrales (100 k consumidores/hogares o 25 M USD o 50 % revenue por venta) | Informar categorías, no vender sin opt-out, eliminar a solicitud, no discriminar | Gratuito, sin venta de datos, sin revenue por datos → **umbrales no alcanzados hoy** · supresión ya disponible `DELETE /api/account` | **No aplicable hoy** (umbrales no alcanzados) | Medio si escala a 100 k CA | Monitorear conteo de usuarios CA; si cruza umbral, añadir `Do Not Sell` + privacy notice CA | Media | `https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=1798.100.&lawCode=CIV` |
| US-02 | CCPA §1798.135 — Opt-out de venta/compartir | Si vende/comparte datos | Botón "Do Not Sell or Share My Personal Information" | **No vende ni comparte** (`grep vacío sale.*data` en `src/`) · no hay `third-party sale` | **No aplicable hoy** | Bajo | — | LegInfo CA |
| US-03 | COPPA (si menores) | Menores <13 | Consentimiento parental verificable | **Público +18** `aviso-legal.md §1` — no dirigido a niños | **No aplicable** | Bajo | Mantener gate +18 en `AuthForm` | — |
| US-04 | FTC Act §5 — Prácticas engañosas | Toda actividad en EE. UU. | No engañar sobre privacidad, gratuidad, certificación | `/terminos §5` gratuidad + `/ia §1` simulación sin valor oficial | **Cumple** | Bajo | Mantener disclaimers | Baja |

### 2.4 Reino Unido — UK GDPR + Data Protection Act 2018

| # | Norma | Ámbito | Obligación | Evidencia | Estado | Riesgo | Acción | Prioridad | Fuente |
|---|---|---|---|---|---|---|---|---|---|
| UK-01 | UK GDPR art. 6/13/17/44 | Equivalente a GDPR (ver EU-01..EU-05) | Misma que GDPR UE | Mismo análisis que EU — idioma `es`, sin oferta dirigida a UK | **No aplicable hoy** / **Condicional** | Medio si entra UK | Mismo plan que EU | Media | `https://www.legislation.gov.uk/ukpga/2018/12` |
| UK-02 | ICO registration | Responsable en UK o con usuarios UK | Registro en ICO si aplica | No hay establecimiento en UK | **No aplicable hoy** | Bajo | Si entra UK, evaluar registro ICO | Baja |

### 2.5 Brasil — LGPD (Lei 13.709/2018)

| # | Norma | Ámbito | Obligación | Evidencia | Estado | Riesgo | Acción | Prioridad | Fuente |
|---|---|---|---|---|---|---|---|---|---|
| BR-01 | LGPD art. 7 — Base legal | Si hay titular en Brasil | 10 bases (consentimiento, contrato, interés legítimo, etc.) | Hoy sin titular BR; si lo hubiera, autorización art. 9 no equivale a consentimiento LGPD art. 8 (requiere destacado + granular) | **No aplicable hoy** / **No cumple si entra BR** | Alto si entra BR | Preparar consentimiento LGPD separado si hay usuarios BR | Media | `https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm` |
| BR-02 | LGPD art. 18 — Derechos del titular | Si aplica | Confirmación, acceso, corrección, anonimización, eliminación, revocatoria | `DELETE /api/account` + `invitro.code@gmail.com` cubrirían art. 18 | **Cumple (si aplica)** | Bajo | Mantener | Baja |
| BR-03 | LGPD art. 33 — Transferencia internacional | Si hay transferencia BR→EE. UU. | Garantías (SCC, BCR, cláusulas standard ANPD) | DPAs con SCC cubrirían; hoy no hay transferencia BR→EE. UU. | **No aplicable hoy** | Medio | Firmar DPAs | Media |
| BR-04 | LGPD art. 41 — Encarregado (DPO) | Si aplica y tratamiento a gran escala | Designar Encarregado y publicar contacto | Titular es persona natural sin DPO; ANPD exige Encarregado si > umbral | **No evaluable hoy** | Bajo | Si entra BR a escala, designar Encarregado y publicar contacto | Baja | ANPD `https://www.gov.br/anpd/` |

---

## 3. Referencias voluntarias (no obligaciones legales, pero recomendadas)

| Marco | Uso | Estado |
|---|---|---|
| **ISO/IEC 27001** (SGSI) | Controles de seguridad (A.5-A.8) — RLS, `validateAvatar`, `rate-limit`, TLS | Parcial — controles técnicos existentes, sin certificación |
| **ISO/IEC 27701** (Privacidad) | Extensión de 27001 para PIMS — inventario, retención, derechos | Parcial — `data-inventory.md` + `retention-policy.md` alineados |
| **ISO/IEC 42001** (SGAIA) | Gestión de IA — gobernanza, ciclo de vida, riesgos | No aplicable hoy (sin IA generativa en runtime); útil si se incorpora LLM |
| **NIST AI RMF** (Risk Management Framework) | Gobernanza, mapeo, medición, gestión de riesgos de IA | Referencial — `POLITICA_GOBERNANZA_IA.md §8` sigue estructura Govern/Map/Measure/Manage |

---

## 4. Prioridades de cierre

| Prioridad | Acción | Jurisdicción | Esfuerzo |
|---|---|---|---|
| **Alta** | Firmar DPAs Clerk/Supabase/Vercel y conservar receipts (`dpa-register.md §3`) | CO-03, EU-04, BR-03 | 1-2 días |
| **Alta** | Inscribir 7 bases en RNBD (`https://rnbd.sic.gov.co`) | CO-07 | 1 día |
| **Media** | Preparar anexo GDPR/LGPD condicional (consentimiento granular por finalidad, DPO/Encarregado) si se detecta tráfico UE/BR | EU-01, BR-01 | 2-3 días (solo si aplica) |
| **Media** | Monitorear umbrales CCPA (100 k CA) y escalar a privacy notice CA si se cruza | US-01 | Continuo |
| **Baja** | Mantener `grep vacío` de IA generativa y re-auditar AI Act si se incorpora LLM | EU-07 | Trimestral |

---

*Matriz 2026-10-16-v1 — evaluación preliminar, no opinión jurídica. Cada fila requiere validación de abogado en la jurisdicción. Re-verificar vigencia en fuentes oficiales antes de publicar políticas. Un nuevo país destino, nuevo Encargado o nuevo tratamiento obliga a versionar esta matriz.*

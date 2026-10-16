# Política de Uso y Gobernanza de Inteligencia Artificial — InVitro-Code

> **Versión:** 2026-10-16-v1 · **Vigente desde:** 2026-10-06
> **Responsable:** Persona natural Colombia · NIT 700329113-7 · `invitro.code@gmail.com`
> **Alcance:** Esta política refleja la **arquitectura real verificada en el código** (no procesos declarativos no implementados).
> **Fuentes:** `package.json:18-61` · `public/pyodide-worker.js:1-340` · `src/lib/pyodide-worker.ts:1-205` · `src/app/api/certify/route.ts:1-67` · `legal/ai-audit.md` (388 lí) · `legal/ip-audit.md` · `legal/politica-ia.md` v1
> **Método:** Inspección directa. `grep vacío` para afirmar ausencia de LLM/chatbot/agente en runtime.

---

## Resumen — qué es y qué no es IA en InVitro-Code

| Pregunta | Respuesta verificada |
|---|---|
| **¿Hay chatbot, asistente virtual o LLM en producción?** | **No.** `package.json:18-47` sin `openai`/`anthropic`/`cohere`/`langchain`/`@ai-sdk` · `grep -r "openai\|anthropic\|langchain" src/ --include="*.ts" --include="*.tsx"` → vacío fuera de `node_modules` · `src/app/api/**` solo expone `certify` (stub) + progreso + webhooks. |
| **¿Hay agente autónomo con herramientas y memoria?** | **No.** `public/pyodide-worker.js:23` `runQueue` es mutex secuencial, no loop agéntico · `src/lib/pyodide-worker.ts` es singleton con `requestId`, sin planificación. |
| **¿Pyodide es IA?** | **No.** Pyodide 0.25.0 (`public/pyodide-worker.js:4-5`) es **CPython compilado a WebAssembly** + librerías deterministas (`numpy`/`pandas`/`scikit-learn`/`scipy`/`matplotlib`/`seaborn`/`plotly`). No hay pesos de LLM, no hay `transformers`, no hay `generate()`/`chat()`. Ejecuta el código que **vos escribís**, no genera contenido autónomo. No es sistema de IA bajo AI Act art. 3.1. |
| **¿Qué IA sí existe?** | **Solo IA offline de producción de assets** (no runtime): Recraft AI (8 favicons/logos con C2PA `Created by Recraft AI` `public/favicon.svg:1`), Anymotion `mimo-v2.5` (12 animaciones `public/animations/*/project.json:5`), Spritecook/True-pixel (~40 sprites `public/images/spritecook/*`). Son imágenes estáticas generadas en fase de diseño. |
| **¿Qué será E2B?** | Sandbox server-side de ejecución de código para certificación (`src/app/api/certify/route.ts:39-48` TODO `createSandbox()`/`e2b.runCode()`). Hoy **stub MVP inactivo**: `FEATURE_FLAG_CERTIFY=false` (`.env.local.example:18`) → 503 `route.ts:22`. **Tampoco es IA generativa** (ejecución aislada, no LLM). |

---

## 1. Principios

1. **Transparencia:** Informamos qué fue hecho con IA y qué no. El contenido pedagógico (`src/content/modules/**/lesson.md`) es obra humana original, citada con bibliografía académica.
2. **No engaño:** Nunca presentamos un asset generado con IA como obra exclusivamente humana sin declararlo.
3. **Minimización:** No incorporamos IA generativa en runtime mientras no aporte valor pedagógico claro y controles robustos.
4. **Supervisión humana:** Todo contenido pedagógico es curado y revisado por el titular, no generado autónomamente.
5. **Privacidad primero:** Ningún dato personal se envía a un proveedor de IA generativa en runtime (no hay tal proveedor).

## 2. Usos permitidos, restringidos y prohibidos

### 2.1 Permitidos

| Uso | Descripción | Evidencia / Condición |
|---|---|---|
| **Producción offline de assets visuales** | Recraft AI (logos/favicons), Anymotion `mimo-v2.5` (animaciones), Spritecook (sprites) | Solo assets estáticos versionados en `public/` · conservar C2PA donde exista · declarar origen en `/ia` y en esta política |
| **Ejecución local de código Python** | Pyodide Worker con `numpy`/`scikit-learn`/`scipy`/`matplotlib`/`seaborn`/`plotly` | `public/pyodide-worker.js` + `src/lib/pyodide-worker.ts` · 100 % local, sin envío a terceros |
| **Ejecución server-side futura** | E2B sandbox para certificación determinista | Solo cuando `FEATURE_FLAG_CERTIFY=true` · validador determinista, no LLM |

### 2.2 Restringidos (requieren evaluación + autorización del titular)

| Uso | Condición |
|---|---|
| Incorporar LLM/chatbot/agente en runtime | Requiere: evaluación de riesgos (sesgo, alucinación, fuga de datos), DPA con proveedor LLM, actualización de esta política y de `politica-privacidad.md`, y nueva autorización art. 26 si hay transferencia. |
| Usar IA para calificar automáticamente laboratorios | Requiere validación humana del criterio y aviso al estudiante de que la calificación es asistida. Hoy la validación es `String.includes()` local (`PyodideRunner.tsx:153`). |
| Generar contenido pedagógico con IA | Requiere revisión humana completa, citación y etiquetado "generado con asistencia de IA". Hoy `grep -r "Generado por IA" src/content` → vacío. |

### 2.3 Prohibidos

- Usar IA para **tomar decisiones que afecten a personas** (ej. aprobar/reprobar, otorgar certificación oficial, filtrar acceso) sin supervisión humana documentada.
- Enviar **datos personales, prompts del usuario o código con secretos** a un LLM externo sin consentimiento explícito y DPA.
- Atribuir a un modelo la autoría de lecciones (`lesson.md`) sin declaración.
- Usar IA para **perfilado, scoring o inferencia de características sensibles** (género, origen, etc.).

## 3. Transparencia al usuario

| Situación | Qué informamos | Dónde |
|---|---|---|
| Assets visuales generados con IA offline | "Logos, favicons y animaciones generados con Recraft AI, Anymotion (mimo-v2.5) y Spritecook — ver Política de IA para prompts y licencias." | `/ia` + footer + `legal/ip-audit.md` |
| Laboratorios Python | "Tus laboratorios ejecutan Python real en tu navegador (Pyodide). No hay asistente que te califique ni modelo que tome decisiones por vos." | `/ia` §1 + `POLITICA_PRIVACIDAD.md §8` |
| Pyodide no es IA | Declarado explícitamente en `politica-ia.md §1` y aquí §Resumen | `/ia` §2 |
| Certificación | "La función de certificación es hoy una simulación sin valor oficial. Si se activa E2B, lo informaremos." | `/terminos §4` + `/ia §1` |
| Futuro LLM (si se incorpora) | Proveedor, modelo, finalidades, datos que recibe, retención, supervisión humana, limitaciones y canal de reclamo | Nueva versión de esta política + `privacidad` + `aviso` |

**AI Act art. 50 (referencial, no vinculante en Colombia):** Como buena práctica, los assets IA llevan trazabilidad C2PA (`public/favicon.svg:1`) y declaración en política. No se exige etiquetar cada salida de Pyodide porque no es IA.

## 4. Supervisión humana por nivel de riesgo

| Nivel | Ejemplos en InVitro-Code | Supervisión |
|---|---|---|
| **Sin riesgo (hoy — 100 % del runtime)** | Pyodide local, validación `includes()`, contenido humano | Revisión del titular en cada `lesson.md` y `references.bib` |
| **Riesgo limitado** (assets IA offline) | Recraft/Anymotion/Spritecook | Titular revisa y aprueba cada asset antes de publicar; conserva prompts/licencias en `legal/ip-audit.md` |
| **Riesgo medio** (futuro: E2B determinista) | Sandbox de certificación | Validación humana del criterio de certificación + aviso "simulación" |
| **Riesgo alto** (futuro: LLM/agente si se incorpora) | Chatbot, calificación automática, recomendación | **Humano en el loop** obligatorio + evaluación de sesgo + registro de decisiones + mecanismo de apelación + suspensión inmediata si hay daño |

## 5. Protección de datos y confidencialidad en prompts

- **Hoy no hay prompts a LLM en runtime** — no hay envío de datos a proveedor de IA generativa. `grep vacío` en `src/app/api/**` para `openai|anthropic|cohere`.
- **Si se incorpora LLM:** Todo prompt que contenga datos personales (`email`, `gender`, `progress`, `codeSnapshot`) requiere: (i) consentimiento específico con mención del proveedor y país, (ii) DPA firmado, (iii) minimización (no enviar `codeSnapshot` completo si basta un resumen), (iv) no usar datos para entrenamiento sin autorización separada, (v) prohibición de pegar secretos/credenciales en el editor (advertido en `terminos §3`).
- **Pyodide:** El código del usuario nunca sale del dispositivo (`pyodide-worker.ts:176` solo al Worker local). No requiere DPA.
- **Logs:** No loguear prompts completos ni `codeSnapshot` en `console.log` de producción; si se habilita LLM, anonimizar antes de persistir.

## 6. Validación de resultados y tratamiento de errores

| Componente | Validación actual | Tratamiento de error |
|---|---|---|
| **Pyodide** | `PyodideRunner.tsx:153` `lastOutput.includes(tc.expectedOutput)` — comparación determinista de strings | `pyodide-worker.js:284-290` `postMessage({type:"result",output,figures})` o `error`; `PyodideRunner.tsx:162-184` mensaje offline/timeout; `discardWorker()` si el Worker muere |
| **Certify (E2B futuro)** | Stub `certified:true` `route.ts:51-56` tras flag ON; reemplazo futuro `e2b.runCode(code,{seeds})` determinista | `route.ts:22` 503 si flag OFF; `500` catch-all `route.ts:60` |
| **Assets IA** | Revisión visual humana + `assets:check` (`scripts/check-hero-assets.mjs`) para `viewBox` | `public/favicon.svg` C2PA íntegro; derivados optimizados con stripping documentado en `legal/ip-audit.md:118` |

**Principio:** Ningún resultado de IA (si se incorpora) se presenta como verdad sin validación. Se informa la limitación y se ofrece fuente o criterio.

## 7. Responsabilidades

| Rol | Responsabilidad |
|---|---|
| **Titular (Responsable)** | Aprobar esta política y sus versiones; autorizar nuevos usos de IA; firmar DPAs; decidir suspensión de funcionalidad con riesgo grave. |
| **Desarrolladores** | Implementar según esta política; no añadir SDK de IA sin autorización; mantener `grep vacío` verificable; actualizar `POLITICA_GOBERNANZA_IA.md` al añadir IA. |
| **Administradores** | Operar cron/flags (`FEATURE_FLAG_CERTIFY`); no activar `E2B` en prod sin DPA y sin actualizar política. |
| **Usuarios** | No pegar secretos en el editor (`terminos §3`); reportar salidas incorrectas a `invitro.code@gmail.com`. |

## 8. Gestión de sesgos, seguridad y riesgos de IA

| Riesgo | ¿Aplica hoy? | Mitigación |
|---|---|---|
| **Alucinación** | No (no hay LLM) | Si se incorpora LLM: validación humana + citación + disclaimer |
| **Sesgo / discriminación** | No (no hay clasificador del producto; `diagnostic-trainer.tsx:431` es trainer pedagógico local con `seed=42`, no servicio del titular) | Si se incorpora clasificador/recomendador: evaluación de sesgo por grupo, dataset balanceado, auditoría externa |
| **Prompt injection** | No (no hay LLM que inyectar) | Si se incorpora: sanitización de input, system prompt aislado, allowlist de herramientas, rate limiting |
| **Extracción de datos** | No | Si se incorpora: no exponer `system` prompt, limitar `max_tokens`, no devolver `consent_logs` ni PII en respuestas |
| **Abuso de herramientas** | No | Si se incorpora agente: allowlist de herramientas, confirmación humana para acciones destructivas, `auth()` en cada tool |

## 9. Evaluación de proveedores y modelos externos

Antes de contratar un proveedor de IA generativa (ej. OpenAI, Anthropic, Cohere, Vertex AI):

1. Verificar país y subencargados → art. 26.
2. Exigir DPA + SCC y conservar `legal/receipts/*.pdf` con `sha256sum`.
3. Verificar política de **no entrenamiento con datos del cliente** o exigir opt-out.
4. Evaluar límites técnicos (context window, rate limits, disponibilidad, costo E2B).
5. Registrar en `providers-audit.md` y `dpa-register.md` una nueva ficha P-12+ con `Servicio|Finalidad|Datos enviados|País|Art.26|DPA URL`.
6. Actualizar `domain/consent.ts` si requiere nuevo `ConsentPurpose` y versionar `CURRENT_POLICY_VERSION`.

## 10. Registro, monitoreo y gestión de incidentes

| Evento | Registro | Canal |
|---|---|---|
| Nuevo asset IA publicado | `legal/ip-audit.md` + `public/animations/*/project.json` | Commit con `feat(assets):` |
| Activación de flag `FEATURE_FLAG_CERTIFY` | `.env` + `vercel.json` + esta política | PR con revisión del titular |
| Incidente de IA (salida dañina, fuga, sesgo) | `REGISTRO_RIESGOS.md` (nueva fila) + `legal/security-audit.md` | `invitro.code@gmail.com` + `DELETE /api/account` si el usuario lo solicita |
| Decisión de suspender IA | Esta política §12 + `PLAN_REMEDIACION.md` | Titular comunica en `/ia` y por correo si hay suscriptores |

## 11. Revisión periódica

- **Trimestral** si no hay IA en runtime (verificar `grep vacío` y que `FEATURE_FLAG_CERTIFY` siga `false`).
- **Inmediata** al añadir cualquier SDK de IA, nuevo `fetch` a proveedor de IA o activación de `E2B`.
- Cada revisión versiona esta política (`2026-10-06-v2`...), actualiza `legal/ai-audit.md` y `politica-ia.md` (`/ia`).

## 12. Suspensión de funcionalidades de IA con riesgo grave

El titular puede **suspender de inmediato** cualquier funcionalidad de IA (futura) que presente:

- Fuga de datos personales a un LLM sin DPA.
- Generación de contenido discriminatorio, ilegal o dañino de forma sistemática.
- Bypass de `auth()`/RLS vía prompt injection.
- Indisponibilidad que afecte la integridad de `progress`/`lab_progress`.

**Procedimiento:** (1) Desactivar flag o revertir deploy en Vercel; (2) comunicar en `/ia` y a `invitro.code@gmail.com` si hay reporte; (3) registrar en `REGISTRO_RIESGOS.md`; (4) no reactivar sin plan de remediación aprobado.

---

*Política 2026-10-16-v1 — refleja el código real a `7b0cd26`. Un nuevo `import openai`, nuevo `fetch` a `api.anthropic.com` o `FEATURE_FLAG_CERTIFY=true` en producción obliga a versionar esta política y `legal/ai-audit.md`.*

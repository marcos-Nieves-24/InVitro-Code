# Plan de Acción Priorizado — Auditoría InVitro-Code

**Fecha:** 2026-10-11 · **Árbol auditado:** HEAD desacoplado `ff0af93` (= `origin/feat/presentation-reemplazo-directo`)
**Qué es este documento:** plan de remediación construido sobre los hallazgos de las auditorías hermanas. **No corrige código, no toca git, no certifica cumplimiento legal** — las acciones producen evidencia; la calificación jurídica la hace un profesional.
**Contexto git verificado hoy:** la rama local `feat/presentation-reemplazo-directo` avanzó a `cef461a` con **14 commits sin push**. Algunos ítems de este plan ya fueron corregidos allí y se marcan **Corregido-local-sin-push — verificar**: el código auditado no los contiene.

## 1. Resumen ejecutivo — los 5 movimientos de mayor palanca

1. **Cerrar HX-CRON-01 (P0):** `/api/cron/purge-pending` solo acepta `Bearer CRON_SECRET`; se eliminan el bypass por presencia del header `x-vercel-cron` y el bypass sin secreto, y la ruta sale de `publicRoutes`. El commit local `60b7e4c` NO toca este handler, así que el P0 sigue vivo en ambos árboles.
2. **Empujar y mergear los 14 commits locales antes de escribir fixes nuevos:** `60b7e4c` revive `daily-nudge`/`recharge-freezes` (HX-CRON-02 / FN-CRON-01) y `9aecd0c` activa el test `.mjs` (SO-DOC-01). Verificar en logs de Vercel y en `npm run test` post-merge; recién después re-trabajar lo que siga roto.
3. **Paquete cumplimiento persona natural:** SO-PROV-01 (consentimiento de transferencias a EE. UU. + `gender` facultativo) + R-16 (inscripción RNBD) + SO-PROV-02/R-17 (firma de los 3 DPAs). Desbloquea política de privacidad publicada y las purgas TTL de R-15.
4. **Paquete destrucción/datos:** HX-SUP-06 + FN-ACC-01 (cascadas de borrado sin transacción, respuestas 200 engañosas) + HX-DATA-05 (RLS en `modules`). Cierra el riesgo de supresión parcial y de pérdida de trazabilidad del art. 8.
5. **Abrir paneles y fijar presupuesto:** SO-COST-01 (BLOQUEADO), SO-BKP-01 y SO-MOD-01 habilitan el resto; sin acceso a paneles hay 3 P1 que no se pueden cerrar con evidencia.

## 2. Tabla maestra priorizada

| Orden | ID (doc origen) | Prioridad | Acción concreta | Esfuerzo | Tipo | Dependencias | Criterio de aceptación medible | Estado |
|---|---|---|---|---|---|---|---|---|
| **Fase 0 — Detener la hemorragia** ||||||||
| 1 | HX-CRON-01 (`AUDITORIA_SEGURIDAD`) | P0 | `isAuthorized()` solo acepta `Bearer CRON_SECRET` por comparación exacta; eliminar `if (vercelCronHeader !== null)` y el bypass `!cronSecret` fuera de prod; quitar `/api/cron/purge-pending` de `publicRoutes`; unificar los 3 handlers en `src/lib/cron/auth.ts` | M | Técnico | CRON_SECRET seteado en Vercel | `curl` sin header → **401 con cuerpo del handler** (no `{"error":"Authentication required"}` del middleware); `curl -H "x-vercel-cron: 1"` sin secreto → **401**; con Bearer válido → 200; `grep -rn "x-vercel-cron" src/ \| wc -l` → **0**; `type-check` + `build` verdes | Pendiente |
| 2 | SO-PROV-01 (`AUDITORIA_SOSTENIBILIDAD`), R-16 (`MATRIZ`) | P0 | Consentimiento informado de transferencias a EE. UU. (Clerk/Supabase/Vercel) con checkbox no pre-marcado + `consent_logs` conservable (Ley 527); `gender=x` marcado facultativo; decidir e inscribir las 7 bases en el RNBD | L | Decisión de negocio + Validación profesional (jurídica) | — | Existe prueba conservable de autorización que mencione EE. UU. y el carácter facultativo de `gender`; decisión RNBD firmada por profesional y fecha de radicación o de "no aplica" argumentada | Pendiente |
| 3 | HX-SEC-10 (`AUDITORIA_SEGURIDAD`) | P2 (ascendida a Fase 0 por solicitud humana) | Añadir headers de seguridad (CSP compatible con Clerk/KaTeX/Pyodide, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `frame-ancestors`) en `next.config.ts`/middleware; CSP primero en `Content-Security-Policy-Report-Only` | M | Técnico | Lab y login deben seguir funcionando con CSP | `curl -I` sobre `/` y `/sign-in` muestra los 5 headers; sin violación CSP en consola tras usar un lab con Pyodide y render de matemáticas | Pendiente |
| **Fase 1 — P1 seguridad y supresión** ||||||||
| 4 | HX-CRON-02 (`AUDITORIA_SEGURIDAD`), FN-CRON-01 (`AUDITORIA_FUNCIONAL`) | P1 | Añadir `/api/cron/daily-nudge` y `/api/cron/recharge-freezes` a `publicRoutes`; handlers sigue exigiendo `Bearer CRON_SECRET` | S | Técnico | — | Los 3 crons: con Bearer → **200**; sin header → **401 del handler**; logs de Vercel muestran ejecución real de los 3 | **Corregido-local-sin-push** (`60b7e4c`) — verificar tras push en logs de Vercel |
| 5 | HX-AUTH-07 (`AUDITORIA_SEGURIDAD`) | P1 | `consent` jamás deriva identidad del body; fuente única `auth()` | S | Técnico | — | Test unitario: POST a `consent` con `user_id` ajeno en el body no crea/lee fila ajena; respuesta 200 solo con identidad de sesión | Pendiente |
| 6 | HX-SUP-06 (`AUDITORIA_SEGURIDAD`), FN-ACC-01 (`AUDITORIA_FUNCIONAL`) | P1 | Cascada de borrado en transacción (RPC/`pg`) o verificación paso a paso con compensación; NO devolver `200 {deleted:true}` si algo falla; conservar tombstone mínimo en `consent_logs` que acredite la supresión | M | Técnico | — | Test que inyecta fallo en un delete → respuesta NO-200 y registro del fallo; tras borrado exitoso quedan **0 filas** del usuario en las 7 tablas | Pendiente |
| 7 | HX-DATA-05 (`AUDITORIA_SEGURIDAD`) | P1 | Habilitar RLS + policies en `modules` equivalentes a las otras 9 tablas (comparar contra `auth.jwt() ->> 'sub'`) | S | Técnico | — | Migración aplicada en Supabase; SELECT anónimo sin filas y SELECT autenticado funciona; 10/10 tablas protegidas | Pendiente |
| 8 | HX-RATE-03 (`AUDITORIA_SEGURIDAD`) | P1 | Rate limit compartido entre instancias (Redis/Upstash) y extender cobertura a más rutas de escritura | M | Técnico + Decisión (costo del servicio) | Presupuesto (SO-MOD-01) | Dos requests desde distintas instancias superan el umbral → **429 con `Retry-After`** en ambos; umbral por ruta documentado | Pendiente |
| 9 | HX-DIAG-08 (`AUDITORIA_SEGURIDAD`) | P1 | Sacar `/api/diagnose` de `publicRoutes` (o ponerlo tras sesión admin) y reducir metadatos expuestos | S | Técnico + Decisión (¿para qué existe la ruta?) | — | Request anónimo → **401/redirect**; respuesta autorizada sin metadatos de infraestructura | Pendiente |
| **Fase 1 — P1 sostenibilidad y legal** ||||||||
| 10 | SO-PROV-02 (`AUDITORIA_SOSTENIBILIDAD`), R-17 (`MATRIZ`) | P1 | Firmar/aceptar los 3 DPAs (Clerk, Supabase, Vercel) y guardar PDF/receipt versionado | M | Decisión de negocio + Validación profesional (jurídica) | — | `legal/receipts/` con un archivo por Encargado; hash cotejado contra `legal/dpa-register.md` | Pendiente |
| 11 | SO-BKP-01 (`AUDITORIA_SOSTENIBILIDAD`), R-14/R-18 (`MATRIZ`) | P1 | Crear `legal/backups.md` con RPO/RTO declarados, captura del panel Supabase, `pg_dump` cifrado y restore drill trimestral | M | Técnico | Acceso a panel Supabase | Drill ejecutado y fechado: restauración de un dump en entorno de prueba documentada | Pendiente (BLOQUEADO por acceso) |
| 12 | R-15 (`MATRIZ`) | P1 | Implementar purgas TTL ejecutables: 60 días (`codeSnapshot`) y 24 meses (inactividad), vía `pg_cron` o cron de Vercel | M | Técnico | Órden 6 (transacción) y orden 2 (push) | Verificación con fila sembrada de edad > TTL → eliminada; fila fresca → intacta; ejecución visible en logs | Pendiente |
| 13 | SO-COST-01 + SO-MOD-01 (`AUDITORIA_SOSTENIBILIDAD`) | P1 | Ejecutar metodología §5 con acceso a paneles: plan efectivo, límites de free tier y uso real; fijar techo de gasto mensual y alertas de billing | S | Decisión de negocio (autorizar acceso + presupuesto) | — | Tabla de costo por usuario con plan, límites y uso citados; alertas de uso activas (captura) | Pendiente (BLOQUEADO) |
| 14 | SO-PROV-03, SO-PROV-04, SO-PROV-05 (`AUDITORIA_SOSTENIBILIDAD`) | P1 | Runbooks de continuidad (Clerk caído, Supabase, self-host de emergencia); cachear rol admin en `public_metadata` de Clerk; evaluar proveedor secundario | M | Técnico + Decisión (¿segundo IdP?) | SO-COST-01 para costear | Runbook publicado + simulación de mesa documentada ("Clerk caído" → aviso); request admin sin roundtrip a Supabase | Pendiente |
| 15 | SO-RED-01 (`AUDITORIA_SOSTENIBILIDAD`) | P1 | Aviso visible "los labs requieren conexión" en la UI de labs; evaluar cache persistente del runtime Pyodide | S | Técnico + Decisión (self-host del runtime) | Orden 24 | Abrir un lab sin red → mensaje controlado (no pantalla rota); decisión de cache documentada | Pendiente |
| **Fase 1 — P1 funcional y UX (bloquean tareas esenciales)** ||||||||
| 16 | UX-A11Y-01 (`AUDITORIA_UX_UI`) | P0/P1 (origen) | Contraste de enlaces de consentimiento y «Reenviar código» (hoy 2.62:1) hasta ≥ 4.5:1 usando tokens | S | Técnico | — | Contraste medido con herramienta sobre el color final ≥ 4.5:1 en ambos componentes; `type-check` verde | Pendiente |
| 17 | UX-ROUTE-03, UX-ROUTE-01 (`AUDITORIA_UX_UI`), SO-DOC-03 (`AUDITORIA_SOSTENIBILIDAD`) | P1 | Decisión de producto única: ¿qué es público? Alinear `publicRoutes`, DESIGN.md y el progreso mock expuesto | M | Decisión de negocio + Técnico | — | Comportamiento anónimo coherente con la decisión escrita; middleware y documento coinciden (verificable por request anónimo) | Pendiente |
| 18 | UX-CONT-01, UX-CONT-02 (`AUDITORIA_UX_UI`) | P1 | Reparar interactivos rotos en las 2 lecciones de IA y añadir fallback visible con acción de reintento | M | Técnico | — | Los 2 interactivos renderizan en la lección; si el componente falla se muestra mensaje visible + botón de reintento (no espacio en blanco) | Pendiente |
| **Fase 2 — P2** ||||||||
| 19 | HX-PRIV-09 (`AUDITORIA_SEGURIDAD`) | P2 | Leaderboard sin `user_id` enumerable: alias opaco o supresión del campo en la respuesta | S | Técnico | — | Respuesta de leaderboard sin `user_id` en claro; enumerar respuestas consecutivas no expone perfiles | Pendiente |
| 20 | HX-ARCH-11 (`AUDITORIA_SEGURIDAD`), SO-NPM-03 (`AUDITORIA_SOSTENIBILIDAD`) | P2 | Endurecer service-role: regla `no-restricted-imports` para `createAdminClient` en `"use client"` + umbral de coverage > 0 en CI | M | Técnico | — | CI rojo al importar admin client desde cliente o al bajar la coverage del umbral acordado | Pendiente |
| 21 | HX-DOC-15, FN-GOV-01, FN-GOV-02, SO-DOC-01/03/04, UX-DRIFT-01/04 (`varios docs`) | P2/P3 | Barrido de doc-drift: conteos reales de tests en 4 lugares, `legal/security-audit.md` vs código, DESIGN.md `/learn` y §2.2, AGENTS.md sobre `/api/certify` | M | Técnico (documentación) | Órdenes 2 y 17 | `npm run test` → **20 archivos / 188+ tests** y los 4 sitios citan esa cifra; estado de coverage consistente en 3 archivos; cada path de DESIGN.md §2.2 existe; AGENTS.md describe el 503 por defecto de certify | Parcial: **Corregido-local-sin-push** (`9aecd0c` activó el glob `.mjs`) — conteos Pendiente |
| 22 | FN-E2E-01, FN-AUTH-03, FN-PROG-02 (`AUDITORIA_FUNCIONAL`) | P2 | Playwright con 3 flujos: OAuth real en staging, aislamiento A/B, persistencia tras recarga; tests de integración de `api/progress`, `api/bookmarks`, `lab-progress` | L | Técnico (validación con entorno real) | Staging con credenciales OAuth | Suite corre en CI; los 3 flujos en verde en staging | Pendiente — cierra además UX-VIS-01/03 |
| 23 | FN-LAB-02, FN-BK-02, FN-UI-01, FN-CER-01 (`AUDITORIA_FUNCIONAL`) | P2 | Dual-write de labs con reconciliación o fallo visible; `checkRateLimit` en DELETE de bookmarks; `loading.tsx` (skeleton) + `error.tsx` (con reintento) en rutas clave; doc de certify alineada al 503 | M | Técnico | — | Upsert secundario fallido → NO success opaco; DELETE sobre umbral → 429; rutas con fetch muestran skeleton/error con reintento | Pendiente |
| 24 | SO-PROV-06, SO-RED-02, SO-NPM-01, SO-CONT-01 (`AUDITORIA_SOSTENIBILIDAD`) | P2 | Auto-alojar Pyodide o cachear en service worker; pin `seaborn==x.y.z`/`plotly==x.y.z`; una sola variante Plotly; plan mínimo de bus-factor (runbook, recovery de secretos, segundo acceso) | L | Técnico + Decisión (ancho de banda/ costo) | SO-COST-01 | Lab funcional con `cdn.jsdelivr.net` bloqueado; pins en el worker; `package.json` con una variante Plotly | Pendiente |
| 25 | UX-A11Y-02/04/05/06/07/08, UX-TOK-01/02/04, UX-DRIFT-02/03, UX-ROUTE-02, UX-CONT-03/04 (`AUDITORIA_UX_UI`) | P2 | Foco visible (combobox, sliders, header/footer), ARIA en menús, uso del color, jerarquía de headings; deriva de tokens y eliminación de dead code en el mismo cambio que actualiza DESIGN.md | M | Técnico | Órden 17 (decisión de rutas) | Cada hallazgo con verificación puntual (tabla/axe/foco con Tab); tokens sin hex hardcodeados; código muerto borrado | Pendiente |
| **Fase 3 — P3** ||||||||
| 26 | HX-AUTH-16, HX-SEC-17, HX-SEC-18, HX-DATA-19 (`AUDITORIA_SEGURIDAD`) | P3 | Documentar como verificados-OK en `legal/security-audit.md`; cerrar la observación del 9/10 de HX-DATA-19 cuando se aplique la orden 7 | S | Técnico (documentación) | Orden 7 | Cada control aparece con evidencia en el doc; 10/10 tablas con RLS | Pendiente |
| 27 | FN-AUTH-01, FN-AUTH-02, FN-PROG-01, FN-LAB-01, FN-BK-01, FN-BK-03, FN-NAV-01, FN-PRE-01, FN-CONT-01, FN-CONT-02, FN-GOV-02 (`AUDITORIA_FUNCIONAL`) | P3 | Recordatorios de email, mejoras de navegación/preview y controles correctos: cada uno con su fix acotado; GOV-02 con cifra de rutas etiquetada como histórica o actualizada | M | Técnico | — | Cada ítem con verificación propia (request/observación); sin ítem "documentado como futuro" sin fecha | Pendiente |
| 28 | SO-NPM-02, SO-DOC-02 (`AUDITORIA_SOSTENIBILIDAD`) | P3 | Fijar pin exacto de `lucide-react` (o documentar la excepción de major 1.x); borrar o crear las filas fantasma de DESIGN.md §2.2 | S | Técnico | — | `npm ls lucide-react` con pin exacto o excepción en `openspec/`; las filas de §2.2 apuntan a archivos existentes | Pendiente |
| 29 | UX-TOK-03, UX-DRIFT-04, UX-A11Y-03, salvedad de UX-PED-03 (`AUDITORIA_UX_UI`) | P3 | Eliminar la violación de tokens ya admitida en DESIGN.md, borrar componente muerto, corregir imprecisión científica menor con revisión del contenido | S | Técnico + Validación de contenido | — | Token sustituido; componente borrado; salvedad de UX-PED-03 resuelta o aceptada por escrito | Pendiente |

## 3. Fases y dependencias

**Fase 0 — Detener la hemorragia (órdenes 1-3).** Sin dependencias de código entre sí; sí una precondición de entorno: `CRON_SECRET` debe existir en Vercel antes de endurecer HX-CRON-01 (si no, el purge legítimo muere). SO-PROV-01 no bloquea a las demás pero bloquea publicación de política y las purgas de la orden 12.

**Fase 1 — P1 (órdenes 4-18).** Dependencias reales: 6 (transacción) debe preceder a 12 (purgas TTL) y reforzar 4; 13 (paneles/presupuesto) alimenta 8, 11, 14 y 24; 17 (decisión de rutas públicas) condiciona 25. El grupo UX 16-18 es independiente y conviene sacarlo en paralelo.

**Fase 2 — P2 (órdenes 19-25).** 21 (doc-drift) depende de 2 y 17; 22 (Playwright) es la base para cerrar varios NO_AUDITADO de la sección 6; 24 consume la decisión de presupuesto de Fase 1.

**Fase 3 — P3 (órdenes 26-29).** 26 espera la orden 7; el resto es independiente. Orden recomendado de ejecución por valor: 0 → (16-18 en paralelo) → 5-9 → 10-12 → 13-15 → resto.

## 4. Decisiones que requieren el humano

| Decisión | Hallazgos | Por qué no la puede tomar el ejecutor |
|---|---|---|
| Inscripción (o no) de las 7 bases de datos en el RNBD y redacción del consentimiento de transferencias | SO-PROV-01, R-16 | Interpretación jurídica sobre persona natural gratuita; implica radicación ante la SIC |
| Firma/aceptación de los 3 DPAs con receipt conservable | SO-PROV-02, R-17 | Acto contractual de la persona natural NIT 700329113-7 |
| Autorizar acceso a paneles de Vercel/Clerk/Supabase y fijar techo de gasto mensual | SO-COST-01, SO-MOD-01 | Credenciales y decisión de dinero; hoy BLOQUEADO |
| Push y merge de los 14 commits locales (PR #70 abierto; también #69 y #68 sin revisión) | HX-CRON-02, FN-CRON-01, SO-DOC-01 | Política de entrega del repo; el árbol auditado no los contiene |
| Definir qué rutas son públicas (`/learn`, `/api/diagnose`) y si el progreso mock sigue visible | UX-ROUTE-01/03, HX-DIAG-08, SO-DOC-03 | Decisión de producto y de conversión |
| Contratar plan Pro o servicio de rate limit externo; segundo IdP o failover documentado | HX-RATE-03, SO-PROV-03, SO-MOD-01 | Costo y estrategia de proveedores |
| Asumir (o no) el riesgo de self-host del runtime Pyodide vs. dependencia de CDN gratuitos sin SLA | SO-PROV-06, SO-RED-01/02 | Tradeoff ancho de banda/costo vs. disponibilidad de los labs |

## 5. Riesgos de la ejecución (por fase)

| Fase | Riesgo | Mitigación / rollback |
|---|---|---|
| 0 | Endurecer HX-CRON-01 con `CRON_SECRET` ausente en producción apaga el purge legítimo; una CSP mal calibrada rompe Clerk, KaTeX o Pyodide | Verificar la variable en Vercel antes del deploy; CSP en `Report-Only` primero y promover tras una jornada sin violaciones. Rollback: revertir 1 commit (son cambios chicos y aislados) |
| 1 | Política RLS restrictiva de más en `modules` deja el catálogo vacío; transacción mal envuelta deja el borrado a medias; el rate limit externo añade dependencia (¿fail-open o fail-closed?) y costo | Probar policies con SELECT anónimo y autenticado antes de aplicar; test de inyección de fallo antes de mergear; definir fail-open documentado. Rollback: migración revertible y feature flag para el limitador |
| 1 | Doc-drift "corregido" sobre cifras que vuelven a cambiar (tests crecen cada semana) | Citar la cifra con la fecha del `npm run test` que la respalda, no un número pelado |
| 2 | Purgas TTL automáticas borran datos reales por un TTL mal puesto; Playwright con OAuth real resulta frágil y contamina el CI; self-host de Pyodide sube consumo de ancho de banda | Sembrar filas de prueba y dry-run antes de activar; etiquetar la suite e2e como job separado y nocturno; medir consumo antes y después. Rollback: desactivar el cron y el job de CI sin tocar código de producto |
| 3 | Falso verde: cambios de contraste/tokens que lucen bien pero no se miden | Cada ítem P3 con verificación puntual (herramienta de contraste, axe, foco por teclado), no por inspección visual |

## 6. Cierre — lo que queda NO_AUDITADO y con qué método se cerraría

| Pendiente | Método de cierre | Hallazgo que lo origina |
|---|---|---|
| Render real, contraste instrumental, teclado/lector de pantalla, modo oscuro | Playwright + axe/lector reales sobre las rutas públicas y de aprendizaje, ejecutados en staging | UX-VIS-01, UX-VIS-02, UX-VIS-03, UX-VIS-04 |
| Registro/sign-in OAuth completo y aislamiento entre usuarios | Playwright con los 3 flujos sobre staging con credenciales reales | FN-E2E-01, FN-AUTH-03, FN-PROG-02 |
| Flujo real de sign-in/sign-up y `sso-callback` | Recorrido manual + capturas del proveedor OAuth | FN-AUTH-03 |
| Costo por usuario, plan efectivo, límites de free tier | Capturas de paneles Vercel/Clerk/Supabase + export de métricas con autorización | SO-COST-01 |
| Backups reales y recuperación probada | `legal/backups.md` + restore drill fechado en entorno de prueba | SO-BKP-01 |
| Leyes de países LATAM destino de usuarios | Validación profesional jurídica por país (LGPD/LFPDPPP como referencia) | R-37 |
| Ejecución real de los 3 crons tras el merge | Logs de Vercel mostrando 200 con Bearer y 401 del handler sin secreto | HX-CRON-02, FN-CRON-01, HX-CRON-01 |
| Accesibilidad de panels/terceros (fuera del repo) | Revisión de los paneles de proveedor con lector de pantalla | UX-VIS-03 (extensión) |

> **Nota de cierre:** este plan ordena trabajo y fija criterios medibles; **no declara cumplimiento legal de nada**. Cada fila de la matriz solo cambia de estado cuando la evidencia (código, captura, receipt o acta de profesional) existe y alguien la verifica.

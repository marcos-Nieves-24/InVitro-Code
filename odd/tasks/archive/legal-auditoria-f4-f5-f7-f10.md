# Legal Auditoría F4 + F5 + F7-F10 — InVitro-Code (Colombia / LATAM)

## Objetivo
Completar auditorías F4 (Cookies), F5 (Analytics), F7 (Accesibilidad), F8 (IP), F9 (IA), F10 (Seguridad) de `legal/legal_requirement.md` con evidencia `archivo:línea`, sin plantillas, sobre base Colombia NIT 700329113-7 (persona natural, Corregimiento Altavista Medellín).

> Heurística ~400 líneas/tarea. Branch actual `feat/legal-f1-f3-f6` (commit 47c6ab2). Este slice sigue en misma rama o nueva `feat/legal-f4-f10` — merge work-unit por entregable.

## Contexto autorizado
- Jurisdicción: Ley 1581/Dec 1377/Dec 1074 + Ley 1266 + Ley 527 + Ley 1480.
- Fase 1-3+6 ya entregadas: `legal/project-classification.md`, `technical-audit.md`, `data-inventory.md`, `providers-audit.md` (ver `feat/legal-f1-f3-f6`).
- Stack: Next 16 `Clerk` + `Supabase` (RLS `auth.jwt()->>sub`) + `Vercel` + `jsDelivr Pyodide 0.25.0` (`public/pyodide-worker.js:5`). Sin analytics/pixels verificado (F1/F2 grep vacío).
- Hallazgos previos bloqueantes: sin `consent_logs`, sin `user.deleted`, DPAs sin firmar, retención indefinida.

## Tareas

- [ ] **T5 — F4 cookies-audit** — Detectar cookies técnicas/funcionales/analíticas/publicitarias, tracking (GA4/GTM/Meta/TikTok/Clarity/Hotjar/replay/fingerprint/server-side), storage (cookies/localStorage/sessionStorage), verificar consent previo/rechazo/granular/revocación/bloqueo. Output `legal/cookies-audit.md`.
  - Fuentes: `src/app/layout.tsx`, `src/middleware.ts`, `src/lib/pyodide-worker.ts`, `public/pyodide-worker.js`, `src/components/labs/**`, `src/components/onboarding/**`, `src/components/editor/**`, `next.config.ts`, `package.json`, `supabase-migration.sql` (`theme`/`notification_prefs`).
  - Criterio: solo cookies detectadas, sin inventar. Debe listar `__clerk_*`, `__session`, `sb-*` si existe, `localStorage` keys, y declarar analíticas/publicitarias como NO con grep vacío.

- [ ] **T6 — F5 analytics-audit** — Inventariar eventos/conversiones/scripts/etiquetas/parámetros, verificar no envío de emails/datos sensibles/IDs personales/URLs con datos, control por consent. Output `legal/analytics-audit.md`.
  - Fuentes: `src/app/layout.tsx`, `next.config.ts`, `src/app/api/**`, `package.json` (recharts, motion, etc.), `public/**`.
  - Criterio: si no hay analytics, documentar `Sin medición` con evidencia negativa + beneficio privacidad y GAP si se activara futuro.

- [ ] **T7 — F7 accessibility-audit** — Verificar teclado, focus visible, contraste, forms accesibles, alt text, HTML semántico, headings, responsive, zoom 200%, idioma declarado. Output `legal/accessibility-audit.md`.
  - Fuentes: `src/app/layout.tsx:39 lang="es"`, `src/app/layout.tsx:44 skip-link`, `src/app/page.tsx` (landing), `src/components/**`, `src/app/(dashboard)/**`, `src/app/learn/**`, `globals.css`.
  - Criterio: auditoría manual estática + checklist WCAG 2.1 AA / NTC 5854, con hallazgos `archivo:línea` y severidad. No ejecutar axe automatizado si no hay tooling, pero sí inspeccionar semántica.

- [ ] **T8 — F8 ip-audit** — Inventariar imágenes/iconos/tipografías/vídeos/música/logos/dependencias/librerías/templates/recursos IA, documentar origen/licencia/uso comercial/atribución/evidencia. Output `legal/ip-audit.md`.
  - Fuentes: `package.json:18-60` (26 prod deps), `src/app/layout.tsx:6` fonts, `public/**`, `src/content/modules/**` (`lesson.md`, `references.bib`), `assets/**`, `LICENSE`.
  - Criterio: tabla por activo con licencia verificada (OFL/MIT/ISC/Apache), sin asumir. Marcar GAP si falta atribución.

- [ ] **T9 — F9 ai-audit** — Auditar chatbots/agentes/LLMs/generación/clasificación/recomendación; verificar transparencia, identificación IA, proveedor, retención, escalado humano, logging, fallback, limitaciones. Output `legal/ai-audit.md`.
  - Fuentes: `public/pyodide-worker.js`, `src/lib/pyodide-worker.ts`, `src/app/api/certify/route.ts` (stub E2B), `package.json` (sin openai/anthropic).
  - Criterio: confirmar `No IA generativa en prod` (Pyodide es ejecución local), documentar `E2B` como stub inactivo y requisitos si se activa. Sin inventar.

- [ ] **T10 — F10 security-audit** — Auditar variables sensibles, gestión secretos, auth, autorización, rutas protegidas, uploads, rate limiting, backups, exposición datos. Output `legal/security-audit.md`.
  - Fuentes: `src/middleware.ts`, `src/lib/supabase/admin.ts`, `src/lib/env.ts`, `.env.local.example`, `supabase-migration.sql` (RLS), `src/app/api/**` (avatar, lab-progress, etc.), `next.config.ts`, `Dockerfile*`, `docker-compose*`.
  - Criterio: matriz amenazas con severidad + evidencia + mitigación. Debe reflejar service-role, RLS, RBAC admin, avatar validation, path traversal guards, rate limiting ausente, backups Vercel/Supabase.

## Entregables (F4+F5+F7-F10)
- `legal/cookies-audit.md`
- `legal/analytics-audit.md`
- `legal/accessibility-audit.md`
- `legal/ip-audit.md`
- `legal/ai-audit.md`
- `legal/security-audit.md`

F11 (generación docs legales + final report) queda para siguiente slice, solo post F4-F10.

## Riesgos iniciales este slice
- Sin CMP pero solo cookies técnicas → debe quedar claro en F4 que no requiere consent previo pero sí información.
- Accesibilidad con skip-link ok pero contraste/forms a auditar → posible GAP medio.
- Security con service-role + sin rate limiting → GAP alto.

## Progreso
- 2026-10-06 — Feature creado, pendiente T5-T10.
- 2026-10-06 — T5 F4 completado: `legal/cookies-audit.md` (222 líneas, C-01/02 técnicas Clerk + 3 storages funcionales, T-01..12 tracking NO, V-01..05, 8 gaps CK-01..08).
- 2026-10-06 — T6 F5 completado: `legal/analytics-audit.md` (268 líneas, sin medición verificado, 5 checks Sí, 8 gaps AN-01..08).
- 2026-10-06 — T7 F7 completado: `legal/accessibility-audit.md` (388 líneas, WCAG 2.1 A Conforme / AA Parcial, 6/10 conformes, 3 altas 3 medias).
- 2026-10-06 — T8 F8 completado: `legal/ip-audit.md` (417 líneas, 28 deps 25 MIT/ISC + gsap Standard + typed.js GPL-3.0 conflicto MIT, 80 imágenes, 11 MP4, Rive placeholder, 8 Recraft AI + 12 Anymotion).
- 2026-10-06 — T9 F9 completado: `legal/ai-audit.md` (362 líneas, 0 LLM runtime — Pyodide determinista local, IA offline assets Recraft/Spritecook/Anymotion, 2 altos 3 medios 3 bajos).
- 2026-10-06 — T10 F10 completado: `legal/security-audit.md` (284 líneas, 9 controles, H-01..14 + R-01..14, 1 crítica docker-compose.monitoring.yml:75, 4 altas).
- Verificación: `wc -l legal/*.md` → 3511 líneas (10 auditorías + requirement), todos legibles UTF-8. Branch `feat/legal-f1-f3-f6`.
- Fases F1-F10 completadas. Falta **F11 generación** (aviso-legal, politica-privacidad, politica-cookies, terminos-condiciones, politica-ia + legal-final-report) — bloqueada hasta mitigar GAPs críticos.

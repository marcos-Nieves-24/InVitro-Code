# Legal IP D — typed.js GPL + gsap Standard + AI disclosure

## Objetivo
Cerrar críticos F8 de `legal/ip-audit.md`: `typed.js@3.0.0` GPL-3.0 vs `LICENSE` MIT y `gsap@3.15.0` Standard declarado falsamente MIT, más disclosure IA assets offline (Recraft/Anymotion/Spritecook).

## Alcance autorizado
- Rama base: `feat/legal-seguridad-c-clean` @a2b0fb8 (ya con C-C5/G02/G04/Rate). Continuar en misma rama `feat/legal-seguridad-c-clean` para D (no ramificar).
- No tocar consent (otra sesión).
- Verificación: `npm run type-check`, `npm run build` opcional, `grep -r typed` vacío excepto types, `package.json` sin typed.js.

## Tareas

- [ ] **D-typed.js — Reemplazo GPL** — `src/components/labs/LabHero/LabHeroCopy.tsx:4` usa `import Typed from "typed.js"` con `PHRASES` 7 frases, `typeSpeed 38/backSpeed 22/loop`. Reemplazar por componente propio `TypingText` (ya existe `src/components/ui/TypingText.tsx` MIT propio) o `motion`-based loop. Eliminar `typed.js` de `package.json:44` y `package-lock.json` (`npm uninstall typed.js`). Mantener UX idéntica: rotación de frases con cursor `|`, loop.
  - Criterio: `grep -R "typed.js|from \"typed"` src → vacío, `grep typed.js package.json` vacío, `type-check` ok, visual parity.

- [ ] **D-gsap — Documentación Standard Free** — `gsap@3.15.0` `package.json:27` no es MIT. No remover (uso válido Standard Free para proyecto gratuito no comercial que no revende gsap). Corregir `LICENSE` para aclarar excepciones y actualizar `legal/ip-audit.md` para reflejar licencia real. Opcional `NOTICE` o `THIRD_PARTY_NOTICES.md`.
  - Criterio: `LICENSE` menciona excepciones, `legal/ip-audit.md` fila gsap dice `Standard Free (no MIT, uso comercial permitido sin revender, atribución no requerida)`.

- [ ] **D-AI — Disclosure offline** — Recraft 8 favicons (`public/favicon.svg:1` C2PA), Anymotion 12 (`public/animations/*/project.json:5`), Spritecook ~40 (`assets/pixel-art/lab-palette.json:1`). Añadir `NOTICE` corto o sección en `README.md` + actualizar `legal/ip-audit.md` y preparar base para `legal/politica-ia.md` (no generarla aún, solo disclosure).
  - Criterio: `grep -i recraft|anymotion|spritecook` en `README.md` o `NOTICE` con hits.

## Entregables
- Branch `feat/legal-seguridad-c-clean` con commits D-typed, D-gsap, D-AI.
- `package.json` sin GPL, `LICENSE` coherente, `legal/ip-audit.md` actualizado.

## Progreso
- 2026-10-06 — Feature creado.
- 2026-10-06 — D-typed done 0441e3a: `LabHeroCopy.tsx` migrado a `TypingText` MIT, `typed.js` eliminado de `package.json` + `package-lock`, `type-check` + `build` OK.
- 2026-10-06 — D-gsap+AI done 86153e5: `LICENSE` Third-Party Exceptions (gsap Standard Free), `legal/ip-audit.md` corregido, `README.md` sección Créditos IA offline (Recraft 8, Anymotion 12, Spritecook ~40).
- Verificación: `grep typed.js` EMPTY, `grep gsap LICENSE` hit, `grep Recraft README` hit, `type-check` OK, `vitest` 92 OK. Branch `feat/legal-seguridad-c-clean`.

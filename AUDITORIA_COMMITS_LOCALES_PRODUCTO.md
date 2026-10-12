# Auditoría — 4 commits locales sin push (código de producto)

**Alcance:** `88a038b`, `2f03e1d`, `87b3cd7`, `cef461a` sobre base `ff0af93`.
**Método:** solo lectura vía `git show` / `git diff ff0af93..cef461a`. HEAD sigue desacoplado en `ff0af93`; el árbol de trabajo sigue intacto (verificado: `LabOfflineNotice.tsx`, `AnymotionControls.tsx`, `OverfittingPlayer.tsx` no existen en el árbol — `ls` da "no such file"). Nada fue modificado ni commiteado.

## Veredicto global

| sha | Intención | Veredicto | Evidencia principal |
|-----|-----------|-----------|---------------------|
| `88a038b` | OverfittingPlayer + controles reales de animación | **SÓLIDO** | `AnymotionControls.tsx:42-84`; bug real del hook en `useAnymotionTimeline.ts:45,48,83,115-122` (ff0af93) |
| `2f03e1d` | Registrar LessonVideo + activar texto del DialogueBox | **PARCIAL** | Registro OK (`lesson-video.tsx`, `page.tsx:174`), pero video sin `<track>` (`lesson-video.tsx:23-35`) |
| `87b3cd7` | LabOfflineNotice (aviso offline Pyodide) | **SÓLIDO** (scoped) | `LabOfflineNotice.tsx:52-72`; test real pero superficial (`LabOfflineNotice.test.ts:11-15`) |
| `cef461a` | dots 24px + responsive fixed-width + "TDZ crash" | **PARCIAL** | a11y/responsive correcto (`OrbitalModules.tsx:180-198`), pero el "TDZ fix + owner registry" es **código muerto** (`RevealSequence.tsx:57-74,246`) |

---

## 1. `88a038b` — SÓLIDO

**¿Controles reales o cosméticos? Reales.** `AnymotionControls.tsx` (nuevo, 92 líneas) mapea cada acción al contrato del hook: play/pause (`:48` → `toggle`), replay (`:66` → `reset()` + `play()`), scrubber (`:77-82` → `seek(Number(...))`) y readout de tiempo. El componente sumado a `ConidiaToVectorPlayer` (`:209` del diff) y `FeatureSpace2DPlayer` (`:186` del diff) deja de usar solo `progress`.

**Bug real que se corrige (verificado en ff0af93).** En el árbol actual el hook setea `useState(autoPlay)` (`useAnymotionTimeline.ts:45`) y `useRef(autoPlay)` (`:48`), pero el `requestAnimationFrame` **solo** se agenda dentro de `play()` (`:83`). El único `useEffect` con deps es cleanup-only (`:115-122`). Resultado: con `autoPlay` la animación queda con `isPlaying=true` y `t=0` para siempre. El fix (`hook:138,159` en el commit) agenda `play()` al montar y respeta `prefers-reduced-motion` (`:78-81`, `:32-38`).

**Design tokens vs hex.** El SVG usa hex (`COLORS` en `OverfittingPlayer.tsx:140`; `bg-[#0a0a0a]` en `:227`), pero **no replica la violación de AuthForm**: los hexes de AuthForm son Tailwind arbitrario en `className` donde existen tokens (`AuthForm.tsx:400`: `text-[#111439]`, `border-[#E2E8F0]`), y ese patrón sigue vigente e intacto. En los players anymotion el hex en atributos SVG (`stroke`/`fill`) es el patrón **preexistente** — `ConidiaToVectorPlayer.tsx:61,78,96` (ff0af93) ya usaba `#45dcc6`, `#f59e0b`, `#a78bfa`. El nuevo componente lo hereda: deuda arrastrada, no violación nueva.

**A11y: cumple.** `role="group"` + `aria-label` (`AnymotionControls.tsx:42-43`), aria-labels por botón (`:50`, `:68`, `:84`), y en el player `role="img"` + `aria-label` (`:227`), aria-labels en −/+ (`:333`, `:348`), aria-label en el slider de grado (`:362`) y `aria-live="polite"` en el diagnóstico (`:364`).

**Cliente y tamaño:** `"use client"` en `AnymotionControls.tsx:1` y `OverfittingPlayer.tsx:1`. El player pesa ~372 líneas (grande pero con `useMemo` en paths y dataset determinista con semilla — sin `Math.random`).

---

## 2. `2f03e1d` — PARCIAL

**LessonVideo: registrado sí.** Barrel en `components/lesson/index.ts:32` y mapa MDX en `page.tsx:174`. Antes era inalcanzable desde `lesson.md` — el reclamo del commit es correcto.

**Subtítulos: NO.** `<video>` con `controls`, `poster`, `muted={autoPlay}` (correcto: autoplay muteado) pero **sin `<track>`** (`lesson-video.tsx:23-35`). El hallazgo a11y de subtítulos/transcripción **persiste**; el `figcaption` en texto plano no es equivalente.

**Contrato del carrusel: intacto.** `page.tsx:196-201` sigue partiendo por `<Section`, filtrando `Resumen` y renumerando. El DialogueBox vive **dentro** de un Section (`lesson01.../lesson.md:26-39`, dentro de `<RevealSequence>` en `:22`), no crea bloques nuevos.

**"Texto interactivo": fix real y verificado.** `canInteract` ahora deriva de `hasLines` (`DialogueBox.tsx:253`) porque `onNext` no es serializable en MDX. El doble avance se corta con `e.stopPropagation()` mientras hay líneas (`:216`, y espejo en teclado `:237`); en la última línea el clic sube al padre (`:223`, `:243`). Funciona porque el contenedor del RevealSequence usa `onClick` de React (`RevealSequence.tsx:389` en cef461a), no listener nativo.

**Costo no documentado:** avanzar el paso del RevealSequence ahora exige 6+ clics (durante el typing el primer clic solo completa el texto, `DialogueBox.tsx:198-203`). No es bug, pero cambia la cinemática de la lección y no quedó registrado en AGENTS.md.

---

## 3. `87b3cd7` — SÓLIDO (scoped)

`"use client"` (`:1`), `useEffect` con `navigator.onLine` + listeners `online`/`offline` y cleanup correcto (`:54-70`), condicional correcto `if (!isOffline) return null` (`:72`). No rompe el render de lecciones: el registro MDX es aditivo y el componente renderiza `null` online, así que una lección que no lo use no se ve afectada.

Dos observaciones menores: `role="alert"` + `aria-live="polite"` juntos (`:76-77`) son redundantes (alert ya implica assertive), y los estilos usan hex inline con comentario de token (`:10-19`) en vez de las CSS vars del proyecto (`globals.css`). Trazable, pero de patrón nuevo.

**Test:** real pero superficial. 5 de 7 casos prueban lógica pura con assertions honestas (`resolveOffline`: forced gana, fallback a `navigator.onLine`; `getOfflineMessage`: default, custom, whitespace). El primero es trivial (`typeof === "function"`, `:11-15`) y **no hay test de render** (node env, sin DOM): el `useEffect` y el markup no están cubiertos. No infla resultados.

---

## 4. `cef461a` — PARCIAL

### 4a. Dots 24px hit-area — **correcto, cumple WCAG 2.2**

El botón pasa a `h-6 w-6` = **24×24 CSS px** (`OrbitalModules.tsx:184-190`) con el punto visual en un `<span aria-hidden>` (`:192-198`: 12px activo / 10px inactivo). Eso satisface **SC 2.5.8 Target Size (Minimum), Nivel AA** (mínimo 24×24 CSS px). Con `gap-2` (8px) mobile tampoco hace falta invocar la excepción de espaciado. Conserva `aria-label={`Ir a ${mod.slug}`}` y `aria-current`, y ahora tiene `focus-visible:ring` (`:189`). Las flechas bajan de 48 a 40px en mobile (`:91`, `:170`) — siguen por encima del mínimo. Sólido.

### 4b. Responsive fixed-width — **arregla recorte, no había scroll de página**

`li`: `max-md:min-w-0 max-md:w-full` (`:146`) y el `scale-[1.03]` pasa a `md:` only (`:149-151`): en mobile la tarjeta ocupa exactamente el viewport y ya no la recorta el `overflow-hidden` del contenedor. En `Modules.tsx`: `px-6 → px-4 sm:px-6` (`:25`) y las decoraciones se aíslan en una capa `absolute inset-0 overflow-hidden` (`:28-51`). Matiz: el `scrollWidth` de página ya estaba contenido por el `overflow-hidden` previo de la sección; lo que se arregla de verdad es el recorte de la tarjeta escalada y 16px de padding mobile.

### 4c. "TDZ crash" — **el bug nunca existió en ff0af93, y el fix quedó sin cablear**

- No había TDZ en la base: `handleAdvance` no existía en RevealSequence, y `git log ff0af93..cef461a -- src/components/lesson/presentation/RevealSequence.tsx` muestra **solo** `cef461a`. El TDZ era de trabajo WIP no commiteado.
- El commit final sí ordena bien: `advance` en `:226`, `handleAdvance` en `:246`. Correcto, pero inocuo.
- **Código muerto:** `handleAdvance`, `registerRevealAdvance` (`:59`) y `consumeRevealAdvance` (`:70`) no tienen **ningún call site** — `git grep` sobre `cef461a` solo encuentra las definiciones. El carousel sigue deduplicando con `MutationObserver` sobre `[data-reveal-has-more]` (`lesson-carousel.tsx:63` + `:107`). El "single owner of the forward advance" que anuncia el mensaje **no existe en runtime**.
- `tsconfig.json` no tiene `noUnusedLocals`, por eso el type-check verde no detecta el `handleAdvance` sin usar.

### 4d. Sticky controls — **bien**

Controles sticky con fondo y `backdrop-blur` (`RevealSequence.tsx:473,545,565`) y `min-h-11` en Entendido/Atrás/Continuar (`:491,517,530`) — 44px de hit area real. Correcto.

---

## Hallazgos de auditoría previa que estos commits NO corrigen

| Hallazgo | Estado tras los 4 commits | Evidencia |
|---|---|---|
| **P0 purge-pending** (bypass por header `x-vercel-cron`) | **SIGUE ABIERTO** | `git diff ff0af93..cef461a -- src/app/api/cron/` = vacío; `src/app/api/cron/purge-pending/route.ts:17-18` en cef461a sigue con `if (vercelCronHeader !== null) { return true; }` |
| **Contraste 2.62:1** en consentimiento / "Reenviar código" (`#00b2b2` sobre blanco) | **SIGUE ABIERTO** | `git diff ff0af93..cef461a -- src/components/auth/AuthForm.tsx` = vacío; 17 hexes en ambos extremos; `AuthForm.tsx:400,547` (ff0af93) |
| **focus-visible incompleto** (Header/Footer, sliders) | **SIN TOCAR** | Ninguno de los 4 commits toca `Header.tsx`/`Footer.tsx` (ver `--name-only` por commit) |
| **InteractiveFrame con src roto** | **1 de 2 corregido** | `lesson02:280` (`demo_06b_overfitting.html`) → corregido por `88a038b` (reemplazado por componente React). **`lesson03:187` (`demo_10_pipeline_ml.html`) SIGUE ROTO**: el archivo real es `public/interactives/demo_10_pipeline.html` |
| **Hero `#111439`** | **INTACTO** | `git diff ff0af93..cef461a -- src/app/page.tsx` = vacío; `src/app/page.tsx:23` |
| **Video sin subtítulos** | **SIGUE ABIERTO** | `lesson-video.tsx:23-35` sin `<track>` |

---

## Nuevos problemas introducidos

1. **`cef461a`: fix anunciado y no entregado + código muerto.** `RevealSequence.tsx:57-74` (registry) y `:246` (`handleAdvance`) sin usar; el mensaje del commit promete "single owner of the forward advance". Es deuda que nadie va a saber si quedó a medias.
2. **Comentario stale** en `OrbitalModules.tsx:88`: dice `gap-3 (12px)` pero el código quedó en `gap-2` (`:89`).
3. **Paleta SVG duplicada:** `COLORS` local en `OverfittingPlayer.tsx:140` vs hexes inline en `ConidiaToVectorPlayer.tsx` — deriva de color futura (no rompe nada hoy).
4. **`87b3cd7`:** `role="alert"` + `aria-live="polite"` redundantes; estilos con hex inline en vez de CSS vars del proyecto.
5. **`2f03e1d`:** cambio de cinemática (6+ clics por paso) sin actualizar la documentación del carrusel.

---

## Limitación de ejecución

- **Sí ejecutado sobre el árbol actual (`ff0af93`, sin los cambios):** `npm run type-check` → **0 errores**; `npm run test` → **19 archivos / 187 tests, todos verdes** (válido como línea base).
- **NO ejecutado sobre `cef461a`:** materializar ese árbol requeriría un worktree aparte o un checkout; **no autorizado** por la consigna. Consecuencia directa: **los tests incluidos en los commits no se corrieron** — `LabOfflineNotice.test.ts` solo se leý, y los "type-check + 21/199 verde" de los mensajes de `87b3cd7`/`cef461a` no pudieron verificarse de forma independiente. (Nota: las cuentas sí cierran contra la base medida — 187 + 5 del glob `.mjs` de `9aecd0c` + 7 de LabOfflineNotice = 199.)

---

## Recomendación de push

**No pushear `cef461a` tal cual.** La mitad a11y/responsive (dots 24px, sticky, min-h-11, mobile fit) es sólida y querible; el otro tercio anuncia un fix estructural que no está cableado. Camino mínimo: commit de seguimiento que **elimine** `registerRevealAdvance`/`consumeRevealAdvance`/`handleAdvance` o los cablee de verdad en `lesson-carousel.tsx:107`, y deje el body del commit diciendo qué quedó. `88a038b`, `2f03e1d` y `87b3cd7` pueden pushear; para `2f03e1d` conviene un issue posterior por el `<track>` y el costo de 6 clics. Antes de cualquier push, correr type-check + test sobre `cef461a` en un worktree aparte.

---

## Key Learnings

1. El commit que "arregla un crash" puede estar arreglando código que nunca shippeó: verificar siempre si el bug existía en la base con `git log <rango> -- <path>` antes de creerle al mensaje.
2. Un fix prometido en el mensaje pero sin call sites es peor que la ausencia de fix: `git grep` del símbolo sobre el árbol completo es la verificación de 10 segundos que falta.
3. Los hex en este repo tienen dos clases muy distintas: Tailwind arbitrario donde existen tokens (violación real, AuthForm) vs atributos SVG en players anymotion (patrón preexistente). No mezclarlas en un mismo hallazgo.
4. `type-check` en verde no detecta código muerto sin `noUnusedLocals`; los números de tests de los mensajes de commit sí cerraron contra una base medida (187 + 5 + 7 = 199).
5. La interactividad nueva en contenido MDX tiene costo de UI oculto: derivar `canInteract` de props serializables funciona, pero agregar 6 clics por paso es un cambio de producto que hay que documentar.

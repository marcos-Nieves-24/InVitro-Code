# Auditoría UX/UI — Expediciones (InVitro-Code)

**Worktree:** `/home/biohacker24/proyectos/invitro-code-worktrees/presentation-reemplazo-directo`
**Rama:** `feat/presentation-reemplazo-directo` @ `dd95eae` — árbol limpio.
**Fecha:** 2026-10-11 · **Fase:** diagnóstico (sin cambios de código)
**Estado:** PLAN PROPUESTO — ninguna corrección aplicada.

> **Nota de trazabilidad.** La primera pasada de captura se ejecutó sobre la worktree hermana
> `fix/hero-cientifico-cut` (c5f8357). Se verificó con `diff -rq` que los archivos de Expediciones
> (`components/landing/*`, `components/modules/*`, `app/learn/page.tsx`, `domain/module-card.ts`)
> son **byte-idénticos** en ambas, y que `globals.css` sólo difiere en un bloque `DialogueBox`
> añadido al final (tokens de Tailwind idénticos). Toda la evidencia runtime se **regeneró** en la
> worktree objetivo (`probe2.json`, `probe3.json`).

---

## 1. Alcance

Dos superficies que comparten el mismo modelo visual:

| Superficie | Ruta | Componentes |
|---|---|---|
| Landing (pública) | `/` §`#modulos` | `landing/Modules.tsx` → `landing/OrbitalModules.tsx` |
| Expediciones (auth) | `/learn` | `app/learn/page.tsx` → `components/modules/ModuleGrid.tsx` → `ModuleCard.tsx` |

Compartidos y **fuera de alcance directo pero con riesgo de regresión**:
`modules/CardPrimitives.tsx` (lo usa **sólo** `ModuleCard`, que a su vez sirve a `/proyectos`,
`laboratorios/explorer` y `preview/cards`), `labs/LabCardTheme.ts` (9 call sites),
`domain/module-card.ts`.

**No auditado** (fuera de la sección): lección, laboratorios, proyectos, comunidad, dashboard.

### Método
- Lectura estática con CodeGraph + Read acotado.
- Runtime con Chromium headless (Playwright, `playwright-core` de la caché npx; **no se instaló nada en el repo**).
- Geometría real por viewport, recorrido de tabulación, `:focus-visible` computed, contraste WCAG calculado en el navegador.

**Evidencia:** `/tmp/opencode/audit-expediciones/` → `exp-landing-1440.png`, `exp-landing-768.png`,
`exp-landing-390.png`, `probe2.json`, `probe3.json`, `probe.js`, `probe2.js`, `probe3.js`.

---

## 2. Hallazgos

Severidad: **Crítica** (bloquea la tarea) · **Alta** (uso grave) · **Media** (fricción/consistencia) · **Baja** (refinamiento).

### EXP-001 — La expedición activa queda cortada en tablet · **Crítica** · Causa: **confirmada**

- **Ubicación:** `src/components/landing/OrbitalModules.tsx:73` (`visibleCount = Math.min(4, len)`), `:89` (fila flex con dos flechas), `:99` (`overflow-hidden`).
- **Evidencia:** 768×1024. Viewport del carrusel = 544px con 4 tarjetas de ~325px. `Machine Learning` (**la activa**, la que el usuario debe leer) recortada **133px**; `Introducción a la IA` recortada 473px; `Python para Biotecnología` recortada **821px** (prácticamente invisible). Captura `exp-landing-768.png`: el título activo se corta en "Machine Learn…".
- **Impacto:** en tablet el estudiante ve menos de 2 expediciones y la que está destacada es la ilegible. Impide elegir con criterio.
- **Causa:** el `max-width:767px` en `:34` deja 768px fuera del modo móvil, pero la fila desktop necesita ~1376px de pista para 4 tarjetas. El breakpoint de JS y el de CSS no coinciden en el rango 768–1400px.
- **Solución propuesta:** calcular `visibleCount` desde el ancho disponible en lugar de fijarlo en 4; o bajar el corte de JS a `max-width:1023px` y usar la tarjeta apilada como fallback en tablet. Sin rediseño: reutilizar `ordered` y `CARD_W`.
- **Criterio de aceptación:** a 768×1024 ninguna tarjeta renderizada queda recortada por el `overflow-hidden`, y la tarjeta activa es totalmente legible.

### EXP-002 — La 4ª tarjeta siempre se recorta en escritorio · **Alta** · Causa: **confirmada**

- **Ubicación:** `OrbitalModules.tsx:19` (`CARD_W = 332`), `:73`, `:89` (flechas 56px + gaps), `:99`.
- **Evidencia:** 1440×900. Viewport 1184px vs pista necesaria 4×332 + 3×16 = 1376px → `Python para Biotecnología` recortada **181px** (55% de la tarjeta) y la primera con 5px de recorte por la izquierda. Captura `exp-landing-1440.png`.
- **Impacto:** el carrusel promete 4 expediciones y entrega 3,5. La última queda con el título cortado siempre.
- **Causa:** `visibleCount` asume 4 tarjetas sin descontar el ancho que consumen las flechas dentro del mismo `max-w-[1360px]`.
- **Solución propuesta:** derivar `visibleCount` del ancho real, o reducir `CARD_W` a 296px (4×296+3×16=1232px) para que 4 quepan en 1216px útiles.
- **Criterio de aceptación:** a 1440×900, `clippedRight === 0` y `overflowsLeft === 0` para las 4 tarjetas.

### EXP-003 — La tarjeta se comprime a 179px en móvil · **Crítica** · Causa: **confirmada**

- **Ubicación:** `OrbitalModules.tsx:89` (flechas 48px + `gap-3` dentro de la fila), `:146` (`max-md:w-[calc(100%-32px)]`).
- **Evidencia:** 390×844. El `ul` mide 206px (390 − dos flechas de 48 − gaps), y `calc(100% − 32px)` se resuelve contra ese ancho, no contra el viewport → tarjeta de **179px**. Captura `exp-landing-390.png`: título en 2 líneas, descripción truncada con elipsis ("Entrena y evalúa modelo…"), badge "300 XP" partido en dos líneas, icono cortado contra el borde de la tarjeta.
- **Impacto:** en móvil la expedición es ilegible. Es el viewport de mayor uso y el que peor se ve.
- **Causa:** `calc(100% - 32px)` depende de un padre cuyo ancho ya fue reducido por las flechas; el padding de 32px era para una pista a ancho completo.
- **Solución propuesta:** en `max-md`, sacar las flechas de la fila y llevar la tarjeta a `w-full` (o `calc(100vw - 80px)`), conservando los dots como navegación. Reutiliza el `li` existente; no requiere componentes nuevos.
- **Criterio de aceptación:** a 390×844 la tarjeta mide ≥320px, el título no supera 2 líneas, la descripción no muestra elipsis y los badges no se parten.

### EXP-004 — Descripción de tarjeta por debajo del mínimo AA · **Alta** · Causa: **confirmada**

- **Ubicación:** `modules/ModuleCard.tsx:40` (`text-sm text-storm`), `OrbitalModules.tsx:149` (`opacity-60 saturate-[0.92]`).
- **Evidencia** (`probe3.json`, WCAG 2.1 calculado sobre colores computados):
  - Descripción `text-storm` `#677381` @14px sobre la tarjeta: **4.07:1** (card 1) y **4.46:1** (cards 3-4) → **falla AA (4.5:1)** incluso en la tarjeta **activa**.
  - Con el祖先 `opacity: 0.6` de las tarjetas inactivas: **2.14:1** y **2.24:1** → falla severamente.
  - Título @20px: 5.45–5.61:1 atenuado (pasa AA), 17.7–19.4:1 activo (AAA).
- **Impacto:** texto de apoyo ilegible justo en las tarjetas que el usuario debe comparar entre sí.
- **Causa:** `text-storm` fue elegido como token "terciario" (DESIGN.md §1.1: "nunca para texto principal") y además se compone con una opacidad de contenedor.
- **Solución propuesta:** usar `--color-slate` (`#00388C`) o `ink` al 70% para la descripción, y sustituir la atenuación por `opacity` de contenedor por un tratamiento de borde/fondo que no degrade el texto.
- **Criterio de aceptación:** la descripción alcanza ≥4.5:1 en la tarjeta activa **y** en las inactivas.

### EXP-005 — Los puntos no corresponden a las tarjetas · **Alta** · Causa: **confirmada**

- **Ubicación:** `OrbitalModules.tsx:178-195` (dots sobre `modules`) vs `:74-78` (tarjetas sobre `ordered`, ventana rotada).
- **Evidencia:** los dots se ordenan `[ia, python, estadistica, machine-learning]` (orden de `module.json`) mientras las tarjetas visibles se ordenan `[estadistica, machine-learning, ia, python]`. El punto activo es el **4º** (`machine-learning`) pero la tarjeta activa es la **2ª** de la fila.
- **Impacto:** el indicador de posición miente. Un usuario que hace clic en el punto 1 ("ia") obtiene un desplazamiento que no corresponde a lo que espera, y viceversa.
- **Causa:** los dots renderizan el array original mientras las tarjetas renderizan una ventana rotada.
- **Solución propuesta:** renderizar los dots desde `ordered`, o eliminar la rotación y usar un offset real de pista (ver EXP-009).
- **Criterio de aceptación:** el dot activo cae **bajo** la tarjeta activa en ≥1280px, verificado por `getBoundingClientRect`.

### EXP-006 — El carrusel abre en la última expedición · **Media** · Causa: **confirmada**

- **Ubicación:** `OrbitalModules.tsx:24` — `useState(() => (len ? len - 1 : 0))`.
- **Evidencia:** en los 3 viewports, la tarjeta activa inicial es `Machine Learning` (`machine-learning`, `order: 4`), no `Introducción a la IA` (`order: 1`).
- **Impacto:** el primer visitante del sitio ve destacada la expedición más avanzada, sin ninguna señal de secuencia o recomendación. Para un estudiante nuevo, la entrada natural queda oculta.
- **Solución propuesta:** inicializar en `0`. Cambio de una línea, sin efecto en la lógica de negocio.
- **Criterio de aceptación:** en carga inicial la tarjeta activa es el módulo con `order: 1`.

### EXP-007 — El arrastre móvil no hace nada · **Media** · Causa: **probable**

- **Ubicación:** `OrbitalModules.tsx:110-125` (drag), `:50` (`maxOffset`), `:74-75` (`ordered` en móvil = 1 elemento).
- **Evidencia:** arrastre sintético de 160px a 390×844 con `reducedMotion: 'no-preference'` confirmado (`reduce: false`): `dragChanged: false`, `dragNavigated: false` — ni avanza ni navega. En móvil `ordered` contiene **un solo `li`**, así que no hay pista que recorrer; y `maxOffset` sigue calculando con `CARD_W = 332` aunque la tarjeta mide 179px.
- **Impacto:** la interfaz anuncia un gesto que no produce efecto. Peor que no ofrecerlo.
- **Causa probable:** con una sola tarjeta en el DOM, `dragConstraints` no tiene recorrido; el umbral de `onDragEnd` no se alcanza de forma útil. **Confirmado** que el presupuesto de arrastre y el ancho real están desincronizados (EXP-011).
- **Nota de honestidad:** el gesto fue sintetizado con eventos de puntero de escritorio. **Pendiente de verificación** con touch real en dispositivo.
- **Solución propuesta:** si se conserva el gesto, actualizar `maxOffset` al ancho real y habilitar arrastre sólo cuando `len > 1`; si no, retirar el `drag` y dejar flechas/dots como única navegación.
- **Criterio de aceptación:** en móvil el gesto avanza de expedición, o el `drag` se elimina del código.

### EXP-008 — Etiquetas accesibles en inglés e identificadores internos · **Media** · Causa: **confirmada**

- **Ubicación:** `OrbitalModules.tsx:185` — `aria-label={`Ir a ${mod.slug}`}`.
- **Evidencia:** nombres accesibles reales: `"Ir a ia"`, `"Ir a python"`, `"Ir a machine-learning"`. El nombre de la tarjeta sí es correcto: `"Estadística y Probabilidad — 10 lecciones"` (`ModuleCard.tsx:23`).
- **Impacto:** un lector de pantalla anuncia slugs en inglés dentro de una UI íntegramente en español, justo en el control que indica la posición del estudiante.
- **Solución propuesta:** usar el título del módulo (`mod.title`) — el dato ya está disponible.
- **Criterio de aceptación:** ningún `aria-label` de Expediciones contiene un slug.

### EXP-009 — Desplazamiento brusco de 8px alterno · **Media** · Causa: **confirmada**

- **Ubicación:** `OrbitalModules.tsx:49` — `trackOffset = isMobile ? 0 : activeIndex % 2 === 0 ? 0 : -8`.
- **Evidencia:** `ulTransform` computado = `matrix(1,0,0,1,-8,0)` en 1440 y 768.
- **Impacto:** la fila completa salta 8px cada dos pasos, desalineando la primera tarjeta respecto al eje de la sección. No comunica nada: el carrusel ya cambia por la ventana `ordered`.
- **Causa:** quedó un resto del diseño "translate" cuando la lógica pasó a rotar el array.
- **Solución propuesta:** eliminar el offset alterno (dejar `x: 0`) una vez resuelto EXP-005.
- **Criterio de aceptación:** `ulTransform` es `none` en todos los viewports y tras avanzar.

### EXP-010 — Subtítulo de sección por debajo de AA · **Media** · Causa: **confirmada**

- **Ubicación:** `landing/Modules.tsx:72` — `text-[17px]` + `text-[#668094]`.
- **Evidencia:** **3.97:1** sobre el fondo de sección `#F8FBFA`. A 17px no califica como "texto grande" (requiere ≥24px, o ≥18.66px en negrita), así que el mínimo aplicable es 4.5:1. El título de sección sí cumple: 16.19:1.
- **Causa:** `#668094` es casi-twin de `storm` (`#677381`) pero no es el token; nadie corrigió el valor al migrar la paleta.
- **Solución propuesta:** usar el token `text-storm` real (`#677381`) y/o subir a 18px. Sin cambiar el color de marca.
- **Criterio de aceptación:** ≥4.5:1 medido en el navegador.

### EXP-011 — Dos definiciones de breakpoint que pueden desincronizarse · **Media** · Causa: **confirmada**

- **Ubicación:** `OrbitalModules.tsx:34` (`matchMedia("(max-width: 767px)")`) vs `:146` (`max-md:`).
- **Evidencia:** JS y CSS coinciden sólo exactamente en 768px. La fila de flechas usa `md:gap-4` / `md:h-14` mientras el modo tarjeta-única arranca a 768px.
- **Causa:** dos fuentes de verdad para el mismo corte, más `CARD_W = 332` duplicado entre `:19` y `:146`.
- **Solución propuesta:** que el JS lea el mismo valor que CSS, o eliminar la rama JS y resolver con una variable CSS.
- **Criterio de aceptación:** una sola constante define el breakpoint y el ancho de tarjeta.

### EXP-012 — El badge "N labs" muestra lecciones · **Media** · Causa: **confirmada**

- **Ubicación:** `app/learn/page.tsx:19` y `OrbitalModules.tsx:136` pasan `labCount: mod.lessonCount`; `CardPrimitives.tsx:90` renderiza `{count} labs`.
- **Evidencia:** `Introducción a la IA` muestra "4 labs" y tiene 4 lecciones; existe un helper `hasLab()` (`lib/content/modules.ts:261-270`) con **cero** call sites en el repo.
- **Impacto:** dato incorrecto en la tarjeta. Un estudiante decide itinerario formativo con información falsa.
- **Causa:** el parámetro se llama `labCount` pero ambas superficies le pasan lecciones.
- **Solución propuesta:** usar `hasLab()` o renombrar el badge a "lecciones" (que además evita duplicar el `aria-label`, que ya dice "N lecciones").
- **Criterio de aceptación:** el número del badge corresponde a la métrica que el texto declara.

### EXP-013 — Expediciones nunca muestra progreso · **Media** · Causa: **confirmada**

- **Ubicación:** `app/learn/page.tsx:21-22` y `OrbitalModules.tsx:138-139` pasan `completed: null, total: null`; `ModuleCard.tsx:16` exige además `variant === "grid"`.
- **Evidencia:** ninguna de las dos superficies lee Clerk ni Supabase. En contraste, `/proyectos` (`projects/page.tsx:86,97`) y el explorador de laboratorios sí pasan valores reales, y ahí el `ProgressFooter` sí se renderiza.
- **Impacto:** "Elige tu Expedición" es la pantalla donde un estudiante vuelve a decidir qué continuar, y no le dice qué dejó a medias. Los estados "disponible / iniciada / completada / bloqueada" **no existen** en esta sección.
- **Solución propuesta:** pasar `completed`/`total` reales en `/learn` (el `ProgressFooter` ya existe y funciona). Para la landing, dejarlo fuera de alcance o habilitar `compact` — decisión de producto.
- **Criterio de aceptación:** `/learn` muestra barra de progreso real por módulo para un usuario autenticado.
- **Decisión de producto requerida:** ¿debe la landing públicas mostrar progreso? Hoy no puede por construcción.

### EXP-014 — Estados vacío/loading/error resueltos a mano · **Baja** · Causa: **confirmada**

- **Ubicación:** `OrbitalModules.tsx:41-47` y `ModuleGrid.tsx:34-42` (dos empty states distintos, texto divergente); `components/ui/EmptyState.tsx` existe y **no se usa** en esta sección. No hay `loading.tsx` en `src/app` (DESIGN.md §5.2).
- **Causa probable del vacío silencioso:** `lib/content/modules.ts:47-49,208-210` traga excepciones con `try/catch` y devuelve `[]` → un directorio de contenido ilegible se ve idéntico a "no hay expediciones".
- **Solución propuesta:** unificar en `ui/EmptyState` y distinguir error de vacío.
- **Criterio de aceptación:** ambas superficies renderizan el mismo componente de estado vacío.

### EXP-015 — Paleta teal local sin documentar · **Baja** · Causa: **confirmada**

- **Ubicación:** `#0AAE9A` (3 archivos), `#DDF5EF` (2), `#DCEAE8` (2), `#F0F9F7` (1), `#F8FBFA` (1), `#101B3D` (2), `#668094` (2).
- **Evidencia:** ninguno de estos valores existe en `globals.css` ni en DESIGN.md. La familia está **confinada** a `landing/Modules.tsx`, `landing/OrbitalModules.tsx` y `modules/CardPrimitives.tsx`.
- **Contexto crítico:** `globals.css:14-27` ya declara una paleta "NEW PALETTE (scientific gradient)" que **contradice** DESIGN.md §1.1 y §6 (`mint` es `#00B5C5` en código y `#a3cfcd` en el doc). El documento de diseño está desactualizado respecto del código.
- **Riesgo:** cambiar estos colores por `mint` rompería la identidad propia de la sección. **No se recomienda** tocar la paleta; se recomienda documentarla o dejarla como está.
- **Criterio de aceptación:** ninguno — es decisión de documentación, no de código.

### EXP-016 — Detalles menores · **Baja** · Causa: **confirmada**

| # | Detalle | Ubicación |
|---|---|---|
| a | Puntos sin anillo de foco de marca: caen al `outline: auto` del navegador, inconsistente con flechas (`ring-2 #0AAE9A`) y tarjetas (`ring-mint`). Medido: **sí** tienen indicador visible (UA), luego no es bloqueante. | `OrbitalModules.tsx:188-192` |
| b | `transition-all` + `transition` inline duplican la misma duración; el inline gana y la clase queda muerta. | `OrbitalModules.tsx:146,152-158` |
| c | `xpReward ?? mod.lessons * 20` es un segundo criterio de XP que nunca se ejecuta (ambos call sites pasan `xpReward`). | `OrbitalModules.tsx:130` |
| d | `max-w-[1360px]` (×3) vs `--width-layout: 1280px`. | `OrbitalModules.tsx:43,82,89` |
| e | `CARD_W = 332` duplicado como constante y como clase. | `OrbitalModules.tsx:19,146` |

### EXP-017 — Violación de Reglas de Hooks en el estado vacío · **Alta** · Causa: **confirmada** (latente)

- **Ubicación:** `OrbitalModules.tsx:41-47` (`return` temprano con `len === 0`) precede a los `useCallback` de `:51`, `:54` y `:58`.
- **Evidencia:** lectura del orden de hooks en el archivo. Si `len` pasa de 0 a >0 entre renders, el número de hooks cambia y React lanza error en runtime.
- **Impacto:** hoy no se dispara (contenido presente), pero el estado vacío es un camino real: `getModules()` traga excepciones y devuelve `[]` (`lib/content/modules.ts:47-49,208-210`). Un fallo de contenidoRW convierte un error en caída de React en vez de estado vacío.
- **Solución propuesta:** mover el `return` temprano **después** de todos los hooks (o extraer los `useCallback` antes del condicional).
- **Criterio de aceptación:** renderizar con `modules={[]}` y luego con módulos no lanza error; `npm run type-check` verde.
- **Pendiente:** verificar si `len === 0` es alcanzable en producción (depende de si elFS de contenido falla).

### EXP-018 — Los puntos inactivos son casi invisibles · **Alta** · Causa: **confirmada**

- **Ubicación:** `OrbitalModules.tsx:191` — `border-[#DCEAE8] bg-[#DDF5EF]` sobre sección `#F8FBFA` (`:25`).
- **Evidencia** (WCAG 1.4.11, contraste no textual, requiere 3:1): relleno `#DDF5EF` vs `#F8FBFA` = **1.10:1**; borde `#DCEAE8` = **1.19:1**; punto activo `#0AAE9A` = **2.68:1**. Todos **fallan**. Tampoco cumplen 24×24 (ver EXP-010/tabla de objetivos).
- **Impacto:** en la sección más clara de la landing, 3 de cada 4 puntos no se ven. El estado "qué expedición estás mirando" se apoya únicamente en el tamaño y en `aria-current`.
- **Solución propuesta:** subir el contraste del relleno/borde inactivo y del activo a ≥3:1 contra el fondo de sección, sin cambiar el tono (mismo teal, más oscuro o con borde más presente).
- **Criterio de aceptación:** ≥3:1 en los cuatro estados medido sobre `#F8FBFA`.

### EXP-019 — Glifos de navegación por debajo de 3:1 · **Media** · Causa: **confirmada**

- **Ubicación:** `OrbitalModules.tsx:94,171` (flechas: glifo `text-[#0AAE9A]` sobre blanco) y `:190` (punto activo). También `app/learn/page.tsx:33` (`text-mint` `#00B5C5` sobre blanco).
- **Evidencia:** `#0AAE9A` sobre blanco = **2.79:1**; `#00B5C5` (token `mint` real) sobre blanco = **2.50:1**. Ambos por debajo del 3:1 que exige WCAG 1.4.11 para elementos de interfaz.
- **Causa probable:** los teales de marca se eligieron por estética sobre fondos claros sin verificar el umbral de no-texto. Nótese que `mint` **ya falla** en todo el sistema, no sólo en Expediciones.
- **Criterio de aceptación:** ≥3:1 en glifos de flechas y punto activo.

### EXP-020 — `/learn` no tiene `h1` · **Media** · Causa: **confirmada**

- **Ubicación:** `app/learn/page.tsx:34` — el primer encabezado de la ruta es un `h2` ("Elige tu Expedición"). Ni `app/learn/layout.tsx` ni `components/learn/Sidebar.tsx` aportan un `h1`.
- **Evidencia:** el volcado de encabezados en la landing sí es correcto (`H1 → H2 → H3`); el fallo es específico de `/learn`.
- **Impacto:** quien navega por encabezados no tiene punto de entrada a la página "Expediciones". Es la pantalla de decisión de itinerario.
- **Solución propuesta:** promover el título a `h1` o añadir uno en el layout de la ruta.
- **Criterio de aceptación:** `/learn` expone exactamente un `h1`.

### EXP-021 — La landing no ofrece ninguna entrada a `/learn` · **Media** · Causa: **confirmada**

- **Ubicación:** `landing/Header.tsx:5-11,61-66` (anclas + `/sign-up`), `app/page.tsx:43-44` (CTAs a `/sign-up` y `/sign-in`), `landing/Footer.tsx:74-84` (sóco legales). La entrada "Expediciones" sólo existe en superficies autenticadas (`AppSidebar.tsx:49`, `InVitroShell.tsx:118`, `SectionsDropdown/Drawer`, `CommandPalette.tsx:29`).
- **Evidencia:** el único camino público hacia una expedición es el enlace profundo de una tarjeta → `/learn/{slug}/{primeraLección}`, que es una ruta autenticada.
- **Impacto:** el visitante nuevo que recorre la sección "Expediciones del curso" no tiene una acción que diga "ver todas las expediciones"; sólo puede caer en un login por tarjeta. Para una landing whose job is orientación, es un punto ciego.
- **Nota favorable:** el deep link **sí** se preserva en el login (verificado en runtime), así que el usuario aterriza donde quiso.
- **Solución propuesta:** añadir un enlace "¿Ver todas las expediciones?" bajo el carrusel que apunte a `/learn`. Es un cambio pequeño, no un rediseño.
- **Criterio de aceptación:** existe un enlace visible desde la sección hacia `/learn`.

### EXP-022 — El foco se pierde al rotar la ventana del carrusel · **Media** · Causa: **confirmada**

- **Ubicación:** `OrbitalModules.tsx:74-78` (la ventana `ordered` se reconstruye) y `:144` (las tarjetas se montan/desmontan).
- **Evidencia:** no existe ningún `ref`, `focus()` ni efecto de restauración en el archivo. Si el foco está en el enlace de la tarjeta que sale del DOM, vuelve a `<body>`.
- **Impacto:** un usuario de teclado o lector de pantalla que navegue por las tarjetas pierde el hilo en cuanto avanza el carrusel.
- **Solución propuesta:** antes de cambiar `activeIndex`, enfocar la tarjeta destino; o mover el foco al control previo/siguiente si la tarjeta enfocada sale de la ventana.
- **Criterio de aceptación:** tras avanzar con el teclado, `document.activeElement` sigue dentro de la región.

### EXP-023 — Destello de primera pintada en móvil · **Media** · Causa: **probable**

- **Ubicación:** `OrbitalModules.tsx:26` (`useState(false)`) y `:33-39` (el listener `matchMedia` sólo actúa post-hidratación).
- **Evidencia:** mecanismo confirmado por lectura; en el primer render `isMobile` es `false`, por lo que se pinta la ventana desktop de 4 tarjetas en un teléfono antes de que el efecto la corrija a 1.
- **Impacto:** salto de layout visible al cargar en móvil, sobre una sección animada — la peor combinación para la percepción de calidad.
- **Solución propuesta:** derivar `isMobile` del ancho ya disponible en el primer render, o initializing desde CSS en lugar de JS.
- **Criterio de aceptación:** en móvil la primera pintada ya muestra una sola tarjeta (verificable con CPU throttling).
- **Pendiente:** cuantificar el destello con CPU limitado.

### EXP-024 — Icono decorativo expuesto a tecnología asistiva · **Baja** · Causa: **confirmada**

- **Ubicación:** `app/learn/page.tsx:37` — `<Compass className="hidden h-10 w-10 text-mint md:block" />` sin `aria-hidden` ni etiqueta.
- **Impacto:** un lector de pantalla anuncia un icono sin propósito. Menor, pero es ruido en la pantalla de decisión.
- **Solución propuesta:** añadir `aria-hidden="true"` (el patrón ya se usa en `landing/Modules.tsx:29,34,37,52`).
- **Criterio de aceptación:** el icono no aparece en el árbol de accesibilidad.

---

## 3. Lo que **no** está roto

Verificado explícitamente para no inflar el plan:

- ✅ **Deep link preservado**: al pulsar una tarjeta → `/sign-in?redirect_url=%2Flearn%2Festadistica%2Flesson01_descriptive_stats`. La expedición elegida se mantiene tras el login.
- ✅ **Teclado operativo**: la región (`tabIndex={0}`, `:85`) responde a `←`/`→` y el contenido cambia; orden de tabulación razonable (skip-link → nav → región → "Anterior" → tarjetas).
- ✅ **Foco visible** en flechas (`ring-2 #0AAE9A`) y tarjetas (`ring-2 white + ring-4 mint`) — medido con `:focus-visible`.
- ✅ **Área táctil de flechas**: 56×56 escritorio, 48×48 móvil (supera 24×24).
- ✅ **Jerarquía de encabezados** coherente: H1 → H2 de sección → H3 de tarjeta.
- ✅ **Sin desbordamiento horizontal** en 1440/768/390 (`scrollWidth === clientWidth`).
- ✅ **Sin errores de consola** en las dos superficies.
- ✅ **`prefers-reduced-motion`** respetado (`shouldReduceMotion` desactiva animación y arrastre).
- ✅ **Nombres accesibles de las tarjetas** correctos y en español.
- ✅ **La región del carrusel sí muestra foco** al tabular (`outline: auto` del navegador) — medido.
- ✅ **Sin desajuste de destino** entre la tarjeta de la landing y la de `/learn`: ambas construyen el mismo `href` con la misma expresión.
- ✅ **Orden de tabulación** coherente: skip-link → navegación → región → "Anterior" → tarjetas.

---

## 4. Plan de acción

Restricciones transversales: sin rediseño, sin colores nuevos, sin tocar lógica de negocio, reutilizando
`ModuleCard`/`CardPrimitives`. **Regla de seguridad:** `CardPrimitives.tsx` sólo lo usa `ModuleCard`, y
`ModuleCard` sirve también a `/proyectos`, `/laboratorios/explorer` y `/preview/cards` — **cualquier cambio
ahí se prueba en esas tres rutas**.

### Fase 1 — Corrección de layout (desbloquea lectura) · P0

| Tarea | Hallazgo | Acción | Archivos | Depende | Riesgo otros | Verificación | Tamaño |
|---|---|---|---|---|---|---|---|
| T1 | EXP-001, EXP-002 | Derivar `visibleCount` del ancho disponible en vez de fijarlo en 4 | `OrbitalModules.tsx:73` | — | Bajo (solo landing) | `clippedRight===0 && overflowsLeft===0` @768/1024/1440 | Media |
| T2 | EXP-003 | En `max-md`, sacar las flechas de la fila y llevar la tarjeta a ancho de pantalla | `OrbitalModules.tsx:89,146` | T1 | Bajo | Tarjeta ≥320px @390, sin elipsis, badges en 1 línea | Media |
| T3 | EXP-004 | Texto de descripción a ≥4.5:1; quitar `opacity` de contenedor | `ModuleCard.tsx:40`, `OrbitalModules.tsx:149` | — | **Alto** → validar `/proyectos`, `/laboratorios`, `/preview/cards` | Contraste medido ≥4.5:1 en activa e inactivas | Media |
| T3b | EXP-018 | Puntos inactivos/activos a ≥3:1 contra `#F8FBFA` | `OrbitalModules.tsx:190-191` | — | Bajo | ≥3:1 en los 4 estados | Pequeña |
| T3c | EXP-017 | Mover el `return` temprano **después** de los hooks | `OrbitalModules.tsx:41-58` | — | Bajo | Renderizar `[]` → con módulos no rompe | Pequeña |

### Fase 2 — Consistencia de estado y navegación · P1

| Tarea | Hallazgo | Acción | Archivos | Depende | Riesgo | Verificación | Tamaño |
|---|---|---|---|---|---|---|---|
| T4 | EXP-005 | Dots renderizados desde `ordered` (o eliminar la rotación) | `OrbitalModules.tsx:178-195,74-78` | T1 | Bajo | El punto activo cae bajo la tarjeta activa | Pequeña |
| T5 | EXP-006 | `activeIndex` inicial = `0` | `OrbitalModules.tsx:24` | — | Bajo | Activa = módulo `order:1` en carga | Pequeña |
| T6 | EXP-008 | `aria-label` de dots con `mod.title` | `OrbitalModules.tsx:185` | — | Bajo | Cero slugs en `aria-label` | Pequeña |
| T7 | EXP-009 | Eliminar el offset alterno de 8px | `OrbitalModules.tsx:49` | T4 | Bajo | `ulTransform: none` siempre | Pequeña |
| T8 | EXP-010 | Subtítulo a token `text-storm` y/o 18px | `landing/Modules.tsx:72` | — | Bajo | ≥4.5:1 medido | Pequeña |
| T8b | EXP-020 | `h1` en `/learn` | `app/learn/page.tsx:34` | — | Bajo | Un único `h1` en la ruta | Pequeña |
| T8c | EXP-021 | Enlace "¿Ver todas las expediciones?" → `/learn` bajo el carrusel | `landing/Modules.tsx:78` | T4 | Bajo | Enlace visible y funcional | Pequeña |
| T8d | EXP-019 | Glifos de flecha y punto activo a ≥3:1 | `OrbitalModules.tsx:94,171,190` | T3b | Bajo — **ojo**: `mint` falla en todo el sistema, decidir alcance | ≥3:1 medido | Pequeña |

### Fase 3 — Semántica de componente y datos · P2

| Tarea | Hallazgo | Acción | Archivos | Depende | Riesgo | Verificación | Tamaño |
|---|---|---|---|---|---|---|---|
| T9 | EXP-012 | Badge honesto: `hasLab()` o renombrar a "lecciones" | `CardPrimitives.tsx:90`, ambos call sites | — | **Alto** → 4 rutas | Número == métrica del texto | Media |
| T10 | EXP-011 | Una sola fuente de breakpoint y de ancho de tarjeta | `OrbitalModules.tsx:19,34,146` | T1, T2 | Medio | Sin constantes duplicadas | Media |
| T11 | EXP-014 | Unificar empty state en `ui/EmptyState`; distinguir error de vacío | `OrbitalModules.tsx:41-47`, `ModuleGrid.tsx:34-42` | — | Bajo | Mismo componente en ambas superficies | Pequeña |
| T12 | EXP-013 | Progreso real en `/learn` | `app/learn/page.tsx:21-22` | — | Medio (añade lectura de datos) | Barra visible con usuario autenticado | Media |
| T12b | EXP-022 | Gestión de foco al rotar la ventana | `OrbitalModules.tsx:74-78,144` | T4 | Bajo | El foco permanece en la región al avanzar | Media |
| T12c | EXP-023 | Sin destello de primera pintada en móvil | `OrbitalModules.tsx:26,33-39` | T10 | Bajo | 1 tarjeta desde el primer render | Media |

### Fase 4 — Accesibilidad y limpieza · P3

| Tarea | Hallazgo | Acción | Archivos | Depende | Riesgo | Verificación | Tamaño |
|---|---|---|---|---|---|---|---|
| T13 | EXP-016a | Anillo de foco de marca en los dots | `OrbitalModules.tsx:188-192` | — | Bajo | `:focus-visible` visible y consistente | Pequeña |
| T14 | EXP-007 | Resolver el arrastre móvil:功能和 coherencia, o eliminarlo | `OrbitalModules.tsx:50,110-125` | T2, T10 | Bajo | Gesto avanza, o `drag` ausente | Media |
| T15 | EXP-016b-e | Limpieza: transición duplicada, fallback XP muerto, `1360px`, `CARD_W` | varios | T10 | Bajo | Diff acotado | Pequeña |
| T15b | EXP-024 | `aria-hidden` en el icono Compass | `app/learn/page.tsx:37` | — | Bajo | Fuera del árbol de accesibilidad | Pequeña |

### Fase 5 — Cierre

- T16: `npm run type-check` + `npm run build` (gates reales del repo; `npm run lint` está roto por diseño).
- T17: re-captura de los 3 viewports + re-ejecución de los probes de geometría, tabulación y contraste.
- T18: recorrido manual de `/learn`, `/proyectos` y `/laboratorios` para confirmar ausencia de regresiones.

**Secuencia mínima de valor:** T1 + T2 + T3 (Fase 1) ya corrige el 80% de lo que un usuario sufre hoy.

---

## 5. Riesgos transversales

1. **`CardPrimitives.tsx` es el punto de的话说 regresión**: lo consume sólo `ModuleCard`, pero `ModuleCard`
   aparece en `/proyectos`, `/laboratorios/explorer` y `/preview/cards`. T3 y T9 deben probarse ahí.
2. **El texto de la Lesson/Hero/etc. está fuera de alcance**; si T1 cambia el ancho de la pista, verificar
   que no afecte la alineación de las secciones vecinas.
3. **DESIGN.md está desactualizado** respecto de `globals.css`. Cualquier tarea que "alinee con el design
   system" necesita primero decidir cuál de los dos es la fuente de verdad — decisión de producto, no de auditoría.

## 6. Pendiente de verificación

| Ítem | Por qué |
|---|---|
| Arrastre con **touch real** (EXP-007) | El gesto fue sintetizado con eventos de puntero de escritorio. |
| `/learn` con **usuario autenticado** real | La ruta redirige a `/sign-in` sin sesión; el comportamiento con progreso (EXP-013) no se observó en runtime. |
| Lectores de pantalla reales (NVDA/VoiceOver) | Se verificó la capa ARIA computada, no la announcements real. |
| `prefers-reduced-motion` en dispositivo | Verificado `false` en headless; el camino `true` no se ejecutó. |
| Destello de primera pintada en móvil (EXP-023) | Mecanismo confirmado por código; falta medirlo con CPU limitado. |
| Contraste en **modo oscuro** | `/learn` corre bajo `.dark` (`globals.css:103-112`); todos los ratios calculados son de modo claro. |
| Click accidental tras arrastre (EXP-007) | Motion podría suprimir el clic del enlace envuelto, pero no hay código de arbitraje en el archivo; sin comportamiento real no se afirma. |
| Alcanzabilidad de `len === 0` (EXP-017) | El defecto es confirmado por lectura; falta comprobar si elFS de contenido puede llegar a fallar en producción. |
| Destino del foco al desmontarse una tarjeta (EXP-022) | Inferido por ausencia de gestión de foco; falta observar el `activeElement` real. |
| Anuncio real en lectores de pantalla | Se verificó la capa ARIA computada, no la locución. |
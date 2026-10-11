# DESIGN.md — InVitro-Code

Plataforma de aprendizaje interactivo de IA/ML para estudiantes de biotecnología.
Estilo visual: **Laboratorio Digital** — limpio, técnico, con identidad propia.

---

## 1. Sistema de Diseño

### 1.1 Paleta de Colores

Paleta vigente: **"scientific gradient"**, declarada en `src/app/globals.css:14-37` (bloque `@theme`).
La escala `brand-*` va de `950` (más oscuro) a `300` (más claro) y varios colores con nombre propio
son **alias** de un paso de esa escala, no valores independientes.

| Token               | Valor                     | Uso                                                                                |
| ------------------- | ------------------------- | ---------------------------------------------------------------------------------- |
| `ink`               | `#000000`                 | Texto principal y fondos oscuros (`bg-surface text-ink`, `InVitroShell.tsx:50`)    |
| `graphite`          | `#2a272a`                 | Textos fuertes, superficies oscuras                                                |
| `brand-950`         | `#22005A`                 | Extremo oscuro de la escala; base de `--color-comic-bg` (`globals.css:80`)          |
| `brand-800`         | `#00388C`                 | Segundo paso de la escala; base de `--color-comic-border` (`globals.css:81`)        |
| `brand-600`         | `#0063AE`                 | Label del hablante en `DialogueBox` (`DialogueBox.tsx:267`)                         |
| `brand-500`         | `#008DBF`                 | Dot activo del carrusel (`lesson-carousel.tsx:271`); base de `fog`                  |
| `brand-400`         | `#00B5C5`                 | Anillo de focus (`.focus-ring`, `globals.css:709`); base de `mint`                  |
| `brand-300`         | `#45DCC6`                 | Extremo claro de la escala; base de `--color-comic-accent` (`globals.css:83`)       |
| `slate`             | `var(--color-brand-800)` | **ALIAS** de `brand-800` — no es un valor propio (`globals.css:22`)                 |
| `storm`             | `#677381`                 | Texto terciario; `.eyebrow` (`globals.css:279`), "Diapositiva N de M" (`lesson-carousel.tsx:210`) |
| `fog`               | `var(--color-brand-500)`  | **ALIAS** de `brand-500` (`globals.css:24`); gradientes `.xp-gradient`/`.progress-gradient` (`globals.css:331,335`) |
| `mint`              | `var(--color-brand-400)`  | **ALIAS** de `brand-400` (`globals.css:25`); `.sidebar-active` (`globals.css:339`), `.skip-to-content` (`globals.css:782`) |
| `surface`           | `#FFFFFF`                 | Fondo principal de páginas y del shell fullscreen (`InVitroShell.tsx:50`, `lesson-carousel.tsx:205`) |
| `surface-card`      | `#ffffff`                 | Cards, header/footer del carrusel (`lesson-carousel.tsx:208,251`), burbuja de diálogo (`DialogueBox.tsx:260`) |
| `surface-raised`    | `#e8ecf0`                 | Bordes y separadores (`outline-variant`), dot pendiente del carrusel (`lesson-carousel.tsx:274`) |
| `on-surface`        | `var(--color-ink)`       | **ALIAS** de `ink` (`globals.css:31`)                                              |
| `on-surface-variant`| `var(--color-storm)`     | **ALIAS** de `storm` (`globals.css:32`)                                            |
| `outline`           | `var(--color-storm)`     | **ALIAS** de `storm` (`globals.css:33`)                                            |
| `outline-variant`   | `var(--color-surface-raised)` | **ALIAS** de `surface-raised` (`globals.css:34`); borde de header/footer del carrusel (`lesson-carousel.tsx:208,251`) |
| `on-primary`        | `var(--color-ink)`       | **ALIAS** de `ink` (`globals.css:35`)                                              |
| `error`             | `#ba1a1a`                 | Mensajes de error del carrusel (`lesson-carousel.tsx:244`)                          |
| `success`           | `#10b981`                 | Dots de diapositivas ya visitadas (`lesson-carousel.tsx:273`)                      |

**Alias (no llevan valor propio):** `slate`, `fog`, `mint`, `on-surface`, `on-surface-variant`,
`outline`, `outline-variant`, `on-primary`. Cambiar el hex en un paso de la escala
(por ejemplo `--color-brand-400` en `globals.css:20`) mueve todos los alias que apuntan a él.

**Reglas de uso:**
- `ink` solo para texto de mayor jerarquía y fondos de terminal
- `mint` es el color de acento vivo — CTAs secundarios, indicadores de éxito, progreso activo
- `fog` para elementos interactivos secundarios y badges de estado
- `storm` para texto de soporte, nunca para texto principal
- `graphite` para la sidebar y barras de herramientas oscuras

**Modo oscuro (`.dark`)**: `src/app/globals.css:103-112` redefine `--color-surface` (`#0f0f0f`),
`--color-surface-card` (`#1a1a1a`), `--color-surface-raised` (`#2a2a2a`), `--color-ink` y
`--color-on-surface` (`#e0e0e0`), `--color-on-surface-variant` (`#9ca3af`), `--color-comic-bg`
(`#0a1628`) y `--color-hud-bg` (`rgba(10, 22, 40, 0.9)`). Los alias (`mint`, `fog`, `slate`, …)
no se tocan, así que el modo oscuro solo cambia superficies y texto. La clase `dark` la aplica
`InVitroShell` sobre `document.documentElement` (`src/components/layout/InVitroShell.tsx:31-40`)
según el `theme` del perfil; el valor `"system"` resuelve con `prefers-color-scheme`.

**Valores anteriores (ya NO canónicos):** `mint #a3cfcd`, `fog #82a0aa` y `surface #f4f6f8`
pertenecen a la paleta previa y **no** corresponden al `@theme` actual. Hoy solo sobreviven como
literales hardcodeados fuera del set de tokens (ver §1.6). Para el CSS canónico usar §6.

### 1.2 Tipografía

| Rol         | Fuente          | Pesos                        | Uso                              |
| ----------- | --------------- | ---------------------------- | -------------------------------- |
| Display     | **Space Grotesk** | 500, 600, 700                | Títulos de página, hero, h1-h2   |
| Body        | **Inter**         | 400, 500, 600                | Párrafos, UI, formularios       |
| Mono        | **JetBrains Mono** | 400, 600                     | Código, terminales, eyebrows     |

**Escala de tipo:**

```
hero:      3.5rem / 1.1  (56px)   — Space Grotesk 700
h1:        2.25rem / 1.2  (36px)  — Space Grotesk 700
h2:        1.75rem / 1.25 (28px)  — Space Grotesk 600
h3:        1.25rem / 1.3  (20px)  — Space Grotesk 600
body-lg:   1.125rem / 1.6 (18px)  — Inter 400
body:      1rem / 1.6      (16px) — Inter 400
body-sm:   0.875rem / 1.5 (14px)  — Inter 400
caption:   0.75rem / 1.4  (12px)  — Inter 500
eyebrow:   0.6875rem / 1.4 (11px) — JetBrains Mono 600, uppercase, tracking-wide
```

### 1.3 Espaciado y Layout

```
--space-xs:   4px
--space-sm:   8px
--space-md:   16px
--space-lg:   24px
--space-xl:   32px
--space-2xl:  48px
--space-3xl:  64px

--radius-sm:  6px
--radius-md:  10px
--radius-lg:  16px
--radius-xl:  24px
--radius-full: 9999px

--width-layout:     1280px
--width-content:    920px
--sidebar-width:    280px
--sidebar-collapsed: 72px
```

### 1.4 Sombras y Elevación

```
shadow-sm:   0 1px 2px rgba(0,0,0,0.05)
shadow-md:   0 4px 12px rgba(0,0,0,0.08)
shadow-lg:   0 8px 24px rgba(0,0,0,0.12)
shadow-glow: 0 0 20px rgba(163,207,205,0.3)   /* mint glow */
```

### 1.5 Animaciones

- **Reduced motion**: siempre respetar `prefers-reduced-motion: reduce`
- **Transiciones**: 200-300ms ease-out para hover, focus, cambio de estado
- **Page transitions**: fade-in sutil (opacity 0→1, 200ms)
- **Terminal typing**: character-by-character con cursor blink
- **Scroll reveals**: elementos aparecen al scroll ( translateY 12px→0, opacity 0→1 )
- **Skeleton loading**: pulse animation para estados de carga

### 1.6 Excepción local conocida: familia teal de Expediciones

Una sola zona del producto trabaja con una familia teal **fuera del set de tokens** de §1.1: la
sección **Expediciones** de la landing y las cards de módulo. Los valores están hardcodeados
como Tailwind arbitrary values en los componentes; ninguno está declarado en `@theme`.

| Rol                  | Valor      | Dónde (referencia)                                                                                              |
| -------------------- | ---------- | -------------------------------------------------------------------------------------------------------------- |
| Acento / iconos      | `#0AAE9A`  | `Modules.tsx:66`, `OrbitalModules.tsx:94,171,190`, `CardPrimitives.tsx:79,89`                                    |
| Fondo teal suave     | `#DDF5EF`  | `Modules.tsx:30,34,44,57`, `OrbitalModules.tsx:191`                                                              |
| Borde teal           | `#DCEAE8`  | `OrbitalModules.tsx:191`, `CardPrimitives.tsx:78,88`                                                             |
| Fondo verde agua     | `#F0F9F7`  | `CardPrimitives.tsx:78,88`                                                                                       |
| Fondo de sección     | `#F8FBFA`  | `Modules.tsx:25`                                                                                                 |
| Texto principal      | `#101B3D`  | `Modules.tsx:69`, `MissionDendrogram.tsx:216`                                                                    |
| Texto secundario     | `#668094`  | `Modules.tsx:72`, `MissionDendrogram.tsx:219`                                                                    |

Archivos: `src/components/landing/Modules.tsx`, `src/components/landing/OrbitalModules.tsx`,
`src/components/landing/MissionDendrogram.tsx` y `src/components/modules/CardPrimitives.tsx`.

- Son **7 valores fuera del set de tokens**: `#0AAE9A`, `#DDF5EF`, `#DCEAE8`, `#F0F9F7`,
  `#F8FBFA`, `#101B3D`, `#668094`. No tienen alias ni entrada en `@theme`.
- Queda registrado como **drift conocido, pendiente de tokenizar**. Este documento describe el
  estado actual; no propone ni ordena ningún cambio de paleta.

---

## 2. Arquitectura de Componentes

### 2.1 Layout Shell

```
┌─────────────────────────────────────────────────┐
│  InVitroShell                                    │
│  ┌──────────┬──────────────────────────────────┐ │
│  │          │  InVitroTopBar                    │ │
│  │ AppSide  │──────────────────────────────────│ │
│  │ bar      │                                   │ │
│  │          │  <main> children                  │ │
│  │ [nav]    │                                   │ │
│  │ [user]   │                                   │ │
│  │          │                                   │ │
│  └──────────┴──────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

- **AppSidebar**: navegación principal, colapsable, mobile drawer
- **InVitroTopBar**: XP, racha, breadcrumb — sticky top
- **InVitroShell**: wrapper que orquesta sidebar + main

### 2.2 Componentes UI

| Componente      | Archivo                          | Descripción                           |
| --------------- | -------------------------------- | ------------------------------------- |
| `PageShell`     | `src/components/ui/PageShell.tsx` | Contenedor de página con max-width    |
| `Button`        | `src/components/ui/Button.tsx`    | Botones primario/secundario/ghost     |
| `Card`          | `src/components/ui/Card.tsx`      | Card genérica con glass effect        |
| `Callout`       | `src/components/ui/Callout.tsx`   | Box de información/nota               |
| `EmptyState`    | `src/components/ui/EmptyState.tsx` | Estado vacío con icono y CTA          |
| `SiteHeader`    | `src/components/ui/SiteHeader.tsx` | Header público (landing/auth)         |

### 2.3 Componentes de Gamificación

| Componente       | Archivo                                  | Descripción                     |
| ---------------- | ---------------------------------------- | ------------------------------- |
| `XPBar`          | `src/components/gamification/XPBar.tsx`          | Barra de progreso de XP         |
| `StreakBadge`    | `src/components/gamification/StreakBadge.tsx`    | Badge de racha diaria           |
| `LevelBadge`     | `src/components/gamification/LevelBadge.tsx`     | Badge de nivel actual           |
| `ModuleProgress` | `src/components/gamification/ModuleProgress.tsx` | Progreso por módulo             |
| `AchievementCard`| `src/components/gamification/AchievementCard.tsx`| Card de logro desbloqueado      |

### 2.4 Componentes de Lección

| Componente          | Archivo                                      | Descripción                       |
| ------------------- | -------------------------------------------- | --------------------------------- |
| `LessonCarousel`    | `src/components/lesson/lesson-carousel.tsx`        | Carrusel de secciones de lección  |
| `Section`           | `src/components/lesson/section.tsx`                 | Sección de contenido              |
| `ConceptCard`       | `src/components/lesson/concept-card.tsx`            | Tarjeta de concepto               |
| `CodeBlock`         | `src/components/lesson/code-block.tsx`              | Bloque de código con syntax HL    |
| `CalloutInfo`       | `src/components/lesson/callout-info.tsx`            | Nota informativa                  |
| `CalloutCheck`      | `src/components/lesson/callout-check.tsx`           | Check de verificación             |
| `AnswerReveal`      | `src/components/lesson/answer-reveal.tsx`           | Respuesta oculta que se revela    |
| `ReflectionCheck`   | `src/components/lesson/reflection-check.tsx`        | Prompt de reflexión               |
| `MascotMessage`     | `src/components/lesson/mascot-message.tsx`          | Mensaje de la mascota/mascota     |
| `Badge`             | `src/components/lesson/badge.tsx`                   | Badge de logro inline             |
| `CelebrationOverlay`| `src/components/lesson/celebration-overlay.tsx`     | Overlay de celebración            |
| `ComparisonTable`   | `src/components/lesson/comparison-table.tsx`        | Tabla comparativa                 |
| `InteractiveTable`  | `src/components/lesson/interactive-table.tsx`       | Tabla interactiva                 |
| `MarkdownTable`     | `src/components/lesson/markdown-table.tsx`          | Tabla desde markdown              |
| `LabProgress`       | `src/components/lesson/lab-progress.tsx`            | Indicador de progreso de lab      |

### 2.5 Capa de Presentación de Lección

Capa que reemplaza la lectura lineal por un shell fullscreen tipo presentación. Vive en
`src/components/lesson/` (más `src/components/anymotion/` para las animaciones) y se selecciona
desde MDX por nombre de tag, sin tipo de dato intermedio (ver "Modelo de autoría" más abajo).

| Componente      | Archivo                                                            | Descripción                                 |
| --------------- | ------------------------------------------------------------------ | ------------------------------------------- |
| `LessonCarousel` | `src/components/lesson/lesson-carousel.tsx`                       | Shell fullscreen: navegación entre slides   |
| `DialogueBox`   | `src/components/lesson/presentation/DialogueBox.tsx`               | Burbuja de diálogo estilo novela visual     |
| `RevealSequence`| `src/components/lesson/presentation/RevealSequence.tsx`             | Reveal progresivo por pasos                 |
| `ChoiceQuestion`| `src/components/lesson/presentation/ChoiceQuestion.tsx`             | Pregunta de opción múltiple formativa       |
| `QuizButton`    | `src/components/lesson/presentation/QuizButton.tsx`                 | Opción individual del radiogroup            |
| `FeatureButtonList` | `src/components/lesson/presentation/FeatureButtonList.tsx`       | Acordeón de features                        |
| `ConidiaToVector` | `src/components/anymotion/animations/ConidiaToVectorPlayer.tsx`   | Animación SVG inline con timeline           |
| `FeatureSpace2D` | `src/components/anymotion/animations/FeatureSpace2DPlayer.tsx`     | Animación SVG inline con timeline           |
| `BrainVsChip`   | `src/components/anymotion/animations/BrainVsChipPlayer.tsx`         | Animación DOM + keyframes inyectados        |
| `MatrixAnim`    | `src/components/anymotion/animations/MatrixPlayer.tsx`              | Animación DOM + keyframes inyectados        |
| `InteractiveFrame` | `src/components/lesson/interactive-frame.tsx`                    | `<iframe>` a HTML servido desde `public/`   |

#### Shell fullscreen (`LessonCarousel`)

- **Geometría**: `fixed inset-y-0 right-0 z-30 lg:left-[var(--sidebar-offset)]`
  (`lesson-carousel.tsx:205`). Ocupa el alto completo y arranca a la izquierda en el offset de
  sidebar. `--sidebar-offset` vale `0px` por defecto (`globals.css:7`) y lo setea
  `src/components/learn/Sidebar.tsx:76`.
- **No es la Fullscreen API nativa**: es un overlay fijo. `Escape` es un no-op explícito
  (`lesson-carousel.tsx:183-185`).
- **Zonas de click**: sobre el área de slide, si `x < midX` va atrás (`goPrev`); si `x >= midX`
  va adelante (`goNext`), salvo que sea la última. `midX` se calcula del
  `getBoundingClientRect()` del área, con fallback a `window.innerWidth / 2`
  (`lesson-carousel.tsx:100-111`). Un click sobre
  `button,input,textarea,select,iframe,a,[data-no-advance],[data-interactive]` no navega
  (`lesson-carousel.tsx:94-99`).
- **Teclado** (listener sobre `window`, `lesson-carousel.tsx:116-193`):
  - Avanzan: `ArrowRight`, `Espacio`, `Spacebar`, `Enter`
  - Retroceden: `ArrowLeft`; `Home` → primera slide, `End` → última
  - No-ops: `Escape` y cualquier otra tecla
  - Todo queda bloqueado mientras `isRevealIncomplete` sea `true`, o mientras el foco esté en
    `input,textarea,select,[contenteditable='true']`
  - Si el foco está sobre un `BUTTON`, `Enter`/`Espacio` no se interceptan: el botón ya actúa
    (`lesson-carousel.tsx:153-154`)
  - En la última slide ninguna tecla finaliza la lección; hay que apretar "Finalizar"
    (`lesson-carousel.tsx:145-147`)
- **Chrome**: header con `<LabProgress total current>` (`lesson-carousel.tsx:209`) y
  `"<lessonTitle> — Diapositiva N de M"` (`lesson-carousel.tsx:211`); footer con `← Atrás`,
  dots + contador `N / M`, y `Continuar →` o `Finalizar` (`lesson-carousel.tsx:251-318`). Los
  dots se ocultan bajo `sm` y pintan: activo `bg-brand-500`, ya visitado `bg-success`, pendiente
  `bg-surface-raised` (`lesson-carousel.tsx:271-274`). Hay una live region `sr-only`
  "Diapositiva N de M" (`lesson-carousel.tsx:321-323`).
  - `LabProgress` (`src/components/lesson/lab-progress.tsx:13-19`) pinta sus pozos con Tailwind
    hardcodeado (`bg-teal-500`, `bg-blue-600`), no con tokens de §1.1.
- **`MutationObserver`**: observa el área de slide con `attributes`, `childList` y
  `attributeFilter: ["data-reveal-has-more"]` (`lesson-carousel.tsx:63-69`). Si existe algún
  `[data-reveal-has-more="true"]`, `isRevealIncomplete` pasa a `true` y "Continuar" y
  "Finalizar" se deshabilitan (`disabled` + `aria-disabled` + `title="Completa el contenido para
  continuar"`, `lesson-carousel.tsx:289-296` y `:305-313`). El chequeo inicial corre en
  `requestAnimationFrame` y con un `setTimeout` de 60 ms (`lesson-carousel.tsx:54-55`).
- Cada slide entra con `motion-safe:animate-[reveal-up_250ms_ease-out]`
  (`lesson-carousel.tsx:227`) y el área hace scroll al top al cambiar de slide
  (`lesson-carousel.tsx:42-44`).

#### Reveal progresivo (`RevealSequence`)

Props (`RevealSequence.tsx:50-63`): `children`, `blockOnQuiz` (default `false`), `blocked`,
`onComplete`, `startRevealed`, `mode` (`"stack" | "appear"`, default `appear`), `showHistory`
(default `false`).

- **`appear`** (default) muestra solo el paso actual centrado; con `showHistory` mantiene los
  pasos previos atenuados (`opacity-60`) y marca el actual con `aria-hidden`. **`stack`** apila
  todos los pasos revelados en vertical (`RevealSequence.tsx:308-318` y `:400-414`).
- **"Paso x de y"**: `Paso {revealedCount} de {total}`, más una live region `sr-only`
  (`RevealSequence.tsx:423,495,514` y `:520-523`).
- **Atributos expuestos**: `data-reveal-has-more="true|false"` y `data-reveal-mode={mode}`
  (`RevealSequence.tsx:341-342`). El primero es el que lee el `MutationObserver` del carrusel.
- **Pasos iniciales**: `startRevealed`; si no se pasa, 1 (o 0 si `total` es 0). `0` deja todo
  oculto hasta el primer click (`RevealSequence.tsx:83-86`).
- **Click**: `closest("button,input,textarea,select,iframe,a,[data-no-advance]")` bloquea el
  avance, con excepción de `[data-reveal-continue]` y `[data-reveal-back]`
  (`RevealSequence.tsx:226-243`). Mitad izquierda → `goPrev()` (nunca baja de
  `initialRevealed`), mitad derecha → `advance()` (`RevealSequence.tsx:244-253`).
- **Teclado**: maneja **solo `ArrowLeft`** para retroceder, con `preventDefault()` +
  `stopPropagation()` (`RevealSequence.tsx:258-267`). No maneja `ArrowRight` ni `Espacio`.
- **Tip de onboarding**: banner "Tip: click a la derecha → Continuar, a la izquierda ← Atrás (o
  usa flechas)", se descarta a los 5 s o con el botón "Entendido", y la persistencia va a
  `localStorage["reveal-hint-dismissed"]` (`RevealSequence.tsx:104-123` y `:426-443`).
- **Ghost arrows**: flechas `←`/`→` fantasma con `opacity-20`, que aparecen según el hover caiga
  en el 30 % o el 70 % del ancho del contenedor (`RevealSequence.tsx:125-134` y `:346-361`).
- **Bloqueo por quiz**: contexto `RevealQuizContext` + hook `useRevealQuizBlock()`. Cuando un
  hijo llama `setBlocked(true)` se muestra "Responde correctamente para continuar"
  (`RevealSequence.tsx:20-42` y `:444-451`). Además hay auto-detección del atributo
  `[data-quiz-blocked="true"]` en el árbol React visible y por `querySelector` en el contenedor
  cuando `blockOnQuiz` está activo (`RevealSequence.tsx:153-179` y `:280-290`).
- El estado efectivo es `blockedProp || isQuizBlocked || reactTreeBlocked || domBlocked`
  (`RevealSequence.tsx:188`) y `onComplete` se dispara una sola vez al revelar todo
  (`RevealSequence.tsx:209-218`).

#### Burbuja de diálogo (`DialogueBox`)

Props (`DialogueBox.tsx:109-119`): `speaker`, `variant` (`"scientist" | "coni"`, default
`scientist`), `mood` (`"neutral" | "thinking" | "celebrating"`, default `neutral`), `lines`,
`children`, `onNext`, `typing` (default `false`), `typingSpeed` (default `35`), `showContinue`.

- **Dos avatares SVG**: `ScientistAvatar` ("Dra. Coni", `viewBox 0 0 44 44`) y `ConiAvatar`
  ("Coni la conidia", `viewBox 0 0 40 40`) (`DialogueBox.tsx:46-103` y `:9-44`). El `mood`
  mueve pupilas, boca y burbujas de pensamiento.
- **Hablante**: `speaker ?? (variant === "scientist" ? "Dra. Coni" : "Coni")`
  (`DialogueBox.tsx:132`), renderizado como label mono uppercase `text-brand-600`
  (`DialogueBox.tsx:267`).
- **Cola**: cuadrado `h-3 w-3 rotate-45` en `absolute left-[-6px] top-5`, con `border-b border-l`
  y fondo `var(--color-outline-variant, #e8ecf0)`; la sombra vive en `.dialogue-tail`
  (`globals.css:793-796`).
- **Burbuja**: `rounded-[16px]` (coincide con `--radius-bubble`, `globals.css:99`), fondo
  `bg-surface-card`, borde `--color-outline-variant` y sombra `--color-bubble-glow`
  (`DialogueBox.tsx:259-265`).
- **Typewriter**: con `typing && !prefersReduced && lines`, revela `activeText.slice(0, typedLen)`
  de a un carácter cada `typingSpeed` ms (`DialogueBox.tsx:164-175`). El caret usa
  `@keyframes dialogue-caret` (`globals.css:798-801`) y se oculta con `motion-reduce:hidden`.
  `prefers-reduced-motion` se lee con `matchMedia` (`DialogueBox.tsx:140-146`).
- **Contador `n/m`**: `{lineIndex + 1} / {lines.length}`, solo si `lines.length > 1`
  (`DialogueBox.tsx:291-294`).
- **"Continuar"**: se muestra si `showContinue ?? Boolean(onNext)` (`DialogueBox.tsx:187` y
  `:299`). El click en el contenedor, `Enter` o `Espacio` llaman `handleAdvance`: si está
  tipeando completa el texto al instante; si hay más líneas avanza de línea; en la última llama
  `onNext` (`DialogueBox.tsx:189-229`). El botón lleva `stopPropagation` para no duplicar el
  avance.
- **Accesibilidad**: `role="region"`, `aria-live="polite"` y
  `aria-label={"Diálogo de " + resolvedSpeaker}` (`DialogueBox.tsx:235-239`).
- **Estado actual del uso**: el único uso en el contenido pasa `children` sin `lines` ni `onNext`
  (`src/content/modules/ia/lessons/lesson01_what_is_ai/lesson.md:26-28`). Por lo tanto
  `hasLines` es `false`, `activeText` es `null` y `canInteract` es `false`, así que el
  **typewriter, el contador `n/m`, el botón "Continuar" y el auto-avance están inertes**: solo se
  renderizan avatar, cola y `children` (`DialogueBox.tsx:149-151`, `:231` y `:284-286`). Se
  documenta como estado actual del contenido, no como el comportamiento esperado del componente.

#### Evaluación formativa preestablecida (`ChoiceQuestion` + `QuizButton`)

Props de `ChoiceQuestion` (`ChoiceQuestion.tsx:9-20`): `question`, `options: QuizOption[]`,
`explanation`, `hint`, `blockId`, `moduleSlug`, `lessonSlug`, `onCorrect`, `mode` (solo
`"single"`; queda reservado y se descarta con `void mode` en `ChoiceQuestion.tsx:34-35`) y
`allowContinueOnIncorrect` (default `false`).

- **Radiogroup**: `role="radiogroup"` con `aria-label={question}` (`ChoiceQuestion.tsx:165-169`);
  cada opción es un `QuizButton` con `role="radio"`, `aria-checked`, `aria-label` y
  `data-no-advance` (`QuizButton.tsx:89-101`).
- **Estados de opción** (`QuizButton.tsx:31-78`): seleccionada sin revelar
  `border-brand-300 bg-brand-50`; seleccionada y correcta verde; seleccionada e incorrecta roja;
  no seleccionada y correcta verde atenuado (muestra la respuesta); resto atenuada.
- **Hint anti-spoiler**: tras el primer fallo (`attemptCount >= 1`) y sin respuesta correcta,
  `showHoverHint` cambia solo los estilos de hover: la opción correcta se pone verde **solo al
  pasar el mouse** (`QuizButton.tsx:59-67` y `:70-73`) en lugar de revelarse de entrada.
- **Pista en texto**: tras un fallo se muestra `hint`, o la primera oración de `explanation` si no
  hay `hint` (`ChoiceQuestion.tsx:54-64` y `:224-232`).
- **Feedback**: "¡Correcto!" o "No es correcto, intenta entender por qué", más el `feedback` de la
  opción, la `explanation` y "Probá otra opción para continuar." (`ChoiceQuestion.tsx:195-222`).
- **Bloqueo**: `blocked = !revealed || (!allowContinueOnIncorrect && !isCorrect)`
  (`ChoiceQuestion.tsx:67-71`), se reporta al `RevealSequence` vía `useRevealQuizBlock`
  (`ChoiceQuestion.tsx:73-76`) y además se expone como atributo `data-quiz-blocked`
  (`ChoiceQuestion.tsx:158`) para la auto-detección del `RevealSequence`.
- **Persistencia fire-and-forget**: si hay `blockId`, `moduleSlug` y `lessonSlug`, hace
  `POST /api/v1/progress/reflection` con `{moduleSlug, lessonSlug, blockId}`
  (`ChoiceQuestion.tsx:108-135`). Esa ruta la sirve el backend FastAPI en
  `backend/app/routers/progress.py:120` (`@router.post("/api/v1/progress/reflection")`); **no**
  existe un route handler de Next para ella. El POST no bloquea el feedback visual: solo setea
  `submitting` y expone errores (`ChoiceQuestion.tsx:110-134` y `:183-193`). El router se monta
  condicionalmente con `is_migrated("progress")` (`backend/app/main.py:65-66`).

#### Acordeón (`FeatureButtonList`)

Props (`FeatureButtonList.tsx:5-8`): `features: Array<{ id: string; label: string; detail: string }>`.

- Un solo panel abierto a la vez: `expanded: string | null`, y re-clickear el abierto lo cierra
  (`FeatureButtonList.tsx:10` y `:21`). No hay prop para abrir uno por defecto.
- **a11y**: `role="list"` / `role="listitem"`, y el botón lleva `aria-expanded` +
  `aria-controls={panelId}` (`FeatureButtonList.tsx:13-24`).
- **Panel**: `.accordion-panel` con `data-open`, animado por
  `grid-template-rows: 0fr → 1fr` (`globals.css:761-773`).
- No recibe `moduleSlug`/`lessonSlug`: **no persiste progreso**.

#### Animaciones (Anymotion)

Selección por nombre de tag MDX. El map `components` de
`src/app/learn/[module]/[slug]/page.tsx:171-174` asigna `BrainVsChip` → `BrainVsChipPlayer`,
`MatrixAnim` → `MatrixPlayer`, `ConidiaToVector` → `ConidiaToVectorPlayer` y `FeatureSpace2D` →
`FeatureSpace2DPlayer`. Los cuatro también se re-exportan desde `src/components/lesson/index.ts:27-30`.

| Tag MDX         | Componente              | Implementación                                        | Duración                            |
| --------------- | ----------------------- | ----------------------------------------------------- | ----------------------------------- |
| `ConidiaToVector` | `ConidiaToVectorPlayer` | SVG inline (`viewBox 0 0 800 450`) vía `useAnymotionTimeline` | 2.5 s (`ConidiaToVectorPlayer.tsx:25`) |
| `FeatureSpace2D` | `FeatureSpace2DPlayer`  | SVG inline (`viewBox 0 0 800 450`) vía `useAnymotionTimeline` | 2 s (`FeatureSpace2DPlayer.tsx:43`)   |
| `BrainVsChip`   | `BrainVsChipPlayer`    | DOM (`lucide-react` `Brain`/`Cpu`) + `<style>` con keyframes inyectados | No declarada en el fuente |
| `MatrixAnim`    | `MatrixPlayer`          | DOM (`lucide-react` `Dna`) + `<style>` con keyframes inyectados  | No declarada en el fuente |

- Las dos SVG usan `useAnymotionTimeline` (`src/components/anymotion/hooks/useAnymotionTimeline.ts`):
  timeline determinístico por `requestAnimationFrame` que expone `progress` 0..1 y
  `play/pause/toggle/seek/reset` (`useAnymotionTimeline.ts:40-134`). El autoplay se controla con
  el prop `autoPlay` (default `true` en ambos players).
- Los dos players DOM declaran `controls` y `autoPlay` en su interfaz pero los ignoran
  (`BrainVsChipPlayer.tsx:6-12`, `MatrixPlayer.tsx:6-10`): se animan al montar y no exponen
  control de reproducción.
- Los cuatro se envuelven en `AnymotionStage` (`src/components/anymotion/AnymotionStage.tsx`):
  stage 16:9 (`aspect-video`) con `role="img"`, `aria-label={title}` y fondo `#0a0a0a`
  (`AnymotionStage.tsx:28`).
- `MatrixPlayer` incluye su propio kill-switch de `prefers-reduced-motion` dentro del `<style>`
  inyectado (`MatrixPlayer.tsx:73`); los players SVG no declaran kill-switch propio.

#### Interactivos embebidos (`InteractiveFrame`)

Props (`interactive-frame.tsx:1-6`): `src`, `height` (default `"650px"`), `caption`.

- Renderiza `<iframe src={src} width="100%" height={height} title={caption ?? src}>` dentro de un
  `rounded-[12px] border-gray-200` (`interactive-frame.tsx:13-21`); el `caption` se muestra como
  pie mono (`interactive-frame.tsx:23-27`).
- Uso desde MDX: `<InteractiveFrame src="/interactives/<archivo>.html" height="700px"
  caption="…" />` (por ejemplo `src/content/modules/ia/lessons/lesson03_ai_in_biotech/lesson.md:74`).
- **Inventario actual de `public/interactives/`**: `demo_01_features.html`, `demo_02_patterns.html`,
  `demo_03_rules.html`, `demo_07_protein_3d.html`, `demo_08_alphafold.html`,
  `demo_09_rentosertib.html`, `demo_10_pipeline.html`, más `assets/plotly-3.0.0.min.js`.
- **Contrato de filename**: el valor de `src` debe coincidir EXACTO con el archivo en disco. Si
  no existe, el iframe queda en blanco: **no se ve un 404**, porque el `<iframe>` responde con su
  propio documento de error. Un `src` mal escrito falla en silencio.
- **Mismatch observado**: `src/content/modules/ia/lessons/lesson02_how_ai_learns/lesson.md:280`
  apunta a `/interactives/demo_06b_overfitting.html`, que no existe en `public/interactives/`. Se
  registra como mismatch observado; este documento no lo corrige.

#### Modelo de autoría

- **Slides = bloques `<Section>`**. `src/app/learn/[module]/[slug]/page.tsx:189-196` parte
  `lesson.md` (sin el H1, `page.tsx:186`) con el lookahead `/(?=<Section )/`, descarta los bloques
  que no empiezan con `<Section`, descarta los que contienen `title="Resumen"`, y reescribe
  `number={n}` de forma consecutiva. Cada bloque se compila por separado con `compileMDX`
  (`page.tsx:199-207`) y se pasa como elemento de `slides` al `LessonCarousel`
  (`page.tsx:218-224`). Si no queda ningún bloque, se usa un fallback con una sola slide
  (`page.tsx:226-235`).
- **Slices = hijos directos de `<RevealSequence>`**: `Children.toArray(children)`
  (`RevealSequence.tsx:78-79`) y `revealedCount` decide cuántos se muestran
  (`allChildren.slice(0, revealedCount)`, `RevealSequence.tsx:145-147`). Los hijos no revelados
  no se renderizan.
- **No hay tipo de dato `Slide` ni frontmatter nuevo.** `src/domain/slide.ts` solo aporta
  `QuizOption` (`slide.ts:4-9`), que es lo que consumen `ChoiceQuestion` y `QuizButton`. También
  declara `QuizQuestion` y `SlideKind` (`slide.ts:11-19`), pero no se importan en la ruta de
  lección.
- Un componente solo se puede usar desde MDX si está en el map `components` de
  `page.tsx:148-180` y exportado desde `src/components/lesson/index.ts`.

#### Cobertura de migración

- **`ia` / `lesson01_what_is_ai`** es la única lección con la capa completa: `DialogueBox` ×1,
  `RevealSequence` ×6, `ChoiceQuestion` ×7, `FeatureButtonList` ×1, `ConidiaToVector` ×1,
  `FeatureSpace2D` ×1.
- **`ia` / `lesson02_how_ai_learns`, `lesson03_ai_in_biotech`, `lesson04_real_cases`** tienen
  preguntas preestablecidas pero no la estructura de slices/diálogo: `ChoiceQuestion` ×13 / ×11 /
  ×12, `RevealSequence` ×1 en cada una, `InteractiveFrame` ×1 en lesson02 y ×2 en lesson03, y
  `DialogueBox`, `FeatureButtonList` y animaciones en 0.
- **`python` (17 lecciones), `estadistica` (10) y `machine-learning` (10)** no usan ninguno de
  estos componentes.

### 2.6 Componentes de Lab

| Componente        | Archivo                                | Descripción                         |
| ----------------- | -------------------------------------- | ----------------------------------- |
| `LabHub`          | `src/components/labs/LabHub.tsx`              | Hub de laboratorios por módulo      |
| `LabCard`         | `src/components/labs/LabCard.tsx`             | Card de laboratorio individual      |
| `LabTabs`         | `src/components/labs/LabTabs.tsx`             | Tabs: Laboratorio / Cuestionario    |
| `LabRunner`       | `src/components/labs/LabRunner.tsx`           | Ejecutor de código en browser       |
| `LabCodeBlock`    | `src/components/labs/LabCodeBlock.tsx`        | Bloque de código editable           |
| `LabHeader`       | `src/components/labs/LabHeader.tsx`           | Header del laboratorio              |
| `LabCallout`      | `src/components/labs/LabCallout.tsx`          | Callout específico de lab           |
| `QuizRunner`      | `src/components/labs/QuizRunner.tsx`          | Runner de cuestionarios             |
| `ReflectionPrompt`| `src/components/labs/ReflectionPrompt.tsx`    | Prompt de reflexión post-lab        |
| `AssignmentViewer`| `src/components/labs/AssignmentViewer.tsx`    | Visor de assignments/proyectos      |
| `NotebookActions` | `src/components/labs/NotebookActions.tsx`     | Acciones de notebook (Colab/download)|

### 2.7 Componentes de Editor

| Componente        | Archivo                              | Descripción                       |
| ----------------- | ------------------------------------ | --------------------------------- |
| `CodeEditor`      | `src/components/editor/CodeEditor.tsx`      | Editor de código (Monaco-like)    |
| `ConsoleFrame`    | `src/components/editor/ConsoleFrame.tsx`    | Frame de consola interactiva      |
| `OutputPanel`     | `src/components/editor/OutputPanel.tsx`     | Panel de salida de código         |
| `PyodideRunner`   | `src/components/editor/PyodideRunner.tsx`   | Runner Python en browser (Pyodide)|
| `VisualizationPanel`| `src/components/editor/VisualizationPanel.tsx`| Panel de visualización/gráficos |

### 2.8 Componentes de Layout

| Componente       | Archivo                                  | Descripción                       |
| ---------------- | ---------------------------------------- | --------------------------------- |
| `AppSidebar`     | `src/components/layout/AppSidebar.tsx`         | Sidebar de navegación principal   |
| `InVitroShell`   | `src/components/layout/InVitroShell.tsx`       | Shell wrapper (sidebar + main)    |
| `InVitroTopBar`  | `src/components/layout/InVitroTopBar.tsx`      | Barra superior con XP y racha     |

---

## 3. Mapa de Rutas y Ventanas

### 3.1 Rutas Públicas

| Ruta                | Archivo                                           | Descripción                    |
| ------------------- | ------------------------------------------------- | ------------------------------ |
| `/`                 | `src/app/page.tsx`                                       | Landing page                   |
| `/sign-in`          | `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx`        | Inicio de sesión (Clerk)       |
| `/learn`            | `src/app/learn/page.tsx`                                 | Índice de módulos (público)    |
| `/learn/[module]/[slug]` | `src/app/learn/[module]/[slug]/page.tsx`            | Lección individual             |

### 3.2 Rutas Autenticadas (Dashboard)

| Ruta                              | Archivo                                                 | Descripción                      |
| --------------------------------- | ------------------------------------------------------- | -------------------------------- |
| `/dashboard`                      | `src/app/(dashboard)/dashboard/page.tsx`                      | Panel principal del usuario      |
| `/laboratorios`                   | `src/app/(dashboard)/laboratorios/page.tsx`                   | Hub de laboratorios              |
| `/laboratorios/[module]/[lesson]` | `src/app/(dashboard)/laboratorios/[module]/[lesson]/page.tsx` | Laboratorio interactivo          |
| `/proyectos`                      | `src/app/(dashboard)/proyectos/page.tsx`                      | Hub de proyectos                 |
| `/proyectos/[module]/[lesson]`    | `src/app/(dashboard)/proyectos/[module]/[lesson]/page.tsx`    | Detalle de proyecto/assignment   |
| `/niveles`                        | `src/app/(dashboard)/niveles/page.tsx`                        | Mapa de niveles y progresión     |
| `/logros`                         | `src/app/(dashboard)/logros/page.tsx`                         | Logros y recompensas semanales   |
| `/comunidad`                      | `src/app/(dashboard)/comunidad/page.tsx`                      | Leaderboard y comunidad          |

---

## 4. Diseño por Ventana

### 4.1 Landing Page (`/`)

**Trabajo**: Convertir visitantes en usuarios registrados.

```
┌─────────────────────────────────────────────────────┐
│ HEADER (sticky)                                     │
│ [Logo InVitro-Code]          [Dashboard] [Comenzar] │
├─────────────────────────────────────────────────────┤
│                                                      │
│  HERO (fondo ink #000000)                           │
│  ┌───────────────────────────┬─────────────────────┐│
│  │                           │                     ││
│  │  eyebrow: "Aprendizaje    │  Terminal typing    ││
│  │           interactivo"    │  python code        ││
│  │                           │  con cursor blink   ││
│  │  h1: Aprende IA y ML      │                     ││
│  │      con Python           │  ┌───────────────┐  ││
│  │                           │  │ $ python      │  ││
│  │  body: Un curso para...   │  │ >>> import... │  ││
│  │                           │  │ >>> print()  │  ││
│  │  [Empezar ahora]          │  │ ML listo      │  ││
│  │  [Ver progreso]           │  └───────────────┘  ││
│  │                           │                     ││
│  └───────────────────────────┴─────────────────────┘│
│                                                      │
├─────────────────────────────────────────────────────┤
│                                                      │
│  MÓDULOS (fondo local #F8FBFA — ver §1.6)        │
│  eyebrow: "Contenido"                               │
│  h2: Expediciones del curso                         │
│                                                      │
│  ┌──────┐  ┌──────┐  ┌──────┐                      │
│  │icon  │  │icon  │  │icon  │  (grid 3 cols)       │
│  │slug  │  │slug  │  │slug  │                      │
│  │title │  │title │  │title │                      │
│  │N lecc│  │N lecc│  │N lecc│                      │
│  │Explorar→│Explorar→│Explorar→│                    │
│  └──────┘  └──────┘  └──────┘                      │
│                                                      │
├─────────────────────────────────────────────────────┤
│ FOOTER                                              │
│ InVitro-Code — Biotecnología + IA    v0.1.0         │
└─────────────────────────────────────────────────────┘
```

**Decisiones de diseño:**
- Hero oscuro (#000000) con terminal typing como elemento signature — muestra el producto real
- Sin fotos stock ni gradientes genéricos
- Mint (= `brand-400`, `#00B5C5`) como acento vivo en CTAs y terminal prompt
- Módulos en grid limpio, cards blancas con borde sutil
- Mobile: hero stacked, terminal debajo del copy

---

### 4.2 Sign-In (`/sign-in`)

**Trabajo**: Acceso rápido, sin distracciones.

```
┌─────────────────────────────────────────────┐
│ HEADER (público)                            │
│ [Logo InVitro-Code]              [Dashboard]│
├─────────────────────────────────────────────┤
│                                              │
│            ┌─────────────────────┐           │
│            │  eyebrow: "Acceso"  │           │
│            │                     │           │
│            │  h1: InVitro-Code   │           │
│            │                     │           │
│            │  ┌───────────────┐  │           │
│            │  │ Clerk SignIn  │  │           │
│            │  │ (email/OAuth) │  │           │
│            │  └───────────────┘  │           │
│            │                     │           │
│            └─────────────────────┘           │
│                                              │
└─────────────────────────────────────────────┘
```

**Decisiones de diseño:**
- Card centrada, fondo surface, bordes redondeados
- Sin hero ni copy — directo al grano
- Clerk maneja la UI del formulario

---

### 4.3 Learn Index (`/learn`)

**Trabajo**: Elegir un módulo para empezar a aprender.

```
┌─────────────────────────────────────────────┐
│ (Sin sidebar — layout propio de learn)      │
├─────────────────────────────────────────────┤
│                                              │
│  eyebrow: "Expediciones"                    │
│  h2: Elige tu Expedición                    │
│  body: Cada módulo es una expedición...     │
│                                    [Compass] │
│  ┌──────┐  ┌──────┐  ┌──────┐              │
│  │icon  │  │icon  │  │icon  │              │
│  │slug  │  │slug  │  │slug  │              │
│  │title │  │title │  │title │              │
│  │N lecc│  │N lecc│  │N lecc│              │
│  │Explorar→│Explorar→│Explorar→│            │
│  └──────┘  └──────┘  └──────┘              │
│                                              │
└─────────────────────────────────────────────┘
```

**Decisiones de diseño:**
- Sin sidebar de dashboard — es una vista de navegación de contenido
- Grid de cards simple, glass-card effect
- Cada card muestra: icono, slug (eyebrow), título, conteo de lecciones

---

### 4.4 Learn Lesson (`/learn/[module]/[slug]`)

**Trabajo**: Leer y completar una lección de contenido.

```
┌─────────────────────────────────────────────┐
│ (Layout learn: sidebar + main)              │
│ ┌────────┬────────────────────────────────┐ │
│ │ Sidebar│  Lección Title                  │ │
│ │ Module │────────────────────────────────│ │
│ │ > Les  │                                │ │
│ │   Les  │  [Carrusel de secciones]        │ │
│ │   Les  │                                │ │
│ │        │  ◄ Sección 1 / 5 ►             │ │
│ │        │                                │ │
│ │        │  Contenido MDX renderizado      │ │
│ │        │  - ConceptCard                  │ │
│ │        │  - CodeBlock                    │ │
│ │        │  - CalloutInfo                  │ │
│ │        │  - MascotMessage                │ │
│ │        │  - ReflectionCheck              │ │
│ │        │                                │ │
│ │        │  [Marcar como completada]       │ │
│ └────────┴────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

**Decisiones de diseño:**
- Sidebar de módulo a la izquierda con lecciones como nav items
- Contenido en carrusel (split por `<Section` blocks en MDX)
- Componentes MDX: concept-card, code-block, callout, mascot-message, reflection-check
- Botón de completar al final de la última sección
- Header sticky con breadcrumb: módulo > lección

---

### 4.5 Dashboard (`/dashboard`)

**Trabajo**: Ver progreso general y continuar desde donde quedaste.

```
┌─────────────────────────────────────────────────────┐
│ InVitroShell                                         │
│ ┌──────────┬───────────────────────────────────────┐│
│ │ Sidebar  │ InVitroTopBar [XP] [racha]            ││
│ │          │───────────────────────────────────────││
│ │ [nav]    │                                       ││
│ │          │  ┌─ Misión Actual ──────────────────┐ ││
│ │          │  │ module: "Python"                 │ ││
│ │          │  │ lesson: "Variables y tipos"      │ ││
│ │          │  │ [Continuar →]                    │ ││
│ │          │  └──────────────────────────────────┘ ││
│ │          │                                       ││
│ │          │  ┌─ XP Total ─┐ ┌─ Racha ─┐         ││
│ │          │  │ 1,250 XP   │ │ 5 días  │         ││
│ │          │  │ [barra]    │ │ [flame] │         ││
│ │          │  └────────────┘ └─────────┘         ││
│ │          │                                       ││
│ │          │  ┌─ Nivel ──────────────────────────┐ ││
│ │          │  │ Nivel 3: Investigador Jr.        │ ││
│ │          │  │ [ring progress] 50%              │ ││
│ │          │  │ XP: 1250 / 2000                  │ ││
│ │          │  └──────────────────────────────────┘ ││
│ │          │                                       ││
│ │          │  ┌─ Progreso por Módulo ────────────┐ ││
│ │          │  │ Python        ████████░░  80%    │ ││
│ │          │  │ ML            ███░░░░░░░  30%    │ ││
│ │          │  │ Biotecnología ░░░░░░░░░░   0%    │ ││
│ │          │  └──────────────────────────────────┘ ││
│ │          │                                       ││
│ │          │  ┌─ Logros Recientes ───────────────┐ ││
│ │          │  │ Primera Leccion   +50 XP          │ ││
│ │          │  │ Racha de 3 dias   +30 XP          │ ││
│ │          │  └──────────────────────────────────┘ ││
│ │          │                                       ││
│ │ [user]   │                                       ││
│ └──────────┴───────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

**Decisiones de diseño:**
- "Misión Actual" como card prominente con CTA directo — reduce fricción
- XP y racha en cards separadas con iconografía clara
- Ring de progreso circular para el nivel actual
- Barras de progreso por módulo con colores diferenciados
- Logros recientes como listas compactas con recompensa XP visible

---

### 4.6 Laboratorios Index (`/laboratorios`)

**Trabajo**: Explorar y acceder a laboratorios interactivos.

```
┌─────────────────────────────────────────────────────┐
│ InVitroShell                                         │
│ ┌──────────┬───────────────────────────────────────┐│
│ │ Sidebar  │ InVitroTopBar [XP] [racha]            ││
│ │          │───────────────────────────────────────││
│ │          │  h1: Laboratorios                     ││
│ │          │  body: Cada módulo tiene lecciones... ││
│ │          │                                       ││
│ │          │  ┌─ Módulo: Python ─────────────────┐ ││
│ │          │  │ ▼ lesson01_variables   Compl.     │ ││
│ │          │  │   lesson02_listas      ○ Pend.   │ ││
│ │          │  │   lesson03_funciones   ○ Pend.   │ ││
│ │          │  └──────────────────────────────────┘ ││
│ │          │                                       ││
│ │          │  ┌─ Módulo: Machine Learning ───────┐ ││
│ │          │  │ ▼ lesson01_intro_ml    ○ Pend.   │ ││
│ │          │  │   lesson02_regresion   ○ Pend.   │ ││
│ │          │  └──────────────────────────────────┘ ││
│ │          │                                       ││
│ └──────────┴───────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

**Decisiones de diseño:**
- Lista agrupada por módulo con headers colapsables
- Cada lección muestra: título, estado (completado/pendiente), dificultad
- Check verde para completados, círculo vacío para pendientes
- LabCard individual con badge de dificultad (Principiante/Intermedio/Avanzado)

---

### 4.7 Laboratorio Interactivo (`/laboratorios/[module]/[lesson]`)

**Trabajo**: Ejercutar código Python en el navegador y aprender haciendo.

```
┌─────────────────────────────────────────────────────┐
│ InVitroShell                                         │
│ ┌──────────┬───────────────────────────────────────┐│
│ │ Sidebar  │ InVitroTopBar                          ││
│ │          │───────────────────────────────────────││
│ │          │  LabHeader: "Lección 1: Variables"    ││
│ │          │                                       ││
│ │          │  [Laboratorio] [Cuestionario] [Notebook]│
│ │          │───────────────────────────────────────││
│ │          │                                       ││
│ │          │  ┌─ Instrucciones MDX ──────────────┐ ││
│ │          │  │ Contenido del lab (LabCallout,   │ ││
│ │          │  │ LabCodeBlock, ReflectionPrompt)  │ ││
│ │          │  └──────────────────────────────────┘ ││
│ │          │                                       ││
│ │          │  ┌─ Consola Interactiva ────────────┐ ││
│ │          │  │ ┌─────────┬────────────────────┐ │ ││
│ │          │  │ │ Editor  │   Output Panel     │ │ ││
│ │          │  │ │ (code)  │   (resultados)     │ │ ││
│ │          │  │ │         │                    │ │ ││
│ │          │  │ │ [Ejecutar]                   │ │ ││
│ │          │  │ └─────────┴────────────────────┘ │ ││
│ │          │  └──────────────────────────────────┘ ││
│ │          │                                       ││
│ │          │  [Marcar como completada]              ││
│ └──────────┴───────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

**Decisiones de diseño:**
- Layout split: instrucciones arriba, consola abajo
- Consola divide horizontalmente: editor (izq) + output (der)
- Tabs superiores: Laboratorio / Cuestionario / Notebook
- Pyodide ejecuta Python real en el navegador
- Botón "Ejecutar" con estilo terminal (fondo oscuro, texto verde)

---

### 4.8 Proyectos Index (`/proyectos`)

**Trabajo**: Explorar proyectos guiados por módulo.

```
┌─────────────────────────────────────────────────────┐
│ InVitroShell                                         │
│ ┌──────────┬───────────────────────────────────────┐│
│ │ Sidebar  │ h1: Proyectos                         ││
│ │          │ body: Cada módulo incluye proyectos...││
│ │          │                                       ││
│ │          │  ┌─ Módulo: Python ─────────────────┐ ││
│ │          │  │ ┌─────┐ ┌─────┐ ┌─────┐         │ ││
│ │          │  │ │Card │ │Card │ │Card │ (grid)   │ ││
│ │          │  │ │icon │ │icon │ │icon │          │ ││
│ │          │  │ │title│ │title│ │title│          │ ││
│ │          │  │ │diff │ │diff │ │diff │          │ ││
│ │          │  │ └─────┘ └─────┘ └─────┘         │ ││
│ │          │  └──────────────────────────────────┘ ││
│ └──────────┴───────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

**Decisiones de diseño:**
- ProjectHub: módulos colapsables con grid de ProjectCards
- Cada ProjectCard: icono, título, dificultad (badge color), módulo de origen
- Sin sidebar deTopBar — layout más limpio que laboratorios

---

### 4.9 Detalle de Proyecto (`/proyectos/[module]/[lesson]`)

**Trabajo**: Resolver un assignment/proyecto guiado.

```
┌─────────────────────────────────────────────────────┐
│ InVitroShell                                         │
│ ┌──────────┬───────────────────────────────────────┐│
│ │ Sidebar  │ [← Volver a proyectos]                ││
│ │          │                                       ││
│ │          │  h1: "Proyecto: Análisis de Vinos"    ││
│ │          │                                       ││
│ │          │  ┌─ AssignmentViewer ────────────────┐ ││
│ │          │  │ Contenido MDX del assignment.md   │ ││
│ │          │  │ (mismo pipeline que labs)         │ ││
│ │          │  │                                   │ ││
│ │          │  │ Consola interactiva (si aplica)   │ ││
│ │          │  │ [Ejecutar] [Notebook actions]     │ ││
│ │          │  └──────────────────────────────────┘ ││
│ └──────────┴───────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

**Decisiones de diseño:**
- Reutiliza el mismo MDX pipeline que labs (LabCodeBlock, LabCallout, etc.)
- AssignmentViewer envuelve el contenido
- NotebookActions: abrir en Colab / descargar .ipynb
- Botón "Volver" como link sutil arriba del título

---

### 4.10 Mapa de Niveles (`/niveles`)

**Trabajo**: Visualizar la progresión de ranks y habilidades.

```
┌─────────────────────────────────────────────────────┐
│ InVitroShell                                         │
│ ┌──────────┬───────────────────────────────────────┐│
│ │ Sidebar  │ h2: Mapa de Niveles                   ││
│ │          │                                       ││
│ │          │  ── Timeline horizontal ──────────── ││
│ │          │  ○───○───●───○───○───○               ││
│ │          │  Nov Anal Jr  Inv Esp  ML             ││
│ │          │       -      ▲ ACTUAL                 ││
│ │          │                                     ││
│ │          │  ┌─ Nivel Actual ───────────────────┐ ││
│ │          │  │  ┌──────────┐                    │ ││
│ │          │  │  │  [ring   ]  Nivel 3           │ ││
│ │          │  │  │  50%     ]  Investigador Jr.  │ ││
│ │          │  │  └──────────┘                    │ ││
│ │          │  │  XP: 1,250 / 2,000               │ ││
│ │          │  │  XP al siguiente: 750            │ ││
│ │          │  └──────────────────────────────────┘ ││
│ │          │                                       ││
│ │          │  ┌─ Habilidades en Desarrollo ──────┐ ││
│ │          │  │ [Pandas] [Visualización] [Stats] │ ││
│ │          │  │ [Matplotlib] (Bloqueado)         │ ││
│ │          │  └──────────────────────────────────┘ ││
│ │          │                                       ││
│ │          │  ┌─ Recompensas del Nivel ──────────┐ ││
│ │          │  │ - Rango Novato                     │ ││
│ │          │  │ - Rango Analista                   │ ││
│ │          │  │ [lock] Rango Investigador Jr.      │ ││
│ │          │  └──────────────────────────────────┘ ││
│ └──────────┴───────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

**Decisiones de diseño:**
- Timeline horizontal con nodos conectados — el actual tiene glow
- Ring SVG circular para progreso del nivel actual
- Tags de habilidades: activas en mint, bloqueadas en gray con lock icon
- Lista vertical de recompensas desbloqueadas/bloqueadas

---

### 4.11 Logros (`/logros`)

**Trabajo**: Ver logros desbloqueados y progreso semanal.

```
┌─────────────────────────────────────────────────────┐
│ InVitroShell                                         │
│ ┌──────────┬───────────────────────────────────────┐│
│ │ Sidebar  │ h2: Mis Logros                        ││
│ │          │ sub: Tu camino hacia la excelencia... ││
│ │          │                                       ││
│ │          │  75% Completado                       ││
│ │          │  12 de 16 Logros Desbloqueados        ││
│ │          │  [████████████░░░░░░░░]               ││
│ │          │                                       ││
│ │          │  ┌─ Logros ───┐ ┌─ Recompensa ─────┐ ││
│ │          │  │ Categoría  │ │ Semanal          │ ││
│ │          │  │ 4/6        │ │                  │ ││
│ │          │  │ ┌──┐ ┌──┐  │ │ XP esta semana   │ ││
│ │          │  │ │  │ │  │  │ │ 850 XP           │ ││
│ │          │  │ └──┘ └──┘  │ │                  │ ││
│ │          │  │ ┌──┐ ┌──┐  │ │ [bar chart L-D]  │ ││
│ │          │  │ │  │ │  │  │ │ █ █ █ █ █ █ █   │ ││
│ │          │  │ └──┘ └──┘  │ │                  │ ││
│ │          │  └────────────┘ └──────────────────┘ ││
│ └──────────┴───────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

**Decisiones de diseño:**
- Layout 2 columnas en desktop: logros (izq) + panel semanal (der)
- AchievementCard: icono, título, descripción, recompensa XP
- Categorías agrupadas con contador "X de Y"
- Gráfico de barras semanal: 7 barras (L-D) con height proporcional al XP diario
- Locked achievements: grayscale + lock icon overlay

---

### 4.12 Comunidad (`/comunidad`)

**Trabajo**: Ver leaderboard y investigadores activos.

```
┌─────────────────────────────────────────────────────┐
│ InVitroShell                                         │
│ ┌──────────┬───────────────────────────────────────┐│
│ │ Sidebar  │                                       ││
│ │          │  ┌─ Desafío ─────────────────────────┐│
│ │          │  │ Desafio Bio-Data 2026              ││
│ │          │  │ Análisis de 11 variables...       ││
│ │          │  │                  [Explorar →]      ││
│ │          │  └───────────────────────────────────┘│
│ │          │                                       ││
│ │          │  ┌─ Investigadores ─┐ ┌─ Leaderboard┐│
│ │          │  │ Activos          │ │ Global      ││
│ │          │  │                  │ │             ││
│ │          │  │ [avatar] Name    │ │ 1. Name       ││
│ │          │  │ racha 5 dias     │ │ 2. Name       ││
│ │          │  │ [Investigador]   │ │ 3. Name       ││
│ │          │  │                  │ │ 4. Name       ││
│ │          │  │ [avatar] Name    │ │ ...           ││
│ │          │  │ racha 3 dias     │ │               ││
│ │          │  │ [Analista]       │ │ ┌─────────┐││
│ │          │  │                  │ │ │Tu pos:  │││
│ │          │  └──────────────────┘ │ │ #15     │││
│ │          │                       │ └─────────┘││
│ │          │                       └────────────┘│
│ └──────────┴───────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

**Decisiones de diseño:**
- Layout 2 columnas: investigadores activos (8 col) + leaderboard (4 col)
- Investigadores: avatar con iniciales, nombre, racha, badge de rank
- Leaderboard: top 10 con posiciones numeradas para los primeros 3
- "Tu posición" como card destacada con borde accent
- Desafío como card CTA prominente arriba de todo

---

## 5. Estados Especiales

### 5.1 Empty States

Cada vista con datos vacíos muestra:
- Icono temático centrado
- Título descriptivo
- Descripción de cómo proceder
- CTA contextual

### 5.2 Loading / Skeleton

- Cards: skeleton con pulse animation
- Tablas: skeleton rows
- XP bar: skeleton shimmer

### 5.3 Errores

- 404: página no encontrada con CTA a dashboard
- 500: error interno con retry
- Auth required: redirect a /sign-in

### 5.4 Responsive Breakpoints

```
mobile:  < 768px    — 1 columna, sidebar drawer
tablet:  768-1024px — 2 columnas, sidebar colapsada
desktop: > 1024px   — layout completo con sidebar
```

---

## 6. Tokens de Color — Resumen para CSS

Valores canónicos copiados de `src/app/globals.css` (`@theme` en 14-37, `.dark` en 103-112).

```css
/* ─── Design Tokens — @theme (src/app/globals.css:14-37) ─── */
@theme {
  --color-ink: #000000;
  --color-graphite: #2a272a;
  --color-brand-950: #22005A;
  --color-brand-800: #00388C;
  --color-brand-600: #0063AE;
  --color-brand-500: #008DBF;
  --color-brand-400: #00B5C5;
  --color-brand-300: #45DCC6;
  --color-slate: var(--color-brand-800);      /* alias de brand-800 */
  --color-storm: #677381;
  --color-fog: var(--color-brand-500);        /* alias de brand-500 */
  --color-mint: var(--color-brand-400);       /* alias de brand-400 */
  --color-surface: #FFFFFF;
  --color-surface-card: #ffffff;
  --color-surface-raised: #e8ecf0;

  /* Semantic helpers */
  --color-on-surface: var(--color-ink);
  --color-on-surface-variant: var(--color-storm);
  --color-outline: var(--color-storm);
  --color-outline-variant: var(--color-surface-raised);
  --color-on-primary: var(--color-ink);
  --color-error: #ba1a1a;
  --color-success: #10b981;
}

/* ─── Dark Mode Overrides (src/app/globals.css:103-112) ─── */
.dark {
  --color-surface: #0f0f0f;
  --color-surface-card: #1a1a1a;
  --color-surface-raised: #2a2a2a;
  --color-ink: #e0e0e0;
  --color-on-surface: #e0e0e0;
  --color-on-surface-variant: #9ca3af;
  --color-comic-bg: #0a1628;
  --color-hud-bg: rgba(10, 22, 40, 0.9);
}
```

Recordar que `mint`, `fog`, `slate`, `on-surface`, `on-surface-variant`, `outline`,
`outline-variant` y `on-primary` son alias: se declaran con `var()` y no tienen hex propio.
La clase `dark` sobre `<html>` la aplica `InVitroShell` (`src/components/layout/InVitroShell.tsx:31-40`).

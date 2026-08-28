# DESIGN.md — InVitro-Code

Plataforma de aprendizaje interactivo de IA/ML para estudiantes de biotecnología.
Estilo visual: **Laboratorio Digital** — limpio, técnico, con identidad propia.

---

## 1. Sistema de Diseño

### 1.1 Paleta de Colores

Colores proporcionados por el usuario. Tonos fríos,技术, con contraste suficiente.

| Token               | Hex       | Uso                                                  |
| ------------------- | --------- | ---------------------------------------------------- |
| `ink`               | `#000000` | Texto principal, fondos oscuros, terminales          |
| `graphite`          | `#2a272a` | Sidebar oscura, headers de terminal, textos fuertes  |
| `slate`             | `#4b4a54` | Texto secundario, bordes suaves, iconos apagados     |
| `storm`             | `#677381` | Texto terciario, placeholders, labels desactivados    |
| `fog`               | `#82a0aa` | Acentos suaves, badges, highlight de progreso         |
| `mint`              | `#a3cfcd` | Acentos vivos, CTAs secundarios, éxito, conexiones    |
| `surface`           | `#f4f6f8` | Fondo principal de páginas                            |
| `surface-card`      | `#ffffff` | Fondo de cards, paneles, modales                      |
| `surface-raised`    | `#e8ecf0` | Bordes, separadores, superficies elevadas             |

**Reglas de uso:**
- `ink` solo para texto de mayor jerarquía y fondos de terminal
- `mint` es el color de acento vivo — CTAs primarios, indicadores de éxito, progreso activo
- `fog` para elementos interactivos secundarios y badges de estado
- `storm` para texto de soporte, nunca para texto principal
- `graphite` para la sidebar y barras de herramientas oscuras

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

### 2.5 Componentes de Lab

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

### 2.6 Componentes de Editor

| Componente        | Archivo                              | Descripción                       |
| ----------------- | ------------------------------------ | --------------------------------- |
| `CodeEditor`      | `src/components/editor/CodeEditor.tsx`      | Editor de código (Monaco-like)    |
| `ConsoleFrame`    | `src/components/editor/ConsoleFrame.tsx`    | Frame de consola interactiva      |
| `OutputPanel`     | `src/components/editor/OutputPanel.tsx`     | Panel de salida de código         |
| `PyodideRunner`   | `src/components/editor/PyodideRunner.tsx`   | Runner Python en browser (Pyodide)|
| `VisualizationPanel`| `src/components/editor/VisualizationPanel.tsx`| Panel de visualización/gráficos |

### 2.7 Componentes de Layout

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
│  MÓDULOS (fondo surface #f4f6f8)                    │
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
- Mint (#a3cfcd) como acento vivo en CTAs y terminal prompt
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

## 6.okens de Color — Resumen para CSS

```css
@theme {
  --color-ink: #000000;
  --color-graphite: #2a272a;
  --color-slate: #4b4a54;
  --color-storm: #677381;
  --color-fog: #82a0aa;
  --color-mint: #a3cfcd;
  --color-surface: #f4f6f8;
  --color-surface-card: #ffffff;
  --color-surface-raised: #e8ecf0;
}
```

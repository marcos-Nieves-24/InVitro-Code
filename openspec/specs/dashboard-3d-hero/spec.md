# dashboard-3d-hero Specification

## Purpose

3D model viewer in the dashboard hero section using React Three Fiber, replacing the static XP badge with a static bust GLB model.

## Requirements

### Requirement: Dependencies installation

The system MUST install `three` (^0.170.0), `@react-three/fiber` (^8.17.0), `@react-three/drei` (^9.114.0). Versions MUST resolve without peer dependency conflicts.

#### Scenario: Install and type-check

- GIVEN the three packages are added to package.json
- WHEN `npm install` and `npm run type-check` run
- THEN both complete without errors

### Requirement: Static asset delivery

The system MUST place `dashboard.glb` (7.23 MB) and `dashboard-fondo.png` in `public/dashboard/`, served at `/dashboard/dashboard.glb` and `/dashboard/dashboard-fondo.png`.

#### Scenario: GLB accessible

- GIVEN the dashboard page is visited
- WHEN the browser requests `/dashboard/dashboard.glb`
- THEN the file is served with correct content-type

### Requirement: DashboardHero3D client component

El sistema MUST exportar `DashboardHero3D` desde `src/components/dashboard/DashboardHero3D.tsx` con `"use client"`. El componente MAY aceptar props opcionales para modo fallback, pero no MUST exigir props requeridas. Cuando se usa la rama GLB legada, el Canvas MUST renderizar con fondo transparente para que el `dashboard-fondo-anime.png` se vea detrás, la escena MUST incluir `Environment` procedural (`<Environment frames={1} resolution={256}>`) sin dependencia de CDN, y el material MUST usar `metalness` ≤ 0.2 y `roughness` ~0.4 para no verse como silueta negra. Cuando se usa la rama estática (fallback), el componente MUST renderizar un `<img>` con `cientifica-1.svg` sin Canvas.
(Previously: describía únicamente la rama GLB estática sin variante fallback SVG ni lazy condicional.)

#### Scenario: Static bust framing

- GIVEN el componente monta en modo GLB legado en el navegador
- WHEN el Canvas inicializa
- THEN un modelo GLB carga vía `useGLTF("/dashboard/dashboard.glb")`
- AND el modelo se presenta como busto estático (cabeza, hombros y pecho superior) sin animación
- AND el framing se define por las constantes `MODEL_OFFSET`, `CAMERA_POSITION` y `CAMERA_FOV` al inicio del archivo
- AND el offset `MODEL_OFFSET.y` está derivado de los bounds reales del GLB (`y` -0.9513..0.9467), no asumido como base

#### Scenario: Model renders visibly lit

- GIVEN el Canvas renderiza en modo GLB
- WHEN la escena compone
- THEN el modelo muestra reflejos PBR visibles (no silueta negra)
- AND los `Lightformers` del `Environment` proveen reflexiones procedurales

#### Scenario: Transparent background shows hero image

- GIVEN el Canvas renderiza dentro del hero en modo GLB
- WHEN la escena compone
- THEN el fondo del Canvas es transparente (`alpha: true`)
- AND `dashboard-fondo-anime.png` es visible detrás y alrededor del modelo

#### Scenario: Lighting and camera

- GIVEN el Canvas renderiza en modo GLB
- WHEN la escena compone
- THEN al menos una luz ambiental y una direccional están presentes
- AND la cámara encuadra el modelo sin interacción de usuario (OrbitControls deshabilitado)

#### Scenario: Fallback estático sin Canvas

- GIVEN el componente se invoca en modo fallback estático
- WHEN renderiza
- THEN muestra `<img src="/dashboard/cientifica-1.svg" alt="...">` en el slot normalizado 440x511 sin Canvas ni WebGL

### Requirement: Static presentation

The system MUST NOT animate the 3D scene. Because the presentation is static, the `prefers-reduced-motion` preference is satisfied unconditionally and NO `matchMedia` listener, hover-pause handler or `useFrame` loop is required.

(Previously: this requirement MANDATED turntable rotation, a `prefers-reduced-motion` listener and hover pause. All three were removed when the presentation became a static bust, per the reference `dashboard-propuesta.png`.)

#### Scenario: No continuous motion

- GIVEN the component mounts
- WHEN the scene composes
- THEN no continuous animation runs (no `useFrame` rotation)
- AND the rendered content is identical across successive frames

#### Scenario: Reduced motion satisfied by default

- GIVEN `prefers-reduced-motion: reduce` is enabled
- WHEN DashboardHero3D mounts
- THEN the model renders statically, satisfying the preference without any special handling

### Requirement: WebGL fallback

The system MUST render `dashboard-fondo.png` when WebGL is unavailable or the GLB fails to load.

#### Scenario: WebGL unavailable

- GIVEN the browser lacks WebGL support
- WHEN DashboardHero3D renders
- THEN the error boundary catches the failure
- AND the static fallback image is displayed

#### Scenario: GLB load failure

- GIVEN the GLB returns 404 or is corrupt
- WHEN the model loader errors
- THEN the fallback image displays and no unhandled error propagates

### Requirement: Dashboard page integration

La página de dashboard MUST importar `DashboardHero3D` de forma diferida solo cuando se necesita la rama GLB/fallback, usando `next/dynamic` con `{ ssr: false }`. En el flujo por defecto del refactor gaming, el dashboard NO SHALL montar `DashboardHero3D` como hero principal; el hero principal es la isla cómic (`HeroBanner` + `ScientistFigure`). `DashboardHero3D` queda como compat/shim para rollback y páginas que aún lo referencien.
(Previously: el hero 3D era el hero principal y reemplazaba el badge XP estático.)

#### Scenario: SSR disabled

- GIVEN la página de dashboard hace server-render en modo GLB/fallback
- WHEN se evalúa la página
- THEN `DashboardHero3D` se carga vía `next/dynamic({ ssr: false })`
- AND no hay ejecución de WebGL en servidor

#### Scenario: Hero cómic es el principal por defecto

- GIVEN el dashboard carga sin flag de fallback
- WHEN se compone
- THEN el hero cómic (`HeroBanner`) es el hero visible y `DashboardHero3D` no se incluye en el bundle inicial del dashboard

### Requirement: Performance budget

El GLB y el código `three` asociado MUST permanecer lazy: cero código 3D se ejecuta hasta que se visita una ruta que lo requiere, y el bundle inicial no MUST crecer por código 3D. El chunk lazy que contiene `three` MUST mantenerse bajo 300 KB gz (medido 274 KB gz). El nuevo hero cómic con `gsap` (~35 KB gz) MUST cargarse vía isla dinámica `ssr:false` y no MUST incrementar el bundle inicial de rutas fuera del dashboard.
(Previously: presupuesto descrito solo para three.js sin mención del delta de gsap del hero cómic.)

#### Scenario: Lazy 3D chunk budget

- GIVEN `npm run build` completa
- WHEN se inspecciona el chunk lazy que contiene three.js
- THEN no excede 300 KB gz (actual 274 KB)
- AND three.js está excluido del bundle inicial

#### Scenario: No 3D code on other pages

- GIVEN el usuario visita una página distinta al dashboard
- WHEN se cargan los bundles JS
- THEN no se descarga ni ejecuta código de three.js ni R3F

#### Scenario: Hero cómic chunk aislado

- GIVEN `npm run build --analyze` se ejecuta con hero cómic habilitado
- WHEN se inspecciona el bundle del dashboard
- THEN el chunk de `gsap` y la isla del hero están marcados como dinámicos `ssr:false`
- AND rutas fuera de `/dashboard` no incluyen ese chunk
- AND el delta de bundle atribuible a `gsap` es ~35 KB gz

### Requirement: Shim de compatibilidad y fallback estático SVG

El sistema SHOULD mantener `src/components/dashboard/DashboardHero3D.tsx` como shim de compatibilidad que, cuando el hero cómic está activo, no se renderiza en la ruta principal, pero cuando `NEXT_PUBLIC_HERO_FALLBACK="true"` o WebGL/GLB falla, renderiza fallback estático con `cientifica-1.svg` (440x511) en el mismo slot. El shim no MUST exigir `three`/`@react-three/fiber` para el camino estático; el import de `three` queda lazy solo para la rama GLB.

#### Scenario: Shim no usado en modo cómic por defecto

- GIVEN el hero cómic está activo y `NEXT_PUBLIC_HERO_FALLBACK` no es `"true"`
- WHEN el dashboard renderiza
- THEN `DashboardHero3D` no se monta en la composición principal
- AND no se descarga código de `three`

#### Scenario: Fallback estático vía flag

- GIVEN `NEXT_PUBLIC_HERO_FALLBACK="true"`
- WHEN el dashboard renderiza
- THEN `DashboardHero3D` (o su rama de fallback) muestra `cientifica-1.svg` en el slot `lg:w-[350px] h-[480px]`
- AND no requiere WebGL


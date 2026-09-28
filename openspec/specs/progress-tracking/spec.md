# Progress Tracking Specification

## Purpose

Track user progress in Supabase: XP, levels, daily streaks, module completion. Provide gamified UI elements (progress bars, streak counters, level badges) across the platform.

## Requirements

### Requirement: XP and Level System

The system MUST award XP for completing exercises and level up the user when they cross level thresholds (every 100 XP). XP changes MUST persist to Supabase immediately.

#### Scenario: Exercise completion awards XP

- GIVEN the user passes client-side validation for an exercise worth 25 XP
- WHEN the validation result is submitted
- THEN the user's XP increases by 25 and the new total reflects in the profile badge

#### Scenario: Level up triggers milestone

- GIVEN the user has 95 XP and completes an exercise worth 25 XP
- WHEN the XP is awarded
- THEN the user reaches level 2, XP resets to 20, and a celebratory toast is shown

### Requirement: Daily Streaks

The system MUST track consecutive days with at least one exercise completed, resetting after a missed day.

#### Scenario: Streak increments

- GIVEN the user completed an exercise yesterday and today
- WHEN today's completion is recorded
- THEN the streak counter shows 2 days and the UI displays a flame icon

#### Scenario: Missed day resets streak

- GIVEN the user had a 5-day streak but did not complete any exercise yesterday
- WHEN they complete an exercise today
- THEN the streak resets to 1 and the UI shows the new count

### Requirement: Module Progress Bar

El sistema MUST mostrar una barra de progreso por módulo que indique lecciones completadas vs totales. La barra lineal y el label textual ("2/5 completados" y porcentaje) MUST permanecer como fuente de verdad accesible incluso cuando la variante `bioreactor` está activa. El ancho de la barra MUST reflejar `progressPercentage` real y el overlay de burbujas, cuando está activo, MUST ser decorativo (`aria-hidden="true"`).
(Previously: solo exigía barra lineal con label, sin variante visual ni overlay decorativo.)

#### Scenario: Progress bar updates

- GIVEN un módulo con 5 lecciones y el usuario completó 2
- WHEN se ve la página del módulo con cualquier variante
- THEN la barra muestra 40% de ancho con label "2/5 completados"
- AND el porcentaje numérico es el valor accesible primario

#### Scenario: Variante biorreactor conserva semántica accesible

- GIVEN `variant="bioreactor"` activo con `progressPercentage=40`
- WHEN se consulta el progreso con lector de pantalla
- THEN el porcentaje y el label siguen siendo la fuente anunciada
- AND las burbujas no aportan información exclusiva (tienen `aria-hidden="true"`)

### Requirement: Variante biorreactor con overlay de burbujas decorativo

El sistema SHOULD ofrecer en `ModuleProgress` y `XPBar` (vía `BioreactorProgress` o prop `variant="bioreactor"`) un overlay de burbujas SVG+GSAP de 12 a 16 círculos en pool, con `aria-hidden="true"` y `pointer-events: none`, cuya tasa es proporcional a `progressPercentage`. El overlay no MUST ocultar la barra ni el texto numérico. La animación MUST pausarse con `document.hidden` o `prefers-reduced-motion: reduce`, y el componente MUST seguir funcionando como barra lineal si `gsap` no está disponible.

#### Scenario: Overlay pooled proporcional al progreso

- GIVEN `ModuleProgress` con `variant="bioreactor"` y `progressPercentage=80`
- WHEN se inspecciona el overlay
- THEN hay entre 12 y 16 nodos de burbuja reutilizados en pool
- AND la frecuencia de emisión es mayor que con `progressPercentage=15`

#### Scenario: Pausa por visibilidad y movimiento reducido

- GIVEN las burbujas animan
- WHEN `document.hidden` pasa a true o `prefers-reduced-motion: reduce` se activa
- THEN la animación de burbujas se pausa
- AND la barra y el porcentaje siguen visibles

#### Scenario: Accesibilidad del overlay

- GIVEN el overlay está activo
- WHEN un lector de pantalla recorre el progreso
- THEN el contenedor de burbujas tiene `aria-hidden="true"`
- AND no es enfocable ni interfiere con clicks (`pointer-events: none`)

#### Scenario: Toggle por variante sin layout shift

- GIVEN `ModuleProgress` sin `variant` (por defecto linear) cambia a `variant="bioreactor"`
- WHEN se mide el contenedor de la barra
- THEN las dimensiones no cambian y el overlay se superpone en capa absoluta
- AND si `gsap` falla, solo se ve la barra lineal sin error


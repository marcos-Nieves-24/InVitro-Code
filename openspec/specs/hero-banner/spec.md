# hero-banner Specification

## Purpose

Full-width hero banner for the dashboard with background image, 3D model layer, text/CTAs, and decorative chip. Replaces the current compact hero section.

## Requirements

### Requirement: Full-width banner layout

El sistema MUST renderizar el hero como banner de ancho completo usando `dashboard-fondo-anime.png` como imagen de fondo vía `next/image` con `fill` y `priority` (carga eager por ser above-the-fold). El contenedor de datos del dashboard (`DashboardContainer`) MUST permanecer como Server Component; la capa interactiva del hero (viñeta cómic con GSAP, burbuja y figura con variante) MAY ser isla cliente (`"use client"` vía `next/dynamic` con `ssr: false`) sin romper el render en servidor del contenedor. Cuando el flag `NEXT_PUBLIC_HERO_FALLBACK="true"` está activo, el hero MUST renderizar la rama estática legada sin GSAP.
(Previously: exigía que toda la página permaneciera Server Component y solo la capa 3D usara client boundary; además referenciaba `dashboard-fondo.png` genérico.)

#### Scenario: Desktop render

- GIVEN el dashboard carga en viewport ≥ `lg` con hero cómic habilitado
- WHEN el hero renderiza
- THEN `dashboard-fondo-anime.png` se muestra como fondo de ancho completo
- AND la figura científica aparece a la derecha del banner
- AND el texto/burbuja aparece a la izquierda
- AND la composición respeta el layout de referencia

#### Scenario: Server container preservado con isla cliente para hero

- GIVEN el dashboard hace server-render
- WHEN el HTML se genera
- THEN el `DashboardContainer` y los datos (`profiles`, `progress`, `totalXp`, `gender`) se renderizan en servidor
- AND solo la isla interactiva del hero porta `"use client"` (o `next/dynamic ssr:false`)
- AND no hay error de hidratación por desajuste de `totalXp`/`gender`

#### Scenario: Línea temporal GSAP con etiquetas enter/type/bubblePop

- GIVEN el hero cómic monta con movimiento permitido y GSAP disponible
- WHEN la línea temporal inicia
- THEN ejecuta en orden las fases `enter` (parallax 0.2 + slide-in), `bubblePop` (escala pop) y `type` (mecanografiado)
- AND `prefers-reduced-motion: reduce` salta directamente al estado final sin reproducir la línea

#### Scenario: Fallback estático vía flag

- GIVEN `NEXT_PUBLIC_HERO_FALLBACK="true"`
- WHEN el hero renderiza
- THEN se muestra la rama estática (`<img src="/dashboard/cientifica-1.svg">` + fondo) sin GSAP ni burbuja animada
- AND no se carga el chunk de GSAP para el hero

### Requirement: Text and CTA content

The hero MUST display a welcome heading, supporting copy, and two CTAs: "Continuar Misión" (primary) and "Explorar Mapa" (secondary). Text MUST have sufficient contrast against the background image.

#### Scenario: Text contrast on background

- GIVEN the hero banner renders with the background image
- WHEN the text content is visible
- THEN the heading and supporting copy MUST maintain readable contrast against the background
- AND the contrast ratio MUST meet WCAG AA (≥ 4.5:1 for normal text)

#### Scenario: CTAs present and styled

- GIVEN the hero banner renders
- WHEN the user views the hero
- THEN a primary CTA labeled "Continuar Misión" is present
- AND a secondary CTA labeled "Explorar Mapa" is present

### Requirement: Decorative chip

A chip reading "IA + Biotecnología = Mejor futuro" MUST appear in the top-right area of the hero banner.

#### Scenario: Chip visible on desktop

- GIVEN the hero banner renders on a desktop viewport
- WHEN the user views the hero
- THEN the chip "IA + Biotecnología = Mejor futuro" is visible in the top-right corner

### Requirement: Hero edge bleed

The 3D layer MUST be anchored to the hero's REAL bottom and right edges, so the bust crop is closed by the hero itself rather than by an invisible inner box. The figure MUST bleed off the right edge, and the canvas MUST NOT leave a gap to either edge at ANY viewport width.

(Previously: this requirement demanded that the model's held DNA align with the background's central helix. The final composition, matching `dashboard-propuesta.png`, places the helix to the right of the bust; it does NOT align with the background helix, and that goal was dropped in favour of the edge bleed below.)

#### Scenario: Figure bleeds off the hero's right edge

- GIVEN the hero banner renders at any viewport ≥ `lg`
- WHEN the 3D layer is measured against the hero section
- THEN the canvas right edge MUST coincide with the section's right edge (0px gap)
- AND the figure's shoulder MUST extend past that edge

#### Scenario: Bust crop is closed by the hero's bottom edge

- GIVEN the hero banner renders at any viewport ≥ `lg`
- WHEN the 3D layer is measured against the hero section
- THEN the canvas bottom edge MUST coincide with the section's bottom edge (0px gap)
- AND no dead band of background may separate the figure's crop from the hero's bottom

#### Scenario: Geometry holds when the hero is taller than its content

- GIVEN the hero reaches its `min-h-[400px]` because the viewport is wide and the text is short
- WHEN the layout resolves
- THEN the content row MUST stretch to the hero's full height
- AND the 3D layer MUST still terminate flush at the bottom edge, with no dead band

(Previously: the content row stayed content-sized and top-aligned, leaving a 40px dead band at ~1920px wide. A negative margin alone could not fix this because it anchored to the row, not the section.)

### Requirement: Responsive behavior

On viewports below `lg`, the 3D layer MUST be hidden. Text contrast MUST remain accessible on all viewports.

#### Scenario: Mobile render

- GIVEN the hero banner renders on a viewport below `lg`
- WHEN the page loads
- THEN the 3D layer is hidden (`hidden lg:block`)
- AND the background image is visible
- AND text and CTAs are readable with sufficient contrast
- AND the layout stacks vertically without horizontal overflow

#### Scenario: 3D load failure graceful fallback

- GIVEN the 3D component fails to load or WebGL is unavailable
- WHEN the hero banner renders
- THEN the background image and text content remain visible
- AND no layout shift or broken UI occurs
- AND the error boundary catches the failure silently
### Requirement: Burbuja cómic con efecto mecanografiado en hero

El sistema SHOULD proveer dentro del hero una burbuja de diálogo cómic (`ComicBubble`) con texto en español neutro revelado por `useTypewriter` a 35 ms por caracter. El cursor visual MUST ser `aria-hidden="true"` y el texto completo MUST estar disponible para tecnologías asistivas desde el primer fotograma. Con `prefers-reduced-motion: reduce` el texto MUST aparecer instantáneo sin animación.

#### Scenario: Burbuja muestra diálogo mecanografiado

- GIVEN el hero cómic monta con movimiento permitido
- WHEN la fase `type` de la línea temporal inicia
- THEN la burbuja revela su texto progresivamente a ~35 ms por caracter hasta el texto completo

#### Scenario: Movimiento reducido muestra texto completo

- GIVEN `prefers-reduced-motion: reduce` activo
- WHEN el hero renderiza
- THEN la burbuja muestra el texto completo de forma instantánea
- AND no se programa animación de mecanografiado

#### Scenario: Burbuja accesible

- GIVEN un lector de pantalla recorre el hero durante la animación
- WHEN consulta la burbuja
- THEN percibe el texto completo sin depender del efecto visual
- AND el cursor tiene `aria-hidden="true"`

### Requirement: Figura científica con variante de diversidad

El sistema MUST renderizar la figura científica vía `ScientistFigure` con prop `variant: 'f' | 'm' | 'x'`, resuelta como `getScientistVariant(gender ?? 'f')` donde `gender` proviene de `profiles.gender` (Supabase canónica). El asset para cada variante MUST compartir artboard `440x511` y el slot `lg:w-[350px] h-[480px]` sin reflow al intercambiar. Si el asset de la variante falla, el sistema MUST hacer fallback a `cientifica-1.svg`.

#### Scenario: Variante m renderiza sin desplazamiento

- GIVEN `gender='m'` y `cientifico-440x511.svg` normalizado
- WHEN el hero muestra la figura `m`
- THEN el slot mantiene `440x511` sin desplazamiento
- AND la imagen es visible

#### Scenario: Variante x sin arte final cae a f

- GIVEN `gender='x'` y no existe arte final para `x` (placeholder o 404)
- WHEN el hero resuelve la variante
- THEN se muestra `cientifica-1.svg` (`f`) sin error

#### Scenario: Fallback ante 404 de asset

- GIVEN `cientifico-440x511.svg` responde 404
- WHEN `ScientistFigure` detecta error
- THEN hace fallback a `cientifica-1.svg`


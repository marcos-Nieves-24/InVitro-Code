# dashboard-gaming-hero Specification

## Purpose

Hero del dashboard como viñeta cómic animada: fondo parallax, figura científica con diálogo mecanografiado y burbuja pop. Entrega el gancho emocional y la diversidad (f/m/x) sin romper LCP ni accesibilidad.

## Requirements

### Requirement: Viñeta cómic con línea temporal GSAP

El sistema MUST renderizar `HeroBanner` como isla cliente con una línea temporal GSAP determinista con etiquetas `enter`, `type` y `bubblePop`. La secuencia SHALL ejecutarse en orden: fondo con parallax sutil (factor 0.2) → deslizamiento de la figura científica → burbuja con escala y pop → inicio del efecto mecanografiado. La línea temporal MUST ser cancelable y reiniciable sin fugas de memoria.

#### Scenario: Secuencia completa en movimiento normal

- GIVEN el dashboard carga en un viewport `lg` sin preferencia de movimiento reducido
- WHEN la isla `HeroBanner` se monta y GSAP está disponible
- THEN la línea temporal reproduce `enter` (fondo parallax 0.2 + figura slide-in), luego `bubblePop` (burbuja escala 0 → 1 con pop elástico), luego `type` (mecanografiado inicia)
- AND cada etiqueta es observable como fase distinta (para pruebas con espías de `gsap.timeline`)

#### Scenario: Línea temporal reutilizable sin acumulación

- GIVEN la hero se desmonta y vuelve a montarse (navegación cliente)
- WHEN la nueva instancia inicia su línea temporal
- THEN la línea anterior MUST estar eliminada (`gsap.kill` o `timeline.kill`)
- AND no se acumulan listeners ni tweens huérfanos

#### Scenario: Fallback sin GSAP

- GIVEN `gsap` no se pudo cargar (error de red o chunk fallido)
- WHEN el hero renderiza
- THEN el sistema MUST mostrar la composición estática completa (fondo + figura + burbuja con texto completo sin animación)
- AND no se lanza error no capturado

### Requirement: Burbuja cómic con efecto mecanografiado accesible

El sistema MUST proveer un componente `ComicBubble` y un hook `useTypewriter(text, { speed: 35ms/caracter })` que revele el texto en español neutro progresivamente. El cursor parpadeante MUST ser `aria-hidden="true"`. El texto completo MUST estar disponible para lectores de pantalla desde el primer fotograma (no depender de la animación para transmitir contenido).

#### Scenario: Mecanografiado revela texto a 35 ms por caracter

- GIVEN `ComicBubble` recibe el texto "¡Bienvenida de nuevo! Continuemos tu misión."
- WHEN el efecto inicia con movimiento permitido
- THEN el texto visible crece aproximadamente a 35 ms por caracter
- AND al finalizar el texto coincide exactamente con el original sin truncamiento

#### Scenario: Texto accesible desde el inicio

- GIVEN un lector de pantalla inspecciona `ComicBubble` durante la animación
- WHEN se consulta el contenido accesible
- THEN el texto completo está presente en el DOM (por ejemplo en un `span` con `sr-only` o `aria-live="polite"` con texto completo)
- AND el cursor visual tiene `aria-hidden="true"`

#### Scenario: Movimiento reducido omite mecanografiado

- GIVEN el sistema operativo tiene `prefers-reduced-motion: reduce`
- WHEN `ComicBubble` se monta
- THEN el texto completo aparece de forma instantánea sin retardo por caracter
- AND no se programa ningún `setInterval` / `requestAnimationFrame` para el efecto

#### Scenario: Interrupción por navegación no deja timers activos

- GIVEN el mecanografiado está en curso
- WHEN el usuario navega fuera del dashboard antes de completarse
- THEN todos los timers del hook se limpian en `useEffect` cleanup
- AND no hay actualización de estado en componente desmontado

### Requirement: Variantes de figura científica y coherencia de activos

El sistema MUST exponer el tipo `ScientistVariant = 'f' | 'm' | 'x'` y el helper `getScientistVariant(gender)` que mapea `gender` (`'f' | 'm' | 'x' | null | undefined`) a variante visual. El componente `ScientistFigure` MUST renderizar `/dashboard/cientifica-${variant}.svg` manteniendo el mismo slot de layout `lg:w-[350px] h-[480px]` sin desplazamiento. La regla de fallback SHALL ser: `gender == null` o `gender === 'x'` sin arte final → renderizar `cientifica-1.svg` (`f`). Los activos `cientifico-440x511.svg` y `cientifico-x.svg` si existen MUST compartir artboard `440x511` y `viewBox` normalizados para evitar reflow al intercambiar.

#### Scenario: Mapeo de género a variante

- GIVEN `getScientistVariant(null)` , `getScientistVariant('x')` , `getScientistVariant('f')` y `getScientistVariant('m')`
- WHEN se evalúan
- THEN retornan `'f'`, `'f'`, `'f'` y `'m'` respectivamente (x fallback temporal a `f`)

#### Scenario: Intercambio de variante sin desplazamiento

- GIVEN el hero muestra `cientifica-1.svg` (440x511) y el usuario cambia su preferencia a `m`
- WHEN `ScientistFigure` cambia `src` a `cientifico-440x511.svg`
- THEN el contenedor mantiene `440x511` y el layout no sufre desplazamiento medible (reflow 0 px en slot `lg`)
- AND ambos SVG declaran `viewBox 0 0 440 511`

#### Scenario: Activo faltante no rompe el hero

- GIVEN el navegador solicita `/dashboard/cientifico-440x511.svg` y recibe 404
- WHEN `ScientistFigure` detecta error de carga
- THEN el sistema MUST hacer fallback a `/dashboard/cientifica-1.svg`
- AND no se muestra imagen rota

### Requirement: Idioma español neutro y contraste

Todo texto visible en `HeroBanner` y `ComicBubble` MUST estar en español neutro, sin anglicismos ni regionalismos, y MUST cumplir contraste WCAG AA (≥ 4.5:1) sobre fondo y burbuja. Los tokens de color para cómic MUST provenir de `@theme` (`--color-comic-*`) y no como hex hardcodeado en componentes.

#### Scenario: Copy en español neutro

- GIVEN el hero renderiza su mensaje por defecto
- WHEN se inspecciona el texto
- THEN el contenido está en español neutro (ej: "¡Listo para tu próxima misión?" en lugar de "Ready for your next mission?")
- AND no contiene cadenas en inglés hardcodeadas

#### Scenario: Contraste sobre burbuja y fondo

- GIVEN la burbuja y la figura se superponen al fondo `dashboard-fondo-anime.png` con overlay
- WHEN se mide contraste del texto de la burbuja
- THEN el ratio MUST ser ≥ 4.5:1

### Requirement: Fallback estático detrás de feature flag

El sistema MUST soportar un flag `NEXT_PUBLIC_HERO_FALLBACK` que cuando es `"true"` renderice el hero estático legado (`<img src="/dashboard/cientifica-1.svg">` sin GSAP ni `ComicBubble`) para rollback instantáneo. El bundle de GSAP no MUST ejecutarse en esa rama.

#### Scenario: Flag activo fuerza hero estático

- GIVEN `NEXT_PUBLIC_HERO_FALLBACK="true"`
- WHEN el dashboard renderiza
- THEN el hero muestra la imagen estática sin línea temporal GSAP ni efecto mecanografiado
- AND no se importa ni ejecuta código de `gsap` para el hero

#### Scenario: Sin flag el hero cómic es el por defecto

- GIVEN `NEXT_PUBLIC_HERO_FALLBACK` no está definido o es `"false"`
- WHEN el dashboard renderiza
- THEN el hero cómic animado es el que se presenta

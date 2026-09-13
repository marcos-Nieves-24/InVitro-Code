# orbital-module-carousel Specification

## Purpose

Replace the static 4-card grid in the Expeditions section with a 3D orbital carousel that continuously rotates, showcasing the 4 real course modules with hover interactions and reduced-motion fallback.

## Requirements

### Requirement: Orbital carousel rendering

The system MUST render a 3D rotating carousel displaying the 4 course modules (MOD-01 through MOD-04) inside the Expeditions section.

#### Scenario: Carousel displays all modules

- GIVEN the Expeditions section (id="modulos") renders
- WHEN the carousel is visible
- THEN all 4 modules are displayed: "Introduccion a la IA" (4 lessons), "Python para Biotecnologia" (17), "Estadistica y Probabilidad" (10), "Machine Learning" (10)
- AND the heading "Expediciones del curso" is preserved
- AND the section id="modulos" is preserved

#### Scenario: Continuous rotation

- GIVEN the carousel is in view
- WHEN time passes
- THEN the carousel rotates continuously along the Y-axis
- AND rotation is GPU-accelerated using CSS transforms only
- AND rotation targets 60 FPS performance

### Requirement: Hover interaction

The system MUST pause rotation and enhance the hovered card.

#### Scenario: Hover pauses and highlights card

- GIVEN the carousel is rotating
- WHEN a user hovers a module card
- THEN rotation pauses
- AND the card translates forward (translateZ)
- AND the card scales up (1.05)
- AND the card gains a soft glow shadow
- AND additional module details are shown

### Requirement: Reduced motion fallback

The system MUST provide a static layout when `prefers-reduced-motion: reduce` is active.

#### Scenario: Static grid for reduced motion

- GIVEN the OS setting `prefers-reduced-motion: reduce` is active
- WHEN the Expeditions section renders
- THEN a static grid layout is shown instead of the rotating carousel
- AND no rotation or animation occurs

### Requirement: Keyboard navigation and accessibility

The carousel MUST be keyboard navigable and expose module links.

#### Scenario: Keyboard navigation

- GIVEN the carousel is rendered
- WHEN a user navigates with keyboard
- THEN all module cards are focusable
- AND module links are accessible via keyboard

#### Scenario: Module links preserve navigation

- GIVEN a module card is displayed
- WHEN a user activates the module link
- THEN navigation occurs (preserving current `/sign-in` "Explorar" behavior)

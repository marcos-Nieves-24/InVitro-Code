# Delta for interactive-terminal

## MODIFIED Requirements

### Requirement: Interactive terminal auto-plays with cycling phases over dark video background

A client component InteractiveTerminal MUST automatically start a typewriter animation on mount, cycle through typing, output, and dendrogram phases in a loop, and render above a dark cinematic video background with sufficient contrast and z-index layering.
(Previously: InteractiveTerminal showed an idle state with a "▶ Ejecutar" click-to-trigger button that ran once)

#### Scenario: Auto-play on mount

- GIVEN the InteractiveTerminal component mounts in the hero section
- WHEN the component renders
- THEN the typewriter animation begins immediately without user interaction
- AND code lines appear character-by-character with variable timing (25–45ms per character)
- AND a blinking cursor is shown during the typing phase

#### Scenario: Output phase follows typing

- GIVEN the typing phase completes (all code lines displayed)
- WHEN the component transitions to the output phase
- THEN output lines appear sequentially with a 400ms delay between each
- AND output text uses a distinct green color

#### Scenario: Dendrogram phase replaces code display

- GIVEN the output phase completes (all output lines displayed)
- WHEN the component transitions to the dendrogram phase
- THEN the code/output display fades out
- AND a DendrogramSVG animation renders in the terminal body
- AND the "Ejecutar de nuevo" button (with RotateCcw icon) becomes visible in the terminal bar

#### Scenario: Auto-restart loop

- GIVEN the dendrogram phase has been visible for approximately 4 seconds
- WHEN the auto-restart timer fires
- THEN the component resets to the typing phase
- AND all displayed lines are cleared
- AND the cycle repeats from the beginning

#### Scenario: Manual rerun via button

- GIVEN the component is in the dendrogram phase
- WHEN the user clicks "Ejecutar de nuevo"
- THEN the component resets to the typing phase immediately
- AND the cycle restarts from the beginning

#### Scenario: Reduced motion skips animations

- GIVEN the user has `prefers-reduced-motion: reduce` enabled
- WHEN the InteractiveTerminal component mounts
- THEN all code lines appear immediately without typing animation
- AND all output lines appear immediately without sequential delay
- AND the dendrogram renders without animation
- AND the component still cycles through phases on timing

#### Scenario: Terminal renders above dark video

- GIVEN the hero section has a cinematic video background with dark overlay
- WHEN the InteractiveTerminal component renders
- THEN it appears above the video and overlay layers via z-index
- AND all terminal text meets WCAG AA contrast against the dark background
- AND the terminal remains the primary focal point of the hero section

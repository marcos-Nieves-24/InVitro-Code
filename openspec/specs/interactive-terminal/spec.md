# Spec: Interactive Terminal Component

## Requirement
A client component InteractiveTerminal MUST be created with typewriter animation effect.

## Behavior

### States
1. **idle** - Shows "▶ Ejecutar" button and placeholder text
2. **typing** - Character-by-character typing animation
3. **done** - All lines displayed, no re-trigger possible

### Typing Animation
- Each character appears with 20-50ms delay (variable)
- Lines appear sequentially
- Cursor blinks during typing

### Click to Trigger
- Button "▶ Ejecutar" triggers the animation
- Animation runs once, then stays static

## Scenarios

### Scenario 1: Click triggers animation
- **Given** the terminal is in idle state
- **When** the user clicks "▶ Ejecutar"
- **Then** the typing animation starts
- **And** the button disappears

### Scenario 2: Animation runs once
- **Given** the animation has completed
- **When** the terminal is in done state
- **Then** no re-trigger is possible

### Scenario 3: Reduced motion support
- **Given** the user has prefers-reduced-motion enabled
- **When** the user clicks "▶ Ejecutar"
- **Then** all lines appear immediately without animation

## Acceptance Criteria
- [ ] Component is "use client"
- [ ] Typewriter effect with variable speed
- [ ] Click to trigger
- [ ] Runs once, then stays static
- [ ] prefers-reduced-motion support
- [ ] Terminal frame with dots and title bar
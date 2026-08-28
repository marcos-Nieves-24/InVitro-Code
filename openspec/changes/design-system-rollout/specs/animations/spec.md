# animations Spec

## ADDED Requirements

### Requirement: reduced-motion respect
All animations SHALL be disabled or reduced when `prefers-reduced-motion: reduce` matches.

#### Scenario: user prefers reduced motion
- **WHEN** the OS setting `prefers-reduced-motion: reduce` is active
- **THEN** scroll reveals, page transitions, skeleton pulse, and terminal typing do not animate (content shown statically)

### Requirement: interactive transition timing
Interactive elements (buttons, cards, nav items) SHALL use a 200–300ms ease-out transition on hover/focus/state change.

#### Scenario: button hover
- **WHEN** a user hovers a Button
- **THEN** the color/transform transition completes within 300ms ease-out

### Requirement: page fade-in
Route content SHALL fade in (opacity 0→1) over 200ms on mount.

#### Scenario: dashboard mount
- **WHEN** the /dashboard route renders
- **THEN** its main container animates opacity 0→1 over 200ms

### Requirement: scroll reveals
Sections SHALL reveal on scroll via translateY(12px)→0 + opacity 0→1 using IntersectionObserver.

#### Scenario: module card enters viewport
- **WHEN** a module card scrolls into view
- **THEN** it transitions from translateY(12px)/opacity 0 to translateY(0)/opacity 1

### Requirement: skeleton pulse
Loading states SHALL use a pulse animation.

#### Scenario: XP bar skeleton
- **WHEN** XP data is loading
- **THEN** the XP bar renders a pulsing skeleton placeholder

# Spec: Color Palette Update

## Requirement
The color palette in globals.css MUST be updated with new values.

## New Values

### Primary Colors
- --color-ink: #111439 (Navy)
- --color-graphite: #005f88 (Blue)
- --color-mint: #00b2b2 (Teal)
- --color-surface: #FFFFFF (White)

### Derived Colors
- --color-surface-card: #F8FAFB (White with slight tint)
- --color-surface-raised: #E2E8F0 (Light gray)
- --color-storm: #3A4A5C (Blue-gray)
- --color-fog: #5A7A8A (Blue mist)

## Scenarios

### Scenario 1: Token values updated
- **Given** the globals.css file is opened
- **When** the @theme block is inspected
- **Then** the new color values are present

### Scenario 2: Dark mode preserved
- **Given** the user has dark mode enabled
- **When** the page is displayed
- **Then** the dark mode overrides still work

## Acceptance Criteria
- [ ] --color-ink is #111439
- [ ] --color-graphite is #005f88
- [ ] --color-mint is #00b2b2
- [ ] --color-surface is #FFFFFF
- [ ] Dark mode overrides preserved
- [ ] No broken styles across the app
# Spec: Module Pathway Removal

## Requirement
The Module Pathway section MUST be removed from the landing page.

## Scenarios

### Scenario 1: Section removed
- **Given** the landing page is loaded
- **When** the user scrolls past the hero section
- **Then** the "Expediciones del curso" section is NOT displayed

### Scenario 2: No broken references
- **Given** the Module Pathway section is removed
- **When** the page is built
- **Then** no TypeScript errors related to removed imports occur

## Acceptance Criteria
- [ ] Module Pathway section removed from page.tsx
- [ ] Unused imports removed (getModules, MODULE_ICONS, moduleIcon)
- [ ] Unused lucide icons removed (FlaskConical, BrainCircuit, BarChart3, Trophy)
- [ ] No broken references in the codebase
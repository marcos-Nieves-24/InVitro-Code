# lesson-reader Spec

## MODIFIED Requirements

### Requirement: lesson components use DESIGN.md palette
All components under `src/components/lesson/` SHALL use DESIGN.md tokens (mint accent, fog badges, ink/surface text, surface-card bg).

#### Scenario: CodeBlock theme
- **WHEN** a CodeBlock renders
- **THEN** code background is ink (#000000) with light text, per lab console styling

#### Scenario: ConceptCard
- **WHEN** a ConceptCard renders
- **THEN** it uses surface-card bg, surface-raised border, mint accent

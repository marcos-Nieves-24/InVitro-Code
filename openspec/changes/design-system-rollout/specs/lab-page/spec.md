# lab-page Spec

## MODIFIED Requirements

### Requirement: lab components use DESIGN.md palette
All components under `src/components/labs/` SHALL use DESIGN.md tokens (surface-card bg, mint difficulty badge, fog accents, surface-raised borders).

#### Scenario: LabCard
- **WHEN** a LabCard renders
- **THEN** it uses surface-card bg, mint difficulty badge, surface-raised border

#### Scenario: LabCallout
- **WHEN** a LabCallout renders
- **THEN** it uses fog accent and surface-raised bg

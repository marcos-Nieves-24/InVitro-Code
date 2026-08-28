# platform-setup Spec

## MODIFIED Requirements

### Requirement: body font
The root layout SHALL use Inter for `--font-body` (replacing DM_Sans).

#### Scenario: font variable
- **WHEN** `layout.tsx` is compiled
- **THEN** `--font-body` is Inter, not DM_Sans

### Requirement: palette replacement
`globals.css` SHALL contain only DESIGN.md tokens; Material 3 vars (`--color-primary`, `--color-tertiary`, `--color-surface-container`, `--color-on-surface`, etc.) SHALL be removed.

#### Scenario: no Material 3 token remains
- **WHEN** a grep for `--color-primary` runs in globals.css
- **THEN** zero matches

#### Scenario: existing components still compile
- **WHEN** a component references a removed token after migration
- **THEN** it has been updated to the equivalent DESIGN.md token in the same change

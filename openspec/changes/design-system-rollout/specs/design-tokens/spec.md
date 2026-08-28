# design-tokens Spec

## ADDED Requirements

### Requirement: DESIGN.md palette as CSS custom properties
The system SHALL expose the DESIGN.md §1.1 palette as Tailwind v4 `@theme` custom properties: `--color-ink:#000000`, `--color-graphite:#2a272a`, `--color-slate:#4b4a54`, `--color-storm:#677381`, `--color-fog:#82a0aa`, `--color-mint:#a3cfcd`, `--color-surface:#f4f6f8`, `--color-surface-card:#ffffff`, `--color-surface-raised:#e8ecf0`.

#### Scenario: tokens resolve in Tailwind utilities
- **WHEN** a component uses `bg-mint`, `text-ink`, or `border-surface-raised`
- **THEN** the rendered color matches the DESIGN.md hex value

### Requirement: spacing, radius, and shadow tokens
The system SHALL define spacing (`--space-xs`..`--space-3xl`), radius (`--radius-sm`..`--radius-full`), and shadow (`--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-glow`) tokens per §1.3–1.4.

#### Scenario: shadow-glow uses mint
- **WHEN** an element uses `--shadow-glow`
- **THEN** it renders `0 0 20px rgba(163,207,205,0.3)`

### Requirement: typography font variables
The system SHALL set `--font-body` to Inter, `--font-display` to Space Grotesk, and `--font-mono` to JetBrains Mono via `next/font/google`.

#### Scenario: body font is Inter
- **WHEN** `npm run type-check` passes and the root layout is inspected
- **THEN** `--font-body` resolves to Inter (NOT DM_Sans)

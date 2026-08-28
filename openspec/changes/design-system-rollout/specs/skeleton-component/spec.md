# skeleton-component Spec

## ADDED Requirements

### Requirement: Skeleton component
The system SHALL provide a `Skeleton` UI component supporting variants: card, row, text, circle, and shimmer.

#### Scenario: card skeleton
- **WHEN** a list is loading
- **THEN** `Skeleton` renders rounded placeholder blocks with pulse animation

#### Scenario: shimmer variant
- **WHEN** an XP bar is loading with shimmer variant
- **THEN** it renders a moving-gradient placeholder

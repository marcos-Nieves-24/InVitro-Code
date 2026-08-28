# progress-tracking Spec

## MODIFIED Requirements

### Requirement: gamification components use DESIGN.md palette
`XPBar`, `StreakBadge`, `LevelBadge`, `ModuleProgress`, `AchievementCard` SHALL use mint accent, fog badges, ink/surface text.

#### Scenario: XPBar fill
- **WHEN** XPBar renders
- **THEN** the fill uses mint gradient, track uses surface-raised

#### Scenario: AchievementCard locked state
- **WHEN** an achievement is locked
- **THEN** it renders grayscale with a storm-colored lock icon

#### Scenario: LevelBadge ring
- **WHEN** LevelBadge renders
- **THEN** the progress ring uses mint with glow shadow

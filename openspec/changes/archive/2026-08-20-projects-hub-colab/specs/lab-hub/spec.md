# Delta for Lab Hub

## MODIFIED Requirements

### Requirement: REQ-HUB-03 Card Metadata

Each lesson card MUST show `Lesson Title`, `Difficulty`, and `Prerequisites` from `lesson.md` frontmatter, falling back to a slug-derived title when frontmatter is missing. The card MUST NOT show `Estimated Duration`.
(Previously: the card also showed `Estimated Duration` from frontmatter.)

#### Scenario: Card from frontmatter

- GIVEN a lesson with frontmatter metadata
- WHEN the hub renders its card
- THEN title, difficulty, and prereqs are displayed and no duration row appears

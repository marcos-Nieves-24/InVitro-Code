# Duration Removal Specification

## Purpose

Remove the "tiempo estimado" (Estimated Duration) display from the platform: the learn header badge and the frontmatter plumbing that feeds it. The `LabCard` duration row removal is handled by the `lab-hub` delta (REQ-HUB-03).

## Requirements

### Requirement: REQ-DUR-01 Learn header badge removal

The learn lesson header (`renderHeader`) MUST NOT render the Estimated Duration badge.

#### Scenario: No badge

- GIVEN a lesson page whose frontmatter sets `Estimated Duration`
- WHEN the header renders
- THEN no duration badge appears

### Requirement: REQ-DUR-02 Frontmatter field removal

`LessonFrontmatter` MUST NOT expose a `duration` field, and `getLessonFrontmatter` MUST NOT populate it.

#### Scenario: Field absent

- GIVEN the lesson frontmatter type
- WHEN code references frontmatter
- THEN no `duration` property is available

### Requirement: REQ-DUR-03 Inert frontmatter key

The `Estimated Duration` key in `lesson.md` frontmatter MUST remain in the files (inert), MUST NOT be read, and MUST NOT be displayed.

#### Scenario: Key left untouched

- GIVEN a lesson file containing `Estimated Duration`
- WHEN the app renders
- THEN the key stays in the file but is never surfaced in the UI

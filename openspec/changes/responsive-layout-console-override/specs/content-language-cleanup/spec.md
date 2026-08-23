# Content Language Cleanup Specification

## Purpose

All emojis MUST be removed from components and content. Spanish MUST use neutral register. Technical accuracy MUST be preserved.

## Requirements

### Requirement: REQ-CLC-01 Emoji removal from components

All emoji characters in React components MUST be replaced with Lucide icons.

#### Scenario: No emojis in components

- GIVEN any component renders
- WHEN the page loads
- THEN no emoji characters appear

### Requirement: REQ-CLC-02 Emoji removal from content

All emojis in MDX files MUST be removed.

#### Scenario: Content renders clean

- GIVEN a lesson with emojis
- WHEN the page renders
- THEN no emoji characters appear

### Requirement: REQ-CLC-03 Neutral Spanish register

Spanish text MUST use neutral register without regionalisms.

#### Scenario: Neutral language

- GIVEN Spanish text in components or content
- WHEN read by any Spanish speaker
- THEN text uses standard neutral Spanish

### Requirement: REQ-CLC-04 Technical accuracy preserved

Cleanup MUST NOT alter technical meaning, code, or math.

#### Scenario: Math and code unchanged

- GIVEN a lesson with LaTeX and Python code
- WHEN cleanup runs
- THEN content is identical to pre-cleanup

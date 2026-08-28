# lab-runner Spec

## MODIFIED Requirements

### Requirement: editor/console theming
`CodeEditor`, `ConsoleFrame`, `OutputPanel`, `PyodideRunner`, `VisualizationPanel` SHALL use ink console bg with mint prompt and light text.

#### Scenario: console frame
- **WHEN** the lab console renders
- **THEN** background is ink (#000000), prompt symbol is mint

#### Scenario: output panel
- **WHEN** code produces output
- **THEN** output text is light-on-ink, status uses mint/fog

# Console Maximize Specification

## Purpose

`ConsoleFrame` MUST support a maximized overlay state, toggled via title bar, persisted in sessionStorage, below sidebar z-index.

## Requirements

### Requirement: REQ-CM-01 Maximize overlay

When maximized, `ConsoleFrame` MUST render as fixed overlay (`z-40`) below sidebar (`z-50`).

#### Scenario: Maximize opens overlay

- GIVEN the console is normal
- WHEN the student clicks maximize
- THEN the console covers the main area as overlay

### Requirement: REQ-CM-02 Maximize button

A maximize/minimize toggle MUST be visible in the title bar.

#### Scenario: Button visible

- GIVEN the console is normal
- WHEN the title bar renders
- THEN a maximize button is clickable

### Requirement: REQ-CM-03 Session persistence

Maximized state MUST persist in `sessionStorage` across navigation but reset on new sessions.

#### Scenario: State persists

- GIVEN the console is maximized
- WHEN the student navigates away and back
- THEN the console remains maximized

### Requirement: REQ-CM-04 z-index non-conflict

Overlay MUST NOT have higher z-index than sidebar.

#### Scenario: Sidebar interactive

- GIVEN console is maximized
- WHEN student clicks sidebar
- THEN the link activates normally

### Requirement: REQ-CM-05 Flex layout adaptation

PyodideRunner MUST fill overlay space without overflow when maximized.

#### Scenario: Runner fills overlay

- GIVEN a PyodideRunner in the console
- WHEN the console is maximized
- THEN the runner fills the overlay

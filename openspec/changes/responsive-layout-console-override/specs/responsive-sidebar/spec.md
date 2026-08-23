# Responsive Sidebar Specification

## Purpose

Content containers MUST fill available space when the sidebar collapses or expands.

## Requirements

### Requirement: REQ-RS-01 Fluid content containers

Content containers MUST use fluid width filling the remaining viewport when sidebar state changes.

#### Scenario: Sidebar collapse fills content

- GIVEN the sidebar is expanded
- WHEN the student clicks collapse
- THEN content expands to fill freed space

### Requirement: REQ-RS-02 Smooth transition

Sidebar width change MUST transition over ~300ms without jank.

#### Scenario: Animated width change

- GIVEN the sidebar is visible
- WHEN toggle is activated
- THEN width animates smoothly

### Requirement: REQ-RS-03 Mobile top padding

On mobile, main element MUST include `pt-14` to avoid overlap with floating sidebar button.

#### Scenario: Mobile avoids overlap

- GIVEN a mobile viewport
- WHEN the page renders
- THEN no content is hidden behind the button

### Requirement: REQ-RS-04 Monaco re-layout

Monaco editors MUST re-layout after sidebar width change.

#### Scenario: Editor resizes with sidebar

- GIVEN a visible Monaco editor
- WHEN sidebar toggles
- THEN editor adjusts width

### Requirement: REQ-RS-05 Large screen max-width

Collapsed sidebar on large screens MUST enforce a readable max-width.

#### Scenario: Wide screen max-width

- GIVEN a ≥1440px viewport with collapsed sidebar
- WHEN content renders
- THEN line length stays within max-width

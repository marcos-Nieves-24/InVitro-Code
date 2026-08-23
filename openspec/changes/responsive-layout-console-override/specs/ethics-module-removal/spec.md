# Ethics Module Removal Specification

## Purpose

The Ethics module (`etica`) MUST be fully removed with no orphaned references.

## Requirements

### Requirement: REQ-EMR-01 Directory deletion

`src/content/modules/etica/` MUST be deleted.

#### Scenario: Directory removed

- GIVEN the ethics directory exists
- WHEN removal is applied
- THEN the directory no longer exists

### Requirement: REQ-EMR-02 Dashboard icon removal

`etica` MUST be removed from `MODULE_ICONS`.

#### Scenario: No Ethics icon

- GIVEN dashboard renders module icons
- WHEN icon map is inspected
- THEN `etica` is not present

### Requirement: REQ-EMR-03 Gamification weight removal

`etica` multiplier MUST be removed from `moduleMultipliers`.

#### Scenario: No Ethics multiplier

- GIVEN gamification utils load
- WHEN `moduleMultipliers` is inspected
- THEN `etica` is not present

### Requirement: REQ-EMR-04 Test references updated

Test files referencing `etica` MUST be updated.

#### Scenario: Tests pass

- GIVEN gamification test file
- WHEN tests run
- THEN no `etica` reference causes failure

### Requirement: REQ-EMR-05 No orphaned references

No file outside deleted directory MAY reference `etica` causing broken links.

#### Scenario: No remaining hits

- GIVEN the codebase after removal
- WHEN searching for `etica`
- THEN no references break navigation

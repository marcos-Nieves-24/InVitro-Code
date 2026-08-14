# Progress Tracking Specification

## Purpose

Track user progress in Supabase: XP, levels, daily streaks, module completion. Provide gamified UI elements (progress bars, streak counters, level badges) across the platform.

## Requirements

### Requirement: XP and Level System

The system MUST award XP for completing exercises and level up the user when they cross level thresholds (every 100 XP). XP changes MUST persist to Supabase immediately.

#### Scenario: Exercise completion awards XP

- GIVEN the user passes client-side validation for an exercise worth 25 XP
- WHEN the validation result is submitted
- THEN the user's XP increases by 25 and the new total reflects in the profile badge

#### Scenario: Level up triggers milestone

- GIVEN the user has 95 XP and completes an exercise worth 25 XP
- WHEN the XP is awarded
- THEN the user reaches level 2, XP resets to 20, and a celebratory toast is shown

### Requirement: Daily Streaks

The system MUST track consecutive days with at least one exercise completed, resetting after a missed day.

#### Scenario: Streak increments

- GIVEN the user completed an exercise yesterday and today
- WHEN today's completion is recorded
- THEN the streak counter shows 2 days and the UI displays a flame icon

#### Scenario: Missed day resets streak

- GIVEN the user had a 5-day streak but did not complete any exercise yesterday
- WHEN they complete an exercise today
- THEN the streak resets to 1 and the UI shows the new count

### Requirement: Module Progress Bar

The system MUST show a progress bar for each module indicating completed lessons vs total lessons.

#### Scenario: Progress bar updates

- GIVEN a module with 5 lessons and the user has completed 2
- WHEN viewing the module page
- THEN a progress bar shows 40% filled with "2/5 completados" label

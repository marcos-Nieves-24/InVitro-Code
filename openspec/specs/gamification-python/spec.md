# Gamification Python Specification

## Purpose

Port TypeScript gamification logic (XP, levels, streaks, achievements) to Python for execution in the FastAPI backend.

## Requirements

### Requirement: XP Calculation

The system SHALL port `calc_xp_for_lesson` with identical formulas to TypeScript.

#### Scenario: Normal lesson XP

- GIVEN a lesson with `difficulty=1` and `duration=30`
- WHEN `calc_xp_for_lesson` is called
- THEN XP equals the formula result matching TypeScript behavior

#### Scenario: Edge case zero duration

- GIVEN a lesson with `duration=0`
- WHEN `calc_xp_for_lesson` is called
- THEN it returns a minimum XP value (no division by zero)

### Requirement: Level and Rank

The system SHALL port `calc_level` and `rank_title` with identical thresholds.

#### Scenario: Level progression

- GIVEN a user with `total_xp=1500`
- WHEN `calc_level` is called
- THEN the level matches the TypeScript result for the same XP

#### Scenario: Rank title mapping

- GIVEN level 5
- WHEN `rank_title` is called
- THEN the returned title matches the TypeScript rank table

### Requirement: Total XP

The system SHALL port `get_total_xp` querying the `progress` table.

#### Scenario: Aggregated XP

- GIVEN user has completed 3 lessons with XP values 100, 150, 200
- WHEN `get_total_xp` is called for that user
- THEN it returns 450

### Requirement: Achievement Evaluation

The system SHALL port `evaluate_achievements` checking unlock conditions.

#### Scenario: Achievement unlocked

- GIVEN user has completed 5 lessons
- WHEN `evaluate_achievements` checks the "5 lessons" achievement
- THEN the achievement is marked as unlocked

#### Scenario: Achievement not yet met

- GIVEN user has completed 3 lessons
- WHEN `evaluate_achievements` checks the "5 lessons" achievement
- THEN the achievement remains locked

### Requirement: Weekly XP

The system SHALL port `get_weekly_xp` filtering to the last 7 days.

#### Scenario: Current week XP

- GIVEN user completed lessons this week totaling 300 XP
- WHEN `get_weekly_xp` is called
- THEN it returns 300

### Requirement: Modules Table

The system SHALL add a `modules` table to replace filesystem-based `getLessonCount()`.

#### Scenario: Lesson count from DB

- GIVEN the `modules` table has `lesson_count=12` for module `python`
- WHEN lesson count is queried
- THEN it returns 12 without reading the filesystem

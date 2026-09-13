# RLS Enforcement Specification

## Purpose

Enforce PostgreSQL Row-Level Security per-request using `set_config()` so existing `auth.jwt() ->> 'sub'` RLS policies work unchanged.

## Requirements

### Requirement: set_config Pattern

The system SHALL call `set_config('request.jwt.claims', '{"sub":"<user_id>"}', true)` before each query within a transaction.

#### Scenario: User reads own progress

- GIVEN user A has `set_config` applied with `sub=user_a_id`
- WHEN user A queries the `progress` table
- THEN only rows where `user_id = user_a_id` are returned

#### Scenario: User cannot read other user's data

- GIVEN user A has `set_config` applied with `sub=user_a_id`
- WHEN user A queries `progress` filtered by `user_id = user_b_id`
- THEN zero rows are returned (RLS blocks access)

### Requirement: Connection Pool RLS Setup

The system SHALL configure `set_config` on each acquired connection before executing application queries.

#### Scenario: Connection reuse

- GIVEN a connection is returned to the pool after use
- WHEN the next request acquires it
- THEN `set_config` is re-applied with the new request's `user_id`

#### Scenario: Transaction isolation

- GIVEN a request opens a transaction
- WHEN `set_config` is called within that transaction
- THEN the configuration applies only to that transaction (not the pool)

### Requirement: Parameterized Queries

The system SHALL use parameterized queries exclusively — no string concatenation of user input.

#### Scenario: Query with user input

- GIVEN a query that filters by user-provided `lesson_id`
- WHEN the query is executed
- THEN `lesson_id` is passed as a parameter, not interpolated into SQL

#### Scenario: SQL injection attempt

- GIVEN input containing `'; DROP TABLE progress; --`
- WHEN the input is used in a parameterized query
- THEN the input is treated as a literal string, no DDL executes

### Requirement: RLS Verification

The system SHALL include an integration test proving cross-user isolation.

#### Scenario: Integration test

- GIVEN two distinct user IDs in the database
- WHEN user A's RLS context is set and user B's data is queried
- THEN the result set is empty

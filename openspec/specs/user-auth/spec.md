# User Authentication Specification

## Purpose

Handle user registration, login, session management via Clerk, and sync authentication events to Supabase for profile and progress storage.

## Requirements

### Requirement: Clerk Auth

The system MUST use Clerk for authentication. All routes except the landing page MUST require authentication. Unauthenticated users MUST be redirected to `/sign-in`.

#### Scenario: User registers and logs in

- GIVEN an unauthenticated user at `/sign-in`
- WHEN they complete Clerk registration with email + Google OAuth
- THEN they are redirected to `/dashboard` with an active session

#### Scenario: Unauthenticated user blocked

- GIVEN an unauthenticated user
- WHEN they request `/learn/hola-mundo/intro`
- THEN they are redirected to `/sign-in` and the original URL is preserved as redirect target

### Requirement: Webhook Profile Sync

The system MUST sync Clerk user creation events to Supabase via webhook, creating a profile row with `clerk_id`, `email`, and `display_name`.

#### Scenario: New user creates profile

- GIVEN a Clerk `user.created` webhook arrives
- WHEN the API route `/api/webhooks/clerk` processes it
- THEN a new row in `public.users` is created with the Clerk user data

#### Scenario: Duplicate webhook ignored

- GIVEN a user already exists in Supabase
- WHEN a duplicate `user.created` webhook arrives
- THEN the API returns 200 and does NOT create a duplicate row

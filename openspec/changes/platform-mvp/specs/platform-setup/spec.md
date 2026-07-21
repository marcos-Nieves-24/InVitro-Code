# Platform Setup Specification

## Purpose

Scaffold the Next.js 15 project with App Router, TypeScript, Tailwind CSS, shadcn/ui, and Vercel deployment config — the foundation all other capabilities build on.

## Requirements

### Requirement: Project Scaffold

The system MUST provide a Next.js 15 App Router scaffold with TypeScript strict mode, Tailwind CSS v4, and shadcn/ui components installed.

#### Scenario: Build succeeds

- GIVEN a clean checkout with `npm install` run
- WHEN `npm run build` executes
- THEN the build exits with code 0 and produces a `.next/` directory

#### Scenario: Dev server starts

- GIVEN installed dependencies
- WHEN `npm run dev` starts
- THEN the server listens on `localhost:3000` and serves the dashboard page

### Requirement: Deployment Configuration

The system MUST include Vercel configuration and scripts for production deployment.

#### Scenario: Deploy to Vercel

- GIVEN the repo is linked to Vercel
- WHEN a push to `main` triggers a deploy
- THEN the app is available at the production URL with all routes working

#### Scenario: Missing env vars blocks build

- GIVEN required env vars (NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY, NEXT_PUBLIC_SUPABASE_URL) are not set
- WHEN `npm run build` executes
- THEN the build fails with a clear missing-env error message

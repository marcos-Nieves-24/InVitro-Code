# Feature: learn-redirect-url

## Objective
Preserve redirect_url with ?search for /learn index and lesson, and consume it at login.

## Problem
Middleware drops ?search, AuthForm ignores redirect_url, learn pages have no auth gate.

## Scope
- src/middleware.ts
- src/app/learn/page.tsx
- src/app/learn/[module]/[slug]/page.tsx
- src/components/auth/AuthForm.tsx
- src/components/auth/SocialButtons.tsx

## Tasks
### T1 — Middleware preserve search [x]
### T2 — learn/page.tsx auth with redirect_url [x]
### T3 — learn lesson auth with redirect_url [x]
### T4 — AuthForm/SocialButtons consume redirect_url [x]

## Verification
- type-check, build, Playwright /learn and /learn/ia/lesson01?slide=3 without auth -> 302 with redirect_url, after login back to same URL

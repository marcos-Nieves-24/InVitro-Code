# Profiles Frontend / UX — Excalidraw Proposal + Floating Conecta Widget

**Branch:** `feat/profiles-frontend-ux` @ `d50c776` (base `main`) · **Worktree:** `/home/biohacker24/proyectos/invitro-code-worktrees/feat-profiles-frontend-ux` · **Runner:** `npm run type-check` + `npm run build` · **TDD:** `strict_tdd: false` · **Delivery:** `ask-on-risk`

## Objective
Transform `/perfil` from a vertical CRUD form (ProfileCard + AvatarUpload + ProfileForm) into the social profile proposed in `UX-design.excalidraw` — **PROPUESTA MEJORADA - PERFILES** — with a hero identity, social metrics, and a **floating Conecta widget**. Keep Clerk as auth, Supabase RLS (`auth.jwt() ->> 'sub'`), and gender-consent (art. 6 Ley 1581) intact. Dependency direction: `domain <- application <- infrastructure <- presentation`.

## Context / Source of Truth
- **Design source:** `/home/biohacker24/Descargas/UX-design.excalidraw` — container `1379×653` at `-125,1840`, title `PROPUESTA MEJORADA - PERFILES` at `-91,1766`.
  - **Col Left (621×440 @ -64,1990):** Avatar large, `Username`, `Fecha de unión`, `Posición en leaderboard` (+ box 202×150). Identity hero.
  - **Col Center (269×372 @ 579,1988):** `Siguiendo | Seguidores` headers (588,2007 / 721,2008) + 3 `username` rows with avatars (664,2095 etc.) + `Conectar` CTA (626,2294). Following list.
  - **Col Right (317×423 @ 873,1999):** `Conecta` header + 4 `username` + 4 `Conectar` buttons (1079,2104 etc.). Suggested users.
  - **Header nav:** Expedicciones | Laboratorios | Proyectos | Misiones | Dashboard | logros | Comunidad | username (via `InVitroShell`).
- **Current implementation (baseline to replace):** `src/app/(dashboard)/perfil/page.tsx` → `ProfileCard.tsx` + `AvatarUpload.tsx` + `ProfileForm.tsx` (max-w-2xl stack). Functional but no social layer.
- **Wireframes folder:** referenced by user as `wireframes/` — does not exist in repo (verified via `find`); current code is taken as "current wireframe".
- **Data:** `profiles` table has no `followers`/`following` table (checked `supabase-migration.sql` — no follow table, only `get_leaderboard` / `get_leaderboard_rank`). Social counts will be mocked behind an application port until migration.

## Specs
- **S1 — Hero Identity (Excalidraw fidelity):** Avatar ≥96px (desktop 120px), Username (font-display 2xl), `Fecha de unión` (from `profiles.created_at`), `Posición en leaderboard` (from `get_leaderboard_rank`), bio. Must match left column proportions; avatar fallback = initials. Preserves `getDisplayName()` logic.
- **S2 — Siguiendo / Seguidores:** Two counters + lists (3 rows each in wireframe). Center column 269×372 ratio, headers `Siguiendo` / `Seguidores`, avatar 50×48 + username per row. Reads via `ProfileSocialRepository` port (mock returns 3 users); no hard Supabase import in domain/application.
- **S3 — Floating Conecta Widget (required):** NOT inline — `position: fixed` bottom-right (desktop) / slide-over drawer on mobile. Contains: header `Conecta`, 4 suggested users (avatar + username + `Conectar` button 89×25), close/minimize, backdrop on mobile, `aria-dialog` + focus trap, `ESC` to close. Must not push layout; overlays content with `z-50`. Trigger via floating action button (FAB) when collapsed.
- **S4 — Layout 3-column responsive:** Grid `lg:grid-cols-[621px_269px_317px]` (mirrors Excalidraw 621/269/317) with gap-6, collapses to single column on `max-lg`. Outer container `max-w-[1379px]` centered. Keeps `InVitroShell` header/nav untouched.
- **S5 — Preserve existing mutations:** Avatar upload (validateAvatar, storage `avatars/`, `getPublicUrl`, cleanup old avatar, `revalidatePath`) and ProfileForm (username/bio/gender + `hasGenderConsent` check for `x`) must stay functional inside new layout. No anon key for writes; `createAdminClient()` + `auth()`.
- **S6 — A11y & performance:** Keyboard operable (Tab, ESC, focus ring `focus-visible:ring-mint`), contrasts ≥4.5:1, reduced-motion respected. No layout shift on load; widget lazy-mounted. `npm run type-check` + `npm run build` green.

## Tasks
- [x] **T1 — Domain/Application port for social** | S2,S3 | `src/domain/profile/social.ts` (types `SocialUser`, `SocialCounts`), `src/application/ports/ProfileSocialRepository.ts` (interface `getFollowing(userId): SocialUser[]`, `getSuggested(userId): SocialUser[]`, `getCounts`), mock `src/infrastructure/profile/MockProfileSocialRepository.ts` | route: inline (parent, 3 files, no vendor in domain) | done 2026-10-25 | commit: b0287a9
- [x] **T2 — ProfileHero (left column)** | S1,S5 | `src/components/profile/ProfileHero.tsx` (new, replaces/augments ProfileCard for hero; large avatar, Username, Fecha de unión, leaderboard rank, bio), styles mirror 621×440 | route: inline (parent) | done 2026-10-25 | commit: b0287a9
- [ ] **T3 — FollowStats (center column)** | S2 | `src/components/profile/FollowStats.tsx` (Siguiendo/Seguidores headers, 3 rows + avatars, Conectar CTA) | route: delegated | acceptance: uses port, 3 rows, responsive
- [ ] **T4 — ConectaFloatingWidget (floating, not inline)** | S3 | `src/components/profile/ConectaFloatingWidget.tsx` + `ConectaFAB.tsx` (fixed bottom-right, collapsible, drawer on mobile, focus trap, ESC, backdrop) | route: delegated | acceptance: fixed overlay, does not affect layout flow, a11y dialog, 4 suggestions
- [ ] **T5 — Perfil page layout 3-col** | S4,S5,S6 | `src/app/(dashboard)/perfil/page.tsx` restructure to grid `621/269/317`, integrate T2+T3, keep AvatarUpload + ProfileForm in left column card, mount T4 as floating overlay, pass `created_at` + leaderboard rank | route: delegated (touches only perfil page) | acceptance: desktop 3-col, mobile single-col, mutations still work, type-check green
- [ ] **T6 — Verification** | S6 | `npm run type-check` + `npm run build` + manual check (keyboard, ESC, focus, reduced-motion, no layout shift) | route: parent inline | acceptance: both gates green, widget does not push content

## Log
- **L1 (2026-10-25):** User request: "crea una rama para trabaja en el frontend y UX de profiles" → branch `feat/profiles-frontend-ux` @ d50c776, isolated worktree `/home/biohacker24/proyectos/invitro-code-worktrees/feat-profiles-frontend-ux` (restored main worktree to `feat/expediciones-polish` after accidental checkout).
- **L2 (2026-10-25):** "revisa el profile de /home/biohacker24/Descargas/UX-design.excalidraw y revisa el actual que se encuentra en wireframes/" → audited Excalidraw (PROPUESTA MEJORADA - PERFILES, 3 cols 621/269/317, hero + siguiendo/seguidores + conecta) vs current `perfil/page.tsx` (max-w-2xl stack, ProfileCard/AvatarUpload/ProfileForm). `wireframes/` does not exist in repo; current code used as baseline.
- **L3 (2026-10-25):** "arma el plan para crea el frontend/UX del excalidraw que te mostre. para el widget conecta, que se un flotante." → this plan. Floating requirement captured in S3/T4 (fixed overlay, not inline).

## Route declaration
T1-T5: delegated writers (disjoint surfaces: domain/port vs 3 components vs page layout). T6: parent inline verification. No parallel writers on same file; parent owns git.

## Verification
- `npm run type-check` must pass (no `any` in new ports).
- `npm run build` must pass (no anon key, RLS via `auth.jwt() ->> 'sub'` unchanged).
- Manual: hero shows fecha unión + leaderboard rank, center shows 3 following, floating widget overlays without layout shift, ESC closes, FAB reopens, Tab trap works, mobile drawer with backdrop.

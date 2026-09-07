# Exploration: perfil-admin-config

## Current State

### Database Schema (profiles table)

**`supabase-migration.sql`** — Current `profiles` table:
```sql
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,          -- Clerk user ID
  email TEXT,
  username TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**RLS Policies:**
- `users can read own profile` — SELECT WHERE `auth.jwt() ->> 'sub' = id`
- `users can update own profile` — UPDATE WHERE `auth.jwt() ->> 'sub' = id`

**No admin policies exist.** No avatar, bio, or role columns.

### Clerk Webhook (`src/app/api/webhooks/clerk/route.ts`)

Handles `user.created` event only:
```typescript
await admin.from("profiles").upsert({
  id,
  email,
  username: first_name ?? email.split("@")[")[0],
});
```

**Missing:** No handler for `user.updated` or `user.deleted`. No avatar sync.

### Auth Middleware (`src/proxy.ts`)

Public routes: `/`, `/sign-in`, `/sign-up`, `/api/webhooks/clerk`, `/api/diagnose`
All other routes require Clerk auth. No role-based access control.

### Sidebar Navigation (`src/components/layout/AppSidebar.tsx`)

8 nav items: Inicio, Expediciones, Laboratorios, Proyectos, Misiones, Dashboard, Logros, Comunidad.
**No profile/settings/admin links.** User card at bottom shows initials + name.

### Dashboard Layout (`src/components/layout/InVitroShell.tsx`)

Wraps dashboard pages with `AppSidebar`. Accepts `userName`, `userMeta`, `topBar` props.
Used by: dashboard, laboratorios, proyectos, logros, niveles, comunidad pages.

### Existing Pages

No `/profile`, `/settings`, or `/admin` routes exist.

### UI Components Available

- `Button` — primary/secondary/ghost, sm/md/lg, supports `href` for Link mode
- `Card` — sm/md/lg padding, rounded-card border
- `Callout`, `EmptyState`, `PageShell`, `SiteHeader`, `Skeleton`
- No form components, no modal, no data table (except lesson-specific `InteractiveTable`)

### Supabase Client Pattern

- Server-side: `createAdminClient()` uses `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS)
- Client-side: Uses Clerk JWT via `auth.jwt() ->> 'sub'` for RLS
- All dashboard pages use server components with `auth()` from Clerk

### ProfileLike Interface (`src/lib/gamification/user.ts`)

```typescript
export interface ProfileLike {
  username?: string | null;
  email?: string | null;
}
```

Used by `getDisplayName()` — username → email prefix → "Investigador" fallback.

---

## Affected Areas

| File | Why |
|------|-----|
| `supabase-migration.sql` | Add columns: `avatar_url`, `bio`, `role` |
| `src/app/api/webhooks/clerk/route.ts` | Add `user.updated` handler for avatar sync |
| `src/proxy.ts` | Add admin route protection, role-based checks |
| `src/components/layout/AppSidebar.tsx` | Add profile/settings/admin nav items |
| `src/components/layout/InVitroShell.tsx` | Pass role info to sidebar |
| `src/lib/gamification/user.ts` | Extend `ProfileLike` with new fields |
| `src/app/(dashboard)/dashboard/page.tsx` | Reference new profile fields |

**New files to create:**
- `src/app/(dashboard)/profile/page.tsx` — Profile page
- `src/app/(dashboard)/settings/page.tsx` — Settings page
- `src/app/(dashboard)/admin/page.tsx` — Admin panel
- `src/app/api/profile/route.ts` — Profile API
- `src/app/api/admin/users/route.ts` — Admin user list API
- `src/components/profile/` — Profile form components
- `src/components/admin/` — Admin panel components
- `src/components/settings/` — Settings form components
- New migration for role/settings tables

---

## Approaches

### 1. Extend profiles + new user_settings table

**Add to profiles:** `avatar_url TEXT`, `bio TEXT`, `role TEXT DEFAULT 'user'`
**New table:** `user_settings` for preferences (theme, notifications)

- Pros: Clean separation of concerns, role lives with user identity
- Cons: Two tables to manage, more complex queries
- Effort: Medium

### 2. Extend profiles only (everything in one row)

**Add to profiles:** `avatar_url`, `bio`, `role`, `theme`, `notifications_enabled`

- Pros: Simple queries, single source of truth
- Cons: Profiles row gets wide, settings changes cause profile updates
- Effort: Low

### 3. Clerk User Metadata for role + Supabase for profile data

**Clerk:** Store `role` in public metadata
**Supabase:** `profiles` gets `avatar_url`, `bio`; new `user_settings` for preferences

- Pros: Role lives in auth provider, profile data separate
- Cons: Dual source of truth for role, Clerk metadata sync complexity
- Effort: Medium-High

---

## Recommendation

**Approach 1** (Extend profiles + user_settings table):

1. **profiles table** gets `avatar_url`, `bio`, `role` columns
2. **New `user_settings` table** for preferences (theme, notifications, language)
3. **Clerk webhook** handles `user.created` + `user.updated` (avatar sync)
4. **Admin RLS policies** check `role = 'admin'` via subquery
5. **New pages:** `/profile`, `/settings`, `/admin` (admin-only)
6. **Sidebar** adds links based on role

This keeps the existing pattern (Clerk for auth, Supabase for data, RLS for access) and adds role-based access cleanly.

---

## Risks

1. **Clerk avatar sync** — Clerk's `user.updated` webhook must be configured; avatar URL may need to be stored separately if Clerk doesn't expose it reliably
2. **RLS for admin** — Admin policies need a subquery to check role, which adds query cost; consider using `createAdminClient()` for admin API routes instead
3. **Theme persistence** — Dark/light theme needs client-side state + server-side persistence; next-themes or custom solution
4. **Password management** — Clerk handles passwords natively; no Supabase password column needed
5. **Migration ordering** — New columns/tables must be added after existing data; backward compatible

---

## Ready for Proposal

**Yes** — The exploration is complete. The orchestrator should:
1. Confirm the data model approach (profiles + user_settings)
2. Ask if Clerk avatar sync is needed or if manual upload is sufficient
3. Proceed to proposal phase with clear scope

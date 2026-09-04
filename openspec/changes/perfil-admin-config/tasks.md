# Tasks: perfil-admin-config

## Tasks

### Phase 1: Database & Backend (Estimated: 200 lines)

#### Task 1.1: Database Migration
- [x] Create SQL migration to add columns to profiles table
- [x] Add role, avatar_url, bio, theme, notification_prefs, is_banned, last_active_at
- [x] Create is_admin() function
- [ ] Update RLS policies for admin access
- Files: supabase-migration.sql

#### Task 1.2: Profile API Route
- [x] Create GET /api/profile endpoint
- [x] Create PUT /api/profile endpoint
- [x] Create POST /api/profile/avatar endpoint
- [x] Handle avatar upload to Supabase Storage
- Files: src/app/api/profile/route.ts, src/app/api/profile/avatar/route.ts

#### Task 1.3: Admin API Routes
- [x] Create GET /api/admin/users endpoint
- [x] Create PUT /api/admin/users/[id] endpoint
- [x] Create GET /api/admin/stats endpoint
- [x] Add admin role check middleware
- Files: src/app/api/admin/users/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/admin/stats/route.ts

### Phase 2: UI Components (Estimated: 300 lines)

#### Task 2.1: Profile Components
- [x] Create ProfileCard component
- [x] Create ProfileForm component
- [x] Create AvatarUpload component
- Files: src/components/profile/ProfileCard.tsx, src/components/profile/ProfileForm.tsx, src/components/profile/AvatarUpload.tsx

#### Task 2.2: Admin Components
- [x] Create AdminDashboard component
- [x] Create UsersTable component
- [ ] Create UserActions component
- Files: src/components/admin/AdminDashboard.tsx, src/components/admin/UsersTable.tsx, src/components/admin/UserActions.tsx

#### Task 2.3: Settings Components
- [x] Create SettingsForm component
- [ ] Create ThemeToggle component
- Files: src/components/settings/SettingsForm.tsx, src/components/settings/ThemeToggle.tsx

### Phase 3: Pages & Integration (Estimated: 200 lines)

#### Task 3.1: Profile Page
- [x] Create /perfil page
- [x] Integrate ProfileCard, ProfileForm, AvatarUpload
- [ ] Add stats display (level, XP, streak, achievements)
- Files: src/app/(dashboard)/perfil/page.tsx

#### Task 3.2: Admin Page
- [x] Create /admin page with role protection
- [x] Integrate AdminDashboard, UsersTable, UserActions
- [ ] Add KPIs and user statistics
- Files: src/app/(dashboard)/admin/page.tsx

#### Task 3.3: Settings Page
- [x] Create /configuracion page
- [x] Integrate SettingsForm, ThemeToggle
- [ ] Add notification preferences
- Files: src/app/(dashboard)/configuracion/page.tsx

### Phase 4: Navigation & Middleware (Estimated: 100 lines)

#### Task 4.1: Update Sidebar
- [x] Add "Perfil" nav item
- [x] Add "Configuración" nav item
- [x] Add conditional "Admin" nav item
- [x] Update user card to link to /perfil
- Files: src/components/layout/AppSidebar.tsx

#### Task 4.2: Update Middleware
- [x] Add admin route protection
- [x] Add role check function
- Files: src/proxy.ts

#### Task 4.3: Theme Integration
- [x] Update InVitroShell to apply theme
- [x] Add system preference detection
- Files: src/components/layout/InVitroShell.tsx

### Phase 5: Webhook & Sync (Estimated: 50 lines)

#### Task 5.1: Update Clerk Webhook
- [x] Add role: 'user' default on user.created
- [x] Sync avatar_url if available
- Files: src/app/api/webhooks/clerk/route.ts

## Total Estimated Lines: ~850
## Risk: Medium (new features, no breaking changes)
## Dependencies: Clerk auth, Supabase storage, existing UI components
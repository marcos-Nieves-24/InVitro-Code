# Proposal: perfil-admin-config

## Intent
Add comprehensive user management: profile pages, admin dashboard, and user settings with role-based access control.

## Scope
- User profile page with avatar, username, email, bio
- Admin panel with user list, stats, ban/block functionality
- User settings for notifications, preferences, theme
- Role-based access (admin/user)
- Backend API routes for all operations

## Approach
1. **Database**: Extend profiles table with role, avatar_url, bio, theme, notification_prefs, is_banned
2. **API Routes**: Create REST endpoints for profile, admin, settings
3. **UI Pages**: New pages for /perfil, /admin, /configuracion
4. **Middleware**: Add role-based route protection
5. **Components**: Reusable profile, admin, settings components

## Non-Goals
- Multi-factor authentication (Clerk handles)
- Password reset (Clerk handles)
- User registration flow (Clerk handles)
- Complex admin permissions (simple admin/user roles only)

## First Slice
Phase 1: Database migration + basic profile page
Phase 2: Admin panel + user management
Phase 3: Settings + theme integration
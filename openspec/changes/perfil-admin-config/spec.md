# Spec: perfil-admin-config

## Requirements

### REQ-PROFILE-01: User Profile Page
- Route: /perfil
- Display: avatar, username, email (readonly), bio, level, XP, streak, achievements
- Edit: username, bio, avatar (click-to-edit)
- Password: redirect to Clerk UserProfile component

### REQ-PROFILE-02: Avatar Upload
- Store in Supabase Storage bucket 'avatars'
- Max size: 2MB
- Formats: JPG, PNG, WebP
- Auto-resize to 200x200

### REQ-ADMIN-01: Admin Panel
- Route: /admin (protected, admin only)
- KPIs: total users, active today, active this week, banned users
- User table: name, email, XP, level, streak, status, registration date
- Actions: view profile, ban/unban, change role

### REQ-ADMIN-02: Role-Based Access
- Roles: 'user' (default), 'admin'
- Admin check: email matches configured admin email
- Middleware: protect /admin routes
- UI: show/hide admin nav item based on role

### REQ-SETTINGS-01: User Settings
- Route: /configuracion
- Preferences: theme (light/dark/system), language (future)
- Notifications: email notifications toggle, streak reminders
- Account: change password (Clerk), delete account

### REQ-THEME-01: Dark/Light Theme
- Persist in profiles.theme
- Apply via class on <html> element
- System preference detection
- Toggle in settings and header

## Scenarios

### Scenario 1: User Views Profile
1. User navigates to /perfil
2. System displays avatar, username, email, bio, stats
3. User can click edit to modify username/bio
4. User can click avatar to upload new photo

### Scenario 2: Admin Views Dashboard
1. Admin navigates to /admin
2. System displays KPIs and user table
3. Admin can search/filter users
4. Admin can ban/unban users

### Scenario 3: User Changes Theme
1. User navigates to /configuracion
2. User selects dark theme
3. System persists preference to profiles.theme
4. System applies dark class to <html>
5. Theme persists across sessions

### Scenario 4: Non-Admin Tries Admin Route
1. Non-admin user navigates to /admin
2. Middleware checks role
3. System redirects to /dashboard
4. User sees no admin nav item
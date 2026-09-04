# Design: perfil-admin-config

## Architecture

### Database Schema Changes
```sql
-- Add to profiles table
ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user';
ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN bio TEXT;
ALTER TABLE profiles ADD COLUMN theme TEXT DEFAULT 'system';
ALTER TABLE profiles ADD COLUMN notification_prefs JSONB DEFAULT '{"email": true, "streak": true}'::jsonb;
ALTER TABLE profiles ADD COLUMN is_banned BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN last_active_at TIMESTAMPTZ;

-- Admin check function
CREATE OR REPLACE FUNCTION is_admin(user_id TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id AND role = 'admin'
  );
$$ LANGUAGE sql STABLE;
```

### API Routes
```
GET    /api/profile           - Get current user profile
PUT    /api/profile           - Update profile (username, bio, theme, notifs)
POST   /api/profile/avatar    - Upload avatar to Supabase Storage

GET    /api/admin/users       - List all users (admin only)
PUT    /api/admin/users/[id]  - Update user role/status (admin only)
GET    /api/admin/stats       - Get user statistics (admin only)
```

### Pages
```
/perfil           - User profile page
/admin            - Admin dashboard (protected)
/configuracion    - User settings page
```

### Components
```
src/components/profile/
  ProfileCard.tsx       - Avatar + basic info
  ProfileForm.tsx       - Edit form (username, bio)
  AvatarUpload.tsx      - Camera/crop upload

src/components/admin/
  AdminDashboard.tsx    - KPIs + user table
  UsersTable.tsx        - User list with actions
  UserActions.tsx       - Ban/unban, role change

src/components/settings/
  SettingsForm.tsx      - Preferences, notifications, account
  ThemeToggle.tsx       - Dark/light/system toggle
```

### Middleware Updates
```typescript
// src/proxy.ts
const adminRoutes = ['/admin'];

// Check role for admin routes
if (adminRoutes.some(route => pathname.startsWith(route))) {
  const isAdmin = await checkUserRole(session.userId);
  if (!isAdmin) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
}
```

### Theme Integration
```typescript
// src/components/layout/InVitroShell.tsx
// Read theme from profile, apply to <html> element
useEffect(() => {
  document.documentElement.classList.remove('light', 'dark');
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.add(prefersDark ? 'dark' : 'light');
  } else {
    document.documentElement.classList.add(theme);
  }
}, [theme]);
```

### File Structure
```
src/app/(dashboard)/
  perfil/page.tsx
  admin/page.tsx
  configuracion/page.tsx

src/app/api/
  profile/route.ts
  profile/avatar/route.ts
  admin/users/route.ts
  admin/users/[id]/route.ts
  admin/stats/route.ts

src/components/
  profile/ProfileCard.tsx
  profile/ProfileForm.tsx
  profile/AvatarUpload.tsx
  admin/AdminDashboard.tsx
  admin/UsersTable.tsx
  admin/UserActions.tsx
  settings/SettingsForm.tsx
  settings/ThemeToggle.tsx
```
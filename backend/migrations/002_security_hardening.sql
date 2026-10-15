-- +=======================================================================+
-- | Hardening: security + performance                                   |
-- | READ WITH CARE BEFORE APPLYING. Wrapped in TX for atomicity.        |
-- +=======================================================================+
BEGIN;

-- 1. Mutable search_path on SQL/PLpgSQL functions
ALTER FUNCTION public.get_leaderboard(integer) SET search_path = 'public';
ALTER FUNCTION public.get_leaderboard_rank(text) SET search_path = 'public';
ALTER FUNCTION public.is_admin(text) SET search_path = 'public';
ALTER FUNCTION public.set_lab_progress_updated_at() SET search_path = '';

-- 2. Missing index on FK (performance advisor)
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id
  ON public.user_achievements(achievement_id);

-- 3. RLS initplan: wrap auth.*() in SELECT (performance advisor)
ALTER POLICY "authenticated can read achievements" ON public.achievements USING ((((SELECT auth.jwt()) ->> 'sub'::text) IS NOT NULL));
ALTER POLICY "users can manage own bookmarks" ON public.bookmarks USING ((((SELECT auth.jwt()) ->> 'sub'::text) = user_id)) WITH CHECK ((((SELECT auth.jwt()) ->> 'sub'::text) = user_id));
ALTER POLICY "users can delete own consent_logs" ON public.consent_logs USING ((((SELECT auth.jwt()) ->> 'sub'::text) = user_id));
ALTER POLICY "users can read own consent_logs" ON public.consent_logs USING ((((SELECT auth.jwt()) ->> 'sub'::text) = user_id));
ALTER POLICY "users can delete own lab_progress" ON public.lab_progress USING ((((SELECT auth.jwt()) ->> 'sub'::text) = user_id));
ALTER POLICY "users can insert own lab_progress" ON public.lab_progress WITH CHECK ((((SELECT auth.jwt()) ->> 'sub'::text) = user_id));
ALTER POLICY "users can read own lab_progress" ON public.lab_progress USING ((((SELECT auth.jwt()) ->> 'sub'::text) = user_id));
ALTER POLICY "users can update own lab_progress" ON public.lab_progress USING ((((SELECT auth.jwt()) ->> 'sub'::text) = user_id)) WITH CHECK ((((SELECT auth.jwt()) ->> 'sub'::text) = user_id));
ALTER POLICY "authenticated can read modules" ON public.modules USING ((((SELECT auth.jwt()) ->> 'sub'::text) IS NOT NULL));
ALTER POLICY "admin can read all profiles" ON public.profiles USING (is_admin(((SELECT auth.jwt()) ->> 'sub'::text)));
ALTER POLICY "users can delete own profile" ON public.profiles USING ((((SELECT auth.jwt()) ->> 'sub'::text) = id));
ALTER POLICY "users can read own profile" ON public.profiles USING ((((SELECT auth.jwt()) ->> 'sub'::text) = id));
ALTER POLICY "users can update own profile" ON public.profiles USING ((((SELECT auth.jwt()) ->> 'sub'::text) = id)) WITH CHECK ((((SELECT auth.jwt()) ->> 'sub'::text) = id));
ALTER POLICY "admin can read all progress" ON public.progress USING (is_admin(((SELECT auth.jwt()) ->> 'sub'::text)));
ALTER POLICY "users can delete own progress" ON public.progress USING ((((SELECT auth.jwt()) ->> 'sub'::text) = user_id));
ALTER POLICY "users can insert own progress" ON public.progress WITH CHECK ((((SELECT auth.jwt()) ->> 'sub'::text) = user_id));
ALTER POLICY "users can read own progress" ON public.progress USING ((((SELECT auth.jwt()) ->> 'sub'::text) = user_id));
ALTER POLICY "users can update own progress" ON public.progress USING ((((SELECT auth.jwt()) ->> 'sub'::text) = user_id)) WITH CHECK ((((SELECT auth.jwt()) ->> 'sub'::text) = user_id));
ALTER POLICY "admin can read all reflections" ON public.reflection_completions USING (is_admin(((SELECT auth.jwt()) ->> 'sub'::text)));
ALTER POLICY "users can delete own reflection_completions" ON public.reflection_completions USING ((((SELECT auth.jwt()) ->> 'sub'::text) = user_id));
ALTER POLICY "users can insert own reflections" ON public.reflection_completions WITH CHECK ((((SELECT auth.jwt()) ->> 'sub'::text) = user_id));
ALTER POLICY "users can read own reflections" ON public.reflection_completions USING ((((SELECT auth.jwt()) ->> 'sub'::text) = user_id));
ALTER POLICY "admin can read all streaks" ON public.streaks USING (is_admin(((SELECT auth.jwt()) ->> 'sub'::text)));
ALTER POLICY "users can delete own streaks" ON public.streaks USING ((((SELECT auth.jwt()) ->> 'sub'::text) = user_id));
ALTER POLICY "users can insert own streaks" ON public.streaks WITH CHECK ((((SELECT auth.jwt()) ->> 'sub'::text) = user_id));
ALTER POLICY "users can read own streaks" ON public.streaks USING ((((SELECT auth.jwt()) ->> 'sub'::text) = user_id));
ALTER POLICY "users can update own streaks" ON public.streaks USING ((((SELECT auth.jwt()) ->> 'sub'::text) = user_id)) WITH CHECK ((((SELECT auth.jwt()) ->> 'sub'::text) = user_id));
ALTER POLICY "users can delete own user_achievements" ON public.user_achievements USING ((((SELECT auth.jwt()) ->> 'sub'::text) = user_id));
ALTER POLICY "users can insert own unlocks" ON public.user_achievements WITH CHECK ((((SELECT auth.jwt()) ->> 'sub'::text) = user_id));
ALTER POLICY "users can read own unlocks" ON public.user_achievements USING ((((SELECT auth.jwt()) ->> 'sub'::text) = user_id));

-- 4. Column-level guardrail: prevent self-escalation
--  (sensitive columns should be writable only via service role)
REVOKE UPDATE (role, is_banned, consent_status, consent_version, pending_since, daily_goal_xp) ON public.profiles FROM anon, authenticated;
REVOKE UPDATE (xp_earned) ON public.progress FROM anon, authenticated;
REVOKE UPDATE (current_streak, longest_streak, freezes_available, last_freeze_used) ON public.streaks FROM anon, authenticated;

-- 5. Retention: keep consent audit append-only
--  (disable DELETE policy for audit purposes; comment-out to keep)
-- NOTE: self-delete on consent_logs retained; apply a trigger to retain soft-delete evidence in a policy pass.

COMMIT;

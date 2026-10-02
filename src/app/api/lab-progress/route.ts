import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getLessonSlugs } from "@/lib/content/modules";
import { calcXpForLesson } from "@/lib/gamification/utils";
import { capLastPosition, labProgressPostSchema } from "@/lib/validation/labProgress";
import { advanceStreak } from "@/lib/gamification/streak";

// Persistence uses createAdminClient() (service-role + requireEnv(SUPABASE_SERVICE_ROLE_KEY)).
// RLS: Clerk is the ONLY auth provider — policies compare (auth.jwt() ->> 'sub') = user_id, never auth.uid().
// Route is intentionally NOT in src/middleware.ts publicRoutes: anon GET/POST → 401 {error:"Unauthorized"} via auth() guard (API→401, pages→redirect).
// Rollback: DROP TABLE IF EXISTS lab_progress; ALTER PUBLICATION supabase_realtime DROP TABLE lab_progress;

// GET /api/lab-progress?module=python
// 401 if no session; 200 {data: LabProgressRow[]} (missing ?module → all; unknown → [])
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();
    const moduleParam = request.nextUrl.searchParams.get("module");

    let query = supabase
      .from("lab_progress")
      .select("module_slug, lesson_slug, completion_status, completion_date, last_position, updated_at")
      .eq("user_id", userId);

    if (moduleParam) {
      query = query.eq("module_slug", moduleParam);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data ?? [] }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/lab-progress
// Body: {module_slug, lesson_slug, completion_status?, last_position?}
// 401 auth; 400 Invalid module/lesson | Invalid last_position; 500 unexpected; 200 {data: row}
// Idempotent upsert on PK (user_id,module_slug,lesson_slug); dual-write to progress on completed
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Ignore any user_id injected by client — derive exclusively from auth()
    if (body !== null && typeof body === "object" && "user_id" in (body as Record<string, unknown>)) {
      const { user_id: _ignored, ...rest } = body as Record<string, unknown> & { user_id?: unknown };
      body = rest;
    }

    // Distinguish last_position shape error from module/lesson error
    if (
      body !== null &&
      typeof body === "object" &&
      "last_position" in (body as Record<string, unknown>) &&
      (body as Record<string, unknown>).last_position !== null &&
      (body as Record<string, unknown>).last_position !== undefined &&
      typeof (body as Record<string, unknown>).last_position !== "object"
    ) {
      return NextResponse.json({ error: "Invalid last_position" }, { status: 400 });
    }
    if (
      body !== null &&
      typeof body === "object" &&
      "last_position" in (body as Record<string, unknown>) &&
      Array.isArray((body as Record<string, unknown>).last_position)
    ) {
      return NextResponse.json({ error: "Invalid last_position" }, { status: 400 });
    }

    const parsed = labProgressPostSchema.safeParse(body);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const path = issue?.path?.[0] as string | undefined;
      if (path === "last_position") {
        return NextResponse.json({ error: "Invalid last_position" }, { status: 400 });
      }
      if (path === "module_slug" || path === "lesson_slug" || path === "completion_status") {
        // completion_status enum failure is also 400 but use generic message for module/lesson
        if (path === "completion_status") {
          return NextResponse.json({ error: "Invalid completion_status" }, { status: 400 });
        }
        return NextResponse.json({ error: "Invalid module/lesson" }, { status: 400 });
      }
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { module_slug, lesson_slug, completion_status, last_position } = parsed.data;

    // Allowlist: module/lesson must exist on filesystem (getLessonSlugs)
    const slugs = getLessonSlugs(module_slug);
    if (!slugs.includes(lesson_slug)) {
      return NextResponse.json({ error: "Invalid module/lesson" }, { status: 400 });
    }

    // Validate last_position shape: must be plain object when provided (Zod already ensures, extra guard)
    if (last_position !== undefined && last_position !== null && typeof last_position !== "object") {
      return NextResponse.json({ error: "Invalid last_position" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Fetch existing row to preserve completion_date idempotency and merge state
    const { data: existing, error: fetchError } = await supabase
      .from("lab_progress")
      .select("completion_status, completion_date, last_position")
      .eq("user_id", userId)
      .eq("module_slug", module_slug)
      .eq("lesson_slug", lesson_slug)
      .maybeSingle();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    // Resolve completion_status: keep existing if not provided, default not_started for new row
    let newStatus = completion_status ?? (existing?.completion_status as string | undefined) ?? "not_started";

    // Guard: never downgrade a completed lab (preserve completed status/date).
    // If existing is completed and incoming requests in_progress/not_started, keep completed.
    // Documented: completion is terminal; last_position updates still allowed but status is sticky.
    const isDowngradeAttempt =
      (existing?.completion_status as string | undefined) === "completed" &&
      newStatus !== "completed";
    if (isDowngradeAttempt) {
      newStatus = "completed";
    }

    // Resolve last_position: cap if provided, else keep existing or {}
    let resolvedLastPosition: Record<string, unknown>;
    if (last_position !== undefined) {
      const raw = last_position as Record<string, unknown>;
      resolvedLastPosition = capLastPosition(raw);
      // Ensure cap guarantees ≤8KB; capLastPosition already enforces
      if (JSON.stringify(resolvedLastPosition).length > 8192) {
        // Defensive: fallback to minimal
        resolvedLastPosition = capLastPosition(resolvedLastPosition);
      }
    } else {
      resolvedLastPosition = (existing?.last_position as Record<string, unknown> | null) ?? {};
      if (typeof resolvedLastPosition !== "object" || Array.isArray(resolvedLastPosition)) {
        resolvedLastPosition = {};
      }
    }

    // completion_date: NOW only on first transition to completed, preserve original on re-POST
    let completionDate: string | null;
    if (newStatus === "completed") {
      completionDate = (existing?.completion_date as string | null) ?? new Date().toISOString();
    } else {
      completionDate = null;
    }

    const payload = {
      user_id: userId,
      module_slug,
      lesson_slug,
      completion_status: newStatus,
      completion_date: completionDate,
      last_position: resolvedLastPosition,
      updated_at: new Date().toISOString(),
    };

    const { data: upserted, error: upsertError } = await supabase
      .from("lab_progress")
      .upsert(payload, { onConflict: "user_id,module_slug,lesson_slug" })
      .select("module_slug, lesson_slug, completion_status, completion_date, last_position, updated_at")
      .single();

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }

    // Dual-write to progress + streak on completed — best-effort, non-blocking
    if (newStatus === "completed") {
      try {
        const xp = calcXpForLesson(module_slug, lesson_slug);
        const { error: progressError } = await supabase.from("progress").upsert(
          {
            user_id: userId,
            module_slug,
            lesson_slug,
            completed: true,
            xp_earned: xp,
            completed_at: new Date().toISOString(),
          },
          { onConflict: "user_id,module_slug,lesson_slug" },
        );
        if (progressError) {
          console.error("[lab-progress] dual-write progress failed", progressError.message);
        } else {
          // Streak advance shared with /api/progress — keeps constancia/ritmo in sync across both flows
          try {
            await advanceStreak(userId, supabase, true);
          } catch (e) {
            console.error("[lab-progress] streak advance failed", e);
          }
        }
      } catch (e) {
        console.error("[lab-progress] dual-write progress exception", e);
      }
    }

    return NextResponse.json({ data: upserted }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

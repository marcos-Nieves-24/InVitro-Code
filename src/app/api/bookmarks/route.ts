import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getLessonSlugs } from "@/lib/content/modules";
import { checkRateLimit } from "@/lib/rate-limit";

// Persistence uses createAdminClient() (service-role).
// RLS: Clerk ONLY auth — bookmarks policies compare (auth.jwt() ->> 'sub') = user_id
// Rollback: DROP TABLE IF EXISTS bookmarks; ALTER PUBLICATION supabase_realtime DROP TABLE bookmarks;

// GET /api/bookmarks?module=python
// 401 if no session; 200 { bookmarks: Bookmark[] } (unknown module → [] ; missing → all)
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();
    const moduleParam = request.nextUrl.searchParams.get("module");

    let query = supabase
      .from("bookmarks")
      .select("module_slug, lesson_slug, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (moduleParam) {
      query = query.eq("module_slug", moduleParam);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rows = data ?? [];
    // Provide both keys for forward compatibility (clients may expect either)
    return NextResponse.json({ bookmarks: rows, data: rows }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/bookmarks
// Body: { module_slug, lesson_slug }
// 401 auth; 400 Invalid module/lesson; 429 Too Many Requests; 200 { bookmark }
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rl = checkRateLimit(`bookmarks:${userId}`, 50, 15 * 60 * 1000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too Many Requests" },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Strip any injected user_id — derive exclusively from auth()
    if (body !== null && typeof body === "object" && "user_id" in (body as Record<string, unknown>)) {
      const { user_id: _ignored, ...rest } = body as Record<string, unknown> & { user_id?: unknown };
      body = rest;
    }

    const { module_slug, lesson_slug } = (body as Record<string, unknown>) ?? {};

    if (typeof module_slug !== "string" || module_slug.trim().length === 0) {
      return NextResponse.json({ error: "Invalid module/lesson" }, { status: 400 });
    }
    if (typeof lesson_slug !== "string" || lesson_slug.trim().length === 0) {
      return NextResponse.json({ error: "Invalid module/lesson" }, { status: 400 });
    }

    // Allowlist: module/lesson must exist on filesystem
    const slugs = getLessonSlugs(module_slug);
    if (!slugs.includes(lesson_slug)) {
      return NextResponse.json({ error: "Invalid module/lesson" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const payload = {
      user_id: userId,
      module_slug,
      lesson_slug,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("bookmarks")
      .upsert(payload, { onConflict: "user_id,module_slug,lesson_slug" })
      .select("module_slug, lesson_slug, created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ bookmark: data }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/bookmarks
// Body: { module_slug, lesson_slug } OR query ?module=..&lesson=..
// 401 auth; 400 missing; 200 { deleted: true }
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let moduleSlug: string | null = null;
    let lessonSlug: string | null = null;

    // Prefer query params, fallback to JSON body
    const qModule = request.nextUrl.searchParams.get("module");
    const qLesson = request.nextUrl.searchParams.get("lesson");
    if (qModule && qLesson) {
      moduleSlug = qModule;
      lessonSlug = qLesson;
    } else {
      // Try alternate query keys (module_slug / lesson_slug) for robustness
      const qModule2 = request.nextUrl.searchParams.get("module_slug");
      const qLesson2 = request.nextUrl.searchParams.get("lesson_slug");
      if (qModule2 && qLesson2) {
        moduleSlug = qModule2;
        lessonSlug = qLesson2;
      } else {
        try {
          const body: unknown = await request.json();
          if (body && typeof body === "object") {
            const rec = body as Record<string, unknown>;
            if (typeof rec.module_slug === "string") moduleSlug = rec.module_slug;
            if (typeof rec.lesson_slug === "string") lessonSlug = rec.lesson_slug;
            // Support also module/lesson shorthand
            if (!moduleSlug && typeof rec.module === "string") moduleSlug = rec.module as string;
            if (!lessonSlug && typeof rec.lesson === "string") lessonSlug = rec.lesson as string;
          }
        } catch {
          // no body or invalid json — will be handled below as 400
        }
      }
    }

    // Also allow body lesson_slug with query module etc? re-read body if still missing
    if (!moduleSlug || !lessonSlug) {
      // If one source had only one param, attempt to read the other from body
      try {
        const body: unknown = await request.clone?.() ? null : null;
        void body;
      } catch {
        /* ignore */
      }
    }

    if (!moduleSlug || !lessonSlug || moduleSlug.trim().length === 0 || lessonSlug.trim().length === 0) {
      return NextResponse.json({ error: "Invalid module/lesson" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("user_id", userId)
      .eq("module_slug", moduleSlug)
      .eq("lesson_slug", lessonSlug);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ deleted: true }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

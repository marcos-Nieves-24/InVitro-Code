import { NextRequest, NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

function readNonEmptyString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

/**
 * POST /api/progress/reflection
 *
 * Single-writer canonical route for reflection completions (see ADR 003).
 * Identity comes exclusively from `auth()`; a client-sent `user_id` is never
 * read. The table is keyed by (user_id, block_id), so a replay is idempotent.
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rl = checkRateLimit(`reflection:${userId}`, 200, 15 * 60 * 1000);
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

    if (body === null || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const input = body as Record<string, unknown>;
    const block_id = readNonEmptyString(input.block_id);
    if (!block_id) {
      return NextResponse.json(
        { error: "Invalid or missing block_id" },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    const { data: consentProfile } = await supabase
      .from("profiles")
      .select("consent_status")
      .eq("id", userId)
      .maybeSingle();
    if (
      (
        consentProfile as { consent_status?: string | null } | null
      )?.consent_status === "pending"
    ) {
      return NextResponse.json({ error: "Consent pending art.9" }, { status: 403 });
    }

    const { error: upsertError } = await supabase
      .from("reflection_completions")
      .upsert(
        {
          user_id: userId,
          block_id,
          xp_earned: 10,
          completed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,block_id" },
      );

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, xp_earned: 10 }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

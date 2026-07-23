import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

const REFLECTION_XP = 5;

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { moduleSlug, lessonSlug, blockId } = await request.json();

  if (!moduleSlug || !lessonSlug || !blockId) {
    return NextResponse.json(
      { error: "Missing required fields: moduleSlug, lessonSlug, blockId" },
      { status: 400 },
    );
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("reflection_completions")
    .insert({
      user_id: userId,
      block_id: blockId,
      xp_earned: REFLECTION_XP,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    // 23505 = unique violation → ya completó esta reflexión
    if (error.code === "23505") {
      return NextResponse.json({ success: true, xpEarned: 0, isNew: false });
    }

    console.error("Reflection insert error:", error);
    return NextResponse.json(
      { error: `Failed to save reflection: ${error.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    xpEarned: REFLECTION_XP,
    isNew: true,
  });
}

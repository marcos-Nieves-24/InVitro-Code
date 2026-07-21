import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { calcXpForLesson } from "@/lib/gamification/utils";

/** Number of consecutive days with activity to count as a streak day. */
function isNextDay(a: string, b: string): boolean {
  const dateA = new Date(a);
  const dateB = new Date(b);
  const diffMs = dateB.getTime() - dateA.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  return diffDays === 1;
}

function isSameDay(a: string, b: string): boolean {
  const dateA = new Date(a);
  const dateB = new Date(b);
  return dateA.toDateString() === dateB.toDateString();
}

export async function POST(request: NextRequest) {
  try {
    const { userId, moduleSlug, lessonSlug } = await request.json();

    if (!userId || !moduleSlug || !lessonSlug) {
      return NextResponse.json(
        { error: "Missing required fields: userId, moduleSlug, lessonSlug" },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    // Calculate XP for this lesson
    const xpEarned = calcXpForLesson(moduleSlug, lessonSlug);

    // Upsert progress record
    const { data: progressData, error: progressError } = await supabase
      .from("progress")
      .upsert({
        user_id: userId,
        module_slug: moduleSlug,
        lesson_slug: lessonSlug,
        completed: true,
        xp_earned: xpEarned,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (progressError) {
      console.error("Progress upsert error:", progressError);
      return NextResponse.json(
        { error: `Failed to upsert progress: ${progressError.message}` },
        { status: 500 },
      );
    }

    // ── Streak logic ──
    const today = new Date().toISOString().split("T")[0];

    // Get current streak
    const { data: existingStreak, error: streakReadError } = await supabase
      .from("streaks")
      .select("current_streak, longest_streak, last_active_date")
      .eq("user_id", userId)
      .maybeSingle();

    if (streakReadError) {
      console.error("Streak fetch error:", streakReadError);
      return NextResponse.json(
        { error: `Failed to fetch streak: ${streakReadError.message}` },
        { status: 500 },
      );
    }

    let newCurrentStreak = 1;
    let newLongestStreak = 0;

    if (existingStreak) {
      const lastActive = existingStreak.last_active_date;
      newLongestStreak = existingStreak.longest_streak;

      if (lastActive) {
        if (isSameDay(today, lastActive)) {
          // Already active today — streak stays
          newCurrentStreak = existingStreak.current_streak;
        } else if (isNextDay(lastActive, today)) {
          // Consecutive day
          newCurrentStreak = existingStreak.current_streak + 1;
        } else {
          // Gap — streak resets
          newCurrentStreak = 1;
        }
      }
    }

    if (newCurrentStreak > newLongestStreak) {
      newLongestStreak = newCurrentStreak;
    }

    const { data: updatedStreak, error: streakWriteError } = await supabase
      .from("streaks")
      .upsert({
        user_id: userId,
        current_streak: newCurrentStreak,
        longest_streak: newLongestStreak,
        last_active_date: today,
      })
      .select()
      .single();

    if (streakWriteError) {
      console.error("Streak update error:", streakWriteError);
      return NextResponse.json(
        { error: `Failed to update streak: ${streakWriteError.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      progress: progressData,
      streak: updatedStreak,
      xpEarned,
    });
  } catch (error) {
    console.error("Error in progress API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

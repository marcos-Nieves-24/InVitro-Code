import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

// DELETE /api/account — self-suppression (Ley 1581 art.8)
// Auth via Clerk auth(), cascade best-effort, then Clerk user deletion.
export async function DELETE() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Best-effort sequential cascade, log without aborting
  await admin.from("lab_progress").delete().eq("user_id", userId);
  await admin.from("progress").delete().eq("user_id", userId);
  await admin.from("reflection_completions").delete().eq("user_id", userId);
  await admin.from("streaks").delete().eq("user_id", userId);
  await admin.from("user_achievements").delete().eq("user_id", userId);
  await admin.from("consent_logs").delete().eq("user_id", userId);

  // Storage cleanup: avatars bucket (best-effort)
  const { data: files } = await admin.storage.from("avatars").list("", { search: userId });
  if (files?.length) {
    await admin.storage.from("avatars").remove(files.map((f) => f.name));
  }

  await admin.from("profiles").delete().eq("id", userId);

  // Clerk deletion best-effort — do not fail the request if Clerk is unavailable
  try {
    const client = await clerkClient();
    await client.users.deleteUser(userId);
  } catch (err) {
    console.warn(
      "[account:DELETE] clerk delete best-effort failed",
      userId,
      err instanceof Error ? err.message : String(err),
    );
  }

  console.log(`[account:DELETE] purged ${userId}`);
  return NextResponse.json({ deleted: true }, { status: 200 });
}

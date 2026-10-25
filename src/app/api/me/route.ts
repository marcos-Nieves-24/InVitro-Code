import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = createAdminClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("username, email, avatar_url")
    .eq("id", userId)
    .maybeSingle();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({
    username: profile?.username ?? null,
    email: profile?.email ?? null,
    avatar_url: profile?.avatar_url ?? null,
  });
}

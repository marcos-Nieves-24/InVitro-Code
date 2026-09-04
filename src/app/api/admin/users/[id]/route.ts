import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function checkAdmin(userId: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  return data?.role === "admin";
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!(await checkAdmin(userId))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const { role, is_banned } = body;

  const supabase = createAdminClient();
  const updateData: Record<string, unknown> = {};
  if (role !== undefined) updateData.role = role;
  if (is_banned !== undefined) updateData.is_banned = is_banned;

  const { error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

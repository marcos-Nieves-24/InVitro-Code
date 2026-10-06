import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateAvatar } from "@/lib/profile/validateAvatar";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("avatar") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  let ext: string;
  try {
    ({ ext } = await validateAvatar(file));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid file";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Best-effort: remove previous avatar to avoid orphaned objects
  try {
    const { data: existing } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", userId)
      .maybeSingle();
    const oldUrl: string | null | undefined = existing?.avatar_url;
    if (oldUrl && oldUrl.includes("/avatars/")) {
      const oldPath = oldUrl.split("/avatars/")[1]?.split("?")[0];
      if (oldPath) {
        await supabase.storage.from("avatars").remove([oldPath]);
      }
    }
  } catch {
    // best-effort — do not block upload if cleanup fails
  }

  const fileName = `${userId}-${Date.now()}.${ext}`;
  const filePath = `avatars/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    // TODO: migrar a signed URL / RLS privado en F11
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  // SECURITY: bucket público — migrar a createSignedUrl(3600) + RLS en siguiente iteración
  const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: urlData.publicUrl })
    .eq("id", userId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ avatar_url: urlData.publicUrl });
}

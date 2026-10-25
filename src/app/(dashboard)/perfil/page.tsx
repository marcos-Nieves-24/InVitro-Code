import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { InVitroShell } from "@/components/layout/InVitroShell";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDisplayName } from "@/lib/gamification/user";
import { ConsentPendingCard } from "@/components/consent/ConsentPendingCard";
import { createConsentRepository } from "@/lib/supabase/consent";
import { PerfilClient } from "@/components/profile/PerfilClient";

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const supabase = createAdminClient();
  const profileRes = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  const profile = profileRes.data;
  const userName = getDisplayName(profile ?? {});

  let leaderboardRank: number | null = null;
  try {
    const { data: rankData, error: rankError } = await supabase.rpc("get_leaderboard_rank", {
      target_user_id: userId,
    });
    if (!rankError) {
      if (typeof rankData === "number") leaderboardRank = rankData;
      else if (rankData && typeof (rankData as { position: number }).position === "number") {
        leaderboardRank = (rankData as { position: number }).position;
      } else if (rankData && typeof (rankData as { rank: number }).rank === "number") {
        leaderboardRank = (rankData as { rank: number }).rank;
      }
    }
  } catch {
    // ignore
  }

  // Real social data: follows
  const [followingRes, followersRes] = await Promise.all([
    supabase.from("follows").select("following_id, created_at").eq("follower_id", userId),
    supabase.from("follows").select("follower_id, created_at").eq("following_id", userId),
  ]);
  const followingIds = (followingRes.data ?? []).map((r) => r.following_id);
  const followerIds = (followersRes.data ?? []).map((r) => r.follower_id);

  // Enrich with profiles
  let followingProfiles: Array<{ id: string; username: string | null; avatar_url: string | null }> = [];
  let followerProfiles: Array<{ id: string; username: string | null; avatar_url: string | null }> = [];
  if (followingIds.length > 0) {
    const { data } = await supabase.from("profiles").select("id, username, avatar_url").in("id", followingIds);
    followingProfiles = (data ?? []) as typeof followingProfiles;
  }
  if (followerIds.length > 0) {
    const { data } = await supabase.from("profiles").select("id, username, avatar_url").in("id", followerIds);
    followerProfiles = (data ?? []) as typeof followerProfiles;
  }

  const following = followingProfiles.map((p) => ({ id: p.id, username: p.username ?? p.id.slice(0, 8), avatar_url: p.avatar_url }));
  const followers = followerProfiles.map((p) => ({ id: p.id, username: p.username ?? p.id.slice(0, 8), avatar_url: p.avatar_url }));

  // Suggested: random profiles not self, not already following, not pending friend
  const { data: suggestedProfiles } = await supabase
    .from("profiles")
    .select("id, username, avatar_url")
    .neq("id", userId)
    .limit(10);
  // Filter out already following
  const suggestedFiltered = (suggestedProfiles ?? [])
    .filter((p) => !followingIds.includes(p.id))
    .slice(0, 4)
    .map((p) => ({ id: p.id, username: p.username ?? p.id.slice(0, 8), avatar_url: p.avatar_url }));

  // Fallback to mock if no real users
  const suggested = suggestedFiltered.length > 0 ? suggestedFiltered : [
    { id: "mock-7", username: "mariana_ia", avatar_url: null },
    { id: "mock-8", username: "juan_crispr", avatar_url: null },
    { id: "mock-9", username: "camila_eco", avatar_url: null },
    { id: "mock-10", username: "pedro_prot", avatar_url: null },
  ];

  async function handleAvatarUpload(file: File) {
    "use server";
    const { userId: uid } = await auth();
    if (!uid) return;
    const { validateAvatar } = await import("@/lib/profile/validateAvatar");
    const { ext } = await validateAvatar(file);
    const admin = createAdminClient();
    let oldPath: string | null = null;
    try {
      const { data: existing } = await admin.from("profiles").select("avatar_url").eq("id", uid).maybeSingle();
      const oldUrl: string | null | undefined = existing?.avatar_url;
      if (oldUrl && oldUrl.includes("/avatars/")) {
        oldPath = oldUrl.split("/avatars/")[1]?.split("?")[0] ?? null;
        if (oldPath && !oldPath.startsWith("avatars/")) oldPath = `avatars/${oldPath}`;
      }
    } catch {}
    const fileName = `${uid}-${Date.now()}.${ext}`;
    const filePath = `avatars/${fileName}`;
    const { error: uploadError } = await admin.storage.from("avatars").upload(filePath, file, { upsert: true });
    if (uploadError) throw new Error(uploadError.message);
    const { data: urlData } = admin.storage.from("avatars").getPublicUrl(filePath);
    const { error: avatarUpdateError } = await admin.from("profiles").update({ avatar_url: urlData.publicUrl }).eq("id", uid);
    if (avatarUpdateError) {
      await admin.storage.from("avatars").remove([filePath]);
      throw new Error(avatarUpdateError.message);
    }
    if (oldPath && oldPath !== filePath) {
      try {
        await admin.storage.from("avatars").remove([oldPath]);
      } catch {}
    }
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/perfil");
  }

  async function handleProfileSave(data: { username: string; bio: string; gender: "f" | "m" | "x" | null }) {
    "use server";
    const { userId: uid } = await auth();
    if (!uid) return;
    const admin = createAdminClient();
    const allowed = ["f", "m", "x"] as const;
    const gender = data.gender !== null && (allowed as readonly string[]).includes(data.gender) ? data.gender : null;
    if (gender === "x") {
      const hasConsent = await createConsentRepository().hasGenderConsent(uid);
      if (!hasConsent) {
        throw new Error(
          "Para guardar 'No binaria' necesitás autorizar de forma expresa el tratamiento de este dato sensible (art. 6, Ley 1581 de 2012). Esta autorización es facultativa y no condiciona el acceso al servicio. Marcá la casilla correspondiente o seleccioná 'Prefiero no decirlo'.",
        );
      }
    }
    const { revalidatePath } = await import("next/cache");
    const { error: updateError } = await admin
      .from("profiles")
      .update({
        username: data.username.trim() || null,
        bio: data.bio.trim() || null,
        gender,
      })
      .eq("id", uid);
    if (updateError) throw new Error(updateError.message);
    revalidatePath("/perfil");
    revalidatePath("/dashboard");
  }

  return (
    <InVitroShell userName={userName} userRole={profile?.role} theme={profile?.theme} avatarUrl={profile?.avatar_url ?? null}>
      <div className="p-6 md:p-8">
        <div className="mx-auto max-w-[1379px]">
          <h1 className="font-display text-3xl font-bold text-ink">Mi Perfil</h1>

          {profile?.consent_status === "pending" && (
            <div className="mt-6">
              <ConsentPendingCard pendingSince={profile?.pending_since ?? null} />
            </div>
          )}

          <div className="mt-8">
            <PerfilClient
              profile={{
                username: profile?.username ?? null,
                email: profile?.email ?? null,
                avatar_url: profile?.avatar_url ?? null,
                bio: profile?.bio ?? null,
                created_at: profile?.created_at ?? null,
                gender: profile?.gender ?? null,
              }}
              leaderboardRank={leaderboardRank}
              following={following}
              followers={followers}
              suggested={suggested}
              onAvatarUpload={handleAvatarUpload}
              onProfileSave={handleProfileSave}
            />
          </div>
        </div>
      </div>
    </InVitroShell>
  );
}

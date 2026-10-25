import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { InVitroShell } from "@/components/layout/InVitroShell";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateAvatar } from "@/lib/profile/validateAvatar";
import { getDisplayName } from "@/lib/gamification/user";
import { ConsentPendingCard } from "@/components/consent/ConsentPendingCard";
import { createConsentRepository } from "@/lib/supabase/consent";
import { MockProfileSocialRepository } from "@/infrastructure/profile/MockProfileSocialRepository";
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
    // ignore — leaderboard sync best-effort, keep null
  }

  const socialRepo = new MockProfileSocialRepository();
  const [following, followers, suggested] = await Promise.all([
    socialRepo.getFollowing(userId),
    socialRepo.getFollowers(userId),
    socialRepo.getSuggested(userId),
  ]);

  async function handleAvatarUpload(file: File) {
    "use server";
    const { userId: uid } = await auth();
    if (!uid) return;
    const { ext } = await validateAvatar(file);
    const admin = createAdminClient();
    try {
      const { data: existing } = await admin
        .from("profiles")
        .select("avatar_url")
        .eq("id", uid)
        .maybeSingle();
      const oldUrl: string | null | undefined = existing?.avatar_url;
      if (oldUrl && oldUrl.includes("/avatars/")) {
        const oldPath = oldUrl.split("/avatars/")[1]?.split("?")[0];
        if (oldPath) {
          await admin.storage.from("avatars").remove([oldPath]);
        }
      }
    } catch {
      // best-effort
    }
    const fileName = `${uid}-${Date.now()}.${ext}`;
    const filePath = `avatars/${fileName}`;
    const { error: uploadError } = await admin.storage.from("avatars").upload(filePath, file, { upsert: true });
    if (uploadError) throw new Error(uploadError.message);
    const { data: urlData } = admin.storage.from("avatars").getPublicUrl(filePath);
    const { error: avatarUpdateError } = await admin
      .from("profiles")
      .update({ avatar_url: urlData.publicUrl })
      .eq("id", uid);
    if (avatarUpdateError) throw new Error(avatarUpdateError.message);
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/perfil");
  }

  async function handleProfileSave(data: { username: string; bio: string; gender: "f" | "m" | "x" | null }) {
    "use server";
    const { userId: uid } = await auth();
    if (!uid) return;
    const admin = createAdminClient();
    const allowed = ["f", "m", "x"] as const;
    const gender =
      data.gender !== null && (allowed as readonly string[]).includes(data.gender) ? data.gender : null;
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
    <InVitroShell userName={userName} userRole={profile?.role} theme={profile?.theme}>
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

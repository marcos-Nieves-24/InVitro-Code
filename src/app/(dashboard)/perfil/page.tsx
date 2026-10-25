import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { InVitroShell } from "@/components/layout/InVitroShell";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDisplayName } from "@/lib/gamification/user";
import { ProfileHero } from "@/components/profile/ProfileHero";
import { FollowStats } from "@/components/profile/FollowStats";
import { ConectaFloatingWidget } from "@/components/profile/ConectaFloatingWidget";
import { ConsentPendingCard } from "@/components/consent/ConsentPendingCard";
import { MockProfileSocialRepository } from "@/infrastructure/profile/MockProfileSocialRepository";

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

  // Leaderboard rank (best-effort)
  let leaderboardRank: number | null = null;
  try {
    const { data: rankData } = await supabase.rpc("get_leaderboard_rank", {
      target_user_id: userId,
    });
    if (typeof rankData === "number") leaderboardRank = rankData;
  } catch {
    // ignore
  }

  // Social mock (behind port)
  const socialRepo = new MockProfileSocialRepository();
  const [following, followers, suggested] = await Promise.all([
    socialRepo.getFollowing(userId),
    socialRepo.getFollowers(userId),
    socialRepo.getSuggested(userId),
  ]);

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

          {/* Amplified grid: Hero + FollowStats wide to the right */}
          <div className="mt-8 grid gap-8 lg:grid-cols-[560px_1fr] lg:items-start">
            {/* Left: Hero only — old Foto/Info cards removed per request */}
            <div>
              <ProfileHero
                username={profile?.username}
                email={profile?.email}
                avatar_url={profile?.avatar_url}
                bio={profile?.bio}
                created_at={profile?.created_at ?? null}
                leaderboardRank={leaderboardRank}
              />
            </div>

            {/* Right: Siguiendo/Seguidores — amplified to fill */}
            <div>
              <FollowStats following={following} followers={followers} />
            </div>
          </div>

          {/* Floating Conecta widget (fixed, not inline) */}
          <ConectaFloatingWidget suggested={suggested} />
        </div>
      </div>
    </InVitroShell>
  );
}

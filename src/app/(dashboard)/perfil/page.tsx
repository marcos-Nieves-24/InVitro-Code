import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { InVitroShell } from "@/components/layout/InVitroShell";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDisplayName } from "@/lib/gamification/user";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { AvatarUpload } from "@/components/profile/AvatarUpload";

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

  return (
    <InVitroShell userName={userName} userRole={profile?.role} theme={profile?.theme}>
      <div className="p-8">
        <div className="mx-auto max-w-2xl space-y-8">
          <h1 className="font-display text-3xl font-bold text-ink">
            Mi Perfil
          </h1>

          <ProfileCard
            username={profile?.username}
            email={profile?.email}
            avatar_url={profile?.avatar_url}
            bio={profile?.bio}
          />

          <div className="rounded-card border border-surface-raised bg-surface-card p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-storm">
              Foto de perfil
            </h2>
            <AvatarUpload
              currentAvatar={profile?.avatar_url}
              onUpload={async (file) => {
                "use server";
                const { userId: uid } = await auth();
                if (!uid) return;
                const admin = createAdminClient();
                const fileExt = file.name.split(".").pop();
                const fileName = `${uid}-${Date.now()}.${fileExt}`;
                const filePath = `avatars/${fileName}`;
                const { error: uploadError } = await admin.storage
                  .from("avatars")
                  .upload(filePath, file, { upsert: true });
                if (uploadError) throw new Error(uploadError.message);
                const { data: urlData } = admin.storage.from("avatars").getPublicUrl(filePath);
                await admin.from("profiles").update({ avatar_url: urlData.publicUrl }).eq("id", uid);
              }}
            />
          </div>

          <div className="rounded-card border border-surface-raised bg-surface-card p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-storm">
              Información personal
            </h2>
            <ProfileForm
              username={profile?.username}
              bio={profile?.bio}
              onSave={async (data) => {
                "use server";
                const { userId: uid } = await auth();
                if (!uid) return;
                const admin = createAdminClient();
                await admin.from("profiles").update({
                  username: data.username,
                  bio: data.bio,
                }).eq("id", uid);
              }}
            />
          </div>
        </div>
      </div>
    </InVitroShell>
  );
}

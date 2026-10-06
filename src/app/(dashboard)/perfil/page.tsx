import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { InVitroShell } from "@/components/layout/InVitroShell";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDisplayName } from "@/lib/gamification/user";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { createConsentRepository } from "@/lib/supabase/consent";

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
              gender={profile?.gender ?? null}
              onSave={async (data) => {
                "use server";
                const { userId: uid } = await auth();
                if (!uid) return;
                const admin = createAdminClient();
                const allowed = ["f", "m", "x"] as const;
                const gender =
                  data.gender !== null && (allowed as readonly string[]).includes(data.gender)
                    ? data.gender
                    : null;
                if (gender === "x") {
                  const hasConsent = await createConsentRepository().hasGenderConsent(uid);
                  if (!hasConsent) {
                    throw new Error(
                      "Para guardar 'No binaria' necesitás autorizar de forma expresa el tratamiento de este dato sensible (art. 6, Ley 1581 de 2012). Esta autorización es facultativa y no condiciona el acceso al servicio. Marcá la casilla correspondiente o seleccioná 'Prefiero no decirlo'.",
                    );
                  }
                }
                const { revalidatePath } = await import("next/cache");
                await admin
                  .from("profiles")
                  .update({
                    username: data.username,
                    bio: data.bio,
                    gender,
                  })
                  .eq("id", uid);
                revalidatePath("/perfil");
                revalidatePath("/dashboard");
              }}
            />
          </div>
        </div>
      </div>
    </InVitroShell>
  );
}

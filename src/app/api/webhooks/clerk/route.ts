import { Webhook } from "svix";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireEnv } from "@/lib/env";
import { createConsentRepository } from "@/lib/supabase/consent";
import { ConsentPurpose, CURRENT_POLICY_VERSION } from "@/domain/consent";

function getAdmin() {
  return createAdminClient();
}

type ClerkEvent = {
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    first_name?: string;
    last_name?: string;
    public_metadata?: { gender?: unknown };
  };
  type: string;
};

function parseGender(raw: unknown): "f" | "m" | "x" | undefined {
  return raw === "f" || raw === "m" || raw === "x" ? raw : undefined;
}

export async function POST(req: Request) {
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.text();
  const wh = new Webhook(requireEnv("CLERK_SIGNING_SECRET"));

  let evt: ClerkEvent;
  try {
    evt = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkEvent;
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (evt.type === "user.created" || evt.type === "user.updated") {
    const { id, email_addresses, first_name, public_metadata } = evt.data;
    const email = email_addresses[0]?.email_address ?? "";
    const gender = parseGender(public_metadata?.gender);
    const admin = getAdmin();

    // Hybrid consent gate (Ley 1581 art.9/art.6/art.26 + Ley 527)
    const repo = createConsentRepository();
    const hasBase = await repo.hasValidConsent(id, ConsentPurpose.TRANSFER_EEUU);
    const hasGender = await repo.hasGenderConsent(id);

    // Strict for sensitive gender=x: requires explicit gender consent
    if (gender === "x" && !hasGender) {
      if (!hasBase) {
        return new Response("Base consent required art.9/26", { status: 403 });
      }
      return new Response("Explicit gender consent required art.6", { status: 403 });
    }

    // Pending 24h for base consent (COMP-07 purges)
    if (!hasBase) {
      const pendingPayload: Record<string, unknown> = {
        id,
        email,
        username: first_name ?? email.split("@")[0],
        role: "user",
        // Never persist gender=x without explicit consent
        ...(gender === "x" ? { gender: null } : gender ? { gender } : {}),
        consent_status: "pending",
        pending_since: new Date().toISOString(),
        consent_version: null,
      };
      await admin.from("profiles").upsert(pendingPayload, { onConflict: "id" });
      return new Response("OK pending_consent", { status: 200 });
    }

    // hasBase true → verified
    const verifiedPayload: Record<string, unknown> = {
      id,
      email,
      username: first_name ?? email.split("@")[0],
      role: "user",
      consent_status: "verified",
      consent_version: CURRENT_POLICY_VERSION,
      pending_since: null,
    };
    // Only include gender when present and valid; preserve existing value on update without gender
    if (gender) {
      verifiedPayload.gender = gender;
    }
    // user.updated without valid gender → preserve existing Supabase value (no NULL overwrite)
    await admin.from("profiles").upsert(verifiedPayload, { onConflict: "id" });
  }

  if (evt.type === "user.deleted") {
    const id = (evt.data as { id: string }).id;
    if (!id) {
      return new Response("Missing user id", { status: 400 });
    }
    const admin = getAdmin();
    // Best-effort sequential cascade, log without aborting (Ley 1581 art.8)
    await admin.from("lab_progress").delete().eq("user_id", id);
    await admin.from("progress").delete().eq("user_id", id);
    await admin.from("reflection_completions").delete().eq("user_id", id);
    await admin.from("streaks").delete().eq("user_id", id);
    await admin.from("user_achievements").delete().eq("user_id", id);
    await admin.from("consent_logs").delete().eq("user_id", id);
    // Storage cleanup: avatars bucket (best-effort)
    const { data: files } = await admin.storage.from("avatars").list("", { search: id });
    if (files?.length) {
      await admin.storage.from("avatars").remove(files.map((f) => f.name));
    }
    await admin.from("profiles").delete().eq("id", id);
    console.log(`[webhook:user.deleted] purged ${id}`);
    return new Response("OK deleted", { status: 200 });
  }

  return new Response("OK", { status: 200 });
}

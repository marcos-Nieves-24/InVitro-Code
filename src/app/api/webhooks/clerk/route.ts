import { Webhook } from "svix";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireEnv } from "@/lib/env";

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

    if (gender) {
      await admin.from("profiles").upsert(
        {
          id,
          email,
          username: first_name ?? email.split("@")[0],
          role: "user",
          gender,
        },
        { onConflict: "id" },
      );
    } else if (evt.type === "user.created") {
      await admin.from("profiles").upsert(
        {
          id,
          email,
          username: first_name ?? email.split("@")[0],
          role: "user",
        },
        { onConflict: "id" },
      );
    }
    // user.updated without valid gender → preserve existing Supabase value (no NULL overwrite)
  }

  return new Response("OK", { status: 200 });
}

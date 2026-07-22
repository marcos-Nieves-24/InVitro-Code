import { Webhook } from "svix";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";

function getAdmin() {
  return createAdminClient();
}

type ClerkEvent = {
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    first_name?: string;
    last_name?: string;
  };
  type: string;
};

export async function POST(req: Request) {
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await req.text();
  const wh = new Webhook(process.env.CLERK_SIGNING_SECRET!);

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

  if (evt.type === "user.created") {
    const { id, email_addresses, first_name } = evt.data;
    const email = email_addresses[0]?.email_address ?? "";

    const admin = getAdmin();
    await admin.from("profiles").upsert({
      id,
      email,
      username: first_name ?? email.split("@")[0],
    });
  }

  return new Response("OK", { status: 200 });
}

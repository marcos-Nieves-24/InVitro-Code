import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { ConsentPurpose } from "@/domain/consent";
import { completeConsent } from "@/application/use-cases/completeConsent";

export const runtime = "nodejs";

// Body schema: policyVersion, acceptedTextHash (sha256 hex), purposes (min 1 enum), optional userId fallback for pre-webhook race
const consentSchema = z.object({
  policyVersion: z.string().min(1, "policyVersion is required"),
  acceptedTextHash: z
    .string()
    .min(64, "acceptedTextHash must be at least 64 chars")
    .max(128, "acceptedTextHash must be at most 128 chars")
    .regex(/^[a-fA-F0-9]+$/, "acceptedTextHash must be hex"),
  purposes: z.array(z.nativeEnum(ConsentPurpose)).min(1, "purposes must have at least one entry"),
  userId: z.string().min(1).optional(),
});

export async function POST(req: NextRequest) {
  // Auth: prefer Clerk session, fallback to body userId for pre-webhook race
  let clerkUserId: string | null = null;
  try {
    const session = await auth();
    clerkUserId = session.userId;
  } catch {
    clerkUserId = null;
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = consentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { policyVersion, acceptedTextHash, purposes, userId: bodyUserId } = parsed.data;

  // Prioritize auth() userId, fallback to body userId for pre-webhook race
  const userId = clerkUserId ?? bodyUserId ?? null;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Extract IP: x-forwarded-for (first) or x-real-ip
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const ip =
    forwarded?.split(",")[0]?.trim() || realIp?.trim() || null;

  // Extract UA
  const userAgent = req.headers.get("user-agent") ?? null;

  try {
    const record = await completeConsent({
      userId,
      policyVersion,
      acceptedTextHash,
      purposes,
      ip,
      userAgent,
    });

    return NextResponse.json({ ok: true, consentId: record.id }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save consent";
    // Validation errors (missing F-01 / transfer:EEUU) are 400, otherwise 500
    const status = message.includes("purposes must include") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

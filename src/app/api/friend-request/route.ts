import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { SupabaseFriendRequestRepository } from "@/infrastructure/profile/SupabaseFriendRequestRepository";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { receiverId } = await request.json();
  if (!receiverId) return NextResponse.json({ error: "receiverId required" }, { status: 400 });
  if (userId === receiverId) return NextResponse.json({ error: "Cannot invite yourself" }, { status: 400 });
  const repo = new SupabaseFriendRequestRepository();
  try {
    const req = await repo.sendRequest(userId, receiverId);
    return NextResponse.json({ request: req });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    // duplicate -> already sent
    if (msg.includes("duplicate") || msg.includes("unique")) {
      return NextResponse.json({ error: "Ya enviaste una invitación" }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { requestId, action } = await request.json();
  if (!requestId || !["accept", "decline"].includes(action)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const repo = new SupabaseFriendRequestRepository();
  try {
    if (action === "accept") await repo.acceptRequest(requestId, userId);
    else await repo.declineRequest(requestId, userId);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // pending_received, pending_sent, friends, status
  const otherId = searchParams.get("otherId");
  const repo = new SupabaseFriendRequestRepository();
  try {
    if (type === "pending_received") {
      const list = await repo.getPendingReceived(userId);
      return NextResponse.json({ list });
    }
    if (type === "pending_sent") {
      const list = await repo.getPendingSent(userId);
      return NextResponse.json({ list });
    }
    if (type === "friends") {
      const list = await repo.getFriends(userId);
      // Enrich with profile data
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const supabase = createAdminClient();
      const friendIds = list.map((f) => f.friendId);
      if (friendIds.length === 0) return NextResponse.json({ friends: [] });
      const { data: profiles } = await supabase.from("profiles").select("id, username, avatar_url").in("id", friendIds);
      const friends = list.map((f) => {
        const prof = profiles?.find((p) => p.id === f.friendId);
        return { ...f, profile: prof ?? null };
      });
      return NextResponse.json({ friends });
    }
    if (type === "status" && otherId) {
      const status = await repo.getStatusBetween(userId, otherId);
      return NextResponse.json({ status });
    }
    // default: friends + pending
    const [friends, pendingReceived] = await Promise.all([
      repo.getFriends(userId),
      repo.getPendingReceived(userId),
    ]);
    return NextResponse.json({ friends, pendingReceived });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { SupabaseFollowRepository } from "@/infrastructure/profile/SupabaseFollowRepository";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { followingId, action } = await request.json();
  if (!followingId || !["follow", "unfollow"].includes(action)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  if (userId === followingId) {
    return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
  }
  const repo = new SupabaseFollowRepository();
  try {
    if (action === "follow") await repo.follow(userId, followingId);
    else await repo.unfollow(userId, followingId);
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
  const targetId = searchParams.get("targetId");
  const repo = new SupabaseFollowRepository();
  try {
    if (targetId) {
      const isFollowing = await repo.isFollowing(userId, targetId);
      return NextResponse.json({ isFollowing });
    }
    const counts = await repo.getCounts(userId);
    const following = await repo.getFollowing(userId);
    const followers = await repo.getFollowers(userId);
    return NextResponse.json({ counts, following, followers });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

import type { FollowRepository } from "@/application/ports/FollowRepository";
import { createAdminClient } from "@/lib/supabase/admin";

export class SupabaseFollowRepository implements FollowRepository {
  async follow(followerId: string, followingId: string): Promise<void> {
    const supabase = createAdminClient();
    const { error } = await supabase.from("follows").insert({
      follower_id: followerId,
      following_id: followingId,
    });
    if (error && !error.message.includes("duplicate")) throw new Error(error.message);
  }

  async unfollow(followerId: string, followingId: string): Promise<void> {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", followerId)
      .eq("following_id", followingId);
    if (error) throw new Error(error.message);
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("follows")
      .select("follower_id")
      .eq("follower_id", followerId)
      .eq("following_id", followingId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return !!data;
  }

  async getFollowers(userId: string) {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("follows").select("*").eq("following_id", userId);
    if (error) throw new Error(error.message);
    return (data ?? []) as Array<{ follower_id: string; following_id: string; created_at: string }>;
  }

  async getFollowing(userId: string) {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("follows").select("*").eq("follower_id", userId);
    if (error) throw new Error(error.message);
    return (data ?? []) as Array<{ follower_id: string; following_id: string; created_at: string }>;
  }

  async getCounts(userId: string): Promise<{ followers: number; following: number }> {
    const supabase = createAdminClient();
    const [followersRes, followingRes] = await Promise.all([
      supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", userId),
      supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", userId),
    ]);
    if (followersRes.error) throw new Error(followersRes.error.message);
    if (followingRes.error) throw new Error(followingRes.error.message);
    return {
      followers: followersRes.count ?? 0,
      following: followingRes.count ?? 0,
    };
  }
}

import type { FriendRequestRepository } from "@/application/ports/FriendRequestRepository";
import { createAdminClient } from "@/lib/supabase/admin";
import type { FriendRequest } from "@/domain/profile/friend";

export class SupabaseFriendRequestRepository implements FriendRequestRepository {
  async sendRequest(senderId: string, receiverId: string): Promise<FriendRequest> {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("friend_requests")
      .insert({ sender_id: senderId, receiver_id: receiverId, status: "pending" })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as FriendRequest;
  }

  async acceptRequest(requestId: string, receiverId: string): Promise<void> {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("friend_requests")
      .update({ status: "accepted" })
      .eq("id", requestId)
      .eq("receiver_id", receiverId)
      .eq("status", "pending");
    if (error) throw new Error(error.message);
  }

  async declineRequest(requestId: string, receiverId: string): Promise<void> {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("friend_requests")
      .update({ status: "declined" })
      .eq("id", requestId)
      .eq("receiver_id", receiverId)
      .eq("status", "pending");
    if (error) throw new Error(error.message);
  }

  async getPendingReceived(userId: string): Promise<FriendRequest[]> {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("friend_requests")
      .select("*")
      .eq("receiver_id", userId)
      .eq("status", "pending");
    if (error) throw new Error(error.message);
    return (data ?? []) as FriendRequest[];
  }

  async getPendingSent(userId: string): Promise<FriendRequest[]> {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("friend_requests")
      .select("*")
      .eq("sender_id", userId)
      .eq("status", "pending");
    if (error) throw new Error(error.message);
    return (data ?? []) as FriendRequest[];
  }

  async getFriends(userId: string): Promise<Array<{ friendId: string; created_at: string }>> {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("friend_requests")
      .select("*")
      .eq("status", "accepted")
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
    if (error) throw new Error(error.message);
    const rows = (data ?? []) as FriendRequest[];
    return rows.map((r) => ({
      friendId: r.sender_id === userId ? r.receiver_id : r.sender_id,
      created_at: r.created_at,
    }));
  }

  async getStatusBetween(userId: string, otherId: string): Promise<"none" | "pending_sent" | "pending_received" | "friends"> {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("friend_requests")
      .select("*")
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${userId})`)
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return "none";
    const row = data as FriendRequest;
    if (row.status === "accepted") return "friends";
    if (row.status === "pending" && row.sender_id === userId) return "pending_sent";
    if (row.status === "pending" && row.receiver_id === userId) return "pending_received";
    return "none";
  }
}

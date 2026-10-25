// Application port — friend request persistence abstraction.
// Depends only on domain types; never imports infrastructure.

import type { FriendRequest } from "@/domain/profile/friend";

export interface FriendRequestRepository {
  /** Send a friend invitation (pending) */
  sendRequest(senderId: string, receiverId: string): Promise<FriendRequest>;
  /** Accept a pending request (receiver only) */
  acceptRequest(requestId: string, receiverId: string): Promise<void>;
  /** Decline a pending request */
  declineRequest(requestId: string, receiverId: string): Promise<void>;
  /** Get pending requests received by user */
  getPendingReceived(userId: string): Promise<FriendRequest[]>;
  /** Get pending requests sent by user */
  getPendingSent(userId: string): Promise<FriendRequest[]>;
  /** Get friends (accepted requests where user is sender or receiver) */
  getFriends(userId: string): Promise<Array<{ friendId: string; created_at: string }>>;
  /** Check friendship status between two users */
  getStatusBetween(userId: string, otherId: string): Promise<"none" | "pending_sent" | "pending_received" | "friends">;
}

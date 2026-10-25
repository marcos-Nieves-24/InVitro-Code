// Domain — friend invitation model
// Pure domain, no infrastructure imports.

export type FriendRequestStatus = "pending" | "accepted" | "declined";

export type FriendRequest = {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: FriendRequestStatus;
  created_at: string;
  updated_at: string;
};

export type Friendship = {
  friend: {
    id: string;
    username: string | null;
    avatar_url: string | null;
  };
  created_at: string;
};

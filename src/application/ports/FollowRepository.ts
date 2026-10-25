// Application port — follow persistence abstraction.
// Depends only on domain types; never imports infrastructure.

import type { Follow } from "@/domain/profile/follow";

export interface FollowRepository {
  /** Follow a user */
  follow(followerId: string, followingId: string): Promise<void>;
  /** Unfollow a user */
  unfollow(followerId: string, followingId: string): Promise<void>;
  /** Check if follower follows following */
  isFollowing(followerId: string, followingId: string): Promise<boolean>;
  /** Get followers of a user */
  getFollowers(userId: string): Promise<Follow[]>;
  /** Get following of a user */
  getFollowing(userId: string): Promise<Follow[]>;
  /** Count followers/following */
  getCounts(userId: string): Promise<{ followers: number; following: number }>;
}

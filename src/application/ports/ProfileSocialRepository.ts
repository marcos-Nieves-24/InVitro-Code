// Application port — profile social abstraction.
// Depends only on domain types; never imports infrastructure (Supabase, etc.).

import type { SocialUser, SocialCounts } from "@/domain/profile/social";

export interface ProfileSocialRepository {
  /** Users the given user is following */
  getFollowing(userId: string): Promise<SocialUser[]>;
  /** Users following the given user */
  getFollowers(userId: string): Promise<SocialUser[]>;
  /** Suggested users to connect with */
  getSuggested(userId: string): Promise<SocialUser[]>;
  /** Counter summary */
  getCounts(userId: string): Promise<SocialCounts>;
}

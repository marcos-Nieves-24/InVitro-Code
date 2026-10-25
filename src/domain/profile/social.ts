// Domain — profile social model
// Pure domain, no infrastructure imports.

export type SocialUser = {
  id: string;
  username: string;
  avatar_url?: string | null;
  bio?: string | null;
};

export type SocialCounts = {
  following: number;
  followers: number;
};

export type SuggestedUsers = SocialUser[];

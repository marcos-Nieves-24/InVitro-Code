import type { ProfileSocialRepository } from "@/application/ports/ProfileSocialRepository";
import type { SocialUser, SocialCounts } from "@/domain/profile/social";

const MOCK_FOLLOWING: SocialUser[] = [
  { id: "mock-1", username: "ana_bio", avatar_url: null, bio: "Biología molecular" },
  { id: "mock-2", username: "carlos_lab", avatar_url: null, bio: "Bioinformática" },
  { id: "mock-3", username: "sofia_gen", avatar_url: null, bio: "Genómica" },
];

const MOCK_FOLLOWERS: SocialUser[] = [
  { id: "mock-4", username: "lucia_ml", avatar_url: null, bio: "Machine Learning" },
  { id: "mock-5", username: "diego_data", avatar_url: null, bio: "Data Science" },
  { id: "mock-6", username: "vale_stat", avatar_url: null, bio: "Estadística" },
];

const MOCK_SUGGESTED: SocialUser[] = [
  { id: "mock-7", username: "mariana_ia", avatar_url: null, bio: "IA aplicada" },
  { id: "mock-8", username: "juan_crispr", avatar_url: null, bio: "CRISPR" },
  { id: "mock-9", username: "camila_eco", avatar_url: null, bio: "Ecología" },
  { id: "mock-10", username: "pedro_prot", avatar_url: null, bio: "Proteómica" },
];

export class MockProfileSocialRepository implements ProfileSocialRepository {
  async getFollowing(_userId: string): Promise<SocialUser[]> {
    return MOCK_FOLLOWING;
  }

  async getFollowers(_userId: string): Promise<SocialUser[]> {
    return MOCK_FOLLOWERS;
  }

  async getSuggested(_userId: string): Promise<SocialUser[]> {
    return MOCK_SUGGESTED;
  }

  async getCounts(_userId: string): Promise<SocialCounts> {
    return {
      following: MOCK_FOLLOWING.length,
      followers: MOCK_FOLLOWERS.length,
    };
  }
}

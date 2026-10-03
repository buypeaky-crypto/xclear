export const platforms = ["twitter", "instagram", "tiktok", "facebook", "youtube", "reddit"] as const;

export type Platform = (typeof platforms)[number];
export type CheckStatus = "clear" | "flagged" | "unknown";

export type PlatformTest = {
  label: string;
  status: CheckStatus;
  detail: string;
};

export type PlatformCheck = {
  platform: Platform;
  username: string;
  tests: Record<string, PlatformTest>;
  checkedAt: string;
};

export const platformTestLabels: Record<Platform, [string, string, string, string]> = {
  twitter: ["Search Suggestion", "Search Ban", "Ghost Ban", "Reply Deboost"],
  instagram: ["Search Suggestion", "Hashtag Ban", "Feed Visibility", "Comment Deboost"],
  tiktok: ["Search Suggestion", "Hashtag Visibility", "Profile Visibility", "Comment Visibility"],
  facebook: ["Search Suggestion", "Search Visibility", "Profile Visibility", "Comment Visibility"],
  youtube: ["Search Suggestion", "Search Visibility", "Channel Visibility", "Comment Visibility"],
  reddit: ["Search Suggestion", "Search Visibility", "Profile Visibility", "Comment Visibility"],
};

export function unknownPlatformCheck(platform: Platform, username: string): PlatformCheck {
  const labels = platformTestLabels[platform];
  const testKeys = ["searchSuggestion", "searchBan", "ghostBan", "replyDeboost"];

  return {
    platform,
    username,
    tests: Object.fromEntries(testKeys.map((key, index) => [key, {
      label: labels[index],
      status: "unknown" as const,
      detail: "This signal is not available from a reliable public endpoint. Check the platform's own account-status tools.",
    }])),
    checkedAt: new Date().toISOString(),
  };
}
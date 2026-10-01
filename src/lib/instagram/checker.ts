export const BANNED_HASHTAGS = [
  "followforfollow",
  "likeforlike",
  "adult",
  "nude",
  "porn",
  "sext",
  "follow4follow",
  "f4f",
  "like4like",
  "l4l",
  "likeforlikes",
  "followback",
  "followtrain",
  "tagsforlikes",
  "instafollow",
  "instalike",
  "spamforspam",
  "commentforcomment",
  "shoutoutforshoutout",
  "s4s",
  "gaintrick",
  "gainparty",
  "sex",
  "xxx",
  "nsfw",
  "naked",
  "nudity",
  "erotic",
  "erotica",
  "explicit",
  "lingerie",
  "underwear",
  "topless",
  "nakedgirls",
  "sexy",
  "sexytimes",
  "boobs",
  "tits",
  "ass",
  "booty",
  "anal",
  "escort",
  "prostitution",
  "onlyfans",
  "camgirl",
  "bdsm",
  "fetish",
  "rape",
  "incest",
  "adultcontent",
] as const;

export type IGCheckResult = {
  hashtagVisibility: "ok" | "limited" | "hidden";
  engagement: "ok" | "drop" | "severe";
  score: number;
  reasons: string[];
};

export function checkInstagram(username: string, hashtags: string[]): IGCheckResult {
  void username;
  const lowerTags = hashtags
    .map((tag) => tag.trim().toLowerCase().replace(/^#+/, "").replace(/[.,;!?]+$/, ""))
    .filter(Boolean);
  const reasons: string[] = [];
  let score = 100;

  const bannedFound = lowerTags.filter((tag) => BANNED_HASHTAGS.includes(tag as (typeof BANNED_HASHTAGS)[number]));
  if (bannedFound.length > 0) {
    score -= 40;
    reasons.push(`Uses banned/broken hashtags: ${[...new Set(bannedFound)].join(", ")}`);
  }

  if (lowerTags.length > 30) {
    score -= 30;
    reasons.push(`Uses ${lowerTags.length} hashtags (IG limit is 30, spam flag)`);
  }

  if (new Set(lowerTags).size < lowerTags.length) {
    score -= 20;
    reasons.push("Repeating same hashtags in this list");
  }

  score = Math.max(0, score);
  const hashtagVisibility = score < 60 ? "hidden" : score < 80 ? "limited" : "ok";
  const engagement = score < 60 ? "severe" : score < 80 ? "drop" : "ok";

  if (score === 100) reasons.push("No spam signals detected, hashtags look clean");

  return { hashtagVisibility, engagement, score, reasons };
}
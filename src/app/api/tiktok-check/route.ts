import { Redis } from "@upstash/redis";
import { load } from "cheerio";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 8;

const USER_AGENT = "Mozilla/5.0 (compatible; ShadowbannChecker/1.0)";
const BASE_RISK_SIGNALS = [
  "A public profile lookup cannot confirm a shadowban or measure For You Page distribution.",
  "TikTok does not provide an official account-wide shadowban status.",
];

type TikTokCheckResult = {
  exists: boolean;
  scraped: boolean;
  isPrivate?: boolean;
  followerCount?: string;
  bio?: string;
  avatar?: string;
  riskSignals: string[];
  message: string;
};

type ScrapedProfile = Pick<
  TikTokCheckResult,
  "isPrivate" | "followerCount" | "bio" | "avatar"
>;

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  try {
    return new Redis({ url, token });
  } catch {
    return null;
  }
}

function settleWithin<T>(operation: Promise<T>, milliseconds: number): Promise<T | undefined> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(undefined), milliseconds);
    operation.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      () => {
        clearTimeout(timer);
        resolve(undefined);
      },
    );
  });
}

function validCachedResult(value: unknown): value is TikTokCheckResult {
  if (!value || typeof value !== "object") return false;
  const result = value as Partial<TikTokCheckResult>;
  return (
    typeof result.exists === "boolean" &&
    typeof result.scraped === "boolean" &&
    Array.isArray(result.riskSignals) &&
    typeof result.message === "string"
  );
}

function normalizeUsername(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const username = value.trim().replace(/^@+/, "").toLowerCase();
  return /^[a-z0-9._]{2,24}$/.test(username) ? username : null;
}

function normalizeVideoUrl(value: unknown): string | null | undefined {
  if (value === undefined || value === "") return undefined;
  if (typeof value !== "string") return null;

  try {
    const url = new URL(value.trim());
    const isTikTokHost = url.hostname === "tiktok.com" || url.hostname.endsWith(".tiktok.com");
    if (url.protocol !== "https:" || !isTikTokHost) return null;
    return url.toString();
  } catch {
    return null;
  }
}

async function fetchOEmbed(url: string, timeoutMs: number): Promise<Response> {
  const endpoint = new URL("https://www.tiktok.com/oembed");
  endpoint.searchParams.set("url", url);
  return fetch(endpoint, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(timeoutMs),
  });
}

function toStringValue(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) {
    return new Intl.NumberFormat("en-US").format(value);
  }
  return undefined;
}

function extractProfileData(value: unknown): ScrapedProfile {
  const profile: ScrapedProfile = {};
  let nodes = 0;

  function visit(node: unknown, depth: number): void {
    if (!node || typeof node !== "object" || depth > 30 || nodes > 20_000) return;
    nodes += 1;

    if (Array.isArray(node)) {
      for (const item of node) visit(item, depth + 1);
      return;
    }

    const record = node as Record<string, unknown>;
    if (profile.followerCount === undefined) {
      profile.followerCount = toStringValue(record.followerCount ?? record.follower_count);
    }
    if (profile.bio === undefined) {
      profile.bio = toStringValue(record.signature ?? record.bio ?? record.bioDescription);
    }
    if (profile.avatar === undefined) {
      profile.avatar = toStringValue(
        record.avatarLarger ?? record.avatarMedium ?? record.avatarThumb,
      );
    }
    if (profile.isPrivate === undefined && typeof record.privateAccount === "boolean") {
      profile.isPrivate = record.privateAccount;
    }

    for (const child of Object.values(record)) visit(child, depth + 1);
  }

  visit(value, 0);
  return profile;
}

async function scrapeProfile(username: string): Promise<
  { scraped: true; profile: ScrapedProfile } | { scraped: false }
> {
  try {
    const response = await fetch(`https://www.tiktok.com/@${encodeURIComponent(username)}`, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(2_500),
    });
    if (!response.ok) return { scraped: false };

    const contentLength = Number(response.headers.get("content-length"));
    if (Number.isFinite(contentLength) && contentLength > 2_500_000) {
      return { scraped: false };
    }

    const html = await response.text();
    if (html.length > 2_500_000) return { scraped: false };

    const $ = load(html);
    let profile: ScrapedProfile = {};
    $("script").each((_, element) => {
      if (profile.bio && profile.followerCount && profile.avatar) return;

      const script = $(element);
      const id = script.attr("id") ?? "";
      const text = script.text();
      if (
        !["SIGI_STATE", "__UNIVERSAL_DATA_FOR_REHYDRATION__", "__NEXT_DATA__"].includes(id) &&
        !text.includes("followerCount")
      ) {
        return;
      }

      const firstBrace = text.indexOf("{");
      const lastBrace = text.lastIndexOf("}");
      if (firstBrace < 0 || lastBrace <= firstBrace) return;

      try {
        profile = { ...profile, ...extractProfileData(JSON.parse(text.slice(firstBrace, lastBrace + 1))) };
      } catch {
      }
    });

    profile.avatar ??= $("meta[property='og:image']").attr("content") || undefined;
    return { scraped: true, profile };
  } catch {
    return { scraped: false };
  }
}

async function getVideoRiskSignals(videoUrl: string): Promise<string[]> {
  try {
    const response = await fetchOEmbed(videoUrl, 2_000);
    if (response.ok) {
      return [
        "TikTok recognized the submitted video URL; this does not show whether it is recommended on the For You Page.",
      ];
    }
    if (response.status === 429) {
      return ["TikTok rate-limited the optional video check; try again later."];
    }
    return [
      "TikTok could not confirm the submitted video through oEmbed; this does not prove an account restriction.",
    ];
  } catch {
    return ["The optional video check could not reach TikTok; no shadowban conclusion can be drawn."];
  }
}

function jsonError(message: string, status: number, username = "") {
  return Response.json(
    {
      exists: false,
      scraped: false,
      riskSignals: [],
      username,
      message,
    },
    { status },
  );
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Send a valid JSON request body.", 400);
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return jsonError("Send a valid JSON request body.", 400);
  }

  const body = payload as { username?: unknown; videoUrl?: unknown };
  const username = normalizeUsername(body.username);
  if (!username) {
    return jsonError("Enter a TikTok username using 2-24 letters, numbers, periods, or underscores.", 400);
  }

  const videoUrl = normalizeVideoUrl(body.videoUrl);
  if (videoUrl === null) {
    return jsonError("Enter a valid HTTPS link from TikTok.", 400, username);
  }

  const cacheKey = `tiktok:${username}`;
  const redis = getRedis();
  let profileResult: TikTokCheckResult | undefined;
  let videoRiskSignals: string[] = [];

  if (redis) {
    const cached = await settleWithin(redis.get<TikTokCheckResult>(cacheKey), 400);
    if (validCachedResult(cached)) profileResult = cached;
  }

  if (!profileResult) {
    let profileResponse: Response;
    try {
      const profileUrl = `https://www.tiktok.com/@${encodeURIComponent(username)}`;
      profileResponse = await fetchOEmbed(profileUrl, 2_500);
    } catch {
      return jsonError("TikTok could not be reached. Please try again shortly.", 502, username);
    }

    if (profileResponse.status === 429) {
      return jsonError("TikTok is rate-limiting profile checks. Please try again later.", 429, username);
    }

    if (profileResponse.status === 404) {
      profileResult = {
        exists: false,
        scraped: false,
        riskSignals: [],
        message: "This TikTok username doesn't appear to exist.",
      };
    } else if (profileResponse.ok) {
      const [scrapeResult, videoSignals] = await Promise.all([
        scrapeProfile(username),
        videoUrl ? getVideoRiskSignals(videoUrl) : Promise.resolve([]),
      ]);
      videoRiskSignals = videoSignals;
      profileResult = {
        exists: true,
        scraped: scrapeResult.scraped,
        ...(scrapeResult.scraped ? scrapeResult.profile : {}),
        riskSignals: [
          ...BASE_RISK_SIGNALS,
          ...(scrapeResult.scraped
            ? []
            : ["TikTok did not expose public profile details to this server; profile scraping was blocked or unavailable."]),
        ],
        message: scrapeResult.scraped
          ? "The profile appears to exist. Public details are limited and cannot confirm recommendation reach."
          : "The profile appears to exist, but TikTok did not provide public profile details to this server.",
      };
    } else {
      return jsonError("TikTok could not confirm this username right now. Please try again later.", 502, username);
    }

    if (redis && profileResult) {
      await settleWithin(redis.set(cacheKey, profileResult, { ex: 60 * 60 }), 400);
    }
  }

  if (videoUrl && videoRiskSignals.length === 0 && profileResult.exists) {
    videoRiskSignals = await getVideoRiskSignals(videoUrl);
  }

  const result = videoRiskSignals.length
    ? { ...profileResult, riskSignals: [...profileResult.riskSignals, ...videoRiskSignals] }
    : profileResult;

  return Response.json(
    { ...result, username },
    { status: result.exists ? 200 : 404 },
  );
}
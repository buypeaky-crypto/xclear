import { Redis } from "@upstash/redis";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 8;

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36 shadowbannchecker.com";
const FETCH_TIMEOUT_MS = 1_800;
const CACHE_TIMEOUT_MS = 350;
const REDDIT_ENDPOINTS = ["old.reddit.com", "api.reddit.com", "www.reddit.com"] as const;

type RedditStatus = "visible" | "shadowbanned" | "suspended" | "not_found" | "unavailable";

type RedditUser = {
  created_utc?: unknown;
  total_karma?: unknown;
  link_karma?: unknown;
  comment_karma?: unknown;
  is_suspended?: unknown;
};

type RedditResult = {
  status: RedditStatus;
  exists: boolean;
  isShadowbanned: boolean;
  isSuspended: boolean;
  isVisible: boolean;
  karma?: number;
  created?: number;
  linkKarma?: number;
  commentKarma?: number;
  data?: {
    karma?: number;
    created_utc?: number;
    link_karma?: number;
    comment_karma?: number;
  };
  scraped: boolean;
  riskSignals: string[];
  message?: string;
  reason?: string;
  manualCheckUrl?: string;
};

type RedditPayload = {
  data?: RedditUser;
  error?: unknown;
  message?: unknown;
  reason?: unknown;
};

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

function normalizeUsername(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const username = value
    .trim()
    .replace(/^\/?u\//i, "")
    .replace(/^\/+|\/+$/g, "")
    .toLowerCase();
  return /^[a-z0-9_-]{3,20}$/.test(username) ? username : null;
}

function isRedditResult(value: unknown): value is RedditResult {
  if (!value || typeof value !== "object") return false;
  const result = value as Partial<RedditResult>;
  return (
    ["visible", "shadowbanned", "suspended", "not_found", "unavailable"].includes(String(result.status)) &&
    typeof result.exists === "boolean" &&
    typeof result.isShadowbanned === "boolean" &&
    typeof result.isSuspended === "boolean" &&
    typeof result.isVisible === "boolean" &&
    typeof result.scraped === "boolean" &&
    Array.isArray(result.riskSignals)
  );
}

function responseErrorText(payload: unknown): string {
  try {
    return JSON.stringify(payload ?? "").toLowerCase();
  } catch {
    return "";
  }
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

async function fetchAbout(host: string, username: string): Promise<Response> {
  const path = host === "api.reddit.com" ? "about" : "about.json";
  return fetch(`https://${host}/user/${encodeURIComponent(username)}/${path}`, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/json",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
}

function errorResponse(error: string, status: number, username = "") {
  return Response.json({ error, username, scraped: false }, { status });
}

async function cacheResult(redis: Redis | null, key: string, result: RedditResult): Promise<void> {
  if (!redis) return;
  await settleWithin(redis.set(key, result, { ex: 60 * 10 }), CACHE_TIMEOUT_MS);
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return errorResponse("Send a valid JSON request body.", 400);
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return errorResponse("Send a valid JSON request body.", 400);
  }

  const username = normalizeUsername((payload as { username?: unknown }).username);
  if (!username) {
    return errorResponse("Enter a valid Reddit username.", 400);
  }

  const cacheKey = `reddit:${username}`;
  const redis = getRedis();
  if (redis) {
    const cached = await settleWithin(redis.get<RedditResult>(cacheKey), CACHE_TIMEOUT_MS);
    if (isRedditResult(cached)) return Response.json(cached);
  }

  let response: Response | undefined;
  let redditPayload: unknown;
  for (const host of REDDIT_ENDPOINTS) {
    try {
      const candidate = await fetchAbout(host, username);
      if (candidate.status === 403 || candidate.status === 429) continue;
      if (candidate.status !== 200 && candidate.status !== 404) continue;
      response = candidate;
      redditPayload = await candidate.json().catch(() => null);
      break;
    } catch {
      continue;
    }
  }

  const manualCheckUrl = `https://old.reddit.com/user/${encodeURIComponent(username)}/`;
  if (!response) {
    const result: RedditResult = {
      status: "unavailable",
      exists: false,
      isShadowbanned: false,
      isSuspended: false,
      isVisible: false,
      scraped: false,
      riskSignals: [],
      message: "Reddit blocks datacenter IPs, manual check needed",
      reason: "Reddit blocks datacenter IPs, manual check needed",
      manualCheckUrl,
    };
    return Response.json(result);
  }

  if (response.status === 200) {
    const user = (redditPayload as RedditPayload | null)?.data;
    if (!user || typeof user !== "object") {
      return errorResponse("Reddit returned an unreadable profile response.", 502, username);
    }

    const linkKarma = asNumber(user.link_karma);
    const commentKarma = asNumber(user.comment_karma);
    const karma =
      asNumber(user.total_karma) ??
      (linkKarma !== undefined || commentKarma !== undefined
        ? (linkKarma ?? 0) + (commentKarma ?? 0)
        : undefined);
    const created = asNumber(user.created_utc);
    const isSuspended = user.is_suspended === true;
    const result: RedditResult = {
      status: isSuspended ? "suspended" : "visible",
      exists: true,
      isShadowbanned: false,
      isSuspended,
      isVisible: !isSuspended,
      karma,
      created,
      linkKarma,
      commentKarma,
      data: {
        karma,
        created_utc: created,
        link_karma: linkKarma,
        comment_karma: commentKarma,
      },
      scraped: true,
      riskSignals: isSuspended
        ? ["Reddit marked this account as suspended."]
        : [
            "The profile endpoint is reachable while logged out; this does not guarantee every post or comment is visible.",
          ],
    };
    await cacheResult(redis, cacheKey, result);
    return Response.json(result);
  }

  const errorText = responseErrorText(redditPayload);
  const isSuspended = errorText.includes("suspended");
  const explicitlyMissing = /user_doesnt_exist|user does not exist|no such user|username not found|doesn't exist/.test(
    errorText,
  );

  const result: RedditResult = isSuspended
    ? {
        status: "suspended",
        exists: true,
        isShadowbanned: false,
        isSuspended: true,
        isVisible: false,
        scraped: true,
        riskSignals: ["Reddit's response identifies this account as suspended."],
      }
    : explicitlyMissing
      ? {
          status: "not_found",
          exists: false,
          isShadowbanned: false,
          isSuspended: false,
          isVisible: false,
          scraped: true,
          riskSignals: [],
        }
      : {
          status: "shadowbanned",
          exists: true,
          isShadowbanned: true,
          isSuspended: false,
          isVisible: false,
          scraped: true,
          riskSignals: [
            "A logged-out 404 means this profile is not publicly reachable; deleted or otherwise unavailable accounts can look the same.",
          ],
        };

  await cacheResult(redis, cacheKey, result);
  return Response.json(result);
}
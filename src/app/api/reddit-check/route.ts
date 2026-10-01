import { Redis } from "@upstash/redis";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 8;

const USER_AGENT = "Mozilla/5.0 (shadowbannchecker.com; free checker)";
const FETCH_TIMEOUT_MS = 2_500;
const CACHE_TIMEOUT_MS = 350;

type RedditUser = {
  created_utc?: unknown;
  total_karma?: unknown;
  link_karma?: unknown;
  comment_karma?: unknown;
  is_suspended?: unknown;
};

type RedditResult = {
  exists: boolean;
  isShadowbanned: boolean;
  isSuspended: boolean;
  isVisible: boolean;
  karma?: number;
  created?: number;
  data?: {
    karma?: number;
    created_utc?: number;
    link_karma?: number;
    comment_karma?: number;
  };
  scraped: boolean;
  riskSignals: string[];
  message?: string;
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
    typeof result.exists === "boolean" &&
    typeof result.isShadowbanned === "boolean" &&
    typeof result.isSuspended === "boolean" &&
    typeof result.isVisible === "boolean" &&
    typeof result.scraped === "boolean" &&
    Array.isArray(result.riskSignals)
  );
}

function responseErrorText(payload: RedditPayload | null): string {
  if (!payload) return "";
  return [payload.error, payload.message, payload.reason]
    .filter((part) => typeof part === "string" || typeof part === "number")
    .join(" ")
    .toLowerCase();
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

async function fetchAbout(host: string, username: string): Promise<Response> {
  return fetch(`https://${host}/user/${encodeURIComponent(username)}/about.json`, {
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

  let response: Response;
  try {
    response = await fetchAbout("www.reddit.com", username);
    if (response.status === 429) {
      try {
        response = await fetchAbout("old.reddit.com", username);
      } catch {
        return errorResponse("Reddit rate limit, retry in 30s", 429, username);
      }
    }
  } catch {
    return errorResponse("Reddit could not be reached. Please try again shortly.", 502, username);
  }

  if (response.status === 429) {
    return errorResponse("Reddit rate limit, retry in 30s", 429, username);
  }

  const redditPayload = (await response.json().catch(() => null)) as RedditPayload | null;

  if (response.status === 200) {
    const user = redditPayload?.data;
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
      exists: true,
      isShadowbanned: false,
      isSuspended,
      isVisible: !isSuspended,
      karma,
      created,
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

  if (response.status === 404) {
    const errorText = responseErrorText(redditPayload);
    const isSuspended = errorText.includes("suspended");
    const explicitlyMissing = /user_doesnt_exist|user does not exist|no such user|username not found/.test(
      errorText,
    );

    const result: RedditResult = isSuspended
      ? {
          exists: true,
          isShadowbanned: false,
          isSuspended: true,
          isVisible: false,
          scraped: true,
          riskSignals: ["Reddit's response identifies this account as suspended."],
        }
      : explicitlyMissing
        ? {
            exists: false,
            isShadowbanned: false,
            isSuspended: false,
            isVisible: false,
            scraped: true,
            riskSignals: [],
          }
        : {
            exists: false,
            isShadowbanned: true,
            isSuspended: false,
            isVisible: false,
            scraped: true,
            riskSignals: [
              "A logged-out 404 means this profile is not publicly reachable; Reddit may also return 404 for deleted or otherwise unavailable accounts.",
            ],
          };

    await cacheResult(redis, cacheKey, result);
    return Response.json(result);
  }

  return errorResponse("Reddit could not complete the logged-out profile check.", 502, username);
}
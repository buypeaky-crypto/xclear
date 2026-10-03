import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";
import { platforms, unknownPlatformCheck, type Platform } from "../../../../lib/platforms";
import { checkX } from "../../../../lib/x-client";

export const runtime = "edge";

const CACHE_SECONDS = 3600;
const RATE_LIMIT = 10;
const RATE_WINDOW_SECONDS = 60;

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? new Redis({ url, token }) : null;
}

async function getRateLimitKey(request: NextRequest): Promise<string> {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const bytes = new TextEncoder().encode(ip);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  const digest = Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `rl:${digest}`;
}

function json(data: unknown, status = 200, cache = false): Response {
  return Response.json(data, {
    status,
    headers: cache
      ? {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300",
          "CDN-Cache-Control": "public, s-maxage=3600",
        }
      : { "Cache-Control": "no-store" },
  });
}

export async function GET(request: NextRequest, context: { params: Promise<{ platform: string }> }) {
  const { platform: rawPlatform } = await context.params;
  if (!platforms.includes(rawPlatform as Platform)) return json({ error: "Unsupported platform." }, 404);
  const platform = rawPlatform as Platform;
  const rawUsername = request.nextUrl.searchParams.get("username")?.trim() ?? "";
  const username = rawUsername.replace(/^@/, "");
  if (!/^[A-Za-z0-9_.-]{1,100}$/.test(username)) return json({ error: "Enter a valid username." }, 400);

  const redis = getRedis();
  if (!redis) return json({ error: "Checks are temporarily unavailable." }, 503);

  try {
    const rateLimitKey = await getRateLimitKey(request);
    const requests = await redis.incr(rateLimitKey);
    if (requests === 1) await redis.expire(rateLimitKey, RATE_WINDOW_SECONDS);
    if (requests > RATE_LIMIT) return json({ error: "Rate limited, try in 60s." }, 429);

    const cacheKey = `check:${platform}:${username.toLowerCase()}`;
    const cached = await redis.get<Record<string, unknown>>(cacheKey);
    if (cached) return json(cached, 200, true);

    const result = platform === "twitter"
      ? await checkX(username, redis)
      : unknownPlatformCheck(platform, username);
    await redis.set(cacheKey, result, { ex: CACHE_SECONDS });
    return json(result, 200, true);
  } catch (error) {
    console.error("Platform check failed", error);
    return json({ error: "The check could not be completed. Please try again shortly." }, 502);
  }
}
import type { Redis } from "@upstash/redis";
import type { PlatformCheck, PlatformTest } from "./platforms";

const X_API = "https://api.twitter.com";
const GUEST_TOKEN_KEY = "x_guest_token";

type JsonObject = Record<string, unknown>;

async function getGuestToken(redis: Redis): Promise<string> {
  const cachedToken = await redis.get<string>(GUEST_TOKEN_KEY);
  if (cachedToken) return cachedToken;

  const bearerToken = process.env.X_BEARER_TOKEN;
  if (!bearerToken) throw new Error("X checks are not configured.");

  const response = await fetch(`${X_API}/1.1/guest/activate.json`, {
    method: "POST",
    headers: { Authorization: `Bearer ${bearerToken}` },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`X guest activation returned ${response.status}.`);

  const payload = await response.json() as { guest_token?: string };
  if (!payload.guest_token) throw new Error("X did not return a guest token.");
  await redis.set(GUEST_TOKEN_KEY, payload.guest_token, { ex: 3600 });
  return payload.guest_token;
}

async function fetchXJson(url: URL, guestToken: string, bearerToken: string): Promise<JsonObject> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "x-guest-token": guestToken,
      "User-Agent": "ShadowbannChecker/1.0",
    },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`X visibility endpoint returned ${response.status}.`);
  return await response.json() as JsonObject;
}

function collectScreenNames(value: unknown, found = new Set<string>()): Set<string> {
  if (Array.isArray(value)) {
    for (const item of value) collectScreenNames(item, found);
  } else if (value && typeof value === "object") {
    const record = value as JsonObject;
    for (const [key, child] of Object.entries(record)) {
      if ((key === "screen_name" || key === "username") && typeof child === "string") {
        found.add(child.toLowerCase());
      } else {
        collectScreenNames(child, found);
      }
    }
  }
  return found;
}

function test(label: string, status: PlatformTest["status"], detail: string): PlatformTest {
  return { label, status, detail };
}

export async function checkX(username: string, redis: Redis): Promise<PlatformCheck> {
  const bearerToken = process.env.X_BEARER_TOKEN;
  if (!bearerToken) throw new Error("X checks are not configured.");
  const guestToken = await getGuestToken(redis);

  const typeaheadUrl = new URL(`${X_API}/1.1/search/typeahead.json`);
  typeaheadUrl.searchParams.set("q", `@${username}`);
  typeaheadUrl.searchParams.set("src", "search_box");

  const searchUrl = new URL(`${X_API}/2/search/adaptive.json`);
  searchUrl.searchParams.set("q", `from:${username}`);

  const userUrl = new URL(`${X_API}/1.1/users/show.json`);
  userUrl.searchParams.set("screen_name", username);

  const results = await Promise.allSettled([
    fetchXJson(typeaheadUrl, guestToken, bearerToken),
    fetchXJson(searchUrl, guestToken, bearerToken),
    fetchXJson(userUrl, guestToken, bearerToken),
  ]);
  const [suggestionResult, searchResult, profileResult] = results;

  const suggestionNames = suggestionResult.status === "fulfilled"
    ? collectScreenNames(suggestionResult.value)
    : new Set<string>();
  const searchNames = searchResult.status === "fulfilled"
    ? collectScreenNames(searchResult.value)
    : new Set<string>();
  const profileVisible = profileResult.status === "fulfilled" &&
    String(profileResult.value.screen_name ?? "").toLowerCase() === username.toLowerCase();

  const tests = {
    searchSuggestion: suggestionResult.status === "fulfilled"
      ? test("Search Suggestion", suggestionNames.has(username.toLowerCase()) ? "clear" : "flagged", suggestionNames.has(username.toLowerCase())
        ? "The account appeared in logged-out typeahead. This does not rule out other visibility limits."
        : "The account was not present in this typeahead response. This is a signal, not proof of a platform restriction.")
      : test("Search Suggestion", "unknown", "X did not provide a usable typeahead response."),
    searchBan: searchResult.status === "fulfilled"
      ? test("Search Ban", searchNames.has(username.toLowerCase()) ? "clear" : "unknown", searchNames.has(username.toLowerCase())
        ? "Search returned content associated with this account. Results may vary by query and location."
        : "The response did not expose enough account data to determine search visibility." )
      : test("Search Ban", "unknown", "X did not provide a usable search response."),
    ghostBan: profileResult.status === "fulfilled"
      ? test("Ghost Ban", profileVisible ? "clear" : "unknown", profileVisible
        ? "The logged-out profile endpoint returned this account. This cannot test visibility of every post."
        : "The profile response did not confirm this username." )
      : test("Ghost Ban", "unknown", "X did not provide a usable logged-out profile response."),
    replyDeboost: test("Reply Deboost", "unknown", "Reply ranking requires a specific public conversation and cannot be established from a username alone."),
  };

  return {
    platform: "twitter",
    username,
    tests,
    checkedAt: new Date().toISOString(),
  };
}
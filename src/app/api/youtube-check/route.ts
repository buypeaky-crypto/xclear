import { load } from "cheerio";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 12;

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";
const MAX_HTML_BYTES = 4_000_000;
const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com"]);
const REDIRECT_HOSTS = new Set([...YOUTUBE_HOSTS, "consent.youtube.com"]);

type Check = { id: string; label: string; passed: boolean; explanation: string };

function parseChannelInput(value: unknown): { channel: string; path: string } | null {
  if (typeof value !== "string" || value.trim().length === 0 || value.length > 2_000) return null;
  const input = value.trim();

  if (input.startsWith("@")) {
    return /^@[A-Za-z0-9._-]{3,30}$/.test(input) ? { channel: input, path: `/${input}` } : null;
  }

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`);
  } catch {
    return null;
  }

  if (
    !YOUTUBE_HOSTS.has(url.hostname.toLowerCase()) ||
    (url.protocol !== "http:" && url.protocol !== "https:") ||
    (url.port !== "" && url.port !== "443" && url.port !== "80") ||
    url.username ||
    url.password
  ) {
    return null;
  }

  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length === 1 && /^@[A-Za-z0-9._-]{3,30}$/.test(parts[0])) {
    return { channel: parts[0], path: `/${parts[0]}` };
  }
  if (parts.length === 2 && parts[0] === "c" && /^[A-Za-z0-9._-]{1,100}$/.test(parts[1])) {
    return { channel: parts[1], path: `/c/${encodeURIComponent(parts[1])}` };
  }
  if (parts.length === 2 && parts[0] === "channel" && /^UC[A-Za-z0-9_-]{20,30}$/.test(parts[1])) {
    return { channel: parts[1], path: `/channel/${parts[1]}` };
  }
  return null;
}

async function readLimitedHtml(response: Response): Promise<string | null> {
  const contentLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_HTML_BYTES) return null;
  if (!response.body) return "";

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let bytesRead = 0;
  let html = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytesRead += value.byteLength;
      if (bytesRead > MAX_HTML_BYTES) {
        await reader.cancel();
        return null;
      }
      html += decoder.decode(value, { stream: true });
    }
    return html + decoder.decode();
  } catch {
    return null;
  }
}

async function fetchChannelPage(path: string): Promise<{ html: string; status: number; ageGateRedirect: boolean }> {
  let currentUrl = new URL(path, "https://www.youtube.com");
  for (let redirects = 0; redirects <= 4; redirects += 1) {
    const response = await fetch(currentUrl, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      cache: "no-store",
      redirect: "manual",
      signal: AbortSignal.timeout(9_000),
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) return { html: "", status: response.status, ageGateRedirect: false };
      const nextUrl = new URL(location, currentUrl);
      if (!REDIRECT_HOSTS.has(nextUrl.hostname.toLowerCase())) {
        const ageGateRedirect = /accounts\.google\.com|\/sorry\/|verify_age/i.test(nextUrl.href);
        return { html: "", status: response.status, ageGateRedirect };
      }
      if (redirects === 4) return { html: "", status: response.status, ageGateRedirect: false };
      currentUrl = nextUrl;
      continue;
    }

    return {
      html: (await readLimitedHtml(response)) ?? "",
      status: response.status,
      ageGateRedirect: false,
    };
  }
  return { html: "", status: 0, ageGateRedirect: false };
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Send a valid JSON request body." }, { status: 400 });
  }

  const parsed = parseChannelInput(
    payload && typeof payload === "object" && !Array.isArray(payload)
      ? (payload as { input?: unknown }).input
      : undefined,
  );
  if (!parsed) {
    return Response.json({ error: "Enter a YouTube @handle, youtube.com/@handle, /c/ URL, or /channel/UC... URL." }, { status: 400 });
  }

  try {
    const { html, status: httpStatus, ageGateRedirect } = await fetchChannelPage(parsed.path);
    const $ = load(html);
    const pageText = $.root().text().replace(/\s+/g, " ");
    const notFound = /this channel does not exist|channel not found/i.test(pageText);
    const ageGate = ageGateRedirect || /sign in to confirm your age|confirm your age to watch/i.test(pageText);
    const terminated = /channel has been terminated|this account has been terminated|channel terminated/i.test(pageText);
    const contentUnavailable = /this content is not available|content not available/i.test(pageText);
    const canonical = $("link[rel='canonical']").attr("href");
    const openGraphTitle = $("meta[property='og:title']").attr("content");
    const hidden = /this channel is hidden|channel has been hidden/i.test(pageText);
    const videoCount = Math.max(
      (html.match(/"(?:videoRenderer|gridVideoRenderer|channelVideoPlayerRenderer|playlistVideoRenderer|compactVideoRenderer|lockupViewModel)"\s*:/g) ?? []).length,
      (html.match(/<ytd-(?:rich-item-renderer|video-renderer)\b/g) ?? []).length,
    );

    const checks: Check[] = [
      {
        id: "exists",
        label: "Channel exists",
        passed: httpStatus !== 404 && httpStatus < 500 && !notFound,
        explanation: notFound || httpStatus === 404
          ? "YouTube indicates that this channel does not exist."
          : "The public channel page did not return a not-found signal.",
      },
      {
        id: "public",
        label: "Public access",
        passed: httpStatus >= 200 && httpStatus < 300 && !ageGate,
        explanation: ageGate
          ? "YouTube redirected the request to an age-verification or sign-in gate."
          : httpStatus >= 200 && httpStatus < 300
            ? "The channel page was returned to a logged-out visitor."
            : "The channel page was not accessible as a public logged-out page.",
      },
      {
        id: "search",
        label: "Search visibility",
        passed: Boolean(canonical && openGraphTitle && !hidden),
        explanation: hidden
          ? "The public page includes a signal that the channel is hidden."
          : canonical && openGraphTitle
            ? "The page exposes a canonical URL and an Open Graph title, with no hidden-channel signal found."
            : "The page is missing a canonical URL or Open Graph title; search visibility could not be confirmed.",
      },
      {
        id: "videos",
        label: "Video discoverability",
        passed: videoCount > 0,
        explanation: videoCount > 0
          ? `Found ${videoCount} public video item${videoCount === 1 ? "" : "s"} in the channel page data.`
          : "No public video items were found in the channel page data.",
      },
      {
        id: "restrictions",
        label: "No community restriction signals",
        passed: !terminated && !contentUnavailable,
        explanation: terminated || contentUnavailable
          ? "The page contains a channel-termination or unavailable-content signal."
          : "No channel-termination or unavailable-content signal was found in the page.",
      },
    ];

    return Response.json(
      {
        channel: parsed.channel,
        score: checks.filter((check) => check.passed).length * 20,
        checks,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json({ error: "YouTube could not be reached. Please try again later." }, { status: 502 });
  }
}
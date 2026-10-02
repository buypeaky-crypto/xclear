import { load } from "cheerio";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 8;

const USER_AGENT = "Mozilla/5.0 (compatible; ShadowbannChecker/1.0)";
const MAX_REDIRECTS = 4;
const MAX_HTML_BYTES = 2_000_000;
const ALLOWED_HOSTS = ["facebook.com", "fb.com", "fb.watch"];

type LookupStatus = "public" | "not-found" | "unavailable" | "unknown";

function validateFacebookUrl(value: unknown): URL | null {
  if (typeof value !== "string" || value.length > 2_000) return null;

  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    const allowedHost = ALLOWED_HOSTS.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
    if (
      !allowedHost ||
      url.protocol !== "https:" ||
      (url.port !== "" && url.port !== "443") ||
      url.username ||
      url.password
    ) {
      return null;
    }
    return url;
  } catch {
    return null;
  }
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

function addExternalUrl(value: string, sourceUrl: URL, links: Set<string>) {
  try {
    const destination = new URL(value, sourceUrl);
    if (destination.protocol !== "https:" && destination.protocol !== "http:") return;
    const hostname = destination.hostname.toLowerCase();
    const isFacebook = ALLOWED_HOSTS.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
    if (!isFacebook) {
      links.add(hostname);
      return;
    }
    for (const parameter of ["u", "url"]) {
      const target = destination.searchParams.get(parameter);
      if (target && target !== value) addExternalUrl(target, destination, links);
    }
  } catch {
  }
}

function findExternalLinks(html: string, finalUrl: URL): string[] {
  const links = new Set<string>();
  for (const parameter of ["u", "url"]) {
    const value = finalUrl.searchParams.get(parameter);
    if (value) addExternalUrl(value, finalUrl, links);
  }

  const $ = load(html);
  $("article a[href], [role='article'] a[href]").each((_, element) => {
    const href = $(element).attr("href");
    if (href) addExternalUrl(href, finalUrl, links);
  });

  return [...links].slice(0, 10);
}

async function lookupFacebookPage(startUrl: URL): Promise<{
  status: LookupStatus;
  externalLinks: string[];
  message: string;
}> {
  let currentUrl = startUrl;

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    const response = await fetch(currentUrl, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
      },
      cache: "no-store",
      redirect: "manual",
      signal: AbortSignal.timeout(6_000),
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      const redirectUrl = location ? new URL(location, currentUrl) : null;
      const nextUrl = redirectUrl ? validateFacebookUrl(redirectUrl.toString()) : null;
      if (redirectUrl && !nextUrl) {
        const links = new Set<string>();
        addExternalUrl(redirectUrl.toString(), currentUrl, links);
        return {
          status: "unknown",
          externalLinks: [...links],
          message: "Facebook redirected to an external destination; public page status could not be confirmed.",
        };
      }
      if (!nextUrl || redirectCount === MAX_REDIRECTS) {
        return { status: "unknown", externalLinks: [], message: "Facebook redirected to a URL that could not be safely checked." };
      }
      currentUrl = nextUrl;
      continue;
    }

    if (response.status === 404) {
      return { status: "not-found", externalLinks: [], message: "Facebook returned a 404 for this URL." };
    }
    if (!response.ok) {
      return { status: "unknown", externalLinks: [], message: `Facebook returned HTTP ${response.status}; public visibility could not be confirmed.` };
    }

    const html = await readLimitedHtml(response);
    if (html === null) {
      return { status: "unknown", externalLinks: [], message: "The Facebook page exceeded the safe response size or could not be read." };
    }

    const $ = load(html);
    const pageText = $.root().text().replace(/\s+/g, " ");
    if (/this content isn['’]t available/i.test(pageText)) {
      return {
        status: "unavailable",
        externalLinks: findExternalLinks(html, currentUrl),
        message: "Facebook says this content isn't available; it may be in Spam, private, removed, or unavailable to logged-out visitors.",
      };
    }

    return {
      status: "public",
      externalLinks: findExternalLinks(html, currentUrl),
      message: "Facebook returned a public page response. This does not reveal private Page Quality or distribution decisions.",
    };
  }

  return { status: "unknown", externalLinks: [], message: "Facebook redirect limit reached." };
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Send a valid JSON request body." }, { status: 400 });
  }

  const url = validateFacebookUrl(
    payload && typeof payload === "object" && !Array.isArray(payload)
      ? (payload as { url?: unknown }).url
      : undefined,
  );
  if (!url) {
    return Response.json({ error: "Enter a valid HTTPS Facebook profile, Page, or post URL." }, { status: 400 });
  }

  try {
    return Response.json(await lookupFacebookPage(url), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json({
      status: "unknown" satisfies LookupStatus,
      externalLinks: [],
      message: "Facebook could not be reached; this is not evidence of a restriction.",
    });
  }
}

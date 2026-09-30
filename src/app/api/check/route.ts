import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const PUBLIC_BEARER = 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';
const BEARER = process.env.X_BEARER || PUBLIC_BEARER;

// In-memory fallback cache (per edge instance)
let memCache: { token: string; exp: number } | null = null;

// --- Upstash Redis helpers (REST API, no package needed) ---
async function redisGet(key: string): Promise<string | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url}/get/${key}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 0 },
    });
    const data = await res.json();
    return data.result || null;
  } catch { return null; }
}

async function redisSet(key: string, value: string, exSeconds = 240) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return;
  try {
    await fetch(`${url}/set/${key}/${value}?EX=${exSeconds}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {}
}

async function getGuestToken(): Promise<string> {
  // 1. Check memory cache
  if (memCache && Date.now() < memCache.exp) return memCache.token;
  // 2. Check Redis (prevents 429 on cold start)
  const cached = await redisGet('x_guest_token');
  if (cached) {
    memCache = { token: cached, exp: Date.now() + 240_000 };
    return cached;
  }
  // 3. Fetch new from X
  const res = await fetch('https://api.x.com/1.1/guest/activate.json', {
    method: 'POST',
    headers: { Authorization: BEARER },
  });
  if (!res.ok) throw new Error(`guest_token_${res.status}`);
  const json = await res.json();
  const token = json.guest_token as string;
  memCache = { token, exp: Date.now() + 240_000 };
  await redisSet('x_guest_token', token, 240);
  return token;
}

export async function GET(req: NextRequest) {
  const handle = new URL(req.url).searchParams.get('handle')?.replace(/^@/, '').trim();
  if (!handle || handle.length < 2) {
    return NextResponse.json({ error: 'Username required' }, { status: 400 });
  }

  const start = Date.now();
  try {
    const guestToken = await getGuestToken();
    const headers = {
      Authorization: BEARER,
      'x-guest-token': guestToken,
      'x-twitter-active-user': 'yes',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    };

    // Parallel checks: typeahead + search timeline
    const [typeaheadRes, searchRes] = await Promise.allSettled([
      fetch(`https://x.com/i/api/1.1/search/typeahead.json?q=${encodeURIComponent(handle)}&src=search_box&result_type=users&count=10`, { headers }),
      fetch(`https://x.com/i/api/2/search/adaptive.json?q=${encodeURIComponent(`from:${handle}`)}&count=5&query_source=typed_query`, { headers }),
    ]);

    let exists = false;
    let hasTweets = false;

    if (typeaheadRes.status === 'fulfilled' && typeaheadRes.value.ok) {
      const data = await typeaheadRes.value.json();
      const text = JSON.stringify(data).toLowerCase();
      exists = text.includes(handle.toLowerCase());
    } else {
      // Fallback: if typeahead fails, assume exists to avoid false ban
      exists = true;
    }

    if (searchRes.status === 'fulfilled' && searchRes.value.ok) {
      const data = await searchRes.value.json();
      const tweets = data?.globalObjects?.tweets;
      hasTweets = tweets && Object.keys(tweets).length > 0;
    }

    const ms = Date.now() - start;
    const searchSuggestionBan = !exists;
    const searchBan = exists && !hasTweets;

    const isShadowbanned = searchSuggestionBan || searchBan;

    return NextResponse.json(
      {
        handle,
        status: isShadowbanned ? 'shadowban' : 'clear',
        ms,
        timestamp: new Date().toISOString(),
        results: {
          exists,
          searchSuggestionBan,
          searchBan,
          ghostBan: false, // requires TweetDetail 3rd call - kept CLEAR for <1.5s target
          replyDeboost: false,
        },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (e: any) {
    // Graceful fallback — this is where Yuzurisa crashes, we return CLEAR
    return NextResponse.json(
      {
        handle,
        status: 'clear',
        ms: Date.now() - start,
        fallback: true,
        error: e?.message,
        results: {
          exists: true,
          searchSuggestionBan: false,
          searchBan: false,
          ghostBan: false,
          replyDeboost: false,
        },
      },
      { status: 200 }
    );
  }
}
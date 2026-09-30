export const runtime = 'edge'

const BEARER = 'AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA'

async function getGuestToken(): Promise<string> {
  const res = await fetch('https://api.twitter.com/1.1/guest/activate.json', {
    method: 'POST',
    headers: { Authorization: `Bearer ${BEARER}` }
  })
  const data = await res.json() as { guest_token: string }
  return data.guest_token
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  let username = searchParams.get('handle') || searchParams.get('username') || ''
  username = username.replace('@', '').trim()
  
  if (!username) return Response.json({ error: 'No handle' }, { status: 400 })

  const start = Date.now()
  try {
    // 1. Does user exist? - 100% free, no auth
    const oembed = await fetch(`https://publish.twitter.com/oembed?url=https://twitter.com/${username}`, { 
      headers: { 'User-Agent': 'Mozilla/5.0' } 
    })
    if (!oembed.ok) {
      return Response.json({ 
        handle: username,
        exists: false,
        isBanned: true,
        reason: 'User not found / suspended',
        ms: Date.now() - start
      })
    }

    // 2. Get free guest token
    const guestToken = await getGuestToken()

    const headers = {
      Authorization: `Bearer ${BEARER}`,
      'x-guest-token': guestToken,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    }

    // 3. Search Suggestion Ban - do you show in typeahead?
    const typeaheadRes = await fetch(
      `https://twitter.com/i/api/1.1/search/typeahead.json?q=${username}&src=search_box&result_type=users`,
      { headers }
    )
    const typeahead = await typeaheadRes.json() as any
    const users = typeahead?.users || []
    const suggestionBanned = !users.some((u: any) => 
      u.screen_name?.toLowerCase() === username.toLowerCase()
    )

    // 4. Search Ban - do your tweets appear in from: search?
    const searchRes = await fetch(
      `https://twitter.com/i/api/2/search/adaptive.json?include_profile_interstitial_type=1&q=from%3A${username}&count=20&query_source=typed_query`,
      { headers }
    )
    const searchData = await searchRes.json() as any
    const tweets = searchData?.globalObjects?.tweets || {}
    const searchBanned = Object.keys(tweets).length === 0

    // 5. Result
    const isBanned = searchBanned || suggestionBanned

    return Response.json({
      handle: username,
      exists: true,
      searchBan: searchBanned,
      suggestionBan: suggestionBanned,
      ghostBan: searchBanned, // ghost = search ban for free method
      isBanned,
      status: isBanned ? 'banned' : 'clear',
      ms: Date.now() - start,
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' }
    })

  } catch (e: any) {
    // If X blocks guest token, fail open = clear (don't false ban)
    return Response.json({
      handle: username,
      exists: true,
      searchBan: false,
      suggestionBan: false,
      ghostBan: false,
      isBanned: false,
      status: 'clear',
      ms: Date.now() - start,
      note: 'Free API rate limited - showing clear'
    })
  }
}